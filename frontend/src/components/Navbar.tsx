"use client";
import { Bell, Search, RefreshCw } from "lucide-react";

export default function TopBar({ title = "Dashboard" }: { title?: string }) {
    return (
        <div
            className="animate-fade-in"
            style={{
                height: 60,
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                background: "var(--bg-surface)",
                flexShrink: 0,
            }}
        >
            {/* Left: breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>TariffIQ</span>
                <span style={{ color: "var(--text-subtle)", fontSize: 12 }}>/</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{title}</span>
                <span
                    style={{
                        marginLeft: 8,
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 99,
                        background: "rgba(16,185,129,0.12)",
                        color: "#10b981",
                        border: "1px solid rgba(16,185,129,0.25)",
                    }}
                >
                    ● Live
                </span>
            </div>

            {/* Right: search + refresh + bell */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Search */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        background: "rgba(0,0,0,0.04)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        padding: "6px 12px",
                        cursor: "text",
                    }}
                >
                    <Search size={13} color="var(--text-muted)" />
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Search HS codes…</span>
                    <kbd
                        style={{
                            marginLeft: 8,
                            fontSize: 10,
                            padding: "1px 5px",
                            borderRadius: 4,
                            background: "rgba(0,0,0,0.05)",
                            color: "var(--text-muted)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        ⌘K
                    </kbd>
                </div>

                {/* Last updated */}
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-muted)" }}>
                    <RefreshCw size={12} className="animate-spin-slow" />
                    <span style={{ fontSize: 11 }}>Updated 2s ago</span>
                </div>

                {/* Bell */}
                <button
                    style={{
                        position: "relative",
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        background: "rgba(0,0,0,0.04)",
                        border: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                    }}
                >
                    <Bell size={15} />
                    <span
                        style={{
                            position: "absolute",
                            top: 7,
                            right: 7,
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "#f43f5e",
                            border: "1.5px solid var(--bg-surface)",
                        }}
                    />
                </button>
            </div>
        </div>
    );
}