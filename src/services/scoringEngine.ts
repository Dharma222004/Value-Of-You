/**
 * Human Capital Platform - AI Scoring Engine Service
 * Enterprise AI Pipeline & Stored Report Integration
 */

import { getSavedAiReport, getClassificationDetails, HumanCapitalClassification } from "./aiPipelineService";
import { run3LayerAiEngine } from "./humanCapitalAiEngine";

export interface WeightageConfig {
  currentStatus: number; // default 0.10 (10%)
  financial: number;     // default 0.25 (25%)
  health: number;        // default 0.15 (15%)
  skills: number;        // default 0.20 (20%)
  assessment: number;    // default 0.30 (30%)
}

export const DEFAULT_WEIGHTAGE: WeightageConfig = {
  currentStatus: 0.10,
  financial: 0.25,
  health: 0.15,
  skills: 0.20,
  assessment: 0.30,
};

export type RatingClassification = HumanCapitalClassification;

export interface ModuleScores {
  currentStatus: number;
  financial: number;
  health: number;
  skills: number;
  assessment: number;
}

export interface HumanCapitalCalculationResult {
  // Primary Composite Metric
  humanCapitalScore: number;
  overallRating: RatingClassification;
  ratingBadgeColor: string;
  ratingBadgeBg: string;

  // 7 Key Sub-Indices (Layer 2 AI Evaluated)
  strengthIndex: number;
  riskIndex: number;
  growthPotential: number;
  careerReadiness: number;
  financialStability: number;
  leadershipPotential: number;
  learningPotential: number;

  // Individual Module Scores (0 - 100)
  moduleScores: ModuleScores;

  // Active Weightages used
  weightage: WeightageConfig;

  // Lifetime Asset Valuation Projection in INR
  lifetimeValuationINR: string;

  // Key Strategic Insights (Layer 3 Executive Report)
  executiveSummary: string;
  strengthsList: string[];
  riskFactorsList: string[];
  actionItems: string[];
}

export async function calculateHumanCapitalScore(): Promise<HumanCapitalCalculationResult> {
  const savedReport = await getSavedAiReport();

  if (savedReport) {
    const { classification, color, bg } = getClassificationDetails(savedReport.humanCapitalScore);
    const baseCr = (savedReport.humanCapitalScore / 100) * 5.8;
    const lifetimeValuationINR = `₹${baseCr.toFixed(2)} Crores`;

    return {
      humanCapitalScore: savedReport.humanCapitalScore,
      overallRating: classification,
      ratingBadgeColor: color,
      ratingBadgeBg: bg,

      strengthIndex: savedReport.subIndices.strengthIndex.score,
      riskIndex: savedReport.subIndices.riskIndex.score,
      growthPotential: savedReport.subIndices.growthPotential.score,
      careerReadiness: savedReport.subIndices.careerReadiness.score,
      financialStability: savedReport.subIndices.financialStability.score,
      leadershipPotential: savedReport.subIndices.leadershipPotential.score,
      learningPotential: savedReport.subIndices.learningPotential.score,

      moduleScores: {
        currentStatus: 85,
        financial: savedReport.subIndices.financialStability.score,
        health: 78,
        skills: savedReport.subIndices.careerReadiness.score,
        assessment: savedReport.subIndices.growthPotential.score,
      },
      weightage: DEFAULT_WEIGHTAGE,
      lifetimeValuationINR,

      executiveSummary: savedReport.executiveSummaryNarrative[0],
      strengthsList: savedReport.topStrengths,
      riskFactorsList: savedReport.topWeaknesses,
      actionItems: savedReport.recommendations.immediate.map((a) => `${a.title} — ${a.description}`),
    };
  }

  // Fallback to Live 3-Layer Evaluation if no report has been saved yet
  const { layer1, layer2, layer3 } = await run3LayerAiEngine();
  const humanCapitalScore = layer2.masterHumanCapitalScore;
  const { classification, color, bg } = getClassificationDetails(humanCapitalScore);
  const baseCr = (humanCapitalScore / 100) * 5.8;
  const lifetimeValuationINR = `₹${baseCr.toFixed(2)} Crores`;

  return {
    humanCapitalScore,
    overallRating: classification,
    ratingBadgeColor: color,
    ratingBadgeBg: bg,

    strengthIndex: layer2.strengthIndex,
    riskIndex: layer2.riskIndex,
    growthPotential: layer2.growthPotential,
    careerReadiness: layer2.careerReadiness,
    financialStability: layer2.financialStability,
    leadershipPotential: layer2.leadershipPotential,
    learningPotential: layer2.learningPotential,

    moduleScores: {
      currentStatus: layer1.profile.cgpa > 0 ? Math.round(layer1.profile.cgpa * 10) : 0,
      financial: layer1.financial.financialScore,
      health: layer1.health.healthCapitalScore,
      skills: layer1.professional.professionalCapitalScore,
      assessment: layer1.assessment.assessmentScore,
    },
    weightage: DEFAULT_WEIGHTAGE,
    lifetimeValuationINR,

    executiveSummary: layer3.executiveSummary,
    strengthsList: layer3.strengths,
    riskFactorsList: layer3.weaknesses,
    actionItems: layer3.actionPlan.map((a) => `${a.week}: ${a.title} — ${a.description}`),
  };
}
