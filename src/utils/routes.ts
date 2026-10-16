import { CategoryType } from '../types';

export const getArticleUrl = (id: string): string => {
  return `/articles/${id.toLowerCase()}`;
};

export const getCategoryUrl = (cat: CategoryType): string => {
  if (cat === 'All') return '/';
  return `/category/${cat.toLowerCase()}`;
};

export const getSavedUrl = (): string => '/saved';
export const getNewsletterUrl = (): string => '/newsletter';
export const getBrandingUrl = (): string => '/branding';
export const getHomeUrl = (): string => '/';

export interface ParsedRoute {
  pathname: string;
  articleId: string | null;
  category: CategoryType;
  isSavedOpen: boolean;
  isNewsletterOpen: boolean;
  isBrandModalOpen: boolean;
}

export const parseCurrentRoute = (pathname: string, search: string): ParsedRoute => {
  const cleanPath = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  let articleId: string | null = null;
  let category: CategoryType = 'All';
  let isSavedOpen = false;
  let isNewsletterOpen = false;
  let isBrandModalOpen = false;

  // 1. Check article route: /articles/:id
  if (cleanPath.startsWith('/articles/')) {
    articleId = cleanPath.replace('/articles/', '');
  } else {
    // Check legacy query parameter if present: ?article=:id
    const params = new URLSearchParams(search);
    const queryArticle = params.get('article');
    if (queryArticle) {
      articleId = queryArticle;
    }
  }

  // 2. Check category route: /category/:categoryName
  if (cleanPath.startsWith('/category/')) {
    const rawCat = cleanPath.replace('/category/', '');
    const mappedCat: Record<string, CategoryType> = {
      wellness: 'Wellness',
      health: 'Health',
      skincare: 'Skincare',
      finance: 'Finance',
      startups: 'Startups',
    };
    if (mappedCat[rawCat]) {
      category = mappedCat[rawCat];
    }
  }

  // 3. Modal / Utility page routes
  if (cleanPath === '/saved') {
    isSavedOpen = true;
  } else if (cleanPath === '/newsletter') {
    isNewsletterOpen = true;
  } else if (cleanPath === '/branding') {
    isBrandModalOpen = true;
  }

  return {
    pathname: cleanPath,
    articleId,
    category,
    isSavedOpen,
    isNewsletterOpen,
    isBrandModalOpen,
  };
};
