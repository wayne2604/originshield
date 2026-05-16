"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { useSidebar } from "@/context/SidebarContext";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex min-h-screen text-gray-100 font-sans transition-all duration-300" style={{ background: "#0e0e1a" }}>
      <AdminSidebar />
      <main 
        className={`flex-1 min-h-screen overflow-x-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isCollapsed ? "ml-[72px]" : "ml-[260px]"
        }`}
      >
        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
