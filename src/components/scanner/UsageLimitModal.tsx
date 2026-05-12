"use client";

import Link from "next/link";
import { Check, X, ShieldAlert } from "lucide-react";

interface UsageLimitModalProps {
  onClose: () => void;
}

const BENEFITS = [
  "Unlimited professional scans",
  "Deep forensic metadata analysis",
  "Permanent scan history",
];

export default function UsageLimitModal({ onClose }: UsageLimitModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close usage limit modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-xl"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950/90 p-6 shadow-[0_0_60px_rgba(0,240,255,0.12)]">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-cyan-300/10 hover:text-[#00f0ff]"
        >
          <X size={16} />
        </button>

        <div
          className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            background: "rgba(0,240,255,0.08)",
            border: "1px solid rgba(0,240,255,0.22)",
          }}
        >
          <ShieldAlert size={28} className="text-[#00f0ff]" />
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff]">
          Free limit reached
        </p>
        <h2 className="mb-3 text-2xl font-bold text-white">
          You&apos;ve reached your free limit.
        </h2>
        <p className="mb-6 text-sm leading-6 text-slate-400">
          Guest scans are capped at 3. Create an account or choose a plan to keep
          verifying content with OriginShield.
        </p>

        <ul className="mb-7 space-y-3">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-center gap-3 text-sm text-slate-300">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-300/10 text-[#00f0ff]">
                <Check size={13} />
              </span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link href="/auth" className="btn-neon">
            Create Free Account
          </Link>
          <a href="#pricing" onClick={onClose} className="btn-ghost">
            View Pricing
          </a>
        </div>
      </div>
    </div>
  );
}
