import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/navigation/Sidebar';
import { BottomNav } from './components/navigation/BottomNav';
import { Header } from './components/navigation/Header';
import { WelcomeView } from './views/WelcomeView';
import { AuthModal } from './components/modals/AuthModal';
import { OnboardingView } from './views/OnboardingView';
import { DashboardView } from './views/DashboardView';
import { ScreenTimeView } from './views/ScreenTimeView';
import { BalanceIndexView } from './views/BalanceIndexView';
import { ChallengesView } from './views/ChallengesView';
import { GamificationView } from './views/GamificationView';
import { ReportsView } from './views/ReportsView';
import { ProfileView } from './views/ProfileView';
import { LogUsageModal } from './components/modals/LogUsageModal';
import { AddChallengeModal } from './components/modals/AddChallengeModal';
import { FocusTimerModal } from './components/modals/FocusTimerModal';
import { CelebrationModal } from './components/modals/CelebrationModal';
import { AuthMode } from './types';

const AppContent: React.FC = () => {
  const { 
    isAuthenticated, 
    showOnboarding, 
    activeTab, 
    enterDemoMode,
    celebrationModal,
    closeCelebrationModal 
  } = useApp();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const handleStart = () => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  const handleLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleDemo = () => {
    enterDemoMode();
  };

  // View 1: Not Authenticated -> Welcome Landing Screen
  if (!isAuthenticated) {
    return (
      <>
        <WelcomeView 
          onStart={handleStart}
          onLogin={handleLogin}
          onDemo={handleDemo}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  // View 2: Onboarding Flow
  if (showOnboarding) {
    return <OnboardingView />;
  }

  // View 3: Full Authenticated App with Navigation
  return (
    <div className="min-h-screen bg-[#10151D] text-[#F5F7FA] flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'screen-time' && <ScreenTimeView />}
          {activeTab === 'balance' && <BalanceIndexView />}
          {activeTab === 'challenges' && <ChallengesView />}
          {activeTab === 'gamification' && <GamificationView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'profile' && <ProfileView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Modals */}
      <LogUsageModal />
      <AddChallengeModal />
      <FocusTimerModal />
      <CelebrationModal
        isOpen={celebrationModal.isOpen}
        type={celebrationModal.type}
        title={celebrationModal.title}
        subtitle={celebrationModal.subtitle}
        levelNumber={celebrationModal.levelNumber}
        levelTitle={celebrationModal.levelTitle}
        xpEarned={celebrationModal.xpEarned}
        onClose={closeCelebrationModal}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
