import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  Calendar, 
  Filter, 
  TrendingDown, 
  TrendingUp, 
  Info,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  Cell
} from 'recharts';
import { useApp } from '../context/AppContext';
import { AppUsageRecord, AppCategory } from '../types';
import { getTodayDateString } from '../services/storage';

export const ScreenTimeView: React.FC = () => {
  const { 
    usageRecords, 
    deleteUsageRecord, 
    setIsLogModalOpen, 
    setEditingRecord,
    user 
  } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString(0));
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const todayStr = getTodayDateString(0);
  const yesterdayStr = getTodayDateString(-1);

  // Filter records for selected date
  const dateRecords = usageRecords.filter(r => {
    const matchesDate = r.date === selectedDate;
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
    return matchesDate && matchesCategory;
  });

  // Calculate totals
  const totalMinutesForSelectedDate = dateRecords.reduce((acc, r) => acc + r.durationMinutes, 0);
  const hours = Math.floor(totalMinutesForSelectedDate / 60);
  const mins = totalMinutesForSelectedDate % 60;

  // Compare with yesterday
  const yesterdayMinutes = usageRecords
    .filter(r => r.date === yesterdayStr)
    .reduce((acc, r) => acc + r.durationMinutes, 0);

  const diffMinutes = totalMinutesForSelectedDate - yesterdayMinutes;
  const isLess = diffMinutes < 0;

  // Chart data for selected date (App by App)
  const appChartData = dateRecords.map(r => ({
    name: r.appName,
    hours: Number((r.durationMinutes / 60).toFixed(1)),
    minutes: r.durationMinutes,
    color: r.color || '#65D6C5',
    category: r.category,
  })).sort((a, b) => b.minutes - a.minutes);

  const handleEdit = (rec: AppUsageRecord) => {
    setEditingRecord(rec);
    setIsLogModalOpen(true);
  };

  const handleCreate = () => {
    setEditingRecord(null);
    setIsLogModalOpen(true);
  };

  const shiftDate = (delta: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#192331] border border-[#202D3D]">
        <div>
          <h2 className="text-xl font-bold text-[#F5F7FA]">Monitoramento de Tempo</h2>
          <p className="text-xs text-[#AAB6C5]">
            Acompanhe a sua atenção digital e gerencie seus registros diários
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#C7F36B] text-[#10151D] text-xs font-bold shadow-md hover:bg-[#b8eb52] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Cadastrar Aplicativo</span>
        </button>
      </div>

      {/* Web App Architecture Notice */}
      <div className="p-4 rounded-xl bg-[#192331]/80 border border-[#202D3D] flex items-start gap-3 text-xs text-[#AAB6C5]">
        <Info className="w-4 h-4 text-[#65D6C5] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-[#F5F7FA] font-semibold">
            Nota de Arquitetura & Demonstração Web:
          </p>
          <p>
            Por se tratar de uma aplicação web em ambiente seguro de navegador, os registros são feitos de forma consciente e manual pelo usuário ou preenchidos com dados demonstrativos para estudo. O sistema já foi estruturado com camada de serviços desacoplada para suportar futura integração com APIs nativas de monitoramento (como Digital Wellbeing no Android ou Screen Time no iOS), mediante concessão de permissões explícitas.
          </p>
        </div>
      </div>

      {/* Date Selector & Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Date Navigator Card */}
        <div className="p-5 rounded-2xl bg-[#192331] border border-[#202D3D] flex flex-col justify-between">
          <span className="text-xs font-semibold text-[#AAB6C5]">Data Selecionada</span>
          
          <div className="flex items-center justify-between my-2">
            <button
              onClick={() => shiftDate(-1)}
              className="w-8 h-8 rounded-lg bg-[#202D3D] hover:bg-[#26364a] text-[#F5F7FA] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="text-base font-bold text-[#F5F7FA] block">
                {selectedDate === todayStr ? 'Hoje' : selectedDate === yesterdayStr ? 'Ontem' : selectedDate}
              </span>
              <span className="text-[11px] text-[#AAB6C5]">{selectedDate}</span>
            </div>

            <button
              onClick={() => shiftDate(1)}
              className="w-8 h-8 rounded-lg bg-[#202D3D] hover:bg-[#26364a] text-[#F5F7FA] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-right">
            {selectedDate !== todayStr && (
              <button 
                onClick={() => setSelectedDate(todayStr)}
                className="text-xs text-[#C7F36B] hover:underline cursor-pointer"
              >
                Voltar para Hoje
              </button>
            )}
          </div>
        </div>

        {/* Total Screen Time for Day */}
        <div className="p-5 rounded-2xl bg-[#192331] border border-[#202D3D] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#AAB6C5]">Tempo Total Registrado</span>
            <Clock className="w-4 h-4 text-[#65D6C5]" />
          </div>

          <div className="my-2">
            <span className="text-3xl font-extrabold text-[#F5F7FA] tabular-nums">
              {hours}h {mins < 10 ? `0${mins}` : mins}m
            </span>
            <span className="block text-[11px] text-[#AAB6C5] mt-1">
              Meta estipulada: {Math.floor(user.dailyScreenTimeGoalMinutes / 60)}h00
            </span>
          </div>

          <div className="text-[11px] text-[#AAB6C5]">
            {dateRecords.length} aplicativo(s) registrado(s)
          </div>
        </div>

        {/* Comparison with Yesterday */}
        <div className="p-5 rounded-2xl bg-[#192331] border border-[#202D3D] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#AAB6C5]">Comparação com Ontem</span>
            {isLess ? (
              <TrendingDown className="w-4 h-4 text-[#65D6C5]" />
            ) : (
              <TrendingUp className="w-4 h-4 text-[#F28BB5]" />
            )}
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold tabular-nums ${isLess ? 'text-[#65D6C5]' : 'text-[#F28BB5]'}`}>
                {isLess ? '-' : '+'}{Math.abs(Math.floor(diffMinutes / 60))}h {Math.abs(diffMinutes % 60)}m
              </span>
            </div>
            <span className="text-[11px] text-[#AAB6C5]">
              {isLess ? 'Redução positiva no tempo de tela!' : 'Aumento em relação ao dia anterior'}
            </span>
          </div>

          <div className="text-[11px] text-[#AAB6C5]">
            Ontem: {Math.floor(yesterdayMinutes / 60)}h {yesterdayMinutes % 60}m
          </div>
        </div>
      </div>

      {/* Usage Chart for Date */}
      {appChartData.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#192331] border border-[#202D3D]">
          <h3 className="text-base font-bold text-[#F5F7FA] mb-1">
            Tempo por Aplicativo em {selectedDate}
          </h3>
          <p className="text-xs text-[#AAB6C5] mb-5">
            Distribuição detalhada das horas dedicadas a cada app
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appChartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" stroke="#AAB6C5" fontSize={11} unit="h" />
                <YAxis dataKey="name" type="category" stroke="#AAB6C5" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#192331', 
                    borderColor: '#202D3D', 
                    borderRadius: '12px',
                    color: '#F5F7FA',
                    fontSize: '12px' 
                  }}
                  formatter={(val: any) => [`${val} horas`, 'Uso']}
                />
                <Bar dataKey="hours" radius={[0, 6, 6, 0]}>
                  {appChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filter and Records List */}
      <div className="p-6 rounded-2xl bg-[#192331] border border-[#202D3D]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-[#F5F7FA]">Registros de Utilização</h3>
            <p className="text-xs text-[#AAB6C5]">Edite ou remova registros conforme sua necessidade</p>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'social', label: 'Sociais' },
              { id: 'entertainment', label: 'Entretenimento' },
              { id: 'productivity', label: 'Produtividade' },
              { id: 'study', label: 'Estudos' },
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setCategoryFilter(filter.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  categoryFilter === filter.id
                    ? 'bg-[#C7F36B] text-[#10151D] font-bold'
                    : 'bg-[#202D3D] text-[#AAB6C5] hover:text-[#F5F7FA]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {dateRecords.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#202D3D] rounded-2xl">
            <Clock className="w-10 h-10 text-[#AAB6C5] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-[#F5F7FA]">Nenhum registro para esta data</p>
            <p className="text-xs text-[#AAB6C5] mt-1 max-w-sm mx-auto">
              Clique no botão abaixo para adicionar um registro manual de tempo ou selecione outra data.
            </p>
            <button
              onClick={handleCreate}
              className="mt-4 px-4 py-2 rounded-xl bg-[#202D3D] text-xs font-semibold text-[#C7F36B] hover:bg-[#26364a] transition-colors cursor-pointer"
            >
              + Adicionar Registro
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {dateRecords.map((record) => {
              const h = Math.floor(record.durationMinutes / 60);
              const m = record.durationMinutes % 60;

              return (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#202D3D]/60 border border-[#202D3D] hover:border-[#65D6C5]/40 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0"
                      style={{ backgroundColor: record.color || '#65D6C5' }}
                    >
                      {record.appName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#F5F7FA] truncate">{record.appName}</h4>
                        {record.isDemonstrative && (
                          <span className="text-[10px] text-[#AAB6C5] opacity-75">
                            · Demo
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#AAB6C5] mt-0.5">
                        <span className="capitalize">{record.category}</span>
                        {record.notes && (
                          <>
                            <span>·</span>
                            <span className="truncate italic">"{record.notes}"</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-base font-bold text-[#F5F7FA] tabular-nums block">
                        {h}h {m < 10 ? `0${m}` : m}m
                      </span>
                      <span className="text-[10px] text-[#AAB6C5]">
                        {record.durationMinutes} minutos
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(record)}
                        title="Editar registro"
                        className="w-8 h-8 rounded-lg bg-[#202D3D] hover:bg-[#26364a] text-[#AAB6C5] hover:text-[#65D6C5] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteUsageRecord(record.id)}
                        title="Excluir registro"
                        className="w-8 h-8 rounded-lg bg-[#202D3D] hover:bg-rose-500/20 text-[#AAB6C5] hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
