import React, { useState } from 'react';
import { X, Mail, CheckCircle2, Heart } from 'lucide-react';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('weekly');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        // keep open for brief appreciation then reset
      }, 3000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FAF8F5] rounded-3xl border border-stone-200 shadow-2xl p-6 sm:p-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
          aria-label="Close newsletter modal"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-stone-900">Welcome to Sunday Mornings</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed max-w-xs mx-auto">
              We’ve added <strong>{email}</strong> to our Sunday dispatch. Look for a thoughtful cup of ideas in your inbox this weekend.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-5 py-2.5 bg-[#8B2547] text-white rounded-xl text-xs font-medium hover:bg-[#701a35] transition-colors"
            >
              Back to Reading
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8B2547] uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-current" /> Sunday Dispatch
            </div>
            <h3 className="font-serif text-2xl font-semibold text-stone-900 mt-1">
              Quiet reads for busy minds.
            </h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Every Sunday morning, we send one actionable health framework, one skin principle, and one clear money strategy. No spam, ever.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#8B2547] focus:ring-1 focus:ring-[#8B2547]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setFrequency('weekly')}
                  className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                    frequency === 'weekly'
                      ? 'border-[#8B2547] bg-[#F7E7EC] text-[#8B2547] font-medium'
                      : 'border-stone-200 bg-white text-stone-600'
                  }`}
                >
                  Weekly Sunday Read
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency('monthly')}
                  className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                    frequency === 'monthly'
                      ? 'border-[#8B2547] bg-[#F7E7EC] text-[#8B2547] font-medium'
                      : 'border-stone-200 bg-white text-stone-600'
                  }`}
                >
                  Monthly Digest Only
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#8B2547] text-white rounded-xl text-xs font-semibold hover:bg-[#721c37] transition-colors mt-2"
              >
                Join 18,000+ Readers
              </button>

              <div className="text-[10px] text-stone-400 text-center pt-1">
                Zero sponsored junk. Unsubscribe in one click whenever you like.
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
