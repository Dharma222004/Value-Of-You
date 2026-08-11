"use client";

import React from "react";
import { ModuleGateGuard } from "@/components/dashboard/ModuleGateGuard";
import { SkillsModule } from "@/components/skills/SkillsModule";

export default function SkillsPage() {
  return (
    <ModuleGateGuard
      moduleKey="skills"
      requiredModule="financial"
      requiredLabel="Financial Health"
      requiredRoute="/dashboard/financial"
    >
      <div className="space-y-6">
        <SkillsModule />
      </div>
    </ModuleGateGuard>
  );
}
