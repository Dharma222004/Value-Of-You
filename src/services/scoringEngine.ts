/**
 * Human Capital Platform - AI Scoring Engine Service
 * Phase 9 Architecture Implementation
 * 
 * Reusable TypeScript scoring service providing modular calculations,
 * customizable weightages, and 9 core output metrics.
 */

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

export type RatingClassification =
  | "Elite"
  | "Excellent"
  | "Strong"
  | "Developing"
  | "Needs Improvement";

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

  // 7 Key Sub-Indices
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

  // Key Strategic Insights
  strengthsList: string[];
  riskFactorsList: string[];
  actionItems: string[];
}

// --- CLASSIFICATION HELPER ---

export function getRatingClassification(score: number): {
  rating: RatingClassification;
  color: string;
  bg: string;
} {
  if (score >= 90) {
    return {
      rating: "Elite",
      color: "text-purple-400",
      bg: "bg-purple-950/80 border-purple-500/40 text-purple-300",
    };
  } else if (score >= 80) {
    return {
      rating: "Excellent",
      color: "text-sky-400",
      bg: "bg-sky-950/80 border-sky-500/40 text-sky-300",
    };
  } else if (score >= 70) {
    return {
      rating: "Strong",
      color: "text-emerald-400",
      bg: "bg-emerald-950/80 border-emerald-500/40 text-emerald-300",
    };
  } else if (score >= 60) {
    return {
      rating: "Developing",
      color: "text-amber-400",
      bg: "bg-amber-950/80 border-amber-500/40 text-amber-300",
    };
  } else {
    return {
      rating: "Needs Improvement",
      color: "text-rose-400",
      bg: "bg-rose-950/80 border-rose-500/40 text-rose-300",
    };
  }
}

// --- MODULAR MODULE SCORE EXTRACTORS ---

export function fetchModuleScoresFromStorage(): ModuleScores {
  let currentStatus = 84;
  let financial = 79;
  let health = 75;
  let skills = 88;
  let assessment = 85;

  if (typeof window !== "undefined") {
    try {
      // 1. Current Status (Phase 1)
      const rawStatus = localStorage.getItem("human_capital_status_v1");
      if (rawStatus) {
        const parsed = JSON.parse(rawStatus);
        if (parsed.calculatedScore) currentStatus = parsed.calculatedScore;
      }

      // 2. Financial (Phase 2)
      const rawFin = localStorage.getItem("human_capital_financial_v2");
      if (rawFin) {
        const parsed = JSON.parse(rawFin);
        if (parsed.score) financial = parsed.score;
      }

      // 3. Health (Phase 4)
      const rawHealth = localStorage.getItem("human_capital_health_v4");
      if (rawHealth) {
        const parsed = JSON.parse(rawHealth);
        if (parsed.healthScore) health = parsed.healthScore;
      }

      // 4. Skills (Phase 7)
      const rawSkills = localStorage.getItem("human_capital_skills_module_v7");
      if (rawSkills) {
        const parsed = JSON.parse(rawSkills);
        // Estimate skills score from parsed data if present
        if (parsed.technicalSkills && parsed.technicalSkills.length > 0) {
          const techCount = parsed.technicalSkills.length;
          skills = Math.min(98, 65 + techCount * 4);
        }
      }

      // 5. Assessment (Phase 8)
      const rawAssessment = localStorage.getItem("human_capital_assessment_v8_session");
      if (rawAssessment) {
        const parsed = JSON.parse(rawAssessment);
        if (parsed.answers) {
          const answeredCount = Object.keys(parsed.answers).length;
          if (answeredCount > 0) {
            assessment = Math.min(98, 60 + answeredCount * 2.5);
          }
        }
      }
    } catch (e) {
      console.error("Error loading module telemetry for scoring engine", e);
    }
  }

  return {
    currentStatus: Math.round(currentStatus),
    financial: Math.round(financial),
    health: Math.round(health),
    skills: Math.round(skills),
    assessment: Math.round(assessment),
  };
}

// --- MAIN SCORING ENGINE CALCULATION METHOD ---

