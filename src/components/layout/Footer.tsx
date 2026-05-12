import { Shield, Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative z-10 mt-auto"
      style={{
        borderTop: "1px solid rgba(0, 240, 255, 0.06)",
        background: "rgba(3, 7, 18, 0.6)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{
                background: "linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(168, 85, 247, 0.1))",
                border: "1px solid rgba(0, 240, 255, 0.15)",
              }}
            >
              <Shield size={16} className="text-[#00f0ff]" />
            </div>
            <span className="text-sm font-semibold">
              <span className="text-neon">Origin</span>
              <span className="text-white">Shield</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-[#00f0ff] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#00f0ff] transition-colors">Terms</Link>
            <Link href="/api-docs" className="hover:text-[#00f0ff] transition-colors">API Docs</Link>
            <Link href="/auth" className="hover:text-[#00f0ff] transition-colors">Login</Link>
          </div>

          {/* Copyright */}
          <p className="flex items-center gap-1.5 text-xs text-slate-600">
            Built with <Heart size={12} className="text-[#f472b6]" /> &copy; {new Date().getFullYear()} OriginShield
          </p>
        </div>
      </div>
    </footer>
  );
}
