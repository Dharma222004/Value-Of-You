/**
 * Health Capital Intelligence Module - Data Models & Interface Specs
 */

export interface BodyMetrics {
  heightCm: number;
  weightKg: number;
  bmi: number;
  bloodGroup: string;
  waistCircumferenceCm?: number;
  bodyFatPercentage?: number;
  restingHeartRate?: number;
  systolicBp?: number;
  diastolicBp?: number;
  knownMedicalConditions?: string;
  familyHistory?: string;
}

export interface PhysicalActivity {
  workoutFrequencyPerWeek: number; // 0-7
  workoutDurationMinutes: number;
  workoutIntensity: "Light" | "Moderate" | "Vigorous" | "HIIT";
  activities: {
    gym: boolean;
    running: boolean;
    walking: boolean;
    cycling: boolean;
    swimming: boolean;
    sports: boolean;
    yoga: boolean;
    stretching: boolean;
  };
  dailySteps: number;
  sedentaryHoursPerDay: number;
}

export interface SleepIntelligence {
  averageSleepHoursPerNight: number;
  scheduleConsistency: "Inconsistent" | "Fairly Consistent" | "Strict Routine";
  sleepQuality: "Poor" | "Fair" | "Good" | "Excellent";
  timeToFallAsleepMinutes: number;
  wakeUpFrequencyPerNight: number;
  morningEnergyLevel: number; // 1-5
  napFrequency: "Never" | "Occasional" | "Daily";
  screenUsageBeforeSleepMinutes: number;
}

export interface NutritionIntelligence {
  mealsPerDay: number;
  breakfastHabit: "Daily" | "Skip Often" | "Intermittent Fasting";
  proteinIntakeGrams: number;
  vegetableServingsPerDay: number;
  fruitServingsPerDay: number;
  waterIntakeLiters: number;
  sugarIntakeLevel: "Low" | "Moderate" | "High";
  fastFoodFrequencyPerWeek: number;
  processedFoodFrequency: "Rarely" | "Weekly" | "Daily";
  alcoholFrequencyPerWeek: number;
  supplementsTaken: string;
}

export interface MentalWellbeing {
  stressLevel: number; // 1-10
  anxietyLevel: number; // 1-10
  moodRating: number; // 1-10
  burnoutRiskLevel: number; // 1-10
  workLifeBalanceRating: number; // 1-5
  emotionalStabilityRating: number; // 1-5
  lifeSatisfactionRating: number; // 1-5
  meditationFrequencyPerWeek: number;
  mindfulnessPracticed: boolean;
  journalingPracticed: boolean;
  therapyPracticed: boolean;
}

export interface LifestyleHabits {
  smokingStatus: "Non-Smoker" | "Former Smoker" | "Active Smoker";
  alcoholStatus: "None" | "Social" | "Moderate" | "Heavy";
  tobaccoStatus: "None" | "Occasional" | "Regular";
  lateNightSleepingFrequency: "Rarely" | "1-2 times/wk" | "Almost Daily";
  dailyScreenTimeHours: number;
  dailyGamingHours: number;
  dailySocialMediaHours: number;
  readingBooksHabit: boolean;
  learningHabit: boolean;
  morningRoutineEstablished: boolean;
}

export interface MedicalProfile {
  allergies: string;
  chronicConditions: string;
  currentMedications: string;
  pastSurgeries: string;
  visionHealth: "Normal" | "Corrected" | "Impaired";
  hearingHealth: "Normal" | "Impaired";
  dentalHealthRating: "Good" | "Fair" | "Poor";
  vaccinationStatus: "Up to Date" | "Partial" | "Unvaccinated";
}

export interface ProductivityRecovery {
  deepWorkHoursPerDay: number;
  learningHoursPerWeek: number;
  focusLevelRating: number; // 1-5
  dailyEnergyLevelRating: number; // 1-5
  breakFrequencyMinutes: number;
  weekendRecoveryQuality: "Poor" | "Moderate" | "Restorative";
  vacationFrequencyPerYear: number;
}

export interface HealthGoalItem {
  id: string;
  goalName: string;
  targetDescription: string;
  targetDate: string;
  currentProgressPercentage: number;
}

export interface HealthGoalsData {
  selectedGoals: string[];
  customGoalItems: HealthGoalItem[];
}

export interface HealthCapitalState {
  bodyMetrics: BodyMetrics;
  physicalActivity: PhysicalActivity;
  sleepIntelligence: SleepIntelligence;
  nutritionIntelligence: NutritionIntelligence;
  mentalWellbeing: MentalWellbeing;
  lifestyleHabits: LifestyleHabits;
  medicalProfile: MedicalProfile;
  productivityRecovery: ProductivityRecovery;
  healthGoals: HealthGoalsData;
}

export interface HealthCapitalMetrics {
  healthCapitalScore: number; // 0-100
  biologicalAgeEstimate: number; // Approx years
  chronologicalAge: number;
  physicalCapacityIndex: number; // 0-100
  mentalCapacityIndex: number; // 0-100
  recoveryCapacityIndex: number; // 0-100
  longevityIndex: number; // 0-100
  productivityCapacityIndex: number; // 0-100
  burnoutRiskLevel: "Low" | "Moderate" | "High" | "Critical";
  lifestyleQualityIndex: number; // 0-100
  healthRiskIndicator: "Optimal" | "Moderate Risk" | "Elevated Risk";
  energyIndex: number; // 0-100

  scores: {
    physical: number; // 20%
    fitness: number; // 15%
    sleep: number; // 15%
    nutrition: number; // 15%
    mental: number; // 15%
    lifestyle: number; // 10%
    medical: number; // 5%
    productivity: number; // 5%
    goals: number; // 5%
  };

  topStrengths: string[];
  improvementAreas: string[];
  lifestyleRecommendations: string[];
  exerciseRecommendations: string[];
  sleepRecommendations: string[];
  nutritionRecommendations: string[];
  mentalRecommendations: string[];
  riskAlerts: string[];
}
