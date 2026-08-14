"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, Shield, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#05070f] flex flex-col items-center p-4 sm:p-8 relative overflow-hidden bg-grid-pattern">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px]
        bg-gradient-to-tr from-indigo-600/10 via-purple-600/5 to-cyan-500/5
        rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Navigation Header */}
      <div className="w-full max-w-3xl mb-8 flex justify-between items-center relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Home
        </Link>

        {/* Brand logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}>
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm text-white tracking-tight">
            Value<span className="text-indigo-400">AI</span>
          </span>
        </Link>
      </div>

      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl relative z-10 p-6 sm:p-10 mb-8"
        style={{
          background: "rgba(13, 17, 23, 0.85)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "24px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        {/* Top Accent Gradient Line */}
        <div className="absolute top-0 left-8 right-8 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)" }} />

        {/* Page Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-6">
          <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/20 flex items-center justify-center text-[#06b6d4]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Privacy Architecture</h1>
            <p className="text-xs text-slate-400">Effective Date: August 14, 2026</p>
          </div>
        </div>

        {/* Legal Text Body */}
        <div className="space-y-6 text-xs text-slate-300 leading-relaxed font-sans">
          
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-white tracking-wide">1. Data Architecture Principles</h2>
            <p>
              Your data security is the cornerstone of the ValueAI ecosystem. We design our network architecture to ensure absolute isolation of user identifiers from metrics records. We utilize client-side hashing algorithms and encrypted database layers to limit credential exposure.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-white tracking-wide">2. Scope of Collected Information</h2>
            <p>
              To compile your comprehensive Human Capital evaluation, we collect and process the following metrics points:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li><strong>Profile Data:</strong> Name, verified email address, timezone, and professional status.</li>
              <li><strong>Evaluation Metrics:</strong> Self-declared professional metrics, income data models, certification levels, and survey details.</li>
              <li><strong>Analytics Data:</strong> Browser diagnostics, load speeds, and screen metrics to optimize user experience.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-white tracking-wide">3. Encryption & Row-Level Protection</h2>
            <p>
              All customer database profiles are locked via Supabase Row-Level Security (RLS). Database nodes reside in fully isolated virtual clouds. Write operations are authorized only for authenticated user sessions, ensuring that your metric answers are hidden from adjacent users.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-white tracking-wide">4. Data Portability and Deletion</h2>
            <p>
              You maintain total authority over your telemetry data. You can download your profile history and evaluation logs directly from the platform. At any time, you can invoke the deletion routine to permanently remove your profile, data tables, and telemetry traces from our production infrastructure.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-white tracking-wide">5. Modern Cookie Architecture</h2>
            <p>
              We implement secure, scoped token cookies (`sb-auth-token`) to preserve your active login session and protect against cross-site script hijacking. We do not engage in third-party marketing tracking or telemetry sharing with advertising exchanges.
            </p>
          </section>

        </div>
      </motion.div>

      {/* Security badge footer */}
      <div className="mb-8 flex items-center gap-1.5 text-[11px] text-slate-500 relative z-10">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>End to End Encryption configured on all nodes</span>
      </div>
    </div>
  );
}
