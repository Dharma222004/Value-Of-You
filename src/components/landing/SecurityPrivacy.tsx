"use client";

import React from "react";
import { ShieldCheck, Lock, EyeOff, Key, FileCheck } from "lucide-react";

export const SecurityPrivacy: React.FC = () => {
  return (
    <section id="security" className="py-32 relative bg-[#05070f] overflow-hidden">
      
      {/* Radial Dark Shield Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#10b981]/04 blur-[160px] pointer-events-none rounded-full" />

      <div className="grid-container relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 text-xs font-mono font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ENTERPRISE PRIVACY & SECURITY SHIELD</span>
          </div>
          <h2 className="section-headline">
            Your Human Capital Telemetry Is <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] via-[#06b6d4] to-[#3b82f6]">
              100% Encrypted & Private
            </span>
          </h2>
          <p className="body-text mx-auto">
            We treat your career, liquid runway, and health data with institutional bank-grade security protocols.
          </p>
        </div>

        {/* Security Shield Grid */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Hero Lock Visualization (5 Cols) */}
          <div className="lg:col-span-5 card-surface p-8 flex flex-col items-center justify-between text-center space-y-6 h-full border-[#10b981]/30">
            <div className="w-full flex justify-center">
              <span className="text-[10px] font-mono text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-full border border-[#10b981]/20 font-bold uppercase tracking-wider">
                AES-256 ENCRYPTED PROTOCOL
              </span>
            </div>

            <div className="relative w-36 h-36 rounded-full flex items-center justify-center border border-[#10b981]/40 bg-[#05070f] shadow-inner my-auto">
              <div className="absolute inset-0 rounded-full border border-[#10b981]/20 animate-pulse" />
              <Lock className="w-12 h-12 text-[#10b981]" />
            </div>

            <div className="space-y-3 w-full">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider block">
                CLIENT-SIDE KEY GENERATION
              </span>
              <p className="text-xs text-[#94a3b8] leading-relaxed max-w-xs mx-auto">
                End-to-end cryptographic key generation ensures zero plain-text storage across all servers.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 font-mono text-[10px] text-[#10b981]">
                <span className="px-2.5 py-1 rounded bg-[#10b981]/10 border border-[#10b981]/20 font-bold">SOC2 TYPE II</span>
                <span className="px-2.5 py-1 rounded bg-[#10b981]/10 border border-[#10b981]/20 font-bold">GDPR ENFORCED</span>
                <span className="px-2.5 py-1 rounded bg-[#10b981]/10 border border-[#10b981]/20 font-bold">ZERO AD TARGETING</span>
              </div>
            </div>
          </div>

          {/* Right 4 Feature Cards in 2x2 Grid (7 Cols) */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6 items-stretch">
            
            <div className="card-surface p-6 flex flex-col justify-between space-y-4 h-full">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-[#10b981]">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">256-Bit AES Encryption</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  All liquid runway numbers, title benchmarks, and health data are encrypted at rest and in transit using AES-256 protocols.
                </p>
              </div>
            </div>

            <div className="card-surface p-6 flex flex-col justify-between space-y-4 h-full">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
                  <EyeOff className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Zero Data Selling Guarantee</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Your telemetry is never sold, shared with recruiters, or used for third-party ad targeting. You hold 100% data ownership.
                </p>
              </div>
            </div>

            <div className="card-surface p-6 flex flex-col justify-between space-y-4 h-full">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/30 flex items-center justify-center text-[#06b6d4]">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Anonymized Benchmarking</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Global cohort comparison data is aggregated anonymously using zero-knowledge cryptographic proofs.
                </p>
              </div>
            </div>

            <div className="card-surface p-6 flex flex-col justify-between space-y-4 h-full">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">SOC2 & GDPR Compliant</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Built following strict SOC2 Type II security principles and EU GDPR privacy rights, including 1-click complete data purge.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default SecurityPrivacy;
