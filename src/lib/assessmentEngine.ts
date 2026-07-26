/**
 * Human Assessment Engine - Evaluation Service
 * Calculates Stage 1 (Personality - 25M), Stage 2 (Mindset - 20M), Stage 3 (Decision - 15M), Stage 4 (Awareness - 15M), Stage 5 (Aptitude - 10M), & Stage 6 (Communication - 15M).
 * Total Suite = 100 Marks!
 */

import {
  PersonalityDimension,
  MindsetCategory,
  AssessmentState,
  AssessmentMetrics,
  PersonalityTraitScores,
  MindsetMetrics,
  DecisionMetrics,
  AwarenessMetrics,
  AptitudeMetrics,
  CommunicationMetrics,
} from "@/types/assessmentEngine";
import {
  PERSONALITY_QUESTION_BANK,
  MINDSET_QUESTION_BANK,
  DECISION_QUESTION_BANK,
  AWARENESS_QUESTION_BANK,
  APTITUDE_QUESTION_BANK,
  COMMUNICATION_QUESTION_BANK,
} from "./assessmentQuestionBank";

export const defaultAssessmentState: AssessmentState = {
  sessionId: `session_${Date.now()}`,
  startTime: new Date().toISOString(),
  activeStage: "personality",
  answers: {},
  personalityQuestionIndex: 0,
  mindsetQuestionIndex: 0,
  decisionQuestionIndex: 0,
  awarenessQuestionIndex: 0,
  aptitudeQuestionIndex: 0,
  communicationQuestionIndex: 0,
  isPersonalityCompleted: false,
  isMindsetCompleted: false,
  isDecisionCompleted: false,
  isAwarenessCompleted: false,
  isAptitudeCompleted: false,
  isCommunicationCompleted: false,
};

