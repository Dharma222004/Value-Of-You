"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, EyeOff, Server, Key, FileCheck } from "lucide-react";

export const SecurityPrivacy: React.FC = () => {
  return (
    <section id="security" className="py-24 relative bg-[#060911] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ENTERPRISE PRIVACY & SECURITY SHIELD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Your Human Capital Telemetry Is <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-sky-300 to-indigo-400">
              100% Encrypted & Private
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            We treat your career, financial, and health data with institutional bank-grade security protocols.
          </p>
        </div>

        {/* 4 Security Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">256-Bit AES Encryption</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              All financial runway, salary metrics, and health data are encrypted at rest and in transit using AES-256 protocols.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero Data Selling Guarantee</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your telemetry is never sold, shared with recruiters, or used for third-party ad targeting. You hold 100% data ownership.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Anonymized Benchmarking</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Global cohort comparison data is aggregated anonymously using zero-knowledge cryptographic proofs.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">SOC2 & GDPR Compliant</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Built following strict SOC2 Type II security principles and EU GDPR privacy rights, including 1-click data wipe.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SecurityPrivacy;
