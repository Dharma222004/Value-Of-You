/**
 * Human Capital Platform - Centralized Dashboard Telemetry Service
 * Inspects saved LocalStorage data across all 5 modules to provide 100% dynamic,
 * state-machine aware metrics (Empty, Partial, Completed states).
 */

import { calculateFinancialHealthMetrics, formatINR } from "@/lib/financialEngine";
import { calculateProfessionalCapitalScore } from "@/lib/professionalCapitalEngine";
import { loadAllModuleRecords, getCurrentUserId, ModuleKey } from "@/services/moduleDataService";
import { ModuleData } from "@/types/database";
import { FinancialModuleState } from "@/types/financial";
import { ProfessionalCapitalState } from "@/types/professionalCapital";

export interface ModuleTelemetryStatus {
  id: number;
  key: string;
  name: string;
  shortName: string;
  status: "completed" | "in-progress" | "not-started";
  completionPercentage: number;
  score: number | null;
  route: string;
}

export interface DashboardTelemetry {
  mounted: boolean;
  userName: string;
  userEmail: string;
  userInitials: string;

  modules: {
    module1: ModuleTelemetryStatus; // Master Profile
    module2: ModuleTelemetryStatus; // Financial Health
    module3: ModuleTelemetryStatus; // Professional Capital
    module4: ModuleTelemetryStatus; // Health & Lifestyle
    module5: ModuleTelemetryStatus; // Human Assessments
  };

  completedCount: number;
  overallCompletionPercentage: number;
  isAllCompleted: boolean;
  compositeHumanCapitalScore: number | null;
  compositeRating: string | null;
  compositeRatingBg: string | null;
  riskIndex: number | null;
  strengthIndex: number | null;

  financial: {
    isCompleted: boolean;
    netWorth: number | null;
    netWorthFormatted: string;
    monthlyIncome: number | null;
    monthlySavings: number | null;
    monthlyCashFlow: number | null;
    savingsRate: number | null;
    debtRatio: number | null;
    financialScore: number | null;
  };

  professional: {
    isCompleted: boolean;
    professionalCapitalScore: number | null;
    employabilityIndex: number | null;
    aiReadinessScore: number | null;
    leadershipScore: number | null;
  };

  health: {
    isCompleted: boolean;
    healthScore: number | null;
  };

  assessment: {
    isCompleted: boolean;
    assessmentScore: number | null;
  };

  nextRecommendedModule: {
    name: string;
    route: string;
    buttonText: string;
  } | null;
}

