"""
TariffAI — Policy Shock Simulator
===================================
Feed it a news article or headline → Gemini 2.5 Flash extracts
tariff policy details and provides strategic trade analysis.

Optionally provide your own HS codes to get a personalized
before/after landed-cost impact simulation.
"""

import os
import json
import re

from dotenv import load_dotenv
from google import genai

from tarrif_lookup_engine import load_tariffs, get_tariff_rate
from shipping_landed_cost import calculate_landed_cost

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
gemini_client = genai.Client(api_key=GEMINI_API_KEY)


# ═══════════════════════════════════════════════════════════════════
#  Step 1: Parse News → Extract Tariff Details via Gemini
# ═══════════════════════════════════════════════════════════════════

def analyze_news(news_text: str) -> dict | None:
    """
    Send raw news text to Gemini 2.5 Flash.
    Returns structured extraction of tariff policy changes
    plus a strategic trade analysis.
    """
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not found. Check your .env file.")

    prompt = f"""
You are a senior international trade policy analyst.

Read the following news and extract all tariff-related policy changes.
Then provide a strategic analysis of the trade impact.

NEWS:
\"\"\"{news_text}\"\"\"

Return VALID JSON only in this exact format:
{{
  "extracted_policy": {{
    "headline": "",
    "affected_countries": ["country1", "country2"],
    "tariff_direction": "increase | decrease | mixed",
    "estimated_tariff_delta_percent": 0.0,
    "affected_sectors": ["sector1", "sector2"],
    "likely_affected_hs_chapters": ["chapter_number - description"],
    "effective_date": "date or 'unspecified'",
    "policy_type": "MFN | retaliatory | preferential | safeguard | other"
  }},
  "strategic_analysis": {{
    "risk_level": "low | medium | high | critical",
    "risk_score": 0.0,
    "impact_summary": "",
    "winners": "",
    "losers": "",
    "recommended_actions": ["", ""],
    "alternative_sourcing_countries": [""],
    "timing_advice": "",
    "confidence_in_interpretation": 0.0
  }}
}}

Rules:
- risk_score is 0-10 (0 = no risk, 10 = extreme)
- confidence_in_interpretation is 0-1
- estimated_tariff_delta_percent should be positive for increases, negative for decreases
- Be specific — reference actual countries, sectors, and numbers from the news
- If the news is vague, say so and reduce confidence
- likely_affected_hs_chapters should list 2-digit HS chapter numbers with short descriptions
"""

    try:
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={"temperature": 0},
        )
        content = response.text.strip()
        content = re.sub(r"^```(?:json)?\s*", "", content)
        content = re.sub(r"\s*```$", "", content)
    except Exception as e:
        print(f"Gemini request failed: {e}")
        return None

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        print("Invalid JSON from Gemini:")
        print(content)
        return None

    return parsed


# ═══════════════════════════════════════════════════════════════════
#  Step 2: Optional — Run Numerical Simulation on Your HS Codes
# ═══════════════════════════════════════════════════════════════════

def run_personal_impact(
    hs_codes: list[str],
    tariff_delta_percent: float,
    origin: str,
    destination: str,
    mode: str,
    weight_kg: float,
    product_value: float,
    importing_country: str,
    year: int = 2025,
    tariffs_df=None,
) -> dict:
    """
    For each user-provided HS code, compute the before/after
    landed cost under the extracted tariff delta.

    Returns per-HS results + portfolio aggregation.
    """
    if tariffs_df is None:
        tariffs_df = load_tariffs()

    results = []
    skipped = []

    for hs in hs_codes:
        baseline_tariff = get_tariff_rate(hs, importing_country, year, tariffs_df)
        if baseline_tariff is None:
            skipped.append(hs)
            continue

        # Baseline
        baseline = calculate_landed_cost(
            origin, destination, mode, weight_kg, product_value, baseline_tariff
        )

        # Post-shock (clamp to 0)
        new_tariff = round(max(0, baseline_tariff + tariff_delta_percent), 2)
        post = calculate_landed_cost(
            origin, destination, mode, weight_kg, product_value, new_tariff
        )

        impact = round(post["total_landed_cost"] - baseline["total_landed_cost"], 2)
        pct = round((impact / baseline["total_landed_cost"]) * 100, 2) if baseline["total_landed_cost"] else 0.0

        results.append({
            "hs_code": hs,
            "baseline_tariff": baseline_tariff,
            "new_tariff": new_tariff,
            "baseline_total": baseline["total_landed_cost"],
            "new_total": post["total_landed_cost"],
            "absolute_impact": impact,
            "percent_impact": pct,
        })

    # Portfolio aggregation
    total_base = sum(r["baseline_total"] for r in results)
    total_new = sum(r["new_total"] for r in results)
    total_impact = round(total_new - total_base, 2)
    pct_change = round((total_impact / total_base) * 100, 2) if total_base else 0.0

    return {
        "per_hs": results,
        "portfolio": {
            "total_baseline_cost": total_base,
            "total_new_cost": total_new,
            "total_impact": total_impact,
            "portfolio_percent_change": pct_change,
        },
        "skipped": skipped,
    }


# ═══════════════════════════════════════════════════════════════════
#  Full Pipeline: News → Analysis → Optional Personal Impact
# ═══════════════════════════════════════════════════════════════════

