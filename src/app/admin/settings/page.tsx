"use client";

import { Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Platform Settings</h1>
        <p className="text-slate-400 mt-1">Configure global platform parameters and API limits.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl shadow-black/20">
        <h2 className="text-lg font-semibold text-white mb-4 border-b border-slate-800 pb-2">API Configuration</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Max Scans Per User (Free Tier)</label>
            <input 
              type="number" 
              defaultValue={10}
              className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Global Rate Limit (req/min)</label>
            <input 
              type="number" 
              defaultValue={100}
              className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div className="pt-4">
            <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