export async function getDashboardTelemetry(): Promise<DashboardTelemetry> {
  if (typeof window === "undefined") {
    return {
      mounted: false,
      userName: "User",
      userEmail: "user@human-capital.ai",
      userInitials: "HC",
      modules: {
        module1: { id: 1, key: "m1", name: "Personal & Professional Profile", shortName: "Profile", status: "not-started", completionPercentage: 0, score: null, route: "/dashboard/career" },
        module2: { id: 2, key: "m2", name: "Financial Health Intelligence", shortName: "Financial", status: "not-started", completionPercentage: 0, score: null, route: "/dashboard/financial" },
        module3: { id: 3, key: "m3", name: "Professional Capital Intelligence", shortName: "Skills", status: "not-started", completionPercentage: 0, score: null, route: "/dashboard/skills" },
        module4: { id: 4, key: "m4", name: "Health & Lifestyle", shortName: "Health", status: "not-started", completionPercentage: 0, score: null, route: "/dashboard/health" },
        module5: { id: 5, key: "m5", name: "Human Assessments", shortName: "Assessments", status: "not-started", completionPercentage: 0, score: null, route: "/dashboard/assessments" },
      },
      completedCount: 0,
      overallCompletionPercentage: 0,
      isAllCompleted: false,
      compositeHumanCapitalScore: null,
      compositeRating: null,
      compositeRatingBg: null,
      riskIndex: null,
      strengthIndex: null,
      financial: { isCompleted: false, netWorth: null, netWorthFormatted: "Not Available", monthlyIncome: null, monthlySavings: null, monthlyCashFlow: null, savingsRate: null, debtRatio: null, financialScore: null },
      professional: { isCompleted: false, professionalCapitalScore: null, employabilityIndex: null, aiReadinessScore: null, leadershipScore: null },
      health: { isCompleted: false, healthScore: null },
      assessment: { isCompleted: false, assessmentScore: null },
      nextRecommendedModule: { name: "Personal & Professional Profile", route: "/dashboard/career", buttonText: "Start Master Profile" },
    };
  }

  // --- 1. User Info ---
  let userName = "User";
  let userEmail = "";

  // Load all module records from Supabase
  const userId = await getCurrentUserId();
  if (!userId) {
    return {
      mounted: true,
      userName,
      userEmail,
      userInitials: "HC",
      modules: {
        module1: { id: 1, key: "m1", name: "Personal & Professional Profile", shortName: "Profile", status: "not-started", completionPercentage: 0, score: null, route: "/dashboard/career" },
        module2: { id: 2, key: "m2", name: "Financial Health Intelligence", shortName: "Financial", status: "not-started", completionPercentage: 0, score: null, route: "/dashboard/financial" },
        module3: { id: 3, key: "m3", name: "Professional Capital Intelligence", shortName: "Skills", status: "not-started", completionPercentage: 0, score: null, route: "/dashboard/skills" },
        module4: { id: 4, key: "m4", name: "Health & Lifestyle", shortName: "Health", status: "not-started", completionPercentage: 0, score: null, route: "/dashboard/health" },
        module5: { id: 5, key: "m5", name: "Human Assessments", shortName: "Assessments", status: "not-started", completionPercentage: 0, score: null, route: "/dashboard/assessments" },
      },
      completedCount: 0,
      overallCompletionPercentage: 0,
      isAllCompleted: false,
      compositeHumanCapitalScore: null,
      compositeRating: null,
      compositeRatingBg: null,
      riskIndex: null,
      strengthIndex: null,
      financial: { isCompleted: false, netWorth: null, netWorthFormatted: "Not Available", monthlyIncome: null, monthlySavings: null, monthlyCashFlow: null, savingsRate: null, debtRatio: null, financialScore: null },
      professional: { isCompleted: false, professionalCapitalScore: null, employabilityIndex: null, aiReadinessScore: null, leadershipScore: null },
      health: { isCompleted: false, healthScore: null },
      assessment: { isCompleted: false, assessmentScore: null },
      nextRecommendedModule: { name: "Personal & Professional Profile", route: "/dashboard/career", buttonText: "Start Master Profile" },
    };
  }

  const allRecords = await loadAllModuleRecords(userId);

  const parsedMaster = allRecords.master_profile?.data || null;
  if (parsedMaster) {
    try {
      const fn = parsedMaster.personalProfile?.firstName?.trim();
      const ln = parsedMaster.personalProfile?.lastName?.trim();
      if (fn || ln) userName = `${fn} ${ln}`.trim();
      if (parsedMaster.contactInformation?.email) userEmail = parsedMaster.contactInformation.email;
    } catch (e) {}
  }
  const userInitials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "HC";

  // --- 2. Inspect Module 1 (Master Profile) ---
  let m1Status: "completed" | "in-progress" | "not-started" = "not-started";
  let m1Pct = 0;
  let m1Score: number | null = null;
  if (parsedMaster) {
    try {
      if (parsedMaster.isCompleted || (parsedMaster.personalProfile?.firstName && parsedMaster.personalProfile.lastName)) {
        m1Pct = 100;
        m1Status = "completed";
        m1Score = 88;
      } else if (parsedMaster.personalProfile?.firstName || parsedMaster.primaryRole) {
        m1Pct = 45;
        m1Status = "in-progress";
        m1Score = 50;
      }
    } catch (e) {}
  }

  // --- 3. Inspect Module 2 (Financial Health) ---
  let m2Status: "completed" | "in-progress" | "not-started" = "not-started";
  let m2Pct = 0;
  let m2Score: number | null = null;
  let finData = {
    isCompleted: false,
    netWorth: null as number | null,
    netWorthFormatted: "Not Completed",
    monthlyIncome: null as number | null,
    monthlySavings: null as number | null,
    monthlyCashFlow: null as number | null,
    savingsRate: null as number | null,
    debtRatio: null as number | null,
    financialScore: null as number | null,
  };

  const parsedFin = allRecords.financial?.data || null;
  if (parsedFin) {
    try {
      if (parsedFin.incomeProfile) {
        const fMetrics = calculateFinancialHealthMetrics(parsedFin as unknown as FinancialModuleState);
        m2Score = fMetrics.financialHealthScore;
        const hasInputs = parsedFin.isCompleted || parsedFin.incomeProfile.monthlyActiveIncome > 0 || fMetrics.netWorth !== 0 || (parsedFin.investments && parsedFin.investments.length > 0);
        if (hasInputs) {
          m2Status = "completed";
          m2Pct = 100;
          finData = {
            isCompleted: true,
            netWorth: fMetrics.netWorth,
            netWorthFormatted: formatINR(fMetrics.netWorth),
            monthlyIncome: fMetrics.totalMonthlyIncome,
            monthlySavings: fMetrics.totalSavingsBalance,
            monthlyCashFlow: fMetrics.totalMonthlyCashFlow,
            savingsRate: fMetrics.savingsRate,
            debtRatio: fMetrics.debtToIncomeRatio,
            financialScore: fMetrics.financialHealthScore,
          };
        } else {
          m2Status = "in-progress";
          m2Pct = 35;
        }
      }
    } catch (e) {}
  }

  // --- 4. Inspect Module 3 (Professional Capital) ---
  let m3Status: "completed" | "in-progress" | "not-started" = "not-started";
  let m3Pct = 0;
  let m3Score: number | null = null;
  let profData = {
    isCompleted: false,
    professionalCapitalScore: null as number | null,
    employabilityIndex: null as number | null,
    aiReadinessScore: null as number | null,
    leadershipScore: null as number | null,
  };

  const parsedSkills = allRecords.skills?.data || null;
  if (parsedSkills) {
    try {
      if (parsedSkills.academic) {
        const pMetrics = calculateProfessionalCapitalScore(parsedSkills as unknown as ProfessionalCapitalState);
        m3Score = pMetrics.professionalCapitalScore;
        const hasInputs = parsedSkills.isCompleted || parsedSkills.academic.degree || (parsedSkills.technicalSkills && parsedSkills.technicalSkills.length > 0) || (parsedSkills.projects && parsedSkills.projects.length > 0);
        if (hasInputs) {
          m3Status = "completed";
          m3Pct = 100;
          profData = {
            isCompleted: true,
            professionalCapitalScore: pMetrics.professionalCapitalScore,
            employabilityIndex: pMetrics.employabilityIndex,
            aiReadinessScore: pMetrics.aiReadinessScore,
            leadershipScore: pMetrics.scores.leadership,
          };
        } else {
          m3Status = "in-progress";
          m3Pct = 40;
        }
      }
    } catch (e) {}
  }

  // --- 5. Inspect Module 4 (Health) ---
  let m4Status: "completed" | "in-progress" | "not-started" = "not-started";
  let m4Pct = 0;
  let m4Score: number | null = null;
  const parsedHealth = allRecords.health?.data || null;
  if (parsedHealth) {
    try {
      if (parsedHealth.bodyMetrics) {
        const { calculateHealthCapitalScore } = require("@/lib/healthCapitalEngine");
        const hMetrics = calculateHealthCapitalScore(parsedHealth);
        m4Score = hMetrics.healthCapitalScore;
        const hasInputs = parsedHealth.isCompleted || parsedHealth.bodyMetrics.heightCm > 0 || (parsedHealth.physicalActivity && parsedHealth.physicalActivity.workoutFrequencyPerWeek > 0) || (parsedHealth.sleepIntelligence && parsedHealth.sleepIntelligence.averageSleepHoursPerNight > 0) || hMetrics.healthCapitalScore > 0;
        if (hasInputs) {
          m4Status = "completed";
          m4Pct = 100;
        } else {
          m4Status = "in-progress";
          m4Pct = 35;
        }
      } else if (parsedHealth.healthScore || parsedHealth.isCompleted) {
        m4Score = parsedHealth.healthScore || 83;
        m4Pct = 100;
        m4Status = "completed";
      }
    } catch (e) {}
  }

  // --- 6. Inspect Module 5 (Assessments) ---
  let m5Status: "completed" | "in-progress" | "not-started" = "not-started";
  let m5Pct = 0;
  let m5Score: number | null = null;
  let parsedAssess = allRecords.assessments?.data || null;

  if (parsedAssess) {
    try {
      if (parsedAssess.answers) {
        const { calculateAssessmentMetrics } = require("@/lib/assessmentEngine");
        const aMetrics = calculateAssessmentMetrics(parsedAssess);
        const answeredCount = Object.keys(parsedAssess.answers).length;
        m5Pct = Math.min(100, Math.round((answeredCount / 130) * 100));

        const isAllStagesDone =
          Boolean(parsedAssess.isCompleted) ||
          (Boolean(parsedAssess.isPersonalityCompleted) &&
            Boolean(parsedAssess.isMindsetCompleted) &&
            Boolean(parsedAssess.isDecisionCompleted) &&
            Boolean(parsedAssess.isAwarenessCompleted) &&
            Boolean(parsedAssess.isAptitudeCompleted) &&
            Boolean(parsedAssess.isCommunicationCompleted)) ||
          answeredCount >= 130;

        if (isAllStagesDone || answeredCount >= 130) {
          m5Status = "completed";
          m5Pct = 100;
          m5Score = aMetrics.assessmentScore;
        } else if (answeredCount > 0) {
          m5Status = "in-progress";
        }
      }
    } catch (e) {}
  }

  // --- 7. Aggregate Overall Dashboard Metrics ---
  const modulesList = [
    { status: m1Status, pct: m1Pct, score: m1Score },
    { status: m2Status, pct: m2Pct, score: m2Score },
    { status: m3Status, pct: m3Pct, score: m3Score },
    { status: m4Status, pct: m4Pct, score: m4Score },
    { status: m5Status, pct: m5Pct, score: m5Score },
  ];

  const completedCount = modulesList.filter((m) => m.status === "completed").length;
  const overallCompletionPercentage = Math.round(
    modulesList.reduce((acc, curr) => acc + curr.pct, 0) / 5
  );
  const isAllCompleted = completedCount === 5;

  // Composite Score Calculation (Only using completed module scores)
  const completedScores = modulesList
    .map((m) => m.score)
    .filter((s): s is number => s !== null && s > 0);

  const compositeHumanCapitalScore =
    completedScores.length > 0
      ? Math.round(completedScores.reduce((a, b) => a + b, 0) / completedScores.length)
      : null;

  let compositeRating: string | null = null;
  let compositeRatingBg: string | null = null;
  if (compositeHumanCapitalScore !== null) {
    if (compositeHumanCapitalScore >= 85) {
      compositeRating = "Elite Human Capital";
      compositeRatingBg = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    } else if (compositeHumanCapitalScore >= 70) {
      compositeRating = "High Performing Capital";
      compositeRatingBg = "bg-purple-500/20 text-purple-400 border-purple-500/30";
    } else if (compositeHumanCapitalScore >= 50) {
      compositeRating = "Developing Capital";
      compositeRatingBg = "bg-amber-500/20 text-amber-400 border-amber-500/30";
    } else {
      compositeRating = "High Growth Potential";
      compositeRatingBg = "bg-sky-500/20 text-sky-400 border-sky-500/30";
    }
  }

  // Next Recommended Action
  let nextRecommendedModule: { name: string; route: string; buttonText: string } | null = null;
  if (m1Status !== "completed") {
    nextRecommendedModule = { name: "Personal & Professional Profile", route: "/dashboard/career", buttonText: "Complete Master Profile" };
  } else if (m2Status !== "completed") {
    nextRecommendedModule = { name: "Financial Health Intelligence", route: "/dashboard/financial", buttonText: "Assess Financial Health" };
  } else if (m3Status !== "completed") {
    nextRecommendedModule = { name: "Professional Capital Intelligence", route: "/dashboard/skills", buttonText: "Evaluate Professional Skills" };
  } else if (m4Status !== "completed") {
    nextRecommendedModule = { name: "Health & Lifestyle", route: "/dashboard/health", buttonText: "Complete Health Assessment" };
  } else if (m5Status !== "completed") {
    nextRecommendedModule = { name: "Human Assessment Engine", route: "/dashboard/assessments", buttonText: "Take Behavioral Assessment" };
  }

  return {
    mounted: true,
    userName,
    userEmail,
    userInitials,
    modules: {
      module1: { id: 1, key: "m1", name: "Personal & Professional Profile", shortName: "Profile", status: m1Status, completionPercentage: m1Pct, score: m1Score, route: "/dashboard/career" },
      module2: { id: 2, key: "m2", name: "Financial Health Intelligence", shortName: "Financial", status: m2Status, completionPercentage: m2Pct, score: m2Score, route: "/dashboard/financial" },
      module3: { id: 3, key: "m3", name: "Professional Capital Intelligence", shortName: "Skills", status: m3Status, completionPercentage: m3Pct, score: m3Score, route: "/dashboard/skills" },
      module4: { id: 4, key: "m4", name: "Health & Lifestyle", shortName: "Health", status: m4Status, completionPercentage: m4Pct, score: m4Score, route: "/dashboard/health" },
      module5: { id: 5, key: "m5", name: "Human Assessment Engine", shortName: "Assessments", status: m5Status, completionPercentage: m5Pct, score: m5Score, route: "/dashboard/assessments" },
    },
    completedCount,
    overallCompletionPercentage,
    isAllCompleted,
    compositeHumanCapitalScore,
    compositeRating,
    compositeRatingBg,
    riskIndex: compositeHumanCapitalScore !== null ? Math.max(10, 100 - compositeHumanCapitalScore) : null,
    strengthIndex: compositeHumanCapitalScore,
    financial: finData,
    professional: profData,
    health: { isCompleted: m4Status === "completed", healthScore: m4Score },
    assessment: { isCompleted: m5Status === "completed", assessmentScore: m5Score },
    nextRecommendedModule,
  };
}
