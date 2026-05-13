/* global React, ReactDOM, FILTERS, PROPS, FILTER_NAMES_BY_ID,
   Sprinkles, FilterRail, FormatToggle, PropsPalette, CaptionCard, ThemesCard, GalleryWall, GalleryModal,
   TweaksPanel, TweakSection, TweakSlider, TweakToggle, TweakRadio, TweakSelect, useTweaks
*/
const { useState, useEffect, useRef, useCallback, useMemo } = React;

// =====================================================
// Supabase gallery storage
// =====================================================
const SB = () => window.SUPABASE;
const BUCKET = () => window.SUPABASE_BUCKET;

async function fetchGallery() {
  const { data, error } = await SB().from('gallery')
    .select('*').order('created_at', { ascending: false });
  if (error) { console.error('fetchGallery', error); return []; }
  return (data || []).map((r) => ({
    id: r.id,
    image: r.image_url,
    thumb: r.thumb_url || r.image_url,
    caption: r.caption,
    filterId: r.filter_id,
    format: r.format,
    timestamp: new Date(r.created_at).getTime(),
    image_path: r.image_path,
    thumb_path: r.thumb_path
  }));
}

async function uploadDataUrl(dataUrl, path) {
  const blob = await (await fetch(dataUrl)).blob();
  const { error } = await SB().storage.from(BUCKET())
    .upload(path, blob, { contentType: 'image/jpeg', upsert: false });
  if (error) throw error;
  const { data } = SB().storage.from(BUCKET()).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

async function insertEntry({ image, thumb, caption, filterId, format }) {
  const stamp = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  const imageUp = await uploadDataUrl(image, `pins/${stamp}-image.jpg`);
  const thumbUp = thumb && thumb !== image
    ? await uploadDataUrl(thumb, `pins/${stamp}-thumb.jpg`)
    : imageUp;
  const { data, error } = await SB().from('gallery').insert({
    caption, filter_id: filterId, format,
    image_url: imageUp.url, thumb_url: thumbUp.url,
    image_path: imageUp.path, thumb_path: thumbUp.path
  }).select().single();
  if (error) throw error;
  return {
    id: data.id, image: data.image_url, thumb: data.thumb_url,
    caption: data.caption, filterId: data.filter_id, format: data.format,
    timestamp: new Date(data.created_at).getTime(),
    image_path: data.image_path, thumb_path: data.thumb_path
  };
}

async function deleteEntry(entry) {
  const paths = [entry.image_path, entry.thumb_path].filter(Boolean);
  if (paths.length) {
    await SB().storage.from(BUCKET()).remove(paths);
  }
  await SB().from('gallery').delete().eq('id', entry.id);
}

// Scale a filter CSS string by intensity (1.0 = unchanged, 0 = none)
function scaleFilter(css, intensity) {
  if (!css || intensity === 0) return 'none';
  return css.replace(/(\w+)\(([^)]+)\)/g, (m, fn, args) => {
    const a = args.trim();
    const num = parseFloat(a);
    if (Number.isNaN(num)) return m;
    const identity = { brightness: 1, contrast: 1, saturate: 1, sepia: 0, 'hue-rotate': 0, grayscale: 0, invert: 0, blur: 0 };
    const unit = a.replace(/^-?[\d.]+/, '');
    if (fn in identity) {
      const id = identity[fn];
      const scaled = id + (num - id) * intensity;
      return `${fn}(${+scaled.toFixed(3)}${unit})`;
    }
    return m;
  });
}

const uuid = () => Math.random().toString(36).slice(2, 10);

