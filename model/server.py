"""
TariffIQ — FastAPI Backend Server
==================================
Exposes AI model endpoints for the Next.js frontend.
Loads heavy models (FAISS, SentenceTransformer) once at startup.
"""

import os
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

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
    product_description: str = Field(..., min_length=3)
    destination: str = Field(..., examples=["USA", "India"])


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
    try:
        reranked = rerank_with_llm(req.product_description, candidates)
    except Exception as e:
        print(f"LLM reranking failed: {e}")

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
    from shipping_landed_cost import calculate_landed_cost_live

    hs_code = req.hs_code
    classification = None

    # Auto-classify if no HS code provided
    if not hs_code:
        if faiss_index is None or codes_df is None or sentence_model is None:
            raise HTTPException(status_code=503, detail="Models not loaded yet.")

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

    return {
        "hs_code": hs_code,
        "classification": classification,
        "landed_cost": result,
    }


@app.post("/api/compliance")
def compliance_check(req: ComplianceRequest):
    """
    Run the AI compliance agent to fetch real-time rules,
    certifications, and guidelines for importing a product.
    """
    from compliance_agent import run_compliance_check

    try:
        result = run_compliance_check(req.destination, req.product_description)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Compliance check failed: {e}")

    if not result:
        raise HTTPException(status_code=500, detail="Failed to generate compliance report.")

    return result


# ══════════════════════════════════════════════════════════════════
#  Run with: uvicorn server:app --reload --port 8000
# ══════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
