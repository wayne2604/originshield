"use client";

import Link from "next/link";
import { Shield, ExternalLink } from "lucide-react";
import type { ScanResult } from "@/types";
import ResultView from "@/components/scanner/ResultView";

interface Props {
  scan: ScanResult;
}

export default function VerificationView({ scan }: Props) {
  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      {/* Minimal navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14"
        style={{
          background: "rgba(3,7,18,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,240,255,0.08)",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <Shield size={18} className="text-[#00f0ff]" />
          <span className="text-sm font-bold">
            <span className="text-neon">Origin</span>
            <span className="text-white">Shield</span>
          </span>
        </Link>

        <span className="text-xs text-slate-500 font-mono">
          Verification Record · {scan.id.slice(0, 8)}…
        </span>
      </nav>

      {/* Content */}
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Read-only banner */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg mb-6 text-xs font-medium text-slate-400"
            style={{
              background: "rgba(148,163,184,0.06)",
              border: "1px solid rgba(148,163,184,0.12)",
            }}
          >
            <ExternalLink size={12} />
            This is a read-only verification record. Scan results are immutable.
          </div>

          <ResultView
            result={scan}
            onScanAgain={() => {
              window.location.href = "/";
            }}
            scanAgainLabel="Run your own scan"
          />
        </div>
      </main>
    </div>
  );
}
