"use client";

import { useState } from "react";
import { Shield, Menu, X, GitFork, Zap } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      id="navbar"
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(3, 7, 18, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0, 240, 255, 0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group" id="nav-logo">
            <div
              className="relative flex items-center justify-center w-9 h-9 rounded-lg"
              style={{
                background: "linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(168, 85, 247, 0.15))",
                border: "1px solid rgba(0, 240, 255, 0.2)",
              }}
            >
              <Shield size={20} className="text-[#00f0ff]" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-neon">Origin</span>
              <span className="text-white">Shield</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {["Features", "How It Works", "API"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                className="px-3.5 py-2 text-sm font-medium text-slate-400 rounded-lg transition-all duration-200 hover:text-[#00f0ff] hover:bg-[rgba(0,240,255,0.05)]"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 transition-all duration-200 hover:text-[#00f0ff] hover:bg-[rgba(0,240,255,0.05)]"
              aria-label="GitHub"
            >
              <GitFork size={18} />
            </a>
            <div className="w-px h-6 bg-slate-700/50" />
            <button className="btn-neon text-sm !py-2 !px-4" id="nav-cta">
              <Zap size={14} />
              <span>Get Started</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 transition-colors hover:text-white"
            id="mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden animate-fade-in"
          style={{
            background: "rgba(3, 7, 18, 0.95)",
            borderTop: "1px solid rgba(0, 240, 255, 0.08)",
          }}
        >
          <div className="px-4 py-4 space-y-1">
            {["Features", "How It Works", "API"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-slate-400 rounded-lg transition-colors hover:text-[#00f0ff] hover:bg-[rgba(0,240,255,0.05)]"
              >
                {item}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-800">
              <button className="btn-neon w-full text-sm !py-2.5">
                <Zap size={14} />
                <span>Get Started</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
