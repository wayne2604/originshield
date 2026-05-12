"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, ExternalLink } from "lucide-react";
import { getRecentScans } from "@/app/actions/scan";
import type { ScanResult } from "@/types";

const LABEL_COLOR = {
  human: { text: "#4ade80", dot: "rgba(34,197,94,0.7)" },
  ai: { text: "#f87171", dot: "rgba(239,68,68,0.7)" },
  uncertain: { text: "#fbbf24", dot: "rgba(234,179,8,0.7)" },
};

const TYPE_ICON: Record<string, string> = {
  text: "T",
  image: "I",
  url: "U",
};

export default function RecentScans() {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentScans(5)
      .then(setScans)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="relative z-10 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <History size={14} className="text-slate-600" />
              <div className="h-3 w-28 rounded bg-slate-800/50 animate-pulse" />
            </div>

            <ul className="space-y-2">
              {[0, 1, 2].map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg"
                  style={{
                    background: "rgba(2,6,23,0.4)",
                    border: "1px solid rgba(0,240,255,0.06)",
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="shrink-0 w-6 h-6 rounded-md bg-slate-800/60 animate-pulse" />
                    <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-slate-800/60 animate-pulse" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-3 w-36 rounded bg-slate-800/60 animate-pulse" />
                      <div className="h-2.5 w-24 rounded bg-slate-800/50 animate-pulse" />
                    </div>
                  </div>
                  <div className="shrink-0 w-3 h-3 rounded bg-slate-800/50 animate-pulse" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  if (scans.length === 0) return null;

  return (
    <section className="relative z-10 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <History size={14} className="text-slate-500" />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Recent Scans
            </h3>
          </div>

          <ul className="space-y-2">
            {scans.map((scan) => {
              const colors = LABEL_COLOR[scan.label];
              return (
                <li key={scan.id}>
                  <Link
                    href={`/v/${scan.id}`}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group"
                    style={{
                      background: "rgba(2,6,23,0.4)",
                      border: "1px solid rgba(0,240,255,0.06)",
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Type badge */}
                      <span
                        className="shrink-0 flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-bold"
                        style={{
                          background: "rgba(0,240,255,0.08)",
                          color: "#00f0ff",
                        }}
                      >
                        {TYPE_ICON[scan.type]}
                      </span>

                      {/* Verdict dot */}
                      <span
                        className="shrink-0 w-1.5 h-1.5 rounded-full"
                        style={{
                          background: colors.dot,
                          boxShadow: `0 0 6px ${colors.dot}`,
                        }}
                      />

                      <div className="min-w-0">
                        <p
                          className="text-xs font-semibold truncate"
                          style={{ color: colors.text }}
                        >
                          {scan.label === "human"
                            ? "Authentic"
                            : scan.label === "ai"
                            ? "AI-Generated"
                            : "Uncertain"}{" "}
                          — {scan.truthScore}/100
                        </p>
                        <p className="text-[10px] text-slate-600 truncate">
                          {new Date(scan.timestamp).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <ExternalLink
                      size={12}
                      className="shrink-0 text-slate-600 group-hover:text-[#00f0ff] transition-colors"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
