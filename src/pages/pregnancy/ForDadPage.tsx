// src/pages/pregnancy/ForDadPage.tsx
import React from 'react';
import { useData } from '../../context/DataContext';
import { getWeeklyData } from '../../data/pregnancyWeeklyData';
import { 
  Heart, 
  ShieldCheck, 
  Home, 
  Activity, 
  Baby, 
  Sparkles, 
  Smile, 
  CheckCircle2,
  PhoneCall,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ForDadPage: React.FC = () => {
  const { pregnancy } = useData();
  const currentWeek = pregnancy.currentWeek || 28;
  const weeklyData = getWeeklyData(currentWeek);

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-softblue-800 bg-softblue-100 px-3 py-1 rounded-full">
              Приоритет 3 • Партнерская поддержка
            </span>
            <span className="text-xs font-semibold text-sage-500">
              Срок мамы: {currentWeek}-я неделя
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900 mt-2">
            Раздел для папы и партнера
          </h1>
          <p className="text-xs sm:text-sm text-sage-600 mt-1">
            Практическое руководство: как понимать состояние мамы, заботиться о малыше и быть надежной опорой
          </p>
        </div>

        <Link
          to="/pregnancy/birth-prep"
          className="px-4 py-2 rounded-2xl bg-sage-800 hover:bg-sage-900 text-xs font-bold text-white transition-colors shadow-soft self-start sm:self-auto"
        >
          Чек-лист в роддом →
        </Link>
      </div>

      {/* Week Focus Card for Dad */}
      <div className="bg-gradient-to-br from-sage-900 via-slate-900 to-softblue-950 rounded-4xl p-6 sm:p-8 text-white shadow-soft-xl relative overflow-hidden">
        <div className="space-y-3 relative z-10 max-w-2xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-softblue-200 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            Что происходит с малышом на {currentWeek}-й неделе
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Малыш размером с <span className="text-softblue-200">{weeklyData.babyFruitComparison}</span> ({weeklyData.babyWeightEstimate})
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Слух малыша полностью настроен на низкие частоты — именно мужской голос он воспринимает лучше всего! Разговаривайте с животиком, читайте вслух или пойте: малыш запоминает ваш тембр и будет сразу узнавать вас после рождения.
          </p>
        </div>
      </div>

      {/* 4 Essential Pillars of Dad's Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: What Mom is going through */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sage-200 shadow-soft space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-rose-600" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-sage-400 block">Понимание</span>
              <h3 className="text-base font-bold font-display text-sage-900">Что сейчас чувствует мама</h3>
            </div>
          </div>

          <ul className="text-xs text-sage-700 space-y-2.5 list-disc list-inside leading-relaxed">
            <li>Из-за смещения центра тяжести и гормона релаксина увеличивается нагрузка на поясницу и связки таза</li>
            <li>Снижение объема желудка и одышка из-за высокого положения матки</li>
            <li>Эмоциональные перепады: тревога перед родами чередуется с желанием бесконечно обустраивать детскую</li>
            <li>Быстрая физическая утомляемость даже от простых повседневных дел</li>
          </ul>
        </div>

        {/* Card 2: Practical Ways to Help Right Now */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sage-200 shadow-soft space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-sage-400 block">Действие</span>
              <h3 className="text-base font-bold font-display text-sage-900">Как вы можете помочь сегодня</h3>
            </div>
          </div>

          <ul className="text-xs text-sage-700 space-y-2.5 list-disc list-inside leading-relaxed">
            <li>Сделайте маме легкий 10-минутный массаж стоп и голеней перед сном (улучшает лимфоотток)</li>
            <li>Возьмите на себя подъем любых сумок тяжелее 3 кг и уборку пылесосом</li>
            <li>Следите за регулярным приемом воды и помогайте организовать прогулки на свежем воздухе</li>
            <li>Просто обнимите и скажите: «Ты отлично справляешься, я рядом»</li>
          </ul>
        </div>

        {/* Card 3: Labor Preparation as a Partner */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sage-200 shadow-soft space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-softblue-100 text-softblue-800 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-sage-400 block">Роддом</span>
              <h3 className="text-base font-bold font-display text-sage-900">Подготовка к партнерским родам</h3>
            </div>
          </div>

          <ul className="text-xs text-sage-700 space-y-2.5 list-disc list-inside leading-relaxed">
            <li>Сдайте флюорографию и анализ на микрореакцию (требование роддомов РК для партнера)</li>
            <li>Приготовьте сменную чистую одежду (хлопковые брюки, футболку) и моющиеся тапочки</li>
            <li>Ваша главная роль в родах — быть «адвокатом спокойствия» мамы, подавать воду, помогать дышать и массировать крестец</li>
            <li>Держите бак автомобиля всегда заправленным минимум на 50%</li>
          </ul>
        </div>

        {/* Card 4: Nursery & Home Preparation */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sage-200 shadow-soft space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-warmbeige-200 text-warmbeige-900 flex items-center justify-center">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-sage-400 block">Дом</span>
              <h3 className="text-base font-bold font-display text-sage-900">Подготовка дома к выписке</h3>
            </div>
          </div>

          <ul className="text-xs text-sage-700 space-y-2.5 list-disc list-inside leading-relaxed">
            <li>Соберите детскую кроватку и установите правильную высоту жесткого матраса</li>
            <li>Установите автокресло 0+ (автолюльку) в машину и потренируйтесь застегивать изофикс/ремни</li>
            <li>Купите увлажнитель воздуха для поддержания влажности 50–60% в комнате малыша</li>
            <li>Заполните морозилку готовыми домашними блюдами на первые 1–2 недели после выписки</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
