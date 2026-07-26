"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
  error?: string | null;
  autoComplete?: string;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = "••••••••••••",
  label = "Password",
  id = "password_input",
  error,
  autoComplete = "current-password",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1 text-left">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-xs font-semibold text-[var(--foreground)]">
          {label}
        </label>
      </div>
      <div className="relative">
        <Lock className="w-4 h-4 text-[var(--subtext)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--background)] border ${
            error ? "border-red-500/70" : "border-[var(--border)]"
          } text-xs text-[var(--foreground)] focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none transition-all`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--subtext)] hover:text-[var(--foreground)] transition-colors p-1 rounded-lg"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-[11px] text-red-500 font-medium pt-0.5">{error}</p>}
    </div>
  );
}
