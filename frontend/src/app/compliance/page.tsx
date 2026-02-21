"use client";
import PageShell from "@/components/PageShell";
import { useState } from "react";
import {
    ShieldCheck, Globe, FileText, AlertTriangle,
    CheckCircle, XCircle, AlertCircle, Scale,
    CheckSquare, Square, Download,
} from "lucide-react";

/* ── Data ─────────────────────────────────────────── */
const GRID_CARDS = [
    { label: "Country of Origin", passed: 8, total: 8, score: 95, ok: true },
    { label: "Restricted Goods", passed: 12, total: 12, score: 100, ok: true },
    { label: "Licenses & Permits", passed: 3, total: 5, score: 75, ok: false },
    { label: "Value Addition", passed: 4, total: 4, score: 88, ok: true },
    { label: "Documentation", passed: 7, total: 10, score: 70, ok: false },
    { label: "Sanctions Check", passed: 6, total: 6, score: 100, ok: true },
];

const COO_RULES = [
    { label: "Substantial Transformation", sub: "Product underwent change in tariff heading from raw material to finished good", met: true },
    { label: "Value Addition Threshold", sub: "Local value addition: 68% (Required: >35%)", met: true },
    { label: "Manufacturing Process", sub: "Complete manufacturing from yarn to finished garment", met: true },
    { label: "Certificate Validity", sub: "Certificate of Origin expired – renewal required", met: false },
];

const LICENSES = [
    { label: "Import License", sub: "Valid until 2026-12-31", status: "Obtained" as const },
    { label: "Textile Certificate", sub: "Awaiting approval", status: "Pending" as const },
    { label: "Phytosanitary Certificate", sub: "Not required for this shipment", status: "N/A" as const },
    { label: "Certificate of Origin", sub: "Awaiting approval", status: "Pending" as const },
];

const RISK_FLAGS = [
    {
        level: "Medium" as const,
        title: "GSP Certification Pending",
        desc: "Generalized System of Preferences certificate not yet obtained. May lose preferential duty treatment.",
        action: "Submit Form A to customs authority within 15 days",
        impact: "Duty increase from 0% to 16.5% = $1,650 additional cost",
    },
    {
        level: "Low" as const,
        title: "Labeling Requirements",
        desc: "Ensure care labels comply with destination country regulations (FTC requirements for USA).",
        action: "Verify label content and placement before shipment",
        impact: "Potential customs delays or rejection",
    },
];

const CHECKLIST_INIT = [
    { label: "Verify HS code classification", done: true },
    { label: "Obtain Certificate of Origin", done: false },
    { label: "Prepare commercial invoice", done: true },
    { label: "Submit GSP Form A", done: false },
    { label: "Verify product labeling compliance", done: true },
    { label: "Calculate and pay import duties", done: false },
    { label: "File import declaration", done: false },
    { label: "Arrange customs clearance", done: false },
];

const statusStyle = {
    Obtained: { bg: "#0f172a", color: "#fff" },
    Pending: { bg: "#f1f5f9", color: "#475569" },
    "N/A": { bg: "#f1f5f9", color: "#94a3b8" },
} as const;

const riskColors = {
    Medium: { bg: "#fffbeb", border: "#fcd34d", badge: "#d97706", icon: "#d97706" },
    Low: { bg: "#eff6ff", border: "#bfdbfe", badge: "#2563eb", icon: "#2563eb" },
} as const;

