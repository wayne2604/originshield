"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface UserRecord {
  id: string;
  email: string;
  role: string;
  scanCount: number;
  joinedAt: string;
  lastSignIn: string | null;
}

export default function UsersClient({ users }: { users: UserRecord[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "admin":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-gray-800 text-gray-400 border-gray-700";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">User Management</h1>
          <p className="text-gray-500 mt-1">
            {users.length} registered user{users.length !== 1 ? "s" : ""} across the platform.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#111827] border border-gray-800 p-4 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by email, role, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0e0e1a] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/30 transition-all"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0e0e1a]/50 text-gray-500 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 font-medium text-[10px] uppercase tracking-widest">User</th>
                <th className="px-6 py-4 font-medium text-[10px] uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 font-medium text-[10px] uppercase tracking-widest">Total Scans</th>
                <th className="px-6 py-4 font-medium text-[10px] uppercase tracking-widest">Joined</th>
                <th className="px-6 py-4 font-medium text-[10px] uppercase tracking-widest">Last Sign In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50 text-gray-300">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold border ${
                        user.role === "admin" || user.role === "superadmin"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : "bg-gray-800 text-[#00f0ff] border-gray-700"
                      }`}>
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{user.email}</div>
                        <div className="text-[10px] text-gray-600 font-mono">{user.id.slice(0, 12)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight border ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-400">{user.scanCount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(user.joinedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(user.lastSignIn)}</td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-600 italic">
                    {searchTerm ? "No users found matching your search." : "No registered users yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>
    </div>
  );
}
