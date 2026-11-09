import { 
  AppUsageRecord, 
  Challenge, 
  Achievement, 
  XPLog, 
  UserProfile, 
  OnboardingAnswers,
  BalanceIndexBreakdown
} from '../types';

const STORAGE_KEYS = {
  USER: 'neko_user_profile',
  USAGE: 'neko_app_usage',
  CHALLENGES: 'neko_challenges',
  ACHIEVEMENTS: 'neko_achievements',
  XP_LOGS: 'neko_xp_logs',
  ONBOARDING: 'neko_onboarding',
  STREAK: 'neko_streak',
  AUTH_SESSION: 'neko_auth_session',
};

// Helper: Format today's date YYYY-MM-DD
export function getTodayDateString(offsetDays: number = 0): string {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  return d.toISOString().split('T')[0];
}

// Initial Demo User
export const INITIAL_USER: UserProfile = {
  id: 'user_demo_01',
  name: 'Alexandre Souza',
  email: 'alexandre@neko.app',
  avatar: 'neko_green',
  bio: 'Buscando mais presença no mundo real e noites de sono tranquilas.',
  dailyScreenTimeGoalMinutes: 240, // 4 hours
  maxSocialMediaMinutes: 90, // 1h 30m
  dailyOfflineGoalMinutes: 60, // 1h offline
  joinedDate: '2026-10-15',
  isDemo: true,
};

// Initial Demo Screen Time Records matching prompt:
// Total today: 5h05 (305 min)
// Instagram: 2h15 (135 min)
// TikTok: 1h40 (100 min)
// YouTube: 1h10 (70 min)
export const getInitialUsageRecords = (): AppUsageRecord[] => {
  const today = getTodayDateString(0);
  const yesterday = getTodayDateString(-1);
  const day2 = getTodayDateString(-2);
  const day3 = getTodayDateString(-3);
  const day4 = getTodayDateString(-4);
  const day5 = getTodayDateString(-5);
  const day6 = getTodayDateString(-6);

  return [
    // Today (Total: 5h05 = 305 min)
    {
      id: 'rec_today_1',
      date: today,
      appName: 'Instagram',
      category: 'social',
      durationMinutes: 135, // 2h 15m
      color: '#E1306C',
      notes: 'Feed matinal e reels durante a tarde',
      isDemonstrative: true,
    },
    {
      id: 'rec_today_2',
      date: today,
      appName: 'TikTok',
      category: 'social',
      durationMinutes: 100, // 1h 40m
      color: '#00F2FE',
      notes: 'Vídeos curtos de culinária e humor',
      isDemonstrative: true,
    },
    {
      id: 'rec_today_3',
      date: today,
      appName: 'YouTube',
      category: 'entertainment',
      durationMinutes: 70, // 1h 10m
      color: '#FF0000',
      notes: 'Documentário de história e podcast',
      isDemonstrative: true,
    },
    // Yesterday (Total: 4h 10m = 250 min)
    {
      id: 'rec_yest_1',
      date: yesterday,
      appName: 'Instagram',
      category: 'social',
      durationMinutes: 90,
      color: '#E1306C',
      isDemonstrative: true,
    },
    {
      id: 'rec_yest_2',
      date: yesterday,
      appName: 'TikTok',
      category: 'social',
      durationMinutes: 75,
      color: '#00F2FE',
      isDemonstrative: true,
    },
    {
      id: 'rec_yest_3',
      date: yesterday,
      appName: 'WhatsApp',
      category: 'communication',
      durationMinutes: 50,
      color: '#25D366',
      isDemonstrative: true,
    },
    {
      id: 'rec_yest_4',
      date: yesterday,
      appName: 'Notion',
      category: 'productivity',
      durationMinutes: 35,
      color: '#65D6C5',
      isDemonstrative: true,
    },
    // Past days for historical graphs
    { id: 'rec_d2_1', date: day2, appName: 'Instagram', category: 'social', durationMinutes: 110, color: '#E1306C', isDemonstrative: true },
    { id: 'rec_d2_2', date: day2, appName: 'YouTube', category: 'entertainment', durationMinutes: 95, color: '#FF0000', isDemonstrative: true },
    { id: 'rec_d2_3', date: day2, appName: 'Spotify', category: 'entertainment', durationMinutes: 40, color: '#1DB954', isDemonstrative: true },
    
    { id: 'rec_d3_1', date: day3, appName: 'TikTok', category: 'social', durationMinutes: 120, color: '#00F2FE', isDemonstrative: true },
    { id: 'rec_d3_2', date: day3, appName: 'Instagram', category: 'social', durationMinutes: 80, color: '#E1306C', isDemonstrative: true },
    { id: 'rec_d3_3', date: day3, appName: 'WhatsApp', category: 'communication', durationMinutes: 35, color: '#25D366', isDemonstrative: true },
    
    { id: 'rec_d4_1', date: day4, appName: 'Instagram', category: 'social', durationMinutes: 85, color: '#E1306C', isDemonstrative: true },
    { id: 'rec_d4_2', date: day4, appName: 'Duolingo', category: 'study', durationMinutes: 30, color: '#58CC02', isDemonstrative: true },
    { id: 'rec_d4_3', date: day4, appName: 'YouTube', category: 'entertainment', durationMinutes: 60, color: '#FF0000', isDemonstrative: true },
    
    { id: 'rec_d5_1', date: day5, appName: 'Instagram', category: 'social', durationMinutes: 140, color: '#E1306C', isDemonstrative: true },
    { id: 'rec_d5_2', date: day5, appName: 'TikTok', category: 'social', durationMinutes: 90, color: '#00F2FE', isDemonstrative: true },
    { id: 'rec_d5_3', date: day5, appName: 'Netflix', category: 'entertainment', durationMinutes: 75, color: '#E50914', isDemonstrative: true },

    { id: 'rec_d6_1', date: day6, appName: 'WhatsApp', category: 'communication', durationMinutes: 65, color: '#25D366', isDemonstrative: true },
    { id: 'rec_d6_2', date: day6, appName: 'Instagram', category: 'social', durationMinutes: 105, color: '#E1306C', isDemonstrative: true },
    { id: 'rec_d6_3', date: day6, appName: 'Kindle', category: 'study', durationMinutes: 45, color: '#FF9900', isDemonstrative: true },
  ];
};

