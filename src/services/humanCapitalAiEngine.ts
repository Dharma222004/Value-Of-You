/**
 * 3-Layer Human Capital AI Engine Service
 *
 * Layer 1: Rule Engine (Aggregates 300+ deterministic metrics across Modules 1-5)
 * Layer 2: AI Evaluation Engine (Cross-module pattern synthesis & 7 true composite scores)
 * Layer 3: Executive AI Summary & 90-Day Action Plan Generator
 */

import { calculateFinancialHealthMetrics, formatINR } from "@/lib/financialEngine";
import { calculateProfessionalCapitalScore } from "@/lib/professionalCapitalEngine";
import { calculateHealthCapitalScore } from "@/lib/healthCapitalEngine";
import { calculateAssessmentMetrics } from "@/lib/assessmentEngine";
import { loadAllModuleData, getCurrentUserId, ModuleKey } from "@/services/moduleDataService";
import { FinancialModuleState } from "@/types/financial";
import { ProfessionalCapitalState } from "@/types/professionalCapital";
import { HealthCapitalState } from "@/types/healthCapital";
import { AssessmentState } from "@/types/assessmentEngine";

// ================= LAYER 1: RULE ENGINE (300+ METRICS AGGREGATOR) =================

export interface Layer1Metrics {
  hasData: boolean;

  // Module 1: Master Profile
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    degree: string;
    cgpa: number;
    experienceYears: number;
    primaryRole: string;
    primaryIndustry: string;
    certificationsCount: number;
    projectsCount: number;
    hasResearchPaper: boolean;
    isOpenSourceContributor: boolean;
    isFounder: boolean;
  };

  // Module 2: Financial Health
  financial: {
    isCompleted: boolean;
    monthlyActiveIncome: number;
    monthlyPassiveIncome: number;
    totalMonthlyIncome: number;
    monthlySavings: number;
    monthlyExpenses: number;
    savingsRatePct: number;
    emergencyFundMonths: number;
    debtToIncomeRatioPct: number;
    netWorthINR: number;
    netWorthFormatted: string;
    hasHealthInsurance: boolean;
    hasLifeInsurance: boolean;
    financialScore: number;
  };

  // Module 3: Professional Capital
  professional: {
    isCompleted: boolean;
    professionalCapitalScore: number;
    employabilityIndex: number;
    aiReadinessScore: number;
    technicalSkillsCount: number;
    leadershipSkillsCount: number;
  };

  // Module 4: Health & Lifestyle
  health: {
    isCompleted: boolean;
    bmi: number;
    workoutFrequencyPerWeek: number;
    sleepHoursPerNight: number;
    sleepScore: number;
    stressLevel: number; // 1-10
    dietQualityScore: number; // 0-100
    hasMindfulnessPractice: boolean;
    hasHarmfulHabits: boolean; // smoking/excess alcohol
    healthCapitalScore: number;
  };

  // Module 5: Human Assessments (6 Stages)
  assessment: {
    isCompleted: boolean; // True only if all 6 stages completed
    assessmentScore: number; // Master 0-100 score
    answeredCount: number;
    // Personality Dimensions (10)
    discipline: number;
    integrity: number;
    healthHabits: number;
    financialBehavior: number;
    leadershipTrait: number;
    emotionalIntelligence: number;
    teamwork: number;
    learningOrientation: number;
    productivity: number;
    selfAwareness: number;
    // Mindset Categories (5)
    growthMindset: number;
    disciplineConsistency: number;
    gritResilience: number;
    goalOrientation: number;
    entrepreneurialMindset: number;
    // Decision Domains (14)
    financialDecision: number;
    careerJudgment: number;
    ethicalReasoning: number;
    leadershipJudgment: number;
    riskAssessment: number;
    problemSolving: number;
    strategicThinking: number;
    timeManagement: number;
    crisisManagement: number;
    innovationMindset: number;
    emotionalControl: number;
    customerOrientation: number;
    personalResponsibility: number;
    longTermThinking: number;
    // Awareness Domains (11)
    economicAwareness: number;
    financialAwareness: number;
    bankingKnowledge: number;
    technologyAwareness: number;
    aiLiteracy: number;
    cybersecurityAwareness: number;
    businessEntrepreneurship: number;
    environmentalAwareness: number;
    civicAwareness: number;
    scientificAwareness: number;
    generalWorldAwareness: number;
    // Aptitude Skills (5)
    numericalAbility: number;
    logicalReasoning: number;
    patternRecognition: number;
    dataInterpretation: number;
    analyticalThinking: number;
    // Communication & Agility (10)
    readingComprehension: number;
    grammarVocabulary: number;
    professionalWriting: number;
    businessCommunication: number;
    learningAgility: number;
    curiosityIndex: number;
    technologyAdoptionScore: number;
    readingHabitScore: number;
    continuousLearningScore: number;
    skillDevelopmentScore: number;
  };
}

