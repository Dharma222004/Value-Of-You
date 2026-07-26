"use client";

import { Terminal, Shield, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[var(--background)] border-t border-[var(--border)] pt-16 pb-12 relative overflow-hidden text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[var(--border)]">
          
          {/* Brand */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[1px]">
                <div className="w-full h-full bg-[var(--background)] rounded-[11px] flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[var(--foreground)]">
                Human <span className="text-blue-600 dark:text-cyan-400">Capital</span>
              </span>
            </div>

            <p className="text-[var(--subtext)] leading-relaxed max-w-sm">
              Measure your financial health, skills, health, mindset, and career with one AI-powered Human Capital Score. Apple simplicity meets institutional asset intelligence.
            </p>

            <div className="flex items-center gap-3 text-mono text-[var(--subtext)]">
              <span className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                SOC-2 CERTIFIED
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-blue-600 dark:text-cyan-400">
                <Shield className="w-3.5 h-3.5" />
                256-BIT ENCRYPTION
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-mono font-bold text-[var(--foreground)] uppercase tracking-wider">NAVIGATION</div>
            <ul className="space-y-2 text-[var(--subtext)]">
              <li><a href="#features" className="hover:text-[var(--foreground)] transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-[var(--foreground)] transition-colors">Pricing</a></li>
              <li><a href="#about" className="hover:text-[var(--foreground)] transition-colors">About</a></li>
              <li><a href="#faq" className="hover:text-[var(--foreground)] transition-colors">Contact & FAQ</a></li>
            </ul>
          </div>

          {/* Core Modules */}
          <div className="md:col-span-4 space-y-3">
            <div className="font-mono font-bold text-[var(--foreground)] uppercase tracking-wider">5 MODULE VECTORS</div>
            <ul className="space-y-1.5 text-[var(--subtext)]">
              <li>1. Financial Health & Runway</li>
              <li>2. Skills Architecture & Market Edge</li>
              <li>3. Longevity Health & Physical Endurance</li>
              <li>4. Mindset EQ & Cognitive Grit</li>
              <li>5. Career Status & Velocity</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[var(--subtext)] gap-4">
          <div>
            © {new Date().getFullYear()} Human Capital Platform. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Terms of Service</a>
            <span>·</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-[var(--card-bg)] border border-[var(--border)] hover:scale-105 transition-all text-[var(--foreground)]"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
