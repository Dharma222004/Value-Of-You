"use client";

import React, { useState } from "react";
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
} from "lucide-react";

interface TopNavbarProps {
  onToggleMobileMenu?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleMobileMenu }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-4">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Dashboard Overview</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Telemetry
            </span>
          </h1>
        </div>
      </div>

      {/* Center: Search Input */}
      <div className="hidden md:flex items-center relative w-72">
        <Search className="w-4 h-4 text-slate-500 absolute left-3" />
        <input
          type="text"
          placeholder="Search metrics, modules, assets..."
          className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Live Engine Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold">Engine Active</span>
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-400"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl p-4 border border-slate-800 shadow-2xl z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white">Notifications</span>
                <span className="text-[10px] font-mono text-sky-400">2 New</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-semibold text-white">Score Updated</div>
                  <div className="text-[11px] text-slate-400">Your Skills Capital score increased +4 points.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-semibold text-white">Quarterly Audit Ready</div>
                  <div className="text-[11px] text-slate-400">Time to re-assess your health biomarkers.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center font-bold text-slate-950 text-xs">
              AV
            </div>
            <span className="text-xs font-semibold hidden sm:block">Alex Vance</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl p-3 border border-slate-800 shadow-2xl z-50 space-y-1 text-xs">
              <div className="p-2 border-b border-slate-800">
                <div className="font-bold text-white">Alex Vance</div>
                <div className="text-[10px] text-slate-400">alex@human-capital.ai</div>
              </div>
              <a href="/dashboard/settings" className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300">
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Account Settings</span>
              </a>
              <a href="/auth/login" className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-rose-400">
                <User className="w-4 h-4" />
                <span>Sign Out</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
