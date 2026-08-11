"use client";

import React from "react";
import { ModuleGateGuard } from "@/components/dashboard/ModuleGateGuard";
import { HealthModule } from "@/components/health/HealthModule";

export default function HealthPage() {
  return (
    <ModuleGateGuard
      moduleKey="health"
      requiredModule="skills"
      requiredLabel="Skills Capital"
      requiredRoute="/dashboard/skills"
    >
      <div className="space-y-6">
        <HealthModule />
      </div>
    </ModuleGateGuard>
  );
}
