export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  provider: string;
  human_value_score: number;
  assessment_completed: boolean;
  values_completed: boolean;
  theme: string;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  status: "STARTED" | "IN_PROGRESS" | "COMPLETED";
  progress: number;
  module_count: number;
  started_at: string;
  completed_at: string | null;
}

export interface AssessmentQuestion {
  id: string;
  module: string;
  question: string;
  question_type: string;
  weight: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface AssessmentAnswer {
  id: string;
  assessment_id: string;
  question_id: string;
  answer: Record<string, any>;
  score: number;
  created_at: string;
}

export interface AssessmentResult {
  id: string;
  assessment_id: string;
  user_id: string;
  overall_score: number;
  personality_score: number;
  leadership_score: number;
  communication_score: number;
  emotional_score: number;
  innovation_score: number;
  generated_at: string;
}

export interface AiEvaluation {
  id: string;
  user_id: string;
  assessment_id: string | null;
  summary: string | null;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  career_matches: string[];
  confidence_score: number;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  event_type: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ====================================================================
// NEW TABLES — Module Data, Financial Profiles, Test History, etc.
// ====================================================================

/**
 * Stores the full JSON state of each module per user.
 * Replaces localStorage for all 5 modules.
 * module_key: 'master_profile' | 'financial' | 'skills' | 'health' | 'assessments'
 */
export interface ModuleData {
  id: string;
  user_id: string;
  module_key: string;
  data: Record<string, any>;
  is_completed: boolean;
  score: number;
  created_at: string;
  updated_at: string;
}

/**
 * Structured financial profile data extracted from the financial module.
 */
export interface FinancialProfile {
  id: string;
  user_id: string;
  income: number;
  expenses: number;
  savings: number;
  investments: number;
  liabilities: number;
  net_worth: number;
  savings_rate: number;
  debt_to_income_ratio: number;
  emergency_fund_months: number;
  has_health_insurance: boolean;
  has_life_insurance: boolean;
  financial_score: number;
  updated_at: string;
}

/**
 * Human Values Test history and results.
 */
export interface HumanValuesTest {
  id: string;
  user_id: string;
  score: number;
  category_scores: Record<string, any>;
  level: string;
  completed_at: string;
}

/**
 * Financial Literacy Test results.
 */
export interface FinancialTest {
  id: string;
  user_id: string;
  score: number;
  completed_at: string;
}

/**
 * Learning progress per module/lesson.
 */
export interface LearningProgress {
  id: string;
  user_id: string;
  module: string;
  lesson: string | null;
  completion_percentage: number;
  updated_at: string;
}

/**
 * AI-generated personalized recommendations.
 */
export interface AiRecommendation {
  id: string;
  user_id: string;
  recommendation: string;
  category: string;
  priority: number;
  metadata: Record<string, any>;
  generated_at: string;
}

// ====================================================================
// ENTERPRISE ARCHITECTURE — New Tables
// ====================================================================

/**
 * Module metadata registry (replaces hardcoded module definitions).
 */
export interface ModuleMetadata {
  id: string;
  key: string;
  title: string;
  description: string | null;
  display_order: number;
  weight: number;
  unlock_after: string | null;
  is_required: boolean;
  is_active: boolean;
  created_at: string;
}

/**
 * Per-user module completion tracker — single source of truth.
 */
export interface ModuleProgress {
  id: string;
  user_id: string;
  module_key: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completion_percentage: number;
  score: number;
  started_at: string | null;
  completed_at: string | null;
  updated_at: string;
}

/**
 * Pre-computed dashboard aggregate — one row per user.
 */
export interface DashboardSummary {
  user_id: string;
  completed_modules: number;
  total_modules: number;
  overall_progress: number;
  overall_score: number;
  human_capital_score: number;
  financial_score: number;
  skills_score: number;
  health_score: number;
  values_score: number;
  ai_ready: boolean;
  executive_ready: boolean;
  updated_at: string;
}

/**
 * Executive report generation tracking.
 */
export interface ExecutiveReport {
  id: string;
  user_id: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  summary: string | null;
  pdf_url: string | null;
  generated_at: string | null;
  updated_at: string;
}

/**
 * AI pipeline workflow status.
 */
export interface AiPipeline {
  id: string;
  user_id: string;
  embedding_status: string;
  evaluation_status: string;
  report_status: string;
  last_run: string | null;
  updated_at: string;
}

/**
 * Normalized individual skill record.
 */
export interface SkillRecord {
  id: string;
  user_id: string;
  skill_name: string;
  category: string | null;
  experience_years: number;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  score: number;
  verified: boolean;
  updated_at: string;
}

/**
 * Normalized health metrics.
 */
export interface HealthMetricsRecord {
  user_id: string;
  sleep_hours: number;
  exercise_days_per_week: number;
  nutrition_score: number;
  stress_level: number;
  mental_health_score: number;
  energy_level: number;
  bmi: number;
  overall_score: number;
  updated_at: string;
}

/**
 * Normalized human value dimension scores.
 */
export interface HumanValueDimensions {
  user_id: string;
  integrity: number;
  leadership: number;
  communication: number;
  decision_making: number;
  adaptability: number;
  innovation: number;
  discipline: number;
  empathy: number;
  ethics: number;
  learning: number;
  overall_score: number;
  updated_at: string;
}

