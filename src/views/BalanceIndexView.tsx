import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  Info, 
  Target, 
  Layers, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { NekoMascot } from '../components/NekoMascot';
import { getTodayDateString, calculateDigitalBalanceIndex } from '../services/storage';

export const BalanceIndexView: React.FC = () => {
  const { 
    todayBalance, 
    usageRecords, 
    user, 
    challenges, 
    setActiveTab 
  } = useApp();

  // Weekly evolution of index
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const evolutionData = [-6, -5, -4, -3, -2, -1, 0].map(offset => {
    const dStr = getTodayDateString(offset);
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + offset);
    const dayLabel = daysOfWeek[dateObj.getDay()];

    // Estimate completed count for past days
    const completedPast = offset === 0 ? challenges.filter(c => c.isCompleted).length : Math.max(1, 2 + (offset % 2));
    const breakdown = calculateDigitalBalanceIndex(
      usageRecords,
      dStr,
      user.dailyScreenTimeGoalMinutes,
      completedPast
    );

    return {
      day: offset === 0 ? 'Hoje' : dayLabel,
      score: breakdown.score,
      goal: breakdown.goalScore,
      distribution: breakdown.distributionScore,
      habits: breakdown.habitsScore,
    };
  });

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#C7F36B';
    if (score >= 70) return '#65D6C5';
    if (score >= 50) return '#FFB800';
    return '#F28BB5';
  };

  const getStatusIcon = (score: number) => {
    if (score >= 70) return <CheckCircle2 className="w-5 h-5 text-[#C7F36B]" />;
    if (score >= 50) return <AlertTriangle className="w-5 h-5 text-[#FFB800]" />;
    return <ShieldAlert className="w-5 h-5 text-[#F28BB5]" />;
  };

  const scoreColor = getScoreColor(todayBalance.score);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#192331] border border-[#202D3D]">
        <h2 className="text-xl font-bold text-[#F5F7FA]">Índice de Equilíbrio Digital</h2>
        <p className="text-xs text-[#AAB6C5]">
          Indicador sintético de 0 a 100 que mensura a harmonia entre sua rotina digital e presencial
        </p>
      </div>

      {/* Hero Circular Indicator & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circular Progress Gauge */}
        <div className="p-8 rounded-3xl bg-[#192331] border border-[#202D3D] flex flex-col items-center text-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-radial from-[#C7F36B]/5 to-transparent pointer-events-none" />

          <span className="text-xs font-semibold text-[#AAB6C5] uppercase tracking-wider mb-2">
            Pontuação Atual
          </span>

          {/* SVG Circular Indicator */}
          <div className="relative w-52 h-52 flex items-center justify-center my-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="104"
                cy="104"
                r="88"
                stroke="#202D3D"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="104"
                cy="104"
                r="88"
                stroke={scoreColor}
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={(2 * Math.PI * 88) * (1 - todayBalance.score / 100)}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-[#F5F7FA] tabular-nums tracking-tight">
                {todayBalance.score}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: scoreColor }}>
                {todayBalance.classification}
              </span>
            </div>
          </div>

          {/* Mascot feedback */}
          <div className="flex items-center gap-2 pt-2">
            <NekoMascot size="sm" mood={todayBalance.score >= 70 ? 'happy' : 'thinking'} showAura={false} interactive={false} />
            <span className="text-xs text-[#AAB6C5]">
              {todayBalance.score >= 85 ? 'Neko está super animado com sua presença!' : 'Neko te apoia a fazer uma pausa revigorante.'}
            </span>
          </div>
        </div>

        {/* 3 Pillars Breakdown */}
        <div className="lg:col-span-2 p-6 lg:p-8 rounded-3xl bg-[#192331] border border-[#202D3D] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-[#F5F7FA]">Composição do Índice</h3>
              <span className="text-xs text-[#AAB6C5]">Total: 100 pontos</span>
            </div>
            <p className="text-xs text-[#AAB6C5] mb-6">
              Metodologia transparente baseada em três pilares objetivos do seu bem-estar digital:
            </p>

            <div className="space-y-4">
              {/* Pillar 1: Meta Diária (40%) */}
              <div className="p-4 rounded-2xl bg-[#202D3D]/50 border border-[#202D3D]">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#65D6C5]" />
                    <span className="text-xs font-bold text-[#F5F7FA]">Cumprimento de Metas (40 pts)</span>
                  </div>
                  <span className="text-xs font-bold text-[#65D6C5] tabular-nums">
                    {todayBalance.goalScore} / 40 pts
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#10151D] overflow-hidden">
                  <div 
                    className="h-full bg-[#65D6C5] rounded-full transition-all duration-500"
                    style={{ width: `${(todayBalance.goalScore / 40) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#AAB6C5] mt-1.5">
                  Pontua a disciplina em manter o tempo de tela próximo ou abaixo do limite estipulado ({Math.floor(user.dailyScreenTimeGoalMinutes / 60)}h).
                </p>
              </div>

              {/* Pillar 2: Equilíbrio de Categorias (30%) */}
              <div className="p-4 rounded-2xl bg-[#202D3D]/50 border border-[#202D3D]">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#C7F36B]" />
                    <span className="text-xs font-bold text-[#F5F7FA]">Equilíbrio de Categorias (30 pts)</span>
                  </div>
                  <span className="text-xs font-bold text-[#C7F36B] tabular-nums">
                    {todayBalance.distributionScore} / 30 pts
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#10151D] overflow-hidden">
                  <div 
                    className="h-full bg-[#C7F36B] rounded-full transition-all duration-500"
                    style={{ width: `${(todayBalance.distributionScore / 30) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#AAB6C5] mt-1.5">
                  Recompensa a diversificação de uso produtivo e pune o excesso de rolagem passiva em redes sociais.
                </p>
              </div>

              {/* Pillar 3: Hábitos Offline (30%) */}
              <div className="p-4 rounded-2xl bg-[#202D3D]/50 border border-[#202D3D]">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#F28BB5]" />
                    <span className="text-xs font-bold text-[#F5F7FA]">Hábitos & Desafios Offline (30 pts)</span>
                  </div>
                  <span className="text-xs font-bold text-[#F28BB5] tabular-nums">
                    {todayBalance.habitsScore} / 30 pts
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#10151D] overflow-hidden">
                  <div 
                    className="h-full bg-[#F28BB5] rounded-full transition-all duration-500"
                    style={{ width: `${(todayBalance.habitsScore / 30) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#AAB6C5] mt-1.5">
                  Valoriza a realização de atividades de desconexão, como leitura, exercícios, hidratação e sono sem telas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Evolution Chart */}
      <div className="p-6 rounded-2xl bg-[#192331] border border-[#202D3D]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#F5F7FA]">Evolução Semanal do Índice</h3>
            <p className="text-xs text-[#AAB6C5]">Histórico da pontuação nos últimos 7 dias</p>
          </div>
          <span className="text-xs font-semibold text-[#C7F36B]">Meta: ≥ 75 pts</span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={evolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C7F36B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C7F36B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#AAB6C5" fontSize={12} tickLine={false} />
              <YAxis stroke="#AAB6C5" fontSize={12} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#192331', 
                  borderColor: '#202D3D', 
                  borderRadius: '12px',
                  color: '#F5F7FA',
                  fontSize: '12px' 
                }}
                formatter={(val: any) => [`${val} pontos`, 'Índice']}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#C7F36B" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#balanceGrad)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Personalized Recommendations by Neko */}
      <div className="p-6 rounded-2xl bg-[#192331] border border-[#202D3D]">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#C7F36B]" />
          <h3 className="text-base font-bold text-[#F5F7FA]">Recomendações Práticas do Neko</h3>
        </div>

        <div className="space-y-3">
          {todayBalance.recommendations.map((rec, index) => (
            <div 
              key={index}
              className="p-3.5 rounded-xl bg-[#202D3D]/60 border border-[#202D3D] flex items-start gap-3"
            >
              <span className="text-[#C7F36B] font-bold text-xs mt-0.5">0{index + 1}.</span>
              <p className="text-xs text-[#F5F7FA] leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 flex justify-end">
          <button
            onClick={() => setActiveTab('challenges')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#65D6C5] hover:text-[#C7F36B] transition-colors cursor-pointer"
          >
            <span>Ver Desafios Disponíveis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mandatory Non-Medical Disclaimer */}
      <div className="p-4 rounded-xl bg-[#10151D] border border-[#202D3D] flex items-start gap-3 text-xs text-[#AAB6C5]">
        <Info className="w-4 h-4 text-[#AAB6C5] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#F5F7FA] block mb-0.5">Aviso Importante:</strong>
          O Índice de Equilíbrio Digital é uma ferramenta de autoconhecimento, autogestão e apoio à consciência de hábitos. Ele <span className="text-[#F5F7FA] underline">não constitui diagnóstico médico, psicológico ou psiquiátrico</span> e não substitui consultas com profissionais de saúde mental.
        </div>
      </div>
    </div>
  );
};
