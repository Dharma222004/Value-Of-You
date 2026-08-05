/**
 * Unified Module Completion & Progress Engine
 * =============================================
 * ENTERPRISE ARCHITECTURE — Single Source of Truth
 *
 * This engine provides TWO build paths:
 * 1. buildFromModuleProgress() — Primary: uses module_progress + dashboard_summary tables
 * 2. buildGlobalProgressPayload() — Fallback: uses module_data JSON blobs (backwards compat)
 *
 * Every page (Sidebar, Overview, Executive Report, AI Engine) consumes GlobalProgressPayload.
 */

import { ModuleProgress, DashboardSummary } from "@/types/database";

export type ModuleKey = "master_profile" | "financial" | "skills" | "health" | "assessments";

export interface ModuleRecordData {
  is_completed?: boolean;
  score?: number;
  data?: Record<string, any> | null;
  updated_at?: string;
}

export interface ModuleEvaluationResult {
  isCompleted: boolean;
  isInProgress: boolean;
  score: number;
  hasData: boolean;
}

export interface ModuleStatusDetail {
  key: ModuleKey;
  label: string;
  shortLabel: string;
  completed: boolean;
  inProgress: boolean;
  unlocked: boolean;
  score: number | null;
}

export interface GlobalProgressPayload {
  completedCount: number;
  totalModules: number;
  overallPercentage: number;
  overallScore: number;
  platformJourney: number;
  aiReportReady: boolean;
  executiveReportReady: boolean;

  modules: {
    master_profile: ModuleStatusDetail;
    financial: ModuleStatusDetail;
    skills: ModuleStatusDetail;
    health: ModuleStatusDetail;
    assessments: ModuleStatusDetail;
  };

  // Backwards compatibility boolean completion flags:
  profileCompleted: boolean;
  financialCompleted: boolean;
  skillsCompleted: boolean;
  healthCompleted: boolean;
  assessmentsCompleted: boolean;
  aiEvaluationCompleted: boolean;

  profileInProgress: boolean;
  financialInProgress: boolean;
  skillsInProgress: boolean;
  healthInProgress: boolean;
  assessmentsInProgress: boolean;

  financialUnlocked: boolean;
  skillsUnlocked: boolean;
  healthUnlocked: boolean;
  assessmentsUnlocked: boolean;
  aiEngineUnlocked: boolean;
  executiveReportUnlocked: boolean;

  // Raw module data records for component pre-population
  moduleRecords: Record<ModuleKey, Record<string, any> | null>;
}

// ====================================================================
// Module Labels (static metadata fallback when modules table unavailable)
// ====================================================================
const MODULE_LABELS: Record<ModuleKey, { label: string; shortLabel: string }> = {
  master_profile: { label: "Personal & Career Profile", shortLabel: "Profile" },
  financial: { label: "Financial Health Intelligence", shortLabel: "Financial" },
  skills: { label: "Professional Capital Engine", shortLabel: "Skills" },
  health: { label: "Health & Lifestyle Capital", shortLabel: "Health" },
  assessments: { label: "Human Values Assessment", shortLabel: "Values" },
};

// ====================================================================
// PRIMARY BUILD PATH: From module_progress rows (Enterprise)
// ====================================================================

/**
 * Builds GlobalProgressPayload from module_progress rows and optional dashboard_summary.
 * This is the PRIMARY path when enterprise tables are available.
 */
