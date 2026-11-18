// src/pages/AiAssistantPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Send, 
  Paperclip, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  RotateCcw, 
  ShieldCheck, 
  Upload, 
  Bot, 
  User,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { SAMPLE_AI_QUESTIONS } from '../data/mockData';

export const AiAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const { aiMessages, isAiTyping, sendAiMessage, clearAiChat } = useData();
  const location = useLocation();

  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; type: string; content?: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check URL query parameters for fast-launching sample questions from other pages
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialQuery = params.get('q');
    if (initialQuery) {
      setInputText(initialQuery);
    }
  }, [location.search]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isAiTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachedFile) return;

    sendAiMessage(inputText.trim() || 'Проанализируй прикрепленный документ', attachedFile || undefined);
    setInputText('');
    setAttachedFile(null);
  };

  const handleAttachSampleDocument = (fileName: string, ocrText: string) => {
    setIsUploading(true);
    setTimeout(() => {
      setAttachedFile({
        name: fileName,
        type: 'application/pdf',
        content: ocrText
      });
      setIsUploading(false);
      setInputText(`Расшифруй показатели из прикрепленного файла «${fileName}»`);
    }, 400);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col bg-white rounded-3xl border border-sage-200/80 shadow-soft overflow-hidden animate-in fade-in duration-200">
      {/* Header */}
      <div className="px-6 py-4 bg-warmbeige-50/70 border-b border-sage-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sage-800 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-sage-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold font-display text-sage-900">NESTA AI Medical Assistant</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Доказательная база ВОЗ
              </span>
            </div>
            <p className="text-xs text-sage-600">
              Понимание анализов, медицинской терминологии и подготовка вопросов врачу
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearAiChat}
            className="p-2 rounded-xl text-sage-400 hover:text-sage-700 hover:bg-sage-100 transition-colors"
            title="Очистить чат"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Medical Disclaimer Banner */}
      <div className="px-6 py-2.5 bg-amber-50/70 border-b border-amber-200/50 flex items-center justify-between text-xs text-amber-900 shrink-0">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Медицинский регламент:</strong> AI-ассистент носит образовательный характер и не ставит клинический диагноз. При острых состояниях вызывайте скорую помощь (103).
          </span>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {aiMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-xs ${
                  isUser
                    ? 'bg-sage-700 text-white'
                    : 'bg-sage-800 text-sage-200'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Bubble Container */}
                <div
                  className={`p-4 sm:p-5 rounded-3xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-sage-800 text-white rounded-tr-none shadow-sm'
                      : 'bg-warmbeige-50/80 border border-sage-200/70 text-sage-900 rounded-tl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>

                  {/* Attachment if present */}
                  {msg.attachment && (
                    <div className="mt-3 p-3 rounded-2xl bg-white/20 border border-white/20 flex items-center gap-2.5 text-xs">
                      <FileText className="w-4 h-4 shrink-0" />
                      <div className="overflow-hidden">
                        <div className="font-semibold truncate">{msg.attachment.name}</div>
                        <div className="text-[10px] opacity-80">Документ загружен и проанализирован OCR</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Structured Medical Card (If present on assistant message) */}
                {msg.structuredCard && (
                  <div className="bg-white rounded-3xl border border-sage-200/90 shadow-soft-lg p-5 sm:p-6 space-y-5 animate-in fade-in slide-in-from-bottom-2">
                    {/* Indicator Title */}
                    <div className="flex items-center justify-between pb-3 border-b border-sage-100">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-sage-700" />
                        <h4 className="font-bold font-display text-sage-900 text-base">
                          {msg.structuredCard.indicatorName}
                        </h4>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                        Верифицировано ВОЗ
                      </span>
                    </div>

                    {/* 4 Core Blocks */}
                    <div className="space-y-4">
                      {/* 1. Что означает показатель? */}
                      <div className="p-3.5 rounded-2xl bg-warmbeige-50/70 border border-warmbeige-200/80">
                        <div className="text-xs font-bold text-sage-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-sage-600" />
                          <span>1. Что означает показатель?</span>
                        </div>
                        <p className="text-xs text-sage-800 leading-relaxed">
                          {msg.structuredCard.meaning}
                        </p>
                      </div>

                      {/* 2. Как понять результат? */}
                      <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70">
                        <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>2. Как понять результат?</span>
                        </div>
                        <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                          {msg.structuredCard.resultExplanation}
                        </p>
                      </div>

                      {/* 3. На что обратить внимание? */}
                      <div className="p-3.5 rounded-2xl bg-softblue-50/60 border border-softblue-200/70">
                        <div className="text-xs font-bold text-softblue-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-softblue-700" />
                          <span>3. На что обратить внимание?</span>
                        </div>
                        <ul className="text-xs text-softblue-950 space-y-1 list-disc list-inside leading-relaxed">
                          {msg.structuredCard.attentionPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>

                      {/* 4. Что обсудить с врачом? */}
                      <div className="p-3.5 rounded-2xl bg-sage-100/70 border border-sage-200/80">
                        <div className="text-xs font-bold text-sage-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-sage-700" />
                          <span>4. Вопросы для врача на приеме:</span>
                        </div>
                        <ul className="text-xs text-sage-900 space-y-1.5 list-disc list-inside leading-relaxed">
                          {msg.structuredCard.doctorQuestions.map((q, idx) => (
                            <li key={idx} className="font-medium">{q}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Sources */}
                    {msg.structuredCard.sources && (
                      <div className="pt-2 border-t border-sage-100">
                        <div className="text-[10px] font-semibold text-sage-500 uppercase mb-1">
                          Клинические источники:
                        </div>
                        <div className="space-y-0.5">
                          {msg.structuredCard.sources.map((src, idx) => (
                            <div key={idx} className="text-[11px] text-sage-600 flex items-center gap-1">
                              <ExternalLink className="w-3 h-3 text-sage-400 shrink-0" />
                              <span>{src}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-[10px] text-sage-400 px-1">{msg.timestamp}</div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isAiTyping && (
          <div className="flex gap-3 max-w-md items-center">
            <div className="w-8 h-8 rounded-2xl bg-sage-800 text-sage-200 flex items-center justify-center text-xs">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-warmbeige-100 text-xs text-sage-600 font-medium animate-pulse flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-sage-500" />
              <span>NESTA AI анализирует медицинские протоколы и формирует структурированный ответ...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Fast Questions Bar */}
      <div className="px-4 sm:px-6 py-2.5 bg-warmbeige-50/50 border-t border-sage-100 overflow-x-auto shrink-0 flex items-center gap-2 no-scrollbar">
        <span className="text-[11px] font-semibold text-sage-500 uppercase shrink-0">Примеры:</span>
        {SAMPLE_AI_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => setInputText(q)}
            className="text-xs px-3 py-1.5 rounded-full bg-white border border-sage-200 hover:border-sage-400 text-sage-700 font-medium transition-colors shrink-0 text-left"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Attached file chip if present */}
      {attachedFile && (
        <div className="px-6 py-2 bg-sage-100/80 border-t border-sage-200 flex items-center justify-between text-xs text-sage-800 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <FileText className="w-4 h-4 text-sage-600 shrink-0" />
            <span className="font-semibold truncate">{attachedFile.name}</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">OCR готов</span>
          </div>
          <button
            onClick={() => setAttachedFile(null)}
            className="text-xs text-sage-500 hover:text-rose-600 font-semibold"
          >
            Удалить
          </button>
        </div>
      )}

      {/* Bottom Input Form */}
      <form onSubmit={handleSend} className="p-4 sm:p-5 border-t border-sage-200 bg-white shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Attach Document Quick Dropdown / Button */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => handleAttachSampleDocument(
                'ОАК_развернутый_8мес.pdf',
                'Гемоглобин: 118 г/л, Эритроциты: 4.2 x10^12/л, Ферритин: 38 мкг/л, Лейкоциты: 7.8 x10^9/л'
              )}
              className="p-3 rounded-2xl bg-warmbeige-50 hover:bg-warmbeige-100 text-sage-700 border border-sage-200 transition-colors"
              title="Прикрепить анализ крови для OCR"
            >
              <Paperclip className="w-5 h-5" />
            </button>
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Задайте вопрос о здоровье, анализах или развитии малыша..."
            className="flex-1 px-4 py-3 rounded-2xl bg-warmbeige-50/50 border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/30 focus:border-sage-600 text-sm text-sage-900 placeholder:text-sage-400"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() && !attachedFile}
            className="p-3 sm:px-5 sm:py-3 rounded-2xl bg-sage-800 hover:bg-sage-900 disabled:opacity-40 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-sm"
          >
            <span className="hidden sm:inline">Отправить</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
