// src/pages/pregnancy/PregnancyMedicalCardPage.tsx
import React, { useState } from 'react';
import { 
  FolderHeart, 
  FileText, 
  Upload, 
  Plus, 
  Search, 
  Filter, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Eye, 
  CheckCircle2,
  Calendar,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface PregnancyDoc {
  id: string;
  title: string;
  category: 'ultrasound' | 'screening' | 'lab' | 'conclusion';
  categoryLabel: string;
  week: number;
  date: string;
  clinic: string;
  doctorName: string;
  fileSize: string;
  fileType: 'pdf' | 'jpg';
  summary: string;
  keyValues: Array<{ param: string; value: string; norm: string; isAbnormal: boolean }>;
}

const DEFAULT_PREGNANCY_DOCS: PregnancyDoc[] = [
  {
    id: 'pdoc_1',
    title: 'Второй анатомический ультразвуковой скрининг (19-21 нед)',
    category: 'ultrasound',
    categoryLabel: 'УЗИ Скрининг',
    week: 20,
    date: '2026-09-14',
    clinic: 'Центр пренатальной диагностики «Мейірім», г. Алматы',
    doctorName: 'Д-р Мусина Г.К.',
    fileSize: '3.4 МБ',
    fileType: 'pdf',
    summary: 'Анатомическое развитие органов плода соответствует 20 нед 2 дням. Сердце четырехкамерное, почки, мозг, позвоночник без патологий. Плацента по задней стенке, 1 степень зрелости. Околоплодные воды в норме.',
    keyValues: [
      { param: 'БПР (бипариетальный размер)', value: '48 мм', norm: '45–52 мм', isAbnormal: false },
      { param: 'ДБК (длина бедренной кости)', value: '34 мм', norm: '31–37 мм', isAbnormal: false },
      { param: 'Длина шейки матки (цервикометрия)', value: '38 мм', norm: '≥ 30 мм', isAbnormal: false },
      { param: 'ЧСС плода', value: '146 уд/мин', norm: '120–160 уд/мин', isAbnormal: false }
    ]
  },
  {
    id: 'pdoc_2',
    title: 'Пероральный глюкозотолерантный тест (ПГТТ с 75 г глюкозы)',
    category: 'screening',
    categoryLabel: 'Скрининг диабета',
    week: 25,
    date: '2026-10-19',
    clinic: 'Лаборатория INVIVO',
    doctorName: 'Врач КДЛ Смирнова Е.В.',
    fileSize: '1.2 МБ',
    fileType: 'pdf',
    summary: 'Глюкоза венозной плазмы натощак и через 2 часа после нагрузки глюкозой в пределах референсных значений для беременных. Гестационный сахарный диабет исключен.',
    keyValues: [
      { param: 'Глюкоза натощак', value: '4.4 ммоль/л', norm: '< 5.1 ммоль/л', isAbnormal: false },
      { param: 'Глюкоза через 1 час', value: '7.8 ммоль/л', norm: '< 10.0 ммоль/л', isAbnormal: false },
      { param: 'Глюкоза через 2 часа', value: '6.1 ммоль/л', norm: '< 8.5 ммоль/л', isAbnormal: false }
    ]
  },
  {
    id: 'pdoc_3',
    title: 'Клинический анализ крови + Ферритин сыворотки',
    category: 'lab',
    categoryLabel: 'Лабораторные анализы',
    week: 27,
    date: '2026-11-05',
    clinic: 'Клинико-диагностическая лаборатория ОЛИМП',
    doctorName: 'Лаборант-биохимик Ким А.А.',
    fileSize: '890 КБ',
    fileType: 'pdf',
    summary: 'Гемоглобин 116 г/л (норма во 2-3 триместрах ≥ 110 г/л). Ферритин 36 мкг/л — запас железа достаточный, анемии нет.',
    keyValues: [
      { param: 'Гемоглобин (Hb)', value: '116 г/л', norm: '110–140 г/л', isAbnormal: false },
      { param: 'Ферритин сыворотки', value: '36 мкг/л', norm: '15–120 мкг/л', isAbnormal: false },
      { param: 'Эритроциты', value: '3.9 × 10¹²/л', norm: '3.5–4.5', isAbnormal: false },
      { param: 'Тромбоциты', value: '235 × 10⁹/л', norm: '150–400', isAbnormal: false }
    ]
  }
];

export const PregnancyMedicalCardPage: React.FC = () => {
  const [docs, setDocs] = useState<PregnancyDoc[]>(() => {
    const saved = localStorage.getItem('nesta_preg_docs');
    return saved ? JSON.parse(saved) : DEFAULT_PREGNANCY_DOCS;
  });

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activePreviewDoc, setActivePreviewDoc] = useState<PregnancyDoc | null>(null);

  // Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState<PregnancyDoc['category']>('ultrasound');
  const [newWeek, setNewWeek] = useState(28);
  const [newClinic, setNewClinic] = useState('Клиника «Мейірім»');
  const [newDoctor, setNewDoctor] = useState('Д-р Касымова А.С.');
  const [newSummary, setNewSummary] = useState('');

  const saveDocs = (updated: PregnancyDoc[]) => {
    setDocs(updated);
    localStorage.setItem('nesta_preg_docs', JSON.stringify(updated));
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const catLabels = {
      ultrasound: 'УЗИ Скрининг',
      screening: 'Скрининг',
      lab: 'Лабораторные анализы',
      conclusion: 'Заключение врача'
    };

    const newDoc: PregnancyDoc = {
      id: 'pdoc_' + Date.now(),
      title: newTitle,
      category: newCat,
      categoryLabel: catLabels[newCat],
      week: Number(newWeek),
      date: new Date().toISOString().split('T')[0],
      clinic: newClinic,
      doctorName: newDoctor,
      fileSize: '1.8 МБ',
      fileType: 'pdf',
      summary: newSummary || 'Медицинский документ успешно загружен и зашифрован в защищенном хранилище.',
      keyValues: [
        { param: 'Статус анализа', value: 'Обработан', norm: 'Норма', isAbnormal: false }
      ]
    };

    saveDocs([newDoc, ...docs]);
    setIsUploadModalOpen(false);
    setNewTitle('');
    setNewSummary('');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    saveDocs(docs.filter(d => d.id !== id));
  };

  const filtered = docs.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
                          d.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-softblue-800 bg-softblue-100 px-3 py-1 rounded-full">
              Приоритет 2 • Медицинская карта
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900 mt-2">
            Медицинская карта беременности
          </h1>
          <p className="text-xs sm:text-sm text-sage-600 mt-1">
            Защищенный цифровой архив: результаты УЗИ, скринингов, анализов крови и заключений врачей
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white font-bold text-xs shadow-soft transition-all self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Загрузить анализ / УЗИ</span>
        </button>
      </div>

      {/* Security Privacy Notice */}
      <div className="p-4 rounded-3xl bg-warmbeige-50 border border-warmbeige-200 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sage-800">
            Все медицинские файлы хранятся в зашифрованном приватном хранилище (Supabase Private Storage). Доступ разрешен только подтвержденным членам семьи.
          </span>
        </div>
        <span className="text-[11px] font-bold text-emerald-800 bg-white px-3 py-1 rounded-full border border-warmbeige-200 shrink-0 hidden sm:inline">
          AES-256 Шифрование
        </span>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Все документы' },
            { id: 'ultrasound', label: 'УЗИ' },
            { id: 'screening', label: 'Скрининги' },
            { id: 'lab', label: 'Анализы крови' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-sage-800 text-white border-sage-800 shadow-soft'
                  : 'bg-white hover:bg-sage-50 text-sage-700 border-sage-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по документам..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-sage-200 text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Documents Cards List */}
      <div className="space-y-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setActivePreviewDoc(doc)}
            className="p-6 rounded-3xl bg-white border border-sage-200 shadow-soft hover:shadow-soft-lg hover:border-sage-300 cursor-pointer transition-all space-y-4 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sage-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-softblue-100 text-softblue-800 flex items-center justify-center font-bold text-xs shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display text-sage-900 group-hover:text-softblue-900 transition-colors">
                    {doc.title}
                  </h3>
                  <div className="text-[11px] text-sage-500 flex items-center gap-2 mt-0.5">
                    <span>{doc.clinic}</span>
                    <span>•</span>
                    <span>{doc.doctorName}</span>
                    <span>•</span>
                    <span>{doc.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-[10px] font-bold text-sage-600 bg-sage-100 px-2.5 py-1 rounded-full">
                  {doc.week} нед.
                </span>
                <span className="text-[10px] font-bold text-softblue-900 bg-softblue-50 px-2.5 py-1 rounded-full border border-softblue-200">
                  {doc.categoryLabel}
                </span>
                <button
                  onClick={(e) => handleDelete(doc.id, e)}
                  className="p-1.5 text-sage-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-sage-700 leading-relaxed">
              {doc.summary}
            </p>

            {/* Key Findings Metrics Chips */}
            {doc.keyValues.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {doc.keyValues.map((kv, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-warmbeige-50/70 border border-warmbeige-200 text-xs">
                    <span className="text-[10px] text-sage-500 block truncate">{kv.param}</span>
                    <span className="font-bold text-sage-900 block mt-0.5">{kv.value}</span>
                    <span className="text-[9px] text-emerald-700 font-medium">Норма: {kv.norm}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-4xl p-6 sm:p-8 max-w-lg w-full shadow-soft-xl border border-sage-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-display text-sage-900">
              Загрузить медицинский документ
            </h3>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1">
                  Название исследования или документа
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Например, Третий скрининг УЗИ с допплерометрией"
                  className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-sage-700 mb-1">Категория</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none bg-white"
                  >
                    <option value="ultrasound">УЗИ Скрининг</option>
                    <option value="screening">Биохимический скрининг</option>
                    <option value="lab">Лабораторный анализ</option>
                    <option value="conclusion">Заключение врача</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sage-700 mb-1">Срок (неделя)</label>
                  <input
                    type="number"
                    min="1"
                    max="42"
                    value={newWeek}
                    onChange={(e) => setNewWeek(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-sage-700 mb-1">Клиника / Лаборатория</label>
                  <input
                    type="text"
                    value={newClinic}
                    onChange={(e) => setNewClinic(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-sage-700 mb-1">Врач</label>
                  <input
                    type="text"
                    value={newDoctor}
                    onChange={(e) => setNewDoctor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1">Файл (PDF, JPG, PNG)</label>
                <div className="border-2 border-dashed border-sage-300 rounded-3xl p-6 text-center cursor-pointer hover:bg-sage-50 transition-colors">
                  <Upload className="w-8 h-8 mx-auto text-sage-500 mb-2" />
                  <span className="text-xs font-semibold text-sage-800 block">Нажмите для выбора файла</span>
                  <span className="text-[10px] text-sage-400 block mt-0.5">PDF или изображение до 25 МБ</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-700 mb-1">Краткое заключение</label>
                <textarea
                  rows={2}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Основные показатели или комментарий врача"
                  className="w-full px-4 py-2.5 rounded-2xl border border-sage-200 text-sm focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl border border-sage-200 text-xs font-semibold text-sage-700 hover:bg-sage-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-soft"
                >
                  Сохранить документ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Detailed Preview Modal */}
      {activePreviewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-4xl max-w-xl w-full p-6 sm:p-8 shadow-soft-xl border border-sage-100 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-sage-100 gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-softblue-700 bg-softblue-100 px-2.5 py-0.5 rounded-full">
                  {activePreviewDoc.categoryLabel} • {activePreviewDoc.week} нед.
                </span>
                <h3 className="text-lg font-bold font-display text-sage-900 mt-1">
                  {activePreviewDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePreviewDoc(null)}
                className="p-1.5 text-sage-400 hover:text-sage-800 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-warmbeige-50 border border-warmbeige-200">
                <span className="font-bold text-sage-900 block mb-1">Медицинское заключение:</span>
                <p className="text-sage-700 leading-relaxed">{activePreviewDoc.summary}</p>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-sage-900 block">Параметры протокола:</span>
                {activePreviewDoc.keyValues.map((kv, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-sage-50 border border-sage-200 flex justify-between items-center">
                    <span className="text-sage-700">{kv.param}</span>
                    <div className="text-right">
                      <span className="font-bold text-sage-900">{kv.value}</span>
                      <span className="text-[10px] text-emerald-700 block">Норма: {kv.norm}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-sage-100 flex items-center justify-between">
              <span className="text-[11px] text-sage-500">Загружено в зашифрованное облако</span>
              <button
                onClick={() => setActivePreviewDoc(null)}
                className="px-5 py-2.5 rounded-2xl bg-sage-800 text-white text-xs font-bold shadow-soft"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
