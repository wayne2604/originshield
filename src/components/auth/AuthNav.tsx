"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, LayoutDashboard } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function AuthNav() {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const isAdmin = role === 'admin' || role === 'superadmin';

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        fetchRole(data.session.user.id);
      }
    });

    const { data } = supabaseBrowser.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        fetchRole(nextSession.user.id);
      } else {
        setRole(null);
      }
    });

    async function fetchRole(userId: string) {
      const { data } = await supabaseBrowser
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      setRole(data?.role || 'user');
    }

    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <div className="flex items-center gap-1">
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center justify-center w-9 h-9 rounded-lg text-[#00f0ff] transition-all duration-200 hover:bg-[rgba(0,240,255,0.05)]"
          title="Admin Dashboard"
          aria-label="Admin Dashboard"
        >
          <LayoutDashboard size={18} />
        </Link>
      )}
      <Link
        href={session ? "/profile" : "/auth"}
        className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 transition-all duration-200 hover:text-[#00f0ff] hover:bg-[rgba(0,240,255,0.05)]"
        aria-label={session ? "Profile" : "Login"}
      >
        <User size={18} />
      </Link>
    </div>
  );
}
