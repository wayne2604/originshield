"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, FileSearch, Users, Settings, LogOut, 
  Shield, SidebarClose, SidebarOpen
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";

// ─── Nav item renderer (shared between sections) ───
function NavItem({ 
  item, 
  isActive, 
  isCollapsed 
}: { 
  item: { name: string; href: string; icon: React.ElementType }; 
  isActive: boolean; 
  isCollapsed: boolean; 
}) {
  return (
    <div className="relative group/nav">
      <Link
        href={item.href}
        className={`relative flex items-center rounded-xl transition-all duration-200 ${
          isCollapsed 
            ? "justify-center w-12 h-12 mx-auto" 
            : "gap-3 px-3.5 h-12"
        } ${
          isActive
            ? "bg-[#252540] text-white shadow-lg shadow-black/20"
            : "text-gray-500 hover:text-gray-200 hover:bg-[#1c1c2e]"
        }`}
      >
        {/* Left accent bar for active items */}
        {isActive && (
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full transition-all duration-300"
            style={{ 
              background: "linear-gradient(180deg, #00f0ff, #a855f7)",
              boxShadow: "0 0 8px rgba(0, 240, 255, 0.5)"
            }}
          />
        )}

        <item.icon 
          className={`shrink-0 transition-all duration-300 ${
            isActive ? "text-[#00f0ff] scale-110" : "group-hover/nav:scale-110"
          }`}
          size={20}
          strokeWidth={1.8}
        />

        <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${
          isCollapsed ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible ml-1"
        }`}>
          <span className="text-[14px] font-semibold tracking-wide">
            {item.name}
          </span>
        </div>
      </Link>

      {/* Tooltip on hover when collapsed */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-2 rounded-lg text-xs font-bold text-white whitespace-nowrap opacity-0 translate-x-[-10px] group-hover/nav:opacity-100 group-hover/nav:translate-x-0 pointer-events-none transition-all duration-200 z-[70] shadow-2xl border border-[#2a2a3d]"
          style={{ background: "#252540" }}
        >
          {item.name}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[5px] w-2.5 h-2.5 rotate-45"
            style={{ background: "#252540", borderLeft: "1px solid #2a2a3d", borderBottom: "1px solid #2a2a3d" }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Section label component ───
function SectionLabel({ label, isCollapsed }: { label: string; isCollapsed: boolean }) {
  if (isCollapsed) {
    return <div className="mx-auto my-2 w-6 border-t border-[#1e1e30]" />;
  }
  return (
    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-3.5 pt-4 pb-2 select-none">
      {label}
    </p>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { isCollapsed, toggleSidebar } = useSidebar();

  // ─── Keyboard shortcut: Ctrl+B to toggle sidebar ───
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "b") {
      e.preventDefault();
      toggleSidebar();
    }
  }, [toggleSidebar]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      await supabaseBrowser.auth.signOut({ scope: 'local' });
      router.push("/auth");
      supabaseBrowser.auth.signOut().catch(() => {});
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/auth");
    }
  };

  // ─── Grouped navigation sections (like Nolito's NAVIGATION / APP pattern) ───
  const navigationItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Scans", href: "/admin/scans", icon: FileSearch },
    { name: "Users", href: "/admin/users", icon: Users },
  ];

  const systemItems = [
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside 
      className={`flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-[#1e1e30] ${
        isCollapsed ? "w-[72px]" : "w-[260px]"
      }`}
      style={{ background: "#13131f" }}
    >
      {/* ─── Header: Logo + Collapse Toggle ─── */}
      <div className={`flex items-center shrink-0 h-[72px] transition-all duration-300 relative ${
        isCollapsed ? "px-0 justify-center" : "px-5 justify-between"
      }`}>
        <Link href="/" className={`flex items-center gap-2.5 group min-w-0 transition-all duration-300 ${isCollapsed ? "scale-110" : ""}`}>
          <div
            className="relative flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-[1.05]"
            style={{
              background: "linear-gradient(135deg, rgba(0, 240, 255, 0.12), rgba(168, 85, 247, 0.12))",
              border: "1px solid rgba(0, 240, 255, 0.15)",
            }}
          >
            <Shield size={20} className="text-[#00f0ff]" />
          </div>
          <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${
            isCollapsed ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible"
          }`}>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-neon">Origin</span>
              <span className="text-white">Shield</span>
            </span>
          </div>
        </Link>

        {/* Toggle Button — stays inside sidebar boundary (Nolito-style) */}
        {!isCollapsed && (
          <button
            onClick={toggleSidebar}
            title="Collapse sidebar (Ctrl+B)"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1c1c2e] border border-[#2a2a3d] text-gray-500 hover:text-white hover:border-gray-600 transition-all duration-200 shrink-0"
          >
            <SidebarClose size={14} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* ─── Collapsed-only toggle (inside sidebar, below logo) ─── */}
      {isCollapsed && (
        <div className="flex justify-center pt-1 pb-2">
          <button
            onClick={toggleSidebar}
            title="Expand sidebar (Ctrl+B)"
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1c1c2e] border border-[#2a2a3d] text-gray-500 hover:text-white hover:border-gray-600 transition-all duration-200"
          >
            <SidebarOpen size={16} strokeWidth={2} />
          </button>
        </div>
      )}

      {/* ─── Navigation (grouped sections) ─── */}
      <nav className={`flex-1 overflow-y-auto py-2 transition-all duration-300 ${
        isCollapsed ? "px-2.5" : "px-3"
      }`}>
        {/* NAVIGATION section */}
        <SectionLabel label="Navigation" isCollapsed={isCollapsed} />
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>

        {/* SYSTEM section */}
        <SectionLabel label="System" isCollapsed={isCollapsed} />
        <div className="space-y-1">
          {systemItems.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </nav>

      {/* ─── Bottom Section ─── */}
      <div className="shrink-0 p-4 space-y-3">
        {/* System Status — Only visible when expanded or via icon when collapsed */}
        {!isCollapsed ? (
          <div className="px-4 py-3 rounded-xl border border-[#1e1e30] transition-all duration-500 animate-in fade-in" style={{ background: "#1c1c2e" }}>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Network Status</p>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping opacity-40" />
              </div>
              <span className="text-[12px] text-gray-300 font-bold">Operational</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-2 group/status relative">
             <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
             <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-2 rounded-lg text-[10px] font-bold text-emerald-400 whitespace-nowrap opacity-0 group-hover/status:opacity-100 pointer-events-none transition-all duration-200 z-[70] shadow-2xl border border-[#2a2a3d]" style={{ background: "#1c1c2e" }}>
               SYSTEM ONLINE
             </div>
          </div>
        )}

        <div className="border-t border-[#1e1e30] pt-3">
          <div className="relative group/logout">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`flex items-center rounded-xl transition-all duration-200 disabled:opacity-50 ${
                isCollapsed 
                  ? "justify-center w-12 h-12 mx-auto" 
                  : "gap-3 px-3.5 h-12 w-full"
              } text-gray-500 hover:text-red-400 hover:bg-red-400/[0.06]`}
            >
              <LogOut size={20} className="shrink-0" strokeWidth={1.8} />
              <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${
                isCollapsed ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible ml-1"
              }`}>
                <span className="text-[14px] font-semibold">
                  {isLoggingOut ? "Exiting..." : "Sign Out"}
                </span>
              </div>
            </button>

            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-2 rounded-lg text-xs font-bold text-red-400 whitespace-nowrap opacity-0 group-hover/logout:opacity-100 pointer-events-none transition-all duration-200 z-[70] shadow-2xl border border-red-500/10"
                style={{ background: "#1c1c2e" }}
              >
                LOGOUT
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[5px] w-2.5 h-2.5 rotate-45"
                  style={{ background: "#1c1c2e", borderLeft: "1px solid rgba(239, 68, 68, 0.1)", borderBottom: "1px solid rgba(239, 68, 68, 0.1)" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
