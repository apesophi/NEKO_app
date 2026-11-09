import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  Trophy, 
  Flame, 
  Sparkles, 
  Activity, 
  Cat, 
  Award,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NekoMascot } from '../NekoMascot';
import { Achievement } from '../../types';

interface ShareAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAchievement?: Achievement | null;
}

export const ShareAchievementModal: React.FC<ShareAchievementModalProps> = ({
  isOpen,
  onClose,
  selectedAchievement,
}) => {
  const { 
    user, 
    totalXP, 
    currentLevel, 
    levelTitle, 
    streak, 
    todayBalance, 
    achievements, 
    setMascotToast 
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Default to recent unlocked achievement or the selected one
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const activeMilestone = selectedAchievement || unlockedAchievements[unlockedAchievements.length - 1] || achievements[0];

  const [chosenMilestoneId, setChosenMilestoneId] = useState(activeMilestone.id);
  const currentMilestone = achievements.find(a => a.id === chosenMilestoneId) || activeMilestone;

  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const shareText = `🐱 Alcancei o Nível ${currentLevel} (${levelTitle}) no NEKO!\n✨ ${totalXP} XP acumulados\n🔥 ${streak} dias mantendo o equilíbrio digital\n🏆 Conquista recente: "${currentMilestone.title}" - ${currentMilestone.description}\n\nDescubra como equilibrar seu tempo digital: NEKO — Seu tempo. Sua vida.\n#NEKO #EquilibrioDigital #MindfulTech`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setMascotToast('Texto copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Meu Progresso no NEKO — Nível ${currentLevel}`,
          text: shareText,
          url: window.location.href,
        });
        setMascotToast('Compartilhado com sucesso!');
      } catch (e) {
        // user cancelled
      }
    } else {
      handleCopyText();
    }
  };

  const handleDownloadCard = () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 760;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // 1. Dark Cyber Gradient Background
        const bgGrad = ctx.createLinearGradient(0, 0, 0, 760);
        bgGrad.addColorStop(0, '#0C0F15');
        bgGrad.addColorStop(0.5, '#141B26');
        bgGrad.addColorStop(1, '#0C0F15');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 600, 760);

        // Cyber Grid Lines
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < 600; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 760);
          ctx.stroke();
        }
        for (let y = 0; y < 760; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(600, y);
          ctx.stroke();
        }

        // Circular chromatic glows
        const glow1 = ctx.createRadialGradient(120, 140, 10, 120, 140, 180);
        glow1.addColorStop(0, 'rgba(0, 229, 255, 0.25)');
        glow1.addColorStop(1, 'transparent');
        ctx.fillStyle = glow1;
        ctx.fillRect(0, 0, 600, 760);

        const glow2 = ctx.createRadialGradient(480, 220, 10, 480, 220, 180);
        glow2.addColorStop(0, 'rgba(236, 72, 153, 0.25)');
        glow2.addColorStop(1, 'transparent');
        ctx.fillStyle = glow2;
        ctx.fillRect(0, 0, 600, 760);

        // Header Brand
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('NEKO', 50, 65);

        ctx.fillStyle = '#C7F36B';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('SEU TEMPO. SUA VIDA.', 50, 88);

        // User Name Tag
        ctx.fillStyle = '#AAB6C5';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(user.name, 550, 65);
        ctx.fillStyle = '#65D6C5';
        ctx.font = '12px sans-serif';
        ctx.fillText('Equilíbrio Digital', 550, 85);
        ctx.textAlign = 'left';

        // Outer Frame
        ctx.strokeStyle = '#202D3D';
        ctx.lineWidth = 2;
        ctx.strokeRect(35, 110, 530, 610);

        // Mascot Placeholder Circle with Iridescent Ring
        const ringGrad = ctx.createLinearGradient(200, 160, 400, 360);
        ringGrad.addColorStop(0, '#00E5FF');
        ringGrad.addColorStop(0.3, '#3B82F6');
        ringGrad.addColorStop(0.6, '#8B5CF6');
        ringGrad.addColorStop(0.8, '#EC4899');
        ringGrad.addColorStop(1, '#C7F36B');

        ctx.strokeStyle = ringGrad;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(300, 240, 80, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#080B10';
        ctx.beginPath();
        ctx.arc(300, 240, 76, 0, Math.PI * 2);
        ctx.fill();

        // Glowing white cat eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#00E5FF';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(280, 235, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(320, 235, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Level & Title Banner
        ctx.fillStyle = '#C7F36B';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`NÍVEL ${currentLevel} · ${levelTitle.toUpperCase()}`, 300, 365);

        // Stats Box
        ctx.fillStyle = '#192331';
        ctx.fillRect(60, 395, 480, 85);
        ctx.strokeStyle = '#202D3D';
        ctx.strokeRect(60, 395, 480, 85);

        // 3 Stats in Box
        // Stat 1: Total XP
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px monospace';
        ctx.fillText(`${totalXP} XP`, 140, 435);
        ctx.fillStyle = '#AAB6C5';
        ctx.font = '11px sans-serif';
        ctx.fillText('TOTAL ACUMULADO', 140, 458);

        // Stat 2: Streak
        ctx.fillStyle = '#F28BB5';
        ctx.font = 'bold 24px monospace';
        ctx.fillText(`${streak} DIAS`, 300, 435);
        ctx.fillStyle = '#AAB6C5';
        ctx.font = '11px sans-serif';
        ctx.fillText('SEQUÊNCIA ATIVA', 300, 458);

        // Stat 3: Balance Score
        ctx.fillStyle = '#00E5FF';
        ctx.font = 'bold 24px monospace';
        ctx.fillText(`${todayBalance.score}/100`, 460, 435);
        ctx.fillStyle = '#AAB6C5';
        ctx.font = '11px sans-serif';
        ctx.fillText('ÍNDICE EQUILÍBRIO', 460, 458);

        // Milestone Box
        ctx.fillStyle = '#141B26';
        ctx.fillRect(60, 500, 480, 115);
        ctx.strokeStyle = 'rgba(199, 243, 107, 0.3)';
        ctx.strokeRect(60, 500, 480, 115);

        ctx.fillStyle = '#C7F36B';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('★ CONQUISTA DESBLOQUEADA', 300, 528);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(currentMilestone.title, 300, 555);

        ctx.fillStyle = '#AAB6C5';
        ctx.font = '12px sans-serif';
        ctx.fillText(currentMilestone.description, 300, 580);

        // Footer in card
        ctx.fillStyle = '#65D6C5';
        ctx.font = '11px monospace';
        ctx.fillText('#NEKO #EQUILIBRIODIGITAL #SEUTEMPOSUAVIDA', 300, 680);
        ctx.textAlign = 'left';

        // Export as PNG
        const link = document.createElement('a');
        link.download = `neko-conquista-${user.name.toLowerCase().replace(/\s+/g, '-')}-nivel-${currentLevel}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        setMascotToast('Cartão de conquista baixado em alta resolução!');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="w-full max-w-lg bg-[#141B26] border border-[#202D3D] rounded-3xl p-6 shadow-2xl relative my-auto max-h-[95vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#AAB6C5] hover:text-[#F5F7FA] hover:bg-[#202D3D] transition-colors cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="w-5 h-5 text-[#C7F36B]" />
            <div>
              <h2 className="text-lg font-bold text-[#F5F7FA]">Compartilhar Conquista</h2>
              <p className="text-xs text-[#AAB6C5]">Gere um cartão oficial do seu progresso para postar em suas redes</p>
            </div>
          </div>

          {/* Milestone Selector */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#AAB6C5] uppercase tracking-wider mb-1.5">
              Escolha o Marco a Destacar
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {unlockedAchievements.map(ach => (
                <button
                  key={ach.id}
                  type="button"
                  onClick={() => setChosenMilestoneId(ach.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    chosenMilestoneId === ach.id
                      ? 'bg-[#C7F36B] text-[#0A0D14] shadow-sm font-bold'
                      : 'bg-[#192331] text-[#AAB6C5] hover:text-[#F5F7FA] border border-[#202D3D]'
                  }`}
                >
                  {ach.title}
                </button>
              ))}
            </div>
          </div>

          {/* PREVIEW OF THE SOCIAL CARD */}
          <div 
            ref={cardRef}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0C0F15] via-[#141B26] to-[#0C0F15] border-2 border-[#202D3D] p-6 shadow-2xl text-center select-none"
          >
            {/* Cyber Grid Texture */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{
                backgroundImage: 'linear-gradient(to right, #00E5FF 1px, transparent 1px), linear-gradient(to bottom, #00E5FF 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Glowing Corner Auras */}
            <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-[#00E5FF]/20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-[#EC4899]/20 blur-2xl pointer-events-none" />

            {/* Top Brand Bar */}
            <div className="flex items-center justify-between mb-4 relative z-10 text-left border-b border-[#202D3D]/60 pb-3">
              <div>
                <span className="text-base font-black text-[#F5F7FA] tracking-tight">NEKO</span>
                <span className="block text-[9px] font-bold text-[#C7F36B] uppercase tracking-wider">
                  Seu tempo. Sua vida.
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#F5F7FA] block">{user.name}</span>
                <span className="text-[10px] text-[#00E5FF] font-medium">Equilíbrio Digital</span>
              </div>
            </div>

            {/* Mascot in Center Stage */}
            <div className="my-2 relative flex justify-center z-10">
              <NekoMascot size="lg" mood="celebrating" showAura={true} />
            </div>

            {/* Level & Title */}
            <div className="relative z-10 mt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#202D3D] text-[#C7F36B] text-xs font-bold border border-[#C7F36B]/30 mb-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>NÍVEL {currentLevel} · {levelTitle}</span>
              </div>
            </div>

            {/* Big Stats Row */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#192331]/80 border border-[#202D3D] my-4 relative z-10 text-center">
              <div>
                <span className="text-xs font-semibold text-[#AAB6C5] block">Experiência</span>
                <span className="text-base font-black text-[#F5F7FA] tabular-nums">{totalXP} XP</span>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#AAB6C5] block">Sequência</span>
                <span className="text-base font-black text-[#F28BB5] tabular-nums flex items-center justify-center gap-0.5">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  {streak}d
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#AAB6C5] block">Índice</span>
                <span className="text-base font-black text-[#00E5FF] tabular-nums">{todayBalance.score}/100</span>
              </div>
            </div>

            {/* Highlighted Milestone Card */}
            <div className="p-3.5 rounded-xl bg-[#141B26] border border-[#C7F36B]/40 relative z-10 text-center">
              <span className="text-[10px] font-bold text-[#C7F36B] uppercase tracking-wider block mb-0.5">
                ★ Conquista Recente
              </span>
              <h4 className="text-sm font-bold text-[#F5F7FA]">{currentMilestone.title}</h4>
              <p className="text-xs text-[#AAB6C5] mt-0.5 line-clamp-2">
                "{currentMilestone.description}"
              </p>
            </div>

            {/* Hashtag Footer */}
            <div className="mt-4 pt-2 border-t border-[#202D3D]/50 text-[10px] font-mono text-[#65D6C5] tracking-wider relative z-10">
              #NEKOBalance #EquilibrioDigital #SeuTempoSuaVida
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-5">
            {/* Download Image Button */}
            <button
              onClick={handleDownloadCard}
              disabled={downloading}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#C7F36B] hover:bg-[#b8eb52] text-[#0A0D14] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{downloading ? 'Gerando...' : 'Baixar Imagem'}</span>
            </button>

            {/* Copy Text Button */}
            <button
              onClick={handleCopyText}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#192331] hover:bg-[#202D3D] text-[#F5F7FA] text-xs font-semibold border border-[#202D3D] hover:border-[#00E5FF]/40 transition-all cursor-pointer active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#C7F36B]" />
                  <span className="text-[#C7F36B]">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#00E5FF]" />
                  <span>Copiar Resumo</span>
                </>
              )}
            </button>

            {/* Native Mobile Share */}
            <button
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#192331] hover:bg-[#202D3D] text-[#F5F7FA] text-xs font-semibold border border-[#202D3D] hover:border-[#EC4899]/40 transition-all cursor-pointer active:scale-95"
            >
              <Share2 className="w-4 h-4 text-[#EC4899]" />
              <span>Compartilhar</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
