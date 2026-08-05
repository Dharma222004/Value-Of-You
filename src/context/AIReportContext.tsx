"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { AIReportRecord, ReportStatus, AIAnalysisReport } from "@/types/ai-analysis";
import { fetchLatestReport, generateAIAnalysis } from "@/services/aiAnalysisService";

export type ModuleTabKey =
  | "human_values"
  | "financial_intelligence"
  | "leadership"
  | "communication"
  | "decision_making"
  | "learning"
  | "growth"
  | "career_intelligence"
  | "emotional_intelligence";

interface AIReportContextType {
  report: AIReportRecord | null;
  reportData: AIAnalysisReport | null;
  status: ReportStatus;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  activeModuleKey: ModuleTabKey;
  setActiveModuleKey: (key: ModuleTabKey) => void;
  activeModuleData: any;
  regenerateReport: () => Promise<void>;
  reloadReport: () => Promise<void>;
  clearError: () => void;
}

const AIReportContext = createContext<AIReportContextType | undefined>(undefined);

export function AIReportProvider({ children }: { children: React.ReactNode }) {
  const [report, setReport] = useState<AIReportRecord | null>(null);
  const [status, setStatus] = useState<ReportStatus>("PENDING");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeModuleKey, setActiveModuleKey] = useState<ModuleTabKey>("human_values");

  // Parse report_json safely
  const reportData: AIAnalysisReport | null = useMemo(() => {
    if (!report?.report_json) return null;
    return typeof report.report_json === "string"
      ? JSON.parse(report.report_json)
      : report.report_json;
  }, [report]);

  // Extract active module section directly from cached report object (Zero API overhead)
  const activeModuleData = useMemo(() => {
    if (!report) return null;

    // 1. Try structured modules map
    if (report.modules && report.modules[activeModuleKey]) {
      return report.modules[activeModuleKey];
    }

    // 2. Try report_json keys
    if (reportData) {
      const map: Record<ModuleTabKey, any> = {
        human_values: reportData.humanValuesAnalysis,
        financial_intelligence: reportData.financialIntelligence,
        leadership: reportData.leadershipPotential,
        communication: reportData.communicationStyle,
        decision_making: reportData.decisionMakingStyle,
        learning: reportData.learningStyle,
        growth: reportData.professionalGrowth,
        career_intelligence: reportData.careerSuitability,
        emotional_intelligence: reportData.emotionalIntelligence,
      };
      return map[activeModuleKey] || null;
    }

    return null;
  }, [report, reportData, activeModuleKey]);

  // Read stored report from Supabase once on mount
  const reloadReport = useCallback(async () => {
    setIsLoading(true);
    try {
      const stored = await fetchLatestReport();
      if (stored) {
        setReport(stored);
        setStatus((stored.status as ReportStatus) || "COMPLETED");
      } else {
        setStatus("PENDING");
      }
    } catch (err: any) {
      console.error("[AIReportContext] Error reading stored report:", err);
      setStatus("FAILED");
      setError(err.message || "Failed to load stored AI report");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Manual explicit regeneration only
  const regenerateReport = useCallback(async () => {
    setIsGenerating(true);
    setStatus("REGENERATING");
    setError(null);

    try {
      const result = await generateAIAnalysis(undefined, true);
      if (result.success && result.report) {
        setReport(result.report);
        setStatus("COMPLETED");
      } else {
        setStatus("FAILED");
        setError(result.error || "Failed to regenerate AI analysis");
      }
    } catch (err: any) {
      setStatus("FAILED");
      setError(err.message || "Unexpected regeneration error");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    reloadReport();
  }, [reloadReport]);

  return (
    <AIReportContext.Provider
      value={{
        report,
        reportData,
        status,
        isLoading,
        isGenerating,
        error,
        activeModuleKey,
        setActiveModuleKey,
        activeModuleData,
        regenerateReport,
        reloadReport,
        clearError,
      }}
    >
      {children}
    </AIReportContext.Provider>
  );
}

export function useAIReport() {
  const ctx = useContext(AIReportContext);
  if (!ctx) {
    throw new Error("useAIReport must be used within an AIReportProvider");
  }
  return ctx;
}
