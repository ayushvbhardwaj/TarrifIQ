"use client";
import PageShell from "@/components/PageShell";
import { useState } from "react";
import { TrendingUp, Sparkles, Check, ArrowRight, DollarSign, Clock, ShieldCheck, Zap } from "lucide-react";

type Route = { origin: string; dest: string; method: string; cost: number; days: number; risk: "Low" | "Medium" | "High"; duty: string; };

const ORIGINAL: Route = { origin: "China", dest: "USA", method: "Air Freight", cost: 18000, days: 3, risk: "High", duty: "3.5%" };

const ALTERNATIVES: (Route & { saving: number; pct: number; recommended: boolean })[] = [
    { origin: "Vietnam", dest: "USA", method: "Sea Freight", cost: 11500, days: 22, risk: "Low", duty: "0% (GSP)", saving: 6500, pct: 36, recommended: true },
    { origin: "India", dest: "USA", method: "Sea Freight", cost: 12100, days: 18, risk: "Low", duty: "0%", saving: 5900, pct: 33, recommended: false },
    { origin: "China", dest: "USA", method: "Sea Freight", cost: 13500, days: 20, risk: "Medium", duty: "3.5%", saving: 4500, pct: 25, recommended: false },
    { origin: "China", dest: "USA", method: "Rail", cost: 15200, days: 15, risk: "Medium", duty: "3.5%", saving: 2800, pct: 16, recommended: false },
];

const riskColor = { Low: "#059669", Medium: "#d97706", High: "#e11d48" } as const;
const riskBg = { Low: "rgba(5,150,105,0.08)", Medium: "rgba(217,119,6,0.08)", High: "rgba(225,29,72,0.08)" } as const;

