import React from 'react';
import { Article } from '../types';

interface ArticleIllustrationProps {
  visualType: Article['visualType'];
  className?: string;
}

export const ArticleIllustration: React.FC<ArticleIllustrationProps> = ({ visualType, className = '' }) => {
  switch (visualType) {
    case 'wellness-waves':
      return (
        <div className={`relative overflow-hidden w-full h-full bg-[#EBF0E7] flex items-center justify-center ${className}`}>
          <svg
            viewBox="0 0 400 320"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background base */}
            <rect width="400" height="320" fill="#EBF0E7" />
            
            {/* Soft cream undulating dunes */}
            <path
              d="M0 120 Q120 70 240 130 T400 90 L400 320 L0 320 Z"
              fill="#E1E5D5"
              opacity="0.8"
            />
            
            {/* Sage hill */}
            <path
              d="M0 170 Q140 110 260 180 T400 140 L400 320 L0 320 Z"
              fill="#C8D4BF"
            />
            
            {/* Foreground deep sage wave */}
            <path
              d="M0 240 Q100 200 220 250 T400 210 L400 320 L0 320 Z"
              fill="#6B8869"
            />

            {/* Concentric circles motif */}
            <g transform="translate(180, 140)">
              {/* Outer soft ring */}
              <circle cx="0" cy="0" r="64" fill="#8FA689" opacity="0.45" />
              {/* Mid ring */}
              <circle cx="0" cy="0" r="48" fill="#8FA689" opacity="0.85" />
              {/* Center disc */}
              <circle cx="0" cy="0" r="32" fill="#5F7D5D" />
            </g>
          </svg>
        </div>
      );

    case 'wellness-sleep':
      return (
        <div className={`relative overflow-hidden w-full h-full bg-[#EBF0E7] flex items-center justify-center ${className}`}>
          <svg
            viewBox="0 0 400 280"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="400" height="280" fill="#EAF0E6" />
            <path
              d="M0 100 C120 60, 260 140, 400 80 L400 280 L0 280 Z"
              fill="#DCE5D3"
            />
            <path
              d="M0 180 C150 130, 270 210, 400 160 L400 280 L0 280 Z"
              fill="#A2B79C"
            />
            <path
              d="M0 240 C110 220, 260 250, 400 225 L400 280 L0 280 Z"
              fill="#617F5F"
            />
            {/* Calm circle resting in horizon */}
            <circle cx="160" cy="140" r="46" fill="#8FA689" opacity="0.5" />
            <circle cx="160" cy="140" r="32" fill="#587656" />
          </svg>
        </div>
      );

    case 'health-pulse':
    case 'health-labs':
      return (
        <div className={`relative overflow-hidden w-full h-full bg-[#FCE8ED] flex items-center justify-center ${className}`}>
          <svg
            viewBox="0 0 400 280"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Delicate warm pink backdrop */}
            <rect width="400" height="280" fill="#FCE8ED" />

            {/* Subtle soft gradient halo */}
            <circle cx="200" cy="140" r="110" fill="#F8D3DE" opacity="0.7" />

            {/* Heart symbol centered */}
            <g transform="translate(200, 126)">
              <path
                d="M 0 -10 
                   C -20 -48, -75 -48, -75 0 
                   C -75 35, -35 60, 0 85 
                   C 35 60, 75 35, 75 0 
                   C 75 -48, 20 -48, 0 -10 Z"
                fill="#D25372"
              />
            </g>

            {/* ECG Pulse line across bottom third */}
            <g transform="translate(0, 195)">
              <line x1="0" y1="0" x2="115" y2="0" stroke="#E588A0" strokeWidth="5" strokeLinecap="round" />
              {/* ECG deflection */}
              <polyline
                points="115,0 128,-14 140,8 152,-42 165,22 178,-8 190,0 400,0"
                fill="none"
                stroke="#E588A0"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>
      );

    case 'skincare-drops':
    case 'skincare-sun':
      return (
        <div className={`relative overflow-hidden w-full h-full bg-[#F3EBF9] flex items-center justify-center ${className}`}>
          <svg
            viewBox="0 0 400 280"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Lilac / lavender background */}
            <rect width="400" height="280" fill="#F3EBF9" />
            
            {/* Floating soft lavender circles */}
            <circle cx="100" cy="180" r="18" fill="#B8A0D6" opacity="0.45" />
            <circle cx="310" cy="85" r="22" fill="#B8A0D6" opacity="0.7" />
            <circle cx="340" cy="190" r="10" fill="#B8A0D6" opacity="0.35" />

            {/* Large droplet in rich purple */}
            <g transform="translate(195, 145)">
              <path
                d="M 0 -85 
                   C 10 -60, 52 -10, 52 30 
                   C 52 65, 28 85, 0 85 
                   C -28 85, -52 65, -52 30 
                   C -52 -10, -10 -60, 0 -85 Z"
                fill="#946BBF"
              />
            </g>
          </svg>
        </div>
      );

    case 'finance-bars':
    case 'finance-growth':
      return (
        <div className={`relative overflow-hidden w-full h-full bg-[#EAF2ED] flex items-center justify-center ${className}`}>
          <svg
            viewBox="0 0 400 280"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Mint green / sage canvas */}
            <rect width="400" height="280" fill="#EAF2ED" />
            
            {/* Three distinct rounded vertical bars */}
            <g transform="translate(110, 80)">
              {/* Bar 1 (medium) */}
              <rect x="0" y="60" width="48" height="110" rx="10" fill="#8CB4A3" />
              
              {/* Bar 2 (tallest) */}
              <rect x="68" y="10" width="48" height="160" rx="10" fill="#589B85" />
              
              {/* Bar 3 (highest contrast teal) */}
              <rect x="136" y="0" width="48" height="170" rx="10" fill="#3D7D6A" />

              {/* Floating accent circular disc */}
              <circle cx="218" cy="18" r="26" fill="#88BAA7" />
            </g>
          </svg>
        </div>
      );

    case 'startup-launch':
    case 'startup-brand':
      return (
        <div className={`relative overflow-hidden w-full h-full bg-[#FCECE0] flex items-center justify-center ${className}`}>
          <svg
            viewBox="0 0 400 280"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Warm apricot / peach backdrop */}
            <rect width="400" height="280" fill="#FCECE0" />
            
            {/* Starry orbit dots */}
            <circle cx="115" cy="80" r="6" fill="#9997CE" opacity="0.6" />
            <circle cx="125" cy="170" r="5" fill="#9997CE" opacity="0.5" />
            <circle cx="300" cy="135" r="8" fill="#9997CE" opacity="0.7" />
            <circle cx="280" cy="210" r="4" fill="#9997CE" opacity="0.4" />

            {/* Minimalist modern directional arrow / chevron pointing up */}
            <g transform="translate(195, 135)">
              <path
                d="M 0 -75
                   L 46 45
                   L 0 25
                   L -46 45
                   Z"
                fill="#5A56A8"
              />
            </g>
          </svg>
        </div>
      );

    default:
      return (
        <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400">
          Bloom & Ledger
        </div>
      );
  }
};
