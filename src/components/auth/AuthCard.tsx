"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col justify-center items-center p-4 sm:p-6 hero-grid relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--hero-glow)] rounded-full blur-[140px] pointer-events-none" />

      {/* Top Back Link */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--subtext)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-[1px]">
            <div className="w-full h-full bg-[var(--background)] rounded-[7px] flex items-center justify-center">
              <Terminal className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
            </div>
          </div>
          <span className="font-extrabold text-sm tracking-tight text-[var(--foreground)]">
            Human <span className="text-blue-600 dark:text-cyan-400">Capital</span>
          </span>
        </div>
      </div>

      {/* Main Glassmorphism Auth Card */}
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--border)] shadow-2xl relative z-10">
        <div className="text-center mb-6 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">{title}</h1>
          <p className="text-xs text-[var(--subtext)] leading-relaxed">{subtitle}</p>
        </div>

        {children}
      </div>

      {/* Security Footer Note */}
      <div className="mt-8 text-center text-[11px] font-mono text-[var(--subtext)] relative z-10">
        <span>🔒 256-Bit Client-Side Encryption Enabled</span>
      </div>
    </div>
  );
}