// =====================================================
// Sticker (draggable overlay element)
// =====================================================
function Sticker({ s, selected, onSelect, onUpdate, onDelete, containerRef }) {
  const startedRef = useRef(null);
  const resizeRef = useRef(null);

  const onPointerDown = (e) => {
    e.stopPropagation();
    onSelect(s.id);
    const rect = containerRef.current.getBoundingClientRect();
    startedRef.current = {
      startX: e.clientX, startY: e.clientY,
      origX: s.x, origY: s.y,
      w: rect.width, h: rect.height,
      el: e.currentTarget
    };
    try {e.currentTarget.setPointerCapture(e.pointerId);} catch {}
    e.currentTarget.classList.add('dragging');
  };
  const onPointerMove = (e) => {
    if (!startedRef.current) return;
    const { startX, startY, origX, origY, w, h } = startedRef.current;
    const nx = origX + (e.clientX - startX) / w;
    const ny = origY + (e.clientY - startY) / h;
    onUpdate(s.id, { x: Math.max(0.04, Math.min(0.96, nx)), y: Math.max(0.05, Math.min(0.95, ny)) });
  };
  const endDrag = (e) => {
    if (!startedRef.current) return;
    if (startedRef.current.el) {
      startedRef.current.el.classList.remove('dragging');
      try {startedRef.current.el.releasePointerCapture(e.pointerId);} catch {}
    }
    startedRef.current = null;
  };

  // Resize handle — scale based on pointer distance from sticker center
  const onResizeDown = (e) => {
    e.stopPropagation(); e.preventDefault();
    onSelect(s.id);
    const stickerEl = e.currentTarget.parentElement;
    const r = stickerEl.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const startDist = Math.hypot(e.clientX - cx, e.clientY - cy) || 1;
    resizeRef.current = {
      cx, cy, startDist, origScale: s.scale, origRot: s.rot,
      startAngle: Math.atan2(e.clientY - cy, e.clientX - cx),
      handle: e.currentTarget
    };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
  };
  const onResizeMove = (e) => {
    if (!resizeRef.current) return;
    const { cx, cy, startDist, origScale, origRot, startAngle } = resizeRef.current;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    const nextScale = Math.max(0.3, Math.min(3.5, origScale * (dist / startDist)));
    const ang = Math.atan2(e.clientY - cy, e.clientX - cx);
    const dDeg = (ang - startAngle) * 180 / Math.PI;
    onUpdate(s.id, { scale: nextScale, rot: origRot + dDeg });
  };
  const onResizeUp = (e) => {
    if (!resizeRef.current) return;
    try { resizeRef.current.handle.releasePointerCapture(e.pointerId); } catch {}
    resizeRef.current = null;
  };

  const isText = s.kind === 'text';
  const isSvg = s.kind === 'svg';
  const isImg = s.kind === 'img';
  const isVisual = isSvg || isImg;

  return (
    <div
      className={`sticker ${selected ? 'selected' : ''}`}
      style={{
        left: `${s.x * 100}%`, top: `${s.y * 100}%`,
        transform: `translate(-50%, -50%) rotate(${s.rot}deg) scale(${s.scale})`,
        width: isVisual ? 84 : undefined,
        height: isVisual ? 84 : undefined,
        fontSize: isText ? 22 : 56,
        color: s.color,
        fontFamily: isText ? 'Caveat, cursive' : 'inherit',
        fontWeight: isText ? 700 : 400,
        background: isText ? '#fff' : 'transparent',
        borderRadius: isText ? '999px' : 0,
        padding: isText ? '4px 14px' : 0,
        border: isText ? `2px solid ${s.color}` : 'none',
        lineHeight: isText ? 1.1 : 1,
        whiteSpace: 'nowrap',
        filter: isVisual ? 'drop-shadow(2px 3px 0 rgba(0,0,0,0.18))' : undefined
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}>
      
      {isText ? s.content :
       isSvg ? <span style={{ width: '100%', height: '100%', display: 'inline-block' }} dangerouslySetInnerHTML={{ __html: s.svg }} /> :
       isImg ? <img src={s.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} /> :
       s.glyph}
      <span
        className="sticker-delete"
        onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); onDelete(s.id); }}
        onClick={(e) => { e.stopPropagation(); }}
        title="remove">×</span>
      <span
        className="sticker-resize"
        onPointerDown={onResizeDown}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeUp}
        onPointerCancel={onResizeUp}
        title="resize / rotate">⤡</span>
    </div>);

}

