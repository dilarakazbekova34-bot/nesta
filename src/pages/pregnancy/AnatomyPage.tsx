// src/pages/pregnancy/AnatomyPage.tsx
import React from 'react';
import { Anatomy3DViewer, ANATOMICAL_ELEMENTS } from '../../components/3d/Anatomy3DViewer';
import { ShieldCheck, Info, Sparkles, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AnatomyPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-softblue-800 bg-softblue-100 px-3 py-1 rounded-full">
              Приоритет 2 • Интерактивная анатомия
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900 mt-2">
            Анатомия беременности
          </h1>
          <p className="text-xs sm:text-sm text-sage-600 mt-1">
            Интерактивная 3D-модель матки, плаценты, плода, пуповины, околоплодных вод и шейки матки
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/pregnancy/organs"
            className="px-4 py-2 rounded-2xl bg-white hover:bg-sage-50 border border-sage-200 text-xs font-bold text-sage-800 transition-colors shadow-xs"
          >
            Развитие органов плода →
          </Link>
        </div>
      </div>

      {/* Main 3D Anatomy Viewer */}
      <Anatomy3DViewer />

      {/* Medical Summary Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-soft space-y-4">
        <h3 className="text-lg font-bold font-display text-sage-900 pb-2 border-b border-sage-100">
          Справочник ключевых анатомических структур
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(ANATOMICAL_ELEMENTS).map((elem) => (
            <div
              key={elem.id}
              className="p-4 rounded-2xl bg-warmbeige-50/50 border border-sage-200/70 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sage-900">{elem.name}</span>
                <span className="text-[10px] italic text-sage-500">{elem.latinName}</span>
              </div>
              <p className="text-xs text-sage-600 leading-relaxed">
                {elem.simpleExplanation}
              </p>
              <div className="pt-2 border-t border-sage-200/60 text-[11px] text-sage-500">
                <span className="font-semibold text-sage-700">Назначение:</span> {elem.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
