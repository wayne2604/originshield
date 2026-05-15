"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, LogOut, ShieldCheck } from "lucide-react";
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
  const [role, setRole] = useState<string | null>(null);
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchRole(userId: string) {
    const { data } = await supabaseBrowser
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    setRole(data?.role || 'user');
  }

  async function loadScans(token: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/me/scans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setScans(json.scans ?? []);
    } catch (err) {
      console.error("Failed to load scans:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // 1. Initial check
    supabaseBrowser.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (initialSession) {
        setSession(initialSession);
        loadScans(initialSession.access_token);
        fetchRole(initialSession.user.id);
      } else {
        // If no session, we don't immediately redirect. 
        // We wait for onAuthStateChange in case of OAuth redirect processing.
        setLoading(false);
      }
    });

    // 2. Listen for changes (OAuth return, etc.)
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((event, currentSession) => {
      if (currentSession) {
        setSession(currentSession);
        loadScans(currentSession.access_token);
        fetchRole(currentSession.user.id);
      } else if (event === "SIGNED_OUT") {
        router.replace("/auth");
      }
    });

    // 3. Safety timeout: If still no session after 2 seconds, redirect to auth
    const timeout = setTimeout(async () => {
      const { data: { session: finalCheck } } = await supabaseBrowser.auth.getSession();
      if (!finalCheck) {
        router.replace("/auth");
      }
    }, 2000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  async function signOut() {
    try {
      // 1. Clear the access token cookie immediately for middleware/SSR
      document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      // 2. Perform local sign out (instant)
      await supabaseBrowser.auth.signOut({ scope: 'local' });
      
      // 3. Trigger global sign out in background
      supabaseBrowser.auth.signOut().catch(() => {});

      // 4. Redirect immediately
      router.replace("/");
    } catch (err) {
      console.error("Sign out error:", err);
      router.replace("/auth");
    }
  }

  if (!session && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00f0ff] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="relative z-10 flex-1 px-4 py-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <Link 
              href="/" 
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-cyan-500/20 bg-slate-950/50 text-[#00f0ff] transition-all hover:border-cyan-500/50 hover:bg-cyan-500/10"
              aria-label="Back to scanner"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-4xl font-bold text-white mt-5">Profile</h1>
            <p className="text-sm text-slate-400 mt-2">
              {session?.user.email}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {role === 'admin' && (
              <Link href="/admin" className="btn-neon text-sm !py-2 !px-4">
                <ShieldCheck size={16} />
                <span>Admin Panel</span>
              </Link>
            )}
            <button onClick={signOut} className="btn-ghost text-sm">
              <LogOut size={15} />
              <span>Sign out</span>
            </button>
          </div>
        </div>

        <section className="glass-card-strong p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <ShieldCheck size={16} className="text-[#00f0ff]" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              Scan History
            </h2>
          </div>

          {loading && scans.length === 0 ? (
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
                      <span className="text-sm font-semibold" style={{ color: LABEL_COLOR[scan.label as keyof typeof LABEL_COLOR] || "#94a3b8" }}>
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
