import { supabase } from "@/lib/supabase";
import { ModuleData, FinancialProfile } from "@/types/database";

/**
 * Module Data Service — Central Supabase-backed data layer
 *
 * Replaces ALL localStorage usage (setScopedItem/getScopedItem) across the 5 modules:
 * - master_profile (CurrentStatusWizard)
 * - financial (FinancialModule)
 * - skills (SkillsModule)
 * - health (HealthModule)
 * - assessments (AssessmentsModule)
 *
 * Every save/load goes through Supabase `module_data` table.
 * RLS ensures user isolation.
 */

export type ModuleKey = "master_profile" | "financial" | "skills" | "health" | "assessments";

// ====================================================================
// Production-Safe Debug Logger (easy to remove later)
// ====================================================================
const DB_DEBUG = true; // Set to false to silence debug logs

function dbLog(
  operation: string,
  table: string,
  details: Record<string, any>
) {
  if (!DB_DEBUG) return;
  const status = details.error ? "❌ FAILED" : "✅ SUCCESS";
  console.log(
    `[DB_DEBUG] ${operation} | table: ${table} | status: ${status}`,
    details
  );
  if (details.error) {
    console.error(
      `[DB_DEBUG] ${operation} ERROR DETAIL:`,
      {
        table,
        errorMessage: details.error?.message || details.error,
        errorCode: details.error?.code,
        errorHint: details.error?.hint,
        errorDetails: details.error?.details,
        userId: details.userId,
        moduleKey: details.moduleKey,
      }
    );
  }
}

// ====================================================================
// Core CRUD Operations
// ====================================================================

// Helper for LocalStorage fallback
function getLocalKey(userId: string, moduleKey: string) {
  return `hc_module_data_${userId}_${moduleKey}`;
}

/**
 * Save module data to Supabase (with LocalStorage backup & profiles auto-update).
 * Uses upsert (insert on conflict update) to handle both create and update.
 */
export async function saveModuleData(
  userId: string,
  moduleKey: ModuleKey,
  data: Record<string, any>,
  isCompleted: boolean = false,
  score: number = 0
): Promise<ModuleData | null> {
  if (!userId) {
    dbLog("saveModuleData", "module_data", { error: "No userId provided", userId: null, moduleKey });
    return null;
  }

  const fallbackRecord: ModuleData = {
    id: `local-${moduleKey}`,
    user_id: userId,
    module_key: moduleKey,
    data,
    is_completed: isCompleted,
    score,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // 1. Save to LocalStorage fallback immediately
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(getLocalKey(userId, moduleKey), JSON.stringify(fallbackRecord));
    } catch (e) {
      console.warn("LocalStorage fallback save error:", e);
    }
  }

  // 2. If master_profile, also sync full_name to Supabase public.profiles table
  if (moduleKey === "master_profile" && data?.personalProfile) {
    const fullName = `${data.personalProfile.firstName || ""} ${data.personalProfile.lastName || ""}`.trim();
    if (fullName) {
      supabase.from("profiles").update({ full_name: fullName, updated_at: new Date().toISOString() }).eq("id", userId).then();
    }
  }

  // 3. Attempt Supabase upsert (module_data — existing table)
  try {
    const payload = {
      user_id: userId,
      module_key: moduleKey,
      data,
      is_completed: isCompleted,
      score,
      updated_at: new Date().toISOString(),
    };

    dbLog("saveModuleData", "module_data", { userId, moduleKey, payloadKeys: Object.keys(payload), isCompleted, score });

    const { data: result, error } = await supabase
      .from("module_data")
      .upsert(payload, { onConflict: "user_id,module_key" })
      .select()
      .single();

    if (error) {
      dbLog("saveModuleData", "module_data", { error, userId, moduleKey });
    } else {
      dbLog("saveModuleData", "module_data", { userId, moduleKey, resultId: (result as any)?.id, error: null });
    }

    // 4. Also upsert module_progress (enterprise table) — the DB trigger on module_data
    // handles this automatically, but we also do it here for immediate consistency
    // when the trigger hasn't been deployed yet.
    try {
      const progressPayload = {
        user_id: userId,
        module_key: moduleKey,
        status: isCompleted ? "completed" : (Object.keys(data).length > 0 ? "in_progress" : "not_started"),
        completion_percentage: isCompleted ? 100 : (Object.keys(data).length > 0 ? 50 : 0),
        score: score,
        started_at: new Date().toISOString(),
        completed_at: isCompleted ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      await supabase
        .from("module_progress")
        .upsert(progressPayload, { onConflict: "user_id,module_key" });

      dbLog("saveModuleData", "module_progress (enterprise sync)", { userId, moduleKey, status: progressPayload.status, error: null });

      // 5. Refresh dashboard_summary via RPC (if available)
      if (isCompleted) {
        try {
          await supabase.rpc("refresh_dashboard_summary", { p_user_id: userId });
          dbLog("saveModuleData", "refresh_dashboard_summary RPC", { userId, error: null });
        } catch (rpcErr) {
          // RPC may not exist yet — this is fine during migration
          dbLog("saveModuleData", "refresh_dashboard_summary RPC (not available)", { userId, error: rpcErr });
        }
      }
    } catch (progressErr) {
      // module_progress table may not exist yet — this is fine during migration
      dbLog("saveModuleData", "module_progress (enterprise table not yet deployed)", { userId, moduleKey, error: progressErr });
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hc_module_saved", { detail: { moduleKey } }));
    }

    return (result as ModuleData) || fallbackRecord;
  } catch (err: any) {
    dbLog("saveModuleData", "module_data", { error: err, userId, moduleKey });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hc_module_saved", { detail: { moduleKey } }));
    }
    return fallbackRecord;
  }
}

