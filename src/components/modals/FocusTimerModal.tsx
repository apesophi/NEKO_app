import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Check, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NekoMascot } from '../NekoMascot';

export const FocusTimerModal: React.FC = () => {
  const { 
    isFocusTimerOpen, 
    setIsFocusTimerOpen, 
    activeFocusChallenge, 
    toggleChallengeComplete 
  } = useApp();

  const [secondsLeft, setSecondsLeft] = useState(1200); // 20 min default
  const [isActive, setIsActive] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(1200);

  useEffect(() => {
    if (activeFocusChallenge) {
      const sec = activeFocusChallenge.estimatedMinutes * 60;
      setSecondsLeft(sec);
      setTotalSeconds(sec);
      setIsActive(false);
    }
  }, [activeFocusChallenge]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  if (!isFocusTimerOpen || !activeFocusChallenge) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;

  const handleFinish = () => {
    if (!activeFocusChallenge.isCompleted) {
      toggleChallengeComplete(activeFocusChallenge.id);
    }
    setIsFocusTimerOpen(false);
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(totalSeconds);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#192331] border border-[#202D3D] rounded-3xl p-6 shadow-2xl relative flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsFocusTimerOpen(false);
            setIsActive(false);
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#AAB6C5] hover:text-[#F5F7FA] hover:bg-[#202D3D] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mascot in Zen or Motivated mood */}
        <div className="mb-3">
          <NekoMascot 
            size="md" 
            mood={isActive ? 'zen' : secondsLeft === 0 ? 'celebrating' : 'motivated'} 
            showAura={true}
          />
        </div>

        {/* Challenge Info */}
        <span className="text-xs font-semibold text-[#65D6C5] uppercase tracking-wider mb-1">
          Modo Foco & Desconexão
        </span>
        <h3 className="text-xl font-bold text-[#F5F7FA] mb-1">
          {activeFocusChallenge.name}
        </h3>
        <p className="text-xs text-[#AAB6C5] max-w-xs mb-6">
          {activeFocusChallenge.description}
        </p>

        {/* Circular Progress & Timer */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="84"
              stroke="#202D3D"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="96"
              cy="96"
              r="84"
              stroke="#C7F36B"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 84}
              strokeDashoffset={(2 * Math.PI * 84) * (1 - progressRatio)}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-[#F5F7FA] tracking-tight tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[11px] font-medium text-[#AAB6C5] mt-1">
              +{activeFocusChallenge.xpReward} XP ao concluir
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleReset}
            title="Reiniciar temporizador"
            className="w-11 h-11 rounded-full bg-[#202D3D] text-[#AAB6C5] hover:text-[#F5F7FA] hover:bg-[#26364a] flex items-center justify-center transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsActive(!isActive)}
            className="h-12 px-6 rounded-full bg-[#C7F36B] text-[#10151D] font-bold text-sm flex items-center gap-2 shadow-lg hover:bg-[#b8eb52] active:scale-95 transition-all cursor-pointer"
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pausar Foco</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{secondsLeft < totalSeconds ? 'Continuar' : 'Iniciar Foco'}</span>
              </>
            )}
          </button>
        </div>

        {/* Direct Complete Button */}
        <button
          onClick={handleFinish}
          className="w-full py-3 px-4 rounded-xl bg-[#202D3D] hover:bg-[#26364a] text-xs font-semibold text-[#65D6C5] flex items-center justify-center gap-2 border border-[#65D6C5]/20 hover:border-[#65D6C5] transition-all cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>Já concluí a atividade (Receber +{activeFocusChallenge.xpReward} XP)</span>
        </button>
      </div>
    </div>
  );
};
