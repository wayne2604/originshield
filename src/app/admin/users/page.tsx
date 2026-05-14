"use client";

import { useState } from "react";
import { Search, MoreVertical, UserX, Mail, ShieldAlert } from "lucide-react";

const MOCK_USERS = [
  { id: "usr_001", email: "admin@originshield.com", role: "Admin", status: "Active", joined: "Oct 12, 2025", lastLogin: "Just now", scans: 1450 },
  { id: "usr_002", email: "john.doe@example.com", role: "User", status: "Active", joined: "Nov 01, 2025", lastLogin: "2 mins ago", scans: 342 },
  { id: "usr_003", email: "sarah.smith@company.co", role: "User", status: "Active", joined: "Nov 15, 2025", lastLogin: "15 mins ago", scans: 128 },
  { id: "usr_004", email: "mike.jones@startup.io", role: "User", status: "Inactive", joined: "Dec 05, 2025", lastLogin: "3 days ago", scans: 45 },
  { id: "usr_005", email: "alex.w@design.net", role: "User", status: "Active", joined: "Jan 10, 2026", lastLogin: "2 hours ago", scans: 890 },
  { id: "usr_006", email: "spam.bot@malicious.net", role: "User", status: "Suspended", joined: "Feb 02, 2026", lastLogin: "Never", scans: 0 },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = MOCK_USERS.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">User Management</h1>
          <p className="text-slate-400 mt-1">Manage accounts, roles, and monitor user activity.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Total Scans</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Last Login</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 font-bold border border-slate-700">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.email}</div>
                        <div className="text-xs text-slate-500 font-mono">{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                      user.role === "Admin" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-800 text-slate-300 border-slate-700"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`h-2 w-2 rounded-full ${
                        user.status === "Active" ? "bg-emerald-500" :
                        user.status === "Suspended" ? "bg-red-500" :
                        "bg-slate-500"
                      }`} />
                      <span className={user.status === "Suspended" ? "text-red-400" : ""}>{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-400">{user.scans.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-500">{user.joined}</td>
                  <td className="px-6 py-4 text-slate-500">{user.lastLogin}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No users found matching your search.
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
