/* global React */
// Scenes — SVG overlays per filter to transport the subject.
// Each scene has:
//   svg:    a string of <defs><g>...</g></defs><use…/> or full inline SVG fragments to be placed in a 1024x1024 viewBox
//   tint:   optional CSS color overlay
//   tintBlend: blend mode for the tint
//   light:  optional radial light leak gradient
// The same `buildSceneSvg` is used both in the DOM overlay (background-image)
// and in canvas composite (drawn via Image of an SVG data URL).
// =========================================================================

window.SCENES = {
  welcome: {
    label: 'sheares welcome',
    // Subtle orange tinge + freckle sparkles + BIG welcome banner with proper padding.
    svg: `
      <defs>
        <radialGradient id="welcomeGlow" cx="50%" cy="42%" r="68%">
          <stop offset="0" stop-color="#fff5d4" stop-opacity="0.35"/>
          <stop offset="1" stop-color="#ff8a3c" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#welcomeGlow)"/>

      <!-- BIG welcome banner, top, with proper padding -->
      <g transform="translate(512 130) rotate(-3)">
        <path d="M -440 -50 Q -200 -110 0 -60 Q 200 -10 440 -50" fill="none" stroke="#a8542b" stroke-width="2" opacity="0.5"/>
        <path d="M -440 -50 L 440 -50 L 460 70 L 420 50 L 380 70 L 340 50 L 300 70 L 260 50 L 220 70 L 180 50 L 140 70 L 100 50 L 60 70 L 20 50 L -20 70 L -60 50 L -100 70 L -140 50 L -180 70 L -220 50 L -260 70 L -300 50 L -340 70 L -380 50 L -420 70 L -460 50 Z"
              fill="#fff7d4" stroke="#a8542b" stroke-width="5"/>
        <text x="0" y="0" text-anchor="middle" font-family="Caveat,cursive" font-weight="700" font-size="64" fill="#a8542b">welcome to sheares ✦</text>
        <text x="0" y="40" text-anchor="middle" font-family="Quicksand,sans-serif" font-weight="500" font-size="18" fill="#e27a3f" letter-spacing="5">EST. 1985 · BLK A–E</text>
      </g>

      <!-- Freckle sparkles, edges only (face zone stays clear) -->
      <g fill="#fff7d4">
        <circle cx="100" cy="320" r="3"/><circle cx="200" cy="420" r="2"/>
        <circle cx="160" cy="540" r="2.5"/><circle cx="220" cy="660" r="2"/>
        <circle cx="120" cy="780" r="3"/>
        <circle cx="120" cy="280" r="2"/><circle cx="180" cy="500" r="2"/>
        <circle cx="80" cy="620" r="2.5"/>
        <circle cx="824" cy="320" r="2.5"/><circle cx="884" cy="420" r="3"/>
        <circle cx="844" cy="540" r="2"/><circle cx="904" cy="660" r="2.5"/>
        <circle cx="824" cy="780" r="3"/>
        <circle cx="900" cy="280" r="2"/><circle cx="860" cy="500" r="2"/>
        <circle cx="940" cy="620" r="2.5"/>
        <circle cx="500" cy="940" r="3"/><circle cx="620" cy="970" r="2"/>
        <circle cx="380" cy="980" r="2"/>
      </g>
      <g fill="#e27a3f" opacity="0.8">
        <path d="M 130 460 L 133 470 L 143 473 L 133 476 L 130 486 L 127 476 L 117 473 L 127 470 Z"/>
        <path d="M 894 380 L 897 390 L 907 393 L 897 396 L 894 406 L 891 396 L 881 393 L 891 390 Z"/>
        <path d="M 160 720 L 163 730 L 173 733 L 163 736 L 160 746 L 157 736 L 147 733 L 157 730 Z"/>
        <path d="M 860 700 L 863 710 L 873 713 L 863 716 L 860 726 L 857 716 L 847 713 L 857 710 Z"/>
      </g>

      <!-- "est. 2026" stamp bottom -->
      <g transform="translate(512 980) rotate(-2)">
        <text x="0" y="0" text-anchor="middle" font-family="Caveat,cursive" font-weight="700" font-size="30" fill="#a8542b" opacity="0.75">~ est. 2026 ~</text>
      </g>`,
    tint: null, tintBlend: null,
    anchor: 'top',
  },

  academica: {
    label: 'finals grind',
    // Everything pushed to bottom/edges. Equations top band, books + stationery hugging the bottom edge.
    svg: `
      <defs>
        <radialGradient id="lamp2" cx="50%" cy="-6%" r="68%">
          <stop offset="0" stop-color="#ffe28a" stop-opacity="0.85"/>
          <stop offset="0.4" stop-color="#c98a2f" stop-opacity="0.25"/>
          <stop offset="1" stop-color="#0a0502" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="aca-sides" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#1a0d04" stop-opacity="0.45"/>
          <stop offset="0.22" stop-color="#1a0d04" stop-opacity="0"/>
          <stop offset="0.78" stop-color="#1a0d04" stop-opacity="0"/>
          <stop offset="1" stop-color="#1a0d04" stop-opacity="0.45"/>
        </linearGradient>
        <linearGradient id="aca-bottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1a0d04" stop-opacity="0"/>
          <stop offset="1" stop-color="#1a0d04" stop-opacity="0.6"/>
        </linearGradient>
      </defs>

      <rect width="1024" height="1024" fill="url(#lamp2)"/>
      <rect width="1024" height="1024" fill="url(#aca-sides)"/>

      <!-- Wood beam top -->
      <rect x="0" y="0" width="1024" height="34" fill="#1f0d04"/>
      <rect x="0" y="32" width="1024" height="6" fill="#5a3216"/>

      <!-- ACADEMICA banner sub-label -->
      <g transform="translate(512 86)">
        <rect x="-220" y="-32" width="440" height="64" rx="32" fill="#fff7d4" stroke="#5a3216" stroke-width="4"/>
        <text x="0" y="14" text-anchor="middle" font-family="Caveat,cursive" font-weight="700" font-size="40" fill="#5a3216">~ Academica Hall ~</text>
      </g>

      <!-- Equations across TOP -->
      <g font-family="Quicksand,sans-serif" fill="#fff7d4">
        <text x="180" y="200" font-size="40" transform="rotate(-6 180 200)" opacity="0.95">∫ x² dx</text>
        <text x="420" y="190" font-size="38" transform="rotate(4 420 190)" opacity="0.9">E = mc²</text>
        <text x="620" y="200" font-size="38" transform="rotate(-3 620 200)" opacity="0.9">π · r²</text>
        <text x="830" y="194" font-size="36" transform="rotate(8 830 194)" opacity="0.9">dy/dx</text>
        <text x="280" y="252" font-size="28" transform="rotate(-3 280 252)" opacity="0.75">a² + b² = c²</text>
        <text x="540" y="252" font-size="28" transform="rotate(6 540 252)" opacity="0.75">∑ ƒ(x)</text>
        <text x="760" y="252" font-size="26" transform="rotate(-4 760 252)" opacity="0.7">F = ma</text>
      </g>

      <!-- Bottom dark vignette -->
      <rect x="0" y="780" width="1024" height="244" fill="url(#aca-bottom)"/>

      <!-- LEFT bottom: 3 textbooks, hugging bottom edge -->
      <g transform="translate(-10 820)">
        <g><rect x="0" y="0" width="180" height="62" fill="#7c3a1c" stroke="#0a0502" stroke-width="3"/>
           <line x1="6" y1="6" x2="6" y2="56" stroke="#e2b045" stroke-width="3"/>
           <text x="90" y="38" text-anchor="middle" font-family="Quicksand,sans-serif" font-weight="700" font-size="22" fill="#fff7d4">CALC II</text></g>
        <g transform="translate(16 62)"><rect x="0" y="0" width="186" height="70" fill="#5a2e14" stroke="#0a0502" stroke-width="3"/>
           <line x1="6" y1="6" x2="6" y2="64" stroke="#e2b045" stroke-width="3"/>
           <text x="93" y="44" text-anchor="middle" font-family="Quicksand,sans-serif" font-weight="700" font-size="22" fill="#e2b045">ACADEMICA</text></g>
        <g transform="translate(-4 132)"><rect x="0" y="0" width="180" height="60" fill="#a5602a" stroke="#0a0502" stroke-width="3"/>
           <text x="90" y="38" text-anchor="middle" font-family="Quicksand,sans-serif" font-weight="700" font-size="22" fill="#1f0d04">PHYSICS I</text></g>
      </g>

      <!-- A+ paper, hugging bottom-left, on top of books -->
      <g transform="translate(190 880) rotate(-10)">
        <rect x="0" y="0" width="120" height="100" fill="#fff7d4" stroke="#5a3216" stroke-width="2"/>
        <line x1="10" y1="32" x2="80" y2="32" stroke="#a8542b" stroke-width="1.5"/>
        <line x1="10" y1="48" x2="70" y2="48" stroke="#a8542b" stroke-width="1.5"/>
        <line x1="10" y1="64" x2="80" y2="64" stroke="#a8542b" stroke-width="1.5"/>
        <line x1="10" y1="80" x2="68" y2="80" stroke="#a8542b" stroke-width="1.5"/>
        <text x="98" y="28" font-family="Caveat,cursive" font-weight="700" font-size="38" fill="#d63b3b">A+</text>
        <circle cx="96" cy="18" r="20" fill="none" stroke="#d63b3b" stroke-width="3"/>
      </g>

      <!-- RIGHT bottom: pencil cup, hugging bottom edge -->
      <g transform="translate(900 880)">
        <rect x="-58" y="40" width="116" height="110" rx="6" fill="#a8542b" stroke="#0a0502" stroke-width="3"/>
        <ellipse cx="0" cy="40" rx="58" ry="14" fill="#7c3a1c" stroke="#0a0502" stroke-width="3"/>
        <ellipse cx="0" cy="40" rx="52" ry="9" fill="#3a1a08"/>
        <g transform="translate(-30 -58) rotate(-12)">
          <rect x="-7" y="0" width="14" height="98" fill="#e2b045" stroke="#0a0502" stroke-width="2"/>
          <polygon points="-7,98 0,116 7,98" fill="#f4d680" stroke="#0a0502" stroke-width="2"/>
          <rect x="-7" y="-12" width="14" height="14" fill="#e2746a" stroke="#0a0502" stroke-width="2"/>
        </g>
        <g transform="translate(-4 -64)">
          <rect x="-5" y="0" width="10" height="106" fill="#2563eb" stroke="#0a0502" stroke-width="2"/>
          <polygon points="-5,106 0,120 5,106" fill="#1a3d8a" stroke="#0a0502" stroke-width="2"/>
          <rect x="-6" y="-10" width="12" height="14" fill="#7afcff" stroke="#0a0502" stroke-width="2"/>
        </g>
        <g transform="translate(22 -60) rotate(14)">
          <rect x="-5" y="0" width="10" height="106" fill="#d63b3b" stroke="#0a0502" stroke-width="2"/>
          <polygon points="-5,106 0,120 5,106" fill="#7a1f1f" stroke="#0a0502" stroke-width="2"/>
          <rect x="-6" y="-10" width="12" height="14" fill="#ffd34d" stroke="#0a0502" stroke-width="2"/>
        </g>
      </g>

      <!-- Coffee mug, bottom-right corner (under pencil cup, peeking) -->
      <g transform="translate(740 950)">
        <path d="M -8 -38 Q 2 -52 -6 -68 Q -10 -80 -2 -92" stroke="#fff7d4" stroke-width="4" fill="none" opacity="0.85"/>
        <path d="M 12 -42 Q 22 -56 16 -72 Q 10 -82 18 -92" stroke="#fff7d4" stroke-width="4" fill="none" opacity="0.7"/>
        <rect x="-36" y="-28" width="72" height="56" rx="6" fill="#fff7d4" stroke="#3a1a08" stroke-width="3"/>
        <path d="M 36 -16 Q 56 -12 56 6 Q 56 22 36 22" stroke="#3a1a08" stroke-width="3" fill="none"/>
        <ellipse cx="0" cy="-24" rx="32" ry="7" fill="#3a1a08"/>
      </g>

      <!-- Sticky note: upper-right corner area -->
      <g transform="translate(870 400) rotate(8)">
        <rect x="-60" y="-50" width="120" height="100" fill="#ff8a8a"/>
        <rect x="-60" y="-50" width="120" height="100" fill="#000" opacity="0.05"/>
        <text x="0" y="-12" text-anchor="middle" font-family="Caveat,cursive" font-weight="700" font-size="22" fill="#5a1010">exam in</text>
        <text x="0" y="22" text-anchor="middle" font-family="Caveat,cursive" font-weight="700" font-size="32" fill="#5a1010">2 DAYS</text>
      </g>
      <!-- Sticky note: upper-left corner area -->
      <g transform="translate(150 420) rotate(-10)">
        <rect x="-55" y="-46" width="110" height="92" fill="#ffe04d"/>
        <rect x="-55" y="-46" width="110" height="92" fill="#000" opacity="0.06"/>
        <text x="0" y="-10" text-anchor="middle" font-family="Caveat,cursive" font-weight="700" font-size="22" fill="#3a1a08">study</text>
        <text x="0" y="20" text-anchor="middle" font-family="Caveat,cursive" font-weight="700" font-size="22" fill="#3a1a08">harder!</text>
      </g>`,
    tint: null, tintBlend: null,
    anchor: 'bottom',
  },

  pond: {
    label: 'sakura zen',
    // Block B Pond banner top, pink sakura, branches top-edges, koi/lily-pads bottom, NO objects in center.
    svg: `
      <defs>
        <linearGradient id="sakura-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffd7e5" stop-opacity="0.55"/>
          <stop offset="0.6" stop-color="#f7c5d4" stop-opacity="0.32"/>
          <stop offset="1" stop-color="#d65170" stop-opacity="0.2"/>
        </linearGradient>
        <radialGradient id="sakura-glow" cx="50%" cy="44%" r="58%">
          <stop offset="0" stop-color="#fff0f4" stop-opacity="0.6"/>
          <stop offset="1" stop-color="#d65170" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="pond-water2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#a8d5e8" stop-opacity="0.4"/>
          <stop offset="1" stop-color="#4a78a8" stop-opacity="0.75"/>
        </linearGradient>
      </defs>

      <rect width="1024" height="1024" fill="url(#sakura-sky)"/>
      <rect width="1024" height="1024" fill="url(#sakura-glow)"/>

      <!-- BLOCK B POND banner top -->
      <g transform="translate(512 80)">
        <rect x="-230" y="-38" width="460" height="76" rx="38" fill="#fff0f4" stroke="#d65170" stroke-width="5"/>
        <text x="0" y="14" text-anchor="middle" font-family="Caveat,cursive" font-weight="700" font-size="40" fill="#a8294f">✿ Block B Pond ✿</text>
      </g>

      <!-- Cherry blossom branch top-left, tucked above face zone -->
      <g transform="translate(0 180)">
        <path d="M 0 0 Q 80 50 180 36 Q 260 22 320 56" fill="none" stroke="#3a1a08" stroke-width="5" stroke-linecap="round"/>
        <path d="M 100 30 Q 130 6 156 -12" fill="none" stroke="#3a1a08" stroke-width="3"/>
        <g><circle cx="50" cy="20" r="14" fill="#fff0f4"/>
           <circle cx="40" cy="14" r="9" fill="#f7c5d4"/><circle cx="60" cy="14" r="9" fill="#f7c5d4"/>
           <circle cx="40" cy="26" r="9" fill="#f7c5d4"/><circle cx="60" cy="26" r="9" fill="#f7c5d4"/>
           <circle cx="50" cy="20" r="4" fill="#e27a3f"/></g>
        <g transform="translate(140 -10)">
           <circle cx="0" cy="0" r="13" fill="#fff0f4"/>
           <circle cx="-9" cy="-4" r="8" fill="#f7c5d4"/><circle cx="9" cy="-4" r="8" fill="#f7c5d4"/>
           <circle cx="-9" cy="6" r="8" fill="#f7c5d4"/><circle cx="9" cy="6" r="8" fill="#f7c5d4"/>
           <circle cx="0" cy="0" r="3" fill="#e27a3f"/></g>
        <g transform="translate(230 26)">
           <circle cx="0" cy="0" r="12" fill="#fff0f4"/>
           <circle cx="-8" cy="-4" r="8" fill="#f7c5d4"/><circle cx="8" cy="-4" r="8" fill="#f7c5d4"/>
           <circle cx="-8" cy="6" r="8" fill="#f7c5d4"/><circle cx="8" cy="6" r="8" fill="#f7c5d4"/></g>
        <g transform="translate(310 56)">
           <circle cx="0" cy="0" r="12" fill="#fff0f4"/>
           <circle cx="-8" cy="-4" r="8" fill="#f7c5d4"/><circle cx="8" cy="-4" r="8" fill="#f7c5d4"/>
           <circle cx="-8" cy="6" r="8" fill="#f7c5d4"/><circle cx="8" cy="6" r="8" fill="#f7c5d4"/></g>
      </g>

      <!-- Cherry blossom branch top-right (mirrored) -->
      <g transform="translate(1024 180) scale(-1 1)">
        <path d="M 0 0 Q 80 50 180 36 Q 260 22 320 56" fill="none" stroke="#3a1a08" stroke-width="5" stroke-linecap="round"/>
        <path d="M 100 30 Q 130 6 156 -12" fill="none" stroke="#3a1a08" stroke-width="3"/>
        <g><circle cx="50" cy="20" r="14" fill="#fff0f4"/>
           <circle cx="40" cy="14" r="9" fill="#f7c5d4"/><circle cx="60" cy="14" r="9" fill="#f7c5d4"/>
           <circle cx="40" cy="26" r="9" fill="#f7c5d4"/><circle cx="60" cy="26" r="9" fill="#f7c5d4"/>
           <circle cx="50" cy="20" r="4" fill="#e27a3f"/></g>
        <g transform="translate(140 -10)">
           <circle cx="0" cy="0" r="13" fill="#fff0f4"/>
           <circle cx="-9" cy="-4" r="8" fill="#f7c5d4"/><circle cx="9" cy="-4" r="8" fill="#f7c5d4"/>
           <circle cx="-9" cy="6" r="8" fill="#f7c5d4"/><circle cx="9" cy="6" r="8" fill="#f7c5d4"/>
           <circle cx="0" cy="0" r="3" fill="#e27a3f"/></g>
        <g transform="translate(230 26)">
           <circle cx="0" cy="0" r="12" fill="#fff0f4"/>
           <circle cx="-8" cy="-4" r="8" fill="#f7c5d4"/><circle cx="8" cy="-4" r="8" fill="#f7c5d4"/>
           <circle cx="-8" cy="6" r="8" fill="#f7c5d4"/><circle cx="8" cy="6" r="8" fill="#f7c5d4"/></g>
        <g transform="translate(310 56)">
           <circle cx="0" cy="0" r="12" fill="#fff0f4"/>
           <circle cx="-8" cy="-4" r="8" fill="#f7c5d4"/><circle cx="8" cy="-4" r="8" fill="#f7c5d4"/>
           <circle cx="-8" cy="6" r="8" fill="#f7c5d4"/><circle cx="8" cy="6" r="8" fill="#f7c5d4"/></g>
      </g>

      <!-- Petals: edges only -->
      <g>
        <ellipse cx="90" cy="360" rx="11" ry="6" fill="#f7c5d4" transform="rotate(20 90 360)"/>
        <ellipse cx="150" cy="440" rx="9" ry="5" fill="#fff0f4" transform="rotate(-30 150 440)"/>
        <ellipse cx="80" cy="540" rx="10" ry="5" fill="#f7c5d4" transform="rotate(45 80 540)"/>
        <ellipse cx="150" cy="640" rx="9" ry="5" fill="#fff0f4" transform="rotate(-15 150 640)"/>
        <ellipse cx="90" cy="740" rx="10" ry="6" fill="#f7c5d4" transform="rotate(25 90 740)"/>

        <ellipse cx="934" cy="360" rx="11" ry="6" fill="#f7c5d4" transform="rotate(-20 934 360)"/>
        <ellipse cx="874" cy="440" rx="9" ry="5" fill="#fff0f4" transform="rotate(30 874 440)"/>
        <ellipse cx="944" cy="540" rx="10" ry="5" fill="#f7c5d4" transform="rotate(-45 944 540)"/>
        <ellipse cx="874" cy="640" rx="9" ry="5" fill="#fff0f4" transform="rotate(15 874 640)"/>
        <ellipse cx="934" cy="740" rx="10" ry="6" fill="#f7c5d4" transform="rotate(-25 934 740)"/>
      </g>

      <!-- Pond water -->
      <rect x="0" y="870" width="1024" height="154" fill="url(#pond-water2)"/>

      <!-- Lily pads -->
      <g transform="translate(140 970)">
        <ellipse cx="0" cy="0" rx="90" ry="40" fill="#2a7d4a"/>
        <path d="M 0 0 L 76 -8 A 90 40 0 0 1 66 22 Z" fill="#1e5a35"/>
      </g>
      <g transform="translate(880 990)">
        <ellipse cx="0" cy="0" rx="95" ry="42" fill="#2a7d4a"/>
        <path d="M 0 0 L -76 -8 A 95 42 0 0 0 -66 22 Z" fill="#1e5a35"/>
      </g>

      <!-- Lotus -->
      <g transform="translate(180 950)">
        <ellipse cx="-12" cy="0" rx="12" ry="18" fill="#f7c5d4" transform="rotate(-25 -12 0)"/>
        <ellipse cx="12" cy="0" rx="12" ry="18" fill="#f7c5d4" transform="rotate(25 12 0)"/>
        <ellipse cx="0" cy="-8" rx="12" ry="20" fill="#fff0f4"/>
        <circle cx="0" cy="-6" r="5" fill="#f8e3a0"/>
      </g>

      <!-- Koi -->
      <g transform="translate(420 960) rotate(-10)">
        <ellipse cx="0" cy="0" rx="38" ry="12" fill="#ff7a3a"/>
        <path d="M 28 0 L 48 -14 L 52 14 Z" fill="#ff7a3a"/>
        <ellipse cx="-10" cy="-3" rx="9" ry="5" fill="#fff"/>
      </g>
      <g transform="translate(700 990) rotate(8)">
        <ellipse cx="0" cy="0" rx="32" ry="10" fill="#ffae6a"/>
        <path d="M 24 0 L 40 -10 L 42 10 Z" fill="#ffae6a"/>
      </g>

      <!-- Ripples -->
      <g fill="none" stroke="#fff0f4" stroke-width="2" opacity="0.55">
        <ellipse cx="500" cy="920" rx="80" ry="5"/>
        <ellipse cx="500" cy="940" rx="120" ry="6"/>
      </g>`,
    tint: null, tintBlend: null,
    anchor: 'bottom',
  },

  c5: {
    label: 'main character',
    // Heavy vignette + sparkle aura + paparazzi flashes + bold magazine frame
    svg: `
      <defs>
        <radialGradient id="c5-spot" cx="50%" cy="50%" r="55%">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
          <stop offset="0.6" stop-color="#000" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity="0.85"/>
        </radialGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#c5-spot)"/>
      <!-- Magazine frame -->
      <rect x="20" y="20" width="984" height="984" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="14 8"/>
      <!-- BADDIES tilted text -->
      <g transform="translate(150 130) rotate(-12)">
        <rect x="-130" y="-44" width="260" height="80" fill="#ff2e5b"/>
        <text x="0" y="14" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="56" fill="#fff">BADDIE</text>
      </g>
      <g transform="translate(880 880) rotate(8)">
        <rect x="-100" y="-30" width="200" height="60" fill="#fff"/>
        <text x="0" y="10" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="40" fill="#ff2e5b">★ C5 ★</text>
      </g>
      <!-- Star sparkles -->
      <g fill="#fff">
        <path d="M 200 300 L 210 320 L 232 326 L 214 340 L 220 365 L 200 350 L 180 365 L 186 340 L 168 326 L 190 320 Z"/>
        <path d="M 820 360 L 826 372 L 840 376 L 829 385 L 832 400 L 820 391 L 808 400 L 811 385 L 800 376 L 814 372 Z" />
        <path d="M 880 600 L 888 616 L 904 620 L 893 632 L 896 648 L 880 640 L 864 648 L 867 632 L 856 620 L 872 616 Z"/>
        <path d="M 140 720 L 148 736 L 164 740 L 153 752 L 156 768 L 140 760 L 124 768 L 127 752 L 116 740 L 132 736 Z"/>
      </g>
      <!-- Camera flash bursts -->
      <g fill="#fff" opacity="0.8">
        <circle cx="60" cy="500" r="40"/>
        <circle cx="960" cy="200" r="32"/>
        <circle cx="120" cy="940" r="28"/>
      </g>`,
    tint: 'rgba(255, 30, 80, 0.18)',
    tintBlend: 'screen',
    anchor: 'center',
  },

  dee: {
    label: 'dee champions',
    // Varsity sports block: pennants up top, big varsity D, scoreboard, sports balls, championship vibes
    svg: `
      <defs>
        <linearGradient id="dee-sky2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1f4a8a" stop-opacity="0.55"/>
          <stop offset="0.5" stop-color="#2563eb" stop-opacity="0.3"/>
          <stop offset="1" stop-color="#16a34a" stop-opacity="0.2"/>
        </linearGradient>
        <radialGradient id="stadium-light" cx="50%" cy="6%" r="45%">
          <stop offset="0" stop-color="#fff7c4" stop-opacity="0.75"/>
          <stop offset="1" stop-color="#fff7c4" stop-opacity="0"/>
        </radialGradient>
        <pattern id="track-lanes" x="0" y="0" width="60" height="12" patternUnits="userSpaceOnUse">
          <rect width="60" height="12" fill="#d63b3b"/>
          <rect x="0" y="0" width="60" height="2" fill="#fff7d4" opacity="0.6"/>
        </pattern>
      </defs>

      <rect width="1024" height="1024" fill="url(#dee-sky2)"/>
      <rect width="1024" height="1024" fill="url(#stadium-light)"/>

      <!-- Stadium floodlights, two corners -->
      <g transform="translate(60 60)">
        <line x1="0" y1="0" x2="0" y2="-30" stroke="#1f0d04" stroke-width="4"/>
        <rect x="-26" y="-50" width="52" height="22" rx="4" fill="#1f0d04" stroke="#0a0502" stroke-width="2"/>
        <circle cx="-14" cy="-39" r="5" fill="#fff7c4"/>
        <circle cx="0" cy="-39" r="5" fill="#fff7c4"/>
        <circle cx="14" cy="-39" r="5" fill="#fff7c4"/>
        <path d="M -26 -28 L -90 80 L 60 80 L 26 -28 Z" fill="#fff7c4" opacity="0.18"/>
      </g>
      <g transform="translate(964 60)">
        <line x1="0" y1="0" x2="0" y2="-30" stroke="#1f0d04" stroke-width="4"/>
        <rect x="-26" y="-50" width="52" height="22" rx="4" fill="#1f0d04" stroke="#0a0502" stroke-width="2"/>
        <circle cx="-14" cy="-39" r="5" fill="#fff7c4"/>
        <circle cx="0" cy="-39" r="5" fill="#fff7c4"/>
        <circle cx="14" cy="-39" r="5" fill="#fff7c4"/>
        <path d="M 26 -28 L 90 80 L -60 80 L -26 -28 Z" fill="#fff7c4" opacity="0.18"/>
      </g>

      <!-- Pennant string across top -->
      <g>
        <path d="M 0 60 Q 256 30 512 60 T 1024 60" fill="none" stroke="#fff7d4" stroke-width="2" opacity="0.7"/>
        <g><polygon points="100,50 130,50 115,108" fill="#16a34a" stroke="#fff" stroke-width="2"/>
           <text x="115" y="74" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="18" fill="#fff">D</text></g>
        <g><polygon points="200,56 230,56 215,114" fill="#d63b3b" stroke="#fff" stroke-width="2"/>
           <text x="215" y="80" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="18" fill="#fff">E</text></g>
        <g><polygon points="300,52 330,52 315,110" fill="#e2b045" stroke="#fff" stroke-width="2"/>
           <text x="315" y="76" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="18" fill="#fff">E</text></g>
        <g><polygon points="400,50 430,50 415,108" fill="#16a34a" stroke="#fff" stroke-width="2"/></g>
        <g><polygon points="500,50 530,50 515,108" fill="#d63b3b" stroke="#fff" stroke-width="2"/>
           <text x="515" y="76" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="14" fill="#fff">★</text></g>
        <g><polygon points="600,50 630,50 615,108" fill="#16a34a" stroke="#fff" stroke-width="2"/></g>
        <g><polygon points="700,52 730,52 715,110" fill="#e2b045" stroke="#fff" stroke-width="2"/>
           <text x="715" y="76" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="18" fill="#fff">G</text></g>
        <g><polygon points="800,56 830,56 815,114" fill="#d63b3b" stroke="#fff" stroke-width="2"/>
           <text x="815" y="80" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="18" fill="#fff">O</text></g>
        <g><polygon points="900,52 930,52 915,110" fill="#16a34a" stroke="#fff" stroke-width="2"/>
           <text x="915" y="76" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="18" fill="#fff">!</text></g>
      </g>

      <!-- BIG varsity "D" left edge -->
      <g transform="translate(110 380)" opacity="0.92">
        <!-- shield -->
        <path d="M -80 -80 L 80 -80 L 80 40 Q 80 110 0 130 Q -80 110 -80 40 Z"
              fill="#16a34a" stroke="#fff" stroke-width="6"/>
        <path d="M -68 -68 L 68 -68 L 68 38 Q 68 96 0 114 Q -68 96 -68 38 Z"
              fill="none" stroke="#fff" stroke-width="2"/>
        <!-- letter D -->
        <text x="0" y="46" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="148" fill="#fff" letter-spacing="-4">D</text>
        <!-- two small stars top -->
        <text x="-38" y="-32" text-anchor="middle" font-family="Quicksand,sans-serif" font-weight="700" font-size="22" fill="#fff">★</text>
        <text x="38" y="-32" text-anchor="middle" font-family="Quicksand,sans-serif" font-weight="700" font-size="22" fill="#fff">★</text>
      </g>

      <!-- Scoreboard right edge -->
      <g transform="translate(900 380)">
        <rect x="-100" y="-90" width="200" height="180" rx="10" fill="#1f0d04" stroke="#fff" stroke-width="4"/>
        <rect x="-90" y="-80" width="180" height="36" fill="#16a34a"/>
        <text x="0" y="-56" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="22" fill="#fff" letter-spacing="3">SCOREBOARD</text>
        <text x="-50" y="-12" text-anchor="middle" font-family="Quicksand,sans-serif" font-weight="700" font-size="18" fill="#7afcff">DEE</text>
        <text x="50" y="-12" text-anchor="middle" font-family="Quicksand,sans-serif" font-weight="700" font-size="18" fill="#ff8a8a">VS</text>
        <!-- LED-style scores -->
        <text x="-50" y="48" text-anchor="middle" font-family="Quicksand,sans-serif" font-weight="700" font-size="58" fill="#ffe04d">11</text>
        <text x="50" y="48" text-anchor="middle" font-family="Quicksand,sans-serif" font-weight="700" font-size="58" fill="#ff8a8a">3</text>
        <line x1="0" y1="-10" x2="0" y2="60" stroke="#fff" stroke-width="2" opacity="0.5"/>
        <text x="0" y="80" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="13" fill="#fff" letter-spacing="2">CHAMPIONS</text>
      </g>

      <!-- Bottom track lanes -->
      <rect x="0" y="900" width="1024" height="20" fill="#d63b3b"/>
      <rect x="0" y="920" width="1024" height="2" fill="#fff7d4"/>
      <rect x="0" y="922" width="1024" height="18" fill="#a8542b"/>
      <rect x="0" y="940" width="1024" height="2" fill="#fff7d4"/>
      <rect x="0" y="942" width="1024" height="20" fill="#d63b3b"/>
      <rect x="0" y="962" width="1024" height="2" fill="#fff7d4"/>
      <rect x="0" y="964" width="1024" height="60" fill="#16a34a"/>
      <!-- field lines on grass -->
      <line x1="0" y1="994" x2="1024" y2="994" stroke="#fff" stroke-width="3"/>

      <!-- Sports balls bottom row -->
      <!-- Soccer ball -->
      <g transform="translate(150 970)">
        <circle cx="0" cy="0" r="32" fill="#fff" stroke="#1f0d04" stroke-width="3"/>
        <polygon points="0,-22 13,-12 8,8 -8,8 -13,-12" fill="#1f0d04"/>
        <polygon points="22,-2 28,16 12,22 8,8" fill="#1f0d04"/>
        <polygon points="-22,-2 -28,16 -12,22 -8,8" fill="#1f0d04"/>
        <line x1="-22" y1="-2" x2="-13" y2="-12" stroke="#1f0d04" stroke-width="2"/>
        <line x1="22" y1="-2" x2="13" y2="-12" stroke="#1f0d04" stroke-width="2"/>
      </g>
      <!-- Basketball -->
      <g transform="translate(280 985)">
        <circle cx="0" cy="0" r="30" fill="#e27a3f" stroke="#1f0d04" stroke-width="3"/>
        <line x1="-30" y1="0" x2="30" y2="0" stroke="#1f0d04" stroke-width="2.5"/>
        <line x1="0" y1="-30" x2="0" y2="30" stroke="#1f0d04" stroke-width="2.5"/>
        <path d="M -28 -10 Q 0 -2 28 -10" fill="none" stroke="#1f0d04" stroke-width="2.5"/>
        <path d="M -28 10 Q 0 2 28 10" fill="none" stroke="#1f0d04" stroke-width="2.5"/>
      </g>
      <!-- Trophy in center-bottom -->
      <g transform="translate(420 960)">
        <rect x="-44" y="44" width="88" height="22" rx="3" fill="#a8542b" stroke="#1f0d04" stroke-width="2"/>
        <rect x="-36" y="28" width="72" height="18" fill="#5a3216" stroke="#1f0d04" stroke-width="2"/>
        <path d="M -36 28 L -32 -36 L 32 -36 L 36 28 Z" fill="#e2b045" stroke="#1f0d04" stroke-width="2.5"/>
        <ellipse cx="0" cy="-36" rx="32" ry="9" fill="#f4d680" stroke="#1f0d04" stroke-width="2.5"/>
        <path d="M -32 -26 Q -56 -26 -56 -10 Q -56 6 -32 6" fill="none" stroke="#e2b045" stroke-width="7"/>
        <path d="M -32 -26 Q -56 -26 -56 -10 Q -56 6 -32 6" fill="none" stroke="#1f0d04" stroke-width="2"/>
        <path d="M 32 -26 Q 56 -26 56 -10 Q 56 6 32 6" fill="none" stroke="#e2b045" stroke-width="7"/>
        <path d="M 32 -26 Q 56 -26 56 -10 Q 56 6 32 6" fill="none" stroke="#1f0d04" stroke-width="2"/>
        <text x="0" y="4" text-anchor="middle" font-family="Quicksand,sans-serif" font-weight="700" font-size="32" fill="#1f0d04">★</text>
        <text x="0" y="-50" text-anchor="middle" font-family="Caveat,cursive" font-weight="700" font-size="22" fill="#1f0d04">'25</text>
      </g>
      <!-- Tennis ball -->
      <g transform="translate(640 985)">
        <circle cx="0" cy="0" r="22" fill="#dbe845" stroke="#1f0d04" stroke-width="2"/>
        <path d="M -22 0 Q -10 -16 10 -8 Q 22 4 22 0" fill="none" stroke="#fff" stroke-width="2.5"/>
        <path d="M -22 0 Q -10 16 10 8 Q 22 -4 22 0" fill="none" stroke="#fff" stroke-width="2.5"/>
      </g>
      <!-- American football -->
      <g transform="translate(760 975) rotate(-22)">
        <ellipse cx="0" cy="0" rx="36" ry="20" fill="#7c3a1c" stroke="#1f0d04" stroke-width="3"/>
        <line x1="-12" y1="0" x2="12" y2="0" stroke="#fff" stroke-width="3"/>
        <line x1="-12" y1="-4" x2="-12" y2="4" stroke="#fff" stroke-width="2"/>
        <line x1="-6" y1="-5" x2="-6" y2="5" stroke="#fff" stroke-width="2"/>
        <line x1="0" y1="-5" x2="0" y2="5" stroke="#fff" stroke-width="2"/>
        <line x1="6" y1="-5" x2="6" y2="5" stroke="#fff" stroke-width="2"/>
        <line x1="12" y1="-4" x2="12" y2="4" stroke="#fff" stroke-width="2"/>
      </g>
      <!-- Medal -->
      <g transform="translate(880 970)">
        <path d="M -16 -28 L 0 0 L 16 -28" fill="none" stroke="#d63b3b" stroke-width="4"/>
        <circle cx="0" cy="14" r="24" fill="#e2b045" stroke="#a8542b" stroke-width="3"/>
        <circle cx="0" cy="14" r="16" fill="#f4d680" stroke="#a8542b" stroke-width="2"/>
        <text x="0" y="22" text-anchor="middle" font-family="Quicksand,sans-serif" font-weight="700" font-size="20" fill="#a8542b">1</text>
      </g>

      <!-- "DEE CHAMPIONS" mega-banner across mid-bottom -->
      <g transform="translate(512 850)">
        <rect x="-240" y="-32" width="480" height="64" rx="32" fill="#fff7d4" stroke="#16a34a" stroke-width="5"/>
        <text x="0" y="16" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="38" fill="#16a34a" letter-spacing="3">DEE CHAMPIONS</text>
      </g>`,
    tint: null, tintBlend: null,
    anchor: 'bottom',
  },

  elmo: {
    label: 'elmo street nights',
    // Neon ELMO ST + OPEN 24H signs corners, fuzzy mascots in bottom corners. Center clear (face zone).
    svg: `
      <defs>
        <radialGradient id="elmo-haze" cx="50%" cy="55%" r="65%">
          <stop offset="0" stop-color="#ff4dd8" stop-opacity="0.3"/>
          <stop offset="1" stop-color="#1a0628" stop-opacity="0.65"/>
        </radialGradient>
        <linearGradient id="elmo-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1a0628" stop-opacity="0"/>
          <stop offset="1" stop-color="#1a0628" stop-opacity="0.92"/>
        </linearGradient>
      </defs>

      <rect width="1024" height="1024" fill="url(#elmo-haze)"/>

      <!-- Bokeh, edges only -->
      <g>
        <circle cx="80" cy="320" r="30" fill="#ff4dd8" opacity="0.55"/>
        <circle cx="60" cy="460" r="22" fill="#7afcff" opacity="0.5"/>
        <circle cx="100" cy="600" r="26" fill="#ffe04d" opacity="0.5"/>
        <circle cx="60" cy="740" r="22" fill="#a64dff" opacity="0.5"/>
        <circle cx="944" cy="320" r="30" fill="#ffe04d" opacity="0.55"/>
        <circle cx="964" cy="460" r="22" fill="#ff4dd8" opacity="0.5"/>
        <circle cx="924" cy="600" r="26" fill="#7afcff" opacity="0.5"/>
        <circle cx="964" cy="740" r="22" fill="#a64dff" opacity="0.5"/>
      </g>

      <!-- ELMO ST. neon sign top-left -->
      <g transform="translate(170 110) rotate(-8)">
        <rect x="-130" y="-50" width="260" height="100" rx="12" fill="#1a0628" stroke="#ff4dd8" stroke-width="6"/>
        <rect x="-122" y="-42" width="244" height="84" rx="8" fill="none" stroke="#ff8de8" stroke-width="2"/>
        <text x="0" y="16" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="44" fill="#ff8de8" style="filter: drop-shadow(0 0 12px #ff4dd8)">ELMO ST.</text>
      </g>

      <!-- OPEN 24H neon top-right -->
      <g transform="translate(840 160) rotate(6)">
        <rect x="-110" y="-36" width="220" height="72" rx="10" fill="#1a0628" stroke="#7afcff" stroke-width="5"/>
        <text x="0" y="12" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="28" fill="#7afcff" style="filter: drop-shadow(0 0 10px #7afcff)">OPEN 24H</text>
      </g>

      <!-- Hanging lantern garland -->
      <g>
        <path d="M 0 60 Q 256 30 512 60 T 1024 60" fill="none" stroke="#ff4dd8" stroke-width="2" opacity="0.6"/>
        <line x1="380" y1="48" x2="380" y2="80" stroke="#ff4dd8" stroke-width="2"/>
        <circle cx="380" cy="96" r="16" fill="#ffd34d" opacity="0.95" style="filter: drop-shadow(0 0 14px #ffd34d)"/>
        <line x1="512" y1="44" x2="512" y2="68" stroke="#ff4dd8" stroke-width="2"/>
        <circle cx="512" cy="82" r="12" fill="#ff4dd8" opacity="0.95" style="filter: drop-shadow(0 0 14px #ff4dd8)"/>
        <line x1="640" y1="48" x2="640" y2="80" stroke="#ff4dd8" stroke-width="2"/>
        <circle cx="640" cy="96" r="14" fill="#7afcff" opacity="0.95" style="filter: drop-shadow(0 0 14px #7afcff)"/>
      </g>

      <!-- Street ground gradient -->
      <rect x="0" y="780" width="1024" height="244" fill="url(#elmo-ground)"/>

      <!-- Fuzzy mascot — bottom-LEFT corner -->
      <g transform="translate(120 940)">
        <ellipse cx="0" cy="60" rx="58" ry="14" fill="#000" opacity="0.4"/>
        <g fill="#e23a3a">
          <circle cx="0" cy="0" r="58"/>
          <circle cx="-42" cy="-18" r="11"/><circle cx="-48" cy="0" r="11"/><circle cx="-42" cy="20" r="11"/>
          <circle cx="42" cy="-18" r="11"/><circle cx="48" cy="0" r="11"/><circle cx="42" cy="20" r="11"/>
          <circle cx="-26" cy="-46" r="10"/><circle cx="0" cy="-54" r="11"/><circle cx="26" cy="-46" r="10"/>
        </g>
        <circle cx="-14" cy="-10" r="15" fill="#fff" stroke="#1f0d04" stroke-width="2"/>
        <circle cx="14" cy="-10" r="15" fill="#fff" stroke="#1f0d04" stroke-width="2"/>
        <circle cx="-12" cy="-8" r="6" fill="#1f0d04"/>
        <circle cx="17" cy="-8" r="6" fill="#1f0d04"/>
        <ellipse cx="0" cy="10" rx="8" ry="6" fill="#ff8a3c" stroke="#1f0d04" stroke-width="2"/>
        <path d="M -12 22 Q 0 32 12 22" fill="none" stroke="#1f0d04" stroke-width="3" stroke-linecap="round"/>
      </g>

      <!-- Fuzzy mascot — bottom-RIGHT corner -->
      <g transform="translate(910 920)">
        <ellipse cx="0" cy="76" rx="48" ry="12" fill="#000" opacity="0.4"/>
        <g fill="#ffd34d">
          <ellipse cx="0" cy="0" rx="50" ry="74"/>
          <circle cx="-40" cy="-28" r="10"/><circle cx="-46" cy="-4" r="11"/><circle cx="-40" cy="24" r="10"/>
          <circle cx="40" cy="-28" r="10"/><circle cx="46" cy="-4" r="11"/><circle cx="40" cy="24" r="10"/>
          <circle cx="-26" cy="-64" r="10"/><circle cx="0" cy="-74" r="12"/><circle cx="26" cy="-64" r="10"/>
        </g>
        <ellipse cx="-10" cy="-24" rx="12" ry="16" fill="#fff" stroke="#1f0d04" stroke-width="2"/>
        <ellipse cx="10" cy="-24" rx="12" ry="16" fill="#fff" stroke="#1f0d04" stroke-width="2"/>
        <circle cx="-8" cy="-22" r="5" fill="#1f0d04"/>
        <circle cx="12" cy="-22" r="5" fill="#1f0d04"/>
        <path d="M -9 0 L 0 12 L 9 0 Z" fill="#ff8a3c" stroke="#1f0d04" stroke-width="2"/>
      </g>

      <!-- Star sparkles edges -->
      <g fill="#fff">
        <path d="M 140 240 L 144 250 L 154 254 L 144 258 L 140 268 L 136 258 L 126 254 L 136 250 Z"/>
        <path d="M 884 240 L 888 250 L 898 254 L 888 258 L 884 268 L 880 258 L 870 254 L 880 250 Z"/>
        <path d="M 100 680 L 103 688 L 112 691 L 103 694 L 100 702 L 97 694 L 88 691 L 97 688 Z"/>
        <path d="M 924 680 L 927 688 L 936 691 L 927 694 L 924 702 L 921 694 L 912 691 L 921 688 Z"/>
      </g>`,
    tint: null, tintBlend: null,
    anchor: 'center',
  },
};

// Build a complete SVG string sized to fit the camera's aspect.
// width/height are the target dims so the SVG fills cleanly. The
// inner content is authored for a 1024x1024 viewport — we use
// preserveAspectRatio so it stretches/crops nicely on 4:3.
window.buildSceneSvg = function(sceneId, w = 1024, h = 1024) {
  const scene = window.SCENES[sceneId];
  if (!scene) return null;
  const anchor = scene.anchor || 'center';
  const par =
    anchor === 'top' ? 'xMidYMin slice' :
    anchor === 'bottom' ? 'xMidYMax slice' :
    'xMidYMid slice';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 1024 1024" preserveAspectRatio="${par}">${scene.svg}</svg>`;
};

window.sceneCss = function(sceneId, w = 1024, h = 1024) {
  const svg = window.buildSceneSvg(sceneId, w, h);
  if (!svg) return '';
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};
