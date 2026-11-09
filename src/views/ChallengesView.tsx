import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Play, 
  Plus, 
  Sparkles, 
  Clock, 
  Flame, 
  Filter, 
  Check, 
  BookOpen, 
  Footprints, 
  Moon, 
  Users, 
  Palette, 
  Droplet,
  Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Challenge, ChallengeCategory } from '../types';
import { NekoMascot } from '../components/NekoMascot';

export const ChallengesView: React.FC = () => {
  const { 
    challenges, 
    toggleChallengeComplete, 
    startFocusTimer, 
    setIsAddChallengeOpen 
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredChallenges = challenges.filter(c => {
    if (filterStatus === 'pending' && c.isCompleted) return false;
    if (filterStatus === 'completed' && !c.isCompleted) return false;
    if (filterCategory !== 'all' && c.category !== filterCategory) return false;
    return true;
  });

  const completedCount = challenges.filter(c => c.isCompleted).length;
  const totalCount = challenges.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getCategoryIcon = (name: string, cat: ChallengeCategory) => {
    const lower = name.toLowerCase();
    if (lower.includes('ler')) return BookOpen;
    if (lower.includes('caminhar')) return Footprints;
    if (lower.includes('dormir') || lower.includes('sono')) return Moon;
    if (lower.includes('amigos') || lower.includes('família')) return Users;
    if (lower.includes('água')) return Droplet;
    if (lower.includes('redes sociais') || lower.includes('sem celular')) return Smartphone;
    if (lower.includes('criativa') || lower.includes('arte')) return Palette;
    return Sparkles;
  };

  const getCategoryBadge = (cat: ChallengeCategory) => {
    switch (cat) {
      case 'offline': return { label: 'Vida Offline', color: 'text-[#C7F36B]' };
      case 'focus': return { label: 'Foco Profundo', color: 'text-[#65D6C5]' };
      case 'health': return { label: 'Saúde & Sono', color: 'text-[#00F2FE]' };
      case 'social': return { label: 'Social & Conexões', color: 'text-[#F28BB5]' };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner & Progress Summary */}
      <div className="p-6 rounded-3xl bg-[#192331] border border-[#202D3D] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <NekoMascot size="md" mood={progressPercent > 50 ? 'celebrating' : 'motivated'} showAura={false} />
          <div>
            <h2 className="text-xl font-bold text-[#F5F7FA]">Desafios & Hábitos Reais</h2>
            <p className="text-xs text-[#AAB6C5] max-w-md mt-0.5">
              Cultive pequenas vitórias diárias longe das telas e acumule experiência para elevar o seu nível.
            </p>
          </div>
        </div>

        {/* Progress Box */}
        <div className="w-full md:w-64 p-4 rounded-2xl bg-[#202D3D]/60 border border-[#202D3D]">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-[#AAB6C5]">Concluídos Hoje</span>
            <span className="font-bold text-[#C7F36B] tabular-nums">{completedCount} de {totalCount}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#10151D] overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#65D6C5] to-[#C7F36B] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-right text-[#AAB6C5] mt-1">
            {progressPercent}% completados
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
              filterStatus === 'all'
                ? 'bg-[#C7F36B] text-[#10151D] font-bold'
                : 'bg-[#192331] text-[#AAB6C5] hover:text-[#F5F7FA]'
            }`}
          >
            Todos ({totalCount})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
              filterStatus === 'pending'
                ? 'bg-[#C7F36B] text-[#10151D] font-bold'
                : 'bg-[#192331] text-[#AAB6C5] hover:text-[#F5F7FA]'
            }`}
          >
            Pendentes ({totalCount - completedCount})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
              filterStatus === 'completed'
                ? 'bg-[#C7F36B] text-[#10151D] font-bold'
                : 'bg-[#192331] text-[#AAB6C5] hover:text-[#F5F7FA]'
            }`}
          >
            Concluídos ({completedCount})
          </button>
        </div>

        {/* Add Challenge CTA */}
        <button
          onClick={() => setIsAddChallengeOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#202D3D] hover:bg-[#26364a] text-xs font-bold text-[#C7F36B] border border-[#C7F36B]/30 hover:border-[#C7F36B] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Criar Novo Hábito</span>
        </button>
      </div>

      {/* Challenges List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChallenges.map((challenge) => {
          const Icon = getCategoryIcon(challenge.name, challenge.category);
          const badge = getCategoryBadge(challenge.category);

          return (
            <div
              key={challenge.id}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                challenge.isCompleted
                  ? 'bg-[#192331]/50 border-[#202D3D] opacity-80'
                  : 'bg-[#192331] border-[#202D3D] hover:border-[#65D6C5]/50 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`font-semibold ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-[#AAB6C5]">·</span>
                    <span className="text-[#AAB6C5] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {challenge.estimatedMinutes} min
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#C7F36B] tabular-nums">
                    +{challenge.xpReward} XP
                  </span>
                </div>

                <div className="flex items-start gap-3 my-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    challenge.isCompleted ? 'bg-[#202D3D] text-[#C7F36B]' : 'bg-[#202D3D] text-[#65D6C5]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold text-[#F5F7FA] ${
                      challenge.isCompleted ? 'line-through text-[#AAB6C5]' : ''
                    }`}>
                      {challenge.name}
                    </h3>
                    <p className="text-xs text-[#AAB6C5] mt-1 leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#202D3D] flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={() => toggleChallengeComplete(challenge.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    challenge.isCompleted
                      ? 'bg-[#202D3D] text-[#C7F36B] hover:bg-[#26364a]'
                      : 'bg-[#202D3D] text-[#F5F7FA] hover:bg-[#26364a]'
                  }`}
                >
                  {challenge.isCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#C7F36B]" />
                      <span>Concluído</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-[#AAB6C5]" />
                      <span>Marcar como feito</span>
                    </>
                  )}
                </button>

                {!challenge.isCompleted && (
                  <button
                    onClick={() => startFocusTimer(challenge)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#C7F36B] text-[#10151D] text-xs font-bold hover:bg-[#b8eb52] transition-colors cursor-pointer shadow-sm"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Iniciar Foco</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
