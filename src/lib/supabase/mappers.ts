// Maps a raw Supabase `scans` row → ScanResult TypeScript type
import type { ScanResult } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbRowToScanResult(row: Record<string, any>): ScanResult {
  return {
    id: row.id,
    type: row.type,
    truthScore: row.truth_score,
    label: row.verdict,
    confidenceLevel: row.confidence_level,
    c2paVerified: row.c2pa_verified,
    detectedArtifacts: row.detected_artifacts ?? [],
    evidenceTags: row.evidence_tags ?? [],
    breakdown: row.breakdown ?? {},
    timestamp: row.created_at,
  };
}
