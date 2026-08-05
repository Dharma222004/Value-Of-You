/**
 * AI Human Values Analysis Engine — Type Definitions
 *
 * Covers the complete lifecycle: clean profile → AI analysis → report storage → dashboard display.
 */

// ====================================================================
// CLEAN PROFILE — Structured data sent to Groq
// ====================================================================

export interface AICleanProfile {
  profile: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    country?: string;
    city?: string;
    primaryRole?: string;
    primaryIndustry?: string;
    experienceYears?: number;
    currentStatus?: string;
  };
  education: {
    degree?: string;
    field?: string;
    institution?: string;
    gpa?: number;
    graduationYear?: number;
    certifications?: string[];
    onlineCourses?: string[];
  };
  career: {
    currentRole?: string;
    company?: string;
    industry?: string;
    yearsOfExperience?: number;
    previousRoles?: string[];
    achievements?: string[];
    projects?: Array<{
      name?: string;
      description?: string;
      technologies?: string[];
    }>;
  };
  skills: {
    technical?: string[];
    soft?: string[];
    languages?: string[];
    tools?: string[];
    proficiencyLevels?: Record<string, string>;
  };
  personality: {
    discipline?: number;
    integrity?: number;
    emotionalIntelligence?: number;
    teamwork?: number;
    learningOrientation?: number;
    selfAwareness?: number;
    productivity?: number;
    leadership?: number;
  };
  humanValues: {
    growthMindset?: number;
    gritResilience?: number;
    goalOrientation?: number;
    ethicalReasoning?: number;
    entrepreneurialMindset?: number;
    disciplineConsistency?: number;
  };
  financialBehaviour: {
    monthlyIncome?: number;
    monthlyExpenses?: number;
    savingsRate?: number;
    emergencyFundMonths?: number;
    debtToIncomeRatio?: number;
    netWorth?: number;
    hasHealthInsurance?: boolean;
    hasLifeInsurance?: boolean;
    investmentTypes?: string[];
    financialGoals?: string[];
    riskTolerance?: string;
  };
  goals: {
    shortTerm?: string[];
    longTerm?: string[];
    careerGoals?: string[];
    financialGoals?: string[];
    personalGoals?: string[];
  };
  habits: {
    sleepHoursPerNight?: number;
    workoutFrequency?: number;
    dietQuality?: string;
    stressLevel?: number;
    mindfulnessPractice?: boolean;
    readingHabit?: boolean;
    smokingOrAlcohol?: boolean;
    screenTime?: string;
  };
  preferences: {
    learningStyle?: string;
    communicationStyle?: string;
    workStyle?: string;
    leadershipStyle?: string;
  };
  questionnaire: {
    totalQuestionsAnswered?: number;
    completedStages?: string[];
    assessmentScore?: number;
    analyticalThinking?: number;
    logicalReasoning?: number;
    patternRecognition?: number;
    readingComprehension?: number;
    businessCommunication?: number;
    professionalWriting?: number;
    aiLiteracy?: number;
    technologyAdoption?: number;
    cybersecurityAwareness?: number;
    financialDecisionMaking?: number;
    careerJudgment?: number;
    leadershipJudgment?: number;
    riskAssessment?: number;
    strategicThinking?: number;
    problemSolving?: number;
    timeManagement?: number;
    innovationMindset?: number;
    economicAwareness?: number;
    environmentalAwareness?: number;
  };
}

// ====================================================================
// AI REPORT — The 26-section comprehensive report
// ====================================================================

export interface AIReportSection {
  title: string;
  content: string;
  highlights?: string[];
  dataAvailable: boolean;
}

export interface AIAnalysisScores {
  humanValues: { score: number; explanation: string };
  financialIntelligence: { score: number; explanation: string };
  leadership: { score: number; explanation: string };
  communication: { score: number; explanation: string };
  selfAwareness: { score: number; explanation: string };
  decisionMaking: { score: number; explanation: string };
  growthMindset: { score: number; explanation: string };
  consistency: { score: number; explanation: string };
  learningAbility: { score: number; explanation: string };
  professionalReadiness: { score: number; explanation: string };
  overall: { score: number; explanation: string };
}

