"use client";
import PageShell from "@/components/PageShell";
import { CheckCircle, AlertTriangle, XCircle, FileText, ChevronRight } from "lucide-react";

const checks = [
    { status: "pass", title: "Sanctions Screening", detail: "OFAC, EU & UN consolidated lists cleared. No matches found.", category: "Trade Controls" },
    { status: "pass", title: "Export Control (EAR/ITAR)", detail: "HS 8471.30 laptops: EAR99 — no export license required.", category: "Trade Controls" },
    { status: "warn", title: "Labeling Requirements", detail: "Country-of-origin label required under 19 CFR 134. Ensure 'Made in China' is permanently affixed.", category: "Import Rules" },
    { status: "pass", title: "Import Permits", detail: "No special import permit required for HS 8471.30 in the USA.", category: "Import Rules" },
    { status: "warn", title: "Battery Compliance", detail: "Lithium-ion batteries must comply with UN 38.3 — ensure test summary is included in documentation.", category: "Product Safety" },
    { status: "pass", title: "Anti-Dumping Duties", detail: "No ADD/CVD orders applicable for laptops from China under this HS code.", category: "Duties" },
    { status: "pass", title: "FCC Certification", detail: "Electronics must carry FCC ID. Ensure certified before import.", category: "Product Safety" },
];

const docs = [
    { name: "Commercial Invoice", status: "ready", note: "Must show HS code, FOB value, and country of origin" },
    { name: "Packing List", status: "ready", note: "Matches commercial invoice line-by-line" },
    { name: "Bill of Lading", status: "required", note: "Issued by carrier — collect from freight forwarder" },
    { name: "Certificate of Origin", status: "required", note: "Required for GSP eligibility claims" },
    { name: "Import Declaration (CBP 3461)", status: "required", note: "File with CBP prior to arrival" },
    { name: "UN 38.3 Battery Test Report", status: "required", note: "Required for lithium battery compliance" },
    { name: "Marine Insurance Certificate", status: "optional", note: "Recommended for CIF shipments >$10k" },
];

const statusConfig = {
    pass: { icon: CheckCircle, color: "#059669", bg: "rgba(5,150,105,0.08)", border: "rgba(5,150,105,0.2)", label: "PASS" },
    warn: { icon: AlertTriangle, color: "#d97706", bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.2)", label: "ACTION" },
    fail: { icon: XCircle, color: "#e11d48", bg: "rgba(225,29,72,0.08)", border: "rgba(225,29,72,0.2)", label: "FAIL" },
};

const docStatus = {
    ready: { color: "#059669", bg: "rgba(5,150,105,0.08)", border: "rgba(5,150,105,0.2)", label: "Ready" },
    required: { color: "#d97706", bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.2)", label: "Required" },
    optional: { color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)", label: "Optional" },
};

export default function Compliance() {
    const passes = checks.filter(c => c.status === "pass").length;
    const warns = checks.filter(c => c.status === "warn").length;

    return (
        <PageShell title="Compliance">
            {/* Summary bar */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {[
                    { label: "Checks Passed", val: `${passes}/${checks.length}`, color: "#059669", bg: "rgba(5,150,105,0.08)", border: "rgba(5,150,105,0.2)" },
                    { label: "Actions Required", val: warns, color: "#d97706", bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.2)" },
                    { label: "Trade Lane", val: "China → USA", color: "#2563eb", bg: "rgba(37,99,235,0.08)", border: "rgba(37,99,235,0.2)" },
                ].map(s => (
                    <div key={s.label} className="glass-card card-shadow" style={{ padding: "16px 20px", borderTop: `2px solid ${s.color}` }}>
                        <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.val}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, alignItems: "start" }}>
                {/* Checks list */}
                <div className="glass-card card-shadow" style={{ padding: 24 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 16 }}>Compliance Checks</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {checks.map((c) => {
                            const cfg = statusConfig[c.status as keyof typeof statusConfig];
                            return (
                                <div key={c.title} style={{ display: "flex", gap: 14, padding: "14px 16px", borderRadius: 10, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                                    <cfg.icon size={18} color={cfg.color} style={{ flexShrink: 0, marginTop: 1 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{c.title}</span>
                                            <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, background: `${cfg.color}18`, padding: "1px 7px", borderRadius: 99, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
                                            <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>{c.category}</span>
                                        </div>
                                        <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{c.detail}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Documents panel */}
                <div className="glass-card card-shadow" style={{ padding: 22 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                        <FileText size={16} color="#2563eb" /> Required Documents
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {docs.map((d) => {
                            const s = docStatus[d.status as keyof typeof docStatus];
                            return (
                                <div key={d.name} style={{ padding: "11px 14px", borderRadius: 9, border: "1px solid var(--border)", background: "var(--bg-base)" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{d.name}</span>
                                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{s.label}</span>
                                    </div>
                                    <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>{d.note}</p>
                                </div>
                            );
                        })}
                    </div>
                    <button style={{ marginTop: 16, width: "100%", padding: "10px 0", borderRadius: 9, background: "#2563eb", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                        Download Checklist PDF
                    </button>
                </div>
            </div>
        </PageShell>
    );
}
