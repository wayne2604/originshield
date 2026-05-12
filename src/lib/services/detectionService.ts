// Detection Orchestrator — Phase 2
// Routes detection requests to the appropriate secure API route.
// Text  → /api/verify/text  (Sapling AI)
// Image → /api/verify/media (metadata forensics → Sightengine)
// URL   → /api/verify/url   (page extraction → Sapling AI)

import type { DetectionType, ScanResult } from "@/types";
import { supabaseBrowser } from "@/lib/supabase/client";

export class DetectionError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "DetectionError";
    this.code = code;
  }
}

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabaseBrowser.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── URL processing ────────────────────────────────────────────────────────

async function processUrl(url: string): Promise<ScanResult> {
  const res = await fetch("/api/verify/url", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new DetectionError(err.error ?? "URL analysis failed", err.code);
  }

  return res.json();
}

// ── Public API ────────────────────────────────────────────────────────────

export async function runDetection(
  type: DetectionType,
  content: string | File
): Promise<ScanResult> {
  if (type === "text") {
    const res = await fetch("/api/verify/text", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify({ text: content as string }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Request failed" }));
      throw new DetectionError(err.error ?? "Text analysis failed", err.code);
    }

    return res.json();
  }

  if (type === "image") {
    const formData = new FormData();
    formData.append("file", content as File);

    const res = await fetch("/api/verify/media", {
      method: "POST",
      headers: await authHeaders(),
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Request failed" }));
      throw new DetectionError(err.error ?? "Image analysis failed", err.code);
    }

    return res.json();
  }

  if (type === "url") {
    return processUrl(content as string);
  }

  throw new Error(`Unsupported detection type: ${type}`);
}
