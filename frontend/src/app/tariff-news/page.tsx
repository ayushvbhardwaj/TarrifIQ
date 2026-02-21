"use client";
import PageShell from "@/components/PageShell";
import { Newspaper, ExternalLink, Bell, Radio, Filter } from "lucide-react";

const news = [
    { tag: "HIGH IMPACT", tagColor: "#e11d48", tagBg: "rgba(225,29,72,0.08)", tagBorder: "rgba(225,29,72,0.2)", headline: "US Imposes 25% Additional Tariff on Chinese Electronics", summary: "The USTR announced new Section 301 tariffs on electronics imports from China, effective March 1, 2026. Products under HS 8471 are directly affected — importers should take immediate action.", source: "Reuters", date: "Feb 20, 2026", relevant: true },
    { tag: "MEDIUM", tagColor: "#d97706", tagBg: "rgba(217,119,6,0.08)", tagBorder: "rgba(217,119,6,0.2)", headline: "EU Extends GSP Scheme Through 2027", summary: "The European Commission confirmed a two-year extension of the Generalized System of Preferences, keeping duty-free access open for 67 developing nations exporting electronics and textiles.", source: "European Commission", date: "Feb 18, 2026", relevant: false },
    { tag: "LOW", tagColor: "#059669", tagBg: "rgba(5,150,105,0.08)", tagBorder: "rgba(5,150,105,0.2)", headline: "India-UAE CEPA: Duty Cuts on Electronics Kick In", summary: "Under the CEPA framework, electronics exports from India to UAE now qualify for 0-3% preferential duty, down from 5%. Covers HS chapters 84 and 85.", source: "Ministry of Commerce India", date: "Feb 15, 2026", relevant: false },
    { tag: "INFO", tagColor: "#2563eb", tagBg: "rgba(37,99,235,0.08)", tagBorder: "rgba(37,99,235,0.2)", headline: "WCO HS 2025 Nomenclature Updates — March 1 Deadline", summary: "The World Customs Organization published the final HS 2025 correlation table. 351 HS codes were modified. Verify your existing classifications before the March 1 effective date.", source: "World Customs Organization", date: "Feb 10, 2026", relevant: true },
    { tag: "HIGH IMPACT", tagColor: "#e11d48", tagBg: "rgba(225,29,72,0.08)", tagBorder: "rgba(225,29,72,0.2)", headline: "Vietnam Upgraded to GSP+ — Full Tariff Elimination", summary: "The US Trade Representative upgraded Vietnam to GSP+ status. Electronics exports (HS 84-85) now qualify for complete tariff elimination, making Vietnam routes highly attractive.", source: "USTR", date: "Feb 8, 2026", relevant: true },
];

const alerts = [
    { headline: "25% tariff directly affects HS 8471.30 (your product)", date: "Feb 20", color: "#e11d48" },
    { headline: "HS 2025 update may reclassify your current HS code", date: "Feb 10", color: "#d97706" },
    { headline: "Vietnam GSP+ could eliminate duty on an alternative route", date: "Feb 8", color: "#059669" },
];

const toggles = ["New tariffs on HS 8471.30", "China → USA trade policy", "GSP eligibility changes", "HS code updates"];

export default function TariffNews() {
    return (
        <PageShell title="Tariff News">
            {/* Page header */}
            <div className="animate-fade-in-up" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Newspaper size={22} color="#2563eb" />
                </div>
                <div>
                    <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>Tariff News</h1>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Live global trade intelligence filtered for your products and lanes</p>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#059669", background: "rgba(5,150,105,0.08)", padding: "6px 12px", borderRadius: 99, border: "1px solid rgba(5,150,105,0.2)" }}>
                        <Radio size={12} /> Live Feed
                    </div>
                    <button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--text-muted)", background: "var(--bg-surface)", padding: "6px 12px", borderRadius: 99, border: "1.5px solid var(--border)", cursor: "pointer" }}>
                        <Filter size={12} /> Filter
                    </button>
                </div>
            </div>

            {/* KPI strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {[
                    { label: "Updates This Week", val: news.length, color: "#2563eb", sub: "across all sources" },
                    { label: "High Impact", val: news.filter(n => n.tag === "HIGH IMPACT").length, color: "#e11d48", sub: "immediate action" },
                    { label: "Affects Your Route", val: news.filter(n => n.relevant).length, color: "#d97706", sub: "personalized alerts" },
                    { label: "Sources Monitored", val: "34", color: "#059669", sub: "real-time feeds" },
                ].map((s, i) => (
                    <div key={s.label} className={`glass-card card-shadow animate-fade-in-up delay-${(i + 1) * 100}`} style={{ padding: "16px 18px", borderTop: `2px solid ${s.color}` }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: -0.5 }}>{s.val}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginTop: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{s.sub}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, alignItems: "start" }}>
                {/* News feed */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: 1 }}>Global Trade Intelligence</div>
                    {news.map((n, i) => (
                        <div key={i} className={`glass-card card-shadow shimmer-hover animate-fade-in-up delay-${(i + 1) * 100}`} style={{ padding: 22, cursor: "pointer", borderLeft: `4px solid ${n.tagColor}` }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 10 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: n.tagBg, color: n.tagColor, border: `1px solid ${n.tagBorder}`, whiteSpace: "nowrap" }}>{n.tag}</span>
                                    {n.relevant && <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 99, background: "rgba(37,99,235,0.08)", color: "#2563eb", border: "1px solid rgba(37,99,235,0.2)", whiteSpace: "nowrap" }}>Affects Your Route</span>}
                                </div>
                                <span style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap", flexShrink: 0 }}>{n.date}</span>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 8, lineHeight: 1.4 }}>{n.headline}</div>
                            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 12 }}>{n.summary}</p>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 12, color: "var(--text-subtle)", fontWeight: 500 }}>{n.source}</span>
                                <button style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#2563eb", background: "none", border: "none", cursor: "pointer" }}>
                                    Read full article <ExternalLink size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right rail */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div className="glass-card card-shadow animate-fade-in-up delay-300" style={{ padding: 20 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Your Alerts</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>Matched to HS 8471.30 · China → USA</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {alerts.map((a, i) => (
                                <div key={i} style={{ padding: "12px 14px", borderRadius: 10, border: "1.5px solid var(--border)", borderLeft: `4px solid ${a.color}`, background: "var(--bg-base)" }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4, marginBottom: 3 }}>{a.headline}</div>
                                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{a.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card card-shadow animate-fade-in-up delay-400" style={{ padding: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                            <Bell size={14} color="#2563eb" />
                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: 1 }}>Alert Settings</div>
                        </div>
                        {toggles.map((s) => (
                            <div key={s} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border)", fontSize: 12 }}>
                                <span style={{ color: "var(--text-muted)" }}>{s}</span>
                                <div style={{ width: 36, height: 20, borderRadius: 99, background: "#2563eb", position: "relative", cursor: "pointer", flexShrink: 0 }}>
                                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, right: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
