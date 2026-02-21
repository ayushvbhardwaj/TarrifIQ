"""
TariffAI — Shipping & Landed Cost Engine
=========================================
Deterministic, simulation-grade freight and landed cost calculator
for cross-country trade between India, China, USA, and UK.

Freight costs are modeled using industry benchmark per-kg rates
with distance-normalized multipliers to simulate realistic
cross-border trade cost sensitivity.
"""

from tarrif_lookup_engine import load_tariffs, get_tariff_rate

# ── Route Distances ─────────────────────────────────────────────────

AIR_DISTANCE_KM = {
    ("china", "india"): 3800,
    ("china", "usa"):   11000,
    ("china", "uk"):    8100,
    ("india", "usa"):   12500,
    ("india", "uk"):    7200,
    ("usa",   "uk"):    6800,
}

SEA_DISTANCE_KM = {
    ("china", "india"): 9000,
    ("china", "usa"):   20000,
    ("china", "uk"):    19500,
    ("india", "usa"):   19000,
    ("india", "uk"):    11000,
    ("usa",   "uk"):    6000,
}

# ── Shipping Rate Benchmarks ───────────────────────────────────────

SHIPPING_RATES = {
    "air": {
        "base_charge": 250,
        "per_kg_rate": 6,
    },
    "sea": {
        "base_charge": 120,
        "per_kg_rate": 1.2,
    },
}

# ── Normalization Constant ──────────────────────────────────────────

DISTANCE_NORM_KM = 5000   # global mid-range normalization constant

# ── Supported Countries ────────────────────────────────────────────

SUPPORTED_COUNTRIES = ["china", "india", "usa", "uk"]


# ═══════════════════════════════════════════════════════════════════
#  Core Functions
# ═══════════════════════════════════════════════════════════════════

def _normalize(name: str) -> str:
    """Lowercase + strip a country name."""
    return name.strip().lower()


def get_route_distance(origin: str, destination: str, mode: str) -> int:
    """
    Look up the distance (km) between two countries for a given mode.
    Routes are symmetric — order doesn't matter.
    """
    a, b = sorted([_normalize(origin), _normalize(destination)])
    table = AIR_DISTANCE_KM if mode == "air" else SEA_DISTANCE_KM
    key = (a, b)
    if key not in table:
        raise ValueError(
            f"No {mode} route found for {origin} → {destination}. "
            f"Supported countries: {SUPPORTED_COUNTRIES}"
        )
    return table[key]


def calculate_shipping_cost(
    origin: str,
    destination: str,
    mode: str,
    weight_kg: float,
) -> dict:
    """
    Calculate freight shipping cost.

    Returns dict with:
        distance_km, distance_factor, shipping_cost
    """
    mode = mode.strip().lower()
    if mode not in SHIPPING_RATES:
        raise ValueError(f"Invalid mode '{mode}'. Choose 'air' or 'sea'.")

    distance_km = get_route_distance(origin, destination, mode)
    distance_factor = round(distance_km / DISTANCE_NORM_KM, 2)

    rates = SHIPPING_RATES[mode]
    shipping_cost = round(
        rates["base_charge"] + (weight_kg * rates["per_kg_rate"] * distance_factor),
        2,
    )

    return {
        "distance_km": distance_km,
        "distance_factor": distance_factor,
        "shipping_cost": shipping_cost,
    }


def calculate_import_duty(product_value: float, tariff_rate: float) -> float:
    """import_duty = product_value × (tariff_rate / 100)"""
    return round(product_value * tariff_rate / 100, 2)


def calculate_landed_cost(
    origin: str,
    destination: str,
    mode: str,
    weight_kg: float,
    product_value: float,
    tariff_rate: float,
) -> dict:
    """
    Full landed cost calculation.

    Returns the complete output schema:
        route, mode, distance_km, distance_factor, weight_kg,
        shipping_cost, tariff_rate, import_duty, total_landed_cost
    """
    shipping = calculate_shipping_cost(origin, destination, mode, weight_kg)
    import_duty = calculate_import_duty(product_value, tariff_rate)
    total = round(product_value + shipping["shipping_cost"] + import_duty, 2)

    return {
        "route": f"{_normalize(origin)} → {_normalize(destination)}",
        "mode": mode.strip().lower(),
        "distance_km": shipping["distance_km"],
        "distance_factor": shipping["distance_factor"],
        "weight_kg": weight_kg,
        "shipping_cost": shipping["shipping_cost"],
        "tariff_rate": tariff_rate,
        "import_duty": import_duty,
        "total_landed_cost": total,
    }


def calculate_landed_cost_with_lookup(
    origin: str,
    destination: str,
    mode: str,
    weight_kg: float,
    product_value: float,
    hs_code: str,
    importing_country: str,
    year: int,
    tariffs_df=None,
) -> dict | None:
    """
    End-to-end: looks up the tariff from the dataset and computes
    the full landed cost in one call.

    Returns None if no tariff data is found.
    """
    if tariffs_df is None:
        tariffs_df = load_tariffs()

    rate = get_tariff_rate(hs_code, importing_country, year, tariffs_df)
    if rate is None:
        return None

    return calculate_landed_cost(
        origin, destination, mode, weight_kg, product_value, rate
    )


# ═══════════════════════════════════════════════════════════════════
#  Demo Run
# ═══════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    # ── Constants — change these to test different scenarios ─────────
    ORIGIN        = "china"
    DESTINATION   = "usa"
    MODE          = "sea"       # "air" or "sea"
    WEIGHT_KG     = 500
    PRODUCT_VALUE = 10000
    TARIFF_RATE   = None         # set to None to look up from dataset
    HS_CODE       = "521142"    # used only if TARIFF_RATE is None
    IMPORT_COUNTRY = "United States of America"  # used only if TARIFF_RATE is None
    YEAR          = 2025        # used only if TARIFF_RATE is None
    # ────────────────────────────────────────────────────────────────

    print("=" * 50)
    print("  TariffAI — Landed Cost Calculator")
    print("=" * 50)

    if TARIFF_RATE is not None:
        rate = TARIFF_RATE
    else:
        df = load_tariffs()
        rate = get_tariff_rate(HS_CODE, IMPORT_COUNTRY, YEAR, df)
        if rate is None:
            print(f"\n❌ No tariff data found for HS {HS_CODE} | {IMPORT_COUNTRY} | {YEAR}")
            exit()
        print(f"\n✅ Tariff rate from dataset: {rate}%")

    result = calculate_landed_cost(
        ORIGIN, DESTINATION, MODE, WEIGHT_KG, PRODUCT_VALUE, rate
    )

    print(f"\n{'━' * 50}")
    print(f"  Route           : {result['route']}")
    print(f"  Mode            : {result['mode']}")
    print(f"  Distance        : {result['distance_km']:,} km (factor: {result['distance_factor']})")
    print(f"  Weight          : {result['weight_kg']:,} kg")
    print(f"  ─────────────────────────────────────")
    print(f"  Product value   : ${PRODUCT_VALUE:,.2f}")
    print(f"  Shipping cost   : ${result['shipping_cost']:,.2f}")
    print(f"  Tariff rate     : {result['tariff_rate']}%")
    print(f"  Import duty     : ${result['import_duty']:,.2f}")
    print(f"  ─────────────────────────────────────")
    print(f"  TOTAL LANDED    : ${result['total_landed_cost']:,.2f}")
    print(f"{'━' * 50}")
