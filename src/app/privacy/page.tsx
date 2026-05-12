import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="relative z-10 flex-1 px-4 py-24">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-[#00f0ff] hover:text-white">
          Back to scanner
        </Link>
        <h1 className="text-4xl font-bold text-white mt-6 mb-4">
          Privacy Policy
        </h1>
        <div className="space-y-5 text-sm leading-7 text-slate-400">
          <p>
            OriginShield processes submitted text, images, and URLs only to
            produce verification results. Provider API keys remain server-side.
          </p>
          <p>
            Scan results may be stored to support result sharing and duplicate
            detection. Do not submit content you are not authorized to analyze.
          </p>
          <p>
            Environment secrets are not exposed to browser code. Public
            configuration values use the Next.js NEXT_PUBLIC prefix.
          </p>
        </div>
      </div>
    </main>
  );
}
