export default function Loading() {
  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
      <div className="glass-card-strong w-full max-w-xl p-6">
        <div className="h-4 w-32 rounded bg-cyan-300/20 mb-5 animate-pulse" />
        <div className="h-8 w-3/4 rounded bg-slate-700/60 mb-4 animate-pulse" />
        <div className="space-y-3">
          <div className="h-3 rounded bg-slate-800 animate-pulse" />
          <div className="h-3 w-5/6 rounded bg-slate-800 animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-slate-800 animate-pulse" />
        </div>
      </div>
    </main>
  );
}