def run_policy_shock(
    news_text: str,
    hs_codes: list[str] | None = None,
    origin: str | None = None,
    destination: str | None = None,
    mode: str = "sea",
    weight_kg: float = 100,
    product_value: float = 10000,
    importing_country: str | None = None,
    year: int = 2025,
) -> dict:
    """
    Main entry point.

    1. Analyze news with Gemini → extract tariff details + strategic analysis
    2. If HS codes provided → run before/after simulation

    Returns combined result dict.
    """
    # Step 1: Gemini analysis
    analysis = analyze_news(news_text)

    output = {
        "news": news_text,
        "analysis": analysis,
        "personal_impact": None,
    }

    # Step 2: Optional personal impact
    if analysis and hs_codes:
        delta = analysis.get("extracted_policy", {}).get("estimated_tariff_delta_percent", 0)

        if origin and destination and importing_country:
            impact = run_personal_impact(
                hs_codes, delta, origin, destination, mode,
                weight_kg, product_value, importing_country, year,
            )
            output["personal_impact"] = impact

    return output


# ═══════════════════════════════════════════════════════════════════
#  Demo Run
# ═══════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    # ── Just the news — change this to test ─────────────────────────
    NEWS = """
    The United States has announced a 25% tariff on all steel and aluminum 
    imports effective March 12, 2025. The tariffs apply globally with no 
    country exemptions, reversing previous exclusions for allies including 
    the EU, UK, and Canada. Industry analysts expect retaliatory measures 
    from the European Union and China within weeks.
    """

    # Optional: your HS codes for personalized impact
    MY_HS_CODES      = ["720890", "760120"]   # steel + aluminum, set to [] to skip
    ORIGIN           = "china"
    DESTINATION      = "usa"
    MODE             = "sea"
    WEIGHT_KG        = 1000
    PRODUCT_VALUE    = 50000
    IMPORTING_COUNTRY = "United States of America"
    YEAR             = 2025
    # ────────────────────────────────────────────────────────────────

    print("=" * 60)
    print("  TariffAI — Policy Shock Simulator")
    print("=" * 60)
    print(f"\n📰 News:\n{NEWS.strip()}")

    # Run
    result = run_policy_shock(
        news_text=NEWS,
        hs_codes=MY_HS_CODES if MY_HS_CODES else None,
        origin=ORIGIN,
        destination=DESTINATION,
        mode=MODE,
        weight_kg=WEIGHT_KG,
        product_value=PRODUCT_VALUE,
        importing_country=IMPORTING_COUNTRY,
        year=YEAR,
    )

    # ── Print Analysis ──────────────────────────────────────────────
    analysis = result.get("analysis")
    if analysis:
        policy = analysis.get("extracted_policy", {})
        strat = analysis.get("strategic_analysis", {})

        print(f"\n{'━' * 60}")
        print("  � EXTRACTED POLICY DETAILS")
        print(f"{'━' * 60}")
        print(f"  Headline      : {policy.get('headline', 'N/A')}")
        print(f"  Countries     : {', '.join(policy.get('affected_countries', []))}")
        print(f"  Direction     : {policy.get('tariff_direction', 'N/A')}")
        print(f"  Δ Tariff      : {policy.get('estimated_tariff_delta_percent', 'N/A')}%")
        print(f"  Sectors       : {', '.join(policy.get('affected_sectors', []))}")
        print(f"  Policy type   : {policy.get('policy_type', 'N/A')}")
        print(f"  Effective     : {policy.get('effective_date', 'N/A')}")

        chapters = policy.get("likely_affected_hs_chapters", [])
        if chapters:
            print(f"  HS chapters   :")
            for ch in chapters:
                print(f"    • {ch}")

        print(f"\n{'━' * 60}")
        print("  🤖 STRATEGIC ANALYSIS")
        print(f"{'━' * 60}")
        print(f"  Risk level    : {strat.get('risk_level', 'N/A').upper()}")
        print(f"  Risk score    : {strat.get('risk_score', 'N/A')} / 10")
        print(f"  Confidence    : {strat.get('confidence_in_interpretation', 'N/A')}")
        print(f"\n  Impact: {strat.get('impact_summary', 'N/A')}")
        print(f"  Winners: {strat.get('winners', 'N/A')}")
        print(f"  Losers:  {strat.get('losers', 'N/A')}")

        actions = strat.get("recommended_actions", [])
        if actions:
            print(f"\n  Actions:")
            for i, a in enumerate(actions, 1):
                print(f"    {i}. {a}")

        alts = strat.get("alternative_sourcing_countries", [])
        if alts:
            print(f"  Alt sources   : {', '.join(alts)}")
        print(f"  Timing        : {strat.get('timing_advice', 'N/A')}")
    else:
        print("\n  ❌ Gemini analysis unavailable.")

    # ── Print Personal Impact (if HS codes were provided) ──────────
    impact = result.get("personal_impact")
    if impact:
        print(f"\n{'━' * 60}")
        print("  📦 YOUR PORTFOLIO IMPACT")
        print(f"{'━' * 60}")

        for r in impact["per_hs"]:
            icon = "🟢" if r["absolute_impact"] < 0 else "🔴"
            print(f"\n  HS {r['hs_code']}:")
            print(f"    Tariff: {r['baseline_tariff']}% → {r['new_tariff']}%")
            print(f"    Landed: ${r['baseline_total']:,.2f} → ${r['new_total']:,.2f}")
            print(f"    Impact: {icon} ${r['absolute_impact']:,.2f} ({r['percent_impact']}%)")

        if impact["skipped"]:
            print(f"\n  ⚠️  Skipped (no data): {', '.join(impact['skipped'])}")

        p = impact["portfolio"]
        print(f"\n  ── Portfolio ──")
        print(f"    Baseline : ${p['total_baseline_cost']:,.2f}")
        print(f"    New      : ${p['total_new_cost']:,.2f}")
        print(f"    Impact   : ${p['total_impact']:,.2f} ({p['portfolio_percent_change']}%)")

    print(f"\n{'━' * 60}")
