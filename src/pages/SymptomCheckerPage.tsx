// src/pages/SymptomCheckerPage.tsx
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  ShieldAlert, 
  RotateCcw, 
  HelpCircle, 
  ChevronRight, 
  AlertCircle,
  FileText,
  Activity
} from 'lucide-react';
import { evaluateSymptomTriage, TriageRuleResult } from '../services/aiMedicalEngine';
import { EmergencyCallModal } from '../components/common/EmergencyCallModal';

export const SymptomCheckerPage: React.FC = () => {
  const { child, saveAssessment, symptomAssessments } = useData();

  // Multi-step triage wizard state
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedAgeMonths, setSelectedAgeMonths] = useState(8);
  const [temperature, setTemperature] = useState<number>(37.2);
  const [durationDays, setDurationDays] = useState<number>(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedRedFlags, setSelectedRedFlags] = useState<string[]>([]);

  // Result state
  const [triageResult, setTriageResult] = useState<TriageRuleResult | null>(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Common symptoms list
  const commonSymptoms = [
    'Повышение температуры',
    'Обильное слюнотечение / режутся зубки',
    'Заложенность носа / насморк',
    'Кашель сухой или влажный',
    'Разжиженный стул',
    'Однократный срыгивание / рвота',
    'Беспокойство, капризность перед сном',
    'Снижение аппетита',
    'Покраснение десен',
    'Легкая сыпь в области подгузника'
  ];

  // Critical Red Flags list (Immediate Red Level fast-path)
  const redFlagsList = [
    'Возраст до 3 месяцев с температурой выше 38.0°C',
    'Затрудненное или хриплое дыхание (втяжение межреберий)',
    'Сонливость, невозможно разбудить, ребенок не реагирует на контакт',
    'Судороги или приступы потери сознания',
    'Темная сыпь в виде звездочек (не исчезает при надавливании)',
    'Повторная неукротимая рвота (не удерживает даже воду)',
    'Выраженные признаки обезвоживания (запавший родничок, сухой язык, нет мочи >6ч)'
  ];

  const handleToggleSymptom = (symp: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symp) ? prev.filter(s => s !== symp) : [...prev, symp]
    );
  };

  const handleToggleRedFlag = (flag: string) => {
    // If a parent ticks ANY red flag, we immediately trigger the RED emergency protocol without delaying!
    const updated = selectedRedFlags.includes(flag)
      ? selectedRedFlags.filter(f => f !== flag)
      : [...selectedRedFlags, flag];
    
    setSelectedRedFlags(updated);

    if (!selectedRedFlags.includes(flag)) {
      // Immediate red triage evaluation!
      const result = evaluateSymptomTriage({
        ageMonths: selectedAgeMonths,
        temperature,
        symptoms: selectedSymptoms,
        durationDays,
        hasRedFlags: true,
        redFlagsList: [flag]
      });
      setTriageResult(result);
      setStep(4); // Jump directly to results screen!
    }
  };

  const handleCalculateTriage = () => {
    const result = evaluateSymptomTriage({
      ageMonths: selectedAgeMonths,
      temperature,
      symptoms: selectedSymptoms,
      durationDays,
      hasRedFlags: selectedRedFlags.length > 0,
      redFlagsList: selectedRedFlags
    });
    setTriageResult(result);
    setStep(4);
  };

  const handleSaveToHistory = () => {
    if (!triageResult) return;
    saveAssessment({
      childAge: `${selectedAgeMonths} месяцев`,
      symptoms: selectedSymptoms,
      temperature,
      duration: `${durationDays} дн.`,
      triageLevel: triageResult.level,
      summary: triageResult.summary,
      observationAdvice: triageResult.homeCareAdvice,
      whenToConsult: triageResult.whenToConsult,
      redFlagsNoticed: selectedRedFlags,
      emergencyInstructions: triageResult.homeCareAdvice
    });
    setSavedSuccess(true);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedSymptoms([]);
    setSelectedRedFlags([]);
    setTemperature(37.0);
    setDurationDays(1);
    setTriageResult(null);
    setSavedSuccess(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-100 px-3 py-1 rounded-full">
              Ценность «СПОКОЙСТВИЕ»
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900 mt-2">
            Проверка симптомов: педиатрический триаж
          </h1>
          <p className="text-xs sm:text-sm text-sage-600 mt-1">
            Клинический алгоритм: Зеленый (наблюдение), Желтый (плановый визит), Красный (экстренная помощь 103)
          </p>
        </div>

        <button
          onClick={() => setEmergencyModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs shadow-sm self-start sm:self-auto"
        >
          <PhoneCall className="w-4 h-4 text-rose-600" />
          <span>Экстренная памятка 103 / 112</span>
        </button>
      </div>

      {/* STEP INDICATOR (If not finished) */}
      {step < 4 && (
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-sage-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-xl bg-sage-800 text-white font-bold text-xs flex items-center justify-center">
              {step}
            </span>
            <span className="text-xs font-bold text-sage-900">
              {step === 1 && 'Шаг 1 из 3: Возраст ребенка и замер температуры'}
              {step === 2 && 'Шаг 2 из 3: Наблюдаемые симптомы'}
              {step === 3 && 'Шаг 3 из 3: Проверка опасных симптомов (Красные флаги)'}
            </span>
          </div>
          <span className="text-xs text-sage-500 font-medium">Пациент: {child.name}</span>
        </div>
      )}

      {/* STEP 1: AGE & TEMPERATURE */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-soft space-y-6">
          <h3 className="text-lg font-bold font-display text-sage-900">
            1. Укажите возраст малыша и температуру
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Age in months */}
            <div>
              <label className="block text-xs font-semibold text-sage-700 uppercase tracking-wider mb-2">
                Возраст ребенка: {selectedAgeMonths} месяцев
              </label>
              <input
                type="range"
                min="0"
                max="36"
                value={selectedAgeMonths}
                onChange={(e) => setSelectedAgeMonths(parseInt(e.target.value))}
                className="w-full accent-sage-800 cursor-pointer h-2 bg-sage-100 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-sage-500 mt-1">
                <span>0 мес (новорожденный)</span>
                <span className="font-bold text-sage-900">8 мес (Алиса)</span>
                <span>36 мес (3 года)</span>
              </div>
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-xs font-semibold text-sage-700 uppercase tracking-wider mb-2">
                Текущая температура: {temperature.toFixed(1)} °C
              </label>
              <input
                type="range"
                min="36.0"
                max="40.5"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-rose-700 cursor-pointer h-2 bg-rose-100 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-sage-500 mt-1">
                <span>36.0°C</span>
                <span className={`font-bold ${temperature > 38.0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {temperature > 38.0 ? 'Жар' : 'Норма/Субфебрильная'}
                </span>
                <span>40.5°C</span>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-sage-700 uppercase tracking-wider mb-2">
              Сколько дней длятся симптомы?
            </label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 7].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setDurationDays(days)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    durationDays === days
                      ? 'bg-sage-800 text-white shadow-xs'
                      : 'bg-warmbeige-50 border border-sage-200 text-sage-700 hover:bg-sage-100'
                  }`}
                >
                  {days === 1 ? 'Меньше 24 часов' : `${days} дн.`}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-sage-100 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white font-semibold text-sm transition-all shadow-sm"
            >
              <span>Продолжить к выбору симптомов</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SYMPTOMS SELECTION */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-soft space-y-6">
          <div>
            <h3 className="text-lg font-bold font-display text-sage-900">
              2. Выберите наблюдаемые симптомы
            </h3>
            <p className="text-xs text-sage-500 mt-0.5">
              Отметьте всё, на что вы обратили внимание за последние часы:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {commonSymptoms.map((symp) => {
              const isSelected = selectedSymptoms.includes(symp);
              return (
                <button
                  key={symp}
                  type="button"
                  onClick={() => handleToggleSymptom(symp)}
                  className={`p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-sage-100 border-sage-700 text-sage-950 shadow-xs'
                      : 'bg-warmbeige-50/50 border-sage-200 text-sage-700 hover:bg-sage-50'
                  }`}
                >
                  <span>{symp}</span>
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ml-2 ${
                    isSelected ? 'bg-sage-800 border-sage-800 text-white' : 'border-sage-300'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-sage-100 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-semibold text-sage-600 hover:text-sage-900"
            >
              ← Назад
            </button>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white font-semibold text-sm transition-all shadow-sm"
            >
              <span>Проверить красные флаги</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: RED FLAGS SCREEN */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-200 shadow-soft space-y-6">
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-950">
                Внимание: проверка признаков жизнеугрожающих состояний
              </h4>
              <p className="text-xs text-red-800 mt-1 leading-relaxed">
                Если у малыша есть хотя бы один симптом из списка ниже — система мгновенно активирует вызов экстренной помощи. Не медлите!
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {redFlagsList.map((flag) => {
              const isSelected = selectedRedFlags.includes(flag);
              return (
                <button
                  key={flag}
                  type="button"
                  onClick={() => handleToggleRedFlag(flag)}
                  className={`w-full p-4 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-red-100 border-red-600 text-red-950 shadow-sm'
                      : 'bg-warmbeige-50/60 border-sage-200 text-sage-800 hover:bg-red-50/50 hover:border-red-300'
                  }`}
                >
                  <span>{flag}</span>
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ml-3 ${
                    isSelected ? 'bg-red-600 border-red-600 text-white' : 'border-sage-300'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-sage-100 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 text-xs font-semibold text-sage-600 hover:text-sage-900"
            >
              ← Назад к симптомам
            </button>
            <button
              onClick={handleCalculateTriage}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white font-semibold text-sm transition-all shadow-sm"
            >
              <span>Ничего из перечисленного — Получить результат</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: TRIAGE RESULT REPORT */}
      {step === 4 && triageResult && (
        <div className="space-y-6 animate-in zoom-in-95 duration-200">
          {/* Main Traffic Light Result Banner */}
          <div className={`rounded-3xl p-6 sm:p-8 border shadow-soft-lg ${
            triageResult.level === 'red'
              ? 'bg-red-600 text-white border-red-700'
              : triageResult.level === 'yellow'
              ? 'bg-amber-500 text-white border-amber-600'
              : 'bg-emerald-600 text-white border-emerald-700'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  {triageResult.level === 'red' && <ShieldAlert className="w-8 h-8 text-white animate-bounce" />}
                  {triageResult.level === 'yellow' && <Clock className="w-8 h-8 text-white" />}
                  {triageResult.level === 'green' && <CheckCircle2 className="w-8 h-8 text-white" />}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-white/80">
                    Уровень триажа NESTA
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display mt-0.5">
                    {triageResult.title}
                  </h2>
                </div>
              </div>

              {triageResult.level === 'red' && (
                <div className="flex items-center gap-3">
                  <a
                    href="tel:103"
                    className="px-5 py-3 rounded-2xl bg-white text-red-700 hover:bg-red-50 font-black text-sm shadow-md flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <PhoneCall className="w-5 h-5 text-red-600" />
                    <span>ВЫЗВАТЬ 103</span>
                  </a>
                  <a
                    href="tel:112"
                    className="px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm backdrop-blur-md"
                  >
                    112
                  </a>
                </div>
              )}
            </div>

            <p className="mt-4 text-sm text-white/95 leading-relaxed max-w-3xl">
              {triageResult.summary}
            </p>
          </div>

          {/* Detailed Recommendations & Home Care */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-soft space-y-6">
            <h3 className="text-lg font-bold font-display text-sage-900 pb-3 border-b border-sage-100">
              Пошаговые рекомендации и план действий
            </h3>

            {/* When to consult */}
            <div className="p-4 rounded-2xl bg-warmbeige-50 border border-warmbeige-200">
              <span className="text-xs font-bold text-sage-600 uppercase tracking-wider block mb-1">
                Сроки обращения к врачу:
              </span>
              <p className="text-sm font-semibold text-sage-900">
                {triageResult.whenToConsult}
              </p>
            </div>

            {/* Home care advice list */}
            <div>
              <h4 className="text-xs font-bold text-sage-700 uppercase tracking-wider mb-3">
                Что делать родителям прямо сейчас:
              </h4>
              <div className="space-y-2.5">
                {triageResult.homeCareAdvice.map((advice, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-sage-50/70 border border-sage-200/60 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-sage-800 leading-relaxed font-medium">{advice}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-sage-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-sage-300 text-sage-700 hover:bg-sage-50 font-semibold text-xs transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Начать новую проверку</span>
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleSaveToHistory}
                  disabled={savedSuccess}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-sage-800 hover:bg-sage-900 disabled:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>{savedSuccess ? '✓ Сохранено в медкарту' : 'Сохранить проверку в историю'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical Previous Assessments Accordion */}
      {symptomAssessments.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-sage-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sage-100">
            <h3 className="text-base font-bold font-display text-sage-900">
              История проверок симптомов ({symptomAssessments.length})
            </h3>
            <span className="text-xs text-sage-500">Автосохранение триажа</span>
          </div>

          <div className="space-y-3">
            {symptomAssessments.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-warmbeige-50/60 border border-warmbeige-200/80 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      item.triageLevel === 'red' ? 'bg-red-100 text-red-800' :
                      item.triageLevel === 'yellow' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.triageLevel.toUpperCase()}
                    </span>
                    <span className="text-xs text-sage-400">{item.date}</span>
                  </div>
                  <p className="text-xs font-bold text-sage-900">{item.summary}</p>
                  <div className="text-[11px] text-sage-600 mt-1">
                    Симптомы: {item.symptoms.join(', ')} • Температура: {item.temperature}°C
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <EmergencyCallModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />
    </div>
  );
};
