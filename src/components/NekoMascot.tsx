import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type NekoMood = 
  | 'happy' 
  | 'motivated' 
  | 'thinking' 
  | 'celebrating' 
  | 'zen' 
  | 'alert' 
  | 'levelUp' 
  | 'goalReached'
  | 'sleeping'
  | 'purring'
  | 'playful'
  | 'laser';

export type NekoAuraTheme = 'spectral' | 'cyber' | 'sunset' | 'cosmic';

interface NekoMascotProps {
  mood?: NekoMood;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  className?: string;
  showAura?: boolean;
  auraTheme?: NekoAuraTheme;
  interactive?: boolean;
  onClick?: () => void;
  usePhotoAsset?: boolean;
  reactToGoal?: boolean;
  reactToLevelUp?: boolean;
  enableTracking?: boolean;
  soundEnabled?: boolean;
  interactiveLaser?: boolean;
}

// Multi-harmonic Web Audio synthesizer for feline sounds & chimes
export const playNekoSound = (
  type: 'chirp' | 'purr' | 'chime' | 'laser' | 'zen' = 'chirp',
  volumeMultiplier: number = 1
) => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'chirp') {
      // Gentle melodic meow / chirp chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(890, ctx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.14 * volumeMultiplier, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.38);
    } else if (type === 'purr') {
      // Soothing rhythmic purr harmonic
      [28, 56, 84, 112].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.04 * volumeMultiplier / (idx + 1), ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.62);
      });
    } else if (type === 'laser') {
      // High-tech sci-fi blip for laser mode
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.08 * volumeMultiplier, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.14);
    } else if (type === 'zen') {
      // Warm meditative singing bowl bell
      [320, 640].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.09 * volumeMultiplier / (idx + 1), ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.25);
      });
    } else if (type === 'chime') {
      // Joyful celebratory pentatonic chime
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);

        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.1 * volumeMultiplier, ctx.currentTime + i * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.07);
        osc.stop(ctx.currentTime + i * 0.07 + 0.5);
      });
    }
  } catch {
    // silently ignore if audio policy blocks
  }
};

