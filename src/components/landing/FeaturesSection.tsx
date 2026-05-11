"use client";

import { Brain, ScanEye, Globe, ShieldHalf, Gauge, Lock } from "lucide-react";

const FEATURES = [
  { icon: <Brain size={24} />, title: "Deep Learning Analysis", description: "Transformer-based models detect patterns unique to AI-generated text with high accuracy.", accent: "#00f0ff" },
  { icon: <ScanEye size={24} />, title: "Image Forensics", description: "Detects GAN artifacts, diffusion model signatures, and pixel-level anomalies in uploaded images.", accent: "#a855f7" },
  { icon: <Globe size={24} />, title: "URL Content Scanning", description: "Extracts and analyzes web page content in real-time for AI authorship signals.", accent: "#22d3ee" },
  { icon: <ShieldHalf size={24} />, title: "Confidence Scoring", description: "Detailed confidence breakdowns showing probability of AI vs human authorship.", accent: "#f472b6" },
  { icon: <Gauge size={24} />, title: "Real-time Results", description: "Results in milliseconds. Built for high-throughput workflows and enterprise use.", accent: "#00f0ff" },
  { icon: <Lock size={24} />, title: "Privacy First", description: "Data is never stored or used for training. Analysis happens in isolated environments.", accent: "#a855f7" },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative z-10 py-16 sm:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff] mb-3">Capabilities</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Built for trust verification</h2>
          <p className="text-base text-slate-400 max-w-xl mx-auto">Industry-leading detection across every content type, powered by state-of-the-art AI forensics.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="feature-card group" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl mb-5 transition-transform duration-300 group-hover:scale-110" style={{ background: `${f.accent}12`, border: `1px solid ${f.accent}25`, color: f.accent }}>
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