/**
 * Load module data from Supabase for a specific module (with LocalStorage fallback).
 */
export async function loadModuleData(
  userId: string,
  moduleKey: ModuleKey
): Promise<Record<string, any> | null> {
  if (!userId) return null;

  // 1. Try Supabase query
  try {
    const { data, error } = await supabase
      .from("module_data")
      .select("*")
      .eq("user_id", userId)
      .eq("module_key", moduleKey)
      .maybeSingle();

    if (!error && data && data.data) {
      dbLog("loadModuleData", "module_data", { userId, moduleKey, found: true, error: null });
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(getLocalKey(userId, moduleKey), JSON.stringify(data));
        } catch (e) {}
      }
      return data.data;
    }
  } catch (err: any) {
    dbLog("loadModuleData (exception)", "module_data", { error: err, userId, moduleKey });
  }

  // 2. Fallback to LocalStorage cache
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(getLocalKey(userId, moduleKey));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.data) {
          dbLog("loadModuleData (localStorage fallback)", "module_data", { userId, moduleKey, found: true });
          return parsed.data;
        }
      }
    } catch (e) {}
  }

  return null;
}

/**
 * Load full module record (including metadata like is_completed, score).
 */
export async function loadModuleRecord(
  userId: string,
  moduleKey: ModuleKey
): Promise<ModuleData | null> {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from("module_data")
      .select("*")
      .eq("user_id", userId)
      .eq("module_key", moduleKey)
      .maybeSingle();

    if (error) {
      console.error(`[ModuleDataService] LoadRecord error (${moduleKey}):`, error.message);
      return null;
    }

    return (data as ModuleData) || null;
  } catch (err: any) {
    console.error(`[ModuleDataService] LoadRecord exception (${moduleKey}):`, err);
    return null;
  }
}

/**
 * Load ALL module data for a user in parallel.
 * Returns a map of moduleKey -> data.
 */
export async function loadAllModuleData(
  userId: string
): Promise<Record<ModuleKey, Record<string, any> | null>> {
  const defaultResult: Record<ModuleKey, Record<string, any> | null> = {
    master_profile: null,
    financial: null,
    skills: null,
    health: null,
    assessments: null,
  };

  if (!userId) return defaultResult;

  try {
    const { data, error } = await supabase
      .from("module_data")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("[ModuleDataService] LoadAll error:", error.message);
      return defaultResult;
    }

    const modules = (data || []) as ModuleData[];
    for (const mod of modules) {
      const key = mod.module_key as ModuleKey;
      if (key in defaultResult) {
        defaultResult[key] = mod.data;
      }
    }

    return defaultResult;
  } catch (err: any) {
    console.error("[ModuleDataService] LoadAll exception:", err);
    return defaultResult;
  }
}

/**
 * Load ALL module records for a user (including metadata).
 */
export async function loadAllModuleRecords(
  userId: string
): Promise<Record<ModuleKey, ModuleData | null>> {
  const defaultResult: Record<ModuleKey, ModuleData | null> = {
    master_profile: null,
    financial: null,
    skills: null,
    health: null,
    assessments: null,
  };

  if (!userId) return defaultResult;

  try {
    const { data, error } = await supabase
      .from("module_data")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("[ModuleDataService] LoadAllRecords error:", error.message);
      return defaultResult;
    }

    const modules = (data || []) as ModuleData[];
    for (const mod of modules) {
      const key = mod.module_key as ModuleKey;
      if (key in defaultResult) {
        defaultResult[key] = mod;
      }
    }

    return defaultResult;
  } catch (err: any) {
    console.error("[ModuleDataService] LoadAllRecords exception:", err);
    return defaultResult;
  }
}

// ====================================================================
// Financial Profile — Structured Data Operations
// ====================================================================

/**
 * Save structured financial profile data alongside module_data.
 */
export async function saveFinancialProfile(
  userId: string,
  profile: Omit<FinancialProfile, "id" | "user_id" | "updated_at">
): Promise<FinancialProfile | null> {
  if (!userId) return null;

  try {
    const payload = {
      user_id: userId,
      ...profile,
      updated_at: new Date().toISOString(),
    };

    dbLog("saveFinancialProfile", "financial_profiles", { userId, payloadKeys: Object.keys(payload) });

    const { data, error } = await supabase
      .from("financial_profiles")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .single();

    if (error) {
      dbLog("saveFinancialProfile", "financial_profiles", { error, userId });
      return null;
    }

    dbLog("saveFinancialProfile", "financial_profiles", { userId, resultId: (data as any)?.id, error: null });
    return data as FinancialProfile;
  } catch (err: any) {
    dbLog("saveFinancialProfile", "financial_profiles", { error: err, userId });
    return null;
  }
}