export function calculateAssessmentMetrics(state: AssessmentState): AssessmentMetrics {
  // --- 1. PERSONALITY STAGE CALCULATION (25 MARKS) ---
  const dimensionEarnedMarks: Record<PersonalityDimension, number> = {
    "Discipline & Responsibility": 0,
    "Integrity & Ethics": 0,
    "Health & Lifestyle Habits": 0,
    "Financial Behaviour": 0,
    "Leadership & Initiative": 0,
    "Emotional Intelligence": 0,
    "Teamwork & Social Behaviour": 0,
    "Learning & Curiosity": 0,
    "Productivity & Time Management": 0,
    "Self-Awareness & Confidence": 0,
  };

  const dimensionAnsweredMaxMarks: Record<PersonalityDimension, number> = {
    "Discipline & Responsibility": 0,
    "Integrity & Ethics": 0,
    "Health & Lifestyle Habits": 0,
    "Financial Behaviour": 0,
    "Leadership & Initiative": 0,
    "Emotional Intelligence": 0,
    "Teamwork & Social Behaviour": 0,
    "Learning & Curiosity": 0,
    "Productivity & Time Management": 0,
    "Self-Awareness & Confidence": 0,
  };

  const dimensionTotalMaxMarks: Record<PersonalityDimension, number> = {
    "Discipline & Responsibility": 4,
    "Integrity & Ethics": 3,
    "Health & Lifestyle Habits": 2,
    "Financial Behaviour": 2,
    "Leadership & Initiative": 3,
    "Emotional Intelligence": 3,
    "Teamwork & Social Behaviour": 2,
    "Learning & Curiosity": 2,
    "Productivity & Time Management": 2,
    "Self-Awareness & Confidence": 2,
  };

  let personalityEarnedMarksTotal = 0;

  PERSONALITY_QUESTION_BANK.forEach((q) => {
    const dim = q.domain as PersonalityDimension;
    const ans = state.answers[q.id];
    if (ans && ans.selectedOptionId) {
      const selectedOpt = q.options.find((o) => o.id === ans.selectedOptionId);
      if (selectedOpt) {
        const scoreFraction = selectedOpt.weight / 5;
        const marksForThisQ = scoreFraction * q.marks;
        dimensionEarnedMarks[dim] += marksForThisQ;
        dimensionAnsweredMaxMarks[dim] += q.marks;
        personalityEarnedMarksTotal += marksForThisQ;
      }
    }
  });

  const dimensionScores: Record<PersonalityDimension, number> = {
    "Discipline & Responsibility": 0,
    "Integrity & Ethics": 0,
    "Health & Lifestyle Habits": 0,
    "Financial Behaviour": 0,
    "Leadership & Initiative": 0,
    "Emotional Intelligence": 0,
    "Teamwork & Social Behaviour": 0,
    "Learning & Curiosity": 0,
    "Productivity & Time Management": 0,
    "Self-Awareness & Confidence": 0,
  };

  const personalityAnsweredCount = PERSONALITY_QUESTION_BANK.filter((q) => state.answers[q.id]?.selectedOptionId).length;

  (Object.keys(dimensionTotalMaxMarks) as PersonalityDimension[]).forEach((dim) => {
    if (state.isPersonalityCompleted || personalityAnsweredCount >= 50) {
      const pct = Math.round((dimensionEarnedMarks[dim] / dimensionTotalMaxMarks[dim]) * 100);
      dimensionScores[dim] = Math.min(100, Math.max(0, pct));
    } else {
      if (dimensionAnsweredMaxMarks[dim] > 0) {
        const pct = Math.round((dimensionEarnedMarks[dim] / dimensionAnsweredMaxMarks[dim]) * 100);
        dimensionScores[dim] = Math.min(100, Math.max(0, pct));
      } else {
        dimensionScores[dim] = 0;
      }
    }
  });

  const traits: PersonalityTraitScores = {
    discipline: dimensionScores["Discipline & Responsibility"],
    responsibility: dimensionScores["Discipline & Responsibility"],
    integrity: dimensionScores["Integrity & Ethics"],
    healthConsciousness: dimensionScores["Health & Lifestyle Habits"],
    financialResponsibility: dimensionScores["Financial Behaviour"],
    leadership: dimensionScores["Leadership & Initiative"],
    emotionalIntelligence: dimensionScores["Emotional Intelligence"],
    teamwork: dimensionScores["Teamwork & Social Behaviour"],
    learningOrientation: dimensionScores["Learning & Curiosity"],
    productivity: dimensionScores["Productivity & Time Management"],
    selfAwareness: dimensionScores["Self-Awareness & Confidence"],
    confidence: dimensionScores["Self-Awareness & Confidence"],
    reliability: Math.round((dimensionScores["Discipline & Responsibility"] + dimensionScores["Integrity & Ethics"]) / 2),
    consistency: Math.round((dimensionScores["Discipline & Responsibility"] + dimensionScores["Productivity & Time Management"]) / 2),
    growthPotential: Math.round((dimensionScores["Learning & Curiosity"] + dimensionScores["Self-Awareness & Confidence"]) / 2),
  };

  // --- 2. MINDSET STAGE CALCULATION (20 MARKS) ---
  const mindsetCategoryEarned: Record<MindsetCategory, number> = {
    "Growth Mindset": 0,
    "Discipline & Consistency": 0,
    "Grit & Resilience": 0,
    "Goal Orientation & Self-Belief": 0,
    "Entrepreneurial & Financial Mindset": 0,
  };

  const mindsetCategoryAnsweredMax: Record<MindsetCategory, number> = {
    "Growth Mindset": 0,
    "Discipline & Consistency": 0,
    "Grit & Resilience": 0,
    "Goal Orientation & Self-Belief": 0,
    "Entrepreneurial & Financial Mindset": 0,
  };

  const mindsetCategoryTotalMax: Record<MindsetCategory, number> = {
    "Growth Mindset": 4,
    "Discipline & Consistency": 4,
    "Grit & Resilience": 4,
    "Goal Orientation & Self-Belief": 4,
    "Entrepreneurial & Financial Mindset": 4,
  };

  let mindsetEarnedMarksTotal = 0;

  MINDSET_QUESTION_BANK.forEach((q) => {
    const cat = q.domain as MindsetCategory;
    const ans = state.answers[q.id];
    if (ans && ans.selectedOptionId) {
      const selectedOpt = q.options.find((o) => o.id === ans.selectedOptionId);
      if (selectedOpt) {
        const scoreFraction = selectedOpt.weight / 5;
        const marksForThisQ = scoreFraction * q.marks;
        mindsetCategoryEarned[cat] += marksForThisQ;
        mindsetCategoryAnsweredMax[cat] += q.marks;
        mindsetEarnedMarksTotal += marksForThisQ;
      }
    }
  });

  const mindsetAnsweredCount = MINDSET_QUESTION_BANK.filter((q) => state.answers[q.id]?.selectedOptionId).length;

  const categoryScores: Record<MindsetCategory, number> = {
    "Growth Mindset": 0,
    "Discipline & Consistency": 0,
    "Grit & Resilience": 0,
    "Goal Orientation & Self-Belief": 0,
    "Entrepreneurial & Financial Mindset": 0,
  };

  (Object.keys(mindsetCategoryTotalMax) as MindsetCategory[]).forEach((cat) => {
    if (state.isMindsetCompleted || mindsetAnsweredCount >= 25) {
      const pct = Math.round((mindsetCategoryEarned[cat] / mindsetCategoryTotalMax[cat]) * 100);
      categoryScores[cat] = Math.min(100, Math.max(0, pct));
    } else {
      if (mindsetCategoryAnsweredMax[cat] > 0) {
        const pct = Math.round((mindsetCategoryEarned[cat] / mindsetCategoryAnsweredMax[cat]) * 100);
        categoryScores[cat] = Math.min(100, Math.max(0, pct));
      } else {
        categoryScores[cat] = 0;
      }
    }
  });

  const mindset: MindsetMetrics = {
    growthMindsetScore: categoryScores["Growth Mindset"],
    disciplineScore: categoryScores["Discipline & Consistency"],
    consistencyScore: categoryScores["Discipline & Consistency"],
    gritScore: categoryScores["Grit & Resilience"],
    resilienceScore: categoryScores["Grit & Resilience"],
    goalOrientationScore: categoryScores["Goal Orientation & Self-Belief"],
    selfBeliefScore: categoryScores["Goal Orientation & Self-Belief"],
    entrepreneurialMindsetScore: categoryScores["Entrepreneurial & Financial Mindset"],
    financialMindsetScore: categoryScores["Entrepreneurial & Financial Mindset"],
    adaptabilityScore: Math.round((categoryScores["Growth Mindset"] + categoryScores["Entrepreneurial & Financial Mindset"]) / 2),
    mindsetMarksEarned: Math.round(mindsetEarnedMarksTotal * 10) / 10,
    mindsetTotalMarks: 20,
    categoryScores,
  };

  // --- 3. DECISION MAKING STAGE CALCULATION (15 MARKS) ---
  const decisionDomainEarned: Record<string, number> = {};
  const decisionDomainMax: Record<string, number> = {};

  let decisionEarnedMarksTotal = 0;

  DECISION_QUESTION_BANK.forEach((q) => {
    const dom = q.domain as string;
    if (!decisionDomainMax[dom]) {
      decisionDomainEarned[dom] = 0;
      decisionDomainMax[dom] = 0;
    }
    decisionDomainMax[dom] += q.marks;

    const ans = state.answers[q.id];
    if (ans && ans.selectedOptionId) {
      const selectedOpt = q.options.find((o) => o.id === ans.selectedOptionId);
      if (selectedOpt) {
        const scoreFraction = selectedOpt.weight / 5;
        const marksForThisQ = scoreFraction * q.marks;
        decisionDomainEarned[dom] += marksForThisQ;
        decisionEarnedMarksTotal += marksForThisQ;
      }
    }
  });

  const decisionAnsweredCount = DECISION_QUESTION_BANK.filter((q) => state.answers[q.id]?.selectedOptionId).length;

  const getDecScore = (dom: string) => {
    if (!decisionDomainMax[dom]) return 80;
    return Math.min(100, Math.round((decisionDomainEarned[dom] / decisionDomainMax[dom]) * 100));
  };

  const decision: DecisionMetrics = {
    financialDecisionMaking: getDecScore("Financial Decision Making"),
    careerJudgment: getDecScore("Career Judgment"),
    ethicalReasoning: getDecScore("Ethical Reasoning"),
    leadershipJudgment: getDecScore("Leadership Judgment"),
    riskAssessment: getDecScore("Risk Assessment"),
    problemSolving: getDecScore("Problem Solving"),
    strategicThinking: getDecScore("Strategic Thinking"),
    timeManagement: getDecScore("Time Management"),
    crisisManagement: getDecScore("Crisis Management"),
    innovationMindset: getDecScore("Innovation Mindset"),
    emotionalControl: getDecScore("Emotional Control"),
    customerOrientation: getDecScore("Customer Orientation"),
    personalResponsibility: getDecScore("Personal Responsibility"),
    longTermThinking: getDecScore("Long-Term Thinking"),
    decisionMarksEarned: Math.round(decisionEarnedMarksTotal * 10) / 10,
    decisionTotalMarks: 15,
  };

  // --- 4. GENERAL AWARENESS STAGE CALCULATION (15 MARKS) ---
  const awarenessDomainEarned: Record<string, number> = {};
  const awarenessDomainMax: Record<string, number> = {};

  let awarenessEarnedMarksTotal = 0;

  AWARENESS_QUESTION_BANK.forEach((q) => {
    const dom = q.domain as string;
    if (!awarenessDomainMax[dom]) {
      awarenessDomainEarned[dom] = 0;
      awarenessDomainMax[dom] = 0;
    }
    awarenessDomainMax[dom] += q.marks;

    const ans = state.answers[q.id];
    if (ans && ans.selectedOptionId) {
      const selectedOpt = q.options.find((o) => o.id === ans.selectedOptionId);
      if (selectedOpt) {
        const scoreFraction = selectedOpt.weight / 5;
        const marksForThisQ = scoreFraction * q.marks;
        awarenessDomainEarned[dom] += marksForThisQ;
        awarenessEarnedMarksTotal += marksForThisQ;
      }
    }
  });

  const awarenessAnsweredCount = AWARENESS_QUESTION_BANK.filter((q) => state.answers[q.id]?.selectedOptionId).length;

  const getAwaScore = (dom: string) => {
    if (!awarenessDomainMax[dom]) return 80;
    return Math.min(100, Math.round((awarenessDomainEarned[dom] / awarenessDomainMax[dom]) * 100));
  };

  const awareness: AwarenessMetrics = {
    economicAwareness: getAwaScore("Economic Awareness"),
    financialAwareness: getAwaScore("Financial Awareness"),
    bankingKnowledge: getAwaScore("Banking Knowledge"),
    technologyAwareness: getAwaScore("Technology Awareness"),
    aiLiteracy: getAwaScore("AI Literacy"),
    cybersecurityAwareness: getAwaScore("Cybersecurity Awareness"),
    businessEntrepreneurshipAwareness: getAwaScore("Business & Entrepreneurship Awareness"),
    environmentalAwareness: getAwaScore("Environmental Awareness"),
    civicAwareness: getAwaScore("Civic Awareness"),
    scientificAwareness: getAwaScore("Scientific Awareness"),
    generalWorldAwareness: getAwaScore("General World Awareness"),
    awarenessMarksEarned: Math.round(awarenessEarnedMarksTotal * 10) / 10,
    awarenessTotalMarks: 15,
  };

  // --- 5. APTITUDE STAGE CALCULATION (10 MARKS) ---
  const aptitudeSkillEarned: Record<string, number> = {};
  const aptitudeSkillMax: Record<string, number> = {};

  let aptitudeEarnedMarksTotal = 0;

  APTITUDE_QUESTION_BANK.forEach((q) => {
    const skill = q.domain as string;
    if (!aptitudeSkillMax[skill]) {
      aptitudeSkillEarned[skill] = 0;
      aptitudeSkillMax[skill] = 0;
    }
    aptitudeSkillMax[skill] += q.marks;

    const ans = state.answers[q.id];
    if (ans && ans.selectedOptionId) {
      const selectedOpt = q.options.find((o) => o.id === ans.selectedOptionId);
      if (selectedOpt) {
        const scoreFraction = selectedOpt.weight / 5;
        const marksForThisQ = scoreFraction * q.marks;
        aptitudeSkillEarned[skill] += marksForThisQ;
        aptitudeEarnedMarksTotal += marksForThisQ;
      }
    }
  });

  const aptitudeAnsweredCount = APTITUDE_QUESTION_BANK.filter((q) => state.answers[q.id]?.selectedOptionId).length;

  const getAptScore = (skill: string) => {
    if (!aptitudeSkillMax[skill]) return 80;
    return Math.min(100, Math.round((aptitudeSkillEarned[skill] / aptitudeSkillMax[skill]) * 100));
  };

  const aptitude: AptitudeMetrics = {
    numericalAbility: getAptScore("Numerical Ability"),
    logicalReasoning: getAptScore("Logical Reasoning"),
    patternRecognition: getAptScore("Pattern Recognition"),
    dataInterpretation: getAptScore("Data Interpretation"),
    analyticalThinking: getAptScore("Analytical Thinking"),
    aptitudeMarksEarned: Math.round(aptitudeEarnedMarksTotal * 10) / 10,
    aptitudeTotalMarks: 10,
  };

  // --- 6. COMMUNICATION & LEARNING AGILITY STAGE CALCULATION (15 MARKS) ---
  const commDomainEarned: Record<string, number> = {};
  const commDomainMax: Record<string, number> = {};

  let commEarnedMarksTotal = 0;

  COMMUNICATION_QUESTION_BANK.forEach((q) => {
    const dom = q.domain as string;
    if (!commDomainMax[dom]) {
      commDomainEarned[dom] = 0;
      commDomainMax[dom] = 0;
    }
    commDomainMax[dom] += q.marks;

    const ans = state.answers[q.id];
    if (ans && ans.selectedOptionId) {
      const selectedOpt = q.options.find((o) => o.id === ans.selectedOptionId);
      if (selectedOpt) {
        const scoreFraction = selectedOpt.weight / 5;
        const marksForThisQ = scoreFraction * q.marks;
        commDomainEarned[dom] += marksForThisQ;
        commEarnedMarksTotal += marksForThisQ;
      }
    }
  });

  const commAnsweredCount = COMMUNICATION_QUESTION_BANK.filter((q) => state.answers[q.id]?.selectedOptionId).length;

  const getCommScore = (dom: string) => {
    if (!commDomainMax[dom]) return 80;
    return Math.min(100, Math.round((commDomainEarned[dom] / commDomainMax[dom]) * 100));
  };

  // Aggregate Learning Agility score across 5 sub-domains
  const learningAgilityAvg = Math.round(
    (getCommScore("Curiosity Index") +
      getCommScore("Technology Adoption Score") +
      getCommScore("Reading Habit Score") +
      getCommScore("Continuous Learning Score") +
      getCommScore("Skill Development Score")) /
      5
  );

  const communication: CommunicationMetrics = {
    readingComprehension: getCommScore("Reading Comprehension"),
    grammarVocabulary: getCommScore("Grammar & Vocabulary"),
    professionalWriting: getCommScore("Professional Writing"),
    businessCommunication: getCommScore("Business Communication"),
    learningAgility: learningAgilityAvg,
    curiosityIndex: getCommScore("Curiosity Index"),
    technologyAdoptionScore: getCommScore("Technology Adoption Score"),
    readingHabitScore: getCommScore("Reading Habit Score"),
    continuousLearningScore: getCommScore("Continuous Learning Score"),
    skillDevelopmentScore: getCommScore("Skill Development Score"),
    communicationMarksEarned: Math.round(commEarnedMarksTotal * 10) / 10,
    communicationTotalMarks: 15,
  };

  // --- 7. MASTER COMBINED ASSESSMENT SCORE (OUT OF 100 MARKS TOTAL!) ---
  const totalEarnedMarks =
    personalityEarnedMarksTotal +
    mindsetEarnedMarksTotal +
    decisionEarnedMarksTotal +
    awarenessEarnedMarksTotal +
    aptitudeEarnedMarksTotal +
    commEarnedMarksTotal;

  const masterPercentage = Math.round((totalEarnedMarks / 100) * 100);

  const cognitiveBadges: string[] = [];
  if (traits.discipline >= 80) cognitiveBadges.push("High Discipline Executer");
  if (mindset.growthMindsetScore >= 80) cognitiveBadges.push("Growth Mindset Architect");
  if (communication.professionalWriting >= 80) cognitiveBadges.push("Master Business Communicator");
  if (communication.learningAgility >= 80) cognitiveBadges.push("Agile Lifelong Learner");
  if (aptitude.numericalAbility >= 80) cognitiveBadges.push("Quantitative Aptitude Master");
  if (cognitiveBadges.length === 0) cognitiveBadges.push("Developing Behavioral Profile");

  return {
    assessmentScore: Math.min(100, Math.max(0, masterPercentage)),
    activeStage: state.activeStage || "personality",
    personalityMarksEarned: Math.round(personalityEarnedMarksTotal * 10) / 10,
    personalityTotalMarks: 25,
    dimensionScores,
    traits,
    mindset,
    decision,
    awareness,
    aptitude,
    communication,
    cognitiveBadges,
    topStrengths: [
      `High Business Communication (${communication.businessCommunication}/100)`,
      `High Learning Agility (${communication.learningAgility}/100)`,
      `High Professional Writing (${communication.professionalWriting}/100)`,
    ],
    improvementAreas: [
      `Development Area: Reading Comprehension Detail Extraction (${communication.readingComprehension}/100)`,
      `Development Area: Data Interpretation (${aptitude.dataInterpretation}/100)`,
    ],
    aiRecommendations: [
      "Practice structured active listening and precise status update reporting.",
      "Continuously adopt new technology tools early to maintain high workplace agility.",
      "Maintain morning routine consistency to reinforce daily discipline.",
    ],
    totalTimeSpentSeconds: 0,
    answeredCount:
      personalityAnsweredCount +
      mindsetAnsweredCount +
      decisionAnsweredCount +
      awarenessAnsweredCount +
      aptitudeAnsweredCount +
      commAnsweredCount,
    totalQuestionsCount: 130,
  };
}
