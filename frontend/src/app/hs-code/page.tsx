"use client";
import PageShell from "@/components/PageShell";
import { useState } from "react";
import { Sparkles, ChevronRight, CheckCircle, RefreshCw, ShieldCheck, AlertTriangle, FileText, ExternalLink } from "lucide-react";

const FEATURES = [
    { label: "CATEGORY", val: "Textiles & Apparel", color: "#2563eb", bg: "#eff6ff" },
    { label: "MATERIAL", val: "100% Cotton", color: "#059669", bg: "#f0fdf4" },
    { label: "CONSTRUCTION", val: "Knitted / Crocheted", color: "#7c3aed", bg: "#faf5ff" },
    { label: "GARMENT TYPE", val: "T-Shirt / Vest", color: "#d97706", bg: "#fffbeb" },
    { label: "END USE", val: "Casual Wear", color: "#db2777", bg: "#fdf2f8" },
    { label: "GENDER", val: "Unisex", color: "#64748b", bg: "#f8fafc" },
];

const RESULTS = [
    {
        code: "6109.10.00",
        desc: "T-shirts, singlets and other vests, of cotton, knitted or crocheted",
        duty: "16.5%", confidence: 94, risk: "Low" as const, recommended: true,
        reasoning: "Product description matches \"Cotton T-Shirts\", material is 100% cotton, category is textiles. Strong NLP feature match.",
        similar: 12, validated: true,
    },
    {
        code: "6109.90.10",
        desc: "T-shirts and other vests, knitted or crocheted, of other textile materials",
        duty: "32.0%", confidence: 78, risk: "Medium" as const, recommended: false,
        reasoning: "Alternative classification if cotton content is less than 50% or blended with synthetics.",
        similar: 7, validated: false,
    },
    {
        code: "6205.20.00",
        desc: "Men's or boys' shirts of cotton",
        duty: "19.7%", confidence: 45, risk: "High" as const, recommended: false,
        reasoning: "Lower confidence: Classification depends on whether product has collar/buttons. Current description suggests casual tee.",
        similar: 3, validated: false,
    },
];

const HISTORY = [
    { product: "Wireless Bluetooth Headphones", code: "8518.30", date: "Feb 18, 2026", confidence: 94, category: "Electronics" },
    { product: "Industrial CNC Router Machine", code: "8457.10", date: "Feb 15, 2026", confidence: 89, category: "Machinery" },
    { product: "Polyester Fabric Roll (100m)", code: "5407.61", date: "Feb 12, 2026", confidence: 91, category: "Textiles" },
];

const riskStyle = {
    Low: { color: "#fff", bg: "#1e293b", label: "Low Risk" },
    Medium: { color: "#fff", bg: "#92400e", label: "Medium Risk" },
    High: { color: "#fff", bg: "#991b1b", label: "High Risk" },
} as const;

