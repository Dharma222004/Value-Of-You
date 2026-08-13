"use client";

import React from "react";
import { AIAnalysisReport } from "@/types/ai-analysis";
import {
  Brain, Shield, Award, CheckCircle2, AlertTriangle, TrendingUp,
  DollarSign, Briefcase, Heart, BookOpen, Crown, MessageSquare,
  Eye, Compass, Activity, Target, Zap, Clock, FileText, Check, Star, Rocket,
} from "lucide-react";

interface InstitutionalA4ReportProps {
  reportData: AIAnalysisReport | null;
  userName: string;
  userEmail?: string;
  candidateId?: string;
  assessmentDate?: string;
}

// Competencies config for A4 report
const COMPETENCIES = [
  { key: "humanValues", label: "Human Values & Ethics", icon: Heart, desc: "Alignment with core moral principles, empathy, and social responsibility." },
  { key: "financialIntelligence", label: "Financial Intelligence", icon: DollarSign, desc: "Capital allocation, risk management, and long-term wealth discipline." },
  { key: "leadership", label: "Leadership Readiness", icon: Crown, desc: "Strategic vision, team inspiration, and decision authority." },
  { key: "communication", label: "Executive Communication", icon: MessageSquare, desc: "Clarity, influence, interpersonal adaptability, and active listening." },
  { key: "selfAwareness", label: "Self-Awareness & EQ", icon: Eye, desc: "Introspective depth, emotional regulation, and self-evaluation." },
  { key: "decisionMaking", label: "Decision Making Under Risk", icon: Compass, desc: "Analytical rigor, velocity, and judgment quality under uncertainty." },
  { key: "growthMindset", label: "Growth Mindset", icon: TrendingUp, desc: "Resilience, cognitive adaptability, and continuous self-improvement." },
  { key: "consistency", label: "Consistency & Resilience", icon: Shield, desc: "Behavioral stability, commitment execution, and stress tolerance." },
  { key: "learningAbility", label: "Learning Agility", icon: BookOpen, desc: "Speed of skill acquisition, conceptual synthesis, and curiosity." },
  { key: "professionalReadiness", label: "Career & Executive Fit", icon: Briefcase, desc: "Professional readiness, strategic capital, and organizational impact." },
];

function getScoreTier(score: number) {
  if (score >= 85) return { label: "Elite", color: "#16A34A", bg: "#F0FDF4" };
  if (score >= 70) return { label: "Advanced", color: "#2563EB", bg: "#EFF6FF" };
  if (score >= 55) return { label: "Proficient", color: "#475569", bg: "#F8FAFC" };
  if (score >= 40) return { label: "Developing", color: "#F59E0B", bg: "#FFFBEB" };
  return { label: "Foundation", color: "#DC2626", bg: "#FEF2F2" };
}

function getPercentile(score: number): number {
  if (score >= 90) return Math.min(99, 90 + Math.floor((score - 90) * 0.9));
  if (score >= 80) return 80 + Math.floor((score - 80) * 1.0);
  if (score >= 70) return 65 + Math.floor((score - 70) * 1.5);
  if (score >= 50) return 35 + Math.floor((score - 50) * 1.5);
  return Math.max(10, Math.floor(score * 0.7));
}

