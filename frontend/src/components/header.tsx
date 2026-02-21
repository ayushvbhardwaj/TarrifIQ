"use client";

export default function Header() {
    return (
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">T</span>
                </div>
                <div>
                    <h1 className="text-lg font-bold text-gray-900 leading-none">TariffIQ</h1>
                    <p className="text-xs text-gray-400">AI-Powered Trade Optimization</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-xs bg-green-50 text-green-700 font-medium px-3 py-1 rounded-full border border-green-100">
                    ● Live
                </span>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                    A
                </div>
            </div>
        </header>
    );
}
