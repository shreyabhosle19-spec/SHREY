import React, { useState } from 'react';
import { X, Sparkles, Check, Edit3 } from 'lucide-react';

export interface BrandOption {
  name: string;
  tag: string;
  pitch: string;
  subhead: string;
}

export const BRAND_PRESETS: BrandOption[] = [
  {
    name: 'Slay & Scale',
    tag: 'Your Choice',
    pitch: 'Empowering, modern, and iconic alliteration. "Slay" your skincare, daily health, and morning rituals — and "Scale" your wealth, portfolio, and startups.',
    subhead: 'Feel well. Look after your skin. Grow your money and your ideas.',
  },
  {
    name: 'Well & Vested',
    tag: 'Classic',
    pitch: 'A witty, dual-meaning pun: "Well" for health & skin wellness, and "Vested" for equity, financial growth & self-investment.',
    subhead: 'Feel well. Look after your skin. Grow your money and your ideas.',
  },
  {
    name: 'Aura & Asset',
    tag: 'Luxury',
    pitch: 'Harmonizes inner radiance and skincare energy ("Aura") with high-value financial & startup milestones ("Asset").',
    subhead: 'Radiant energy for your body. Compounding returns for your life.',
  },
  {
    name: 'Glow & Capital',
    tag: 'Bold & Punchy',
    pitch: 'Crisp, high-contrast editorial identity pairing dermatologist-backed skincare with modern wealth mastery.',
    subhead: 'Skin clarity. Mental balance. Unapologetic capital growth.',
  },
  {
    name: 'Silk & Scale',
    tag: 'Chic Modern',
    pitch: 'Evokes soothing daily wellness routines ("Silk") alongside fearless founder growth ("Scale").',
    subhead: 'Gentle on your everyday rhythm. Ambitious with your vision.',
  },
  {
    name: 'Dew & Dividends',
    tag: 'Catchy & Fresh',
    pitch: 'Playful, memorable, and cheerful: morning skincare hydration coupled with compounding investments.',
    subhead: 'Fresh daily habits and compounding wealth for ambitious women.',
  },
];

interface BrandSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBrand: string;
  onSelectBrand: (brand: string) => void;
}

export const BrandSwitcherModal: React.FC<BrandSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentBrand,
  onSelectBrand,
}) => {
  const [customInput, setCustomInput] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSelectBrand(customInput.trim());
      setCustomInput('');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FAF8F5] rounded-3xl border border-stone-200 shadow-2xl p-6 sm:p-7 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
          aria-label="Close publication branding studio"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#8B2547] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Publication Branding Studio
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
          Catchy Name Ideas
        </h3>
        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
          Select one of our curated catchy names or type your own custom title for the blog.
        </p>

        {/* Brand Options List */}
        <div className="mt-5 space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
          {BRAND_PRESETS.map((item) => {
            const isSelected = currentBrand === item.name;
            return (
              <div
                key={item.name}
                onClick={() => {
                  onSelectBrand(item.name);
                  onClose();
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white border-[#8B2547] shadow-sm ring-1 ring-[#8B2547]'
                    : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-serif text-lg font-bold text-[#8B2547]">
                      {item.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F7E7EC] text-[#8B2547] text-[10px] font-semibold">
                      {item.tag}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#8B2547] text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  {item.pitch}
                </p>
              </div>
            );
          })}
        </div>

        {/* Custom Input */}
        <form onSubmit={handleCustomSubmit} className="mt-4 pt-4 border-t border-stone-200 flex gap-2">
          <input
            type="text"
            placeholder="Type your own custom name..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="flex-1 px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#8B2547] focus:ring-1 focus:ring-[#8B2547]"
          />
          <button
            type="submit"
            disabled={!customInput.trim()}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 disabled:opacity-50 transition-colors"
          >
            Apply
          </button>
        </form>
      </div>
    </div>
  );
};
