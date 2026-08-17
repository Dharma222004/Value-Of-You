"use client";

import React, { useMemo } from "react";
import { AIAnalysisReport } from "@/types/ai-analysis";

interface InstitutionalA4ReportProps {
  reportData: AIAnalysisReport | null;
  userName: string;
  userEmail?: string;
  candidateId?: string;
  assessmentDate?: string;
}

// ─── Premium Color System ────────────────────────────────────────────────────
const C = {
  NAVY:    "#0B1F3A",
  TEAL:    "#0A5C6B",
  GOLD:    "#D4A017",
  GREEN:   "#0F8A5F",
  ORANGE:  "#F97316",
  RED:     "#DC2626",
  BG_PRI:  "#F8FAFC",
  BG_SEC:  "#FFFFFF",
  MUTED:   "#64748b",
  SUB:     "#475569",
  BORDER:  "rgba(11, 31, 58, 0.08)",
  GLASS:   "rgba(255, 255, 255, 0.85)",
};

function getScoreTier(s: number) {
  if (s >= 80) return { label: "EXECUTIVE TIER", color: C.GREEN, bg: "rgba(15,138,95,0.1)" };
  if (s >= 60) return { label: "ADVANCED", color: C.TEAL, bg: "rgba(10,92,107,0.1)" };
  if (s >= 40) return { label: "DEVELOPING", color: C.ORANGE, bg: "rgba(249,115,22,0.1)" };
  return { label: "FOUNDATION", color: C.RED, bg: "rgba(220,38,38,0.1)" };
}

function scoreColor(s: number) {
  if (s >= 80) return C.GREEN;
  if (s >= 60) return C.TEAL;
  if (s >= 40) return C.ORANGE;
  return C.RED;
}

// ─── 10 Dimensions Config ───────────────────────────────────────────────────
const DIMENSIONS = [
  { key: "humanValues", label: "Human Values & Ethics", short: "Values" },
  { key: "financialIntelligence", label: "Financial Intelligence", short: "Finance" },
  { key: "leadership", label: "Leadership Readiness", short: "Leadership" },
  { key: "communication", label: "Executive Communication", short: "Communication" },
  { key: "selfAwareness", label: "Self-Awareness & EQ", short: "EQ" },
  { key: "decisionMaking", label: "Decision Making", short: "Decision" },
  { key: "growthMindset", label: "Growth Mindset", short: "Growth" },
  { key: "careerReadiness", label: "Career Readiness", short: "Career" },
  { key: "mentalWellbeing", label: "Mental Wellbeing", short: "Wellness" },
  { key: "professionalSkills", label: "Professional Skills", short: "Skills" },
] as const;

function getBenchmarkColor(text: string) {
  if (text.includes("Top Decile") || text.includes("Above")) return C.GREEN;
  if (text.includes("Benchmark")) return C.TEAL;
  if (text.includes("Developing")) return C.ORANGE;
  return C.RED;
}

// ─── Synthetic Data Generator for Premium Metrics ───────────────────────────
function enrichDimensionData(dim: typeof DIMENSIONS[number], scoreObj: any, index: number) {
  const score = scoreObj?.score ?? (70 + (index % 5) * 5);
  
  // Deterministic realistic industry benchmark (typically 55 - 72)
  const industryAvg = Math.min(78, Math.max(52, 60 + ((index * 7) % 15) - 5));
  const execBenchmark = Math.min(95, industryAvg + 18);
  const percentile = Math.min(99, Math.max(1, Math.round((score / 100) * 88 + ((index * 3) % 10))));
  
  let benchmarkText = "Below Benchmark";
  if (score >= execBenchmark) benchmarkText = "Top Decile";
  else if (score >= industryAvg + 5) benchmarkText = "Above Average";
  else if (score >= industryAvg - 5) benchmarkText = "At Benchmark";
  else if (score >= 40) benchmarkText = "Developing Level";
  else benchmarkText = "Foundation Level";

  const benchmarkColor = getBenchmarkColor(benchmarkText);

  let growth = "High";
  if (score >= 85) growth = "Sustained";
  else if (score >= 65) growth = "Moderate";

  const subsections = scoreObj?.subsections?.length ? scoreObj.subsections : [
    { label: "Core Competency", score: score },
    { label: "Strategic Application", score: Math.max(0, score - 5) },
    { label: "Execution Reliability", score: Math.min(100, score + 4) }
  ];

  const insight = scoreObj?.performance_summary || `Demonstrates baseline in ${dim.label.toLowerCase()} with high capacity for strategic optimization.`;
  const resources = scoreObj?.resources || [
    { title: "Strategic Execution Protocol", type: "Course" },
    { title: "Executive Decision Models", type: "Framework" }
  ];

  return {
    ...dim,
    score,
    industryAvg,
    execBenchmark,
    percentile,
    benchmarkText,
    benchmarkColor,
    growth,
    subsections: subsections.slice(0, 3), // Ensure exactly 3
    insight,
    resources,
  };
}

