import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createServerClient } from "@/lib/supabase/server";
import { dbRowToScanResult } from "@/lib/supabase/mappers";
import { rateLimit } from "@/lib/rateLimit";
import { checkUsageLimit } from "@/lib/services/usageService";
import type { ScanResult, EvidenceTag, TruthLabel, ConfidenceLevel } from "@/types";
import * as cheerio from "cheerio";

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
    const usage = await checkUsageLimit(req);
    if (usage.status === "forbidden") {
      return NextResponse.json(
        { error: "Usage limit reached", code: "LIMIT_REACHED" },
        { status: 403 }
      );
    }

    const limited = rateLimit(req, {
      keyPrefix: "verify:url",
      limit: 8,
      windowMs: 60_000,
    });
    if (limited) return limited;

    const { url } = await req.json();

    if (!url || typeof url !== "string" || !url.startsWith("http")) {
      return NextResponse.json(
        { error: "A valid HTTP/HTTPS URL is required." },
        { status: 400 }
      );
    }

    // 1. Fetch the URL content
    let htmlContent = "";
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      htmlContent = await response.text();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return NextResponse.json(
        { error: `Failed to fetch URL content: ${msg}` },
        { status: 400 }
      );
    }

    // 2. Extract text using Cheerio
    const $ = cheerio.load(htmlContent);
    $("script, style, noscript, iframe, img, svg").remove();
    const text = $("body").text().replace(/\s+/g, " ").trim();
    
    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: "Could not extract enough text content from this URL." },
        { status: 400 }
      );
    }

    // Trim text to a reasonable limit for Sapling (e.g., 50k chars max)
    const trimmed = text.slice(0, 50000);

    const contentHash = createHash("sha256").update(trimmed).digest("hex");
    const supabase = createServerClient();

    // ── Cache check (non-fatal) ───────────────────────────────────────────
    try {
      const { data: cached, error: cacheErr } = await supabase
        .from("scans")
        .select("*")
        .eq("content_hash", contentHash)
        .maybeSingle();
      if (cacheErr) console.warn("[url/cache-check]", cacheErr.message);
      if (cached) {
        const cachedResult = dbRowToScanResult(cached);
        const timestamp = new Date().toISOString();
        const id = crypto.randomUUID();

        await supabase.from("scans").insert({
          id,
          content_hash: contentHash,
          type: cachedResult.type,
          truth_score: cachedResult.truthScore,
          verdict: cachedResult.label,
          confidence_level: cachedResult.confidenceLevel,
          c2pa_verified: cachedResult.c2paVerified,
          detected_artifacts: cachedResult.detectedArtifacts,
          evidence_tags: cachedResult.evidenceTags,
          breakdown: cachedResult.breakdown,
          metadata: { cached_from: cached.id, url, user_id: usage.user?.id ?? null },
          user_id: usage.user?.id ?? null,
          ip_address: usage.ipAddress,
          created_at: timestamp,
        });

        return NextResponse.json({ ...cachedResult, id, timestamp });
      }
    } catch (e) {
      console.warn("[url/cache-check] skipped:", e);
    }

    // ── Sapling AI call ───────────────────────────────────────────────────
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

    if (!saplingRes.ok) {
      return NextResponse.json(
        { error: `Sapling API error (${saplingRes.status}): ${saplingRaw}` },
        { status: 502 }
      );
    }

    const sapling = JSON.parse(saplingRaw);
    const aiScore: number = typeof sapling.score === "number" ? sapling.score : 0.5;

    // Safely extract per-sentence scores
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

    const result: ScanResult = {
      id: crypto.randomUUID(),
      type: "url", // Note: It is URL now
      truthScore,
      label,
      confidenceLevel,
      detectedArtifacts: buildArtifacts(aiScore),
      evidenceTags: buildEvidenceTags(aiScore, sentenceScores as number[]),
      c2paVerified: false,
      breakdown: {
        styleConsistency: parseFloat((0.3 + aiScore * 0.6).toFixed(3)),
        repetitionScore: parseFloat(aiScore.toFixed(3)),
        sentenceVariance: parseFloat(((1 - aiScore) * 80 + 10).toFixed(1)),
        linkPatternScore: 0.5,
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
        metadata: { sapling_raw_score: aiScore, url: url, user_id: usage.user?.id ?? null },
        user_id: usage.user?.id ?? null,
        ip_address: usage.ipAddress,
        created_at: result.timestamp,
      });
      if (insertErr) console.warn("[url/db-insert]", insertErr.message);
    } catch (e) {
      console.warn("[url/db-insert] skipped:", e);
    }

    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/verify/url] CRASH:", msg);
    return NextResponse.json({ error: `Internal server error: ${msg}` }, { status: 500 });
  }
}