export function buildFromModuleProgress(
  progressRows: ModuleProgress[],
  dashboardSummary: DashboardSummary | null = null,
  hasAiEval: boolean = false
): GlobalProgressPayload {
  const findRow = (key: ModuleKey) => progressRows.find((r) => r.module_key === key);

  const pRow = findRow("master_profile");
  const fRow = findRow("financial");
  const sRow = findRow("skills");
  const hRow = findRow("health");
  const aRow = findRow("assessments");

  const profileCompleted = pRow?.status === "completed";
  const profileInProgress = pRow?.status === "in_progress";
  const financialCompleted = fRow?.status === "completed";
  const financialInProgress = fRow?.status === "in_progress";
  const skillsCompleted = sRow?.status === "completed";
  const skillsInProgress = sRow?.status === "in_progress";
  const healthCompleted = hRow?.status === "completed";
  const healthInProgress = hRow?.status === "in_progress";
  const assessmentsCompleted = aRow?.status === "completed";
  const assessmentsInProgress = aRow?.status === "in_progress";

  // Unlocking sequence
  const financialUnlocked = profileCompleted || profileInProgress;
  const skillsUnlocked = financialUnlocked && (financialCompleted || financialInProgress);
  const healthUnlocked = skillsUnlocked && (skillsCompleted || skillsInProgress);
  const assessmentsUnlocked = healthUnlocked && (healthCompleted || healthInProgress);
  const aiEngineUnlocked = assessmentsUnlocked && (assessmentsCompleted || assessmentsInProgress || hasAiEval);
  const executiveReportUnlocked = aiEngineUnlocked;

  // Use dashboard_summary if available, otherwise compute
  let completedCount: number;
  let overallScore: number;

  if (dashboardSummary) {
    completedCount = dashboardSummary.completed_modules;
    overallScore = dashboardSummary.overall_score || dashboardSummary.human_capital_score || 0;
  } else {
    const completed = [profileCompleted, financialCompleted, skillsCompleted, healthCompleted, assessmentsCompleted];
    completedCount = completed.filter(Boolean).length;

    const scores = progressRows
      .filter((r) => r.status === "completed" && r.score > 0)
      .map((r) => r.score);
    overallScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : completedCount > 0 ? 65 : 0;
  }

  const totalModules = 5;
  const overallPercentage = Math.round((completedCount / totalModules) * 100);
  const aiReportReady = dashboardSummary?.ai_ready ?? (completedCount >= 5 || hasAiEval);
  const executiveReportReady = dashboardSummary?.executive_ready ?? (completedCount >= 5 || hasAiEval);

  return {
    completedCount,
    totalModules,
    overallPercentage,
    overallScore,
    platformJourney: overallPercentage,
    aiReportReady,
    executiveReportReady,

    modules: {
      master_profile: {
        key: "master_profile", ...MODULE_LABELS.master_profile,
        completed: profileCompleted, inProgress: profileInProgress,
        unlocked: true, score: pRow?.score || null,
      },
      financial: {
        key: "financial", ...MODULE_LABELS.financial,
        completed: financialCompleted, inProgress: financialInProgress,
        unlocked: financialUnlocked, score: fRow?.score || null,
      },
      skills: {
        key: "skills", ...MODULE_LABELS.skills,
        completed: skillsCompleted, inProgress: skillsInProgress,
        unlocked: skillsUnlocked, score: sRow?.score || null,
      },
      health: {
        key: "health", ...MODULE_LABELS.health,
        completed: healthCompleted, inProgress: healthInProgress,
        unlocked: healthUnlocked, score: hRow?.score || null,
      },
      assessments: {
        key: "assessments", ...MODULE_LABELS.assessments,
        completed: assessmentsCompleted, inProgress: assessmentsInProgress,
        unlocked: assessmentsUnlocked, score: aRow?.score || null,
      },
    },

    profileCompleted, financialCompleted, skillsCompleted, healthCompleted, assessmentsCompleted,
    aiEvaluationCompleted: hasAiEval,
    profileInProgress, financialInProgress, skillsInProgress, healthInProgress, assessmentsInProgress,
    financialUnlocked, skillsUnlocked, healthUnlocked, assessmentsUnlocked,
    aiEngineUnlocked, executiveReportUnlocked,

    moduleRecords: {
      master_profile: null, financial: null, skills: null, health: null, assessments: null,
    },
  };
}

// ====================================================================
// FALLBACK BUILD PATH: From module_data JSON blobs (Legacy)
// ====================================================================

/**
 * Evaluates whether a specific module is completed or in-progress
 * based on Supabase database record or LocalStorage data.
 */
export function evaluateModuleCompletion(
  moduleKey: ModuleKey,
  record: ModuleRecordData | null
): ModuleEvaluationResult {
  if (!record) {
    return { isCompleted: false, isInProgress: false, score: 0, hasData: false };
  }

  const isRowCompleted = Boolean(record.is_completed);
  const data = record.data || {};
  const hasData = Object.keys(data).length > 0;
  const isDataCompleted = Boolean(data.isCompleted || data.submittedAt);
  const score = Number(record.score || data.score || 0);

  let isModuleCompleted = isRowCompleted || isDataCompleted;

  if (!isModuleCompleted && hasData) {
    switch (moduleKey) {
      case "master_profile":
        if (data.personalProfile?.firstName && data.personalProfile?.lastName) isModuleCompleted = true;
        break;
      case "financial":
        if (data.incomeProfile?.monthlyActiveIncome !== undefined && data.incomeProfile?.monthlyActiveIncome !== null) isModuleCompleted = true;
        break;
      case "skills":
        if (data.academic?.degree || data.technicalSkills?.primaryCategory) isModuleCompleted = true;
        break;
      case "health":
        if (data.bodyMetrics?.heightCm && data.bodyMetrics?.weightKg) isModuleCompleted = true;
        break;
      case "assessments":
        if (data.isCompleted || Object.keys(data.answers || {}).length >= 100) isModuleCompleted = true;
        break;
    }
  }

  const isInProgress = !isModuleCompleted && hasData;

  return { isCompleted: isModuleCompleted, isInProgress, score, hasData };
}

/**
 * FALLBACK: Builds GlobalProgressPayload from module_data JSON blobs.
 * Used when module_progress table doesn't exist or has no rows.
 */
