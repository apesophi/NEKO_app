import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthMode } from '../../types';
import { NekoMascot } from '../NekoMascot';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const { login, register, enterDemoMode } = useApp();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    if (mode === 'recovery') {
      setSuccess('Instruções de recuperação foram enviadas para seu e-mail (simulação demonstrativa).');
      setTimeout(() => {
        setMode('login');
        setSuccess(null);
      }, 2500);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Por favor, informe seu nome.');
        return;
      }
      if (password !== confirmPassword) {
        setError('As senhas não coincidem. Verifique e tente novamente.');
        return;
      }

      const ok = register(name, email, password);
      if (ok) {
        setSuccess('Conta criada com sucesso! Preparando sua experiência...');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1000);
      }
    } else {
      // Login
      const ok = login(email, password);
      if (ok) {
        setSuccess('Login efetuado com sucesso!');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 800);
      }
    }
  };

  const handleDemoClick = () => {
    enterDemoMode();
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#192331] border border-[#202D3D] rounded-3xl p-6 md:p-8 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#AAB6C5] hover:text-[#F5F7FA] hover:bg-[#202D3D] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mascot & Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <NekoMascot size="md" mood={mode === 'recovery' ? 'thinking' : 'happy'} showAura={true} />
          <h2 className="text-xl font-bold text-[#F5F7FA] mt-2">
            {mode === 'login' && 'Bem-vindo de volta ao NEKO'}
            {mode === 'register' && 'Crie sua conta no NEKO'}
            {mode === 'recovery' && 'Recuperar acesso'}
          </h2>
          <p className="text-xs text-[#AAB6C5] mt-1">
            {mode === 'login' && 'Acesse seus registros e continue sua jornada de equilíbrio.'}
            {mode === 'register' && 'Comece a recuperar o controle sobre seu tempo agora mesmo.'}
            {mode === 'recovery' && 'Digite seu e-mail cadastrado para redefinir sua senha.'}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#C7F36B] text-xs font-medium mb-4">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#AAB6C5] mb-1">Seu Nome</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alexandre Souza"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#10151D] border border-[#202D3D] text-[#F5F7FA] text-sm focus:outline-none focus:border-[#C7F36B] placeholder:text-[#AAB6C5]/40"
                />
                <UserIcon className="w-4 h-4 text-[#AAB6C5] absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#AAB6C5] mb-1">E-mail</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#10151D] border border-[#202D3D] text-[#F5F7FA] text-sm focus:outline-none focus:border-[#C7F36B] placeholder:text-[#AAB6C5]/40"
              />
              <Mail className="w-4 h-4 text-[#AAB6C5] absolute left-3 top-3" />
            </div>
          </div>

          {mode !== 'recovery' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#AAB6C5]">Senha</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('recovery');
                      setError(null);
                    }}
                    className="text-[11px] text-[#65D6C5] hover:underline cursor-pointer"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#10151D] border border-[#202D3D] text-[#F5F7FA] text-sm focus:outline-none focus:border-[#C7F36B]"
                />
                <Lock className="w-4 h-4 text-[#AAB6C5] absolute left-3 top-3" />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#AAB6C5] mb-1">Confirmar Senha</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#10151D] border border-[#202D3D] text-[#F5F7FA] text-sm focus:outline-none focus:border-[#C7F36B]"
                />
                <Lock className="w-4 h-4 text-[#AAB6C5] absolute left-3 top-3" />
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-[#C7F36B] text-[#10151D] font-bold text-sm shadow-md hover:bg-[#b8eb52] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {mode === 'login' && 'Entrar na Conta'}
              {mode === 'register' && 'Cadastrar e Começar'}
              {mode === 'recovery' && 'Enviar Instruções'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="mt-4 text-center text-xs text-[#AAB6C5]">
          {mode === 'login' && (
            <p>
              Ainda não tem conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="text-[#C7F36B] font-semibold hover:underline cursor-pointer"
              >
                Cadastre-se gratuitamente
              </button>
            </p>
          )}

          {mode === 'register' && (
            <p>
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-[#C7F36B] font-semibold hover:underline cursor-pointer"
              >
                Faça login
              </button>
            </p>
          )}

          {mode === 'recovery' && (
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className="text-[#AAB6C5] hover:text-[#F5F7FA] hover:underline cursor-pointer"
            >
              Voltar para o login
            </button>
          )}
        </div>

        {/* 1-Click Academic Demo Button */}
        <div className="mt-6 pt-5 border-t border-[#202D3D] text-center">
          <p className="text-[11px] text-[#AAB6C5] mb-2">Para avaliação rápida de banca ou aula:</p>
          <button
            type="button"
            onClick={handleDemoClick}
            className="w-full py-2.5 px-4 rounded-xl bg-[#202D3D] hover:bg-[#26364a] text-xs font-semibold text-[#65D6C5] border border-[#65D6C5]/30 transition-colors cursor-pointer"
          >
            Entrar como Convidado (Dados Demonstrativos)
          </button>
        </div>
      </div>
    </div>
  );
};
