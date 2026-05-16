"use client";

import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Activity, Users, 
  ShieldCheck, Zap, Download, Plus,
  Target, BarChart3
} from 'lucide-react';

interface DashboardClientProps {
  stats: {
    totalScans: number;
    totalUsers: number;
    successRate: number;
    scansTrend: number;
    usersTrend: number;
  };
  recentScans: any[];
  distribution: Record<string, number>;
  dailyActivity: any[];
}

export default function DashboardClient({ stats, recentScans, distribution, dailyActivity }: DashboardClientProps) {
  
  // Format distribution for charts — all from real DB data
  const distributionData = [
    { name: 'Text', value: distribution.text || 0, color: '#A855F7' },
    { name: 'Image', value: distribution.image || 0, color: '#2DD4BF' },
    { name: 'URL', value: distribution.url || 0, color: '#f59e0b' },
  ];

  // Calculate AI detection rate from real scan data
  const aiScans = recentScans.filter(s => s.label === 'ai').length;
  const humanScans = recentScans.filter(s => s.label === 'human').length;
  const totalRecentScans = recentScans.length;
  const aiDetectionRate = totalRecentScans > 0 ? Math.round((aiScans / totalRecentScans) * 100) : 0;

  // Calculate the average truth score from real data
  const avgTruthScore = totalRecentScans > 0 
    ? Math.round(recentScans.reduce((sum, s) => sum + (s.truthScore || 0), 0) / totalRecentScans) 
    : 0;

  // Format the trend value for display
  const formatTrend = (value: number) => {
    const prefix = value >= 0 ? '+' : '';
    return `${prefix}${value}%`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-white">Welcome back, </span>
            <span className="text-neon">Admin</span>
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">Empowering system integrity with real-time intelligence.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-800 text-gray-300 font-semibold text-sm hover:bg-white/5 transition-all">
            <Download className="h-4 w-4" />
            Export Data
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A855F7] text-white font-semibold text-sm hover:bg-[#9333EA] transition-all shadow-lg shadow-purple-500/20">
            <Plus className="h-4 w-4" />
            New Report
          </button>
        </div>
      </div>

      {/* Stats Grid — ALL real data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Scans" 
          value={stats.totalScans.toLocaleString()} 
          trend={formatTrend(stats.scansTrend)} 
          trendUp={stats.scansTrend >= 0} 
          icon={<Activity className="text-[#A855F7]" />} 
        />
        <StatCard 
          title="Unique Users" 
          value={stats.totalUsers.toLocaleString()} 
          trend={formatTrend(stats.usersTrend)} 
          trendUp={stats.usersTrend >= 0} 
          icon={<Users className="text-[#2DD4BF]" />} 
        />
        <StatCard 
          title="Detection Accuracy" 
          value={`${stats.successRate}%`} 
          trend={stats.successRate >= 80 ? "High" : stats.successRate >= 50 ? "Medium" : "Low"}
          trendUp={stats.successRate >= 50} 
          icon={<Target className="text-emerald-500" />} 
        />
        <StatCard 
          title="Avg. Truth Score" 
          value={`${avgTruthScore}/100`} 
          trend={avgTruthScore >= 70 ? "Strong" : avgTruthScore >= 40 ? "Fair" : "Weak"}
          trendUp={avgTruthScore >= 50} 
          icon={<BarChart3 className="text-amber-500" />} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Daily Activity — real data from getDailyStats() */}
        <div className="lg:col-span-2 bg-[#111827] border border-gray-800 rounded-3xl p-6 lg:p-8 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#A855F7]" />
                System Activity Overview
              </h3>
              <p className="text-sm text-gray-500 font-medium">Daily scan volume vs active unique users (Last 7 Days)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#A855F7]" />
                <span className="text-gray-400">Scans</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#2DD4BF]" />
                <span className="text-gray-400">Users</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            {dailyActivity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyActivity}>
                  <defs>
                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#4b5563" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }} 
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} 
                  />
                  <Area type="monotone" dataKey="scans" stroke="#A855F7" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" animationDuration={1500} />
                  <Area type="monotone" dataKey="users" stroke="#2DD4BF" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-600 italic">
                No activity data for the last 7 days.
              </div>
            )}
          </div>
        </div>

        {/* Side Charts */}
        <div className="space-y-6">
          {/* Scan Type Distribution — real data from getScanDistribution() */}
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 flex flex-col min-h-[220px]">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Scan Distribution
            </h3>
            <div className="flex-1 w-full min-h-[120px]">
              {stats.totalScans > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} width={40} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-600 italic text-sm">
                  No scan data yet.
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Total: {stats.totalScans.toLocaleString()} scans</span>
            </div>
          </div>

          {/* AI Detection Breakdown — computed from real recent scans */}
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 flex flex-col min-h-[220px]">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">AI Detection Rate</h3>
            <div className="flex flex-col items-center justify-center flex-1 space-y-4">
              <div className="relative h-24 w-24">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#1f2937" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" 
                    stroke={aiDetectionRate > 50 ? '#ef4444' : '#2DD4BF'} 
                    strokeWidth="8" 
                    strokeDasharray={`${282.7 * (aiDetectionRate / 100)} 282.7`}
                    strokeLinecap="round" 
                    style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{aiDetectionRate}%</span>
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  {aiScans} AI / {humanScans} Human
                </p>
                <p className="text-[9px] text-gray-600">
                  Based on last {totalRecentScans} scans
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table — real data from getGlobalRecentScans() */}
      <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            Recent Scan Intelligence
          </h3>
          <span className="text-xs font-bold text-gray-500 bg-gray-800/50 px-3 py-1.5 rounded-lg">
            {recentScans.length} latest entries
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-[10px] font-bold uppercase tracking-widest bg-gray-900/30">
                <th className="px-6 py-4">Detection Type</th>
                <th className="px-6 py-4">Confidence Label</th>
                <th className="px-6 py-4">Integrity Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Verification Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {recentScans.map((scan) => (
                <tr key={scan.id} className="group hover:bg-white/5 transition-all duration-300">
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-800/80 px-2 py-1 rounded-md border border-gray-700/50 uppercase tracking-tight">
                      {scan.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold flex items-center gap-2 ${
                      scan.label === 'human' ? 'text-[#2DD4BF]' : 
                      scan.label === 'ai' ? 'text-red-400' : 'text-amber-500'
                    }`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${
                        scan.label === 'human' ? 'bg-[#2DD4BF]' : 
                        scan.label === 'ai' ? 'bg-red-400' : 'bg-amber-500'
                      }`} />
                      {scan.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            scan.truthScore > 70 ? 'bg-[#2DD4BF]' : 
                            scan.truthScore > 40 ? 'bg-amber-500' : 'bg-red-400'
                          }`} 
                          style={{ width: `${scan.truthScore}%` }} 
                        />
                      </div>
                      <span className="text-xs font-mono text-gray-500">{scan.truthScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                      scan.truthScore > 70 
                        ? 'text-[#2DD4BF] bg-[#2DD4BF]/5 border-[#2DD4BF]/10' 
                        : scan.truthScore > 40 
                          ? 'text-amber-500 bg-amber-500/5 border-amber-500/10'
                          : 'text-red-400 bg-red-400/5 border-red-400/10'
                    }`}>
                      {scan.truthScore > 70 ? 'VERIFIED' : scan.truthScore > 40 ? 'REVIEW' : 'FLAGGED'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-gray-600 font-medium font-mono">
                    {new Date(scan.timestamp).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
              {recentScans.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-600 italic">
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

function StatCard({ title, value, trend, trendUp, icon }: { 
  title: string; 
  value: string; 
  trend: string; 
  trendUp: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 hover:border-gray-700 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        {React.cloneElement(icon as React.ReactElement<any>, { size: 80 })}
      </div>
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="p-3 bg-[#0B0F19] rounded-2xl border border-gray-800 group-hover:border-[#A855F7]/30 transition-all duration-500 shadow-inner">
          {icon}
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-tighter ${
          trendUp ? 'text-[#2DD4BF] bg-[#2DD4BF]/10 border border-[#2DD4BF]/10' : 'text-red-400 bg-red-400/10 border border-red-400/10'
        }`}>
          {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trend}
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.15em] mb-1">{title}</p>
        <p className="text-3xl font-bold text-white tracking-tighter group-hover:text-[#00f0ff] transition-colors">{value}</p>
      </div>
    </div>
  );
}
