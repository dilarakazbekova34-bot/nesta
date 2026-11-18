// src/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  Activity, 
  Heart, 
  Stethoscope, 
  FolderHeart, 
  Users, 
  Settings, 
  HeartPulse,
  LogOut,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Calendar,
  Baby,
  Briefcase,
  Layers,
  FileCheck,
  Scale
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface SidebarProps {
  onCloseMobile?: () => void;
  onOpenOnboarding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile, onOpenOnboarding }) => {
  const { user, logout, profileMode, setProfileMode } = useAuth();
  const { pregnancy } = useData();
  const location = useLocation();

  const [pregnancyOpen, setPregnancyOpen] = useState(true);
  const [childOpen, setChildOpen] = useState(true);

  const isPregnancyActive = location.pathname.startsWith('/pregnancy');
  const isChildActive = location.pathname.startsWith('/health-control') || 
                        location.pathname.startsWith('/symptom-checker') || 
                        location.pathname.startsWith('/medical-archive');

  return (
    <aside className="w-72 h-full flex flex-col bg-white border-r border-sage-200/80 select-none">
      {/* Brand Header */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-sage-100 shrink-0">
        <NavLink to="/" className="flex items-center gap-3 group" onClick={onCloseMobile}>
          <div className="w-10 h-10 rounded-2xl bg-sage-800 text-white flex items-center justify-center shadow-soft transition-transform group-hover:scale-105">
            <HeartPulse className="w-5 h-5 text-sage-200" />
          </div>
          <div>
            <span className="text-xl font-bold font-display tracking-tight text-sage-900 flex items-center gap-1">
              NESTA
              <span className="w-1.5 h-1.5 rounded-full bg-sage-500"></span>
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-sage-500 block -mt-1">
              Family HealthTech
            </span>
          </div>
        </NavLink>
      </div>

      {/* Nav List with Scrollbar */}
      <div className="flex-1 px-3.5 py-4 space-y-4 overflow-y-auto">
        {/* 1. ГЛАВНАЯ */}
        <div>
          <div className="px-3 mb-1 text-[10px] font-bold text-sage-400 uppercase tracking-wider">
            Главная
          </div>
          <NavLink
            to="/dashboard"
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-sage-800 text-white shadow-soft'
                  : 'text-sage-700 hover:bg-sage-50 hover:text-sage-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className={`w-4 h-4 ${isActive ? 'text-sage-200' : 'text-sage-500'}`} />
                  <span>Панель управления</span>
                </div>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-sage-300"></span>}
              </>
            )}
          </NavLink>
        </div>

        {/* 2. БЕРЕМЕННОСТЬ (Accordion or Full Section) */}
        <div>
          <button
            type="button"
            onClick={() => setPregnancyOpen(!pregnancyOpen)}
            className="w-full px-3 mb-1 flex items-center justify-between text-[10px] font-bold text-sage-400 uppercase tracking-wider hover:text-sage-700 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Беременность ({pregnancy.currentWeek || 28} нед.)</span>
            </span>
            {pregnancyOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {pregnancyOpen && (
            <div className="space-y-0.5 pl-1.5">
              {[
                { name: 'Обзор беременности', to: '/pregnancy', end: true },
                { name: '3D-малыш (360°)', to: '/pregnancy/3d-baby', badge: '3D' },
                { name: 'Размер малыша (Фрукты)', to: '/pregnancy/baby-size' },
                { name: 'Интерактивная анатомия', to: '/pregnancy/anatomy', badge: '3D' },
                { name: 'Развитие органов', to: '/pregnancy/organs' },
                { name: 'Календарь беременности', to: '/pregnancy/calendar' },
                { name: 'Дневник мамы', to: '/pregnancy/diary' },
                { name: 'Шевеления плода', to: '/pregnancy/movements' },
                { name: 'Школа беременности', to: '/pregnancy/school' },
                { name: 'Раздел для папы', to: '/pregnancy/for-dad' },
                { name: 'Подготовка к родам', to: '/pregnancy/birth-prep' },
                { name: 'Медицинская карта', to: '/pregnancy/medical-card' },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-softblue-100 text-softblue-900 font-bold border border-softblue-200/80 shadow-xs'
                        : 'text-sage-600 hover:bg-sage-50 hover:text-sage-900'
                    }`
                  }
                >
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-softblue-600 text-white shrink-0">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* 3. ЗДОРОВЬЕ РЕБЁНКА */}
        <div>
          <button
            type="button"
            onClick={() => setChildOpen(!childOpen)}
            className="w-full px-3 mb-1 flex items-center justify-between text-[10px] font-bold text-sage-400 uppercase tracking-wider hover:text-sage-700 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Baby className="w-3.5 h-3.5 text-sage-600" />
              <span>Здоровье ребёнка (0–3 года)</span>
            </span>
            {childOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {childOpen && (
            <div className="space-y-0.5 pl-1.5">
              {[
                { name: 'Развитие и графики ВОЗ', to: '/health-control', icon: Activity },
                { name: 'Проверка симптомов', to: '/symptom-checker', icon: Stethoscope, badge: 'Триаж' },
                { name: 'Медицинская карта ребёнка', to: '/medical-archive', icon: FolderHeart },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-sage-100 text-sage-900 font-bold border border-sage-200 shadow-xs'
                          : 'text-sage-600 hover:bg-sage-50 hover:text-sage-900'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className="w-3.5 h-3.5 text-sage-500 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-600 text-white shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. ЗНАНИЯ И ПОДДЕРЖКА */}
        <div>
          <div className="px-3 mb-1 text-[10px] font-bold text-sage-400 uppercase tracking-wider">
            Знания и AI-поддержка
          </div>
          <div className="space-y-0.5">
            <NavLink
              to="/library"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sage-800 text-white shadow-soft font-bold'
                    : 'text-sage-700 hover:bg-sage-50 hover:text-sage-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <BookOpen className={`w-4 h-4 ${isActive ? 'text-sage-200' : 'text-sage-500'}`} />
                    <span>Медицинская библиотека</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    isActive ? 'bg-sage-700 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    ВОЗ/МЗ РК
                  </span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/ai-assistant"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sage-800 text-white shadow-soft font-bold'
                    : 'text-sage-700 hover:bg-sage-50 hover:text-sage-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <Sparkles className={`w-4 h-4 ${isActive ? 'text-sage-200' : 'text-sage-500'}`} />
                    <span>AI-ассистент NESTA</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    isActive ? 'bg-sage-700 text-white' : 'bg-softblue-100 text-softblue-800'
                  }`}>
                    AI
                  </span>
                </>
              )}
            </NavLink>
          </div>
        </div>

        {/* 5. СЕМЬЯ */}
        <div>
          <div className="px-3 mb-1 text-[10px] font-bold text-sage-400 uppercase tracking-wider">
            Семья
          </div>
          <div className="space-y-0.5">
            <NavLink
              to="/calendar"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sage-800 text-white shadow-soft font-bold'
                    : 'text-sage-700 hover:bg-sage-50 hover:text-sage-900'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-sage-500" />
                <span>Общий календарь</span>
              </div>
            </NavLink>

            <NavLink
              to="/family"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sage-800 text-white shadow-soft font-bold'
                    : 'text-sage-700 hover:bg-sage-50 hover:text-sage-900'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-sage-500" />
                <span>Моя семья</span>
              </div>
            </NavLink>

            <NavLink
              to="/settings"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sage-800 text-white shadow-soft font-bold'
                    : 'text-sage-700 hover:bg-sage-50 hover:text-sage-900'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-sage-500" />
                <span>Настройки</span>
              </div>
            </NavLink>
          </div>
        </div>
      </div>

      {/* User profile & Onboarding pill at bottom */}
      <div className="p-4 border-t border-sage-100 bg-warmbeige-50/50 shrink-0 space-y-2">
        {onOpenOnboarding && (
          <button
            onClick={onOpenOnboarding}
            className="w-full py-1.5 px-3 rounded-xl bg-sage-100 hover:bg-sage-200 text-sage-800 text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Онбординг настройки</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="flex items-center justify-between p-2 rounded-2xl bg-white border border-sage-200/60 shadow-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256'}
              alt={user?.name || 'Пользователь'}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-sage-200"
            />
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-sage-900 truncate">
                {user?.name || 'Анна Сабитова'}
              </div>
              <div className="text-[10px] text-sage-500 truncate flex items-center gap-1">
                <span>{user?.role === 'father' ? 'Папа' : 'Мама'}</span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">Семейный аккаунт</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 rounded-xl text-sage-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Выйти из аккаунта"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
