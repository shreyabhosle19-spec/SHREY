import React from 'react';
import { Sparkles, ArrowRight, ArrowUpRight, Heart, Shield, TrendingUp, Sun, Flame, CheckCircle2 } from 'lucide-react';
import { Link } from './Link';
import { ARTICLES_DATA } from '../data/articles';

interface AboutViewProps {
  brandName: string;
}

export const AboutView: React.FC<AboutViewProps> = ({ brandName }) => {
  const recommendedGuides = ARTICLES_DATA.slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-12">
      {/* Breadcrumb with Anchor Tags */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-mono">
        <Link href="/" className="hover:text-[#8B2547] underline-offset-2 hover:underline">
          Home
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-medium">About & Masthead</span>
      </nav>

      {/* Hero Header */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7E7EC] text-[#8B2547] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated by Jadoreshrey · Editorial Masthead</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight leading-[1.15]">
          A quiet, high-signal journal for your body, mind, and balance sheet.
        </h1>
        <p className="font-serif text-lg text-stone-600 leading-relaxed max-w-2xl">
          {brandName} was created out of a simple observation: women’s health media is often patronizing, and financial media is needlessly combative. We bring both together under one calm, evidence-based roof.
        </p>
      </header>

      {/* Editor's Note */}
      <section className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#8B2547] text-white flex items-center justify-center font-serif font-bold text-lg shadow-xs">
            J
          </div>
          <div>
            <h2 className="font-serif text-lg font-semibold text-stone-900">Jadoreshrey</h2>
            <p className="text-xs text-stone-500 font-mono">Curator & Editorial Director</p>
          </div>
        </div>

        <div className="prose text-stone-700 leading-relaxed space-y-4 font-sans text-sm sm:text-base pt-2">
          <p>
            When we talk about wellness, we too often mean expensive spa weekends and 12-step morning routines that collapse by Wednesday. When we talk about money, we are inundated with crypto bro hustle culture and fear-mongering market panic.
          </p>
          <p>
            Here at <strong>{brandName}</strong>, we believe real wellness is pragmatic: it is knowing why your ferritin levels are low, honoring your hormonal cycle without self-blame, putting on SPF every morning, and investing your first $50 into an index fund on auto-pilot.
          </p>
          <p className="font-serif italic text-stone-800 text-base sm:text-lg border-l-2 border-[#8B2547] pl-4 my-4">
            "Slay your daily habits, and scale your personal runway. No fluff, no pseudo-science, just tested frameworks."
          </p>
        </div>
      </section>

      {/* The 5 Editorial Pillars with Anchor Tags */}
      <section className="space-y-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#8B2547]">Foundations</span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            Our Five Editorial Pillars
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Click any pillar to explore curated guides and interactive calculators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            href="/category/wellness"
            className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-[#5B7959] hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-[#EEF4EE] text-[#5B7959] flex items-center justify-center mb-3">
                <Sun className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-semibold text-stone-900 group-hover:text-[#5B7959] transition-colors">
                Wellness
              </h3>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                Nervous system regulation, restorative sleep rituals, and manageable 5-minute morning resets.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-[#5B7959] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Browse Wellness <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/category/health"
            className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-[#D25372] hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-[#FDF0F3] text-[#D25372] flex items-center justify-center mb-3">
                <Heart className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-semibold text-stone-900 group-hover:text-[#D25372] transition-colors">
                Health
              </h3>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                Female biological cycles, ferritin and iron metrics, and doctor discussion lab checklists.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-[#D25372] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Browse Health <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/category/skincare"
            className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-[#8E68B8] hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-[#F7F2FA] text-[#8E68B8] flex items-center justify-center mb-3">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-semibold text-stone-900 group-hover:text-[#8E68B8] transition-colors">
                Skincare
              </h3>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                Dermatology-grounded 4-step regimens, barrier restoration, and real sunscreen science.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-[#8E68B8] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Browse Skincare <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/category/finance"
            className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-[#3D7D6A] hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-[#EEF6F3] text-[#3D7D6A] flex items-center justify-center mb-3">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-semibold text-stone-900 group-hover:text-[#3D7D6A] transition-colors">
                Finance
              </h3>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                The 50/30/20 budget framework, systematic index fund SIPs, and automated compound interest.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-[#3D7D6A] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Browse Finance <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/category/startups"
            className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-[#5A56A8] hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-[#F2F1FA] text-[#5A56A8] flex items-center justify-center mb-3">
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-semibold text-stone-900 group-hover:text-[#5A56A8] transition-colors">
                Startups
              </h3>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                Bootstrapping, customer-funded growth, retaining equity, and launching lean direct brands.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-[#5A56A8] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Browse Startups <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/newsletter"
            className="p-5 bg-[#FAF3F5] rounded-2xl border border-[#F0D5DE] hover:border-[#8B2547] hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-[#F7E7EC] text-[#8B2547] flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-semibold text-[#8B2547]">
                Sunday Dispatch
              </h3>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                One practical habit, one health check, and one wealth principle in your inbox every Sunday.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-[#8B2547] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Join Newsletter <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* Suggested Starting Reads */}
      <section className="space-y-4 pt-6 border-t border-stone-200">
        <h3 className="font-serif text-xl font-bold text-stone-900">
          Recommended Starting Reads
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recommendedGuides.map((guide) => (
            <Link
              key={guide.id}
              href={`/article/${guide.id}`}
              className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-[#8B2547] hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B2547]">
                  {guide.category} · {guide.readTime}
                </span>
                <h4 className="font-serif text-sm font-semibold text-stone-900 group-hover:text-[#8B2547] transition-colors mt-0.5">
                  {guide.title}
                </h4>
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#8B2547] shrink-0" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