export default function HSCode() {
    const [loading, setLoading] = useState(false);
    const [shown, setShown] = useState(true);
    const [selected, setSelected] = useState<string | null>(null);
    const [override, setOverride] = useState("");

    function classify() {
        if (loading) return;
        setLoading(true); setShown(false); setSelected(null);
        setTimeout(() => { setLoading(false); setShown(true); }, 1800);
    }

    return (
        <PageShell title="HS Code AI">
            {/* Page header */}
            <div className="animate-fade-in-up" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sparkles size={22} color="#7c3aed" />
                </div>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>HS Code AI</h1>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>AI-powered HS code classification based on your product details</p>
                </div>
            </div>



            {/* Loading */}
            {loading && (
                <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 36, textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Sparkles size={24} color="#7c3aed" />
                        </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 6 }}>Classifying your product…</div>
                    <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Scanning 5,224 HS codes · Checking duty schedules · Verifying GSP eligibility</p>
                </div>
            )}

            {shown && (<>
                {/* Extracted Product Features */}
                <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                        <Sparkles size={16} color="#7c3aed" />
                        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Extracted Product Features</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                        {FEATURES.map(f => (
                            <div key={f.label} style={{ padding: "14px 16px", borderRadius: 10, background: f.bg, border: `1px solid ${f.color}22` }}>
                                <div style={{ fontSize: 10, fontWeight: 800, color: f.color, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>{f.label}</div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{f.val}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* HS Code Result Cards */}
                {RESULTS.map(r => {
                    const rs = riskStyle[r.risk];
                    const isSelected = selected === r.code;
                    const barColor = r.confidence > 85 ? "#0f172a" : r.confidence > 60 ? "#92400e" : "#991b1b";
                    return (
                        <div key={r.code} className="glass-card card-shadow animate-fade-in-up" style={{
                            padding: "22px 24px",
                            borderLeft: `4px solid ${r.recommended ? "#059669" : r.risk === "High" ? "#dc2626" : "#d97706"}`,
                            background: "#fff",
                            border: `1px solid ${isSelected ? "rgba(37,99,235,0.3)" : "var(--border)"}`,
                            borderLeftWidth: 4,
                            borderLeftStyle: "solid",
                            borderLeftColor: r.recommended ? "#059669" : r.risk === "High" ? "#dc2626" : "#d97706",
                        }}>
                            {/* Top row */}
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                                    <span style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 22, color: "#0f172a" }}>{r.code}</span>
                                    {r.recommended && (
                                        <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 99, background: "#059669", color: "#fff" }}>
                                            ✓ Recommended
                                        </span>
                                    )}
                                    <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 99, background: rs.bg, color: rs.color }}>
                                        {rs.label}
                                    </span>
                                </div>
                                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                                    <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Duty Rate</div>
                                    <div style={{ fontSize: 26, fontWeight: 900, color: "#7c3aed", lineHeight: 1.1 }}>{r.duty}</div>
                                </div>
                            </div>

                            {/* Description */}
                            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.5 }}>{r.desc}</p>

                            {/* Confidence bar */}
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>AI Confidence Score</span>
                                    <span style={{ fontSize: 13, fontWeight: 800, color: barColor }}>{r.confidence}%</span>
                                </div>
                                <div style={{ height: 10, borderRadius: 99, background: "#e2e8f0", overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${r.confidence}%`, background: barColor, borderRadius: 99 }} />
                                </div>
                            </div>

                            {/* Reasoning */}
                            <div style={{ padding: "12px 16px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", marginBottom: 14 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                                    <Sparkles size={13} color="#7c3aed" />
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>AI Reasoning &amp; Explainability</span>
                                </div>
                                <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>{r.reasoning}</p>
                            </div>

                            {/* Meta + actions */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    <span style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
                                        <FileText size={13} /> {r.similar} similar products matched
                                    </span>
                                    {r.validated && (
                                        <span style={{ fontSize: 13, color: "#059669", display: "flex", alignItems: "center", gap: 5, fontWeight: 600 }}>
                                            <CheckCircle size={13} /> Validated by rule-based engine
                                        </span>
                                    )}
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button onClick={() => setSelected(r.code)} style={{ padding: "9px 18px", borderRadius: 8, background: isSelected ? "#059669" : "#16a34a", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                                        {isSelected ? <><CheckCircle size={13} /> Selected</> : "Select This Code"}
                                    </button>
                                    <button style={{ padding: "9px 16px", borderRadius: 8, background: "#fff", border: "1.5px solid #cbd5e1", color: "var(--text-muted)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                                        View Tariff Schedule
                                    </button>

                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Bottom row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {/* Manual Override */}
                    <div className="animate-fade-in-up" style={{ padding: 22, borderRadius: 14, background: "#fffbeb", border: "1.5px solid #fcd34d" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <AlertTriangle size={16} color="#d97706" />
                            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Manual HS Code Override</span>
                        </div>
                        <p style={{ fontSize: 13, color: "#b45309", lineHeight: 1.6, marginBottom: 14 }}>
                            You can manually override the AI classification, but be aware of potential compliance risks and duty impacts.
                        </p>
                        <div style={{ display: "flex", gap: 8 }}>
                            <input
                                value={override} onChange={e => setOverride(e.target.value)}
                                placeholder="Enter HS Code (e.g., 6109.10.00)"
                                style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1.5px solid #fcd34d", background: "#fff", color: "var(--text-primary)", fontSize: 13, outline: "none", fontFamily: "monospace", fontWeight: 600 }}
                            />
                            <button style={{ padding: "10px 18px", borderRadius: 8, background: "#d97706", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
                                Override &amp; Analyze Impact
                            </button>
                        </div>
                    </div>

                    {/* Risk Assessment */}
                    <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 22 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                            <ShieldCheck size={16} color="#2563eb" />
                            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Misclassification Risk Assessment</span>
                        </div>
                        {/* Overall */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", marginBottom: 16 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <CheckCircle size={20} color="#059669" />
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 800, color: "#059669" }}>Overall Risk: LOW</div>
                                    <div style={{ fontSize: 12, color: "#059669", fontWeight: 500 }}>Classification is highly defensible with strong supporting evidence</div>
                                </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 24, fontWeight: 900, color: "#059669" }}>8.2/10</div>
                                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Defense Score</div>
                            </div>
                        </div>
                        {/* Two-col bars */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                            {[{ label: "Customs Dispute Likelihood", val: 12, color: "#0f172a" }, { label: "Audit Preparedness", val: 94, color: "#0f172a" }].map(b => (
                                <div key={b.label}>
                                    <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 6 }}>{b.label}</div>
                                    <div style={{ height: 8, borderRadius: 99, background: "#e2e8f0", overflow: "hidden", marginBottom: 4 }}>
                                        <div style={{ height: "100%", width: `${b.val}%`, background: b.color, borderRadius: 99 }} />
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>{b.val}%</div>
                                </div>
                            ))}
                        </div>
                        {/* References */}
                        <div style={{ paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Global Classification References</div>
                            {[
                                "US Customs: 87 similar products classified under 6109.10.00",
                                "EU Database: 156 matching classifications with 96% consistency",
                                "WCO Guidelines: Direct alignment with Chapter 61 notes",
                            ].map(ref => (
                                <div key={ref} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 6 }}>
                                    <ExternalLink size={12} color="#2563eb" style={{ flexShrink: 0, marginTop: 2 }} />
                                    <span style={{ fontSize: 12, color: "#2563eb", lineHeight: 1.5, fontWeight: 500 }}>{ref}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>)}

            {/* Recent Classifications */}
            <div className="glass-card card-shadow animate-fade-in-up delay-500" style={{ padding: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Recent Classifications</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {HISTORY.map(h => (
                        <div key={h.product} style={{ display: "flex", alignItems: "center", padding: "14px 16px", borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--bg-base)", cursor: "pointer", transition: "border-color 0.15s" }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = "#7c3aed")}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{h.product}</div>
                                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{h.category} · {h.date}</div>
                            </div>
                            <span style={{ fontFamily: "monospace", fontWeight: 900, color: "#7c3aed", fontSize: 15, marginRight: 14 }}>{h.code}</span>
                            <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 99, background: "#f0fdf4", color: "#059669", border: "1px solid #bbf7d0", fontWeight: 700, marginRight: 10 }}>{h.confidence}%</span>
                            <ChevronRight size={15} color="var(--text-muted)" />
                        </div>
                    ))}
                </div>
            </div>
        </PageShell>
    );
}