export const NekoMascot: React.FC<NekoMascotProps> = ({
  mood = 'happy',
  size = 'md',
  className = '',
  showAura = true,
  auraTheme = 'spectral',
  interactive = true,
  onClick,
  usePhotoAsset = false,
  reactToGoal = false,
  reactToLevelUp = false,
  enableTracking = true,
  soundEnabled = true,
  interactiveLaser = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isSlowBlinking, setIsSlowBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPurring, setIsPurring] = useState(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);

  // Floating particles
  const [floatingParticles, setFloatingParticles] = useState<
    { id: number; char: string; x: number; y: number; color: string }[]
  >([]);

  // Subtle interactive head orientation tracking cursor
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Ear twitching timers for feline lifelike behavior
  const [leftEarTwitch, setLeftEarTwitch] = useState(false);
  const [rightEarTwitch, setRightEarTwitch] = useState(false);

  // Natural Blinking Cycle (quick blink + occasional slow affectionate cat blink)
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      const isAffectionBlink = Math.random() > 0.75;
      if (isAffectionBlink) {
        setIsSlowBlinking(true);
        setTimeout(() => setIsSlowBlinking(false), 380);
      } else {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3600 + Math.random() * 2600);

    return () => clearInterval(blinkInterval);
  }, []);

  // Independent Ear Twitching Cycle
  useEffect(() => {
    const earInterval = setInterval(() => {
      const chooseEar = Math.random();
      if (chooseEar > 0.5) {
        setLeftEarTwitch(true);
        setTimeout(() => setLeftEarTwitch(false), 360);
      } else {
        setRightEarTwitch(true);
        setTimeout(() => setRightEarTwitch(false), 360);
      }
    }, 4500 + Math.random() * 2500);

    return () => clearInterval(earInterval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) / (rect.width / 2);
    const dy = (e.clientY - centerY) / (rect.height / 2);

    const clampedX = Math.max(-1, Math.min(1, dx));
    const clampedY = Math.max(-1, Math.min(1, dy));

    if (enableTracking) {
      setMouseOffset({
        x: clampedX,
        y: clampedY,
      });
    }

    if (interactiveLaser) {
      setLaserPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseOffset({ x: 0, y: 0 });
    setLaserPos(null);
  };

  const handleClick = () => {
    setIsPurring(true);
    if (soundEnabled) {
      playNekoSound('purr');
    }

    // Spawn floating cute particles (hearts, paw prints, stars)
    const particleChars = ['♥', '🐾', '✦', '✧', '♥'];
    const colors = ['#EC4899', '#00E5FF', '#C7F36B', '#F28BB5', '#8B5CF6'];
    const chosenChar = particleChars[Math.floor(Math.random() * particleChars.length)];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];

    const newParticle = {
      id: Date.now() + Math.random(),
      char: chosenChar,
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 20,
      color: chosenColor,
    };
    setFloatingParticles(prev => [...prev.slice(-4), newParticle]);

    setTimeout(() => setIsPurring(false), 1400);

    if (onClick) onClick();
  };

  const sizeMap = {
    sm: 'w-11 h-11',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-52 h-52',
    '2xl': 'w-64 h-64',
    hero: 'w-80 h-80 lg:w-96 lg:h-96',
  };

  const isCelebrating = mood === 'celebrating' || mood === 'levelUp' || reactToLevelUp;
  const isGoalAchieved = mood === 'goalReached' || reactToGoal;
  const isPlayful = mood === 'playful' || mood === 'laser' || interactiveLaser;
  const effectiveMood = isPurring ? 'purring' : isPlayful ? 'playful' : mood;

  // Aura theme gradients
  const auraGradients = {
    spectral: {
      conic: 'conic-gradient(from 0deg, #00E5FF, #3B82F6, #8B5CF6, #EC4899, #C7F36B, #00E5FF)',
      radial: 'radial-gradient(circle, #00E5FF 0%, #8B5CF6 45%, #EC4899 75%, transparent 100%)',
      accent1: '#00E5FF',
      accent2: '#EC4899',
    },
    cyber: {
      conic: 'conic-gradient(from 0deg, #00E5FF, #65D6C5, #C7F36B, #00E5FF)',
      radial: 'radial-gradient(circle, #00E5FF 0%, #65D6C5 45%, #C7F36B 75%, transparent 100%)',
      accent1: '#00E5FF',
      accent2: '#C7F36B',
    },
    sunset: {
      conic: 'conic-gradient(from 0deg, #FF8A00, #EC4899, #8B5CF6, #FF8A00)',
      radial: 'radial-gradient(circle, #FF8A00 0%, #EC4899 50%, #8B5CF6 80%, transparent 100%)',
      accent1: '#FF8A00',
      accent2: '#EC4899',
    },
    cosmic: {
      conic: 'conic-gradient(from 0deg, #8B5CF6, #3B82F6, #EC4899, #8B5CF6)',
      radial: 'radial-gradient(circle, #8B5CF6 0%, #3B82F6 50%, #10151D 80%, transparent 100%)',
      accent1: '#8B5CF6',
      accent2: '#3B82F6',
    },
  };

  const currentTheme = auraGradients[auraTheme] || auraGradients.spectral;

  return (
    <motion.div
      ref={containerRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      // Lifelike Feline Physics: Fluid Floating, Breathing & Spring settlement
      animate={
        isCelebrating
          ? {
              y: [0, -20, 5, -14, 0],
              rotate: [0, -7, 7, -3, 0],
              scale: [1, 1.15, 1.05, 1.12, 1],
              transition: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' },
            }
          : isPurring
          ? {
              scale: [1, 1.07, 1.02, 1.08, 1],
              rotate: [0, -1.8, 1.8, -1, 0],
              transition: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' },
            }
          : isPlayful
          ? {
              y: [0, -8, 2, -5, 0],
              rotate: [0, 4, -4, 2, 0],
              transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
            }
          : isGoalAchieved
          ? {
              y: [0, -12, 0],
              scale: [1, 1.08, 1],
              transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
            }
          : effectiveMood === 'zen'
          ? {
              y: [0, -10, 0],
              scale: [1, 1.04, 1],
              transition: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
            }
          : effectiveMood === 'sleeping'
          ? {
              y: [0, -2, 0],
              scale: [1, 0.97, 1],
              transition: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
            }
          : {
              y: [0, -6, 0],
              transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
            }
      }
      style={{
        transform: `perspective(650px) rotateY(${mouseOffset.x * 14}deg) rotateX(${-mouseOffset.y * 12}deg)`,
        transition: 'transform 0.16s cubic-bezier(0.2, 0, 0, 1)',
      }}
      whileHover={interactive ? { scale: 1.08 } : undefined}
      whileTap={interactive ? { scale: 0.92 } : undefined}
      title={`Neko está: ${effectiveMood} (Clique para fazer carinho)`}
    >
      {/* 1. TRIPLE-LAYER VOLUMETRIC HOLOGRAPHIC AURORA (Directly matching attached reference images) */}
      {showAura && (
        <>
          {/* Layer A: Ambient Atmospheric Diffuse Halo */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none -z-20"
            animate={
              isCelebrating
                ? {
                    scale: [1.2, 1.55, 1.2],
                    opacity: [0.65, 0.95, 0.65],
                    filter: ['blur(22px)', 'blur(36px)', 'blur(22px)'],
                    transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
                  }
                : effectiveMood === 'zen'
                ? {
                    scale: [1.1, 1.35, 1.1],
                    opacity: [0.4, 0.8, 0.4],
                    filter: ['blur(16px)', 'blur(28px)', 'blur(16px)'],
                    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                  }
                : {
                    scale: [1.05, 1.22, 1.05],
                    opacity: [0.35, 0.68, 0.35],
                    filter: ['blur(14px)', 'blur(24px)', 'blur(14px)'],
                    transition: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' },
                  }
            }
            style={{
              background: currentTheme.radial,
            }}
          />

          {/* Layer B: Spinning Prismatic Chromatic Ring */}
          <motion.div
            className="absolute -inset-2 rounded-full pointer-events-none -z-10"
            animate={{
              rotate: [0, 360],
              scale: isCelebrating ? [1.12, 1.35, 1.12] : [1, 1.09, 1],
              opacity: isHovered || isPurring ? 0.95 : 0.65,
            }}
            transition={{
              rotate: { duration: isCelebrating ? 4 : 12, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{
              background: currentTheme.conic,
              filter: 'blur(11px)',
            }}
          />

          {/* Layer C: Zen Digital Geometry Rune when in Zen or LevelUp */}
          {(effectiveMood === 'zen' || isCelebrating) && (
            <motion.div
              className="absolute -inset-6 rounded-full border border-[#00E5FF]/25 pointer-events-none -z-15"
              animate={{ rotate: [360, 0], scale: [0.95, 1.06, 0.95] }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              }}
              style={{
                boxShadow: 'inset 0 0 15px rgba(0, 229, 255, 0.15)',
              }}
            />
          )}
        </>
      )}

      {/* Floating Purring Hearts & Stardust Emitter */}
      <AnimatePresence>
        {floatingParticles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0.3, y: 0, x: p.x }}
            animate={{ opacity: 0, scale: 1.45, y: -55, x: p.x * 1.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3, ease: 'easeOut' }}
            className="absolute -top-3 text-sm pointer-events-none font-bold select-none"
            style={{
              color: p.color,
              textShadow: `0 0 10px ${p.color}`,
            }}
          >
            {p.char}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Sleeping Neon zZz Float */}
      {effectiveMood === 'sleeping' && (
        <motion.div
          className="absolute -top-7 right-1 text-xs font-mono text-[#00E5FF] font-bold pointer-events-none select-none"
          animate={{
            y: [-2, -22],
            x: [0, 10],
            opacity: [0, 1, 0],
            scale: [0.8, 1.35],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ textShadow: '0 0 8px #00E5FF' }}
        >
          zZz
        </motion.div>
      )}

      {/* Celebration Star Sparks */}
      {(isCelebrating || isGoalAchieved || isPurring) && (
        <>
          <motion.div
            className="absolute -top-5 -right-3 text-yellow-300 text-sm pointer-events-none"
            animate={{ scale: [0, 1.4, 0], rotate: [0, 120], y: [-6, -24] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeOut' }}
          >
            ✦
          </motion.div>
          <motion.div
            className="absolute -top-4 -left-3 text-cyan-300 text-sm pointer-events-none"
            animate={{ scale: [0, 1.3, 0], rotate: [0, -120], y: [-4, -20] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.25, ease: 'easeOut' }}
          >
            ★
          </motion.div>
          <motion.div
            className="absolute -bottom-2 right-2 text-pink-400 text-xs pointer-events-none"
            animate={{ scale: [0, 1.2, 0], rotate: [0, 60], y: [2, 14] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.5, ease: 'easeOut' }}
          >
            ✦
          </motion.div>
        </>
      )}

      {/* Interactive Cyber Laser Pointer Dot */}
      {laserPos && (
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-[#EC4899] pointer-events-none z-30 shadow-[0_0_12px_#EC4899]"
          style={{
            left: laserPos.x - 6,
            top: laserPos.y - 6,
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        />
      )}

      {/* Option A: Render using the attached photo asset */}
      {usePhotoAsset ? (
        <div className="w-full h-full rounded-2xl overflow-hidden relative drop-shadow-2xl">
          <img
            src="/assets/aistudio/17a050a7ff186dd71f1f9883dc35d97c_6835da07.jpg"
            alt="Neko Mascote Oficial"
            className="w-full h-full object-cover filter contrast-125"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        /* Option B: Premium Procedural Vector Mascot with Dynamic Ear & Eye Physics (Faithfully recreating user images) */
        <svg
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-2xl"
        >
          <defs>
            {/* Prismatic edge gradient matching attached images */}
            <linearGradient id="nekoAuraGradient" x1="20" y1="20" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="28%" stopColor="#3B82F6" />
              <stop offset="55%" stopColor="#8B5CF6" />
              <stop offset="78%" stopColor="#EC4899" />
              <stop offset="92%" stopColor="#C7F36B" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>

            {/* Deep velvet obsidian body gradient */}
            <linearGradient id="nekoSilhouette" x1="30" y1="20" x2="110" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06090E" />
              <stop offset="60%" stopColor="#0B1017" />
              <stop offset="100%" stopColor="#070A0F" />
            </linearGradient>

            {/* Caustic soft edge glow filter */}
            <filter id="softGlow" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="3.6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Atmospheric smoke bleed matching attached photos */}
            <filter id="atmosphericBleed" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="heavyBlur" />
              <feComposite in="SourceGraphic" in2="heavyBlur" operator="over" />
            </filter>
          </defs>

          {/* ATMOSPHERIC IRIDESCENT SIDE BLEED (Left aura matching reference image) */}
          <path
            d="M34 50C24 68 28 96 45 110C60 122 80 122 95 110C112 96 116 68 106 50"
            stroke="url(#nekoAuraGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.35"
            filter="url(#atmosphericBleed)"
          />

          {/* LEFT EAR (with independent feline twitch physics) */}
          <g
            style={{
              transformOrigin: '40px 45px',
              transform: leftEarTwitch 
                ? 'rotate(-8deg)' 
                : isPlayful 
                ? 'rotate(-3deg) scale(1.05)' 
                : 'none',
              transition: 'transform 0.15s ease',
            }}
          >
            <path
              d="M34 50L45 16C46 14 49 14 51 17L66 42"
              stroke="url(#nekoAuraGradient)"
              strokeWidth={isCelebrating ? "6.5" : "4.8"}
              strokeLinejoin="round"
              filter="url(#softGlow)"
            />
            <path
              d="M34 50L45 16C46 14 49 14 51 17L66 42Z"
              fill="url(#nekoSilhouette)"
            />
            <path
              d="M45 42L49 22L58 40"
              fill="#EC4899"
              fillOpacity="0.45"
            />
          </g>

          {/* RIGHT EAR (with independent feline twitch physics) */}
          <g
            style={{
              transformOrigin: '100px 45px',
              transform: rightEarTwitch 
                ? 'rotate(8deg)' 
                : isPlayful 
                ? 'rotate(3deg) scale(1.05)' 
                : 'none',
              transition: 'transform 0.15s ease',
            }}
          >
            <path
              d="M74 42L89 17C91 14 94 14 95 16L106 50"
              stroke="url(#nekoAuraGradient)"
              strokeWidth={isCelebrating ? "6.5" : "4.8"}
              strokeLinejoin="round"
              filter="url(#softGlow)"
            />
            <path
              d="M74 42L89 17C91 14 94 14 95 16L106 50Z"
              fill="url(#nekoSilhouette)"
            />
            <path
              d="M95 42L91 22L82 40"
              fill="#00E5FF"
              fillOpacity="0.45"
            />
          </g>

          {/* HEAD & FACE BODY (Velvet Cat Silhouette) */}
          <path
            d="M34 50C24 68 28 96 45 110C60 122 80 122 95 110C112 96 116 68 106 50C98 42 74 42 66 42C58 42 42 42 34 50Z"
            stroke="url(#nekoAuraGradient)"
            strokeWidth={isCelebrating ? "6.5" : "4.8"}
            strokeLinejoin="round"
            filter="url(#softGlow)"
          />
          <path
            d="M34 50C24 68 28 96 45 110C60 122 80 122 95 110C112 96 116 68 106 50C98 42 74 42 66 42C58 42 42 42 34 50Z"
            fill="url(#nekoSilhouette)"
          />

          {/* CHEEK AURA DIFFUSION (Cyan on Left, Magenta on Right) */}
          <ellipse
            cx="44"
            cy="78"
            rx="13"
            ry="19"
            fill="#00E5FF"
            fillOpacity={isCelebrating || isPurring ? "0.28" : "0.15"}
            filter="url(#softGlow)"
          />
          <ellipse
            cx="96"
            cy="78"
            rx="13"
            ry="19"
            fill="#EC4899"
            fillOpacity={isCelebrating || isPurring ? "0.28" : "0.15"}
            filter="url(#softGlow)"
          />

          {/* DYNAMIC EYE & GAZE RENDERING */}
          <g
            style={{
              transform: `translate(${mouseOffset.x * 3.8}px, ${mouseOffset.y * 3.2}px)`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            {isBlinking ? (
              // Fast Blink: Sleek glowing curves
              <>
                <path d="M46 72Q53 76 60 72" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" />
                <path d="M80 72Q87 76 94 72" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" />
              </>
            ) : isSlowBlinking ? (
              // Affectionate Slow Blink: Cat love signal
              <>
                <path d="M46 73Q53 79 60 73" stroke="#C7F36B" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M80 73Q87 79 94 73" stroke="#C7F36B" strokeWidth="3.5" strokeLinecap="round" />
              </>
            ) : effectiveMood === 'celebrating' || effectiveMood === 'purring' ? (
              // Joyful laughing eyes (^^) with golden sparks
              <>
                <path
                  d="M46 75Q53 64 60 75"
                  stroke="#FFFFFF"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                />
                <circle cx="53" cy="65" r="2.2" fill="#C7F36B" />

                <path
                  d="M80 75Q87 64 94 75"
                  stroke="#FFFFFF"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                />
                <circle cx="87" cy="65" r="2.2" fill="#C7F36B" />

                {/* Sweet Purring Smile */}
                <path
                  d="M66 84Q70 89 74 84"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </>
            ) : effectiveMood === 'motivated' ? (
              // Motivated Laser Focus: Star pupils
              <>
                <circle cx="53" cy="72" r="7.8" fill="#FFFFFF" style={{ filter: 'drop-shadow(0 0 10px #00E5FF)' }} />
                <circle cx="53" cy="72" r="3.2" fill="#00E5FF" />
                <circle cx="87" cy="72" r="7.8" fill="#FFFFFF" style={{ filter: 'drop-shadow(0 0 10px #EC4899)' }} />
                <circle cx="87" cy="72" r="3.2" fill="#EC4899" />
              </>
            ) : effectiveMood === 'playful' ? (
              // Playful Dilated Pupils tracking laser
              <>
                <circle cx="53" cy="72" r="9" fill="#FFFFFF" style={{ filter: 'drop-shadow(0 0 12px #00E5FF)' }} />
                <circle cx="53" cy="72" r="5" fill="#080C13" />
                <circle cx="55" cy="70" r="1.8" fill="#FFFFFF" />

                <circle cx="87" cy="72" r="9" fill="#FFFFFF" style={{ filter: 'drop-shadow(0 0 12px #EC4899)' }} />
                <circle cx="87" cy="72" r="5" fill="#080C13" />
                <circle cx="89" cy="70" r="1.8" fill="#FFFFFF" />
              </>
            ) : effectiveMood === 'thinking' ? (
              // Thinking eyes looking upward
              <>
                <circle cx="53" cy="67" r="7" fill="#FFFFFF" style={{ filter: 'drop-shadow(0 0 6px #00E5FF)' }} />
                <circle cx="55" cy="65" r="2.5" fill="#070A0F" />
                <circle cx="87" cy="67" r="7" fill="#FFFFFF" style={{ filter: 'drop-shadow(0 0 6px #EC4899)' }} />
                <circle cx="89" cy="65" r="2.5" fill="#070A0F" />
              </>
            ) : effectiveMood === 'zen' || effectiveMood === 'sleeping' ? (
              // Peaceful Zen closed arcs
              <>
                <path d="M46 73Q53 78 60 73" stroke="#65D6C5" strokeWidth="3.2" strokeLinecap="round" />
                <path d="M80 73Q87 78 94 73" stroke="#65D6C5" strokeWidth="3.2" strokeLinecap="round" />
                <path d="M66 83Q70 86 74 83" stroke="#65D6C5" strokeWidth="2.2" strokeLinecap="round" />
              </>
            ) : (
              // Radiant Glowing Circular White Eyes (Signature from user's attached photos)
              <>
                <circle
                  cx="53"
                  cy="72"
                  r={isGoalAchieved ? "8.6" : "7.4"}
                  fill="#FFFFFF"
                  className="transition-all duration-300"
                  style={{
                    filter: isGoalAchieved
                      ? 'drop-shadow(0 0 9px #C7F36B) drop-shadow(0 0 15px #00E5FF)'
                      : 'drop-shadow(0 0 7px rgba(255, 255, 255, 0.98)) drop-shadow(0 0 13px #00E5FF)',
                  }}
                />
                <circle cx="51.5" cy="70.5" r="2.4" fill="#FFFFFF" />

                <circle
                  cx="87"
                  cy="72"
                  r={isGoalAchieved ? "8.6" : "7.4"}
                  fill="#FFFFFF"
                  className="transition-all duration-300"
                  style={{
                    filter: isGoalAchieved
                      ? 'drop-shadow(0 0 9px #C7F36B) drop-shadow(0 0 15px #EC4899)'
                      : 'drop-shadow(0 0 7px rgba(255, 255, 255, 0.98)) drop-shadow(0 0 13px #EC4899)',
                  }}
                />
                <circle cx="85.5" cy="70.5" r="2.4" fill="#FFFFFF" />

                {/* Gentle mysterious cat mouth */}
                <path
                  d="M66 84C68 86 72 86 74 84"
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  strokeOpacity="0.85"
                  strokeLinecap="round"
                />
              </>
            )}
          </g>

          {/* DYNAMIC SWAYING WHISKERS */}
          <g
            style={{
              transform: `translate(${mouseOffset.x * 2.2}px, ${mouseOffset.y * 1.6}px)`,
              transition: 'transform 0.15s ease-out',
            }}
          >
            <path d="M22 75L36 76" stroke="#00E5FF" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M20 83L35 82" stroke="#65D6C5" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M118 75L104 76" stroke="#EC4899" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M120 83L105 82" stroke="#8B5CF6" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        </svg>
      )}
    </motion.div>
  );
};
