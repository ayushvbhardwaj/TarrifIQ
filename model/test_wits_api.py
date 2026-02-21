"""
TariffIQ — WITS API Test Suite
================================
Verifies the WITS API client against live World Bank endpoints.

Usage:
    python model/test_wits_api.py
"""

import sys
import os
import time

sys.path.insert(0, os.path.dirname(__file__))

from wits_api import (
    get_tradestats_tariff,
    get_tariff_for_hs_category,
    get_tariff_rate_trains,
    get_tariff_rate,
    get_all_category_tariffs,
    compare_tariff_by_partners,
    _hs6_to_product_group,
    _resolve_iso3,
    ISO3_TO_NUMERIC,
    COUNTRY_NAME_TO_ISO3,
    HS_CHAPTER_TO_PRODUCT_GROUP,
)

# ── Color helpers ──────────────────────────────────────────────────
G = "\033[92m"   # green
R = "\033[91m"   # red
Y = "\033[93m"   # yellow
C = "\033[96m"   # cyan
B = "\033[1m"    # bold
X = "\033[0m"    # reset

passed = 0
failed = 0
skipped = 0


def header(msg: str):
    print(f"\n{B}{C}{'═' * 60}")
    print(f"  {msg}")
    print(f"{'═' * 60}{X}\n")


def test(name: str, condition: bool, detail: str = ""):
    global passed, failed
    if condition:
        passed += 1
        print(f"  {G}✓ PASS{X}  {name}")
    else:
        failed += 1
        print(f"  {R}✗ FAIL{X}  {name}")
    if detail:
        print(f"           {detail}")


def skip(name: str, reason: str):
    global skipped
    skipped += 1
    print(f"  {Y}○ SKIP{X}  {name} — {reason}")


# ══════════════════════════════════════════════════════════════════
#  Test 1: Country Code Mappings
# ══════════════════════════════════════════════════════════════════
header("Test 1: Country Code Mapping Validation")

for iso3 in ["USA", "IND", "GBR", "CHN", "FRA", "ARE", "VNM"]:
    test(
        f"ISO3_TO_NUMERIC['{iso3}']",
        iso3 in ISO3_TO_NUMERIC,
        f"→ {ISO3_TO_NUMERIC.get(iso3, '???')}",
    )

for name in ["usa", "india", "uk", "china", "france", "uae", "vietnam"]:
    test(
        f"COUNTRY_NAME_TO_ISO3['{name}']",
        name in COUNTRY_NAME_TO_ISO3,
        f"→ {COUNTRY_NAME_TO_ISO3.get(name, '???')}",
    )


# ══════════════════════════════════════════════════════════════════
#  Test 2: HS → Product Group Mapping
# ══════════════════════════════════════════════════════════════════
header("Test 2: HS Code → Product Group Mapping")

test_cases = [
    ("010620", "01-05_Animal"),
    ("200990", "16-24_FoodProd"),
    ("270900", "27-27_Fuels"),
    ("392310", "39-40_PlastiRub"),
    ("520100", "50-63_TextCloth"),
    ("720110", "72-83_Metals"),
    ("854231", "84-85_MachElec"),
]

for hs, expected_group in test_cases:
    actual = _hs6_to_product_group(hs)
    test(
        f"HS {hs} → {expected_group}",
        actual == expected_group,
        f"got: {actual}",
    )


# ══════════════════════════════════════════════════════════════════
#  Test 3: _resolve_iso3
# ══════════════════════════════════════════════════════════════════
header("Test 3: Country Resolution")

test("_resolve_iso3('USA') → 'USA'", _resolve_iso3("USA") == "USA")
test("_resolve_iso3('usa') → 'USA'", _resolve_iso3("usa") == "USA")
test("_resolve_iso3('india') → 'IND'", _resolve_iso3("india") == "IND")
test("_resolve_iso3('uk') → 'GBR'", _resolve_iso3("uk") == "GBR")

