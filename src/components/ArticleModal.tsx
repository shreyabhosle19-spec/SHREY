import React, { useState, useEffect, useRef } from 'react';
import { X, Bookmark, Share2, Check, ArrowLeft, ArrowRight, Clock, Calendar, Sparkles } from 'lucide-react';
import { Article } from '../types';
import { ArticleIllustration } from './ArticleIllustration';
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
      navigator.clipboard.writeText(window.location.href);
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
            className="h-full bg-[#8B2547] transition-all duration-75"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Modal Header controls */}
        <div className="px-6 py-4 border-b border-stone-200/80 bg-[#FAF8F5]/90 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold uppercase tracking-wider ${categoryColorClass}`}>
              {article.category}
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500 font-mono">{article.readTime}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Font size toggle */}
            <div className="hidden sm:flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
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
                  ? 'bg-[#F7E7EC] border-[#8B2547] text-[#8B2547]'
                  : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300'
              }`}
              title={isBookmarked ? 'Remove from saved' : 'Save article'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300 transition-colors relative"
              title="Share article"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
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
              <span className="font-medium text-stone-900">{article.author.name}</span>
              <span>·</span>
              <span>{article.author.role}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {article.publishedDate}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {article.readTime}
              </span>
            </div>
          </div>

          {/* Key Takeaway Card */}
          <div className="p-5 bg-[#F6F4EF] rounded-2xl border border-stone-200/90">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8B2547] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Key Takeaway
            </div>
            <p className="text-sm font-serif text-stone-800 leading-relaxed mt-1.5 font-medium">
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
              {article.fullContent.introduction}
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
                    {p}
                  </p>
                ))}
                {sec.bulletPoints && (
                  <ul className="space-y-2 pl-4 list-disc marker:text-[#8B2547] text-stone-700">
                    {sec.bulletPoints.map((b, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {sec.callout && (
                  <div className="p-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-sm italic font-serif my-3">
                    {sec.callout}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Medical/Financial Disclaimer */}
          <div className="pt-6 border-t border-stone-200 text-xs text-stone-500 italic leading-relaxed">
            Slay & Scale shares general information for learning. It is not medical or financial advice. Talk to a
            doctor, dermatologist or licensed advisor for decisions about you.
          </div>

          {/* Next / Prev Navigation */}
          <div className="pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prevArticle ? (
              <button
                onClick={() => onSelectArticle(prevArticle)}
                className="p-3 bg-white rounded-xl border border-stone-200 hover:border-stone-300 text-left transition-colors flex items-center gap-3 group"
              >
                <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:text-stone-700 shrink-0" />
                <div className="overflow-hidden">
                  <div className="text-[11px] text-stone-400 uppercase font-medium">Previous Read</div>
                  <div className="text-xs font-serif font-medium text-stone-900 truncate">{prevArticle.title}</div>
                </div>
              </button>
            ) : <div />}

            {nextArticle && (
              <button
                onClick={() => onSelectArticle(nextArticle)}
                className="p-3 bg-white rounded-xl border border-stone-200 hover:border-stone-300 text-right transition-colors flex items-center justify-end gap-3 group"
              >
                <div className="overflow-hidden">
                  <div className="text-[11px] text-stone-400 uppercase font-medium">Next Read</div>
                  <div className="text-xs font-serif font-medium text-stone-900 truncate">{nextArticle.title}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 shrink-0" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