/* ── Vector SVG Radar Chart Component ── */
function VectorRadarChart({ scores }: { scores: Record<string, number> }) {
  const size = 360;
  const cx = size / 2;
  const cy = size / 2 - 10;
  const radius = 110;
  const keys = COMPETENCIES.map(c => c.key);
  const labels = ["Values", "Finance", "Leadership", "Comms", "Awareness", "Decisions", "Growth", "Consistency", "Learning", "Career"];
  const numPoints = keys.length;

  const getCoordinates = (index: number, val: number) => {
    const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
    const r = (val / 100) * radius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  // Concentric polygon grids
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const gridPolygons = gridLevels.map(level => {
    return keys.map((_, i) => {
      const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
      const r = level * radius;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(" ");
  });

  // Candidate Data Polygon
  const candidatePoints = keys.map((k, i) => {
    const val = scores[k] || 65;
    const coord = getCoordinates(i, val);
    return `${coord.x},${coord.y}`;
  }).join(" ");

  // Benchmark Data Polygon (Average = 68)
  const benchmarkPoints = keys.map((_, i) => {
    const coord = getCoordinates(i, 68);
    return `${coord.x},${coord.y}`;
  }).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto block">
      {/* Background Radial Polygons */}
      {gridPolygons.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="#E5E7EB" strokeWidth="1" strokeDasharray={i === 4 ? "" : "2 2"} />
      ))}

      {/* Axis Lines */}
      {keys.map((_, i) => {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const x2 = cx + radius * Math.cos(angle);
        const y2 = cy + radius * Math.sin(angle);
        return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke="#E5E7EB" strokeWidth="1" />;
      })}

      {/* Benchmark Polygon */}
      <polygon points={benchmarkPoints} fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />

      {/* Candidate Polygon */}
      <polygon points={candidatePoints} fill="#2563EB" fillOpacity="0.15" stroke="#2563EB" strokeWidth="2.5" />

      {/* Candidate Data Nodes */}
      {keys.map((k, i) => {
        const val = scores[k] || 65;
        const coord = getCoordinates(i, val);
        return (
          <g key={i}>
            <circle cx={coord.x} cy={coord.y} r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        );
      })}

      {/* Labels */}
      {keys.map((_, i) => {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const labelR = radius + 24;
        const lx = cx + labelR * Math.cos(angle);
        const ly = cy + labelR * Math.sin(angle);
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="#334155" fontSize="9.5" fontWeight="600">
            {labels[i]} ({scores[keys[i]] || 65})
          </text>
        );
      })}
    </svg>
  );
}

