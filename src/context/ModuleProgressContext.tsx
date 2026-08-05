"use client";

/**
 * ModuleProgressContext — Global State Provider
 * ==============================================
 * ENTERPRISE ARCHITECTURE — Single Source of Truth
 *
 * Data flow:
 *   Supabase (module_progress + dashboard_summary)
 *     ↓ fallback
 *   Supabase (module_data) + LocalStorage
 *     ↓
 *   moduleProgressEngine.ts (buildFromModuleProgress or buildGlobalProgressPayload)
 *     ↓
 *   ModuleProgressContext (React Context)
 *     ↓
 *   useModuleProgress() hook
 *     ↓
 *   Sidebar, Overview, Report, AI Engine — all pages
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  ModuleKey,
  ModuleRecordData,
  GlobalProgressPayload,
  buildGlobalProgressPayload,
  buildFromModuleProgress,
} from "@/lib/moduleProgressEngine";
import type { ModuleProgress, DashboardSummary } from "@/types/database";

interface ModuleProgressContextType {
  progress: GlobalProgressPayload;
  loading: boolean;
  refreshProgress: () => Promise<void>;
}

const defaultProgressPayload: GlobalProgressPayload = buildGlobalProgressPayload({
  master_profile: null,
  financial: null,
  skills: null,
  health: null,
  assessments: null,
});

const ModuleProgressContext = createContext<ModuleProgressContextType>({
  progress: defaultProgressPayload,
  loading: true,
  refreshProgress: async () => {},
});

export const ModuleProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<GlobalProgressPayload>(defaultProgressPayload);
  const [loading, setLoading] = useState(true);

  const fetchGlobalProgress = useCallback(async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        setLoading(false);
        return;
      }

      // ── Strategy 1: Try enterprise tables first (module_progress + dashboard_summary) ──
      let usedEnterprisePath = false;

      try {
        const [progressRes, summaryRes, aiEvalRes] = await Promise.all([
          supabase
            .from("module_progress")
            .select("*")
            .eq("user_id", user.id),
          supabase
            .from("dashboard_summary")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle(),
          supabase
            .from("ai_evaluations")
            .select("id")
            .eq("user_id", user.id)
            .limit(1),
        ]);

        const progressRows = (progressRes.data || []) as ModuleProgress[];
        const dashSummary = (summaryRes.data as DashboardSummary) || null;
        const hasAiEval = (aiEvalRes.data || []).length > 0;

        // Use enterprise path if module_progress has rows (migration has been run)
        if (progressRows.length > 0 && !progressRes.error) {
          const payload = buildFromModuleProgress(progressRows, dashSummary, hasAiEval);
          usedEnterprisePath = true;

          console.log("[GLOBAL_PROGRESS_ENGINE] Enterprise Path — module_progress:", {
            userId: user.id,
            completedCount: payload.completedCount,
            overallPercentage: payload.overallPercentage,
            overallScore: payload.overallScore,
            source: dashSummary ? "module_progress + dashboard_summary" : "module_progress",
            modules: {
              profile: payload.modules.master_profile.completed,
              financial: payload.modules.financial.completed,
              skills: payload.modules.skills.completed,
              health: payload.modules.health.completed,
              assessments: payload.modules.assessments.completed,
            },
          });

          setProgress(payload);
        }
      } catch (enterpriseErr) {
        // Enterprise tables may not exist yet — fall through to legacy path
        console.log("[GLOBAL_PROGRESS_ENGINE] Enterprise tables not available, using legacy path");
      }

      // ── Strategy 2: Fallback to module_data + LocalStorage (Legacy) ──
      if (!usedEnterprisePath) {
        const [moduleDataRes, profileRes, aiEvalRes] = await Promise.all([
          supabase.from("module_data").select("module_key, is_completed, data, score").eq("user_id", user.id),
          supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
          supabase.from("ai_evaluations").select("id").eq("user_id", user.id).limit(1),
        ]);

        const profile = profileRes.data;
        const hasAiEval = (aiEvalRes.data || []).length > 0;
        const moduleRows = moduleDataRes.data || [];

        const keys: ModuleKey[] = ["master_profile", "financial", "skills", "health", "assessments"];
        const moduleMap: Record<ModuleKey, ModuleRecordData | null> = {
          master_profile: null, financial: null, skills: null, health: null, assessments: null,
        };

        for (const k of keys) {
          const sbRow = moduleRows.find((r: any) => r.module_key === k);
          if (sbRow) {
            moduleMap[k] = sbRow;
          } else if (typeof window !== "undefined") {
            try {
              const raw = localStorage.getItem(`hc_module_data_${user.id}_${k}`);
              if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed) moduleMap[k] = parsed;
              }
            } catch (e) {}
          }
        }

        const payload = buildGlobalProgressPayload(
          moduleMap,
          profile?.human_value_score || 0,
          hasAiEval
        );

        console.log("[GLOBAL_PROGRESS_ENGINE] Legacy Path — module_data:", {
          userId: user.id,
          completedCount: payload.completedCount,
          overallPercentage: payload.overallPercentage,
          overallScore: payload.overallScore,
          modules: {
            profile: payload.modules.master_profile.completed,
            financial: payload.modules.financial.completed,
            skills: payload.modules.skills.completed,
            health: payload.modules.health.completed,
            assessments: payload.modules.assessments.completed,
          },
        });

        setProgress(payload);
      }
    } catch (err) {
      console.error("[GLOBAL_PROGRESS_ENGINE] Sync error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchGlobalProgress();

    const handleProgressUpdate = () => {
      if (isMounted) fetchGlobalProgress();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("hc_module_saved", handleProgressUpdate);
      window.addEventListener("hc_assessment_updated", handleProgressUpdate);
      window.addEventListener("hc_telemetry_updated", handleProgressUpdate);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (isMounted && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED")) {
        fetchGlobalProgress();
      }
    });

    return () => {
      isMounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("hc_module_saved", handleProgressUpdate);
        window.removeEventListener("hc_assessment_updated", handleProgressUpdate);
        window.removeEventListener("hc_telemetry_updated", handleProgressUpdate);
      }
      authListener.subscription.unsubscribe();
    };
  }, [fetchGlobalProgress]);

  return (
    <ModuleProgressContext.Provider value={{ progress, loading, refreshProgress: fetchGlobalProgress }}>
      {children}
    </ModuleProgressContext.Provider>
  );
};

export const useModuleProgressContext = () => useContext(ModuleProgressContext);
