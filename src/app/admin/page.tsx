"use client";

import React from "react";
import { AdminAnalyticsView } from "@/components/admin/AdminAnalyticsView";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminPage() {
  const { metrics, loading, error } = useAdminAnalytics();

  if (loading) {
    return (
      <div className="space-y-6 py-6 max-w-7xl mx-auto px-4">
        <Skeleton className="w-full h-44" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="w-full h-80" />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
          <h3 className="text-lg font-bold">Admin Analytics Error</h3>
          <p className="text-sm mt-1">{error || "Failed to load admin metrics."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <AdminAnalyticsView metrics={metrics} />
    </div>
  );
}
