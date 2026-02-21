"use client";
import PageShell from "@/components/PageShell";
import { useState } from "react";
import { Zap, AlertTriangle, AlertCircle, Info, CheckCircle, Bell, Settings } from "lucide-react";

type Sev = "critical" | "warning" | "info";

const INITIAL_ALERTS: { id: number; severity: Sev; title: string; detail: string; time: string; read: boolean }[] = [
    { id: 1, severity: "critical", title: "25% Tariff on HS 8471.30 Effective March 1", detail: "New Section 301 tariff will increase your effective duty from 3.5% to 28.5% on all laptops imported from China. Immediate action recommended to mitigate exposure.", time: "2h ago", read: false },
    { id: 2, severity: "critical", title: "Certificate of Origin Expires in 7 Days", detail: "Your Form A GSP certificate for shipment #CN-2026-0441 expires Feb 28. Renewal required to maintain 0% preferential duty rate.", time: "5h ago", read: false },
    { id: 3, severity: "warning", title: "Landed Cost Exceeded $15,000 Threshold", detail: "Your latest shipment estimate came in at $16,200 — $1,200 above your configured cost alert threshold.", time: "Yesterday", read: false },
    { id: 4, severity: "warning", title: "AED/USD Rate Alert: 3.74 (above 3.70)", detail: "Your FX alert for AED/USD has been triggered. This may affect CIF valuations for UAE-routed shipments.", time: "Yesterday", read: true },
    { id: 5, severity: "warning", title: "UN Sanctions List Updated — Re-screening Required", detail: "OFAC published 14 new entity additions. Re-run compliance screening for all active supplier relationships.", time: "2d ago", read: false },
    { id: 6, severity: "info", title: "GSP Eligibility Reminder: Vietnam Route Available", detail: "Your product HS 8471.30 qualifies for 0% duty via the Vietnam GSP route. Current route incurs 3.5%.", time: "3d ago", read: true },
    { id: 7, severity: "info", title: "HS 2025 Nomenclature Update — March 1 Deadline", detail: "WCO HS 2025 changes may affect your HS classification. Review before the deadline.", time: "3d ago", read: true },
    { id: 8, severity: "info", title: "Q1 2026 Compliance Report Ready", detail: "Your quarterly trade compliance summary is ready. 94% pass rate across 38 shipments reviewed.", time: "4d ago", read: true },
];

const SEV_CFG = {
    critical: { icon: AlertTriangle, color: "#e11d48", bg: "rgba(225,29,72,0.06)", border: "rgba(225,29,72,0.15)", label: "CRITICAL" },
    warning: { icon: AlertCircle, color: "#d97706", bg: "rgba(217,119,6,0.06)", border: "rgba(217,119,6,0.15)", label: "WARNING" },
    info: { icon: Info, color: "#2563eb", bg: "rgba(37,99,235,0.06)", border: "rgba(37,99,235,0.15)", label: "INFO" },
};

const THRESHOLDS = [
    { label: "Landed cost per shipment", val: "$15,000" },
    { label: "Effective duty rate", val: "10%" },
    { label: "FX rate AED/USD", val: "3.70" },
    { label: "Transit time (days)", val: "25 days" },
];

type FilterType = Sev | "all";