/**
 * Load structured financial profile.
 */
export async function loadFinancialProfile(
  userId: string
): Promise<FinancialProfile | null> {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from("financial_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("[ModuleDataService] LoadFinancialProfile error:", error.message);
      return null;
    }

    return (data as FinancialProfile) || null;
  } catch (err: any) {
    console.error("[ModuleDataService] LoadFinancialProfile exception:", err);
    return null;
  }
}

// ====================================================================
// AI Recommendations — Supabase Operations
// ====================================================================

/**
 * Save AI recommendation to Supabase.
 */
export async function saveAiRecommendation(
  userId: string,
  recommendation: string,
  category: string = "general",
  priority: number = 0,
  metadata: Record<string, any> = {}
): Promise<void> {
  if (!userId) return;

  try {
    dbLog("saveAiRecommendation", "ai_recommendations", { userId, category, priority });

    const { error } = await supabase.from("ai_recommendations").insert([
      {
        user_id: userId,
        recommendation,
        category,
        priority,
        metadata,
        generated_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      dbLog("saveAiRecommendation", "ai_recommendations", { error, userId });
    } else {
      dbLog("saveAiRecommendation", "ai_recommendations", { userId, error: null });
    }
  } catch (err: any) {
    dbLog("saveAiRecommendation", "ai_recommendations", { error: err, userId });
  }
}

/**
 * Load AI recommendations for user.
 */
export async function loadAiRecommendations(
  userId: string,
  limit: number = 20
): Promise<any[]> {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from("ai_recommendations")
      .select("*")
      .eq("user_id", userId)
      .order("generated_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[ModuleDataService] LoadAiRecommendations error:", error.message);
      return [];
    }

    return data || [];
  } catch (err: any) {
    console.error("[ModuleDataService] LoadAiRecommendations exception:", err);
    return [];
  }
}

// ====================================================================
// Learning Progress — Supabase Operations
// ====================================================================

/**
 * Save or update learning progress.
 */
export async function saveLearningProgress(
  userId: string,
  module: string,
  completionPercentage: number,
  lesson?: string
): Promise<void> {
  if (!userId) return;

  try {
    const payload: Record<string, any> = {
      user_id: userId,
      module,
      completion_percentage: completionPercentage,
      updated_at: new Date().toISOString(),
    };
    if (lesson) payload.lesson = lesson;

    dbLog("saveLearningProgress", "learning_progress", { userId, module, completionPercentage });

    const { error } = await supabase
      .from("learning_progress")
      .upsert(payload, { onConflict: "user_id,module" });

    if (error) {
      dbLog("saveLearningProgress", "learning_progress", { error, userId, module });
    } else {
      dbLog("saveLearningProgress", "learning_progress", { userId, module, error: null });
    }
  } catch (err: any) {
    dbLog("saveLearningProgress", "learning_progress", { error: err, userId, module });
  }
}

/**
 * Load all learning progress for a user.
 */
export async function loadLearningProgress(
  userId: string
): Promise<any[]> {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from("learning_progress")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("[ModuleDataService] LoadLearningProgress error:", error.message);
      return [];
    }

    return data || [];
  } catch (err: any) {
    console.error("[ModuleDataService] LoadLearningProgress exception:", err);
    return [];
  }
}

// ====================================================================
// Human Values Tests — Supabase Operations
// ====================================================================

/**
 * Save a human values test result.
 */
export async function saveHumanValuesTest(
  userId: string,
  score: number,
  categoryScores: Record<string, any>,
  level: string = "beginner"
): Promise<void> {
  if (!userId) return;

  try {
    dbLog("saveHumanValuesTest", "human_values_tests", { userId, score, level });

    const { error } = await supabase.from("human_values_tests").insert([
      {
        user_id: userId,
        score,
        category_scores: categoryScores,
        level,
        completed_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      dbLog("saveHumanValuesTest", "human_values_tests", { error, userId });
    } else {
      dbLog("saveHumanValuesTest", "human_values_tests", { userId, score, error: null });
    }
  } catch (err: any) {
    dbLog("saveHumanValuesTest", "human_values_tests", { error: err, userId });
  }
}

/**
 * Load human values test history for a user.
 */
export async function loadHumanValuesTests(
  userId: string,
  limit: number = 10
): Promise<any[]> {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from("human_values_tests")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[ModuleDataService] LoadHumanValuesTests error:", error.message);
      return [];
    }

    return data || [];
  } catch (err: any) {
    console.error("[ModuleDataService] LoadHumanValuesTests exception:", err);
    return [];
  }
}

// ====================================================================
// Helpers
// ====================================================================

/**
 * Get the current authenticated user ID from Supabase session.
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user?.id || null;
    dbLog("getCurrentUserId", "auth.session", { userId, hasSession: !!data.session, error: null });
    return userId;
  } catch (err: any) {
    dbLog("getCurrentUserId", "auth.session", { error: err, userId: null });
    return null;
  }
}
