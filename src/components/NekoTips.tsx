import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  RefreshCw, 
  Sun, 
  Sunset, 
  Moon, 
  Zap, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  Activity,
  Flame,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NekoMascot } from './NekoMascot';

interface TipData {
  timeOfDayLabel: string;
  timeIcon: React.ReactNode;
  stressLevel: 'baixo' | 'moderado' | 'elevado';
  stressLabel: string;
  stressColor: string;
  quote: string;
  actionText?: string;
  actionType?: 'pause' | 'challenge' | 'focus';
}

export const NekoTips: React.FC = () => {
  const { 
    todayBalance, 
    usageRecords, 
    user, 
    challenges, 
    startFocusTimer, 
    setActiveTab,
    triggerTestGoal 
  } = useApp();

  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  // 1. Detect time of day
  const currentHour = new Date().getHours();
  let timePeriod: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning';
  let timeLabel = 'Manhã Consciente';
  let TimeIcon = <Sun className="w-3.5 h-3.5 text-[#C7F36B]" />;

  if (currentHour >= 5 && currentHour < 12) {
    timePeriod = 'morning';
    timeLabel = 'Energia Matinal';
    TimeIcon = <Sun className="w-3.5 h-3.5 text-[#C7F36B]" />;
  } else if (currentHour >= 12 && currentHour < 18) {
    timePeriod = 'afternoon';
    timeLabel = 'Foco da Tarde';
    TimeIcon = <Sun className="w-3.5 h-3.5 text-[#00E5FF]" />;
  } else if (currentHour >= 18 && currentHour < 23) {
    timePeriod = 'evening';
    timeLabel = 'Desaceleração Noturna';
    TimeIcon = <Sunset className="w-3.5 h-3.5 text-[#EC4899]" />;
  } else {
    timePeriod = 'night';
    timeLabel = 'Descanso Sagrado';
    TimeIcon = <Moon className="w-3.5 h-3.5 text-[#8B5CF6]" />;
  }

  // 2. Detect Digital Stress Level
  // Based on current day total minutes, balance score and social media ratio
  const totalMinutes = usageRecords
    .filter(r => r.date === new Date().toISOString().split('T')[0])
    .reduce((sum, r) => sum + r.durationMinutes, 0);

  const goalMinutes = user.dailyScreenTimeGoalMinutes || 240;
  const isOverGoal = totalMinutes > goalMinutes;
  const balanceScore = todayBalance?.score ?? 75;

  let stressLevel: 'baixo' | 'moderado' | 'elevado' = 'baixo';
  let stressLabel = 'Estresse Digital Baixo';
  let stressColor = 'text-[#C7F36B] border-[#C7F36B]/30 bg-[#C7F36B]/10';

  if (balanceScore < 55 || totalMinutes > goalMinutes + 60) {
    stressLevel = 'elevado';
    stressLabel = 'Estresse Digital Elevado';
    stressColor = 'text-[#EC4899] border-[#EC4899]/30 bg-[#EC4899]/10';
  } else if (balanceScore < 75 || isOverGoal) {
    stressLevel = 'moderado';
    stressLabel = 'Estresse Digital Moderado';
    stressColor = 'text-[#00E5FF] border-[#00E5FF]/30 bg-[#00E5FF]/10';
  }

  // Contextual tips pool
  const tipsByContext: Record<string, string[]> = {
    'morning_baixo': [
      'Comece seu dia respirando e definindo uma prioridade real antes de abrir notificações.',
      'Sua manhã é preciosa: que tal um copo de água e 10 minutos sem telas ao acordar?',
    ],
    'morning_moderado': [
      'Atenção às primeiras horas do dia: a rolagem passiva pode roubar a energia que você precisa.',
      'Proteja sua clareza mental matinal focando em tarefas físicas antes dos aplicativos.',
    ],
    'afternoon_baixo': [
      'Excelente equilíbrio nesta tarde! Faça uma pausa curta de 3 minutos para alongar o corpo.',
      'Mente focada e serena. Levante da cadeira e olhe para o horizonte por alguns instantes.',
    ],
    'afternoon_moderado': [
      'A fadiga ocular pode estar se acumulando. Desvie o olhar da tela a cada 20 minutos.',
      'Substitua a rolagem de redes sociais por uma caminhada rápida ou conversa presencial.',
    ],
    'afternoon_elevado': [
      'Muitos estímulos absorvidos nesta tarde. Neko recomenda 15 minutos em modo avião.',
      'Sobrecarga de tela detectada. Faça uma pausa urgente para respirar fundo e beber água.',
    ],
    'evening_baixo': [
      'Boa noite! Você cultivou um ótimo ritmo hoje. Prepare-se para uma desconexão gradual.',
      'A noite chegou: priorize momentos com quem você ama ou a leitura de um livro físico.',
    ],
    'evening_moderado': [
      'O tempo de tela hoje foi intenso. Desative notificações secundárias para acalmar a mente.',
      'Evite discussões ou estímulos acelerados na tela nas últimas horas do seu dia.',
    ],
    'evening_elevado': [
      'Alerta de excesso digital: desligue telas pelo menos 45 minutos antes de deitar para proteger o sono.',
      'Muitas horas conectadas hoje. Neko sugere colocar o smartphone em outro cômodo durante a noite.',
    ],
    'night_elevado': [
      'Madrugada conectada prejudica seu sono profundo. Feche o aparelho agora e descanse seus olhos.',
      'A luz azul atrasa a melatonina. Dê ao seu corpo o descanso restaurador que ele merece.',
    ],
  };

  const key = `${timePeriod}_${stressLevel}`;
  const availableTips = tipsByContext[key] || [
    'O equilíbrio não é ausência de tecnologia, mas a presença consciente na sua própria vida.',
    'Cada minuto desconectado de notificações é um minuto a mais para viver seus sonhos reais.',
  ];

  const currentQuote = availableTips[tipIndex % availableTips.length];

  const handleNextTip = () => {
    setTipIndex(prev => prev + 1);
  };

  const handleAction = () => {
    // If elevated, start an offline challenge or focus
    const offlineChallenge = challenges.find(c => c.category === 'offline' || c.category === 'focus') || challenges[0];
    if (offlineChallenge) {
      startFocusTimer(offlineChallenge);
    } else {
      setActiveTab('challenges');
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="relative z-30 mb-5"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#141B26] via-[#192331] to-[#141B26] border border-[#202D3D] hover:border-[#00E5FF]/40 shadow-xl transition-all">
          {/* Subtle Cyber Glowing Top Accent Line */}
          <div 
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: stressLevel === 'elevado'
                ? 'linear-gradient(90deg, #EC4899, #F43F5E, #EC4899)'
                : stressLevel === 'moderado'
                ? 'linear-gradient(90deg, #00E5FF, #3B82F6, #00E5FF)'
                : 'linear-gradient(90deg, #C7F36B, #65D6C5, #C7F36B)',
            }}
          />

          <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Left: Mascot & Tip Content */}
            <div className="flex items-start gap-3.5 flex-1">
              {/* Mascot Avatar with Contextual Mood */}
              <div className="shrink-0 mt-0.5">
                <NekoMascot
                  size="sm"
                  mood={stressLevel === 'elevado' ? 'alert' : stressLevel === 'moderado' ? 'thinking' : 'zen'}
                  showAura={true}
                  interactive={true}
                  onClick={triggerTestGoal}
                />
              </div>

              {/* Text content */}
              <div className="space-y-1.5 flex-1">
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Time Badge */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#10151D] border border-[#202D3D] text-[10px] font-semibold text-[#F5F7FA]">
                    {TimeIcon}
                    <span>{timeLabel}</span>
                  </span>

                  {/* Stress Level Badge */}
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${stressColor}`}>
                    {stressLevel === 'elevado' ? (
                      <AlertTriangle className="w-3 h-3" />
                    ) : stressLevel === 'moderado' ? (
                      <Activity className="w-3 h-3" />
                    ) : (
                      <ShieldCheck className="w-3 h-3" />
                    )}
                    <span>{stressLabel}</span>
                  </span>

                  <span className="text-[10px] font-mono text-[#AAB6C5]">
                    NEKO TIPS
                  </span>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm font-semibold text-[#F5F7FA] leading-relaxed pr-6">
                  "{currentQuote}"
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 self-end md:self-center shrink-0 w-full sm:w-auto justify-end border-t md:border-t-0 border-[#202D3D] pt-2 md:pt-0">
              {/* Contextual Action Button */}
              <button
                onClick={handleAction}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#202D3D] hover:bg-[#26364a] text-xs font-semibold text-[#C7F36B] border border-[#C7F36B]/30 hover:border-[#C7F36B] transition-colors cursor-pointer"
              >
                <span>{stressLevel === 'elevado' ? 'Pausa Agora' : 'Desafio Rápido'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Cycle Tip Button */}
              <button
                onClick={handleNextTip}
                title="Ver outra dica do Neko"
                className="w-8 h-8 rounded-xl bg-[#10151D] hover:bg-[#202D3D] text-[#AAB6C5] hover:text-[#00E5FF] border border-[#202D3D] flex items-center justify-center transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {/* Dismiss Button */}
              <button
                onClick={() => setIsVisible(false)}
                title="Fechar dica"
                className="w-8 h-8 rounded-xl bg-[#10151D] hover:bg-[#202D3D] text-[#AAB6C5] hover:text-rose-400 border border-[#202D3D] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