try:
    _resolve_iso3("narnia")
    test("_resolve_iso3('narnia') raises ValueError", False)
except ValueError:
    test("_resolve_iso3('narnia') raises ValueError", True)


# ══════════════════════════════════════════════════════════════════
#  Test 4: Live API — TradeStats-Tariff (aggregate, reliable)
# ══════════════════════════════════════════════════════════════════
header("Test 4: Live API — TradeStats-Tariff (All Categories)")
print(f"  {Y}(Hitting live WITS API — may take a few seconds){X}\n")

start = time.time()
all_cats = get_all_category_tariffs("usa", "chn", 2019)
elapsed = time.time() - start

if all_cats:
    test(
        f"USA→CHN 2019: returned {len(all_cats)} product categories",
        len(all_cats) > 10,
        f"({elapsed:.1f}s)",
    )

    # Print a nice table
    print(f"\n  {'Product Group':<30} {'Tariff Rate':>12}")
    print(f"  {'─' * 30} {'─' * 12}")
    for r in all_cats:
        label = r["product_label"][:28]
        print(f"  {label:<30} {r['tariff_rate']:>10.2f}%")

    # Verify structure
    sample = all_cats[0]
    test("Result has 'tariff_rate'", "tariff_rate" in sample)
    test("Result has 'product_group'", "product_group" in sample)
    test("Result has 'reporter'", sample.get("reporter") == "USA")
    test("Result has 'partner'", sample.get("partner") == "CHN")
    test("Tariff rate is non-negative float",
         isinstance(sample["tariff_rate"], float) and sample["tariff_rate"] >= 0)
else:
    skip("TradeStats all categories", "API returned no data")


# ══════════════════════════════════════════════════════════════════
#  Test 5: Live API — Single Product Group
# ══════════════════════════════════════════════════════════════════
header("Test 5: Live API — Single Product Group Query")

start = time.time()
animal = get_tradestats_tariff("usa", "chn", 2019, product="01-05_Animal")
elapsed = time.time() - start

if animal:
    test(
        f"USA→CHN Animal Products (2019)",
        len(animal) == 1,
        f"tariff={animal[0]['tariff_rate']}%  ({elapsed:.1f}s)",
    )
else:
    skip("Single product group", "API returned no data")


# ══════════════════════════════════════════════════════════════════
#  Test 6: Live API — HS Category Lookup
# ══════════════════════════════════════════════════════════════════
header("Test 6: Live API — HS-6 to Category Fallback")

start = time.time()
result = get_tariff_for_hs_category("usa", "chn", "010620", 2019)
elapsed = time.time() - start

if result:
    test(
        "HS 010620 → Animal category tariff",
        result["product_group"] == "01-05_Animal",
        f"rate={result['tariff_rate']}%  group={result['product_group']}  ({elapsed:.1f}s)",
    )
    test("Result includes hs_code echo", result.get("hs_code") == "010620")
    test("Result includes source", result.get("source") == "tradestats-tariff")
else:
    skip("HS category lookup", "API returned no data")


# ══════════════════════════════════════════════════════════════════
#  Test 7: Live API — TRAINS (HS-6 granularity)
# ══════════════════════════════════════════════════════════════════
header("Test 7: Live API — TRAINS HS-6 (may be unavailable)")

start = time.time()
trains_result = get_tariff_rate_trains("USA", "CHN", "010620", 2019)
elapsed = time.time() - start

if trains_result:
    test(
        "TRAINS: USA→CHN HS:010620 (2019)",
        True,
        f"rate={trains_result['tariff_rate']}%  source={trains_result['source']}  ({elapsed:.1f}s)",
    )
else:
    skip(
        "TRAINS HS-6 endpoint",
        "Currently returning 404 — this is a known WITS API issue"
    )


# ══════════════════════════════════════════════════════════════════
#  Test 8: Smart Lookup (TRAINS → TradeStats fallback)
# ══════════════════════════════════════════════════════════════════
header("Test 8: Smart Tariff Lookup (with fallback)")

