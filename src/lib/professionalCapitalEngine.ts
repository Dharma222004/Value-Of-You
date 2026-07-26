/**
 * Human Capital Platform - Professional Capital Intelligence Engine
 * Computes 12 Weighted Vector Scores, 0-100 Professional Capital Score,
 * Right Panel Telemetry Indices, and AI Strategic Insights.
 */

import {
  ProfessionalCapitalState,
  ProfessionalCapitalMetrics,
} from "@/types/professionalCapital";

export const defaultProfessionalCapitalState: ProfessionalCapitalState = {
  academic: {
    highestQualification: "",
    currentQualification: "",
    degree: "",
    major: "",
    minor: "",
    university: "",
    college: "",
    boardOrUniversity: "",
    country: "",
    cgpa: "",
    percentage: "",
    graduationYear: "",
    currentSemester: "",
    scholarships: "",
    academicHonors: "",
    researchPublicationsCount: 0,
    patentsCount: 0,
    exchangePrograms: "",
  },
  technicalSkills: [],
  industryExpertise: [],
  digitalCompetencies: [
    { id: "d1", name: "Microsoft Excel & Data Analysis", category: "Productivity", selected: false, proficiency: "Intermediate" },
    { id: "d2", name: "Figma & UI Prototyping", category: "Design", selected: false, proficiency: "Intermediate" },
    { id: "d3", name: "Git & GitHub Workflow", category: "Code & Version", selected: false, proficiency: "Advanced" },
    { id: "d4", name: "ChatGPT & LLM Prompt Engineering", category: "AI Tools", selected: false, proficiency: "Advanced" },
    { id: "d5", name: "VS Code & Agentic Workflows", category: "Code & Version", selected: false, proficiency: "Advanced" },
    { id: "d6", name: "Notion Workspaces & Docs", category: "Productivity", selected: false, proficiency: "Intermediate" },
    { id: "d7", name: "Docker & Containerization", category: "Cloud & Containers", selected: false, proficiency: "Intermediate" },
    { id: "d8", name: "Jira & Agile Work Tracking", category: "Management", selected: false, proficiency: "Intermediate" },
  ],
  languages: [],
  communication: {
    communicationConfidence: 3,
    presentationSkills: 3,
    publicSpeaking: 3,
    businessWriting: 3,
  },
  certifications: [],
  projects: [],
  workExperience: {
    persona: "Employee",
    student: {
      internships: "",
      researchWork: "",
      campusLeadership: "",
      industrialTraining: "",
      freelancingDetails: "",
    },
    employee: {
      company: "",
      role: "",
      department: "",
      industry: "",
      employmentType: "Full-Time",
      totalYearsExp: 0,
      promotionsCount: 0,
      keyAchievements: "",
    },
    founder: {
      startupName: "",
      industry: "",
      employeeCount: "",
      revenueStage: "",
      fundingStage: "Bootstrapped",
      leadershipScope: "",
      growthRate: "",
    },
    freelancer: {
      primaryServices: "",
      totalClients: "",
      projectsCompleted: 0,
      avgRating: 5,
      monthlyRevenue: "",
    },
  },
  leadership: {
    leadershipPositions: "",
    studentClubs: "",
    toastmastersRole: "",
    nssOrNccParticipation: "",
    volunteerWork: "",
    mentoringExperience: "",
    communityWork: "",
    eventOrganization: "",
    publicSpeakingEvents: 0,
    teamLeadershipScope: "",
  },
  sports: {
    sportName: "",
    competitionLevel: "College / Local",
    yearsPlayed: 0,
    wasCaptain: false,
    achievements: "",
    fitnessActivities: "",
  },
  awards: [],
  continuousLearning: {
    booksPerYear: 0,
    coursesCompleted: 0,
    learningHoursPerWeek: 0,
    conferencesAttended: 0,
    workshopsAttended: 0,
    hackathonsAttended: 0,
    researchPapersReadPerMonth: 0,
    techNewsFrequency: "Daily",
    aiLearningFrequency: "Daily",
    skillImprovementFrequency: "Daily",
  },
  careerVision: {
    dreamRole: "",
    dreamCompany: "",
    preferredIndustry: "",
    preferredCountry: "",
    expectedSalaryBand: "",
    workStyle: "Remote First",
    entrepreneurshipGoal: "",
    higherEducationPlans: "",
    fiveYearGoal: "",
    tenYearGoal: "",
  },
};

