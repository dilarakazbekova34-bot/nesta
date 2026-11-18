// src/pages/pregnancy/BirthPrepPage.tsx
import React, { useState } from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  Plus, 
  FileText, 
  HelpCircle, 
  Heart, 
  Trash2, 
  Home, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface BagItem {
  id: string;
  category: 'docs' | 'mom' | 'baby' | 'discharge' | 'partner';
  categoryLabel: string;
  name: string;
  isChecked: boolean;
  isRequired: boolean;
}

const DEFAULT_BAG_ITEMS: BagItem[] = [
  // Documents
  { id: 'bi_1', category: 'docs', categoryLabel: 'Документы', name: 'Удостоверение личности / паспорт (оригинал)', isChecked: true, isRequired: true },
  { id: 'bi_2', category: 'docs', categoryLabel: 'Документы', name: 'Обменная карта беременной (Форма 113/у) со всеми анализами', isChecked: true, isRequired: true },
  { id: 'bi_3', category: 'docs', categoryLabel: 'Документы', name: 'Результаты УЗИ 1, 2 и 3 скринингов', isChecked: true, isRequired: true },
  { id: 'bi_4', category: 'docs', categoryLabel: 'Документы', name: 'Флюорография партнера (для партнерских родов)', isChecked: true, isRequired: true },

  // For Mom
  { id: 'bi_5', category: 'mom', categoryLabel: 'Для мамы', name: 'Моющиеся тапочки для родзала и душа', isChecked: true, isRequired: true },
  { id: 'bi_6', category: 'mom', categoryLabel: 'Для мамы', name: 'Халат и ночная сорочка с вырезом для кормления', isChecked: true, isRequired: false },
  { id: 'bi_7', category: 'mom', categoryLabel: 'Для мамы', name: 'Послеродовые прокладки (макси) и сетчатые одноразовые трусики', isChecked: false, isRequired: true },
  { id: 'bi_8', category: 'mom', categoryLabel: 'Для мамы', name: 'Крем с чистым ланолином для сосков (Пурелан)', isChecked: true, isRequired: false },
  { id: 'bi_9', category: 'mom', categoryLabel: 'Для мамы', name: 'Вода без газа со спортивным горлышком (2 бутылки по 0.5 л)', isChecked: false, isRequired: true },
  { id: 'bi_10', category: 'mom', categoryLabel: 'Для мамы', name: 'Бальзам для губ (в родах сохнут губы от дыхания)', isChecked: false, isRequired: false },

  // For Baby
  { id: 'bi_11', category: 'baby', categoryLabel: 'Для малыша', name: 'Подгузники для новорожденных (размер 1, 2-5 кг, 1 упаковка)', isChecked: true, isRequired: true },
  { id: 'bi_12', category: 'baby', categoryLabel: 'Для малыша', name: 'Слипы и боди из 100% хлопка швами наружу (3 комплекта, 56 размер)', isChecked: false, isRequired: true },
  { id: 'bi_13', category: 'baby', categoryLabel: 'Для малыша', name: 'Хлопковые шапочки без завязок (2 шт) и носочки', isChecked: false, isRequired: true },
  { id: 'bi_14', category: 'baby', categoryLabel: 'Для малыша', name: 'Влажные салфетки на 99% водной основе (WaterWipes)', isChecked: true, isRequired: false },
  { id: 'bi_15', category: 'baby', categoryLabel: 'Для малыша', name: 'Муслиновые пеленки (2-3 штуки)', isChecked: false, isRequired: false },

  // On Discharge
  { id: 'bi_16', category: 'discharge', categoryLabel: 'На выписку', name: 'Одежда и конверт/плед для малыша по сезону', isChecked: false, isRequired: true },
  { id: 'bi_17', category: 'discharge', categoryLabel: 'На выписку', name: 'Удобная свободная одежда и обувь для мамы', isChecked: false, isRequired: true },
  { id: 'bi_18', category: 'discharge', categoryLabel: 'На выписку', name: 'Автолюлька 0+ для безопасной поездки домой на автомобиле', isChecked: false, isRequired: true }
];