// Initial Challenges matching prompt requirements
export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch_1',
    name: 'Ler por 20 minutos',
    description: 'Dedique um momento para abrir um livro físico ou artigo longo sem interrupções de notificações.',
    category: 'offline',
    estimatedMinutes: 20,
    xpReward: 30,
    isDaily: true,
    isCompleted: false,
  },
  {
    id: 'ch_2',
    name: 'Caminhar por 30 minutos',
    description: 'Faça uma caminhada ao ar livre, respirando ar puro e deixando o celular no bolso.',
    category: 'health',
    estimatedMinutes: 30,
    xpReward: 35,
    isDaily: true,
    isCompleted: false,
  },
  {
    id: 'ch_3',
    name: 'Ficar 1 hora sem redes sociais',
    description: 'Foco total sem abrir feeds ou checar stories durante 60 minutos.',
    category: 'focus',
    estimatedMinutes: 60,
    xpReward: 40,
    isDaily: true,
    isCompleted: false,
  },
  {
    id: 'ch_4',
    name: 'Beber água regularmente',
    description: 'Faça pausas de hidratação ao longo do dia, longe da tela.',
    category: 'health',
    estimatedMinutes: 5,
    xpReward: 20,
    isDaily: true,
    isCompleted: true,
    completedAt: '2026-11-08T11:30:00Z',
  },
  {
    id: 'ch_5',
    name: 'Praticar uma atividade criativa',
    description: 'Desenhe, cozinhe uma receita nova, toque um instrumento ou escreva em um caderno.',
    category: 'offline',
    estimatedMinutes: 25,
    xpReward: 30,
    isDaily: false,
    isCompleted: false,
  },
  {
    id: 'ch_6',
    name: 'Dormir sem o celular antes de deitar',
    description: 'Desconecte-se de todas as telas pelo menos 30 minutos antes de pegar no sono.',
    category: 'health',
    estimatedMinutes: 30,
    xpReward: 45,
    isDaily: true,
    isCompleted: false,
  },
  {
    id: 'ch_7',
    name: 'Passar tempo de qualidade com amigos ou família',
    description: 'Converse, almoce ou tome um café mantendo o celular guardado.',
    category: 'social',
    estimatedMinutes: 45,
    xpReward: 35,
    isDaily: false,
    isCompleted: false,
  },
];

