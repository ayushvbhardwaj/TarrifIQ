"use client";
import PageShell from "@/components/PageShell";
import TradeSummaryHeader from "@/components/TradeSummaryHeader";
import { useState, useEffect } from "react";
import { Sparkles, ChevronRight, CheckCircle, RefreshCw, ShieldCheck, AlertTriangle, FileText, ExternalLink } from "lucide-react";
import { useTradeContext } from "@/context/TradeContext";

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
    const { name, description, hsCode, setTradeData } = useTradeContext();
    const [loading, setLoading] = useState(false);

    // API State
    const [classificationResult, setClassificationResult] = useState<any>(null);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [override, setOverride] = useState("");

    useEffect(() => {
        if (!description) return; // Wait for context
        classify();
    }, [description]);

    async function classify() {
        if (loading) return;
        setLoading(true); setClassificationResult(null); setCandidates([]);

        try {
            const res = await fetch("http://localhost:8000/api/classify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_description: description })
            });
            const data = await res.json();

            if (res.ok && data.reranked) {
                setClassificationResult(data.reranked);
                setCandidates(data.candidates || []);

                // Auto-set the best HS code to global context
                if (!hsCode && data.reranked.primary_hs) {
                    setTradeData({ hsCode: String(data.reranked.primary_hs) });
                }
            } else {
                console.error("Classification failed:", data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    // Mapping colors for dynamic features
    const featureColors = [
        { color: "#2563eb", bg: "#eff6ff" },
        { color: "#059669", bg: "#f0fdf4" },
        { color: "#7c3aed", bg: "#faf5ff" },
        { color: "#d97706", bg: "#fffbeb" },
        { color: "#db2777", bg: "#fdf2f8" },
        { color: "#0891b2", bg: "#ecfeff" },
    ];

    function selectCode(code: string) {
        setTradeData({ hsCode: String(code) });
    }

    return (
        <PageShell title="HS Code AI">
            <TradeSummaryHeader />

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

            {/* Empty State */}
            {!description && !loading && !classificationResult && (
                <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 36, textAlign: "center", marginTop: 20 }}>
                    <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Please enter product details in the Trade Input page first.</p>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 36, textAlign: "center", marginTop: 24 }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Sparkles size={24} color="#7c3aed" className="animate-pulse" />
                        </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 6 }}>Classifying "{name || 'Product'}"…</div>
                    <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Scanning FAISS HS indices · Running SentenceTransformer matching · Validating chapter notes</p>
                </div>
            )}

            {classificationResult && !loading && (<>
                {/* Extracted Product Features */}
                <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 24, marginTop: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                        <Sparkles size={16} color="#7c3aed" />
                        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Extracted AI Features</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                        {classificationResult.extracted_features && Object.entries(classificationResult.extracted_features).map(([key, val], idx) => {
                            const fColor = featureColors[idx % featureColors.length];
                            return (
                                <div key={key} style={{ padding: "14px 16px", borderRadius: 10, background: fColor.bg, border: `1px solid ${fColor.color}22` }}>
                                    <div style={{ fontSize: 10, fontWeight: 800, color: fColor.color, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>{key.replace(/_/g, " ")}</div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{String(val)}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main AI Pick */}
                <div className="glass-card card-shadow animate-fade-in-up" style={{
                    padding: "22px 24px",
                    background: "#fff",
                    borderLeftWidth: 4,
                    borderLeftStyle: "solid",
                    borderLeftColor: "#059669",
                    borderColor: "var(--border)",
                    marginTop: 24
                }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 26, color: "#0f172a" }}>{classificationResult.primary_hs}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 99, background: "#059669", color: "#fff" }}>
                                ✓ Best Match
                            </span>
                        </div>
                    </div>

                    {/* Confidence bar */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>LLM Confidence Score</span>
                            <span style={{ fontSize: 13, fontWeight: 800, color: "#059669" }}>{classificationResult.confidence_score}/100</span>
                        </div>
                        <div style={{ height: 10, borderRadius: 99, background: "#e2e8f0", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${classificationResult.confidence_score}%`, background: "#059669", borderRadius: 99 }} />
                        </div>
                    </div>

                    {/* Reasoning */}
                    <div style={{ padding: "12px 16px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                            <Sparkles size={13} color="#7c3aed" />
                            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Classification Reasoning</span>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{classificationResult.reasoning}</p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button onClick={() => selectCode(String(classificationResult.primary_hs))} style={{ padding: "9px 18px", borderRadius: 8, background: hsCode === String(classificationResult.primary_hs) ? "#059669" : "#16a34a", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                            {hsCode === String(classificationResult.primary_hs) ? <><CheckCircle size={13} /> Selected</> : "Confirm This Code"}
                        </button>
                    </div>
                </div>

                {/* Secondary Candidates List */}
                {candidates && candidates.length > 0 && (
                    <div className="glass-card card-shadow animate-fade-in-up delay-300" style={{ padding: 24, marginTop: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                            <FileText size={16} color="#0f172a" />
                            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Alternative Validated Candidates</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {candidates.map((c, idx) => (
                                <div key={c.hs_code} style={{ display: "flex", alignItems: "center", padding: "14px 16px", borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--bg-base)", cursor: "pointer", transition: "border-color 0.15s" }}
                                    onClick={() => selectCode(String(c.hs_code))}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = "#7c3aed")}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{c.description}</div>
                                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Option #{idx + 1}</div>
                                    </div>
                                    <span style={{ fontFamily: "monospace", fontWeight: 900, color: "#7c3aed", fontSize: 15, marginRight: 14 }}>{c.hs_code}</span>
                                    <ChevronRight size={15} color="var(--text-muted)" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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