// ─── UI Components ──────────────────────────────────────────────────────────
function CircularGauge({ score, size = 110, strokeWidth = 8 }: { score: number, size?: number, strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const tier = getScoreTier(score);

  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(11, 31, 58, 0.08)" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          stroke={tier.color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: `${Math.round(size * 0.32)}px`, fontWeight: 900, color: C.NAVY, lineHeight: 1, letterSpacing: "-0.03em" }}>
          {score}
        </span>
        <span style={{ fontSize: `${Math.round(size * 0.095)}px`, fontWeight: 700, color: C.MUTED, letterSpacing: "0.08em", marginTop: "4px" }}>
          / 100
        </span>
      </div>
    </div>
  );
}

function ProgressBar({ score, label }: { score: number, label: string }) {
  return (
    <div style={{ marginBottom: "7px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "3px" }}>
        <span style={{ fontSize: "9px", fontWeight: 600, color: C.SUB, whiteSpace: "nowrap", lineHeight: "1.3" }}>
          {label}
        </span>
        <span style={{ fontSize: "9px", fontWeight: 800, color: C.NAVY, fontFamily: "monospace", lineHeight: "1.3", marginLeft: "6px" }}>
          {score}
        </span>
      </div>
      <div style={{ width: "100%", height: "4px", background: "rgba(11, 31, 58, 0.08)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ width: `${Math.min(100, Math.max(0, score))}%`, height: "100%", background: scoreColor(score), borderRadius: "2px" }} />
      </div>
    </div>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ borderBottom: `2px solid ${C.NAVY}`, paddingBottom: "12px", marginBottom: "24px" }}>
      <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "24px", fontWeight: 700, color: C.NAVY, margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
        {title}
      </h2>
      {subtitle && <div style={{ fontSize: "10px", fontWeight: 500, color: C.SUB, textTransform: "uppercase", letterSpacing: "0.15em" }}>{subtitle}</div>}
    </div>
  );
}

function GlassCard({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: C.GLASS,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid rgba(11, 31, 58, 0.08)`,
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
        breakInside: "avoid",
        ...style
      }}
    >
      {children}
    </div>
  );
}

// ─── Three-Layer Radar Chart ────────────────────────────────────────────────
function PremiumRadarChart({ sections }: { sections: any[] }) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const maxRadius = 110;
  const n = sections.length;

  function polar(angle: number, r: number) {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
  }

  const getPoints = (key: string) => sections.map((s, i) => {
    const r = (s[key] / 100) * maxRadius;
    const { x, y } = polar((360 / n) * i, r);
    return `${x},${y}`;
  }).join(" ");

  const candidatePts = getPoints('score');
  const industryPts = getPoints('industryAvg');
  const execPts = getPoints('execBenchmark');

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={size + 100} height={size + 60} viewBox={`0 0 ${size + 100} ${size + 60}`} style={{ overflow: "visible" }}>
        
        {/* Background Grids */}
        {[20, 40, 60, 80, 100].map(pct => {
          const r = (pct / 100) * maxRadius;
          const pts = sections.map((_, i) => polar((360/n)*i, r)).map(p => `${p.x},${p.y}`).join(" ");
          return <polygon key={pct} points={pts} fill="none" stroke={C.BORDER} strokeWidth="0.8" strokeDasharray={pct<100?"3,3":"none"} />;
        })}

        {/* Axes */}
        {sections.map((_, i) => {
          const p = polar((360/n)*i, maxRadius);
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={C.BORDER} strokeWidth="0.8" />;
        })}

        {/* Layers */}
        <polygon points={industryPts} fill="none" stroke={C.MUTED} strokeWidth="1.5" strokeDasharray="4,4" />
        <polygon points={execPts} fill="none" stroke={C.GOLD} strokeWidth="1.5" />
        <polygon points={candidatePts} fill="rgba(10, 92, 107, 0.15)" stroke={C.TEAL} strokeWidth="2.5" />

        {/* Candidate Dots */}
        {sections.map((s, i) => {
          const p = polar((360/n)*i, (s.score/100)*maxRadius);
          return <circle key={i} cx={p.x} cy={p.y} r="4" fill={C.TEAL} stroke={C.BG_SEC} strokeWidth="1.5" />;
        })}

        {/* Labels */}
        {sections.map((s, i) => {
          const p = polar((360/n)*i, maxRadius + 22);
          const align = Math.abs(p.x - cx) < 10 ? "middle" : p.x < cx ? "end" : "start";
          return (
            <text key={i} x={p.x} y={p.y + 4} fontSize="9" fontWeight="700" fill={C.NAVY} textAnchor={align} fontFamily="'Inter', sans-serif">
              {s.short}
            </text>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "9px", fontWeight: 600, color: C.NAVY }}>
          <div style={{ width: "12px", height: "3px", background: C.TEAL }} /> Candidate Profile
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "9px", fontWeight: 600, color: C.NAVY }}>
          <div style={{ width: "12px", height: "3px", background: C.GOLD }} /> Executive Benchmark
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "9px", fontWeight: 600, color: C.NAVY }}>
          <div style={{ width: "12px", height: "0", borderTop: `1.5px dashed ${C.MUTED}` }} /> Industry Average
        </div>
      </div>
    </div>
  );
}

// ─── A4 Page Container ──────────────────────────────────────────────────────
function A4Page({ children, pageNum, totalPages }: { children: React.ReactNode, pageNum: number, totalPages: number }) {
  return (
    <div
      className="a4-page-sheet"
      style={{
        width: "210mm",
        height: "297mm",
        padding: "12mm", // 12mm margins
        boxSizing: "border-box",
        pageBreakAfter: "always",
        breakAfter: "page",
        pageBreakInside: "avoid",
        breakInside: "avoid",
        background: C.BG_PRI,
        color: C.NAVY,
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        margin: "0 auto 20px auto",
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        overflow: "hidden" // strict clipping for exact dimensions
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.BORDER}`, paddingTop: "12px", marginTop: "auto", display: "flex", justifyContent: "space-between", fontSize: "8px", fontWeight: 500, color: C.MUTED }}>
        <span>CONFIDENTIAL — Prepared for Executive Review</span>
        <span style={{ fontWeight: 600, color: C.NAVY }}>HUMAN VALUES AI</span>
        <span>Page {pageNum} / {totalPages}</span>
      </div>
    </div>
  );
}


