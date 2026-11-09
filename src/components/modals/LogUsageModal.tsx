import React, { useState, useEffect } from 'react';
import { X, Clock, Check, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppCategory } from '../../types';
import { getTodayDateString } from '../../services/storage';

const APP_PRESETS: { name: string; category: AppCategory; color: string }[] = [
  { name: 'Instagram', category: 'social', color: '#E1306C' },
  { name: 'TikTok', category: 'social', color: '#00F2FE' },
  { name: 'YouTube', category: 'entertainment', color: '#FF0000' },
  { name: 'WhatsApp', category: 'communication', color: '#25D366' },
  { name: 'Netflix', category: 'entertainment', color: '#E50914' },
  { name: 'X / Twitter', category: 'social', color: '#1DA1F2' },
  { name: 'Notion', category: 'productivity', color: '#65D6C5' },
  { name: 'Duolingo', category: 'study', color: '#58CC02' },
  { name: 'Spotify', category: 'entertainment', color: '#1DB954' },
  { name: 'Kindle', category: 'study', color: '#FF9900' },
];

const CATEGORY_LABELS: Record<AppCategory, { label: string; color: string }> = {
  social: { label: 'Redes Sociais', color: '#F28BB5' },
  entertainment: { label: 'Entretenimento', color: '#00F2FE' },
  productivity: { label: 'Produtividade', color: '#65D6C5' },
  study: { label: 'Estudo & Leitura', color: '#C7F36B' },
  communication: { label: 'Comunicação', color: '#25D366' },
  health: { label: 'Saúde & Bem-estar', color: '#AAB6C5' },
};

