"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Sparkles,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Cpu,
  Target,
  BarChart3,
  Calendar,
  ShieldCheck,
  Brain,
  Zap,
  GraduationCap,
  Clock
} from "lucide-react";

export const CareerDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"30" | "90" | "1y" | "5y">("30");

  // 5 Dimension Heatmap Data
  const dimensionsHeatmap = [
    { name: "Education", current: 82, target: 95, color: "from-[#3b82f6] to-[#60a5fa]", icon: GraduationCap },
    { name: "Skills", current: 91, target: 95, color: "from-[#06b6d4] to-[#22d3ee]", icon: Zap },
    { name: "Finance", current: 76, target: 90, color: "from-[#f59e0b] to-[#fbbf24]", icon: TrendingUp },
    { name: "Health", current: 68, target: 90, color: "from-[#f43f5e] to-[#fb7185]", icon: Activity },
    { name: "Behavior", current: 85, target: 95, color: "from-[#8b5cf6] to-[#a78bfa]", icon: Brain },
  ];

  // Milestone Tracker Items
  const milestones = [
    { label: "Education Capital", status: "completed", tag: "Completed" },
    { label: "Skill Development", status: "completed", tag: "Completed" },
    { label: "Financial Literacy", status: "completed", tag: "Completed" },
    { label: "Health Optimization", status: "warning", tag: "Attention Needed" },
    { label: "Behavioral Growth", status: "completed", tag: "Completed" },
  ];

  // Horizon Goal Subtitles
  const horizonGoals = {
    "30": "Goal: Build momentum.",
    "90": "Goal: Build measurable improvement.",
    "1y": "Goal: Create long-term growth.",
    "5y": "Goal: Maximize human potential.",
  };

  // Priority Actions by Roadmap Time Horizon with rich UI/UX metadata
  const roadmapActions = {
    "30": [
      {
        id: 1,
        title: "Complete one online course or certification.",
        subtitle: "Learning milestone • Estimated effort: 10–15 hours",
        difficulty: "Medium",
        time: "30 days",
        scoreGain: "+5 points",
        dimension: "Skills & Employability",
      },
      {
        id: 2,
        title: "Create or update your professional portfolio and resume.",
        subtitle: "Career optimization • Estimated effort: 3–5 hours",
        difficulty: "Easy",
        time: "1 week",
        scoreGain: "+3 points",
        dimension: "Education & Career Growth",
      },
      {
        id: 3,
        title: "Exercise at least 4 days per week.",
        subtitle: "Health improvement • Target: 16 sessions",
        difficulty: "Easy",
        time: "30 days",
        scoreGain: "+4 points",
        dimension: "Health & Wellness",
      },
      {
        id: 4,
        title: "Track all expenses and create a monthly budget.",
        subtitle: "Financial awareness • Target: 30 days",
        difficulty: "Easy",
        time: "2 weeks",
        scoreGain: "+4 points",
        dimension: "Financial Well-Being",
      },
      {
        id: 5,
        title: "Read one book related to your field.",
        subtitle: "Knowledge expansion • Target: 1 completed book",
        difficulty: "Easy",
        time: "3 weeks",
        scoreGain: "+3 points",
        dimension: "Behavioral Intelligence",
      },
    ],
    "90": [
      {
        id: 6,
        title: "Complete two industry-relevant certifications.",
        subtitle: "Skill development • Target: 2 certifications",
        difficulty: "Medium",
        time: "90 days",
        scoreGain: "+8 points",
        dimension: "Skills & Employability",
      },
      {
        id: 7,
        title: "Build one portfolio project.",
        subtitle: "Practical application • Target: 1 completed project",
        difficulty: "Medium",
        time: "60 days",
        scoreGain: "+6 points",
        dimension: "Education & Career Growth",
      },
      {
        id: 8,
        title: "Increase your savings rate by 10%.",
        subtitle: "Financial growth • Target: Consistent monthly saving",
        difficulty: "Medium",
        time: "90 days",
        scoreGain: "+6 points",
        dimension: "Financial Well-Being",
      },
      {
        id: 9,
        title: "Establish a sustainable fitness routine.",
        subtitle: "Health optimization • Target: 36 exercise sessions",
        difficulty: "Medium",
        time: "90 days",
        scoreGain: "+7 points",
        dimension: "Health & Wellness",
      },
      {
        id: 10,
        title: "Improve one communication skill.",
        subtitle: "Behavioral development • Target: Public speaking, writing, or leadership",
        difficulty: "Easy",
        time: "45 days",
        scoreGain: "+5 points",
        dimension: "Behavioral Intelligence",
      },
    ],
    "1y": [
      {
        id: 11,
        title: "Develop expertise in one high-value skill.",
        subtitle: "Professional advancement • Target: Advanced proficiency",
        difficulty: "Hard",
        time: "12 months",
        scoreGain: "+12 points",
        dimension: "Skills & Employability",
      },
      {
        id: 12,
        title: "Build multiple portfolio projects.",
        subtitle: "Career growth • Target: 3–5 completed projects",
        difficulty: "Hard",
        time: "9 months",
        scoreGain: "+10 points",
        dimension: "Education & Career Growth",
      },
      {
        id: 13,
        title: "Create a 12-month financial plan.",
        subtitle: "Financial stability • Target: Defined savings and investment goals",
        difficulty: "Medium",
        time: "6 months",
        scoreGain: "+9 points",
        dimension: "Financial Well-Being",
      },
      {
        id: 14,
        title: "Maintain consistent physical and mental wellness.",
        subtitle: "Wellness • Target: Sustainable lifestyle habits",
        difficulty: "Medium",
        time: "12 months",
        scoreGain: "+8 points",
        dimension: "Health & Wellness",
      },
      {
        id: 15,
        title: "Expand your professional network.",
        subtitle: "Social capital • Target: Meaningful industry connections",
        difficulty: "Medium",
        time: "12 months",
        scoreGain: "+7 points",
        dimension: "Behavioral Intelligence",
      },
    ],
    "5y": [
      {
        id: 16,
        title: "Become an expert in your domain.",
        subtitle: "Career mastery • Target: Recognized expertise",
        difficulty: "Mastery",
        time: "5 years",
        scoreGain: "+20 points",
        dimension: "Education & Career Growth",
      },
      {
        id: 17,
        title: "Achieve financial independence.",
        subtitle: "Financial capital • Target: Strong savings and investment foundation",
        difficulty: "Mastery",
        time: "5 years",
        scoreGain: "+18 points",
        dimension: "Financial Well-Being",
      },
      {
        id: 18,
        title: "Build a diversified skill ecosystem.",
        subtitle: "Skill capital • Target: Technical, business, and leadership skills",
        difficulty: "Hard",
        time: "3–5 years",
        scoreGain: "+15 points",
        dimension: "Skills & Employability",
      },
      {
        id: 19,
        title: "Maintain long-term health and resilience.",
        subtitle: "Health capital • Target: Sustainable physical and mental well-being",
        difficulty: "Hard",
        time: "5 years",
        scoreGain: "+14 points",
        dimension: "Health & Wellness",
      },
      {
        id: 20,
        title: "Become a mentor, leader, or community contributor.",
        subtitle: "Behavioral and social capital • Target: Leadership and impact",
        difficulty: "Mastery",
        time: "5 years",
        scoreGain: "+15 points",
        dimension: "Behavioral Intelligence",
      },
    ],
  };

  return (
    <section
      id="growth-dashboard"
      className="py-28 sm:py-36 relative text-white overflow-hidden scroll-mt-20"
      style={{
        background: "linear-gradient(180deg, #081224 0%, #0C1830 50%, #101C36 100%)",
      }}
    >
      
      {/* Background Ambient Glows */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[850px] h-[520px] pointer-events-none rounded-full blur-[95px]"
        style={{
          background: "radial-gradient(circle, rgba(0, 212, 255, 0.15), transparent 70%)",
        }}
      />
      <div
        className="absolute top-2/3 right-[5%] w-[420px] h-[420px] pointer-events-none rounded-full blur-[85px]"
        style={{
          background: "radial-gradient(circle, rgba(79, 124, 255, 0.15), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 bg-institutional-grid pointer-events-none"
        style={{ opacity: 0.15 }}
      />

      <div className="grid-container relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/20 border border-[#00D4FF]/50 text-[#00D4FF] text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(0,212,255,0.35)] backdrop-blur-md">
            <Activity className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span>HUMAN VALUE PROGRESS ENGINE</span>
          </div>
          <h2
            className="section-headline text-white"
            style={{
              color: "rgba(255, 255, 255, 0.95)",
              textShadow: "0 0 20px rgba(0, 212, 255, 0.25)",
            }}
          >
            Human Growth & <br />
            <span
              style={{
                background: "linear-gradient(135deg, #00D4FF, #4F7CFF, #B66DFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 30px rgba(0, 212, 255, 0.35))",
              }}
            >
              Progress Dashboard
            </span>
          </h2>
          <p
            className="body-text mx-auto text-base sm:text-lg"
            style={{
              color: "rgba(255, 255, 255, 0.82)",
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            Real-time telemetry tracking your 5 core capital dimensions, trajectory milestones, radar analysis, and AI-driven priority action plans.
          </p>
        </div>

        {/* Main Grid: Radar Chart + Growth Timeline & Milestones */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Column: 5-Axis Pentagon Radar Chart */}
          <div className="lg:col-span-6 bg-gradient-to-b from-[#131f42]/95 via-[#0e1732]/98 to-[#090e20] rounded-2xl p-7 border border-[#38bdf8]/30 flex flex-col justify-between space-y-6 shadow-[0_0_40px_rgba(59,130,246,0.25)] backdrop-blur-xl">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[#f1f5f9] font-bold uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-[#38bdf8]" />
                5-DIMENSION RADAR CHART
              </span>
              <span className="text-[#22d3ee] font-bold bg-[#06b6d4]/20 px-3 py-1 rounded-full border border-[#06b6d4]/45 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                Balanced Growth
              </span>
            </div>

            {/* SVG Radar Chart Visualizer */}
            <div className="relative w-full max-w-[320px] aspect-square mx-auto flex items-center justify-center py-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="radarPolyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.45" />
                  </linearGradient>
                </defs>

                {/* Concentric Pentagon Rings (25%, 50%, 75%, 100%) */}
                {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                  <polygon
                    key={i}
                    points={`
                      ${100 + scale * 0},${100 - scale * 70}
                      ${100 + scale * 66.6},${100 - scale * 21.6}
                      ${100 + scale * 41.1},${100 + scale * 56.6}
                      ${100 - scale * 41.1},${100 + scale * 56.6}
                      ${100 - scale * 66.6},${100 - scale * 21.6}
                    `}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="1"
                    strokeDasharray={scale === 1 ? "none" : "2,2"}
                    fill="transparent"
                  />
                ))}

                {/* Axis Spokes from center (100,100) */}
                <line x1="100" y1="100" x2="100" y2="30" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
                <line x1="100" y1="100" x2="166.6" y2="78.4" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
                <line x1="100" y1="100" x2="141.1" y2="156.6" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
                <line x1="100" y1="100" x2="58.9" y2="156.6" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
                <line x1="100" y1="100" x2="33.4" y2="78.4" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />

                {/* Data Polygon: Skills 91%, Finance 76%, Behavior 85%, Education 82%, Health 68% */}
                <polygon
                  points="100,36.3 150.6,83.6 135.0,148.1 66.3,146.4 54.7,85.3"
                  fill="url(#radarPolyGrad)"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  className="drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                />

                {/* Data Vertex Dots */}
                <circle cx="100" cy="36.3" r="4" fill="#06b6d4" />
                <circle cx="150.6" cy="83.6" r="4" fill="#f59e0b" />
                <circle cx="135.0" cy="148.1" r="4" fill="#8b5cf6" />
                <circle cx="66.3" cy="146.4" r="4" fill="#3b82f6" />
                <circle cx="54.7" cy="85.3" r="4" fill="#f43f5e" />

                {/* Labels outside vertices */}
                <text x="100" y="16" textAnchor="middle" fill="#06b6d4" fontSize="10" fontWeight="bold" fontFamily="monospace">Skills (91%)</text>
                <text x="175" y="80" textAnchor="start" fill="#f59e0b" fontSize="10" fontWeight="bold" fontFamily="monospace">Finance (76%)</text>
                <text x="145" y="172" textAnchor="middle" fill="#8b5cf6" fontSize="10" fontWeight="bold" fontFamily="monospace">Behavior (85%)</text>
                <text x="55" y="172" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="bold" fontFamily="monospace">Education (82%)</text>
                <text x="25" y="80" textAnchor="end" fill="#f43f5e" fontSize="10" fontWeight="bold" fontFamily="monospace">Health (68%)</text>
              </svg>
            </div>

            <p className="text-xs text-[#94a3b8] text-center leading-relaxed font-mono">
              Polygon shape instantly highlights strength areas (Skills, Behavior) and optimization targets (Health, Finance).
            </p>
          </div>

          {/* Right Column: Growth Timeline & Milestone Tracker */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            
            {/* Progression Timeline (2024 - 2028) */}
            <div className="bg-[#111a33] rounded-2xl p-6 sm:p-7 border border-white/[0.18] space-y-6 shadow-xl">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#e2e8f0] font-bold uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#10b981]" />
                  GROWTH PROGRESSION TIMELINE
                </span>
                <span className="text-[#10b981] font-bold">2024 → 2028</span>
              </div>

              {/* Horizontal Stepper Timeline */}
              <div className="pt-2 pb-4">
                <div className="relative flex items-center justify-between">
                  {/* Background connecting line */}
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/[0.14] -z-0" />
                  <div className="absolute top-4 left-4 w-[50%] h-0.5 bg-gradient-to-r from-[#3b82f6] to-[#10b981] -z-0" />

                  {/* Stage Nodes */}
                  {[
                    { year: "2024", stage: "Foundation", status: "past" },
                    { year: "2025", stage: "Development", status: "past" },
                    { year: "2026", stage: "Growth", status: "current" },
                    { year: "2027", stage: "Optimization", status: "future" },
                    { year: "2028", stage: "Excellence", status: "future" },
                  ].map((node, i) => {
                    const isCurrent = node.status === "current";
                    const isPast = node.status === "past";
                    return (
                      <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                        {/* Node circle */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isCurrent
                            ? "bg-[#10b981] text-black font-bold ring-4 ring-[#10b981]/30 shadow-[0_0_15px_rgba(16,185,129,0.6)]"
                            : isPast
                            ? "bg-[#3b82f6] text-white font-bold"
                            : "bg-[#182447] border-2 border-white/[0.22] text-[#cbd5e1]"
                        }`}>
                          <span className="text-[10px] font-mono font-bold">{node.year.slice(2)}</span>
                        </div>

                        {/* Stage Name */}
                        <span className={`text-[11px] font-mono mt-2 block ${isCurrent ? "text-white font-bold" : "text-[#cbd5e1]"}`}>
                          {node.stage}
                        </span>

                        {/* YOU ARE HERE Badge on 2026 */}
                        {isCurrent && (
                          <span className="mt-1 font-mono text-[9px] font-extrabold text-[#10b981] bg-[#10b981]/20 px-2 py-0.5 rounded-full border border-[#10b981]/35 shadow-[0_0_10px_rgba(16,185,129,0.25)] animate-pulse uppercase tracking-wider">
                            YOU ARE HERE
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Milestone Tracker Table */}
            <div className="bg-[#111a33] rounded-2xl p-6 sm:p-7 border border-white/[0.18] space-y-4 shadow-xl">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#e2e8f0] font-bold uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#06b6d4]" />
                  MILESTONE TRACKER
                </span>
                <span className="text-[#cbd5e1]">4/5 Completed</span>
              </div>

              <div className="space-y-2.5">
                {milestones.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#182447] border border-white/[0.12] text-xs font-mono shadow-inner">
                    <span className="text-white font-semibold">{m.label}</span>
                    {m.status === "completed" ? (
                      <span className="flex items-center gap-1.5 text-[#10b981] font-bold bg-[#10b981]/20 px-2.5 py-0.5 rounded border border-[#10b981]/35">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>✓ Completed</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[#f59e0b] font-bold bg-[#f59e0b]/20 px-2.5 py-0.5 rounded border border-[#f59e0b]/35">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>⚠ Attention Needed</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Dimension Heatmap (Progress Bars with Target vs Current) */}
        <div className="bg-[#111a33] rounded-2xl p-7 border border-white/[0.18] space-y-6 shadow-xl">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[#e2e8f0] font-bold uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#3b82f6]" />
              DIMENSION HEATMAP & TARGET SCORES
            </span>
            <span className="text-[#cbd5e1]">CURRENT vs TARGET BENCHMARK</span>
          </div>

          <div className="space-y-4">
            {dimensionsHeatmap.map((dim) => {
              const DimIcon = dim.icon;
              return (
                <div key={dim.name} className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-white font-bold">
                      <DimIcon className="w-4 h-4 text-[#3b82f6]" />
                      <span>{dim.name}</span>
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[#e2e8f0]">Current: <strong className="text-white font-bold">{dim.current}</strong></span>
                      <span className="text-[#cbd5e1]">Target: <strong className="text-[#10b981] font-bold">{dim.target}</strong></span>
                    </div>
                  </div>

                  <div className="h-3 w-full bg-[#0a0f1d] rounded-full overflow-hidden p-0.5 border border-white/[0.1] relative">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${dim.current}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${dim.color} rounded-full shadow-[0_0_10px_rgba(59,130,246,0.4)]`}
                    />
                    {/* Target Line Indicator */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-[#10b981] shadow-[0_0_6px_#10b981]"
                      style={{ left: `${dim.target}%` }}
                      title={`Target: ${dim.target}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Growth Pipeline Architecture Flow (Input → Engine → Score → Roadmap) */}
        <div className="bg-[#111a33] rounded-2xl p-7 border border-white/[0.18] space-y-6 shadow-xl">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[#e2e8f0] font-bold uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#06b6d4]" />
              HUMAN VALUE ENGINE PIPELINE
            </span>
            <span className="text-[#06b6d4] font-semibold">End-to-End Processing Architecture</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Step 1: Input Layer */}
            <div className="p-4 rounded-xl bg-[#182447] border border-white/[0.12] space-y-2 text-xs font-mono shadow-inner">
              <span className="text-[#3b82f6] font-bold block uppercase">1. INPUT LAYER</span>
              <ul className="text-[#cbd5e1] space-y-1 text-[11px]">
                <li>• Education & Credentials</li>
                <li>• Technical Skills & Stack</li>
                <li>• Financial Runway & Net Worth</li>
                <li>• Health & Biological HRV</li>
                <li>• Behavioral EQ & Focus</li>
              </ul>
            </div>

            {/* Step 2: AI Analysis Engine */}
            <div className="p-4 rounded-xl bg-[#182447] border border-[#3b82f6]/45 space-y-2 text-xs font-mono shadow-[0_0_12px_rgba(59,130,246,0.2)]">
              <span className="text-[#06b6d4] font-bold block uppercase flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-[#06b6d4]" />
                2. AI ANALYSIS ENGINE
              </span>
              <ul className="text-[#cbd5e1] space-y-1 text-[11px]">
                <li>• Data Enclave Processing</li>
                <li>• Neural Benchmark Alignment</li>
                <li>• Displacement Risk Patterns</li>
                <li>• Predictive NPV Modeling</li>
              </ul>
            </div>

            {/* Step 3: Human Value Score */}
            <div className="p-4 rounded-xl bg-[#182447] border border-[#10b981]/45 space-y-2 text-xs font-mono text-center shadow-inner">
              <span className="text-[#10b981] font-bold block uppercase">3. HUMAN VALUE SCORE</span>
              <div className="py-2">
                <span className="text-3xl font-black text-white block">88/100</span>
                <span className="text-[10px] text-[#10b981] font-bold">Top 5% Cohort Index</span>
              </div>
            </div>

            {/* Step 4: Personalized Roadmap */}
            <div className="p-4 rounded-xl bg-[#182447] border border-[#8b5cf6]/45 space-y-2 text-xs font-mono shadow-inner">
              <span className="text-[#a78bfa] font-bold block uppercase">4. PERSONALIZED ROADMAP</span>
              <ul className="text-[#cbd5e1] space-y-1 text-[11px]">
                <li>• 30-Day Priority Action Items</li>
                <li>• 90-Day Upskilling Targets</li>
                <li>• 1-Year Financial Milestones</li>
                <li>• 5-Year Trajectory Yield</li>
              </ul>
            </div>
          </div>
        </div>

        {/* AI Growth Recommendations with Time Horizon Tabs */}
        <div className="bg-[#111a33] rounded-2xl p-7 border border-white/[0.18] space-y-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-2 text-white font-bold">
              <Sparkles className="w-4 h-4 text-[#06b6d4]" />
              <span>AI-POWERED GROWTH RECOMMENDATIONS</span>
            </div>

            {/* Time Horizon Filter Tabs */}
            <div className="flex items-center gap-2 bg-[#182447] p-1 rounded-xl border border-white/[0.14]">
              {(["30", "90", "1y", "5y"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    activeTab === tab
                      ? "bg-[#2563eb] text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] border border-[#3b82f6]/40"
                      : "text-[#cbd5e1] hover:text-white"
                  }`}
                >
                  {tab === "30" ? "30 Days" : tab === "90" ? "90 Days" : tab === "1y" ? "1 Year" : "5 Years"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {roadmapActions[activeTab].map((action, idx) => {
                  const diffColor =
                    action.difficulty === "Easy"
                      ? "text-[#10b981] bg-[#10b981]/20 border-[#10b981]/35"
                      : action.difficulty === "Medium"
                      ? "text-[#06b6d4] bg-[#06b6d4]/20 border-[#06b6d4]/35"
                      : action.difficulty === "Hard"
                      ? "text-[#f59e0b] bg-[#f59e0b]/20 border-[#f59e0b]/35"
                      : "text-purple-400 bg-purple-400/20 border-purple-400/35";

                  return (
                    <div
                      key={action.id}
                      className="p-4 sm:p-5 rounded-2xl bg-[#182447] border border-white/[0.12] hover:border-[#3b82f6]/60 hover:bg-[#1e2e5c] transition-all duration-200 group flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-md"
                    >
                      {/* Left: Index badge + Title + Subtitle */}
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-[#3b82f6]/20 border border-[#3b82f6]/40 flex items-center justify-center text-[#60a5fa] font-mono font-bold text-xs shrink-0 mt-0.5 group-hover:scale-105 transition-transform shadow-inner">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div className="space-y-1 min-w-0">
                          <h4 className="font-bold text-white text-sm sm:text-base group-hover:text-[#60a5fa] transition-colors leading-snug">
                            {action.title}
                          </h4>
                          <p className="text-[#cbd5e1] text-xs font-mono">
                            {action.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Right: Clean, elegant metadata pills row */}
                      <div className="flex flex-wrap items-center gap-2 font-mono text-xs shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/[0.1]">
                        {/* Dimension Pill */}
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#3b82f6]/20 border border-[#3b82f6]/35 text-[#60a5fa] text-[11px] font-semibold">
                          <Target className="w-3 h-3 text-[#3b82f6]" />
                          <span>{action.dimension}</span>
                        </span>

                        {/* Time Pill */}
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.08] border border-white/[0.14] text-white text-[11px]">
                          <Clock className="w-3 h-3 text-[#06b6d4]" />
                          <span>{action.time}</span>
                        </span>

                        {/* Difficulty Pill */}
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${diffColor}`}>
                          {action.difficulty}
                        </span>

                        {/* Score Gain Highlight Pill */}
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#10b981]/20 border border-[#10b981]/35 text-[#10b981] text-[11px] font-extrabold shadow-[0_0_10px_rgba(16,185,129,0.25)]">
                          <TrendingUp className="w-3 h-3" />
                          <span>{action.scoreGain}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CareerDetail;

