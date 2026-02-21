"use client";
import PageShell from "@/components/PageShell";
import { useState } from "react";
import { Globe, Sparkles, Package, DollarSign, MapPin, Weight, CheckCircle, Truck, ShieldCheck, AlertTriangle, RefreshCw, ChevronDown } from "lucide-react";

/* ── helpers ── */
const CATEGORIES = ["Select category", "Electronics & IT", "Apparel & Textiles", "Machinery", "Chemicals", "Food & Beverage", "Automotive Parts", "Medical Devices", "Furniture", "Toys & Games"];
const CURRENCIES = ["USD - US Dollar", "EUR - Euro", "GBP - Pound Sterling", "AED - UAE Dirham", "INR - Indian Rupee", "CNY - Chinese Yuan"];
const ALL_COUNTRIES = [
    "Afghanistan", "Albania", "Algeria", "Angola", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bolivia", "Bosnia and Herzegovina",
    "Brazil", "Bulgaria", "Cambodia", "Cameroon", "Canada", "Chile", "China", "Colombia",
    "Costa Rica", "Croatia", "Cuba", "Czech Republic", "Denmark", "Dominican Republic", "Ecuador",
    "Egypt", "El Salvador", "Estonia", "Ethiopia", "Finland", "France", "Georgia", "Germany",
    "Ghana", "Greece", "Guatemala", "Honduras", "Hong Kong", "Hungary", "India", "Indonesia",
    "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan", "Latvia", "Lebanon", "Libya", "Lithuania",
    "Luxembourg", "Malaysia", "Malta", "Mexico", "Moldova", "Mongolia", "Morocco", "Mozambique",
    "Myanmar", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Nigeria", "North Korea",
    "Norway", "Oman", "Pakistan", "Panama", "Paraguay", "Peru", "Philippines", "Poland",
    "Portugal", "Qatar", "Romania", "Russia", "Saudi Arabia", "Senegal", "Serbia", "Singapore",
    "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan",
    "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Tunisia",
    "Turkey", "Turkmenistan", "UAE", "Uganda", "UK", "Ukraine", "Uruguay", "USA", "Uzbekistan",
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];
const ORIGINS = ["Select origin", ...ALL_COUNTRIES];
const DESTS = ["Select destination", ...ALL_COUNTRIES];
const TRANSPORTS = ["Select transport mode", "Sea Freight", "Air Freight", "Rail", "Road / Truck", "Multimodal"];

const inputBase: React.CSSProperties = {
    width: "100%", padding: "10px 13px", borderRadius: 8,
    border: "1.5px solid var(--border)", background: "#f8f9fb",
    color: "var(--text-primary)", fontSize: 13, fontWeight: 500,
    outline: "none", transition: "border-color 0.15s, box-shadow 0.15s",
    fontFamily: "inherit",
};
const onFocus = (e: React.FocusEvent<any>) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; };
const onBlur = (e: React.FocusEvent<any>) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; };

function Input({ placeholder, value, onChange, prefix }: { placeholder: string; value: string; onChange: (v: string) => void; prefix?: string }) {
    return (
        <div style={{ position: "relative" }}>
            {prefix && <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{prefix}</span>}
            <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...inputBase, paddingLeft: prefix ? 26 : 13 }} onFocus={onFocus} onBlur={onBlur} />
        </div>
    );
}

