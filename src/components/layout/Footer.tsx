// src/components/layout/Footer.tsx
import React from 'react';
import { HeartPulse, Shield, PhoneCall, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC<{ onOpenEmergency?: () => void }> = ({ onOpenEmergency }) => {
  return (
    <footer className="bg-sage-900 text-sage-200 pt-16 pb-12 border-t border-sage-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Emergency Banner */}
        <div className="mb-12 p-6 rounded-3xl bg-sage-800/80 border border-sage-700/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Экстренная медицинская помощь в Казахстане</h4>
              <p className="text-xs text-sage-300">
                При жизнеугрожающих состояниях немедленно вызывайте скорую помощь
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:103"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>103 — Скорая</span>
            </a>
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sage-700 hover:bg-sage-600 text-white font-bold text-sm transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>112 — Спасение</span>
            </a>
            {onOpenEmergency && (
              <button
                onClick={onOpenEmergency}
                className="text-xs text-sage-300 hover:text-white underline underline-offset-4 ml-1"
              >
                Памятка триажа
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-sage-800">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sage-700 text-sage-100 flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold font-display text-white tracking-tight">NESTA</span>
            </div>
            <p className="text-xs text-sage-300 leading-relaxed">
              Персональная медицинская платформа для будущих родителей и семей с детьми от рождения до 3 лет.
            </p>
            <p className="text-xs font-serif italic text-sage-400">
              «Забота начинается с понимания»
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Платформа</h5>
            <ul className="space-y-2.5 text-xs text-sage-300">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Личный кабинет</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-white transition-colors">AI-медицинский ассистент</Link></li>
              <li><Link to="/health-control" className="hover:text-white transition-colors">Контроль роста и стандарты ВОЗ</Link></li>
              <li><Link to="/symptom-checker" className="hover:text-white transition-colors">Проверка симптомов (Триаж)</Link></li>
              <li><Link to="/medical-archive" className="hover:text-white transition-colors">Семейная медкарта</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Ценности</h5>
            <ul className="space-y-2.5 text-xs text-sage-300">
              <li><a href="#understanding" className="hover:text-white transition-colors">Понимание сложных анализов</a></li>
              <li><a href="#control" className="hover:text-white transition-colors">Контроль динамики развития</a></li>
              <li><a href="#calm" className="hover:text-white transition-colors">Спокойствие родителей</a></li>
              <li><Link to="/family" className="hover:text-white transition-colors">Совместный доступ для мамы и папы</Link></li>
              <li><Link to="/pregnancy" className="hover:text-white transition-colors">Режим беременности</Link></li>
            </ul>
          </div>

          {/* Medical disclaimer */}
          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Безопасность и право</h5>
            <div className="flex items-start gap-2 text-xs text-sage-400 leading-relaxed bg-sage-800/40 p-3.5 rounded-2xl border border-sage-700/50">
              <Shield className="w-4 h-4 text-sage-300 shrink-0 mt-0.5" />
              <p className="text-[11px]">
                NESTA не заменяет очную консультацию врача-педиатра, не ставит клинический диагноз и не назначает медикаментозное лечение. Платформа носит информационный и аналитический характер.
              </p>
            </div>
            <p className="text-[11px] text-sage-500 mt-3">
              Шифрование медицинских данных и конфиденциальность семейной тайны.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-sage-400 gap-4">
          <p>© {new Date().getFullYear()} NESTA HealthTech. Все права защищены.</p>
          <div className="flex items-center gap-6">
            <span className="text-sage-500 hover:text-sage-300 cursor-pointer">Политика конфиденциальности</span>
            <span className="text-sage-500 hover:text-sage-300 cursor-pointer">Пользовательское соглашение</span>
            <span className="text-sage-500 hover:text-sage-300 cursor-pointer">Медицинский регламент</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
