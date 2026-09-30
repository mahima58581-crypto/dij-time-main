import React from 'react';

// Official Microsoft Xbox 3D Sphere Emblem (Vibrant Xbox Green Sphere with Deep Obsidian Black Carved X)
export const XboxIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg 
    viewBox="0 0 88 88" 
    className={`${className} shrink-0 drop-shadow-[0_0_12px_rgba(34,197,94,0.85)]`}
    aria-label="Xbox"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* 1. 3D Spherical Neon Green Gradient (Official Xbox Shading) */}
      <radialGradient id="xboxSphereGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="35%" stopColor="#22c55e" />
        <stop offset="70%" stopColor="#15803d" />
        <stop offset="100%" stopColor="#0b4620" />
      </radialGradient>

      {/* 2. Deep Obsidian Black Core for the Carved X */}
      <radialGradient id="xboxBlackXCore" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#020402" />
        <stop offset="60%" stopColor="#000000" />
        <stop offset="100%" stopColor="#050a06" />
      </radialGradient>

      {/* 3. Glossy Specular Arc Reflection */}
      <linearGradient id="xboxGloss" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
      </linearGradient>

      {/* 4. Outer Neon Green Halo Ring */}
      <linearGradient id="xboxRimGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="50%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
    </defs>

    {/* Layer 1: Deep Black Obsidian Base (Shows through the carved X in the center) */}
    <circle 
      cx="44" 
      cy="44" 
      r="42.5" 
      fill="url(#xboxBlackXCore)" 
      stroke="url(#xboxRimGlow)" 
      strokeWidth="1.5" 
    />

    {/* Layer 2: Official 4 Xbox Sphere Quadrants in 3D Green with Crisp Neon Bevel */}
    <path 
      fill="url(#xboxSphereGrad)" 
      stroke="#4ade80"
      strokeWidth="0.8"
      strokeOpacity="0.9"
      d="M39.73 86.91c-6.628-.635-13.338-3.015-19.102-6.776-4.83-3.15-5.92-4.447-5.92-7.032 0-5.193 5.71-14.29 15.48-24.658 5.547-5.89 13.275-12.79 14.11-12.604 1.626.363 14.616 13.034 19.48 19 7.69 9.43 11.224 17.154 9.428 20.597-1.365 2.617-9.837 7.733-16.06 9.698-5.13 1.62-11.867 2.306-17.416 1.775zM8.184 67.703c-4.014-6.158-6.042-12.22-7.02-20.988-.324-2.895-.21-4.55.733-10.494 1.173-7.4 5.39-15.97 10.46-21.24 2.158-2.24 2.35-2.3 4.982-1.41 3.19 1.08 6.6 3.436 11.89 8.22l3.09 2.794-1.69 2.07c-7.828 9.61-16.09 23.24-19.2 31.67-1.69 4.58-2.37 9.18-1.64 11.095.49 1.294.04.812-1.61-1.714zm70.453 1.047c.397-1.936-.105-5.49-1.28-9.076-2.545-7.765-11.054-22.21-18.867-32.032l-2.46-3.092 2.662-2.443c3.474-3.19 5.886-5.1 8.49-6.723 2.053-1.28 4.988-2.413 6.25-2.413.777 0 3.516 2.85 5.726 5.95 3.424 4.8 5.942 10.63 7.218 16.69.825 3.92.894 12.3.133 16.21-.63 3.208-1.95 7.366-3.23 10.187-.97 2.113-3.36 6.218-4.41 7.554-.54.687-.54.686-.24-.796zM40.44 11.505C36.834 9.675 31.272 7.71 28.2 7.18c-1.076-.185-2.913-.29-4.08-.23-2.536.128-2.423-.004 1.643-1.925 3.38-1.597 6.2-2.536 10.03-3.34C40.098.78 48.193.77 52.43 1.663c4.575.965 9.964 2.97 13 4.84l.904.554-2.07-.104C60.148 6.745 54.15 8.408 47.71 11.54c-1.942.946-3.63 1.7-3.754 1.68-.123-.024-1.706-.795-3.52-1.715z" 
    />

    {/* Layer 3: Glossy Specular Arc Reflection on Top Hemisphere */}
    <path 
      d="M 22 18 C 30 10, 58 10, 66 18 C 56 13, 32 13, 22 18 Z" 
      fill="url(#xboxGloss)" 
    />
  </svg>
);