// Initial Achievements
export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_1',
    title: 'Primeira Conquista',
    description: 'Deu o primeiro passo consciente para equilibrar seu tempo e iniciou a jornada no NEKO.',
    icon: 'Cat',
    isUnlocked: true,
    unlockedAt: '2026-11-01T10:00:00Z',
    requirement: 'Crie ou acerte seu primeiro registro no NEKO',
    xpReward: 50,
    category: 'habits',
  },
  {
    id: 'ach_2',
    title: 'Constância Felina',
    description: 'Manteve uma sequência ativa de 7 dias consecutivos acompanhando o tempo de tela.',
    icon: 'Flame',
    isUnlocked: true,
    unlockedAt: '2026-11-08T09:00:00Z',
    requirement: 'Atinja 7 dias de sequência ininterrupta',
    xpReward: 70,
    category: 'streak',
  },
  {
    id: 'ach_3',
    title: 'Mente Serena',
    description: 'Completou um desafio de ficar pelo menos 1 hora completamente offline.',
    icon: 'Sparkles',
    isUnlocked: false,
    requirement: 'Conclua o desafio de 1h sem redes sociais',
    xpReward: 40,
    category: 'focus',
  },
  {
    id: 'ach_4',
    title: 'Noite Sagrada',
    description: 'Conseguiu 3 noites consecutivas sem usar o smartphone na cama antes de dormir.',
    icon: 'Moon',
    isUnlocked: false,
    requirement: 'Desconecte 30 min antes de deitar por 3 dias',
    xpReward: 60,
    category: 'habits',
  },
  {
    id: 'ach_5',
    title: 'Foco de Ouro',
    description: 'Manteve o tempo diário de tela dentro da meta programada pelo usuário.',
    icon: 'ShieldCheck',
    isUnlocked: false,
    requirement: 'Respeite a meta diária estipulada',
    xpReward: 50,
    category: 'time',
  },
  {
    id: 'ach_6',
    title: 'Equilíbrio Notável',
    description: 'Alcançou um Índice de Equilíbrio Digital superior a 80 pontos.',
    icon: 'Award',
    isUnlocked: false,
    requirement: 'Pontue 80 ou mais no Índice de Equilíbrio Digital',
    xpReward: 100,
    category: 'balance',
  },
];

export const INITIAL_XP_LOGS: XPLog[] = [
  { id: 'xp_1', date: getTodayDateString(-7), amount: 50, reason: 'Primeira Conquista Desbloqueada' },
  { id: 'xp_2', date: getTodayDateString(-3), amount: 30, reason: 'Desafio: Ler por 20 minutos' },
  { id: 'xp_3', date: getTodayDateString(-1), amount: 20, reason: 'Desafio: Beber água regularmente' },
  { id: 'xp_4', date: getTodayDateString(0), amount: 20, reason: 'Desafio: Beber água regularmente', challengeId: 'ch_4' },
];

// Calculation of Digital Balance Index (0 - 100)
// Transparent, non-medical formula:
// 1. Goal compliance (max 40 pts)
// 2. Category balance (max 30 pts)
// 3. Offline habits & challenges completed (max 30 pts)
export function calculateDigitalBalanceIndex(
  records: AppUsageRecord[],
  targetDate: string,
  dailyGoalMinutes: number,
  completedChallengesCount: number
): BalanceIndexBreakdown {
  const dayRecords = records.filter(r => r.date === targetDate);
  const totalMinutes = dayRecords.reduce((sum, r) => sum + r.durationMinutes, 0);

  // 1. Goal Compliance (0-40)
  let goalScore = 40;
  if (totalMinutes === 0) {
    goalScore = 30; // neutral when no data yet
  } else if (totalMinutes <= dailyGoalMinutes) {
    // Within goal: 35 - 40 points
    const ratio = totalMinutes / dailyGoalMinutes;
    goalScore = Math.round(35 + (1 - ratio) * 5);
  } else {
    // Over goal: lose points proportionally
    const excess = totalMinutes - dailyGoalMinutes;
    const penalty = Math.min(35, (excess / 120) * 20); // 2 hours excess loses 20 pts
    goalScore = Math.max(5, Math.round(40 - penalty));
  }

  // 2. Category Balance (0-30)
  // Penalize excessive social media proportion
  let distributionScore = 30;
  if (totalMinutes > 0) {
    const socialMinutes = dayRecords
      .filter(r => r.category === 'social')
      .reduce((s, r) => s + r.durationMinutes, 0);
    const socialRatio = socialMinutes / totalMinutes;
    
    if (socialRatio > 0.6) {
      distributionScore = Math.max(8, Math.round(30 - (socialRatio - 0.6) * 45));
    } else if (socialRatio > 0.4) {
      distributionScore = 22;
    } else {
      distributionScore = 30;
    }
  }

  // 3. Offline Habits (0-30)
  // Up to 30 points for completing 1 to 3 positive off-screen habits
  let habitsScore = Math.min(30, completedChallengesCount * 12);
  if (habitsScore === 0) habitsScore = 5; // base score for awareness

  const totalScore = Math.min(100, Math.max(10, goalScore + distributionScore + habitsScore));

  let classification: 'Excelente' | 'Equilibrado' | 'Atenção' | 'Alerta';
  if (totalScore >= 85) classification = 'Excelente';
  else if (totalScore >= 70) classification = 'Equilibrado';
  else if (totalScore >= 50) classification = 'Atenção';
  else classification = 'Alerta';

  const recommendations: string[] = [];
  if (goalScore < 25) {
    recommendations.push('Seu tempo de tela hoje superou a meta diária. Planeje uma pausa de 30 minutos sem telas antes de dormir.');
  }
  if (distributionScore < 20) {
    recommendations.push('As redes sociais consumiram a maior parte da sua atenção. Que tal substituir uma sessão de rolagem por um capítulo de livro?');
  }
  if (habitsScore < 15) {
    recommendations.push('Completar um desafio offline diário como caminhar ou beber água eleva seu bem-estar e seu índice.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Excelente ritmo hoje! Você está cultivando um equilíbrio saudável entre vida física e digital.');
  }

  return {
    score: totalScore,
    classification,
    goalScore,
    distributionScore,
    habitsScore,
    explanation: 'Pontuação calculada com base em: cumprimento de metas de tela (40%), equilíbrio de categorias (30%) e realização de hábitos offline (30%). Não substitui acompanhamento médico ou psicológico.',
    recommendations,
  };
}

