"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, LogOut, ShieldCheck } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { ScanResult } from "@/types";

const LABEL_COLOR = {
  human: "#4ade80",
  ai: "#f87171",
  uncertain: "#fbbf24",
};

export default function ProfileClient() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabaseBrowser.auth.getSession();
      if (!data.session) {
        router.replace("/auth");
        return;
      }

      setSession(data.session);
      const res = await fetch("/api/me/scans", {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      });
      const json = await res.json();
      setScans(json.scans ?? []);
      setLoading(false);
    }

    load();
  }, [router]);

  async function signOut() {
    await supabaseBrowser.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <main className="relative z-10 flex-1 px-4 py-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <Link href="/" className="text-sm text-[#00f0ff] hover:text-white">
              Back to scanner
            </Link>
            <h1 className="text-4xl font-bold text-white mt-5">Profile</h1>
            <p className="text-sm text-slate-400 mt-2">
              {session?.user.email}
            </p>
          </div>
          <button onClick={signOut} className="btn-ghost text-sm">
            <LogOut size={15} />
            <span>Sign out</span>
          </button>
        </div>

        <section className="glass-card-strong p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <ShieldCheck size={16} className="text-[#00f0ff]" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              Scan History
            </h2>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Loading scan history...</p>
          ) : scans.length === 0 ? (
            <p className="text-sm text-slate-500">
              No saved scans yet. Run a scan while logged in to save it here.
            </p>
          ) : (
            <div className="space-y-3">
              {scans.map((scan) => (
                <Link
                  key={scan.id}
                  href={`/v/${scan.id}`}
                  className="flex items-center justify-between gap-4 rounded-xl p-4 transition-colors hover:bg-cyan-300/5"
                  style={{ border: "1px solid rgba(0,240,255,0.08)" }}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-xs uppercase text-slate-500">
                        {scan.type}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: LABEL_COLOR[scan.label] }}>
                        {scan.label} · {scan.truthScore}/100
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(scan.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <ExternalLink size={15} className="text-slate-600" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
