import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Target, Sparkles, X, ArrowRight, Share2, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { NekoMascot } from '../NekoMascot';

export type CelebrationType = 'levelUp' | 'goalReached';

interface CelebrationModalProps {
  isOpen: boolean;
  type: CelebrationType;
  title: string;
  subtitle: string;
  levelNumber?: number;
  levelTitle?: string;
  xpEarned?: number;
  onClose: () => void;
}

// Gentle pleasant synthesized audio chime using native Web Audio API
export const playCelebrationSound = (type: CelebrationType = 'goalReached') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const notes = type === 'levelUp' 
      ? [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6 (Ascending triumphant chord)
      : [659.25, 783.99, 987.77]; // E5, G5, B5 (Serene sweet chime)

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.6);
    });
  } catch {
    // AudioContext blocked or unsupported, silently fail
  }
};

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  type,
  title,
  subtitle,
  levelNumber,
  levelTitle,
  xpEarned,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      playCelebrationSound(type);

      // Trigger multi-stage confetti
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00E5FF', '#3B82F6', '#8B5CF6', '#EC4899', '#C7F36B', '#FFFFFF'],
        });

        setTimeout(() => {
          confetti({
            particleCount: 40,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#00E5FF', '#EC4899', '#C7F36B'],
          });
          confetti({
            particleCount: 40,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#8B5CF6', '#00E5FF', '#FFFFFF'],
          });
        }, 300);
      } catch {
        // ignore
      }
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-[#192331] border border-[#202D3D] rounded-3xl p-6 sm:p-8 text-center relative shadow-2xl overflow-hidden"
        >
          {/* Prismatic edge glow in modal background */}
          <div 
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none blur-3xl opacity-30"
            style={{
              background: type === 'levelUp'
                ? 'conic-gradient(from 0deg, #00E5FF, #8B5CF6, #EC4899, #C7F36B, #00E5FF)'
                : 'radial-gradient(circle, #C7F36B 0%, #00E5FF 60%, transparent 100%)',
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#AAB6C5] hover:text-[#F5F7FA] hover:bg-[#202D3D] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Type Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#202D3D] text-xs font-semibold mb-4 border border-[#202D3D]">
            {type === 'levelUp' ? (
              <>
                <Trophy className="w-3.5 h-3.5 text-[#C7F36B]" />
                <span className="text-[#C7F36B]">Novo Nível Desbloqueado!</span>
              </>
            ) : (
              <>
                <Target className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span className="text-[#00E5FF]">Meta Diária Atingida!</span>
              </>
            )}
          </div>

          {/* Mascot in Euphoric Celebration Motion */}
          <div className="my-2 flex justify-center">
            <NekoMascot
              size="lg"
              mood={type === 'levelUp' ? 'levelUp' : 'goalReached'}
              showAura={true}
              reactToLevelUp={type === 'levelUp'}
              reactToGoal={type === 'goalReached'}
            />
          </div>

          {/* Title & Speech */}
          <h2 className="text-2xl font-black text-[#F5F7FA] tracking-tight mt-4">
            {title}
          </h2>

          {levelTitle && (
            <div className="mt-1">
              <span className="text-sm font-bold text-[#C7F36B]">
                Nível {levelNumber} · {levelTitle}
              </span>
            </div>
          )}

          <p className="text-xs text-[#AAB6C5] mt-2 max-w-xs mx-auto leading-relaxed">
            {subtitle}
          </p>

          {xpEarned && (
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#202D3D]/80 border border-[#C7F36B]/30 text-xs text-[#F5F7FA] font-bold">
              <Sparkles className="w-4 h-4 text-[#C7F36B]" />
              <span>+{xpEarned} XP Adicionados ao Perfil</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-[#202D3D] flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="w-full py-3 px-6 rounded-xl bg-[#C7F36B] hover:bg-[#b8eb52] text-[#10151D] text-xs font-bold transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continuar Minha Jornada</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
