"""
TariffIQ — Compliance Agent Test Suite
========================================
Verifies that the Tavily web search and MegaLLM extraction
generate structured compliance checklists correctly.

Usage:
    conda run -n tarrifiq python model/test_compliance_agent.py
"""

import sys
import os
import time

sys.path.insert(0, os.path.dirname(__file__))

from compliance_agent import run_compliance_check, search_compliance_info, TAVILY_API_KEY, MEGALLM_API_KEY

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
#  Test 1: API Keys Loaded
# ══════════════════════════════════════════════════════════════════
header("Test 1: API Key Configuration")

test(
    "TAVILLY_API_KEY is set",
    TAVILY_API_KEY is not None and len(TAVILY_API_KEY) > 0,
    f"key={'***' + TAVILY_API_KEY[-4:] if TAVILY_API_KEY else 'MISSING'}",
)

test(
    "MEGALLM_API_KEY is set",
    MEGALLM_API_KEY is not None and len(MEGALLM_API_KEY) > 0,
    f"key={'***' + MEGALLM_API_KEY[-4:] if MEGALLM_API_KEY else 'MISSING'}",
)


# ══════════════════════════════════════════════════════════════════
#  Test 2: Tavily Search context
# ══════════════════════════════════════════════════════════════════
header("Test 2: Tavily Web Search (Live)")
print(f"  {Y}(Hitting live Tavily API — may take a few seconds){X}\n")

start = time.time()
try:
    context = search_compliance_info("France", "Wine bottles")
    elapsed = time.time() - start
    test(
        f"Returned search context string",
        len(context) > 100,
        f"({elapsed:.1f}s, length={len(context)} chars)",
    )
except Exception as e:
    elapsed = time.time() - start
    test(f"search_compliance_info failed", False, f"Error: {e}")


# ══════════════════════════════════════════════════════════════════
#  Test 3: Full End-to-End Orchestration (Live)
# ══════════════════════════════════════════════════════════════════
header("Test 3: Full Agent Orchestration (Tavily + MegaLLM)")
print(f"  {Y}(Hitting live APIs — may take 10-15 seconds){X}\n")

start = time.time()
try:
    result = run_compliance_check("USA", "Medical masks (HS 6307.90)")
    elapsed = time.time() - start
    
    if result:
        test(
            f"End-to-End succeeded",
            True,
            f"({elapsed:.1f}s)",
        )
        
        # Validate structure
        test("Result has 'compliance_checklist'", "compliance_checklist" in result)
        test("Checklist is a list", isinstance(result.get("compliance_checklist"), list))
        test("Result has 'risk_level'", "risk_level" in result)
        test("Result has 'summary_advice'", "summary_advice" in result)
        
        if result.get("compliance_checklist"):
            sample = result["compliance_checklist"][0]
            for key in ["category", "requirement_title", "description", "is_mandatory"]:
                test(
                    f"Checklist item has '{key}'",
                    key in sample,
                )
    else:
        test(f"End-to-End failed (returned None)", False, f"({elapsed:.1f}s)")
        
except Exception as e:
    elapsed = time.time() - start
    test(f"run_compliance_check failed", False, f"Error: {e}")


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