// =====================================================
// Viewfinder
// =====================================================
function Viewfinder({
  attachVideo, camStatus, onStart, stream,
  filter, intensity, format,
  capturing, countdownValue, flashing,
  capturedFrames, mode,
  stickers, selectedStickerId, setSelectedStickerId,
  updateSticker, deleteSticker,
  caption, setCaption
}) {
  const camRef = useRef(null);
  const appliedFilter = scaleFilter(filter?.css || '', intensity);
  const sceneBg = window.sceneCss ? window.sceneCss(filter?.id) : '';

  const SceneOverlay = ({ show, sceneId }) => {
    const bg = sceneId && window.sceneCss ? window.sceneCss(sceneId) : sceneBg;
    return show && bg ? <div className="scene-overlay" style={{ backgroundImage: bg }}></div> : null;
  };

  const renderStickerLayer = () =>
  mode === 'reviewing' &&
  <div className="sticker-layer" style={{ pointerEvents: 'auto' }}>
        {stickers.map((s) =>
    <Sticker
      key={s.id} s={s}
      selected={s.id === selectedStickerId}
      onSelect={setSelectedStickerId}
      onUpdate={updateSticker}
      onDelete={deleteSticker}
      containerRef={camRef} />

    )}
      </div>;


  if (format === 'strip') {
    return (
      <div className="viewfinder format-strip">
        <span className="tape" style={{ top: -10, left: 30, transform: 'rotate(-8deg)', width: 70 }}></span>
        <span className="tape" style={{ top: -10, right: 30, transform: 'rotate(8deg)', width: 70 }}></span>

        <div
          className="strip-frame"
          ref={camRef}
          style={{ position: 'relative' }}
          onMouseDown={() => setSelectedStickerId(null)}>
          
          {[0, 1, 2, 3].map((i) => {
            const cap = capturedFrames[i];
            const isCaptured = !!cap;
            const nextIdx = capturedFrames.length;
            const isLive = !isCaptured && mode !== 'reviewing' && i === nextIdx && camStatus === 'live';
            const hasImage = isCaptured || isLive;
            const cellFilterId = isCaptured ? cap.filterId : filter?.id;
            return (
              <div
                key={i}
                className="cam-inner"
                data-filter={cellFilterId}
                style={{ '--applied-filter': appliedFilter, position: 'relative' }}>

              {isCaptured ?
                <img className="captured" src={cap.url} alt="captured frame" /> :
                isLive ?
                <video ref={attachVideo} autoPlay playsInline muted /> :
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'grid', placeItems: 'center',
                  background: `linear-gradient(135deg, var(--paper-edge), var(--paper-deep))`,
                  color: 'var(--ink-soft)', fontFamily: 'Caveat,cursive', fontSize: 28
                }}>frame {i + 1}</div>
              }
              {/* Strip mode: lens filter only, skip scene SVG add-ons */}
              {capturing && countdownValue && countdownValue.frame === i &&
                <div className="countdown" key={`cd-${i}-${countdownValue.value}`}>{countdownValue.value}</div>
                }
              {flashing && flashing.frame === i && <div className="flash-overlay" key={`fl-${i}-${flashing.t}`}></div>}
            </div>);

          })}
          {/* Sticker layer overlays the whole strip during review and between shots */}
          {mode !== 'live' &&
          <div
            className="sticker-layer"
            style={{ pointerEvents: 'auto', position: 'absolute', inset: 0 }}>
            
              {stickers.map((s) =>
            <Sticker
              key={s.id} s={s}
              selected={s.id === selectedStickerId}
              onSelect={setSelectedStickerId}
              onUpdate={updateSticker}
              onDelete={deleteSticker}
              containerRef={camRef} />

            )}
            </div>
          }
          {/* Curtain over first cell only */}
          {camStatus !== 'live' && mode === 'live' && capturedFrames.length === 0 &&
          <div className="curtain" style={{ position: 'absolute', inset: 0 }}>
              <div className="lion-wrap"><img src="assets/shweb-logo.png" alt="lion mascot" /></div>
              <div className="big">Welcome!</div>
              <div className="small">tap to begin</div>
              {camStatus === 'idle' && <button onClick={onStart}>start camera</button>}
              {camStatus === 'requesting' && <button disabled>waking up…</button>}
            </div>
          }
        </div>
        <div
          className="vf-caption"
          contentEditable={mode === 'reviewing'}
          suppressContentEditableWarning
          onBlur={(e) => setCaption(e.currentTarget.innerText.trim())}
          spellCheck={false}>
          
          {caption || '✦ welcome to sheares ✦'}
        </div>
      </div>);

  }

  // Polaroid
  return (
    <div className="viewfinder format-polaroid">
      <span className="tape" style={{ top: -10, left: 30, transform: 'rotate(-10deg)' }}></span>
      <span className="tape" style={{ top: -10, right: 30, transform: 'rotate(10deg)' }}></span>

      <div
        className="cam-inner"
        ref={camRef}
        data-filter={filter?.id}
        style={{ '--applied-filter': appliedFilter }}
        onMouseDown={() => setSelectedStickerId(null)}>
        
        {camStatus !== 'live' && mode === 'live' &&
        <div className="curtain">
            <div className="lion-wrap"><img src="assets/shweb-logo.png" alt="lion mascot" /></div>
            <div className="big">Welcome to Sheares!</div>
            <div className="small">step into the booth, future shearite ~</div>
            {camStatus === 'idle' && <button onClick={onStart}>start the camera</button>}
            {camStatus === 'requesting' && <button disabled>waking up the lens…</button>}
            {camStatus === 'denied' && <div style={{ fontFamily: 'Quicksand', maxWidth: 280, marginTop: 8, fontSize: 13 }}>
              we need camera access to snap your polaroid. enable it in your browser settings and refresh!
            </div>}
            {camStatus === 'error' && <div style={{ fontFamily: 'Quicksand', maxWidth: 280, marginTop: 8, fontSize: 13 }}>
              hmm, the camera didn't cooperate. try a different browser?
            </div>}
          </div>
        }
        {mode === 'reviewing' && capturedFrames[0] ?
        <img className="captured" src={capturedFrames[0].url} alt="captured" /> :

        <video ref={attachVideo} autoPlay playsInline muted />
        }
        <SceneOverlay
          show={mode === 'reviewing' ? !!capturedFrames[0] : camStatus === 'live'}
          sceneId={mode === 'reviewing' && capturedFrames[0] ? capturedFrames[0].filterId : filter?.id} />
        {capturing && countdownValue && <div className="countdown" key={`cd-${countdownValue.value}`}>{countdownValue.value}</div>}
        {flashing && <div className="flash-overlay" key={`fl-${flashing.t}`}></div>}

        {renderStickerLayer()}
      </div>

      <div
        className="vf-caption"
        contentEditable={mode === 'reviewing'}
        suppressContentEditableWarning
        onBlur={(e) => setCaption(e.currentTarget.innerText.trim())}
        spellCheck={false}>
        
        {caption || '✦ welcome to sheares ✦'}
      </div>
    </div>);

}

