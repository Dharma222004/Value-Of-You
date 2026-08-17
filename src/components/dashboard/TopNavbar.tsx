"use client";

import React, { useState, useEffect, useRef } from "react";
import {
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const displayName = profile?.full_name || authUser?.name || authUser?.email?.split("@")[0] || "User";
  const displayEmail = profile?.email || authUser?.email || "";
  const rawAvatar = profile?.avatar_url || authUser?.image || null;
  const isHttpAvatar = Boolean(rawAvatar && (rawAvatar.startsWith("http://") || rawAvatar.startsWith("https://") || rawAvatar.startsWith("/")));

  const initials = displayName
    ? displayName
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .filter(Boolean)
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "HC";

  // Close dropdown when clicking anywhere outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
      }
    }

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [userMenuOpen]);

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

      {/* Right: User Dropdown */}
      <div className="flex items-center gap-3">
        {/* User Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-all border border-slate-700 bg-slate-900 cursor-pointer hover:border-indigo-500/40"
          >
            {isHttpAvatar && !imgError ? (
              <img
                src={rawAvatar!}
                alt={displayName}
                onError={() => setImgError(true)}
                className="w-8 h-8 rounded-lg object-cover border border-indigo-400/40"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow select-none">
                {initials}
              </div>
            )}
            <div className="hidden sm:block text-left pr-1">
              <div className="text-xs font-bold text-white leading-tight max-w-[120px] truncate">{displayName}</div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${userMenuOpen ? "rotate-180 text-indigo-400" : ""}`} />
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-2xl p-2 border border-slate-700/80 bg-[#0f172a] shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-[100] text-xs animate-in fade-in zoom-in-95 duration-150"
              style={{ backgroundColor: "#0f172a" }}
            >
              <div className="p-3 border-b border-slate-800/80 space-y-1 bg-[#111c38] rounded-xl mb-1">
                <p className="font-bold text-white truncate text-sm">{displayName}</p>
                <p className="text-[11px] text-slate-400 font-mono truncate">{displayEmail}</p>
              </div>

              <div className="p-1 space-y-1 mt-1">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full text-left p-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800 font-semibold transition-colors flex items-center gap-2.5"
                >
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>View Profile</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left p-2.5 rounded-xl text-rose-400 hover:bg-rose-500/15 font-semibold transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out</span>
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
