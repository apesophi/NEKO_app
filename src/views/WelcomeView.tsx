import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  HeartHandshake, 
  Eye, 
  Zap, 
  Activity, 
  Flame, 
  Radio,
  Lock,
  Compass
} from 'lucide-react';
import { NekoMascot } from '../components/NekoMascot';
import { playCelebrationSound } from '../components/modals/CelebrationModal';

interface WelcomeViewProps {
  onStart: () => void;
  onLogin: () => void;
  onDemo: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onStart,
  onLogin,
  onDemo,
}) => {
  const [mascotTapped, setMascotTapped] = useState(false);
  const [rippleKey, setRippleKey] = useState(0);

  const handleMascotClick = () => {
    setMascotTapped(true);
    setRippleKey(prev => prev + 1);
    playCelebrationSound('goalReached');
    setTimeout(() => setMascotTapped(false), 1400);
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] flex flex-col justify-between p-6 md:p-12 relative overflow-hidden select-none">
      {/* 1. Cyber Grid Matrix Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #00E5FF 1px, transparent 1px),
            linear-gradient(to bottom, #00E5FF 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 2. Cyber Floating Aurora Orbs */}
      <motion.div
        className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full pointer-events-none blur-[120px] opacity-25"
        animate={{
          x: [0, 60, 0],
          y: [0, 40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, #00E5FF 0%, #3B82F6 50%, transparent 80%)',
        }}
      />

      <motion.div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none blur-[120px] opacity-25"
        animate={{
          x: [0, -50, 0],
          y: [0, -60, 0],
          scale: [1.1, 0.9, 1.1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, #EC4899 0%, #8B5CF6 50%, transparent 80%)',
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none blur-[140px] opacity-15"
        animate={{
          scale: [0.8, 1.15, 0.8],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, #C7F36B 0%, #00E5FF 60%, transparent 100%)',
        }}
      />

      {/* Floating Cyber Stardust Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#00E5FF] pointer-events-none"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
            boxShadow: '0 0 8px #00E5FF',
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.9, 0.2],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: 3 + i * 0.8,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 3. Top Cyber Brand Navigation Bar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between max-w-6xl w-full mx-auto relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <NekoMascot size="sm" mood="happy" showAura={true} interactive={false} />
            <motion.div
              className="absolute -inset-1 rounded-full border border-[#00E5FF]/40 pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-[#F5F7FA]">NEKO</span>
              <span className="text-[10px] font-mono text-[#00E5FF] px-2 py-0.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 tracking-widest uppercase">
                CYBER ZEN
              </span>
            </div>
            <span className="block text-[11px] font-semibold text-[#C7F36B] tracking-wide">
              Seu tempo. Sua vida.
            </span>
          </div>
        </div>

        <button
          onClick={onLogin}
          className="text-xs font-semibold text-[#AAB6C5] hover:text-[#00E5FF] transition-all px-4 py-2 rounded-xl bg-[#141B26]/80 hover:bg-[#1C2536] border border-[#202D3D] hover:border-[#00E5FF]/40 cursor-pointer shadow-sm active:scale-95"
        >
          Já tenho uma conta
        </button>
      </motion.header>

      {/* 4. Main Hero Section */}
      <div className="max-w-4xl w-full mx-auto my-auto text-center flex flex-col items-center relative z-10 py-8 lg:py-12">
        {/* Holographic Cyber Stage for Neko */}
        <div className="mb-6 relative flex flex-col items-center">
          {/* Rotating Cyber Halo Orbits */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
            {/* Outer dotted holographic orbit */}
            <motion.div
              className="absolute inset-0 rounded-full border border-dashed border-[#00E5FF]/30 pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            />

            {/* Inner chromatic reverse orbit */}
            <motion.div
              className="absolute inset-3 rounded-full border border-dotted border-[#EC4899]/35 pointer-events-none"
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />

            {/* Cyber Ring Glow */}
            <motion.div
              className="absolute inset-7 rounded-full bg-gradient-to-tr from-[#00E5FF]/15 via-transparent to-[#EC4899]/15 pointer-events-none blur-md"
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Shockwave ripple on mascot tap */}
            <AnimatePresence>
              {mascotTapped && (
                <motion.div
                  key={rippleKey}
                  initial={{ scale: 0.6, opacity: 1 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full border-2 border-[#00E5FF] pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Animated Mascot */}
            <NekoMascot 
              size="xl" 
              mood={mascotTapped ? 'celebrating' : 'happy'} 
              showAura={true}
              onClick={handleMascotClick}
            />
          </div>

          {/* Interactive Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-3 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141B26]/90 border border-[#00E5FF]/30 text-xs font-semibold text-[#00E5FF] shadow-lg shadow-[#00E5FF]/10 cursor-pointer hover:border-[#00E5FF] transition-all"
            onClick={handleMascotClick}
          >
            <Zap className="w-3.5 h-3.5 text-[#C7F36B] fill-current" />
            <span>Toque no Neko para ativar a aura</span>
          </motion.div>
        </div>

        {/* Cyber Hero Title & Slogan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="space-y-4 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141B26] border border-[#C7F36B]/30 text-[11px] font-mono font-semibold text-[#C7F36B]">
            <Radio className="w-3 h-3 text-[#C7F36B] animate-pulse" />
            <span>TECNOLOGIA A FAVOR DO SEU TEMPO</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#F5F7FA] tracking-tight leading-[1.15] text-balance">
            Equilíbrio digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#65D6C5] to-[#C7F36B]">consciente</span> sem culpas.
          </h1>

          <p className="text-sm md:text-base text-[#AAB6C5] max-w-xl mx-auto leading-relaxed">
            Descubra como harmonizar suas telas com momentos vivos no mundo real. O NEKO é seu guardião com gamificação, desafios diários e índice de equilíbrio.
          </p>
        </motion.div>

        {/* Action Buttons with Cyber Glow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto"
        >
          <button
            onClick={onStart}
            className="w-full sm:w-auto relative group overflow-hidden flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C7F36B] to-[#65D6C5] text-[#0A0D14] font-black text-sm shadow-xl shadow-[#C7F36B]/20 hover:shadow-[#00E5FF]/30 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="relative z-10">Começar Minha Jornada</span>
            <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
            {/* Cyber shimmer sweep */}
            <div className="absolute inset-0 bg-white/25 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
          </button>

          <button
            onClick={onDemo}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[#141B26]/90 hover:bg-[#1C2536] text-[#F5F7FA] font-bold text-sm border border-[#202D3D] hover:border-[#00E5FF]/60 hover:shadow-lg hover:shadow-[#00E5FF]/10 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#00E5FF]" />
            <span>Explorar Demonstração Acadêmica</span>
          </button>
        </motion.div>

        {/* 5. Cyber Bento Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 w-full text-left"
        >
          {/* Card 1: Zero Culpa */}
          <div className="p-5 rounded-2xl bg-[#141B26]/80 border border-[#202D3D] hover:border-[#00E5FF]/50 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-[#00E5FF]/10 blur-xl group-hover:scale-150 transition-transform" />
            <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center mb-3 text-[#00E5FF]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-[#F5F7FA] mb-1 flex items-center gap-1.5">
              <span>Zero Culpa</span>
              <span className="text-[10px] font-mono text-[#00E5FF]">· 01</span>
            </h4>
            <p className="text-[11px] text-[#AAB6C5] leading-normal">
              A tecnologia é bem-vinda. Nosso objetivo é fortalecer sua escolha consciente e autonomia.
            </p>
          </div>

          {/* Card 2: Gamificação Real */}
          <div className="p-5 rounded-2xl bg-[#141B26]/80 border border-[#202D3D] hover:border-[#C7F36B]/50 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-[#C7F36B]/10 blur-xl group-hover:scale-150 transition-transform" />
            <div className="w-9 h-9 rounded-xl bg-[#C7F36B]/10 border border-[#C7F36B]/30 flex items-center justify-center mb-3 text-[#C7F36B]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-[#F5F7FA] mb-1 flex items-center gap-1.5">
              <span>Gamificação Real</span>
              <span className="text-[10px] font-mono text-[#C7F36B]">· 02</span>
            </h4>
            <p className="text-[11px] text-[#AAB6C5] leading-normal">
              Ganhe XP, suba de nível e colecione medalhas ao priorizar leitura, passeios e sono de qualidade.
            </p>
          </div>

          {/* Card 3: Companhia do Neko */}
          <div className="p-5 rounded-2xl bg-[#141B26]/80 border border-[#202D3D] hover:border-[#EC4899]/50 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-[#EC4899]/10 blur-xl group-hover:scale-150 transition-transform" />
            <div className="w-9 h-9 rounded-xl bg-[#EC4899]/10 border border-[#EC4899]/30 flex items-center justify-center mb-3 text-[#EC4899]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-[#F5F7FA] mb-1 flex items-center gap-1.5">
              <span>Mascote Proativo</span>
              <span className="text-[10px] font-mono text-[#EC4899]">· 03</span>
            </h4>
            <p className="text-[11px] text-[#AAB6C5] leading-normal">
              O gatinho Neko reage em tempo real aos seus avanços e te lembra de cuidar da vida real.
            </p>
          </div>
        </motion.div>
      </div>

      {/* 6. Footer */}
      <footer className="text-center text-[11px] text-[#AAB6C5]/60 max-w-5xl mx-auto pt-4 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#202D3D]/50 w-full">
        <span className="font-mono text-[10px] text-[#00E5FF]/70">
          NEKO // PROTOCOLO DE EQUILÍBRIO DIGITAL
        </span>
        <span>
          © 2026 NEKO · "Seu tempo. Sua vida."
        </span>
      </footer>
    </div>
  );
};
