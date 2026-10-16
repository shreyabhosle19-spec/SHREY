import React, { useState, useEffect, useRef } from 'react';
import { X, Bookmark, Share2, Check, ArrowLeft, ArrowRight, ArrowUpRight, Clock, Calendar, Sparkles, Compass, Link2 } from 'lucide-react';
import { Article } from '../types';
import { ArticleIllustration } from './ArticleIllustration';
import { AppLink } from './AppLink';
import { getArticleUrl, getCategoryUrl } from '../utils/routes';
import {
  MorningResetTool,
  BudgetCalculatorTool,
  SipCalculatorTool,
  SkincareBuilderTool,
  CycleGuideTool,
  LabChecklistTool,
} from './InteractiveTools';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
  allArticles: Article[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  onSelectArticle,
  allArticles,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    // Reset scroll when article changes
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
      setScrollProgress(0);
    }
  }, [article?.id]);

  if (!article) return null;

  const isBookmarked = bookmarkedIds.includes(article.id);
  const currentIndex = allArticles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      const url = new URL(window.location.origin + getArticleUrl(article.id));
      navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const categoryColorClass = {
    Wellness: 'text-[#5B7959]',
    Health: 'text-[#D25372]',
    Skincare: 'text-[#8E68B8]',
    Finance: 'text-[#3D7D6A]',
    Startups: 'text-[#5A56A8]',
  }[article.category];

  const relatedArticles = allArticles.filter((a) =>
    article.relatedArticleIds?.includes(a.id)
  );

  // Helper to parse and render markdown-style internal links: [Label](article:article-id)
  const renderFormattedText = (text: string) => {
    const regex = /\[([^\]]+)\]\(article:([^)]+)\)/g;
    const parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const label = match[1];
      const targetId = match[2];
      const targetArticle = allArticles.find((a) => a.id === targetId);

      parts.push(
        <AppLink
          key={`${targetId}-${match.index}`}
          to={getArticleUrl(targetId)}
          onClick={() => {
            if (targetArticle) {
              onSelectArticle(targetArticle);
            }
          }}
          className="inline-flex items-center gap-1 font-semibold text-[#8B2547] underline underline-offset-3 decoration-[#8B2547]/40 hover:decoration-[#8B2547] hover:bg-[#F7E7EC] px-1 py-0.5 rounded transition-all cursor-pointer text-left mx-0.5 align-baseline"
          title={targetArticle ? `Internal link to: ${targetArticle.title}` : label}
        >
          <span>{label}</span>
          <ArrowUpRight className="w-3 h-3 inline-block stroke-[2.5] shrink-0" aria-hidden="true" />
          <span className="sr-only">Read internal guide: {targetArticle?.title || label}</span>
        </AppLink>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-2 sm:p-4 md:p-6 transition-all"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top reading progress line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-stone-200 z-30">
          <div
            className="h-full bg-[#8B2547] transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Modal Top Bar: Category Pill & Actions */}
        <div className="px-6 sm:px-8 py-4 border-b border-stone-200/80 flex items-center justify-between gap-4 bg-[#FAF8F5]/90 backdrop-blur-sm z-20">
          <div className="flex items-center gap-3">
            <AppLink
              to={getCategoryUrl(article.category)}
              onClick={onClose}
              className={`text-xs font-semibold uppercase tracking-wider ${categoryColorClass} hover:opacity-80 transition-opacity`}
            >
              <span>{article.category} Section</span>
            </AppLink>
            <span className="text-stone-300 font-mono">/</span>
            <span className="text-xs text-stone-500 font-mono hidden sm:inline">
              {article.readTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Font size control */}
            <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200/80 mr-1">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  fontSize === 'normal' ? 'bg-white font-semibold text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Regular font size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 text-sm rounded-md transition-colors ${
                  fontSize === 'large' ? 'bg-white font-semibold text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Large font size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xl')}
                className={`px-2 py-1 text-base rounded-md transition-colors ${
                  fontSize === 'xl' ? 'bg-white font-semibold text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Extra large font size"
              >
                A++
              </button>
            </div>

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`p-2 rounded-xl transition-colors border ${
                isBookmarked
                  ? 'bg-[#F7E7EC] border-[#8B2547]/30 text-[#8B2547]'
                  : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this article'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Share link with unique clean URL */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition-colors relative"
              title="Copy clean article link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              {copied && (
                <span className="absolute -bottom-8 right-0 bg-stone-900 text-white text-[10px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap animate-fade-in">
                  Link copied!
                </span>
              )}
            </button>

            {/* Close modal link back to category */}
            <AppLink
              to={getCategoryUrl(article.category)}
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-400 hover:text-stone-800 transition-colors"
              title="Close article and return to library"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">Close article</span>
            </AppLink>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 sm:px-12 py-8 space-y-6"
        >
          {/* Article Banner Graphic */}
          <div className="w-full h-52 sm:h-72 rounded-2xl overflow-hidden border border-stone-200 shadow-xs group">
            <ArticleIllustration
              visualType={article.visualType}
              imageUrl={article.imageUrl}
              alt={article.title}
            />
          </div>

          {/* Headline & Metadata */}
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-stone-900 leading-tight">
              {article.title}
            </h1>
            <p className="font-serif text-base sm:text-lg text-stone-600 italic mt-2">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-stone-200/80 text-xs text-stone-500">
              <span className="font-medium text-stone-900">
                {article.author.name} · {article.author.role}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5" /> {article.publishedDate}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" /> {article.readTime}
              </span>
            </div>
          </div>

          {/* Key Editorial Takeaway Pill Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F6EFE9] border border-[#E8DDCE]">
            <div className="text-[11px] font-bold tracking-wider text-[#8B2547] uppercase flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8B2547]" />
              The Central Principle
            </div>
            <p className="font-serif text-sm sm:text-base text-stone-800 italic leading-relaxed">
              "{article.fullContent.keyTakeaway}"
            </p>
          </div>

          {/* Article Text */}
          <div
            className={`prose text-stone-800 leading-relaxed space-y-5 ${
              fontSize === 'normal' ? 'text-base' : fontSize === 'large' ? 'text-lg' : 'text-xl'
            }`}
          >
            {/* Opening with Drop Cap */}
            <p className="first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-[#8B2547] first-letter:leading-none">
              {renderFormattedText(article.fullContent.introduction)}
            </p>

            {/* In-Article Interactive Tool if available */}
            {article.interactiveTool === 'morning-reset' && <MorningResetTool />}
            {article.interactiveTool === 'budget-calc' && <BudgetCalculatorTool />}
            {article.interactiveTool === 'sip-calc' && <SipCalculatorTool />}
            {article.interactiveTool === 'skincare-builder' && <SkincareBuilderTool />}
            {article.interactiveTool === 'cycle-guide' && <CycleGuideTool />}
            {article.interactiveTool === 'lab-checklist' && <LabChecklistTool />}

            {/* Sections */}
            {article.fullContent.sections.map((sec, idx) => (
              <div key={idx} className="space-y-3 pt-2">
                {sec.heading && (
                  <h3 className="font-serif text-xl font-semibold text-stone-900 pt-2">
                    {sec.heading}
                  </h3>
                )}
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-stone-700 leading-relaxed">
                    {renderFormattedText(p)}
                  </p>
                ))}
                {sec.bulletPoints && (
                  <ul className="space-y-2 pl-4 list-disc marker:text-[#8B2547] text-stone-700">
                    {sec.bulletPoints.map((b, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {renderFormattedText(b)}
                      </li>
                    ))}
                  </ul>
                )}
                {sec.callout && (
                  <div className="p-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-sm italic font-serif my-3">
                    {renderFormattedText(sec.callout)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Connected Guides / Related Internal Links Section */}
          {relatedArticles.length > 0 && (
            <div className="pt-8 pb-2 border-t border-stone-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#8B2547]" />
                  <h4 className="font-serif text-lg font-bold text-stone-900">Connected Guides</h4>
                </div>
                <span className="text-[11px] text-stone-500 font-mono flex items-center gap-1">
                  <Link2 className="w-3 h-3 text-[#8B2547]" /> Internal Cross-Reference
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {relatedArticles.map((rel) => (
                  <AppLink
                    key={rel.id}
                    to={getArticleUrl(rel.id)}
                    onClick={() => onSelectArticle(rel)}
                    className="p-3 bg-white rounded-2xl border border-stone-200 hover:border-[#8B2547] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-full h-24 rounded-xl overflow-hidden bg-stone-100 mb-2.5">
                        <ArticleIllustration
                          visualType={rel.visualType}
                          imageUrl={rel.imageUrl}
                          alt={rel.title}
                        />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B2547]">
                        {rel.category}
                      </span>
                      <h5 className="font-serif text-xs font-semibold text-stone-900 group-hover:text-[#8B2547] transition-colors line-clamp-2 mt-1 leading-snug">
                        {rel.title}
                      </h5>
                    </div>
                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                      <span className="text-stone-400 font-mono">{rel.readTime}</span>
                      <span className="text-[#8B2547] font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        <span>Read guide: {rel.title}</span> <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                      </span>
                    </div>
                  </AppLink>
                ))}
              </div>
            </div>
          )}

          {/* Medical/Financial Disclaimer */}
          <div className="pt-6 border-t border-stone-200 text-xs text-stone-500 italic leading-relaxed">
            Slay & Scale shares general information for learning. It is not medical or financial advice. Talk to a
            doctor, dermatologist or licensed advisor for decisions about you.
          </div>

          {/* Next / Prev Semantic Navigation Links */}
          <div className="pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prevArticle ? (
              <AppLink
                to={getArticleUrl(prevArticle.id)}
                onClick={() => onSelectArticle(prevArticle)}
                className="p-3 bg-white rounded-xl border border-stone-200 hover:border-stone-300 text-left transition-colors flex items-center gap-3 group"
              >
                <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:text-stone-700 shrink-0" aria-hidden="true" />
                <div className="overflow-hidden">
                  <div className="text-[11px] text-stone-400 uppercase font-medium">Previous Read</div>
                  <div className="text-xs font-serif font-medium text-stone-900 truncate">
                    Read previous article: {prevArticle.title}
                  </div>
                </div>
              </AppLink>
            ) : <div />}

            {nextArticle && (
              <AppLink
                to={getArticleUrl(nextArticle.id)}
                onClick={() => onSelectArticle(nextArticle)}
                className="p-3 bg-white rounded-xl border border-stone-200 hover:border-stone-300 text-right transition-colors flex items-center justify-end gap-3 group"
              >
                <div className="overflow-hidden">
                  <div className="text-[11px] text-stone-400 uppercase font-medium">Next Read</div>
                  <div className="text-xs font-serif font-medium text-stone-900 truncate">
                    Read next article: {nextArticle.title}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 shrink-0" aria-hidden="true" />
              </AppLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
