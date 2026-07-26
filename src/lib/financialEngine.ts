/**
 * Human Capital Platform - Financial Health Intelligence Engine
 * Computes 17 Advanced Financial Metrics, 11 Weighted Sub-Scores,
 * and a 0-100 Financial Health Index with Strategic Insights.
 */

import {
  FinancialModuleState,
  AdvancedFinancialMetrics,
  LikertScale,
} from "@/types/financial";

export const formatINR = (val: number): string => {
  if (isNaN(val) || val === null || val === undefined) return "₹0";
  const abs = Math.abs(val);
  const prefix = val < 0 ? "-₹" : "₹";
  if (abs >= 10000000) {
    return `${prefix}${(abs / 10000000).toFixed(2)} Cr`;
  } else if (abs >= 100000) {
    return `${prefix}${(abs / 100000).toFixed(2)} L`;
  } else if (abs >= 1000) {
    return `${prefix}${(abs / 1000).toFixed(1)} K`;
  }
  return `${prefix}${abs.toLocaleString("en-IN")}`;
};

export const defaultFinancialModuleState: FinancialModuleState = {
  incomeProfile: {
    primarySource: "",
    employmentType: "Full-Time Salaried",
    monthlyActiveIncome: 0,
    monthlyPassiveIncome: 0,
    monthlyBonusIncome: 0,
    monthlyFreelanceIncome: 0,
    monthlyBusinessIncome: 0,
    monthlyRentalIncome: 0,
    monthlyDividendIncome: 0,
    monthlyInterestIncome: 0,
    monthlyRoyaltyIncome: 0,
    monthlyOtherIncome: 0,
  },
  savingsPosition: {
    cashInHand: 0,
    savingsAccountBalance: 0,
    currentAccountBalance: 0,
    emergencyFundBalance: 0,
    fixedDeposits: 0,
    recurringDeposits: 0,
    foreignCurrencySavings: 0,
  },
  investments: [],
  assets: [],
  liabilities: [],
  expenses: {
    housing: 0,
    food: 0,
    transportation: 0,
    utilities: 0,
    healthcare: 0,
    insurance: 0,
    education: 0,
    entertainment: 0,
    shopping: 0,
    travel: 0,
    subscriptions: 0,
    familySupport: 0,
    taxes: 0,
    miscellaneous: 0,
  },
  insuranceProtection: [],
  behaviour: {
    maintainMonthlyBudget: "Sometimes",
    trackExpensesRegularly: "Sometimes",
    investFrequency: "Sometimes",
    reviewInvestmentsFrequency: "Sometimes",
    fileTaxesOnTime: "Always",
    hasEmergencyFundSetAside: "Often",
    missedEmiPayments: "Never",
    missedCreditCardPayments: "Never",
    hasClearFinancialGoals: "Often",
  },
  goals: [],
  riskProfile: {
    riskAppetite: "Moderate",
    investmentHorizon: "Medium Term (3 - 7 Yrs)",
    incomeStability: "High",
    dependentsCount: 1,
    jobSecurityRating: "Secure",
    emergencyPreparedness: "Adequate",
  },
  literacy: {
    budgeting: 3,
    investing: 3,
    taxation: 3,
    insurance: 3,
    retirementPlanning: 3,
    debtManagement: 4,
    riskManagement: 3,
    personalFinance: 3,
  },
};

function likertToScore(val: LikertScale, positive: boolean = true): number {
  switch (val) {
    case "Always":
      return positive ? 100 : 0;
    case "Often":
      return positive ? 75 : 25;
    case "Sometimes":
      return positive ? 50 : 50;
    case "Rarely":
      return positive ? 25 : 75;
    case "Never":
      return positive ? 0 : 100;
    default:
      return 50;
  }
}

