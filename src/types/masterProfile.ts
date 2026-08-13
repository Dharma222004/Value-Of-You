export type PrimaryRoleOption =
  | "Student"
  | "Employee"
  | "Founder"
  | "Business Owner"
  | "Freelancer"
  | "Government Employee"
  | "Research Scholar"
  | "Job Seeker"
  | "Self Employed"
  | "Retired"
  | "Homemaker"
  | "Other";

export type GenderOption = "Male" | "Female" | "Non-Binary" | "Prefer Not to Say" | "Other";
export type CollegeTypeOption = "Government" | "Private" | "Autonomous";
export type ModeOfStudyOption = "Full Time" | "Part Time" | "Distance";
export type EmploymentTypeOption = "Full Time" | "Part Time" | "Contract" | "Remote" | "Hybrid" | "On Site";
export type RelocationOption = "Yes" | "No" | "Maybe" | (string & {});
export type AvailabilityOption =
  | "Student"
  | "Working"
  | "Open to Work"
  | "Looking for Internship"
  | "Looking for Placement"
  | "Looking for Co-Founder"
  | "Looking for Investors"
  | "Not Looking"
  | (string & {});

// STEP 2: Personal Profile & Contact Information
export interface PersonalProfileData {
  firstName: string;
  lastName: string;
  preferredName?: string;
  dateOfBirth: string;
  calculatedAge: number;
  gender: GenderOption;
  country: string;
  stateOrProvince: string;
  city: string;
  nationality?: string;
  timezone: string;
  preferredLanguage: string;
  profilePhotoUrl?: string;
}

export interface ContactInformationData {
  email: string; // Read-only
  mobileNumber?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
  portfolioUrl?: string;
  personalWebsiteUrl?: string;
}

// STEP 3: Role-Specific Data
export interface StudentRoleData {
  studentCategory: string; // e.g. Undergraduate, Postgraduate, Doctorate
  degree: string;
  specialization: string;
  department: string;
  college: string;
  university: string;
  collegeType: CollegeTypeOption;
  modeOfStudy: ModeOfStudyOption;
  currentYear: string;
  currentSemester: string;
  expectedGraduationYear: string;
  cgpaOrPercentage: string;
  academicRank?: string;
  hasScholarship: boolean;
  placementEligibility: boolean;
  housingType: "Hosteller" | "Day Scholar";
  currentPlacementStatus: "Applied" | "Interviewing" | "Placed" | "Higher Studies" | "Not Applied";
}

export interface EmployeeRoleData {
  company: string;
  designation: string;
  department: string;
  industry: string;
  employmentType: EmploymentTypeOption;
  yearsOfExperience: number;
  currentSalaryBand?: string;
  teamSizeManaged: string;
  noticePeriod: string;
  hasManagerialResponsibility: boolean;
}

export interface FounderRoleData {
  startupName: string;
  industry: string;
  yearsRunning: number;
  startupStage: "Ideation" | "MVP" | "Early Revenue" | "Scaling" | "Established";
  employeeCount: string;
  revenueStage: string;
  fundingStage: "Bootstrapped" | "Pre-Seed" | "Seed" | "Series A+" | "Profitable";
  ownershipPercentage: string;
  websiteUrl?: string;
}

export interface FreelancerRoleData {
  primaryService: string;
  yearsExperience: number;
  clientsServed: string;
  avgMonthlyProjects: number;
  platformsUsed: string[];
}

// STEP 4: Career Interests
export type CareerInterestCategory =
  | "Artificial Intelligence"
  | "Finance"
  | "Healthcare"
  | "Cybersecurity"
  | "Cloud"
  | "Marketing"
  | "Sales"
  | "Business"
  | "Education"
  | "Research"
  | "Manufacturing"
  | "Robotics"
  | "Data Science"
  | "Product Management"
  | "Design"
  | "Law"
  | "Government"
  | "Agriculture"
  | "Other"
  | (string & {});

// STEP 5: Career Preferences
export interface CareerPreferencesData {
  preferredIndustry: string;
  preferredCompanyType: "Startup" | "MNC" | "Government" | "Research" | "NGO" | "Other" | (string & {});
  preferredWorkStyle: "Remote" | "Hybrid" | "On Site" | "Other" | (string & {});
  preferredCountry: string;
  relocationPreference: RelocationOption;
  openToInternationalOpportunities: boolean;
}

// STEP 6: Career Motivation
export type CareerMotivationOption =
  | "High Salary"
  | "Financial Freedom"
  | "Leadership"
  | "Entrepreneurship"
  | "Research"
  | "Innovation"
  | "Learning"
  | "Work Life Balance"
  | "Job Security"
  | "Social Impact"
  | "Recognition"
  | "Other"
  | (string & {});

// STEP 8: Three-Horizon Goals
export interface ThreeHorizonGoalsData {
  shortTermGoal1Yr: string;
  mediumTermGoal3Yr: string;
  longTermGoal5To10Yr: string;
}

// STEP 9: AI Profile Summary
export interface AIProfileSummaryData {
  currentStageBadge: string;
  summaryBullets: string[];
  profileCompletenessPercentage: number;
  aiConfidencePercentage: number;
}

// MASTER PROFILE COMBINED STATE
export interface MasterProfileState {
  primaryRole: PrimaryRoleOption;
  personalProfile: PersonalProfileData;
  contactInformation: ContactInformationData;
  studentData: StudentRoleData;
  employeeData: EmployeeRoleData;
  founderData: FounderRoleData;
  freelancerData: FreelancerRoleData;
  careerInterests: CareerInterestCategory[];
  careerPreferences: CareerPreferencesData;
  careerMotivations: CareerMotivationOption[];
  currentAvailability: AvailabilityOption;
  goals: ThreeHorizonGoalsData;
  aiSummary: AIProfileSummaryData;
  isCompleted?: boolean;
  submittedAt?: string;
}
