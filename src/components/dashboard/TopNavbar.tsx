"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Settings,
  User,
  Shield,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Activity,
  Laptop,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface TopNavbarProps {
  onToggleMobileMenu?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleMobileMenu }) => {
  const { user, logout } = useAuth();
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [displayName, setDisplayName] = useState<string>("User");
  const [displayEmail, setDisplayEmail] = useState<string>("user@human-capital.ai");

  useEffect(() => {
    // Read theme preference
    if (typeof window !== "undefined") {
      const savedTheme = (localStorage.getItem("hc_theme_preference") as "dark" | "light") || "dark";
      setThemeMode(savedTheme);
      if (savedTheme === "light") {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      }
    }

    if (user?.name && user.name !== "Authenticated User") {
      setDisplayName(user.name);
    }
    if (user?.email) {
      setDisplayEmail(user.email);
    }

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hc_master_profile_data");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const fn = parsed.personalProfile?.firstName?.trim();
          const ln = parsed.personalProfile?.lastName?.trim();
          if (fn || ln) {
            setDisplayName(`${fn} ${ln}`.trim());
          }
          if (parsed.contactInformation?.email) {
            setDisplayEmail(parsed.contactInformation.email);
          }
        } catch (e) {}
      }
    }
  }, [user]);

  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "HC";

  const toggleTheme = () => {
    const nextTheme = themeMode === "dark" ? "light" : "dark";
    setThemeMode(nextTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("hc_theme_preference", nextTheme);
      if (nextTheme === "light") {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      }
    }
  };

  return (
    <header className="h-16 border-b border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-4">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl bg-slate-900 dark:bg-slate-800 border border-[var(--border-color)] text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <h1 className="text-base font-bold text-[var(--text-main)] tracking-tight flex items-center gap-2">
            <span>Human Capital Platform</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
              Executive Telemetry
            </span>
          </h1>
        </div>
      </div>

      {/* Right: Actions, Theme Switcher & User Dropdown */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button (Light / Dark) */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${themeMode === "dark" ? "Light" : "Dark"} Mode`}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-[var(--border-color)] text-slate-700 dark:text-slate-300 hover:border-purple-500/50 transition-all flex items-center gap-1.5 text-xs font-mono"
        >
          {themeMode === "dark" ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all border border-[var(--border-color)]"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-sky-400 flex items-center justify-center font-bold text-white text-xs shadow">
              {initials}
            </div>
            <div className="hidden sm:block text-left pr-1">
              <div className="text-xs font-bold text-[var(--text-main)] leading-tight">{displayName}</div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono">Executive</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl p-2 border border-[var(--border-color)] shadow-2xl z-50 text-xs">
              <div className="p-3 border-b border-[var(--border-color)]">
                <p className="font-bold text-[var(--text-main)]">{displayName}</p>
                <p className="text-[11px] text-[var(--text-muted)] font-mono truncate">{displayEmail}</p>
              </div>

              <div className="p-1 space-y-1">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left p-2 rounded-xl text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
