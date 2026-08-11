"use client";

import React from "react";
import { ModuleGateGuard } from "@/components/dashboard/ModuleGateGuard";
import { AssessmentsModule } from "@/components/assessments/AssessmentsModule";

export default function AssessmentsPage() {
  return (
    <ModuleGateGuard
      moduleKey="assessments"
      requiredModule="health"
      requiredLabel="Health Capital"
      requiredRoute="/dashboard/health"
    >
      <div className="space-y-6">
        <AssessmentsModule />
      </div>
    </ModuleGateGuard>
  );
}
