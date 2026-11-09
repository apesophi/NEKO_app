import React from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  Activity, 
  CheckSquare, 
  Trophy, 
  BarChart3, 
  User, 
  Plus, 
  Flame, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { NekoMascot } from '../NekoMascot';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    streak, 
    totalXP, 
    currentLevel, 
    setIsLogModalOpen,
    setEditingRecord,
    resetDemoData,
    user
  } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'screen-time', label: 'Meu tempo', icon: Clock },
    { id: 'balance', label: 'Equilíbrio digital', icon: Activity },
    { id: 'challenges', label: 'Desafios & Hábitos', icon: CheckSquare },
    { id: 'gamification', label: 'Conquistas', icon: Trophy },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
    { id: 'profile', label: 'Perfil & Metas', icon: User },
  ];

  const handleOpenNewLog = () => {
    setEditingRecord(null);
    setIsLogModalOpen(true);
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#192331] border-r border-[#202D3D] h-screen sticky top-0 p-5 shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-[#202D3D]">
        <div className="relative">
          <NekoMascot size="sm" mood="happy" showAura={false} interactive={false} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-[#F5F7FA]">NEKO</span>
          <span className="text-[11px] font-medium text-[#C7F36B] tracking-wide">Seu tempo. Sua vida.</span>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="pt-5 pb-3">
        <button
          onClick={handleOpenNewLog}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#C7F36B] text-[#10151D] font-semibold text-sm shadow-md hover:bg-[#b8eb52] active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Registrar Tempo</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 py-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#202D3D] text-[#C7F36B] shadow-sm font-semibold'
                  : 'text-[#AAB6C5] hover:text-[#F5F7FA] hover:bg-[#202D3D]/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#C7F36B]' : 'text-[#AAB6C5]'}`} />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C7F36B]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Status / Gamification Pill Box */}
      <div className="pt-4 border-t border-[#202D3D] space-y-3">
        {/* Streak and Level Quick Stats */}
        <div className="bg-[#202D3D]/60 rounded-xl p-3 border border-[#202D3D]">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#AAB6C5] flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#F28BB5]" />
              Sequência
            </span>
            <span className="font-semibold text-[#F5F7FA] tabular-nums">{streak} dias</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#AAB6C5] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#65D6C5]" />
              Nível {currentLevel}
            </span>
            <span className="font-semibold text-[#C7F36B] tabular-nums">{totalXP} XP</span>
          </div>
        </div>

        {/* Demo Mode Academic Tag with Reset Action */}
        <div className="flex items-center justify-between px-1 text-[11px] text-[#AAB6C5]">
          <span className="truncate">Modo Demo Acadêmica</span>
          <button
            onClick={resetDemoData}
            title="Restaurar dados demonstrativos padrão"
            className="flex items-center gap-1 text-[#65D6C5] hover:text-[#C7F36B] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Profile Footprint */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#202D3D] cursor-pointer transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[#202D3D] flex items-center justify-center border border-[#65D6C5]/40 text-xs font-bold text-[#C7F36B] overflow-hidden">
            {user.avatar === 'cosmic_cat' ? (
              <img 
                src="/assets/aistudio/17a050a7ff186dd71f1f9883dc35d97c_6835da07.jpg" 
                alt="Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span>{user.name.charAt(0)}</span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-[#F5F7FA] truncate">{user.name}</span>
            <span className="text-[10px] text-[#AAB6C5] truncate">{user.email}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