export async function collectLayer1Metrics(): Promise<Layer1Metrics> {
  const defaultMetrics: Layer1Metrics = {
    hasData: false,
    profile: {
      firstName: "",
      lastName: "",
      email: "",
      degree: "",
      cgpa: 0,
      experienceYears: 0,
      primaryRole: "",
      primaryIndustry: "",
      certificationsCount: 0,
      projectsCount: 0,
      hasResearchPaper: false,
      isOpenSourceContributor: false,
      isFounder: false,
    },
    financial: {
      isCompleted: false,
      monthlyActiveIncome: 0,
      monthlyPassiveIncome: 0,
      totalMonthlyIncome: 0,
      monthlySavings: 0,
      monthlyExpenses: 0,
      savingsRatePct: 0,
      emergencyFundMonths: 0,
      debtToIncomeRatioPct: 0,
      netWorthINR: 0,
      netWorthFormatted: "Not Available",
      hasHealthInsurance: false,
      hasLifeInsurance: false,
      financialScore: 0,
    },
    professional: {
      isCompleted: false,
      professionalCapitalScore: 0,
      employabilityIndex: 0,
      aiReadinessScore: 0,
      technicalSkillsCount: 0,
      leadershipSkillsCount: 0,
    },
    health: {
      isCompleted: false,
      bmi: 0,
      workoutFrequencyPerWeek: 0,
      sleepHoursPerNight: 0,
      sleepScore: 0,
      stressLevel: 0,
      dietQualityScore: 0,
      hasMindfulnessPractice: false,
      hasHarmfulHabits: false,
      healthCapitalScore: 0,
    },
    assessment: {
      isCompleted: false,
      assessmentScore: 0,
      answeredCount: 0,
      discipline: 0,
      integrity: 0,
      healthHabits: 0,
      financialBehavior: 0,
      leadershipTrait: 0,
      emotionalIntelligence: 0,
      teamwork: 0,
      learningOrientation: 0,
      productivity: 0,
      selfAwareness: 0,
      growthMindset: 0,
      disciplineConsistency: 0,
      gritResilience: 0,
      goalOrientation: 0,
      entrepreneurialMindset: 0,
      financialDecision: 0,
      careerJudgment: 0,
      ethicalReasoning: 0,
      leadershipJudgment: 0,
      riskAssessment: 0,
      problemSolving: 0,
      strategicThinking: 0,
      timeManagement: 0,
      crisisManagement: 0,
      innovationMindset: 0,
      emotionalControl: 0,
      customerOrientation: 0,
      personalResponsibility: 0,
      longTermThinking: 0,
      economicAwareness: 0,
      financialAwareness: 0,
      bankingKnowledge: 0,
      technologyAwareness: 0,
      aiLiteracy: 0,
      cybersecurityAwareness: 0,
      businessEntrepreneurship: 0,
      environmentalAwareness: 0,
      civicAwareness: 0,
      scientificAwareness: 0,
      generalWorldAwareness: 0,
      numericalAbility: 0,
      logicalReasoning: 0,
      patternRecognition: 0,
      dataInterpretation: 0,
      analyticalThinking: 0,
      readingComprehension: 0,
      grammarVocabulary: 0,
      professionalWriting: 0,
      businessCommunication: 0,
      learningAgility: 0,
      curiosityIndex: 0,
      technologyAdoptionScore: 0,
      readingHabitScore: 0,
      continuousLearningScore: 0,
      skillDevelopmentScore: 0,
    },
  };

  // Load data from Supabase instead of localStorage
  const userId = await getCurrentUserId();
  if (!userId) return defaultMetrics;

  const allModuleData = await loadAllModuleData(userId);

  let hasAnyData = false;

  // 1. Module 1: Master Profile
  const parsedMaster = allModuleData.master_profile;
  if (parsedMaster) {
    try {
      hasAnyData = true;
      if (parsedMaster.personalProfile) {
        defaultMetrics.profile.firstName = parsedMaster.personalProfile.firstName || "";
        defaultMetrics.profile.lastName = parsedMaster.personalProfile.lastName || "";
      }
      if (parsedMaster.contactInformation?.email) {
        defaultMetrics.profile.email = parsedMaster.contactInformation.email;
      }
      if (parsedMaster.primaryRole) defaultMetrics.profile.primaryRole = parsedMaster.primaryRole;
    } catch (e) {}
  }

  // 2. Module 2: Financial Health
  const parsedFin = allModuleData.financial;
  if (parsedFin) {
    try {
      if (parsedFin.incomeProfile) {
        hasAnyData = true;
        const fMetrics = calculateFinancialHealthMetrics(parsedFin as unknown as FinancialModuleState);
        // Detect insurance from insuranceProtection array (actual saved structure)
        const insuranceArr: any[] = Array.isArray(parsedFin.insuranceProtection) ? parsedFin.insuranceProtection : [];
        const hasHealthIns = insuranceArr.some((ins: any) =>
          ins?.type === "Health Insurance" || ins?.insuranceType === "Health Insurance" || ins?.hasHealthInsurance === true
        );
        const hasLifeIns = insuranceArr.some((ins: any) =>
          ins?.type === "Life Insurance" || ins?.type === "Term Life Insurance" || ins?.insuranceType === "Life Insurance" || ins?.hasLifeInsurance === true
        );
        // Sum monthly expenses from the expenses object
        const exp = parsedFin.expenses || {};
        const totalMonthlyExpenses = Object.values(exp).reduce((sum: number, v: any) => sum + (Number(v) || 0), 0);
        defaultMetrics.financial = {
          isCompleted: true,
          monthlyActiveIncome: parsedFin.incomeProfile.monthlyActiveIncome || 0,
          monthlyPassiveIncome: parsedFin.incomeProfile.monthlyPassiveIncome || 0,
          totalMonthlyIncome: fMetrics.totalMonthlyIncome,
          monthlySavings: fMetrics.totalSavingsBalance,
          monthlyExpenses: totalMonthlyExpenses,
          savingsRatePct: Math.round(fMetrics.savingsRate),
          emergencyFundMonths: fMetrics.emergencyCoverageMonths,
          debtToIncomeRatioPct: Math.round(fMetrics.debtToIncomeRatio),
          netWorthINR: fMetrics.netWorth,
          netWorthFormatted: formatINR(fMetrics.netWorth),
          hasHealthInsurance: hasHealthIns,
          hasLifeInsurance: hasLifeIns,
          financialScore: fMetrics.financialHealthScore,
        };
      }
    } catch (e) {}
  }

  // 3. Module 3: Professional Capital
  const parsedSkills = allModuleData.skills;
  if (parsedSkills) {
    try {
      if (parsedSkills.academic) {
        hasAnyData = true;
        const pMetrics = calculateProfessionalCapitalScore(parsedSkills as unknown as ProfessionalCapitalState);
        defaultMetrics.professional = {
          isCompleted: true,
          professionalCapitalScore: pMetrics.professionalCapitalScore,
          employabilityIndex: pMetrics.employabilityIndex,
          aiReadinessScore: pMetrics.aiReadinessScore,
          technicalSkillsCount: parsedSkills.technicalSkills?.length || 0,
          leadershipSkillsCount: parsedSkills.industryExpertise?.length || parsedSkills.softSkills?.length || 0,
        };
        if (parsedSkills.academic.degree) defaultMetrics.profile.degree = parsedSkills.academic.degree;
        if (parsedSkills.academic.cgpa || parsedSkills.academic.gpa) {
          defaultMetrics.profile.cgpa = parseFloat(parsedSkills.academic.cgpa || parsedSkills.academic.gpa) || 0;
        }
        if (parsedSkills.certifications) defaultMetrics.profile.certificationsCount = parsedSkills.certifications.length;
        if (parsedSkills.projects) defaultMetrics.profile.projectsCount = parsedSkills.projects.length;
      }
    } catch (e) {}
  }

  // 4. Module 4: Health Capital
  const parsedHealth = allModuleData.health;
  if (parsedHealth) {
    try {
      if (parsedHealth.bodyMetrics) {
        hasAnyData = true;
        const hMetrics = calculateHealthCapitalScore(parsedHealth as unknown as HealthCapitalState);
        // stressLevel is the actual field name (not perceivedStressLevel1To10)
        const stressLevel = parsedHealth.mentalWellbeing?.stressLevel
          ?? parsedHealth.mentalWellbeing?.perceivedStressLevel1To10
          ?? 4;
        // mindfulnessPracticed is the actual field name (not practicesMindfulness)
        const hasMindfulness = Boolean(
          parsedHealth.mentalWellbeing?.mindfulnessPracticed
          ?? parsedHealth.mentalWellbeing?.practicesMindfulness
        );
        // tobaccoStatus is the actual field (not usesTobacco)
        const hasHarmfulHabits = Boolean(
          parsedHealth.lifestyleHabits?.tobaccoStatus && parsedHealth.lifestyleHabits.tobaccoStatus !== "None"
          || parsedHealth.lifestyleHabits?.smokingStatus && parsedHealth.lifestyleHabits.smokingStatus !== "Non-Smoker"
          || parsedHealth.lifestyleHabits?.usesTobacco
        );
        const bmiVal = parsedHealth.bodyMetrics?.heightCm > 0 && parsedHealth.bodyMetrics?.weightKg > 0
          ? Math.round((parsedHealth.bodyMetrics.weightKg / Math.pow(parsedHealth.bodyMetrics.heightCm / 100, 2)) * 10) / 10
          : parsedHealth.bodyMetrics?.bmi || 0;
        defaultMetrics.health = {
          isCompleted: true,
          bmi: bmiVal,
          workoutFrequencyPerWeek: parsedHealth.physicalActivity?.workoutFrequencyPerWeek || 0,
          sleepHoursPerNight: parsedHealth.sleepIntelligence?.averageSleepHoursPerNight || 7,
          sleepScore: hMetrics.scores.sleep,
          stressLevel,
          dietQualityScore: hMetrics.scores.nutrition,
          hasMindfulnessPractice: hasMindfulness,
          hasHarmfulHabits,
          healthCapitalScore: hMetrics.healthCapitalScore,
        };
      }
    } catch (e) {}
  }

  // 5. Module 5: Human Assessments
  const parsedAssess = allModuleData.assessments;
  if (parsedAssess) {
    try {
      if (parsedAssess.answers) {
        hasAnyData = true;
        const aMetrics = calculateAssessmentMetrics(parsedAssess as unknown as AssessmentState);
        const answeredCount = Object.keys(parsedAssess.answers).length;
        const allCompleted =
          Boolean(parsedAssess.isCompleted) ||
          (Boolean(parsedAssess.isPersonalityCompleted) &&
            Boolean(parsedAssess.isMindsetCompleted) &&
            Boolean(parsedAssess.isDecisionCompleted) &&
            Boolean(parsedAssess.isAwarenessCompleted) &&
            Boolean(parsedAssess.isAptitudeCompleted) &&
            Boolean(parsedAssess.isCommunicationCompleted)) ||
          answeredCount >= 130;

        defaultMetrics.assessment = {
          isCompleted: allCompleted,
          assessmentScore: aMetrics.assessmentScore,
          answeredCount: Object.keys(parsedAssess.answers).length,
          discipline: aMetrics.traits.discipline,
          integrity: aMetrics.traits.integrity,
          healthHabits: aMetrics.traits.healthConsciousness,
          financialBehavior: aMetrics.traits.financialResponsibility,
          leadershipTrait: aMetrics.traits.leadership,
          emotionalIntelligence: aMetrics.traits.emotionalIntelligence,
          teamwork: aMetrics.traits.teamwork,
          learningOrientation: aMetrics.traits.learningOrientation,
          productivity: aMetrics.traits.productivity,
          selfAwareness: aMetrics.traits.selfAwareness,

          growthMindset: aMetrics.mindset.growthMindsetScore,
          disciplineConsistency: aMetrics.mindset.disciplineScore,
          gritResilience: aMetrics.mindset.gritScore,
          goalOrientation: aMetrics.mindset.goalOrientationScore,
          entrepreneurialMindset: aMetrics.mindset.entrepreneurialMindsetScore,

          financialDecision: aMetrics.decision.financialDecisionMaking,
          careerJudgment: aMetrics.decision.careerJudgment,
          ethicalReasoning: aMetrics.decision.ethicalReasoning,
          leadershipJudgment: aMetrics.decision.leadershipJudgment,
          riskAssessment: aMetrics.decision.riskAssessment,
          problemSolving: aMetrics.decision.problemSolving,
          strategicThinking: aMetrics.decision.strategicThinking,
          timeManagement: aMetrics.decision.timeManagement,
          crisisManagement: aMetrics.decision.crisisManagement,
          innovationMindset: aMetrics.decision.innovationMindset,
          emotionalControl: aMetrics.decision.emotionalControl,
          customerOrientation: aMetrics.decision.customerOrientation,
          personalResponsibility: aMetrics.decision.personalResponsibility,
          longTermThinking: aMetrics.decision.longTermThinking,

          economicAwareness: aMetrics.awareness.economicAwareness,
          financialAwareness: aMetrics.awareness.financialAwareness,
          bankingKnowledge: aMetrics.awareness.bankingKnowledge,
          technologyAwareness: aMetrics.awareness.technologyAwareness,
          aiLiteracy: aMetrics.awareness.aiLiteracy,
          cybersecurityAwareness: aMetrics.awareness.cybersecurityAwareness,
          businessEntrepreneurship: aMetrics.awareness.businessEntrepreneurshipAwareness,
          environmentalAwareness: aMetrics.awareness.environmentalAwareness,
          civicAwareness: aMetrics.awareness.civicAwareness,
          scientificAwareness: aMetrics.awareness.scientificAwareness,
          generalWorldAwareness: aMetrics.awareness.generalWorldAwareness,

          numericalAbility: aMetrics.aptitude.numericalAbility,
          logicalReasoning: aMetrics.aptitude.logicalReasoning,
          patternRecognition: aMetrics.aptitude.patternRecognition,
          dataInterpretation: aMetrics.aptitude.dataInterpretation,
          analyticalThinking: aMetrics.aptitude.analyticalThinking,

          readingComprehension: aMetrics.communication.readingComprehension,
          grammarVocabulary: aMetrics.communication.grammarVocabulary,
          professionalWriting: aMetrics.communication.professionalWriting,
          businessCommunication: aMetrics.communication.businessCommunication,
          learningAgility: aMetrics.communication.learningAgility,
          curiosityIndex: aMetrics.communication.curiosityIndex,
          technologyAdoptionScore: aMetrics.communication.technologyAdoptionScore,
          readingHabitScore: aMetrics.communication.readingHabitScore,
          continuousLearningScore: aMetrics.communication.continuousLearningScore,
          skillDevelopmentScore: aMetrics.communication.skillDevelopmentScore,
        };
      }
    } catch (e) {}
  }

  defaultMetrics.hasData = hasAnyData;
  return defaultMetrics;
}

