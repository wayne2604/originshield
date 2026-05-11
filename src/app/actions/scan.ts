"use server";

import { createServerClient } from "@/lib/supabase/server";
import { dbRowToScanResult } from "@/lib/supabase/mappers";
import type { ScanResult } from "@/types";

// ── Save a completed scan result to the database ──────────────────────────

export async function saveScan(
  result: ScanResult,
  contentHash: string
): Promise<void> {
  const supabase = createServerClient();

  await supabase.from("scans").insert({
    id: result.id,
    content_hash: contentHash,
    type: result.type,
    truth_score: result.truthScore,
    verdict: result.label,
    confidence_level: result.confidenceLevel,
    c2pa_verified: result.c2paVerified,
    detected_artifacts: result.detectedArtifacts,
    evidence_tags: result.evidenceTags,
    breakdown: result.breakdown,
    metadata: {},
    created_at: result.timestamp,
  });
}

// ── Look up a cached scan by content hash ────────────────────────────────

export async function getCachedScan(
  contentHash: string
): Promise<ScanResult | null> {
  const supabase = createServerClient();

  const { data } = await supabase
    .from("scans")
    .select("*")
    .eq("content_hash", contentHash)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data ? dbRowToScanResult(data) : null;
}

// ── Fetch a single scan by ID (for /v/[id] page) ──────────────────────────

export async function getScanById(id: string): Promise<ScanResult | null> {
  const supabase = createServerClient();

  const { data } = await supabase
    .from("scans")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return data ? dbRowToScanResult(data) : null;
}

// ── Fetch recent scans for the homepage panel ─────────────────────────────

export async function getRecentScans(limit = 5): Promise<ScanResult[]> {
  const supabase = createServerClient();

  const { data } = await supabase
    .from("scans")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map(dbRowToScanResult);
}
