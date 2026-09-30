import React from 'react';

// Official High-Definition 3D PlayStation Emblem (Razor-Sharp, Vibrant Sony Colors)
export const PlaystationIcon: React.FC<{ className?: string }> = ({ 
  className = 'w-9 h-9' 
}) => (
  <svg 
    viewBox="0 0 45 35" 
    className={`${className} shrink-0 drop-shadow-[0_2px_10px_rgba(0,111,205,0.45)]`}
    aria-label="PlayStation"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 1. S Middle Teal Band (Passes behind & under P) */}
    <path 
      d="M 15.06 19.17 L 24.99 22.39 V 26.7 L 15.06 23.34 Z" 
      fill="#00AA90" 
    />
    <path 
      d="M 15.06 25.96 L 24.99 29.36 V 33.51 L 15.06 29.69 Z" 
      fill="#00AA90" 
    />
    <path 
      d="M 15.06 23.34 L 24.99 26.7 V 27.5 L 15.06 24.2 Z" 
      fill="#007F6A" 
      opacity="0.8" 
    />

    {/* 2. S Front-Left Yellow Loop */}
    <path 
      d="M 3.3 28.92 C -0.17 27.94 -0.75 25.9 0.83 24.73 C 2.29 23.65 4.78 22.83 4.78 22.83 L 15.06 19.17 V 23.34 L 7.66 25.99 C 6.35 26.46 6.15 27.12 7.21 27.47 C 8.27 27.82 10.2 27.72 11.51 27.25 L 15.06 25.96 V 29.69 C 14.83 29.73 14.58 29.77 14.35 29.81 C 10.8 30.39 7.02 30.15 3.3 28.92 Z" 
      fill="#FFC400" 
    />
    {/* Yellow 3D Edge Facet */}
    <path 
      d="M 3.3 28.92 C 1.2 28.2 0.4 26.9 0.83 24.73 L 1.5 25.5 C 0.9 26.5 1.5 27.5 3.3 28.92 Z" 
      fill="#C68A00" 
    />

    {/* 3. S Back-Right Blue Loop */}
    <path 
      d="M 43.63 26.02 C 42.77 27.1 40.66 27.88 40.66 27.88 L 24.99 33.51 V 29.36 L 36.52 25.25 C 37.83 24.78 38.03 24.12 36.97 23.77 C 35.91 23.42 33.99 23.52 32.68 23.99 L 24.99 26.7 V 22.39 L 25.43 22.24 C 27.65 21.45 30.77 21.11 30.77 21.11 C 33.89 20.77 37.72 21.16 40.72 22.3 C 44.1 23.37 44.49 24.94 43.63 26.02 Z" 
      fill="#006FCD" 
    />
    {/* Blue 3D Edge Facet */}
    <path 
      d="M 43.63 26.02 L 42.5 26.8 C 43.2 25.8 42.8 24.7 40.72 22.3 L 41.5 22.8 C 44.1 23.37 44.49 24.94 43.63 26.02 Z" 
      fill="#00438A" 
    />

    {/* 4. Upright Red P (Front Silhouette) */}
    <path 
      d="M 26.48 18.95 V 8.33 C 26.48 7.08 26.25 5.94 25.08 5.61 C 24.18 5.32 23.63 6.16 23.63 7.4 V 33.99 L 16.46 31.71 V 0 C 19.51 0.57 23.95 1.9 26.34 2.71 C 32.41 4.79 34.47 7.39 34.47 13.24 C 34.47 18.94 30.95 21.1 26.48 18.95 Z" 
      fill="#F01D24" 
    />

    {/* 5. Red 3D Extrusion (Right Shadow) */}
    <path 
      d="M 26.48 18.95 L 27.8 19.8 C 31.5 21.8 35.8 18.9 35.8 13.2 C 35.8 7.4 33.2 4.8 26.34 2.71 L 26.34 3.8 C 32.41 5.8 34.47 8.1 34.47 13.24 C 34.47 18.94 30.95 21.1 26.48 18.95 Z" 
      fill="#9E0D12" 
    />

    {/* 6. Red Stem Inner Shadow Depth */}
    <path 
      d="M 23.63 7.4 L 24.5 8.2 V 34.5 L 23.63 33.99 Z" 
      fill="#7A000A" 
      opacity="0.85" 
    />
  </svg>
);
