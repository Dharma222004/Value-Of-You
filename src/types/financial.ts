/**
 * Human Capital Platform - Financial Health Intelligence Types
 * Phase 4 Comprehensive Architecture
 */

export type LikertScale = "Always" | "Often" | "Sometimes" | "Rarely" | "Never";

export type EmploymentTypeOption = 
  | "Full-Time Salaried"
  | "Part-Time Salaried"
  | "Self-Employed / Business Owner"
  | "Freelancer / Independent Contractor"
  | "Gig Worker"
  | "Unemployed / Looking for Work"
  | "Retired"
  | "Student";

export type RiskLevelOption = "Low" | "Moderate" | "High" | "Very High";
export type OwnershipTypeOption = "Sole Owner" | "Joint Owner" | "Family Owned" | "Leased";

export interface IncomeProfile {
  primarySource: string;
  employmentType: EmploymentTypeOption;
  monthlyActiveIncome: number;
  monthlyPassiveIncome: number;
  monthlyBonusIncome: number;
  monthlyFreelanceIncome: number;
  monthlyBusinessIncome: number;
  monthlyRentalIncome: number;
  monthlyDividendIncome: number;
  monthlyInterestIncome: number;
  monthlyRoyaltyIncome: number;
  monthlyOtherIncome: number;
}

export interface SavingsPosition {
  cashInHand: number;
  savingsAccountBalance: number;
  currentAccountBalance: number;
  emergencyFundBalance: number;
  fixedDeposits: number;
  recurringDeposits: number;
  foreignCurrencySavings: number;
}

export interface InvestmentItem {
  id: string;
  category: 
    | "Stocks"
    | "Mutual Funds"
    | "Index Funds"
    | "ETF"
    | "Gold & Silver"
    | "Real Estate"
    | "REIT"
    | "Government Bonds"
    | "Corporate Bonds"
    | "PPF"
    | "EPF"
    | "NPS"
    | "Cryptocurrency"
    | "Startup Investments"
    | "Other Investments";
  name: string;
  currentValue: number;
  annualContribution: number;
  riskLevel: RiskLevelOption;
}

export interface AssetItem {
  id: string;
  category: 
    | "Residential Property"
    | "Commercial Property"
    | "Land"
    | "Vehicles"
    | "Business Assets"
    | "Electronics & Hardware"
    | "Jewellery"
    | "Luxury Assets"
    | "Other Assets";
  name: string;
  purchaseValue: number;
  currentMarketValue: number;
  ownershipType: OwnershipTypeOption;
}

export interface LiabilityItem {
  id: string;
  category: 
    | "Home Loan"
    | "Education Loan"
    | "Personal Loan"
    | "Business Loan"
    | "Vehicle Loan"
    | "Gold Loan"
    | "Credit Card Outstanding"
    | "Buy Now Pay Later"
    | "Other Debt";
  name: string;
  outstandingAmount: number;
  interestRate: number; // annual %
  monthlyEMI: number;
  remainingTenureMonths: number;
}

export interface ExpenseBreakdown {
  housing: number;
  food: number;
  transportation: number;
  utilities: number;
  healthcare: number;
  insurance: number;
  education: number;
  entertainment: number;
  shopping: number;
  travel: number;
  subscriptions: number;
  familySupport: number;
  taxes: number;
  miscellaneous: number;
}

export interface InsuranceItem {
  id: string;
  category: 
    | "Health Insurance"
    | "Life Insurance"
    | "Accident Insurance"
    | "Vehicle Insurance"
    | "Home Insurance"
    | "Business Insurance";
  name: string;
  coverageAmount: number;
  annualPremium: number;
}

export interface FinancialBehaviour {
  maintainMonthlyBudget: LikertScale;
  trackExpensesRegularly: LikertScale;
  investFrequency: LikertScale;
  reviewInvestmentsFrequency: LikertScale;
  fileTaxesOnTime: LikertScale;
  hasEmergencyFundSetAside: LikertScale;
  missedEmiPayments: LikertScale;
  missedCreditCardPayments: LikertScale;
  hasClearFinancialGoals: LikertScale;
}