export default function Optimize() {
    const [current, setCurrent] = useState<Route>(ORIGINAL);
    const [applied, setApplied] = useState<string | null>(null);

    function applyRoute(r: typeof ALTERNATIVES[0]) {
        setCurrent({ origin: r.origin, dest: r.dest, method: r.method, cost: r.cost, days: r.days, risk: r.risk, duty: r.duty });
        setApplied(`${r.origin}-${r.method}`);
    }

    const isOptimized = current !== ORIGINAL;
    const saving = isOptimized ? ORIGINAL.cost - current.cost : 0;

    return (
        <PageShell title="Optimize">
            <div className="animate-fade-in-up" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TrendingUp size={22} color="#2563eb" />
                </div>
                <div>
                    <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>Optimize</h1>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Compare trade routes and apply AI-recommended cost optimizations</p>
                </div>
                {isOptimized && (
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.08)", padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(5,150,105,0.2)" }}>
                        <Check size={15} /> Route optimized — saving ${saving.toLocaleString()}
                    </div>
                )}
            </div>

            {/* KPI strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                {[
                    { label: "Current Cost", val: `$${current.cost.toLocaleString()}`, color: isOptimized ? "#059669" : "#e11d48", icon: DollarSign, sub: `${current.origin} → ${current.dest}` },
                    { label: "Best Alternative", val: "$11,500", color: "#059669", icon: TrendingUp, sub: "Vietnam → USA Sea" },
                    { label: "Max Saving", val: "$6,500", color: "#d97706", icon: Zap, sub: "36% cost reduction" },
                    { label: "Routes Analysed", val: "4", color: "#7c3aed", icon: ShieldCheck, sub: "AI screened" },
                ].map((s, i) => (
                    <div key={s.label} className={`glass-card card-shadow animate-fade-in-up delay-${(i + 1) * 100}`} style={{ padding: "16px 18px", borderTop: `2px solid ${s.color}`, transition: "border-color 0.3s" }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, transition: "background 0.3s" }}>
                            <s.icon size={15} color={s.color} />
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: -0.5, transition: "color 0.3s" }}>{s.val}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginTop: 3 }}>{s.label}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* Current Route */}
            <div className="glass-card card-shadow animate-fade-in-up delay-300" style={{ padding: 22, borderLeft: `4px solid ${riskColor[current.risk]}`, background: `${riskBg[current.risk]}`, transition: "all 0.4s ease" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: riskColor[current.risk], textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, transition: "color 0.3s" }}>
                            {isOptimized ? "Optimized Route" : "Current Route"}
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>
                            {current.origin} → {current.dest}
                            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginLeft: 10 }}>via {current.method}</span>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 24, textAlign: "center" }}>
                        <div><div style={{ fontSize: 22, fontWeight: 900, color: riskColor[current.risk], transition: "color 0.3s" }}>${current.cost.toLocaleString()}</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>total cost</div></div>
                        <div><div style={{ fontSize: 22, fontWeight: 900, color: "var(--text-primary)" }}>{current.days}d</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>transit</div></div>
                        <div>
                            <div style={{ display: "inline-flex", padding: "5px 14px", borderRadius: 99, fontSize: 13, fontWeight: 700, background: riskBg[current.risk], color: riskColor[current.risk], transition: "all 0.3s" }}>{current.risk} Risk</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>Duty: {current.duty}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI recommendation */}
            <div className="animate-fade-in-up delay-400" style={{ background: "rgba(37,99,235,0.05)", border: "1.5px solid rgba(37,99,235,0.2)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(37,99,235,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Sparkles size={18} color="#2563eb" />
                </div>
                <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#2563eb" }}>AI Recommendation: </span>
                    <span style={{ fontSize: 13, color: "var(--text-primary)" }}>Switch to <strong>Vietnam → USA Sea Freight</strong>. Save </span>
                    <span style={{ fontWeight: 800, color: "#059669", fontSize: 14 }}>$6,500 (36%)</span>
                    <span style={{ fontSize: 13, color: "var(--text-primary)" }}> with full GSP duty elimination and low supply-chain risk.</span>
                </div>
                <button onClick={() => applyRoute(ALTERNATIVES[0])} style={{ padding: "9px 18px", borderRadius: 9, background: "#2563eb", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    Apply <ArrowRight size={14} />
                </button>
            </div>

            {/* Alternatives */}
            <div className="glass-card card-shadow animate-fade-in-up delay-500" style={{ padding: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Alternative Routes</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {ALTERNATIVES.map((r) => {
                        const key = `${r.origin}-${r.method}`;
                        const isApplied = applied === key;
                        return (
                            <div key={key} style={{ display: "grid", gridTemplateColumns: "1fr 130px 110px 100px 120px 100px 100px", gap: "0 12px", padding: "16px 18px", borderRadius: 12, alignItems: "center", background: isApplied ? "rgba(5,150,105,0.04)" : r.recommended ? "rgba(37,99,235,0.04)" : "var(--bg-base)", border: `1.5px solid ${isApplied ? "rgba(5,150,105,0.25)" : r.recommended ? "rgba(37,99,235,0.25)" : "var(--border)"}`, transition: "all 0.2s" }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{r.origin} → {r.dest}</span>
                                        {r.recommended && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: "rgba(37,99,235,0.1)", color: "#2563eb", border: "1px solid rgba(37,99,235,0.2)" }}>BEST</span>}
                                    </div>
                                    <div style={{ fontSize: 12, color: "#059669", fontWeight: 600, marginTop: 2 }}>Save ${r.saving.toLocaleString()} ({r.pct}%)</div>
                                </div>
                                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{r.method}</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: r.duty.includes("0%") ? "#059669" : "var(--text-primary)" }}>{r.duty}</span>
                                <span style={{ fontSize: 15, fontWeight: 900, color: "var(--text-primary)" }}>${r.cost.toLocaleString()}</span>
                                <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}><Clock size={11} />{r.days} days</span>
                                <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700, background: riskBg[r.risk], color: riskColor[r.risk] }}>{r.risk}</span>
                                <button onClick={() => applyRoute(r)} style={{ padding: "8px 0", borderRadius: 9, background: isApplied ? "#059669" : r.recommended ? "#2563eb" : "rgba(0,0,0,0.05)", border: "none", color: isApplied || r.recommended ? "#fff" : "var(--text-muted)", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.2s" }}>
                                    {isApplied ? <><Check size={12} /> Applied</> : "Apply"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </PageShell>
    );
}
