"use client";
import PageShell from "@/components/PageShell";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calculator, FileText, Ship, Download, Play, TrendingDown } from "lucide-react";

/* ── Data ───────────────────────────────────────── */
const COST_ITEMS = [
    { label: "Product Base Cost", sub: "FOB value of goods", amount: 10000, highlight: "blue", icon: null },
    { label: "Customs Duty", sub: "HS 6109.10.00 @ 16.5%", amount: 1650, highlight: "purple", icon: null, note: "16.5% of CIF" },
    { label: "Import VAT/GST", sub: "Standard rate 18%", amount: 1200, highlight: null, icon: null },
    { label: "GST (Goods & Services Tax)", sub: "Additional 8%", amount: 800, highlight: null, icon: null },
    { label: "Additional Cess/Surcharge", sub: "Special levy 1.5%", amount: 150, highlight: null, icon: null },
    { label: "Freight Cost (Sea)", sub: "30 days transit time", amount: 1500, highlight: "green", icon: "ship" },
    { label: "Insurance Cost", sub: "3% of CIF value", amount: 300, highlight: null, icon: null },
    { label: "Port Handling Fees", sub: "", amount: 200, highlight: null, icon: null },
    { label: "Documentation Fees", sub: "", amount: 100, highlight: null, icon: null },
];

const SCENARIOS = [
    { name: "Sea Freight (Current)", product: 10000, duties: 1650, taxes: 2150, freight: 1500, other: 600, total: 15900, transit: "30 days", current: true },
    { name: "Air Freight", product: 10000, duties: 1650, taxes: 2150, freight: 3800, other: 600, total: 18200, transit: "5 days", current: false },
    { name: "Alternative Origin (Vietnam)", product: 9500, duties: 0, taxes: 1900, freight: 1400, other: 600, total: 13400, transit: "28 days", current: false, best: true },
];

const CHART_DATA = [
    { name: "Current Route", "Total Cost ($)": 15900 },
    { name: "Optimized", "Total Cost ($)": 12400 },
    { name: "Savings", "Total Cost ($)": 3500 },
];

const highlightStyle = {
    blue: { bg: "#eff6ff", border: "#bfdbfe", left: "#2563eb", textColor: "#2563eb" },
    purple: { bg: "#faf5ff", border: "#ddd6fe", left: "#7c3aed", textColor: "#7c3aed" },
    green: { bg: "#f0fdf4", border: "#bbf7d0", left: "#059669", textColor: "#059669" },
} as const;

const fmt = (n: number) => `$${n.toLocaleString()}`;

