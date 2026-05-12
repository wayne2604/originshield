"use client";

import { Braces, Image as ImageIcon, Link2 } from "lucide-react";

const ENDPOINTS = [
  {
    icon: <Braces size={20} />,
    method: "POST",
    path: "/api/verify/text",
    description: "Analyze pasted text with Sapling AI detection.",
  },
  {
    icon: <ImageIcon size={20} />,
    method: "POST",
    path: "/api/verify/media",
    description: "Analyze uploaded images with metadata and Sightengine signals.",
  },
  {
    icon: <Link2 size={20} />,
    method: "POST",
    path: "/api/verify/url",
    description: "Extract readable page text and analyze URL content.",
  },
];

export default function ApiSection() {
  return (
    <section id="api" className="relative z-10 py-16 sm:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff] mb-3">
              API
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Same verified routes as the scanner
            </h2>
            <p className="text-base text-slate-400 leading-relaxed">
              Client requests stay on first-party Route Handlers, keeping provider
              keys server-side while rate limits protect external quotas.
            </p>
          </div>

          <div className="space-y-3">
            {ENDPOINTS.map((endpoint) => (
              <div
                key={endpoint.path}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl"
                style={{
                  background: "rgba(15, 23, 42, 0.45)",
                  border: "1px solid rgba(0, 240, 255, 0.1)",
                }}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg text-[#00f0ff] bg-cyan-400/5">
                    {endpoint.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-emerald-300">
                        {endpoint.method}
                      </span>
                      <code className="text-sm text-white break-all">
                        {endpoint.path}
                      </code>
                    </div>
                    <p className="text-sm text-slate-400">
                      {endpoint.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