export interface FinancialGoalItem {
  id: string;
  goalType: 
    | "Emergency Fund"
    | "Home Purchase"
    | "Vehicle Purchase"
    | "Marriage"
    | "Children Education"
    | "Higher Studies"
    | "Business Capital"
    | "Financial Independence"
    | "Retirement Corpus"
    | "Travel & Experience"
    | "Other Goal";
  name: string;
  targetAmount: number;
  targetYear: number;
  currentProgress: number;
}

export interface RiskProfileAssessment {
  riskAppetite: "Conservative" | "Moderate" | "Aggressive";
  investmentHorizon: "Short Term (< 3 Yrs)" | "Medium Term (3 - 7 Yrs)" | "Long Term (> 7 Yrs)";
  incomeStability: "Very High" | "High" | "Moderate" | "Low";
  dependentsCount: number;
  jobSecurityRating: "Very Secure" | "Secure" | "Moderate" | "Vulnerable";
  emergencyPreparedness: "Comprehensive" | "Adequate" | "Minimal" | "None";
}

export interface FinancialLiteracySelfAssessment {
  budgeting: number; // 1 to 5
  investing: number;
  taxation: number;
  insurance: number;
  retirementPlanning: number;
  debtManagement: number;
  riskManagement: number;
  personalFinance: number;
}

export interface FinancialModuleState {
  incomeProfile: IncomeProfile;
  savingsPosition: SavingsPosition;
  investments: InvestmentItem[];
  assets: AssetItem[];
  liabilities: LiabilityItem[];
  expenses: ExpenseBreakdown;
  insuranceProtection: InsuranceItem[];
  behaviour: FinancialBehaviour;
  goals: FinancialGoalItem[];
  riskProfile: RiskProfileAssessment;
  literacy: FinancialLiteracySelfAssessment;
  isCompleted?: boolean;
  submittedAt?: string;
}

export interface AdvancedFinancialMetrics {
  // Primary Weighted Score
  financialHealthScore: number;
  stabilityRating: string;
  wealthBuildingRating: string;
  riskRating: string;
  disciplineRating: string;
  financialIndependenceProgress: number; // %

  // Key Totals
  totalMonthlyIncome: number;
  annualIncome: number;
  totalMonthlyExpenses: number;
  totalMonthlyCashFlow: number;
  totalSavingsBalance: number;
  totalPortfolioValue: number;
  totalAssetValue: number;
  totalLiabilitiesAmount: number;
  totalMonthlyEMI: number;
  netWorth: number;

  // 17 Advanced Calculated Ratios
  debtToIncomeRatio: number; // %
  debtToAssetRatio: number; // %
  savingsRate: number; // %
  investmentRate: number; // %
  expenseRatio: number; // %
  liquidityScore: number; // 0-100
  emergencyCoverageMonths: number; // months
  passiveIncomeRatio: number; // %
  protectionScore: number; // 0-100
  coverageGapINR: number; // ₹
  portfolioDiversificationScore: number; // 0-100
  financialRunwayMonths: number; // months
  retirementReadinessScore: number; // 0-100
  financialRiskIndex: number; // 0-100 (lower is better)
  financialStabilityIndex: number; // 0-100

  // 11 Weighted Sub-Scores
  scores: {
    incomeStability: number;
    savings: number;
    investments: number;
    assets: number;
    liabilities: number;
    expenses: number;
    insurance: number;
    behaviour: number;
    goals: number;
    literacy: number;
    riskManagement: number;
  };

  // AI Strategic Summaries
  financialStageBadge: string;
  topStrengths: string[];
  topWeaknesses: string[];
  topRisks: string[];
  topOpportunities: string[];
  improvementRoadmap: { step: number; title: string; desc: string; impact: string }[];
}