export const LogUsageModal: React.FC = () => {
  const { 
    isLogModalOpen, 
    setIsLogModalOpen, 
    editingRecord, 
    setEditingRecord, 
    addUsageRecord, 
    updateUsageRecord 
  } = useApp();

  const [appName, setAppName] = useState('');
  const [category, setCategory] = useState<AppCategory>('social');
  const [hours, setHours] = useState('1');
  const [minutes, setMinutes] = useState('30');
  const [date, setDate] = useState(getTodayDateString(0));
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingRecord) {
      setAppName(editingRecord.appName);
      setCategory(editingRecord.category);
      const h = Math.floor(editingRecord.durationMinutes / 60);
      const m = editingRecord.durationMinutes % 60;
      setHours(h.toString());
      setMinutes(m.toString());
      setDate(editingRecord.date);
      setNotes(editingRecord.notes || '');
    } else {
      setAppName('');
      setCategory('social');
      setHours('1');
      setMinutes('00');
      setDate(getTodayDateString(0));
      setNotes('');
    }
    setError(null);
  }, [editingRecord, isLogModalOpen]);

  if (!isLogModalOpen) return null;

  const handleSelectPreset = (preset: typeof APP_PRESETS[0]) => {
    setAppName(preset.name);
    setCategory(preset.category);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim()) {
      setError('Por favor, informe o nome do aplicativo.');
      return;
    }

    const totalMin = parseInt(hours || '0', 10) * 60 + parseInt(minutes || '0', 10);
    if (isNaN(totalMin) || totalMin <= 0) {
      setError('A duração deve ser superior a 0 minutos.');
      return;
    }

    if (totalMin > 1440) {
      setError('A duração não pode exceder 24 horas no mesmo dia.');
      return;
    }

    const matchedPreset = APP_PRESETS.find(p => p.name.toLowerCase() === appName.trim().toLowerCase());
    const chosenColor = matchedPreset ? matchedPreset.color : '#65D6C5';

    if (editingRecord) {
      updateUsageRecord(editingRecord.id, {
        appName: appName.trim(),
        category,
        durationMinutes: totalMin,
        date,
        notes: notes.trim() || undefined,
        color: chosenColor,
      });
    } else {
      addUsageRecord({
        appName: appName.trim(),
        category,
        durationMinutes: totalMin,
        date,
        notes: notes.trim() || undefined,
        color: chosenColor,
        isDemonstrative: false,
      });
    }

    setIsLogModalOpen(false);
    setEditingRecord(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#192331] border border-[#202D3D] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#202D3D]">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#C7F36B]" />
            <h2 className="text-lg font-bold text-[#F5F7FA]">
              {editingRecord ? 'Editar Registro de Tempo' : 'Registrar Tempo de Tela'}
            </h2>
          </div>
          <button
            onClick={() => {
              setIsLogModalOpen(false);
              setEditingRecord(null);
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#AAB6C5] hover:text-[#F5F7FA] hover:bg-[#202D3D] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-[#AAB6C5] uppercase tracking-wider mb-2">
              Aplicativos Rápidos
            </label>
            <div className="flex flex-wrap gap-1.5">
              {APP_PRESETS.map((preset) => {
                const isSelected = appName.toLowerCase() === preset.name.toLowerCase();
                return (
                  <button
                    type="button"
                    key={preset.name}
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#C7F36B] text-[#10151D] font-semibold'
                        : 'bg-[#202D3D] text-[#AAB6C5] hover:text-[#F5F7FA] hover:bg-[#26364a]'
                    }`}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* App Name */}
          <div>
            <label className="block text-xs font-semibold text-[#AAB6C5] uppercase tracking-wider mb-1.5">
              Nome do Aplicativo
            </label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="Ex: Instagram, TikTok, Visual Studio Code..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#10151D] border border-[#202D3D] text-[#F5F7FA] text-sm focus:outline-none focus:border-[#C7F36B] transition-colors placeholder:text-[#AAB6C5]/50"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-[#AAB6C5] uppercase tracking-wider mb-1.5">
              Categoria
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(CATEGORY_LABELS) as AppCategory[]).map((catKey) => {
                const isSelected = category === catKey;
                const info = CATEGORY_LABELS[catKey];
                return (
                  <button
                    type="button"
                    key={catKey}
                    onClick={() => setCategory(catKey)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#202D3D] border-[#C7F36B] text-[#F5F7FA]'
                        : 'bg-[#10151D] border-[#202D3D] text-[#AAB6C5] hover:border-[#2a3c52]'
                    }`}
                  >
                    <div 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: info.color }} 
                    />
                    <span className="truncate">{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration: Hours & Minutes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#AAB6C5] uppercase tracking-wider mb-1.5">
                Horas
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10151D] border border-[#202D3D] text-[#F5F7FA] text-sm focus:outline-none focus:border-[#C7F36B] tabular-nums"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-[#AAB6C5] pointer-events-none">h</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AAB6C5] uppercase tracking-wider mb-1.5">
                Minutos
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="59"
                  step="5"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10151D] border border-[#202D3D] text-[#F5F7FA] text-sm focus:outline-none focus:border-[#C7F36B] tabular-nums"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-[#AAB6C5] pointer-events-none">min</span>
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-[#AAB6C5] uppercase tracking-wider mb-1.5">
              Data de Utilização
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#10151D] border border-[#202D3D] text-[#F5F7FA] text-sm focus:outline-none focus:border-[#C7F36B]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#AAB6C5] uppercase tracking-wider mb-1.5">
              Observações (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Trabalho, estudo de programação, rolagem passiva..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#10151D] border border-[#202D3D] text-[#F5F7FA] text-sm focus:outline-none focus:border-[#C7F36B] placeholder:text-[#AAB6C5]/50"
            />
          </div>

          {/* Informative Note */}
          <div className="p-3 rounded-xl bg-[#10151D]/60 border border-[#202D3D] text-[11px] text-[#AAB6C5]">
            💡 <strong className="text-[#F5F7FA]">Transparência NEKO:</strong> Como aplicação web, o registro é consciente e manual. Em versões nativas mobile futuras, a sincronização poderá ser integrada às APIs de Bem-Estar do sistema com a permissão do usuário.
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => {
                setIsLogModalOpen(false);
                setEditingRecord(null);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#AAB6C5] hover:text-[#F5F7FA] hover:bg-[#202D3D] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C7F36B] text-[#10151D] text-xs font-bold shadow-md hover:bg-[#b8eb52] transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{editingRecord ? 'Atualizar Registro' : 'Salvar Registro'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
