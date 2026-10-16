/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Bookmark, Mail, SlidersHorizontal, ArrowUpRight, X, Sparkles } from 'lucide-react';
import { CategoryType, Article } from './types';
import { ARTICLES_DATA } from './data/articles';
import { ArticleIllustration } from './components/ArticleIllustration';
import { ArticleModal } from './components/ArticleModal';
import { SavedArticlesModal } from './components/SavedArticlesModal';
import { NewsletterModal } from './components/NewsletterModal';
import { BrandSwitcherModal } from './components/BrandSwitcherModal';
import { AppLink } from './components/AppLink';
import {
  getArticleUrl,
  getCategoryUrl,
  getSavedUrl,
  getNewsletterUrl,
  getBrandingUrl,
  parseCurrentRoute,
} from './utils/routes';

const CATEGORIES: CategoryType[] = ['All', 'Wellness', 'Health', 'Skincare', 'Finance', 'Startups'];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [visualMode, setVisualMode] = useState<'photo' | 'graphic'>('photo');
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  const [brandName, setBrandName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('bloom_brand_name');
      if (saved && saved !== 'Bloom and Ledger' && saved !== 'Well & Vested') {
        return saved;
      }
      return 'Slay & Scale';
    } catch {
      return 'Slay & Scale';
    }
  });

  const handleSelectBrand = (newBrand: string) => {
    setBrandName(newBrand);
    try {
      localStorage.setItem('bloom_brand_name', newBrand);
      document.title = `${newBrand} — Wellness, Health, Skincare, Finance & Startups`;
    } catch {
      // storage unavailable
    }
  };

  // 1. UNIQUE URL ROUTING SYNCHRONIZATION
  useEffect(() => {
    const handleRouteSync = () => {
      const parsed = parseCurrentRoute(window.location.pathname, window.location.search);

      // Category route
      setSelectedCategory(parsed.category);

      // Article route: /articles/:id
      if (parsed.articleId) {
        const found = ARTICLES_DATA.find((a) => a.id === parsed.articleId);
        if (found) {
          setActiveArticle(found);
          document.title = `${found.title} — ${brandName}`;
        } else {
          setActiveArticle(null);
        }
      } else {
        setActiveArticle(null);
        if (parsed.category === 'All') {
          document.title = `${brandName} — Wellness, Health, Skincare, Finance & Startups`;
        } else {
          document.title = `${parsed.category} Articles — ${brandName}`;
        }
      }

      // Modals
      setIsSavedOpen(parsed.isSavedOpen);
      setIsNewsletterOpen(parsed.isNewsletterOpen);
      setIsBrandModalOpen(parsed.isBrandModalOpen);
    };

    handleRouteSync();
    window.addEventListener('popstate', handleRouteSync);
    return () => window.removeEventListener('popstate', handleRouteSync);
  }, [brandName]);

  // Navigate helper
  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // Bookmark persistence in localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bloom_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bloom_bookmarks', JSON.stringify(bookmarkedIds));
    } catch {
      // storage unavailable
    }
  }, [bookmarkedIds]);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return ARTICLES_DATA.filter((art) => {
      const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.fullContent.introduction.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  // Lead featured article
  const featuredArticle = useMemo(() => {
    if (selectedCategory === 'All' && !searchQuery.trim()) {
      return ARTICLES_DATA.find((a) => a.featured) || ARTICLES_DATA[0];
    }
    return null;
  }, [selectedCategory, searchQuery]);

  // Remaining articles for grid
  const gridArticles = useMemo(() => {
    if (featuredArticle) {
      return filteredArticles.filter((a) => a.id !== featuredArticle.id);
    }
    return filteredArticles;
  }, [filteredArticles, featuredArticle]);

  const savedArticles = useMemo(() => {
    return ARTICLES_DATA.filter((a) => bookmarkedIds.includes(a.id));
  }, [bookmarkedIds]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-[#F7E7EC] selection:text-[#8B2547]">
      {/* 1. TOP BAR: Brand with Anchor Text, Clean Nav, Actions */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark with Anchor Text */}
          <div className="flex items-center gap-1.5 shrink-0">
            <AppLink
              to="/"
              onClick={() => {
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left font-serif text-2xl font-bold tracking-tight text-[#8B2547] hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <span>{brandName}</span>
              <span className="sr-only">Home page</span>
            </AppLink>
            <AppLink
              to={getBrandingUrl()}
              className="p-1 rounded-lg text-stone-400 hover:text-[#8B2547] hover:bg-stone-100 transition-colors inline-flex items-center"
              title="Customize publication name"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8B2547]" aria-hidden="true" />
              <span className="sr-only">Open Branding Studio</span>
            </AppLink>
          </div>

          {/* Zone 2: Navigation Categories with Anchor Text */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
            {CATEGORIES.slice(1).map((cat) => (
              <AppLink
                key={cat}
                to={getCategoryUrl(cat)}
                onClick={() => setSearchQuery('')}
                className={`transition-colors whitespace-nowrap hover:text-stone-900 ${
                  selectedCategory === cat ? 'text-[#8B2547] font-semibold border-b-2 border-[#8B2547] pb-0.5' : ''
                }`}
              >
                <span>{cat}</span>
              </AppLink>
            ))}
          </nav>

          {/* Zone 3: Primary Utility Actions with Anchor Text */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Personalized Reader Profile */}
            <div className="flex items-center gap-2 pl-2 pr-3 py-1 bg-stone-100/90 rounded-full border border-stone-200/90 text-xs text-stone-700">
              <span className="w-5 h-5 rounded-full bg-[#8B2547] text-white flex items-center justify-center font-bold text-[10px]">
                J
              </span>
              <span className="font-medium hidden sm:inline text-stone-900">Jadoreshrey</span>
            </div>

            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-xl border transition-colors ${
                isSearchOpen
                  ? 'bg-stone-200/80 border-stone-300 text-stone-900'
                  : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300'
              }`}
              title="Search articles"
              aria-label="Search articles"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Saved Articles Clean URL with Anchor Text */}
            <AppLink
              to={getSavedUrl()}
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300 transition-colors relative inline-flex items-center"
              title="View saved articles"
            >
              <Bookmark className={`w-4 h-4 ${bookmarkedIds.length > 0 ? 'text-[#8B2547] fill-current' : ''}`} aria-hidden="true" />
              {bookmarkedIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#8B2547] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                  {bookmarkedIds.length}
                </span>
              )}
              <span className="sr-only">Saved reading list ({bookmarkedIds.length})</span>
            </AppLink>

            {/* Sunday Dispatch CTA with Anchor Text */}
            <AppLink
              to={getNewsletterUrl()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#8B2547] rounded-xl hover:bg-[#721c37] transition-colors whitespace-nowrap shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Newsletter</span>
            </AppLink>
          </div>
        </div>
      </header>

      {/* SEARCH BAR DRAWER */}
      {isSearchOpen && (
        <div className="bg-[#F4ECE1] border-b border-stone-200/80 px-4 sm:px-8 py-3 animate-fade-in">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Search across wellness, skincare, finance and startups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-transparent border-none text-stone-900 text-sm focus:outline-none placeholder-stone-500 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-stone-400 hover:text-stone-700"
                aria-label="Clear search input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Category Pill Filters & Visual Style Switcher with Anchor Text */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <AppLink
                  key={cat}
                  to={getCategoryUrl(cat)}
                  onClick={() => setSearchQuery('')}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'border border-stone-900 text-stone-900 font-medium bg-transparent shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900 bg-transparent'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="sr-only">category articles</span>
                </AppLink>
              );
            })}
          </div>

          {/* Visual Mode Selector (Editorial Photos vs Vector Graphics) */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-full border border-stone-200/80 text-xs shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setVisualMode('photo')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                visualMode === 'photo'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Editorial Photos
            </button>
            <button
              onClick={() => setVisualMode('graphic')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                visualMode === 'graphic'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Minimalist Art
            </button>
          </div>
        </div>

        {/* HERO EDITORIAL HEADLINE */}
        <div className="mt-8 mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7E7EC] text-[#8B2547] text-xs font-medium mb-3">
            <span>Curated by Jadoreshrey</span>
            <span>·</span>
            <span>Sunday Edition</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-[3.25rem] font-bold text-stone-900 tracking-tight leading-[1.15] text-balance">
            Feel well. Look after your skin.
            <br />
            Grow your money and your ideas.
          </h1>
          <p className="font-serif text-base sm:text-lg text-stone-600 mt-4 leading-relaxed font-normal">
            Practical, friendly reads on women's wellness, health, skincare, finance and startups.
          </p>
        </div>

        {/* Search Results feedback banner if searching */}
        {searchQuery.trim() && (
          <div className="mb-6 p-4 bg-white rounded-2xl border border-stone-200 flex items-center justify-between text-xs text-stone-600">
            <div>
              Showing {filteredArticles.length} result{filteredArticles.length === 1 ? '' : 's'} for{' '}
              <strong className="text-stone-900">"{searchQuery}"</strong>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#8B2547] hover:underline font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* FEATURED LEAD ARTICLE with Unique URL & Anchor Text */}
        {featuredArticle && (
          <div className="group mb-8 bg-white border border-stone-200/90 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 grid grid-cols-1 md:grid-cols-2">
            {/* Left Graphic / Photo */}
            <AppLink
              to={getArticleUrl(featuredArticle.id)}
              className="h-64 md:h-auto min-h-[260px] relative overflow-hidden bg-stone-100 block"
            >
              <ArticleIllustration
                visualType={featuredArticle.visualType}
                imageUrl={featuredArticle.imageUrl}
                alt={featuredArticle.title}
                forceGraphic={visualMode === 'graphic'}
              />
              <span className="sr-only">View banner for {featuredArticle.title}</span>
            </AppLink>

            {/* Right Content with Anchor Text */}
            <div className="p-6 sm:p-10 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <AppLink
                  to={getCategoryUrl(featuredArticle.category)}
                  className="text-xs font-semibold uppercase tracking-wider text-[#5B7959] hover:underline"
                >
                  <span>{featuredArticle.category}</span>
                </AppLink>
                <button
                  onClick={(e) => toggleBookmark(featuredArticle.id, e)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#8B2547] transition-colors"
                  title="Bookmark"
                  aria-label={`Bookmark ${featuredArticle.title}`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      bookmarkedIds.includes(featuredArticle.id) ? 'text-[#8B2547] fill-current' : ''
                    }`}
                  />
                </button>
              </div>

              <h2 className="mt-3 leading-snug">
                <AppLink
                  to={getArticleUrl(featuredArticle.id)}
                  className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 group-hover:text-[#8B2547] transition-colors block"
                >
                  <span>{featuredArticle.title}</span>
                </AppLink>
              </h2>

              <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
                {featuredArticle.excerpt}
              </p>

              <div className="mt-6 flex items-center gap-3 text-xs text-stone-400 font-mono">
                <span>{featuredArticle.readTime}</span>
                <span>·</span>
                <AppLink
                  to={getArticleUrl(featuredArticle.id)}
                  className="text-[#8B2547] font-sans font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  <span>Read full story: {featuredArticle.title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </AppLink>
              </div>
            </div>
          </div>
        )}

        {/* 2-COLUMN ARTICLE GRID with Semantic AppLinks & Anchor Text */}
        {gridArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 my-8">
            <SlidersHorizontal className="w-8 h-8 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-semibold text-stone-800">No articles found</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              We couldn't find any articles matching your selection. Try clearing your search or switching categories.
            </p>
            <AppLink
              to="/"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="inline-block mt-4 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-medium hover:bg-stone-800 transition-colors"
            >
              <span>Reset Filters</span>
            </AppLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {gridArticles.map((article) => {
              const categoryColorClass = {
                Wellness: 'text-[#5B7959]',
                Health: 'text-[#D25372]',
                Skincare: 'text-[#8E68B8]',
                Finance: 'text-[#3D7D6A]',
                Startups: 'text-[#5A56A8]',
              }[article.category];

              const isBookmarked = bookmarkedIds.includes(article.id);

              return (
                <article
                  key={article.id}
                  className="group bg-white border border-stone-200/90 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col relative"
                >
                  {/* Top Illustration / Photo Area Link with Anchor Text */}
                  <div className="h-60 sm:h-64 w-full relative overflow-hidden bg-stone-100">
                    <AppLink
                      to={getArticleUrl(article.id)}
                      className="w-full h-full block"
                    >
                      <ArticleIllustration
                        visualType={article.visualType}
                        imageUrl={article.imageUrl}
                        alt={article.title}
                        forceGraphic={visualMode === 'graphic'}
                      />
                      <span className="sr-only">Read article: {article.title}</span>
                    </AppLink>
                    <button
                      onClick={(e) => toggleBookmark(article.id, e)}
                      className="absolute top-4 right-4 p-2 rounded-xl bg-white/80 backdrop-blur-xs border border-white/80 text-stone-600 hover:text-[#8B2547] shadow-xs transition-colors z-10"
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
                      aria-label={`Bookmark ${article.title}`}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'text-[#8B2547] fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Bottom Text Content with Anchor Text */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      <AppLink
                        to={getCategoryUrl(article.category)}
                        className={`text-xs font-semibold uppercase tracking-wider ${categoryColorClass} hover:underline inline-block`}
                      >
                        <span>{article.category}</span>
                      </AppLink>

                      <h3 className="mt-2 leading-snug">
                        <AppLink
                          to={getArticleUrl(article.id)}
                          className="font-serif text-xl sm:text-2xl font-semibold text-stone-900 group-hover:text-[#8B2547] transition-colors block"
                        >
                          <span>{article.title}</span>
                        </AppLink>
                      </h3>

                      <p className="text-stone-600 text-xs sm:text-sm mt-2.5 leading-relaxed font-sans">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-400 font-mono">{article.readTime}</span>
                      <AppLink
                        to={getArticleUrl(article.id)}
                        className="text-[#8B2547] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        <span>Read article: {article.title}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </AppLink>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* CURATED READING PATHWAYS (INTERNAL LINKS HUB) WITH ANCHOR TEXT */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-white border border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-stone-100">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8B2547]">Connected Pathways</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
                Curated Reading Sequences
              </h3>
            </div>
            <p className="text-xs text-stone-500 max-w-xs">
              Follow these internal guide sequences to build holistic habits step by step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            {/* Pathway 1 */}
            <div className="p-4 bg-[#FBF9F6] rounded-2xl border border-stone-200/80 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#5B7959]">
                  01 · Morning Vitality Loop
                </div>
                <h4 className="font-serif text-sm font-semibold text-stone-900 mt-1">
                  Start your day with calm energy
                </h4>
                <div className="space-y-1.5 mt-3">
                  <AppLink
                    to={getArticleUrl('morning-reset')}
                    className="w-full text-left p-2 rounded-xl bg-white border border-stone-200/80 hover:border-[#8B2547] text-xs font-medium text-stone-800 hover:text-[#8B2547] transition-all flex items-center justify-between group"
                  >
                    <span className="truncate">1. Morning Reset (5 Min)</span>
                    <ArrowUpRight className="w-3 h-3 text-stone-400 group-hover:text-[#8B2547] shrink-0" aria-hidden="true" />
                    <span className="sr-only">Read step 1: Morning Reset</span>
                  </AppLink>
                  <AppLink
                    to={getArticleUrl('simple-skincare-routine')}
                    className="w-full text-left p-2 rounded-xl bg-white border border-stone-200/80 hover:border-[#8B2547] text-xs font-medium text-stone-800 hover:text-[#8B2547] transition-all flex items-center justify-between group"
                  >
                    <span className="truncate">2. 4-Step Skincare</span>
                    <ArrowUpRight className="w-3 h-3 text-stone-400 group-hover:text-[#8B2547] shrink-0" aria-hidden="true" />
                    <span className="sr-only">Read step 2: 4-Step Skincare</span>
                  </AppLink>
                  <AppLink
                    to={getArticleUrl('sunscreen-myths')}
                    className="w-full text-left p-2 rounded-xl bg-white border border-stone-200/80 hover:border-[#8B2547] text-xs font-medium text-stone-800 hover:text-[#8B2547] transition-all flex items-center justify-between group"
                  >
                    <span className="truncate">3. Sunscreen Truths</span>
                    <ArrowUpRight className="w-3 h-3 text-stone-400 group-hover:text-[#8B2547] shrink-0" aria-hidden="true" />
                    <span className="sr-only">Read step 3: Sunscreen Truths</span>
                  </AppLink>
                </div>
              </div>
            </div>

            {/* Pathway 2 */}
            <div className="p-4 bg-[#FBF9F6] rounded-2xl border border-stone-200/80 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#D25372]">
                  02 · Hormone & Sleep Flow
                </div>
                <h4 className="font-serif text-sm font-semibold text-stone-900 mt-1">
                  Rebalance tired hormonal cycles
                </h4>
                <div className="space-y-1.5 mt-3">
                  <AppLink
                    to={getArticleUrl('sleep-night-routine')}
                    className="w-full text-left p-2 rounded-xl bg-white border border-stone-200/80 hover:border-[#8B2547] text-xs font-medium text-stone-800 hover:text-[#8B2547] transition-all flex items-center justify-between group"
                  >
                    <span className="truncate">1. Build a Night Routine</span>
                    <ArrowUpRight className="w-3 h-3 text-stone-400 group-hover:text-[#8B2547] shrink-0" aria-hidden="true" />
                    <span className="sr-only">Read step 1: Night Routine</span>
                  </AppLink>
                  <AppLink
                    to={getArticleUrl('know-your-cycle')}
                    className="w-full text-left p-2 rounded-xl bg-white border border-stone-200/80 hover:border-[#8B2547] text-xs font-medium text-stone-800 hover:text-[#8B2547] transition-all flex items-center justify-between group"
                  >
                    <span className="truncate">2. Know Your 4 Phases</span>
                    <ArrowUpRight className="w-3 h-3 text-stone-400 group-hover:text-[#8B2547] shrink-0" aria-hidden="true" />
                    <span className="sr-only">Read step 2: 4 Phases of your cycle</span>
                  </AppLink>
                  <AppLink
                    to={getArticleUrl('blood-checks-iron-b12')}
                    className="w-full text-left p-2 rounded-xl bg-white border border-stone-200/80 hover:border-[#8B2547] text-xs font-medium text-stone-800 hover:text-[#8B2547] transition-all flex items-center justify-between group"
                  >
                    <span className="truncate">3. Essential Lab Checks</span>
                    <ArrowUpRight className="w-3 h-3 text-stone-400 group-hover:text-[#8B2547] shrink-0" aria-hidden="true" />
                    <span className="sr-only">Read step 3: Lab Checks</span>
                  </AppLink>
                </div>
              </div>
            </div>

            {/* Pathway 3 */}
            <div className="p-4 bg-[#FBF9F6] rounded-2xl border border-stone-200/80 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#3D7D6A]">
                  03 · Wealth & Founder Runway
                </div>
                <h4 className="font-serif text-sm font-semibold text-stone-900 mt-1">
                  Budget, invest & bootstrap
                </h4>
                <div className="space-y-1.5 mt-3">
                  <AppLink
                    to={getArticleUrl('the-50-30-20-rule')}
                    className="w-full text-left p-2 rounded-xl bg-white border border-stone-200/80 hover:border-[#8B2547] text-xs font-medium text-stone-800 hover:text-[#8B2547] transition-all flex items-center justify-between group"
                  >
                    <span className="truncate">1. 50/30/20 Rule for Life</span>
                    <ArrowUpRight className="w-3 h-3 text-stone-400 group-hover:text-[#8B2547] shrink-0" aria-hidden="true" />
                    <span className="sr-only">Read step 1: 50 30 20 Rule</span>
                  </AppLink>
                  <AppLink
                    to={getArticleUrl('start-investing-sips')}
                    className="w-full text-left p-2 rounded-xl bg-white border border-stone-200/80 hover:border-[#8B2547] text-xs font-medium text-stone-800 hover:text-[#8B2547] transition-all flex items-center justify-between group"
                  >
                    <span className="truncate">2. SIP Compound Guide</span>
                    <ArrowUpRight className="w-3 h-3 text-stone-400 group-hover:text-[#8B2547] shrink-0" aria-hidden="true" />
                    <span className="sr-only">Read step 2: SIP Investing Guide</span>
                  </AppLink>
                  <AppLink
                    to={getArticleUrl('funding-startup-control')}
                    className="w-full text-left p-2 rounded-xl bg-white border border-stone-200/80 hover:border-[#8B2547] text-xs font-medium text-stone-800 hover:text-[#8B2547] transition-all flex items-center justify-between group"
                  >
                    <span className="truncate">3. Non-Dilutive Funding</span>
                    <ArrowUpRight className="w-3 h-3 text-stone-400 group-hover:text-[#8B2547] shrink-0" aria-hidden="true" />
                    <span className="sr-only">Read step 3: Funding your startup</span>
                  </AppLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SUNDAY EDITION SIGNUP BANNER WITH ANCHOR TEXT */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-[#F6F1EB] border border-[#E9E2D8] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#8B2547]">Sunday Morning Edition</span>
            <h3 className="font-serif text-2xl font-semibold text-stone-900 mt-1">
              Thoughtful reads delivered gently.
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
              No daily noise. Just one tested habit, one health insight, and one practical financial note in your inbox each week.
            </p>
          </div>
          <AppLink
            to={getNewsletterUrl()}
            className="w-full sm:w-auto px-6 py-3 bg-[#8B2547] text-white rounded-2xl text-xs sm:text-sm font-semibold hover:bg-[#721c37] transition-colors whitespace-nowrap shadow-xs text-center inline-block"
          >
            <span>Subscribe to Sunday Letter</span>
          </AppLink>
        </div>
      </main>

      {/* FOOTER with Clean Semantic Links & Anchor Text */}
      <footer className="border-t border-stone-200/80 bg-[#FAF8F5] mt-16 py-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-4xl">
            {brandName} shares general information for learning. It is not medical or financial advice. Talk to a
            doctor, dermatologist or licensed advisor for decisions about you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <AppLink to="/" className="font-serif font-semibold text-stone-700 hover:text-[#8B2547]">
                <span>{brandName}</span>
              </AppLink>
              <span>·</span>
              <span>Curated by Jadoreshrey</span>
              <span>·</span>
              <span>© {new Date().getFullYear()}</span>
            </div>

            <div className="flex items-center gap-6">
              <AppLink
                to={getCategoryUrl('Wellness')}
                className="hover:text-stone-700 transition-colors"
              >
                <span>Wellness</span>
              </AppLink>
              <AppLink
                to={getCategoryUrl('Health')}
                className="hover:text-stone-700 transition-colors"
              >
                <span>Health</span>
              </AppLink>
              <AppLink
                to={getCategoryUrl('Skincare')}
                className="hover:text-stone-700 transition-colors"
              >
                <span>Skincare</span>
              </AppLink>
              <AppLink
                to={getCategoryUrl('Finance')}
                className="hover:text-stone-700 transition-colors"
              >
                <span>Finance</span>
              </AppLink>
              <AppLink
                to={getCategoryUrl('Startups')}
                className="hover:text-stone-700 transition-colors"
              >
                <span>Startups</span>
              </AppLink>
            </div>
          </div>
        </div>
      </footer>

      {/* ARTICLE READER MODAL (Unique clean URL /articles/:id) */}
      <ArticleModal
        article={activeArticle}
        onClose={() => navigateTo(selectedCategory === 'All' ? '/' : getCategoryUrl(selectedCategory))}
        onSelectArticle={(art) => navigateTo(getArticleUrl(art.id))}
        allArticles={ARTICLES_DATA}
        bookmarkedIds={bookmarkedIds}
        onToggleBookmark={(id) => toggleBookmark(id)}
      />

      {/* SAVED ARTICLES DRAWER (Unique clean URL /saved) */}
      <SavedArticlesModal
        isOpen={isSavedOpen}
        onClose={() => navigateTo(selectedCategory === 'All' ? '/' : getCategoryUrl(selectedCategory))}
        savedArticles={savedArticles}
        onSelectArticle={(art) => navigateTo(getArticleUrl(art.id))}
        onRemoveBookmark={(id) => toggleBookmark(id)}
      />

      {/* NEWSLETTER SUBSCRIBE MODAL (Unique clean URL /newsletter) */}
      <NewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() => navigateTo(selectedCategory === 'All' ? '/' : getCategoryUrl(selectedCategory))}
      />

      {/* BRAND SWITCHER STUDIO MODAL (Unique clean URL /branding) */}
      <BrandSwitcherModal
        isOpen={isBrandModalOpen}
        onClose={() => navigateTo(selectedCategory === 'All' ? '/' : getCategoryUrl(selectedCategory))}
        currentBrand={brandName}
        onSelectBrand={handleSelectBrand}
      />
    </div>
  );
}
