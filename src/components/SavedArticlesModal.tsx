import React from 'react';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { Article } from '../types';
import { ArticleIllustration } from './ArticleIllustration';
import { AppLink } from './AppLink';
import { getArticleUrl } from '../utils/routes';

interface SavedArticlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onRemoveBookmark: (id: string) => void;
}

export const SavedArticlesModal: React.FC<SavedArticlesModalProps> = ({
  isOpen,
  onClose,
  savedArticles,
  onSelectArticle,
  onRemoveBookmark,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FAF8F5] rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#8B2547] fill-current" />
            <h3 className="font-serif text-lg font-semibold text-stone-900">Saved for Later</h3>
            <span className="text-xs text-stone-500 font-mono">({savedArticles.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            aria-label="Close saved articles drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {savedArticles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
                <Bookmark className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-base font-semibold text-stone-800">No saved articles yet</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Tap the bookmark ribbon on any story to save it for your quiet weekend reading.
              </p>
            </div>
          ) : (
            savedArticles.map((article) => (
              <div
                key={article.id}
                className="p-3 bg-white rounded-2xl border border-stone-200 hover:border-stone-300 transition-all flex items-center gap-3 group"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-stone-100">
                  <ArticleIllustration
                    visualType={article.visualType}
                    imageUrl={article.imageUrl}
                    alt={article.title}
                  />
                </div>
                <AppLink
                  to={getArticleUrl(article.id)}
                  onClick={() => {
                    onSelectArticle(article);
                    onClose();
                  }}
                  className="flex-1 min-w-0"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8B2547]">
                    {article.category}
                  </div>
                  <h4 className="font-serif text-xs font-semibold text-stone-900 truncate group-hover:text-[#8B2547] transition-colors mt-0.5">
                    {article.title}
                  </h4>
                  <div className="text-[11px] text-stone-500 mt-0.5 font-mono">{article.readTime}</div>
                  <span className="sr-only">Read saved article: {article.title}</span>
                </AppLink>

                <div className="flex items-center gap-1 shrink-0">
                  <AppLink
                    to={getArticleUrl(article.id)}
                    onClick={() => {
                      onSelectArticle(article);
                      onClose();
                    }}
                    className="p-2 text-stone-400 hover:text-stone-800 transition-colors"
                    title={`Read ${article.title}`}
                  >
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    <span className="sr-only">Read now: {article.title}</span>
                  </AppLink>
                  <button
                    onClick={() => onRemoveBookmark(article.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                    title="Remove from saved"
                    aria-label={`Remove ${article.title} from saved`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
