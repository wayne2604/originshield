// Detection Orchestrator — Phase 2
// Routes detection requests to the appropriate secure API route.
// Text  → /api/verify/text  (Sapling AI)
// Image → /api/verify/media (metadata forensics → Sightengine)
// URL   → mock (no free URL API yet; swap in Phase 3)

import type { DetectionType, ScanResult, EvidenceTag } from "@/types";

// ── URL mock (Phase 2 placeholder) ────────────────────────────────────────

function rand(min: number, max: number, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

async function mockUrlScan(url: string): Promise<ScanResult> {
  await new Promise((r) => setTimeout(r, 1500));
  const aiProbability = rand(0.1, 0.9);
  const truthScore = Math.round((1 - aiProbability) * 100);
  const label =
    truthScore >= 68 ? "human" : truthScore >= 38 ? "uncertain" : "ai";
  const dist = Math.abs(truthScore - 50);
  const confidenceLevel =
    dist >= 30 ? "high" : dist >= 15 ? "medium" : "low";

  const evidenceTags: EvidenceTag[] =
    aiProbability > 0.6
      ? [
          { label: "Formulaic Heading Structure", variant: "negative" },
          { label: "High Style Consistency", variant: "negative" },
          { label: "Keyword Stuffing Detected", variant: "negative" },
        ]
      : [
          { label: "Organic Heading Variance", variant: "positive" },
          { label: "Natural Reading Level Shift", variant: "positive" },
          { label: "Embedded Opinion Markers", variant: "positive" },
        ];

  return {
    id: crypto.randomUUID(),
    type: "url",
    truthScore,
    label,
    confidenceLevel,
    detectedArtifacts:
      aiProbability > 0.6
        ? [
            "Formulaic H2/H3 heading distribution",
            "High stylistic consistency across all sections",
            "Sentence length variance below human baseline",
          ]
        : [
            "Organic heading structure with varied depth",
            "Embedded personal opinion markers",
            "Natural reading-level variance across paragraphs",
          ],
    evidenceTags,
    c2paVerified: false,
    breakdown: {
      styleConsistency: rand(0.2, 0.99),
      repetitionScore: rand(0.05, 0.8),
      sentenceVariance: rand(0.15, 0.95),
      linkPatternScore: rand(0.1, 0.9),
    },
    timestamp: new Date().toISOString(),
  };
}

// ── Public API ────────────────────────────────────────────────────────────

export async function runDetection(
  type: DetectionType,
  content: string | File
): Promise<ScanResult> {
  if (type === "text") {
    const res = await fetch("/api/verify/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content as string }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Request failed" }));
      throw new Error(err.error ?? "Text analysis failed");
    }

    return res.json();
  }

  if (type === "image") {
    const formData = new FormData();
    formData.append("file", content as File);

    const res = await fetch("/api/verify/media", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Request failed" }));
      throw new Error(err.error ?? "Image analysis failed");
    }

    return res.json();
  }

  if (type === "url") {
    return mockUrlScan(content as string);
  }

  throw new Error(`Unsupported detection type: ${type}`);
}
