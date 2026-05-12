// OriginShield shared TypeScript types

export type DetectionType = "text" | "image" | "url";

export interface ApiErrorResponse {
  error: string;
}

export type TruthLabel = "human" | "ai" | "uncertain";

export type ConfidenceLevel = "high" | "medium" | "low";

export type ScanStatus = "idle" | "loading" | "success" | "error";

export interface EvidenceTag {
  label: string;
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
  truthScore: number;
  label: TruthLabel;
  confidenceLevel: ConfidenceLevel;
  detectedArtifacts: string[];
  evidenceTags: EvidenceTag[];
  c2paVerified: boolean;
  breakdown: Partial<TextBreakdown & ImageBreakdown & UrlBreakdown>;
  timestamp: string;
}
