"use client";
import PageShell from "@/components/PageShell";
import { Sparkles, MapPin, TrendingUp, Zap, Target, ArrowRight } from "lucide-react";

/* ── Data ───────────────────────────────────────── */
const SOURCING_OPTIONS = [
    {
        country: "Vietnam",
        risk: "Low Risk",
        badge: "Best Choice",
        duty: "0% (FTA)",
        transit: "28 days",
        compliance: 95,
        rec: "Highly Recommended",
        savings: 2500,
        reduction: 18,
        best: true,
    },
    {
        country: "Bangladesh",
        risk: "Medium Risk",
        badge: null,
        duty: "0% (GSP)",
        transit: "35 days",
        compliance: 82,
        rec: "Good Alternative",
        savings: 3200,
        reduction: 23,
        best: false,
    },
    {
        country: "Thailand",
        risk: "Low Risk",
        badge: null,
        duty: "5% (FTA)",
        transit: "26 days",
        compliance: 92,
        rec: "Stable Option",
        savings: 1800,
        reduction: 13,
        best: false,
    },
    {
        country: "India",
        risk: "Medium Risk",
        badge: null,
        duty: "8%",
        transit: "32 days",
        compliance: 88,
        rec: "Consider",
        savings: 1200,
        reduction: 9,
        best: false,
    },
];

const LOGISTICS_ROUTES = [
    {
        name: "China → Singapore → USA",
        desc: "Multimodal via transshipment hub",
        cost: 12800,
        transit: "33 days",
        risk: "Low",
        comp: "Verified",
        baseline: "+$3100",
        saveBadge: "Save $3,100",
        best: false,
    },
    {
        name: "China → USA (Direct Sea)",
        desc: "Current route - baseline",
        cost: 15900,
        transit: "30 days",
        risk: "Medium",
        comp: "Standard",
        baseline: "+$0",
        saveBadge: null,
        best: false,
    },
    {
        name: "Vietnam → USA (Direct Sea)",
        desc: "Alternative sourcing with FTA",
        cost: 12400,
        transit: "28 days",
        risk: "Low",
        comp: "FTA Certified",
        baseline: "+$3500",
        saveBadge: "Save $3,500",
        best: true,
    },
];

const STRATEGIES = [
    {
        title: "Duty Exposure Reduction",
        impact: "High Impact",
        desc: "Switch to GSP-eligible sourcing country to eliminate $1,650 in customs duties",
        effort: "Medium",
        time: "3-6 months",
        save: "$1,650 per shipment",
    },
    {
        title: "FTA Utilization",
        impact: "High Impact",
        desc: "Leverage US-Vietnam FTA for preferential tariff rates",
        effort: "Low",
        time: "1-2 months",
        save: "$2,500 per shipment",
    },
    {
        title: "Alternative Routing",
        impact: "Medium Impact",
        desc: "Transshipment through Singapore port to reduce handling costs",
        effort: "Low",
        time: "Immediate",
        save: "$300 per shipment",
    },
    {
        title: "Consolidation",
        impact: "Medium Impact",
        desc: "Combine multiple smaller shipments into bulk orders",
        effort: "Medium",
        time: "2-3 months",
        save: "$800 per shipment",
    },
];

