export type AcademicStatus = 'Pursuing' | 'Completed' | 'Dropped Out';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type DigitalToolCategory = 'Analytics' | 'Design' | 'Development' | 'AI Tools' | 'Productivity' | 'Management';
export type LanguageProficiency = 'Native' | 'Advanced' | 'Intermediate' | 'Basic';
export type ProjectType = 'Academic' | 'Professional' | 'Research' | 'Personal' | 'Startup';
export type PersonaType = 'Student' | 'Employee' | 'Founder';
export type SportsLevel = 'College' | 'District' | 'State' | 'National' | 'International';

// SECTION 1: Education
export interface EducationSection {
  highestQualification: string;
  currentQualification: string;
  degree: string;
  specialization: string;
  university: string;
  boardOrUniversity: string;
  yearOfStudy: string;
  graduationYear: string;
  cgpaOrPercentage: string;
  academicStatus: AcademicStatus;
  academicAchievements: string;
}

// SECTION 2: Technical Skills
export interface TechnicalSkillItem {
  id: string;
  name: string;
  category: string;
  level: SkillLevel;
  yearsExp: number;
  lastUsedYear: string;
  selfRating: number; // 1 - 5
  verified: boolean;
}

// SECTION 3: Industry Skills
export interface IndustrySkillItem {
  id: string;
  name: string;
  industry: string;
  proficiency: SkillLevel;
  yearsExp: number;
  isCustom?: boolean;
}

// SECTION 4: Digital Skills
export interface DigitalSkillItem {
  id: string;
  name: string;
  category: DigitalToolCategory;
  selected: boolean;
}

// SECTION 5: Languages
export interface LanguageItem {
  id: string;
  language: string;
  read: boolean;
  write: boolean;
  speak: boolean;
  proficiency: LanguageProficiency;
}

// SECTION 6: Professional Certifications
export interface CertificationItem {
  id: string;
  name: string;
  issuingOrganization: string;
  credentialId: string;
  issueDate: string;
  expiryDate: string;
  verificationUrl: string;
  fileUrl?: string;
}

// SECTION 7: Projects & Portfolio
export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  role: string;
  techStack: string[];
  durationMonths: number;
  githubUrl: string;
  liveDemoUrl: string;
  portfolioUrl: string;
  projectType: ProjectType;
}

// SECTION 8: Work Experience (Adaptive Persona)
export interface StudentExperience {
  internships: string;
  industrialTraining: string;
  freelancingDetails: string;
  campusLeadership: string;
  researchWork: string;
}

export interface EmployeeExperience {
  company: string;
  role: string;
  department: string;
  industry: string;
  employmentType: string; // Full-time, Part-time, Contract
  totalYearsExp: number;
  keyAchievements: string;
}

export interface FounderExperience {
  startupName: string;
  industry: string;
  employeeCount: string;
  revenueStage: string;
  fundingStage: string;
  leadershipScope: string;
}

export interface WorkExperienceSection {
  persona: PersonaType;
  student: StudentExperience;
  employee: EmployeeExperience;
  founder: FounderExperience;
}

// SECTION 9: Leadership & Extracurricular
export interface LeadershipItem {
  id: string;
  category: 'Student Clubs' | 'NSS' | 'NCC' | 'Toastmasters' | 'Community Service' | 'Volunteer Work' | 'Mentoring' | 'Public Speaking' | 'College Representative' | 'Event Organizer' | 'Leadership Roles';
  roleTitle: string;
  organization: string;
  achievements: string;
}

// SECTION 10: Sports & Physical Activities
export interface SportsItem {
  id: string;
  sport: string;
  level: SportsLevel;
  yearsPlayed: number;
  achievements: string;
  hasCertificates: boolean;
  wasCaptain: boolean;
}

// SECTION 11: Awards & Achievements
export interface AwardItem {
  id: string;
  name: string;
  issuingOrganization: string;
  year: string;
  category: string;
  description: string;
}

// SECTION 12: Continuous Learning
export interface ContinuousLearningSection {
  booksPerYear: number;
  coursesCompleted: number;
  learningHoursPerWeek: number;
  conferencesAttended: number;
  hackathonsAttended: number;
  workshopsAttended: number;
  researchPapersPublished: number;
  newsReadingFrequency: 'Daily' | 'Weekly' | 'Occasional' | 'Rarely';
  techLearningFrequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
}

// SECTION 13: Career Vision
export interface CareerVisionSection {
  dreamJob: string;
  dreamCompany: string;
  preferredIndustry: string;
  expectedSalary: string;
  preferredCountry: string;
  higherEducationPlans: string;
  entrepreneurshipGoal: string;
  retirementGoal: string;
  fiveYearVision: string;
}

// FULL MODULE DATA STATE
export interface SkillsModuleState {
  education: EducationSection;
  technicalSkills: TechnicalSkillItem[];
  selectedIndustryDomain: string;
  industrySkills: IndustrySkillItem[];
  digitalSkills: DigitalSkillItem[];
  languages: LanguageItem[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  workExperience: WorkExperienceSection;
  leadership: LeadershipItem[];
  sports: SportsItem[];
  awards: AwardItem[];
  continuousLearning: ContinuousLearningSection;
  careerVision: CareerVisionSection;
}

// AI CALCULATED METRICS SUMMARY
export interface CalculatedSkillsMetrics {
  technicalScore: number;       // 20%
  industryScore: number;        // 15%
  projectScore: number;         // 10%
  certificationScore: number;   // 10%
  experienceScore: number;      // 10%
  leadershipScore: number;      // 10%
  communicationScore: number;   // 10%
  learningScore: number;        // 5%
  sportsScore: number;          // 5%
  awardsScore: number;          // 5%
  careerVisionScore: number;    // 10%

  // Auxiliary Derived Scores
  professionalReadiness: number;
  growthPotential: number;
  industryMatch: number;
  promotionReadiness: number;
  innovationScore: number;

  // Final Composite Score (0 - 100)
  professionalCapitalScore: number;
}
