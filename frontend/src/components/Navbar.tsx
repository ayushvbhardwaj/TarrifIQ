"use client";
import React from 'react';
import {
    LayoutGrid,
    Globe,
    Sparkles,
    ShieldCheck,
    Calculator,
    TrendingUp,
    Newspaper,
    AlertCircle,
    Zap
} from 'lucide-react';

// Define the navigation items based on your screenshot
const navItems = [
    { label: 'Dashboard', icon: LayoutGrid, active: true },
    { label: 'Trade Input', icon: Globe },
    { label: 'HS Code AI', icon: Sparkles },
    { label: 'Compliance', icon: ShieldCheck },
    { label: 'Landed Cost', icon: Calculator },
    { label: 'Optimize', icon: TrendingUp }, // The blue active button
    { label: 'Tariff News', icon: Newspaper },
    { label: 'Impact', icon: AlertCircle },
    { label: 'Alerts', icon: Zap },
];

export default function Navbar() {
    return (
        <nav className="w-full bg-white border-b border-gray-100 flex justify-center items-center py-2 px-6 shadow-sm overflow-x-auto">
            <div className="flex items-center gap-1 md:gap-4">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        className={`
              flex flex-col items-center justify-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-200 min-w-[90px]
              ${item.active
                                ? 'bg-[#2563eb] text-white shadow-md' // Active state: Blue background
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900' // Inactive: Transparent/Gray
                            }
            `}
                    >
                        {/* Dynamic Icon Rendering */}
                        <item.icon
                            size={22}
                            strokeWidth={item.active ? 2.5 : 1.8}
                        />

                        {/* Label Rendering */}
                        <span className={`text-[11px] font-semibold tracking-wide whitespace-nowrap`}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </nav>
    );
}