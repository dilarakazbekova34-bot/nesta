// src/components/common/UploadDocumentModal.tsx
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { DocumentCategory } from '../../types';
import { X, UploadCloud, FileText, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: DocumentCategory;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ 
  isOpen, 
  onClose,
  defaultCategory = 'lab_tests' 
}) => {
  const { addDocument } = useData();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>(defaultCategory);
  const [doctorName, setDoctorName] = useState('');
  const [clinic, setClinic] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'jpg' | 'png'>('pdf');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [isSimulatingOcr, setIsSimulatingOcr] = useState(false);
  const [ocrText, setOcrText] = useState('');

  if (!isOpen) return null;

  const handleSimulateFileSelect = (sampleName: string, docCategory: DocumentCategory) => {
    setSelectedFileName(sampleName);
    setCategory(docCategory);
    setIsSimulatingOcr(true);

    if (sampleName.includes('ОАК') || docCategory === 'lab_tests') {
      setTitle('Развернутый общий анализ крови (ОАК)');
      setDoctorName('Д-р Касымова А.С.');
      setClinic('КДЛ Олимп');
      setTimeout(() => {
        setOcrText(`[OCR РАСПОЗНАНО]:\nГемоглобин: 118 г/л (норма: 105 - 135)\nЭритроциты: 4.2 x10^12/л\nЛейкоциты: 7.8 x10^9/л\nФерритин: 38 мкг/л\nЗаключение: Без признаков анемии и воспаления.`);
        setIsSimulatingOcr(false);
      }, 700);
    } else if (sampleName.includes('УЗИ') || docCategory === 'ultrasound') {
      setTitle('УЗИ органов брюшной полости и почек');
      setDoctorName('Д-р Ахметов М.С.');
      setClinic('Диагностический центр');
      setTimeout(() => {
        setOcrText(`[OCR РАСПОЗНАНО]:\nПечень: эхогенность средняя, контуры ровные.\nЖелчный пузырь: без конкрементов.\nПочки: норма по возрасту.\nЗаключение: Эхографических патологий не выявлено.`);
        setIsSimulatingOcr(false);
      }, 700);
    } else {
      setTitle('Консультативное заключение педиатра');
      setDoctorName('Д-р Касымова А.С.');
      setClinic('Клиника «Мейірім»');
      setTimeout(() => {
        setOcrText(`[OCR РАСПОЗНАНО]:\nЖалоб нет. Физическое развитие гармоничное.\nРекомендовано: плановое введение прикорма, витамин Д3 1000 МЕ.`);
        setIsSimulatingOcr(false);
      }, 700);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addDocument({
      title,
      category,
      date: new Date().toISOString().split('T')[0],
      doctorName: doctorName || 'Лечащий педиатр',
      clinic: clinic || 'Медицинский центр',
      fileType,
      fileSize: '1.8 МБ',
      ocrExtractedText: ocrText || 'Текст документа успешно распознан и проиндексирован системой NESTA OCR.',
      aiSummary: 'Документ верифицирован. Все ключевые показатели оцифрованы и доступны для анализа AI-ассистентом.',
      keyFindings: [
        {
          parameter: 'Клинический статус',
          value: 'В пределах возрастной нормы',
          normalRange: 'Норма',
          isAbnormal: false,
          interpretation: 'Отклонений от физиологических референсов не обнаружено.'
        }
      ]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-soft-xl border border-sage-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-sage-100 flex items-center justify-between bg-warmbeige-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sage-800 text-white flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-sage-900 font-display">Загрузка медицинского документа</h3>
              <p className="text-xs text-sage-600">Шифрование данных и мгновенное OCR-распознавание</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-sage-400 hover:text-sage-700 hover:bg-sage-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* File Drag and Drop Zone */}
          <div>
            <label className="block text-xs font-semibold text-sage-700 uppercase tracking-wider mb-2">
              Файл (PDF, JPG, PNG)
            </label>
            <div className="border-2 border-dashed border-sage-200 hover:border-sage-400 rounded-2xl p-5 text-center bg-sage-50/40 transition-colors">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-white text-sage-700 shadow-sm flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-sage-900 mb-1">
                  {selectedFileName ? selectedFileName : 'Перетащите файл сюда или выберите готовый образец'}
                </p>
                <p className="text-xs text-sage-500 mb-3">
                  Поддерживаются документы до 25 МБ. Данные защищены по стандарту HIPAA / GDPR.
                </p>

                {/* Quick test sample files buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                  <span className="text-[11px] text-sage-500">Быстрый пример:</span>
                  <button
                    type="button"
                    onClick={() => handleSimulateFileSelect('ОАК_развернутый_8мес.pdf', 'lab_tests')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-sage-200 hover:border-sage-400 text-xs text-sage-700 font-medium transition-colors"
                  >
                    + ОАК (Анализ крови).pdf
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateFileSelect('УЗИ_брюшная_полость.pdf', 'ultrasound')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-sage-200 hover:border-sage-400 text-xs text-sage-700 font-medium transition-colors"
                  >
                    + УЗИ протокол.pdf
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* OCR Live Status */}
          {isSimulatingOcr && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-softblue-50 text-softblue-800 text-xs border border-softblue-200 animate-pulse">
              <Sparkles className="w-4 h-4 text-softblue-600 shrink-0" />
              <span>Идет автоматическое OCR-распознавание текста и медицинских показателей...</span>
            </div>
          )}

          {ocrText && !isSimulatingOcr && (
            <div className="p-3.5 rounded-xl bg-sage-50 border border-sage-200 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-sage-800 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Текст распознан NESTA OCR:</span>
              </div>
              <pre className="font-mono text-[11px] text-sage-700 whitespace-pre-line leading-relaxed max-h-24 overflow-y-auto">
                {ocrText}
              </pre>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-sage-700 mb-1.5">
              Название документа <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Общий анализ мочи или Выписка из стационара"
              className="w-full px-4 py-2.5 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/30 focus:border-sage-600 text-sm"
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-sage-700 mb-1.5">
                Категория
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/30 focus:border-sage-600 text-sm bg-white"
              >
                <option value="lab_tests">Анализы (Лаборатория)</option>
                <option value="ultrasound">УЗИ и МРТ</option>
                <option value="doctor_notes">Заключения врачей</option>
                <option value="vaccination">Вакцинация</option>
                <option value="prescriptions">Назначения и рецепты</option>
                <option value="history">История обращений</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-sage-700 mb-1.5">
                Клиника / Лаборатория
              </label>
              <input
                type="text"
                value={clinic}
                onChange={(e) => setClinic(e.target.value)}
                placeholder="Например: КДЛ Олимп или Invivo"
                className="w-full px-3 py-2.5 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/30 focus:border-sage-600 text-sm"
              />
            </div>
          </div>

          {/* Doctor Name */}
          <div>
            <label className="block text-xs font-semibold text-sage-700 mb-1.5">
              Врач / Специалист
            </label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="ФИО врача"
              className="w-full px-4 py-2.5 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/30 focus:border-sage-600 text-sm"
            />
          </div>

          {/* Privacy badge */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-warmbeige-100/60 border border-warmbeige-200 text-xs text-sage-700">
            <ShieldCheck className="w-4 h-4 text-sage-700 shrink-0" />
            <span>Документ шифруется на стороне сервера и доступен только авторизованным членам семьи.</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sage-600 hover:text-sage-800 font-medium text-sm transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-sage-800 hover:bg-sage-900 text-white font-semibold text-sm transition-all shadow-sm hover:shadow"
            >
              Сохранить в медкарту
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
