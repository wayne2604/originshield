// OriginShield — application constants

export const APP_NAME = "OriginShield";
export const APP_TAGLINE = "Verify what's authentically human";

// API routes
export const API_ROUTES = {
  detect: "/api/detect",
} as const;

// Detection thresholds
export const SCORE_THRESHOLDS = {
  /** Below this → human */
  human: 0.35,
  /** Above this → ai */
  ai: 0.65,
  /** Between human and ai → mixed */
} as const;

// Input validation limits
export const INPUT_LIMITS = {
  textMin: 20,
  textMax: 50_000,
  urlMin: 6,
  imageSizeBytes: 10 * 1024 * 1024, // 10 MB
  imageAccept: "image/*",
} as const;

// Tab labels used in InputHub
export const TAB_LABELS = {
  text: "Text",
  image: "Image",
  url: "URL",
} as const;

// Color tokens for label badges (maps to Tailwind / CSS vars)
export const LABEL_COLORS = {
  human: { bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)", text: "#4ade80" },
  ai: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", text: "#f87171" },
  mixed: { bg: "rgba(234,179,8,0.12)", border: "rgba(234,179,8,0.3)", text: "#facc15" },
  pending: { bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.3)", text: "#94a3b8" },
} as const;
