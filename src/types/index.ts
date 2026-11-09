export type AppCategory = 
  | 'social' 
  | 'entertainment' 
  | 'productivity' 
  | 'study' 
  | 'communication' 
  | 'health';

export interface AppUsageRecord {
  id: string;
  date: string; // YYYY-MM-DD
  appName: string;
  category: AppCategory;
  durationMinutes: number;
  iconName?: string;
  color?: string;
  notes?: string;
  isDemonstrative?: boolean;
}

export type ChallengeCategory = 'offline' | 'focus' | 'health' | 'social';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  category: ChallengeCategory;
  estimatedMinutes: number;
  xpReward: number;
  isDaily: boolean;
  isCompleted: boolean;
  completedAt?: string;
  inProgress?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  requirement: string;
  xpReward: number;
  category: 'streak' | 'habits' | 'time' | 'balance' | 'focus';
}

export interface XPLog {
  id: string;
  date: string;
  amount: number;
  reason: string;
  challengeId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  dailyScreenTimeGoalMinutes: number; // default 240 (4h)
  maxSocialMediaMinutes: number; // default 90 (1h30)
  dailyOfflineGoalMinutes: number; // default 60 (1h)
  joinedDate: string;
  isDemo: boolean;
}

export interface OnboardingAnswers {
  estimatedDailyHours: string;
  mostUsedApps: string[];
  mainGoal: string;
  offlineTargetHours: string;
  completed: boolean;
}

export interface BalanceIndexBreakdown {
  score: number; // 0-100
  classification: 'Excelente' | 'Equilibrado' | 'Atenção' | 'Alerta';
  goalScore: number; // max 40
  distributionScore: number; // max 30
  habitsScore: number; // max 30
  explanation: string;
  recommendations: string[];
}

export type ActiveTab = 
  | 'dashboard' 
  | 'screen-time' 
  | 'balance' 
  | 'challenges' 
  | 'gamification' 
  | 'reports' 
  | 'profile';

export type AuthMode = 'login' | 'register' | 'recovery';
