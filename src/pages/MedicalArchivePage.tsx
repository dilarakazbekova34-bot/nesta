// src/pages/MedicalArchivePage.tsx
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { DocumentCategory, MedicalDocument } from '../types';
import { 
  FolderHeart, 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  Sparkles,
  X,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { UploadDocumentModal } from '../components/common/UploadDocumentModal';

export const MedicalArchivePage: React.FC = () => {
  const { documents, deleteDocument, vaccinations, toggleVaccinationStatus, child } = useData();

  const [activeCategory, setActiveCategory] = useState<DocumentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Filtered documents
  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
    const matchesQuery = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.clinic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.ocrExtractedText && doc.ocrExtractedText.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesQuery;
  });

  const categories: { id: DocumentCategory | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'Все документы', count: documents.length },
    { id: 'lab_tests', label: 'Анализы', count: documents.filter(d => d.category === 'lab_tests').length },
    { id: 'ultrasound', label: 'УЗИ', count: documents.filter(d => d.category === 'ultrasound').length },
    { id: 'doctor_notes', label: 'Заключения врачей', count: documents.filter(d => d.category === 'doctor_notes').length },
    { id: 'vaccination', label: 'Вакцинация', count: vaccinations.length },
    { id: 'prescriptions', label: 'Назначения', count: documents.filter(d => d.category === 'prescriptions').length },
    { id: 'history', label: 'История обращений', count: documents.filter(d => d.category === 'history').length },
  ];

  const handleExportPdf = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-100 px-3 py-1 rounded-full">
              Цифровой архив
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900 mt-2">
            Семейная медицинская карта
          </h1>
          <p className="text-xs sm:text-sm text-sage-600 mt-1">
            Защищенный архив анализов, протоколов УЗИ, вакцинаций и заключений специалистов
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-sage-50 text-sage-800 border border-sage-300 font-semibold text-xs shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-sage-600" />
            <span>Экспорт карты (PDF)</span>
          </button>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Загрузить документ</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-sage-800 text-white shadow-xs'
                  : 'bg-white border border-sage-200 text-sage-700 hover:bg-sage-50'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeCategory === cat.id ? 'bg-sage-700 text-white' : 'bg-sage-100 text-sage-700'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по анализу, врачу, клинике..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/30 text-xs text-sage-900"
          />
        </div>
      </div>

      {/* SPECIAL VACCINATION CALENDAR VIEW IF SELECTED */}
      {activeCategory === 'vaccination' ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sage-100">
            <div>
              <h3 className="text-lg font-bold font-display text-sage-900">
                Календарь иммунопрофилактики (Форма 063/у)
              </h3>
              <p className="text-xs text-sage-500 mt-0.5">
                Национальный календарь Республики Казахстан + рекомендации ВОЗ
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              График соблюдается
            </span>
          </div>

          <div className="space-y-3">
            {vaccinations.map((vac) => {
              const isDone = vac.status === 'done';
              return (
                <div
                  key={vac.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-warmbeige-50/60 border-sage-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleVaccinationStatus(vac.id)}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-sage-300 text-transparent hover:border-emerald-600'
                      }`}
                      title={isDone ? 'Сделано (нажмите для отмены)' : 'Отметить как выполненную'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-sage-900">{vac.vaccineName}</span>
                        <span className="text-[10px] font-semibold text-sage-500 px-2 py-0.5 rounded-full bg-sage-100">
                          {vac.recommendedAge}
                        </span>
                      </div>
                      <p className="text-xs text-sage-600 mt-0.5">{vac.diseaseTarget}</p>
                      {vac.clinic && (
                        <div className="text-[11px] text-sage-400 mt-1">{vac.clinic} • {vac.appliedDate}</div>
                      )}
                    </div>
                  </div>

                  <div className="self-end sm:self-center">
                    <span className={`text-xs font-bold px-3 py-1 rounded-xl ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {isDone ? 'Выполнено' : 'Запланировано'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* DOCUMENTS LIST GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl p-6 border border-sage-200/80 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Top Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-sage-100 text-sage-800 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-sage-700" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600 bg-sage-50 px-2.5 py-1 rounded-full border border-sage-200/60">
                    {doc.category === 'lab_tests' ? 'Анализ' : doc.category === 'ultrasound' ? 'УЗИ' : 'Заключение'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-sage-900 line-clamp-2 group-hover:text-sage-700 transition-colors">
                  {doc.title}
                </h3>

                <div className="mt-2 text-xs text-sage-500 space-y-0.5">
                  <div>Дата: <strong className="text-sage-800">{doc.date}</strong></div>
                  <div>Врач: <strong className="text-sage-800">{doc.doctorName}</strong></div>
                  <div className="truncate">{doc.clinic}</div>
                </div>

                {/* AI Summary snippet */}
                {doc.aiSummary && (
                  <div className="mt-4 p-3 rounded-2xl bg-softblue-50/70 border border-softblue-200/60 text-[11px] text-softblue-900 leading-snug">
                    <div className="flex items-center gap-1 font-bold mb-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-softblue-600" />
                      <span>AI-резюме:</span>
                    </div>
                    {doc.aiSummary}
                  </div>
                )}
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-5 pt-4 border-t border-sage-100 flex items-center justify-between">
                <span className="text-[11px] text-sage-400">{doc.fileType.toUpperCase()} • {doc.fileSize}</span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="p-2 rounded-xl text-sage-600 hover:text-sage-900 hover:bg-sage-100 transition-colors"
                    title="Просмотреть документ"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => alert(`Загрузка файла ${doc.title} началась...`)}
                    className="p-2 rounded-xl text-sage-600 hover:text-sage-900 hover:bg-sage-100 transition-colors"
                    title="Скачать файл"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Удалить документ «${doc.title}» из медкарты?`)) {
                        deleteDocument(doc.id);
                      }
                    }}
                    className="p-2 rounded-xl text-sage-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-sage-200 text-sage-500">
              <FolderHeart className="w-12 h-12 mx-auto mb-3 text-sage-300" />
              <h4 className="text-base font-bold text-sage-900">Документов не найдено</h4>
              <p className="text-xs text-sage-500 mt-1">Попробуйте изменить поисковый запрос или фильтр категории</p>
            </div>
          )}
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL WITH OCR */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-soft-xl border border-sage-100 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b border-sage-100 flex items-center justify-between bg-warmbeige-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sage-800 text-white flex items-center justify-center">
                  <FileText className="w-5 h-5 text-sage-200" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-sage-900 font-display">{selectedDoc.title}</h3>
                  <p className="text-xs text-sage-500">{selectedDoc.clinic} • {selectedDoc.date}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-2 rounded-full text-sage-400 hover:text-sage-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scrollable */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Doctor and Clinic details */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-sage-50 border border-sage-200 text-xs">
                <div>
                  <span className="text-sage-500 block">Врач:</span>
                  <span className="font-bold text-sage-900">{selectedDoc.doctorName}</span>
                </div>
                <div>
                  <span className="text-sage-500 block">Медицинская организация:</span>
                  <span className="font-bold text-sage-900">{selectedDoc.clinic}</span>
                </div>
              </div>

              {/* OCR Recognized text */}
              {selectedDoc.ocrExtractedText && (
                <div>
                  <h4 className="text-xs font-bold text-sage-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sage-600" />
                    <span>Распознанный текст документа (NESTA OCR)</span>
                  </h4>
                  <pre className="p-4 rounded-2xl bg-warmbeige-50 border border-warmbeige-200 text-xs font-mono text-sage-800 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                    {selectedDoc.ocrExtractedText}
                  </pre>
                </div>
              )}

              {/* Key findings table */}
              {selectedDoc.keyFindings && selectedDoc.keyFindings.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-sage-700 uppercase tracking-wider mb-2">
                    Оцифрованные показатели и референсы:
                  </h4>
                  <div className="border border-sage-200 rounded-2xl overflow-hidden divide-y divide-sage-100 text-xs">
                    {selectedDoc.keyFindings.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between bg-white hover:bg-sage-50/50">
                        <div>
                          <div className="font-bold text-sage-900">{item.parameter}</div>
                          <div className="text-[11px] text-sage-500">Референс: {item.normalRange}</div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-sage-900">{item.value}</span>
                          <span className="block text-[11px] text-emerald-700 font-medium">
                            {item.interpretation}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI summary */}
              {selectedDoc.aiSummary && (
                <div className="p-4 rounded-2xl bg-softblue-50/80 border border-softblue-200 text-xs text-softblue-950">
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-softblue-700" />
                    <span>Клиническое резюме NESTA AI:</span>
                  </div>
                  <p className="leading-relaxed">{selectedDoc.aiSummary}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-warmbeige-50/80 border-t border-sage-100 flex items-center justify-between shrink-0">
              <span className="text-xs text-sage-500">Документ проверен и защищен</span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-5 py-2 rounded-xl bg-sage-800 text-white font-semibold text-xs"
              >
                Закрыть просмотр
              </button>
            </div>
          </div>
        </div>
      )}

      <UploadDocumentModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
};