export default function Alerts() {
    const [alerts, setAlerts] = useState(INITIAL_ALERTS);
    const [selected, setSelected] = useState(INITIAL_ALERTS[0]);
    const [filter, setFilter] = useState<FilterType>("all");

    const visible = filter === "all" ? alerts : alerts.filter(a => a.severity === filter);
    const unread = alerts.filter(a => !a.read).length;
    const counts = { critical: alerts.filter(a => a.severity === "critical").length, warning: alerts.filter(a => a.severity === "warning").length, info: alerts.filter(a => a.severity === "info").length };

    function markRead(id: number) {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    }

    function markAllRead() {
        setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    }

    function selectAlert(alert: typeof INITIAL_ALERTS[0]) {
        setSelected(alert);
        markRead(alert.id);
    }

    const selCfg = SEV_CFG[selected.severity];

    return (
        <PageShell title="Alerts">
            {/* Page header */}
            <div className="animate-fade-in-up" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(225,29,72,0.08)", border: "1px solid rgba(225,29,72,0.2)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <Zap size={22} color="#e11d48" />
                    {unread > 0 && <div style={{ position: "absolute", top: -5, right: -5, width: 18, height: 18, borderRadius: "50%", background: "#e11d48", border: "2px solid var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff" }}>{unread}</div>}
                </div>
                <div>
                    <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>Alerts</h1>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>All system notifications, compliance flags, and threshold triggers</p>
                </div>
                <button onClick={markAllRead} style={{ marginLeft: "auto", padding: "9px 16px", borderRadius: 9, background: "rgba(0,0,0,0.05)", border: "1.5px solid var(--border)", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircle size={13} /> Mark All Read
                </button>
            </div>

            {/* KPI strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {[
                    { label: "Unread", val: unread, color: "#2563eb", icon: Bell, filter: "all" as FilterType },
                    { label: "Critical", val: counts.critical, color: "#e11d48", icon: AlertTriangle, filter: "critical" as FilterType },
                    { label: "Warnings", val: counts.warning, color: "#d97706", icon: AlertCircle, filter: "warning" as FilterType },
                    { label: "Info", val: counts.info, color: "#64748b", icon: Info, filter: "info" as FilterType },
                ].map((s, i) => (
                    <div key={s.label} onClick={() => setFilter(s.filter)} className={`glass-card card-shadow animate-fade-in-up delay-${(i + 1) * 100}`}
                        style={{ padding: "16px 18px", borderTop: `2px solid ${filter === s.filter ? s.color : "var(--border)"}`, cursor: "pointer", transition: "all 0.15s", background: filter === s.filter ? `${s.color}06` : "var(--bg-surface)" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <s.icon size={15} color={s.color} />
                            </div>
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: -0.5 }}>{s.val}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginTop: 3 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, alignItems: "start" }}>
                {/* Alert list */}
                <div className="glass-card card-shadow animate-fade-in-up delay-300" style={{ padding: 22 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: 1 }}>All Alerts</div>
                        <div style={{ display: "flex", gap: 5 }}>
                            {(["all", "critical", "warning", "info"] as FilterType[]).map(f => (
                                <button key={f} onClick={() => setFilter(f)} style={{ padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700, cursor: "pointer", border: "1.5px solid var(--border)", background: filter === f ? "#2563eb" : "transparent", color: filter === f ? "#fff" : "var(--text-muted)", transition: "all 0.15s" }}>
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {visible.map(alert => {
                            const c = SEV_CFG[alert.severity];
                            const isSelected = selected.id === alert.id;
                            return (
                                <div key={alert.id} onClick={() => selectAlert(alert)} style={{
                                    display: "flex", gap: 12, padding: "13px 14px", borderRadius: 10, cursor: "pointer",
                                    background: isSelected ? c.bg : "transparent",
                                    border: `1.5px solid ${isSelected ? c.border : "var(--border)"}`,
                                    borderLeft: `4px solid ${isSelected ? c.color : "transparent"}`,
                                    opacity: alert.read && !isSelected ? 0.65 : 1,
                                    transition: "all 0.15s",
                                }}>
                                    <c.icon size={16} color={c.color} style={{ flexShrink: 0, marginTop: 2 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                                            {!alert.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, flexShrink: 0 }} />}
                                            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{alert.title}</span>
                                        </div>
                                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                                            {alert.time} · <span style={{ color: c.color, fontWeight: 600 }}>{c.label}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {visible.length === 0 && (
                            <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-muted)", fontSize: 13 }}>No alerts in this category</div>
                        )}
                    </div>
                </div>

                {/* Right: detail + thresholds */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Detail */}
                    <div className="glass-card card-shadow animate-fade-in-up delay-400" style={{ padding: 22 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
                            <selCfg.icon size={18} color={selCfg.color} style={{ flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: selCfg.bg, color: selCfg.color, border: `1px solid ${selCfg.border}` }}>{selCfg.label}</span>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginTop: 8, lineHeight: 1.4 }}>{selected.title}</div>
                                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{selected.time}</div>
                            </div>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 16 }}>{selected.detail}</p>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button style={{ flex: 1, padding: "10px 0", borderRadius: 9, background: "#2563eb", border: "none", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Take Action</button>
                            <button onClick={() => markRead(selected.id)} style={{ flex: 1, padding: "10px 0", borderRadius: 9, background: "rgba(0,0,0,0.05)", border: "1.5px solid var(--border)", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                                <CheckCircle size={13} /> Mark Read
                            </button>
                        </div>
                    </div>

                    {/* Thresholds */}
                    <div className="glass-card card-shadow animate-fade-in-up delay-500" style={{ padding: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                            <Settings size={14} color="#2563eb" />
                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: 1 }}>Alert Thresholds</div>
                        </div>
                        {THRESHOLDS.map(t => (
                            <div key={t.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--border)", fontSize: 12 }}>
                                <span style={{ color: "var(--text-muted)" }}>{t.label}</span>
                                <span style={{ fontWeight: 700, color: "var(--text-primary)", background: "var(--bg-base)", padding: "2px 10px", borderRadius: 7, border: "1px solid var(--border)" }}>{t.val}</span>
                            </div>
                        ))}
                        <button style={{ marginTop: 14, width: "100%", padding: "9px 0", borderRadius: 9, background: "rgba(0,0,0,0.04)", border: "1.5px solid var(--border)", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            <Settings size={13} /> Configure Thresholds
                        </button>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
