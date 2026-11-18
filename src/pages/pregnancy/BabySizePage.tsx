// src/pages/pregnancy/BabySizePage.tsx
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Fruit3DViewer } from '../../components/3d/Fruit3DViewer';
import { getWeeklyData } from '../../data/pregnancyWeeklyData';
import { ShieldCheck, Info, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BabySizePage: React.FC = () => {
  const { pregnancy, updatePregnancy } = useData();
  const [selectedWeek, setSelectedWeek] = useState(pregnancy.currentWeek || 28);

  const weeklyInfo = getWeeklyData(selectedWeek);

  const sampleWeeks = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40];

  const handleSelectWeek = (wk: number) => {
    setSelectedWeek(wk);
    updatePregnancy({ currentWeek: wk });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-softblue-800 bg-softblue-100 px-3 py-1 rounded-full">
              Приоритет 1 • Размер малыша
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900 mt-2">
            Сравнение с фруктами и предметами
          </h1>
          <p className="text-xs sm:text-sm text-sage-600 mt-1">
            Наглядные образовательные сравнения размера и веса плода неделя за неделей
          </p>
        </div>

        <Link
          to="/pregnancy/3d-baby"
          className="px-4 py-2 rounded-2xl bg-sage-800 hover:bg-sage-900 text-xs font-bold text-white transition-colors shadow-soft"
        >
          ← Вернуться к 3D-малышу
        </Link>
      </div>

      {/* Main 3D Interactive Fruit Viewer */}
      <Fruit3DViewer currentWeek={selectedWeek} />

      {/* Horizontal Week Quick Selector */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold font-display text-sage-900">
          Выберите ключевую неделю беременности:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {sampleWeeks.map((wk) => {
            const data = getWeeklyData(wk);
            const isSelected = selectedWeek === wk;
            return (
              <button
                key={wk}
                onClick={() => handleSelectWeek(wk)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-sage-800 text-white border-sage-800 shadow-soft'
                    : 'bg-white hover:bg-sage-50 border-sage-200 text-sage-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{wk}-я неделя</span>
                  <span className="text-xl">{data.fruitEmoji}</span>
                </div>
                <div className={`text-xs mt-1 font-semibold truncate ${isSelected ? 'text-sage-200' : 'text-sage-600'}`}>
                  {data.babyFruitComparison}
                </div>
                <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-sage-300' : 'text-sage-400'}`}>
                  {data.babyLengthEstimate} • {data.babyWeightEstimate}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Full 40-Week Comparison Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-sage-100">
          <div>
            <h3 className="text-base font-bold font-display text-sage-900">
              Справочник размеров плода (1–40 недель)
            </h3>
            <p className="text-xs text-sage-500">Официальные медианные показатели ВОЗ</p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            WHO Fetal Growth Standards
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { w: 4, name: 'Маковое семечко', emoji: '🌱', l: '1 мм', m: '< 1 г' },
            { w: 8, name: 'Малина', emoji: '🫐', l: '1.6 см', m: '1.5 г' },
            { w: 12, name: 'Лайм', emoji: '🍈', l: '5.4 см', m: '14 г' },
            { w: 16, name: 'Авокадо', emoji: '🥑', l: '11.6 см', m: '100 г' },
            { w: 20, name: 'Банан', emoji: '🍌', l: '25.6 см', m: '300 г' },
            { w: 24, name: 'Кукуруза', emoji: '🌽', l: '30.0 см', m: '600 г' },
            { w: 28, name: 'Баклажан', emoji: '🍆', l: '37.5 см', m: '1 100 г' },
            { w: 32, name: 'Кокос', emoji: '🥥', l: '42.4 см', m: '1 800 г' },
            { w: 36, name: 'Папайя', emoji: '🍈', l: '47.4 см', m: '2 600 г' },
            { w: 40, name: 'Арбуз', emoji: '🍉', l: '51.2 см', m: '3 400 г' },
          ].map((item) => (
            <div
              key={item.w}
              onClick={() => handleSelectWeek(item.w)}
              className="p-3 rounded-2xl bg-warmbeige-50/60 border border-sage-100 hover:border-sage-300 cursor-pointer transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <span className="text-xs font-bold text-sage-900 block">{item.w} нед. — {item.name}</span>
                  <span className="text-[11px] text-sage-500">Длина: {item.l}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-sage-700 bg-white px-2.5 py-1 rounded-xl border border-sage-200">
                {item.m}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
