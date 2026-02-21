"use client";
import PageShell from "@/components/PageShell";
import TradeSummaryHeader from "@/components/TradeSummaryHeader";
import { useState, useEffect } from "react";
import {
    ShieldCheck, Globe, FileText, AlertTriangle,
    CheckCircle, XCircle, AlertCircle, Scale,
    CheckSquare, Square, Download, RefreshCw, Info
} from "lucide-react";
import { useTradeContext } from "@/context/TradeContext";

const statusStyle = {
    Obtained: { bg: "#0f172a", color: "#fff" },
    Pending: { bg: "#f1f5f9", color: "#475569" },
    "N/A": { bg: "#f1f5f9", color: "#94a3b8" },
} as const;

const riskColors = {
    Low: { bg: "#f0fdf4", border: "#bbf7d0", badge: "#059669", icon: "#059669", text: "Low Risk" },
    Medium: { bg: "#fffbeb", border: "#fcd34d", badge: "#d97706", icon: "#d97706", text: "Medium Risk" },
    High: { bg: "#fef2f2", border: "#fca5a5", badge: "#ef4444", icon: "#ef4444", text: "High Risk" },
    Critical: { bg: "#fef2f2", border: "#f87171", badge: "#b91c1c", icon: "#b91c1c", text: "Critical Risk" },
} as const;

/* ── Component ─────────────────────────────────────── */
export default function Compliance() {
    const { origin, dest, hsCode, description } = useTradeContext();
    const [loading, setLoading] = useState(false);
    const [apiData, setApiData] = useState<any>(null);
    const [checks, setChecks] = useState<{ label: string, done: boolean }[]>([]);

    useEffect(() => {
        if (!origin || !dest || !hsCode) return;

        const fetchCompliance = async () => {
            setLoading(true);
            try {
                const res = await fetch("http://localhost:8000/api/compliance", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        product_description: description,
                        destination: dest
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    setApiData(data);
                    if (data?.compliance_checklist) {
                        setChecks(data.compliance_checklist.map((c: any) => ({
                            label: c.requirement_title,
                            done: false
                        })));
                    }
                }
            } catch (err) {
                console.error("Failed to fetch compliance:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompliance();
    }, [origin, dest, hsCode, description]);

    const toggle = (i: number) =>
        setChecks(prev => prev.map((c, idx) => idx === i ? { ...c, done: !c.done } : c));

    const doneCount = checks.filter(c => c.done).length;

    if (!origin && !loading && !apiData) {
        return (
            <PageShell title="Compliance">
                <TradeSummaryHeader />
                <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 36, textAlign: "center", marginTop: 20 }}>
                    <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Please enter routing details and obtain an HS Code in the Trade Input page first.</p>
                </div>
            </PageShell>
        );
    }

    const data = apiData || {
        risk_level: "Medium",
        compliance_checklist: [],
        estimated_complexity: "5",
        summary_advice: "Awaiting analysis..."
    };

    const riskColorConfig = riskColors[data.risk_level as keyof typeof riskColors] || riskColors.Medium;

    return (
        <PageShell title="Compliance">
            <TradeSummaryHeader />

            {/* ── Page header ─────────────────────── */}
            <div className="animate-fade-in-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ShieldCheck size={22} color="#059669" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>Regulatory Compliance</h1>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Live AI assessment of import/export restrictions and required documentation</p>
                    </div>
                </div>
                {loading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#059669', fontSize: 13, fontWeight: 600 }}>
                        <RefreshCw size={14} className="animate-spin-slow" /> Running compliance checks...
                    </div>
                )}
            </div>

            {/* ── Compliance Engine Banner ─────────── */}
            <div className="animate-fade-in-up delay-100" style={{ padding: "20px 26px", marginTop: 24, borderRadius: 14, background: riskColorConfig.bg, border: `1.5px solid ${riskColorConfig.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 12 }}>
                    <Globe size={20} color={riskColorConfig.icon} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>RegTech Validation Engine</div>
                        <div style={{ fontSize: 13, color: riskColorConfig.icon, marginTop: 3, fontWeight: 500, lineHeight: 1.4 }}>
                            {loading ? `Live validation against ${dest} customs border policies for HS ${hsCode}` : data.summary_advice}
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: "right", marginLeft: 20, padding: "12px 20px", borderRadius: 12, background: "#fff", border: `1.5px solid ${riskColorConfig.border}` }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1 }}>Risk Level</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: riskColorConfig.badge, lineHeight: 1.1 }}>{loading ? "..." : riskColorConfig.text}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginTop: 4 }}>Complexity: {loading ? "-" : data.estimated_complexity}/10</div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
                {/* ── Regulatory Risk Scoring & Red Flags ─ */}
                <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                        <AlertCircle size={18} color="#dc2626" />
                        <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Detailed Compliance Requirements</div>
                    </div>
                    {data.compliance_checklist && data.compliance_checklist.length === 0 ? (
                        <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No major regulatory requirements detected.</div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            {data.compliance_checklist?.map((c: any, i: number) => {
                                const level = c.is_mandatory ? "High" : "Low";
                                const rc = riskColors[level];
                                return (
                                    <div key={i} style={{ padding: "16px 18px", borderRadius: 12, background: "#fff", border: `1.5px solid var(--border)`, borderLeft: `4px solid ${rc.badge}` }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                            <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: rc.badge, color: "#fff" }}>{c.is_mandatory ? "Mandatory" : "Recommended"}</span>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>{c.category}</span>
                                        </div>
                                        <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>{c.requirement_title}</div>
                                        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{c.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Compliance Checklist Generator ───── */}
                <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 24, alignSelf: "start" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Scale size={18} color="#2563eb" />
                            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Actionable Tasks</div>
                        </div>
                        <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{doneCount}/{checks.length} complete</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {checks.length === 0 && !loading && (
                            <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No special documentation required.</div>
                        )}
                        {checks.map((c, i) => (
                            <div key={i} onClick={() => toggle(i)} style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "14px 4px", cursor: "pointer",
                                borderBottom: i < checks.length - 1 ? "1px solid var(--border)" : "none",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    {c.done
                                        ? <CheckSquare size={20} color="#2563eb" style={{ flexShrink: 0 }} />
                                        : <Square size={20} color="var(--text-subtle)" style={{ flexShrink: 0 }} />}
                                    <span style={{
                                        fontSize: 14, fontWeight: 600, lineHeight: 1.4,
                                        color: c.done ? "var(--text-subtle)" : "var(--text-primary)",
                                        textDecoration: c.done ? "line-through" : "none",
                                    }}>{c.label}</span>
                                </div>
                                {c.done && <CheckCircle size={18} color="#059669" style={{ flexShrink: 0, marginLeft: 12 }} />}
                            </div>
                        ))}
                    </div>

                    {/* Export button */}
                    <button style={{
                        marginTop: 20, width: "100%", padding: "14px",
                        borderRadius: 10, background: "#2563eb", border: "none",
                        color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}>
                        <Download size={18} />
                        Export Audit-Ready Compliance Report
                    </button>
                    {/* Traceability Disclaimer */}
                    <div style={{ fontSize: 11, textAlign: "center", marginTop: 12, color: "var(--text-muted)", fontWeight: 500, display: "flex", alignItems: "flex-start", gap: 6 }}>
                        <Info size={14} style={{ flexShrink: 0, marginTop: 1, color: "#2563eb" }} />
                        <span style={{ textAlign: "left" }}>
                            Risk levels and requirements are synthetically generated from AI web-search context regarding import controls for {description} in {dest}. Verify with official customs authorities.
                        </span>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
