"use client";
import PageShell from "@/components/PageShell";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AlertCircle, TrendingUp, TrendingDown, Lightbulb, DollarSign, BarChart2, Zap, RefreshCw } from "lucide-react";

const SCENARIOS = [
    { label: "US-China Trade War +25% Tariff", dutyDelta: 25, name: "US-China +25%" },
    { label: "EU Carbon Border Adjustment Tax", dutyDelta: 8, name: "EU CBAM +8%" },
    { label: "GSP Eligibility Removed", dutyDelta: 5, name: "GSP Removed" },
    { label: "USD/CNY Rate Shock +10%", dutyDelta: 10, name: "FX Shock +10%" },
];

const MONTHS = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];

function makeData(vol: number, delta: number) {
    return MONTHS.map((m, i) => ({
        month: m,
        base: Math.round(10000 * vol / 50),
        impact: Math.round((delta * 100 + Math.sin(i * 0.8) * 400) * vol / 50),
    }));
}

const ChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 10, padding: "10px 14px", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{label}</div>
            {payload.map((p: any, i: number) => (
                <div key={i} style={{ color: p.fill, fontWeight: 600 }}>{p.name}: ${p.value.toLocaleString()}</div>
            ))}
        </div>
    );
};

const mitigations = [
    { icon: TrendingDown, label: "Re-route via Vietnam", saving: "$6,500/shipment", detail: "Full GSP duty elimination via Vietnam origin", color: "#059669" },
    { icon: Lightbulb, label: "First Sale Valuation", saving: "$1,200/shipment", detail: "Reduce dutiable value to factory price", color: "#2563eb" },
    { icon: Zap, label: "FTZ Bonded Warehouse", saving: "$3,100/month", detail: "Defer duty payment until goods are sold", color: "#7c3aed" },
];

export default function Impact() {
    const [scenarioIdx, setScenarioIdx] = useState(0);
    const [volume, setVolume] = useState(50);
    const [simulating, setSimulating] = useState(false);
    const [simDone, setSimDone] = useState(true);

    const scenario = SCENARIOS[scenarioIdx];
    const data = makeData(volume, scenario.dutyDelta);
    const monthly = Math.round(scenario.dutyDelta * 100 * volume / 50);
    const annual = monthly * 12;
    const perUnit = Math.round(monthly / volume);

    function runSim() {
        setSimulating(true);
        setSimDone(false);
        setTimeout(() => { setSimulating(false); setSimDone(true); }, 1400);
    }

    return (
        <PageShell title="Impact">
            {/* Page header */}
            <div className="animate-fade-in-up" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(225,29,72,0.08)", border: "1px solid rgba(225,29,72,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AlertCircle size={22} color="#e11d48" />
                </div>
                <div>
                    <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>Impact Analysis</h1>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Simulate tariff policy scenarios and forecast cost impacts on your trade lane</p>
                </div>
            </div>

            {/* Controls card */}
            <div className="glass-card card-shadow animate-fade-in-up delay-100" style={{ padding: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Scenario Configuration</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 16, alignItems: "end" }}>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 7 }}>Trade Policy Scenario</label>
                        <div style={{ position: "relative" }}>
                            <select
                                value={scenarioIdx}
                                onChange={e => { setScenarioIdx(Number(e.target.value)); setSimDone(false); }}
                                style={{ width: "100%", padding: "10px 32px 10px 13px", borderRadius: 9, border: "1.5px solid var(--border)", background: "#fafbfc", color: "var(--text-primary)", fontSize: 13, fontWeight: 600, appearance: "none", outline: "none", cursor: "pointer" }}
                            >
                                {SCENARIOS.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 7 }}>
                            Volume: <span style={{ color: "#2563eb" }}>{volume} units / month</span>
                        </label>
                        <input
                            type="range" min={1} max={200} value={volume}
                            onChange={e => { setVolume(Number(e.target.value)); setSimDone(false); }}
                            style={{ width: "100%", accentColor: "#2563eb", cursor: "pointer", height: 6, borderRadius: 99 }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                            <span>1</span><span>200</span>
                        </div>
                    </div>
                    <button
                        onClick={runSim}
                        disabled={simulating}
                        style={{ padding: "11px 22px", borderRadius: 10, background: simulating ? "rgba(37,99,235,0.6)" : "#2563eb", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: simulating ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}
                    >
                        {simulating ? <><RefreshCw size={14} className="animate-spin-slow" /> Simulating…</> : <><BarChart2 size={14} /> Run Simulation</>}
                    </button>
                </div>
            </div>

            {/* KPI strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {[
                    { label: "Monthly Impact", val: simDone ? `+$${monthly.toLocaleString()}` : "—", color: "#e11d48", icon: DollarSign, sub: "additional cost/month" },
                    { label: "Annual Impact", val: simDone ? `+$${annual.toLocaleString()}` : "—", color: "#d97706", icon: TrendingUp, sub: "12‑month projection" },
                    { label: "Effective Duty", val: simDone ? `${(3.5 + scenario.dutyDelta).toFixed(1)}%` : "—", color: "#2563eb", icon: BarChart2, sub: "base + new tariff" },
                    { label: "Per Unit Impact", val: simDone ? `+$${perUnit}` : "—", color: "#7c3aed", icon: Zap, sub: "cost increase/unit" },
                ].map((s, i) => (
                    <div key={s.label} className={`glass-card card-shadow animate-fade-in-up delay-${(i + 1) * 100}`} style={{ padding: "16px 18px", borderTop: `2px solid ${s.color}`, transition: "all 0.3s" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <s.icon size={15} color={s.color} />
                            </div>
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: s.val === "—" ? "var(--text-subtle)" : s.color, letterSpacing: -0.5, transition: "color 0.3s" }}>{s.val}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginTop: 3 }}>{s.label}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="glass-card card-shadow animate-fade-in-up delay-300" style={{ padding: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>12-Month Cost Projection</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
                    Scenario: <strong style={{ color: "var(--text-primary)" }}>{scenario.name}</strong> · {volume} units/month
                </div>
                <div style={{ height: 220, opacity: simulating ? 0.5 : 1, transition: "opacity 0.3s" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barSize={20}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} width={44} />
                            <Tooltip content={<ChartTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11, color: "#64748b", paddingTop: 12 }} />
                            <Bar dataKey="base" name="Base Cost" stackId="a" fill="#2563eb" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="impact" name="Tariff Impact" stackId="a" fill="#e11d48" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Mitigations */}
            <div className="glass-card card-shadow animate-fade-in-up delay-400" style={{ padding: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Mitigation Options</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                    {mitigations.map((m) => (
                        <div key={m.label} style={{ padding: 18, borderRadius: 12, border: "1.5px solid var(--border)", background: "var(--bg-base)", cursor: "pointer", transition: "border-color 0.15s, transform 0.15s" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = m.color; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${m.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <m.icon size={17} color={m.color} />
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{m.label}</span>
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 900, color: m.color, marginBottom: 5 }}>{m.saving}</div>
                            <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{m.detail}</p>
                        </div>
                    ))}
                </div>
            </div>
        </PageShell>
    );
}
