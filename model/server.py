"""
TariffIQ — FastAPI Backend Server
==================================
Exposes AI model endpoints for the Next.js frontend.
Loads heavy models (FAISS, SentenceTransformer) once at startup.
"""

import os
import sys
from contextlib import asynccontextmanager

# Fix for "RuntimeError: Already borrowed" in some environments (especially Mac/uvicorn)
os.environ["TOKENIZERS_PARALLELISM"] = "false"

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import threading

# Global lock for thread-safe model access
model_lock = threading.Lock()

# ── Ensure model/ is importable ──────────────────────────────────
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
if MODEL_DIR not in sys.path:
    sys.path.insert(0, MODEL_DIR)

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(MODEL_DIR), ".env"))

# ── Lazy-loaded globals ──────────────────────────────────────────
faiss_index = None
codes_df = None
sentence_model = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load heavy models once at server startup."""
    global faiss_index, codes_df, sentence_model

    from HS_code_search import load_index, MODEL_NAME
    from sentence_transformers import SentenceTransformer

    print("⏳ Loading FAISS index and SentenceTransformer model...")
    faiss_index, codes_df = load_index()
    sentence_model = SentenceTransformer(MODEL_NAME)
    print("✅ Models loaded. Server ready.")

    yield  # app runs here

    print("Server shutting down.")


app = FastAPI(
    title="TariffIQ API",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ══════════════════════════════════════════════════════════════════
#  Request / Response Models
# ══════════════════════════════════════════════════════════════════

class ClassifyRequest(BaseModel):
    product_description: str = Field(..., min_length=3, examples=["Cotton T-shirts, knitted, 100% cotton"])


class LandedCostRequest(BaseModel):
    product_description: str = Field(..., min_length=3)
    origin: str = Field(..., examples=["China"])
    destination: str = Field(..., examples=["USA"])
    mode: str = Field("sea", examples=["sea", "air", "rail"])
    weight_kg: float = Field(100.0, gt=0)
    product_value: float = Field(10000.0, gt=0)
    hs_code: str | None = Field(None, description="Optional — if empty, auto-classifies first")


class ComplianceRequest(BaseModel):
    destination: str
    product_description: str

class VendorRequest(BaseModel):
    product: str
    country: str


# ══════════════════════════════════════════════════════════════════
#  Endpoints
# ══════════════════════════════════════════════════════════════════

@app.get("/api/health")
def health():
    return {"status": "ok", "models_loaded": faiss_index is not None}


@app.post("/api/classify")
def classify(req: ClassifyRequest):
    """
    Step 1: FAISS semantic search over HS codes.
    Step 2: LLM reranking for the best match + analysis.
    """
    from HS_code_search import search, rerank_with_llm

    if faiss_index is None or codes_df is None or sentence_model is None:
        raise HTTPException(status_code=503, detail="Models not loaded yet. Try again shortly.")

    # FAISS search
    with model_lock:
        candidates = search(
            query=req.product_description,
            index=faiss_index,
            codes_df=codes_df,
            model=sentence_model,
            top_k=6,
        )

    if not candidates:
        raise HTTPException(status_code=404, detail="No HS code candidates found.")

    # LLM reranking
    reranked = None
    explanations = {}
    candidate_scores = {}
    try:
        reranked = rerank_with_llm(req.product_description, candidates)
        if reranked:
            explanations = reranked.get("candidate_explanations", {})
            candidate_scores = reranked.get("candidate_scores", {})
    except Exception as e:
        print(f"LLM reranking failed: {e}")

    # Attach explanation and dynamic score to each candidate
    for cand in candidates:
        code = cand.get("hs_code")
        cand["reasoning"] = explanations.get(code, "Alternative classification based on standard interpretation.")
        cand["ai_score"] = candidate_scores.get(code, 0.0)

    return {
        "candidates": candidates,
        "reranked": reranked,
    }


@app.post("/api/landed-cost")
def landed_cost(req: LandedCostRequest):
    """
    Calculate total landed cost for a trade route.
    If hs_code is not provided, auto-classifies first.
    """
    from HS_code_search import search, rerank_with_llm
    from shipping_landed_cost import calculate_landed_cost_live, compare_origins_live

    hs_code = req.hs_code
    classification = None

    # Auto-classify if no HS code provided
    if not hs_code:
        if faiss_index is None or codes_df is None or sentence_model is None:
            raise HTTPException(status_code=503, detail="Models not loaded yet.")

        with model_lock:
            candidates = search(
                query=req.product_description,
                index=faiss_index,
                codes_df=codes_df,
                model=sentence_model,
                top_k=6,
            )

        if candidates:
            reranked = None
            try:
                reranked = rerank_with_llm(req.product_description, candidates)
            except Exception:
                pass

            if reranked and reranked.get("primary_hs"):
                hs_code = str(reranked["primary_hs"])
                classification = reranked
            else:
                # Fallback to top FAISS candidate
                hs_code = str(candidates[0]["hs_code"])

    if not hs_code:
        raise HTTPException(status_code=400, detail="Could not determine HS code.")

    # Calculate landed cost
    try:
        result = calculate_landed_cost_live(
            origin=req.origin,
            destination=req.destination,
            mode=req.mode,
            weight_kg=req.weight_kg,
            product_value=req.product_value,
            hs_code=hs_code,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Landed cost calculation failed: {e}")

    if result is None:
        raise HTTPException(
            status_code=404,
            detail=f"No tariff data found for HS {hs_code} on route {req.origin} → {req.destination}."
        )

    # Calculate scenarios automatically for route optimization
    scenarios = []
    try:
        scenarios = compare_origins_live(
            hs_code=hs_code,
            my_country=req.destination,
            mode=req.mode,
            weight_kg=req.weight_kg,
            product_value=req.product_value,
        )
        
        # Add alternative mode for current route
        alt_mode = "air" if req.mode.lower() == "sea" else "sea"
        alt_mode_result = calculate_landed_cost_live(
            origin=req.origin,
            destination=req.destination,
            mode=alt_mode,
            weight_kg=req.weight_kg,
            product_value=req.product_value,
            hs_code=hs_code,
        )
        
        combined_scenarios = [result]
        if alt_mode_result:
            combined_scenarios.append(alt_mode_result)
            
        # Add top 4 alternative scenarios
        added_count = 0
        for s in scenarios:
            s_origin = s["route"].split(" → ")[0].lower().strip()
            if s_origin != req.origin.lower().strip():
                combined_scenarios.append(s)
                added_count += 1
                if added_count >= 4:
                    break

    except Exception as e:
        print(f"Scenario generation failed: {e}")
        combined_scenarios = [result]

    return {
        "hs_code": hs_code,
        "classification": classification,
        "landed_cost": result,
        "scenarios": combined_scenarios,
    }


@app.post("/api/compliance")
def compliance_check(req: ComplianceRequest):
    """
    Run the AI compliance agent.
    """
    from compliance_agent import run_compliance_check
    
    try:
        result = run_compliance_check(req.destination, req.product_description)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Compliance check failed: {e}")

    if not result:
        raise HTTPException(status_code=500, detail="Failed to generate compliance report.")

    return result

@app.post("/api/vendors")
def find_vendors(req: VendorRequest):
    """
    Run the AI vendor discovery pipeline.
    """
    from vendor_finder import run_pipeline
    vendors = run_pipeline(req.product, req.country)
    return {"vendors": vendors}


@app.get("/api/news")
def get_news():
    """
    Fetch live tariff news and analyze them using the Policy Shock Engine.
    """
    from policy_shock_engine import run_policy_shock_from_live_news
    try:
        results = run_policy_shock_from_live_news(max_articles=3)
        return {"news": results}
    except Exception as e:
        print(f"Error fetching news: {e}")
        # Return empty list so frontend can fallback to static samples
        return {"news": []}

@app.post("/api/parse-document")
async def parse_document(file: UploadFile = File(...)):
    """
    Extract text from a PDF invoice/spec sheet and use MegaLLM to parse
    the fields needed for the Trade Input form.
    """
    import PyPDF2
    from openai import OpenAI
    
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        # Extract text from PDF
        pdf_reader = PyPDF2.PdfReader(file.file)
        extracted_text = ""
        for page in pdf_reader.pages:
            extracted_text += page.extract_text() + "\n"
            
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="No readable text found in PDF.")
            
        # Send to MegaLLM for structured extraction
        MEGALLM_API_KEY = os.getenv("MEGALLM_API_KEY")
        if not MEGALLM_API_KEY:
            raise HTTPException(status_code=500, detail="LLM API key not configured.")
            
        client = OpenAI(base_url="https://ai.megallm.io/v1", api_key=MEGALLM_API_KEY)
        
        prompt = f"""
        Extract trade and product information from the following document text.
        Return ONLY a JSON object with these exact keys. If a value is not found, leave it as an empty string "".
        
        Keys to extract:
        - name: The specific product name or title
        - category: One of ["Electronics & IT", "Apparel & Textiles", "Machinery", "Chemicals", "Food & Beverage", "Automotive Parts", "Medical Devices", "Furniture", "Toys & Games", "Other"]
        - customCategory: If category is "Other", provide a short 2-3 word category name.
        - description: A detailed 1-2 sentence description of the product.
        - material: What it is made of (e.g., 100% Cotton, Aluminum)
        - intendedUse: What it is used for
        - value: Total invoice or product value (numbers only, e.g., "5000")
        - currency: Guess the currency code (e.g. "USD", "EUR")
        - qty: Number of units (numbers only, e.g. "100")
        - weight: Total weight in kg (numbers only, e.g. "50.5")
        - dimensions: L x W x H in cm if available
        - origin: Country name where it's shipping from
        - dest: Country name where it's shipping to
        
        DOCUMENT TEXT:
        \"\"\"{extracted_text[:4000]}\"\"\"
        """
        
        response = client.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": "system", "content": "You are a data extraction assistant. Output strictly valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0
        )
        
        import json
        import re
        content = response.choices[0].message.content.strip()
        content = re.sub(r"^```(?:json)?\s*", "", content)
        content = re.sub(r"\s*```$", "", content)
        
        parsed = json.loads(content)
        return {"extracted_data": parsed}
        
    except Exception as e:
        print(f"Error parsing document: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to parse document: {str(e)}")


# ══════════════════════════════════════════════════════════════════
#  Run with: uvicorn server:app --reload --port 8000
# ══════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
