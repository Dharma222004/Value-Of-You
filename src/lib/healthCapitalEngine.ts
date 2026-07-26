/**
 * Health Capital Intelligence Module - Calculation Engine
 * Calculates Health Capital Score (0-100) based on 9 weighted vectors:
 * 1. Physical Health (20%)
 * 2. Fitness (15%)
 * 3. Sleep (15%)
 * 4. Nutrition (15%)
 * 5. Mental Health (15%)
 * 6. Lifestyle (10%)
 * 7. Medical Profile (5%)
 * 8. Productivity (5%)
 * 9. Goals (5%)
 * Total = 100%
 */

import { HealthCapitalState, HealthCapitalMetrics } from "@/types/healthCapital";

export const defaultHealthCapitalState: HealthCapitalState = {
  bodyMetrics: {
    heightCm: 0,
    weightKg: 0,
    bmi: 0,
    bloodGroup: "",
    waistCircumferenceCm: undefined,
    bodyFatPercentage: undefined,
    restingHeartRate: undefined,
    systolicBp: undefined,
    diastolicBp: undefined,
    knownMedicalConditions: "",
    familyHistory: "",
  },
  physicalActivity: {
    workoutFrequencyPerWeek: 0,
    workoutDurationMinutes: 0,
    workoutIntensity: "Moderate",
    activities: {
      gym: false,
      running: false,
      walking: false,
      cycling: false,
      swimming: false,
      sports: false,
      yoga: false,
      stretching: false,
    },
    dailySteps: 0,
    sedentaryHoursPerDay: 0,
  },
  sleepIntelligence: {
    averageSleepHoursPerNight: 0,
    scheduleConsistency: "Fairly Consistent",
    sleepQuality: "Good",
    timeToFallAsleepMinutes: 0,
    wakeUpFrequencyPerNight: 0,
    morningEnergyLevel: 3,
    napFrequency: "Occasional",
    screenUsageBeforeSleepMinutes: 0,
  },
  nutritionIntelligence: {
    mealsPerDay: 0,
    breakfastHabit: "Daily",
    proteinIntakeGrams: 0,
    vegetableServingsPerDay: 0,
    fruitServingsPerDay: 0,
    waterIntakeLiters: 0,
    sugarIntakeLevel: "Moderate",
    fastFoodFrequencyPerWeek: 0,
    processedFoodFrequency: "Weekly",
    alcoholFrequencyPerWeek: 0,
    supplementsTaken: "",
  },
  mentalWellbeing: {
    stressLevel: 4,
    anxietyLevel: 3,
    moodRating: 7,
    burnoutRiskLevel: 3,
    workLifeBalanceRating: 4,
    emotionalStabilityRating: 4,
    lifeSatisfactionRating: 4,
    meditationFrequencyPerWeek: 0,
    mindfulnessPracticed: false,
    journalingPracticed: false,
    therapyPracticed: false,
  },
  lifestyleHabits: {
    smokingStatus: "Non-Smoker",
    alcoholStatus: "None",
    tobaccoStatus: "None",
    lateNightSleepingFrequency: "Rarely",
    dailyScreenTimeHours: 0,
    dailyGamingHours: 0,
    dailySocialMediaHours: 0,
    readingBooksHabit: false,
    learningHabit: false,
    morningRoutineEstablished: false,
  },
  medicalProfile: {
    allergies: "",
    chronicConditions: "",
    currentMedications: "",
    pastSurgeries: "",
    visionHealth: "Normal",
    hearingHealth: "Normal",
    dentalHealthRating: "Good",
    vaccinationStatus: "Up to Date",
  },
  productivityRecovery: {
    deepWorkHoursPerDay: 0,
    learningHoursPerWeek: 0,
    focusLevelRating: 4,
    dailyEnergyLevelRating: 4,
    breakFrequencyMinutes: 60,
    weekendRecoveryQuality: "Restorative",
    vacationFrequencyPerYear: 2,
  },
  healthGoals: {
    selectedGoals: [],
    customGoalItems: [],
  },
};

