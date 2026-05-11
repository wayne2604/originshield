// Detection service — placeholder for API integration

export type DetectionType = "text" | "image" | "url";

export interface DetectionResult {
  id: string;
  type: DetectionType;
  score: number; // 0-1, probability of AI generation
  label: "human" | "ai" | "mixed";
  details: string;
  timestamp: string;
}

/**
 * Analyze text content for AI generation
 */
export async function analyzeText(content: string): Promise<DetectionResult> {
  // TODO: integrate with actual detection API
  return {
    id: crypto.randomUUID(),
    type: "text",
    score: 0,
    label: "human",
    details: "Analysis pending — API not yet connected.",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Analyze an uploaded image for AI generation
 */
export async function analyzeImage(file: File): Promise<DetectionResult> {
  // TODO: integrate with actual detection API
  return {
    id: crypto.randomUUID(),
    type: "image",
    score: 0,
    label: "human",
    details: "Analysis pending — API not yet connected.",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Analyze a URL's content for AI generation
 */
export async function analyzeUrl(url: string): Promise<DetectionResult> {
  // TODO: integrate with actual detection API
  return {
    id: crypto.randomUUID(),
    type: "url",
    score: 0,
    label: "human",
    details: "Analysis pending — API not yet connected.",
    timestamp: new Date().toISOString(),
  };
}
