import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
          }}
        >
          <ShieldAlert size={32} className="text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Verification Record Not Found
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          This scan ID doesn&apos;t exist or may have expired.
        </p>
        <Link
          href="/"
          className="btn-neon text-sm"
          style={{ display: "inline-flex" }}
        >
          Run a New Scan
        </Link>
      </div>
    </div>
  );
}
