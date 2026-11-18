// src/components/layout/MobileActionSheet.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Heart, 
  Utensils, 
  Moon, 
  Thermometer, 
  Baby, 
  FileUp, 
  PhoneCall, 
  Sparkles,
  BookOpen,
  Calendar,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickLog: (category: 'feeding' | 'sleep' | 'temperature' | 'diaper') => void;
  onOpenEmergency: () => void;
  onOpenUploadDoc: () => void;
}

export const MobileActionSheet: React.FC<MobileActionSheetProps> = ({
  isOpen,
  onClose,
  onOpenQuickLog,
  onOpenEmergency,
  onOpenUploadDoc
}) => {
  const navigate = useNavigate();
  const { profileMode } = useAuth();

  if (!isOpen) return null;

  const handleNav = (to: string) => {
    onClose();
    navigate(to);
  };

  const handleLog = (category: 'feeding' | 'sleep' | 'temperature' | 'diaper') => {
    onClose();
    onOpenQuickLog(category);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-sage-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet Box */}
      <div className="relative w-full bg-white rounded-t-4xl shadow-soft-xl border-t border-sage-200 p-6 space-y-5 animate-in slide-in-from-bottom duration-200 max-h-[85vh] overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-sage-300 rounded-full mx-auto" />

        <div className="flex items-center justify-between pb-2 border-b border-sage-100">
          <div>
            <h3 className="text-lg font-bold font-display text-sage-900">Быстрые действия</h3>
            <p className="text-xs text-sage-500">Запись показателей и сервисы заботы NESTA</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-sage-400 hover:text-sage-800 hover:bg-sage-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Alert Button Banner */}
        <button
          onClick={() => {
            onClose();
            onOpenEmergency();
          }}
          className="w-full p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 flex items-center justify-between text-left transition-colors shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold block text-rose-950">Экстренная помощь (103 / 112)</span>
              <span className="text-[11px] text-rose-700">Триаж симптомов и неотложные протоколы</span>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-800 px-2.5 py-1 rounded-lg bg-white border border-rose-200">
            Вызов
          </span>
        </button>

        {/* Pregnancy Quick Actions (if pregnancy mode) */}
        {profileMode === 'pregnancy' && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-softblue-800">
              Беременность
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleNav('/pregnancy/movements')}
                className="p-3.5 rounded-2xl bg-softblue-50 border border-softblue-200 text-left hover:bg-softblue-100 transition-colors flex items-center gap-3"
              >
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-sage-900 block">Шевеления</span>
                  <span className="text-[10px] text-sage-500">Счетчик Cardiff</span>
                </div>
              </button>

              <button
                onClick={() => handleNav('/pregnancy/diary')}
                className="p-3.5 rounded-2xl bg-warmbeige-50 border border-warmbeige-200 text-left hover:bg-warmbeige-100 transition-colors flex items-center gap-3"
              >
                <Baby className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-sage-900 block">Дневник мамы</span>
                  <span className="text-[10px] text-sage-500">Вес, сон, фото</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Child Diary Shortcuts */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sage-500">
            Дневник здоровья
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleLog('feeding')}
              className="p-3.5 rounded-2xl bg-warmbeige-50/60 border border-sage-200 text-left hover:bg-sage-50 transition-colors flex items-center gap-3"
            >
              <Utensils className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-sage-900 block">Кормление</span>
                <span className="text-[10px] text-sage-500">ГВ / прикорм</span>
              </div>
            </button>

            <button
              onClick={() => handleLog('sleep')}
              className="p-3.5 rounded-2xl bg-warmbeige-50/60 border border-sage-200 text-left hover:bg-sage-50 transition-colors flex items-center gap-3"
            >
              <Moon className="w-5 h-5 text-softblue-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-sage-900 block">Сон</span>
                <span className="text-[10px] text-sage-500">Дневной / ночной</span>
              </div>
            </button>

            <button
              onClick={() => handleLog('temperature')}
              className="p-3.5 rounded-2xl bg-warmbeige-50/60 border border-sage-200 text-left hover:bg-sage-50 transition-colors flex items-center gap-3"
            >
              <Thermometer className="w-5 h-5 text-rose-500 shrink-0" />
              <div>
                <span className="text-xs font-bold text-sage-900 block">Температура</span>
                <span className="text-[10px] text-sage-500">Замер градусником</span>
              </div>
            </button>

            <button
              onClick={() => handleLog('diaper')}
              className="p-3.5 rounded-2xl bg-warmbeige-50/60 border border-sage-200 text-left hover:bg-sage-50 transition-colors flex items-center gap-3"
            >
              <Baby className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-sage-900 block">Подгузник</span>
                <span className="text-[10px] text-sage-500">Стул / смена</span>
              </div>
            </button>
          </div>
        </div>

        {/* Upload & Calendar Action */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => {
              onClose();
              onOpenUploadDoc();
            }}
            className="p-3 rounded-2xl bg-sage-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-soft hover:bg-sage-900 transition-colors"
          >
            <FileUp className="w-4 h-4" />
            <span>+ Загрузить УЗИ / анализ</span>
          </button>

          <button
            onClick={() => handleNav('/calendar')}
            className="p-3 rounded-2xl bg-white border border-sage-200 text-sage-800 text-xs font-bold flex items-center justify-center gap-2 hover:bg-sage-50 transition-colors"
          >
            <Calendar className="w-4 h-4 text-sage-600" />
            <span>Семейный календарь</span>
          </button>
        </div>
      </div>
    </div>
  );
};
