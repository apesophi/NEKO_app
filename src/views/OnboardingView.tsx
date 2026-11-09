import React, { useState } from 'react';
import { ArrowRight, Check, Compass, Target, Trophy, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NekoMascot } from '../components/NekoMascot';

export const OnboardingView: React.FC = () => {
  const { completeOnboarding, skipOnboarding, user } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Survey answers
  const [estimatedDailyHours, setEstimatedDailyHours] = useState('4 a 6 horas');
  const [selectedApps, setSelectedApps] = useState<string[]>(['Instagram', 'TikTok']);
  const [mainGoal, setMainGoal] = useState('Dormir melhor e ter mais foco');
  const [offlineTargetHours, setOfflineTargetHours] = useState('1 hora por dia');

  const appOptions = [
    'Instagram',
    'TikTok',
    'YouTube',
    'WhatsApp',
    'Jogos no celular',
    'Twitter / X',
    'Netflix',
    'Outros',
  ];

  const goalOptions = [
    'Dormir melhor e desacelerar à noite',
    'Mais foco nos estudos e trabalho',
    'Diminuir a ansiedade e sensação de pressa',
    'Passar tempo de qualidade com a família',
  ];

  const handleToggleApp = (app: string) => {
    setSelectedApps(prev => 
      prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]
    );
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((step + 1) as any);
    } else {
      completeOnboarding({
        estimatedDailyHours,
        mostUsedApps: selectedApps,
        mainGoal,
        offlineTargetHours,
        completed: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#10151D] flex flex-col justify-between p-6 md:p-12 relative overflow-hidden select-none">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#C7F36B]/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between max-w-2xl w-full mx-auto relative z-10">
        <div className="flex items-center gap-2">
          <NekoMascot size="sm" mood="motivated" showAura={false} interactive={false} />
          <span className="font-bold text-[#F5F7FA]">NEKO Boas-Vindas</span>
        </div>
        <button
          onClick={skipOnboarding}
          className="text-xs text-[#AAB6C5] hover:text-[#F5F7FA] transition-colors cursor-pointer"
        >
          Pular introdução
        </button>
      </div>

      {/* Step Indicators */}
      <div className="max-w-2xl w-full mx-auto relative z-10 my-4">
        <div className="flex items-center justify-between gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step >= s ? 'bg-[#C7F36B]' : 'bg-[#202D3D]'
                }`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-[#AAB6C5] mt-2">
          <span className={step === 1 ? 'text-[#C7F36B] font-semibold' : ''}>1. Hábitos</span>
          <span className={step === 2 ? 'text-[#C7F36B] font-semibold' : ''}>2. Metas</span>
          <span className={step === 3 ? 'text-[#C7F36B] font-semibold' : ''}>3. Equilíbrio</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-xl w-full mx-auto my-auto bg-[#192331] border border-[#202D3D] rounded-3xl p-6 md:p-8 shadow-2xl relative z-10">
        {/* STEP 1: CONHEÇA SEUS HÁBITOS DIGITAIS */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#202D3D] flex items-center justify-center text-[#65D6C5]">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#F5F7FA]">
                  1. Conheça seus hábitos digitais
                </h2>
                <p className="text-xs text-[#AAB6C5]">
                  Olá, {user.name}! Vamos entender seu ponto de partida para cuidar do seu tempo.
                </p>
              </div>
            </div>

            {/* Question 1 */}
            <div>
              <label className="block text-xs font-semibold text-[#F5F7FA] mb-2">
                Quanto tempo você acredita passar no celular por dia?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Menos de 3h', '4 a 6 horas', 'Mais de 6h'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setEstimatedDailyHours(time)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      estimatedDailyHours === time
                        ? 'bg-[#202D3D] border-[#C7F36B] text-[#C7F36B] font-semibold shadow-sm'
                        : 'bg-[#10151D] border-[#202D3D] text-[#AAB6C5] hover:border-[#2a3c52]'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div>
              <label className="block text-xs font-semibold text-[#F5F7FA] mb-2">
                Quais aplicativos você mais utiliza no dia a dia?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {appOptions.map((app) => {
                  const isChecked = selectedApps.includes(app);
                  return (
                    <button
                      key={app}
                      type="button"
                      onClick={() => handleToggleApp(app)}
                      className={`p-2 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#202D3D] border-[#65D6C5] text-[#F5F7FA] font-semibold'
                          : 'bg-[#10151D] border-[#202D3D] text-[#AAB6C5] hover:border-[#2a3c52]'
                      }`}
                    >
                      {app}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DEFINA METAS PARA SUA ROTINA */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#202D3D] flex items-center justify-center text-[#C7F36B]">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#F5F7FA]">
                  2. Defina metas para sua rotina
                </h2>
                <p className="text-xs text-[#AAB6C5]">
                  Pequenos ajustes geram grandes transformações na sua rotina e bem-estar.
                </p>
              </div>
            </div>

            {/* Question 3 */}
            <div>
              <label className="block text-xs font-semibold text-[#F5F7FA] mb-2">
                Qual seu principal objetivo com o NEKO?
              </label>
              <div className="space-y-2">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setMainGoal(goal)}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                      mainGoal === goal
                        ? 'bg-[#202D3D] border-[#C7F36B] text-[#F5F7FA] font-semibold'
                        : 'bg-[#10151D] border-[#202D3D] text-[#AAB6C5] hover:border-[#2a3c52]'
                    }`}
                  >
                    <span>{goal}</span>
                    {mainGoal === goal && <Check className="w-4 h-4 text-[#C7F36B]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 4 */}
            <div>
              <label className="block text-xs font-semibold text-[#F5F7FA] mb-2">
                Quanto tempo deseja dedicar a atividades 100% fora das telas?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['30 minutos', '1 hora por dia', '2 horas ou mais'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setOfflineTargetHours(opt)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      offlineTargetHours === opt
                        ? 'bg-[#202D3D] border-[#C7F36B] text-[#C7F36B] font-semibold'
                        : 'bg-[#10151D] border-[#202D3D] text-[#AAB6C5] hover:border-[#2a3c52]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CONQUISTE EQUILÍBRIO E ACOMPANHE SUA EVOLUÇÃO */}
        {step === 3 && (
          <div className="space-y-6 text-center animate-fadeIn">
            <div className="flex flex-col items-center">
              <NekoMascot size="lg" mood="celebrating" showAura={true} />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#202D3D] text-[#C7F36B] text-xs font-semibold mt-3">
                <Trophy className="w-3.5 h-3.5" />
                <span>+30 XP de Boas-Vindas</span>
              </div>
              <h2 className="text-xl font-bold text-[#F5F7FA] mt-3">
                3. Conquiste equilíbrio e acompanhe sua evolução!
              </h2>
              <p className="text-xs text-[#AAB6C5] max-w-md mt-1 leading-relaxed">
                Tudo pronto para começar! Você vai registrar seu tempo, cumprir desafios diários, ganhar medalhas e acompanhar seu <strong>Índice de Equilíbrio Digital</strong> com o Neko ao seu lado.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#10151D] border border-[#202D3D] text-left space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#AAB6C5]">
                <span>Tempo diário estimado:</span>
                <span className="font-semibold text-[#F5F7FA]">{estimatedDailyHours}</span>
              </div>
              <div className="flex items-center justify-between text-[#AAB6C5]">
                <span>Meta offline diária:</span>
                <span className="font-semibold text-[#C7F36B]">{offlineTargetHours}</span>
              </div>
              <div className="flex items-center justify-between text-[#AAB6C5]">
                <span>Foco prioritário:</span>
                <span className="font-semibold text-[#65D6C5] truncate max-w-[220px]">{mainGoal}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom controls */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#202D3D]">
          {step > 1 ? (
            <button
              onClick={() => setStep((step - 1) as any)}
              className="text-xs font-semibold text-[#AAB6C5] hover:text-[#F5F7FA] px-3 py-2 cursor-pointer"
            >
              Voltar
            </button>
          ) : (
            <span />
          )}

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C7F36B] text-[#10151D] text-xs font-bold shadow-md hover:bg-[#b8eb52] transition-colors cursor-pointer"
          >
            <span>{step === 3 ? 'Explorar Meu NEKO' : 'Continuar'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-[#AAB6C5]/60 max-w-2xl w-full mx-auto relative z-10">
        NEKO: Seu tempo. Sua vida.
      </div>
    </div>
  );
};