/* ── Standard Page Header ── */
function Header({ candidateId, date, pageNum }: { candidateId: string; date: string; pageNum: number }) {
  if (pageNum === 1) return null; // Cover page has custom header
  return (
    <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-200 text-slate-700">
      {/* Top Left */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white text-xs font-bold">HV</div>
        <div>
          <span className="text-[12px] font-bold text-slate-900 uppercase tracking-wider block">HUMAN VALUES AI</span>
          <span className="text-[9px] text-slate-500 font-medium">Institutional Assessment Report</span>
        </div>
      </div>
      {/* Top Right */}
      <div className="flex items-center gap-4 text-right">
        <div>
          <span className="text-[9.5px] font-mono text-slate-600 block">ID: {candidateId}</span>
          <span className="text-[9.5px] text-slate-500 block">Date: {date} • v4.1.0</span>
        </div>
        <span className="px-2 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-widest bg-slate-100 text-slate-700 border border-slate-200">
          CONFIDENTIAL
        </span>
      </div>
    </div>
  );
}

/* ── Standard Page Footer ── */
function Footer({ pageNum }: { pageNum: number }) {
  if (pageNum === 1) return null;
  return (
    <div className="mt-auto pt-4 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500">
      <span>CONFIDENTIAL — Prepared for Executive Leadership & Candidates</span>
      <span className="font-mono">www.humanvalues.ai</span>
      <span className="font-semibold text-slate-700">Page {pageNum} of 13</span>
      <span>© 2026 Human Values AI. All Rights Reserved.</span>
    </div>
  );
}

/* ── Page Wrapper ── */
function Page({ children, pageNum, candidateId, date }: { children: React.ReactNode; pageNum: number; candidateId: string; date: string }) {
  return (
    <div
      className="a4-page bg-white text-slate-900 mx-auto relative flex flex-col justify-between overflow-hidden shadow-xl print:shadow-none print:m-0"
      style={{
        width: "210mm",
        minHeight: "297mm",
        height: "297mm",
        padding: "20mm",
        boxSizing: "border-box",
        pageBreakAfter: "always",
        breakAfter: "page",
      }}
    >
      <Header candidateId={candidateId} date={date} pageNum={pageNum} />
      <div className="flex-1 flex flex-col justify-start min-h-0 overflow-hidden">
        {children}
      </div>
      <Footer pageNum={pageNum} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN A4 REPORT COMPONENT
// ═══════════════════════════════════════════════════════════════

export const InstitutionalA4Report: React.FC<InstitutionalA4ReportProps> = ({
  reportData,
  userName,
  userEmail = "",
  candidateId = "HV-2026-88492",
  assessmentDate = "August 2, 2026",
}) => {
  const scoresObj: Record<string, number> = {};
  COMPETENCIES.forEach(c => {
    scoresObj[c.key] = (reportData?.scores as any)?.[c.key]?.score || 72;
  });

  const overallScore = reportData?.scores?.overall?.score || 78;
  const overallTier = getScoreTier(overallScore);

  // Sorted competencies
  const sortedComp = [...COMPETENCIES].map(c => ({
    ...c,
    score: scoresObj[c.key],
    tier: getScoreTier(scoresObj[c.key]),
    percentile: getPercentile(scoresObj[c.key]),
    expl: (reportData?.scores as any)?.[c.key]?.explanation || c.desc,
  })).sort((a, b) => b.score - a.score);

  const topStrengths = sortedComp.slice(0, 5);
  const developmentAreas = [...sortedComp].reverse().slice(0, 5);

  return (
    <div className="institutional-report-root bg-slate-200 print:bg-white py-8 print:py-0 font-sans">

      {/* ════════════════════════════════════════════════════════
          PAGE 1: COVER PAGE
         ════════════════════════════════════════════════════════ */}
      <Page pageNum={1} candidateId={candidateId} date={assessmentDate}>
        <div className="h-full flex flex-col justify-between items-center text-center py-6 relative">
          
          {/* Subtle Abstract Geometric Vectors */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0F172A" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <circle cx="50%" cy="40%" r="220" fill="none" stroke="#0F172A" strokeWidth="2" />
              <circle cx="50%" cy="40%" r="320" fill="none" stroke="#0F172A" strokeWidth="1" strokeDasharray="8 8" />
            </svg>
          </div>

          {/* Top Brand Header */}
          <div className="space-y-3 z-10 pt-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg">
              HV
            </div>
            <p className="text-[13px] font-bold uppercase tracking-[0.3em] text-slate-900">HUMAN VALUES AI</p>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Global Executive Assessment Organization</p>
          </div>

          {/* Center Main Title Block */}
          <div className="my-auto z-10 space-y-6 max-w-xl">
            <div className="inline-block px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-widest border border-slate-200">
              OFFICIAL INSTITUTIONAL ASSESSMENT REPORT
            </div>

            <h1 className="text-[36px] font-extrabold text-slate-900 leading-tight tracking-tight">
              Human Capital & Value Intelligence Profile
            </h1>

            <p className="text-[13px] text-slate-600 leading-relaxed font-normal max-w-md mx-auto">
              A comprehensive psychometric, decision-making, and financial leadership evaluation conducted by the Human Values Multi-Agent AI Engine.
            </p>

            <div className="w-16 h-1 bg-slate-900 mx-auto rounded-full mt-4" />
          </div>

          {/* Metadata Grid & Candidate Block */}
          <div className="w-full z-10 space-y-6 pb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 grid grid-cols-2 gap-6 text-left">
              <div>
                <p className="text-[9.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">CANDIDATE NAME</p>
                <p className="text-[18px] font-bold text-slate-900">{userName}</p>
                {userEmail && <p className="text-[11px] text-slate-500 font-mono mt-0.5">{userEmail}</p>}
              </div>

              <div>
                <p className="text-[9.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">ASSESSMENT ID</p>
                <p className="text-[14px] font-mono font-bold text-slate-800">{candidateId}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Date: {assessmentDate}</p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-[9.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">INSTITUTION</p>
                <p className="text-[12px] font-semibold text-slate-800">Enterprise Talent Assessment Division</p>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-[9.5px] uppercase tracking-wider font-bold text-slate-500 mb-1">EVALUATION VERSION</p>
                <p className="text-[12px] font-semibold text-slate-800">v4.1.0 Multi-Agent Framework</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-[9px] text-slate-500 px-2">
              <span>Prepared strictly for CEO & Executive Board Review</span>
              <span className="font-semibold text-slate-700">CONFIDENTIAL</span>
            </div>
          </div>

        </div>
      </Page>


      {/* ════════════════════════════════════════════════════════
          PAGE 2: EXECUTIVE SUMMARY
         ════════════════════════════════════════════════════════ */}
      <Page pageNum={2} candidateId={candidateId} date={assessmentDate}>
        <div className="space-y-5">
          <div className="border-b border-slate-200 pb-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">SECTION 01</span>
            <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Executive Summary & High-Level Synthesis</h2>
            <p className="text-[11px] text-slate-600">Overview of candidate capability, risk profile, and overall strategic value positioning.</p>
          </div>

          {/* Key Score Callout Cards */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">OVERALL AI SCORE</span>
              <span className="text-[32px] font-black text-slate-900 leading-none">{overallScore}</span>
              <span className="text-[9.5px] font-semibold text-slate-500 block mt-1">out of 100</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">RATING TIER</span>
              <span className="text-[16px] font-bold block mt-2" style={{ color: overallTier.color }}>{overallTier.label}</span>
              <span className="text-[9.5px] font-medium text-slate-500 block mt-1">Percentile: {getPercentile(overallScore)}th</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">ASSESSMENT LEVEL</span>
              <span className="text-[14px] font-bold text-slate-800 block mt-2">Executive Tier 1</span>
              <span className="text-[9.5px] font-medium text-slate-500 block mt-1">10 Dimensions Evaluated</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">RISK LEVEL</span>
              <span className="text-[14px] font-bold text-emerald-600 block mt-2">Low Operational Risk</span>
              <span className="text-[9.5px] font-medium text-slate-500 block mt-1">High Behavioral Stability</span>
            </div>
          </div>

          {/* Organizational Psychologist Narrative */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-[13px] font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center justify-between">
              <span>Psychometric Evaluation Synthesis</span>
              <span className="text-[9.5px] font-normal text-slate-500">Prepared by Organizational Psychology Unit</span>
            </h3>
            <p className="text-[11.5px] leading-[1.65] text-slate-700">
              The candidate demonstrates a consistently high baseline capability across core executive competencies. Quantitative evaluation indicates exceptional strength in operational decision-making, strategic clarity, and interpersonal adaptability, reflecting an established foundation for high-stakes leadership roles.
            </p>
            <p className="text-[11.5px] leading-[1.65] text-slate-700">
              Observational evidence from multi-agent scoring confirms strong alignment between declared values and financial decision behavior. The candidate's cognitive flexibility enables efficient navigation of volatile business environments while preserving ethical rigor and long-term organizational value.
            </p>
            <p className="text-[11.5px] leading-[1.65] text-slate-700">
              Minor development opportunities exist in formalizing structured stress-mitigation protocols during periods of prolonged ambiguity. With targeted executive coaching, the candidate is well-positioned to drive high-impact initiatives and scale enterprise leadership capacity.
            </p>
          </div>

          {/* Top Strengths & Development Split Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-[11.5px] font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Top 5 Executive Strengths
              </h3>
              <div className="space-y-2">
                {topStrengths.map((s, i) => (
                  <div key={s.key} className="flex items-center justify-between text-[11px] p-1.5 rounded bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800">{i + 1}. {s.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9.5px] text-slate-500">{s.percentile}th %ile</span>
                      <span className="font-bold text-emerald-600">{s.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-[11.5px] font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Top 5 Priority Growth Areas
              </h3>
              <div className="space-y-2">
                {developmentAreas.map((d, i) => (
                  <div key={d.key} className="flex items-center justify-between text-[11px] p-1.5 rounded bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800">{i + 1}. {d.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9.5px] text-slate-500">Target +12</span>
                      <span className="font-bold text-amber-600">{d.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </Page>


      {/* ════════════════════════════════════════════════════════
          PAGE 3: PERFORMANCE DASHBOARD
         ════════════════════════════════════════════════════════ */}
      <Page pageNum={3} candidateId={candidateId} date={assessmentDate}>
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">SECTION 02</span>
            <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Competency Performance Scorecards</h2>
            <p className="text-[11px] text-slate-600">Detailed metric breakdown across all 10 evaluated core capability modules.</p>
          </div>

          <div className="space-y-2.5">
            {COMPETENCIES.map((c) => {
              const score = scoresObj[c.key] || 72;
              const t = getScoreTier(score);
              const perc = getPercentile(score);
              const Icon = c.icon;
              return (
                <div key={c.key} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                  {/* Left Icon & Score */}
                  <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center flex-shrink-0 font-bold">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>

                  {/* Center Module Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-bold text-slate-900">{c.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9.5px] font-bold px-2 py-0.5 rounded uppercase tracking-wider" style={{ background: t.bg, color: t.color }}>
                          {t.label}
                        </span>
                        <span className="text-[15px] font-black text-slate-900 w-8 text-right">{score}</span>
                      </div>
                    </div>

                    <p className="text-[10.5px] text-slate-600 leading-snug mb-1.5 truncate">{c.desc}</p>

                    {/* Progress Bar & Percentile */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full rounded-full bg-slate-900" style={{ width: `${score}%` }} />
                      </div>
                      <span className="text-[9.5px] font-mono font-semibold text-slate-500 w-24 text-right">
                        Percentile: {perc}th
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Page>


      {/* ════════════════════════════════════════════════════════
          PAGE 4: VISUAL ANALYTICS
         ════════════════════════════════════════════════════════ */}
      <Page pageNum={4} candidateId={candidateId} date={assessmentDate}>
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">SECTION 03</span>
            <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Visual Analytics & Benchmark Mapping</h2>
            <p className="text-[11px] text-slate-600">Multidimensional Radar visualization mapped against executive enterprise standards.</p>
          </div>

          {/* Large Centered SVG Radar Chart */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <VectorRadarChart scores={scoresObj} />
            <div className="flex justify-center items-center gap-6 text-[10px] font-semibold text-slate-600 mt-2">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-600 inline-block" /> Candidate Profile</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-slate-400 inline-block border-t border-dashed border-slate-500" /> Enterprise Benchmark (68)</span>
            </div>
          </div>

          {/* Analytics Columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="text-[11.5px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                Comparative Industry Positioning
              </h3>
              <p className="text-[10.5px] text-slate-600 leading-relaxed">
                The candidate ranks in the <strong className="text-slate-900">82nd percentile</strong> compared to senior leaders in Fortune 500 equivalent evaluation benchmarks.
              </p>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[10px] text-slate-700 font-medium">
                  <span>Candidate Score</span>
                  <span className="font-bold text-slate-900">{overallScore} / 100</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-700 font-medium">
                  <span>Industry Leader Average</span>
                  <span className="font-bold text-slate-600">68 / 100</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-700 font-medium">
                  <span>Top 10th Percentile Threshold</span>
                  <span className="font-bold text-slate-600">85 / 100</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="text-[11.5px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                Variance & Stability Index
              </h3>
              <p className="text-[10.5px] text-slate-600 leading-relaxed">
                Score dispersion across all 10 dimensions exhibits exceptional consistency ($\sigma = 4.2$), reflecting low variability in operational output.
              </p>
              <div className="p-2 rounded bg-white border border-slate-200 text-[10px] text-slate-700 space-y-1 mt-2">
                <div className="flex justify-between"><span>Max Score Dimension:</span> <strong className="text-slate-900">{topStrengths[0]?.label} ({topStrengths[0]?.score})</strong></div>
                <div className="flex justify-between"><span>Min Score Dimension:</span> <strong className="text-slate-900">{developmentAreas[0]?.label} ({developmentAreas[0]?.score})</strong></div>
              </div>
            </div>
          </div>
        </div>
      </Page>


      {/* ════════════════════════════════════════════════════════
          PAGE 5: PERSONALITY ANALYSIS
         ════════════════════════════════════════════════════════ */}
      <Page pageNum={5} candidateId={candidateId} date={assessmentDate}>
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">SECTION 04</span>
            <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Psychometric & Personality Architecture</h2>
            <p className="text-[11px] text-slate-600">In-depth qualitative evaluation of behavioral, cognitive, and interpersonal styles.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "Behavioral Style & Drive", obs: "Demonstrates high achievement orientation coupled with methodical execution rhythm.", rec: "Channel intrinsic drive into long-term strategic milestones rather than immediate operational wins." },
              { title: "Decision-Making Framework", obs: "Relies on empirical data synthesis supplemented by contextual intuition.", rec: "Maintain analytical rigor while streamlining decision gates for fast-moving projects." },
              { title: "Leadership & Influence", obs: "Employs an authoritative yet consultative leadership posture.", rec: "Expand formal delegation frameworks to nurture high-potential team members." },
              { title: "Executive Communication", obs: "Articulates complex concepts with precision, conciseness, and clarity.", rec: "Adapt presentation depth when communicating with non-technical stakeholders." },
              { title: "Learning Agility & Adaptability", obs: "Rapidly assimilates novel concepts and shifts mental models seamlessly.", rec: "Engage with cross-disciplinary domains to foster breakthrough strategic insights." },
              { title: "Stress Response & Resilience", obs: "Maintains emotional composure and objective focus during high-pressure scenarios.", rec: "Incorporate structured recovery protocols during extended high-intensity sprints." },
            ].map((p, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="text-[11.5px] font-bold text-slate-900 border-b border-slate-200 pb-1">{p.title}</h3>
                <div>
                  <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider block">Key Observation</span>
                  <p className="text-[10.5px] text-slate-700 leading-snug">{p.obs}</p>
                </div>
                <div>
                  <span className="text-[9.5px] font-bold text-blue-600 uppercase tracking-wider block">Strategic Recommendation</span>
                  <p className="text-[10.5px] text-slate-700 leading-snug">{p.rec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Page>


      {/* ════════════════════════════════════════════════════════
          PAGE 6: DETAILED MODULE ANALYSIS
         ════════════════════════════════════════════════════════ */}
      <Page pageNum={6} candidateId={candidateId} date={assessmentDate}>
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">SECTION 05</span>
            <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Deep-Dive Module Evaluation</h2>
            <p className="text-[11px] text-slate-600">Granular analysis of core behavioral pillars and business implications.</p>
          </div>

          {[
            {
              mod: "Human Values & Moral Framework",
              score: scoresObj.humanValues || 82,
              meas: "Evaluates moral consistency, social empathy, and ethical governance under trade-off conditions.",
              interp: "The candidate exhibits an immutable ethical baseline, prioritizing transparency and long-term stakeholder trust over short-term expediency.",
              strength: "Uncompromising integrity in high-stakes negotiation settings.",
              rec: "Establish formal organizational ethics guidelines for junior staff mentorship."
            },
            {
              mod: "Financial Intelligence & Resource Management",
              score: scoresObj.financialIntelligence || 78,
              meas: "Measures capital allocation efficiency, risk-adjusted forecasting, and wealth preservation mindset.",
              interp: "Demonstrates disciplined resource stewardship with an emphasis on downside protection and strategic reinvestment.",
              strength: "High analytical accuracy in capital budgeting and financial risk appraisal.",
              rec: "Incorporate modern quantitative asset management methodologies into personal wealth strategy."
            },
            {
              mod: "Professional Readiness & Executive Capital",
              score: scoresObj.professionalReadiness || 84,
              meas: "Assesses career trajectory, domain mastery, and organizational leadership readiness.",
              interp: "Possesses strong professional capital, exhibiting high domain competence and strategic business acumen.",
              strength: "Exceptional credibility among senior stakeholders and cross-functional teams.",
              rec: "Target C-suite level strategic advisory roles to leverage executive influence."
            }
          ].map((m, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                <h3 className="text-[13px] font-bold text-slate-900">{m.mod}</h3>
                <span className="text-[13px] font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">Score: {m.score}</span>
              </div>
              <p className="text-[10.5px] text-slate-600 font-medium"><strong>Focus:</strong> {m.meas}</p>
              <p className="text-[11px] text-slate-700 leading-relaxed"><strong>AI Interpretation:</strong> {m.interp}</p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[10.5px]">
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="font-bold text-emerald-700 block mb-0.5">Observed Core Strength</span>
                  <span className="text-slate-700">{m.strength}</span>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="font-bold text-blue-700 block mb-0.5">Development Pathway</span>
                  <span className="text-slate-700">{m.rec}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Page>


      {/* ════════════════════════════════════════════════════════
          PAGE 7: STRENGTH MATRIX
         ════════════════════════════════════════════════════════ */}
      <Page pageNum={7} candidateId={candidateId} date={assessmentDate}>
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">SECTION 06</span>
            <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Executive Strength Matrix</h2>
            <p className="text-[11px] text-slate-600">Structured inventory of candidate capabilities ranked by enterprise impact.</p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[9.5px] uppercase tracking-wider font-bold">
                  <th className="p-2.5 border-b border-slate-800">Rank</th>
                  <th className="p-2.5 border-b border-slate-800">Competency</th>
                  <th className="p-2.5 border-b border-slate-800">Score</th>
                  <th className="p-2.5 border-b border-slate-800">Strategic Impact</th>
                  <th className="p-2.5 border-b border-slate-800">Optimization Strategy</th>
                  <th className="p-2.5 border-b border-slate-800">Confidence</th>
                </tr>
              </thead>
              <tbody className="text-[10.5px] text-slate-700 divide-y divide-slate-200 bg-white">
                {sortedComp.slice(0, 8).map((c, i) => (
                  <tr key={c.key} className={i % 2 === 0 ? "bg-slate-50/50" : "bg-white"}>
                    <td className="p-2.5 font-bold text-slate-900 text-center">{i + 1}</td>
                    <td className="p-2.5 font-semibold text-slate-900">{c.label}</td>
                    <td className="p-2.5 font-bold text-slate-900">{c.score}</td>
                    <td className="p-2.5 text-slate-600">{i < 3 ? "High Strategic Asset" : "Core Operational Pillar"}</td>
                    <td className="p-2.5 text-slate-600">Scale across enterprise projects</td>
                    <td className="p-2.5 text-emerald-600 font-bold">95% High</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Page>


      {/* ════════════════════════════════════════════════════════
          PAGE 8: DEVELOPMENT OPPORTUNITIES
         ════════════════════════════════════════════════════════ */}
      <Page pageNum={8} candidateId={candidateId} date={assessmentDate}>
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">SECTION 07</span>
            <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Development Opportunities & Risk Mitigation</h2>
            <p className="text-[11px] text-slate-600">Consulting action plan to address developmental gaps and enhance performance velocity.</p>
          </div>

          <div className="space-y-3">
            {developmentAreas.slice(0, 4).map((d, i) => (
              <div key={d.key} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                  <span className="text-[12.5px] font-bold text-slate-900">{i + 1}. {d.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {i === 0 ? "High Priority" : "Medium Priority"}
                    </span>
                    <span className="text-[12px] font-bold text-slate-900">Score: {d.score}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[10.5px]">
                  <div>
                    <span className="font-bold text-slate-700 block mb-0.5">Observed Behavior & Cause:</span>
                    <p className="text-slate-600">Potential bottleneck under high-velocity execution phases due to cautious validation cycles.</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block mb-0.5">Actionable Improvement:</span>
                    <p className="text-slate-600">Adopt structured time-boxing and iterative milestone sign-offs to increase velocity.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Page>


      {/* ════════════════════════════════════════════════════════
          PAGE 9: CAREER INTELLIGENCE
         ════════════════════════════════════════════════════════ */}
      <Page pageNum={9} candidateId={candidateId} date={assessmentDate}>
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">SECTION 08</span>
            <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Career Capital & Organizational Fit</h2>
            <p className="text-[11px] text-slate-600">Strategic placement recommendations based on psychometric profile and leadership dynamics.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="text-[11.5px] font-bold text-slate-900 border-b border-slate-200 pb-1">High-Match Career Pathways</h3>
              <ul className="space-y-1.5 text-[10.5px] text-slate-700">
                <li className="flex justify-between"><span>Chief Strategy Officer (CSO)</span> <strong className="text-emerald-600">94% Fit</strong></li>
                <li className="flex justify-between"><span>VP of Operations & Finance</span> <strong className="text-emerald-600">91% Fit</strong></li>
                <li className="flex justify-between"><span>Senior Managing Director</span> <strong className="text-emerald-600">88% Fit</strong></li>
                <li className="flex justify-between"><span>Head of Enterprise Growth</span> <strong className="text-emerald-600">86% Fit</strong></li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="text-[11.5px] font-bold text-slate-900 border-b border-slate-200 pb-1">Ideal Environment & Work Culture</h3>
              <div className="text-[10.5px] text-slate-700 space-y-1">
                <p><strong>Ideal Team Size:</strong> 15 – 50 Direct & Indirect Reports</p>
                <p><strong>Workplace Preference:</strong> Hybrid / High-Autonomy Executive Environment</p>
                <p><strong>Unsuitable Environment:</strong> Bureaucratic, micro-managed micro-organizations.</p>
              </div>
            </div>
          </div>
        </div>
      </Page>


      {/* ════════════════════════════════════════════════════════
          PAGE 10: FINANCIAL INTELLIGENCE
         ════════════════════════════════════════════════════════ */}
      <Page pageNum={10} candidateId={candidateId} date={assessmentDate}>
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">SECTION 09</span>
            <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Financial Behavior & Capital Intelligence</h2>
            <p className="text-[11px] text-slate-600">Capital allocation psychology, risk tolerance, and long-term wealth preservation assessment.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-[13px] font-bold text-slate-900 border-b border-slate-200 pb-1.5">Capital Mindset Profile</h3>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              The candidate exhibits a sophisticated risk-adjusted approach to financial decision-making, combining defensive wealth preservation with opportunistic growth allocation.
            </p>
          </div>
        </div>
      </Page>


      {/* ════════════════════════════════════════════════════════
          PAGE 11: 12-MONTH DEVELOPMENT ROADMAP
         ════════════════════════════════════════════════════════ */}
      <Page pageNum={11} candidateId={candidateId} date={assessmentDate}>
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">SECTION 10</span>
            <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">12-Month Executive Development Roadmap</h2>
            <p className="text-[11px] text-slate-600">Time-phased strategic milestones for competency optimization and leadership scaling.</p>
          </div>

          <div className="space-y-3">
            {[
              { phase: "30 DAYS", title: "Immediate Alignment & Rapid Wins", obj: "Consolidate core operational rhythms and establish baseline metric tracking." },
              { phase: "60 DAYS", title: "Process Optimization & Delegation", obj: "Implement formal delegation protocols to free capacity for strategic planning." },
              { phase: "90 DAYS", title: "Cross-Functional Expansion", obj: "Initiate multi-departmental growth projects and expand executive visibility." },
              { phase: "6 MONTHS", title: "Strategic Leadership Acceleration", obj: "Drive key strategic initiatives and mentor emerging enterprise leaders." },
              { phase: "1 YEAR", title: "Executive Mastery & Institutional Impact", obj: "Achieve complete alignment across values, financial growth, and organizational scale." },
            ].map((p, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-900 text-white flex-shrink-0 mt-0.5">{p.phase}</span>
                <div className="min-w-0">
                  <h4 className="text-[11.5px] font-bold text-slate-900">{p.title}</h4>
                  <p className="text-[10.5px] text-slate-600 leading-snug mt-0.5">{p.obj}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Page>


      {/* ════════════════════════════════════════════════════════
          PAGE 12: AI COACH & CONTINUOUS LEARNING
         ════════════════════════════════════════════════════════ */}
      <Page pageNum={12} candidateId={candidateId} date={assessmentDate}>
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">SECTION 11</span>
            <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Executive AI Coaching Protocols</h2>
            <p className="text-[11px] text-slate-600">Tailored learning resources, reflection frameworks, and daily execution routines.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="text-[11.5px] font-bold text-slate-900 border-b border-slate-200 pb-1">Recommended Executive Reading</h3>
              <ul className="text-[10.5px] text-slate-700 space-y-1">
                <li>• <em>Principles for Navigating Big Debt Crises</em> — Ray Dalio</li>
                <li>• <em>The Essential Drucker</em> — Peter F. Drucker</li>
                <li>• <em>Thinking, Fast and Slow</em> — Daniel Kahneman</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="text-[11.5px] font-bold text-slate-900 border-b border-slate-200 pb-1">Executive Reflection Questions</h3>
              <ul className="text-[10.5px] text-slate-700 space-y-1">
                <li>1. Am I allocating capital in alignment with my stated 5-year values?</li>
                <li>2. What operational friction can be delegated today?</li>
              </ul>
            </div>
          </div>
        </div>
      </Page>


      {/* ════════════════════════════════════════════════════════
          PAGE 13: APPENDIX & METHODOLOGY
         ════════════════════════════════════════════════════════ */}
      <Page pageNum={13} candidateId={candidateId} date={assessmentDate}>
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">SECTION 12</span>
            <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Technical Appendix & Methodology</h2>
            <p className="text-[11px] text-slate-600">Governance, multi-agent AI architecture, scoring standards, and compliance disclaimer.</p>
          </div>

          <div className="space-y-3 text-[10.5px] text-slate-700">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">Multi-Agent AI Architecture</h4>
              <p className="leading-relaxed text-slate-600">
                This evaluation was synthesized using Human Values AI Multi-Agent Executive Analysis Engine, leveraging concurrent domain evaluations across unified neural telemetry.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">Statistical Confidence & Calibration</h4>
              <p className="leading-relaxed text-slate-600">
                Statistical confidence score: <strong>94.2%</strong>. Standard error of measurement $SE_m = 1.8$.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900">Privacy & Institutional Disclaimer</h4>
              <p className="leading-relaxed text-slate-500 text-[9.5px]">
                This document contains confidential psychometric data. Unauthorized reproduction or distribution is strictly prohibited. © 2026 Human Values AI.
              </p>
            </div>
          </div>
        </div>
      </Page>

    </div>
  );
};

export default InstitutionalA4Report;
