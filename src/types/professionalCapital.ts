/**
 * Human Capital Platform - Professional Capital Intelligence Types
 * Phase 5 Comprehensive Architecture
 */

export type SkillLevelOption = "Beginner" | "Intermediate" | "Advanced" | "Expert";
export type LanguageProficiencyOption = "Native" | "Professional" | "Intermediate" | "Basic";
export type WorkStyleOption = "Remote First" | "Hybrid" | "Onsite";
export type CertCategoryOption = "AI / ML" | "Cloud & DevOps" | "Finance & FinTech" | "Management" | "Cybersecurity" | "Others";
export type ProjectCategoryOption = "Research" | "Open Source" | "Hackathon" | "Professional" | "Startup" | "Academic";

export interface AcademicCapital {
  highestQualification: string;
  currentQualification: string;
  degree: string;
  major: string;
  minor?: string;
  university: string;
  college: string;
  boardOrUniversity: string;
  country: string;
  cgpa: string;
  percentage: string;
  graduationYear: string;
  currentSemester: string;
  scholarships: string;
  academicHonors: string;
  researchPublicationsCount: number;
  patentsCount: number;
  exchangePrograms: string;
}

export interface TechnicalSkillItem {
  id: string;
  name: string;
  category: "AI/ML" | "Frontend" | "Backend" | "Cloud/DevOps" | "Data & Analytics" | "Cybersecurity" | "Mobile" | "Other";
  level: SkillLevelOption;
  yearsExp: number;
  projectsCount: number;
  lastUsedYear: string;
  certificationName?: string;
  confidenceScore: number; // 1-5
  marketDemand: "Low" | "Medium" | "High" | "Ultra High";
  learningStatus: "Active" | "Maintaining" | "Exploring";
  // AI estimated metrics
  maturityScore: number; // 0-100
  relevanceScore: number; // 0-100
  futureDemandScore: number; // 0-100
}

export interface IndustryExpertiseItem {
  id: string;
  industryDomain: string;
  yearsExp: number;
  projectsCount: number;
  expertiseLevel: SkillLevelOption;
}

export interface DigitalCompetencyItem {
  id: string;
  name: string;
  category: "Productivity" | "Design" | "Code & Version" | "AI Tools" | "Cloud & Containers" | "Management";
  selected: boolean;
  proficiency: SkillLevelOption;
}

export interface CommunicationLanguageItem {
  id: string;
  language: string;
  read: boolean;
  write: boolean;
  speak: boolean;
  proficiency: LanguageProficiencyOption;
}

export interface CommunicationSkills {
  communicationConfidence: number; // 1-5
  presentationSkills: number; // 1-5
  publicSpeaking: number; // 1-5
  businessWriting: number; // 1-5
}

export interface CertificationItem {
  id: string;
  name: string;
  provider: string;
  category: CertCategoryOption;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  verificationUrl: string;
  documentUrl?: string;
}

export interface ProjectPortfolioItem {
  id: string;
  name: string;
  role: string;
  durationMonths: number;
  category: ProjectCategoryOption;
  techStack: string[];
  description: string;
  teamSize: number;
  impact: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  portfolioUrl?: string;
}

export interface StudentExperience {
  internships: string;
  researchWork: string;
  campusLeadership: string;
  industrialTraining: string;
  freelancingDetails: string;
}

export interface EmployeeExperience {
  company: string;
  role: string;
  department: string;
  industry: string;
  employmentType: string;
  totalYearsExp: number;
  promotionsCount: number;
  keyAchievements: string;
}

export interface FounderExperience {
  startupName: string;
  industry: string;
  employeeCount: string;
  revenueStage: string;
  fundingStage: string;
  leadershipScope: string;
  growthRate: string;
}

export interface FreelancerExperience {
  primaryServices: string;
  totalClients: string;
  projectsCompleted: number;
  avgRating: number;
  monthlyRevenue: string;
}

