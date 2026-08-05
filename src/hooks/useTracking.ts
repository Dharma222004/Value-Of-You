"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/tracking";
import { EventType, EventMetadata } from "@/types/telemetry";

export function useTracking() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      trackEvent("page_view", { page: pathname });
    }
  }, [pathname]);

  return {
    track: (event: EventType, metadata?: EventMetadata) => trackEvent(event, metadata),
  };
}
