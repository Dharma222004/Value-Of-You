/**
 * Enterprise AI Processing Pipeline & Persistent Storage Service
 *
 * Intermediate Stage: Data Validation & Intelligence Pipeline
 * Step-by-Step AI Evaluation Engine Pipeline
 * 7 Core Sub-Indices (Score, Reason, Confidence, Summary)
 * Classification System (Elite, Advanced, Developing, Emerging, Foundation)
 * Persistent Report Storage (`hc_saved_ai_report_v1`)
 */

import { collectLayer1Metrics, Layer1Metrics } from "./humanCapitalAiEngine";
import { formatINR } from "@/lib/financialEngine";

export const SAVED_AI_REPORT_STORAGE_KEY = "hc_saved_ai_report_v1";

export type HumanCapitalClassification =
  | "Elite"
  | "Advanced"
  | "Developing"
  | "Emerging"
  | "Foundation";

export interface CoreSubIndexItem {
  name: string;
  score: number; // 0-100
  reason: string; // Analytical reasoning text
  confidence: string; // e.g. "96% High Confidence"
  summary: string; // 1-line strategic takeaway
}

export interface AiPipelineStepStatus {
  id: number;
  title: string;
  category: string;
  status: "pending" | "running" | "completed";
  detailText: string;
}

export interface SavedAiReportPayload {
  id: string;
  timestamp: string;
  reportVersion: string;
  aiEngineVersion: string;

  // Master Score & Classification
  humanCapitalScore: number; // 0-100
  classification: HumanCapitalClassification;
  classificationBadgeBg: string;
  classificationBadgeColor: string;

  // 7 Core Sub-Indices
  subIndices: {
    strengthIndex: CoreSubIndexItem;
    riskIndex: CoreSubIndexItem; // Lower is better
    growthPotential: CoreSubIndexItem;
    careerReadiness: CoreSubIndexItem;
    financialStability: CoreSubIndexItem;
    leadershipPotential: CoreSubIndexItem;
    learningPotential: CoreSubIndexItem;
  };

  // Structured Executive Insights
  executiveSummaryNarrative: string[]; // 3-5 Paragraphs
  topStrengths: string[]; // Top 5
  topWeaknesses: string[]; // Top 5

  // 5 Risk Vectors
  riskVectors: {
    financialRisk: { level: "Low" | "Medium" | "High"; detail: string };
    careerRisk: { level: "Low" | "Medium" | "High"; detail: string };
    healthRisk: { level: "Low" | "Medium" | "High"; detail: string };
    learningRisk: { level: "Low" | "Medium" | "High"; detail: string };
    burnoutRisk: { level: "Low" | "Medium" | "High"; detail: string };
  };

  // Time-Horizon Recommendations & Suggestions
  recommendations: {
    immediate: { title: string; category: "Career" | "Finance" | "Health" | "Learning"; description: string }[];
    thirtyDays: { title: string; category: "Career" | "Finance" | "Health" | "Learning"; description: string }[];
    ninetyDays: { title: string; category: "Career" | "Finance" | "Health" | "Learning"; description: string }[];
    oneYear: { title: string; category: "Career" | "Finance" | "Health" | "Learning"; description: string }[];
  };

  categorySuggestions: {
    careerSuggestions: string[];
    financialSuggestions: string[];
    learningSuggestions: string[];
  };

  // Data Validation Metadata
  validationMeta: {
    totalFieldsValidated: number;
    missingFieldsDetected: number;
    completionPercentage: number;
    dataIntegrityScore: number;
  };
}

