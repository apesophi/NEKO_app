import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserProfile, 
  AppUsageRecord, 
  Challenge, 
  Achievement, 
  XPLog, 
  ActiveTab, 
  BalanceIndexBreakdown,
  OnboardingAnswers 
} from '../types';
import { 
  storageService, 
  getTodayDateString, 
  calculateDigitalBalanceIndex 
} from '../services/storage';

interface AppContextType {
  // Auth & User
  user: UserProfile;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  updateUser: (updated: Partial<UserProfile>) => void;
  enterDemoMode: () => void;
  
  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  showOnboarding: boolean;
  completeOnboarding: (answers: OnboardingAnswers) => void;
  skipOnboarding: () => void;
  
  // Screen Time Data
  usageRecords: AppUsageRecord[];
  addUsageRecord: (record: Omit<AppUsageRecord, 'id'>) => void;
  updateUsageRecord: (id: string, record: Partial<AppUsageRecord>) => void;
  deleteUsageRecord: (id: string) => void;
  getRecordsForDate: (date: string) => AppUsageRecord[];
  getTodayTotalMinutes: () => number;
  
  // Challenges & Habits
  challenges: Challenge[];
  toggleChallengeComplete: (id: string) => void;
  addChallenge: (challenge: Omit<Challenge, 'id' | 'isCompleted'>) => void;
  startFocusTimer: (challenge: Challenge) => void;
  
  // Gamification & XP
  streak: number;
  totalXP: number;
  currentLevel: number;
  levelTitle: string;
  xpToNextLevel: number;
  levelProgressPercent: number;
  achievements: Achievement[];
  xpLogs: XPLog[];
  
  // Balance Index
  todayBalance: BalanceIndexBreakdown;
  
  // Modals & Timers
  isLogModalOpen: boolean;
  setIsLogModalOpen: (open: boolean) => void;
  editingRecord: AppUsageRecord | null;
  setEditingRecord: (record: AppUsageRecord | null) => void;
  isAddChallengeOpen: boolean;
  setIsAddChallengeOpen: (open: boolean) => void;
  isFocusTimerOpen: boolean;
  setIsFocusTimerOpen: (open: boolean) => void;
  activeFocusChallenge: Challenge | null;
  
  // Mascot Toast / Message
  mascotToast: string | null;
  setMascotToast: (msg: string | null) => void;

  // Mascot Celebrations & Reactions
  celebrationModal: {
    isOpen: boolean;
    type: 'levelUp' | 'goalReached';
    title: string;
    subtitle: string;
    levelNumber?: number;
    levelTitle?: string;
    xpEarned?: number;
  };
  closeCelebrationModal: () => void;
  triggerLevelUpCelebration: (lvl: number, title: string) => void;
  triggerGoalReachedCelebration: (title?: string, message?: string) => void;
  triggerTestLevelUp: () => void;
  triggerTestGoal: () => void;
  
