"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Zap, Activity } from "lucide-react";

const loadingSteps = [
  "Initializing Assessment Engine...",
  "Loading Framework...",
  "Analyzing Dimensions...",
  "Calibrating Neural Models...",
];

export const LoadingScreen: React.FC<{ statusText?: string }> = ({ statusText }) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % loadingSteps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05070f] text-white p-6 overflow-hidden">
      {/* Background Aurora Glow */}
      <div className="absolute w-[600px] h-[350px] bg-gradient-to-tr from-[#3b82f6]/15 via-[#06b6d4]/10 to-[#10b981]/15 blur-[160px] pointer-events-none rounded-full" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-institutional-grid opacity-50 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-sm">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] flex items-center justify-center text-white font-bold text-base shadow-[0_0_25px_rgba(59,130,246,0.4)]">
            HV
          </div>
          <span className="font-bold text-2xl tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Human Value
          </span>
        </div>

        {/* High-Precision Circular Loading Spinner with Aurora Gradient Glow */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full animate-spin" viewBox="0 0 100 100" style={{ animationDuration: "2.5s" }}>
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="url(#loadingAuroraGrad)"
              strokeWidth="4"
              strokeDasharray={263.89}
              strokeDashoffset={160}
              strokeLinecap="round"
              fill="transparent"
              className="drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]"
            />
            <defs>
              <linearGradient id="loadingAuroraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#090d1a] border border-white/[0.1] flex items-center justify-center shadow-inner">
              <Cpu className="w-5 h-5 text-[#06b6d4] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Stepped Status Text */}
        <div className="h-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={statusText || stepIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="font-mono text-xs text-[#94a3b8] tracking-wider uppercase font-semibold"
            >
              {statusText || loadingSteps[stepIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress Bar Indicator */}
        <div className="w-48 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#10b981]"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;
