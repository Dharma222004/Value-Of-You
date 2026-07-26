"use client";

import { evaluatePasswordStrength } from "@/lib/auth/validation";
import { Check, X } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
  showRules?: boolean;
}

export default function PasswordStrengthMeter({ password, showRules = true }: PasswordStrengthMeterProps) {
  const strength = evaluatePasswordStrength(password);

  if (!password && !showRules) return null;

  const rules = [
    { label: "At least 8 characters", valid: strength.checks.minLength },
    { label: "Uppercase letter (A-Z)", valid: strength.checks.hasUppercase },
    { label: "Lowercase letter (a-z)", valid: strength.checks.hasLowercase },
    { label: "Number (0-9)", valid: strength.checks.hasNumber },
    { label: "Special character (!@#$)", valid: strength.checks.hasSpecial },
  ];

  return (
    <div className="space-y-2 pt-1.5">
      {/* Strength Label & Bar */}
      {password && (
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-[var(--subtext)]">Password Strength:</span>
            <span
              className={`font-bold ${
                strength.label === "Weak"
                  ? "text-red-500"
                  : strength.label === "Fair"
                  ? "text-amber-500"
                  : strength.label === "Strong"
                  ? "text-emerald-500"
                  : "text-cyan-400"
              }`}
            >
              {strength.label}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex gap-1">
            <div
              className={`h-full transition-all duration-300 rounded-full ${strength.color}`}
              style={{ width: `${strength.score}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Real-time Requirement Checklist */}
      {showRules && (
        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-1.5 transition-colors ${
                rule.valid ? "text-emerald-500 font-semibold" : "text-[var(--subtext)] opacity-70"
              }`}
            >
              {rule.valid ? (
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-slate-400/40 shrink-0 flex items-center justify-center text-[8px]">
                  •
                </div>
              )}
              <span>{rule.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
