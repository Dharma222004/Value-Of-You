"use client";

import React, { useEffect } from "react";
import { useTracking } from "@/hooks/useTracking";

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Automatically attaches page_view listeners
  useTracking();

  useEffect(() => {
    // Session keepalive tracker
    const interval = setInterval(() => {
      // Optional session ping
    }, 50000);
    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
};
