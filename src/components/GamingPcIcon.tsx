import React from 'react';

interface GamingPcIconProps {
  className?: string;
}

/**
 * آیکون کامپیوتر گیمینگ سفارشی (گرادینت نئونی فیروزه‌ای)
 * Custom Gaming PC icon with neon cyan gradient
 */
export const GamingPcIcon: React.FC<GamingPcIconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    className={className}
    fill="none"
  >
    <defs>
      <linearGradient id="gaming-pc-neon" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#00d4f3" />
        <stop offset="1" stopColor="#009df2" />
      </linearGradient>
      <linearGradient id="gaming-pc-screen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#082534" />
        <stop offset="1" stopColor="#0c101c" />
      </linearGradient>
    </defs>

    {/* background */}
    <rect width="256" height="256" rx="56" fill="#0c101c" />
    <rect x="3" y="3" width="250" height="250" rx="53" fill="none" stroke="#1d293d" strokeWidth="3" />

    {/* monitor */}
    <rect x="22" y="58" width="150" height="104" rx="12" fill="#0c101c" stroke="url(#gaming-pc-neon)" strokeWidth="6" />
    <rect x="32" y="68" width="130" height="80" rx="5" fill="url(#gaming-pc-screen)" />

    {/* screen content */}
    <path d="M82 84 L82 130 L120 107 Z" fill="url(#gaming-pc-neon)" />
    <rect x="40" y="136" width="60" height="5" rx="2.5" fill="#00d4f3" opacity="0.9" />
    <rect x="106" y="136" width="48" height="5" rx="2.5" fill="#009df2" opacity="0.9" />
    <circle cx="44" cy="78" r="3" fill="#00d4f3" />
    <circle cx="54" cy="78" r="3" fill="#00bbf3" />
    <circle cx="64" cy="78" r="3" fill="#009df2" />

    {/* monitor stand */}
    <rect x="86" y="162" width="22" height="18" fill="url(#gaming-pc-neon)" />
    <rect x="62" y="180" width="70" height="10" rx="5" fill="url(#gaming-pc-neon)" />

    {/* gaming PC tower */}
    <rect x="184" y="52" width="52" height="138" rx="10" fill="#0c101c" stroke="url(#gaming-pc-neon)" strokeWidth="6" />
    <rect x="192" y="62" width="36" height="52" rx="4" fill="url(#gaming-pc-screen)" stroke="#056177" strokeWidth="2" />

    {/* fan */}
    <g transform="translate(210 88)">
      <circle r="14" fill="none" stroke="#00d4f3" strokeWidth="2.5" />
      <path d="M0 -12 C6 -8 6 -2 0 0 C-6 -2 -6 -8 0 -12 Z" fill="#00d4f3" />
      <path d="M0 -12 C6 -8 6 -2 0 0 C-6 -2 -6 -8 0 -12 Z" fill="#00bbf3" transform="rotate(120)" />
      <path d="M0 -12 C6 -8 6 -2 0 0 C-6 -2 -6 -8 0 -12 Z" fill="#009df2" transform="rotate(240)" />
      <circle r="3" fill="#ffffff" />
    </g>

    {/* drive slots and power button */}
    <rect x="194" y="126" width="32" height="5" rx="2.5" fill="#00d4f3" />
    <rect x="194" y="138" width="32" height="5" rx="2.5" fill="#009df2" />
    <circle cx="210" cy="164" r="8" fill="none" stroke="#00d4f3" strokeWidth="3" />
    <rect x="208.5" y="155" width="3" height="9" rx="1.5" fill="#00d4f3" />

    {/* neon underline */}
    <rect x="22" y="212" width="214" height="5" rx="2.5" fill="url(#gaming-pc-neon)" />
  </svg>
);
