export interface DailyUserCount {
  date: string;
  count: number;
}

export interface ModuleUsageCount {
  module: string;
  count: number;
}

export interface PageUsageCount {
  page: string;
  count: number;
}

export interface FeatureUsageCount {
  feature: string;
  count: number;
}

export interface AdminAnalyticsMetrics {
  totalUsers: number;
  todaysUsers: number;
  activeUsers: number;
  averageHumanValueScore: number;
  completedAssessments: number;
  averageSessionTimeMinutes: number;
  reportDownloads: number;
  mostUsedModule: string;
  mostUsedPage: string;
  mostUsedFeature: string;
  userGrowthChart: DailyUserCount[];
  assessmentCompletionRate: number; // percentage 0 - 100
  topModules: ModuleUsageCount[];
  topPages: PageUsageCount[];
  topFeatures: FeatureUsageCount[];
}
