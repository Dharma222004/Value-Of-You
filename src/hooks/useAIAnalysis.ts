/**
 * useAIAnalysis — React Hook for AI Human Values Analysis
 *
 * Manages:
 * - Latest report state
 * - Report history
 * - Generation with animated stage tracking
 * - Error handling
 * - Automatic report loading on mount
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  AIAnalysisReportRecord,
  AnalysisStage,
  ANALYSIS_STAGES,
} from "@/types/ai-analysis";
import {
  generateAIAnalysis,
  fetchLatestReport,
  fetchReportHistory,
} from "@/services/aiAnalysisService";

export interface UseAIAnalysisReturn {
  /** Latest AI analysis report */
  report: AIAnalysisReportRecord | null;
  /** Report generation history */
  reports: AIAnalysisReportRecord[];
  /** Whether a report is currently being generated */
  isGenerating: boolean;
  /** Whether data is being loaded */
  isLoading: boolean;
  /** Current analysis stages with status */
  stages: AnalysisStage[];
  /** Active stage ID (1-7) during generation */
  activeStageId: number;
  /** Error message if generation failed */
  error: string | null;
  /** Whether the latest report was served from cache */
  wasCached: boolean;
  /** Trigger report generation */
  generateReport: (forceRegenerate?: boolean) => Promise<void>;
  /** Load the latest report from database */
  loadReport: () => Promise<void>;
  /** Load report history */
  loadHistory: () => Promise<void>;
  /** Clear current error */
  clearError: () => void;
}

export function useAIAnalysis(): UseAIAnalysisReturn {
  const [report, setReport] = useState<AIAnalysisReportRecord | null>(null);
  const [reports, setReports] = useState<AIAnalysisReportRecord[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStageId, setActiveStageId] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [wasCached, setWasCached] = useState(false);

  // Prevent duplicate generation calls
  const generatingRef = useRef(false);

  // Build stages array with status
  const stages: AnalysisStage[] = ANALYSIS_STAGES.map((stage) => ({
    ...stage,
    status:
      activeStageId === 0
        ? "pending"
        : stage.id < activeStageId
        ? "completed"
        : stage.id === activeStageId
        ? "active"
        : "pending",
  }));

  // ── Load latest report on mount ──
  const loadReport = useCallback(async () => {
    try {
      setIsLoading(true);
      const latestReport = await fetchLatestReport();
      if (latestReport) {
        setReport(latestReport);
      }
    } catch (err) {
      console.error("[useAIAnalysis] Load report error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Load history ──
  const loadHistory = useCallback(async () => {
    try {
      const result = await fetchReportHistory(20);
      if (result.success && result.reports) {
        setReports(result.reports);
      }
    } catch (err) {
      console.error("[useAIAnalysis] Load history error:", err);
    }
  }, []);

  // ── Generate report ──
  const generateReport = useCallback(async (forceRegenerate: boolean = false) => {
    if (generatingRef.current) return;
    generatingRef.current = true;
    setIsGenerating(true);
    setError(null);
    setActiveStageId(1);
    setWasCached(false);

    try {
      const result = await generateAIAnalysis(
        (stageId) => setActiveStageId(stageId),
        forceRegenerate
      );

      if (result.success && result.report) {
        // Set the report from the API response immediately (already persisted via UPSERT)
        setReport(result.report);
        setWasCached(!!result.cached);

        // Verify persistence: re-fetch from database to confirm save
        try {
          const verified = await fetchLatestReport();
          if (verified) {
            setReport(verified); // Use the verified DB record
          }
        } catch {
          // Non-critical: the API response is already displayed
          console.warn("[useAIAnalysis] Post-generation verification fetch failed (non-critical)");
        }

        // Reload history after successful generation
        loadHistory();
      } else {
        setError(result.error || "Failed to generate report.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
      setActiveStageId(0);
      generatingRef.current = false;
    }
  }, [loadHistory]);

  const clearError = useCallback(() => setError(null), []);

  // Auto-load on mount
  useEffect(() => {
    loadReport();
    loadHistory();
  }, [loadReport, loadHistory]);

  return {
    report,
    reports,
    isGenerating,
    isLoading,
    stages,
    activeStageId,
    error,
    wasCached,
    generateReport,
    loadReport,
    loadHistory,
    clearError,
  };
}
