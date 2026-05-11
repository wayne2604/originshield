// OriginShield — shared TypeScript types

// ── Legacy detection types (Phase 0 API route) ────────────────────────────

export type DetectionType = "text" | "image" | "url";

export type DetectionLabel = "human" | "ai" | "mixed" | "pending";

export interface DetectionResult {
  id: string;
  type: DetectionType;
  score: number;
  label: DetectionLabel;
  details: string;
  timestamp: string;
}

export interface DetectionRequest {
  type: DetectionType;
  content: string;
}

export interface ApiErrorResponse {
  error: string;
}

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

// ── Phase 1 / Phase 2 scanner types ───────────────────────────────────────

export type TruthLabel = "human" | "ai" | "uncertain";

export type ConfidenceLevel = "high" | "medium" | "low";

export type ScanStatus = "idle" | "loading" | "success" | "error";

/** A single evidence tag shown on the ResultCard */
export interface EvidenceTag {
  label: string;
  /** positive = green, negative = red, warning = yellow, neutral = slate */
  variant: "positive" | "negative" | "warning" | "neutral";
}

export interface TextBreakdown {
  burstiness: number;
  perplexity: number;
  repetitionScore: number;
  styleConsistency: number;
}

export interface ImageBreakdown {
  exifData: Record<string, string>;
  compressionArtifacts: boolean;
  metadataConsistency: boolean;
  noisePattern: string;
}

export interface UrlBreakdown {
  styleConsistency: number;
  repetitionScore: number;
  sentenceVariance: number;
  linkPatternScore: number;
}

export interface ScanResult {
  id: string;
  type: DetectionType;
  /** 0–100: higher = more likely human */
  truthScore: number;
  label: TruthLabel;
  confidenceLevel: ConfidenceLevel;
  detectedArtifacts: string[];
  /** Granular evidence pills shown on the result card */
  evidenceTags: EvidenceTag[];
  /** True when a valid C2PA cryptographic signature was found */
  c2paVerified: boolean;
  breakdown: Partial<TextBreakdown & ImageBreakdown & UrlBreakdown>;
  timestamp: string;
}