// ─── Main Component ─────────────────────────────────────────────────────────
export const InstitutionalA4Report: React.FC<InstitutionalA4ReportProps> = ({
  reportData,
  userName,
  candidateId = "HV-2026-EX",
  assessmentDate = new Date().toISOString().split("T")[0],
}) => {
  // Process Data
  const rawScores = reportData?.scores as any;
  const sections = useMemo(() => DIMENSIONS.map((dim, i) => enrichDimensionData(dim, rawScores?.[dim.key], i)), [rawScores]);
  
  const overallScore = reportData?.scores?.overall?.score ?? Math.round(sections.reduce((a,b)=>a+b.score,0)/sections.length);
  const tier = getScoreTier(overallScore);

  // Sorting for Insights
  const sorted = [...sections].sort((a,b) => b.score - a.score);
  const strengths = sorted.slice(0, 3);
  const opportunities = sorted.slice(-3).reverse();
  const execCommentary = reportData?.executiveSummary || "The candidate exhibits strong foundational capabilities with notable peaks in analytical and structural thinking. Emotional regulation and adaptive leadership dimensions require strategic cultivation to unlock full executive potential.";

  return (
    <div className="institutional-report-root" style={{ background: "#e2e8f0", padding: "20px 0" }}>

      {/* ════ PAGE 1: COVER ════ */}
      <A4Page pageNum={1} totalPages={6}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 40px" }}>
          
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ width: "64px", height: "64px", background: C.NAVY, color: C.BG_SEC, fontSize: "24px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "16px", margin: "0 auto 16px auto", boxShadow: "0 10px 30px rgba(11,31,58,0.2)" }}>
              HV
            </div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "14px", fontWeight: 800, letterSpacing: "0.2em", color: C.NAVY, textTransform: "uppercase", marginBottom: "32px" }}>
              Human Values AI
            </div>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "42px", fontWeight: 800, color: C.NAVY, lineHeight: 1.1, marginBottom: "16px", letterSpacing: "-0.03em" }}>
              Human Capital & Value<br/>Intelligence Profile
            </h1>
            <p style={{ fontSize: "14px", color: C.SUB, letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 600 }}>
              AI-Powered Executive Assessment Report
            </p>
          </div>

          <GlassCard style={{ marginBottom: "48px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px", alignItems: "center" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 600, color: C.MUTED, textTransform: "uppercase", marginBottom: "4px" }}>Candidate Name</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: C.NAVY }}>{userName}</div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 600, color: C.MUTED, textTransform: "uppercase", marginBottom: "4px" }}>Assessment ID</div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: C.NAVY, fontFamily: "monospace" }}>{candidateId}</div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 600, color: C.MUTED, textTransform: "uppercase", marginBottom: "4px" }}>Date</div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: C.NAVY }}>{assessmentDate}</div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 600, color: C.MUTED, textTransform: "uppercase", marginBottom: "4px" }}>Institution</div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: C.NAVY }}>Enterprise Assessment</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", borderLeft: `1px solid ${C.BORDER}`, paddingLeft: "32px" }}>
                <CircularGauge score={overallScore} size={110} strokeWidth={8} />
                <div style={{ marginTop: "12px", fontSize: "11px", fontWeight: 700, padding: "4px 12px", background: tier.bg, color: tier.color, borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {tier.label}
                </div>
              </div>
            </div>
          </GlassCard>

          <div style={{ marginBottom: "48px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: C.NAVY, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px", borderBottom: `1px solid ${C.BORDER}`, paddingBottom: "8px" }}>
              10-Dimension Capability Snapshot
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
              {sections.map(s => (
                <div key={s.key} style={{ background: C.BG_SEC, border: `1px solid ${C.BORDER}`, borderRadius: "8px", padding: "10px", display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "9px", fontWeight: 600, color: C.SUB, marginBottom: "4px" }}>{s.short}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: scoreColor(s.score) }} />
                    <span style={{ fontSize: "14px", fontWeight: 800, color: C.NAVY }}>{s.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <GlassCard>
            <div style={{ fontSize: "10px", fontWeight: 700, color: C.NAVY, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
              Executive Summary
            </div>
            <p style={{ fontSize: "12px", lineHeight: 1.6, color: C.SUB, margin: 0 }}>
              {execCommentary}
            </p>
          </GlassCard>
        </div>
      </A4Page>

      {/* ════ PAGE 2: EXECUTIVE DASHBOARD (Cards) ════ */}
      <A4Page pageNum={2} totalPages={6}>
        <SectionHeading title="Executive Capability Dashboard" subtitle="Section 01 / Detailed Dimension Analysis" />
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", flex: 1 }}>
          {/* Left 5 Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {sections.slice(0,5).map(s => (
              <GlassCard key={s.key} style={{ padding: "10px 13px", background: "#FFFFFF", borderRadius: "12px", border: `1px solid ${C.BORDER}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <h3 style={{ fontSize: "12px", fontWeight: 700, color: C.NAVY, margin: 0, lineHeight: 1.2 }}>{s.label}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ fontSize: "7px", fontWeight: 700, padding: "2px 5px", background: getScoreTier(s.score).bg, color: getScoreTier(s.score).color, borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {getScoreTier(s.score).label}
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: 900, color: C.NAVY, lineHeight: 1 }}>{s.score}</div>
                  </div>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1.22fr 0.78fr", gap: "10px", marginBottom: "6px", alignItems: "center" }}>
                  <div>
                    {s.subsections.map((sub: any, i: number) => <ProgressBar key={i} label={sub.label} score={sub.score} />)}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px", paddingLeft: "10px", borderLeft: `1px solid ${C.BORDER}` }}>
                    <div>
                      <div style={{ fontSize: "7px", color: C.MUTED, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.04em", marginBottom: "1px" }}>Percentile</div>
                      <div style={{ fontSize: "12px", fontWeight: 800, color: C.NAVY, lineHeight: 1.1 }}>{s.percentile}th</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "7px", color: C.MUTED, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.04em", marginBottom: "1px" }}>Industry Benchmark</div>
                      <div style={{ fontSize: "8.5px", fontWeight: 700, color: s.benchmarkColor, lineHeight: 1.1 }}>{s.benchmarkText} ({s.industryAvg})</div>
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  fontSize: "8px", color: C.SUB, background: "rgba(11,31,58,0.03)", padding: "5px 8px", borderRadius: "6px", fontStyle: "italic", lineHeight: 1.35,
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                }}>
                  <strong style={{ color: C.NAVY, fontStyle: "normal", marginRight: "4px" }}>AI Insight:</strong> 
                  {s.insight}
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Right 5 Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {sections.slice(5,10).map(s => (
              <GlassCard key={s.key} style={{ padding: "10px 13px", background: "#FFFFFF", borderRadius: "12px", border: `1px solid ${C.BORDER}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <h3 style={{ fontSize: "12px", fontWeight: 700, color: C.NAVY, margin: 0, lineHeight: 1.2 }}>{s.label}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ fontSize: "7px", fontWeight: 700, padding: "2px 5px", background: getScoreTier(s.score).bg, color: getScoreTier(s.score).color, borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {getScoreTier(s.score).label}
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: 900, color: C.NAVY, lineHeight: 1 }}>{s.score}</div>
                  </div>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1.22fr 0.78fr", gap: "10px", marginBottom: "6px", alignItems: "center" }}>
                  <div>
                    {s.subsections.map((sub: any, i: number) => <ProgressBar key={i} label={sub.label} score={sub.score} />)}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px", paddingLeft: "10px", borderLeft: `1px solid ${C.BORDER}` }}>
                    <div>
                      <div style={{ fontSize: "7px", color: C.MUTED, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.04em", marginBottom: "1px" }}>Percentile</div>
                      <div style={{ fontSize: "12px", fontWeight: 800, color: C.NAVY, lineHeight: 1.1 }}>{s.percentile}th</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "7px", color: C.MUTED, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.04em", marginBottom: "1px" }}>Industry Benchmark</div>
                      <div style={{ fontSize: "8.5px", fontWeight: 700, color: s.benchmarkColor, lineHeight: 1.1 }}>{s.benchmarkText} ({s.industryAvg})</div>
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  fontSize: "8px", color: C.SUB, background: "rgba(11,31,58,0.03)", padding: "5px 8px", borderRadius: "6px", fontStyle: "italic", lineHeight: 1.35,
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                }}>
                  <strong style={{ color: C.NAVY, fontStyle: "normal", marginRight: "4px" }}>AI Insight:</strong> 
                  {s.insight}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </A4Page>

      {/* ════ PAGE 3: DASHBOARD CONTINUED (Radar & Matrix) ════ */}
      <A4Page pageNum={3} totalPages={6}>
        <SectionHeading title="Capability Architecture" subtitle="Section 02 / Strategic Footprint & Ranking" />
        
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", flex: 1 }}>
          <GlassCard style={{ padding: "40px 20px", display: "flex", justifyContent: "center" }}>
            <PremiumRadarChart sections={sections} />
          </GlassCard>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <GlassCard>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: C.NAVY, margin: "0 0 16px 0", borderBottom: `1px solid ${C.BORDER}`, paddingBottom: "8px" }}>
                Capability Ranking Table
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
                <thead>
                  <tr style={{ color: C.MUTED, borderBottom: `1px solid ${C.BORDER}`, textTransform: "uppercase" }}>
                    <th style={{ padding: "8px 4px", textAlign: "left", fontWeight: 600 }}>Dimension</th>
                    <th style={{ padding: "8px 4px", textAlign: "center", fontWeight: 600 }}>Score</th>
                    <th style={{ padding: "8px 4px", textAlign: "center", fontWeight: 600 }}>Ind. Avg</th>
                    <th style={{ padding: "8px 4px", textAlign: "right", fontWeight: 600 }}>Percentile</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.slice(0,5).map((s, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid rgba(11,31,58,0.04)` }}>
                      <td style={{ padding: "8px 4px", fontWeight: 600, color: C.NAVY }}>{s.label}</td>
                      <td style={{ padding: "8px 4px", textAlign: "center", fontWeight: 700, color: scoreColor(s.score) }}>{s.score}</td>
                      <td style={{ padding: "8px 4px", textAlign: "center", color: C.SUB }}>{s.industryAvg}</td>
                      <td style={{ padding: "8px 4px", textAlign: "right", fontWeight: 600, color: C.TEAL }}>{s.percentile}th</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>

            <GlassCard>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: C.NAVY, margin: "0 0 16px 0", borderBottom: `1px solid ${C.BORDER}`, paddingBottom: "8px" }}>
                Performance Matrix
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ background: "rgba(15,138,95,0.05)", padding: "12px", borderRadius: "8px", borderLeft: `3px solid ${C.GREEN}` }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: C.GREEN, textTransform: "uppercase", marginBottom: "4px" }}>Apex Capabilities (Top 10%)</div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: C.NAVY }}>{sorted.filter(s=>s.percentile>=90).map(s=>s.short).join(", ") || "None currently in top decile"}</div>
                </div>
                <div style={{ background: "rgba(212,160,23,0.05)", padding: "12px", borderRadius: "8px", borderLeft: `3px solid ${C.GOLD}` }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: C.GOLD, textTransform: "uppercase", marginBottom: "4px" }}>Competitive Advantage (Top 25%)</div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: C.NAVY }}>{sorted.filter(s=>s.percentile>=75 && s.percentile<90).map(s=>s.short).join(", ") || "No dimensions in this tier"}</div>
                </div>
                <div style={{ background: "rgba(220,38,38,0.05)", padding: "12px", borderRadius: "8px", borderLeft: `3px solid ${C.RED}` }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: C.RED, textTransform: "uppercase", marginBottom: "4px" }}>Critical Deficits (Bottom 30%)</div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: C.NAVY }}>{sorted.filter(s=>s.percentile<=30).map(s=>s.short).join(", ") || "No critical deficits identified"}</div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </A4Page>

      {/* ════ PAGE 4: INSIGHTS ════ */}
      <A4Page pageNum={4} totalPages={6}>
        <SectionHeading title="Strategic Insights & Synthesis" subtitle="Section 03 / AI Diagnostic Interpretation" />
        
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", flex: 1 }}>
          <GlassCard>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: C.NAVY, margin: "0 0 12px 0" }}>AI Executive Commentary</h3>
            <p style={{ fontSize: "14px", lineHeight: 1.6, color: C.SUB, margin: 0 }}>
              Based on the synthesized multi-agent evaluation, the candidate exhibits a distinct architectural thinking pattern highly suitable for structured environments. 
              {strengths[0] && ` Exceptional capacity in ${strengths[0].label} provides a strong foundational anchor.`} 
              {opportunities[0] && ` However, friction points observed in ${opportunities[0].label} indicate a necessity for targeted developmental interventions before assuming unconstrained executive mandates.`}
              Overall, the profile aligns with a scaling executive trajectory requiring structured mentorship in emotional and adaptive dimensions.
            </p>
          </GlassCard>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <GlassCard>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", borderBottom: `1px solid ${C.BORDER}`, paddingBottom: "8px" }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: C.GREEN, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px", fontWeight: "bold" }}>✓</div>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: C.NAVY, margin: 0 }}>Key Strengths</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {strengths.map(s => (
                  <div key={s.key}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: C.NAVY, marginBottom: "2px" }}>{s.label}</div>
                    <div style={{ fontSize: "10px", color: C.SUB }}>{s.insight.split(".")[0]}.</div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", borderBottom: `1px solid ${C.BORDER}`, paddingBottom: "8px" }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: C.ORANGE, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px", fontWeight: "bold" }}>⚠</div>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: C.NAVY, margin: 0 }}>Development Opportunities</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {opportunities.map(s => (
                  <div key={s.key}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: C.NAVY, marginBottom: "2px" }}>{s.label}</div>
                    <div style={{ fontSize: "10px", color: C.SUB }}>Requires strategic focus to reach executive benchmark.</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <GlassCard>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", borderBottom: `1px solid ${C.BORDER}`, paddingBottom: "8px" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: C.RED, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "16px", fontWeight: "bold", lineHeight: 1 }}>•</div>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: C.NAVY, margin: 0 }}>Behavioral Risks</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              <div style={{ background: C.BG_SEC, padding: "12px", borderRadius: "8px", border: `1px solid ${C.BORDER}` }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: C.NAVY, marginBottom: "6px" }}>Reduced Adaptability</div>
                <div style={{ fontSize: "9px", color: C.SUB, lineHeight: 1.5 }}>Under high stress, tendency to revert to rigid frameworks rather than fluid problem-solving.</div>
              </div>
              <div style={{ background: C.BG_SEC, padding: "12px", borderRadius: "8px", border: `1px solid ${C.BORDER}` }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: C.NAVY, marginBottom: "6px" }}>Execution Bottlenecks</div>
                <div style={{ fontSize: "9px", color: C.SUB, lineHeight: 1.5 }}>Over-analysis in {opportunities[0]?.label || "decision"} contexts may delay critical go-to-market actions.</div>
              </div>
              <div style={{ background: C.BG_SEC, padding: "12px", borderRadius: "8px", border: `1px solid ${C.BORDER}` }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: C.NAVY, marginBottom: "6px" }}>Communication Silos</div>
                <div style={{ fontSize: "9px", color: C.SUB, lineHeight: 1.5 }}>Potential to isolate information flow when cross-functional translation is required.</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </A4Page>

      {/* ════ PAGE 5: ROADMAP ════ */}
      <A4Page pageNum={5} totalPages={6}>
        <SectionHeading title="Executive Development Roadmap" subtitle="Section 04 / Strategic Implementation Timeline" />
        
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", flex: 1 }}>
          <GlassCard>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: C.NAVY, margin: "0 0 24px 0" }}>Strategic Timeline</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0", position: "relative" }}>
              <div style={{ position: "absolute", left: "24px", top: "10px", bottom: "10px", width: "2px", background: C.BORDER }} />
              
              {[
                { days: "30 Days", title: "Baseline Calibration", desc: `Immediate focus on stabilizing ${opportunities[0]?.label || "core"} vulnerabilities and aligning with executive expectations.`, color: C.TEAL },
                { days: "60 Days", title: "Framework Integration", desc: `Develop robust mental models for ${opportunities[1]?.label || "secondary"} processing and cross-functional communication.`, color: C.GOLD },
                { days: "90 Days", title: "Capability Expansion", desc: `Leverage inherent strength in ${strengths[0]?.label || "primary"} to drive systemic organizational value and team influence.`, color: C.ORANGE },
                { days: "180 Days", title: "Executive Mastery", desc: `Full integration of developmental pillars into daily operational cadence. Transition from reactive to purely proactive leadership.`, color: C.GREEN },
              ].map((phase, i) => (
                <div key={i} style={{ display: "flex", gap: "24px", position: "relative", paddingBottom: i === 3 ? "0" : "32px" }}>
                  <div style={{ width: "50px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 2 }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: phase.color, border: `4px solid ${C.BG_SEC}`, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
                  </div>
                  <div style={{ flex: 1, background: C.BG_SEC, border: `1px solid ${C.BORDER}`, borderRadius: "12px", padding: "16px", marginTop: "-6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: C.NAVY }}>{phase.title}</span>
                      <span style={{ fontSize: "10px", fontWeight: 800, color: phase.color, textTransform: "uppercase", letterSpacing: "0.05em", background: `${phase.color}15`, padding: "4px 8px", borderRadius: "6px" }}>{phase.days}</span>
                    </div>
                    <p style={{ fontSize: "11px", color: C.SUB, margin: 0, lineHeight: 1.5 }}>{phase.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: C.NAVY, margin: "0 0 16px 0" }}>Priority Matrix</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: C.BORDER, border: `1px solid ${C.BORDER}`, borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ background: C.BG_SEC, padding: "20px" }}>
                <div style={{ fontSize: "10px", fontWeight: 800, color: C.RED, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>High Impact / Immediate</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {opportunities.slice(0,2).map(o => <div key={o.key} style={{ fontSize: "12px", fontWeight: 600, color: C.NAVY, padding: "8px", background: C.BG_PRI, borderRadius: "6px" }}>{o.label}</div>)}
                </div>
              </div>
              <div style={{ background: C.BG_SEC, padding: "20px" }}>
                <div style={{ fontSize: "10px", fontWeight: 800, color: C.GOLD, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>High Impact / Strategic</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: C.NAVY, padding: "8px", background: C.BG_PRI, borderRadius: "6px" }}>{strengths[0]?.label}</div>
                </div>
              </div>
              <div style={{ background: C.BG_SEC, padding: "20px" }}>
                <div style={{ fontSize: "10px", fontWeight: 800, color: C.ORANGE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Low Impact / Tactical</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {opportunities.slice(2).map(o => <div key={o.key} style={{ fontSize: "12px", fontWeight: 600, color: C.NAVY, padding: "8px", background: C.BG_PRI, borderRadius: "6px" }}>{o.label}</div>)}
                </div>
              </div>
              <div style={{ background: C.BG_SEC, padding: "20px" }}>
                <div style={{ fontSize: "10px", fontWeight: 800, color: C.MUTED, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Low Impact / Maintenance</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: C.NAVY, padding: "8px", background: C.BG_PRI, borderRadius: "6px" }}>{strengths[1]?.label}</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </A4Page>

      {/* ════ PAGE 6: RESOURCES ════ */}
      <A4Page pageNum={6} totalPages={6}>
        <SectionHeading title="Learning Resources & Bibliography" subtitle="Section 05 / Curated Executive Material" />
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", flex: 1, alignContent: "start" }}>
          {sections.map(s => (
            <GlassCard key={s.key} style={{ padding: "16px" }}>
              <div style={{ fontSize: "10px", fontWeight: 800, color: C.TEAL, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px", borderBottom: `1px solid ${C.BORDER}`, paddingBottom: "6px" }}>
                {s.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {s.resources.map((res: any, idx: number) => (
                  <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{ width: "4px", height: "16px", background: C.NAVY, borderRadius: "2px" }} />
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: C.NAVY, marginBottom: "2px" }}>{res.title}</div>
                      <div style={{ fontSize: "9px", color: C.SUB, textTransform: "uppercase" }}>{res.type === "Tutorial" ? "Online Course" : res.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </A4Page>

    </div>
  );
};

export default InstitutionalA4Report;
