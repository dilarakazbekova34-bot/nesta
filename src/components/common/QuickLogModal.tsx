// src/components/common/QuickLogModal.tsx
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { DiaryCategory } from '../../types';
import { X, Utensils, Moon, Baby, Thermometer, Pill, Smile, Plus } from 'lucide-react';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: DiaryCategory;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({ isOpen, onClose, defaultCategory = 'feeding' }) => {
  const { addDiaryEntry } = useData();
  const [category, setCategory] = useState<DiaryCategory>(defaultCategory);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('');

  if (!isOpen) return null;

  const categories: { id: DiaryCategory; label: string; icon: React.ReactNode; color: string; defaultUnit?: string }[] = [
    { id: 'feeding', label: 'Кормление', icon: <Utensils className="w-5 h-5" />, color: 'bg-amber-100 text-amber-800 border-amber-300', defaultUnit: 'мл / г' },
    { id: 'sleep', label: 'Сон', icon: <Moon className="w-5 h-5" />, color: 'bg-softblue-100 text-softblue-800 border-softblue-300', defaultUnit: 'мин' },
    { id: 'diaper', label: 'Подгузник', icon: <Baby className="w-5 h-5" />, color: 'bg-emerald-100 text-emerald-800 border-emerald-300', defaultUnit: 'состояние' },
    { id: 'temperature', label: 'Температура', icon: <Thermometer className="w-5 h-5" />, color: 'bg-rose-100 text-rose-800 border-rose-300', defaultUnit: '°C' },
    { id: 'medication', label: 'Лекарство / Витамин', icon: <Pill className="w-5 h-5" />, color: 'bg-purple-100 text-purple-800 border-purple-300', defaultUnit: 'доза' },
    { id: 'mood', label: 'Самочувствие', icon: <Smile className="w-5 h-5" />, color: 'bg-sage-100 text-sage-800 border-sage-300', defaultUnit: 'статус' },
  ];

  const handleCategorySelect = (cat: DiaryCategory) => {
    setCategory(cat);
    const catObj = categories.find(c => c.id === cat);
    if (catObj?.defaultUnit) {
      setUnit(catObj.defaultUnit);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addDiaryEntry({
      category,
      title,
      details: details || 'Запись сохранена в дневнике развития NESTA.',
      value: value || undefined,
      unit: unit || undefined
    });

    // Reset and close
    setTitle('');
    setDetails('');
    setValue('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-soft-xl border border-sage-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-sage-100 flex items-center justify-between bg-warmbeige-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sage-800 text-white flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-sage-900 font-display">Быстрая запись в Дневник</h3>
              <p className="text-xs text-sage-600">Сохраняйте события дня в пару кликов</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-sage-400 hover:text-sage-700 hover:bg-sage-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category selector */}
          <div>
            <label className="block text-xs font-semibold text-sage-700 uppercase tracking-wider mb-2.5">
              Категория события
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {categories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? `${cat.color} border-2 shadow-sm scale-102`
                        : 'border-sage-200 text-sage-600 hover:bg-sage-50/70 hover:border-sage-300'
                    }`}
                  >
                    <div className="mb-1.5">{cat.icon}</div>
                    <span className="text-center">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-sage-700 mb-1.5">
              Заголовок события <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                category === 'feeding' ? 'Например: Завтрак (гречневая каша)' :
                category === 'sleep' ? 'Например: Дневной сон на прогулке' :
                category === 'temperature' ? 'Например: Замер перед сном' :
                category === 'medication' ? 'Например: Витамин D3 (2 капли)' :
                category === 'diaper' ? 'Например: Смена подгузника после сна' :
                'Например: Отличное настроение, играет'
              }
              className="w-full px-4 py-2.5 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/30 focus:border-sage-600 text-sm"
            />
          </div>

          {/* Value and Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-sage-700 mb-1.5">
                Значение / Количество
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Например: 150 или 36.6"
                className="w-full px-4 py-2.5 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/30 focus:border-sage-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-sage-700 mb-1.5">
                Единицы измерения
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="мл, г, мин, °C, МЕ"
                className="w-full px-4 py-2.5 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/30 focus:border-sage-600 text-sm"
              />
            </div>
          </div>

          {/* Notes / Details */}
          <div>
            <label className="block text-xs font-semibold text-sage-700 mb-1.5">
              Подробные заметки (необязательно)
            </label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Как прошло, реакция малыша, самочувствие..."
              className="w-full px-4 py-2 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/30 focus:border-sage-600 text-sm resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sage-600 hover:text-sage-800 font-medium text-sm transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-sage-800 hover:bg-sage-900 text-white font-semibold text-sm transition-all shadow-sm hover:shadow"
            >
              Сохранить запись
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
