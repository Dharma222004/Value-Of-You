"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex relative overflow-hidden bg-grid-pattern">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative z-10 w-64 bg-[#070b14] h-full shadow-2xl">
            <Sidebar collapsed={false} setCollapsed={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"}`}>
        <TopNavbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