start = time.time()
smart = get_tariff_rate("usa", "chn", "010620", 2019)
elapsed = time.time() - start

if smart:
    test(
        f"Smart lookup returned data via '{smart['source']}'",
        True,
        f"rate={smart['tariff_rate']}%  ({elapsed:.1f}s)",
    )
    test("Smart lookup has hs_code", "hs_code" in smart)
else:
    skip("Smart lookup", "Both endpoints failed")


# ══════════════════════════════════════════════════════════════════
#  Test 9: Compare Partners
# ══════════════════════════════════════════════════════════════════
header("Test 9: Compare Tariff by Partners")

start = time.time()
comparison = compare_tariff_by_partners(
    reporter="usa",
    partners=["chn", "ind", "vnm"],
    hs6="520100",   # Cotton
    year=2019,
)
elapsed = time.time() - start

if comparison:
    test(
        f"Comparison returned {len(comparison)} results",
        len(comparison) > 0,
        f"({elapsed:.1f}s)",
    )
    print(f"\n  {'Partner':<10} {'Rate':>8} {'Source':<20}")
    print(f"  {'─' * 10} {'─' * 8} {'─' * 20}")
    for r in comparison:
        print(f"  {r['partner']:<10} {r['tariff_rate']:>7.2f}% {r.get('source', 'n/a'):<20}")
    test("Results sorted by tariff_rate (lowest first)",
         all(comparison[i]["tariff_rate"] <= comparison[i+1]["tariff_rate"]
             for i in range(len(comparison)-1)))
else:
    skip("Partner comparison", "API returned no data for any partner")


# ══════════════════════════════════════════════════════════════════
#  Test 10: Cross-Validation with Local CSV
# ══════════════════════════════════════════════════════════════════
header("Test 10: Cross-Validation — API vs Local CSV")

try:
    import pandas as pd

    csv_path = os.path.join(
        os.path.dirname(__file__), "..", "data", "cross_country_csv", "uk-us.csv"
    )
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path, dtype={"hs_code": str})

        # Get the API category tariff for HS codes in the "Animal" group (01-05)
        animal_hs = df[df["hs_code"].str[:2].astype(int).between(1, 5)]

        if not animal_hs.empty:
            csv_avg = animal_hs["MFNRate"].dropna().mean()

            api_result = get_tariff_for_hs_category("GBR", "USA", "010620", 2022)

            if api_result and csv_avg > 0:
                api_rate = api_result["tariff_rate"]
                print(f"  CSV Animal avg MFN:  {csv_avg:.2f}%")
                print(f"  API Animal MFN:      {api_rate:.2f}%")
                print(f"  Delta:               {abs(api_rate - csv_avg):.2f}%")
                test(
                    "API and CSV Animal category rates in same ballpark",
                    abs(api_rate - csv_avg) < 30,  # Allow wide range — different aggregation methods
                    f"api={api_rate:.2f}%  csv_avg={csv_avg:.2f}%",
                )
            else:
                skip("Cross-validation", "One source returned no data")
        else:
            skip("Cross-validation", "No animal-group HS codes in CSV")
    else:
        skip("Cross-validation", f"CSV not found at {csv_path}")

except ImportError:
    skip("Cross-validation", "pandas not installed")


# ══════════════════════════════════════════════════════════════════
#  Summary
# ══════════════════════════════════════════════════════════════════
header("Test Summary")
total = passed + failed + skipped
print(f"  {G}Passed:  {passed}{X}")
print(f"  {R}Failed:  {failed}{X}")
print(f"  {Y}Skipped: {skipped}{X}")
print(f"  Total:   {total}")
print()

if failed == 0:
    print(f"  {G}{B}All tests passed! ✓{X}")
else:
    print(f"  {R}{B}{failed} test(s) failed.{X}")

sys.exit(0 if failed == 0 else 1)
