"use client";

import React, { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  Clock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useModuleProgress } from "@/hooks/useModuleProgress";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { progressState, loading: progressLoading } = useModuleProgress();

  const displayName = profile?.full_name || user?.name || user?.email?.split("@")[0] || "User Profile";

  const initials = displayName && displayName !== "User Profile"
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "HC";

  const navItems = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      href: "/dashboard",
      isUnlocked: true,
      status: "completed" as const,
    },
    {
      label: "Profile",
      icon: Briefcase,
      href: "/dashboard/career",
      isUnlocked: true,
      status: progressState.profileCompleted
        ? ("completed" as const)
        : progressState.profileInProgress
        ? ("in-progress" as const)
        : ("not-started" as const),
    },
    {
      label: "Financial Health",
      icon: DollarSign,
      href: "/dashboard/financial",
      isUnlocked: progressState.financialUnlocked,
      status: !progressState.financialUnlocked
        ? ("locked" as const)
        : progressState.financialCompleted
        ? ("completed" as const)
        : progressState.financialInProgress
        ? ("in-progress" as const)
        : ("not-started" as const),
    },
    {
      label: "Skills Capital",
      icon: Award,
      href: "/dashboard/skills",
      isUnlocked: progressState.skillsUnlocked,
      status: !progressState.skillsUnlocked
        ? ("locked" as const)
        : progressState.skillsCompleted
        ? ("completed" as const)
        : progressState.skillsInProgress
        ? ("in-progress" as const)
        : ("not-started" as const),
    },
    {
      label: "Health & Lifestyle",
      icon: HeartPulse,
      href: "/dashboard/health",
      isUnlocked: progressState.healthUnlocked,
      status: !progressState.healthUnlocked
        ? ("locked" as const)
        : progressState.healthCompleted
        ? ("completed" as const)
        : progressState.healthInProgress
        ? ("in-progress" as const)
        : ("not-started" as const),
    },
    {
      label: "Human Assessments",
      icon: Brain,
      href: "/dashboard/assessments",
      isUnlocked: progressState.assessmentsUnlocked,
      status: !progressState.assessmentsUnlocked
        ? ("locked" as const)
        : progressState.assessmentsCompleted
        ? ("completed" as const)
        : progressState.assessmentsInProgress
        ? ("in-progress" as const)
        : ("not-started" as const),
    },
    {
      label: "AI Analysis Report",
      icon: FileText,
      href: "/dashboard/report",
      isUnlocked: progressState.executiveReportUnlocked,
      status: !progressState.executiveReportUnlocked
        ? ("locked" as const)
        : progressState.aiEvaluationCompleted
        ? ("completed" as const)
        : ("not-started" as const),
    },
  ];

  const renderStatusIcon = (status: "completed" | "in-progress" | "not-started" | "locked", label?: string) => {
    if (progressLoading) {
      return <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0 animate-pulse" />;
    }
    if (status === "completed") {
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    } else if (status === "in-progress") {
      return <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    } else if (status === "not-started") {
      // Unlocked & ready process symbol
      return <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
    } else {
      // Locked module symbol
      return <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Logo & Toggle */}
      <div>
        {collapsed ? (
          <div className="h-16 flex items-center justify-center border-b border-slate-800 w-full px-2">
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              title="Expand Sidebar"
              className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-indigo-600 border border-slate-700/80 hover:border-indigo-500 text-indigo-400 hover:text-white transition-all flex items-center justify-center shadow-md group"
            >
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        ) : (
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 w-full">
            <Link href="/" className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shrink-0 shadow-lg">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm tracking-tight text-white font-mono truncate">
                  HUMAN CAPITAL
                </span>
                <span className="text-[10px] text-slate-400 font-mono truncate">Executive Terminal</span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setCollapsed(true)}
              title="Collapse Sidebar"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700 shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isLocked = !item.isUnlocked;

            return (
              <Link
                key={item.label}
                href={item.isUnlocked ? item.href : "#"}
                title={collapsed ? item.label : undefined}
                onClick={(e) => {
                  if (isLocked) {
                    e.preventDefault();
                  }
                }}
                className={`flex items-center ${collapsed ? "justify-center p-2.5" : "justify-between p-2.5"} rounded-xl transition-all font-medium text-xs ${
                  isLocked
                    ? "opacity-50 cursor-not-allowed text-slate-500 hover:bg-transparent"
                    : isActive
                    ? "bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isLocked ? "text-slate-500" : "text-indigo-400"}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {renderStatusIcon(item.status)}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Summary */}
      <div className="p-4 border-t border-slate-800">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate">{displayName}</span>
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            {initials}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
