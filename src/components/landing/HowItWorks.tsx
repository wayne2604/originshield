"use client";

import { FileInput, ShieldCheck, BarChart3 } from "lucide-react";

const STEPS = [
  {
    icon: <FileInput size={22} />,
    title: "Submit content",
    description: "Paste text, upload media, or provide a public URL for analysis.",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Verify signals",
    description: "OriginShield checks AI authorship, metadata, provenance, and forensic markers.",
  },
  {
    icon: <BarChart3 size={22} />,
    title: "Review evidence",
    description: "Each scan returns a confidence score, verdict, and traceable evidence tags.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 py-16 sm:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff] mb-3">
            Workflow
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Scan evidence, not guesses
          </h2>
          <p className="text-base text-slate-400 max-w-2xl">
            The scanner routes each content type through a dedicated verification
            path, then returns the signals that drove the final verdict.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map((step, index) => (
            <div key={step.title} className="feature-card">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="flex items-center justify-center w-11 h-11 rounded-xl text-[#00f0ff]"
                  style={{
                    background: "rgba(0, 240, 255, 0.08)",
                    border: "1px solid rgba(0, 240, 255, 0.16)",
                  }}
                >
                  {step.icon}
                </div>
                <span className="font-mono text-xs text-slate-500">
                  0{index + 1}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
