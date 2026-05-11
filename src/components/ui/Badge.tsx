import type { DetectionLabel } from "@/types";
import { LABEL_COLORS } from "@/constants";

interface BadgeProps {
  label: DetectionLabel;
  className?: string;
}

const LABEL_TEXT: Record<DetectionLabel, string> = {
  human: "Human",
  ai: "AI-Generated",
  mixed: "Mixed",
  pending: "Pending",
};

export default function Badge({ label, className = "" }: BadgeProps) {
  const colors = LABEL_COLORS[label];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase ${className}`}
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
      }}
    >
      {LABEL_TEXT[label]}
    </span>
  );
}
