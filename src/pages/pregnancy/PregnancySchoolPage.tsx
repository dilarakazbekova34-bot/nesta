// src/pages/pregnancy/PregnancySchoolPage.tsx
import React, { useState } from 'react';
import { SCHOOL_COURSES, INITIAL_SCHOOL_LESSONS, SchoolLesson } from '../../data/schoolData';
import { 
  BookOpen, 
  CheckCircle2, 
  Bookmark, 
  Clock, 
  Sparkles, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const PregnancySchoolPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lessons, setLessons] = useState<SchoolLesson[]>(() => {
    const saved = localStorage.getItem('nesta_school_lessons');
    return saved ? JSON.parse(saved) : INITIAL_SCHOOL_LESSONS;
  });

  const [activeLessonModal, setActiveLessonModal] = useState<SchoolLesson | null>(null);

  const saveLessons = (updated: SchoolLesson[]) => {
    setLessons(updated);
    localStorage.setItem('nesta_school_lessons', JSON.stringify(updated));
  };

  const toggleComplete = (id: string) => {
    const updated = lessons.map(l => l.id === id ? { ...l, isCompleted: !l.isCompleted } : l);
    saveLessons(updated);
    if (activeLessonModal && activeLessonModal.id === id) {
      setActiveLessonModal({ ...activeLessonModal, isCompleted: !activeLessonModal.isCompleted });
    }
  };

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = lessons.map(l => l.id === id ? { ...l, isFavorite: !l.isFavorite } : l);
    saveLessons(updated);
    if (activeLessonModal && activeLessonModal.id === id) {
      setActiveLessonModal({ ...activeLessonModal, isFavorite: !activeLessonModal.isFavorite });
    }
  };

  const filtered = lessons.filter(l => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'favorites') return l.isFavorite;
    return l.courseCategory === selectedCategory;
  });

  const completedCount = lessons.filter(l => l.isCompleted).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-softblue-800 bg-softblue-100 px-3 py-1 rounded-full">
              Приоритет 3 • Школа осознанного родительства
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900 mt-2">
            Школа беременности и родов NESTA
          </h1>
          <p className="text-xs sm:text-sm text-sage-600 mt-1">
            Короткие доказательные уроки, практические чек-листы и ответы на частые вопросы
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-sage-200 shadow-soft flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-sage-500 block">Пройдено уроков</span>
            <span className="text-base font-bold text-sage-900">{completedCount} из {lessons.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
            {Math.round((completedCount / lessons.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Course Categories Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
            selectedCategory === 'all'
              ? 'bg-sage-800 text-white border-sage-800 shadow-soft'
              : 'bg-white hover:bg-sage-50 text-sage-700 border-sage-200'
          }`}
        >
          Все разделы ({lessons.length})
        </button>

        <button
          onClick={() => setSelectedCategory('favorites')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
            selectedCategory === 'favorites'
              ? 'bg-amber-600 text-white border-amber-600 shadow-soft'
              : 'bg-white hover:bg-sage-50 text-sage-700 border-sage-200'
          }`}
        >
          ★ В избранном ({lessons.filter(l => l.isFavorite).length})
        </button>

        {SCHOOL_COURSES.map((course) => (
          <button
            key={course.id}
            onClick={() => setSelectedCategory(course.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
              selectedCategory === course.id
                ? 'bg-sage-800 text-white border-sage-800 shadow-soft'
                : 'bg-white hover:bg-sage-50 text-sage-700 border-sage-200'
            }`}
          >
            <span>{course.icon}</span>
            <span>{course.label}</span>
          </button>
        ))}
      </div>

      {/* Lessons List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => setActiveLessonModal(lesson)}
            className="p-5 rounded-3xl bg-white border border-sage-200/90 shadow-soft hover:shadow-soft-lg hover:border-sage-400 cursor-pointer transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-softblue-800 bg-softblue-100 px-2.5 py-0.5 rounded-full">
                  {lesson.categoryTitle}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleFavorite(lesson.id, e)}
                    className="p-1.5 text-sage-400 hover:text-amber-500 transition-colors"
                  >
                    <Bookmark className={`w-4 h-4 ${lesson.isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>

                  {lesson.isCompleted && (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Пройден</span>
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-base font-bold font-display text-sage-900 group-hover:text-softblue-900 transition-colors leading-snug">
                {lesson.title}
              </h3>

              <p className="text-xs text-sage-600 line-clamp-2 leading-relaxed">
                {lesson.overview}
              </p>
            </div>

            <div className="pt-3 border-t border-sage-100 flex items-center justify-between text-xs text-sage-500">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sage-400" />
                <span>{lesson.readTimeMin} мин чтения</span>
              </div>

              <span className="font-semibold text-softblue-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Открыть урок →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lesson Reader Modal */}
      {activeLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-4xl max-w-2xl w-full shadow-soft-xl border border-sage-100 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 bg-warmbeige-50/80 border-b border-sage-100 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-softblue-800 bg-softblue-100 px-2.5 py-0.5 rounded-full">
                  {activeLessonModal.categoryTitle}
                </span>
                <h3 className="text-lg font-bold font-display text-sage-900">
                  {activeLessonModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveLessonModal(null)}
                className="p-2 rounded-full text-sage-400 hover:text-sage-800 hover:bg-sage-100"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-sage-800 leading-relaxed">
              <div className="p-4 rounded-3xl bg-softblue-50/60 border border-softblue-200/80 font-medium text-softblue-950">
                {activeLessonModal.overview}
              </div>

              {/* Key Points */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold font-display text-sage-900">Ключевые выводы урока:</h4>
                <ul className="space-y-2 list-disc list-inside text-sage-700 text-xs">
                  {activeLessonModal.keyPoints.map((pt, i) => (
                    <li key={i} className="leading-relaxed">{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Action Checklist */}
              {activeLessonModal.checklistItems.length > 0 && (
                <div className="space-y-2.5 p-4 rounded-3xl bg-warmbeige-50/80 border border-warmbeige-200">
                  <h4 className="text-xs font-bold font-display text-sage-900 uppercase tracking-wider">
                    Чек-лист для родителей:
                  </h4>
                  <div className="space-y-1.5 text-xs text-sage-800">
                    {activeLessonModal.checklistItems.map((chk, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{chk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ */}
              {activeLessonModal.faq.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold font-display text-sage-900">Часто задаваемые вопросы:</h4>
                  {activeLessonModal.faq.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-sage-50 border border-sage-200/80 text-xs space-y-1">
                      <span className="font-bold text-sage-900 block">Q: {item.question}</span>
                      <p className="text-sage-700">A: {item.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 bg-warmbeige-50/60 border-t border-sage-100 flex items-center justify-between">
              <button
                onClick={() => toggleFavorite(activeLessonModal.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-sage-600 hover:text-amber-600"
              >
                <Bookmark className={`w-4 h-4 ${activeLessonModal.isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{activeLessonModal.isFavorite ? 'В избранном' : 'Сохранить в избранное'}</span>
              </button>

              <button
                onClick={() => toggleComplete(activeLessonModal.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold shadow-soft transition-all flex items-center gap-2 ${
                  activeLessonModal.isCompleted
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : 'bg-sage-800 hover:bg-sage-900 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{activeLessonModal.isCompleted ? 'Урок освоен (Отменить)' : 'Отметить как пройденный'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
