// src/components/onboarding/OnboardingModal.tsx
import React, { useState } from 'react';
import { 
  HeartPulse, 
  Sparkles, 
  User, 
  Baby, 
  Heart, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  X, 
  ShieldCheck,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { user, profileMode, setProfileMode } = useAuth();
  const { pregnancy, updatePregnancy, child, updateChild } = useData();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form states
  const [userName, setUserName] = useState(user?.name || 'Анна Сабитова');
  const [familyRole, setFamilyRole] = useState<'mother' | 'father' | 'guardian' | 'expectant'>('mother');
  const [chosenMode, setChosenMode] = useState<'planning' | 'pregnancy' | 'child'>('pregnancy');

  // Pregnancy details
  const [lmpDate, setLmpDate] = useState('2026-05-01');
  const [dueDate, setDueDate] = useState('2027-02-05');
  const [customWeek, setCustomWeek] = useState(28);
  const [calcMethod, setCalcMethod] = useState<'lmp' | 'ultrasound'>('ultrasound');

  // Child details
  const [childName, setChildName] = useState('Алиса');
  const [childBirthDate, setChildBirthDate] = useState('2026-03-12');
  const [childGender, setChildGender] = useState<'female' | 'male'>('female');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 5) {
      setStep((step + 1) as any);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as any);
    }
  };

  const handleComplete = () => {
    if (chosenMode === 'pregnancy' || chosenMode === 'planning') {
      setProfileMode('pregnancy');
      updatePregnancy({
        motherName: userName,
        dueDate: dueDate,
        currentWeek: customWeek,
        conceptionDate: lmpDate
      });
    } else {
      setProfileMode('child');
      updateChild({
        name: childName,
        birthDate: childBirthDate,
        gender: childGender
      });
    }
    localStorage.setItem('nesta_onboarding_completed', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-4xl shadow-soft-xl border border-sage-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Progress Header */}
        <div className="p-6 bg-warmbeige-50/80 border-b border-sage-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sage-800 text-white flex items-center justify-center shadow-xs">
              <HeartPulse className="w-5 h-5 text-sage-200" />
            </div>
            <div>
              <span className="text-lg font-bold font-display text-sage-900 tracking-tight">
                NESTA Онбординг
              </span>
              <p className="text-[11px] text-sage-500 font-medium">Шаг {step} из 5</p>
            </div>
          </div>

          {/* Step Pills */}
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  s === step ? 'bg-sage-800 w-6' : s < step ? 'bg-sage-400' : 'bg-sage-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <div className="text-center space-y-5 py-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-sage-100 text-sage-800 flex items-center justify-center text-4xl shadow-soft">
                🌿
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-100 px-3 py-1 rounded-full">
                  Забота начинается с понимания
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-sage-900">
                  Добро пожаловать в NESTA
                </h2>
                <p className="text-sm text-sage-600 max-w-md mx-auto leading-relaxed">
                  Давайте настроим цифровое пространство заботы для здоровья вашей семьи от первой недели до 3 лет малыша.
                </p>
              </div>

              <div className="p-4 rounded-3xl bg-warmbeige-50 border border-warmbeige-200 text-xs text-sage-700 text-left space-y-2 max-w-md mx-auto">
                <div className="flex items-center gap-2 font-bold text-sage-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Медицинская конфиденциальность:</span>
                </div>
                <p>Все персональные данные защищены, не передаются третьим лицам и принадлежат только вашей семье.</p>
              </div>
            </div>
          )}

          {/* STEP 2: USER INFO & ROLE */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold font-display text-sage-900">Расскажите о себе</h3>
                <p className="text-xs text-sage-500 mt-1">Как к вам обращаться в приложении?</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1.5">Ваше имя</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400" />
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                    placeholder="Например, Анна"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-2">Ваша роль в семье</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'mother', label: 'Мама', desc: 'Ведение беременности и материнство' },
                    { id: 'father', label: 'Папа', desc: 'Партнерская поддержка и уход' },
                    { id: 'expectant', label: 'Будущий родитель', desc: 'Планирование и ожидание' },
                    { id: 'guardian', label: 'Опекун / Родственник', desc: 'Совместная опека' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setFamilyRole(r.id as any)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        familyRole === r.id
                          ? 'bg-sage-800 text-white border-sage-800 shadow-soft'
                          : 'bg-warmbeige-50/50 border-sage-200 text-sage-800 hover:bg-sage-50'
                      }`}
                    >
                      <span className="block text-xs font-bold">{r.label}</span>
                      <span className={`text-[11px] block mt-0.5 ${familyRole === r.id ? 'text-sage-200' : 'text-sage-500'}`}>
                        {r.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PROFILE CHOICE */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold font-display text-sage-900">Выберите текущий этап</h3>
                <p className="text-xs text-sage-500 mt-1">Интерфейс NESTA мгновенно адаптируется под ваши задачи</p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: 'pregnancy',
                    icon: '🤰',
                    title: 'Беременность (от 1 до 40+ недель)',
                    desc: 'Интерактивный 3D-малыш, сравнение с фруктами, дневник мамы, шевеления и подготовка к родам'
                  },
                  {
                    id: 'child',
                    icon: '👶',
                    title: 'Ребёнок от рождения до 3 лет',
                    desc: 'Стандарты роста ВОЗ (перцентили), дневник кормлений и сна, календарь прививок РК'
                  },
                  {
                    id: 'planning',
                    icon: '🌸',
                    title: 'Планирование беременности',
                    desc: 'Подготовка организма, чекапы, доказательные рекомендации ВОЗ по нутриентам'
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setChosenMode(item.id as any)}
                    className={`w-full p-4 rounded-3xl border text-left flex items-start gap-4 transition-all ${
                      chosenMode === item.id
                        ? 'bg-sage-800 text-white border-sage-800 shadow-soft-lg'
                        : 'bg-white border-sage-200 text-sage-900 hover:bg-sage-50'
                    }`}
                  >
                    <span className="text-3xl shrink-0 p-1">{item.icon}</span>
                    <div>
                      <span className="block text-sm font-bold">{item.title}</span>
                      <span className={`text-xs block mt-1 leading-relaxed ${
                        chosenMode === item.id ? 'text-sage-200' : 'text-sage-600'
                      }`}>
                        {item.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: DETAILED INFORMATION */}
          {step === 4 && (
            <div className="space-y-5">
              {chosenMode === 'pregnancy' || chosenMode === 'planning' ? (
                <>
                  <div>
                    <h3 className="text-xl font-bold font-display text-sage-900">Параметры беременности</h3>
                    <p className="text-xs text-sage-500 mt-1">Вы сможете изменить их в любой момент в настройках</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCalcMethod('ultrasound')}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                        calcMethod === 'ultrasound' ? 'bg-sage-800 text-white border-sage-800' : 'bg-white text-sage-700 border-sage-200'
                      }`}
                    >
                      Срок по УЗИ / врачу
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcMethod('lmp')}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                        calcMethod === 'lmp' ? 'bg-sage-800 text-white border-sage-800' : 'bg-white text-sage-700 border-sage-200'
                      }`}
                    >
                      По дате последней менструации
                    </button>
                  </div>

                  {calcMethod === 'ultrasound' ? (
                    <div>
                      <label className="block text-xs font-semibold text-sage-700 mb-1">
                        Текущая неделя беременности
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="4"
                          max="40"
                          value={customWeek}
                          onChange={(e) => setCustomWeek(Number(e.target.value))}
                          className="flex-1 h-2 bg-sage-200 rounded-lg appearance-none cursor-pointer accent-sage-700"
                        />
                        <span className="w-16 text-center text-sm font-bold text-sage-900 bg-sage-100 py-1.5 rounded-xl border border-sage-200">
                          {customWeek} нед.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-sage-700 mb-1">
                        Первый день последней менструации (ПДПМ)
                      </label>
                      <input
                        type="date"
                        value={lmpDate}
                        onChange={(e) => setLmpDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-sage-700 mb-1">
                      Предполагаемая дата родов (ПДР)
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-xl font-bold font-display text-sage-900">Данные ребёнка</h3>
                    <p className="text-xs text-sage-500 mt-1">Для построения точных графиков развития по ВОЗ</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-sage-700 mb-1">Имя малыша</label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                      placeholder="Например, Алиса"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-sage-700 mb-1">Дата рождения</label>
                    <input
                      type="date"
                      value={childBirthDate}
                      onChange={(e) => setChildBirthDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-sage-700 mb-1.5">Пол ребёнка</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setChildGender('female')}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                          childGender === 'female' ? 'bg-sage-800 text-white border-sage-800' : 'bg-white border-sage-200 text-sage-700'
                        }`}
                      >
                        👧 Девочка
                      </button>
                      <button
                        type="button"
                        onClick={() => setChildGender('male')}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                          childGender === 'male' ? 'bg-sage-800 text-white border-sage-800' : 'bg-white border-sage-200 text-sage-700'
                        }`}
                      >
                        👦 Мальчик
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 5: FINISH */}
          {step === 5 && (
            <div className="text-center space-y-5 py-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl shadow-soft">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Все готово
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-sage-900">
                  Ваше пространство заботы готово!
                </h2>
                <p className="text-xs sm:text-sm text-sage-600 max-w-md mx-auto leading-relaxed">
                  Мы персонализировали медицинскую карту, календарь обследований и интерактивные 3D-модели для вашей семьи.
                </p>
              </div>

              <div className="p-4 rounded-3xl bg-warmbeige-50 border border-warmbeige-200 text-xs text-sage-700 text-left max-w-md mx-auto space-y-1.5">
                <div className="font-bold text-sage-900">Что теперь доступно:</div>
                <div>✓ Еженедельное отслеживание развития малыша</div>
                <div>✓ Официальные клинические протоколы ВОЗ и МЗ РК</div>
                <div>✓ AI-ассистент доказательной медицины</div>
                <div>✓ Семейный доступ для обоих родителей</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-warmbeige-50/60 border-t border-sage-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 rounded-2xl border border-sage-200 text-xs font-semibold text-sage-700 hover:bg-sage-100 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-sage-500 hover:text-sage-800 font-semibold"
            >
              Пропустить настройку
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-soft transition-all flex items-center gap-2"
          >
            <span>{step === 5 ? 'Перейти в личный кабинет' : 'Продолжить'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
