"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ArrowRight, Menu, X, Terminal } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check initial dark mode setting on HTML tag
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--border)] py-3.5 shadow-lg shadow-black/5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-500 p-[1px] shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[var(--background)] rounded-[11px] flex items-center justify-center">
                <Terminal className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 font-extrabold text-lg tracking-tight text-[var(--foreground)]">
              <span>Human</span>
              <span className="text-blue-600 dark:text-cyan-400">Capital</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--subtext)]">
            <a href="#features" className="hover:text-[var(--foreground)] transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-[var(--foreground)] transition-colors">
              Pricing
            </a>
            <a href="#about" className="hover:text-[var(--foreground)] transition-colors">
              About
            </a>
            <a href="#faq" className="hover:text-[var(--foreground)] transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Actions & Theme Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full bg-[var(--card-bg)] border border-[var(--border)] text-[var(--foreground)] hover:scale-105 active:scale-95 transition-all shadow-sm"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Login CTA */}
            <Link href="/auth/login" className="px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:text-blue-500 transition-colors">
              Login
            </Link>

            {/* Get Started Primary CTA */}
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 dark:bg-cyan-400 text-white dark:text-slate-950 text-sm font-semibold shadow-md hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-[var(--card-bg)] border border-[var(--border)] text-[var(--foreground)]"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] text-[var(--foreground)]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-[var(--border)] bg-[var(--glass-bg)] backdrop-blur-xl px-4 py-6 space-y-4"
          >
            <nav className="flex flex-col space-y-3 font-medium text-base text-[var(--subtext)]">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[var(--foreground)]"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[var(--foreground)]"
              >
                Pricing
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[var(--foreground)]"
              >
                About
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[var(--foreground)]"
              >
                Contact
              </a>
            </nav>
            <div className="pt-4 border-t border-[var(--border)] flex flex-col gap-3">
              <button className="w-full py-2.5 text-center font-semibold text-[var(--foreground)] border border-[var(--border)] rounded-xl">
                Login
              </button>
              <a
                href="#score-preview"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center font-bold text-white bg-blue-600 dark:bg-cyan-400 dark:text-slate-950 rounded-xl"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
