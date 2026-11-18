// src/pages/PregnancyPage.tsx
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { getWeeklyData } from '../data/pregnancyWeeklyData';
import { 
  Heart, 
  Baby, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Activity, 
  FileCheck, 
  Briefcase,
  AlertCircle,
  TrendingUp,
  Info,
  Layers,
  BookOpen,
  Users,
  ShieldCheck,
  RotateCw,
  FolderHeart,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PregnancyPage: React.FC = () => {
  const { pregnancy, updatePregnancy } = useData();
  const { setProfileMode } = useAuth();

  const currentWeek = pregnancy.currentWeek || 28;
  const weeklyData = getWeeklyData(currentWeek);

  // Quick edit week / calculation state
  const [isEditingWeek, setIsEditingWeek] = useState(false);
  const [tempWeek, setTempWeek] = useState(currentWeek);

  const handleSaveWeek = () => {
    updatePregnancy({ currentWeek: tempWeek });
    setIsEditingWeek(false);
  };

  const navCards = [
    {
      title: '3D-малыш по неделям',
      desc: 'Интерактивная 3D-модель плода 360°, приближение, анатомические фокусы и звуки',
      to: '/pregnancy/3d-baby',
      icon: '✨',
      badge: 'Приоритет 1',
      color: 'bg-softblue-50 border-softblue-200 text-softblue-900'
    },
    {
      title: 'Размер малыша (Фрукты)',
      desc: 'Сравнение с 40 фруктами и овощами, интерактивная 3D-модель плода недели',
      to: '/pregnancy/baby-size',
      icon: '🍆',
      badge: 'Приоритет 1',
      color: 'bg-warmbeige-50 border-warmbeige-200 text-sage-900'
    },
    {
      title: 'Интерактивная анатомия',
      desc: '3D-исследование матки, плаценты, пуповины, околоплодных вод и шейки матки',
      to: '/pregnancy/anatomy',
      icon: '🧬',
      badge: 'Приоритет 2',
      color: 'bg-sage-50 border-sage-200 text-sage-900'
    },
    {
      title: 'Развитие органов плода',
      desc: 'Формирование мозга, сердца, легких, скелета, органов чувств по неделям',
      to: '/pregnancy/organs',
      icon: '🧠',
      badge: 'Приоритет 2',
      color: 'bg-softblue-50 border-softblue-200 text-softblue-900'
    },
    {
      title: 'Календарь беременности',
      desc: 'Официальные скрининги МЗ РК, визиты, анализы и личные напоминания',
      to: '/pregnancy/calendar',
      icon: '🗓️',
      badge: 'Приоритет 1',
      color: 'bg-warmbeige-50 border-warmbeige-200 text-sage-900'
    },
    {
      title: 'Дневник мамы',
      desc: 'Настроение, симптомы, вес, сон, заметки и фотохроника животика',
      to: '/pregnancy/diary',
      icon: '📖',
      badge: 'Приоритет 1',
      color: 'bg-sage-50 border-sage-200 text-sage-900'
    },
    {
      title: 'Шевеления (Счетчик Cardiff)',
      desc: 'Подсчет 10 движений, таймер, история активности и красные флаги',
      to: '/pregnancy/movements',
      icon: '💓',
      badge: 'Приоритет 2',
      color: 'bg-rose-50 border-rose-200 text-rose-950'
    },
    {
      title: 'Школа беременности',
      desc: 'Короткие доказательные уроки по триместрам, ГВ, уходу за новорожденным',
      to: '/pregnancy/school',
      icon: '🎓',
      badge: 'Приоритет 3',
      color: 'bg-warmbeige-50 border-warmbeige-200 text-sage-900'
    },
    {
      title: 'Раздел для папы',
      desc: 'Партнерская поддержка: понимание мамы, партнерские роды, подготовка дома',
      to: '/pregnancy/for-dad',
      icon: '👨‍🍼',
      badge: 'Приоритет 3',
      color: 'bg-softblue-50 border-softblue-200 text-softblue-900'
    },
    {
      title: 'Сумка в роддом и роды',
      desc: 'Чек-лист вещей (мама, малыш, документы), план родов и вопросы врачу',
      to: '/pregnancy/birth-prep',
      icon: '💼',
      badge: 'Приоритет 3',
      color: 'bg-sage-50 border-sage-200 text-sage-900'
    },
    {
      title: 'Медицинская карта беременности',
      desc: 'Защищенный архив УЗИ, скринингов, анализов с приватным хранилищем',
      to: '/pregnancy/medical-card',
      icon: '📁',
      badge: 'Приоритет 2',
      color: 'bg-warmbeige-50 border-warmbeige-200 text-sage-900'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-softblue-800 bg-softblue-100 px-3 py-1 rounded-full">
              Экосистема NESTA • Ведение беременности
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900 mt-2">
            Беременность: комплексный обзор
          </h1>
          <p className="text-xs sm:text-sm text-sage-600 mt-1">
            Неделя за неделей: интерактивные 3D-модели, клинические протоколы, дневники и подготовка семьи
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setProfileMode('pregnancy')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white font-bold text-xs shadow-soft transition-all"
          >
            <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
            <span>Активный профиль</span>
          </button>
        </div>
      </div>

      {/* Main Gestational Banner */}
      <div className="bg-gradient-to-br from-softblue-900 via-slate-900 to-sage-950 rounded-4xl p-6 sm:p-8 text-white shadow-soft-xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          <div className="md:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-softblue-200 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                {weeklyData.trimester}-й триместр • {currentWeek}-я неделя
              </span>

              <button
                onClick={() => setIsEditingWeek(!isEditingWeek)}
                className="text-xs text-softblue-300 hover:text-white underline font-medium"
              >
                {isEditingWeek ? 'Закрыть' : 'Изменить срок'}
              </button>
            </div>

            {isEditingWeek && (
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 max-w-sm space-y-2">
                <span className="text-xs font-bold text-white block">Укажите срок по данным УЗИ:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="4"
                    max="40"
                    value={tempWeek}
                    onChange={(e) => setTempWeek(Number(e.target.value))}
                    className="flex-1 accent-softblue-400"
                  />
                  <span className="w-12 text-center text-xs font-bold text-white">{tempWeek} нед</span>
                  <button
                    onClick={handleSaveWeek}
                    className="px-3 py-1 bg-softblue-500 hover:bg-softblue-600 text-white rounded-xl text-xs font-bold"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}

            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
              Малыш размером с <span className="text-softblue-200">{weeklyData.babyFruitComparison}</span> {weeklyData.fruitEmoji}
            </h2>

            <p className="text-xs sm:text-sm text-softblue-100 leading-relaxed max-w-xl">
              {weeklyData.fetalDevelopment}
            </p>

            {/* Quick Metrics */}
            <div className="pt-2 flex flex-wrap gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <span className="text-softblue-200 block text-[10px] uppercase font-bold">Вес плода</span>
                <span className="text-base font-bold text-white">{weeklyData.babyWeightEstimate}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <span className="text-softblue-200 block text-[10px] uppercase font-bold">Длина (макушка-пятки)</span>
                <span className="text-base font-bold text-white">{weeklyData.babyLengthEstimate}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <span className="text-softblue-200 block text-[10px] uppercase font-bold">ПДР (Дата родов)</span>
                <span className="text-base font-bold text-white">5 февраля 2027</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Link
                to="/pregnancy/3d-baby"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-softblue-50 text-slate-900 font-bold text-xs shadow-soft transition-all"
              >
                <Sparkles className="w-4 h-4 text-softblue-700" />
                <span>Открыть 3D-малыша (360°)</span>
              </Link>
            </div>
          </div>

          {/* Right Circular Gauge */}
          <div className="md:col-span-4 flex justify-center">
            <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-white/10 border-4 border-white/20 p-4 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-soft-xl">
              <div className="text-5xl sm:text-6xl mb-1">{weeklyData.fruitEmoji}</div>
              <span className="text-xs font-bold text-softblue-100">{currentWeek} недель из 40</span>
              <div className="w-36 bg-white/20 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-softblue-400 h-full rounded-full transition-all"
                  style={{ width: `${(currentWeek / 40) * 100}%` }}
                />
              </div>
              <span className="text-[11px] text-softblue-200 mt-1.5 font-medium">
                Осталось ~{Math.max(0, 40 - currentWeek)} недель (84 дня)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of All 11 Pregnancy Subsections (As per Section 17) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-sage-200">
          <div>
            <h3 className="text-lg font-bold font-display text-sage-900">
              Все разделы сопровождения беременности
            </h3>
            <p className="text-xs text-sage-500">
              Единая связанная цифровая экосистема NESTA
            </p>
          </div>
          <span className="text-xs font-semibold text-sage-600 bg-sage-100 px-3 py-1 rounded-full">
            11 специализированных модулей
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {navCards.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className={`p-5 rounded-3xl border ${card.color} shadow-soft hover:shadow-soft-lg hover:scale-[1.01] transition-all flex flex-col justify-between space-y-4 group`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2 rounded-2xl bg-white/80 shadow-xs">{card.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600 bg-white/90 px-2.5 py-0.5 rounded-full border border-sage-200">
                    {card.badge}
                  </span>
                </div>

                <h4 className="text-base font-bold font-display text-sage-900 group-hover:text-softblue-900 transition-colors">
                  {card.title}
                </h4>

                <p className="text-xs text-sage-600 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs font-bold text-sage-800">
                <span>Перейти в модуль</span>
                <ChevronRight className="w-4 h-4 text-sage-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
