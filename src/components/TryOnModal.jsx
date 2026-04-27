import { useEffect, useRef, useState } from 'react';
import { X, Camera, Download, RefreshCw, Gem, AlertCircle, CheckCircle, Info } from 'lucide-react';

// Map jewelry category → how/where to draw on face
const CATEGORY_MODE = {
  'Earrings':           'earrings',
  'Necklaces':          'necklace',
  'Necklace Sets':      'necklace',
  'Haar':               'necklace',
  'Maang Tikka':        'maang_tikka',
  'Nose Rings':         'nose',
  'Complete Bridal Set':'full',
  'Bangles':            'wrist',
  'Bracelets':          'wrist',
  'Rings':              'wrist',
  'Anklets':            'wrist',
};

// MediaPipe Face Mesh key landmark indices
const LM = {
  L_EAR:    234,   // left face edge (ear area)
  R_EAR:    454,   // right face edge
  CHIN:     152,   // bottom of chin
  FOREHEAD: 10,    // top of forehead
  NOSE:     1,     // nose tip
};

function loadFaceMeshScript() {
  return new Promise((resolve, reject) => {
    if (window.FaceMesh) { resolve(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js';
    s.crossOrigin = 'anonymous';
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export default function TryOnModal({ item, onClose }) {
  const videoRef      = useRef(null);
  const canvasRef     = useRef(null);
  const streamRef     = useRef(null);
  const faceMeshRef   = useRef(null);
  const animRef       = useRef(null);
  const landmarksRef  = useRef(null);
  const jewelryRef    = useRef(null);
  const facingRef     = useRef('user');

  const [uiState,       setUiState]       = useState('loading'); // loading | active | error
  const [faceDetected,  setFaceDetected]  = useState(false);
  const [facingMode,    setFacingMode]    = useState('user');
  const [snapshot,      setSnapshot]      = useState(null);
  const [loadingMsg,    setLoadingMsg]    = useState('Starting camera…');

  const mode       = CATEGORY_MODE[item.category] || 'necklace';
  const isFaceMode = mode !== 'wrist';

  // ── Load jewelry image ──────────────────────────────────────
  useEffect(() => {
    const load = (cors) => {
      const img = new Image();
      if (cors) img.crossOrigin = 'anonymous';
      img.onload  = () => { jewelryRef.current = img; };
      img.onerror = () => { if (cors) load(false); }; // retry without cors
      img.src = item.images[0];
    };
    load(true);
  }, [item.images]);

  // ── Animation loop (reads refs — no stale closures) ─────────
  useEffect(() => {
    let alive = true;

    const tick = () => {
      if (!alive) return;
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) {
        animRef.current = requestAnimationFrame(tick); return;
      }

      const ctx = canvas.getContext('2d');
      const W   = canvas.width;
      const H   = canvas.height;
      const mir = facingRef.current === 'user';

      ctx.clearRect(0, 0, W, H);

      // Mirror front camera so it feels like a mirror
      ctx.save();
      if (mir) { ctx.translate(W, 0); ctx.scale(-1, 1); }
      ctx.drawImage(video, 0, 0, W, H);
      ctx.restore();

      const img = jewelryRef.current;
      const lms = landmarksRef.current;

      if (img) {
        if (isFaceMode && lms) {
          drawFaceJewelry(ctx, lms, W, H, mode, img, mir);
          setFaceDetected(true);
        } else if (!isFaceMode) {
          drawWristJewelry(ctx, W, H, img);
        } else {
          setFaceDetected(false);
        }
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(animRef.current); };
  }, [isFaceMode, mode]); // animation loop is independent of facingMode (reads ref)

  // ── Camera + FaceMesh setup ──────────────────────────────────
  useEffect(() => {
    let alive = true;
    landmarksRef.current = null;
    setFaceDetected(false);
    setUiState('loading');
    setLoadingMsg('Accessing camera…');
    facingRef.current = facingMode;

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (!alive) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;

        const video = videoRef.current;
        video.srcObject = stream;
        await new Promise(res => { video.onloadedmetadata = res; });
        video.play();
        if (canvasRef.current) {
          canvasRef.current.width  = video.videoWidth  || 1280;
          canvasRef.current.height = video.videoHeight || 720;
        }

        if (isFaceMode) {
          setLoadingMsg('Loading face detection…');
          await loadFaceMeshScript();
          if (!alive) return;

          const fm = new window.FaceMesh({
            locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
          });
          fm.setOptions({
            maxNumFaces: 1,
            refineLandmarks: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
          fm.onResults(r => {
            landmarksRef.current = r.multiFaceLandmarks?.[0] ?? null;
          });
          faceMeshRef.current = fm;

          // Feed frames to face mesh at ~10 fps
          const feed = async () => {
            if (!alive) return;
            const v = videoRef.current;
            if (v && v.readyState >= 2) {
              try { await fm.send({ image: v }); } catch {}
            }
            if (alive) setTimeout(feed, 100);
          };
          setTimeout(feed, 800);
        }

        if (alive) setUiState('active');
      } catch {
        if (alive) setUiState('error');
      }
    };

    init();
    return () => {
      alive = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
      faceMeshRef.current?.close?.();
    };
  }, [facingMode, isFaceMode]);

  // ── Actions ──────────────────────────────────────────────────
  const flipCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setFacingMode(m => m === 'user' ? 'environment' : 'user');
  };

  const capture = () => {
    if (canvasRef.current) setSnapshot(canvasRef.current.toDataURL('image/png'));
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = snapshot;
    a.download = `ornamint-tryon-${item.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    a.click();
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-gray-950 rounded-3xl overflow-hidden w-full max-w-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Gem size={16} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Virtual Try-On</p>
              <p className="text-gray-400 text-xs truncate max-w-xs">{item.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-xl transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Camera viewport */}
        <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
          <video ref={videoRef} className="hidden" playsInline muted />
          <canvas ref={canvasRef} className="w-full h-full object-cover" />

          {/* Loading */}
          {uiState === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950">
              <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-white text-sm font-medium">{loadingMsg}</p>
              <p className="text-gray-500 text-xs mt-1">Allow camera access if prompted</p>
            </div>
          )}

          {/* Error */}
          {uiState === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 px-10 text-center">
              <AlertCircle size={44} className="text-red-400 mb-4" />
              <p className="text-white font-semibold text-lg mb-2">Camera access denied</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Please allow camera permission in your browser settings, then close and reopen this window.
              </p>
            </div>
          )}

          {/* Active overlays */}
          {uiState === 'active' && (
            <>
              {/* Face detection status */}
              {isFaceMode && (
                <div className={`absolute top-3 left-3 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm transition-all duration-300 ${
                  faceDetected
                    ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                    : 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-300'
                }`}>
                  {faceDetected
                    ? <><CheckCircle size={11} /> Face detected — jewelry active</>
                    : <><AlertCircle size={11} /> Point camera at your face</>}
                </div>
              )}

              {/* Wrist guide */}
              {!isFaceMode && (
                <div className="absolute top-3 left-3 bg-yellow-500/20 border border-yellow-500/40 backdrop-blur-sm text-yellow-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Info size={11} /> Hold your wrist up to the camera
                </div>
              )}

              {/* Controls bottom-right */}
              <div className="absolute bottom-5 right-5 flex flex-col items-center gap-3">
                <button
                  onClick={flipCamera}
                  className="w-10 h-10 bg-white/15 backdrop-blur-sm hover:bg-white/25 rounded-full flex items-center justify-center border border-white/20 transition-all"
                  title="Flip camera"
                >
                  <RefreshCw size={15} className="text-white" />
                </button>
                {/* Shutter button */}
                <button
                  onClick={capture}
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95 relative"
                  title="Take photo"
                >
                  <div className="absolute inset-0 rounded-full border-4 border-white/60" />
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Camera size={20} className="text-gray-800" />
                  </div>
                </button>
              </div>

              {/* Hint bottom-left */}
              <div className="absolute bottom-5 left-5 text-xs text-white/50">
                Tap shutter to capture
              </div>
            </>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-3 bg-gray-900 flex items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            {isFaceMode
              ? 'Look straight into camera · Good lighting helps'
              : 'Hold wrist steady in frame · Good lighting helps'}
          </p>
          <span className="flex-shrink-0 text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2.5 py-1 rounded-full font-medium">
            {item.category}
          </span>
        </div>
      </div>

      {/* Snapshot preview */}
      {snapshot && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-6"
          style={{ zIndex: 60 }}
          onClick={() => setSnapshot(null)}
        >
          <div
            className="bg-gray-900 rounded-2xl overflow-hidden max-w-xl w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <img src={snapshot} alt="Try-on capture" className="w-full" />
            <div className="p-4 flex gap-3">
              <button onClick={download} className="btn-gold flex-1 justify-center py-3 text-sm">
                <Download size={15} /> Save Photo
              </button>
              <button onClick={() => setSnapshot(null)} className="btn-outline-dark flex-1 justify-center py-3 text-sm">
                Retake
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Drawing helpers ──────────────────────────────────────────────────────────

function pt(lms, idx, W, H, mirrored) {
  return {
    x: (mirrored ? 1 - lms[idx].x : lms[idx].x) * W,
    y: lms[idx].y * H,
  };
}

function drawFaceJewelry(ctx, lms, W, H, mode, img, mirrored) {
  const p    = (i) => pt(lms, i, W, H, mirrored);
  const lEar = p(LM.L_EAR);
  const rEar = p(LM.R_EAR);
  const chin = p(LM.CHIN);
  const top  = p(LM.FOREHEAD);
  const nose = p(LM.NOSE);

  const faceW = Math.abs(rEar.x - lEar.x);
  const faceH = Math.abs(chin.y - top.y);
  const ar    = img.naturalWidth / img.naturalHeight;

  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.88;

  if (mode === 'earrings') {
    const size = faceW * 0.32;
    ctx.drawImage(img, lEar.x - size * 0.55, lEar.y,              size, size / ar);
    ctx.drawImage(img, rEar.x - size * 0.45, rEar.y,              size, size / ar);

  } else if (mode === 'necklace') {
    const nw = faceW * 1.65;
    ctx.drawImage(img, chin.x - nw / 2, chin.y + faceH * 0.06,   nw,   nw / ar);

  } else if (mode === 'maang_tikka') {
    const size = faceW * 0.38;
    ctx.drawImage(img, top.x - size / 2,  top.y + 2,              size, size / ar);

  } else if (mode === 'nose') {
    const size = faceW * 0.18;
    ctx.drawImage(img, nose.x - size / 2, nose.y - size * 0.3,    size, size);

  } else if (mode === 'full') {
    // Necklace
    const nw = faceW * 1.65;
    ctx.drawImage(img, chin.x - nw / 2, chin.y + faceH * 0.06,   nw,   nw / ar);
    // Earrings
    const es = faceW * 0.28;
    ctx.drawImage(img, lEar.x - es * 0.5, lEar.y,                 es,   es / ar);
    ctx.drawImage(img, rEar.x - es * 0.5, rEar.y,                 es,   es / ar);
    // Maang tikka
    const ms = faceW * 0.3;
    ctx.drawImage(img, top.x - ms / 2,   top.y + 4,               ms,   ms / ar);
  }

  ctx.restore();
}

function drawWristJewelry(ctx, W, H, img) {
  const size = Math.min(W, H) * 0.45;
  const ar   = img.naturalWidth / img.naturalHeight;
  ctx.save();
  ctx.globalAlpha = 0.82;
  ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(img, W / 2 - size / 2, H / 2 - size / ar / 2, size, size / ar);
  ctx.restore();
}
