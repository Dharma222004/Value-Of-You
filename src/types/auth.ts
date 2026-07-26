export type UserStatus = 'Student' | 'Employee' | 'Founder' | 'Freelancer' | 'Business Owner';

export interface UserProfile {
  displayName: string;
  status: UserStatus;
  country: string;
  timezone: string;
  avatarUrl?: string;
  bio?: string;
  completedOnboarding: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  emailVerified?: boolean;
  provider: 'credentials' | 'google' | 'github' | 'microsoft' | 'apple';
  profile?: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
  rememberMe: boolean;
}

export interface PasswordRuleCheck {
  id: string;
  label: string;
  isValid: boolean;
}

export interface PasswordStrength {
  score: number; // 0 - 100
  label: 'Weak' | 'Fair' | 'Strong' | 'Apex Tier';
  color: string;
  checks: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

// ------------------------------------------------------------
// Account Settings & Architecture Types (Future Feature Readiness)
// ------------------------------------------------------------

export interface ConnectedAccount {
  id: string;
  provider: 'google' | 'github' | 'microsoft' | 'apple';
  email: string;
  connectedAt: string;
  isPrimary: boolean;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface TwoFactorConfig {
  enabled: boolean;
  method: 'authenticator' | 'sms' | 'email';
  backupCodesCount: number;
}

export interface LoginHistoryItem {
  id: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  status: 'success' | 'failed';
  provider: string;
}

export interface SecuritySettings {
  twoFactor: TwoFactorConfig;
  connectedAccounts: ConnectedAccount[];
  activeSessions: ActiveSession[];
  loginHistory: LoginHistoryItem[];
  passwordLastChanged?: string;
}