/* ── Component ─────────────────────────────────────── */
export default function Compliance() {
    const [checks, setChecks] = useState(CHECKLIST_INIT.map(c => ({ ...c })));

    const toggle = (i: number) =>
        setChecks(prev => prev.map((c, idx) => idx === i ? { ...c, done: !c.done } : c));

    const doneCount = checks.filter(c => c.done).length;

    return (
        <PageShell title="Compliance">
            {/* ── Page header ─────────────────────── */}
            <div className="animate-fade-in-up" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ShieldCheck size={22} color="#059669" />
                </div>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>Compliance</h1>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>AI-powered regulatory compliance validation for your trade route</p>
                </div>
            </div>

            {/* ── Compliance Engine Banner ─────────── */}
            <div className="animate-fade-in-up delay-100" style={{ padding: "20px 26px", borderRadius: 14, background: "#f0fdf4", border: "1.5px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Globe size={20} color="#059669" />
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>Country-of-Origin &amp; Compliance Engine</div>
                        <div style={{ fontSize: 13, color: "#059669", marginTop: 3, fontWeight: 500 }}>Regulatory brain with real-time compliance validation</div>
                    </div>
                </div>
                <div style={{ textAlign: "right", padding: "12px 20px", borderRadius: 12, background: "#dcfce7", border: "1px solid #86efac" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: 1 }}>Overall Compliance</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: "#059669", lineHeight: 1.1 }}>86%</div>
                </div>
            </div>

            {/* ── 6-Card Grid ─────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                {GRID_CARDS.map(c => (
                    <div key={c.label} className="glass-card card-shadow animate-fade-in-up" style={{ padding: "18px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                {c.ok
                                    ? <CheckCircle size={17} color="#059669" />
                                    : <AlertTriangle size={17} color="#d97706" />}
                                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{c.label}</span>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 800, padding: "3px 10px", borderRadius: 99, background: c.ok ? "#0f172a" : "#fef3c7", color: c.ok ? "#fff" : "#92400e", border: c.ok ? "none" : "1px solid #fcd34d" }}>
                                {c.passed}/{c.total}
                            </span>
                        </div>
                        <div style={{ height: 6, borderRadius: 99, background: "#e2e8f0", overflow: "hidden", marginBottom: 8 }}>
                            <div style={{ height: "100%", width: `${c.score}%`, background: c.ok ? "#059669" : "#d97706", borderRadius: 99 }} />
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Score: {c.score}%</div>
                    </div>
                ))}
            </div>

            {/* ── Country of Origin Rule Evaluation ─ */}
            <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                    <Globe size={18} color="#2563eb" />
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Country of Origin Rule Evaluation</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Substantial transformation and value addition analysis</div>
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {COO_RULES.map(r => (
                        <div key={r.label} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "14px 16px", borderRadius: 10,
                            background: r.met ? "#f0fdf4" : "#fff0f0",
                            border: `1px solid ${r.met ? "#bbf7d0" : "#fecaca"}`,
                            borderLeft: `4px solid ${r.met ? "#059669" : "#dc2626"}`,
                        }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                                {r.met
                                    ? <CheckCircle size={17} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                                    : <XCircle size={17} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />}
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{r.label}</div>
                                    <div style={{ fontSize: 12, color: r.met ? "#059669" : "#dc2626", marginTop: 3, fontWeight: 500 }}>{r.sub}</div>
                                </div>
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 12px", borderRadius: 99, background: r.met ? "#0f172a" : "#dc2626", color: "#fff", flexShrink: 0, marginLeft: 12 }}>
                                {r.met ? "MET" : "NOT MET"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Required Licenses & Permits ──────── */}
            <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                    <FileText size={18} color="#7c3aed" />
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Required Licenses &amp; Permits</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Import authorization and documentation status</div>
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {LICENSES.map(l => {
                        const ss = statusStyle[l.status];
                        const icon = l.status === "Obtained"
                            ? <CheckCircle size={18} color="#059669" />
                            : l.status === "Pending"
                                ? <AlertTriangle size={18} color="#d97706" />
                                : <AlertCircle size={18} color="#94a3b8" />;
                        return (
                            <div key={l.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 10, border: "1.5px solid var(--border)", background: "#fff" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    {icon}
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{l.label}</div>
                                        <div style={{ fontSize: 12, color: l.status === "Obtained" ? "#059669" : "var(--text-muted)", marginTop: 2, fontWeight: 500 }}>{l.sub}</div>
                                    </div>
                                </div>
                                <span style={{ fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 8, background: ss.bg, color: ss.color, flexShrink: 0 }}>{l.status}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Regulatory Risk Scoring & Red Flags ─ */}
            <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                    <AlertCircle size={18} color="#dc2626" />
                    <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Regulatory Risk Scoring &amp; Red Flags</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {RISK_FLAGS.map(f => {
                        const rc = riskColors[f.level];
                        return (
                            <div key={f.title} style={{ padding: "16px 18px", borderRadius: 12, background: rc.bg, border: `1.5px solid ${rc.border}`, borderLeft: `4px solid ${rc.badge}` }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                    <AlertTriangle size={16} color={rc.icon} />
                                    <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: rc.badge, color: "#fff" }}>{f.level} Risk</span>
                                    <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)" }}>{f.title}</span>
                                </div>
                                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.6 }}>{f.desc}</p>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                    {[{ h: "Required Action", val: f.action }, { h: "Potential Impact", val: f.impact }].map(box => (
                                        <div key={box.h} style={{ padding: "12px 14px", borderRadius: 8, background: "#fff", border: "1px solid rgba(0,0,0,0.07)" }}>
                                            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>{box.h}</div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.5 }}>{box.val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Compliance Checklist Generator ───── */}
            <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Scale size={18} color="#2563eb" />
                        <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Compliance Checklist Generator</div>
                    </div>
                    <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{doneCount}/{checks.length} complete</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    {checks.map((c, i) => (
                        <div key={c.label} onClick={() => toggle(i)} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "14px 4px", cursor: "pointer",
                            borderBottom: i < checks.length - 1 ? "1px solid var(--border)" : "none",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                {c.done
                                    ? <CheckSquare size={20} color="#2563eb" />
                                    : <Square size={20} color="var(--text-subtle)" />}
                                <span style={{
                                    fontSize: 14, fontWeight: 600,
                                    color: c.done ? "var(--text-subtle)" : "var(--text-primary)",
                                    textDecoration: c.done ? "line-through" : "none",
                                }}>{c.label}</span>
                            </div>
                            {c.done && <CheckCircle size={18} color="#059669" />}
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
            </div>
        </PageShell>
    );
}
