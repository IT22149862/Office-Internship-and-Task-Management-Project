// A stylized, abstract illustration suggesting a confident professional —
// intentionally non-photographic so it stays decorative rather than depicting
// any real, identifiable person.
export default function PortraitIllustration(props) {
  return (
    <svg viewBox="0 0 420 620" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4C98B" />
          <stop offset="100%" stopColor="#E0A868" />
        </linearGradient>
        <linearGradient id="hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3A2414" />
          <stop offset="100%" stopColor="#1C120A" />
        </linearGradient>
        <linearGradient id="blazer" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="55%" stopColor="#D97E0C" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id="blouse" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFDF6" />
          <stop offset="100%" stopColor="#FCE9C6" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FCD34D" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="230" cy="230" r="230" fill="url(#glow)" />

      {/* shoulders / blazer */}
      <path d="M40 620 C40 460 120 400 210 400 C300 400 380 460 380 620 Z" fill="url(#blazer)" />
      <path d="M150 430 L210 620 L270 430 Z" fill="url(#blouse)" opacity="0.9" />
      <path d="M40 620 C40 470 110 405 170 402 L210 460 L150 430 Z" fill="#B45309" opacity="0.35" />
      <path d="M380 620 C380 470 310 405 250 402 L210 460 L270 430 Z" fill="#B45309" opacity="0.35" />

      {/* neck */}
      <rect x="188" y="330" width="64" height="90" rx="20" fill="url(#skin)" />

      {/* head */}
      <ellipse cx="220" cy="255" rx="98" ry="112" fill="url(#skin)" />

      {/* hair - updo */}
      <path d="M118 250 C110 150 160 90 220 90 C286 90 330 150 322 250 C322 190 300 130 220 130 C146 130 118 190 118 250 Z" fill="url(#hair)" />
      <ellipse cx="220" cy="108" rx="58" ry="40" fill="url(#hair)" />
      <path d="M120 230 C100 260 108 300 140 320 C118 300 116 265 128 236 Z" fill="url(#hair)" />
      <path d="M320 230 C340 260 332 300 300 320 C322 300 324 265 312 236 Z" fill="url(#hair)" />

      {/* simple facial suggestion (kept abstract/minimal, not a specific likeness) */}
      <path d="M178 258 q10 8 20 0" stroke="#8A5A2C" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.55" />
      <path d="M242 258 q10 8 20 0" stroke="#8A5A2C" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.55" />
      <path d="M204 296 q16 14 32 0" stroke="#B4703A" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* earrings */}
      <circle cx="130" cy="272" r="5" fill="#FCD34D" />
      <circle cx="310" cy="272" r="5" fill="#FCD34D" />

      {/* collar accent */}
      <path d="M188 402 L220 460 L252 402" stroke="#FCD34D" strokeWidth="3" fill="none" opacity="0.7" />
    </svg>
  );
}
