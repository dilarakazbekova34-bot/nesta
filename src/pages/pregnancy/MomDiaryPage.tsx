// src/pages/pregnancy/MomDiaryPage.tsx
import React, { useState } from 'react';
import { 
  Heart, 
  Smile, 
  Activity, 
  Moon, 
  Utensils, 
  Scale, 
  Camera, 
  Plus, 
  Trash2, 
  Calendar, 
  Search, 
  Filter,
  CheckCircle2,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';

export interface MomDiaryItem {
  id: string;
  week: number;
  date: string;
  mood: 'joy' | 'calm' | 'tired' | 'anxious';
  moodLabel: string;
  weightKg?: number;
  sleepHours?: number;
  symptoms: string[];
  notes: string;
  photoUrl?: string;
}

const DEFAULT_MOM_DIARY: MomDiaryItem[] = [
  {
    id: 'md_1',
    week: 28,
    date: '2026-11-15',
    mood: 'joy',
    moodLabel: 'Радостное, подъем сил',
    weightKg: 64.8,
    sleepHours: 8.5,
    symptoms: ['Легкие тренировочные схватки Брекстона-Хикса', 'Активные толчки малыша'],
    notes: 'Малыш очень активно реагировал на голос папы вечером! Чувствую себя легко, гуляли в парке 1.5 часа.',
    photoUrl: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'md_2',
    week: 27,
    date: '2026-11-08',
    mood: 'calm',
    moodLabel: 'Спокойное, умиротворенное',
    weightKg: 64.2,
    sleepHours: 7.5,
    symptoms: ['Тяжесть в пояснице к вечеру', 'Изжога после ужина'],
    notes: 'Купила подушку для беременных в форме банана — спать стало в 10 раз удобнее. Изжогу сняла минеральной водой Ессентуки-4.',
  },
  {
    id: 'md_3',
    week: 24,
    date: '2026-10-18',
    mood: 'calm',
    moodLabel: 'Хорошее, стабильное',
    weightKg: 62.9,
    sleepHours: 8.0,
    symptoms: ['Сдала ГТТ (сахар в норме)'],
    notes: 'Результат глюкозотолерантного теста отличный, диабет исключен. Разрешила себе кусочек полезного чизкейка!',
  }
];

export const MomDiaryPage: React.FC = () => {
  const [entries, setEntries] = useState<MomDiaryItem[]>(() => {
    const saved = localStorage.getItem('nesta_mom_diary');
    return saved ? JSON.parse(saved) : DEFAULT_MOM_DIARY;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [newWeek, setNewWeek] = useState(28);
  const [newDate, setNewDate] = useState('2026-11-16');
  const [newMood, setNewMood] = useState<'joy' | 'calm' | 'tired' | 'anxious'>('joy');
  const [newWeight, setNewWeight] = useState('65.1');
  const [newSleep, setNewSleep] = useState('8');
  const [newNotes, setNewNotes] = useState('');
  const [newSymptomInput, setNewSymptomInput] = useState('');
  const [newSymptoms, setNewSymptoms] = useState<string[]>(['Хороший аппетит']);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const saveEntries = (updated: MomDiaryItem[]) => {
    setEntries(updated);
    localStorage.setItem('nesta_mom_diary', JSON.stringify(updated));
  };

  const handleAddSymptom = () => {
    if (newSymptomInput.trim()) {
      setNewSymptoms([...newSymptoms, newSymptomInput.trim()]);
      setNewSymptomInput('');
    }
  };

  const handleRemoveSymptom = (index: number) => {
    setNewSymptoms(newSymptoms.filter((_, i) => i !== index));
  };

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const moodMap = {
      joy: 'Радостное, подъем сил',
      calm: 'Спокойное, комфортное',
      tired: 'Усталость, сонливость',
      anxious: 'Тревожное, нужен отдых'
    };

    const newEntry: MomDiaryItem = {
      id: 'md_' + Date.now(),
      week: Number(newWeek),
      date: newDate,
      mood: newMood,
      moodLabel: moodMap[newMood],
      weightKg: newWeight ? Number(newWeight) : undefined,
      sleepHours: newSleep ? Number(newSleep) : undefined,
      symptoms: newSymptoms,
      notes: newNotes || 'Запись без описания',
      photoUrl: newPhotoUrl || undefined
    };

    saveEntries([newEntry, ...entries]);
    setIsAddModalOpen(false);
    setNewNotes('');
    setNewPhotoUrl('');
  };

  const handleDelete = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id));
  };

  const filtered = entries.filter(e => 
    e.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-softblue-800 bg-softblue-100 px-3 py-1 rounded-full">
              Приоритет 1 • Персональный дневник
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900 mt-2">
            Дневник будущей мамы
          </h1>
          <p className="text-xs sm:text-sm text-sage-600 mt-1">
            Самочувствие, настроение, симптомы, вес, сон и фотохроника животика
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white font-bold text-xs shadow-soft transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Новая запись в дневник</span>
        </button>
      </div>

      {/* Metrics Dynamics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-sage-200 shadow-soft">
          <span className="text-[10px] uppercase font-bold text-sage-500 block">Текущий вес</span>
          <div className="text-2xl font-bold font-display text-sage-900 mt-1">64.8 кг</div>
          <span className="text-xs text-emerald-700 font-medium">+8.2 кг с зачатия (В норме)</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-200 shadow-soft">
          <span className="text-[10px] uppercase font-bold text-sage-500 block">Средний сон</span>
          <div className="text-2xl font-bold font-display text-sage-900 mt-1">8.1 ч / сутки</div>
          <span className="text-xs text-sage-500 font-medium">Качественный отдых</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-sage-200 shadow-soft">
          <span className="text-[10px] uppercase font-bold text-sage-500 block">Записей в хронологии</span>
          <div className="text-2xl font-bold font-display text-sage-900 mt-1">{entries.length}</div>
          <span className="text-xs text-softblue-700 font-medium">История 28 недель</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по заметкам, ощущениям и симптомам..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
        />
      </div>

      {/* Entries Timeline */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 border border-sage-200 shadow-soft space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-sage-100 gap-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-softblue-100 text-softblue-900">
                  {item.week}-я неделя
                </span>
                <span className="text-xs font-semibold text-sage-500">{item.date}</span>
                <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {item.moodLabel}
                </span>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-xl text-sage-400 hover:text-rose-600 hover:bg-rose-50 transition-colors self-end sm:self-auto"
                title="Удалить запись"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-8 space-y-3">
                <p className="text-sm text-sage-800 leading-relaxed">{item.notes}</p>

                {/* Symptoms pills */}
                {item.symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.symptoms.map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-warmbeige-50 border border-warmbeige-200 text-sage-700"
                      >
                        • {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Indicators bar */}
                <div className="flex items-center gap-4 text-xs text-sage-600 pt-2 border-t border-sage-100">
                  {item.weightKg && (
                    <div className="flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-sage-400" />
                      <span>Вес: <strong>{item.weightKg} кг</strong></span>
                    </div>
                  )}
                  {item.sleepHours && (
                    <div className="flex items-center gap-1.5">
                      <Moon className="w-3.5 h-3.5 text-sage-400" />
                      <span>Сон: <strong>{item.sleepHours} ч</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {item.photoUrl && (
                <div className="md:col-span-4 flex justify-center">
                  <img
                    src={item.photoUrl}
                    alt="Фото животика"
                    className="w-36 h-36 rounded-2xl object-cover border border-sage-200 shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Diary Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-4xl p-6 sm:p-8 max-w-lg w-full shadow-soft-xl border border-sage-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-display text-sage-900">
              Новая запись в дневник мамы
            </h3>

            <form onSubmit={handleCreateEntry} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-sage-700 mb-1">Срок (неделя)</label>
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
                  <label className="block text-xs font-semibold text-sage-700 mb-1">Дата</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1.5">Настроение</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'joy', label: '😊 Радостное' },
                    { id: 'calm', label: '😌 Спокойное' },
                    { id: 'tired', label: '🥱 Усталость' },
                    { id: 'anxious', label: '🥺 Тревожное' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setNewMood(m.id as any)}
                      className={`p-2.5 rounded-2xl border text-xs font-semibold text-center transition-all ${
                        newMood === m.id ? 'bg-sage-800 text-white border-sage-800' : 'bg-white border-sage-200 text-sage-700'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-sage-700 mb-1">Вес (кг)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="65.0"
                    className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-sage-700 mb-1">Сон (часов)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newSleep}
                    onChange={(e) => setNewSleep(e.target.value)}
                    placeholder="8"
                    className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1">Симптомы и ощущения</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSymptomInput}
                    onChange={(e) => setNewSymptomInput(e.target.value)}
                    placeholder="Добавить симптом (например, тонус, изжога)"
                    className="flex-1 px-4 py-2 rounded-2xl border border-sage-200 text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSymptom}
                    className="px-3 py-2 bg-sage-800 text-white rounded-2xl text-xs font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {newSymptoms.map((s, idx) => (
                    <span
                      key={idx}
                      onClick={() => handleRemoveSymptom(idx)}
                      className="px-2.5 py-1 rounded-xl text-xs bg-sage-100 text-sage-800 cursor-pointer hover:bg-rose-100 hover:text-rose-800"
                    >
                      {s} ✕
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1">Заметки и мысли</label>
                <textarea
                  rows={3}
                  required
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Как прошел день? Что чувствовал малыш?"
                  className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1">Ссылка на фото живота (опционально)</label>
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none"
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
                  Сохранить в дневник
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
