import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";

export default function AuthPage() {
  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 inline-block text-sm text-[#00f0ff] hover:text-white">
          Back to scanner
        </Link>
        <AuthForm />
      </div>
    </main>
  );
}
