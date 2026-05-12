"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
      <div className="glass-card-strong max-w-lg p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff] mb-3">
          Error
        </p>
        <h1 className="text-3xl font-bold text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          The scanner hit an unexpected issue. Try again, or return to the main
          verification flow.
        </p>
        <button onClick={unstable_retry} className="btn-neon">
          Try again
        </button>
      </div>
    </main>
  );
}
