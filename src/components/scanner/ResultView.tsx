"use client";

import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import type { ScanResult, ConfidenceLevel, EvidenceTag } from "@/types";
import CircularGauge from "./CircularGauge";
import BreakdownSection from "./BreakdownSection";
import ShareButton from "./ShareButton";

interface ResultViewProps {
  result: ScanResult;
  onScanAgain: () => void;
  scanAgainLabel?: string;
}

const CONFIDENCE_META: Record<
  ConfidenceLevel,
  { icon: React.ReactNode; color: string; label: string }
> = {
  high: { icon: <CheckCircle size={14} />, color: "#22c55e", label: "High Confidence" },
  medium: { icon: <AlertTriangle size={14} />, color: "#eab308", label: "Medium Confidence" },
  low: { icon: <XCircle size={14} />, color: "#ef4444", label: "Low Confidence" },
};

const VARIANT_STYLE: Record<
  EvidenceTag["variant"],
  { bg: string; border: string; text: string }
> = {
  positive: { bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.35)", text: "#4ade80" },
  negative: { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.35)", text: "#f87171" },
  warning: { bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.35)", text: "#fbbf24" },
  neutral: { bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)", text: "#94a3b8" },
};

const TYPE_LABEL: Record<string, string> = {
  text: "Text Analysis",
  image: "Image Forensics",
  url: "URL Content Scan",
};

function EvidenceTagPill({ tag }: { tag: EvidenceTag }) {
  const style = VARIANT_STYLE[tag.variant];
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.text,
      }}
    >
      {tag.label}
    </span>
  );
}

export default function ResultView({ result, onScanAgain, scanAgainLabel = "Scan Again" }: ResultViewProps) {
  const {
    truthScore,
    label,
    confidenceLevel,
    detectedArtifacts,
    evidenceTags,
    c2paVerified,
    type,
    timestamp,
  } = result;

  const confidence = CONFIDENCE_META[confidenceLevel];
  const dotColor =
    label === "human" ? "#22c55e" : label === "ai" ? "#ef4444" : "#eab308";
  const dotGlow =
    label === "human"
      ? "rgba(34,197,94,0.6)"
      : label === "ai"
      ? "rgba(239,68,68,0.6)"
      : "rgba(234,179,8,0.6)";

  return (
    <div className="animate-fade-in-up glass-card-strong p-6 sm:p-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onScanAgain}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-[#00f0ff] transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          {scanAgainLabel}
        </button>
        <div className="flex items-center gap-3">
          <ShareButton scanId={result.id} />
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Clock size={12} />
            {new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        </div>
      </div>

      {/* Scan type */}
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">
        {TYPE_LABEL[type] ?? type}
      </p>

      {/* ── C2PA Verified Badge ── */}
      {c2paVerified && (
        <div className="flex justify-center mb-5">
          <div
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold"
            style={{
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.4)",
              color: "#4ade80",
              boxShadow:
                "0 0 20px rgba(34,197,94,0.15), 0 0 60px rgba(34,197,94,0.06)",
              animation: "glow-pulse 2s ease-in-out infinite",
            }}
          >
            <ShieldCheck size={18} style={{ color: "#4ade80" }} />
            Verified Original — C2PA Signature Confirmed
          </div>
        </div>
      )}

      {/* Gauge */}
      <div className="flex justify-center mb-6">
        <CircularGauge score={truthScore} label={label} size={200} />
      </div>

      {/* Truth score + confidence */}
      <p className="text-center text-sm text-slate-400 mb-2">
        Truth Score:{" "}
        <span className="font-bold text-white">{truthScore} / 100</span>
      </p>
      <div className="flex justify-center mb-8">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background: `${confidence.color}15`,
            border: `1px solid ${confidence.color}40`,
            color: confidence.color,
          }}
        >
          {confidence.icon}
          {confidence.label}
        </span>
      </div>

      <div style={{ borderTop: "1px solid rgba(0,240,255,0.08)" }} className="mb-6" />

      {/* ── Evidence Tags ── */}
      {evidenceTags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
            Evidence Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {evidenceTags.map((tag, i) => (
              <EvidenceTagPill key={i} tag={tag} />
            ))}
          </div>
        </div>
      )}

      {/* ── Detected Artifacts ── */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
          Detected Artifacts
        </h3>
        <ul className="space-y-2">
          {detectedArtifacts.map((artifact, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm text-slate-300"
            >
              <span
                className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full"
                style={{
                  background: dotColor,
                  boxShadow: `0 0 6px ${dotGlow}`,
                }}
              />
              {artifact}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ borderTop: "1px solid rgba(0,240,255,0.08)" }} className="mb-6" />

      {/* ── Signal Breakdown ── */}
      <BreakdownSection result={result} />
    </div>
  );
}
