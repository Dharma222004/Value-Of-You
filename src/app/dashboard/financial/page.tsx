"use client";

import React from "react";
import { ModuleGateGuard } from "@/components/dashboard/ModuleGateGuard";
import { FinancialModule } from "@/components/financial/FinancialModule";

export default function FinancialPage() {
  return (
    <ModuleGateGuard
      moduleKey="financial"
      requiredModule="master_profile"
      requiredLabel="Profile"
      requiredRoute="/dashboard/career"
    >
      <div className="space-y-6">
        <FinancialModule />
      </div>
    </ModuleGateGuard>
  );
}
