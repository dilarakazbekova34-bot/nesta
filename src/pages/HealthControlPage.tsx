// src/pages/HealthControlPage.tsx
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Activity, 
  TrendingUp, 
  Plus, 
  Filter, 
  Utensils, 
  Moon, 
  Baby, 
  Thermometer, 
  Pill, 
  Smile, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Layers,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  Area, 
  ComposedChart 
} from 'recharts';
import { WHO_STANDARDS_GIRLS } from '../data/mockData';
import { QuickLogModal } from '../components/common/QuickLogModal';
import { DiaryCategory, MilestoneCategory } from '../types';

export const HealthControlPage: React.FC = () => {
  const { 
    child, 
    growthData, 
    addMeasurement, 
    diaryEntries, 
    milestones, 
    toggleMilestoneStatus 
  } = useData();

  const [activeTab, setActiveTab] = useState<'physical' | 'diary' | 'milestones'>('physical');
  const [metricType, setMetricType] = useState<'weight' | 'height' | 'head'>('weight');
  const [periodFilter, setPeriodFilter] = useState<'week' | 'month' | '3months' | 'all'>('all');
  const [diaryCategoryFilter, setDiaryCategoryFilter] = useState<string>('all');
  const [milestoneFilter, setMilestoneFilter] = useState<string>('all');

  // New measurement modal states
  const [isAddMeasurementOpen, setIsAddMeasurementOpen] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newHeight, setNewHeight] = useState('');
  const [newHead, setNewHead] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Quick log modal
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [quickLogCategory, setQuickLogCategory] = useState<DiaryCategory>('feeding');

  const latestGrowth = growthData[growthData.length - 1];

  // Prepare chart dataset matching child growth measurements to WHO standards
  const combinedChartData = WHO_STANDARDS_GIRLS.map((std) => {
    const childRecord = growthData.find(g => g.ageMonths === std.age);
    return {
      age: `${std.age} мес`,
      p3: std.p3,
      p15: std.p15,
      p50: std.p50,
      p85: std.p85,
      p97: std.p97,
      height_p50: std.height_p50,
      childWeight: childRecord ? childRecord.weight : null,
      childHeight: childRecord ? childRecord.height : null,
      childHead: childRecord ? childRecord.headCircumference : null
    };
  });

  const handleAddMeasurementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight || !newHeight) return;

    addMeasurement({
      date: new Date().toISOString().split('T')[0],
      ageMonths: 9,
      weight: parseFloat(newWeight),
      height: parseFloat(newHeight),
      headCircumference: parseFloat(newHead) || 45.0,
      notes: newNotes || 'Плановый замер развития'
    });

    setNewWeight('');
    setNewHeight('');
    setNewHead('');
    setNewNotes('');
    setIsAddMeasurementOpen(false);
  };

  const filteredDiary = diaryEntries.filter(entry => {
    if (diaryCategoryFilter === 'all') return true;
    return entry.category === diaryCategoryFilter;
  });

  const filteredMilestones = milestones.filter(m => {
    if (milestoneFilter === 'all') return true;
    return m.category === milestoneFilter;
  });

  const achievedMilestonesCount = milestones.filter(m => m.status === 'achieved').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-100 px-3 py-1 rounded-full">
              Ценность «КОНТРОЛЬ»
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900 mt-2">
            Здоровье и развитие: аналитическая панель
          </h1>
          <p className="text-xs sm:text-sm text-sage-600 mt-1">
            Клинические перцентили ВОЗ, трекинг физического роста и дневник навыков малыша
          </p>
        </div>

        {/* Global Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddMeasurementOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Внести замер роста / веса</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-sage-200/80 gap-2">
        <button
          onClick={() => setActiveTab('physical')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'physical'
              ? 'border-sage-800 text-sage-900'
              : 'border-transparent text-sage-500 hover:text-sage-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Физическое развитие (ВОЗ)</span>
        </button>

        <button
          onClick={() => setActiveTab('diary')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'diary'
              ? 'border-sage-800 text-sage-900'
              : 'border-transparent text-sage-500 hover:text-sage-800'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Дневник здоровья</span>
        </button>

        <button
          onClick={() => setActiveTab('milestones')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'milestones'
              ? 'border-sage-800 text-sage-900'
              : 'border-transparent text-sage-500 hover:text-sage-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Возрастные навыки ({achievedMilestonesCount}/{milestones.length})</span>
        </button>
      </div>

      {/* TAB 1: PHYSICAL DEVELOPMENT (WHO) */}
      {activeTab === 'physical' && (
        <div className="space-y-8">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-3xl p-6 border border-sage-200/80 shadow-soft">
              <div className="flex items-center justify-between text-xs text-sage-500 uppercase font-semibold">
                <span>Текущий вес (8 мес)</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">53% ВОЗ</span>
              </div>
              <div className="text-3xl font-bold font-display text-sage-900 mt-2">{latestGrowth.weight} кг</div>
              <p className="text-xs text-sage-600 mt-1">
                Прибавка за последний месяц: <strong className="text-emerald-700">+450 г</strong> (норма 400–500 г)
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-sage-200/80 shadow-soft">
              <div className="flex items-center justify-between text-xs text-sage-500 uppercase font-semibold">
                <span>Текущий рост (8 мес)</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">53% ВОЗ</span>
              </div>
              <div className="text-3xl font-bold font-display text-sage-900 mt-2">{latestGrowth.height} см</div>
              <p className="text-xs text-sage-600 mt-1">
                Прибавка за последний месяц: <strong className="text-emerald-700">+1.6 см</strong> (норма 1.5–2 см)
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-sage-200/80 shadow-soft">
              <div className="flex items-center justify-between text-xs text-sage-500 uppercase font-semibold">
                <span>Окружность головы</span>
                <span className="text-sage-700 font-bold bg-sage-100 px-2 py-0.5 rounded-full">50% ВОЗ</span>
              </div>
              <div className="text-3xl font-bold font-display text-sage-900 mt-2">{latestGrowth.headCircumference} см</div>
              <p className="text-xs text-sage-600 mt-1">
                Гармоничное соотношение с окружностью грудной клетки
              </p>
            </div>
          </div>

          {/* Chart Controls Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage-100">
              {/* Metric Type Selector */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-warmbeige-100 border border-warmbeige-200 self-start">
                <button
                  onClick={() => setMetricType('weight')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    metricType === 'weight' ? 'bg-white text-sage-900 shadow-sm' : 'text-sage-600'
                  }`}
                >
                  Вес к возрасту (кг)
                </button>
                <button
                  onClick={() => setMetricType('height')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    metricType === 'height' ? 'bg-white text-sage-900 shadow-sm' : 'text-sage-600'
                  }`}
                >
                  Рост к возрасту (см)
                </button>
              </div>

              {/* Period Filter */}
              <div className="flex items-center gap-1.5 text-xs text-sage-600">
                <span className="font-semibold text-sage-500">Период:</span>
                {(['week', 'month', '3months', 'all'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setPeriodFilter(period)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      periodFilter === period
                        ? 'bg-sage-800 text-white'
                        : 'bg-sage-50 text-sage-700 hover:bg-sage-100'
                    }`}
                  >
                    {period === 'week' ? '1 нед' : period === 'month' ? '1 мес' : period === '3months' ? '3 мес' : 'Весь период (0–12м)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Interactive Recharts */}
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={combinedChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8F0E7" />
                  <XAxis dataKey="age" stroke="#8FA48C" fontSize={11} tickLine={false} />
                  <YAxis
                    domain={metricType === 'weight' ? [1.5, 12] : [45, 80]}
                    stroke="#8FA48C"
                    fontSize={11}
                    tickLine={false}
                    unit={metricType === 'weight' ? ' кг' : ' см'}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #D2E1D1',
                      boxShadow: '0 8px 24px -4px rgba(52, 68, 58, 0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

                  {metricType === 'weight' ? (
                    <>
                      {/* WHO percentile zones */}
                      <Area type="monotone" dataKey="p97" name="P97 (верхняя граница нормы)" stroke="#EADECF" fill="#F4EEE5" fillOpacity={0.4} />
                      <Line type="monotone" dataKey="p85" name="P85 (выше среднего)" stroke="#CBBAA3" strokeDasharray="3 3" dot={false} />
                      <Line type="monotone" dataKey="p50" name="P50 (медиана стандарта ВОЗ)" stroke="#8FA48C" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="p15" name="P15 (ниже среднего)" stroke="#CBBAA3" strokeDasharray="3 3" dot={false} />
                      <Line type="monotone" dataKey="p3" name="P3 (нижняя граница)" stroke="#EADECF" strokeDasharray="2 2" dot={false} />
                      
                      {/* Actual Child line */}
                      <Line
                        type="monotone"
                        dataKey="childWeight"
                        name="Алиса (фактический вес)"
                        stroke="#34443A"
                        strokeWidth={3.5}
                        dot={{ r: 5, fill: '#34443A', stroke: '#FFFFFF', strokeWidth: 2 }}
                        activeDot={{ r: 8 }}
                      />
                    </>
                  ) : (
                    <>
                      <Line type="monotone" dataKey="height_p50" name="Медиана роста ВОЗ (P50)" stroke="#8FA48C" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                      <Line
                        type="monotone"
                        dataKey="childHeight"
                        name="Алиса (фактический рост)"
                        stroke="#34443A"
                        strokeWidth={3.5}
                        dot={{ r: 5, fill: '#34443A', stroke: '#FFFFFF', strokeWidth: 2 }}
                      />
                    </>
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* WHO Explanation Alert */}
            <div className="p-4 rounded-2xl bg-sage-50/80 border border-sage-200/80 flex items-start gap-3">
              <Info className="w-5 h-5 text-sage-700 shrink-0 mt-0.5" />
              <div className="text-xs text-sage-700 leading-relaxed">
                <strong>Как читать перцентили ВОЗ:</strong> Коридор между 15-м и 85-м перцентилями считается наиболее гармоничной нормой физического развития здоровых детей первого года жизни. Показатель Алисы (53-й перцентиль) находится в идеальном центре физиологической нормы.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HEALTH DIARY */}
      {activeTab === 'diary' && (
        <div className="space-y-6">
          {/* Filter Bar & Quick Add */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage-200">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'Все записи' },
                { id: 'feeding', label: 'Кормление' },
                { id: 'sleep', label: 'Сон' },
                { id: 'diaper', label: 'Подгузники' },
                { id: 'temperature', label: 'Температура' },
                { id: 'medication', label: 'Лекарства' },
                { id: 'mood', label: 'Самочувствие' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setDiaryCategoryFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    diaryCategoryFilter === filter.id
                      ? 'bg-sage-800 text-white shadow-xs'
                      : 'bg-white border border-sage-200 text-sage-700 hover:bg-sage-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setQuickLogCategory('feeding');
                setIsQuickLogOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Новая запись</span>
            </button>
          </div>

          {/* Diary Timeline Feed */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-soft">
            <div className="space-y-6">
              {filteredDiary.map((entry, index) => (
                <div key={entry.id} className="relative flex items-start gap-4 group">
                  {/* Timeline connecting line */}
                  {index < filteredDiary.length - 1 && (
                    <div className="absolute top-10 left-5 bottom-0 w-0.5 bg-sage-100 group-hover:bg-sage-200 -mb-6"></div>
                  )}

                  {/* Category Icon Badge */}
                  <div className="w-10 h-10 rounded-2xl bg-sage-100 text-sage-800 flex items-center justify-center shrink-0 z-10 border border-sage-200">
                    {entry.category === 'feeding' && <Utensils className="w-5 h-5 text-amber-700" />}
                    {entry.category === 'sleep' && <Moon className="w-5 h-5 text-softblue-700" />}
                    {entry.category === 'temperature' && <Thermometer className="w-5 h-5 text-rose-600" />}
                    {entry.category === 'medication' && <Pill className="w-5 h-5 text-purple-600" />}
                    {entry.category === 'diaper' && <Baby className="w-5 h-5 text-emerald-700" />}
                    {entry.category === 'mood' && <Smile className="w-5 h-5 text-sage-700" />}
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 bg-warmbeige-50/60 hover:bg-warmbeige-50 rounded-2xl p-4 border border-warmbeige-200/70 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h4 className="text-sm font-bold text-sage-900">{entry.title}</h4>
                      <span className="text-[11px] text-sage-400">
                        {new Date(entry.timestamp).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs text-sage-700 leading-relaxed mt-1">{entry.details}</p>

                    <div className="mt-3 pt-2.5 border-t border-warmbeige-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-sage-500">Внесено: <strong>{entry.loggedBy}</strong></span>
                      {entry.value && (
                        <span className="font-bold text-sage-900 bg-white px-2 py-0.5 rounded-lg border border-sage-200/80">
                          {entry.value} {entry.unit || ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEVELOPMENT MILESTONES */}
      {activeTab === 'milestones' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sage-200">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'Все сферы развития' },
                { id: 'motor', label: 'Моторика' },
                { id: 'speech', label: 'Речь' },
                { id: 'cognitive', label: 'Когнитивные' },
                { id: 'social', label: 'Социальные' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setMilestoneFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    milestoneFilter === cat.id
                      ? 'bg-sage-800 text-white shadow-xs'
                      : 'bg-white border border-sage-200 text-sage-700 hover:bg-sage-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-sage-600">
              Возрастной диапазон: <strong className="text-sage-900">6–9 месяцев</strong>
            </div>
          </div>

          {/* Milestones Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMilestones.map((m) => {
              const isAchieved = m.status === 'achieved';
              return (
                <div
                  key={m.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    isAchieved
                      ? 'bg-white border-emerald-200 shadow-soft'
                      : 'bg-warmbeige-50/70 border-warmbeige-200/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sage-100 text-sage-700">
                          {m.category === 'motor' ? 'Моторика' : m.category === 'speech' ? 'Речь' : m.category === 'cognitive' ? 'Когнитивные' : 'Социальные'}
                        </span>
                        <span className="text-[11px] text-sage-500 font-medium">{m.ageRange}</span>
                      </div>
                      <h4 className="text-sm font-bold text-sage-900">{m.title}</h4>
                      <p className="text-xs text-sage-600 mt-1 leading-relaxed">{m.description}</p>
                    </div>

                    <button
                      onClick={() => toggleMilestoneStatus(m.id)}
                      className={`p-2 rounded-2xl border transition-all shrink-0 ${
                        isAchieved
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                          : 'bg-white border-sage-300 text-sage-400 hover:border-emerald-500 hover:text-emerald-600'
                      }`}
                      title={isAchieved ? 'Навык освоен! Нажмите, чтобы отменить' : 'Отметить как освоенный'}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Expert tip */}
                  <div className="mt-4 pt-3 border-t border-sage-100 flex items-start gap-2 text-xs text-sage-700 bg-sage-50/60 p-2.5 rounded-xl">
                    <Info className="w-4 h-4 text-sage-500 shrink-0 mt-0.5" />
                    <div>
                      <strong>Совет эксперта:</strong> {m.expertTip}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Measurement Modal */}
      {isAddMeasurementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-soft-xl border border-sage-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-sage-100 flex items-center justify-between bg-warmbeige-50">
              <h3 className="text-lg font-bold text-sage-900 font-display">Новый замер роста и веса</h3>
              <button
                onClick={() => setIsAddMeasurementOpen(false)}
                className="text-sage-400 hover:text-sage-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMeasurementSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1">
                  Вес ребенка (кг) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="Например: 8.75"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1">
                  Рост ребенка (см) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newHeight}
                  onChange={(e) => setNewHeight(e.target.value)}
                  placeholder="Например: 71.0"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1">
                  Окружность головы (см)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newHead}
                  onChange={(e) => setNewHead(e.target.value)}
                  placeholder="Например: 44.8"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1">
                  Заметки осмотра
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Самочувствие, комментарии педиатра"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddMeasurementOpen(false)}
                  className="px-4 py-2 text-sm text-sage-600 hover:text-sage-800"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sage-800 hover:bg-sage-900 text-white font-semibold text-sm transition-all"
                >
                  Сохранить замер
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        defaultCategory={quickLogCategory}
      />
    </div>
  );
};
