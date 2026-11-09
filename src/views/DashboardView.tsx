import React from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  Flame, 
  Sparkles, 
  ArrowUpRight, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Plus, 
  Info,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import { useApp } from '../context/AppContext';
import { NekoMascot } from '../components/NekoMascot';
import { NekoTips } from '../components/NekoTips';
import { getTodayDateString } from '../services/storage';

export const DashboardView: React.FC = () => {
  const { 
    user, 
    streak, 
    totalXP, 
    currentLevel, 
    levelTitle, 
    levelProgressPercent,
    todayBalance,
    usageRecords,
    challenges,
    toggleChallengeComplete,
    startFocusTimer,
    setIsLogModalOpen,
    setActiveTab,
    setEditingRecord,
    triggerTestLevelUp,
    triggerTestGoal,
    setMascotToast,
  } = useApp();

  const today = getTodayDateString(0);
  const todayRecords = usageRecords.filter(r => r.date === today);

  const totalMinutesToday = todayRecords.reduce((sum, r) => sum + r.durationMinutes, 0);
  const hoursToday = Math.floor(totalMinutesToday / 60);
  const minsToday = totalMinutesToday % 60;

  const goalMinutes = user.dailyScreenTimeGoalMinutes;
  const goalHours = Math.floor(goalMinutes / 60);
  const goalMins = goalMinutes % 60;

  const goalRatio = totalMinutesToday > 0 ? (totalMinutesToday / goalMinutes) * 100 : 0;
  const isOverGoal = totalMinutesToday > goalMinutes;

  // Most used apps ranking for today
  const sortedApps = [...todayRecords].sort((a, b) => b.durationMinutes - a.durationMinutes);

  // Category distribution for pie chart
  const categoryTotals: Record<string, number> = {};
  todayRecords.forEach(r => {
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

  const pieData = Object.entries(categoryTotals).map(([cat, minutes]) => ({
    name: categoryNameMap[cat] || cat,
    value: minutes,
    color: categoryColorMap[cat] || '#65D6C5',
  }));

  // Daily challenge highlight (find first uncompleted daily challenge)
  const dailyChallenge = challenges.find(c => c.isDaily && !c.isCompleted) || challenges[0];

  // Neko mascot mood & motivational phrase based on balance score
  let nekoMood: 'happy' | 'motivated' | 'thinking' | 'celebrating' | 'zen' = 'happy';
  let nekoSpeech = 'Cada minuto desconectado é um minuto a mais para viver seus sonhos reais.';

  if (todayBalance.score >= 85) {
    nekoMood = 'celebrating';
    nekoSpeech = 'Equilíbrio exemplar hoje! Você está aproveitando a tecnologia sem perder a presença.';
  } else if (todayBalance.score >= 70) {
    nekoMood = 'motivated';
    nekoSpeech = 'Ótimo ritmo! Mantenha a atenção nas pausas e respire fundo longe das telas.';
  } else if (isOverGoal) {
    nekoMood = 'thinking';
    nekoSpeech = 'Você atingiu o tempo planejado hoje. Que tal fechar os apps e ler um bom livro?';
  }

  // Last 7 days usage mini bar data
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const barData = [-6, -5, -4, -3, -2, -1, 0].map(offset => {
    const dStr = getTodayDateString(offset);
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + offset);
    const dayLabel = daysOfWeek[dateObj.getDay()];
    
    const minutes = usageRecords
      .filter(r => r.date === dStr)
      .reduce((sum, r) => sum + r.durationMinutes, 0);

    return {
      day: offset === 0 ? 'Hoje' : dayLabel,
      hours: Number((minutes / 60).toFixed(1)),
      minutes,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Academic Demo Notice */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between p-3.5 rounded-2xl bg-[#192331] border border-[#C7F36B]/20 text-xs text-[#AAB6C5]"
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#C7F36B] shrink-0" />
          <span>
            <strong className="text-[#F5F7FA]">Modo Avaliação Acadêmica:</strong> Dados demonstrativos ativos (5h05 de uso inicial, Instagram 2h15, TikTok 1h40). Você pode registrar, editar e concluir desafios normalmente.
          </span>
        </div>
        <button
          onClick={() => {
            setEditingRecord(null);
            setIsLogModalOpen(true);
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C7F36B] text-[#10151D] font-bold text-xs hover:bg-[#b8eb52] transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Novo Registro</span>
        </button>
      </motion.div>

      {/* NekoTips: Contextual Motivational Phrase & Digital Stress Card */}
      <NekoTips />

      {/* Hero Welcome Card with Mascot */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-[#192331] border border-[#202D3D] p-6 lg:p-8"
      >
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-[#C7F36B]/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="shrink-0 flex flex-col items-center">
            <NekoMascot 
              size="lg" 
              mood={nekoMood} 
              showAura={true}
              onClick={() => {
                triggerTestGoal();
              }}
            />
            <span className="text-[10px] text-[#AAB6C5] mt-1 font-medium hover:text-[#C7F36B] transition-colors cursor-pointer">
              Toque no Neko ✨
            </span>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#202D3D] text-[#C7F36B] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nível {currentLevel} · {levelTitle}</span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
              Olá, {user.name}!
            </h2>

            <p className="text-sm text-[#AAB6C5] max-w-xl leading-relaxed">
              "{nekoSpeech}"
            </p>

            {/* Level XP Progress Bar */}
            <div className="pt-2 max-w-md">
              <div className="flex justify-between text-xs text-[#AAB6C5] mb-1 font-medium">
                <span>Progresso do Nível</span>
                <span className="tabular-nums text-[#C7F36B] font-semibold">{totalXP} XP</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#202D3D] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#65D6C5] to-[#C7F36B] rounded-full transition-all duration-500"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Interactive Reactions Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-2 justify-center md:justify-start">
              <button
                type="button"
                onClick={triggerTestGoal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#202D3D] hover:bg-[#26364a] text-xs font-semibold text-[#00E5FF] border border-[#00E5FF]/30 hover:border-[#00E5FF] transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Simular Meta Batida</span>
              </button>

              <button
                type="button"
                onClick={triggerTestLevelUp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#202D3D] hover:bg-[#26364a] text-xs font-semibold text-[#C7F36B] border border-[#C7F36B]/30 hover:border-[#C7F36B] transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simular Subir de Nível</span>
              </button>
            </div>
          </div>

          {/* Quick Streak Box */}
          <div className="shrink-0 flex md:flex-col items-center gap-3 p-4 rounded-2xl bg-[#202D3D]/60 border border-[#202D3D]">
            <div className="w-12 h-12 rounded-xl bg-[#10151D] flex items-center justify-center text-[#F28BB5]">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-[#F5F7FA] tabular-nums">{streak} dias</span>
              <span className="text-[11px] text-[#AAB6C5]">Sequência Ativa</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metric Cards Grid (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Screen Time Today vs Goal */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="p-5 rounded-2xl bg-[#192331] border border-[#202D3D] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#AAB6C5] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#65D6C5]" />
              Tempo de Tela Hoje
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#202D3D] text-[#AAB6C5]">
              Meta: {goalHours}h{goalMins > 0 ? `${goalMins}m` : ''}
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#F5F7FA] tabular-nums">
                {hoursToday}h {minsToday < 10 ? `0${minsToday}` : minsToday}m
              </span>
              <span className={`text-xs font-semibold ${isOverGoal ? 'text-[#F28BB5]' : 'text-[#65D6C5]'}`}>
                {isOverGoal ? 'Acima da meta' : 'Dentro do limite'}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="pt-2">
            <div className="w-full h-2 rounded-full bg-[#202D3D] overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverGoal ? 'bg-[#F28BB5]' : 'bg-[#65D6C5]'
                }`}
                style={{ width: `${Math.min(100, goalRatio)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#AAB6C5] mt-1.5">
              <span>{Math.round(goalRatio)}% do limite diário</span>
              <button 
                onClick={() => setActiveTab('screen-time')}
                className="text-[#65D6C5] hover:underline cursor-pointer"
              >
                Detalhes
              </button>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Digital Balance Index */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setActiveTab('balance')}
          className="p-5 rounded-2xl bg-[#192331] border border-[#202D3D] hover:border-[#C7F36B]/50 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#AAB6C5] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#C7F36B]" />
              Índice de Equilíbrio
            </span>
            <ArrowUpRight className="w-4 h-4 text-[#AAB6C5] group-hover:text-[#C7F36B] transition-colors" />
          </div>

          <div className="flex items-center gap-4 my-2">
            {/* Circular mini gauge */}
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="23" stroke="#202D3D" strokeWidth="4" fill="none" />
                <circle 
                  cx="28" 
                  cy="28" 
                  r="23" 
                  stroke="#C7F36B" 
                  strokeWidth="4" 
                  strokeDasharray={2 * Math.PI * 23} 
                  strokeDashoffset={(2 * Math.PI * 23) * (1 - todayBalance.score / 100)} 
                  strokeLinecap="round" 
                  fill="none" 
                />
              </svg>
              <span className="absolute text-sm font-bold text-[#F5F7FA] tabular-nums">
                {todayBalance.score}
              </span>
            </div>

            <div>
              <span className="text-lg font-bold text-[#F5F7FA] block leading-tight">
                {todayBalance.classification}
              </span>
              <span className="text-[11px] text-[#AAB6C5]">
                Pontuação de 0 a 100
              </span>
            </div>
          </div>

          <div className="text-[11px] text-[#AAB6C5] border-t border-[#202D3D] pt-2 flex items-center justify-between">
            <span>Metas + Categorias + Hábitos</span>
            <span className="text-[#C7F36B] font-medium">Ver metodologia →</span>
          </div>
        </motion.div>

        {/* Card 3: Active Daily Challenge Quick Box */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.30, ease: [0.16, 1, 0.3, 1] }}
          className="p-5 rounded-2xl bg-[#192331] border border-[#202D3D] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#AAB6C5] flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#F28BB5]" />
              Desafio Diário Recomendado
            </span>
            <span className="text-[11px] font-semibold text-[#C7F36B]">+{dailyChallenge?.xpReward || 30} XP</span>
          </div>

          <div className="my-1">
            <h4 className="text-sm font-bold text-[#F5F7FA] line-clamp-1">
              {dailyChallenge?.name || 'Ler por 20 minutos'}
            </h4>
            <p className="text-xs text-[#AAB6C5] line-clamp-2 mt-0.5 leading-relaxed">
              {dailyChallenge?.description || 'Dedique um momento longe das telas.'}
            </p>
          </div>

          <div className="pt-2 flex items-center gap-2">
            {dailyChallenge?.isCompleted ? (
              <div className="flex items-center gap-1.5 text-xs text-[#C7F36B] font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Desafio concluído hoje!</span>
              </div>
            ) : (
              <>
                <button
                  onClick={() => startFocusTimer(dailyChallenge)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#C7F36B] text-[#10151D] text-xs font-bold hover:bg-[#b8eb52] transition-colors cursor-pointer text-center"
                >
                  Iniciar Foco
                </button>
                <button
                  onClick={() => toggleChallengeComplete(dailyChallenge.id)}
                  className="py-2 px-3 rounded-xl bg-[#202D3D] hover:bg-[#26364a] text-xs text-[#F5F7FA] font-medium transition-colors cursor-pointer"
                  title="Marcar como concluído"
                >
                  Concluir
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Main Charts Split Section: Weekly Usage & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Bar Chart (2 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.52, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2 p-6 rounded-2xl bg-[#192331] border border-[#202D3D]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-[#F5F7FA]">Utilização dos Últimos 7 Dias</h3>
              <p className="text-xs text-[#AAB6C5]">Acompanhamento da evolução diária do tempo de tela</p>
            </div>
            <button 
              onClick={() => setActiveTab('reports')}
              className="text-xs text-[#65D6C5] hover:underline cursor-pointer font-medium"
            >
              Relatório Completo →
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="day" 
                  stroke="#AAB6C5" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={{ stroke: '#202D3D' }} 
                />
                <YAxis 
                  stroke="#AAB6C5" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={{ stroke: '#202D3D' }} 
                  unit="h"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#192331', 
                    borderColor: '#202D3D', 
                    borderRadius: '12px',
                    color: '#F5F7FA',
                    fontSize: '12px' 
                  }}
                  formatter={(value: any) => [`${value} horas`, 'Tempo']}
                />
                <Bar 
                  dataKey="hours" 
                  fill="#65D6C5" 
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Pie / Donut Chart (1 col) */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.52, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 rounded-2xl bg-[#192331] border border-[#202D3D] flex flex-col justify-between"
        >
          <div>
            <h3 className="text-base font-bold text-[#F5F7FA] mb-1">Distribuição por Categoria</h3>
            <p className="text-xs text-[#AAB6C5]">Onde sua atenção esteve hoje</p>
          </div>

          <div className="h-44 w-full my-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#192331', 
                    borderColor: '#202D3D', 
                    borderRadius: '10px',
                    color: '#F5F7FA',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${Math.floor(Number(val) / 60)}h ${Number(val) % 60}m`, 'Uso']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {pieData.slice(0, 3).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[#AAB6C5]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="truncate max-w-[130px]">{item.name}</span>
                </div>
                <span className="font-semibold text-[#F5F7FA] tabular-nums">
                  {Math.floor(item.value / 60)}h {item.value % 60}m
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Most Used Apps Today - Detailed List */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.52, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
        className="p-6 rounded-2xl bg-[#192331] border border-[#202D3D]"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#F5F7FA]">Aplicativos Mais Utilizados Hoje</h3>
            <p className="text-xs text-[#AAB6C5]">Dados demonstrativos iniciais: Instagram (2h15), TikTok (1h40), YouTube (1h10)</p>
          </div>
          <button
            onClick={() => setActiveTab('screen-time')}
            className="text-xs font-semibold text-[#C7F36B] hover:underline cursor-pointer"
          >
            Gerenciar Registros →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sortedApps.slice(0, 3).map((app, index) => {
            const h = Math.floor(app.durationMinutes / 60);
            const m = app.durationMinutes % 60;
            const pct = Math.round((app.durationMinutes / totalMinutesToday) * 100);

            return (
              <div 
                key={app.id}
                className="p-4 rounded-xl bg-[#202D3D]/60 border border-[#202D3D] hover:border-[#65D6C5]/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                      style={{ backgroundColor: app.color || '#65D6C5' }}
                    >
                      {app.appName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#F5F7FA]">{app.appName}</h4>
                      <span className="text-[10px] text-[#AAB6C5] capitalize">{app.category}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#F5F7FA] tabular-nums">
                    #{index + 1}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-3 text-xs">
                  <span className="text-[#AAB6C5]">Tempo:</span>
                  <span className="text-sm font-bold text-[#C7F36B] tabular-nums">
                    {h}h {m < 10 ? `0${m}` : m}m
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#10151D] mt-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${pct}%`,
                      backgroundColor: app.color || '#65D6C5' 
                    }}
                  />
                </div>
                <div className="text-[10px] text-right text-[#AAB6C5] mt-1">
                  {pct}% do tempo total
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
