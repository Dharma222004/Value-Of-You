"use client";

import React, { useState } from "react";
import { Sliders, Cpu, RefreshCw, ArrowRight, TrendingUp } from "lucide-react";

export const ScoreVisualizer: React.FC = () => {
  const [scores, setScores] = useState({
    career: 82,      // Education & Career Growth
    finance: 76,     // Financial Well-Being
    skills: 91,      // Skills & Employability
    health: 68,      // Health & Wellness
    behavior: 85,    // Behavioral Intelligence
  });

  const handleSlider = (key: keyof typeof scores, val: number) => {
    setScores((prev) => ({ ...prev, [key]: val }));
  };

  const totalScore = Math.round(
    scores.career * 0.25 +
    scores.finance * 0.20 +
    scores.skills * 0.25 +
    scores.health * 0.15 +
    scores.behavior * 0.15
  );

  const getGrowthStage = (s: number) => {
    if (s >= 81) return { stage: "EXCEPTIONAL", stars: "★★★★★", color: "#10b981", bg: "bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30" };
    if (s >= 61) return { stage: "ADVANCED", stars: "★★★★☆", color: "#3b82f6", bg: "bg-[#3b82f6]/15 text-[#60a5fa] border-[#3b82f6]/30" };
    if (s >= 41) return { stage: "PROGRESSING", stars: "★★★☆☆", color: "#06b6d4", bg: "bg-[#06b6d4]/15 text-[#22d3ee] border-[#06b6d4]/30" };
    if (s >= 21) return { stage: "DEVELOPING", stars: "★★☆☆☆", color: "#f59e0b", bg: "bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/30" };
    return { stage: "FOUNDATION", stars: "★☆☆☆☆", color: "#ef4444", bg: "bg-rose-500/15 text-rose-400 border-rose-500/30" };
  };

  const growthStage = getGrowthStage(totalScore);

  // Compute Strongest and Weakest Dimensions
  const dimensionList = [
    { key: "career", name: "Education & Career", val: scores.career },
    { key: "finance", name: "Financial Well-Being", val: scores.finance },
    { key: "skills", name: "Skills & Employability", val: scores.skills },
    { key: "health", name: "Health & Wellness", val: scores.health },
    { key: "behavior", name: "Behavioral EQ", val: scores.behavior },
  ];

  const sortedDimensions = [...dimensionList].sort((a, b) => b.val - a.val);
  const strongest = sortedDimensions[0];
  const weakest = sortedDimensions[sortedDimensions.length - 1];

  const resetScores = () => {
    setScores({ career: 82, finance: 76, skills: 91, health: 68, behavior: 85 });
  };

  // Radar chart coordinates computation (center 100,100, radius R=60)
  const R = 55;
  const getRadarPoint = (angleDeg: number, val: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    const norm = Math.max(0.15, val / 100);
    const x = 100 + R * norm * Math.cos(rad);
    const y = 100 + R * norm * Math.sin(rad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const ptSkills = getRadarPoint(-90, scores.skills);
  const ptFinance = getRadarPoint(-18, scores.finance);
  const ptBehavior = getRadarPoint(54, scores.behavior);
  const ptCareer = getRadarPoint(126, scores.career);
  const ptHealth = getRadarPoint(198, scores.health);

  const radarPolygonPoints = `${ptSkills} ${ptFinance} ${ptBehavior} ${ptCareer} ${ptHealth}`;

  return (
    <section id="visualizer" className="py-24 sm:py-32 relative bg-[#0a0f1d] text-white">
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#3b82f6]/20 blur-[75px] pointer-events-none rounded-full" />

      <div className="grid-container relative z-10 space-y-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3b82f6]/15 border border-[#3b82f6]/40 text-[#60a5fa] text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.25)]">
            <Cpu className="w-3.5 h-3.5 text-[#06b6d4]" />
            <span>HUMAN VALUE SIMULATOR</span>
          </div>
          <h2 className="section-headline text-white">
            Explore Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#10b981]">
              Human Value Score
            </span>
          </h2>
          <p className="body-text mx-auto text-[#e2e8f0]">
            Adjust the sliders below to see how changes across dimensions influence your overall score in real time.
          </p>
        </div>

        {/* Showcase Glass Terminal Container */}
        <div className="card-surface p-6 sm:p-8 space-y-8 bg-[#111a33] border border-white/[0.18]">

          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.12] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#3b82f6]/20 border border-[#3b82f6]/40 text-[#3b82f6]">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wide">
                  INTERACTIVE SCORING ENGINE
                </h3>
                <p className="text-xs text-[#cbd5e1]">Real-time parameter simulation</p>
              </div>
            </div>

            <button
              onClick={resetScores}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182447] hover:bg-[#202e5a] border border-white/[0.14] text-xs font-mono text-[#cbd5e1] hover:text-white transition-colors shadow-sm"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Grid Layout: Sliders Left (7 Cols), Live Score Card Right (5 Cols) */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">

            {/* Sliders Column */}
            <div className="lg:col-span-7 space-y-4">

              {/* Slider 1: Education & Career Growth */}
              <div className="space-y-2 bg-[#182447] p-4 rounded-xl border border-white/[0.12] hover:border-[#3b82f6]/50 transition-colors shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    Education & Career Growth
                  </span>
                  <span className="text-xs font-mono font-bold text-[#60a5fa] bg-[#3b82f6]/20 px-2 py-0.5 rounded border border-[#3b82f6]/35">
                    {scores.career} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={scores.career}
                  onChange={(e) => handleSlider("career", parseInt(e.target.value))}
                  className="w-full cursor-pointer accent-[#3b82f6] h-1.5 bg-[#0a0f1d] rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#cbd5e1]">
                  <span>Limited opportunities ◀</span>
                  <span>▶ High career trajectory</span>
                </div>
              </div>

              {/* Slider 2: Financial Well-Being */}
              <div className="space-y-2 bg-[#182447] p-4 rounded-xl border border-white/[0.12] hover:border-[#10b981]/50 transition-colors shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    Financial Well-Being
                  </span>
                  <span className="text-xs font-mono font-bold text-[#34d399] bg-[#10b981]/20 px-2 py-0.5 rounded border border-[#10b981]/35">
                    {scores.finance} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={scores.finance}
                  onChange={(e) => handleSlider("finance", parseInt(e.target.value))}
                  className="w-full cursor-pointer accent-[#10b981] h-1.5 bg-[#0a0f1d] rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#cbd5e1]">
                  <span>Financial stress ◀</span>
                  <span>▶ Financial independence</span>
                </div>
              </div>

              {/* Slider 3: Skills & Employability */}
              <div className="space-y-2 bg-[#182447] p-4 rounded-xl border border-white/[0.12] hover:border-[#06b6d4]/50 transition-colors shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    Skills & Employability
                  </span>
                  <span className="text-xs font-mono font-bold text-[#22d3ee] bg-[#06b6d4]/20 px-2 py-0.5 rounded border border-[#06b6d4]/35">
                    {scores.skills} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={scores.skills}
                  onChange={(e) => handleSlider("skills", parseInt(e.target.value))}
                  className="w-full cursor-pointer accent-[#06b6d4] h-1.5 bg-[#0a0f1d] rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#cbd5e1]">
                  <span>Basic skills ◀</span>
                  <span>▶ Industry-ready expertise</span>
                </div>
              </div>

              {/* Slider 4: Health & Wellness */}
              <div className="space-y-2 bg-[#182447] p-4 rounded-xl border border-white/[0.12] hover:border-[#f59e0b]/50 transition-colors shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    Health & Wellness
                  </span>
                  <span className="text-xs font-mono font-bold text-[#fbbf24] bg-[#f59e0b]/20 px-2 py-0.5 rounded border border-[#f59e0b]/35">
                    {scores.health} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={scores.health}
                  onChange={(e) => handleSlider("health", parseInt(e.target.value))}
                  className="w-full cursor-pointer accent-[#f59e0b] h-1.5 bg-[#0a0f1d] rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#cbd5e1]">
                  <span>Low stamina ◀</span>
                  <span>▶ Peak wellness</span>
                </div>
              </div>

              {/* Slider 5: Behavioral Intelligence */}
              <div className="space-y-2 bg-[#182447] p-4 rounded-xl border border-white/[0.12] hover:border-purple-400/50 transition-colors shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    Behavioral Intelligence
                  </span>
                  <span className="text-xs font-mono font-bold text-[#a78bfa] bg-purple-400/20 px-2 py-0.5 rounded border border-purple-400/35">
                    {scores.behavior} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={scores.behavior}
                  onChange={(e) => handleSlider("behavior", parseInt(e.target.value))}
                  className="w-full cursor-pointer accent-purple-400 h-1.5 bg-[#0a0f1d] rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#cbd5e1]">
                  <span>Developing habits ◀</span>
                  <span>▶ High decision intelligence</span>
                </div>
              </div>

            </div>

            {/* Streamlined Live Score Card Right */}
            <div className="lg:col-span-5 bg-[#182447] p-6 sm:p-7 rounded-2xl border border-[#3b82f6]/50 space-y-5 shadow-2xl shadow-[#3b82f6]/20">
              
              {/* Header: Score + Stage Badge */}
              <div className="flex items-center justify-between border-b border-white/[0.12] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#cbd5e1] uppercase tracking-wider block font-bold">
                    HUMAN VALUE SCORE
                  </span>
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-5xl font-black text-white tracking-tight">
                      {totalScore}
                    </span>
                    <span className="text-sm font-semibold text-[#cbd5e1]">/100</span>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-amber-400 text-sm tracking-widest font-mono font-bold">
                    {growthStage.stars}
                  </div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${growthStage.bg}`}>
                    {growthStage.stage} STAGE
                  </span>
                </div>
              </div>

              {/* Labeled Radar Chart */}
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 200">
                  <defs>
                    <linearGradient id="liveRadarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.45" />
                    </linearGradient>
                  </defs>

                  {/* Concentric Pentagon Background Rings */}
                  {[0.4, 0.7, 1].map((scale, i) => (
                    <polygon
                      key={i}
                      points={`
                        ${100 + scale * 0},${100 - scale * 55}
                        ${100 + scale * 52.3},${100 - scale * 17.0}
                        ${100 + scale * 32.3},${100 + scale * 44.5}
                        ${100 - scale * 32.3},${100 + scale * 44.5}
                        ${100 - scale * 52.3},${100 - scale * 17.0}
                      `}
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="1"
                      fill="transparent"
                    />
                  ))}

                  {/* Spoke lines */}
                  <line x1="100" y1="100" x2="100" y2="45" stroke="rgba(255,255,255,0.08)" />
                  <line x1="100" y1="100" x2="152.3" y2="83" stroke="rgba(255,255,255,0.08)" />
                  <line x1="100" y1="100" x2="132.3" y2="144.5" stroke="rgba(255,255,255,0.08)" />
                  <line x1="100" y1="100" x2="67.7" y2="144.5" stroke="rgba(255,255,255,0.08)" />
                  <line x1="100" y1="100" x2="47.7" y2="83" stroke="rgba(255,255,255,0.08)" />

                  {/* Dynamic Radar Polygon */}
                  <polygon
                    points={radarPolygonPoints}
                    fill="url(#liveRadarGrad)"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />

                  {/* Dimension Vertex Labels */}
                  <text x="100" y="36" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold">Skills</text>
                  <text x="165" y="86" textAnchor="start" fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold">Finance</text>
                  <text x="138" y="160" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold">Behavior</text>
                  <text x="62" y="160" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold">Career</text>
                  <text x="35" y="86" textAnchor="end" fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold">Health</text>
                </svg>
              </div>

              {/* 2 Clean Dimension Insight Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-[#05070f] border border-[#10b981]/25 flex flex-col justify-between">
                  <span className="text-[10px] text-[#64748b] font-bold uppercase">Top Strength</span>
                  <span className="text-[#10b981] font-bold text-xs truncate">{strongest.name} ({strongest.val})</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#05070f] border border-[#f59e0b]/25 flex flex-col justify-between">
                  <span className="text-[10px] text-[#64748b] font-bold uppercase">Growth Focus</span>
                  <span className="text-[#f59e0b] font-bold text-xs truncate">{weakest.name} ({weakest.val})</span>
                </div>
              </div>

              {/* Potential Growth Ribbon */}
              <div className="p-3 rounded-xl bg-[#05070f] border border-white/[0.08] flex items-center justify-between font-mono text-xs">
                <span className="text-[#94a3b8] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Projected Potential:</span>
                </span>
                <span className="text-[#10b981] font-bold">
                  +{Math.max(5, 100 - totalScore > 15 ? 7 : 4)} points (6 Mo)
                </span>
              </div>

              {/* Primary Assessment CTA */}
              <a
                href="#wizard"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white bg-[#3b82f6] hover:bg-[#2563eb] active:scale-[0.98] transition-all shadow-lg shadow-[#3b82f6]/20 border border-[#3b82f6]/40"
              >
                <span>Lock In Your Score via Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </a>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ScoreVisualizer;

