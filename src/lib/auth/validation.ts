import { PasswordStrength } from '@/types/auth';

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function validateEmail(email: string): string | null {
  if (!email || !email.trim()) {
    return "Email address is required.";
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return "Please enter a valid email address (e.g., alex@company.com).";
  }
  return null;
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  let count = 0;
  if (checks.minLength) count++;
  if (checks.hasUppercase) count++;
  if (checks.hasLowercase) count++;
  if (checks.hasNumber) count++;
  if (checks.hasSpecial) count++;

  if (!password) {
    return { score: 0, label: 'Weak', color: 'bg-slate-700', checks };
  }

  switch (count) {
    case 1:
    case 2:
      return { score: 25, label: 'Weak', color: 'bg-red-500', checks };
    case 3:
      return { score: 50, label: 'Fair', color: 'bg-amber-500', checks };
    case 4:
      return { score: 75, label: 'Strong', color: 'bg-emerald-500', checks };
    case 5:
      return { score: 100, label: 'Apex Tier', color: 'bg-cyan-400', checks };
    default:
      return { score: 0, label: 'Weak', color: 'bg-slate-700', checks };
  }
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character.";
  return null;
}

export function validateOtp(otp: string): string | null {
  if (otp.length < 6) return "Please enter the full 6-digit security code.";
  if (!/^\d{6}$/.test(otp)) return "Security code must contain only numbers.";
  return null;
}
