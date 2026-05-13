import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import { ArrowLeft } from "lucide-react";

export default function AuthPage() {
  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <Link 
          href="/" 
          className="mb-6 inline-flex items-center justify-center w-10 h-10 rounded-xl border border-cyan-500/20 bg-slate-950/50 text-[#00f0ff] transition-all hover:border-cyan-500/50 hover:bg-cyan-500/10"
          aria-label="Back to scanner"
        >
          <ArrowLeft size={20} />
        </Link>
        <AuthForm />
      </div>
    </main>
  );
}