export function calculateHumanCapitalScore(
  customScores?: Partial<ModuleScores>,
  customWeightage?: Partial<WeightageConfig>
): HumanCapitalCalculationResult {
  const scores: ModuleScores = {
    ...fetchModuleScoresFromStorage(),
    ...customScores,
  };

  const weightage: WeightageConfig = {
    ...DEFAULT_WEIGHTAGE,
    ...customWeightage,
  };

  // Normalize weightages so they sum to 1.0
  const weightSum =
    weightage.currentStatus +
    weightage.financial +
    weightage.health +
    weightage.skills +
    weightage.assessment;

  const wCurrentStatus = weightage.currentStatus / weightSum;
  const wFinancial = weightage.financial / weightSum;
  const wHealth = weightage.health / weightSum;
  const wSkills = weightage.skills / weightSum;
  const wAssessment = weightage.assessment / weightSum;

  // Composite Human Capital Score
  const rawComposite =
    scores.currentStatus * wCurrentStatus +
    scores.financial * wFinancial +
    scores.health * wHealth +
    scores.skills * wSkills +
    scores.assessment * wAssessment;

  const humanCapitalScore = Math.min(100, Math.max(0, Math.round(rawComposite)));

  // Classification
  const { rating, color, bg } = getRatingClassification(humanCapitalScore);

  // 1. Strength Index (0 - 100): High score across top non-vulnerable dimensions
  const strengthIndex = Math.min(
    100,
    Math.round(scores.skills * 0.35 + scores.assessment * 0.35 + scores.financial * 0.3)
  );

  // 2. Risk Index (0 - 100): Inverse metric measuring vulnerability (Lower risk is better, 0-100 scale)
  const vulnerability =
    (100 - scores.financial) * 0.4 +
    (100 - scores.health) * 0.35 +
    (100 - scores.assessment) * 0.25;
  const riskIndex = Math.min(100, Math.max(0, Math.round(vulnerability)));

  // 3. Growth Potential (0 - 100): Learning, skills, and current status trajectory
  const growthPotential = Math.min(
    100,
    Math.round(scores.skills * 0.4 + scores.assessment * 0.35 + scores.currentStatus * 0.25)
  );

  // 4. Career Readiness (0 - 100): Skills, Assessment, and Current Status
  const careerReadiness = Math.min(
    100,
    Math.round(scores.skills * 0.45 + scores.assessment * 0.35 + scores.currentStatus * 0.2)
  );

  // 5. Financial Stability (0 - 100): Financial module score
  const financialStability = scores.financial;

  // 6. Leadership Potential (0 - 100): Assessment decision & soft skills + Status
  const leadershipPotential = Math.min(
    100,
    Math.round(scores.assessment * 0.5 + scores.skills * 0.3 + scores.currentStatus * 0.2)
  );

  // 7. Learning Potential (0 - 100): Skills velocity & assessment learning agility
  const learningPotential = Math.min(
    100,
    Math.round(scores.skills * 0.5 + scores.assessment * 0.4 + scores.health * 0.1)
  );

  // Lifetime Asset Valuation Projection in INR (Formula: Base Net Worth Multiplier * Capital Score Compound)
  const baseCr = (humanCapitalScore / 100) * 5.2; // e.g., 88 -> 4.57 Crores
  const lifetimeValuationINR = `₹${baseCr.toFixed(2)} Crores`;

  // Dynamic Diagnostics
  const strengthsList: string[] = [];
  const riskFactorsList: string[] = [];
  const actionItems: string[] = [];

  if (scores.skills >= 80) strengthsList.push("High Technical & Digital Skill Architecture");
  if (scores.assessment >= 80) strengthsList.push("Superior Cognitive & Decision-Making Resilience");
  if (scores.financial >= 75) strengthsList.push("Solid Financial Runway & Asset Allocation");
  if (scores.health >= 80) strengthsList.push("Optimal Health, Sleep & Physical Discipline Buffer");

  if (scores.financial < 70) {
    riskFactorsList.push("Financial Runway under 6 months liquid buffer");
    actionItems.push("Increase high-yield liquidity reserves to at least 6 months runway.");
  }
  if (scores.health < 70) {
    riskFactorsList.push("Sub-optimal Health telemetry (elevated stress / sleep debt)");
    actionItems.push("Improve recovery discipline: target 7.5+ sleep hours and stress reduction.");
  }
  if (scores.skills < 75) {
    riskFactorsList.push("Skill gap in emerging Generative AI & Cloud infrastructure");
    actionItems.push("Enroll in high-tier AI certifications and build 2 open-source projects.");
  }

  if (strengthsList.length === 0) strengthsList.push("Balanced baseline capabilities across modules");
  if (riskFactorsList.length === 0) riskFactorsList.push("No critical vulnerabilities detected");
  if (actionItems.length === 0) actionItems.push("Maintain current compound growth trajectory and quarterly audits.");

  return {
    humanCapitalScore,
    overallRating: rating,
    ratingBadgeColor: color,
    ratingBadgeBg: bg,

    strengthIndex,
    riskIndex,
    growthPotential,
    careerReadiness,
    financialStability,
    leadershipPotential,
    learningPotential,

    moduleScores: scores,
    weightage,
    lifetimeValuationINR,

    strengthsList,
    riskFactorsList,
    actionItems,
  };
}
