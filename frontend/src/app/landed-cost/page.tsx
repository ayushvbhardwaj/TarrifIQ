"use client";
import PageShell from "@/components/PageShell";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Calculator, TrendingDown, DollarSign, BarChart2, ArrowRight } from "lucide-react";

const lineItems = [
    { label: "Product Cost", amount: 10000, color: "#2563eb", pct: 76.3 },
    { label: "Sea Freight", amount: 800, color: "#7c3aed", pct: 6.1 },
    { label: "Marine Insurance", amount: 120, color: "#0891b2", pct: 0.9 },
    { label: "Customs Duty (3.5%)", amount: 381, color: "#d97706", pct: 2.9 },
    { label: "Import VAT (10%)", amount: 1130, color: "#ea580c", pct: 8.6 },
    { label: "Customs Clearance", amount: 250, color: "#64748b", pct: 1.9 },
    { label: "Port Handling", amount: 180, color: "#475569", pct: 1.4 },
    { label: "Last Mile Delivery", amount: 240, color: "#94a3b8", pct: 1.8 },
];

const total = lineItems.reduce((s, i) => s + i.amount, 0);
const optimized = 11500;
const saving = total - optimized;

const PieTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 10, padding: "8px 14px", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <span style={{ color: payload[0].payload.color, fontWeight: 700 }}>{payload[0].name}</span>
            <span style={{ marginLeft: 8, color: "#0f172a", fontWeight: 700 }}>${payload[0].value.toLocaleString()}</span>
        </div>
    );
};

export default function LandedCost() {
    return (
        <PageShell title="Landed Cost">
            {/* Page header */}
            <div className="animate-fade-in-up" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Calculator size={22} color="#2563eb" />
                </div>
                <div>
                    <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>Landed Cost</h1>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Full cost breakdown — factory to destination for HS 8471.30 / China → USA</p>
                </div>
                <button style={{ marginLeft: "auto", padding: "9px 18px", borderRadius: 9, background: "#2563eb", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
                    Apply Optimization <ArrowRight size={14} />
                </button>
            </div>

            {/* KPI strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {[
                    { label: "Total Landed Cost", val: `$${total.toLocaleString()}`, color: "#2563eb", icon: DollarSign, sub: "current route" },
                    { label: "Optimized Cost", val: `$${optimized.toLocaleString()}`, color: "#059669", icon: TrendingDown, sub: "AI-optimized route" },
                    { label: "Potential Saving", val: `$${saving.toLocaleString()}`, color: "#d97706", icon: BarChart2, sub: `${((saving / total) * 100).toFixed(1)}% reduction` },
                    { label: "Effective Duty Rate", val: "13.5%", color: "#7c3aed", icon: Calculator, sub: "duty + VAT combined" },
                ].map((s, i) => (
                    <div key={s.label} className={`glass-card card-shadow animate-fade-in-up delay-${(i + 1) * 100}`} style={{ padding: "16px 18px", borderTop: `2px solid ${s.color}` }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <s.icon size={15} color={s.color} />
                            </div>
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: -0.5 }}>{s.val}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginTop: 3 }}>{s.label}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{s.sub}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, alignItems: "start" }}>
                {/* Line items */}
                <div className="glass-card card-shadow animate-fade-in-up delay-300" style={{ padding: 24 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Cost Components</div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {lineItems.map((item) => (
                            <div key={item.label} style={{ display: "flex", alignItems: "center", padding: "13px 0", borderBottom: "1px solid var(--border)", gap: 14 }}>
                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{item.label}</div>
                                </div>
                                <div style={{ width: 120, height: 6, borderRadius: 99, background: "var(--border)", overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 99, maxWidth: "100%" }} />
                                </div>
                                <div style={{ textAlign: "right", minWidth: 90 }}>
                                    <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)" }}>${item.amount.toLocaleString()}</div>
                                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.pct}%</div>
                                </div>
                            </div>
                        ))}
                        {/* Total */}
                        <div style={{ display: "flex", alignItems: "center", padding: "16px 0", gap: 14 }}>
                            <div style={{ width: 10, height: 10 }} />
                            <div style={{ flex: 1, fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>Total Landed Cost</div>
                            <div style={{ width: 120 }} />
                            <div style={{ textAlign: "right", minWidth: 90 }}>
                                <div style={{ fontSize: 22, fontWeight: 900, color: "#2563eb" }}>${total.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: chart + comparison */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Donut */}
                    <div className="glass-card card-shadow animate-fade-in-up delay-400" style={{ padding: 22 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Cost Composition</div>
                        <div style={{ height: 200, position: "relative" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={lineItems} dataKey="amount" nameKey="label" innerRadius={60} outerRadius={90} paddingAngle={3} stroke="none">
                                        {lineItems.map((item, i) => <Cell key={i} fill={item.color} />)}
                                    </Pie>
                                    <Tooltip content={<PieTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                                <div style={{ fontSize: 18, fontWeight: 900, color: "#2563eb" }}>${total.toLocaleString()}</div>
                                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>total</div>
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginTop: 8 }}>
                            {lineItems.slice(0, 4).map(i => (
                                <div key={i.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-muted)" }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: i.color, flexShrink: 0 }} />
                                    {i.label.split(" ")[0]}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Savings card */}
                    <div className="glass-card card-shadow animate-fade-in-up delay-500" style={{ padding: 20, background: "rgba(5,150,105,0.04)", border: "1.5px solid rgba(5,150,105,0.2)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                            <TrendingDown size={16} color="#059669" />
                            <span style={{ fontWeight: 700, fontSize: 14, color: "#059669" }}>Optimization Opportunity</span>
                        </div>
                        {[["Current total", `$${total.toLocaleString()}`, "var(--text-primary)"], ["Optimized total", `$${optimized.toLocaleString()}`, "#059669"]].map(([k, v, c]) => (
                            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                                <span style={{ color: "var(--text-muted)" }}>{k}</span>
                                <span style={{ fontWeight: 700, color: c as string }}>{v}</span>
                            </div>
                        ))}
                        <div style={{ borderTop: "1px solid rgba(5,150,105,0.2)", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>You save</span>
                            <span style={{ fontSize: 20, fontWeight: 900, color: "#059669" }}>${saving.toLocaleString()}</span>
                        </div>
                        <button style={{ marginTop: 14, width: "100%", padding: "11px 0", borderRadius: 10, background: "#059669", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                            Apply Optimization <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
