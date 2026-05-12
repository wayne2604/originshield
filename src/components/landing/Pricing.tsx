"use client";

import { Check, Zap } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    description: "For quick manual checks.",
    features: ["Text, image, and URL scans", "Public verification records", "Basic scan history"],
  },
  {
    name: "Pro",
    price: "$19",
    description: "For creators and small teams.",
    featured: true,
    features: ["Higher rate limits", "Saved profile history", "Evidence-backed reports", "Priority API capacity"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For high-volume verification workflows.",
    features: ["Dedicated quotas", "Team governance", "Private deployment support", "Custom integrations"],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative z-10 py-16 sm:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff] mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Verification plans that scale
          </h2>
          <p className="text-base text-slate-400 max-w-xl mx-auto">
            Start with manual scanning, then add capacity as verification becomes part of your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="feature-card flex flex-col"
              style={{
                borderColor: plan.featured ? "rgba(0, 240, 255, 0.35)" : undefined,
                boxShadow: plan.featured ? "0 0 35px rgba(0, 240, 255, 0.08)" : undefined,
              }}
            >
              <div className="flex items-center justify-between gap-3 mb-5">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                {plan.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-cyan-300/10 px-3 py-1 text-xs text-[#00f0ff]">
                    <Zap size={12} />
                    Popular
                  </span>
                )}
              </div>
              <div className="mb-4">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                {plan.price.startsWith("$") && <span className="text-slate-500"> /mo</span>}
              </div>
              <p className="text-sm text-slate-400 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check size={15} className="mt-0.5 shrink-0 text-[#00f0ff]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a href="#input-hub" className={plan.featured ? "btn-neon mt-auto" : "btn-ghost mt-auto"}>
                Start scanning
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
