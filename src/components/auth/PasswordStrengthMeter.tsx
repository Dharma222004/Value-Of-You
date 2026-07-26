"use client";

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const getStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: "", color: "bg-slate-700" };

    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
        return { score: 25, label: "Weak", color: "bg-red-500" };
      case 2:
        return { score: 50, label: "Fair", color: "bg-amber-500" };
      case 3:
        return { score: 75, label: "Strong", color: "bg-emerald-500" };
      case 4:
        return { score: 100, label: "Apex Tier", color: "bg-cyan-400" };
      default:
        return { score: 0, label: "", color: "bg-slate-700" };
    }
  };

  const strength = getStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex justify-between items-center text-[11px] font-mono">
        <span className="text-[var(--subtext)]">Password Strength:</span>
        <span className={`font-bold ${strength.color.replace("bg-", "text-")}`}>
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
  );
}
