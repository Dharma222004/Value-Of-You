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
  Settings,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  Clock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getDashboardTelemetry } from "@/services/dashboardTelemetry";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [displayName, setDisplayName] = useState<string>("User Profile");
  const [telemetry, setTelemetry] = useState(() => getDashboardTelemetry());

  useEffect(() => {
    setMounted(true);
    const updateTelemetry = () => {
      setTelemetry(getDashboardTelemetry());
    };
    updateTelemetry();

    if (typeof window !== "undefined") {
      window.addEventListener("hc_assessment_updated", updateTelemetry);
    }

    if (user?.name && user.name !== "Authenticated User") {
      setDisplayName(user.name);
    } else if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hc_master_profile_data");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const fn = parsed.personalProfile?.firstName?.trim();
          const ln = parsed.personalProfile?.lastName?.trim();
          if (fn || ln) {
            setDisplayName(`${fn} ${ln}`.trim());
          }
        } catch (e) {}
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("hc_assessment_updated", updateTelemetry);
      }
    };
  }, [user]);

  const initials =
    displayName && displayName !== "User Profile"
      ? displayName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "HC";

  const getModuleStatusIcon = (status: "completed" | "in-progress" | "not-started") => {
    if (!mounted) {
      return <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
    if (status === "completed") {
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />;
    } else if (status === "in-progress") {
      return <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />;
    } else {
      return <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard", status: "completed" as const },
    { label: "Profile", icon: Briefcase, href: "/dashboard/career", badge: "Mod 1", status: telemetry.modules.module1.status },
    { label: "Financial Health", icon: DollarSign, href: "/dashboard/financial", badge: "Mod 2", status: telemetry.modules.module2.status },
    { label: "Skills Capital", icon: Award, href: "/dashboard/skills", badge: "Mod 3", status: telemetry.modules.module3.status },
    { label: "Health & Lifestyle", icon: HeartPulse, href: "/dashboard/health", badge: "Mod 4", status: telemetry.modules.module4.status },
    { label: "Human Assessments", icon: Brain, href: "/dashboard/assessments", badge: "Mod 5", status: telemetry.modules.module5.status },
    { label: "AI Scoring Engine", icon: BarChart3, href: "/dashboard/analytics", badge: "AI Pipeline", status: telemetry.isAllCompleted ? ("completed" as const) : ("in-progress" as const) },
    { label: "Executive Report", icon: FileText, href: "/dashboard/report", badge: "Dossier", status: telemetry.isAllCompleted ? ("completed" as const) : ("not-started" as const) },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-[var(--card-bg)] border-r border-[var(--border-color)] transition-all duration-300 flex flex-col justify-between ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Logo & Toggle */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border-color)]">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 p-[1px] shrink-0">
              <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-[var(--text-main)] font-mono">
                  HUMAN CAPITAL
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">Executive Terminal</span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
                className={`flex items-center justify-between p-2.5 rounded-xl transition-all font-medium text-xs ${
                  isActive
                    ? "bg-purple-600/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 font-bold shadow-sm"
                    : "text-[var(--text-muted)] hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-[var(--text-main)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && (
                  <div className="flex items-center gap-1.5">
                    {getModuleStatusIcon(item.status)}
                    {item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[var(--text-muted)]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Summary */}
      <div className="p-4 border-t border-[var(--border-color)]">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-sky-400 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[var(--text-main)] truncate">{displayName}</span>
              <span className="text-[10px] text-emerald-500 font-mono font-bold">Executive Tier</span>
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-purple-600 to-sky-400 flex items-center justify-center text-white font-bold text-xs">
            {initials}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