export function calculateProfessionalCapitalScore(
  state: ProfessionalCapitalState
): ProfessionalCapitalMetrics {
  const aca = state.academic;
  const tech = state.technicalSkills;
  const ind = state.industryExpertise;
  const proj = state.projects;
  const certs = state.certifications;
  const exp = state.workExperience;
  const lead = state.leadership;
  const sp = state.sports;
  const awd = state.awards;
  const lrn = state.continuousLearning;
  const vis = state.careerVision;
  const comm = state.communication;

  // 1. Academic Capital Score (10%)
  let academicScore = 40;
  if (aca.degree || aca.highestQualification) academicScore += 20;
  if (aca.university || aca.college) academicScore += 15;
  if (aca.cgpa || aca.percentage) academicScore += 10;
  if (aca.researchPublicationsCount > 0) academicScore += aca.researchPublicationsCount * 5;
  if (aca.patentsCount > 0) academicScore += aca.patentsCount * 10;
  academicScore = Math.min(100, academicScore);

  // 2. Technical Skills Score (20%)
  let technicalScore = 30;
  if (tech.length > 0) {
    const totalLevelScore = tech.reduce((acc, t) => {
      let lvlVal = 10;
      if (t.level === "Expert") lvlVal = 25;
      else if (t.level === "Advanced") lvlVal = 20;
      else if (t.level === "Intermediate") lvlVal = 15;
      return acc + lvlVal;
    }, 0);
    technicalScore = Math.min(100, Math.round(totalLevelScore / Math.max(1, tech.length) * 4));
    if (tech.length >= 3) technicalScore = Math.max( technicalScore, Math.min(100, 50 + tech.length * 8));
  }

  // 3. Industry Skills Score (10%)
  let industryScore = ind.length > 0 ? Math.min(100, ind.length * 25 + ind.reduce((a, b) => a + (b.yearsExp || 0) * 5, 0)) : 35;

  // 4. Projects Score (10%)
  let projectsScore = proj.length > 0 ? Math.min(100, proj.length * 25 + proj.filter((p) => p.githubUrl || p.liveDemoUrl).length * 15) : 30;

  // 5. Experience Score (10%)
  let experienceScore = 35;
  if (exp.persona === "Employee" && exp.employee.company) {
    experienceScore = Math.min(100, 50 + (exp.employee.totalYearsExp || 0) * 8 + (exp.employee.promotionsCount || 0) * 10);
  } else if (exp.persona === "Founder" && exp.founder.startupName) {
    experienceScore = Math.min(100, 60 + (exp.founder.revenueStage ? 20 : 10));
  } else if (exp.persona === "Student" && (exp.student.internships || exp.student.researchWork)) {
    experienceScore = Math.min(100, 55 + (exp.student.internships ? 20 : 0));
  } else if (exp.persona === "Freelancer" && exp.freelancer.primaryServices) {
    experienceScore = Math.min(100, 50 + (exp.freelancer.projectsCompleted || 0) * 5);
  }

  // 6. Leadership Score (10%)
  let leadershipScore = 30;
  if (lead.leadershipPositions || lead.teamLeadershipScope) leadershipScore += 30;
  if (lead.mentoringExperience || lead.volunteerWork) leadershipScore += 20;
  if (lead.publicSpeakingEvents > 0) leadershipScore += Math.min(20, lead.publicSpeakingEvents * 5);
  leadershipScore = Math.min(100, leadershipScore);

  // 7. Communication & Languages Score (10%)
  const avgComm = (comm.communicationConfidence + comm.presentationSkills + comm.publicSpeaking + comm.businessWriting) / 4;
  let communicationScore = Math.round((avgComm / 5) * 80) + Math.min(20, state.languages.length * 10);
  communicationScore = Math.min(100, communicationScore);

  // 8. Certifications Score (10%)
  let certificationsScore = certs.length > 0 ? Math.min(100, certs.length * 30 + certs.filter((c) => c.verificationUrl).length * 15) : 25;

  // 9. Continuous Learning Score (5%)
  let learningScore = Math.min(100, (lrn.booksPerYear || 0) * 4 + (lrn.coursesCompleted || 0) * 5 + (lrn.learningHoursPerWeek || 0) * 3 + (lrn.hackathonsAttended || 0) * 5);
  if (learningScore < 30) learningScore = 30;

  // 10. Awards Score (5%)
  let awardsScore = awd.length > 0 ? Math.min(100, awd.length * 35) : 30;

  // 11. Sports Score (5%)
  let sportsScore = 30;
  if (sp.sportName) sportsScore += 20;
  if (sp.competitionLevel === "National Level" || sp.competitionLevel === "International Level") sportsScore += 30;
  if (sp.wasCaptain) sportsScore += 20;
  sportsScore = Math.min(100, sportsScore);

  // 12. Career Vision Score (5%)
  let visionScore = 40;
  if (vis.dreamRole || vis.dreamCompany) visionScore += 30;
  if (vis.fiveYearGoal || vis.tenYearGoal) visionScore += 30;
  visionScore = Math.min(100, visionScore);

  // --- COMPOSITE PROFESSIONAL CAPITAL SCORE (0 - 100) ---
  const weightedScore = Math.round(
    academicScore * 0.10 +
      technicalScore * 0.20 +
      industryScore * 0.10 +
      projectsScore * 0.10 +
      experienceScore * 0.10 +
      leadershipScore * 0.10 +
      communicationScore * 0.10 +
      certificationsScore * 0.10 +
      learningScore * 0.05 +
      awardsScore * 0.05 +
      sportsScore * 0.05 +
      visionScore * 0.05
  );

  const professionalCapitalScore = Math.max(1, Math.min(100, weightedScore));

  // --- RIGHT PANEL TELEMETRY INDICES ---
  const employabilityIndex = Math.round((technicalScore * 0.35 + experienceScore * 0.25 + projectsScore * 0.20 + communicationScore * 0.20));
  const learningIndex = Math.round((learningScore * 0.40 + certificationsScore * 0.30 + (tech.length > 0 ? 30 : 10)));
  const leadershipIndex = Math.round((leadershipScore * 0.50 + experienceScore * 0.30 + communicationScore * 0.20));
  const innovationIndex = Math.round((projectsScore * 0.40 + (aca.patentsCount > 0 ? 30 : 10) + (aca.researchPublicationsCount > 0 ? 20 : 10) + (lrn.hackathonsAttended > 0 ? 10 : 0)));
  const skillGrowthRate = Math.min(99, Math.round(15 + lrn.learningHoursPerWeek * 3.5 + lrn.coursesCompleted * 4));
  
  // AI Readiness
  const aiToolsCount = state.digitalCompetencies.filter((d) => d.selected && d.category === "AI Tools").length;
  const aiSkillsCount = tech.filter((t) => t.category === "AI/ML").length;
  const aiReadinessScore = Math.min(100, Math.round(40 + aiToolsCount * 15 + aiSkillsCount * 20 + (lrn.aiLearningFrequency === "Daily" ? 20 : 10)));

  // Future Demand Index
  const highDemandTech = tech.filter((t) => t.marketDemand === "High" || t.marketDemand === "Ultra High").length;
  const futureDemandIndex = Math.min(100, Math.round(50 + highDemandTech * 15 + (certs.length > 0 ? 15 : 0)));

  // Readiness Classifications
  const promotionReadiness = experienceScore >= 75 && leadershipScore >= 60 ? "High" : experienceScore >= 50 ? "Moderate" : "Developing";
  const startupReadiness = innovationIndex >= 70 && projectsScore >= 65 ? "High" : innovationIndex >= 50 ? "Moderate" : "Developing";
  const leadershipReadiness = leadershipScore >= 70 ? "High" : leadershipScore >= 45 ? "Moderate" : "Developing";
  const researchReadiness = aca.researchPublicationsCount > 0 || aca.patentsCount > 0 ? "High" : aca.cgpa ? "Moderate" : "Developing";
  const internationalEmployability = communicationScore >= 80 && certs.length >= 2 ? "Global Ready" : communicationScore >= 60 ? "Regional Ready" : "Local Focus";

  // Dynamic AI Insights
  const topStrengths: string[] = [];
  const topWeaknesses: string[] = [];
  const skillGaps: string[] = [];
  const missingCertifications: string[] = [];
  const emergingSkillsToLearn: string[] = [];
  const aiCareerSuggestions: string[] = [];

  if (tech.length >= 3) topStrengths.push(`Strong technical stack with ${tech.length} active technology domains`);
  if (projectsScore >= 70) topStrengths.push(`Proven portfolio with ${proj.length} high-impact engineering projects`);
  if (communicationScore >= 75) topStrengths.push("High communication, presentation, & multilingual confidence");
  if (certs.length >= 2) topStrengths.push(`Verified industry certifications from top-tier providers`);
  if (topStrengths.length === 0) topStrengths.push("Solid foundation ready for rapid technical upskilling");

  if (certs.length === 0) topWeaknesses.push("Missing third-party verified certifications (AWS, GCP, PMP, CFA)");
  if (proj.length < 2) topWeaknesses.push("Limited public code portfolio or live demo deployment links");
  if (lrn.learningHoursPerWeek < 5) topWeaknesses.push("Continuous learning velocity below optimal 8+ hrs/week target");
  if (topWeaknesses.length === 0) topWeaknesses.push("Opportunity to increase international publications and patent filings");

  if (!tech.some((t) => t.category === "AI/ML")) skillGaps.push("Generative AI & LLM Fine-Tuning Integration");
  if (!tech.some((t) => t.category === "Cloud/DevOps")) skillGaps.push("Cloud Native Architecture & Container Orchestration (K8s)");
  if (skillGaps.length === 0) skillGaps.push("Advanced System Architecture & Distributed Consensus");

  if (certs.length === 0) {
    missingCertifications.push("AWS Certified Solutions Architect");
    missingCertifications.push("Google Cloud Professional Cloud Architect");
    missingCertifications.push("Generative AI Engineering Specialist");
  }

  emergingSkillsToLearn.push("Agentic Workflows (LangGraph / AutoGen)");
  emergingSkillsToLearn.push("Vector Databases & High-Performance RAG");
  emergingSkillsToLearn.push("System Design & High-Scale Microservices");

  aiCareerSuggestions.push("Senior AI Solutions Architect");
  aiCareerSuggestions.push("Lead Fullstack & Cloud Engineer");
  aiCareerSuggestions.push("VP of Product & Engineering");

  return {
    professionalCapitalScore,
    completionPercentage: 100,

    employabilityIndex,
    learningIndex,
    leadershipIndex,
    innovationIndex,
    skillGrowthRate,
    aiReadinessScore,
    futureDemandIndex,

    scores: {
      academic: Math.round(academicScore),
      technical: Math.round(technicalScore),
      industry: Math.round(industryScore),
      projects: Math.round(projectsScore),
      experience: Math.round(experienceScore),
      leadership: Math.round(leadershipScore),
      communication: Math.round(communicationScore),
      certifications: Math.round(certificationsScore),
      learning: Math.round(learningScore),
      awards: Math.round(awardsScore),
      sports: Math.round(sportsScore),
      vision: Math.round(visionScore),
    },

    promotionReadiness,
    startupReadiness,
    leadershipReadiness,
    researchReadiness,
    internationalEmployability,

    topStrengths,
    topWeaknesses,
    skillGaps,
    missingCertifications,
    emergingSkillsToLearn,
    aiCareerSuggestions,
  };
}
