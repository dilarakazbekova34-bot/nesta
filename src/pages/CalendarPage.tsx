// src/pages/CalendarPage.tsx
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Filter, 
  Baby, 
  Heart, 
  Syringe, 
  Activity,
  AlertCircle
} from 'lucide-react';

interface GeneralEvent {
  id: string;
  title: string;
  category: 'pregnancy' | 'vaccine' | 'pediatric' | 'growth' | 'personal';
  categoryLabel: string;
  date: string;
  time: string;
  forWhom: string;
  details: string;
  isDone: boolean;
}

const DEFAULT_GENERAL_EVENTS: GeneralEvent[] = [
  {
    id: 'ge_1',
    title: 'Третий скрининг УЗИ + Допплерометрия',
    category: 'pregnancy',
    categoryLabel: 'Беременность',
    date: '2026-12-07',
    time: '11:00',
    forWhom: 'Мама (Анна)',
    details: 'Оценка темпов роста плода и маточного кровотока',
    isDone: false
  },
  {
    id: 'ge_2',
    title: 'Плановый осмотр педиатра (9 месяцев)',
    category: 'pediatric',
    categoryLabel: 'Педиатр',
    date: '2026-12-12',
    time: '15:30',
    forWhom: 'Алиса (дочь)',
    details: 'Контрольное взвешивание, измерение роста и окружности головы',
    isDone: false
  },
  {
    id: 'ge_3',
    title: 'Вакцинация ПКВ-3 (Пневмококк)',
    category: 'vaccine',
    categoryLabel: 'Прививка',
    date: '2027-03-12',
    time: '10:00',
    forWhom: 'Алиса (дочь)',
    details: 'Ревакцинация по Национальному календарю прививок РК в 12 месяцев',
    isDone: false
  },
  {
    id: 'ge_4',
    title: 'Контрольное измерение веса мамы',
    category: 'growth',
    categoryLabel: 'Контроль веса',
    date: '2026-11-20',
    time: '08:00',
    forWhom: 'Мама (Анна)',
    details: 'Утреннее взвешивание натощак для графика прибавки',
    isDone: true
  }
];

