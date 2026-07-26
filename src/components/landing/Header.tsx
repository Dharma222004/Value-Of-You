"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Terminal, Sparkles, LogIn, Menu, X, ChevronRight, ShieldCheck } from "lucide-react";

interface HeaderProps {
  onStartAssessment?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartAssessment }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#060911]/90 backdrop-blur-md border-b border-slate-800/80 py-3.5 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 via-indigo-500 to-emerald-400 p-[1px] shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#080d1a] rounded-[11px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-sky-400 group-hover:text-emerald-400 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight font-mono">
                  HUMAN CAPITAL
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  AI Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Measure. Improve. Grow.</p>
            </div>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-sky-400 transition-colors">
              Why Human Capital
            </a>
            <a href="#dimensions" className="hover:text-sky-400 transition-colors">
              5 Dimensions
            </a>
            <a href="#visualizer" className="hover:text-sky-400 transition-colors">
              Score Engine
            </a>
            <a href="#process" className="hover:text-sky-400 transition-colors">
              How It Works
            </a>
            <a href="#faq" className="hover:text-sky-400 transition-colors">
              FAQ
            </a>
            <Link href="/dashboard" className="hover:text-sky-400 transition-colors font-semibold text-sky-400">
              Dashboard
            </Link>
          </nav>

          {/* Auth & CTA Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors border border-slate-800 rounded-xl bg-slate-900/80 hover:bg-slate-800 flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-sky-400" />
              <span>Login</span>
            </Link>

            <Link
              href="/auth/signup"
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-300 hover:from-sky-300 hover:to-emerald-300 shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Sign Up</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070b14]/95 border-b border-slate-800 backdrop-blur-xl px-4 py-6 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-4">
          <nav className="flex flex-col space-y-3 font-medium text-sm text-slate-300">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              Why Human Capital
            </a>
            <a
              href="#dimensions"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              5 Dimensions
            </a>
            <a
              href="#visualizer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              Score Engine
            </a>
            <a
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              How It Works
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              FAQ
            </a>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-sky-500/10 text-sky-400 font-bold border border-sky-500/30"
            >
              Go to Dashboard →
            </Link>
          </nav>

          <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-center text-xs font-semibold text-slate-200"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 text-center text-xs font-bold text-slate-950 shadow-md"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
