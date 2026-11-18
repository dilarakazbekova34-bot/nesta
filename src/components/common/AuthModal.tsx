// src/components/common/AuthModal.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  HeartPulse, 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Baby, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'mother' | 'father' | 'guardian'>('mother');

  if (!isOpen) return null;

  const handleDemoLogin = (userRole: 'mother' | 'father') => {
    if (userRole === 'mother') {
      login('anna.sabitova@example.com', 'mother');
    } else {
      login('mikhail.sabitov@example.com', 'father');
    }
    onClose();
    navigate('/dashboard');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (mode === 'login') {
      login(email, role);
    } else {
      register(name || 'Пользователь NESTA', email, role);
    }
    onClose();
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-4xl shadow-soft-xl border border-sage-100 overflow-hidden">
        {/* Header with NESTA Branding */}
        <div className="px-6 pt-6 pb-4 bg-warmbeige-50/80 border-b border-sage-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sage-800 text-white flex items-center justify-center shadow-xs">
              <HeartPulse className="w-5 h-5 text-sage-200" />
            </div>
            <div>
              <span className="text-xl font-bold font-display text-sage-900 tracking-tight">NESTA</span>
              <p className="text-[11px] text-sage-600 font-medium">Забота начинается с понимания</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-sage-400 hover:text-sage-700 hover:bg-sage-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Fast Demo One-Click Access Banner */}
          <div className="p-4 rounded-3xl bg-sage-100/70 border border-sage-200/80 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-sage-900">
              <Sparkles className="w-4 h-4 text-sage-700" />
              <span>Быстрый вход в демо-аккаунт семьи (1 клик):</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('mother')}
                className="p-2.5 rounded-2xl bg-white hover:bg-sage-50 border border-sage-200 text-xs font-semibold text-sage-800 text-center shadow-xs transition-colors"
              >
                👩 Войти как Мама (Анна)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('father')}
                className="p-2.5 rounded-2xl bg-white hover:bg-sage-50 border border-sage-200 text-xs font-semibold text-sage-800 text-center shadow-xs transition-colors"
              >
                👨 Войти как Папа (Михаил)
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-sage-200"></div>
            <span className="flex-shrink mx-3 text-[11px] text-sage-400 font-semibold uppercase">или через email</span>
            <div className="flex-grow border-t border-sage-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1">
                  Ваше имя
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Анна Сабитова"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-sage-700 mb-1">
                Электронная почта
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-sage-700 mb-1">
                Пароль
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                />
              </div>
            </div>

            {/* Role picker */}
            <div>
              <label className="block text-xs font-semibold text-sage-700 mb-1.5">
                Ваша роль в семье
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'mother', label: 'Мама' },
                  { id: 'father', label: 'Папа' },
                  { id: 'guardian', label: 'Опекун' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as any)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      role === r.id
                        ? 'bg-sage-800 text-white border-sage-800 shadow-xs'
                        : 'border-sage-200 text-sage-700 hover:bg-sage-50'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white font-semibold text-sm transition-all shadow-soft flex items-center justify-center gap-2"
            >
              <span>{mode === 'login' ? 'Войти в личный кабинет' : 'Зарегистрироваться'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle login vs register */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-xs text-sage-600 hover:text-sage-900 font-semibold"
            >
              {mode === 'login'
                ? 'Впервые в NESTA? Зарегистрируйтесь бесплатно'
                : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
