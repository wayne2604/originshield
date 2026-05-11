import { ShieldCheck, ShieldAlert, ShieldHalf, Clock } from "lucide-react";
import type { DetectionResult } from "@/types";
import { LABEL_COLORS } from "@/constants";
import { formatConfidence } from "@/lib/utils";
import Badge from "./Badge";

interface ResultCardProps {
  result: DetectionResult;
}

const LABEL_ICON = {
  human: ShieldCheck,
  ai: ShieldAlert,
  mixed: ShieldHalf,
  pending: Clock,
};

export default function ResultCard({ result }: ResultCardProps) {
  const { score, label, details, timestamp, type } = result;
  const colors = LABEL_COLORS[label];
  const Icon = LABEL_ICON[label];
  const pct = score * 100;

  return (
    <div
      className="glass-card p-6 mt-6 animate-fade-in-up"
      style={{ borderColor: colors.border }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
          >
            <Icon size={20} style={{ color: colors.text }} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
              {type} analysis
            </p>
            <p className="text-sm font-semibold text-slate-200">Detection Result</p>
          </div>
        </div>
        <Badge label={label} />
      </div>

      {/* Score bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-500">AI Probability</span>
          <span className="text-sm font-bold" style={{ color: colors.text }}>
            {formatConfidence(score)}
          </span>
        </div>
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ background: "rgba(15,23,42,0.8)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${colors.text}, ${colors.border})`,
              boxShadow: `0 0 8px ${colors.border}`,
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-slate-600">Human</span>
          <span className="text-[10px] text-slate-600">AI-Generated</span>
        </div>
      </div>

      {/* Details */}
      <p className="text-sm text-slate-400 leading-relaxed mb-4">{details}</p>

      {/* Footer */}
      <p className="text-xs text-slate-600">
        Scanned at{" "}
        {new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </p>
    </div>
  );
}
