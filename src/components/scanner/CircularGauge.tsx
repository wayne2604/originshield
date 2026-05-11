"use client";

import { useEffect, useState } from "react";
import type { TruthLabel } from "@/types";

interface CircularGaugeProps {
  score: number; // 0–100
  label: TruthLabel;
  size?: number;
}

const LABEL_META: Record<
  TruthLabel,
  { color: string; glow: string; text: string }
> = {
  human: {
    color: "#22c55e",
    glow: "rgba(34,197,94,0.4)",
    text: "Authentic",
  },
  uncertain: {
    color: "#eab308",
    glow: "rgba(234,179,8,0.4)",
    text: "Uncertain",
  },
  ai: {
    color: "#ef4444",
    glow: "rgba(239,68,68,0.4)",
    text: "AI-Generated",
  },
};

export default function CircularGauge({
  score,
  label,
  size = 180,
}: CircularGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score counter on mount
  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  const meta = LABEL_META[label];
  const cx = size / 2;
  const cy = size / 2;
  const strokeWidth = size * 0.072;
  const radius = (size - strokeWidth) / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - animatedScore / 100);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: `0 0 40px ${meta.glow}, 0 0 80px ${meta.glow}33`,
          }}
        />

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rotate-[-90deg]"
        >
          {/* Track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="rgba(15,23,42,0.9)"
            strokeWidth={strokeWidth}
          />
          {/* Background dim ring */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={meta.color}
            strokeWidth={strokeWidth}
            strokeOpacity={0.12}
            strokeDasharray={circumference}
            strokeDashoffset={0}
          />
          {/* Progress arc */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={meta.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              filter: `drop-shadow(0 0 6px ${meta.glow})`,
              transition: "stroke-dashoffset 0.05s linear",
            }}
          />
        </svg>

        {/* Center text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ rotate: "0deg" }}
        >
          <span
            className="font-extrabold leading-none tabular-nums"
            style={{
              fontSize: size * 0.22,
              color: meta.color,
              textShadow: `0 0 20px ${meta.glow}`,
            }}
          >
            {animatedScore}
          </span>
          <span
            className="text-xs font-semibold tracking-widest uppercase mt-1"
            style={{ color: meta.color, opacity: 0.8 }}
          >
            / 100
          </span>
        </div>
      </div>

      {/* Label pill */}
      <span
        className="px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase"
        style={{
          background: `${meta.color}18`,
          border: `1px solid ${meta.color}55`,
          color: meta.color,
          boxShadow: `0 0 12px ${meta.glow}`,
        }}
      >
        {meta.text}
      </span>
    </div>
  );
}
