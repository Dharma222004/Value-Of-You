"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Terminal, LogIn, Menu, X, ArrowRight } from "lucide-react";

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

  const navItems = [
    { label: "Why Human Value", href: "#about" },
    { label: "5 Dimensions", href: "#dimensions" },
    { label: "Growth Engine", href: "#growth-dashboard" },
    { label: "Simulator", href: "#visualizer" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 flex items-center ${
        scrolled
          ? "bg-[#081224]/85 backdrop-blur-2xl border-b border-[#00D4FF]/25 shadow-2xl shadow-black/70"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="grid-container w-full">
        <div className="flex items-center justify-between">
          
          {/* Logo Left */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#102046] to-[#081224] border border-[#00D4FF]/50 group-hover:border-[#00D4FF] transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] group-hover:shadow-[0_0_30px_rgba(0,212,255,0.55)]">
              <Terminal className="w-5 h-5 text-[#00D4FF] group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white tracking-tight leading-none group-hover:text-[#00D4FF] transition-colors">
                Human Value
              </span>
              <span className="text-[10px] font-mono text-[#00D4FF] tracking-wider uppercase font-semibold">
                Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Links Perfectly Centered */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="nav-link text-xs font-mono font-semibold transition-all"
                style={{ color: "rgba(255, 255, 255, 0.85)" }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Actions: Secondary Login + Primary CTA */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium transition-all px-3 py-2 hover:text-[#00D4FF] hover:drop-shadow-[0_0_15px_rgba(0,212,255,0.5)]"
              style={{ color: "rgba(255, 255, 255, 0.85)" }}
            >
              Login
            </Link>

            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all cursor-pointer"
              style={{
                background: "linear-gradient(90deg, #2563EB, #00D4FF)",
                boxShadow: "0 10px 40px rgba(0, 212, 255, 0.4)",
              }}
            >
              <span>Sign Up</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#101935] border border-white/[0.18] text-[#cbd5e1] hover:text-white transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bg-[#060913]/98 border-b border-white/[0.12] backdrop-blur-xl px-6 py-6 space-y-4 shadow-2xl">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm text-[#cbd5e1] hover:bg-[#0d1428] hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="pt-4 border-t border-white/[0.1] flex items-center gap-3">
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-white/[0.12] bg-[#0d1428] text-center text-sm font-medium text-[#cbd5e1]"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-[#2563eb] text-center text-sm font-semibold text-white shadow-md block"
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
