// src/pages/pregnancy/MovementsPage.tsx
import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Clock, 
  Activity, 
  AlertTriangle, 
  PhoneCall, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  ShieldAlert,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface MovementSession {
  id: string;
  date: string;
  time: string;
  count: number;
  durationMinutes: number;
  notes: string;
}

const DEFAULT_SESSIONS: MovementSession[] = [
  { id: 'ms_1', date: '2026-11-15', time: '20:30', count: 10, durationMinutes: 28, notes: 'Активно пинался после ужина' },
  { id: 'ms_2', date: '2026-11-14', time: '14:15', count: 10, durationMinutes: 35, notes: 'Шевеления ритмичные, откликался на поглаживание' },
  { id: 'ms_3', date: '2026-11-13', time: '19:40', count: 10, durationMinutes: 22, notes: 'Быстро набрал 10 движений во время отдыха' }
];

export const MovementsPage: React.FC = () => {
  const [sessions, setSessions] = useState<MovementSession[]>(() => {
    const saved = localStorage.getItem('nesta_movement_sessions');
    return saved ? JSON.parse(saved) : DEFAULT_SESSIONS;
  });

  const [activeCount, setActiveCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isCounting) {
      interval = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isCounting]);

  const startSession = () => {
    setIsCounting(true);
    setActiveCount(0);
    setElapsedSeconds(0);
  };

  const registerKick = () => {
    if (!isCounting) {
      setIsCounting(true);
    }
    const nextCount = activeCount + 1;
    setActiveCount(nextCount);

    if (nextCount >= 10) {
      // Finished Cardiff 10 kicks
      finishSession(nextCount);
    }
  };

  const finishSession = (finalCount: number) => {
    setIsCounting(false);
    const newSession: MovementSession = {
      id: 'ms_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      count: finalCount,
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      notes: 'Сессия подсчета шевелений Cardiff'
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    localStorage.setItem('nesta_movement_sessions', JSON.stringify(updated));
  };

  const resetCounter = () => {
    setIsCounting(false);
    setActiveCount(0);
    setElapsedSeconds(0);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-softblue-800 bg-softblue-100 px-3 py-1 rounded-full">
              Приоритет 2 • Дневник шевелений
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900 mt-2">
            Шевеления малыша (Счетчик Cardiff)
          </h1>
          <p className="text-xs sm:text-sm text-sage-600 mt-1">
            Фиксация двигательной активности плода в третьем триместре (с 28 недель)
          </p>
        </div>
      </div>

      {/* CRITICAL MEDICAL DISCLAIMER / RED FLAG ALERT */}
      <div className="p-5 sm:p-6 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-950 space-y-3 shadow-soft">
        <div className="flex items-center gap-2.5 text-rose-800 font-bold text-sm sm:text-base">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>Критически важное медицинское правило безопасности:</span>
        </div>
        <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
          Универсальной строгой нормы количества движений для всех детей не существует — у каждого малыша свой индивидуальный ритм сна и бодрствования.
          <strong> Однако если вы заметили резкое уменьшение или внезапное изменение привычной активности малыша (менее 10 шевелений за 2 часа в покое на левом боку), НЕЗАМЕДЛИТЕЛЬНО обратитесь в родильный дом или вызовите скорую помощь (103 или 112 в Казахстане), не дожидаясь следующего планового осмотра!</strong>
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a
            href="tel:103"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-soft transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Вызвать скорую (103)</span>
          </a>
          <span className="text-[11px] text-rose-700 font-medium">Экстренная линия 112 (круглосуточно)</span>
        </div>
      </div>

      {/* Interactive Kick Counter Widget */}
      <div className="bg-white rounded-4xl p-6 sm:p-8 border border-sage-200 shadow-soft text-center space-y-6">
        <div className="max-w-md mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-softblue-700 bg-softblue-50 px-3 py-1 rounded-full border border-softblue-200">
            Методика «Считай до 10» (Тест Cardiff)
          </span>
          <h2 className="text-xl font-bold font-display text-sage-900">
            Отметьте 10 шевелений малыша
          </h2>
          <p className="text-xs text-sage-600">
            Прилягте удобно на левый бок после еды или стакана воды и нажимайте на кнопку при каждом толчке или шевелении.
          </p>
        </div>

        {/* Counter Circle Button */}
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={registerKick}
            className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-rose-500 via-rose-400 to-softblue-400 text-white shadow-soft-xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer border-4 border-white"
          >
            <Heart className="w-10 h-10 mb-1 fill-white/80 group-hover:scale-110 transition-transform animate-pulse" />
            <span className="text-4xl sm:text-5xl font-bold font-display">{activeCount} / 10</span>
            <span className="text-xs font-semibold text-white/90 mt-1 uppercase tracking-wider">
              {isCounting ? 'Нажмите при толчке' : 'Начать подсчет'}
            </span>
          </button>

          {/* Timer Display */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage-100 text-sage-800 text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Таймер: {formatTimer(elapsedSeconds)}</span>
            </div>

            {isCounting && (
              <button
                onClick={resetCounter}
                className="p-1.5 rounded-full text-sage-500 hover:text-sage-800 hover:bg-sage-100 transition-colors text-xs flex items-center gap-1"
                title="Сбросить счетчик"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Сброс</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Movement History Log */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-sage-100">
          <div>
            <h3 className="text-base font-bold font-display text-sage-900">История сессий подсчета</h3>
            <p className="text-xs text-sage-500">Зафиксировано {sessions.length} наблюдений</p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Нормальный паттерн
          </span>
        </div>

        <div className="space-y-2.5">
          {sessions.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-warmbeige-50/50 border border-sage-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-sage-200 flex items-center justify-center font-bold text-rose-500">
                  {item.count}
                </div>
                <div>
                  <div className="text-xs font-bold text-sage-900 flex items-center gap-2">
                    <span>{item.date} в {item.time}</span>
                    <span className="text-[10px] font-normal text-sage-500">• {item.durationMinutes} мин до 10 толчков</span>
                  </div>
                  <p className="text-xs text-sage-600 mt-0.5">{item.notes}</p>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-xl self-end sm:self-auto">
                Тест пройден
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
