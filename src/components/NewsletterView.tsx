import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Heart, Coffee, BookOpen } from 'lucide-react';
import { Link } from './Link';
import { ARTICLES_DATA } from '../data/articles';

interface NewsletterViewProps {
  brandName: string;
}

export const NewsletterView: React.FC<NewsletterViewProps> = ({ brandName }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubscribed(true);
      try {
        localStorage.setItem('bloom_newsletter_email', email);
      } catch {
        // storage unavailable
      }
    }
  };

  const sampleArticles = ARTICLES_DATA.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-12">
      {/* Breadcrumb with Anchor Tags */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-mono">
        <Link href="/" className="hover:text-[#8B2547] underline-offset-2 hover:underline">
          Home
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-medium">Sunday Dispatch</span>
      </nav>

      {/* Hero Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF3F5] border border-[#F0D5DE] space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7E7EC] text-[#8B2547] text-xs font-semibold">
          <Coffee className="w-3.5 h-3.5" />
          <span>Every Sunday Morning at 8:00 AM</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 leading-[1.15]">
          The Sunday Letter: Calm Wisdom for Ambitious Women
        </h1>

        <p className="font-serif text-lg text-stone-700 leading-relaxed max-w-2xl">
          No daily inbox churn. No sponsored affiliate spam. Just one evidence-backed habit, one vital health check, and one wealth principle curated by Jadoreshrey to start your week with clarity.
        </p>

        {isSubscribed ? (
          <div className="p-6 bg-white rounded-2xl border border-emerald-200 flex items-start gap-3 text-emerald-900 max-w-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <p className="font-semibold">You're on the list for this Sunday!</p>
              <p className="text-stone-600 text-xs">
                We've sent a gentle welcome note to <strong className="font-mono text-stone-800">{email}</strong>. While you wait, explore our foundation guides below.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 max-w-md pt-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="Enter your personal email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-stone-300 rounded-2xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B2547] focus:ring-1 focus:ring-[#8B2547] shadow-xs"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-[#8B2547] text-white rounded-2xl text-sm font-semibold hover:bg-[#721c37] transition-colors whitespace-nowrap shadow-xs cursor-pointer"
              >
                Join Free
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>Zero spam. Unsubscribe with 1-click anytime.</span>
            </div>
          </form>
        )}
      </div>

      {/* What You Get in Every Issue */}
      <section className="space-y-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#8B2547]">Editorial Anatomy</span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            What's inside each 4-minute read
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 bg-white rounded-3xl border border-stone-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#EEF4EE] text-[#5B7959] flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="font-serif font-semibold text-stone-900">The Tested Habit</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              A 5-minute nervous system reset, morning hydration routine, or night winddown you can actually stick to.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-stone-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#FDF0F3] text-[#D25372] flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="font-serif font-semibold text-stone-900">The Health / Lab Check</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              What bloodwork to request (ferritin, B12, vitamin D), cycle phase pacing, and sunscreen truths.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-stone-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#EEF6F3] text-[#3D7D6A] flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="font-serif font-semibold text-stone-900">The Wealth Principle</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              50/30/20 budgeting math, SIP compounding calculations, and bootstrapper equity wisdom.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Dispatches Grounded in Articles */}
      <section className="space-y-4 pt-4 border-t border-stone-200">
        <h3 className="font-serif text-xl font-bold text-stone-900">
          Featured Reading from Past Editions
        </h3>
        <div className="space-y-3">
          {sampleArticles.map((art) => (
            <Link
              key={art.id}
              href={`/article/${art.id}`}
              className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-[#8B2547] hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B2547]">
                  {art.category} · {art.readTime}
                </span>
                <h4 className="font-serif text-base font-semibold text-stone-900 group-hover:text-[#8B2547] transition-colors mt-0.5">
                  {art.title}
                </h4>
                <p className="text-xs text-stone-500 mt-1 line-clamp-1">{art.excerpt}</p>
              </div>
              <span className="text-xs font-semibold text-[#8B2547] flex items-center gap-1 shrink-0 group-hover:translate-x-1 transition-transform">
                Read guide <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
