"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { DetectionResult } from "@/types";

interface DetectionContextValue {
  /** Most recent scan result, or null if none yet */
  result: DetectionResult | null;
  /** Full history of results for this session */
  history: DetectionResult[];
  setResult: (result: DetectionResult) => void;
  clearResult: () => void;
  clearHistory: () => void;
}

const DetectionContext = createContext<DetectionContextValue | null>(null);

export function DetectionProvider({ children }: { children: ReactNode }) {
  const [result, setResultState] = useState<DetectionResult | null>(null);
  const [history, setHistory] = useState<DetectionResult[]>([]);

  const setResult = useCallback((r: DetectionResult) => {
    setResultState(r);
    setHistory((prev) => [r, ...prev]);
  }, []);

  const clearResult = useCallback(() => setResultState(null), []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setResultState(null);
  }, []);

  return (
    <DetectionContext.Provider
      value={{ result, history, setResult, clearResult, clearHistory }}
    >
      {children}
    </DetectionContext.Provider>
  );
}

export function useDetection(): DetectionContextValue {
  const ctx = useContext(DetectionContext);
  if (!ctx) {
    throw new Error("useDetection must be used inside <DetectionProvider>");
  }
  return ctx;
}
