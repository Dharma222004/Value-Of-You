"use client";

import { useState, useEffect } from "react";
import { AdminAnalyticsMetrics } from "@/types/admin";

export function useAdminAnalytics() {
  const [metrics, setMetrics] = useState<AdminAnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/analytics");
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
      } else {
        setError(data.error || "Failed to load metrics");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch admin metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return { metrics, loading, error, refresh: fetchMetrics };
}
