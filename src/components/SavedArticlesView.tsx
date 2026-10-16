import React from 'react';
import { Bookmark, Clock, ArrowRight, ArrowUpRight, Trash2, BookOpen, Compass } from 'lucide-react';
import { Article } from '../types';
import { Link } from './Link';
import { ArticleIllustration } from './ArticleIllustration';

interface SavedArticlesViewProps {
  savedArticles: Article[];
  onRemoveBookmark: (id: string) => void;
  visualMode: 'photo' | 'graphic';
}

export const SavedArticlesView: React.FC<SavedArticlesViewProps> = ({
  savedArticles,
  onRemoveBookmark,
  visualMode,
}) => {
  const totalMinutes = savedArticles.reduce((acc, art) => {
    const mins = parseInt(art.readTime) || 5;
    return acc + mins;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 space-y-8">
      {/* Breadcrumb with Anchor Tags */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-mono">
        <Link href="/" className="hover:text-[#8B2547] underline-offset-2 hover:underline">
          Home
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-medium">Saved Reading Queue</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7E7EC] text-[#8B2547] text-xs font-semibold mb-2">
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Personal Offline Library</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Saved Articles & Field Notes
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Persisted locally in your browser for calm weekend reading without distractions.
          </p>
        </div>

        {savedArticles.length > 0 && (
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-stone-200 text-xs font-mono text-stone-600 shrink-0">
            <div>
              <span className="font-bold text-stone-900">{savedArticles.length}</span>{' '}
              {savedArticles.length === 1 ? 'guide' : 'guides'}
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#8B2547]" />
              <span>~{totalMinutes} min reading time</span>
            </div>
          </div>
        )}
      </div>

      {/* Empty State or Articles Grid */}
      {savedArticles.length === 0 ? (
        <div className="text-center py-20 px-6 bg-white rounded-3xl border border-stone-200 max-w-xl mx-auto my-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h2 className="font-serif text-xl font-semibold text-stone-900">
            Your reading queue is empty
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
            Click the bookmark icon on any guide or article to save it here for later reference.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore All Guides</span>
            </Link>
            <Link
              href="/category/wellness"
              className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-medium hover:bg-stone-200 transition-colors"
            >
              Wellness
            </Link>
            <Link
              href="/category/finance"
              className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-medium hover:bg-stone-200 transition-colors"
            >
              Finance
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedArticles.map((article) => {
            const categoryColorClass = {
              Wellness: 'text-[#5B7959]',
              Health: 'text-[#D25372]',
              Skincare: 'text-[#8E68B8]',
              Finance: 'text-[#3D7D6A]',
              Startups: 'text-[#5A56A8]',
            }[article.category];

            return (
              <div
                key={article.id}
                className="group bg-white border border-stone-200 rounded-3xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 relative overflow-hidden bg-stone-100">
                    <ArticleIllustration
                      visualType={article.visualType}
                      imageUrl={article.imageUrl}
                      alt={article.title}
                      forceGraphic={visualMode === 'graphic'}
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemoveBookmark(article.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-xs text-stone-500 hover:text-rose-600 hover:bg-white shadow-xs transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className={`text-xs font-semibold uppercase tracking-wider ${categoryColorClass}`}>
                      {article.category} · {article.readTime}
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-stone-900 group-hover:text-[#8B2547] transition-colors mt-2 leading-snug">
                      <Link href={`/article/${article.id}`}>
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-stone-100 text-xs">
                  <span className="text-stone-400 font-mono">{article.publishedDate}</span>
                  <Link
                    href={`/article/${article.id}`}
                    className="font-medium text-[#8B2547] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read guide</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
