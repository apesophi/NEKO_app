import React from 'react';
import { Flame, Sparkles, User, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NekoMascot } from '../NekoMascot';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    streak, 
    totalXP, 
    mascotToast, 
    setMascotToast,
    user 
  } = useApp();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Visão Geral';
      case 'screen-time': return 'Monitoramento de Tempo';
      case 'balance': return 'Índice de Equilíbrio';
      case 'challenges': return 'Desafios & Hábitos';
      case 'gamification': return 'Conquistas & Nível';
      case 'reports': return 'Relatórios de Evolução';
      case 'profile': return 'Perfil & Configurações';
      default: return 'NEKO';
    }
  };

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  // Capitalize first letter of date
  const displayDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <header className="sticky top-0 z-20 bg-[#10151D]/90 backdrop-blur-md border-b border-[#202D3D] px-4 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Slot: Mobile Brand / Page Title */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden flex items-center gap-2">
            <NekoMascot size="sm" mood="happy" showAura={false} interactive={false} />
            <span className="text-base font-bold text-[#F5F7FA]">NEKO</span>
          </div>

          <div className="hidden lg:flex flex-col">
            <h1 className="text-xl font-bold text-[#F5F7FA] tracking-tight">{getPageTitle()}</h1>
            <span className="text-xs text-[#AAB6C5] font-medium">{displayDate}</span>
          </div>
        </div>

        {/* Center Slot: Dynamic Mascot Toast Notification */}
        {mascotToast && (
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#192331] border border-[#C7F36B]/30 text-xs text-[#F5F7FA] animate-fadeIn">
            <NekoMascot size="sm" mood="motivated" showAura={false} interactive={false} className="w-5 h-5" />
            <span className="truncate max-w-md text-[#C7F36B] font-medium">{mascotToast}</span>
            <button 
              onClick={() => setMascotToast(null)}
              className="ml-1 text-[#AAB6C5] hover:text-[#F5F7FA] text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Right Slot: User status, streak & profile trigger */}
        <div className="flex items-center gap-3">
          {/* Streak badge */}
          <div 
            onClick={() => setActiveTab('gamification')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#192331] border border-[#202D3D] text-xs font-semibold text-[#F5F7FA] cursor-pointer hover:border-[#F28BB5]/50 transition-colors"
            title={`${streak} dias seguidos mantendo o equilíbrio`}
          >
            <Flame className="w-4 h-4 text-[#F28BB5]" />
            <span className="tabular-nums">{streak}d</span>
          </div>

          {/* XP badge */}
          <div 
            onClick={() => setActiveTab('gamification')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#192331] border border-[#202D3D] text-xs font-semibold text-[#C7F36B] cursor-pointer hover:border-[#C7F36B]/50 transition-colors"
            title={`${totalXP} pontos de experiência`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#65D6C5]" />
            <span className="tabular-nums">{totalXP} XP</span>
          </div>

          {/* Profile Button */}
          <button
            onClick={() => setActiveTab('profile')}
            className="w-8 h-8 rounded-full bg-[#192331] border border-[#202D3D] hover:border-[#65D6C5] flex items-center justify-center transition-colors cursor-pointer overflow-hidden"
            title="Abrir perfil"
          >
            {user.avatar === 'cosmic_cat' ? (
              <img 
                src="/assets/aistudio/17a050a7ff186dd71f1f9883dc35d97c_6835da07.jpg" 
                alt="Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-xs font-bold text-[#F5F7FA]">{user.name.charAt(0)}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
