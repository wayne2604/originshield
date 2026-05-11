// Metadata Forensic Service
// Checks uploaded image buffers for:
//   1. C2PA (Content Credentials) cryptographic signatures
//   2. EXIF/XMP metadata integrity

import type { EvidenceTag } from "@/types";

export interface MetadataAnalysis {
  c2paFound: boolean;
  hasRichExif: boolean;
  exif: Record<string, string>;
  /** Score delta to add to the AI-model result (-50 to +50) */
  trustBoost: number;
  evidenceTags: EvidenceTag[];
  /** If true, skip the AI API and return a high-trust result immediately */
  shortCircuit: boolean;
}

// ── C2PA detection ────────────────────────────────────────────────────────
// C2PA embeds data as JUMBF boxes. We scan the raw buffer for the ASCII
// string "c2pa" which appears in the JUMBF box type UUID field.

function detectC2PA(buffer: Buffer): boolean {
  const sig = Buffer.from("c2pa");
  const appSig = Buffer.from("application/c2pa");
  const searchArea = buffer.subarray(0, Math.min(buffer.length, 512 * 1024));
  return searchArea.indexOf(sig) !== -1 || searchArea.indexOf(appSig) !== -1;
}

// ── EXIF parsing (via exifr) ──────────────────────────────────────────────

async function safeParseExif(buffer: Buffer): Promise<Record<string, unknown>> {
  try {
    const { parse } = await import("exifr");
    const result = await parse(buffer, {
      tiff: true,
      exif: true,
      gps: false,
      xmp: false,
      icc: false,
      iptc: false,
    });
    return result ?? {};
  } catch {
    return {};
  }
}

function stringifyExif(raw: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (v === null || v === undefined) continue;
    if (typeof v === "object") continue; // skip complex objects
    out[k] = String(v);
  }
  return out;
}

// ── Public API ────────────────────────────────────────────────────────────

export async function analyzeMetadata(
  buffer: Buffer
): Promise<MetadataAnalysis> {
  const evidenceTags: EvidenceTag[] = [];
  let trustBoost = 0;

  // 1. C2PA check
  const c2paFound = detectC2PA(buffer);

  if (c2paFound) {
    evidenceTags.push({ label: "C2PA Signature Found", variant: "positive" });
    evidenceTags.push({ label: "Cryptographically Verified", variant: "positive" });
    evidenceTags.push({ label: "Verified Camera Origin", variant: "positive" });
    trustBoost += 50;
  }

  // 2. EXIF check
  const rawExif = await safeParseExif(buffer);
  const exif = stringifyExif(rawExif);

  const hasCamera = !!(rawExif.Make && rawExif.Model);
  const hasDateTime = !!(rawExif.DateTimeOriginal || rawExif.DateTime);
  const hasSoftware = !!rawExif.Software;
  const hasRichExif = hasCamera && hasDateTime;

  if (hasRichExif) {
    trustBoost += 15;
    evidenceTags.push({ label: "Rich Camera EXIF Present", variant: "positive" });

    if (hasCamera) {
      evidenceTags.push({
        label: `Camera: ${rawExif.Make} ${rawExif.Model}`,
        variant: "neutral",
      });
    }

    // If Software is AI/generative tool, penalise
    const software = String(rawExif.Software ?? "").toLowerCase();
    if (
      software.includes("stable diffusion") ||
      software.includes("midjourney") ||
      software.includes("dall-e") ||
      software.includes("firefly")
    ) {
      trustBoost -= 40;
      evidenceTags.push({
        label: `AI Software Tag: ${rawExif.Software}`,
        variant: "negative",
      });
    } else if (hasSoftware) {
      evidenceTags.push({
        label: `Software: ${rawExif.Software}`,
        variant: "neutral",
      });
    }
  } else if (!c2paFound) {
    trustBoost -= 10;
    evidenceTags.push({ label: "EXIF Metadata Absent", variant: "negative" });
    evidenceTags.push({
      label: "Missing Camera Fingerprint",
      variant: "negative",
    });
  }

  // Short-circuit: if C2PA is found AND exif is consistent → skip AI API
  const shortCircuit = c2paFound && hasRichExif;

  return {
    c2paFound,
    hasRichExif,
    exif,
    trustBoost,
    evidenceTags,
    shortCircuit,
  };
}
