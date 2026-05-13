/* global React */
// ============================================
// Sheares Photo Booth — small UI primitives
// ============================================

// ---------- Constants ----------
const FILTERS = [
  // Gentle CSS filter chains — must match the per-filter CSS in styles.css so capture matches preview
  { id: 'welcome', name: 'Welcome to Sheares', blurb: 'home, warm.', css: 'saturate(1.15) brightness(1.05) contrast(1.05) sepia(0.15) hue-rotate(-8deg)' },
  { id: 'academica', name: 'Academica', blurb: 'in the library.', css: 'sepia(0.65) saturate(1.1) contrast(1.1) brightness(0.95)' },
  { id: 'pond', name: 'Block B Pond', blurb: 'sakura blessed.', css: 'saturate(1.2) brightness(1.05) contrast(1.05) sepia(0.25) hue-rotate(-14deg)' },
  { id: 'c5', name: 'C5 baddie', blurb: 'main character.', css: 'contrast(1.4) saturate(1.45) brightness(0.97)' },
  { id: 'dee', name: 'Dee Champions', blurb: 'tropical sunshine.', css: 'brightness(1.1) saturate(1.2) contrast(1.0) sepia(0.1) hue-rotate(-6deg)' },
  { id: 'elmo', name: 'Elmo Street', blurb: 'neon nights.', css: 'contrast(1.25) saturate(1.6) hue-rotate(320deg) brightness(1.05)' }];


