"use client";
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { Sparkles, TrendingDown, ShieldCheck } from "lucide-react";

const radarData = [
    { metric: "Cost Efficiency", current: 62, optimized: 88 },
    { metric: "Compliance", current: 75, optimized: 95 },
    { metric: "Speed", current: 55, optimized: 80 },
    { metric: "Risk", current: 70, optimized: 90 },
    { metric: "Duty Savings", current: 40, optimized: 85 },
];

const trendData = [
    { month: "Sep", landed: 14200, optimized: 13800 },
    { month: "Oct", landed: 14800, optimized: 13200 },
    { month: "Nov", landed: 15100, optimized: 12900 },
    { month: "Dec", landed: 15600, optimized: 12400 },
    { month: "Jan", landed: 14900, optimized: 11900 },
    { month: "Feb", landed: 13500, optimized: 11500 },
];

const recommendations = [
    {
        icon: <TrendingDown size={18} className="text-blue-600" />,
        bg: "bg-blue-50",
        title: "Switch to Vietnam → USA Sea Route",
        detail: "Est. savings of $1,400 per shipment (10.4% reduction in landed cost)",
    },
    {
        icon: <ShieldCheck size={18} className="text-green-600" />,
        bg: "bg-green-50",
        title: "Apply GSP Duty Exemption",
        detail: "Product HS 8471.30 qualifies — eliminates 3.5% import duty",
    },
    {
        icon: <Sparkles size={18} className="text-purple-600" />,
        bg: "bg-purple-50",
        title: "Consolidate Freight with Partner SKUs",
        detail: "Bundle with 2 co-origin SKUs to cut per-unit freight by $320",
    },
];

export function OptimizationSection() {
    return (
        <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* RADAR CHART */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-1">Route Performance Score</h3>
                <p className="text-xs text-gray-400 mb-4">Current vs. AI-optimized route</p>
                <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#6b7280" }} />
                            <Radar name="Current" dataKey="current" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} />
                            <Radar name="Optimized" dataKey="optimized" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.35} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* TREND CHART */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-1">Landed Cost Trend</h3>
                <p className="text-xs text-gray-400 mb-4">6-month actual vs. optimized trajectory</p>
                <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis fontSize={10} axisLine={false} tickLine={false} width={50} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Line type="monotone" dataKey="landed" name="Actual" stroke="#94a3b8" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="optimized" name="Optimized" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="5 3" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI RECOMMENDATIONS */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                <div>
                    <h3 className="font-bold text-gray-800 mb-1">AI Recommendations</h3>
                    <p className="text-xs text-gray-400">Top actions to reduce cost & risk</p>
                </div>
                {recommendations.map((rec, i) => (
                    <div key={i} className={`flex items-start gap-3 p-4 rounded-xl ${rec.bg}`}>
                        <div className="mt-0.5 shrink-0">{rec.icon}</div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{rec.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{rec.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
