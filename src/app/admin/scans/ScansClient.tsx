"use client";

import { useState } from "react";
import { Search, Filter, ShieldAlert, ShieldCheck, HelpCircle } from "lucide-react";

interface ScanRecord {
  id: string;
  userId: string;
  type: string;
  result: string;
  confidence: number;
  confidenceLevel: string;
  createdAt: string;
}

export default function ScansClient({ scans, totalCount }: { scans: ScanRecord[]; totalCount: number }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredScans = scans.filter(scan =>
    scan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scan.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scan.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scan.result.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusFromResult = (result: string) => {
    if (result === "ai") return "danger";
    if (result === "human") return "success";
    return "warning";
  };

  const getResultLabel = (result: string) => {
    if (result === "ai") return "AI Generated";
    if (result === "human") return "Human";
    return "Uncertain";
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Global Scan History</h1>
          <p className="text-gray-500 mt-1">View and filter all scans performed across the platform.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#111827] border border-gray-800 p-4 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by scan ID, user, type, or result..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0e0e1a] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/30 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#1c1c2e] hover:bg-[#252540] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-800">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0e0e1a]/50 text-gray-500 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 font-medium text-[10px] uppercase tracking-widest">Scan ID</th>
                <th className="px-6 py-4 font-medium text-[10px] uppercase tracking-widest">User</th>
                <th className="px-6 py-4 font-medium text-[10px] uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 font-medium text-[10px] uppercase tracking-widest">Result</th>
                <th className="px-6 py-4 font-medium text-[10px] uppercase tracking-widest">Confidence</th>
                <th className="px-6 py-4 font-medium text-[10px] uppercase tracking-widest">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50 text-gray-300">
              {filteredScans.map((scan) => {
                const status = getStatusFromResult(scan.result);
                return (
                  <tr key={scan.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-[#00f0ff]">
                      {scan.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                      {scan.userId === "anonymous" ? (
                        <span className="text-gray-600 italic">anonymous</span>
                      ) : (
                        scan.userId.slice(0, 8) + "..."
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#1c1c2e] text-gray-300 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight border border-gray-800">
                        {scan.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {status === "danger" && <ShieldAlert className="h-4 w-4 text-red-400" />}
                        {status === "success" && <ShieldCheck className="h-4 w-4 text-[#2DD4BF]" />}
                        {status === "warning" && <HelpCircle className="h-4 w-4 text-amber-400" />}
                        <span className={
                          status === "danger" ? "text-red-400 font-semibold" :
                          status === "success" ? "text-[#2DD4BF] font-semibold" :
                          "text-amber-400 font-semibold"
                        }>
                          {getResultLabel(scan.result)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              scan.confidence > 70 ? "bg-[#2DD4BF]" :
                              scan.confidence > 40 ? "bg-amber-500" : "bg-red-400"
                            }`}
                            style={{ width: `${scan.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-gray-500">{scan.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">{formatTimeAgo(scan.createdAt)}</td>
                  </tr>
                );
              })}

              {filteredScans.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-600 italic">
                    {searchTerm ? "No scans found matching your search." : "No scans in the system yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between text-sm text-gray-500">
          <span>Showing {filteredScans.length} of {totalCount.toLocaleString()} total scans</span>
        </div>
      </div>
    </div>
  );
}