export const CalendarPage: React.FC = () => {
  const { child, pregnancy } = useData();
  const { profileMode } = useAuth();

  const [events, setEvents] = useState<GeneralEvent[]>(() => {
    const saved = localStorage.getItem('nesta_general_events');
    return saved ? JSON.parse(saved) : DEFAULT_GENERAL_EVENTS;
  });

  const [filter, setFilter] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Event Form State
  const [title, setTitle] = useState('');
  const [cat, setCat] = useState<GeneralEvent['category']>('pediatric');
  const [date, setDate] = useState('2026-11-25');
  const [time, setTime] = useState('10:00');
  const [forWhom, setForWhom] = useState(child.name);
  const [details, setDetails] = useState('');

  const saveEvents = (updated: GeneralEvent[]) => {
    setEvents(updated);
    localStorage.setItem('nesta_general_events', JSON.stringify(updated));
  };

  const toggleDone = (id: string) => {
    const updated = events.map(e => e.id === id ? { ...e, isDone: !e.isDone } : e);
    saveEvents(updated);
  };

  const deleteEv = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    saveEvents(updated);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const catLabels = {
      pregnancy: 'Беременность',
      vaccine: 'Вакцинация',
      pediatric: 'Педиатр',
      growth: 'Измерения',
      personal: 'Личное'
    };

    const newEv: GeneralEvent = {
      id: 'ge_' + Date.now(),
      title: title.trim(),
      category: cat,
      categoryLabel: catLabels[cat],
      date,
      time,
      forWhom,
      details: details || 'Семейное событие NESTA',
      isDone: false
    };

    saveEvents([...events, newEv]);
    setIsAddOpen(false);
    setTitle('');
    setDetails('');
  };

  const filtered = events.filter(e => {
    if (filter === 'all') return true;
    return e.category === filter;
  });

  const completedCount = events.filter(e => e.isDone).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-softblue-800 bg-softblue-100 px-3 py-1 rounded-full">
              Единый семейный календарь
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900 mt-2">
            Общий календарь и напоминания
          </h1>
          <p className="text-xs sm:text-sm text-sage-600 mt-1">
            Плановые осмотры, вакцинация, обследования беременности, замеры и события семьи
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white font-bold text-xs shadow-soft transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить напоминание</span>
        </button>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-sage-200 shadow-soft">
          <span className="text-[10px] uppercase font-bold text-sage-500 block">Выполнено событий</span>
          <div className="text-2xl font-bold font-display text-sage-900 mt-1">
            {completedCount} из {events.length}
          </div>
          <span className="text-xs text-emerald-700 font-medium">Актуальный график семьи</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-200 shadow-soft">
          <span className="text-[10px] uppercase font-bold text-sage-500 block">Профиль беременности</span>
          <div className="text-2xl font-bold font-display text-sage-900 mt-1">28 нед.</div>
          <span className="text-xs text-softblue-700 font-medium">ПДР: 5 февраля 2027</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-200 shadow-soft">
          <span className="text-[10px] uppercase font-bold text-sage-500 block">Профиль ребёнка</span>
          <div className="text-2xl font-bold font-display text-sage-900 mt-1">{child.name}</div>
          <span className="text-xs text-sage-500 font-medium">8 месяцев (след. осмотр в 9 мес)</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Все события' },
          { id: 'pregnancy', label: 'Беременность' },
          { id: 'pediatric', label: 'Педиатр' },
          { id: 'vaccine', label: 'Вакцинация' },
          { id: 'growth', label: 'Измерения' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              filter === f.id
                ? 'bg-sage-800 text-white border-sage-800 shadow-soft'
                : 'bg-white hover:bg-sage-50 text-sage-700 border-sage-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              item.isDone
                ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
                : 'bg-white border-sage-200 text-sage-900 shadow-soft'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <button
                onClick={() => toggleDone(item.id)}
                className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  item.isDone
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-sage-300 hover:border-sage-500 bg-white'
                }`}
              >
                {item.isDone && <CheckCircle2 className="w-4 h-4" />}
              </button>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-sm font-bold ${item.isDone ? 'line-through text-sage-500' : 'text-sage-900'}`}>
                    {item.title}
                  </span>
                  <span className="text-[10px] font-bold text-softblue-800 bg-softblue-100 px-2.5 py-0.5 rounded-full">
                    {item.categoryLabel}
                  </span>
                  <span className="text-[10px] font-semibold text-sage-600 bg-sage-100 px-2 py-0.5 rounded-full">
                    Для: {item.forWhom}
                  </span>
                </div>
                <p className="text-xs text-sage-600 leading-relaxed">{item.details}</p>
                <div className="text-[11px] text-sage-400 flex items-center gap-3 pt-0.5">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.time}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className={`text-xs font-bold px-3 py-1 rounded-xl ${
                item.isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-softblue-100 text-softblue-900'
              }`}>
                {item.isDone ? 'Выполнено' : 'Предстоит'}
              </span>

              <button
                onClick={() => deleteEv(item.id)}
                className="p-1.5 rounded-xl text-sage-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Удалить"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-4xl p-6 sm:p-8 max-w-md w-full shadow-soft-xl border border-sage-100 space-y-4">
            <h3 className="text-xl font-bold font-display text-sage-900">Новое семейное событие</h3>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1">Название события</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Например, Визит к стоматологу"
                  className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-sage-700 mb-1">Категория</label>
                  <select
                    value={cat}
                    onChange={(e) => setCat(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none bg-white"
                  >
                    <option value="pediatric">Педиатр</option>
                    <option value="pregnancy">Беременность</option>
                    <option value="vaccine">Вакцинация</option>
                    <option value="growth">Контроль роста</option>
                    <option value="personal">Личное</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sage-700 mb-1">Для кого</label>
                  <input
                    type="text"
                    value={forWhom}
                    onChange={(e) => setForWhom(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-sage-700 mb-1">Дата</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sage-700 mb-1">Время</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1">Детали</label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Дополнительные заметки"
                  className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl border border-sage-200 text-xs font-semibold text-sage-700 hover:bg-sage-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-soft"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
