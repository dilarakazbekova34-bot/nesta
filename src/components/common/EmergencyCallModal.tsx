// src/components/common/EmergencyCallModal.tsx
import React from 'react';
import { PhoneCall, AlertTriangle, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface EmergencyCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyCallModal: React.FC<EmergencyCallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-soft-xl border border-red-100 overflow-hidden">
        {/* Header with emergency alert color */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display">Экстренная помощь</h3>
                <p className="text-xs text-red-100 font-medium">Казахстан: телефоны 103 и 112</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Call Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <a
              href="tel:103"
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-red-50 border-2 border-red-500 hover:bg-red-100 transition-all text-red-800 font-bold group shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md mb-2 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-red-700">103</span>
              <span className="text-xs text-red-600 font-medium mt-0.5">Скорая помощь РК</span>
            </a>

            <a
              href="tel:112"
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-amber-50 border-2 border-amber-500 hover:bg-amber-100 transition-all text-amber-900 font-bold group shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-md mb-2 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-amber-800">112</span>
              <span className="text-xs text-amber-700 font-medium mt-0.5">Единая служба спасения</span>
            </a>
          </div>

          {/* Critical Red Flags */}
          <div className="bg-red-50/70 border border-red-200/70 rounded-2xl p-4">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-900">Когда звонить немедленно:</h4>
                <ul className="text-xs text-red-800 mt-2 space-y-1.5 list-disc list-inside">
                  <li>Затрудненное дыхание, одышка, синюшность губ или носогубного треугольника</li>
                  <li>Ребенок без сознания, не реагирует на слова, судороги</li>
                  <li>Температура выше 38.0°C у младенца младше 3 месяцев</li>
                  <li>Геморрагическая темная сыпь (не бледнеет при нажатии прозрачным стаканом)</li>
                  <li>Неукротимая рвота с признаками тяжелого обезвоживания (запавший родничок, нет слез)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What to tell the dispatcher */}
          <div>
            <h4 className="text-xs font-bold text-sage-900 uppercase tracking-wider mb-2.5">
              Что четко сообщить диспетчеру:
            </h4>
            <div className="space-y-2 text-xs text-sage-700 bg-sage-50/70 p-3.5 rounded-2xl border border-sage-200/50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span><strong>Точный адрес:</strong> улица, дом, подъезд, этаж, домофон</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span><strong>Возраст:</strong> точное количество месяцев или лет ребенка</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span><strong>Главный симптом:</strong> температура, судороги, характер дыхания</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span><strong>Состояние:</strong> в сознании ли ребенок, пьет ли жидкость</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-sage-100 hover:bg-sage-200 text-sage-800 font-semibold text-sm transition-colors"
            >
              Понятно, закрыть памятку
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