  // Demo Controls
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => storageService.getUserProfile());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('neko_auth_token') === 'active';
  });
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !storageService.getOnboarding() && localStorage.getItem('neko_auth_token') === 'active';
  });

  const [usageRecords, setUsageRecords] = useState<AppUsageRecord[]>(() => storageService.getUsageRecords());
  const [challenges, setChallenges] = useState<Challenge[]>(() => storageService.getChallenges());
  const [achievements, setAchievements] = useState<Achievement[]>(() => storageService.getAchievements());
  const [xpLogs, setXpLogs] = useState<XPLog[]>(() => storageService.getXPLogs());
  const [streak, setStreak] = useState<number>(() => storageService.getStreak());

  // Modal states
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AppUsageRecord | null>(null);
  const [isAddChallengeOpen, setIsAddChallengeOpen] = useState(false);
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);
  const [activeFocusChallenge, setActiveFocusChallenge] = useState<Challenge | null>(null);
  const [mascotToast, setMascotToast] = useState<string | null>(null);

  // Celebration Modal state
  const [celebrationModal, setCelebrationModal] = useState<{
    isOpen: boolean;
    type: 'levelUp' | 'goalReached';
    title: string;
    subtitle: string;
    levelNumber?: number;
    levelTitle?: string;
    xpEarned?: number;
  }>({
    isOpen: false,
    type: 'levelUp',
    title: '',
    subtitle: '',
  });

  const closeCelebrationModal = () => {
    setCelebrationModal(prev => ({ ...prev, isOpen: false }));
  };

  const triggerLevelUpCelebration = (lvl: number, title: string) => {
    setCelebrationModal({
      isOpen: true,
      type: 'levelUp',
      title: 'Parabéns! Você Subiu de Nível!',
      subtitle: 'Neko está comemorando com você! Sua consistência e pausas conscientes desbloquearam um novo patamar.',
      levelNumber: lvl,
      levelTitle: title,
    });
  };

  const triggerGoalReachedCelebration = (
    customTitle?: string, 
    customMessage?: string
  ) => {
    setCelebrationModal({
      isOpen: true,
      type: 'goalReached',
      title: customTitle || 'Meta Diária Conquistada!',
      subtitle: customMessage || 'Você respeitou seus limites de tela e dedicou momentos preciosos ao mundo real.',
      xpEarned: 35,
    });
  };

  const triggerTestLevelUp = () => {
    awardXP(50, 'Bônus de Demonstração de Nível');
    triggerLevelUpCelebration(currentLevel + 1, 'Mestre do Equilíbrio');
  };

  const triggerTestGoal = () => {
    triggerGoalReachedCelebration(
      'Meta de Equilíbrio Atingida!',
      'Neko reagiu com alegria! Você manteve o foco e concluiu seus hábitos diários.'
    );
  };

  useEffect(() => {
    storageService.saveUsageRecords(usageRecords);
  }, [usageRecords]);

  useEffect(() => {
    storageService.saveChallenges(challenges);
  }, [challenges]);

  useEffect(() => {
    storageService.saveAchievements(achievements);
  }, [achievements]);

  useEffect(() => {
    storageService.saveXPLogs(xpLogs);
  }, [xpLogs]);

  useEffect(() => {
    storageService.saveStreak(streak);
  }, [streak]);

  // Auth methods
  const login = (email: string, pass: string): boolean => {
    if (!email || !pass) return false;
    localStorage.setItem('neko_auth_token', 'active');
    setIsAuthenticated(true);
    setUser(prev => ({ ...prev, email }));
    return true;
  };

  const register = (name: string, email: string, pass: string): boolean => {
    if (!name || !email || !pass) return false;
    localStorage.setItem('neko_auth_token', 'active');
    setIsAuthenticated(true);
    setUser(prev => ({ ...prev, name, email }));
    setShowOnboarding(true);
    return true;
  };

  const enterDemoMode = () => {
    localStorage.setItem('neko_auth_token', 'active');
    setIsAuthenticated(true);
    setShowOnboarding(false);
    triggerCelebration();
  };

  const logout = () => {
    localStorage.removeItem('neko_auth_token');
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
  };

  // Onboarding
  const completeOnboarding = (answers: OnboardingAnswers) => {
    storageService.saveOnboarding(answers);
    setShowOnboarding(false);
    // Add extra bonus XP for completing setup!
    awardXP(30, 'Onboarding de Hábitos Concluído');
    setMascotToast('Bem-vindo ao NEKO! Estou muito feliz em acompanhar seu equilíbrio.');
  };

  const skipOnboarding = () => {
    setShowOnboarding(false);
  };

  // Gamification calculations
  const totalXP = xpLogs.reduce((sum, log) => sum + log.amount, 0);

  // Level milestones: Level 1: 0-150, Level 2: 151-350, Level 3: 351-650, Level 4: 651-1000, Level 5: 1000+
  let currentLevel = 1;
  let levelTitle = 'Aprendiz do Tempo';
  let prevThreshold = 0;
  let nextThreshold = 150;

  if (totalXP >= 1000) {
    currentLevel = 5;
    levelTitle = 'Mestre Zen Digital';
    prevThreshold = 1000;
    nextThreshold = 1500;
  } else if (totalXP >= 650) {
    currentLevel = 4;
    levelTitle = 'Arquiteto da Atenção';
    prevThreshold = 650;
    nextThreshold = 1000;
  } else if (totalXP >= 350) {
    currentLevel = 3;
    levelTitle = 'Guardião do Equilíbrio';
    prevThreshold = 350;
    nextThreshold = 650;
  } else if (totalXP >= 150) {
    currentLevel = 2;
    levelTitle = 'Explorador Consciente';
    prevThreshold = 150;
    nextThreshold = 350;
  }

  const xpInCurrentLevel = totalXP - prevThreshold;
  const xpNeededForLevel = nextThreshold - prevThreshold;
  const levelProgressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100));
  const xpToNextLevel = Math.max(0, nextThreshold - totalXP);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#C7F36B', '#65D6C5', '#F28BB5', '#F5F7FA'],
      });
    } catch {
      // ignore
    }
  };

  const awardXP = (amount: number, reason: string, challengeId?: string) => {
    const newLog: XPLog = {
      id: `xp_${Date.now()}`,
      date: getTodayDateString(0),
      amount,
      reason,
      challengeId,
    };
    setXpLogs(prev => [newLog, ...prev]);
    triggerCelebration();
  };

  // Check achievements after state updates
  const checkAchievements = (
    currentChallenges: Challenge[], 
    currentRecords: AppUsageRecord[]
  ) => {
    const today = getTodayDateString(0);
    const completedCount = currentChallenges.filter(c => c.isCompleted).length;
    const todayTotal = currentRecords
      .filter(r => r.date === today)
      .reduce((sum, r) => sum + r.durationMinutes, 0);

    setAchievements(prev =>
      prev.map(ach => {
        if (ach.isUnlocked) return ach;

        let shouldUnlock = false;
        if (ach.id === 'ach_3' && currentChallenges.some(c => c.id === 'ch_3' && c.isCompleted)) {
          shouldUnlock = true;
        } else if (ach.id === 'ach_5' && todayTotal > 0 && todayTotal <= user.dailyScreenTimeGoalMinutes) {
          shouldUnlock = true;
        } else if (ach.id === 'ach_6') {
          const breakdown = calculateDigitalBalanceIndex(currentRecords, today, user.dailyScreenTimeGoalMinutes, completedCount);
          if (breakdown.score >= 80) shouldUnlock = true;
        }

        if (shouldUnlock) {
          awardXP(ach.xpReward, `Medalha Conquistada: ${ach.title}`);
          setMascotToast(`Incrível! Você desbloqueou a medalha "${ach.title}"! (+${ach.xpReward} XP)`);
          return { ...ach, isUnlocked: true, unlockedAt: new Date().toISOString() };
        }
        return ach;
      })
    );
  };

  // Screen Time actions
  const addUsageRecord = (record: Omit<AppUsageRecord, 'id'>) => {
    const newRecord: AppUsageRecord = {
      ...record,
      id: `rec_${Date.now()}`,
    };
    const updated = [newRecord, ...usageRecords];
    setUsageRecords(updated);
    checkAchievements(challenges, updated);
    setMascotToast(`Registro de ${record.appName} salvo com sucesso!`);
  };

  const updateUsageRecord = (id: string, patch: Partial<AppUsageRecord>) => {
    const updated = usageRecords.map(r => r.id === id ? { ...r, ...patch } : r);
    setUsageRecords(updated);
    checkAchievements(challenges, updated);
  };

  const deleteUsageRecord = (id: string) => {
    const updated = usageRecords.filter(r => r.id !== id);
    setUsageRecords(updated);
    setMascotToast('Registro removido.');
  };

  const getRecordsForDate = (date: string) => {
    return usageRecords.filter(r => r.date === date);
  };

  const getTodayTotalMinutes = () => {
    const today = getTodayDateString(0);
    return usageRecords
      .filter(r => r.date === today)
      .reduce((acc, curr) => acc + curr.durationMinutes, 0);
  };

  // Challenges actions
  const toggleChallengeComplete = (id: string) => {
    const today = getTodayDateString(0);
    setChallenges(prev => {
      const target = prev.find(c => c.id === id);
      if (!target) return prev;

      const isNowCompleted = !target.isCompleted;

      // Prevent duplicate XP: check if already rewarded today
      if (isNowCompleted) {
        const alreadyRewarded = xpLogs.some(
          log => log.challengeId === id && log.date === today
        );
        if (!alreadyRewarded) {
          awardXP(target.xpReward, `Desafio concluído: ${target.name}`, id);
          setMascotToast(`Parabéns! ${target.name} concluído (+${target.xpReward} XP)`);
        }
      }

      const updated = prev.map(c => 
        c.id === id 
          ? { 
              ...c, 
              isCompleted: isNowCompleted, 
              completedAt: isNowCompleted ? new Date().toISOString() : undefined 
            } 
          : c
      );
      checkAchievements(updated, usageRecords);
      return updated;
    });
  };

  const addChallenge = (newCh: Omit<Challenge, 'id' | 'isCompleted'>) => {
    const challenge: Challenge = {
      ...newCh,
      id: `ch_custom_${Date.now()}`,
      isCompleted: false,
    };
    setChallenges(prev => [challenge, ...prev]);
    setMascotToast(`Novo hábito "${challenge.name}" adicionado à sua rotina!`);
  };

  const startFocusTimer = (challenge: Challenge) => {
    setActiveFocusChallenge(challenge);
    setIsFocusTimerOpen(true);
  };

  // Reset data to initial academic demo
  const resetDemoData = () => {
    storageService.resetToDemo();
    setUser(storageService.getUserProfile());
    setUsageRecords(storageService.getUsageRecords());
    setChallenges(storageService.getChallenges());
    setAchievements(storageService.getAchievements());
    setXpLogs(storageService.getXPLogs());
    setStreak(storageService.getStreak());
    setMascotToast('Dados restaurados para o padrão demonstrativo inicial.');
  };

  // Current balance breakdown
  const todayDate = getTodayDateString(0);
  const completedTodayCount = challenges.filter(c => c.isCompleted).length;
  const todayBalance = calculateDigitalBalanceIndex(
    usageRecords,
    todayDate,
    user.dailyScreenTimeGoalMinutes,
    completedTodayCount
  );

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        enterDemoMode,
        activeTab,
        setActiveTab,
        showOnboarding,
        completeOnboarding,
        skipOnboarding,
        usageRecords,
        addUsageRecord,
        updateUsageRecord,
        deleteUsageRecord,
        getRecordsForDate,
        getTodayTotalMinutes,
        challenges,
        toggleChallengeComplete,
        addChallenge,
        startFocusTimer,
        streak,
        totalXP,
        currentLevel,
        levelTitle,
        xpToNextLevel,
        levelProgressPercent,
        achievements,
        xpLogs,
        todayBalance,
        isLogModalOpen,
        setIsLogModalOpen,
        editingRecord,
        setEditingRecord,
        isAddChallengeOpen,
        setIsAddChallengeOpen,
        isFocusTimerOpen,
        setIsFocusTimerOpen,
        activeFocusChallenge,
        mascotToast,
        setMascotToast,
        celebrationModal,
        closeCelebrationModal,
        triggerLevelUpCelebration,
        triggerGoalReachedCelebration,
        triggerTestLevelUp,
        triggerTestGoal,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
