// AP13 NEWS Logo — SVG component
// Drop this anywhere: <AP13Logo height={70} />

const AP13Logo = ({ height = 70 }) => {
  const w = height * 3.2; // maintain aspect ratio

  return (
    <svg
      width={w}
      height={height}
      viewBox="0 0 600 190"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="AP13 NEWS"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="lg-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff2a40" />
          <stop offset="100%" stopColor="#b8000e" />
        </linearGradient>
        <linearGradient id="lg-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c2c2c" />
          <stop offset="100%" stopColor="#0f0f0f" />
        </linearGradient>
        <linearGradient id="lg-tag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1c1c" />
          <stop offset="100%" stopColor="#080808" />
        </linearGradient>
      </defs>

      {/* ── Outer frame ── */}
      <rect x="1" y="1" width="598" height="188" rx="12" fill="#120003" stroke="#e8192c" strokeWidth="2" />

      {/* ── Red AP13 section ── */}
      <clipPath id="clip-red">
        <rect x="1" y="1" width="265" height="148" rx="12" />
      </clipPath>
      <rect x="1" y="1" width="275" height="148" fill="url(#lg-red)" clipPath="url(#clip-red)" />
      <rect x="254" y="1" width="22" height="148" fill="url(#lg-red)" />

      {/* ── Dark NEWS section ── */}
      <clipPath id="clip-dark">
        <rect x="275" y="1" width="324" height="148" rx="12" />
      </clipPath>
      <rect x="265" y="1" width="334" height="148" fill="url(#lg-dark)" clipPath="url(#clip-dark)" />
      <rect x="265" y="1" width="20" height="148" fill="url(#lg-dark)" />

      {/* ── Divider ── */}
      <line x1="276" y1="4" x2="276" y2="146" stroke="#080808" strokeWidth="3" />

      {/* ── AP13 text ── */}
      <text
        x="140" y="115"
        fontFamily="'Arial Black', 'Impact', 'Arial', sans-serif"
        fontSize="96"
        fontWeight="900"
        fontStyle="italic"
        fill="#ffffff"
        textAnchor="middle"
        letterSpacing="-3"
      >AP13</text>

      {/* ── NEWS text ── */}
      <text
        x="432" y="112"
        fontFamily="'Arial Black', 'Impact', 'Arial', sans-serif"
        fontSize="84"
        fontWeight="900"
        fontStyle="italic"
        fill="#f0f0f0"
        textAnchor="middle"
        letterSpacing="-2"
      >NEWS</text>

      {/* ── Pen icon ── */}
      <g transform="translate(552, 10)">
        <rect x="10" y="0" width="18" height="88" rx="4" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
        <rect x="22" y="4" width="5" height="68" rx="2" fill="#777" />
        <polygon points="10,88 28,88 19,118" fill="#b8900a" />
        <polygon points="14,88 24,88 19,108" fill="#f5c518" />
        <rect x="10" y="0" width="18" height="16" rx="4" fill="#e8192c" />
        <rect x="10" y="72" width="18" height="7" rx="1" fill="#e8192c" />
        <rect x="10" y="80" width="18" height="5" rx="1" fill="#a0000a" />
      </g>

      {/* ── Tagline bar ── */}
      <rect x="1" y="147" width="598" height="42" fill="url(#lg-tag)" />
      {/* Round bottom corners */}
      <clipPath id="clip-tag-bot">
        <rect x="1" y="158" width="598" height="31" rx="12" />
      </clipPath>
      <rect x="1" y="158" width="598" height="31" fill="url(#lg-tag)" clipPath="url(#clip-tag-bot)" />
      <rect x="1" y="147" width="598" height="20" fill="url(#lg-tag)" />

      {/* Top border of tagline */}
      <line x1="1" y1="148" x2="599" y2="148" stroke="#e8192c" strokeWidth="1.5" />

      {/* ── Tagline text ── */}
      {/* తెలుగు */}
      <text x="30" y="175"
        fontFamily="'Noto Sans Telugu', 'Arial Unicode MS', sans-serif"
        fontSize="16" fontWeight="600" fill="#d1d5db">
        తెలుగు
      </text>

      {/* న్యూస్ badge */}
      <rect x="108" y="158" width="58" height="22" rx="4" fill="#e8192c" />
      <text x="137" y="174"
        fontFamily="'Noto Sans Telugu', 'Arial Unicode MS', sans-serif"
        fontSize="14" fontWeight="700" fill="#fff" textAnchor="middle">
        న్యూస్
      </text>

      {/* చానల్ */}
      <text x="174" y="175"
        fontFamily="'Noto Sans Telugu', 'Arial Unicode MS', sans-serif"
        fontSize="16" fontWeight="600" fill="#d1d5db">
        చానల్
      </text>

      {/* 24/7 */}
      <text x="252" y="175"
        fontFamily="'Arial Black', Arial, sans-serif"
        fontSize="17" fontWeight="900" fill="#f5c518">
        24/7
      </text>

      {/* Divider pipe */}
      <line x1="298" y1="155" x2="298" y2="184" stroke="#444" strokeWidth="1.5" />

      {/* నిజం.. */}
      <text x="310" y="173"
        fontFamily="'Noto Sans Telugu', 'Arial Unicode MS', sans-serif"
        fontSize="14" fontWeight="500" fill="#9ca3af" fontStyle="italic">
        నిజం..
      </text>

      {/* జనం.. */}
      <text x="365" y="173"
        fontFamily="'Noto Sans Telugu', 'Arial Unicode MS', sans-serif"
        fontSize="14" fontWeight="700" fill="#f5c518" fontStyle="italic">
        జనం..
      </text>

      {/* ముందుకు.... */}
      <text x="420" y="173"
        fontFamily="'Noto Sans Telugu', 'Arial Unicode MS', sans-serif"
        fontSize="14" fontWeight="500" fill="#9ca3af" fontStyle="italic">
        ముందుకు....
      </text>
    </svg>
  );
};

export default AP13Logo;