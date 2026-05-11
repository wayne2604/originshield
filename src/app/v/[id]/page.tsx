import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getScanById } from "@/app/actions/scan";
import VerificationView from "./VerificationView";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const scan = await getScanById(id);
  if (!scan) return { title: "Scan Not Found — OriginShield" };

  const label =
    scan.label === "human"
      ? "Authentic Human Content"
      : scan.label === "ai"
      ? "AI-Generated Content"
      : "Uncertain Origin";

  return {
    title: `${label} — OriginShield Verification`,
    description: `Truth Score: ${scan.truthScore}/100 · ${scan.type} analysis · Verified by OriginShield`,
  };
}

export default async function VerificationPage({ params }: Props) {
  const { id } = await params;
  const scan = await getScanById(id);

  if (!scan) notFound();

  return <VerificationView scan={scan} />;
}
