// src/pages/LandingPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { EmergencyCallModal } from '../components/common/EmergencyCallModal';
import { 
  HeartPulse, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Baby, 
  Heart, 
  Stethoscope, 
  FolderHeart, 
  Users, 
  ChevronDown, 
  PhoneCall, 
  FileText, 
  TrendingUp, 
  Clock, 
  HelpCircle,
  Eye,
  Check
} from 'lucide-react';

export const LandingPage: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [interactiveAiInput, setInteractiveAiInput] = useState('Что означает показатель ферритина 38 мкг/л?');
  const [interactiveAiResponse, setInteractiveAiResponse] = useState<any>(null);

  const handleTestAiQuery = (query: string) => {
    setInteractiveAiInput(query);
    setInteractiveAiResponse({
      title: 'Ферритин сыворотки крови (38 мкг/л)',
      meaning: 'Ферритин — ключевой маркер реального запаса железа в тканях и печени ребенка.',
      verdict: 'В норме. Для возраста 6–12 месяцев норма 25–120 мкг/л. Латентный железодефицит исключен.',
      point: 'Показатель стабилен, запасов железа достаточно для нормального кроветворения и когнитивного развития.',
      question: 'Уточните у педиатра, достаточно ли текущего рациона прикорма (мясного пюре) для поддержания уровня.'
    });
  };

  const faqs = [
    {
      q: 'Чем NESTA отличается от обычных мобильных приложений для трекинга?',
      a: 'NESTA — это не просто счетчик кормлений, а полноценная цифровая медицинская платформа для всей семьи. Мы объединяем клинические стандарты ВОЗ, безопасную медицинскую карту, совместный доступ для обоих родителей и AI-ассистента, который расшифровывает сложные анализы и заключения понятным языком.'
    },
    {
      q: 'Заменяет ли AI-ассистент врача-педиатра?',
      a: 'Нет. AI-ассистент NESTA создан исключительно для медицинского просвещения, подготовки к приему врача и расшифровки терминов. Он не ставит клинических диагнозов и не назначает лекарства. Мы формируем доказательный список вопросов, с которыми вы можете обратиться к вашему лечащему специалисту.'
    },
    {
      q: 'Как работает модуль «Проверка симптомов» при экстренных ситуациях?',
      a: 'Модуль триажа построен на строгих протоколах неотложной педиатрии. Если система обнаруживает «красные флаги» (затрудненное дыхание, судороги, геморрагическую сыпь, высокую температуру у младенца до 3 месяцев), она не задает лишних вопросов, а немедленно выводит номера 103 и 112 (Казахстан) с четким алгоритмом действий.'
    },
    {
      q: 'Может ли папа или бабушка вносить данные в платформу?',
      a: 'Да! Вы можете пригласить второго родителя или няню по ссылке или email с гибкой настройкой прав: «Полный доступ» для совместного ведения дневника или «Только просмотр» для родственников.'
    },
    {
      q: 'Безопасно ли хранить медицинские документы в NESTA?',
      a: 'Все загруженные документы и персональные данные шифруются в соответствии со стандартами HIPAA и GDPR. Доступ к медицинской карте имеют только те пользователи, которых вы лично добавили в семейный профиль.'
    }
  ];

  return (
    <div className="min-h-screen bg-warmbeige-50/70 text-sage-900 selection:bg-sage-200">
      <Navbar onOpenAuth={onOpenAuth} />

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-sage-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-100/80 border border-sage-200/80 text-xs font-semibold text-sage-800 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-sage-700" />
                <span>Персональная медицинская платформа для всей семьи</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-sage-900 leading-[1.12]">
                Здоровье мамы и малыша — <span className="text-sage-700 italic font-serif">под заботливым контролем</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-sage-700 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Понимайте медицинские показатели, отслеживайте развитие ребёнка и сохраняйте всю историю здоровья в одном защищённом месте.
              </p>

              {/* Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={onOpenAuth}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white font-semibold text-base shadow-soft hover:shadow-soft-lg transition-all group"
                >
                  <span>Начать бесплатно</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 text-sage-200" />
                </button>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-sage-50 text-sage-800 font-semibold text-base border border-sage-200/90 shadow-xs transition-colors"
                >
                  Как это работает
                </a>
              </div>

              {/* Proof badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-sage-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Стандарты роста ВОЗ</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Клинический триаж 103 / 112 РК</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Совместный доступ для мамы и папы</span>
                </div>
              </div>
            </div>

            {/* Right Mockup Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative background glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-sage-200/60 to-softblue-200/50 rounded-4xl filter blur-2xl opacity-70 -z-10"></div>

                {/* Main Card UI preview */}
                <div className="bg-white rounded-3xl p-6 shadow-soft-xl border border-sage-200/80 relative overflow-hidden">
                  {/* Top Bar of the Mockup */}
                  <div className="flex items-center justify-between pb-4 border-b border-sage-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-sage-800 text-white flex items-center justify-center">
                        <Baby className="w-5 h-5 text-sage-200" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-sage-900">Алиса, 8 месяцев</div>
                        <div className="text-xs text-emerald-600 font-medium">Все показатели в норме • ВОЗ 53%</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-sage-100 text-sage-800 text-[11px] font-semibold">
                      Активен
                    </span>
                  </div>

                  {/* Gentle Illustration / Mother & Child Photo */}
                  <div className="mt-4 rounded-2xl overflow-hidden relative h-48 bg-warmbeige-100">
                    <img
                      src="https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=80&w=800"
                      alt="Мама с малышом"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sage-950/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-xs font-semibold">«Забота начинается с понимания»</div>
                      <div className="text-[11px] text-sage-200">NESTA Personal Health Platform</div>
                    </div>
                  </div>

                  {/* Floating Micro-Widget: AI Analysis */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-softblue-50/80 border border-softblue-200/70">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className="w-4 h-4 text-softblue-700" />
                      <span className="text-xs font-bold text-softblue-900">AI-расшифровка анализа крови</span>
                    </div>
                    <p className="text-xs text-softblue-800 leading-snug">
                      Гемоглобин 118 г/л (норма 105–135 г/л). Железодефицит исключен, показатели соответствуют 8 месяцам.
                    </p>
                  </div>

                  {/* Floating Micro-Widget: Growth Metric */}
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-warmbeige-50 border border-warmbeige-200/80">
                      <div className="text-[10px] text-sage-500 uppercase font-semibold">Вес</div>
                      <div className="text-sm font-bold text-sage-900">8.55 кг</div>
                      <div className="text-[10px] text-emerald-600 font-medium">Норма ВОЗ</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-warmbeige-50 border border-warmbeige-200/80">
                      <div className="text-[10px] text-sage-500 uppercase font-semibold">Рост</div>
                      <div className="text-sm font-bold text-sage-900">70.2 см</div>
                      <div className="text-[10px] text-emerald-600 font-medium">+1.6 см/мес</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-warmbeige-50 border border-warmbeige-200/80">
                      <div className="text-[10px] text-sage-500 uppercase font-semibold">Сон</div>
                      <div className="text-sm font-bold text-sage-900">13.5 ч</div>
                      <div className="text-[10px] text-softblue-700 font-medium">2 дневных</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE CORE VALUES */}
      <section id="features" className="py-20 md:py-28 bg-white border-b border-sage-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-100 px-3.5 py-1.5 rounded-full">
              Философия NESTA
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-sage-900 mt-4">
              Три столпа родительской уверенности
            </h2>
            <p className="text-sage-600 mt-3 text-base">
              Мы создали платформу, которая даёт родителям ответы, ясность и душевное равновесие.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. ПОНИМАНИЕ */}
            <div className="p-8 rounded-3xl bg-warmbeige-50/70 border border-warmbeige-200/80 hover:shadow-soft-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-sage-800 text-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles className="w-7 h-7 text-sage-200" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-sage-600 mb-2">Ценность 01</div>
              <h3 className="text-2xl font-bold font-display text-sage-900 mb-3">ПОНИМАНИЕ</h3>
              <p className="text-sm text-sage-700 leading-relaxed">
                Сложные лабораторные анализы, УЗИ и медицинские заключения переводятся на понятный язык. Вы всегда знаете, что означает каждая строчка и о чем спросить педиатра.
              </p>
              <div className="mt-6 pt-4 border-t border-sage-200/60 flex items-center gap-2 text-xs font-semibold text-sage-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>OCR-распознавание документов и анализов</span>
              </div>
            </div>

            {/* 2. КОНТРОЛЬ */}
            <div className="p-8 rounded-3xl bg-sage-50/60 border border-sage-200/80 hover:shadow-soft-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-sage-700 text-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform">
                <Activity className="w-7 h-7 text-sage-100" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-sage-600 mb-2">Ценность 02</div>
              <h3 className="text-2xl font-bold font-display text-sage-900 mb-3">КОНТРОЛЬ</h3>
              <p className="text-sm text-sage-700 leading-relaxed">
                Интерактивные графики физического развития по стандартам ВОЗ (рост, вес, окружность головы), дневник сна и кормлений, календарь вакцинации и возрастные навыки.
              </p>
              <div className="mt-6 pt-4 border-t border-sage-200/60 flex items-center gap-2 text-xs font-semibold text-sage-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Перцентили и Z-score Всемирной организации здравоохранения</span>
              </div>
            </div>

            {/* 3. СПОКОЙСТВИЕ */}
            <div className="p-8 rounded-3xl bg-softblue-50/70 border border-softblue-200/80 hover:shadow-soft-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-softblue-800 text-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-7 h-7 text-softblue-200" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-softblue-800 mb-2">Ценность 03</div>
              <h3 className="text-2xl font-bold font-display text-softblue-950 mb-3">СПОКОЙСТВИЕ</h3>
              <p className="text-sm text-sage-700 leading-relaxed">
                Четкий триаж симптомов: Зеленый (наблюдение), Желтый (плановый врач за 24–48 ч), Красный (неотложная помощь). Вы понимаете, когда тревога излишня, а когда действовать немедленно.
              </p>
              <div className="mt-6 pt-4 border-t border-softblue-200/60 flex items-center gap-2 text-xs font-semibold text-softblue-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Мгновенный вызов 103 и 112 для Казахстана</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE AI ASSISTANT DEMO */}
      <section className="py-20 md:py-28 bg-warmbeige-50/60 border-b border-sage-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-white border border-sage-200 px-3.5 py-1.5 rounded-full">
                AI-ассистент «Понимание»
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-sage-900">
                Медицинский переводчик сложных анализов
              </h2>
              <p className="text-sage-700 text-sm leading-relaxed">
                Загружайте PDF или фото анализов крови, мочи, УЗИ. Система распознает текст, сравнит показатели с возрастными референсами и разложит всё по 4 четким блокам.
              </p>

              {/* Sample queries */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-sage-600 uppercase">Попробуйте частые запросы:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Что означает показатель ферритина 38 мкг/л?',
                    'Расшифруй общий анализ крови ребенка 8 месяцев',
                    'Температура 37.3 и режутся зубки — что делать?',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleTestAiQuery(q)}
                      className="text-xs px-3 py-1.5 rounded-xl bg-white border border-sage-200 hover:border-sage-400 text-sage-800 transition-colors text-left font-medium"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/ai-assistant"
                  className="inline-flex items-center gap-2 text-sm font-bold text-sage-800 hover:text-sage-900 underline underline-offset-4"
                >
                  <span>Перейти в полный AI-чат с загрузкой документов</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* AI Assistant Interactive Card */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl shadow-soft-xl border border-sage-200/80 p-6 md:p-8">
                <div className="flex items-center justify-between pb-4 border-b border-sage-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-sage-800 text-white flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-sage-200" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-sage-900">NESTA AI Medical Engine</div>
                      <div className="text-xs text-sage-500">Доказательная педиатрия • ВОЗ • Протоколы МЗ РК</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Интерактивное демо
                  </span>
                </div>

                {/* Structured response display */}
                <div className="mt-5 space-y-4">
                  <div className="p-3.5 rounded-2xl bg-sage-50/70 border border-sage-200/60 text-xs">
                    <span className="font-semibold text-sage-700">Запрос родителя:</span>
                    <p className="text-sage-900 font-medium mt-0.5">«{interactiveAiInput}»</p>
                  </div>

                  {/* 4 Pillars of Response */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="p-4 rounded-2xl bg-warmbeige-50/70 border border-warmbeige-200/80">
                      <span className="text-[11px] font-bold text-sage-600 uppercase tracking-wider block mb-1">
                        1. Что означает показатель?
                      </span>
                      <p className="text-xs text-sage-800 leading-relaxed">
                        {interactiveAiResponse?.meaning || 'Ферритин — это белковый комплекс, отражающий реальный тканевый запас железа в клетках печени и костного мозга.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                        2. Как понять результат?
                      </span>
                      <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                        {interactiveAiResponse?.verdict || 'Значение 38 мкг/л — абсолютная норма для 8 месяцев (референс 25–120). Анемия исключена.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-softblue-50/60 border border-softblue-200/70">
                      <span className="text-[11px] font-bold text-softblue-800 uppercase tracking-wider block mb-1">
                        3. На что обратить внимание?
                      </span>
                      <p className="text-xs text-softblue-950 leading-relaxed">
                        {interactiveAiResponse?.point || 'Поддерживайте мясное пюре в прикорме. Витамин C в овощах помогает железу усваиваться.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-sage-100/60 border border-sage-200/70">
                      <span className="text-[11px] font-bold text-sage-800 uppercase tracking-wider block mb-1">
                        4. Что обсудить с врачом?
                      </span>
                      <p className="text-xs text-sage-900 leading-relaxed">
                        {interactiveAiResponse?.question || 'Нужно ли сдавать контрольный анализ перед годовой вакцинацией в 12 месяцев?'}
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] text-sage-500 pt-1 text-center">
                    ⚠️ AI не ставит диагнозов и не назначает лекарств. Информация проверена по клиническим протоколам.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PLATFORM CAPABILITIES OVERVIEW */}
      <section id="how-it-works" className="py-20 md:py-28 bg-white border-b border-sage-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-100 px-3.5 py-1.5 rounded-full">
              Возможности экосистемы
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-sage-900 mt-4">
              Всё необходимое для здоровья семьи
            </h2>
            <p className="text-sage-600 mt-3 text-base">
              Единый цифровой хаб от первых недель беременности до трехлетия ребенка.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-warmbeige-50/60 border border-warmbeige-200/70 hover:shadow-soft transition-all">
              <div className="w-12 h-12 rounded-2xl bg-sage-800 text-white flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-sage-200" />
              </div>
              <h3 className="text-lg font-bold text-sage-900 mb-2">Стандарты роста ВОЗ</h3>
              <p className="text-xs text-sage-700 leading-relaxed">
                Интерактивные графики веса, роста и окружности головы с перцентильными коридорами (P3, P50, P97). Позволяет вовремя заметить скачки или задержки прибавки.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-warmbeige-50/60 border border-warmbeige-200/70 hover:shadow-soft transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rose-700 text-white flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6 text-rose-100" />
              </div>
              <h3 className="text-lg font-bold text-sage-900 mb-2">Проверка симптомов (Триаж)</h3>
              <p className="text-xs text-sage-700 leading-relaxed">
                Трехуровневая система оценки (Зеленый / Желтый / Красный). Предупреждает о «красных флагах» и связывает со скорой помощью (103) в Казахстане.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-warmbeige-50/60 border border-warmbeige-200/70 hover:shadow-soft transition-all">
              <div className="w-12 h-12 rounded-2xl bg-sage-700 text-white flex items-center justify-center mb-4">
                <FolderHeart className="w-6 h-6 text-sage-100" />
              </div>
              <h3 className="text-lg font-bold text-sage-900 mb-2">Семейная медицинская карта</h3>
              <p className="text-xs text-sage-700 leading-relaxed">
                Защищенный архив анализов, УЗИ, вакцинаций и рецептов. Удобная сортировка, быстрый поиск и экспорт медицинской карты в PDF в один клик.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-warmbeige-50/60 border border-warmbeige-200/70 hover:shadow-soft transition-all">
              <div className="w-12 h-12 rounded-2xl bg-softblue-700 text-white flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-softblue-100" />
              </div>
              <h3 className="text-lg font-bold text-sage-900 mb-2">Режим беременности</h3>
              <p className="text-xs text-sage-700 leading-relaxed">
                Отслеживание триместров, размера плода (по фруктам и граммам), графики скринингов УЗИ, списки анализов и чек-лист сумки в роддом.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-3xl bg-warmbeige-50/60 border border-warmbeige-200/70 hover:shadow-soft transition-all">
              <div className="w-12 h-12 rounded-2xl bg-sage-800 text-white flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-sage-200" />
              </div>
              <h3 className="text-lg font-bold text-sage-900 mb-2">Совместный доступ для семьи</h3>
              <p className="text-xs text-sage-700 leading-relaxed">
                Мама и папа ведут дневник вместе: каждый видит, когда малыша покормили, сколько он поспал и когда принят витамин D3. Аудит всех действий.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-3xl bg-warmbeige-50/60 border border-warmbeige-200/70 hover:shadow-soft transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-amber-100" />
              </div>
              <h3 className="text-lg font-bold text-sage-900 mb-2">Умные напоминания</h3>
              <p className="text-xs text-sage-700 leading-relaxed">
                Уведомления о вакцинации по национальному календарю, плановых визитах к педиатру и регулярном приеме назначенных витаминов.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CO-PARENTING SPOTLIGHT */}
      <section className="py-20 md:py-28 bg-sage-100/40 border-b border-sage-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-4xl p-8 md:p-12 border border-sage-200/80 shadow-soft-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-100 px-3 py-1 rounded-full">
                  Партнерство
                </span>
                <h3 className="text-3xl font-bold font-display text-sage-900">
                  Совместный доступ для мамы и папы
                </h3>
                <p className="text-sm text-sage-700 leading-relaxed">
                  Родительство — это командная работа. NESTA позволяет обоим родителям быть в одном контексте без постоянных звонков «Ты дал витамин?», «Сколько она поспала?» или «Где лежит прививочный сертификат?».
                </p>
                <div className="space-y-2.5 pt-2 text-xs text-sage-800">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Синхронизация дневника в реальном времени</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Гибкие роли: Владелец, Редактор или Только чтение для няни</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>История действий: кто и когда вносил замеры и записи</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="bg-warmbeige-50 rounded-3xl p-6 border border-warmbeige-200/80 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-warmbeige-200/80">
                    <span className="text-xs font-bold text-sage-900">Участники семьи Алисы</span>
                    <span className="text-[11px] text-sage-500">3 подключено</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-sage-100">
                    <div className="flex items-center gap-3">
                      <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=128" alt="Анна" className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <div className="text-xs font-bold text-sage-900">Анна Сабитова (Мама)</div>
                        <div className="text-[11px] text-sage-500">Владелец аккаунта</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      В сети
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-sage-100">
                    <div className="flex items-center gap-3">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128" alt="Михаил" className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <div className="text-xs font-bold text-sage-900">Михаил Сабитов (Папа)</div>
                        <div className="text-[11px] text-sage-500">Полный доступ (Редактор)</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-sage-600 bg-sage-100 px-2.5 py-1 rounded-full">
                      15 мин назад
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-sage-100/60 text-xs text-sage-800 flex items-center justify-between">
                    <span>Последнее действие: Папа внёс замер веса (8.55 кг)</span>
                    <span className="text-[10px] text-sage-500">Вчера</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section id="faq" className="py-20 md:py-28 bg-white border-b border-sage-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-100 px-3.5 py-1.5 rounded-full">
              Частые вопросы
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-sage-900 mt-4">
              Всё, о чем чаще всего спрашивают родители
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-sage-200/80 bg-warmbeige-50/50 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-sage-900 text-base"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-sage-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-sage-700 leading-relaxed border-t border-sage-200/50 pt-4 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-20 md:py-28 bg-sage-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-sage-950 via-sage-900 to-sage-800 opacity-90"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage-800 text-xs font-semibold text-sage-200 border border-sage-700">
            <HeartPulse className="w-4 h-4 text-sage-300" />
            <span>NESTA — забота начинается с понимания</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white leading-tight">
            Начните заботиться о здоровье семьи осознанно
          </h2>

          <p className="text-base sm:text-lg text-sage-300 max-w-2xl mx-auto leading-relaxed">
            Присоединяйтесь к платформе NESTA прямо сейчас. Ведите историю здоровья малыша, получайте понятные расшифровки анализов и будьте спокойны за каждый шаг его развития.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-sage-100 text-sage-900 font-bold text-base shadow-soft-xl transition-all"
            >
              <span>Зарегистрироваться бесплатно</span>
              <ArrowRight className="w-5 h-5 text-sage-700" />
            </button>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-sage-800 hover:bg-sage-700 text-white font-semibold text-base border border-sage-700 transition-colors"
            >
              <span>Попробовать демо-кабинет</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer onOpenEmergency={() => setEmergencyModalOpen(true)} />

      <EmergencyCallModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />
    </div>
  );
};