export function calculateHealthCapitalScore(state: HealthCapitalState): HealthCapitalMetrics {
  const {
    bodyMetrics: bm,
    physicalActivity: pa,
    sleepIntelligence: si,
    nutritionIntelligence: ni,
    mentalWellbeing: mw,
    lifestyleHabits: lh,
    medicalProfile: mp,
    productivityRecovery: pr,
    healthGoals: hg,
  } = state;

  // 1. Physical Health Score (20%)
  let physical = 70;
  if (bm.heightCm > 0 && bm.weightKg > 0) {
    const bmiVal = bm.weightKg / Math.pow(bm.heightCm / 100, 2);
    if (bmiVal >= 18.5 && bmiVal <= 24.9) physical += 15;
    else if (bmiVal >= 25 && bmiVal <= 29.9) physical += 5;
    else physical -= 5;
  }
  if (bm.restingHeartRate) {
    if (bm.restingHeartRate >= 50 && bm.restingHeartRate <= 70) physical += 10;
    else if (bm.restingHeartRate < 50 || bm.restingHeartRate <= 80) physical += 5;
  }
  if (bm.bodyFatPercentage) {
    if (bm.bodyFatPercentage >= 10 && bm.bodyFatPercentage <= 22) physical += 5;
  }
  physical = Math.min(100, Math.max(20, physical));

  // 2. Fitness Score (15%)
  let fitness = 50;
  if (pa.workoutFrequencyPerWeek >= 3) fitness += 20;
  else if (pa.workoutFrequencyPerWeek >= 1) fitness += 10;
  if (pa.dailySteps >= 8000) fitness += 15;
  else if (pa.dailySteps >= 5000) fitness += 10;
  const activeCount = Object.values(pa.activities).filter(Boolean).length;
  fitness += Math.min(15, activeCount * 3);
  if (pa.sedentaryHoursPerDay > 8) fitness -= 10;
  fitness = Math.min(100, Math.max(20, fitness));

  // 3. Sleep Score (15%)
  let sleep = 50;
  if (si.averageSleepHoursPerNight >= 7 && si.averageSleepHoursPerNight <= 9) sleep += 25;
  else if (si.averageSleepHoursPerNight >= 6) sleep += 15;
  if (si.scheduleConsistency === "Strict Routine") sleep += 15;
  else if (si.scheduleConsistency === "Fairly Consistent") sleep += 10;
  if (si.sleepQuality === "Excellent") sleep += 10;
  else if (si.sleepQuality === "Good") sleep += 5;
  if (si.screenUsageBeforeSleepMinutes < 30) sleep += 5;
  sleep = Math.min(100, Math.max(20, sleep));

  // 4. Nutrition Score (15%)
  let nutrition = 50;
  if (ni.waterIntakeLiters >= 2.5) nutrition += 15;
  else if (ni.waterIntakeLiters >= 1.5) nutrition += 10;
  if (ni.vegetableServingsPerDay >= 3) nutrition += 15;
  else if (ni.vegetableServingsPerDay >= 1) nutrition += 8;
  if (ni.sugarIntakeLevel === "Low") nutrition += 10;
  if (ni.fastFoodFrequencyPerWeek <= 1) nutrition += 10;
  nutrition = Math.min(100, Math.max(20, nutrition));

  // 5. Mental Health Score (15%)
  let mental = 60;
  mental += (10 - mw.stressLevel) * 2;
  mental += (10 - mw.anxietyLevel) * 2;
  mental += mw.moodRating * 2;
  if (mw.meditationFrequencyPerWeek > 0) mental += 5;
  if (mw.mindfulnessPracticed) mental += 5;
  mental = Math.min(100, Math.max(20, mental));

  // 6. Lifestyle Score (10%)
  let lifestyle = 70;
  if (lh.smokingStatus === "Non-Smoker") lifestyle += 15;
  else if (lh.smokingStatus === "Former Smoker") lifestyle += 8;
  if (lh.alcoholStatus === "None" || lh.alcoholStatus === "Social") lifestyle += 10;
  if (lh.readingBooksHabit) lifestyle += 5;
  if (lh.morningRoutineEstablished) lifestyle += 5;
  lifestyle = Math.min(100, Math.max(20, lifestyle));

  // 7. Medical Profile (5%)
  let medical = 80;
  if (mp.vaccinationStatus === "Up to Date") medical += 10;
  if (mp.dentalHealthRating === "Good") medical += 10;
  medical = Math.min(100, Math.max(30, medical));

  // 8. Productivity & Recovery (5%)
  let productivity = 65;
  productivity += pr.focusLevelRating * 4;
  productivity += pr.dailyEnergyLevelRating * 3;
  if (pr.weekendRecoveryQuality === "Restorative") productivity += 10;
  productivity = Math.min(100, Math.max(30, productivity));

  // 9. Goals Score (5%)
  let goals = 50;
  if (hg.selectedGoals.length > 0) goals += Math.min(30, hg.selectedGoals.length * 10);
  if (hg.customGoalItems.length > 0) goals += 20;
  goals = Math.min(100, Math.max(30, goals));

  // --- COMPOSITE HEALTH CAPITAL SCORE (100% TOTAL) ---
  const healthCapitalScore = Math.round(
    physical * 0.20 +
      fitness * 0.15 +
      sleep * 0.15 +
      nutrition * 0.15 +
      mental * 0.15 +
      lifestyle * 0.10 +
      medical * 0.05 +
      productivity * 0.05 +
      goals * 0.05
  );

  // Derived Longevity & Capacity Indices
  const chronologicalAge = 28;
  let bioAgeDelta = 0;
  if (healthCapitalScore > 85) bioAgeDelta = -4;
  else if (healthCapitalScore > 75) bioAgeDelta = -2;
  else if (healthCapitalScore < 60) bioAgeDelta = +3;
  const biologicalAgeEstimate = chronologicalAge + bioAgeDelta;

  const physicalCapacityIndex = Math.round((physical + fitness) / 2);
  const mentalCapacityIndex = Math.round((mental + productivity) / 2);
  const recoveryCapacityIndex = Math.round((sleep + (100 - mw.burnoutRiskLevel * 10)) / 2);
  const longevityIndex = Math.round((physical * 0.4 + lifestyle * 0.3 + sleep * 0.3));
  const productivityCapacityIndex = Math.round((productivity + mental) / 2);
  const lifestyleQualityIndex = Math.round((lifestyle + nutrition) / 2);
  const energyIndex = Math.round((sleep * 0.5 + fitness * 0.5));

  let burnoutRiskLevel: "Low" | "Moderate" | "High" | "Critical" = "Low";
  if (mw.burnoutRiskLevel >= 8) burnoutRiskLevel = "Critical";
  else if (mw.burnoutRiskLevel >= 6) burnoutRiskLevel = "High";
  else if (mw.burnoutRiskLevel >= 4) burnoutRiskLevel = "Moderate";

  let healthRiskIndicator: "Optimal" | "Moderate Risk" | "Elevated Risk" = "Optimal";
  if (healthCapitalScore < 65) healthRiskIndicator = "Elevated Risk";
  else if (healthCapitalScore < 80) healthRiskIndicator = "Moderate Risk";

  // Insights & Recommendations
  const topStrengths: string[] = [];
  if (physical > 75) topStrengths.push("Excellent Metabolic & Physical Baseline");
  if (fitness > 75) topStrengths.push("Consistent Fitness & Movement Habit");
  if (sleep > 75) topStrengths.push("Restorative Sleep & Circadian Routine");
  if (nutrition > 75) topStrengths.push("High-Quality Hydration & Nutrition Intake");
  if (mental > 75) topStrengths.push("Strong Mental Resilience & Stress Control");
  if (topStrengths.length === 0) topStrengths.push("Active Commitment to Health Growth");

  const improvementAreas: string[] = [];
  if (sleep < 70) improvementAreas.push("Optimize Sleep Duration & Screen Habits");
  if (fitness < 70) improvementAreas.push("Increase Weekly Physical Workout Frequency");
  if (nutrition < 70) improvementAreas.push("Boost Water & Vegetable Servings");
  if (mental < 70) improvementAreas.push("Practice Daily Mindfulness or Stress Recovery");
  if (lifestyle < 70) improvementAreas.push("Reduce Late Night Screen Hours");
  if (improvementAreas.length === 0) improvementAreas.push("Maintain Current Peak Longevity Routine");

  return {
    healthCapitalScore,
    biologicalAgeEstimate,
    chronologicalAge,
    physicalCapacityIndex,
    mentalCapacityIndex,
    recoveryCapacityIndex,
    longevityIndex,
    productivityCapacityIndex,
    burnoutRiskLevel,
    lifestyleQualityIndex,
    healthRiskIndicator,
    energyIndex,
    scores: {
      physical: Math.round(physical),
      fitness: Math.round(fitness),
      sleep: Math.round(sleep),
      nutrition: Math.round(nutrition),
      mental: Math.round(mental),
      lifestyle: Math.round(lifestyle),
      medical: Math.round(medical),
      productivity: Math.round(productivity),
      goals: Math.round(goals),
    },
    topStrengths,
    improvementAreas,
    lifestyleRecommendations: [
      "Target 7.5–8.0 hours of consistent sleep per night.",
      "Incorporate 20 minutes of daily morning sunlight exposure.",
    ],
    exerciseRecommendations: [
      "Maintain at least 150 minutes of moderate aerobic workout per week.",
      "Include 2-3 resistance training sessions to maintain muscle mass.",
    ],
    sleepRecommendations: [
      "Disable screens 45 minutes prior to sleep.",
      "Keep bedroom temperature cool (around 18-20°C).",
    ],
    nutritionRecommendations: [
      "Target 2.5L to 3.0L of daily hydration.",
      "Maintain 1.5g protein per kg of bodyweight.",
    ],
    mentalRecommendations: [
      "Practice 10 minutes of box breathing or meditation daily.",
      "Schedule non-negotiable weekend recovery downtime.",
    ],
    riskAlerts: mw.burnoutRiskLevel >= 7 ? ["High Burnout Risk Detected - Prioritize Recovery Downtime."] : [],
  };
}
