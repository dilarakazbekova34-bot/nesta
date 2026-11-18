// src/pages/pregnancy/OrgansPage.tsx
import React, { useState } from 'react';
import { ORGANS_DATA, OrganInfo } from '../../data/organDevelopmentData';
import { ShieldCheck, Info, Sparkles, Activity, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OrgansPage: React.FC = () => {
  const [selectedOrganId, setSelectedOrganId] = useState<string>('brain');

  const selectedOrgan = ORGANS_DATA[selectedOrganId] || ORGANS_DATA.brain;

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-softblue-800 bg-softblue-100 px-3 py-1 rounded-full">
              Приоритет 2 • Развитие органов
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900 mt-2">
            Формирование органов и систем малыша
          </h1>
          <p className="text-xs sm:text-sm text-sage-600 mt-1">
            Клинически выверенный таймлайн эмбриогенеза и органогенеза по стандартам доказательной медицины
          </p>
        </div>

        <Link
          to="/pregnancy/3d-baby"
          className="px-4 py-2 rounded-2xl bg-white hover:bg-sage-50 border border-sage-200 text-xs font-bold text-sage-800 transition-colors shadow-xs"
        >
          ← Вернуться к 3D-модели
        </Link>
      </div>

      {/* Organ Selector Pills / Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.values(ORGANS_DATA).map((organ) => (
          <button
            key={organ.id}
            onClick={() => setSelectedOrganId(organ.id)}
            className={`p-4 rounded-3xl border text-center transition-all ${
              selectedOrganId === organ.id
                ? 'bg-sage-800 text-white border-sage-800 shadow-soft-lg scale-[1.02]'
                : 'bg-white hover:bg-sage-50 border-sage-200 text-sage-800'
            }`}
          >
            <div className="text-3xl mb-1.5">{organ.icon}</div>
            <div className="text-xs font-bold truncate">{organ.name.split(' и ')[0]}</div>
            <div className={`text-[10px] mt-0.5 truncate ${selectedOrganId === organ.id ? 'text-sage-200' : 'text-sage-500'}`}>
              {organ.category}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Organ Detail Card */}
      <div className="bg-white rounded-4xl p-6 sm:p-8 border border-sage-200 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-100 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-2 rounded-2xl bg-sage-100">{selectedOrgan.icon}</span>
            <div>
              <span className="text-xs font-semibold text-sage-500 uppercase">{selectedOrgan.category}</span>
              <h2 className="text-2xl font-bold font-display text-sage-900">{selectedOrgan.name}</h2>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto">
            Клинический статус: Норма
          </span>
        </div>

        <p className="text-sm text-sage-700 leading-relaxed max-w-3xl">
          {selectedOrgan.overview}
        </p>

        {/* Current milestone highlight */}
        <div className="p-4 rounded-3xl bg-softblue-50/70 border border-softblue-200 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-softblue-900">
            <Sparkles className="w-4 h-4 text-softblue-600" />
            <span>Текущий этап формирования:</span>
          </div>
          <p className="text-xs text-softblue-950 leading-relaxed">
            {selectedOrgan.currentMilestone}
          </p>
        </div>

        {/* Timeline of Development */}
        <div className="space-y-4">
          <h3 className="text-base font-bold font-display text-sage-900">
            Хронология развития по срокам гестации:
          </h3>

          <div className="space-y-3">
            {selectedOrgan.timeline.map((event, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-warmbeige-50/60 border border-warmbeige-200/80 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-1 sm:max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sage-900">{event.stageTitle}</span>
                    <span className="text-[10px] font-bold text-sage-600 bg-sage-100 px-2 py-0.5 rounded-full">
                      {event.weeks}
                    </span>
                  </div>
                  <p className="text-xs text-sage-700 leading-relaxed">{event.description}</p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-warmbeige-200 text-[11px] text-sage-600 sm:w-64 shrink-0">
                  <span className="font-semibold text-sage-800 block mb-0.5">Научный факт:</span>
                  {event.scientificFact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor's Advice */}
        <div className="p-4 rounded-3xl bg-sage-50 border border-sage-200 flex items-start gap-3">
          <Activity className="w-5 h-5 text-sage-700 shrink-0 mt-0.5" />
          <div className="text-xs text-sage-800">
            <span className="font-bold block mb-0.5">Рекомендация врача:</span>
            {selectedOrgan.doctorTip}
          </div>
        </div>
      </div>
    </div>
  );
};