export const BirthPrepPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bag' | 'plan' | 'questions'>('bag');
  const [bagItems, setBagItems] = useState<BagItem[]>(() => {
    const saved = localStorage.getItem('nesta_hospital_bag');
    return saved ? JSON.parse(saved) : DEFAULT_BAG_ITEMS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<BagItem['category']>('mom');

  // Birth Plan builder items
  const [birthPlan, setBirthPlan] = useState({
    partnerPresence: true,
    freePosition: true,
    epiduralPreference: 'по показаниям',
    delayedCordClamping: true,
    skinToSkin: true,
    earlyBreastfeeding: true,
    episiotomyOnlyEmergency: true
  });

  const saveBag = (items: BagItem[]) => {
    setBagItems(items);
    localStorage.setItem('nesta_hospital_bag', JSON.stringify(items));
  };

  const toggleCheck = (id: string) => {
    const updated = bagItems.map(item => item.id === id ? { ...item, isChecked: !item.isChecked } : item);
    saveBag(updated);
  };

  const deleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = bagItems.filter(item => item.id !== id);
    saveBag(updated);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const catLabels = {
      docs: 'Документы',
      mom: 'Для мамы',
      baby: 'Для малыша',
      discharge: 'На выписку',
      partner: 'Для партнера'
    };

    const newItem: BagItem = {
      id: 'bi_' + Date.now(),
      category: newItemCategory,
      categoryLabel: catLabels[newItemCategory],
      name: newItemName.trim(),
      isChecked: false,
      isRequired: false
    };

    saveBag([...bagItems, newItem]);
    setNewItemName('');
  };

  const completedCount = bagItems.filter(i => i.isChecked).length;
  const filteredBag = bagItems.filter(i => {
    if (selectedCategory === 'all') return true;
    return i.category === selectedCategory;
  });

  const doctorQuestions = [
    {
      q: 'Какие правила партнерских родов действуют в вашем родильном доме?',
      why: 'Важно знать, какие справки нужны партнеру (флюорография, анализы) и какую одежду взять.'
    },
    {
      q: 'Практикуется ли свободное поведение и свободный выбор позы в первом и втором периодах родов?',
      why: 'Смена поз (вертикальные позы, фитбол, ходьба) облегчает схватки и ускоряет раскрытие шейки матки.'
    },
    {
      q: 'Проводится ли отсроченное пережатие пуповины (минимум 1–2 минуты)?',
      why: 'По стандартам ВОЗ отсроченное пережатие обогащает кровь новорожденного дополнительным железом и стволовыми клетками.'
    },
    {
      q: 'Обеспечивается ли контакт «кожа-к-коже» в течение первого часа при естественных родах и кесаревом сечении?',
      why: 'Непрерывный контакт нормализует температуру ребенка, заселяет его кожу маминой микрофлорой и запускает лактацию.'
    },
    {
      q: 'В каких случаях выполняется эпизиотомия (рассечение промежности)?',
      why: 'Рутинная эпизиотомия не рекомендуется ВОЗ — процедура должна проводиться строго по неотложным показаниям.'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-softblue-800 bg-softblue-100 px-3 py-1 rounded-full">
              Приоритет 3 • Подготовка к родам
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900 mt-2">
            Сумка в роддом и план родов
          </h1>
          <p className="text-xs sm:text-sm text-sage-600 mt-1">
            Интерактивный чек-лист вещей, конструктор плана родов и доказательные вопросы акушеру
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-sage-200 shadow-soft flex items-center gap-3 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-sage-500 block">Собрано вещей</span>
            <span className="text-base font-bold text-sage-900">{completedCount} из {bagItems.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
            {Math.round((completedCount / bagItems.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sage-200/80 gap-2">
        <button
          onClick={() => setActiveTab('bag')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'bag'
              ? 'border-sage-800 text-sage-900'
              : 'border-transparent text-sage-500 hover:text-sage-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Сумка в роддом ({completedCount}/{bagItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('plan')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'plan'
              ? 'border-sage-800 text-sage-900'
              : 'border-transparent text-sage-500 hover:text-sage-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Конструктор плана родов</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'questions'
              ? 'border-sage-800 text-sage-900'
              : 'border-transparent text-sage-500 hover:text-sage-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Вопросы врачу на 36 неделе</span>
        </button>
      </div>

      {/* TAB 1: HOSPITAL BAG */}
      {activeTab === 'bag' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'Все категории' },
              { id: 'docs', label: '1. Документы' },
              { id: 'mom', label: '2. Для мамы' },
              { id: 'baby', label: '3. Для малыша' },
              { id: 'discharge', label: '4. На выписку' }
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === c.id
                    ? 'bg-sage-800 text-white border-sage-800 shadow-soft'
                    : 'bg-white hover:bg-sage-50 text-sage-700 border-sage-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Quick Add Custom Item Form */}
          <form onSubmit={handleAddItem} className="p-4 rounded-3xl bg-warmbeige-50/80 border border-warmbeige-200 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Добавить свой предмет в сумку (например, гирлянда, термос)..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-sage-200 text-xs focus:outline-none"
            />
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value as any)}
              className="px-3 py-2.5 rounded-2xl bg-white border border-sage-200 text-xs text-sage-700 focus:outline-none"
            >
              <option value="mom">Для мамы</option>
              <option value="baby">Для малыша</option>
              <option value="docs">Документы</option>
              <option value="discharge">На выписку</option>
              <option value="partner">Для партнера</option>
            </select>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-soft flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить</span>
            </button>
          </form>

          {/* Items Checklist */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-soft space-y-2.5">
            {filteredBag.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                  item.isChecked
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    : 'bg-warmbeige-50/40 border-sage-200 text-sage-900 hover:bg-sage-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                    item.isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-sage-300 group-hover:border-sage-500 bg-white'
                  }`}>
                    {item.isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>

                  <div>
                    <span className={`text-xs font-semibold ${item.isChecked ? 'line-through text-sage-500' : ''}`}>
                      {item.name}
                    </span>
                    {item.isRequired && (
                      <span className="ml-2 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        Обязательно
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-sage-400 uppercase tracking-wider hidden sm:inline">
                    {item.categoryLabel}
                  </span>

                  <button
                    onClick={(e) => deleteItem(item.id, e)}
                    className="p-1 text-sage-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BIRTH PLAN */}
      {activeTab === 'plan' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-soft space-y-6">
          <div className="pb-3 border-b border-sage-100">
            <h3 className="text-lg font-bold font-display text-sage-900">
              Индивидуальный план родов (Birth Plan)
            </h3>
            <p className="text-xs text-sage-500 mt-1">
              Ваши пожелания для обсуждения с акушером-гинекологом при госпитализации
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                key: 'partnerPresence',
                title: 'Партнерские роды',
                desc: 'Присутствие мужа или доулы на протяжении всех периодов родов'
              },
              {
                key: 'freePosition',
                title: 'Свободное поведение в родах',
                desc: 'Возможность ходить, использовать фитбол, душ и выбирать удобную позу'
              },
              {
                key: 'delayedCordClamping',
                title: 'Отсроченное пережатие пуповины',
                desc: 'Пересечение пуповины после прекращения пульсации (через 1–2 минуты)'
              },
              {
                key: 'skinToSkin',
                title: 'Ранний контакт «кожа-к-коже»',
                desc: 'Выкладывание малыша на живот мамы минимум на 2 часа сразу после рождения'
              },
              {
                key: 'earlyBreastfeeding',
                title: 'Раннее прикладывание к груди',
                desc: 'Первое прикладывание в родзале в течение первого «золотого часа»'
              },
              {
                key: 'episiotomyOnlyEmergency',
                title: 'Эпизиотомия только по строгим показаниям',
                desc: 'Отказ от профилактического рассечения промежности без крайней необходимости'
              }
            ].map((pref) => {
              const checked = (birthPlan as any)[pref.key];
              return (
                <div
                  key={pref.key}
                  onClick={() => setBirthPlan({ ...birthPlan, [pref.key]: !checked })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                    checked
                      ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
                      : 'bg-warmbeige-50/30 border-sage-200 text-sage-800'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold block">{pref.title}</span>
                    <p className="text-xs text-sage-600">{pref.desc}</p>
                  </div>

                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                    checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-sage-300 bg-white'
                  }`}>
                    {checked && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-3xl bg-warmbeige-50 border border-warmbeige-200 text-xs text-sage-700 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              План родов носит рекомендательный характер для медицинской бригады. В случае непредвиденных медицинских показаний приоритетом всегда является безопасность мамы и ребенка.
            </span>
          </div>
        </div>
      )}

      {/* TAB 3: DOCTOR QUESTIONS */}
      {activeTab === 'questions' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-soft space-y-4">
          <div className="pb-3 border-b border-sage-100">
            <h3 className="text-lg font-bold font-display text-sage-900">
              Вопросы для консультации с акушером на 36-й неделе
            </h3>
            <p className="text-xs text-sage-500 mt-1">
              Официальные вопросы по доказательным клиническим стандартам ВОЗ и МЗ РК
            </p>
          </div>

          <div className="space-y-3">
            {doctorQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-warmbeige-50/50 border border-sage-200 space-y-1.5"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-softblue-100 text-softblue-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-sage-900 leading-snug">{q.q}</span>
                </div>
                <p className="text-xs text-sage-600 pl-7">{q.why}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
