export type CategoryType = 'All' | 'Wellness' | 'Health' | 'Skincare' | 'Finance' | 'Startups';

export interface ArticleSection {
  heading?: string;
  paragraphs: string[];
  callout?: string;
  bulletPoints?: string[];
}

export interface Article {
  id: string;
  title: string;
  category: Exclude<CategoryType, 'All'>;
  excerpt: string;
  readTime: string;
  publishedDate: string;
  author: {
    name: string;
    role: string;
  };
  featured?: boolean;
  imageUrl?: string;
  visualType: 'wellness-waves' | 'wellness-sleep' | 'health-pulse' | 'health-labs' | 'skincare-drops' | 'skincare-sun' | 'finance-bars' | 'finance-growth' | 'startup-launch' | 'startup-brand';
  interactiveTool?: 'morning-reset' | 'sleep-winddown' | 'cycle-guide' | 'lab-checklist' | 'skincare-builder' | 'sunscreen-guide' | 'budget-calc' | 'sip-calc' | 'funding-matrix' | 'brand-trust';
  fullContent: {
    introduction: string;
    keyTakeaway: string;
    sections: ArticleSection[];
    disclaimer?: string;
  };
}
