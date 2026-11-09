import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight,
  Download
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { getTodayDateString, calculateDigitalBalanceIndex } from '../services/storage';

export const ReportsView: React.FC = () => {
  const { usageRecords, user, challenges, todayBalance } = useApp();
  const [period, setPeriod] = useState<'week' | 'day'>('week');

  const todayStr = getTodayDateString(0);
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Current 7 days metrics
  const weekRecords = usageRecords.filter(r => {
    // Within last 7 days
    const diffTime = Math.abs(new Date(todayStr).getTime() - new Date(r.date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });

  const totalMinutesWeek = weekRecords.reduce((sum, r) => sum + r.durationMinutes, 0);
  const avgDailyMinutes = Math.round(totalMinutesWeek / 7);

  // Daily evolution over 7 days
  const dailyEvolution = [-6, -5, -4, -3, -2, -1, 0].map(offset => {
    const dStr = getTodayDateString(offset);
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + offset);
    const dayLabel = daysOfWeek[dateObj.getDay()];

    const recs = usageRecords.filter(r => r.date === dStr);
    const totalMin = recs.reduce((s, r) => s + r.durationMinutes, 0);

    const completedPast = offset === 0 ? challenges.filter(c => c.isCompleted).length : Math.max(1, 2 + (offset % 2));
    const breakdown = calculateDigitalBalanceIndex(usageRecords, dStr, user.dailyScreenTimeGoalMinutes, completedPast);

    return {
      day: offset === 0 ? 'Hoje' : dayLabel,
      date: dStr,
      hours: Number((totalMin / 60).toFixed(1)),
      balanceScore: breakdown.score,
      minutes: totalMin,
    };
  });

  // Category distribution for the week
  const categoryTotals: Record<string, number> = {};
  weekRecords.forEach(r => {
    categoryTotals[r.category] = (categoryTotals[r.category] || 0) + r.durationMinutes;
  });

  const categoryNameMap: Record<string, string> = {
    social: 'Redes Sociais',
    entertainment: 'Entretenimento',
    productivity: 'Produtividade',
    study: 'Estudo/Leitura',
    communication: 'Comunicação',
    health: 'Saúde',
  };

  const categoryColorMap: Record<string, string> = {
    social: '#F28BB5',
    entertainment: '#00F2FE',
    productivity: '#65D6C5',
    study: '#C7F36B',
    communication: '#25D366',
    health: '#AAB6C5',
  };

  const categoryPieData = Object.entries(categoryTotals).map(([cat, minutes]) => ({
    name: categoryNameMap[cat] || cat,
    value: minutes,
    color: categoryColorMap[cat] || '#65D6C5',
  }));

  const completedChallengesCount = challenges.filter(c => c.isCompleted).length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#192331] border border-[#202D3D]">
        <div>
          <h2 className="text-xl font-bold text-[#F5F7FA]">Relatórios & Evolução</h2>
          <p className="text-xs text-[#AAB6C5]">
            Análise aprofundada da sua rotina digital e conquistas ao longo do tempo
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#10151D] border border-[#202D3D] rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setPeriod('week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              period === 'week'
                ? 'bg-[#202D3D] text-[#C7F36B] shadow-sm'
                : 'text-[#AAB6C5] hover:text-[#F5F7FA]'
            }`}
          >
            Visão Semanal
          </button>
          <button
            onClick={() => setPeriod('day')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              period === 'day'
                ? 'bg-[#202D3D] text-[#C7F36B] shadow-sm'
                : 'text-[#AAB6C5] hover:text-[#F5F7FA]'
            }`}
          >
            Visão Diária
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#192331] border border-[#202D3D]">
          <span className="text-[11px] font-semibold text-[#AAB6C5] block mb-1">Média Diária de Tela</span>
          <span className="text-2xl font-black text-[#F5F7FA] tabular-nums">
            {Math.floor(avgDailyMinutes / 60)}h {avgDailyMinutes % 60}m
          </span>
          <span className="text-[10px] text-[#AAB6C5] block mt-1">Últimos 7 dias avaliados</span>
        </div>

        <div className="p-4 rounded-xl bg-[#192331] border border-[#202D3D]">
          <span className="text-[11px] font-semibold text-[#AAB6C5] block mb-1">Desafios Concluídos</span>
          <span className="text-2xl font-black text-[#C7F36B] tabular-nums">
            {completedChallengesCount}
          </span>
          <span className="text-[10px] text-[#AAB6C5] block mt-1">Vitórias conscientes</span>
        </div>

        <div className="p-4 rounded-xl bg-[#192331] border border-[#202D3D]">
          <span className="text-[11px] font-semibold text-[#AAB6C5] block mb-1">Índice Médio</span>
          <span className="text-2xl font-black text-[#65D6C5] tabular-nums">
            {Math.round(dailyEvolution.reduce((a, b) => a + b.balanceScore, 0) / 7)} / 100
          </span>
          <span className="text-[10px] text-[#AAB6C5] block mt-1">Classificação equilibrada</span>
        </div>

        <div className="p-4 rounded-xl bg-[#192331] border border-[#202D3D]">
          <span className="text-[11px] font-semibold text-[#AAB6C5] block mb-1">Meta Cumprida</span>
          <span className="text-2xl font-black text-[#F28BB5] tabular-nums">
            5 de 7 dias
          </span>
          <span className="text-[10px] text-[#AAB6C5] block mt-1">Consistência notável</span>
        </div>
      </div>

      {/* Main Evolution Chart: Screen Time (Hours) */}
      <div className="p-6 rounded-2xl bg-[#192331] border border-[#202D3D]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#F5F7FA]">Evolução do Tempo de Tela</h3>
            <p className="text-xs text-[#AAB6C5]">Comparativo dia a dia com a meta diária estipulada</p>
          </div>
          <span className="text-xs text-[#AAB6C5]">
            Meta: {Math.floor(user.dailyScreenTimeGoalMinutes / 60)}h00
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyEvolution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#AAB6C5" fontSize={12} tickLine={false} />
              <YAxis stroke="#AAB6C5" fontSize={12} tickLine={false} unit="h" />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#192331', 
                  borderColor: '#202D3D', 
                  borderRadius: '12px',
                  color: '#F5F7FA',
                  fontSize: '12px' 
                }}
                formatter={(val: any) => [`${val} horas`, 'Uso de Tela']}
              />
              <Bar 
                dataKey="hours" 
                fill="#65D6C5" 
                radius={[6, 6, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Split: Digital Balance Trend & Categories Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Score Trend */}
        <div className="p-6 rounded-2xl bg-[#192331] border border-[#202D3D]">
          <h3 className="text-base font-bold text-[#F5F7FA] mb-1">Tendência do Índice de Equilíbrio</h3>
          <p className="text-xs text-[#AAB6C5] mb-4">Pontuação de bem-estar dia a dia</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyEvolution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#AAB6C5" fontSize={11} tickLine={false} />
                <YAxis stroke="#AAB6C5" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#192331', 
                    borderColor: '#202D3D', 
                    borderRadius: '12px',
                    color: '#F5F7FA',
                    fontSize: '12px' 
                  }}
                  formatter={(val: any) => [`${val} pontos`, 'Equilíbrio']}
                />
                <Area 
                  type="monotone" 
                  dataKey="balanceScore" 
                  stroke="#C7F36B" 
                  strokeWidth={2.5} 
                  fill="#C7F36B" 
                  fillOpacity={0.15} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="p-6 rounded-2xl bg-[#192331] border border-[#202D3D]">
          <h3 className="text-base font-bold text-[#F5F7FA] mb-1">Concentração da Atenção Semanal</h3>
          <p className="text-xs text-[#AAB6C5] mb-4">Proporção por categoria de aplicativo</p>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#192331', 
                    borderColor: '#202D3D', 
                    borderRadius: '12px',
                    color: '#F5F7FA',
                    fontSize: '12px' 
                  }}
                  formatter={(val: any) => [`${Math.floor(Number(val) / 60)}h ${Number(val) % 60}m`, 'Tempo']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