export function buildGlobalProgressPayload(
  moduleMap: Record<ModuleKey, ModuleRecordData | null>,
  profileScoreFromDb: number = 0,
  hasAiEval: boolean = false
): GlobalProgressPayload {
  const pEval = evaluateModuleCompletion("master_profile", moduleMap["master_profile"] || null);
  const fEval = evaluateModuleCompletion("financial", moduleMap["financial"] || null);
  const sEval = evaluateModuleCompletion("skills", moduleMap["skills"] || null);
  const hEval = evaluateModuleCompletion("health", moduleMap["health"] || null);
  const aEval = evaluateModuleCompletion("assessments", moduleMap["assessments"] || null);

  const profileCompleted = pEval.isCompleted;
  const profileInProgress = pEval.isInProgress;
  const financialCompleted = fEval.isCompleted;
  const financialInProgress = fEval.isInProgress;
  const skillsCompleted = sEval.isCompleted;
  const skillsInProgress = sEval.isInProgress;
  const healthCompleted = hEval.isCompleted;
  const healthInProgress = hEval.isInProgress;
  const assessmentsCompleted = aEval.isCompleted;
  const assessmentsInProgress = aEval.isInProgress;

  const financialUnlocked = profileCompleted || profileInProgress;
  const skillsUnlocked = financialUnlocked && (financialCompleted || financialInProgress);
  const healthUnlocked = skillsUnlocked && (skillsCompleted || skillsInProgress);
  const assessmentsUnlocked = healthUnlocked && (healthCompleted || healthInProgress);
  const aiEngineUnlocked = assessmentsUnlocked && (assessmentsCompleted || assessmentsInProgress || hasAiEval);
  const executiveReportUnlocked = aiEngineUnlocked;

  const completedList = [profileCompleted, financialCompleted, skillsCompleted, healthCompleted, assessmentsCompleted];
  const completedCount = completedList.filter(Boolean).length;
  const totalModules = 5;
  const overallPercentage = Math.round((completedCount / totalModules) * 100);

  const scores: number[] = [];
  if (profileCompleted && pEval.score > 0) scores.push(pEval.score);
  if (financialCompleted && fEval.score > 0) scores.push(fEval.score);
  if (skillsCompleted && sEval.score > 0) scores.push(sEval.score);
  if (healthCompleted && hEval.score > 0) scores.push(hEval.score);
  if (assessmentsCompleted && aEval.score > 0) scores.push(aEval.score);

  let overallScore = profileScoreFromDb || 0;
  if (scores.length > 0) {
    overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  } else if (completedCount > 0) {
    overallScore = 65;
  }

  const aiReportReady = completedCount >= 5 || hasAiEval;
  const executiveReportReady = completedCount >= 5 || hasAiEval;

  const moduleRecords: Record<ModuleKey, Record<string, any> | null> = {
    master_profile: moduleMap["master_profile"]?.data || null,
    financial: moduleMap["financial"]?.data || null,
    skills: moduleMap["skills"]?.data || null,
    health: moduleMap["health"]?.data || null,
    assessments: moduleMap["assessments"]?.data || null,
  };

  return {
    completedCount, totalModules, overallPercentage, overallScore,
    platformJourney: overallPercentage, aiReportReady, executiveReportReady,

    modules: {
      master_profile: {
        key: "master_profile", ...MODULE_LABELS.master_profile,
        completed: profileCompleted, inProgress: profileInProgress,
        unlocked: true, score: pEval.score || null,
      },
      financial: {
        key: "financial", ...MODULE_LABELS.financial,
        completed: financialCompleted, inProgress: financialInProgress,
        unlocked: financialUnlocked, score: fEval.score || null,
      },
      skills: {
        key: "skills", ...MODULE_LABELS.skills,
        completed: skillsCompleted, inProgress: skillsInProgress,
        unlocked: skillsUnlocked, score: sEval.score || null,
      },
      health: {
        key: "health", ...MODULE_LABELS.health,
        completed: healthCompleted, inProgress: healthInProgress,
        unlocked: healthUnlocked, score: hEval.score || null,
      },
      assessments: {
        key: "assessments", ...MODULE_LABELS.assessments,
        completed: assessmentsCompleted, inProgress: assessmentsInProgress,
        unlocked: assessmentsUnlocked, score: aEval.score || null,
      },
    },

    profileCompleted, financialCompleted, skillsCompleted, healthCompleted, assessmentsCompleted,
    aiEvaluationCompleted: hasAiEval,
    profileInProgress, financialInProgress, skillsInProgress, healthInProgress, assessmentsInProgress,
    financialUnlocked, skillsUnlocked, healthUnlocked, assessmentsUnlocked,
    aiEngineUnlocked, executiveReportUnlocked,
    moduleRecords,
  };
}