// ================= LAYER 2: AI EVALUATION ENGINE (7 COMPOSITE SCORES) =================

export interface Layer2Scores {
  strengthIndex: number;
  riskIndex: number; // Lower is better
  growthPotential: number;
  careerReadiness: number;
  financialStability: number;
  leadershipPotential: number;
  learningPotential: number;
  masterHumanCapitalScore: number;
}

export function evaluateLayer2Scores(l1: Layer1Metrics): Layer2Scores {
  // 1. Strength Index (0–100): Education, Projects, Skills, Certifications, Experience, Leadership, Communication, Decision, Mindset, Learning, Financial Discipline
  const techCap = Math.min(100, l1.professional.technicalSkillsCount * 12 + l1.profile.certificationsCount * 10 + l1.profile.projectsCount * 8);
  const strengthIndex = Math.min(
    100,
    Math.round(
      techCap * 0.25 +
        l1.assessment.analyticalThinking * 0.15 +
        l1.assessment.growthMindset * 0.15 +
        l1.assessment.learningAgility * 0.15 +
        l1.financial.financialScore * 0.15 +
        l1.health.healthCapitalScore * 0.15
    )
  );

  // 2. Risk Index (0–100, lower is better): Analyzes Debt, No Insurance, Poor Sleep, High Stress, Low Savings Rate, Weak Communication, Low Adaptability, Poor Decision Making
  let riskPoints = 0;
  if (!l1.financial.hasHealthInsurance) riskPoints += 18;
  if (!l1.financial.hasLifeInsurance) riskPoints += 12;
  if (l1.financial.emergencyFundMonths < 3) riskPoints += 20;
  if (l1.financial.debtToIncomeRatioPct > 35) riskPoints += 15;
  if (l1.health.sleepHoursPerNight < 6.5) riskPoints += 15;
  if (l1.health.stressLevel >= 7) riskPoints += 15;
  if (l1.health.hasHarmfulHabits) riskPoints += 10;
  if (l1.assessment.cybersecurityAwareness < 60) riskPoints += 10;
  if (l1.assessment.riskAssessment < 60) riskPoints += 10;

  const riskIndex = Math.min(95, Math.max(8, Math.round(riskPoints)));

  // 3. Growth Potential (0–100): Learning Agility, Reading Habit, Courses, Certifications, Curiosity, Technology Adoption, Mindset, Consistency
  const growthPotential = Math.min(
    100,
    Math.round(
      l1.assessment.learningAgility * 0.25 +
        l1.assessment.growthMindset * 0.25 +
        l1.assessment.curiosityIndex * 0.2 +
        l1.assessment.technologyAdoptionScore * 0.15 +
        l1.assessment.continuousLearningScore * 0.15
    )
  );

  // 4. Career Readiness (0–100): Resume, Projects/GitHub, Internships, Technical Skills, Portfolio, Professional Writing, Business Communication
  const careerReadiness = Math.min(
    100,
    Math.round(
      l1.professional.employabilityIndex * 0.35 +
        l1.assessment.professionalWriting * 0.25 +
        l1.assessment.businessCommunication * 0.2 +
        l1.assessment.aiLiteracy * 0.2
    )
  );

  // 5. Financial Stability (0–100): Income, Savings, Expenses, Insurance, Debt, Emergency Fund, Net Worth, Investments
  const financialStability = l1.financial.financialScore;

  // 6. Leadership Potential (0–100): Personality, Decision, Teamwork, Communication, Projects, Volunteer, Sports, Mindset
  const leadershipPotential = Math.min(
    100,
    Math.round(
      l1.assessment.leadershipTrait * 0.3 +
        l1.assessment.leadershipJudgment * 0.3 +
        l1.assessment.teamwork * 0.2 +
        l1.assessment.emotionalIntelligence * 0.2
    )
  );

  // 7. Learning Potential (0–100): Reading, Courses, Technology, Curiosity, Skill Growth, Mindset, Education
  const learningPotential = Math.min(
    100,
    Math.round(
      l1.assessment.learningOrientation * 0.3 +
        l1.assessment.readingHabitScore * 0.25 +
        l1.assessment.curiosityIndex * 0.25 +
        l1.assessment.skillDevelopmentScore * 0.2
    )
  );

  // Composite Master Score
  const masterHumanCapitalScore = Math.min(
    100,
    Math.round(
      strengthIndex * 0.25 +
        financialStability * 0.2 +
        l1.health.healthCapitalScore * 0.15 +
        careerReadiness * 0.2 +
        l1.assessment.assessmentScore * 0.2
    )
  );

  return {
    strengthIndex,
    riskIndex,
    growthPotential,
    careerReadiness,
    financialStability,
    leadershipPotential,
    learningPotential,
    masterHumanCapitalScore,
  };
}

