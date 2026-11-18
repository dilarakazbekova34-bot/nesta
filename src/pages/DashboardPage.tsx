// src/pages/DashboardPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { getWeeklyData } from '../data/pregnancyWeeklyData';
import { 
  Baby, 
  Heart, 
  Sparkles, 
  Activity, 
  Calendar, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Utensils, 
  Moon, 
  Thermometer, 
  Pill, 
  FileText, 
  Stethoscope, 
  ChevronRight,
  ShieldAlert,
  PhoneCall,
  Scale,
  Briefcase,
  BookOpen
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { QuickLogModal } from '../components/common/QuickLogModal';
import { SAMPLE_AI_QUESTIONS } from '../data/mockData';

export const DashboardPage: React.FC = () => {
  const { user, profileMode, setProfileMode } = useAuth();
  const { 
    child, 
    pregnancy, 
    growthData, 
    diaryEntries, 
    vaccinations, 
    documents,
    sendAiMessage 
  } = useData();

  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [quickLogCategory, setQuickLogCategory] = useState<any>('feeding');

  const currentWeek = pregnancy.currentWeek || 28;
  const weeklyData = getWeeklyData(currentWeek);

  const latestGrowth = growthData[growthData.length - 1];
  const previousGrowth = growthData[growthData.length - 2] || latestGrowth;

  const weightDiff = (latestGrowth.weight - previousGrowth.weight).toFixed(2);
  const heightDiff = (latestGrowth.height - previousGrowth.height).toFixed(1);

  // Child chart data
  const chartData = growthData.map(g => ({
    name: `${g.ageMonths} мес`,
    weight: g.weight,
    height: g.height,
    p50: (3.2 + g.ageMonths * 0.6).toFixed(1)
  }));

  const openQuickLogWith = (cat: any) => {
    setQuickLogCategory(cat);
    setIsQuickLogOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* 1. WELCOME & PROFILE HEADER */}
      <div className="bg-white rounded-4xl p-6 sm:p-8 border border-sage-200/80 shadow-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-gradient-to-br from-sage-100 to-warmbeige-100 rounded-full blur-2xl opacity-60 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={profileMode === 'child' ? child.avatarUrl : 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=80&w=256'}
              alt="Профиль"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover ring-4 ring-sage-100 shadow-sm shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                  profileMode === 'pregnancy' ? 'bg-softblue-100 text-softblue-900' : 'bg-sage-100 text-sage-900'
                }`}>
                  {profileMode === 'pregnancy' ? 'Профиль беременности' : 'Профиль малыша'}
                </span>
                <span className="text-xs text-sage-500 font-medium">
                  {profileMode === 'pregnancy' ? `${weeklyData.trimester}-й триместр` : `Группа крови: ${child.bloodType}`}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900 tracking-tight">
                Добро пожаловать, {user?.name ? user.name.split(' ')[0] : 'Анна'}! 🌿
              </h1>
              <p className="text-xs sm:text-sm text-sage-600 mt-1">
                {profileMode === 'pregnancy'
                  ? `Беременность: ${currentWeek}-я неделя и 3 дня • ПДР 5 февраля 2027 • Малыш: ${weeklyData.babyFruitComparison} ${weeklyData.fruitEmoji}`
                  : `${child.name} • 8 месяцев (родилась 12 марта 2026) • Педиатр: ${child.pediatricianName}`}
              </p>
            </div>
          </div>

          {/* Profile Mode Switcher */}
          <div className="flex items-center gap-2 self-start lg:self-center p-1.5 rounded-2xl bg-warmbeige-100 border border-warmbeige-200">
            <button
              onClick={() => setProfileMode('pregnancy')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                profileMode === 'pregnancy'
                  ? 'bg-white text-softblue-900 shadow-sm font-bold'
                  : 'text-sage-600 hover:text-sage-900'
              }`}
            >
              <Heart className="w-4 h-4 text-softblue-700 fill-softblue-700" />
              <span>Беременность ({currentWeek} нед)</span>
            </button>
            <button
              onClick={() => setProfileMode('child')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                profileMode === 'child'
                  ? 'bg-white text-sage-900 shadow-sm font-bold'
                  : 'text-sage-600 hover:text-sage-900'
              }`}
            >
              <Baby className="w-4 h-4 text-sage-700" />
              <span>{child.name} (8 мес)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Ribbon: adapts to profile mode */}
        {profileMode === 'pregnancy' ? (
          <div className="mt-6 pt-6 border-t border-sage-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-2xl bg-softblue-50/70 border border-softblue-200/50">
              <div className="text-[10px] font-bold text-softblue-700 uppercase">Срок гестации</div>
              <div className="text-xl font-bold text-softblue-950 mt-0.5">{currentWeek} нед. + 3 дня</div>
              <div className="text-[11px] text-softblue-800 font-medium mt-0.5">{weeklyData.trimester}-й триместр</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-warmbeige-50 border border-warmbeige-200/60">
              <div className="text-[10px] font-bold text-sage-600 uppercase">До родов (ПДР)</div>
              <div className="text-xl font-bold text-sage-900 mt-0.5">84 дня</div>
              <div className="text-[11px] text-sage-600 font-medium mt-0.5">5 февраля 2027</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-sage-50/70 border border-sage-200/50">
              <div className="text-[10px] font-bold text-sage-600 uppercase">Размер малыша</div>
              <div className="text-xl font-bold text-sage-900 mt-0.5">{weeklyData.babyFruitComparison} {weeklyData.fruitEmoji}</div>
              <div className="text-[11px] text-sage-600 font-medium mt-0.5">Вес: ~{weeklyData.babyWeightEstimate}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
              <div className="text-[10px] font-bold text-emerald-800 uppercase">Ближайший скрининг</div>
              <div className="text-xl font-bold text-emerald-950 mt-0.5">III Скрининг УЗИ</div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">30–32 недели (Запись)</div>
            </div>
          </div>
        ) : (
          <div className="mt-6 pt-6 border-t border-sage-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-2xl bg-sage-50/70 border border-sage-200/50">
              <div className="text-[11px] font-semibold text-sage-500 uppercase">Текущий вес</div>
              <div className="text-xl font-bold text-sage-900 mt-0.5">{latestGrowth.weight} кг</div>
              <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                <span>+{weightDiff} кг за месяц</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-sage-50/70 border border-sage-200/50">
              <div className="text-[11px] font-semibold text-sage-500 uppercase">Рост малыша</div>
              <div className="text-xl font-bold text-sage-900 mt-0.5">{latestGrowth.height} см</div>
              <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                <span>+{heightDiff} см за месяц</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-sage-50/70 border border-sage-200/50">
              <div className="text-[11px] font-semibold text-sage-500 uppercase">Окружность головы</div>
              <div className="text-xl font-bold text-sage-900 mt-0.5">{latestGrowth.headCircumference} см</div>
              <div className="text-[11px] text-sage-600 font-medium mt-0.5">50-й перцентиль ВОЗ</div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
              <div className="text-[11px] font-semibold text-emerald-800 uppercase">Статус здоровья</div>
              <div className="text-xl font-bold text-emerald-900 mt-0.5">Идеальная норма</div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Все референсы в норме</div>
            </div>
          </div>
        )}
      </div>

      {/* 2. DYNAMIC CONTENT: PREGNANCY DASHBOARD OR CHILD DASHBOARD */}
      {profileMode === 'pregnancy' ? (
        /* PREGNANCY DASHBOARD VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* 3D Baby Fast Preview Card */}
            <div className="bg-gradient-to-br from-softblue-950 via-slate-900 to-sage-950 rounded-4xl p-6 sm:p-8 text-white shadow-soft-xl relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
                <div className="md:col-span-8 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-softblue-200 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                    Интерактивная 3D-модель • 360°
                  </span>
                  <h3 className="text-2xl font-bold font-display text-white">
                    Малыш на {currentWeek}-й неделе беременности
                  </h3>
                  <p className="text-xs sm:text-sm text-softblue-100 leading-relaxed">
                    Малыш начинает моргать, различает свет и тьму через стенку живота и слышит голоса родителей.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3 text-xs">
                    <Link
                      to="/pregnancy/3d-baby"
                      className="px-5 py-2.5 rounded-2xl bg-softblue-500 hover:bg-softblue-600 text-white font-bold shadow-soft transition-all inline-flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Открыть 3D-малыша</span>
                    </Link>
                    <Link
                      to="/pregnancy/baby-size"
                      className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all inline-flex items-center gap-1.5"
                    >
                      <span>Сравнение с фруктом →</span>
                    </Link>
                  </div>
                </div>

                <div className="md:col-span-4 flex justify-center">
                  <div className="w-32 h-32 rounded-3xl bg-white/10 border-2 border-white/20 flex flex-col items-center justify-center text-4xl shadow-inner backdrop-blur-md">
                    <span>{weeklyData.fruitEmoji}</span>
                    <span className="text-[10px] text-white/80 font-bold mt-1">~{weeklyData.babyWeightEstimate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Recommendations Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sage-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sage-100">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-5 h-5 text-sage-800" />
                  <h3 className="text-base font-bold font-display text-sage-900">
                    Клинические рекомендации недели ({currentWeek}-я неделя)
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Протоколы ВОЗ и МЗ РК
                </span>
              </div>

              <ul className="text-xs text-sage-700 space-y-2.5 list-disc list-inside leading-relaxed">
                {weeklyData.clinicalRecommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>

              <div className="pt-2 border-t border-sage-100 flex items-center justify-between text-xs">
                <Link to="/pregnancy/calendar" className="text-softblue-800 font-bold hover:underline">
                  Открыть календарь обследований →
                </Link>
                <Link to="/pregnancy/school" className="text-sage-600 font-semibold hover:underline">
                  Школа беременности →
                </Link>
              </div>
            </div>

            {/* Recent Mom Diary Entries */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sage-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sage-100">
                <h3 className="text-base font-bold font-display text-sage-900">
                  Последние записи в дневнике мамы
                </h3>
                <Link to="/pregnancy/diary" className="text-xs font-bold text-softblue-800 hover:underline">
                  Все записи →
                </Link>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-warmbeige-50/70 border border-warmbeige-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sage-900">28-я неделя • 15 ноября</span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Радостное
                    </span>
                  </div>
                  <p className="text-sage-700 leading-relaxed">
                    Малыш активно пинался вечером после теплого душа. Вес 64.8 кг (+8.2 кг с зачатия).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Movement Cardiff Tracker Mini-Widget */}
            <div className="bg-rose-50/70 rounded-3xl p-6 border border-rose-200/80 shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
                <span>Шевеления малыша</span>
              </div>
              <p className="text-xs text-rose-950 leading-relaxed">
                Регулярный тест Cardiff «считай до 10» рекомендуется выполнять ежедневно в часы активности плода.
              </p>
              <Link
                to="/pregnancy/movements"
                className="w-full py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-soft flex items-center justify-center gap-2 transition-colors"
              >
                <span>Запустить счетчик шевелений</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Hospital Bag Progress Mini-Card */}
            <div className="bg-white rounded-3xl p-6 border border-sage-200 shadow-soft space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sage-900 font-bold text-sm">
                  <Briefcase className="w-4 h-4 text-sage-700" />
                  <span>Сумка в роддом</span>
                </div>
                <span className="text-xs font-bold text-softblue-800 bg-softblue-100 px-2.5 py-0.5 rounded-full">
                  6 из 18 собрано
                </span>
              </div>
              <p className="text-xs text-sage-600">
                Рекомендовано полностью собрать к 32–34 неделе (документы, вещи мамы и малыша).
              </p>
              <Link
                to="/pregnancy/birth-prep"
                className="w-full py-2.5 rounded-2xl bg-warmbeige-100 hover:bg-warmbeige-200 text-sage-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-warmbeige-200"
              >
                <span>Открыть чек-лист роддома</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Medical Library Recommended Article */}
            <div className="bg-white rounded-3xl p-6 border border-sage-200 shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-sage-900 font-bold text-sm">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>Статья недели ВОЗ</span>
              </div>
              <h4 className="text-xs font-bold text-sage-900 leading-snug">
                Тревожные признаки при беременности: когда вызывать 103
              </h4>
              <p className="text-[11px] text-sage-600 line-clamp-2">
                Клинический протокол МЗ РК по раннему выявлению преэклампсии и отслойки плаценты.
              </p>
              <Link
                to="/library"
                className="text-xs font-bold text-softblue-800 hover:underline block pt-1"
              >
                Читать в библиотеке →
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* CHILD DASHBOARD VIEW (0-3 YEARS) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Growth Chart & AI Quick Access (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Growth Dynamics Chart Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sage-200/80 shadow-soft">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-sage-700" />
                    <h3 className="text-lg font-bold font-display text-sage-900">Динамика веса и нормы ВОЗ</h3>
                  </div>
                  <p className="text-xs text-sage-500 mt-0.5">
                    Зеленая линия — фактический вес {child.name}; пунктир — медиана ВОЗ (P50)
                  </p>
                </div>

                <Link
                  to="/health-control"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sage-700 hover:text-sage-900 bg-sage-50 hover:bg-sage-100 px-3 py-1.5 rounded-xl transition-colors self-start sm:self-auto"
                >
                  <span>Полный отчет ВОЗ</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Recharts Area Chart */}
              <div className="h-64 w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A8B9A5" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#A8B9A5" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8F0E7" />
                    <XAxis dataKey="name" stroke="#8FA48C" fontSize={11} tickLine={false} />
                    <YAxis domain={[2, 11]} stroke="#8FA48C" fontSize={11} tickLine={false} unit=" кг" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #D2E1D1',
                        boxShadow: '0 8px 24px -4px rgba(52, 68, 58, 0.1)',
                        fontSize: '12px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="weight"
                      name="Вес малыша"
                      stroke="#34443A"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#weightGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="p50"
                      name="Медиана ВОЗ (P50)"
                      stroke="#A8B9A5"
                      strokeDasharray="4 4"
                      strokeWidth={2}
                      fill="none"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 pt-3 border-t border-sage-100 flex flex-wrap items-center justify-between gap-4 text-xs text-sage-600">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-sage-800 rounded-full"></span> Вес {child.name} (8.55 кг)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-sage-400 rounded-full"></span> Норма ВОЗ (7.9 кг)
                  </span>
                </div>
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Гармоничное развитие
                </span>
              </div>
            </div>

            {/* AI Assistant Quick Questions Bar */}
            <div className="bg-gradient-to-br from-softblue-900 to-softblue-950 rounded-4xl p-6 sm:p-8 text-white shadow-soft relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-softblue-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 text-softblue-200 flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-softblue-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display text-white">AI-ассистент доказательной педиатрии</h3>
                    <p className="text-xs text-softblue-200">Помощь в понимании анализов, симптомов и протоколов ВОЗ</p>
                  </div>
                </div>

                <Link
                  to="/ai-assistant"
                  className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-sm border border-white/10 transition-colors self-start sm:self-auto"
                >
                  Открыть чат →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
                {SAMPLE_AI_QUESTIONS.slice(0, 4).map((q, idx) => (
                  <Link
                    key={idx}
                    to={`/ai-assistant?q=${encodeURIComponent(q)}`}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-softblue-100 hover:text-white transition-all text-left flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{q}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Diary, Vaccines, Calendar (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Quick Diary Actions */}
            <div className="bg-white rounded-3xl p-6 border border-sage-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sage-100">
                <h3 className="text-base font-bold font-display text-sage-900">Быстрая запись</h3>
                <span className="text-[11px] text-sage-500">В 1 клик</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => openQuickLogWith('feeding')}
                  className="p-3 rounded-2xl bg-warmbeige-50 hover:bg-warmbeige-100 border border-warmbeige-200 text-left transition-colors"
                >
                  <Utensils className="w-5 h-5 text-amber-700 mb-1" />
                  <span className="block text-xs font-bold text-sage-900">Кормление</span>
                  <span className="text-[10px] text-sage-500">Прикорм / ГВ</span>
                </button>

                <button
                  onClick={() => openQuickLogWith('sleep')}
                  className="p-3 rounded-2xl bg-softblue-50 hover:bg-softblue-100 border border-softblue-200 text-left transition-colors"
                >
                  <Moon className="w-5 h-5 text-softblue-700 mb-1" />
                  <span className="block text-xs font-bold text-sage-900">Сон малыша</span>
                  <span className="text-[10px] text-sage-500">Дневной / ночной</span>
                </button>

                <button
                  onClick={() => openQuickLogWith('temperature')}
                  className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-left transition-colors"
                >
                  <Thermometer className="w-5 h-5 text-rose-700 mb-1" />
                  <span className="block text-xs font-bold text-sage-900">Температура</span>
                  <span className="text-[10px] text-sage-500">Симптомы</span>
                </button>

                <button
                  onClick={() => openQuickLogWith('diaper')}
                  className="p-3 rounded-2xl bg-sage-50 hover:bg-sage-100 border border-sage-200 text-left transition-colors"
                >
                  <Baby className="w-5 h-5 text-sage-700 mb-1" />
                  <span className="block text-xs font-bold text-sage-900">Подгузник</span>
                  <span className="text-[10px] text-sage-500">Стул / гигиена</span>
                </button>
              </div>
            </div>

            {/* Next Scheduled Vaccines / Calendar */}
            <div className="bg-white rounded-3xl p-6 border border-sage-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sage-100">
                <h3 className="text-base font-bold font-display text-sage-900">Вакцинация РК</h3>
                <Link to="/medical-archive" className="text-xs font-bold text-softblue-800 hover:underline">
                  Календарь →
                </Link>
              </div>

              <div className="space-y-2.5">
                {vaccinations.slice(0, 3).map((v) => (
                  <div
                    key={v.id}
                    className="p-3 rounded-2xl bg-warmbeige-50/50 border border-sage-100 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-sage-900 block">{v.vaccineName}</span>
                      <span className="text-[11px] text-sage-500">{v.diseaseTarget}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      v.status === 'done' ? 'bg-emerald-100 text-emerald-800' : 'bg-softblue-100 text-softblue-800'
                    }`}>
                      {v.status === 'done' ? 'Сделана' : 'В 12 мес.'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Log Modal */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        defaultCategory={quickLogCategory}
      />
    </div>
  );
};
