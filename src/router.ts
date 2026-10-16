import { useState, useEffect } from 'react';
import { CategoryType } from './types';

export type AppRoute =
  | { type: 'home' }
  | { type: 'category'; category: Exclude<CategoryType, 'All'>; categorySlug: string }
  | { type: 'article'; slug: string }
  | { type: 'saved' }
  | { type: 'newsletter' }
  | { type: 'about' }
  | { type: 'not-found'; path: string };

const CATEGORY_MAP: Record<string, Exclude<CategoryType, 'All'>> = {
  wellness: 'Wellness',
  health: 'Health',
  skincare: 'Skincare',
  finance: 'Finance',
  startups: 'Startups',
};

export function categoryToSlug(category: Exclude<CategoryType, 'All'>): string {
  return category.toLowerCase();
}

export function parsePath(pathname: string, search: string): AppRoute {
  // Check backward compatibility search query params
  const searchParams = new URLSearchParams(search);
  const legacyArticle = searchParams.get('article');
  if (legacyArticle) {
    return { type: 'article', slug: legacyArticle };
  }
  const legacyCategory = searchParams.get('category');
  if (legacyCategory && CATEGORY_MAP[legacyCategory.toLowerCase()]) {
    return {
      type: 'category',
      category: CATEGORY_MAP[legacyCategory.toLowerCase()],
      categorySlug: legacyCategory.toLowerCase(),
    };
  }

  // Normalize path: lowercase, strip trailing slash unless root
  let clean = pathname.toLowerCase().trim();
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }

  if (clean === '' || clean === '/') {
    return { type: 'home' };
  }

  if (clean === '/saved' || clean === '/bookmarks') {
    return { type: 'saved' };
  }

  if (clean === '/newsletter' || clean === '/subscribe') {
    return { type: 'newsletter' };
  }

  if (clean === '/about' || clean === '/editorial') {
    return { type: 'about' };
  }

  // Match /category/:cat
  const categoryMatch = clean.match(/^\/category\/([a-z0-9-]+)$/);
  if (categoryMatch) {
    const slug = categoryMatch[1];
    if (CATEGORY_MAP[slug]) {
      return {
        type: 'category',
        category: CATEGORY_MAP[slug],
        categorySlug: slug,
      };
    }
  }

  // Match /article/:slug
  const articleMatch = clean.match(/^\/article\/([a-z0-9-]+)$/);
  if (articleMatch) {
    return {
      type: 'article',
      slug: articleMatch[1],
    };
  }

  return { type: 'not-found', path: clean };
}

export function navigate(to: string, replace = false) {
  if (typeof window === 'undefined') return;

  // Normalize
  let target = to;
  if (!target.startsWith('/')) {
    target = '/' + target;
  }

  if (replace) {
    window.history.replaceState({}, '', target);
  } else {
    window.history.pushState({}, '', target);
  }

  // Dispatch popstate event so all listening components update
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function useAppRoute(): AppRoute {
  const [route, setRoute] = useState<AppRoute>(() => {
    if (typeof window === 'undefined') return { type: 'home' };
    return parsePath(window.location.pathname, window.location.search);
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(parsePath(window.location.pathname, window.location.search));
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  return route;
}
