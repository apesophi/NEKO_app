import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Target, 
  Bell, 
  Moon, 
  Shield, 
  LogOut, 
  RotateCcw, 
  Download, 
  Check, 
  Save, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storage';
import { NekoMascot } from '../components/NekoMascot';

export const ProfileView: React.FC = () => {
  const { user, updateUser, logout, resetDemoData, setMascotToast } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);
  const [screenGoalHours, setScreenGoalHours] = useState(Math.floor(user.dailyScreenTimeGoalMinutes / 60).toString());
  const [socialLimitMins, setSocialLimitMins] = useState(user.maxSocialMediaMinutes.toString());
  const [offlineGoalMins, setOfflineGoalMins] = useState(user.dailyOfflineGoalMinutes.toString());
  const [avatar, setAvatar] = useState(user.avatar);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const goalMin = parseInt(screenGoalHours, 10) * 60;
    const socialMin = parseInt(socialLimitMins, 10);
    const offMin = parseInt(offlineGoalMins, 10);

    updateUser({
      name: name.trim(),
      email: email.trim(),
      bio: bio.trim(),
      avatar,
      dailyScreenTimeGoalMinutes: isNaN(goalMin) ? 240 : goalMin,
      maxSocialMediaMinutes: isNaN(socialMin) ? 90 : socialMin,
      dailyOfflineGoalMinutes: isNaN(offMin) ? 60 : offMin,
    });

    setSavedSuccess(true);
    setMascotToast('Metas e perfil atualizados com sucesso!');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDownloadBackup = () => {
    const jsonStr = storageService.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neko-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMascotToast('Backup exportado com sucesso.');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#192331] border border-[#202D3D]">
        <h2 className="text-xl font-bold text-[#F5F7FA]">Perfil & Configurações</h2>
        <p className="text-xs text-[#AAB6C5]">
          Gerencie seus dados pessoais, personalize suas metas diárias e configure preferências
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#C7F36B] text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Alterações salvas com sucesso no armazenamento local!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Card & Avatar Selection */}
        <div className="p-6 rounded-2xl bg-[#192331] border border-[#202D3D] space-y-5">
          <h3 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider">
            Identidade & Avatar
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Preview */}
            <div className="relative w-24 h-24 rounded-2xl bg-[#202D3D] border-2 border-[#C7F36B] flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
              {avatar === 'cosmic_cat' ? (
                <img 
                  src="/assets/aistudio/17a050a7ff186dd71f1f9883dc35d97c_6835da07.jpg" 
                  alt="Neko Cósmico"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : avatar === 'neko_green' ? (
                <NekoMascot size="md" mood="happy" showAura={false} interactive={false} />
              ) : (
                <span className="text-2xl font-black text-[#C7F36B]">{name.charAt(0)}</span>
              )}
            </div>

            {/* Avatar Options */}
            <div className="space-y-2 flex-1 text-center sm:text-left">
              <span className="text-xs font-semibold text-[#AAB6C5] block">
                Escolha o estilo do seu avatar:
              </span>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => setAvatar('neko_green')}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 cursor-pointer transition-all ${
                    avatar === 'neko_green'
                      ? 'bg-[#202D3D] border-[#C7F36B] text-[#C7F36B]'
                      : 'bg-[#10151D] border-[#202D3D] text-[#AAB6C5] hover:text-[#F5F7FA]'
                  }`}
                >
                  <NekoMascot size="sm" mood="happy" showAura={false} interactive={false} className="w-5 h-5" />
                  <span>Neko Original (Verde-Limão)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAvatar('cosmic_cat')}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 cursor-pointer transition-all ${
                    avatar === 'cosmic_cat'
                      ? 'bg-[#202D3D] border-[#65D6C5] text-[#65D6C5]'
                      : 'bg-[#10151D] border-[#202D3D] text-[#AAB6C5] hover:text-[#F5F7FA]'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#F28BB5]" />
                  <span>Neko Cósmico (Edição Especial)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAvatar('initials')}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 cursor-pointer transition-all ${
                    avatar === 'initials'
                      ? 'bg-[#202D3D] border-[#F28BB5] text-[#F28BB5]'
                      : 'bg-[#10151D] border-[#202D3D] text-[#AAB6C5] hover:text-[#F5F7FA]'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Inicial do Nome</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#AAB6C5] mb-1.5">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#10151D] border border-[#202D3D] text-[#F5F7FA] text-sm focus:outline-none focus:border-[#C7F36B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AAB6C5] mb-1.5">E-mail Cadastrado</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#10151D] border border-[#202D3D] text-[#F5F7FA] text-sm focus:outline-none focus:border-[#C7F36B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AAB6C5] mb-1.5">Lema / Intenção Pessoal</label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ex: Menos telas, mais presença e sono reparador."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#10151D] border border-[#202D3D] text-[#F5F7FA] text-sm focus:outline-none focus:border-[#C7F36B]"
            />
          </div>
        </div>

        {/* Goals Section */}
        <div className="p-6 rounded-2xl bg-[#192331] border border-[#202D3D] space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#C7F36B]" />
            <h3 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider">
              Metas de Equilíbrio Digital
            </h3>
          </div>
          <p className="text-xs text-[#AAB6C5]">
            Defina seus objetivos para orientar o cálculo diário do seu Índice de Equilíbrio.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-[#202D3D]/50 border border-[#202D3D]">
              <label className="block text-xs font-semibold text-[#F5F7FA] mb-1">
                Meta Diária de Tela
              </label>
              <div className="relative mt-2">
                <input
                  type="number"
                  min="1"
                  max="16"
                  value={screenGoalHours}
                  onChange={(e) => setScreenGoalHours(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-[#202D3D] text-[#F5F7FA] text-sm font-bold focus:outline-none focus:border-[#C7F36B] tabular-nums"
                />
                <span className="absolute right-3 top-2 text-xs text-[#AAB6C5] pointer-events-none">horas/dia</span>
              </div>
              <span className="text-[10px] text-[#AAB6C5] block mt-1.5">Padrão sugerido: 4h00</span>
            </div>

            <div className="p-4 rounded-xl bg-[#202D3D]/50 border border-[#202D3D]">
              <label className="block text-xs font-semibold text-[#F5F7FA] mb-1">
                Limite Redes Sociais
              </label>
              <div className="relative mt-2">
                <input
                  type="number"
                  min="15"
                  max="480"
                  step="15"
                  value={socialLimitMins}
                  onChange={(e) => setSocialLimitMins(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-[#202D3D] text-[#F5F7FA] text-sm font-bold focus:outline-none focus:border-[#C7F36B] tabular-nums"
                />
                <span className="absolute right-3 top-2 text-xs text-[#AAB6C5] pointer-events-none">minutos</span>
              </div>
              <span className="text-[10px] text-[#AAB6C5] block mt-1.5">Padrão sugerido: 90 min</span>
            </div>

            <div className="p-4 rounded-xl bg-[#202D3D]/50 border border-[#202D3D]">
              <label className="block text-xs font-semibold text-[#F5F7FA] mb-1">
                Meta Offline Diária
              </label>
              <div className="relative mt-2">
                <input
                  type="number"
                  min="15"
                  max="300"
                  step="15"
                  value={offlineGoalMins}
                  onChange={(e) => setOfflineGoalMins(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#10151D] border border-[#202D3D] text-[#F5F7FA] text-sm font-bold focus:outline-none focus:border-[#C7F36B] tabular-nums"
                />
                <span className="absolute right-3 top-2 text-xs text-[#AAB6C5] pointer-events-none">minutos</span>
              </div>
              <span className="text-[10px] text-[#AAB6C5] block mt-1.5">Padrão sugerido: 60 min</span>
            </div>
          </div>
        </div>

        {/* Preferences & Theme */}
        <div className="p-6 rounded-2xl bg-[#192331] border border-[#202D3D] space-y-4">
          <h3 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider">
            Preferências do Aplicativo
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#202D3D]/50 border border-[#202D3D]">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-[#65D6C5]" />
                <div>
                  <h4 className="text-xs font-bold text-[#F5F7FA]">Lembretes Amigáveis do Neko</h4>
                  <p className="text-[11px] text-[#AAB6C5]">Exibir notificações sutis ao atingir limites diários</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#C7F36B] cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#202D3D]/50 border border-[#202D3D]">
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-[#F28BB5]" />
                <div>
                  <h4 className="text-xs font-bold text-[#F5F7FA]">Modo Descanso Noturno</h4>
                  <p className="text-[11px] text-[#AAB6C5]">Sugerir desconexão 30 minutos antes do horário de dormir</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#C7F36B] cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Data & Backup */}
        <div className="p-6 rounded-2xl bg-[#192331] border border-[#202D3D] space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#65D6C5]" />
            <h3 className="text-sm font-bold text-[#F5F7FA] uppercase tracking-wider">
              Privacidade & Gerenciamento de Dados
            </h3>
          </div>
          <p className="text-xs text-[#AAB6C5]">
            Seus dados permanecem seguros no seu navegador. Você tem total controle para exportar backups ou reiniciar o ambiente.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#202D3D] hover:bg-[#26364a] text-xs font-semibold text-[#F5F7FA] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#65D6C5]" />
              <span>Exportar Backup Completo (JSON)</span>
            </button>

            <button
              type="button"
              onClick={resetDemoData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#202D3D] hover:bg-rose-500/10 text-xs font-semibold text-[#AAB6C5] hover:text-rose-400 border border-[#202D3D] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restaurar Dados da Demonstração Acadêmica</span>
            </button>
          </div>
        </div>

        {/* Submit Bar and Logout */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#F28BB5] hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair da Conta</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C7F36B] text-[#10151D] text-xs font-bold shadow-md hover:bg-[#b8eb52] transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Salvar Preferências</span>
          </button>
        </div>
      </form>
    </div>
  );
};
