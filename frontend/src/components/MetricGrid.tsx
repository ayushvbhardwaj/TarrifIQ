"use client";
import { TrendingDown, DollarSign, AlertTriangle, Zap } from 'lucide-react';

export function MetricGrid() {
    const metrics = [
        { label: "Potential Savings", val: "$5,240", sub: "vs current route", color: "border-l-green-400", icon: <TrendingDown className="text-green-200" size={40} /> },
        { label: "Total Landed Cost", val: "$14,000", sub: "optimized estimate", color: "border-l-blue-400", icon: <DollarSign className="text-blue-100" size={40} /> },
        { label: "Compliance Risk", val: "Low", sub: "2 items need attention", color: "border-l-orange-400", icon: <AlertTriangle className="text-orange-100" size={40} /> },
        { label: "Active Alerts", val: "7", sub: "3 high priority", color: "border-l-purple-400", icon: <Zap className="text-purple-100" size={40} /> },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
            {metrics.map((m) => (
                <div key={m.label} className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-[6px] ${m.color} flex justify-between items-start relative overflow-hidden`}>
                    <div className="z-10">
                        <p className="text-gray-500 text-sm font-semibold">{m.label}</p>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2">{m.val}</h2>
                        <p className="text-xs text-gray-400 mt-1">{m.sub}</p>
                    </div>
                    <div className="absolute right-[-10px] bottom-[-10px] opacity-40">
                        {m.icon}
                    </div>
                </div>
            ))}
        </div>
    );
}