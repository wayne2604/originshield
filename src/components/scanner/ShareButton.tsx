"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

interface ShareButtonProps {
  scanId: string;
}

export default function ShareButton({ scanId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/v/${scanId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
      style={{
        background: copied
          ? "rgba(34,197,94,0.1)"
          : "rgba(0,240,255,0.06)",
        border: copied
          ? "1px solid rgba(34,197,94,0.35)"
          : "1px solid rgba(0,240,255,0.2)",
        color: copied ? "#4ade80" : "#00f0ff",
      }}
    >
      {copied ? (
        <>
          <Check size={14} />
          Link Copied!
        </>
      ) : (
        <>
          <Link2 size={14} />
          Copy Verification Link
        </>
      )}
    </button>
  );
}
