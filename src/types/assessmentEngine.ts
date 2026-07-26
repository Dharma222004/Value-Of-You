/**
 * Human Assessment Engine - Data Models & Interface Specs
 */

export type QuestionType =
  | "likert"
  | "mcq"
  | "sjt"
  | "ranking"
  | "timed_aptitude"
  | "image_based"
  | "frequency"
  | "yes_no";

export type AssessmentStage = "personality" | "mindset" | "decision" | "awareness" | "aptitude" | "communication";

export type PersonalityDimension =
  | "Discipline & Responsibility"
  | "Integrity & Ethics"
  | "Health & Lifestyle Habits"
  | "Financial Behaviour"
  | "Leadership & Initiative"
  | "Emotional Intelligence"
  | "Teamwork & Social Behaviour"
  | "Learning & Curiosity"
  | "Productivity & Time Management"
  | "Self-Awareness & Confidence";

export type MindsetCategory =
  | "Growth Mindset"
  | "Discipline & Consistency"
  | "Grit & Resilience"
  | "Goal Orientation & Self-Belief"
  | "Entrepreneurial & Financial Mindset";

export type DecisionDomain =
  | "Financial Decision Making"
  | "Career Judgment"
  | "Ethical Reasoning"
  | "Leadership Judgment"
  | "Risk Assessment"
  | "Problem Solving"
  | "Strategic Thinking"
  | "Time Management"
  | "Crisis Management"
  | "Innovation Mindset"
  | "Emotional Control"
  | "Customer Orientation"
  | "Personal Responsibility"
  | "Long-Term Thinking";

export type AwarenessCategory =
  | "Economic Awareness"
  | "Financial Awareness"
  | "Banking Knowledge"
  | "Technology Awareness"
  | "AI Literacy"
  | "Cybersecurity Awareness"
  | "Business & Entrepreneurship Awareness"
  | "Environmental Awareness"
  | "Civic Awareness"
  | "Scientific Awareness"
  | "General World Awareness";

export type AptitudeSkill =
  | "Numerical Ability"
  | "Logical Reasoning"
  | "Pattern Recognition"
  | "Data Interpretation"
  | "Analytical Thinking";

export type CommunicationDomain =
  | "Reading Comprehension"
  | "Grammar & Vocabulary"
  | "Professional Writing"
  | "Business Communication"
  | "Learning Agility"
  | "Curiosity Index"
  | "Technology Adoption Score"
  | "Reading Habit Score"
  | "Continuous Learning Score"
  | "Skill Development Score";

export type AssessmentDomain =
  | PersonalityDimension
  | MindsetCategory
  | DecisionDomain
  | AwarenessCategory
  | AptitudeSkill
  | CommunicationDomain;

export type QuestionDifficulty = "Easy" | "Medium" | "Hard";

export interface QuestionOption {
  id: string;
  text: string;
  weight: number; // Score weight (1 to 5)
  isCorrect?: boolean;
}

export interface QuestionItem {
  id: string;
  stage: AssessmentStage;
  domain: AssessmentDomain;
  subDomain: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  questionText: string;
  scenarioText?: string;
  imageUrl?: string;
  estimatedTimeSeconds: number;
  marks: number;
  options: QuestionOption[];
  scoringRules: string;
  explanation?: string;
  tags: string[];
  aiEvaluationMetadata: {
    cognitiveTaxonomy: "Remember" | "Understand" | "Apply" | "Analyze" | "Evaluate" | "Create";
    targetTrait: string;
  };
}

export interface AssessmentAnswerState {
  questionId: string;
  selectedOptionId?: string;
  rankedOptionIds?: string[];
  timeSpentSeconds: number;
  isFlaggedForReview?: boolean;
}

export interface AssessmentState {
  sessionId: string;
  startTime: string;
  activeStage: AssessmentStage;
  answers: Record<string, AssessmentAnswerState>;
  personalityQuestionIndex: number;
  mindsetQuestionIndex: number;
  decisionQuestionIndex: number;
  awarenessQuestionIndex: number;
  aptitudeQuestionIndex: number;
  communicationQuestionIndex: number;
  isPersonalityCompleted: boolean;
  isMindsetCompleted: boolean;
  isDecisionCompleted: boolean;
  isAwarenessCompleted: boolean;
  isAptitudeCompleted: boolean;
  isCommunicationCompleted: boolean;
}

export interface PersonalityTraitScores {
  discipline: number;
  responsibility: number;
  integrity: number;
  healthConsciousness: number;
  financialResponsibility: number;
  leadership: number;
  emotionalIntelligence: number;
  teamwork: number;
  learningOrientation: number;
  productivity: number;
  selfAwareness: number;
  confidence: number;
  reliability: number;
  consistency: number;
  growthPotential: number;
}

export interface MindsetMetrics {
  growthMindsetScore: number;
  disciplineScore: number;
  consistencyScore: number;
  gritScore: number;
  resilienceScore: number;
  goalOrientationScore: number;
  selfBeliefScore: number;
  entrepreneurialMindsetScore: number;
  financialMindsetScore: number;
  adaptabilityScore: number;
  mindsetMarksEarned: number; // Out of 20 Marks
  mindsetTotalMarks: number; // 20 Marks
  categoryScores: Record<MindsetCategory, number>;
}

export interface DecisionMetrics {
  financialDecisionMaking: number;
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
  decisionMarksEarned: number; // Out of 15 Marks
  decisionTotalMarks: number; // 15 Marks
}

export interface AwarenessMetrics {
  economicAwareness: number;
  financialAwareness: number;
  bankingKnowledge: number;
  technologyAwareness: number;
  aiLiteracy: number;
  cybersecurityAwareness: number;
  businessEntrepreneurshipAwareness: number;
  environmentalAwareness: number;
  civicAwareness: number;
  scientificAwareness: number;
  generalWorldAwareness: number;
  awarenessMarksEarned: number; // Out of 15 Marks
  awarenessTotalMarks: number; // 15 Marks
}

export interface AptitudeMetrics {
  numericalAbility: number;
  logicalReasoning: number;
  patternRecognition: number;
  dataInterpretation: number;
  analyticalThinking: number;
  aptitudeMarksEarned: number; // Out of 10 Marks
  aptitudeTotalMarks: number; // 10 Marks
}

export interface CommunicationMetrics {
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
  communicationMarksEarned: number; // Out of 15 Marks
  communicationTotalMarks: number; // 15 Marks
}

export interface AssessmentMetrics {
  assessmentScore: number; // 0-100 Master Score
  activeStage: AssessmentStage;
  personalityMarksEarned: number; // Out of 25 Marks
  personalityTotalMarks: number; // 25 Marks
  dimensionScores: Record<PersonalityDimension, number>;
  traits: PersonalityTraitScores;
  mindset: MindsetMetrics;
  decision: DecisionMetrics;
  awareness: AwarenessMetrics;
  aptitude: AptitudeMetrics;
  communication: CommunicationMetrics;
  cognitiveBadges: string[];
  topStrengths: string[];
  improvementAreas: string[];
  aiRecommendations: string[];
  totalTimeSpentSeconds: number;
  answeredCount: number;
  totalQuestionsCount: number;
}