export interface WorkExperienceData {
  persona: "Student" | "Employee" | "Founder" | "Freelancer";
  student: StudentExperience;
  employee: EmployeeExperience;
  founder: FounderExperience;
  freelancer: FreelancerExperience;
}

export interface LeadershipImpact {
  leadershipPositions: string;
  studentClubs: string;
  toastmastersRole: string;
  nssOrNccParticipation: string;
  volunteerWork: string;
  mentoringExperience: string;
  communityWork: string;
  eventOrganization: string;
  publicSpeakingEvents: number;
  teamLeadershipScope: string;
}

export interface SportsExtracurricular {
  sportName: string;
  competitionLevel: "College / Local" | "State Level" | "National Level" | "International Level";
  yearsPlayed: number;
  wasCaptain: boolean;
  achievements: string;
  fitnessActivities: string;
}

export interface AwardItem {
  id: string;
  name: string;
  year: string;
  organization: string;
  category: string;
  description: string;
}

export interface ContinuousLearningData {
  booksPerYear: number;
  coursesCompleted: number;
  learningHoursPerWeek: number;
  conferencesAttended: number;
  workshopsAttended: number;
  hackathonsAttended: number;
  researchPapersReadPerMonth: number;
  techNewsFrequency: "Daily" | "Weekly" | "Occasional";
  aiLearningFrequency: "Daily" | "Weekly" | "Occasional";
  skillImprovementFrequency: "Daily" | "Weekly" | "Monthly";
}

export interface CareerVisionData {
  dreamRole: string;
  dreamCompany: string;
  preferredIndustry: string;
  preferredCountry: string;
  expectedSalaryBand: string;
  workStyle: WorkStyleOption;
  entrepreneurshipGoal: string;
  higherEducationPlans: string;
  fiveYearGoal: string;
  tenYearGoal: string;
}

export interface ProfessionalCapitalState {
  academic: AcademicCapital;
  technicalSkills: TechnicalSkillItem[];
  industryExpertise: IndustryExpertiseItem[];
  digitalCompetencies: DigitalCompetencyItem[];
  languages: CommunicationLanguageItem[];
  communication: CommunicationSkills;
  certifications: CertificationItem[];
  projects: ProjectPortfolioItem[];
  workExperience: WorkExperienceData;
  leadership: LeadershipImpact;
  sports: SportsExtracurricular;
  awards: AwardItem[];
  continuousLearning: ContinuousLearningData;
  careerVision: CareerVisionData;
}

export interface ProfessionalCapitalMetrics {
  // Primary Master Score
  professionalCapitalScore: number; // 0-100
  completionPercentage: number; // 0-100%

  // Real-Time Right Panel Telemetry Indices
  employabilityIndex: number; // 0-100
  learningIndex: number; // 0-100
  leadershipIndex: number; // 0-100
  innovationIndex: number; // 0-100
  skillGrowthRate: number; // %
  aiReadinessScore: number; // 0-100
  futureDemandIndex: number; // 0-100

  // 12 Weighted Vector Scores
  scores: {
    academic: number; // 10%
    technical: number; // 20%
    industry: number; // 10%
    projects: number; // 10%
    experience: number; // 10%
    leadership: number; // 10%
    communication: number; // 10%
    certifications: number; // 10%
    learning: number; // 5%
    awards: number; // 5%
    sports: number; // 5%
    vision: number; // 5%
  };

  // Readiness Classifications
  promotionReadiness: "High" | "Moderate" | "Developing";
  startupReadiness: "High" | "Moderate" | "Developing";
  leadershipReadiness: "High" | "Moderate" | "Developing";
  researchReadiness: "High" | "Moderate" | "Developing";
  internationalEmployability: "Global Ready" | "Regional Ready" | "Local Focus";

  // AI Strategic Summaries
  topStrengths: string[];
  topWeaknesses: string[];
  skillGaps: string[];
  missingCertifications: string[];
  emergingSkillsToLearn: string[];
  aiCareerSuggestions: string[];
}
