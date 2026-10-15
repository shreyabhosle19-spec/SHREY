import React, { useState } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, DollarSign, Sparkles, TrendingUp, Heart, Shield, Check } from 'lucide-react';

// 1. Five Minute Morning Reset Tool
export const MorningResetTool: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  const steps = [
    { title: 'Hydrate & Minerals', duration: 60, desc: 'Drink a large glass of room-temp water with a tiny pinch of sea salt or lemon to rehydrate cell walls before caffeine.' },
    { title: 'Light & Fresh Air', duration: 90, desc: 'Open a window or step outside to get natural light in your eyes. This sets your circadian clock for bedtime 16 hours from now.' },
    { title: 'Gentle Spinal Reset', duration: 90, desc: '3 slow shoulder rolls, 3 cat-cow spine releases, and unclench your jaw. Signal safety to your nervous system.' },
    { title: 'One True Priority', duration: 60, desc: 'Name the ONE thing that, if finished today, makes the day a win. Leave everything else for later.' },
  ];

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
      if (activeStep < steps.length - 1) {
        setActiveStep((prev) => prev + 1);
        setSecondsLeft(steps[activeStep + 1].duration);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, activeStep]);

  const selectStep = (index: number) => {
    setActiveStep(index);
    setSecondsLeft(steps[index].duration);
    setIsRunning(false);
  };

  const resetAll = () => {
    setActiveStep(0);
    setSecondsLeft(steps[0].duration);
    setIsRunning(false);
  };

  return (
    <div className="my-8 p-6 bg-stone-50 border border-stone-200 rounded-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#8B2547] font-semibold">Interactive Practice</span>
          <h4 className="font-serif text-lg font-semibold text-stone-900 mt-0.5">5-Minute Morning Reset Timer</h4>
        </div>
        <button
          onClick={resetAll}
          className="p-2 text-stone-500 hover:text-stone-800 transition-colors rounded-lg hover:bg-stone-200/50"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
        {steps.map((s, idx) => (
          <button
            key={s.title}
            onClick={() => selectStep(idx)}
            className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
              activeStep === idx
                ? 'border-[#8B2547] bg-[#F7E7EC] text-[#6C1935] font-medium'
                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
            }`}
          >
            <div className="text-[10px] text-stone-400 font-mono">0{idx + 1}</div>
            <div className="truncate mt-0.5">{s.title}</div>
          </button>
        ))}
      </div>

      <div className="bg-white p-5 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <div className="text-sm font-semibold text-stone-900">{steps[activeStep].title}</div>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">{steps[activeStep].desc}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="font-mono text-2xl font-semibold text-stone-900 w-16 text-center tabular-nums">
            {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
          </div>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#8B2547] text-white rounded-xl text-xs font-medium hover:bg-[#721c37] transition-colors"
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Begin
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. 50/30/20 Budget Calculator Tool
export const BudgetCalculatorTool: React.FC = () => {
  const [income, setIncome] = useState<number>(4000);
  const [cityAdjustment, setCityAdjustment] = useState<boolean>(false);

  const needsRatio = cityAdjustment ? 0.6 : 0.5;
  const wantsRatio = cityAdjustment ? 0.2 : 0.3;
  const savingsRatio = 0.2;

  const needs = Math.round(income * needsRatio);
  const wants = Math.round(income * wantsRatio);
  const savings = Math.round(income * savingsRatio);

  return (
    <div className="my-8 p-6 bg-[#FAF8F5] border border-stone-200 rounded-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#3D7D6A] font-semibold">Interactive Tool</span>
          <h4 className="font-serif text-lg font-semibold text-stone-900 mt-0.5">50 / 30 / 20 Budget Simulator</h4>
        </div>
        <div className="text-xs text-stone-500 font-mono">Monthly Breakdown</div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <div className="flex justify-between text-xs text-stone-600 mb-1.5">
            <span>Monthly Take-Home Income:</span>
            <span className="font-semibold text-stone-900 font-mono text-sm">${income.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="15000"
            step="100"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full accent-[#3D7D6A] cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-200 text-xs">
          <div>
            <span className="font-medium text-stone-900">High-Rent City Adjustment (60/20/20)</span>
            <p className="text-stone-500 text-[11px] mt-0.5">Increases Needs to 60% and lowers Wants to 20%</p>
          </div>
          <button
            onClick={() => setCityAdjustment(!cityAdjustment)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              cityAdjustment ? 'bg-[#3D7D6A] text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {cityAdjustment ? 'Active' : 'Off'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 bg-white rounded-xl border border-stone-200">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Needs ({Math.round(needsRatio * 100)}%)
            </div>
            <div className="text-xl font-bold text-stone-900 font-mono mt-1 tabular-nums">${needs.toLocaleString()}</div>
            <div className="text-[11px] text-stone-500 mt-1">Rent, groceries, utilities, transit, minimum debt</div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-stone-200">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Wants ({Math.round(wantsRatio * 100)}%)
            </div>
            <div className="text-xl font-bold text-stone-900 font-mono mt-1 tabular-nums">${wants.toLocaleString()}</div>
            <div className="text-[11px] text-stone-500 mt-1">Dining out, coffee, subscriptions, hobbies, travel</div>
          </div>

          <div className="p-4 bg-[#EAF2ED] rounded-xl border border-[#C6DDD1]">
            <div className="text-[11px] font-semibold text-[#3D7D6A] uppercase tracking-wider">
              Savings ({Math.round(savingsRatio * 100)}%)
            </div>
            <div className="text-xl font-bold text-[#235848] font-mono mt-1 tabular-nums">${savings.toLocaleString()}</div>
            <div className="text-[11px] text-stone-600 mt-1">Emergency fund, index funds, SIPs, retirement</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. SIP Compound Calculator Tool
export const SipCalculatorTool: React.FC = () => {
  const [monthly, setMonthly] = useState<number>(250);
  const [years, setYears] = useState<number>(10);
  const [annualRate, setAnnualRate] = useState<number>(11);

  // Future value of SIP formula: P * [((1 + i)^n - 1) / i] * (1 + i)
  const i = annualRate / 100 / 12;
  const n = years * 12;
  const futureValue = Math.round(monthly * (((Math.pow(1 + i, n) - 1) / i) * (1 + i)));
  const totalInvested = monthly * n;
  const wealthGain = futureValue - totalInvested;

  return (
    <div className="my-8 p-6 bg-stone-50 border border-stone-200 rounded-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#3D7D6A] font-semibold">Wealth Calculator</span>
          <h4 className="font-serif text-lg font-semibold text-stone-900 mt-0.5">SIP Compound Growth Simulator</h4>
        </div>
        <TrendingUp className="w-5 h-5 text-[#3D7D6A]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-stone-600 mb-1">
              <span>Monthly Investment:</span>
              <span className="font-semibold text-stone-900 font-mono">${monthly}/month</span>
            </div>
            <input
              type="range"
              min="25"
              max="2000"
              step="25"
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              className="w-full accent-[#3D7D6A] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-stone-600 mb-1">
              <span>Time Horizon:</span>
              <span className="font-semibold text-stone-900 font-mono">{years} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-[#3D7D6A] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-stone-600 mb-1">
              <span>Expected Annual Return:</span>
              <span className="font-semibold text-stone-900 font-mono">{annualRate}%</span>
            </div>
            <input
              type="range"
              min="6"
              max="15"
              step="0.5"
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              className="w-full accent-[#3D7D6A] cursor-pointer"
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="text-xs text-stone-500 font-medium uppercase tracking-wider">Projected Portfolio Value</div>
            <div className="text-2xl font-bold font-serif text-[#2D6957] mt-1 tabular-nums">
              ${futureValue.toLocaleString()}
            </div>
          </div>

          <div className="space-y-2 mt-4 pt-4 border-t border-stone-100 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Your Contributions:</span>
              <span className="font-mono font-medium text-stone-900">${totalInvested.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#3D7D6A]">
              <span>Compound Growth Gain:</span>
              <span className="font-mono font-semibold">+${wealthGain.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-[11px] text-stone-400 mt-3 italic">Calculated with monthly compounding for illustrative planning.</p>
        </div>
      </div>
    </div>
  );
};

// 4. Skincare 4-Step Builder Tool
export const SkincareBuilderTool: React.FC = () => {
  const [skinType, setSkinType] = useState<'normal' | 'dry' | 'oily' | 'sensitive'>('normal');

  const routines = {
    normal: {
      cleanse: 'Gentle foaming cleanser with amino acids',
      treat: 'Vitamin C (AM) / Niacinamide 5% (PM)',
      moisturize: 'Lightweight hyaluronic acid gel-cream',
      protect: 'Broad Spectrum SPF 50 chemical or mineral fluid',
    },
    dry: {
      cleanse: 'Non-foaming cream or oil cleanser',
      treat: 'Hyaluronic acid on damp skin + gentle lactic acid 1x/wk',
      moisturize: 'Ceramide-rich barrier cream with squalane',
      protect: 'Hydrating dewy SPF 50+ with nourishing lipids',
    },
    oily: {
      cleanse: 'Salicylic acid (BHA 1%) or balancing gel cleanser',
      treat: 'Niacinamide 2-5% + Zinc to regulate sebum',
      moisturize: 'Oil-free water cream or mattifying fluid',
      protect: 'Ultra-lightweight invisible fluid SPF 50',
    },
    sensitive: {
      cleanse: 'Fragrance-free micellar gel or oat cleanser',
      treat: 'Centella Asiatica (Cica) or Azelaic acid 10%',
      moisturize: 'Minimalist panthenol (B5) barrier lotion',
      protect: '100% Zinc Oxide mineral sunscreen (calms redness)',
    },
  };

  const current = routines[skinType];

  return (
    <div className="my-8 p-6 bg-[#FAF5FC] border border-[#E8D7F2] rounded-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#E8D7F2]">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#8E68B8] font-semibold">Personalized Routine</span>
          <h4 className="font-serif text-lg font-semibold text-stone-900 mt-0.5">Four-Step Essential Regimen</h4>
        </div>
        <Sparkles className="w-5 h-5 text-[#8E68B8]" />
      </div>

      <div className="flex gap-2 my-4">
        {(['normal', 'dry', 'oily', 'sensitive'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSkinType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
              skinType === type
                ? 'bg-[#8E68B8] text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-purple-300'
            }`}
          >
            {type} Skin
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        <div className="p-3.5 bg-white rounded-xl border border-[#EDE0F5]">
          <div className="text-[11px] font-semibold text-[#8E68B8] uppercase">Step 1 · Cleanse</div>
          <div className="text-xs font-medium text-stone-900 mt-1">{current.cleanse}</div>
          <div className="text-[10px] text-stone-500 mt-0.5">Wash away residue without stripping natural lipids</div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[#EDE0F5]">
          <div className="text-[11px] font-semibold text-[#8E68B8] uppercase">Step 2 · Treat</div>
          <div className="text-xs font-medium text-stone-900 mt-1">{current.treat}</div>
          <div className="text-[10px] text-stone-500 mt-0.5">Target specific skin needs with evidence-based actives</div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[#EDE0F5]">
          <div className="text-[11px] font-semibold text-[#8E68B8] uppercase">Step 3 · Moisturize</div>
          <div className="text-xs font-medium text-stone-900 mt-1">{current.moisturize}</div>
          <div className="text-[10px] text-stone-500 mt-0.5">Seal in hydration and fortify the lipid barrier</div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[#EDE0F5]">
          <div className="text-[11px] font-semibold text-[#8E68B8] uppercase">Step 4 · Protect</div>
          <div className="text-xs font-medium text-stone-900 mt-1">{current.protect}</div>
          <div className="text-[10px] text-stone-500 mt-0.5">Daily shield against UVA/UVB photo-aging</div>
        </div>
      </div>
    </div>
  );
};

// 5. Cycle Phases Guide Tool
export const CycleGuideTool: React.FC = () => {
  const [phase, setPhase] = useState<'menstrual' | 'follicular' | 'ovulatory' | 'luteal'>('follicular');

  const phases = {
    menstrual: {
      days: 'Days 1–5',
      energy: 'Inward & Restorative',
      focus: 'Hydration, warm mineral-rich soups, gentle walks or restorative yoga. Say no to unnecessary friction.',
      biology: 'Estrogen and progesterone are at baseline. The body releases the uterine lining.',
    },
    follicular: {
      days: 'Days 6–13',
      energy: 'Rising & Creative',
      focus: 'Brainstorming, pitching new ideas, higher intensity strength training, fresh crisp vegetables and complex carbohydrates.',
      biology: 'FSH stimulates follicle growth; estrogen rises steadily, enhancing verbal fluency and stamina.',
    },
    ovulatory: {
      days: 'Days 14–16',
      energy: 'Peak Expression',
      focus: 'High-stakes negotiations, public speaking, collaborative social events, high-intensity workouts.',
      biology: 'LH surge triggers egg release. Peak estrogen and testosterone provide maximum confidence.',
    },
    luteal: {
      days: 'Days 17–28',
      energy: 'Deep Focus & Organization',
      focus: 'Bookkeeping, administrative audits, organizing, magnesium-rich foods (dark chocolate, pumpkin seeds), Pilates.',
      biology: 'Progesterone dominates, raising basal body temperature and calming neurotransmitters before tapering.',
    },
  };

  const curr = phases[phase];

  return (
    <div className="my-8 p-6 bg-[#FFF2F5] border border-[#FAD0DA] rounded-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#FAD0DA]">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#D25372] font-semibold">Hormonal Blueprint</span>
          <h4 className="font-serif text-lg font-semibold text-stone-900 mt-0.5">Cycle Phase Navigator</h4>
        </div>
        <Heart className="w-5 h-5 text-[#D25372]" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
        {(['menstrual', 'follicular', 'ovulatory', 'luteal'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPhase(p)}
            className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
              phase === p
                ? 'bg-[#D25372] text-white border-[#D25372] font-medium shadow-xs'
                : 'bg-white text-stone-700 border-stone-200 hover:border-pink-300'
            }`}
          >
            <div className="capitalize">{p}</div>
            <div className={`text-[10px] ${phase === p ? 'text-pink-100' : 'text-stone-400'}`}>{phases[p].days}</div>
          </button>
        ))}
      </div>

      <div className="p-4 bg-white rounded-xl border border-[#FAD0DA] space-y-3">
        <div className="flex items-center justify-between text-xs border-b border-stone-100 pb-2">
          <span className="text-stone-500 font-medium">Energy Vibe:</span>
          <span className="font-semibold text-[#D25372]">{curr.energy}</span>
        </div>
        <div className="text-xs text-stone-700 leading-relaxed">
          <strong className="text-stone-900 block mb-1">Recommended Rhythm:</strong>
          {curr.focus}
        </div>
        <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
          <strong>Hormonal Shift:</strong> {curr.biology}
        </div>
      </div>
    </div>
  );
};

// 6. Bloodwork Checklist Tool
export const LabChecklistTool: React.FC = () => {
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const tests = [
    { id: 'ferritin', name: 'Ferritin (Iron Storage)', tip: 'Standard range is broad (15-150 ng/mL); many women feel optimal above 50-70 ng/mL.' },
    { id: 'vitd', name: '25-OH Vitamin D', tip: 'Essential for immune balance and mood. Aim for optimal 40–60 ng/mL rather than bare minimum 20.' },
    { id: 'b12', name: 'Vitamin B12 + Folate', tip: 'Crucial for neurological health and red blood cell production, especially for plant-forward diets.' },
    { id: 'tsh', name: 'Comprehensive Thyroid (TSH + Free T4 & T3)', tip: 'Tests metabolism throttle; subtle thyroid shifts often mimic fatigue or burnout.' },
  ];

  return (
    <div className="my-8 p-6 bg-stone-50 border border-stone-200 rounded-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#8B2547] font-semibold">Doctor Discussion Guide</span>
          <h4 className="font-serif text-lg font-semibold text-stone-900 mt-0.5">Key Bloodwork Questions</h4>
        </div>
        <Shield className="w-5 h-5 text-[#8B2547]" />
      </div>

      <div className="space-y-2.5 mt-4">
        {tests.map((t) => {
          const isDone = !!checked[t.id];
          return (
            <div
              key={t.id}
              onClick={() => toggle(t.id)}
              className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                isDone ? 'bg-[#FDF6F8] border-[#E8C2CE]' : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center transition-colors ${
                  isDone ? 'bg-[#8B2547] border-[#8B2547] text-white' : 'border-stone-300 bg-white'
                }`}
              >
                {isDone && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div className="flex-1">
                <div className={`font-medium ${isDone ? 'text-[#6C1935]' : 'text-stone-900'}`}>{t.name}</div>
                <div className="text-[11px] text-stone-500 mt-0.5">{t.tip}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
