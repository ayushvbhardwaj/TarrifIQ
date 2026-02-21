import sys
import logging
logging.disable(sys.maxsize)

from HS_code_search import load_index, search, rerank_with_llm, MODEL_NAME
from sentence_transformers import SentenceTransformer
from shipping_landed_cost import compare_origins_live

# Parameters
query = 'Semiconductor manufacturing equipment for front-end fabrication'
my_country = 'india'
mode = 'air'
weight_kg = 200
product_value = 50000

print(f"\n🔍 Query: '{query}'")
print(f"📦 Simulating Import Into: {my_country.upper()}")
print(f"⚖️ Weight: {weight_kg}kg | 💰 Value: ${product_value:,}")
print("\n[1/2] Loading semantic search model and finding HS code...")

model = SentenceTransformer(MODEL_NAME)
index, codes_df = load_index()

# 1. Search & Rerank
results = search(query, index, codes_df, model, top_k=5)
reranked = rerank_with_llm(query, results)

if reranked and 'primary_hs' in reranked:
    hs_code = str(reranked['primary_hs'])
    print(f"✅ Predicted HS Code: {hs_code} (Confidence: {reranked.get('confidence', 0):.2f})")
    print(f"   Reasoning: {reranked.get('analysis', {}).get('final_justification', '')}")
else:
    hs_code = str(results[0]['hs_code'])
    print(f"⚠️ LLM failed. Using top semantic match: {hs_code}")

print(f"\n[2/2] Calculating lowest landed cost from all suppliers...\n")

# 2. Get landed costs
origins_costs = compare_origins_live(
    hs_code=hs_code, 
    my_country=my_country, 
    mode=mode, 
    weight_kg=weight_kg, 
    product_value=product_value
)

if origins_costs:
    print(f"🏆 Best Sourcing Options (Top 3):")
    print(f"  {'Rank':<5} {'Buy From':<12} {'TOTAL':<12} {'Dist (km)':<11} {'Shipping':<11} {'Pref Margin':<12} {'Duty'} ")
    print(f"  {'─' * 85}")
    
    for i, r in enumerate(origins_costs[:3], 1):
        src = r['route'].split(' → ')[0].upper()
        best = ' ← CHEAPEST' if i == 1 else ''
        pref = f"(-{r['preference_margin']}%)" if r.get('has_preference') else "None"
        
        print(f"  {i:<5} {src:<12} ${r['total_landed_cost']:<11,.2f} {r['distance_km']:<11,} ${r['shipping_cost']:<10,.2f} {pref:<12} ${r['import_duty']:<11,.2f}{best}")
        
    cheapest = origins_costs[0]
    costliest = origins_costs[-1]
    savings = round(costliest["total_landed_cost"] - cheapest["total_landed_cost"], 2)
    best_src = cheapest["route"].split(" → ")[0].upper()
    print(f"\n💡 Best to buy from: {best_src} — saves ${savings:,.2f} vs costliest option")
else:
    print("❌ No tariff/shipping data found for this HS code.")
