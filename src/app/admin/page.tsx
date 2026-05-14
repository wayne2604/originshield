import { getAdminStats, getGlobalRecentScans } from "@/app/actions/admin";
import { Shield, Users, Activity, BarChart3 } from "lucide-react";

export default async function AdminDashboard() {
  const stats = await getAdminStats();
  const recentScans = await getGlobalRecentScans(10);

  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff] mb-3">
          System Overview
        </p>
        <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Scans" value={stats.totalScans} icon={<Activity className="text-cyan-400" />} />
        <StatCard title="Active Users" value={stats.totalUsers} icon={<Users className="text-purple-400" />} />
        <StatCard title="Success Rate" value={`${stats.successRate}%`} icon={<Shield className="text-green-400" />} />
        <StatCard title="Global Capacity" value="99.9%" icon={<BarChart3 className="text-yellow-400" />} />
      </div>

      <div className="glass-card-strong p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Global Recent Scans</h2>
          <button className="text-sm text-[#00f0ff] hover:underline transition-all">
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-widest">
                <th className="pb-4 pl-2 font-semibold">Type</th>
                <th className="pb-4 font-semibold">Label</th>
                <th className="pb-4 font-semibold">Score</th>
                <th className="pb-4 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {recentScans.map((scan) => (
                <tr key={scan.id} className="group hover:bg-cyan-500/5 transition-colors">
                  <td className="py-4 pl-2">
                    <span className="font-mono text-xs uppercase text-slate-500 px-2 py-1 bg-slate-900 rounded border border-slate-800">
                      {scan.type}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`text-sm font-semibold ${
                      scan.label === 'human' ? 'text-green-400' : 
                      scan.label === 'ai' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {scan.label}
                    </span>
                  </td>
                  <td className="py-4 text-sm font-mono text-slate-300">{scan.truthScore}/100</td>
                  <td className="py-4 text-xs text-slate-500">
                    {new Date(scan.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
              {recentScans.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-500 italic">
                    No scans found in the system yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="glass-card p-6 flex items-center justify-between group">
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-2 font-medium">{title}</p>
        <p className="text-3xl font-bold text-white group-hover:text-[#00f0ff] transition-colors">{value}</p>
      </div>
      <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 group-hover:border-cyan-500/30 transition-all">
        {icon}
      </div>
    </div>
  );
}
