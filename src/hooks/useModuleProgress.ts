"use client";

/**
 * useModuleProgress — Global Progress Hook
 * ==========================================
 * Consumes ModuleProgressContext to provide a single, unified
 * GlobalProgressPayload to any component in the Dashboard tree.
 *
 * Every page (Sidebar, Overview, Report, AI Engine) uses this hook.
 * No page should ever calculate completion independently.
 */

import { useModuleProgressContext } from "@/context/ModuleProgressContext";
import type { GlobalProgressPayload } from "@/lib/moduleProgressEngine";

export type { GlobalProgressPayload };

export function useModuleProgress() {
  const { progress, loading, refreshProgress } = useModuleProgressContext();

  return {
    progressState: progress,
    progress,
    loading,
    refreshProgress,
  };
}
