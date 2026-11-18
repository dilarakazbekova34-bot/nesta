// src/pages/pregnancy/PregnancyCalendarPage.tsx
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Plus, 
  AlertCircle, 
  Trash2, 
  Filter, 
  FileCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface PregnancyEvent {
  id: string;
  week: number;
  date: string;
  title: string;
  category: 'screening' | 'doctor' | 'lab' | 'personal';
  details: string;
  isCompleted: boolean;
  isMandatory: boolean;
}

const DEFAULT_PREGNANCY_EVENTS: PregnancyEvent[] = [
  {
    id: 'pe_1',
    week: 12,
    date: '2026-07-20',
    title: 'Первый пренатальный биохимический скрининг',
    category: 'screening',
    details: 'УЗИ экспертного класса (ТВП, носовая кость) + кровь на PAPP-A и св. бета-ХГЧ',
    isCompleted: true,
    isMandatory: true
  },
  {
    id: 'pe_2',
    week: 20,
    date: '2026-09-14',
    title: 'Второй анатомический ультразвуковой скрининг',
    category: 'screening',
    details: 'Детальная оценка анатомии органов плода, плаценты, пуповины и цервикометрия',
    isCompleted: true,
    isMandatory: true
  },
  {
    id: 'pe_3',
    week: 25,
    date: '2026-10-19',
    title: 'Глюкозотолерантный тест (ПГТТ с 75 г глюкозы)',
    category: 'lab',
    details: 'Исключение гестационного сахарного диабета. Сдается строго натощак',
    isCompleted: true,
    isMandatory: true
  },
  {
    id: 'pe_4',
    week: 30,
    date: '2026-11-23',
    title: 'Оформление декретного отпуска и дородового листа',
    category: 'doctor',
    details: 'Выписка больничного листа и обменной карты в женской консультации',
    isCompleted: false,
    isMandatory: true
  },
  {
    id: 'pe_5',
    week: 32,
    date: '2026-12-07',
    title: 'Третий скрининг УЗИ + Допплерометрия',
    category: 'screening',
    details: 'Оценка темпов роста плода и маточно-плацентарно-плодового кровотока',
    isCompleted: false,
    isMandatory: true
  },
  {
    id: 'pe_6',
    week: 36,
    date: '2027-01-04',
    title: 'КТГ плода и мазок на стрептококк группы B (GBS)',
    category: 'lab',
    details: 'Запись сердечного ритма малыша и бактериологический скрининг',
    isCompleted: false,
    isMandatory: true
  },
  {
    id: 'pe_7',
    week: 28,
    date: '2026-11-12',
    title: 'Курсы подготовки к партнерским родам',
    category: 'personal',
    details: 'Занятие по дыхательным техникам и массажу в первом периоде родов',
    isCompleted: true,
    isMandatory: false
  }
];