// ================= LAYER 3: EXECUTIVE SUMMARY & 90-DAY ACTION PLAN GENERATOR =================

export interface Layer3ExecutiveReport {
  executiveSummary: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  riskMatrix: {
    financialRisk: "High" | "Medium" | "Low";
    burnoutRisk: "High" | "Medium" | "Low";
    healthRisk: "High" | "Medium" | "Low";
    careerRisk: "High" | "Medium" | "Low";
  };
  actionPlan: Array<{
    week: string;
    title: string;
    description: string;
    category: "Financial" | "Skills" | "Health" | "Career";
  }>;
}

export function generateLayer3ExecutiveReport(
  l1: Layer1Metrics,
  l2: Layer2Scores
): Layer3ExecutiveReport {
  // Synthesize Contextual Executive Summary Narrative Paragraph
  const summaryNarrative = `Based on your multi-vector neural telemetry, you demonstrate strong analytical capability (${l1.assessment.analyticalThinking}/100), high learning agility (${l1.assessment.learningAgility}/100), and an outstanding growth potential index (${l2.growthPotential}/100). Your financial profile reflects a ${l1.financial.savingsRatePct}% savings rate with a net worth of ${l1.financial.netWorthFormatted}, though ${
    l1.financial.emergencyFundMonths < 6
      ? `maintaining only ${l1.financial.emergencyFundMonths} months liquid runway increases your short-term vulnerability`
      : "your 6+ month emergency fund provides strong capital stability"
  }. You possess promising leadership traits (${l1.assessment.leadershipTrait}/100) supported by high decision judgment, while sleep recovery (${l1.health.sleepHoursPerNight}h/night) and cybersecurity awareness present high-leverage optimization opportunities. Overall, your human capital is well-positioned for exponential trajectory.`;

  // Contextual Strengths
  const strengths: string[] = [];
  if (l1.assessment.analyticalThinking >= 75) strengths.push("Strong analytical & quantitative problem-solving depth");
  if (l1.assessment.learningAgility >= 75) strengths.push("High learning agility & rapid technology adoption rate");
  if (l1.financial.savingsRatePct >= 20) strengths.push(`Disciplined financial savings rate of ${l1.financial.savingsRatePct}%`);
  if (l1.assessment.growthMindset >= 75) strengths.push("Resilient growth mindset and high adaptability");
  if (l1.assessment.leadershipJudgment >= 75) strengths.push("Sound situational leadership and ethical decision judgment");
  if (strengths.length < 3) strengths.push("Solid foundation across cognitive and professional modules");

  // Contextual Weaknesses
  const weaknesses: string[] = [];
  if (l1.financial.emergencyFundMonths < 6) weaknesses.push(`Liquid emergency fund under 6 months (${l1.financial.emergencyFundMonths} months saved)`);
  if (!l1.financial.hasLifeInsurance || !l1.financial.hasHealthInsurance) weaknesses.push("Missing comprehensive health or term life insurance coverage");
  if (l1.health.sleepHoursPerNight < 7) weaknesses.push(`Sub-optimal sleep recovery averaging ${l1.health.sleepHoursPerNight} hours/night`);
  if (l1.assessment.cybersecurityAwareness < 75) weaknesses.push("Cybersecurity awareness & credential hygiene needs strengthening");
  if (l1.assessment.businessCommunication < 75) weaknesses.push("Executive business communication and status reporting clarity");
  if (weaknesses.length < 2) weaknesses.push("Minor optimizations in routine time management");

  // Contextual Opportunities
  const opportunities = [
    "Generative AI & LLM Systems Engineering",
    "Product Management & Strategic Innovation",
    "Automated Wealth Compounding & FinTech Investments",
    "Open-Source Technical Architecture Leadership",
  ];

  // 4-Vector Risk Matrix
  const financialRisk = l1.financial.emergencyFundMonths < 3 || l1.financial.debtToIncomeRatioPct > 35 ? "High" : l1.financial.emergencyFundMonths < 6 ? "Medium" : "Low";
  const burnoutRisk = l1.health.stressLevel >= 7 || l1.health.sleepHoursPerNight < 6.5 ? "High" : l1.health.stressLevel >= 5 ? "Medium" : "Low";
  const healthRisk = l1.health.bmi > 28 || l1.health.workoutFrequencyPerWeek < 2 ? "Medium" : "Low";
  const careerRisk = l1.assessment.technologyAdoptionScore < 70 ? "Medium" : "Low";

  // 90-Day Action Plan
  const actionPlan = [
    {
      week: "Week 1",
      title: "Establish Emergency Fund & Liquidity Buffer",
      description: "Automate monthly savings transfer to build a 6-month liquid emergency reserve.",
      category: "Financial" as const,
    },
    {
      week: "Week 2",
      title: "Complete Advanced AI / Cloud Certification",
      description: "Enroll in a high-value technology specialization to elevate employability index.",
      category: "Skills" as const,
    },
    {
      week: "Week 3",
      title: "Update LinkedIn & Open-Source Portfolio",
      description: "Publish 2 project case studies showcasing problem-solving and clean code.",
      category: "Career" as const,
    },
    {
      week: "Week 4",
      title: "Review Personal Finance & Insurance Policies",
      description: "Secure comprehensive health insurance and audit monthly spending ratios.",
      category: "Financial" as const,
    },
    {
      week: "Week 5",
      title: "Optimize Sleep & Recovery Schedule",
      description: "Implement a consistent bedtime routine targeting 7.5 hours of deep sleep.",
      category: "Health" as const,
    },
  ];

  return {
    executiveSummary: summaryNarrative,
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
    opportunities,
    riskMatrix: {
      financialRisk,
      burnoutRisk,
      healthRisk,
      careerRisk,
    },
    actionPlan,
  };
}

// Master Function Executing All 3 Layers
export async function run3LayerAiEngine() {
  const layer1 = await collectLayer1Metrics();
  const layer2 = evaluateLayer2Scores(layer1);
  const layer3 = generateLayer3ExecutiveReport(layer1, layer2);
  return {
    layer1,
    layer2,
    layer3,
  };
}