/* ── Component ──────────────────────────────────── */
export default function LandedCost() {
    return (
        <PageShell title="Landed Cost">
            {/* Page header */}
            <div className="animate-fade-in-up" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Calculator size={22} color="#2563eb" />
                </div>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>Landed Cost</h1>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Total landed cost calculator with optimization analysis</p>
                </div>
            </div>

            {/* ── Banner ─────────────────────────── */}
            <div className="animate-fade-in-up delay-100" style={{ padding: "20px 26px", borderRadius: 14, background: "#f0fdf4", border: "1.5px solid #bbf7d0", display: "flex", alignItems: "center", gap: 14 }}>
                <Calculator size={20} color="#059669" />
                <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>Total Landed Cost Calculator</div>
                    <div style={{ fontSize: 13, color: "#059669", marginTop: 2, fontWeight: 500 }}>Business value engine with comprehensive cost analysis</div>
                </div>
            </div>

            {/* ── 3 KPI Cards ────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                {[
                    { label: "Total Landed Cost", value: "$15,900", sub: "For 1,000 units", border: "#2563eb", bg: "#eff6ff", color: "#2563eb" },
                    { label: "Cost Per Unit", value: "$15.90", sub: "Including all charges", border: "#059669", bg: "#f0fdf4", color: "#059669" },
                    { label: "Optimization Potential", value: "$3,500", sub: "22% reduction available", border: "#7c3aed", bg: "#faf5ff", color: "#7c3aed" },
                ].map(k => (
                    <div key={k.label} className="glass-card card-shadow animate-fade-in-up" style={{ padding: "20px 22px", borderLeft: `4px solid ${k.border}`, background: k.bg }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>{k.label}</div>
                        <div style={{ fontSize: 30, fontWeight: 900, color: k.color, lineHeight: 1 }}>{k.value}</div>
                        <div style={{ fontSize: 12, color: k.color, marginTop: 6, fontWeight: 500, opacity: 0.8 }}>{k.sub}</div>
                    </div>
                ))}
            </div>

            {/* ── Detailed Cost Breakdown ─────────── */}
            <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                    <FileText size={17} color="#2563eb" />
                    <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Detailed Cost Breakdown</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {COST_ITEMS.map(item => {
                        const hs = item.highlight ? highlightStyle[item.highlight as keyof typeof highlightStyle] : null;
                        return (
                            <div key={item.label} style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "14px 16px", borderRadius: 10,
                                background: hs ? hs.bg : "var(--bg-base)",
                                border: `1px solid ${hs ? hs.border : "var(--border)"}`,
                                borderLeft: hs ? `4px solid ${hs.left}` : "1px solid var(--border)",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    {item.icon === "ship" && <Ship size={18} color="#059669" />}
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: hs ? hs.textColor : "var(--text-primary)" }}>{item.label}</div>
                                        {item.sub && <div style={{ fontSize: 12, color: hs ? hs.textColor : "var(--text-muted)", marginTop: 2, fontWeight: 500, opacity: hs ? 0.8 : 1 }}>{item.sub}</div>}
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: hs ? hs.textColor : "var(--text-primary)" }}>{fmt(item.amount)}</div>
                                    {item.note && <div style={{ fontSize: 11, color: hs ? hs.textColor : "var(--text-muted)", fontWeight: 500, opacity: 0.75 }}>{item.note}</div>}
                                </div>
                            </div>
                        );
                    })}
                    {/* Total row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", marginTop: 4 }}>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: 1 }}>TOTAL LANDED COST</div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>All-inclusive final cost</div>
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>$15,900</div>
                    </div>
                </div>
            </div>

            {/* ── Cost Optimization Chart ─────────── */}
            <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 24 }}>
                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Cost Optimization Analysis</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>Comparison between current and optimized scenarios</div>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={CHART_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 13, fontWeight: 600, fill: "#334155" }} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                        <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, "Total Cost"]} contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13 }} />
                        <Legend wrapperStyle={{ fontSize: 13, fontWeight: 600 }} />
                        <Bar dataKey="Total Cost ($)" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* ── Multi-Scenario Comparison ───────── */}
            <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                    <TrendingDown size={18} color="#059669" />
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Multi-Scenario Comparison</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Route &amp; mode analysis with cost-time tradeoffs</div>
                    </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid var(--border)" }}>
                                {["Scenario", "Product", "Duties", "Taxes", "Freight", "Other", "Total", "Transit"].map(h => (
                                    <th key={h} style={{ padding: "10px 12px", textAlign: h === "Scenario" ? "left" : "right", fontWeight: 700, color: "var(--text-muted)", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.7 }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {SCENARIOS.map((s, i) => (
                                <tr key={s.name} style={{ borderBottom: i < SCENARIOS.length - 1 ? "1px solid var(--border)" : "none", background: s.best ? "#f0fdf4" : "transparent" }}>
                                    <td style={{ padding: "14px 12px", fontWeight: 700, color: "var(--text-primary)" }}>{s.name}</td>
                                    <td style={{ padding: "14px 12px", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>{fmt(s.product)}</td>
                                    <td style={{ padding: "14px 12px", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>{fmt(s.duties)}</td>
                                    <td style={{ padding: "14px 12px", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>{fmt(s.taxes)}</td>
                                    <td style={{ padding: "14px 12px", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>{fmt(s.freight)}</td>
                                    <td style={{ padding: "14px 12px", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>{fmt(s.other)}</td>
                                    <td style={{ padding: "14px 12px", textAlign: "right", fontWeight: 900, color: "var(--text-primary)", fontSize: 15 }}>{fmt(s.total)}</td>
                                    <td style={{ padding: "14px 12px", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>{s.transit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Recommendation */}
                <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", borderLeft: "4px solid #059669" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#059669", marginBottom: 4 }}>💡 Recommended: Switch to Vietnam sourcing</div>
                    <div style={{ fontSize: 13, color: "#059669", fontWeight: 500 }}>Save $2,500 (15.7%) with FTA benefits and faster transit</div>
                </div>
            </div>

            {/* ── Action Buttons ──────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <button style={{ padding: "16px", borderRadius: 12, background: "#2563eb", border: "none", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Download size={18} /> Export Cost Analysis Report (PDF)
                </button>
                <button style={{ padding: "16px", borderRadius: 12, background: "#fff", border: "2px solid #2563eb", color: "#2563eb", fontWeight: 800, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Play size={18} /> Run What-If Simulation
                </button>
            </div>
        </PageShell>
    );
}
