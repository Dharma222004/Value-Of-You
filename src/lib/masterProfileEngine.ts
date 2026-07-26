import { MasterProfileState, AIProfileSummaryData } from "@/types/masterProfile";

export function calculateAgeFromDOB(dobString: string): number {
  if (!dobString) return 22; // Default baseline
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return 22;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return Math.max(16, Math.min(90, age));
}

export function evaluateMasterProfileCompleteness(state: MasterProfileState): number {
  let filledFields = 0;
  let totalFields = 25;

  // Step 1: Role
  if (state.primaryRole) filledFields++;

  // Step 2: Personal & Contact
  const p = state.personalProfile;
  if (p.firstName) filledFields++;
  if (p.lastName) filledFields++;
  if (p.dateOfBirth) filledFields++;
  if (p.country) filledFields++;
  if (p.city) filledFields++;
  if (p.timezone) filledFields++;

  const c = state.contactInformation;
  if (c.email) filledFields++;
  if (c.linkedInUrl) filledFields++;

  // Step 3: Role Specific
  if (state.primaryRole === "Student") {
    if (state.studentData.degree) filledFields++;
    if (state.studentData.university) filledFields++;
    if (state.studentData.cgpaOrPercentage) filledFields++;
  } else if (state.primaryRole === "Employee") {
    if (state.employeeData.company) filledFields++;
    if (state.employeeData.designation) filledFields++;
    if (state.employeeData.yearsOfExperience) filledFields++;
  } else if (state.primaryRole === "Founder") {
    if (state.founderData.startupName) filledFields++;
    if (state.founderData.fundingStage) filledFields++;
  } else if (state.primaryRole === "Freelancer") {
    if (state.freelancerData.primaryService) filledFields++;
  }

  // Step 4: Interests
  if (state.careerInterests.length > 0) filledFields += 2;

  // Step 5: Preferences
  if (state.careerPreferences.preferredIndustry) filledFields++;
  if (state.careerPreferences.preferredWorkStyle) filledFields++;

  // Step 6: Motivations
  if (state.careerMotivations.length > 0) filledFields += 2;

  // Step 7: Availability
  if (state.currentAvailability) filledFields++;

  // Step 8: Goals
  if (state.goals.shortTermGoal1Yr) filledFields++;
  if (state.goals.mediumTermGoal3Yr) filledFields++;
  if (state.goals.longTermGoal5To10Yr) filledFields++;

  const percentage = Math.min(100, Math.round((filledFields / totalFields) * 100));
  return Math.max(15, percentage);
}

export function generateAIProfileSummary(state: MasterProfileState): AIProfileSummaryData {
  const completeness = evaluateMasterProfileCompleteness(state);
  const age = calculateAgeFromDOB(state.personalProfile.dateOfBirth);

  let currentStageBadge = "Student Explorer";
  const summaryBullets: string[] = [];

  const role = state.primaryRole;
  const p = state.personalProfile;

  if (role === "Student") {
    currentStageBadge = `${state.studentData.currentYear || "3rd Year"} ${state.studentData.degree || "Undergraduate"} Explorer`;
    summaryBullets.push(`Academic background in ${state.studentData.specialization || state.studentData.degree || "Computer Science"} at ${state.studentData.university || "University"}`);
    summaryBullets.push(`Current CGPA/Performance: ${state.studentData.cgpaOrPercentage || "3.9 / 4.0"}`);
    summaryBullets.push(`Preparing for ${state.studentData.currentPlacementStatus || "Campus Placement & High-Growth Roles"}`);
  } else if (role === "Employee") {
    currentStageBadge = `${state.employeeData.designation || "Senior Professional"} (${state.employeeData.yearsOfExperience || 4}+ Yrs Exp)`;
    summaryBullets.push(`Currently serving as ${state.employeeData.designation || "Professional"} at ${state.employeeData.company || "Enterprise"}`);
    summaryBullets.push(`Specialized in ${state.employeeData.department || "Core Operations"} in the ${state.employeeData.industry || "Technology"} sector`);
    summaryBullets.push(`Targeting ${state.careerPreferences.preferredWorkStyle || "Remote/Hybrid"} positions in ${state.careerPreferences.preferredIndustry || "Emerging AI"}`);
  } else if (role === "Founder") {
    currentStageBadge = `Early-Stage Founder (${state.founderData.startupName || "Startup"})`;
    summaryBullets.push(`Building ${state.founderData.startupName || "Stealth Startup"} in the ${state.founderData.industry || "Tech"} domain`);
    summaryBullets.push(`Current Venture Stage: ${state.founderData.startupStage || "MVP"} | Funding: ${state.founderData.fundingStage || "Seed"}`);
    summaryBullets.push(`Team Size: ${state.founderData.employeeCount || "1-10 employees"}`);
  } else {
    currentStageBadge = `${role} (${p.city || p.country || "Global"})`;
    summaryBullets.push(`Primary Focus: ${role} based in ${p.city || p.country || "International Region"}`);
    summaryBullets.push(`Primary Motivations: ${state.careerMotivations.slice(0, 3).join(", ") || "Innovation & Financial Growth"}`);
  }

  // General Bullets
  summaryBullets.push(`Key Career Interests: ${state.careerInterests.slice(0, 3).join(", ") || "AI, Data Science, Product"}`);
  summaryBullets.push(`Short-Term Horizon (1 Yr): ${state.goals.shortTermGoal1Yr || "Execute key career milestones"}`);
  summaryBullets.push(`Long-Term Horizon (5-10 Yrs): ${state.goals.longTermGoal5To10Yr || "Achieve industry leadership"}`);

  // AI Confidence rating calculated based on completeness
  const aiConfidencePercentage = Math.min(99, Math.max(85, Math.round(85 + (completeness / 100) * 14)));

  return {
    currentStageBadge,
    summaryBullets,
    profileCompletenessPercentage: completeness,
    aiConfidencePercentage,
  };
}
