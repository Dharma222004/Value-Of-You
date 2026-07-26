"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Terminal, ArrowLeft, ShieldCheck } from "lucide-react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col justify-center items-center p-4 sm:p-6 hero-grid relative overflow-hidden">
      {/* Dynamic Hero Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--hero-glow)] rounded-full blur-[150px] pointer-events-none opacity-80" />

      {/* Top Header Navigation */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--subtext)] hover:text-[var(--foreground)] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Landing Page</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 p-[1px] shadow-sm">
            <div className="w-full h-full bg-[var(--background)] rounded-[7px] flex items-center justify-center">
              <Terminal className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
            </div>
          </div>
          <span className="font-extrabold text-sm tracking-tight text-[var(--foreground)]">
            Human <span className="text-blue-600 dark:text-cyan-400">Capital</span>
          </span>
        </div>
      </div>

      {/* Animated Glassmorphism Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--border)] shadow-2xl relative z-10"
      >
        <div className="text-center mb-6 space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">{title}</h1>
          <p className="text-xs text-[var(--subtext)] leading-relaxed max-w-sm mx-auto">{subtitle}</p>
        </div>

        {children}
      </motion.div>

      {/* Security Footer Note */}
      <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] font-mono text-[var(--subtext)] relative z-10">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>256-Bit Zero-Knowledge Encryption Protocol Enabled</span>
      </div>
    </div>
  );
}