function Select({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
    return (
        <div style={{ position: "relative" }}>
            <select value={value} onChange={e => onChange(e.target.value)} style={{ ...inputBase, appearance: "none", paddingRight: 32, cursor: "pointer" }}>
                {options.map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
        </div>
    );
}

function SectionHeader({ icon: Icon, title, iconColor }: { icon: any; title: string; iconColor: string }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
            <Icon size={16} color={iconColor} />
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{title}</span>
        </div>
    );
}

function Row({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
    return <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>{children}</div>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>
                {label} {required && <span style={{ color: "#e11d48" }}>*</span>}
            </label>
            {children}
        </div>
    );
}

/* ── page ── */
export default function TradeInput() {
    const [f, setF] = useState({
        name: "", category: CATEGORIES[0], description: "", material: "", intendedUse: "",
        value: "", currency: CURRENCIES[0], qty: "",
        weight: "", dimensions: "",
        origin: ORIGINS[0], dest: DESTS[0], transport: TRANSPORTS[0],
    });
    const set = (k: keyof typeof f) => (v: string) => { setF(p => ({ ...p, [k]: v })); setResult(null); };

    const [running, setRunning] = useState(false);
    const [result, setResult] = useState<null | "done">(null);

    const canRun = !!(f.name && f.value && f.qty && f.origin !== ORIGINS[0] && f.dest !== DESTS[0] && f.transport !== TRANSPORTS[0]);

    function analyze() {
        if (!canRun || running) return;
        setRunning(true);
        setTimeout(() => { setRunning(false); setResult("done"); }, 2000);
    }

    return (
        <PageShell title="Trade Input">
            {/* Page header */}
            <div className="animate-fade-in-up" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Globe size={22} color="#2563eb" />
                </div>
                <div>
                    <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>Core Trade Input &amp; Setup</h1>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Enter your product and trade details for AI-powered analysis</p>
                </div>
            </div>

            {/* Form card */}
            <div className="glass-card card-shadow animate-fade-in-up delay-300" style={{ padding: 32 }}>

                {/* ── Section 1: Product Information ── */}
                <SectionHeader icon={Package} title="Product Information" iconColor="#2563eb" />
                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
                    <Row>
                        <Field label="Product Name" required>
                            <Input placeholder="e.g., Cotton T-Shirts" value={f.name} onChange={set("name")} />
                        </Field>
                        <Field label="Product Category" required>
                            <Select options={CATEGORIES} value={f.category} onChange={set("category")} />
                        </Field>
                    </Row>
                    <Field label="Product Description" required>
                        <textarea
                            value={f.description} onChange={e => set("description")(e.target.value)}
                            placeholder="Detailed description including textures, specifications, and characteristics..."
                            rows={3}
                            style={{ ...inputBase, resize: "vertical", lineHeight: 1.65 }}
                            onFocus={onFocus} onBlur={onBlur}
                        />
                    </Field>
                    <Row>
                        <Field label="Material / Composition">
                            <Input placeholder="e.g., 100% Cotton" value={f.material} onChange={set("material")} />
                        </Field>
                        <Field label="Intended Use / End Application">
                            <Input placeholder="e.g., Casual wear, retail distribution" value={f.intendedUse} onChange={set("intendedUse")} />
                        </Field>
                    </Row>
                </div>

                {/* ── Section 2: Value & Quantity ── */}
                <SectionHeader icon={DollarSign} title="Value &amp; Quantity" iconColor="#059669" />
                <div style={{ marginBottom: 32 }}>
                    <Row cols={3}>
                        <Field label="Product Value" required>
                            <Input placeholder="0.00" prefix="$" value={f.value} onChange={set("value")} />
                        </Field>
                        <Field label="Currency" required>
                            <Select options={CURRENCIES} value={f.currency} onChange={set("currency")} />
                        </Field>
                        <Field label="Quantity (units)" required>
                            <Input placeholder="0" value={f.qty} onChange={set("qty")} />
                        </Field>
                    </Row>
                </div>

                {/* ── Section 3: Weight & Dimensions ── */}
                <SectionHeader icon={Weight} title="Weight &amp; Dimensions" iconColor="#7c3aed" />
                <div style={{ marginBottom: 32 }}>
                    <Row>
                        <Field label="Total Weight (kg)" required>
                            <Input placeholder="0.0" value={f.weight} onChange={set("weight")} />
                        </Field>
                        <Field label="Dimensions (L × W × H cm)">
                            <Input placeholder="e.g., 50 × 40 × 30" value={f.dimensions} onChange={set("dimensions")} />
                        </Field>
                    </Row>
                </div>

                {/* ── Section 4: Routing Information ── */}
                <SectionHeader icon={MapPin} title="Routing Information" iconColor="#d97706" />
                <div style={{ marginBottom: 32 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <Row>
                            <Field label="Country of Origin" required>
                                <Select options={ORIGINS} value={f.origin} onChange={set("origin")} />
                            </Field>
                            <Field label="Destination Country" required>
                                <Select options={DESTS} value={f.dest} onChange={set("dest")} />
                            </Field>
                        </Row>
                        <Field label="Mode of Transport" required>
                            <Select options={TRANSPORTS} value={f.transport} onChange={set("transport")} />
                        </Field>
                    </div>
                </div>

                {/* ── CTA area ── */}
                <div style={{ paddingTop: 20, borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
                    <button
                        onClick={analyze}
                        disabled={!canRun || running}
                        style={{
                            flex: 1, padding: "14px 0", borderRadius: 10,
                            background: canRun && !running ? "#2563eb" : "rgba(0,0,0,0.06)",
                            border: "none", color: canRun && !running ? "#fff" : "var(--text-muted)",
                            fontWeight: 700, fontSize: 14, cursor: canRun && !running ? "pointer" : "not-allowed",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                            transition: "background 0.2s", letterSpacing: 0.2,
                        }}
                    >
                        {running
                            ? <><RefreshCw size={16} className="animate-spin-slow" /> Analyzing Trade Route…</>
                            : <><Sparkles size={16} /> Analyze Trade Route</>}
                    </button>
                    <button style={{ padding: "14px 22px", borderRadius: 10, background: "rgba(0,0,0,0.04)", border: "1.5px solid var(--border)", color: "var(--text-muted)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                        Save Draft
                    </button>
                </div>

                {/* Validation hint */}
                {!canRun && (
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 10, textAlign: "center" }}>
                        Fill in all required fields (*) to enable analysis
                    </p>
                )}
            </div>

            {/* Results panel */}
            {result === "done" && (
                <div className="glass-card card-shadow animate-fade-in-up" style={{ padding: 24, border: "1.5px solid rgba(5,150,105,0.25)", background: "rgba(5,150,105,0.03)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                        <CheckCircle size={18} color="#059669" />
                        <span style={{ fontWeight: 800, fontSize: 16, color: "#059669" }}>Analysis Complete</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                        {[
                            { icon: DollarSign, label: "Estimated Landed Cost", val: "$13,101", color: "#2563eb" },
                            { icon: Truck, label: "Recommended Route", val: "Vietnam → USA Sea", color: "#059669" },
                            { icon: ShieldCheck, label: "HS Code Detected", val: "8471.30", color: "#7c3aed" },
                            { icon: AlertTriangle, label: "Compliance Flags", val: "2 warnings", color: "#d97706" },
                        ].map(r => (
                            <div key={r.label} style={{ padding: "14px 16px", borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--bg-surface)", borderTop: `2px solid ${r.color}` }}>
                                <div style={{ width: 28, height: 28, borderRadius: 7, background: `${r.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                                    <r.icon size={14} color={r.color} />
                                </div>
                                <div style={{ fontSize: 16, fontWeight: 800, color: r.color }}>{r.val}</div>
                                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{r.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </PageShell>
    );
}