// LocalStorage helpers with fallback
export const storageService = {
  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  },

  saveUserProfile(user: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error('Error saving user profile', e);
    }
  },

  getUsageRecords(): AppUsageRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USAGE);
      return data ? JSON.parse(data) : getInitialUsageRecords();
    } catch {
      return getInitialUsageRecords();
    }
  },

  saveUsageRecords(records: AppUsageRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USAGE, JSON.stringify(records));
    } catch (e) {
      console.error('Error saving usage records', e);
    }
  },

  getChallenges(): Challenge[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
      return data ? JSON.parse(data) : INITIAL_CHALLENGES;
    } catch {
      return INITIAL_CHALLENGES;
    }
  },

  saveChallenges(challenges: Challenge[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
    } catch (e) {
      console.error('Error saving challenges', e);
    }
  },

  getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  },

  saveAchievements(achievements: Achievement[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (e) {
      console.error('Error saving achievements', e);
    }
  },

  getXPLogs(): XPLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.XP_LOGS);
      return data ? JSON.parse(data) : INITIAL_XP_LOGS;
    } catch {
      return INITIAL_XP_LOGS;
    }
  },

  saveXPLogs(logs: XPLog[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.XP_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error('Error saving XP logs', e);
    }
  },

  getOnboarding(): OnboardingAnswers | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveOnboarding(answers: OnboardingAnswers): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(answers));
    } catch (e) {
      console.error('Error saving onboarding answers', e);
    }
  },

  getStreak(): number {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.STREAK);
      return val ? parseInt(val, 10) : 7;
    } catch {
      return 7;
    }
  },

  saveStreak(days: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STREAK, days.toString());
    } catch (e) {
      console.error('Error saving streak', e);
    }
  },

  // Reset to initial academic demo data
  resetToDemo(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
      localStorage.setItem(STORAGE_KEYS.USAGE, JSON.stringify(getInitialUsageRecords()));
      localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(INITIAL_CHALLENGES));
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(INITIAL_ACHIEVEMENTS));
      localStorage.setItem(STORAGE_KEYS.XP_LOGS, JSON.stringify(INITIAL_XP_LOGS));
      localStorage.setItem(STORAGE_KEYS.STREAK, '7');
      localStorage.removeItem(STORAGE_KEYS.ONBOARDING);
    } catch (e) {
      console.error('Error resetting demo', e);
    }
  },

  // Export full JSON backup
  exportBackup(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user: this.getUserProfile(),
      usage: this.getUsageRecords(),
      challenges: this.getChallenges(),
      achievements: this.getAchievements(),
      xpLogs: this.getXPLogs(),
      streak: this.getStreak(),
    };
    return JSON.stringify(backup, null, 2);
  }
};
