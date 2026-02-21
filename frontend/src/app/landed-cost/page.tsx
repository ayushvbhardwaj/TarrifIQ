"use client";
import PageShell from "@/components/PageShell";
import TradeSummaryHeader from "@/components/TradeSummaryHeader";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calculator, FileText, Ship, Download, Play, TrendingDown, RefreshCw } from "lucide-react";
import { useTradeContext } from "@/context/TradeContext";
import { useEffect, useState } from "react";

const highlightStyle = {
    blue: { bg: "#eff6ff", border: "#bfdbfe", left: "#2563eb", textColor: "#2563eb" },
    purple: { bg: "#faf5ff", border: "#ddd6fe", left: "#7c3aed", textColor: "#7c3aed" },
    green: { bg: "#f0fdf4", border: "#bbf7d0", left: "#059669", textColor: "#059669" },
} as const;

const fmt = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function LandedCost() {
    const { origin, dest, value, weight, transport, hsCode, description } = useTradeContext();
    const [loading, setLoading] = useState(false);
    const [apiData, setApiData] = useState<any>(null);

    useEffect(() => {
        if (!origin || !dest || !value) return;

        const fetchCost = async () => {
            setLoading(true);
            try {
                const res = await fetch("http://localhost:8000/api/landed-cost", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        product_description: description,
                        origin: origin,
                        destination: dest,
                        mode: transport.toLowerCase().includes("air") ? "air" : "sea",
                        weight_kg: Number(weight),
                        product_value: Number(value),
                        hs_code: hsCode,
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    setApiData(data.landed_cost);
                }
            } catch (err) {
                console.error("Failed to fetch landed cost:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCost();
    }, [origin, dest, value, weight, transport, hsCode, description]);

    if (!value && !loading && !apiData) {
        return (
            <PageShell title="Landed Cost">
                <TradeSummaryHeader />
                <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 36, textAlign: "center", marginTop: 20 }}>
                    <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Please enter product and routing details in the Trade Input page first.</p>
                </div>
            </PageShell>
        );
    }

    // Default static fallback if API hasn't loaded (for visual structure)
    const data = apiData || {
        product_value: Number(value) || 0,
        shipping_cost: 0,
        insurance_cost: 0,
        cif_value: 0,
        tariff_rate: 0,
        import_duty: 0,
        total_landed_cost: 0,
        distance_km: 0
    };

    const COST_ITEMS = [
        { label: "Product Base Cost", sub: "FOB value of goods", amount: data.product_value, highlight: "blue", icon: null },
        { label: "Freight Cost", sub: `${transport} (${data.distance_km} km limit)`, amount: data.shipping_cost, highlight: "green", icon: "ship" },
        { label: "Insurance & Handling", sub: "Standard premium", amount: data.insurance_cost, highlight: null, icon: null },
        { label: "Customs Duty", sub: `Tariff Rate: ${(data.tariff_rate * 100).toFixed(2)}%`, amount: data.import_duty, highlight: "purple", icon: null, note: "Applied to CIF Value" },
    ];

    const CHART_DATA = [
        { name: "Current Route", "Total Cost ($)": data.total_landed_cost },
        { name: "Optimized Target", "Total Cost ($)": data.total_landed_cost * 0.85 }, // Simulated optimization
    ];

    return (
        <PageShell title="Landed Cost">
            <TradeSummaryHeader />

            {/* Page header */}
            <div className="animate-fade-in-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Calculator size={22} color="#2563eb" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>Landed Cost Engine</h1>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Real-time duty &amp; freight calculation</p>
                    </div>
                </div>
                {loading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#2563eb', fontSize: 13, fontWeight: 600 }}>
                        <RefreshCw size={14} className="animate-spin-slow" /> Calculating live rates...
                    </div>
                )}
            </div>

            {/* ── 3 KPI Cards ────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginTop: 24 }}>
                {[
                    { label: "Total Landed Cost", value: fmt(data.total_landed_cost), sub: "Final door-to-door cost", border: "#2563eb", bg: "#eff6ff", color: "#2563eb" },
                    { label: "Total Customs Duty", value: fmt(data.import_duty), sub: `At ${(data.tariff_rate * 100).toFixed(2)}% rate`, border: "#7c3aed", bg: "#faf5ff", color: "#7c3aed" },
                    { label: "Total Logistics Cost", value: fmt(data.shipping_cost + data.insurance_cost), sub: "Freight + Insurance", border: "#059669", bg: "#f0fdf4", color: "#059669" },
                ].map((k, i) => (
                    <div key={i} className="glass-card card-shadow animate-fade-in-up" style={{ padding: "20px 22px", borderLeft: `4px solid ${k.border}`, background: k.bg }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>{k.label}</div>
                        <div style={{ fontSize: 26, fontWeight: 900, color: k.color, lineHeight: 1 }}>{loading ? "..." : k.value}</div>
                        <div style={{ fontSize: 12, color: k.color, marginTop: 6, fontWeight: 500, opacity: 0.8 }}>{k.sub}</div>
                    </div>
                ))}
            </div>

            {/* ── Mathematical Transparency Box ─────────── */}
            <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: "16px 20px", marginTop: 14, border: "1px solid #cbd5e1", background: "#f8fafc" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Transparent Calculation Formula</div>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, fontSize: 13, fontFamily: "monospace", color: "#0f172a" }}>
                    <div style={{ padding: "4px 8px", background: "#e2e8f0", borderRadius: 6 }}>Duty {fmt(data.import_duty)}</div> =
                    ( <div style={{ padding: "4px 8px", background: "#eff6ff", borderRadius: 6, color: "#2563eb" }}>Value {fmt(data.product_value)}</div> +
                    <div style={{ padding: "4px 8px", background: "#f0fdf4", borderRadius: 6, color: "#059669" }}>Freight {fmt(data.shipping_cost)}</div> +
                    <div style={{ padding: "4px 8px", background: "#f1f5f9", borderRadius: 6 }}>Insurance {fmt(data.insurance_cost)}</div> )
                    × <div style={{ padding: "4px 8px", background: "#faf5ff", borderRadius: 6, color: "#7c3aed" }}>Tariff Rate {(data.tariff_rate * 100).toFixed(2)}%</div>
                </div>
            </div>

            {/* ── Shipping Logic Transparency Box ─────────── */}
            <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: "16px 20px", marginTop: 14, border: "1px solid #bbf7d0", background: "#f0fdf4" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#059669", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Transport &amp; Freight Assumptions ({transport})</div>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, fontSize: 13, color: "#065f46", fontWeight: 500 }}>
                    <span>📦 <b>Weight:</b> {Number(weight).toLocaleString()} kg</span>
                    <span>📍 <b>Base Rate:</b> $250.00</span>
                    <span>⚖️ <b>Per Kg:</b> $6.00</span>
                    <span>🗺️ <b>Distance Multiplier:</b> {((data.distance_km || 1000) / 5000).toFixed(2)}x</span>
                    <span style={{ marginLeft: "auto", fontFamily: "monospace", background: "#dcfce7", padding: "4px 8px", borderRadius: 6 }}>
                        Cost = Base + (Weight × Per Kg × Multiplier)
                    </span>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
                {/* ── Detailed Cost Breakdown ─────────── */}
                <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                        <FileText size={17} color="#2563eb" />
                        <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Detailed Cost Breakdown</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {COST_ITEMS.map((item, i) => {
                            const hs = item.highlight ? highlightStyle[item.highlight as keyof typeof highlightStyle] : null;
                            return (
                                <div key={i} style={{
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
                                        <div style={{ fontSize: 16, fontWeight: 800, color: hs ? hs.textColor : "var(--text-primary)" }}>{loading ? "..." : fmt(item.amount)}</div>
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
                            <div style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>{loading ? "..." : fmt(data.total_landed_cost)}</div>
                        </div>
                    </div>
                </div>

                {/* ── Cost Optimization Chart ─────────── */}
                <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 24 }}>
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Route Comparison Overview</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>Live charting based on contextual pipeline</div>
                    </div>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={CHART_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 13, fontWeight: 600, fill: "#334155" }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                            <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, "Total Cost"]} contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13 }} />
                            <Bar dataKey="Total Cost ($)" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </PageShell>
    );
}
