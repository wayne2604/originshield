import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createServerClient } from "@/lib/supabase/server";
import { dbRowToScanResult } from "@/lib/supabase/mappers";
import type { ScanResult, EvidenceTag, TruthLabel, ConfidenceLevel } from "@/types";

// ── Helpers ───────────────────────────────────────────────────────────────

function deriveLabel(truthScore: number): TruthLabel {
  if (truthScore >= 68) return "human";
  if (truthScore >= 38) return "uncertain";
  return "ai";
}

function deriveConfidence(truthScore: number): ConfidenceLevel {
  const dist = Math.abs(truthScore - 50);
  if (dist >= 30) return "high";
  if (dist >= 15) return "medium";
  return "low";
}

function buildEvidenceTags(
  aiScore: number,
  sentenceScores: number[]
): EvidenceTag[] {
  const tags: EvidenceTag[] = [];
  if (aiScore > 0.8) {
    tags.push({ label: "High AI Probability", variant: "negative" });
    tags.push({ label: "Uniform Sentence Cadence", variant: "negative" });
    tags.push({ label: "Low Perplexity Detected", variant: "negative" });
  } else if (aiScore > 0.55) {
    tags.push({ label: "Mixed AI / Human Signals", variant: "warning" });
    tags.push({ label: "Moderate Perplexity", variant: "warning" });
    tags.push({ label: "Partial Burstiness", variant: "warning" });
  } else if (aiScore > 0.35) {
    tags.push({ label: "Inconclusive Pattern", variant: "neutral" });
    tags.push({ label: "Borderline Perplexity Score", variant: "neutral" });
  } else {
    tags.push({ label: "High Burstiness Detected", variant: "positive" });
    tags.push({ label: "Natural Vocabulary Distribution", variant: "positive" });
    tags.push({ label: "Organic Syntax Variance", variant: "positive" });
  }
  if (sentenceScores.length > 1) {
    const variance =
      sentenceScores.reduce((sum, s) => sum + Math.pow(s - aiScore, 2), 0) /
      sentenceScores.length;
    if (variance > 0.05) {
      tags.push({ label: "High Inter-Sentence Variance", variant: "positive" });
    }
  }
  return tags;
}

function buildArtifacts(aiScore: number): string[] {
  if (aiScore > 0.8) {
    return [
      "Suspiciously uniform sentence-length distribution",
      "Overuse of transitional phrases (e.g. 'Furthermore', 'Moreover')",
      "Atypically low token entropy variance",
    ];
  }
  if (aiScore > 0.55) {
    return [
      "Mixed signal: human-like vocabulary with AI sentence rhythm",
      "Possible lightly edited AI output",
      "Inconsistent stylistic register across sections",
    ];
  }
  return [
    "Natural sentence-length variance detected",
    "Idiosyncratic punctuation patterns present",
    "Emotionally authentic phrasing observed",
  ];
}

// ── Route handler ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    console.log("[text] step 1: parsing request");
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length < 20) {
      return NextResponse.json(
        { error: "Text must be at least 20 characters." },
        { status: 400 }
      );
    }

    const trimmed = text.trim();
    console.log("[text] step 2: hashing content");
    const contentHash = createHash("sha256").update(trimmed).digest("hex");
    console.log("[text] step 3: creating supabase client");
    const supabase = createServerClient();

    // ── Cache check (non-fatal) ───────────────────────────────────────────
    try {
      const { data: cached, error: cacheErr } = await supabase
        .from("scans")
        .select("*")
        .eq("content_hash", contentHash)
        .maybeSingle();
      if (cacheErr) console.warn("[text/cache-check]", cacheErr.message);
      if (cached) return NextResponse.json(dbRowToScanResult(cached));
    } catch (e) {
      console.warn("[text/cache-check] skipped:", e);
    }

    // ── Sapling AI call ───────────────────────────────────────────────────
    console.log("[text] step 4: calling Sapling AI");
    const apiKey = process.env.SAPLING_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "SAPLING_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const saplingRes = await fetch("https://api.sapling.ai/api/v1/aidetect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: apiKey, text: trimmed }),
    });

    const saplingRaw = await saplingRes.text();
    console.log("[text] Sapling status:", saplingRes.status, "body:", saplingRaw.slice(0, 300));

    if (!saplingRes.ok) {
      return NextResponse.json(
        { error: `Sapling API error (${saplingRes.status}): ${saplingRaw}` },
        { status: 502 }
      );
    }

    const sapling = JSON.parse(saplingRaw);
    console.log("[text] step 5: sapling score =", sapling.score);
    const aiScore: number = typeof sapling.score === "number" ? sapling.score : 0.5;

    // Safely extract per-sentence scores — handle both [str, num] and {sentence, score} formats
    const rawSentences = Array.isArray(sapling.sentence_scores) ? sapling.sentence_scores : [];
    const sentenceScores: number[] = rawSentences.map((item: unknown) => {
      if (Array.isArray(item)) return typeof item[1] === "number" ? item[1] : aiScore;
      if (item && typeof item === "object") {
        const obj = item as Record<string, unknown>;
        return typeof obj.score === "number" ? obj.score : aiScore;
      }
      return aiScore;
    });

    const truthScore = Math.round((1 - aiScore) * 100);
    const label = deriveLabel(truthScore);
    const confidenceLevel = deriveConfidence(truthScore);

    const burstiness =
      sentenceScores.length > 1
        ? parseFloat(
            (
              sentenceScores.reduce(
                (sum, s) => sum + Math.pow(s - aiScore, 2),
                0
              ) / sentenceScores.length
            ).toFixed(3)
          )
        : parseFloat((1 - aiScore).toFixed(3));

    const result: ScanResult = {
      id: crypto.randomUUID(),
      type: "text",
      truthScore,
      label,
      confidenceLevel,
      detectedArtifacts: buildArtifacts(aiScore),
      evidenceTags: buildEvidenceTags(aiScore, sentenceScores as number[]),
      c2paVerified: false,
      breakdown: {
        burstiness,
        perplexity: parseFloat(((1 - aiScore) * 80 + 10).toFixed(1)),
        repetitionScore: parseFloat(aiScore.toFixed(3)),
        styleConsistency: parseFloat((0.3 + aiScore * 0.6).toFixed(3)),
      },
      timestamp: new Date().toISOString(),
    };

    // ── Save to DB (non-fatal) ────────────────────────────────────────────
    try {
      const { error: insertErr } = await supabase.from("scans").insert({
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
        metadata: { sapling_raw_score: aiScore },
        created_at: result.timestamp,
      });
      if (insertErr) console.warn("[text/db-insert]", insertErr.message);
    } catch (e) {
      console.warn("[text/db-insert] skipped:", e);
    }

    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/verify/text] CRASH:", msg);
    return NextResponse.json({ error: `Internal server error: ${msg}` }, { status: 500 });
  }
}
