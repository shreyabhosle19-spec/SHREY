import React from 'react';
import { navigate } from '../router';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  isActive?: boolean;
}

/**
 * Universal Anchor Link Component
 * Ensures every navigation element in the app renders a standard HTML <a> tag
 * with a valid href, while providing smooth client-side routing.
 */
export const Link: React.FC<LinkProps> = ({
  href,
  children,
  className = '',
  activeClassName = '',
  isActive = false,
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    // Allow user to use native browser shortcuts (e.g. Cmd+click, Ctrl+click, middle click)
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }

    // External links or protocol links (mailto, tel, etc.)
    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('#')
    ) {
      return;
    }

    // Intercept internal link for client-side routing
    e.preventDefault();
    navigate(href);
  };

  const combinedClassName = `${className} ${isActive ? activeClassName : ''}`.trim();

  return (
    <a href={href} onClick={handleClick} className={combinedClassName} {...props}>
      {children}
    </a>
  );
};
