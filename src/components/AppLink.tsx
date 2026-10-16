import React from 'react';

interface AppLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  anchorText?: string; // Fallback or explicit anchor text
}

/**
 * AppLink: Renders a semantic <a> tag with descriptive anchor text
 * and intercepts normal clicks for client-side routing while preserving
 * native Cmd/Ctrl+Click and right-click "Open in new tab" behavior.
 */
export const AppLink: React.FC<AppLinkProps> = ({
  to,
  children,
  className = '',
  onClick,
  anchorText,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If modifier keys are pressed (Cmd, Ctrl, Shift, Alt), let the browser handle new tab
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    e.preventDefault();

    if (onClick) {
      onClick(e);
    }

    // Update URL using clean history pushState
    window.history.pushState({}, '', to);

    // Dispatch popstate event so all routing listeners update synchronously
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
      {anchorText && <span className="sr-only">{anchorText}</span>}
    </a>
  );
};
