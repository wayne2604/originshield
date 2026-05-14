"use client";

import { useState } from "react";
import { Search, Filter, ShieldAlert, ShieldCheck, HelpCircle } from "lucide-react";

const MOCK_SCANS = [
  { id: "scn_1092", user: "john.doe@example.com", type: "Text", result: "AI Generated", confidence: "98%", time: "2 mins ago", status: "danger" },
  { id: "scn_1091", user: "sarah.smith@company.co", type: "Image", result: "Human", confidence: "92%", time: "15 mins ago", status: "success" },
  { id: "scn_1090", user: "mike.jones@startup.io", type: "URL", result: "Uncertain", confidence: "55%", time: "1 hour ago", status: "warning" },
  { id: "scn_1089", user: "alex.w@design.net", type: "Text", result: "Human", confidence: "89%", time: "2 hours ago", status: "success" },
  { id: "scn_1088", user: "emily.r@agency.com", type: "Image", result: "AI Generated", confidence: "99%", time: "3 hours ago", status: "danger" },
  { id: "scn_1087", user: "dev.team@tech.co", type: "Text", result: "AI Generated", confidence: "95%", time: "5 hours ago", status: "danger" },
  { id: "scn_1086", user: "content.manager@blog.com", type: "URL", result: "Human", confidence: "88%", time: "Yesterday", status: "success" },
];

export default function ScansPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredScans = MOCK_SCANS.filter(scan => 
    scan.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    scan.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Global Scan History</h1>
          <p className="text-slate-400 mt-1">View and filter all scans performed across the platform.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user email or scan ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
          />
        </div>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Scan ID</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Result</th>
                <th className="px-6 py-4 font-medium">Confidence</th>
                <th className="px-6 py-4 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              {filteredScans.map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 font-mono text-emerald-400">{scan.id}</td>
                  <td className="px-6 py-4">{scan.user}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md text-xs font-medium">
                      {scan.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {scan.status === "danger" && <ShieldAlert className="h-4 w-4 text-red-400" />}
                      {scan.status === "success" && <ShieldCheck className="h-4 w-4 text-emerald-400" />}
                      {scan.status === "warning" && <HelpCircle className="h-4 w-4 text-amber-400" />}
                      <span className={
                        scan.status === "danger" ? "text-red-400" :
                        scan.status === "success" ? "text-emerald-400" :
                        "text-amber-400"
                      }>
                        {scan.result}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{scan.confidence}</td>
                  <td className="px-6 py-4 text-slate-500">{scan.time}</td>
                </tr>
              ))}
              
              {filteredScans.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No scans found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
          <span>Showing {filteredScans.length} of 1,245 results</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-slate-700 rounded hover:bg-slate-800 transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-700 rounded hover:bg-slate-800 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