/* ── Component ──────────────────────────────────── */
export default function Optimize() {
    return (
        <PageShell title="Optimize">
            {/* ── Page Header ─────────────────────── */}
            <div className="animate-fade-in-up" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TrendingUp size={22} color="#7c3aed" />
                </div>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>Optimize</h1>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>AI-driven recommendations to minimize cost and risk</p>
                </div>
            </div>

            {/* ── Engine Banner ────────────────────── */}
            <div className="animate-fade-in-up delay-100" style={{ padding: "20px 24px", borderRadius: 12, background: "#fff", border: "1px solid #e9d5ff", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 10px rgba(147, 51, 234, 0.03)", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Sparkles size={20} color="#9333ea" />
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>AI Optimization &amp; Recommendation Engine</div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>Multi-objective optimization for cost, risk, and time</div>
                    </div>
                </div>
                <div style={{ textAlign: "right", padding: "12px 20px", borderRadius: 10, background: "#f5f3ff", display: "inline-block" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9333ea", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>OPTIMIZATION POTENTIAL</div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: "#9333ea", lineHeight: 1 }}>$3,500</div>
                </div>
            </div>

            {/* ── Highlight Recommendation ─────────── */}
            <div className="animate-fade-in-up delay-200" style={{ padding: "24px 28px", borderRadius: 12, background: "#f8fffa", border: "1px solid #bbf7d0", position: "relative", overflow: "hidden", marginBottom: 24, boxShadow: "0 4px 20px rgba(5, 150, 105, 0.05)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#059669", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Target size={22} color="#fff" />
                    </div>
                    <div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 4, background: "#059669", color: "#fff" }}>AI Recommended</span>
                            <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 4, background: "#fff", border: "1px solid #cbd5e1", color: "var(--text-primary)" }}>Highest ROI</span>
                        </div>
                        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#064e3b", lineHeight: 1.2, marginBottom: 6 }}>Switch to Vietnam Sourcing</h2>
                        <p style={{ fontSize: 14, color: "#059669", fontWeight: 500, lineHeight: 1.5 }}>
                            Migrate 60% of production from China to Vietnam to leverage US-Vietnam FTA benefits while maintaining quality standards.
                        </p>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 20 }}>
                    {[
                        { l: "Annual Savings", v: "$30,000" },
                        { l: "Implementation", v: "3-4 Mo" },
                        { l: "ROI Timeline", v: "18 Mo" },
                        { l: "Confidence", v: "92%" },
                    ].map(b => (
                        <div key={b.l} style={{ padding: "16px 20px", borderRadius: 8, background: "#fff", border: "1px solid #bbf7d0" }}>
                            <div style={{ fontSize: 12, color: "#059669", fontWeight: 500, marginBottom: 8 }}>{b.l}</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: "#064e3b" }}>{b.v}</div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: 24 }}>
                    <button style={{ padding: "12px 20px", borderRadius: 8, background: "#059669", border: "none", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "inline-block" }}>
                        Generate Implementation Plan
                    </button>
                </div>
            </div>

            {/* ── Alternative Sourcing Countries ───── */}
            <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                    <MapPin size={18} color="#2563eb" />
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Alternative Sourcing Country Analysis</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Duty-optimized country recommendations with compliance verification</div>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {SOURCING_OPTIONS.map((c, i) => (
                        <div key={c.country} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "20px", borderRadius: 12,
                            background: c.best ? "#f0fdf4" : "var(--bg-base)",
                            border: `1.5px solid ${c.best ? "#bbf7d0" : "var(--border)"}`,
                        }}>
                            {/* Left: Info */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                                    <span style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>{c.country}</span>
                                    {c.risk === "Low Risk" && <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 99, background: "#0f172a", color: "#fff" }}>Low Risk</span>}
                                    {c.risk === "Medium Risk" && <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 99, background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}>Medium Risk</span>}
                                    {c.badge && <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 99, background: "#059669", color: "#fff" }}>{c.badge}</span>}
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 20 }}>
                                    <div>
                                        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 2 }}>Duty Rate</div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{c.duty}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 2 }}>Transit Time</div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{c.transit}</div>
                                    </div>
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>
                                            <span>Compliance</span>
                                            <span>Recommendation</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{ flex: 1, height: 6, background: "#e2e8f0", borderRadius: 99 }}>
                                                <div style={{ height: "100%", width: `${c.compliance}%`, background: "#0f172a", borderRadius: 99 }} />
                                            </div>
                                            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>
                                                {c.compliance}% <span style={{ fontWeight: 600, color: "var(--text-muted)", marginLeft: 6 }}>{c.rec}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Right: Savings */}
                            <div style={{ textAlign: "right", borderLeft: "1px solid var(--border)", paddingLeft: 24, marginLeft: 24, minWidth: 120 }}>
                                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>Estimated Savings</div>
                                <div style={{ fontSize: 24, fontWeight: 900, color: "#059669", lineHeight: 1 }}>${c.savings.toLocaleString()}</div>
                                <div style={{ fontSize: 12, color: "#059669", fontWeight: 600, marginTop: 4 }}>{c.reduction}% reduction</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Multi-Route Logistics Comparison ─── */}
            <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                    <TrendingUp size={18} color="#7c3aed" />
                    <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Multi-Route Logistics Comparison</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {LOGISTICS_ROUTES.map(r => (
                        <div key={r.name} style={{
                            padding: "20px", borderRadius: 12,
                            background: r.best ? "#faf5ff" : "var(--bg-base)",
                            border: `1.5px solid ${r.best ? "#e9d5ff" : "var(--border)"}`,
                        }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                                <div>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>{r.name}</div>
                                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{r.desc}</div>
                                </div>
                                {r.saveBadge && (
                                    <span style={{ fontSize: 12, fontWeight: 800, padding: "5px 12px", borderRadius: 99, background: "#10b981", color: "#fff" }}>
                                        {r.saveBadge}
                                    </span>
                                )}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                                {[
                                    { l: "Total Cost", v: `$${r.cost.toLocaleString()}` },
                                    { l: "Transit Time", v: r.transit },
                                    { l: "Risk Level", v: r.risk },
                                    { l: "Compliance", v: r.comp },
                                    { l: "vs Baseline", v: r.baseline, c: r.baseline.startsWith("+") ? "#059669" : "var(--text-primary)" },
                                ].map(m => (
                                    <div key={m.l} style={{ padding: "12px 14px", borderRadius: 8, background: "#fff", border: "1px solid rgba(0,0,0,0.06)" }}>
                                        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>{m.l}</div>
                                        <div style={{ fontSize: 15, fontWeight: 800, color: m.c || "var(--text-primary)" }}>{m.v}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Strategies ───────────────────────── */}
            <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                    <Zap size={18} color="#d97706" />
                    <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Cost vs Compliance Optimization Strategies</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {STRATEGIES.map(s => (
                        <div key={s.title} style={{ padding: "20px", borderRadius: 12, border: "1.5px solid var(--border)", background: "var(--bg-base)" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>{s.title}</div>
                                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: "#0f172a", color: "#fff" }}>{s.impact}</span>
                            </div>
                            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 16 }}>{s.desc}</p>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
                                <div>
                                    <div style={{ color: "var(--text-muted)", marginBottom: 2 }}>Effort</div>
                                    <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{s.effort}</div>
                                </div>
                                <div>
                                    <div style={{ color: "var(--text-muted)", marginBottom: 2 }}>Timeline</div>
                                    <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{s.time}</div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ color: "var(--text-muted)", marginBottom: 2 }}>Savings</div>
                                    <div style={{ fontWeight: 700, color: "#059669" }}>{s.save}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── AI Trade Strategy Advisor ───────────────────────── */}
            <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 24, borderRadius: 12, background: "#f8faff", border: "1px solid #e0e7ff", marginTop: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <Sparkles size={18} color="#6366f1" />
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>AI Trade Strategy Advisor</div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>Opinionated intelligence with forward-looking insights</div>
                    </div>
                </div>

                <div style={{ padding: "20px 24px", borderRadius: 12, background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 2px 10px rgba(79,70,229,0.03)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Sparkles size={20} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: "#312e81", marginBottom: 4 }}>Import now with partial stockpiling</div>
                            <div style={{ fontSize: 14, color: "#4338ca", fontWeight: 500 }}>Tariff increase expected in Q2 2026. Current rates favorable.</div>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 20 }}>
                        <div style={{ padding: "16px", borderRadius: 10, background: "#fff", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>Confidence Score</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ flex: 1, height: 6, background: "#e2e8f0", borderRadius: 99 }}>
                                    <div style={{ height: "100%", width: "87%", background: "#1e293b", borderRadius: 99 }} />
                                </div>
                                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>87%</div>
                            </div>
                        </div>
                        <div style={{ padding: "16px", borderRadius: 10, background: "#fff", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>Action Window</div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: "#4338ca" }}>Next 60 days</div>
                        </div>
                        <div style={{ padding: "16px", borderRadius: 10, background: "#fff", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>Trade Outlook</div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: "#059669" }}>Bullish</div>
                        </div>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
