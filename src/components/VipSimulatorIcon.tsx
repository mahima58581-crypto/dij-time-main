import React, { useId } from 'react';

interface VipSimulatorIconProps {
  className?: string;
}

/**
 * آیکون اختصاصی محاکي قيادة VIP (هلۆىة ناريەة بگرادیێنت نارنجی)
 * Custom VIP driving-simulator fire icon with orange gradients.
 * Gradient/filter IDs are uniquified per instance (useId) so many icons
 * can coexist on the same page without SVG id collisions.
 */
export const VipSimulatorIcon: React.FC<VipSimulatorIconProps> = ({ className }) => {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const g = (name: string) => `${uid}-${name}`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className} role="img" aria-label="VIP Simulator">
      <defs>
        <linearGradient id={g('fire')} gradientUnits="userSpaceOnUse" x1="54" y1="0" x2="458" y2="0">
          <stop offset="0" stopColor="#ff8600"/><stop offset=".25" stopColor="#ffa200"/><stop offset=".5" stopColor="#ffb600"/><stop offset=".75" stopColor="#ff8d00"/><stop offset="1" stopColor="#ff5e2b"/>
        </linearGradient>
        <linearGradient id={g('fireV')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffb600"/><stop offset="1" stopColor="#ff5e2b"/></linearGradient>
        <radialGradient id={g('halo')} gradientUnits="userSpaceOnUse" cx="256" cy="190" r="330"><stop offset="0" stopColor="#ff8600" stopOpacity=".40"/><stop offset=".6" stopColor="#ff5e2b" stopOpacity=".08"/><stop offset="1" stopColor="#ff5e2b" stopOpacity="0"/></radialGradient>
        <linearGradient id={g('sky')} gradientUnits="userSpaceOnUse" x1="0" y1="74" x2="0" y2="214"><stop offset="0" stopColor="#06070d"/><stop offset=".4" stopColor="#2a0f12"/><stop offset=".78" stopColor="#b03a10"/><stop offset="1" stopColor="#ff7a1a"/></linearGradient>
        <linearGradient id={g('sunG')} gradientUnits="userSpaceOnUse" x1="0" y1="122" x2="0" y2="280"><stop offset="0" stopColor="#ffb600"/><stop offset=".5" stopColor="#ff8600"/><stop offset="1" stopColor="#ff3d2e"/></linearGradient>
        <radialGradient id={g('sunGlow')} gradientUnits="userSpaceOnUse" cx="256" cy="202" r="150"><stop offset="0" stopColor="#ff8600" stopOpacity=".6"/><stop offset="1" stopColor="#ff5e2b" stopOpacity="0"/></radialGradient>
        <linearGradient id={g('ground')} gradientUnits="userSpaceOnUse" x1="0" y1="214" x2="0" y2="292"><stop offset="0" stopColor="#2d0f0b"/><stop offset="1" stopColor="#06070c"/></linearGradient>
        <linearGradient id={g('roadG')} gradientUnits="userSpaceOnUse" x1="0" y1="214" x2="0" y2="292"><stop offset="0" stopColor="#1c1519"/><stop offset="1" stopColor="#0a0a10"/></linearGradient>
        <linearGradient id={g('bezel')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#262e43"/><stop offset=".5" stopColor="#12161f"/><stop offset="1" stopColor="#090b12"/></linearGradient>
        <linearGradient id={g('metal')} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0a0d15"/><stop offset=".45" stopColor="#3a4359"/><stop offset=".6" stopColor="#232a3c"/><stop offset="1" stopColor="#090b12"/></linearGradient>
        <linearGradient id={g('rim')} gradientUnits="userSpaceOnUse" x1="180" y1="330" x2="340" y2="500"><stop offset="0" stopColor="#5a4f48"/><stop offset=".4" stopColor="#241e1b"/><stop offset="1" stopColor="#0a0807"/></linearGradient>
        <linearGradient id={g('hubG')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2d3347"/><stop offset="1" stopColor="#07080d"/></linearGradient>
        <radialGradient id={g('vig')} cx=".5" cy=".5" r=".72"><stop offset=".62" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".6"/></radialGradient>
        <radialGradient id={g('scrDark')} cx=".5" cy=".5" r=".72"><stop offset=".6" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".5"/></radialGradient>
        <linearGradient id={g('refl')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".16"/><stop offset=".5" stopColor="#fff" stopOpacity=".03"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
        <filter id={g('b3')} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
        <filter id={g('b6')} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
        <filter id={g('b12')} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12"/></filter>
        <filter id={g('b20')} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>
        <clipPath id={g('icon')}><rect width="512" height="512" rx="112"/></clipPath>
        <clipPath id={g('glass')}><rect x="72" y="74" width="368" height="216" rx="12"/></clipPath>
        <mask id={g('sunMask')} maskUnits="userSpaceOnUse" x="150" y="110" width="212" height="180">
          <rect x="150" y="110" width="212" height="180" fill="#fff"/>
          <rect x="150" y="207" width="212" height="2.6" fill="#000"/>
          <rect x="150" y="218" width="212" height="4.3" fill="#000"/>
          <rect x="150" y="229" width="212" height="6.0" fill="#000"/>
          <rect x="150" y="240" width="212" height="7.7" fill="#000"/>
          <rect x="150" y="251" width="212" height="9.4" fill="#000"/>
        </mask>
      </defs>
      <g clipPath={`url(#${g('icon')})`}>
        <rect width="512" height="512" fill="#0c101c"/>
        <rect width="512" height="512" fill={`url(#${g('halo')})`}/>
        <rect x="54" y="56" width="404" height="252" rx="26" fill="#ff8600" opacity=".55" filter={`url(#${g('b20')})`}/>
        <polygon points="230,306 282,306 292,342 220,342" fill={`url(#${g('metal')})`} stroke="#1d293d" strokeWidth="2"/>
        <line x1="256" y1="312" x2="256" y2="338" stroke="#ffb600" strokeWidth="3"/>
        <g clipPath={`url(#${g('glass')})`}>
          <rect x="72" y="74" width="368" height="140" fill={`url(#${g('sky')})`}/>
          <circle cx="163" cy="85" r="1.2" fill="#ffe9cf" opacity="0.48"/>
          <circle cx="103" cy="107" r="1.6" fill="#ffe9cf" opacity="0.80"/>
          <circle cx="349" cy="94" r="1.3" fill="#ffe9cf" opacity="0.54"/>
          <circle cx="141" cy="86" r="1.0" fill="#ffe9cf" opacity="0.86"/>
          <circle cx="372" cy="136" r="1.5" fill="#ffe9cf" opacity="0.50"/>
          <circle cx="258" cy="91" r="1.2" fill="#ffe9cf" opacity="0.44"/>
          <circle cx="409" cy="140" r="1.3" fill="#ffe9cf" opacity="0.55"/>
          <circle cx="400" cy="119" r="1.6" fill="#ffe9cf" opacity="0.82"/>
          <circle cx="259" cy="108" r="1.3" fill="#ffe9cf" opacity="0.62"/>
          <circle cx="137" cy="100" r="1.5" fill="#ffe9cf" opacity="0.42"/>
          <circle cx="96" cy="123" r="1.1" fill="#ffe9cf" opacity="0.67"/>
          <circle cx="246" cy="103" r="1.7" fill="#ffe9cf" opacity="0.50"/>
          <circle cx="225" cy="93" r="1.4" fill="#ffe9cf" opacity="0.54"/>
          <circle cx="205" cy="132" r="1.1" fill="#ffe9cf" opacity="0.68"/>
          <circle cx="398" cy="85" r="0.9" fill="#ffe9cf" opacity="0.51"/>
          <circle cx="349" cy="122" r="1.0" fill="#ffe9cf" opacity="0.57"/>
          <circle cx="142" cy="111" r="0.8" fill="#ffe9cf" opacity="0.75"/>
          <circle cx="395" cy="147" r="1.5" fill="#ffe9cf" opacity="0.88"/>
          <rect x="72" y="74" width="368" height="216" fill={`url(#${g('sunGlow')})`}/>
          <circle cx="256" cy="202" r="78" fill={`url(#${g('sunG')})`} mask={`url(#${g('sunMask')})`}/>
          <path d="M72,216 L72,190 L120,166 L160,194 L210,170 L256,202 L306,168 L360,196 L404,170 L440,190 L440,216 Z" fill="#2a0e12"/>
          <path d="M72,190 L120,166 L160,194 L210,170 L256,202 L306,168 L360,196 L404,170 L440,190" fill="none" stroke="#ff5e2b" strokeWidth="2" opacity=".85"/>
          <path d="M72,216 L72,204 L130,190 L190,206 L256,196 L330,208 L390,192 L440,206 L440,216 Z" fill="#140709"/>
          <path d="M72,204 L130,190 L190,206 L256,196 L330,208 L390,192 L440,206" fill="none" stroke="#ff8600" strokeWidth="2" opacity=".9"/>
          <rect x="72" y="204" width="368" height="18" fill="#ff8600" opacity=".4" filter={`url(#${g('b6')})`}/>
          <rect x="72" y="214" width="368" height="80" fill={`url(#${g('ground')})`}/>
          <g opacity=".55">
            <line x1="256" y1="214" x2="-400" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="-336" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="-272" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="-208" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="-144" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="-80" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="-16" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="48" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="112" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="176" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="240" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="304" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="368" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="432" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="496" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="560" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="624" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="688" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="752" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="816" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
            <line x1="256" y1="214" x2="880" y2="300" stroke="#ff8600" strokeWidth="1.8"/>
          </g>
        </g>
        <rect x="72" y="74" width="368" height="216" fill={`url(#${g('scrDark')})`}/>
        <polygon points="72,74 250,74 150,290 72,290" fill={`url(#${g('refl')})`}/>
      </g>
      <path d="M80,56 H430 Q458,56 458,84 V280 Q458,308 430,308 H82 Q54,308 54,280 V84 Q54,56 82,56 Z M84,74 H428 Q440,74 440,86 V278 Q440,290 428,290 H84 Q72,290 72,278 V86 Q72,74 84,74 Z" fill={`url(#${g('bezel')})`} fillRule="evenodd"/>
      <path d="M80,56 H430 Q458,56 458,84 V280 Q458,308 430,308 H82 Q54,308 54,280 V84 Q54,56 82,56 Z" fill="none" stroke={`url(#${g('fire')})`} strokeWidth="14" filter={`url(#${g('b6')})`} opacity=".85"/>
      <path d="M80,56 H430 Q458,56 458,84 V280 Q458,308 430,308 H82 Q54,308 54,280 V84 Q54,56 82,56 Z" fill="none" stroke={`url(#${g('fire')})`} strokeWidth="5"/>
      <line x1="86" y1="59" x2="426" y2="59" stroke="#fff" strokeOpacity=".3" strokeWidth="2"/>
      <circle cx="256" cy="299" r="3.4" fill="#00e08a" filter={`url(#${g('b3')})`}/><circle cx="256" cy="299" r="2.6" fill="#7dffc4"/>
      <ellipse cx="256" cy="372" rx="210" ry="18" fill="#ff8600" opacity=".5" filter={`url(#${g('b12')})`}/>
      <rect width="512" height="512" fill={`url(#${g('vig')})`}/>
    </svg>
  );
};