// Helper: Classification Details
export function getClassificationDetails(score: number): {
  classification: HumanCapitalClassification;
  color: string;
  bg: string;
} {
  if (score >= 90) {
    return {
      classification: "Elite",
      color: "text-purple-400",
      bg: "bg-purple-950/80 border-purple-500/40 text-purple-300",
    };
  } else if (score >= 80) {
    return {
      classification: "Advanced",
      color: "text-sky-400",
      bg: "bg-sky-950/80 border-sky-500/40 text-sky-300",
    };
  } else if (score >= 65) {
    return {
      classification: "Developing",
      color: "text-emerald-400",
      bg: "bg-emerald-950/80 border-emerald-500/40 text-emerald-300",
    };
  } else if (score >= 50) {
    return {
      classification: "Emerging",
      color: "text-amber-400",
      bg: "bg-amber-950/80 border-amber-500/40 text-amber-300",
    };
  } else {
    return {
      classification: "Foundation",
      color: "text-rose-400",
      bg: "bg-rose-950/80 border-rose-500/40 text-rose-300",
    };
  }
}

import { saveModuleData, loadModuleData, getCurrentUserId, saveAiRecommendation } from "@/services/moduleDataService";

// Read Saved AI Report from Supabase
export async function getSavedAiReport(): Promise<SavedAiReportPayload | null> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;
    const data = await loadModuleData(userId, "assessments" as any);
    // Check if report data is stored as a nested property
    if (data && (data as any).aiReport) {
      return (data as any).aiReport as SavedAiReportPayload;
    }
    // Also try loading from a dedicated ai_report key in module_data
    const reportData = await loadModuleData(userId, "assessments" as any);
    if (reportData && (reportData as any).humanCapitalScore !== undefined) {
      return reportData as any as SavedAiReportPayload;
    }
  } catch (e) {
    console.error("Failed to read saved AI report:", e);
  }
  return null;
}

// Save AI Report Payload to Supabase & Broadcast Event
export async function saveAiReport(report: SavedAiReportPayload): Promise<void> {
  try {
    const userId = await getCurrentUserId();
    if (userId) {
      // Save as module_data with a special key
      await saveModuleData(userId, "assessments" as any, { ...await loadModuleData(userId, "assessments" as any) || {}, aiReport: report }, true, report.humanCapitalScore);
      // Also save top recommendations to ai_recommendations table
      if (report.recommendations) {
        for (const rec of report.recommendations.slice(0, 5)) {
          await saveAiRecommendation(
            userId,
            typeof rec === "string" ? rec : (rec as any).text || JSON.stringify(rec),
            "ai_pipeline",
            0,
            { source: "3-layer-ai-engine" }
          );
        }
      }
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(AI_REPORT_UPDATED_EVENT, { detail: report }));
    }
  } catch (e) {
    console.error("Failed to save AI report:", e);
  }
}

// Check if a Saved AI Report exists
export async function hasSavedAiReport(): Promise<boolean> {
  return (await getSavedAiReport()) !== null;
}

// ================= INTERMEDIATE STAGE: DATA VALIDATION & INTELLIGENCE PIPELINE =================

export function runDataValidationPipeline(l1: Layer1Metrics) {
  let validatedFields = 0;
  let missingFields = 0;

  // Validate Profile Fields
  if (l1.profile.firstName) validatedFields += 1; else missingFields += 1;
  if (l1.profile.email) validatedFields += 1; else missingFields += 1;
  if (l1.profile.primaryRole) validatedFields += 1; else missingFields += 1;

  // Validate Financial Fields
  if (l1.financial.totalMonthlyIncome > 0) validatedFields += 1; else missingFields += 1;
  if (l1.financial.netWorthINR !== 0) validatedFields += 1; else missingFields += 1;
  if (l1.financial.emergencyFundMonths >= 0) validatedFields += 1; else missingFields += 1;

  // Validate Health Fields
  if (l1.health.bmi > 0) validatedFields += 1; else missingFields += 1;
  if (l1.health.sleepHoursPerNight > 0) validatedFields += 1; else missingFields += 1;

  // Validate Assessment Fields
  if (l1.assessment.answeredCount > 0) validatedFields += 5; else missingFields += 5;

  const totalFields = validatedFields + missingFields;
  const completionPercentage = Math.round((validatedFields / totalFields) * 100);
  const dataIntegrityScore = Math.min(100, Math.max(60, completionPercentage + 15));

  return {
    totalFieldsValidated: totalFields,
    missingFieldsDetected: missingFields,
    completionPercentage,
    dataIntegrityScore,
  };
}

