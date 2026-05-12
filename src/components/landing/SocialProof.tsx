"use client";

import { Activity, Database, ShieldCheck, Timer } from "lucide-react";

const STATS = [
  { icon: <ShieldCheck size={20} />, value: "3", label: "content types verified" },
  { icon: <Activity size={20} />, value: "100%", label: "server-side provider keys" },
  { icon: <Database size={20} />, value: "50", label: "saved scans per profile" },
  { icon: <Timer size={20} />, value: "60s", label: "quota protection windows" },
];

export default function SocialProof() {
  return (
    <section id="trust" className="relative z-10 py-12 sm:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-2xl p-4 sm:p-5"
          style={{
            background: "rgba(15, 23, 42, 0.45)",
            border: "1px solid rgba(0, 240, 255, 0.1)",
          }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="p-4">
              <div className="flex items-center gap-3 mb-3 text-[#00f0ff]">
                {stat.icon}
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
