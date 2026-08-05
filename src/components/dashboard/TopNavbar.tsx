"use client";

import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  ChevronDown,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import Link from "next/link";

interface TopNavbarProps {
  onToggleMobileMenu?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleMobileMenu }) => {
  const { user: authUser, logout } = useAuth();
  const { profile } = useProfile();

  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
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
  }, []);

  const displayName = profile?.full_name || authUser?.name || authUser?.email?.split("@")[0] || "User";
  const displayEmail = profile?.email || authUser?.email || "";
  const avatarUrl = profile?.avatar_url || authUser?.image || null;

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
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Hamburger Toggle & App Title */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            title="Open Mobile Menu"
            className="md:hidden p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500/50 transition-all flex items-center justify-center shrink-0"
          >
            <Menu className="w-5 h-5 text-indigo-400" />
          </button>
        )}
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Human Capital Platform</span>
          </h1>
        </div>
      </div>

      {/* Right: Theme Switcher & User Dropdown */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${themeMode === "dark" ? "Light" : "Dark"} Mode`}
          className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:border-indigo-500/50 transition-all flex items-center gap-1.5 text-xs font-mono"
        >
          {themeMode === "dark" ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-all border border-slate-700 bg-slate-900"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-lg object-cover border border-indigo-400/40" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow">
                {initials}
              </div>
            )}
            <div className="hidden sm:block text-left pr-1">
              <div className="text-xs font-bold text-white leading-tight">{displayName}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl p-2 border border-slate-800 bg-slate-900/95 backdrop-blur-xl shadow-2xl z-50 text-xs">
              <div className="p-3 border-b border-slate-800 space-y-0.5">
                <p className="font-bold text-white truncate">{displayName}</p>
                <p className="text-[11px] text-slate-400 font-mono truncate">{displayEmail}</p>
              </div>

              <div className="p-1 space-y-1 mt-1">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full text-left p-2 rounded-xl text-slate-300 hover:bg-slate-800 font-medium transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-indigo-400" />
                  View Profile
                </Link>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 font-medium transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
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