export interface AIAnalysisReport {
  // 26 Report Sections
  executiveSummary: string;
  personalityAnalysis: AIReportSection;
  humanValuesAnalysis: AIReportSection;
  coreStrengths: AIReportSection;
  areasOfImprovement: AIReportSection;
  communicationStyle: AIReportSection;
  leadershipPotential: AIReportSection;
  emotionalIntelligence: AIReportSection;
  decisionMakingStyle: AIReportSection;
  learningStyle: AIReportSection;
  financialIntelligence: AIReportSection;
  investmentBehaviour: AIReportSection;
  moneyManagement: AIReportSection;
  savingsBehaviour: AIReportSection;
  riskProfile: AIReportSection;
  careerSuitability: AIReportSection;
  professionalGrowth: AIReportSection;
  behaviourPatterns: AIReportSection;
  dailyHabitsAnalysis: AIReportSection;
  goalAlignment: AIReportSection;
  recommendations: AIReportSection;
  dailyActionPlan: AIReportSection;
  weeklyActionPlan: AIReportSection;
  monthlyGrowthPlan: AIReportSection;
  longTermDevelopmentPlan: AIReportSection;
  overallSummary: string;

  // Scored Dimensions
  scores: AIAnalysisScores;
}

// ====================================================================
// DATABASE RECORD — Matches ai_reports and ai_analysis_reports tables
// ====================================================================

export type ReportStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "REGENERATING";

export interface AIReportRecord {
  id: string;
  user_id: string;
  assessment_id?: string | null;
  report_version: string;
  prompt_version?: string;
  status: ReportStatus;
  overall_summary?: string;
  executive_summary?: string;
  personality_analysis?: any;
  human_values?: any;
  leadership?: any;
  communication?: any;
  decision_making?: any;
  financial_intelligence?: any;
  learning?: any;
  growth?: any;
  career_readiness?: any;
  emotional_intelligence?: any;
  strengths?: any;
  weaknesses?: any;
  recommendations?: any;
  career_suggestions?: any;
  financial_suggestions?: any;
  development_plan?: any;
  roadmap?: any;
  modules?: Record<string, any>;
  report_json: AIAnalysisReport;
  scores_json: AIAnalysisScores;
  overall_score: number;
  confidence_score?: number;
  ai_model?: string;
  model_name: string;
  analysis_version?: string;
  data_hash: string;
  generated_at?: string;
  created_at: string;
  updated_at: string;
}

export type AIAnalysisReportRecord = AIReportRecord;

// ====================================================================
// LOADING STAGES — For animated progress UI
// ====================================================================

export type AnalysisStageStatus = 'pending' | 'active' | 'completed';

export interface AnalysisStage {
  id: number;
  label: string;
  description: string;
  status: AnalysisStageStatus;
  icon: string; // Lucide icon name
}

export const ANALYSIS_STAGES: Omit<AnalysisStage, 'status'>[] = [
  { id: 1, label: 'Collecting Profile', description: 'Collecting Profile Information...', icon: 'User' },
  { id: 2, label: 'Understanding Values', description: 'Understanding Your Human Values...', icon: 'Heart' },
  { id: 3, label: 'Analyzing Behaviour', description: 'Analyzing Behaviour Patterns...', icon: 'Brain' },
  { id: 4, label: 'Financial Analysis', description: 'Analyzing Financial Intelligence...', icon: 'TrendingUp' },
  { id: 5, label: 'Pattern Detection', description: 'Finding Behaviour Patterns...', icon: 'Search' },
  { id: 6, label: 'Recommendations', description: 'Building Personalized Recommendations...', icon: 'Lightbulb' },
  { id: 7, label: 'Generating Report', description: 'Generating Final Report...', icon: 'FileText' },
];

// ====================================================================
// API REQUEST/RESPONSE
// ====================================================================

export interface AIAnalysisRequest {
  forceRegenerate?: boolean;
}

export interface AIAnalysisResponse {
  success: boolean;
  report?: AIAnalysisReportRecord;
  cached?: boolean;
  error?: string;
  errorCode?: string;
}

export interface AIAnalysisHistoryResponse {
  success: boolean;
  reports?: AIAnalysisReportRecord[];
  error?: string;
}
