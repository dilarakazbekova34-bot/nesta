// src/pages/pregnancy/Baby3DPage.tsx
import React, { useState } from 'react';
import { Baby3DViewer } from '../../components/3d/Baby3DViewer';
import { useData } from '../../context/DataContext';
import { getWeeklyData } from '../../data/pregnancyWeeklyData';
import { 
  Sparkles, 
  Activity, 
  Heart, 
  ShieldCheck, 
  Calendar, 
  FileCheck, 
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Baby3DPage: React.FC = () => {
  const { pregnancy, updatePregnancy } = useData();
  const [selectedWeek, setSelectedWeek] = useState(pregnancy.currentWeek || 28);

  const weeklyInfo = getWeeklyData(selectedWeek);

  const handleWeekChange = (week: number) => {
    setSelectedWeek(week);
    updatePregnancy({ currentWeek: week });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-softblue-800 bg-softblue-100 px-3 py-1 rounded-full">
              Приоритет 1 • 3D-визуализация
            </span>
            <span className="text-xs font-semibold text-sage-500">
              {weeklyInfo.trimester}-й триместр
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900 mt-2">
            3D-малыш по неделям
          </h1>
          <p className="text-xs sm:text-sm text-sage-600 mt-1">
            Интерактивная 3D-модель развития плода с вращением 360°, приближением и анатомическими точками
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/pregnancy/baby-size"
            className="px-4 py-2 rounded-2xl bg-white hover:bg-sage-50 border border-sage-200 text-xs font-bold text-sage-800 transition-colors shadow-xs"
          >
            Сравнение с фруктом →
          </Link>
          <Link
            to="/pregnancy/anatomy"
            className="px-4 py-2 rounded-2xl bg-sage-800 hover:bg-sage-900 text-xs font-bold text-white transition-colors shadow-soft"
          >
            Анатомия матки
          </Link>
        </div>
      </div>

      {/* Main 3D Interactive Canvas Component */}
      <Baby3DViewer
        currentWeek={selectedWeek}
        onWeekChange={handleWeekChange}
      />

      {/* Detailed Clinical Information Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: What is happening with baby */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sage-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 text-sage-900">
            <div className="w-8 h-8 rounded-xl bg-softblue-100 text-softblue-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold font-display">Развитие малыша на {selectedWeek}-й неделе</h3>
          </div>

          <p className="text-xs sm:text-sm text-sage-700 leading-relaxed">
            {weeklyInfo.fetalDevelopment}
          </p>

          <div className="space-y-2 pt-2 border-t border-sage-100">
            <span className="text-[11px] uppercase font-bold text-sage-500 block">
              Ключевые этапы органов:
            </span>
            <ul className="text-xs text-sage-800 space-y-1.5 list-disc list-inside">
              {weeklyInfo.organHighlights.map((hl, i) => (
                <li key={i}>{hl}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Card 2: Maternal body changes & sensations */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sage-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 text-sage-900">
            <div className="w-8 h-8 rounded-xl bg-warmbeige-100 text-warmbeige-800 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold font-display">Организм и ощущения мамы</h3>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] uppercase font-bold text-sage-500 block">
              Физиологические изменения:
            </span>
            <ul className="text-xs text-sage-800 space-y-1.5 list-disc list-inside">
              {weeklyInfo.maternalBodyChanges.map((mb, i) => (
                <li key={i}>{mb}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-sage-100">
            <span className="text-[11px] uppercase font-bold text-sage-500 block">
              Что может ощущаться:
            </span>
            <ul className="text-xs text-sage-800 space-y-1.5 list-disc list-inside">
              {weeklyInfo.maternalSymptoms.map((ms, i) => (
                <li key={i}>{ms}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Official Approved Clinical Recommendations Banner */}
      <div className="bg-warmbeige-50/80 rounded-3xl p-6 sm:p-8 border border-warmbeige-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-warmbeige-200">
          <div className="flex items-center gap-2.5">
            <FileCheck className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold font-display text-sage-900">
              Важные обследования по официальным клиническим протоколам ({selectedWeek}-я неделя)
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-sage-600 bg-white px-3 py-1 rounded-full border border-warmbeige-200">
            {weeklyInfo.verifiedSource}
          </span>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-sage-800">
          {weeklyInfo.clinicalRecommendations.map((rec, idx) => (
            <li key={idx} className="p-3.5 rounded-2xl bg-white border border-warmbeige-200/70 flex items-start gap-2.5 shadow-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{rec}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-2 text-[11px] text-sage-500">
          <span>Рекомендации согласованы с Приказом МЗ РК № ҚР ДСМ-92 и стандартами ВОЗ</span>
          <a
            href={weeklyInfo.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-softblue-700 hover:underline font-semibold"
          >
            Проверить первоисточник →
          </a>
        </div>
      </div>
    </div>
  );
};
