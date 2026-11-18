// src/pages/LibraryPage.tsx
import React, { useState } from 'react';
import { 
  LIBRARY_CATEGORIES, 
  MEDICAL_ARTICLES, 
  MedicalArticle, 
  LibraryCategory,
  searchMedicalArticles 
} from '../data/medicalLibraryData';
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Share2, 
  CheckCircle2,
  ChevronRight,
  Filter
} from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<LibraryCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('nesta_library_favs');
    return saved ? JSON.parse(saved) : ['art_01', 'art_03'];
  });
  const [activeArticleModal, setActiveArticleModal] = useState<MedicalArticle | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('nesta_library_favs', JSON.stringify(updated));
  };

  const handleShare = (article: MedicalArticle, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/library?art=${article.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const filteredArticles = MEDICAL_ARTICLES.filter(a => {
    const matchesCat = selectedCategory === 'all' || a.category === selectedCategory;
    const matchesSearch = !searchQuery || 
                          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.primarySourceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Доказательная медицина • Evidence-Based
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-sage-900 mt-2">
            Медицинская библиотека NESTA
          </h1>
          <p className="text-xs sm:text-sm text-sage-600 mt-1">
            Проверенная база знаний для будущих родителей: протоколы ВОЗ, ЮНИСЕФ, ACOG и Министерства здравоохранения РК
          </p>
        </div>

        {/* Verified Badges Pill */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-white border border-sage-200 text-[11px] font-bold text-sage-800 shadow-xs">
            🇰🇿 МЗ РК
          </span>
          <span className="px-3 py-1 rounded-xl bg-white border border-sage-200 text-[11px] font-bold text-sage-800 shadow-xs">
            🇺🇳 ВОЗ / WHO
          </span>
          <span className="px-3 py-1 rounded-xl bg-white border border-sage-200 text-[11px] font-bold text-sage-800 shadow-xs">
            ACOG
          </span>
        </div>
      </div>

      {/* Strict Source Policy Disclaimer */}
      <div className="p-4 rounded-3xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Стандарт достоверности NESTA:</strong> Мы категорически исключаем случайные форумы, блоги и непроверенные коммерческие статьи. Каждая публикация содержит прямую ссылку на действующий клинический протокол или рецензируемый источник и проходит верификацию медицинским специалистом.
        </div>
      </div>

      {/* Search Input & Category Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по диагнозам, симптомам, лекарствам и анализам..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-sage-200 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500/30"
          />
        </div>

        {/* 14 Categories Horizontal Slider */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === 'all'
                ? 'bg-sage-800 text-white border-sage-800 shadow-soft'
                : 'bg-white hover:bg-sage-50 text-sage-700 border-sage-200'
            }`}
          >
            Все темы ({MEDICAL_ARTICLES.length})
          </button>

          {LIBRARY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-sage-800 text-white border-sage-800 shadow-soft'
                  : 'bg-white hover:bg-sage-50 text-sage-700 border-sage-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => {
          const isFav = favorites.includes(article.id);
          return (
            <div
              key={article.id}
              onClick={() => setActiveArticleModal(article)}
              className="bg-white rounded-3xl border border-sage-200 shadow-soft hover:shadow-soft-lg hover:border-sage-400 cursor-pointer transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-44 w-full overflow-hidden bg-sage-100">
                  <img
                    src={article.coverUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-sm text-sage-900 shadow-xs">
                      {article.categoryLabel}
                    </span>
                    {article.kazakhstanSpecific && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-700 text-white shadow-xs">
                        🇰🇿 РК Протокол
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => toggleFavorite(article.id, e)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-sage-600 hover:text-amber-500 transition-colors shadow-xs"
                  >
                    <Bookmark className={`w-4 h-4 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                </div>

                {/* Content info */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-sage-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTimeMin} мин</span>
                    <span>•</span>
                    <span>{article.lastVerifiedDate}</span>
                  </div>

                  <h3 className="text-base font-bold font-display text-sage-900 group-hover:text-softblue-900 transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-sage-600 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-sage-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Проверено врачом</span>
                  </div>

                  <span className="text-softblue-800 font-bold group-hover:translate-x-0.5 transition-transform">
                    Читать →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Article Reader Modal */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-4xl max-w-3xl w-full shadow-soft-xl border border-sage-100 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 bg-warmbeige-50/80 border-b border-sage-100 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-softblue-800 bg-softblue-100 px-2.5 py-0.5 rounded-full">
                    {activeArticleModal.categoryLabel}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {activeArticleModal.sourceType}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold font-display text-sage-900">
                  {activeArticleModal.title}
                </h2>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => handleShare(activeArticleModal, e)}
                  className="p-2 rounded-xl text-sage-500 hover:text-sage-900 hover:bg-sage-100"
                  title="Поделиться ссылкой"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveArticleModal(null)}
                  className="p-2 rounded-xl text-sage-400 hover:text-sage-800 hover:bg-sage-100"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable Article Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-5 text-xs sm:text-sm text-sage-800 leading-relaxed">
              {activeArticleModal.warningAlert && (
                <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200 text-rose-950 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs font-semibold leading-relaxed">
                    {activeArticleModal.warningAlert}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {activeArticleModal.content.map((p, idx) => (
                  <p key={idx} className="leading-relaxed text-sage-800">
                    {p}
                  </p>
                ))}
              </div>

              {/* Source Verification Box */}
              <div className="p-5 rounded-3xl bg-warmbeige-50 border border-warmbeige-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-sage-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Верификация и первоисточник:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-sage-700">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-sage-400 block">Организация-автор:</span>
                    <span className="font-semibold text-sage-900">{activeArticleModal.organization}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-sage-400 block">Проверил специалист:</span>
                    <span className="font-semibold text-sage-900">{activeArticleModal.verifiedBy}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-warmbeige-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="text-sage-600 truncate">{activeArticleModal.primarySourceName}</span>
                  <a
                    href={activeArticleModal.primarySourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-softblue-800 hover:underline font-bold shrink-0"
                  >
                    <span>Открыть первоисточник</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-warmbeige-50/60 border-t border-sage-100 flex items-center justify-between">
              {copiedLink && (
                <span className="text-xs text-emerald-700 font-semibold animate-in fade-in">
                  ✓ Ссылка скопирована в буфер обмена!
                </span>
              )}
              <div className="ml-auto">
                <button
                  onClick={() => setActiveArticleModal(null)}
                  className="px-5 py-2.5 rounded-2xl bg-sage-800 text-white text-xs font-bold shadow-soft"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
