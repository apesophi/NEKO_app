import React from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  Activity, 
  CheckSquare, 
  Trophy, 
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsLogModalOpen, setEditingRecord } = useApp();

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setIsLogModalOpen(true);
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'screen-time', label: 'Tempo', icon: Clock },
    { id: 'balance', label: 'Índice', icon: Activity },
    { id: 'challenges', label: 'Desafios', icon: CheckSquare },
    { id: 'gamification', label: 'Conquistas', icon: Trophy },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#192331]/95 backdrop-blur-md border-t border-[#202D3D] px-2 py-1 safe-bottom">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto relative">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex-1 min-h-[44px] min-w-[44px] flex flex-col items-center justify-center relative cursor-pointer group"
            >
              <div className={`transition-all duration-200 ${isActive ? 'scale-110 text-[#C7F36B]' : 'text-[#AAB6C5] group-hover:text-[#F5F7FA]'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${
                isActive ? 'text-[#C7F36B] font-semibold' : 'text-[#AAB6C5]'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 rounded-full bg-[#C7F36B]" />
              )}
            </button>
          );
        })}

        {/* Floating Quick Add Log Trigger */}
        <button
          onClick={handleOpenAdd}
          title="Registrar tempo"
          className="absolute -top-5 right-4 w-11 h-11 rounded-full bg-[#C7F36B] text-[#10151D] flex items-center justify-center shadow-lg shadow-[#C7F36B]/20 hover:scale-105 active:scale-95 transition-transform cursor-pointer border-2 border-[#192331]"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
