"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Brain } from "lucide-react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden bg-grid-pattern">

      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px]
        bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-cyan-500/10
        rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/8 rounded-full blur-[80px] pointer-events-none" />

      {/* Top Bar */}
      <div className="w-full max-w-sm mb-8 flex justify-between items-center relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Home
        </Link>

        {/* Brand mark */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}>
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm text-white tracking-tight">
            Value<span className="text-indigo-400">AI</span>
          </span>
        </div>
      </div>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm relative z-10"
        style={{
          background: "rgba(13, 17, 23, 0.85)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
        }}
      >
        {/* Gradient top accent line */}
        <div className="absolute top-0 left-8 right-8 h-px rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)" }} />

        <div className="p-7 sm:p-8">
          {/* Card Header */}
          <div className="text-center mb-7 space-y-2">
            <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">{subtitle}</p>
          </div>

          {children}
        </div>
      </motion.div>

      {/* Security badge */}
      <div className="mt-6 flex items-center gap-1.5 text-[11px] text-slate-500 relative z-10">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Secured by Supabase Auth with Row-Level Security</span>
      </div>
    </div>
  );
}