const PROPS = [
  // Sheares-themed visual stickers (8)
  { id: 'shweb',    kind: 'img', src: 'assets/shweb-logo.png',                color: '#e27a3f', label: 'shweb' },  { id: 'sakura',   kind: 'svg', color: '#d65170', label: 'sakura',  svg:
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50 50)">
        <ellipse cx="0" cy="-30" rx="16" ry="24" fill="#f7c5d4" stroke="#d65170" stroke-width="1.5"/>
        <ellipse cx="29" cy="-9" rx="16" ry="24" fill="#f7c5d4" stroke="#d65170" stroke-width="1.5" transform="rotate(72 29 -9)"/>
        <ellipse cx="18" cy="24" rx="16" ry="24" fill="#f7c5d4" stroke="#d65170" stroke-width="1.5" transform="rotate(144 18 24)"/>
        <ellipse cx="-18" cy="24" rx="16" ry="24" fill="#f7c5d4" stroke="#d65170" stroke-width="1.5" transform="rotate(216 -18 24)"/>
        <ellipse cx="-29" cy="-9" rx="16" ry="24" fill="#f7c5d4" stroke="#d65170" stroke-width="1.5" transform="rotate(288 -29 -9)"/>
        <circle cx="0" cy="0" r="8" fill="#ffe04d" stroke="#e27a3f" stroke-width="1.5"/>
        <circle cx="-3" cy="-3" r="1.5" fill="#fff"/>
      </g>
    </svg>` },
  { id: 'books',    kind: 'svg', color: '#7c3a1c', label: 'books', svg:
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50 50)">
        <rect x="-32" y="14" width="64" height="16" fill="#7c3a1c" stroke="#1f0d04" stroke-width="2"/>
        <line x1="-26" y1="18" x2="-26" y2="26" stroke="#e2b045" stroke-width="2.5"/>
        <text x="4" y="26" font-family="Quicksand,sans-serif" font-weight="700" font-size="9" fill="#fff7d4">CALC</text>
        <rect x="-28" y="-2" width="60" height="16" fill="#5a2e14" stroke="#1f0d04" stroke-width="2"/>
        <line x1="-22" y1="2" x2="-22" y2="10" stroke="#e2b045" stroke-width="2.5"/>
        <text x="4" y="10" font-family="Quicksand,sans-serif" font-weight="700" font-size="9" fill="#e2b045">PHYS</text>
        <rect x="-34" y="-18" width="66" height="16" fill="#a5602a" stroke="#1f0d04" stroke-width="2"/>
        <line x1="-28" y1="-14" x2="-28" y2="-6" stroke="#e2b045" stroke-width="2.5"/>
        <text x="3" y="-6" font-family="Quicksand,sans-serif" font-weight="700" font-size="9" fill="#1f0d04">ACAD</text>
        <!-- bookmark hanging out -->
        <rect x="20" y="-30" width="4" height="14" fill="#d63b3b"/>
        <polygon points="20,-16 24,-16 22,-12" fill="#d63b3b"/>
      </g>
    </svg>` },
  { id: 'pennant',  kind: 'svg', color: '#16a34a', label: 'pennant', svg:
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50 50) rotate(-8)">
        <line x1="-32" y1="-26" x2="-32" y2="40" stroke="#1f0d04" stroke-width="3"/>
        <polygon points="-32,-26 32,-12 -32,2" fill="#16a34a" stroke="#fff" stroke-width="2.5"/>
        <polygon points="-32,-26 32,-12 -32,2" fill="none" stroke="#0f6f30" stroke-width="1"/>
        <text x="-12" y="-7" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="18" fill="#fff">D</text>
        <circle cx="-32" cy="-26" r="3" fill="#1f0d04"/>
      </g>
    </svg>` },
  { id: 'lotus',    kind: 'svg', color: '#d65170', label: 'lotus', svg:
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50 60)">
        <ellipse cx="-22" cy="6" rx="13" ry="24" fill="#f7c5d4" stroke="#d65170" stroke-width="1.5" transform="rotate(-30 -22 6)"/>
        <ellipse cx="22" cy="6" rx="13" ry="24" fill="#f7c5d4" stroke="#d65170" stroke-width="1.5" transform="rotate(30 22 6)"/>
        <ellipse cx="-12" cy="-4" rx="13" ry="26" fill="#fff0f4" stroke="#d65170" stroke-width="1.5" transform="rotate(-12 -12 -4)"/>
        <ellipse cx="12" cy="-4" rx="13" ry="26" fill="#fff0f4" stroke="#d65170" stroke-width="1.5" transform="rotate(12 12 -4)"/>
        <ellipse cx="0" cy="-10" rx="12" ry="28" fill="#fff" stroke="#d65170" stroke-width="1.5"/>
        <circle cx="0" cy="-4" r="6" fill="#ffe04d" stroke="#e27a3f" stroke-width="1.5"/>
        <line x1="0" y1="14" x2="0" y2="34" stroke="#2a7d4a" stroke-width="3"/>
      </g>
    </svg>` },

  // Creative visual stickers (4)
  { id: 'heart-glow',    kind: 'svg', color: '#d65170', label: 'love', svg:
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50 50)">
        <circle cx="0" cy="0" r="42" fill="#ff8de8" opacity="0.18"/>
        <path d="M 0 28 C -34 4 -34 -16 -18 -24 C -8 -30 0 -22 0 -12 C 0 -22 8 -30 18 -24 C 34 -16 34 4 0 28 Z" fill="#d65170" stroke="#8a1d3f" stroke-width="2.5"/>
        <path d="M -10 -14 L -7 -8 L -1 -6 L -7 -4 L -10 2 L -13 -4 L -19 -6 L -13 -8 Z" fill="#fff"/>
        <path d="M 26 -22 L 28 -16 L 34 -14 L 28 -12 L 26 -6 L 24 -12 L 18 -14 L 24 -16 Z" fill="#ffd34d"/>
        <circle cx="-26" cy="-16" r="2.5" fill="#ffd34d"/>
        <circle cx="24" cy="18" r="2.5" fill="#ffd34d"/>
        <circle cx="-22" cy="20" r="2" fill="#ff8de8"/>
      </g>
    </svg>` },
  { id: 'crown',         kind: 'svg', color: '#e2b045', label: 'crown', svg:
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50 50)">
        <path d="M -32 12 L -32 -18 L -19 -4 L -10 -26 L 0 -8 L 10 -26 L 19 -4 L 32 -18 L 32 12 Z" fill="#e2b045" stroke="#a8542b" stroke-width="2.5"/>
        <rect x="-32" y="12" width="64" height="12" fill="#a8542b" stroke="#1f0d04" stroke-width="2"/>
        <rect x="-32" y="22" width="64" height="3" fill="#1f0d04" opacity="0.3"/>
        <circle cx="-32" cy="-18" r="3" fill="#d63b3b" stroke="#1f0d04" stroke-width="1"/>
        <circle cx="-10" cy="-26" r="4" fill="#d63b3b" stroke="#1f0d04" stroke-width="1.5"/>
        <circle cx="0" cy="-8" r="4" fill="#2563eb" stroke="#1f0d04" stroke-width="1.5"/>
        <circle cx="10" cy="-26" r="4" fill="#d63b3b" stroke="#1f0d04" stroke-width="1.5"/>
        <circle cx="32" cy="-18" r="3" fill="#d63b3b" stroke="#1f0d04" stroke-width="1"/>
        <circle cx="-19" cy="-4" r="3" fill="#16a34a" stroke="#1f0d04" stroke-width="1"/>
        <circle cx="19" cy="-4" r="3" fill="#16a34a" stroke="#1f0d04" stroke-width="1"/>
      </g>
    </svg>` },
  { id: 'glow-star',     kind: 'svg', color: '#ffe04d', label: 'star', svg:
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50 50)">
        <circle cx="0" cy="0" r="38" fill="#ffd34d" opacity="0.2"/>
        <circle cx="0" cy="0" r="28" fill="#ffe04d" opacity="0.25"/>
        <path d="M 0 -34 L 10 -10 L 34 -10 L 14 6 L 22 30 L 0 16 L -22 30 L -14 6 L -34 -10 L -10 -10 Z"
              fill="#ffe04d" stroke="#e27a3f" stroke-width="2"/>
        <path d="M 0 -22 L 6 -6 L 22 -6 L 9 4 L 14 18 L 0 10 L -14 18 L -9 4 L -22 -6 L -6 -6 Z"
              fill="#fff" opacity="0.5"/>
        <circle cx="0" cy="-2" r="4" fill="#fff"/>
      </g>
    </svg>` },

  // Text bubbles (4) — kept
  { id: 'omg',      kind: 'text', glyph: '!',  big: 'omg!',                  color: '#d65170' },
  { id: 'love',     kind: 'text', glyph: '♡',  big: 'love u!',               color: '#d65170' },
  { id: 'hi',       kind: 'text', glyph: 'hi', big: 'hi future shearite ★', color: '#e27a3f' },
  { id: 'mwah',     kind: 'text', glyph: '😘', big: 'mwah~',                 color: '#9333ea' }
];
const FILTER_NAMES_BY_ID = Object.fromEntries(FILTERS.map((f) => [f.id, f.name]));

// ---------- Caption bank ----------
// Per-filter pools only. Each filter has its own dedicated set.
const CAPTIONS = {
  welcome: [
    'welcome home, future shearite ✦',
    'first day energy',
    'sheares stole my heart',
    'future shearite era begins',
    '5 blocks, 1 family',
    'first day of forever',
    'sheares hall im home ✦',
    'warning: incoming shearite',
  ],
  academica: [
    'academic comeback ✦',
    'GPA: 5.0 in cuteness',
    'philosophy major, cute minor',
    'overdue assignments, on-time slay vibess',
    '∫ cuteness dx = me',
    'cite me in your thesis',
    'plot twist: i passed',
  ],
  pond: [
    'sakura szn',
    'zen mode activated',
    'block b reflections',
    'main character in a haiku',
    'cherry blossom certified',
    'still water, loud outfit',
    'pond-side meditation',
    'block b zen achieved',
  ],
  c5: [
    'baddie galore ✦',
    'are you wet after seeing this 💦',
    'C5 stop it omg',
    "drippin' wet on c5",
    'i came, i saw, i served',
    'block c on TOP',
    'magazine cover energy',
    '10/10 c5 baddie',
    'C5 hottest export',
    'eat them up baddie',
    'serving cunts, blk c style',
  ],
  dee: [
    'DEE champions ✦',
    'MVP energy',
    'trophy in hand, snack in frame',
    'gold medal in cuteness',
    'dee or die',
    'champions, but make it cute',
    'win conditions: this face',
    'first place in every category',
    'd in dee = dominant',
    'dee block, dee dynasty',
  ],
  elmo: [
    'elmo street nights ✦',
    'neon dreams',
    'hi friend ★',
    'street wear szn',
    'fuzzy era, i love furries',
    'block e knocks different',
    'caught in a bokeh trap',
    'eee street royalty',
    'fuzzy mascot energy',
  ],
};

function pickCaption(filterId, prev) {
  const pool = CAPTIONS[filterId] || CAPTIONS.welcome;
  const choices = pool.filter((c) => c !== prev);
  const list = choices.length ? choices : pool;
  return list[Math.floor(Math.random() * list.length)];
}

// ---------- Sprinkles around the hero ----------
function Sprinkles() {
  const sprinkles = [
    { left: '6%',  top: '4px',  size: 38, content: '✦', rot: -16 },
    { left: '14%', top: '60px', size: 28, content: '♥', rot: 12 },
    { left: '22%', top: '8px',  size: 32, content: '~', rot: -8 },
    { right: '8%', top: '12px', size: 42, content: '✦', rot: 14 },
    { right: '18%',top: '70px', size: 26, content: '★', rot: -4 },
    { right: '28%',top: '4px',  size: 30, content: '*', rot: 22 },
    { left: '38%', top: '-2px', size: 22, content: '✿', rot: 8 },
    { right: '38%',top: '0px',  size: 22, content: '✿', rot: -10 }
  ];
  return (
    <React.Fragment>
      {sprinkles.map((s, i) =>
        <span key={i} className="sprinkle" style={{
          left: s.left, right: s.right, top: s.top,
          fontSize: s.size, transform: `rotate(${s.rot}deg)`
        }}>{s.content}</span>
      )}
    </React.Fragment>);

}

// ---------- Filter rail ----------
function FilterRail({ filters, active, onSelect }) {
  return (
    <div className="filter-rail">
      <div className="rail-title">filters ↓</div>
      {filters.map((f) => {
        const sceneCss = window.sceneCss ? window.sceneCss(f.id, 200, 200) : '';
        return (
          <div
            key={f.id}
            className={`filter-card ${active === f.id ? 'active' : ''}`}
            onClick={() => onSelect(f.id)}
            title={f.blurb}>
            <span className="tape" style={{ top: -8, left: '50%', transform: 'translateX(-50%) rotate(-3deg)' }}></span>
            <div className="filter-thumb" data-filter={f.id} style={{
              backgroundImage: sceneCss || undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>
            <div className="filter-name">{f.name}</div>
          </div>);
      })}
    </div>);

}

// ---------- Format toggle ----------
function FormatToggle({ format, setFormat }) {
  return (
    <div className="rail-card">
      <div className="rail-title">format ✂</div>
      <div className="rail-sub">pick one before you smile.</div>
      <div className="format-toggle">
        <button
          className={`format-btn ${format === 'polaroid' ? 'active' : ''}`}
          onClick={() => setFormat('polaroid')}>
          <span className="glyph">▢</span>
          polaroid
        </button>
        <button
          className={`format-btn ${format === 'strip' ? 'active' : ''}`}
          onClick={() => setFormat('strip')}>
          <span className="glyph">▤</span>
          4-up strip
        </button>
      </div>
    </div>);

}

// ---------- Props palette ----------
function PropsPalette({ onAdd, disabled }) {
  const renderPreview = (p) => {
    if (p.kind === 'img') {
      return <img src={p.src} alt={p.label} style={{ width: 32, height: 32, objectFit: 'contain' }} />;
    }
    if (p.kind === 'svg') {
      return <span style={{ width: 32, height: 32, display: 'inline-block' }} dangerouslySetInnerHTML={{ __html: p.svg }} />;
    }
    if (p.kind === 'text') {
      return <span style={{ fontFamily: 'Caveat,cursive', fontSize: 14, fontWeight: 700 }}>{p.big.slice(0, 6)}</span>;
    }
    return p.glyph;
  };
  return (
    <div className="rail-card">
      <div className="rail-title">stickers ✨</div>
      <div className="rail-sub">{disabled ? 'snap first, then add stickers!' : 'click to add ▸ drag to place.'}</div>
      <div className="props-grid">
        {PROPS.map((p) =>
          <button
            key={p.id}
            className="prop-btn"
            disabled={disabled}
            onClick={() => onAdd(p)}
            style={{ color: p.color, opacity: disabled ? 0.55 : 1 }}
            title={p.label || p.big}>
            {renderPreview(p)}
          </button>
        )}
      </div>
    </div>);

}

// ---------- Caption card ----------
function CaptionCard({ caption, onRegen, onEdit, hasPhoto }) {
  return (
    <div className="rail-card caption-card">
      <div className="rail-title">caption ✎</div>
      <div className="rail-sub">tap to cycle filter-flavored captions.</div>
      <div className={`caption-display ${!caption ? 'empty' : ''}`}>
        {caption || 'your caption appears here…'}
      </div>
      <div className="row">
        <button
          className="btn btn-primary"
          onClick={onRegen}
          disabled={!hasPhoto}
          style={{ flex: 1 }}>
          {caption ? '✨ another one' : '✨ pick one'}
        </button>
        <button
          className="btn btn-outline"
          onClick={onEdit}
          disabled={!hasPhoto}
          title="edit caption">✎</button>
      </div>
    </div>);

}

// ---------- Gallery wall ----------
function GalleryWall({ entries, onOpen, onClear }) {
  if (!entries.length) {
    return (
      <div className="scrapbook-wall">
        <div className="empty-wall">
          no one's stopped by yet — be the first! 🦁<br />
          <span style={{ fontSize: 18, opacity: 0.7 }}>your polaroid will live up here forever.</span>
        </div>
      </div>);
  }
  const rotFor = (id) => {
    let h = 0; for (const c of id) h = h * 31 + c.charCodeAt(0) | 0;
    return (h % 11 - 5) * 1.2;
  };
  return (
    <div className="scrapbook-wall">
      <div className="pin-wrapper">
        {entries.map((e) =>
          <div
            key={e.id}
            className={`gallery-polaroid ${e.format === 'strip' ? 'strip' : ''}`}
            style={{ transform: `rotate(${rotFor(e.id)}deg)` }}
            onClick={() => onOpen(e)}>
            <span className="tape" style={{ top: -8, left: '50%', transform: 'translateX(-50%) rotate(-3deg)' }}></span>
            <img src={e.thumb || e.image} alt={e.caption || 'future shearite snap'} />
            <div className="gp-caption">{e.caption || '✦ future shearite ✦'}</div>
          </div>
        )}
      </div>
    </div>);

}

// ---------- Modal for opened gallery entry ----------
function GalleryModal({ entry, onClose, onDelete }) {
  const [confirmDel, setConfirmDel] = React.useState(false);
  React.useEffect(() => { setConfirmDel(false); }, [entry]);
  if (!entry) return null;

  const qrTarget = entry.image.length < 1800 ? entry.image : `https://sheares.photo/p/${entry.id}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&color=2a2520&bgcolor=fbf3e6&data=${encodeURIComponent(qrTarget)}`;

  const downloadEntry = () => {
    const a = document.createElement('a');
    a.href = entry.image;
    a.download = `sheares-${entry.id}.jpg`;
    a.click();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(20,15,10,0.72)',
        display: 'grid', placeItems: 'center', padding: 30,
        animation: 'fadeIn 0.2s ease-out',
        overflow: 'auto'
      }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex', gap: 28, alignItems: 'flex-start',
          flexWrap: 'wrap', justifyContent: 'center',
          maxWidth: 980
        }}>
        <div
          className="polaroid"
          style={{
            maxWidth: entry.format === 'strip' ? 320 : 500,
            width: '100%',
            padding: '20px 20px 70px',
            transform: 'rotate(-1.5deg)',
            position: 'relative',
            background: '#fff',
            boxShadow: '0 12px 30px -10px rgba(0,0,0,0.4)'
          }}>
          <span className="tape" style={{ top: -10, left: '50%', transform: 'translateX(-50%) rotate(-3deg)', width: 90 }}></span>
          <img src={entry.image} style={{ width: '100%', display: 'block' }} alt={entry.caption} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 18, textAlign: 'center', fontFamily: 'Caveat, cursive', fontSize: 28 }}>
            {entry.caption || '✦ welcome to sheares ✦'}
          </div>
        </div>

        <div style={{
          width: 280,
          background: '#fff',
          padding: 22,
          borderRadius: 10,
          boxShadow: '0 12px 30px -10px rgba(0,0,0,0.4)',
          transform: 'rotate(1.5deg)',
          position: 'relative'
        }}>
          <span className="tape" style={{ top: -10, left: '50%', transform: 'translateX(-50%) rotate(3deg)', width: 80 }}></span>
          <div style={{ fontFamily: 'Caveat,cursive', fontSize: 30, color: 'var(--sw-deep)', lineHeight: 1, marginBottom: 6 }}>✦ saved!</div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 16, lineHeight: 1.5 }}>
            <div><b style={{ color: 'var(--ink)' }}>filter</b> · {window.FILTER_NAMES_BY_ID?.[entry.filterId] || '—'}</div>
            <div><b style={{ color: 'var(--ink)' }}>when</b> · {new Date(entry.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</div>
            <div><b style={{ color: 'var(--ink)' }}>format</b> · {entry.format}</div>
          </div>
          <div style={{
            background: 'var(--paper)', borderRadius: 10, padding: 12,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            marginBottom: 12,
            border: '1.5px dashed var(--paper-edge)'
          }}>
            <div style={{ fontFamily: 'Caveat,cursive', fontSize: 22, color: 'var(--sw-deep)', lineHeight: 1, marginBottom: 8 }}>scan to take it home ↓</div>
            <img src={qrSrc} alt="QR code" style={{ width: 180, height: 180, display: 'block', borderRadius: 6 }} />
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 8, textAlign: 'center' }}>point your phone camera at the code</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn btn-primary" onClick={downloadEntry} style={{ width: '100%' }}>↓ download</button>
            {!confirmDel ?
              <button
                className="btn btn-outline"
                onClick={() => setConfirmDel(true)}
                style={{ width: '100%', color: '#d63b3b', boxShadow: 'inset 0 0 0 1.5px #f3c7c7' }}>
                🗑 remove from wall
              </button> :
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-outline" onClick={() => setConfirmDel(false)} style={{ flex: 1 }}>cancel</button>
                <button
                  onClick={() => { onDelete(entry.id); onClose(); }}
                  className="btn btn-primary"
                  style={{ flex: 1, background: '#d63b3b', boxShadow: '0 4px 0 #8a2222' }}>yes, remove</button>
              </div>
            }
          </div>
        </div>

        <button
          className="icon-btn"
          onClick={onClose}
          aria-label="close"
          style={{
            position: 'fixed', top: 20, right: 20,
            background: '#fff', color: '#2a2520',
            border: 'none',
            width: 44, height: 44,
            fontSize: 18
          }}>✕</button>
      </div>
    </div>);

}
const CHROMES = [
  { id: 'paper', label: 'paper', tint: '#fbf3e6', edge: '#d6c4a8' },
  { id: 'wood',  label: 'wood',  tint: '#7c3a1c', edge: '#2a1606' },
  { id: 'neon',  label: 'neon',  tint: '#1a0628', edge: '#ff4dd8' }
];

function ThemesCard({ chrome, setChrome }) {
  return (
    <div className="rail-card themes-card">
      <div className="rail-title">themes 🎨</div>
      <div className="rail-sub">choose your booth chrome.</div>
      <div className="chrome-row">
        {CHROMES.map((c) =>
          <button
            key={c.id}
            className={`chrome-chip ${chrome === c.id ? 'active' : ''}`}
            onClick={() => setChrome(c.id)}
            title={c.label}>
            <span className="chrome-swatch" style={{ background: c.tint, border: `2px solid ${c.edge}` }}></span>
            <span className="chrome-name">{c.label}</span>
          </button>
        )}
      </div>
    </div>);

}

// Export to window
Object.assign(window, {
  FILTERS, PROPS, FILTER_NAMES_BY_ID, CAPTIONS, pickCaption,
  Sprinkles, FilterRail, FormatToggle, PropsPalette, CaptionCard, ThemesCard, GalleryWall, GalleryModal
});
