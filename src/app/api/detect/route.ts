import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, content } = body;

    if (!type || !content) {
      return NextResponse.json(
        { error: "Missing 'type' and 'content' fields." },
        { status: 400 }
      );
    }

    // TODO: integrate with detection model / external API
    return NextResponse.json({
      id: crypto.randomUUID(),
      type,
      score: 0,
      label: "pending",
      details: "Detection API not yet connected.",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
}
