/**
 * AI Analysis Client-Side Service
 *
 * Handles communication with the server-side AI Analysis API.
 * Provides stage-tracking callbacks for the animated loading UI.
 */

import { supabase } from "@/lib/supabase";
import {
  AIAnalysisResponse,
  AIAnalysisHistoryResponse,
  AIAnalysisReportRecord,
  ANALYSIS_STAGES,
} from "@/types/ai-analysis";

// ====================================================================
// Get Access Token
// ====================================================================

async function getAccessToken(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  } catch {
    return null;
  }
}

// ====================================================================
// Generate AI Analysis Report
// ====================================================================

export type StageCallback = (stageId: number) => void;

/**
 * Triggers AI analysis report generation on the server.
 * Provides animated stage progress via the onStageChange callback.
 *
 * @param onStageChange - Called with stage ID (1-7) as analysis progresses
 * @param forceRegenerate - If true, skips the cache and forces a new Groq call
 * @returns The generated or cached report
 */
export async function generateAIAnalysis(
  onStageChange?: StageCallback,
  forceRegenerate: boolean = false
): Promise<AIAnalysisResponse> {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, error: "Not authenticated. Please log in.", errorCode: "AUTH_MISSING" };
  }

  // Simulate stage progression while waiting for the API
  let stageInterval: ReturnType<typeof setInterval> | null = null;
  let currentStage = 1;

  if (onStageChange) {
    onStageChange(1); // Start: Collecting Profile

    stageInterval = setInterval(() => {
      if (currentStage < ANALYSIS_STAGES.length) {
        currentStage++;
        onStageChange(currentStage);
      }
    }, 3000); // Advance stage every 3 seconds
  }

  try {
    const response = await fetch("/api/ai-analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ forceRegenerate }),
    });

    // Clear stage interval before processing response
    if (stageInterval) clearInterval(stageInterval);

    // Set final stage
    if (onStageChange) {
      onStageChange(ANALYSIS_STAGES.length);
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({ error: "Unknown error" }));
      return {
        success: false,
        error: errData.error || `Server error: ${response.status}`,
        errorCode: errData.errorCode || "SERVER_ERROR",
      };
    }

    const data: AIAnalysisResponse = await response.json();
    return data;
  } catch (err: any) {
    if (stageInterval) clearInterval(stageInterval);

    // Network errors
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      return { success: false, error: "Network error. Please check your connection.", errorCode: "NETWORK_ERROR" };
    }

    return {
      success: false,
      error: err.message || "Failed to generate analysis.",
      errorCode: "CLIENT_ERROR",
    };
  }
}

// ====================================================================
// Fetch Report History
// ====================================================================

/**
 * Fetches the user's AI analysis report history from the server.
 *
 * @param limit - Maximum number of reports to return (default 10)
 * @param offset - Pagination offset (default 0)
 */
export async function fetchReportHistory(
  limit: number = 10,
  offset: number = 0
): Promise<AIAnalysisHistoryResponse> {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, error: "Not authenticated", reports: [] };
  }

  try {
    const response = await fetch(
      `/api/ai-analysis/reports?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({ error: "Unknown error" }));
      return { success: false, error: errData.error, reports: [] };
    }

    return await response.json();
  } catch (err: any) {
    return { success: false, error: err.message, reports: [] };
  }
}

/**
 * Fetches the latest AI analysis report for the current user via the server API.
 * Single source of truth: GET /api/ai-analysis (uses Bearer token + RLS).
 */
export async function fetchLatestReport(): Promise<AIAnalysisReportRecord | null> {
  try {
    const token = await getAccessToken();
    if (!token) {
      console.warn("[AIAnalysisService] No access token — user not authenticated");
      return null;
    }

    const response = await fetch("/api/ai-analysis", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`[AIAnalysisService] GET /api/ai-analysis failed: HTTP ${response.status}`);
      return null;
    }

    const resData = await response.json();
    if (resData.success && resData.report) {
      console.log("[AIAnalysisService] ✅ Fetched stored report via server API");
      return resData.report as AIAnalysisReportRecord;
    }

    // No report exists yet (success: true, report: null, status: "PENDING")
    console.log("[AIAnalysisService] No stored report found (status:", resData.status, ")");
    return null;
  } catch (err) {
    console.error("[AIAnalysisService] fetchLatestReport exception:", err);
    return null;
  }
}
