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
    // If filtering by "All" without search, pick the dedicated featured article
    if (selectedCategory === 'All' && !searchQuery.trim()) {
      return ARTICLES_DATA.find((a) => a.featured) || ARTICLES_DATA[0];
    }
    // If filtered, don't show separate hero card, render as uniform grid
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
      {/* 1. TOP BAR CONTRACT: Brand, Nav, Single Action */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark with branding switch affordance */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left font-serif text-2xl font-bold tracking-tight text-[#8B2547] hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              {brandName}
            </button>
            <button
              onClick={() => setIsBrandModalOpen(true)}
              className="p-1 rounded-lg text-stone-400 hover:text-[#8B2547] hover:bg-stone-100 transition-colors"
              title="Change publication name"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8B2547]" />
            </button>
          </div>

          {/* Zone 2: Navigation Categories */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
            {CATEGORIES.slice(1).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSearchQuery('');
                }}
                className={`transition-colors whitespace-nowrap hover:text-stone-900 ${
                  selectedCategory === cat ? 'text-[#8B2547] font-semibold' : ''
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Utility Actions */}
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

            {/* Saved Articles */}
            <button
              onClick={() => setIsSavedOpen(true)}
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300 transition-colors relative"
              title="View saved articles"
              aria-label="View saved articles"
            >
              <Bookmark className={`w-4 h-4 ${bookmarkedIds.length > 0 ? 'text-[#8B2547] fill-current' : ''}`} />
              {bookmarkedIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#8B2547] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                  {bookmarkedIds.length}
                </span>
              )}
            </button>

            {/* Sunday Dispatch CTA */}
            <button
              onClick={() => setIsNewsletterOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#8B2547] rounded-xl hover:bg-[#721c37] transition-colors whitespace-nowrap shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Newsletter</span>
            </button>
          </div>
        </div>

        {/* Collapsible Search Input */}
        {isSearchOpen && (
          <div className="max-w-6xl mx-auto pt-3 pb-1">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                autoFocus
                placeholder="Search across wellness, iron checks, 50/30/20 rule, skincare, SIPs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B2547] focus:ring-1 focus:ring-[#8B2547] shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Category Pill Filters & Visual Style Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'border border-stone-900 text-stone-900 font-medium bg-transparent shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900 bg-transparent'
                  }`}
                >
                  {cat}
                </button>
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

        {/* HERO EDITORIAL HEADLINE matching Screenshot */}
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

        {/* FEATURED LEAD ARTICLE (Horizontal Split) matching Screenshot */}
        {featuredArticle && (
          <div
            onClick={() => setActiveArticle(featuredArticle)}
            className="group mb-8 bg-white border border-stone-200/90 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer grid grid-cols-1 md:grid-cols-2"
          >
            {/* Left Graphic / Photo */}
            <div className="h-64 md:h-auto min-h-[260px] relative overflow-hidden bg-stone-100">
              <ArticleIllustration
                visualType={featuredArticle.visualType}
                imageUrl={featuredArticle.imageUrl}
                alt={featuredArticle.title}
                forceGraphic={visualMode === 'graphic'}
              />
            </div>

            {/* Right Content */}
            <div className="p-6 sm:p-10 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5B7959]">
                  {featuredArticle.category}
                </span>
                <button
                  onClick={(e) => toggleBookmark(featuredArticle.id, e)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#8B2547] transition-colors"
                  title="Bookmark"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      bookmarkedIds.includes(featuredArticle.id) ? 'text-[#8B2547] fill-current' : ''
                    }`}
                  />
                </button>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 group-hover:text-[#8B2547] transition-colors mt-3 leading-snug">
                {featuredArticle.title}
              </h2>

              <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
                {featuredArticle.excerpt}
              </p>

              <div className="mt-6 flex items-center gap-3 text-xs text-stone-400 font-mono">
                <span>{featuredArticle.readTime}</span>
                <span>·</span>
                <span className="text-[#8B2547] font-sans font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read article <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2-COLUMN ARTICLE GRID matching Screenshot */}
        {gridArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 my-8">
            <SlidersHorizontal className="w-8 h-8 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-semibold text-stone-800">No articles found</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              We couldn't find any articles matching your selection. Try clearing your search or switching categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-medium hover:bg-stone-800 transition-colors"
            >
              Reset Filters
            </button>
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
                  onClick={() => setActiveArticle(article)}
                  className="group bg-white border border-stone-200/90 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
                >
                  {/* Top Illustration / Photo Area */}
                  <div className="h-60 sm:h-64 w-full relative overflow-hidden bg-stone-100">
                    <ArticleIllustration
                      visualType={article.visualType}
                      imageUrl={article.imageUrl}
                      alt={article.title}
                      forceGraphic={visualMode === 'graphic'}
                    />
                    <button
                      onClick={(e) => toggleBookmark(article.id, e)}
                      className="absolute top-4 right-4 p-2 rounded-xl bg-white/80 backdrop-blur-xs border border-white/80 text-stone-600 hover:text-[#8B2547] shadow-xs transition-colors"
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'text-[#8B2547] fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Bottom Text Content */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      <div className={`text-xs font-semibold uppercase tracking-wider ${categoryColorClass}`}>
                        {article.category}
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900 group-hover:text-[#8B2547] transition-colors mt-2 leading-snug">
                        {article.title}
                      </h3>

                      <p className="text-stone-600 text-xs sm:text-sm mt-2.5 leading-relaxed font-sans">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-400 font-mono">{article.readTime}</span>
                      <span className="text-[#8B2547] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* SUNDAY EDITION SIGNUP BANNER */}
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
          <button
            onClick={() => setIsNewsletterOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-[#8B2547] text-white rounded-2xl text-xs sm:text-sm font-semibold hover:bg-[#721c37] transition-colors whitespace-nowrap shadow-xs"
          >
            Get the Sunday Letter
          </button>
        </div>
      </main>

      {/* FOOTER matching verbatim note in screenshot */}
      <footer className="border-t border-stone-200/80 bg-[#FAF8F5] mt-16 py-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Disclaimer verbatim from screenshot */}
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-4xl">
            {brandName} shares general information for learning. It is not medical or financial advice. Talk to a
            doctor, dermatologist or licensed advisor for decisions about you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <span className="font-serif font-semibold text-stone-700">{brandName}</span>
              <span>·</span>
              <span>Curated by Jadoreshrey</span>
              <span>·</span>
              <span>© {new Date().getFullYear()}</span>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => {
                  setSelectedCategory('Wellness');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-stone-700 transition-colors"
              >
                Wellness
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('Health');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-stone-700 transition-colors"
              >
                Health
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('Skincare');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-stone-700 transition-colors"
              >
                Skincare
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('Finance');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-stone-700 transition-colors"
              >
                Finance
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('Startups');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-stone-700 transition-colors"
              >
                Startups
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ARTICLE READER MODAL */}
      <ArticleModal
        article={activeArticle}
        onClose={() => setActiveArticle(null)}
        onSelectArticle={(art) => setActiveArticle(art)}
        allArticles={ARTICLES_DATA}
        bookmarkedIds={bookmarkedIds}
        onToggleBookmark={(id) => toggleBookmark(id)}
      />

      {/* SAVED ARTICLES DRAWER */}
      <SavedArticlesModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedArticles={savedArticles}
        onSelectArticle={(art) => setActiveArticle(art)}
        onRemoveBookmark={(id) => toggleBookmark(id)}
      />

      {/* NEWSLETTER SUBSCRIBE MODAL */}
      <NewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />

      {/* BRAND SWITCHER STUDIO MODAL */}
      <BrandSwitcherModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        currentBrand={brandName}
        onSelectBrand={handleSelectBrand}
      />
    </div>
  );
}