export const PregnancyCalendarPage: React.FC = () => {
  const { pregnancy } = useData();

  const [events, setEvents] = useState<PregnancyEvent[]>(() => {
    const saved = localStorage.getItem('nesta_preg_events');
    return saved ? JSON.parse(saved) : DEFAULT_PREGNANCY_EVENTS;
  });

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'screening' | 'doctor' | 'personal'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New event form state
  const [newTitle, setNewTitle] = useState('');
  const [newWeek, setNewWeek] = useState(pregnancy.currentWeek || 28);
  const [newDate, setNewDate] = useState('2026-11-20');
  const [newCategory, setNewCategory] = useState<'screening' | 'doctor' | 'lab' | 'personal'>('doctor');
  const [newDetails, setNewDetails] = useState('');

  const saveEvents = (updated: PregnancyEvent[]) => {
    setEvents(updated);
    localStorage.setItem('nesta_preg_events', JSON.stringify(updated));
  };

  const toggleComplete = (id: string) => {
    const updated = events.map(e => e.id === id ? { ...e, isCompleted: !e.isCompleted } : e);
    saveEvents(updated);
  };

  const deleteEvent = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    saveEvents(updated);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newEv: PregnancyEvent = {
      id: 'pe_' + Date.now(),
      week: Number(newWeek),
      date: newDate,
      title: newTitle,
      category: newCategory,
      details: newDetails || 'Индивидуальная запись',
      isCompleted: false,
      isMandatory: false
    };

    saveEvents([...events, newEv]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDetails('');
  };

  const filteredEvents = events.filter(e => {
    if (selectedFilter === 'all') return true;
    return e.category === selectedFilter;
  });

  const completedCount = events.filter(e => e.isCompleted).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-softblue-800 bg-softblue-100 px-3 py-1 rounded-full">
              Приоритет 1 • Клинический календарь
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900 mt-2">
            Календарь беременности и скринингов
          </h1>
          <p className="text-xs sm:text-sm text-sage-600 mt-1">
            Официальный протокол ведения беременности МЗ РК, плановые визиты, анализы и личные события
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white font-bold text-xs shadow-soft transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить событие</span>
        </button>
      </div>

      {/* Progress Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-sage-200 shadow-soft">
          <span className="text-[10px] uppercase font-bold text-sage-500 block">Пройдено обследований</span>
          <div className="text-2xl font-bold font-display text-sage-900 mt-1">
            {completedCount} из {events.length}
          </div>
          <div className="w-full bg-sage-100 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all"
              style={{ width: `${(completedCount / events.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-200 shadow-soft">
          <span className="text-[10px] uppercase font-bold text-sage-500 block">Текущий срок</span>
          <div className="text-2xl font-bold font-display text-sage-900 mt-1">
            {pregnancy.currentWeek}-я неделя
          </div>
          <span className="text-xs text-softblue-700 font-medium">3-й триместр гестации</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-200 shadow-soft">
          <span className="text-[10px] uppercase font-bold text-sage-500 block">Предполагаемая дата родов</span>
          <div className="text-2xl font-bold font-display text-sage-900 mt-1">
            5 февраля 2027
          </div>
          <span className="text-xs text-sage-500 font-medium">Осталось ~84 дня</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-sage-200/80 gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Все события' },
          { id: 'screening', label: 'Скрининги и УЗИ' },
          { id: 'doctor', label: 'Визиты к врачу' },
          { id: 'personal', label: 'Личные напоминания' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id as any)}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              selectedFilter === tab.id
                ? 'border-sage-800 text-sage-900'
                : 'border-transparent text-sage-500 hover:text-sage-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events Timeline List */}
      <div className="space-y-3">
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              ev.isCompleted
                ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
                : 'bg-white border-sage-200 text-sage-900 shadow-soft'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <button
                onClick={() => toggleComplete(ev.id)}
                className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  ev.isCompleted
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-sage-300 hover:border-sage-500 bg-white'
                }`}
                title={ev.isCompleted ? 'Отметить как невыполненное' : 'Отметить выполненным'}
              >
                {ev.isCompleted && <CheckCircle2 className="w-4 h-4" />}
              </button>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-sm font-bold ${ev.isCompleted ? 'line-through text-sage-500' : 'text-sage-900'}`}>
                    {ev.title}
                  </span>
                  <span className="text-[10px] font-bold text-sage-600 bg-sage-100 px-2 py-0.5 rounded-full">
                    {ev.week} нед.
                  </span>
                  {ev.isMandatory && (
                    <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      Обязательно
                    </span>
                  )}
                </div>
                <p className="text-xs text-sage-600 leading-relaxed">{ev.details}</p>
                <div className="text-[11px] text-sage-400 flex items-center gap-1.5 pt-0.5">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>{ev.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className={`text-xs font-bold px-3 py-1 rounded-xl ${
                ev.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-softblue-100 text-softblue-900'
              }`}>
                {ev.isCompleted ? 'Пройдено' : 'Запланировано'}
              </span>

              {!ev.isMandatory && (
                <button
                  onClick={() => deleteEvent(ev.id)}
                  className="p-1.5 rounded-xl text-sage-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Удалить личное событие"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-4xl p-6 sm:p-8 max-w-md w-full shadow-soft-xl border border-sage-100 space-y-4">
            <h3 className="text-xl font-bold font-display text-sage-900">
              Новое событие беременности
            </h3>

            <form onSubmit={handleAddEvent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1">
                  Название события / обследования
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Например, Осмотр окулиста"
                  className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-sage-700 mb-1">
                    Срок (неделя)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="42"
                    value={newWeek}
                    onChange={(e) => setNewWeek(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sage-700 mb-1">
                    Дата
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1">
                  Категория
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30 bg-white"
                >
                  <option value="doctor">Визит к врачу</option>
                  <option value="screening">Скрининг / УЗИ</option>
                  <option value="lab">Лабораторный анализ</option>
                  <option value="personal">Личное напоминание</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1">
                  Детали и заметки
                </label>
                <textarea
                  rows={2}
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder="Взять с собой обменную карту и результаты прошлых анализов"
                  className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
