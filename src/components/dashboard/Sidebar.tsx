"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Terminal,
  LayoutDashboard,
  Briefcase,
  DollarSign,
  Award,
  HeartPulse,
  Brain,
  BarChart3,
  FileText,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Career Capital", icon: Briefcase, href: "/dashboard/career", badge: "Mod 1" },
    { label: "Financial Health", icon: DollarSign, href: "/dashboard/financial", badge: "Mod 2" },
    { label: "Skills Architecture", icon: Award, href: "/dashboard/skills", badge: "Mod 3" },
    { label: "Health & Lifestyle", icon: HeartPulse, href: "/dashboard/health", badge: "Mod 4" },
    { label: "Human Assessments", icon: Brain, href: "/dashboard/assessments", badge: "Mod 5" },
    { label: "AI Scoring Engine", icon: BarChart3, href: "/dashboard/analytics", badge: "Phase 9" },
    { label: "Executive Report", icon: FileText, href: "/dashboard/report", badge: "Phase 10" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-[#070b14] border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Logo & Toggle */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 p-[1px] shrink-0">
              <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-white font-mono">
                  HUMAN CAPITAL
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Terminal Shell</span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-sky-400" : "text-slate-400"}`} />
                  {!collapsed && <span>{item.label}</span>}
                </div>
                {!collapsed && item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile / Info */}
      <div className="p-3 border-t border-slate-800/80">
        {!collapsed ? (
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center font-bold text-slate-950 text-xs shrink-0">
                AV
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white truncate">Alex Vance</span>
                <span className="text-[10px] text-slate-400 truncate">S-Tier Capital</span>
              </div>
            </div>
            <Link href="/auth/login" className="text-slate-400 hover:text-rose-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center font-bold text-slate-950 text-xs">
              AV
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
