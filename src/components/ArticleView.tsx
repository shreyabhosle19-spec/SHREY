import React, { useState, useEffect, useRef } from 'react';
import {
  Bookmark,
  Share2,
  Check,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Calendar,
  Sparkles,
  Compass,
  Link2,
  Home,
} from 'lucide-react';
import { Article } from '../types';
import { ArticleIllustration } from './ArticleIllustration';
import { Link } from './Link';
import {
  MorningResetTool,
  BudgetCalculatorTool,
  SipCalculatorTool,
  SkincareBuilderTool,
  CycleGuideTool,
  LabChecklistTool,
} from './InteractiveTools';

interface ArticleViewProps {
  article: Article;
  allArticles: Article[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  brandName: string;
  visualMode: 'photo' | 'graphic';
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  allArticles,
  bookmarkedIds,
  onToggleBookmark,
  brandName,
  visualMode,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Reset scroll when article changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setScrollProgress(0);

    const handleWindowScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [article.id]);

  const isBookmarked = bookmarkedIds.includes(article.id);
  const currentIndex = allArticles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  const handleShare = () => {
    if (navigator.clipboard) {
      const canonicalUrl = `${window.location.origin}/article/${article.id}`;
      navigator.clipboard.writeText(canonicalUrl);
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

  const categorySlug = article.category.toLowerCase();

  const relatedArticles = allArticles.filter((a) =>
    article.relatedArticleIds?.includes(a.id)
  );

  // Helper to parse and render markdown-style internal links as REAL HTML <a> ANCHOR TAGS
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
        <Link
          key={`${targetId}-${match.index}`}
          href={`/article/${targetId}`}
          className="inline-flex items-center gap-1 font-semibold text-[#8B2547] underline underline-offset-3 decoration-[#8B2547]/40 hover:decoration-[#8B2547] hover:bg-[#F7E7EC] px-1 py-0.5 rounded transition-all mx-0.5 align-baseline"
          title={targetArticle ? `Read connected guide: ${targetArticle.title}` : label}
        >
          <span>{label}</span>
          <ArrowUpRight className="w-3 h-3 inline-block stroke-[2.5] shrink-0" />
        </Link>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <article className="max-w-3xl mx-auto py-6 sm:py-10 space-y-8">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-stone-200 z-50">
        <div
          className="h-full bg-[#8B2547] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Semantic Breadcrumbs with REAL <a> Anchor Tags */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between text-xs text-stone-500 font-mono">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <Link href="/" className="hover:text-[#8B2547] flex items-center gap-1 shrink-0">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <Link
            href={`/category/${categorySlug}`}
            className="hover:text-[#8B2547] capitalize font-medium shrink-0"
          >
            {article.category}
          </Link>
          <span>/</span>
          <span className="text-stone-800 truncate font-sans font-medium">{article.title}</span>
        </div>

        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-1 text-xs text-[#8B2547] font-semibold hover:underline shrink-0 ml-4 font-sans"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Guides</span>
        </Link>
      </nav>

      {/* Utility Bar: Font Size, Bookmark, Share */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/category/${categorySlug}`}
            className={`text-xs font-semibold uppercase tracking-wider ${categoryColorClass} hover:underline`}
          >
            {article.category}
          </Link>
          <span className="text-stone-300">·</span>
          <span className="text-xs text-stone-500 font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {article.readTime}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Font size toggle */}
          <div className="hidden sm:flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200 text-xs">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                fontSize === 'normal'
                  ? 'bg-white font-semibold text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Standard font size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                fontSize === 'large'
                  ? 'bg-white font-semibold text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Large font size"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xl')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                fontSize === 'xl'
                  ? 'bg-white font-semibold text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Extra large font size"
            >
              A++
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(article.id)}
            className={`p-2 rounded-xl transition-colors border cursor-pointer ${
              isBookmarked
                ? 'bg-[#F7E7EC] border-[#8B2547] text-[#8B2547]'
                : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300'
            }`}
            title={isBookmarked ? 'Remove from saved' : 'Save article'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300 transition-colors relative cursor-pointer"
            title="Copy permanent article link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Hero Headline & Subtitle */}
      <header className="space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-stone-900 leading-[1.18] tracking-tight text-balance">
          {article.title}
        </h1>

        <p className="font-serif text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
          {article.excerpt}
        </p>

        {/* Byline */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-stone-200 text-xs text-stone-500 font-sans">
          <span className="font-semibold text-stone-900">{article.author.name}</span>
          <span>·</span>
          <span>{article.author.role}</span>
          <span>·</span>
          <span className="flex items-center gap-1 font-mono">
            <Calendar className="w-3.5 h-3.5" /> {article.publishedDate}
          </span>
        </div>
      </header>

      {/* Hero Graphic / Photo */}
      <div className="w-full h-64 sm:h-96 rounded-3xl overflow-hidden border border-stone-200 shadow-xs relative bg-stone-100">
        <ArticleIllustration
          visualType={article.visualType}
          imageUrl={article.imageUrl}
          alt={article.title}
          forceGraphic={visualMode === 'graphic'}
        />
      </div>

      {/* Key Takeaway Card */}
      <div className="p-6 bg-[#F6F4EF] rounded-3xl border border-stone-200/90 shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8B2547] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Key Takeaway
        </div>
        <p className="text-base sm:text-lg font-serif text-stone-800 leading-relaxed mt-2 font-medium">
          "{article.fullContent.keyTakeaway}"
        </p>
      </div>

      {/* Main Prose Content */}
      <div
        className={`prose text-stone-800 leading-relaxed space-y-6 ${
          fontSize === 'normal' ? 'text-base sm:text-[17px]' : fontSize === 'large' ? 'text-lg sm:text-[19px]' : 'text-xl'
        }`}
      >
        {/* Drop cap opening paragraph */}
        <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#8B2547] first-letter:leading-none leading-relaxed text-stone-800">
          {renderFormattedText(article.fullContent.introduction)}
        </p>

        {/* Embedded Interactive Tools */}
        {article.interactiveTool === 'morning-reset' && <MorningResetTool />}
        {article.interactiveTool === 'budget-calc' && <BudgetCalculatorTool />}
        {article.interactiveTool === 'sip-calc' && <SipCalculatorTool />}
        {article.interactiveTool === 'skincare-builder' && <SkincareBuilderTool />}
        {article.interactiveTool === 'cycle-guide' && <CycleGuideTool />}
        {article.interactiveTool === 'lab-checklist' && <LabChecklistTool />}

        {/* Sections */}
        {article.fullContent.sections.map((sec, idx) => (
          <div key={idx} className="space-y-4 pt-3">
            {sec.heading && (
              <h2 className="font-serif text-2xl font-semibold text-stone-900 pt-3">
                {sec.heading}
              </h2>
            )}

            {sec.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="text-stone-700 leading-relaxed">
                {renderFormattedText(p)}
              </p>
            ))}

            {sec.bulletPoints && (
              <ul className="space-y-2.5 pl-5 list-disc marker:text-[#8B2547] text-stone-700">
                {sec.bulletPoints.map((b, bIdx) => (
                  <li key={bIdx} className="leading-relaxed">
                    {renderFormattedText(b)}
                  </li>
                ))}
              </ul>
            )}

            {sec.callout && (
              <div className="p-5 bg-white rounded-2xl border-l-4 border-l-[#8B2547] border border-stone-200 text-stone-800 text-base italic font-serif my-4 shadow-2xs">
                {renderFormattedText(sec.callout)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Connected Guides / Internal Links Hub */}
      {relatedArticles.length > 0 && (
        <section className="pt-10 pb-4 border-t border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#8B2547]" />
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Connected Guides & Sequenced Reads
              </h3>
            </div>
            <span className="text-[11px] text-stone-500 font-mono flex items-center gap-1">
              <Link2 className="w-3 h-3 text-[#8B2547]" /> Internal Cross-Reference
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/article/${rel.id}`}
                className="p-3.5 bg-white rounded-2xl border border-stone-200 hover:border-[#8B2547] hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-full h-28 rounded-xl overflow-hidden bg-stone-100 mb-3">
                    <ArticleIllustration
                      visualType={rel.visualType}
                      imageUrl={rel.imageUrl}
                      alt={rel.title}
                      forceGraphic={visualMode === 'graphic'}
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B2547]">
                    {rel.category}
                  </span>
                  <h4 className="font-serif text-sm font-semibold text-stone-900 group-hover:text-[#8B2547] transition-colors line-clamp-2 mt-1 leading-snug">
                    {rel.title}
                  </h4>
                </div>

                <div className="mt-4 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400 font-mono">{rel.readTime}</span>
                  <span className="text-[#8B2547] font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Read <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Medical/Financial Advice Disclaimer */}
      <div className="p-4 bg-stone-100/80 rounded-2xl border border-stone-200 text-xs text-stone-500 italic leading-relaxed">
        {brandName} publishes evidence-based research and editorial perspectives for educational purposes. It does not constitute individual medical, dermatological, or financial advice. Consult a healthcare provider or certified financial planner for personal decisions.
      </div>

      {/* Next / Previous Article Navigation with Real Anchor Tags */}
      <nav aria-label="Article navigation" className="pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevArticle ? (
          <Link
            href={`/article/${prevArticle.id}`}
            className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors flex items-center gap-3 group text-left"
          >
            <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:text-stone-700 shrink-0" />
            <div className="overflow-hidden">
              <div className="text-[11px] text-stone-400 uppercase font-medium">Previous Read</div>
              <div className="text-xs sm:text-sm font-serif font-medium text-stone-900 truncate">
                {prevArticle.title}
              </div>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextArticle && (
          <Link
            href={`/article/${nextArticle.id}`}
            className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors flex items-center justify-end gap-3 group text-right"
          >
            <div className="overflow-hidden">
              <div className="text-[11px] text-stone-400 uppercase font-medium">Next Read</div>
              <div className="text-xs sm:text-sm font-serif font-medium text-stone-900 truncate">
                {nextArticle.title}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 shrink-0" />
          </Link>
        )}
      </nav>
    </article>
  );
};
