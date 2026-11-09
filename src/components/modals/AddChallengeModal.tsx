import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChallengeCategory } from '../../types';

export const AddChallengeModal: React.FC = () => {
  const { isAddChallengeOpen, setIsAddChallengeOpen, addChallenge } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ChallengeCategory>('offline');
  const [estimatedMinutes, setEstimatedMinutes] = useState('25');
  const [isDaily, setIsDaily] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!isAddChallengeOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe um título para o hábito/desafio.');
      return;
    }

    const minutes = parseInt(estimatedMinutes, 10);
    if (isNaN(minutes) || minutes <= 0) {
      setError('O tempo estimado deve ser maior que 0 minutos.');
      return;
    }

    // Dynamic XP formula based on time commitment: ~1 to 1.5 XP per minute, max 50
    const xpReward = Math.min(60, Math.max(20, Math.round(minutes * 1.2)));

    addChallenge({
      name: name.trim(),
      description: description.trim() || 'Hábito consciente cultivado pelo usuário.',
      category,
      estimatedMinutes: minutes,
      xpReward,
      isDaily,
    });

    setIsAddChallengeOpen(false);
    setName('');
    setDescription('');
    setError(null);
  };

  const categories: { key: ChallengeCategory; label: string }[] = [
    { key: 'offline', label: 'Offline / Vida Real' },
    { key: 'focus', label: 'Foco Profundo' },
    { key: 'health', label: 'Saúde & Sono' },
    { key: 'social', label: 'Social & Conexões' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#192331] border border-[#202D3D] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#202D3D]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C7F36B]" />
            <h2 className="text-lg font-bold text-[#F5F7FA]">Criar Novo Hábito</h2>
          </div>
          <button
            onClick={() => setIsAddChallengeOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#AAB6C5] hover:text-[#F5F7FA] hover:bg-[#202D3D] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#AAB6C5] uppercase tracking-wider mb-1.5">
              Nome do Desafio / Hábito
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Meditação matinal, Caminhada no parque..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#10151D] border border-[#202D3D] text-[#F5F7FA] text-sm focus:outline-none focus:border-[#C7F36B] placeholder:text-[#AAB6C5]/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AAB6C5] uppercase tracking-wider mb-1.5">
              Descrição ou Intenção
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="O que você espera sentir ou realizar durante este tempo?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#10151D] border border-[#202D3D] text-[#F5F7FA] text-sm focus:outline-none focus:border-[#C7F36B] resize-none placeholder:text-[#AAB6C5]/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#AAB6C5] uppercase tracking-wider mb-1.5">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ChallengeCategory)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#10151D] border border-[#202D3D] text-[#F5F7FA] text-xs focus:outline-none focus:border-[#C7F36B]"
              >
                {categories.map(c => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AAB6C5] uppercase tracking-wider mb-1.5">
                Tempo Estimado
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="300"
                  step="5"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#10151D] border border-[#202D3D] text-[#F5F7FA] text-xs focus:outline-none focus:border-[#C7F36B] tabular-nums"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#AAB6C5] pointer-events-none">min</span>
              </div>
            </div>
          </div>

          {/* Daily vs Weekly */}
          <div className="flex items-center gap-3 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#F5F7FA]">
              <input
                type="checkbox"
                checked={isDaily}
                onChange={(e) => setIsDaily(e.target.checked)}
                className="w-4 h-4 rounded border-[#202D3D] accent-[#C7F36B] text-[#10151D] cursor-pointer"
              />
              <span>Repetir diariamente na rotina</span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#202D3D]">
            <button
              type="button"
              onClick={() => setIsAddChallengeOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#AAB6C5] hover:text-[#F5F7FA] hover:bg-[#202D3D] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C7F36B] text-[#10151D] text-xs font-bold shadow-md hover:bg-[#b8eb52] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Adicionar Hábito</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