export function calculateFinancialHealthMetrics(
  state: FinancialModuleState
): AdvancedFinancialMetrics {
  const inc = state.incomeProfile;
  const sav = state.savingsPosition;
  const exp = state.expenses;

  // 1. Total Monthly Income & Passive Income
  const monthlyActiveSum =
    (inc.monthlyActiveIncome || 0) +
    (inc.monthlyBonusIncome || 0) +
    (inc.monthlyFreelanceIncome || 0) +
    (inc.monthlyBusinessIncome || 0);

  const monthlyPassiveSum =
    (inc.monthlyPassiveIncome || 0) +
    (inc.monthlyRentalIncome || 0) +
    (inc.monthlyDividendIncome || 0) +
    (inc.monthlyInterestIncome || 0) +
    (inc.monthlyRoyaltyIncome || 0) +
    (inc.monthlyOtherIncome || 0);

  const totalMonthlyIncome = monthlyActiveSum + monthlyPassiveSum;
  const annualIncome = totalMonthlyIncome * 12;

  // 2. Savings & Cash Position
  const totalSavingsBalance =
    (sav.cashInHand || 0) +
    (sav.savingsAccountBalance || 0) +
    (sav.currentAccountBalance || 0) +
    (sav.emergencyFundBalance || 0) +
    (sav.fixedDeposits || 0) +
    (sav.recurringDeposits || 0) +
    (sav.foreignCurrencySavings || 0);

  // 3. Investments Portfolio
  const totalPortfolioValue = state.investments.reduce(
    (acc, item) => acc + (item.currentValue || 0),
    0
  );
  const annualInvestmentContribution = state.investments.reduce(
    (acc, item) => acc + (item.annualContribution || 0),
    0
  );

  // 4. Asset Value
  const totalAssetValue = state.assets.reduce(
    (acc, item) => acc + (item.currentMarketValue || 0),
    0
  );

  // 5. Liabilities & Debt
  const totalLiabilitiesAmount = state.liabilities.reduce(
    (acc, item) => acc + (item.outstandingAmount || 0),
    0
  );
  const totalMonthlyEMI = state.liabilities.reduce(
    (acc, item) => acc + (item.monthlyEMI || 0),
    0
  );

  // 6. Expenses & Cash Flow
  const totalMonthlyExpenses =
    (exp.housing || 0) +
    (exp.food || 0) +
    (exp.transportation || 0) +
    (exp.utilities || 0) +
    (exp.healthcare || 0) +
    (exp.insurance || 0) +
    (exp.education || 0) +
    (exp.entertainment || 0) +
    (exp.shopping || 0) +
    (exp.travel || 0) +
    (exp.subscriptions || 0) +
    (exp.familySupport || 0) +
    (exp.taxes || 0) +
    (exp.miscellaneous || 0);

  const totalMonthlyOutflow = totalMonthlyExpenses + totalMonthlyEMI;
  const totalMonthlyCashFlow = totalMonthlyIncome - totalMonthlyOutflow;

  // 7. Net Worth
  const netWorth =
    totalSavingsBalance + totalPortfolioValue + totalAssetValue - totalLiabilitiesAmount;

  // Key Ratios
  const debtToIncomeRatio =
    totalMonthlyIncome > 0
      ? Math.min(100, Math.round((totalMonthlyEMI / totalMonthlyIncome) * 100))
      : 0;

  const totalGrossAssets = totalSavingsBalance + totalPortfolioValue + totalAssetValue;
  const debtToAssetRatio =
    totalGrossAssets > 0
      ? Math.min(100, Math.round((totalLiabilitiesAmount / totalGrossAssets) * 100))
      : 0;

  const savingsRate =
    totalMonthlyIncome > 0
      ? Math.max(0, Math.min(100, Math.round(((totalMonthlyIncome - totalMonthlyOutflow) / totalMonthlyIncome) * 100)))
      : 0;

  const investmentRate =
    annualIncome > 0
      ? Math.min(100, Math.round((annualInvestmentContribution / annualIncome) * 100))
      : 0;

  const expenseRatio =
    totalMonthlyIncome > 0
      ? Math.min(100, Math.round((totalMonthlyExpenses / totalMonthlyIncome) * 100))
      : 0;

  const emergencyCoverageMonths =
    totalMonthlyExpenses > 0
      ? parseFloat(((sav.emergencyFundBalance + sav.savingsAccountBalance) / totalMonthlyExpenses).toFixed(1))
      : 0;

  const financialRunwayMonths =
    totalMonthlyExpenses > 0
      ? parseFloat(((totalSavingsBalance + totalPortfolioValue * 0.5) / totalMonthlyExpenses).toFixed(1))
      : 0;

  const passiveIncomeRatio =
    totalMonthlyIncome > 0
      ? Math.min(100, Math.round((monthlyPassiveSum / totalMonthlyIncome) * 100))
      : 0;

  const financialIndependenceProgress =
    totalMonthlyExpenses > 0
      ? Math.min(100, Math.round((monthlyPassiveSum / totalMonthlyExpenses) * 100))
      : 0;

  // Total Insurance Coverage vs Required (Recommended 10x Annual Income)
  const totalInsuranceCoverage = state.insuranceProtection.reduce(
    (acc, item) => acc + (item.coverageAmount || 0),
    0
  );
  const recommendedCoverage = Math.max(5000000, annualIncome * 10);
  const coverageGapINR = Math.max(0, recommendedCoverage - totalInsuranceCoverage);
  const protectionScore = Math.min(100, Math.round((totalInsuranceCoverage / (recommendedCoverage || 1)) * 100));

  // --- 11 SUB-SCORE CALCULATIONS (0 - 100 Each) ---

  // 1. Income Stability (10%)
  let incomeStabilityScore = 60;
  if (inc.employmentType === "Full-Time Salaried") incomeStabilityScore += 20;
  else if (inc.employmentType === "Self-Employed / Business Owner") incomeStabilityScore += 10;
  if (monthlyPassiveSum > 0) incomeStabilityScore += 10;
  if (inc.monthlyBonusIncome > 0 || inc.monthlyRentalIncome > 0) incomeStabilityScore += 10;
  incomeStabilityScore = Math.min(100, incomeStabilityScore);

  // 2. Savings Score (10%)
  let savingsScore = 0;
  if (emergencyCoverageMonths >= 12) savingsScore = 100;
  else if (emergencyCoverageMonths >= 6) savingsScore = 80;
  else if (emergencyCoverageMonths >= 3) savingsScore = 60;
  else if (emergencyCoverageMonths >= 1) savingsScore = 40;
  else savingsScore = 20;

  // 3. Investments Score (15%)
  let investmentScore = Math.min(100, state.investments.length * 20 + (investmentRate >= 20 ? 30 : investmentRate * 1.5));

  // 4. Assets Score (10%)
  let assetsScore = Math.min(100, Math.round((totalAssetValue / 5000000) * 100));
  if (assetsScore < 30 && totalGrossAssets > 500000) assetsScore = 65;

  // 5. Liabilities / Debt Score (10%) (Higher score = healthier/lower debt)
  let liabilitiesScore = 100;
  if (debtToIncomeRatio > 50) liabilitiesScore = 20;
  else if (debtToIncomeRatio > 35) liabilitiesScore = 45;
  else if (debtToIncomeRatio > 20) liabilitiesScore = 70;
  else liabilitiesScore = 95;

  // 6. Expenses Control Score (10%)
  let expensesScore = 100 - expenseRatio;
  expensesScore = Math.max(10, Math.min(100, expensesScore));

  // 7. Insurance Score (5%)
  const insuranceScore = protectionScore;

  // 8. Behaviour Score (10%)
  const bh = state.behaviour;
  const behaviourScore = Math.round(
    (likertToScore(bh.maintainMonthlyBudget) +
      likertToScore(bh.trackExpensesRegularly) +
      likertToScore(bh.investFrequency) +
      likertToScore(bh.reviewInvestmentsFrequency) +
      likertToScore(bh.fileTaxesOnTime) +
      likertToScore(bh.hasEmergencyFundSetAside) +
      likertToScore(bh.missedEmiPayments, false) +
      likertToScore(bh.missedCreditCardPayments, false) +
      likertToScore(bh.hasClearFinancialGoals)) /
      9
  );

  // 9. Goals Score (10%)
  const goalsScore =
    state.goals.length > 0
      ? Math.min(
          100,
          Math.round(
            state.goals.reduce((acc, g) => acc + Math.min(100, (g.currentProgress / (g.targetAmount || 1)) * 100), 0) /
              state.goals.length
          )
        )
      : 40;

  // 10. Literacy Score (10%)
  const lit = state.literacy;
  const avgLitScale =
    (lit.budgeting +
      lit.investing +
      lit.taxation +
      lit.insurance +
      lit.retirementPlanning +
      lit.debtManagement +
      lit.riskManagement +
      lit.personalFinance) /
    8;
  const literacyScore = Math.round((avgLitScale / 5) * 100);

  // 11. Risk Management Score (10%)
  let riskManagementScore = 70;
  if (state.riskProfile.emergencyPreparedness === "Comprehensive") riskManagementScore += 20;
  if (state.riskProfile.jobSecurityRating === "Very Secure") riskManagementScore += 10;
  riskManagementScore = Math.min(100, riskManagementScore);

  // --- FINAL WEIGHTED FINANCIAL HEALTH SCORE (0 - 100) ---
  const weightedScore = Math.round(
    incomeStabilityScore * 0.10 +
      savingsScore * 0.10 +
      investmentScore * 0.15 +
      assetsScore * 0.10 +
      liabilitiesScore * 0.10 +
      expensesScore * 0.10 +
      insuranceScore * 0.05 +
      behaviourScore * 0.10 +
      goalsScore * 0.10 +
      literacyScore * 0.10 +
      riskManagementScore * 0.10
  );

  const financialHealthScore = Math.max(1, Math.min(100, weightedScore));

  // Rating Classifications
  let stabilityRating = "Moderate Stability";
  if (financialHealthScore >= 85) stabilityRating = "Rock Solid / Ultra Resilient";
  else if (financialHealthScore >= 70) stabilityRating = "Strong Stability";
  else if (financialHealthScore >= 50) stabilityRating = "Moderate Stability";
  else stabilityRating = "Vulnerable / High Sensitivity";

  let wealthBuildingRating = "Emerging";
  if (investmentRate >= 25 || netWorth > 10000000) wealthBuildingRating = "Compounding Master";
  else if (investmentRate >= 15 || netWorth > 2500000) wealthBuildingRating = "Active Accumulator";
  else if (investmentRate >= 5) wealthBuildingRating = "Steady Builder";

  let riskRating = "Moderate Risk";
  const financialRiskIndex = Math.max(10, Math.min(95, Math.round(100 - (savingsScore * 0.4 + liabilitiesScore * 0.4 + protectionScore * 0.2))));
  if (financialRiskIndex <= 25) riskRating = "Low Risk / High Security";
  else if (financialRiskIndex <= 50) riskRating = "Moderate Controlled Risk";
  else riskRating = "Elevated Financial Vulnerability";

  let disciplineRating = "Disciplined";
  if (behaviourScore >= 80) disciplineRating = "Exceptional Financial Discipline";
  else if (behaviourScore >= 60) disciplineRating = "Consistent & Structured";
  else disciplineRating = "Needs Operational Structure";

  // Financial Stage Badge
  let financialStageBadge = "Emerging Wealth Builder";
  if (financialIndependenceProgress >= 100) financialStageBadge = "Financially Independent (FI/RE)";
  else if (netWorth >= 10000000) financialStageBadge = "High Net Worth Individual (HNWI)";
  else if (savingsRate >= 30 && netWorth > 2500000) financialStageBadge = "Active Wealth Accumulator";
  else if (totalMonthlyIncome > 0 && debtToIncomeRatio < 30) financialStageBadge = "Financially Stable Professional";

  // Dynamic Strengths, Weaknesses, Risks, Opportunities
  const topStrengths: string[] = [];
  const topWeaknesses: string[] = [];
  const topRisks: string[] = [];
  const topOpportunities: string[] = [];

  if (savingsRate >= 25) topStrengths.push(`High Net Savings Rate of ${savingsRate}% per month`);
  if (emergencyCoverageMonths >= 6) topStrengths.push(`Solid Emergency Buffer covering ${emergencyCoverageMonths} months of burn`);
  if (monthlyPassiveSum > 0) topStrengths.push(`Diversified Passive Cashflow of ${formatINR(monthlyPassiveSum)}/mo`);
  if (topStrengths.length === 0) topStrengths.push("Active employment cash flow tracking enabled");

  if (emergencyCoverageMonths < 3) topWeaknesses.push(`Low Emergency Liquidity (${emergencyCoverageMonths} months vs 6 months recommended)`);
  if (debtToIncomeRatio > 40) topWeaknesses.push(`High Debt Burden: EMI payments account for ${debtToIncomeRatio}% of monthly income`);
  if (protectionScore < 50) topWeaknesses.push(`Insurance Under-protection: Coverage gap of ${formatINR(coverageGapINR)}`);
  if (topWeaknesses.length === 0) topWeaknesses.push("Opportunity to increase allocation to high-yield growth assets");

  if (debtToIncomeRatio > 45) topRisks.push("Severe cash flow squeeze if primary income experiences temporary disruption");
  if (protectionScore < 40) topRisks.push("Uninsured medical or life events could erode accumulated asset reserves");
  if (topRisks.length === 0) topRisks.push("Inflation erode risk on idle uninvested bank balances");

  if (investmentRate < 20) topOpportunities.push("Automate monthly SIP investments to capture compounding wealth yields");
  if (coverageGapINR > 0) topOpportunities.push("Close term & health insurance coverage gap to insulate financial runway");
  topOpportunities.push("Build secondary passive income streams in dividend stocks or REITs");

  // Dynamic Improvement Roadmap
  const improvementRoadmap = [
    {
      step: 1,
      title: "Build 6-Month Emergency Buffer",
      desc: `Allocate monthly cash flow until liquidity reaches ${formatINR(totalMonthlyExpenses * 6)}.`,
      impact: "High Resilience",
    },
    {
      step: 2,
      title: "Optimize Debt & Reduce DTI Below 30%",
      desc: "Prepay high-interest credit card debt and personal loans to free up monthly cash flow.",
      impact: "Immediate Cash Flow Boost",
    },
    {
      step: 3,
      title: "Close Protection & Insurance Gap",
      desc: `Upgrade pure term life & health insurance to eliminate the ${formatINR(coverageGapINR)} coverage gap.`,
      impact: "Total Wealth Shield",
    },
    {
      step: 4,
      title: "Automate Automated SIP & Index Investments",
      desc: `Target systematically allocating ${formatINR(totalMonthlyIncome * 0.25)} monthly into broad index funds.`,
      impact: "Long-term Capital Yield",
    },
  ];

  return {
    financialHealthScore,
    stabilityRating,
    wealthBuildingRating,
    riskRating,
    disciplineRating,
    financialIndependenceProgress,

    totalMonthlyIncome,
    annualIncome,
    totalMonthlyExpenses,
    totalMonthlyCashFlow,
    totalSavingsBalance,
    totalPortfolioValue,
    totalAssetValue,
    totalLiabilitiesAmount,
    totalMonthlyEMI,
    netWorth,

    debtToIncomeRatio,
    debtToAssetRatio,
    savingsRate,
    investmentRate,
    expenseRatio,
    liquidityScore: Math.round(savingsScore),
    emergencyCoverageMonths,
    passiveIncomeRatio,
    protectionScore,
    coverageGapINR,
    portfolioDiversificationScore: Math.min(100, state.investments.length * 25),
    financialRunwayMonths,
    retirementReadinessScore: Math.min(100, Math.round((netWorth / (annualIncome * 15 || 1)) * 100)),
    financialRiskIndex,
    financialStabilityIndex: Math.round((incomeStabilityScore + savingsScore + liabilitiesScore) / 3),

    scores: {
      incomeStability: Math.round(incomeStabilityScore),
      savings: Math.round(savingsScore),
      investments: Math.round(investmentScore),
      assets: Math.round(assetsScore),
      liabilities: Math.round(liabilitiesScore),
      expenses: Math.round(expensesScore),
      insurance: Math.round(insuranceScore),
      behaviour: Math.round(behaviourScore),
      goals: Math.round(goalsScore),
      literacy: Math.round(literacyScore),
      riskManagement: Math.round(riskManagementScore),
    },

    financialStageBadge,
    topStrengths,
    topWeaknesses,
    topRisks,
    topOpportunities,
    improvementRoadmap,
  };
}
