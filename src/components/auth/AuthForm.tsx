"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, LogIn, Mail, UserPlus } from "lucide-react";
import { setRememberMePreference, supabaseBrowser } from "@/lib/supabase/client";

async function getRedirectPath(userId: string): Promise<string> {
  const { data } = await supabaseBrowser
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  return data?.role === 'admin' || data?.role === 'superadmin' ? '/admin' : '/profile';
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="#1877F2"
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.414c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97H15.83c-1.49 0-1.955.93-1.955 1.884v2.266h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
      />
      <path
        fill="#FFFFFF"
        d="m16.671 15.563.532-3.49h-3.328V9.807c0-.954.465-1.884 1.955-1.884h1.514v-2.97s-1.374-.236-2.686-.236c-2.741 0-4.533 1.672-4.533 4.697v2.659H7.078v3.49h3.047V24a12.116 12.116 0 0 0 3.75 0v-8.437h2.796z"
      />
    </svg>
  );
}

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup" | "update_password">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("update_password");
      }
      
      if (session) {
        // Ensure cookie is set for all login types (Password, OAuth, etc.)
        document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${session.expires_in}; SameSite=Lax; Secure`;
      }

      if (event === "SIGNED_IN" && session?.user) {
        const path = await getRedirectPath(session.user.id);
        router.push(path);
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  async function submit() {
    setLoading(true);
    setMessage(null);
    setRememberMePreference(rememberMe);

    const auth =
      mode === "login"
        ? await supabaseBrowser.auth.signInWithPassword({ email, password })
        : await supabaseBrowser.auth.signUp({ email, password });

    setLoading(false);

    if (auth.error) {
      setMessage(auth.error.message);
      return;
    }

    if (mode === "signup" && !auth.data.session) {
      setMessage("Check your email to confirm your account.");
      return;
    }

    if (auth.data.session) {
      document.cookie = `sb-access-token=${auth.data.session.access_token}; path=/; max-age=${auth.data.session.expires_in}; SameSite=Lax; Secure`;
      const path = await getRedirectPath(auth.data.session.user.id);
      router.push(path);
      router.refresh();
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  async function handleUpdatePassword() {
    setLoading(true);
    setMessage(null);

    const { error } = await supabaseBrowser.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password updated successfully! Redirecting...");
    setTimeout(() => {
      router.push("/profile");
      router.refresh();
    }, 2000);
  }

  async function sendPasswordReset() {
    if (!email) {
      setMessage("Enter your email first, then request a password reset.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setRememberMePreference(rememberMe);

    const { error } = await supabaseBrowser.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });

    setLoading(false);
    setMessage(error ? error.message : "Password reset email sent.");
  }

  async function signInWithProvider(provider: "google" | "facebook") {
    setLoading(true);
    setMessage(null);
    setRememberMePreference(rememberMe);

    const { error } = await supabaseBrowser.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth`,
        skipBrowserRedirect: false,
      },
    });

    if (error) {
      setLoading(false);
      setMessage(error.message);
    }
  }

  return (
    <div className="glass-card-strong w-full max-w-md p-6 sm:p-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff] mb-3">
          Account
        </p>
        <h1 className="text-3xl font-bold text-white">
          {mode === "login" ? "Log in" : "Create account"}
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Save scan history and review previous verification records.
        </p>
      </div>

      {mode !== "update_password" && (
        <div className="flex gap-2 mb-5">
          {(["login", "signup"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setMode(item)}
              className={`tab-toggle flex-1 justify-center ${mode === item ? "active" : ""}`}
            >
              {item === "login" ? <LogIn size={15} /> : <UserPlus size={15} />}
              <span>{item === "login" ? "Login" : "Sign up"}</span>
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {mode !== "update_password" && (
          <div className="relative">
            <Mail
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
            />
            <input
              className="input-cyber !pl-10"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        )}
        <div className="relative">
          <KeyRound
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
          />
          <input
            className="input-cyber !pl-10"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "update_password" ? "Enter new password" : "Password"}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </div>
      </div>

      {mode === "login" && (
        <div className="mt-4 flex items-center justify-between gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-slate-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-cyan-500/20 bg-slate-950 accent-[#00f0ff]"
            />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            onClick={sendPasswordReset}
            disabled={loading}
            className="text-[#00f0ff] transition-colors hover:text-white disabled:opacity-50"
          >
            Forgot password?
          </button>
        </div>
      )}

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-cyan-500/10" />
        <span className="text-xs uppercase tracking-[0.18em] text-slate-600">
          or continue with
        </span>
        <div className="h-px flex-1 bg-cyan-500/10" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => signInWithProvider("google")}
          disabled={loading}
          className="btn-ghost text-sm"
        >
          <GoogleLogo />
          <span>Google</span>
        </button>
        <button
          type="button"
          onClick={() => signInWithProvider("facebook")}
          disabled={loading}
          className="btn-ghost text-sm"
        >
          <FacebookLogo />
          <span>Facebook</span>
        </button>
      </div>

      {message && (
        <p className="mt-4 rounded-lg border border-cyan-300/15 bg-cyan-300/5 px-4 py-2 text-sm text-slate-300">
          {message}
        </p>
      )}

      <button
        className="btn-neon mt-6 w-full"
        onClick={mode === "update_password" ? handleUpdatePassword : submit}
        disabled={loading || (mode !== "update_password" && !email) || password.length < 6}
        style={{
          opacity: loading || (mode !== "update_password" && !email) || password.length < 6 ? 0.45 : 1,
          cursor: loading || (mode !== "update_password" && !email) || password.length < 6 ? "not-allowed" : "pointer",
        }}
      >
        {mode === "login" ? (
          <LogIn size={16} />
        ) : mode === "signup" ? (
          <UserPlus size={16} />
        ) : (
          <KeyRound size={16} />
        )}
        <span>
          {loading
            ? "Working..."
            : mode === "login"
              ? "Log in"
              : mode === "signup"
                ? "Sign up"
                : "Update Password"}
        </span>
      </button>
    </div>
  );
}
