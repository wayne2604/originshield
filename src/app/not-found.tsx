import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
      <div className="glass-card-strong max-w-lg p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff] mb-3">
          404
        </p>
        <h1 className="text-3xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-sm text-slate-400 mb-6">
          The page you requested does not exist or may have moved.
        </p>
        <Link href="/" className="btn-neon">
          Return home
        </Link>
      </div>
    </main>
  );
}
