import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Award, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ShieldCheck,
  Cat,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NekoMascot } from '../components/NekoMascot';
import { ShareAchievementModal } from '../components/modals/ShareAchievementModal';
import { Achievement } from '../types';

export const GamificationView: React.FC = () => {
  const { 
    totalXP, 
    currentLevel, 
    levelTitle, 
    levelProgressPercent, 
    xpToNextLevel, 
    streak, 
    achievements, 
    xpLogs,
    challenges,
    triggerTestLevelUp,
  } = useApp();

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [sharingAchievement, setSharingAchievement] = useState<Achievement | null>(null);

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalAchievements = achievements.length;

  const getAchievementIcon = (iconName: string, isUnlocked: boolean) => {
    const className = `w-5 h-5 ${isUnlocked ? 'text-[#C7F36B]' : 'text-[#AAB6C5]/50'}`;
    switch (iconName) {
      case 'Cat': return <Cat className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Moon': return <Sparkles className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Award': return <Award className={className} />;
      default: return <Trophy className={className} />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Level & Mascot Hero Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-[#192331] border border-[#202D3D] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-[#C7F36B]/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <NekoMascot size="lg" mood="celebrating" showAura={true} />

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#202D3D] text-[#C7F36B] text-xs font-bold">
              <Trophy className="w-3.5 h-3.5" />
              <span>Nível {currentLevel} · {levelTitle}</span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#F5F7FA]">
              {totalXP} XP Acumulados
            </h2>

            <p className="text-xs text-[#AAB6C5] max-w-lg leading-relaxed">
              Você evolui cada vez que opta pela presença. Conclua desafios, mantenha sua sequência de equilíbrio e desbloqueie novas medalhas.
            </p>

            {/* XP Progress Bar */}
            <div className="pt-3 max-w-lg">
              <div className="flex justify-between text-xs text-[#AAB6C5] mb-1 font-medium">
                <span>Faltam {xpToNextLevel} XP para o próximo nível</span>
                <span className="text-[#C7F36B] font-bold tabular-nums">{levelProgressPercent}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#202D3D] overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-[#65D6C5] to-[#C7F36B] rounded-full transition-all duration-500"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={triggerTestLevelUp}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C7F36B] hover:bg-[#b8eb52] text-[#10151D] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Subir de Nível (+50 XP)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSharingAchievement(null);
                    setIsShareOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#202D3D] hover:bg-[#26364a] text-[#00E5FF] border border-[#00E5FF]/40 hover:border-[#00E5FF] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartilhar Conquistas</span>
                </button>
              </div>
            </div>
          </div>

          {/* Streak Box */}
          <div className="shrink-0 p-5 rounded-2xl bg-[#202D3D]/60 border border-[#202D3D] text-center min-w-[140px]">
            <div className="w-12 h-12 rounded-full bg-[#10151D] flex items-center justify-center text-[#F28BB5] mx-auto mb-2">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <span className="text-3xl font-black text-[#F5F7FA] tabular-nums block">{streak}</span>
            <span className="text-xs text-[#AAB6C5] font-medium">Dias de Sequência</span>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="p-6 rounded-2xl bg-[#192331] border border-[#202D3D]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-[#F5F7FA]">Medalhas & Conquistas</h3>
            <p className="text-xs text-[#AAB6C5]">
              {unlockedCount} de {totalAchievements} medalhas desbloqueadas
            </p>
          </div>
          <span className="text-xs font-semibold text-[#65D6C5]">
            Coleção NEKO 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                ach.isUnlocked
                  ? 'bg-[#202D3D]/70 border-[#C7F36B]/40 shadow-sm'
                  : 'bg-[#10151D]/60 border-[#202D3D] opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    ach.isUnlocked ? 'bg-[#192331] border border-[#C7F36B]/30' : 'bg-[#192331]'
                  }`}>
                    {getAchievementIcon(ach.icon, ach.isUnlocked)}
                  </div>

                  <span className={`text-xs font-bold tabular-nums ${
                    ach.isUnlocked ? 'text-[#C7F36B]' : 'text-[#AAB6C5]'
                  }`}>
                    +{ach.xpReward} XP
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mb-1">
                  <h4 className="text-sm font-bold text-[#F5F7FA]">{ach.title}</h4>
                  {ach.isUnlocked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C7F36B]" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-[#AAB6C5]" />
                  )}
                </div>

                <p className="text-xs text-[#AAB6C5] leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#202D3D] text-[10px] text-[#AAB6C5] flex items-center justify-between">
                {ach.isUnlocked ? (
                  <>
                    <span className="text-[#65D6C5] font-medium">✓ Desbloqueada</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSharingAchievement(ach);
                        setIsShareOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-[10px] text-[#00E5FF] hover:underline cursor-pointer"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Compartilhar</span>
                    </button>
                  </>
                ) : (
                  <span>Como liberar: {ach.requirement}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* XP History Log */}
      <div className="p-6 rounded-2xl bg-[#192331] border border-[#202D3D]">
        <h3 className="text-base font-bold text-[#F5F7FA] mb-1">Histórico de Recompensas (XP)</h3>
        <p className="text-xs text-[#AAB6C5] mb-4">
          Transparência de pontos conquistados em desafios e marcos
        </p>

        <div className="space-y-2">
          {xpLogs.map((log) => (
            <div 
              key={log.id}
              className="flex items-center justify-between p-3 rounded-xl bg-[#202D3D]/50 border border-[#202D3D] text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#10151D] flex items-center justify-center text-[#C7F36B]">
                  <Zap className="w-3 h-3 fill-current" />
                </div>
                <div>
                  <span className="font-semibold text-[#F5F7FA] block">{log.reason}</span>
                  <span className="text-[10px] text-[#AAB6C5]">{log.date}</span>
                </div>
              </div>

              <span className="font-bold text-[#C7F36B] tabular-nums">
                +{log.amount} XP
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Share Achievement Social Card Modal */}
      <ShareAchievementModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        selectedAchievement={sharingAchievement}
      />
    </div>
  );
};