// =====================================================
// Main App
// =====================================================
const TWEAK_DEFAULS = /*EDITMODE-BEGIN*/{
  "intensity": 1,
  "palette": "sunset",
  "chrome": "paper",
  "showGallery": true
} /*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULS);

  // Apply palette + chrome to <body>
  useEffect(() => {
    document.body.dataset.palette = tweaks.palette;
    document.body.dataset.chrome = tweaks.chrome;
  }, [tweaks.palette, tweaks.chrome]);

  // ----- Camera -----
  const [stream, setStream] = useState(null);
  const [camStatus, setCamStatus] = useState('idle');
  const videoElRef = useRef(null);

  const attachVideo = useCallback((el) => {
    videoElRef.current = el;
    if (el && stream) {
      el.srcObject = stream;
      el.play().catch(() => {});
    }
  }, [stream]);

  const startCamera = async () => {
    setCamStatus('requesting');
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setStream(s);
      setCamStatus('live');
    } catch (e) {
      console.error(e);
      setCamStatus(e.name === 'NotAllowedError' ? 'denied' : 'error');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    if (videoElRef.current) {
      try { videoElRef.current.srcObject = null; } catch {}
    }
    setStream(null);
    setCamStatus('idle');
  };

  // ----- Main state -----
  const [activeFilter, setActiveFilter] = useState('welcome');
  const [format, setFormat] = useState('polaroid');
  const [mode, setMode] = useState('live');

  const [capturing, setCapturing] = useState(false);
  const [countdownValue, setCountdownValue] = useState(null);
  const [flashing, setFlashing] = useState(null);
  const [capturedFrames, setCapturedFrames] = useState([]);

  const [stickers, setStickers] = useState([]);
  const [selectedStickerId, setSelectedStickerId] = useState(null);

  const [caption, setCaption] = useState('');

  const [gallery, setGallery] = useState([]);
  const [galleryOpen, setGalleryOpen] = useState(null);
  const [confettiKey, setConfettiKey] = useState(null);
  const [pinning, setPinning] = useState(false);

  const filter = FILTERS.find((f) => f.id === activeFilter) || FILTERS[0];

  useEffect(() => {
    fetchGallery().then(setGallery);
  }, []);

  // ----- Capture flow -----
  const captureFrame = useCallback(() => {
    const video = videoElRef.current;
    if (!video || !video.videoWidth) return null;
    const W = video.videoWidth,H = video.videoHeight;
    const out = document.createElement('canvas');
    const ctx = out.getContext('2d');

    if (format === 'polaroid') {
      out.width = 1024;out.height = 1024;
      ctx.filter = scaleFilter(filter.css, tweaks.intensity);
      ctx.save();
      ctx.translate(out.width, 0);ctx.scale(-1, 1);
      const size = Math.min(W, H);
      const sx = (W - size) / 2,sy = (H - size) / 2;
      ctx.drawImage(video, sx, sy, size, size, 0, 0, out.width, out.height);
      ctx.restore();
    } else {
      out.width = 960;out.height = 720;
      ctx.filter = scaleFilter(filter.css, tweaks.intensity);
      ctx.save();
      ctx.translate(out.width, 0);ctx.scale(-1, 1);
      const targetAspect = 4 / 3;
      let sw = W,sh = H;
      if (W / H > targetAspect) {sw = H * targetAspect;} else {sh = W / targetAspect;}
      const sx = (W - sw) / 2,sy = (H - sh) / 2;
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, out.width, out.height);
      ctx.restore();
    }
    return out.toDataURL('image/jpeg', 0.92);
  }, [format, filter, tweaks.intensity]);

  const beginCapture = useCallback(async () => {
    if (camStatus !== 'live' || capturing) return;
    setCapturing(true);
    setSelectedStickerId(null);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const frameIdx = format === 'strip' ? capturedFrames.length : 0;

    for (let n = 3; n >= 1; n--) {
      setCountdownValue({ value: n, frame: frameIdx });
      await sleep(820);
    }
    setCountdownValue(null);
    setFlashing({ t: Date.now(), frame: frameIdx });
    await sleep(80);
    const url = captureFrame();
    await sleep(380);
    setFlashing(null);

    if (!url) {
      setCapturing(false);
      return;
    }

    const totalFrames = format === 'strip' ? 4 : 1;
    const frameObj = { url, filterId: activeFilter, intensity: tweaks.intensity };
    const newFrames = format === 'strip' ? [...capturedFrames, frameObj] : [frameObj];
    setCapturedFrames(newFrames);
    setCapturing(false);

    if (newFrames.length >= totalFrames) {
      setMode('reviewing');
      setCaption((prev) => window.pickCaption(activeFilter, prev));
    } else {
      setMode('between');
    }
  }, [camStatus, capturing, format, capturedFrames, captureFrame, activeFilter, tweaks.intensity]);

  // ----- Sticker management -----
  const addSticker = (p) => {
    setStickers((s) => [...s, {
      id: uuid(),
      propId: p.id,
      kind: p.kind,
      glyph: p.glyph,
      content: p.big,
      svg: p.svg,
      src: p.src,
      color: p.color,
      x: 0.5 + (Math.random() - 0.5) * 0.3,
      y: 0.5 + (Math.random() - 0.5) * 0.3,
      rot: (Math.random() - 0.5) * 30,
      scale: 0.9 + Math.random() * 0.5
    }]);
  };
  const updateSticker = (id, patch) =>
  setStickers((s) => s.map((x) => x.id === id ? { ...x, ...patch } : x));
  const deleteSticker = (id) => {
    setStickers((s) => s.filter((x) => x.id !== id));
    setSelectedStickerId(null);
  };

  // ----- Caption picker (filter-tagged static bank) -----
  const cycleCaption = (frames = capturedFrames) => {
    if (!frames || frames.length === 0) return;
    setCaption((prev) => window.pickCaption(activeFilter, prev));
  };

  const editCaption = () => {
    const next = window.prompt('edit your caption', caption || '');
    if (next != null) setCaption(next.trim().slice(0, 60));
  };

  // ----- Save & download -----
  const saveToGallery = async () => {
    if (!capturedFrames.length || pinning) return;
    setPinning(true);
    try {
      const image = await composite(capturedFrames, stickers, format, caption);
      const thumb = format === 'strip'
        ? await composite([capturedFrames[0]], [], 'polaroid', caption)
        : image;
      const entry = await insertEntry({
        image, thumb,
        caption: caption || '✦ welcome to sheares ✦',
        filterId: activeFilter,
        format
      });
      setGallery((g) => [entry, ...g]);
      setConfettiKey(Date.now());
      setTimeout(resetBooth, 600);
    } catch (e) {
      console.error('pin failed', e);
      window.alert('Failed to pin: ' + (e?.message || e));
    } finally {
      setPinning(false);
    }
  };

  const resetBooth = () => {
    setMode('live');
    setCapturedFrames([]);
    setStickers([]);
    setCaption('');
    setSelectedStickerId(null);
  };

  const download = async () => {
    if (!capturedFrames.length) return;
    const image = await composite(capturedFrames, stickers, format, caption);
    const a = document.createElement('a');
    a.href = image;
    a.download = `sheares-${format}-${Date.now()}.jpg`;
    a.click();
  };

  return (
    <div className="desk">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><img src="assets/shweb-logo.png" alt="Sheares mascot" /></div>
          <div className="brand-name">
            Sheares Virtual Photo Booth
            <span>est. 2026 ✦ blk a-e</span>
          </div>
        </div>
        <div className="topbar-actions">
          <span className={`status-pill ${camStatus === 'live' ? 'live' : ''}`}>
            <span className="dot-led"></span>
            {camStatus === 'live' ? 'camera live' :
            camStatus === 'requesting' ? 'connecting…' :
            camStatus === 'denied' ? 'access denied' :
            camStatus === 'error' ? 'no camera' : 'camera off'}
          </span>
          {camStatus === 'live' ?
            <button className="cam-toggle" onClick={stopCamera} title="stop camera">■ stop</button> :
            camStatus === 'idle' ?
            <button className="cam-toggle start" onClick={startCamera} title="start camera">● start</button> :
            null
          }
          <a href="#wall" className="icon-btn" title="jump to wall">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
          </a>
        </div>
      </header>

      <section className="hero">
        <Sprinkles />
        <h1>
          Welcome to <span className="accent">Sheares</span>!
        </h1>
        <div className="sub">hey future Shearite! snap a polaroid and pin it to the wall !</div>
      </section>

      <section className="stage">
        <FilterRail
          filters={FILTERS}
          active={activeFilter}
          onSelect={(id) => mode !== 'reviewing' && setActiveFilter(id)} />
        

        <div className="viewfinder-wrap">
          <Viewfinder
            attachVideo={attachVideo}
            camStatus={camStatus}
            onStart={startCamera}
            stream={stream}
            filter={filter}
            intensity={tweaks.intensity}
            format={format}
            capturing={capturing}
            countdownValue={countdownValue}
            flashing={flashing}
            capturedFrames={capturedFrames}
            mode={mode}
            stickers={stickers}
            selectedStickerId={selectedStickerId}
            setSelectedStickerId={setSelectedStickerId}
            updateSticker={updateSticker}
            deleteSticker={deleteSticker}
            caption={caption}
            setCaption={setCaption} />
          

          {mode !== 'reviewing' ?
          <div className="capture-controls">
              <span style={{ fontFamily: 'Caveat,cursive', fontSize: 24, color: 'var(--ink-soft)' }}>
                {capturing ? 'hold still ✿' :
                 mode === 'between' ? 'decorate, then snap next ↓' :
                 'smile when ready ↓'}
              </span>
              <button
              className="shutter"
              onClick={beginCapture}
              disabled={camStatus !== 'live' || capturing}
              aria-label="capture">

                {capturing ? '...' : <span className="dot"></span>}
              </button>
              <span style={{ fontFamily: 'Caveat,cursive', fontSize: 24, color: 'var(--ink-soft)' }}>
                {format === 'strip'
                  ? `(shot ${Math.min(capturedFrames.length + 1, 4)} of 4)`
                  : '(1 frame)'}
              </span>
              {mode === 'between' &&
                <button className="btn btn-outline" onClick={resetBooth} style={{ marginLeft: 8 }}>↺ start over</button>
              }
            </div> :

          <div className="review-actions">
              <button className="btn btn-outline" onClick={resetBooth}>↺ retake</button>
              <button className="btn btn-outline" onClick={download}>↓ download</button>
              <button className="btn btn-primary" onClick={saveToGallery} disabled={pinning}>{pinning ? '⏳ pinning…' : '📌 pin to wall'}</button>
            </div>
          }
        </div>

        <aside className="right-rail">
          <FormatToggle format={format} setFormat={(f) => mode === 'live' && capturedFrames.length === 0 && setFormat(f)} />
          <ThemesCard
            chrome={tweaks.chrome}
            setChrome={(v) => setTweak('chrome', v)} />
          <PropsPalette onAdd={addSticker} disabled={mode === 'live'} />
          <CaptionCard
            caption={caption}
            onRegen={() => cycleCaption()}
            onEdit={editCaption}
            hasPhoto={mode === 'reviewing'} />
          
        </aside>
      </section>

      {tweaks.showGallery &&
      <section className="gallery-section" id="wall">
          <div style={{ textAlign: 'center' }}>
            <h2 className="section-title">
              <span style={{ flex: 'none' }}>The (future) Shearites Wall</span>
            </h2>
            <div className="section-sub">~ {gallery.length} future shearite{gallery.length === 1 ? '' : 's'} stopped by ~</div>
          </div>
          <GalleryWall
          entries={gallery}
          onOpen={(e) => setGalleryOpen(e)}
          onClear={() => {if (window.confirm('Wipe the wall? This cannot be undone.')) setGallery([]);}} />
        
        </section>
      }

      <GalleryModal
        entry={galleryOpen}
        onClose={() => setGalleryOpen(null)}
        onDelete={async (id) => {
          const entry = gallery.find((e) => e.id === id);
          setGallery((g) => g.filter((e) => e.id !== id));
          if (entry) {
            try { await deleteEntry(entry); }
            catch (e) { console.error('delete failed', e); }
          }
        }} />
      

      {confettiKey && <Confetti key={confettiKey} onDone={() => setConfettiKey(null)} />}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Camera">
          <TweakSlider label="Filter intensity" min={0} max={1.5} step={0.05}
          value={tweaks.intensity} onChange={(v) => setTweak('intensity', v)} />
        </TweakSection>
        <TweakSection label="Page">
          <TweakToggle label="Show the wall" value={tweaks.showGallery}
          onChange={(v) => setTweak('showGallery', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>);

}

// =====================================================
// Composite captured frames + stickers + caption -> final image
// =====================================================
async function composite(frames, stickers, format, caption) {
  try {await document.fonts.load('48px "Caveat"');await document.fonts.load('700 64px "Caveat"');} catch {}

  const isStrip = format === 'strip' && frames.length === 4;
  const W = isStrip ? 960 : 1024;
  const cellH = isStrip ? 720 : 1024;
  const gap = isStrip ? 6 : 0;
  const H = isStrip ? cellH * 4 + gap * 3 : 1024;

  // Pre-load scene SVG per-frame (each frame keeps the filter it was captured with)
  const sceneCache = {};
  const loadScene = async (filterId) => {
    if (!filterId || !window.buildSceneSvg) return null;
    if (sceneCache[filterId] !== undefined) return sceneCache[filterId];
    const svg = window.buildSceneSvg(filterId, W, cellH);
    if (!svg) { sceneCache[filterId] = null; return null; }
    const img = await new Promise((res) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = () => res(null);
      im.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    });
    sceneCache[filterId] = img;
    return img;
  };

  const canvas = document.createElement('canvas');
  canvas.width = W;canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1a1410';
  ctx.fillRect(0, 0, W, H);

  const loaded = await Promise.all(frames.map((f) => new Promise((res) => {
    const img = new Image();img.onload = () => res(img);img.onerror = () => res(null);img.src = f.url;
  })));
  const scenes = await Promise.all(frames.map((f) => loadScene(f.filterId)));

  if (isStrip) {
    // Strip mode: lens filter only, no scene SVG add-ons
    loaded.forEach((img, i) => {
      if (!img) return;
      const y = i * (cellH + gap);
      ctx.drawImage(img, 0, y, W, cellH);
    });
  } else if (loaded[0]) {
    ctx.drawImage(loaded[0], 0, 0, W, cellH);
    if (scenes[0]) ctx.drawImage(scenes[0], 0, 0, W, cellH);
  }

  // Pre-load any visual sticker images (SVG and img) so we can drawImage them
  const stickerImgs = {};
  await Promise.all(stickers.map((s) => {
    if (s.kind === 'svg') {
      const url = 'data:image/svg+xml;utf8,' + encodeURIComponent(s.svg);
      return new Promise((res) => {
        const img = new Image();
        img.onload = () => { stickerImgs[s.id] = img; res(); };
        img.onerror = () => res();
        img.src = url;
      });
    }
    if (s.kind === 'img') {
      return new Promise((res) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => { stickerImgs[s.id] = img; res(); };
        img.onerror = () => res();
        img.src = s.src;
      });
    }
    return Promise.resolve();
  }));

  // Stickers on top
  ctx.save();
  stickers.forEach((s) => {
    const cx = s.x * W;
    const cy = s.y * H;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(s.rot * Math.PI / 180);
    ctx.scale(s.scale, s.scale);
    if (s.kind === 'text') {
      ctx.font = '700 48px "Caveat", cursive';
      ctx.textAlign = 'center';ctx.textBaseline = 'middle';
      const w = ctx.measureText(s.content).width + 56;
      const h = 70;
      ctx.fillStyle = '#ffffff';
      roundRect(ctx, -w / 2, -h / 2, w, h, h / 2);
      ctx.fill();
      ctx.lineWidth = 3.5;ctx.strokeStyle = s.color;ctx.stroke();
      ctx.fillStyle = s.color;
      ctx.fillText(s.content, 0, 4);
    } else if ((s.kind === 'svg' || s.kind === 'img') && stickerImgs[s.id]) {
      const img = stickerImgs[s.id];
      const size = 160; // base size matches the on-screen 84px scaled up for canvas
      // soft drop-shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowOffsetX = 6;
      ctx.shadowOffsetY = 8;
      ctx.shadowBlur = 0;
      ctx.drawImage(img, -size/2, -size/2, size, size);
      ctx.restore();
    } else {
      ctx.font = '700 112px "Quicksand", sans-serif';
      ctx.textAlign = 'center';ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillText(s.glyph, 4, 6);
      ctx.fillStyle = s.color;
      ctx.fillText(s.glyph, 0, 0);
    }
    ctx.restore();
  });
  ctx.restore();

  // Polaroid frame — sized to match the live preview's framing
  const PAD_X = 36,PAD_TOP = 36,PAD_BOTTOM = 112;
  const final = document.createElement('canvas');
  final.width = W + PAD_X * 2;
  final.height = H + PAD_TOP + PAD_BOTTOM;
  const fctx = final.getContext('2d');
  fctx.fillStyle = '#ffffff';
  fctx.fillRect(0, 0, final.width, final.height);
  fctx.drawImage(canvas, PAD_X, PAD_TOP);
  // Caption — same Caveat handwriting as the live vf-caption, similar scale
  fctx.fillStyle = '#2a2520';
  fctx.font = '700 44px "Caveat", cursive';
  fctx.textAlign = 'center';fctx.textBaseline = 'middle';
  fctx.fillText(caption || '✦ welcome to sheares ✦', final.width / 2, H + PAD_TOP + PAD_BOTTOM / 2);

  return final.toDataURL('image/jpeg', 0.92);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// =====================================================
// Confetti
// =====================================================
function Confetti({ onDone }) {
  const chars = ['✦', '★', '♥', '✿', '✧', '★', '♡'];
  const colors = ['#e27a3f', '#d65170', '#9333ea', '#16a34a', '#2563eb', '#e2b045'];
  const pieces = useMemo(() => Array.from({ length: 36 }, (_, i) => ({
    char: chars[i % chars.length],
    color: colors[i % colors.length],
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    rot: (Math.random() - 0.5) * 30
  })), []);
  useEffect(() => {
    const t = setTimeout(onDone, 1900);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="confetti">
      {pieces.map((p, i) =>
      <span key={i} style={{
        left: `${p.left}%`,
        animationDelay: `${p.delay}s`,
        color: p.color,
        transform: `rotate(${p.rot}deg)`
      }}>{p.char}</span>
      )}
    </div>);

}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);