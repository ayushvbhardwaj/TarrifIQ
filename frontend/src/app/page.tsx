"use client";
import Header from "@/components/header";
import Navbar from "@/components/Navbar";
import { MetricGrid } from "@/components/MetricGrid";
import { ChartsSection } from "@/components/ChartsSection";
import { OptimizationSection } from "@/components/OptimizationSection";
import { Zap, Box, Lightbulb, FileText } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* 1. BRAND HEADER */}
            <Header />

            {/* 2. NAVIGATION BAR */}
            <Navbar />

            <main className="max-w-[1440px] mx-auto animate-in fade-in duration-700">
                {/* 3. TOP METRIC ROW */}
                <MetricGrid />

                {/* 4. DATA VISUALIZATION SECTION (Pie & Bar Charts) */}
                <ChartsSection />

                {/* 5. OPTIMIZATION SECTION (Radar, Trend, and AI Recommendations) */}
                <OptimizationSection />

                {/* 6. BOTTOM ACTION CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 mt-6">
                    <ActionCard
                        title="Run Impact Analysis"
                        desc="Simulate policy changes"
                        icon={<Box className="text-blue-600" />}
                    />
                    <ActionCard
                        title="Optimize All Routes"
                        desc="AI-powered optimization"
                        icon={<Lightbulb className="text-purple-600" />}
                    />
                    <ActionCard
                        title="Export Trade Report"
                        desc="Audit-ready PDF"
                        icon={<FileText className="text-green-600" />}
                    />
                </div>
            </main>

            {/* 7. FLOATING ACTION BUTTON */}
            <button className="fixed bottom-8 right-8 bg-[#ff3d00] text-white px-6 py-4 rounded-full font-bold shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform z-50">
                <Zap size={20} fill="currentColor" />
                Trade Shock Simulator
            </button>
        </div>
    );
}

// Small helper component for the bottom cards
function ActionCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
            <div>
                <h4 className="font-bold text-gray-900">{title}</h4>
                <p className="text-sm text-gray-500">{desc}</p>
            </div>
        </div>
    );
}