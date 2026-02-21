"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type TradeContextType = {
    // Raw form data matching what's in trade-input
    name: string;
    category: string;
    description: string;
    material: string;
    intendedUse: string;
    value: string;
    currency: string;
    qty: string;
    weight: string;
    dimensions: string;
    origin: string;
    dest: string;
    transport: string;

    // Computed data / pipeline state
    hsCode: string | null;

    // Setters
    setTradeData: (data: Partial<Omit<TradeContextType, "setTradeData" | "clearTradeData">>) => void;
    clearTradeData: () => void;
};

const defaultState: Omit<TradeContextType, "setTradeData" | "clearTradeData"> = {
    name: "",
    category: "Select category",
    description: "",
    material: "",
    intendedUse: "",
    value: "",
    currency: "USD - US Dollar",
    qty: "",
    weight: "",
    dimensions: "",
    origin: "Select origin",
    dest: "Select destination",
    transport: "Select transport mode",
    hsCode: null,
};

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export function TradeProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState(defaultState);

    const setTradeData = (data: Partial<Omit<TradeContextType, "setTradeData" | "clearTradeData">>) => {
        setState((prev) => ({ ...prev, ...data }));
    };

    const clearTradeData = () => {
        setState(defaultState);
    };

    return (
        <TradeContext.Provider value={{ ...state, setTradeData, clearTradeData }}>
            {children}
        </TradeContext.Provider>
    );
}

export function useTradeContext() {
    const context = useContext(TradeContext);
    if (context === undefined) {
        throw new Error("useTradeContext must be used within a TradeProvider");
    }
    return context;
}
