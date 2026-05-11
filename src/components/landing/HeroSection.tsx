"use client";

import { ShieldCheck, Sparkles, ArrowDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative z-10 pt-28 pb-8 sm:pt-36 sm:pb-12 px-4"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-[#00f0ff] mb-6 animate-fade-in-up"
          style={{
            background: "rgba(0, 240, 255, 0.06)",
            border: "1px solid rgba(0, 240, 255, 0.15)",
          }}
        >
          <Sparkles size={13} />
          <span>AI Content Detection Platform</span>
          <div className="status-dot" />
        </div>

        {/* Heading */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 animate-fade-in-up delay-100"
          style={{ opacity: 0, animationFillMode: "forwards" }}
        >
          <span className="text-white">Verify what&apos;s</span>
          <br />
          <span className="text-neon">authentically human</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200"
          style={{ opacity: 0, animationFillMode: "forwards" }}
        >
          OriginShield analyzes text, images, and links to detect AI-generated
          content with cutting-edge deep learning models. Protect trust and
          authenticity at scale.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-fade-in-up delay-300"
          style={{ opacity: 0, animationFillMode: "forwards" }}
        >
          <a href="#input-hub" className="btn-neon text-base">
            <ShieldCheck size={18} />
            <span>Start Scanning</span>
          </a>
          <a href="#features" className="btn-ghost text-base">
            Learn More
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center animate-fade-in delay-500" style={{ opacity: 0, animationFillMode: "forwards" }}>
          <a
            href="#input-hub"
            className="flex items-center gap-2 text-xs text-slate-600 hover:text-[#00f0ff] transition-colors group"
          >
            <span>Scroll to scan</span>
            <ArrowDown size={14} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