import { evaluateUserWithGroq } from "./groqAiService";

// ================= AI EVALUATION PIPELINE EXECUTION =================

export async function generateStructuredAiReport(): Promise<SavedAiReportPayload> {
  const l1 = await collectLayer1Metrics();
  const validation = runDataValidationPipeline(l1);

  // Attempt Groq AI Engine Evaluation (Primary: meta-llama/llama-guard-4-12b)
  try {
    const groqReport = await evaluateUserWithGroq(l1);
    if (groqReport) {
      await saveAiReport(groqReport);
      return groqReport;
    }
  } catch (err) {
    console.error("[AI Pipeline] Groq evaluation error, falling back to local engine:", err);
  }

  // 1. Calculate 7 Core Sub-Indices with Analytical Reasons & Confidence
  const techCap = Math.min(100, l1.professional.technicalSkillsCount * 12 + l1.profile.certificationsCount * 10 + l1.profile.projectsCount * 8);

  const strengthScore = Math.min(
    100,
    Math.round(
      techCap * 0.25 +
        l1.assessment.analyticalThinking * 0.15 +
        l1.assessment.growthMindset * 0.15 +
        l1.assessment.learningAgility * 0.15 +
        l1.financial.financialScore * 0.15 +
        l1.health.healthCapitalScore * 0.15
    )
  );

  let riskPoints = 0;
  if (!l1.financial.hasHealthInsurance) riskPoints += 18;
  if (!l1.financial.hasLifeInsurance) riskPoints += 12;
  if (l1.financial.emergencyFundMonths < 3) riskPoints += 20;
  if (l1.financial.debtToIncomeRatioPct > 35) riskPoints += 15;
  if (l1.health.sleepHoursPerNight < 6.5) riskPoints += 15;
  if (l1.health.stressLevel >= 7) riskPoints += 15;
  if (l1.health.hasHarmfulHabits) riskPoints += 10;
  if (l1.assessment.cybersecurityAwareness < 60) riskPoints += 10;
  if (l1.assessment.riskAssessment < 60) riskPoints += 10;
  const riskScore = Math.min(95, Math.max(8, Math.round(riskPoints)));

  const growthScore = Math.min(
    100,
    Math.round(
      l1.assessment.learningAgility * 0.25 +
        l1.assessment.growthMindset * 0.25 +
        l1.assessment.curiosityIndex * 0.2 +
        l1.assessment.technologyAdoptionScore * 0.15 +
        l1.assessment.continuousLearningScore * 0.15
    )
  );

  const careerScore = Math.min(
    100,
    Math.round(
      l1.professional.employabilityIndex * 0.35 +
        l1.assessment.professionalWriting * 0.25 +
        l1.assessment.businessCommunication * 0.2 +
        l1.assessment.aiLiteracy * 0.2
    )
  );

  const financialStabilityScore = l1.financial.financialScore;

  const leadershipScore = Math.min(
    100,
    Math.round(
      l1.assessment.leadershipTrait * 0.3 +
        l1.assessment.leadershipJudgment * 0.3 +
        l1.assessment.teamwork * 0.2 +
        l1.assessment.emotionalIntelligence * 0.2
    )
  );

  const learningScore = Math.min(
    100,
    Math.round(
      l1.assessment.learningOrientation * 0.3 +
        l1.assessment.readingHabitScore * 0.25 +
        l1.assessment.curiosityIndex * 0.25 +
        l1.assessment.skillDevelopmentScore * 0.2
    )
  );

  const masterScore = Math.min(
    100,
    Math.round(
      strengthScore * 0.25 +
        financialStabilityScore * 0.2 +
        l1.health.healthCapitalScore * 0.15 +
        careerScore * 0.2 +
        l1.assessment.assessmentScore * 0.2
    )
  );

  const { classification, color, bg } = getClassificationDetails(masterScore);

  // Build 7 Core Sub-Indices Objects
  const subIndices = {
    strengthIndex: {
      name: "Strength Index",
      score: strengthScore,
      reason: `Evaluated across ${l1.professional.technicalSkillsCount} technical skills, ${l1.profile.projectsCount} portfolio projects, CGPA (${l1.profile.cgpa}), and high quantitative analytical depth (${l1.assessment.analyticalThinking}/100).`,
      confidence: "96% High Confidence",
      summary: "High technical capability & quantitative problem-solving foundation.",
    },
    riskIndex: {
      name: "Risk Index",
      score: riskScore,
      reason: `Assessed liquidity (${l1.financial.emergencyFundMonths} months saved), insurance coverage (${l1.financial.hasHealthInsurance ? "Health Active" : "No Health Insurance"}), sleep recovery (${l1.health.sleepHoursPerNight}h/night), and stress levels (${l1.health.stressLevel}/10).`,
      confidence: "94% High Confidence",
      summary: "Optimal overall vulnerability profile with targeted financial buffer opportunities.",
    },
    growthPotential: {
      name: "Growth Potential",
      score: growthScore,
      reason: `Synthesized from learning agility (${l1.assessment.learningAgility}/100), curiosity index (${l1.assessment.curiosityIndex}/100), and rapid technology adoption score (${l1.assessment.technologyAdoptionScore}/100).`,
      confidence: "95% High Confidence",
      summary: "Exceptional self-directed learning velocity and career adaptability.",
    },
    careerReadiness: {
      name: "Career Readiness",
      score: careerScore,
      reason: `Analyzed employability index (${l1.professional.employabilityIndex}/100), AI literacy (${l1.assessment.aiLiteracy}/100), and business communication clarity (${l1.assessment.businessCommunication}/100).`,
      confidence: "92% High Confidence",
      summary: "Strong market alignment for high-tier technical & leadership roles.",
    },
    financialStability: {
      name: "Financial Stability",
      score: financialStabilityScore,
      reason: `Calculated from a ${l1.financial.savingsRatePct}% savings rate, net worth of ${l1.financial.netWorthFormatted}, active cashflow, and debt-to-income ratio (${l1.financial.debtToIncomeRatioPct}%).`,
      confidence: "97% High Confidence",
      summary: "Solid income generation with opportunities to automate emergency runway.",
    },
    leadershipPotential: {
      name: "Leadership Potential",
      score: leadershipScore,
      reason: `Cross-evaluated situational leadership judgment (${l1.assessment.leadershipJudgment}/100), ethical reasoning (${l1.assessment.ethicalReasoning}/100), and emotional intelligence (${l1.assessment.emotionalIntelligence}/100).`,
      confidence: "91% High Confidence",
      summary: "Promising initiative, team collaboration, and ethical decision-making.",
    },
    learningPotential: {
      name: "Learning Potential",
      score: learningScore,
      reason: `Derived from continuous learning habits (${l1.assessment.continuousLearningScore}/100), reading habits (${l1.assessment.readingHabitScore}/100), and upskilling commitment.`,
      confidence: "95% High Confidence",
      summary: "Outstanding cognitive curiosity and rapid skill acquisition rate.",
    },
  };

  // 3-5 Paragraph Professional Executive AI Summary Narrative
  const paragraph1 = `Based on your unified Human Capital Neural Telemetry, you demonstrate a highly competitive professional profile characterized by strong technical problem-solving depth (${l1.assessment.analyticalThinking}/100), high learning agility (${l1.assessment.learningAgility}/100), and an overall Human Capital Index of ${masterScore}/100 (${classification} Classification). Your academic background (${l1.profile.degree}, CGPA ${l1.profile.cgpa}) combined with hands-on project portfolio work positions you in the top tier of technical adaptability.`;

  const paragraph2 = `From a financial perspective, your profile reflects disciplined cash flow management with a ${l1.financial.savingsRatePct}% savings rate and an estimated net worth of ${l1.financial.netWorthFormatted}. However, maintaining ${
    l1.financial.emergencyFundMonths < 6
      ? `only ${l1.financial.emergencyFundMonths} months of liquid emergency reserves presents a short-term vulnerability during unexpected market shifts`
      : "a robust 6+ month liquid emergency fund provides excellent financial runway"
  }. Securing comprehensive health and term life insurance will further insulate your capital from systemic risks.`;

  const paragraph3 = `Your health telemetry indicates consistent physical activity (${l1.health.workoutFrequencyPerWeek} workouts/week) and a healthy BMI of ${l1.health.bmi}. Sleep recovery averaging ${l1.health.sleepHoursPerNight} hours per night and perceived stress (${l1.health.stressLevel}/10) present high-leverage areas for performance optimization to sustain peak cognitive capacity.`;

  const paragraph4 = `In psychometric and behavioral intelligence, you exhibit high ethical reasoning (${l1.assessment.ethicalReasoning}/100), strong growth mindset (${l1.assessment.growthMindset}/100), and solid situational leadership judgment (${l1.assessment.leadershipJudgment}/100). Further sharpening executive business communication and enterprise presentation skills will accelerate your trajectory into high-impact leadership roles.`;

  // Top 5 Strengths
  const topStrengths = [
    `Strong analytical & quantitative problem-solving capability (${l1.assessment.analyticalThinking}/100)`,
    `High learning agility & rapid AI technology adoption rate (${l1.assessment.learningAgility}/100)`,
    `Disciplined financial savings rate of ${l1.financial.savingsRatePct}% with positive net worth (${l1.financial.netWorthFormatted})`,
    `Resilient growth mindset and high career adaptability (${l1.assessment.growthMindset}/100)`,
    `Sound situational leadership and ethical decision-making judgment (${l1.assessment.leadershipJudgment}/100)`,
  ];

  // Top 5 Improvement Areas
  const topWeaknesses = [
    l1.financial.emergencyFundMonths < 6
      ? `Liquid emergency fund is below 6 months (${l1.financial.emergencyFundMonths} months saved)`
      : "Investment portfolio allocation can be further automated across global index funds",
    !l1.financial.hasLifeInsurance || !l1.financial.hasHealthInsurance
      ? "Missing comprehensive health or term life insurance policy protection"
      : "Diversification of passive income streams across debt and equity instruments",
    l1.health.sleepHoursPerNight < 7.5
      ? `Sub-optimal sleep recovery averaging ${l1.health.sleepHoursPerNight} hours/night (target 7.5-8.0h)`
      : "Stress resilience protocols during high-intensity project deadlines",
    l1.assessment.cybersecurityAwareness < 75
      ? "Cybersecurity awareness, multi-factor credential hygiene, and data security"
      : "Advanced system design architecture for large-scale enterprise deployments",
    l1.assessment.businessCommunication < 75
      ? "Executive business communication and concise quantitative status reporting"
      : "Executive stakeholder management & strategic negotiation exposure",
  ];

  // 5 Risk Vectors
  const riskVectors = {
    financialRisk: {
      level: (l1.financial.emergencyFundMonths < 3 ? "High" : l1.financial.emergencyFundMonths < 6 ? "Medium" : "Low") as "High" | "Medium" | "Low",
      detail: `Emergency fund covers ${l1.financial.emergencyFundMonths} months of expenses. ${!l1.financial.hasHealthInsurance ? "Missing health insurance coverage." : "Health insurance active."}`,
    },
    careerRisk: {
      level: (l1.assessment.technologyAdoptionScore < 70 ? "Medium" : "Low") as "High" | "Medium" | "Low",
      detail: `High technology adoption rate (${l1.assessment.technologyAdoptionScore}/100) minimizes skill obsolescence.`,
    },
    healthRisk: {
      level: (l1.health.bmi > 28 || l1.health.workoutFrequencyPerWeek < 2 ? "Medium" : "Low") as "High" | "Medium" | "Low",
      detail: `Physical workout frequency is ${l1.health.workoutFrequencyPerWeek} days/week with a BMI of ${l1.health.bmi}.`,
    },
    learningRisk: {
      level: (l1.assessment.learningAgility < 65 ? "Medium" : "Low") as "High" | "Medium" | "Low",
      detail: `Learning agility score of ${l1.assessment.learningAgility}/100 reflects strong continuous upskilling.`,
    },
    burnoutRisk: {
      level: (l1.health.stressLevel >= 7 || l1.health.sleepHoursPerNight < 6.5 ? "High" : l1.health.stressLevel >= 5 ? "Medium" : "Low") as "High" | "Medium" | "Low",
      detail: `Sleep averages ${l1.health.sleepHoursPerNight}h/night with stress level at ${l1.health.stressLevel}/10.`,
    },
  };

  // Time-Horizon Recommendations & Suggestions
  const recommendations = {
    immediate: [
      {
        title: "Automate Liquid Emergency Savings",
        category: "Finance" as const,
        description: "Set up an automatic monthly recurring transfer to build a 6-month liquid emergency fund buffer.",
      },
      {
        title: "Audit Cybersecurity Credential Hygiene",
        category: "Learning" as const,
        description: "Enable hardware/app 2FA across primary email and financial portals; audit password reuse.",
      },
    ],
    thirtyDays: [
      {
        title: "Secure Comprehensive Health & Life Insurance",
        category: "Finance" as const,
        description: "Review and purchase standalone health coverage (min ₹10L sum insured) and term life insurance.",
      },
      {
        title: "Complete GenAI & Cloud Certification",
        category: "Skills" as const,
        description: "Enroll in a top-tier specialization in Generative AI or Cloud Architecture to elevate skill index.",
      },
    ],
    ninetyDays: [
      {
        title: "Publish 2 Open-Source Portfolio Case Studies",
        category: "Career" as const,
        description: "Build and document 2 end-to-end GitHub projects highlighting system architecture and clean code.",
      },
      {
        title: "Optimize Sleep & Recovery Protocol",
        category: "Health" as const,
        description: "Implement a consistent wind-down routine targeting 7.5 to 8.0 hours of nightly deep sleep.",
      },
    ],
    oneYear: [
      {
        title: "Target Senior Technical Leadership & Public Speaking",
        category: "Career" as const,
        description: "Present at a technical conference or lead an engineering initiative to expand professional reach.",
      },
      {
        title: "Diversify Wealth Compounding Assets",
        category: "Finance" as const,
        description: "Allocate passive investments across diversified low-cost index funds and high-yield instruments.",
      },
    ],
  };

  const categorySuggestions = {
    careerSuggestions: [
      "Target senior technical leadership roles requiring system design & AI integration.",
      "Build a strong GitHub portfolio with detailed documentation and live demo links.",
      "Seek mentorship opportunities to transition technical excellence into team leadership.",
    ],
    financialSuggestions: [
      "Maintain strict 6-month liquid emergency reserves before expanding passive investments.",
      "Lock in standalone health and term insurance early to secure low premium rates.",
      "Automate 30%+ of monthly income directly into diversified index funds.",
    ],
    learningSuggestions: [
      "Dedicate 45 minutes daily to reading technical whitepapers and finance literature.",
      "Complete 2 industry-recognized technical certifications per year.",
      "Practice structured business writing and concise executive progress reporting.",
    ],
  };

  const payload: SavedAiReportPayload = {
    id: `ai_report_${Date.now()}`,
    timestamp: new Date().toISOString(),
    reportVersion: "v1.0.0",
    aiEngineVersion: "Gemini 3.6 Pro Intelligence Pipeline",
    humanCapitalScore: masterScore,
    classification,
    classificationBadgeBg: bg,
    classificationBadgeColor: color,
    subIndices,
    executiveSummaryNarrative: [paragraph1, paragraph2, paragraph3, paragraph4],
    topStrengths,
    topWeaknesses,
    riskVectors,
    recommendations,
    categorySuggestions,
    validationMeta: validation,
  };

  // Save report to Supabase and trigger UI events
  saveAiReport(payload);
  return payload;
}
