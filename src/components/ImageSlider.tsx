import React, { useState, useEffect } from 'react';

interface Props {
  images: string[];
  alt?: string;
  small?: boolean;
}

const ImageSlider: React.FC<Props> = ({ images, alt = '', small = false }) => {
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState<Set<number>>(new Set());
  const [maxRatio, setMaxRatio] = useState<number>(0.66); // height/width
  if (!images || images.length === 0) return <div style={{fontSize: small ? 28 : 64}}>{alt ? alt[0] : '🌸'}</div>;

  // Preload images, measure aspect ratios and mark loaded indices to allow smooth fade-in
  useEffect(() => {
    let cancelled = false;
    setLoaded(new Set());
    setMaxRatio(small ? 1 : 0.66);
    images.forEach((src, i) => {
      try {
        const img = new Image();
        img.src = src;
        const markLoaded = () => {
          if (cancelled) return;
          setLoaded(s => new Set(s).add(i));
          try {
            if (img.naturalWidth && img.naturalHeight && !small) {
              const r = img.naturalHeight / img.naturalWidth;
              setMaxRatio(prev => Math.max(prev, r));
            }
          } catch (e) {}
        };
        if (img.decode) {
          img.decode().then(markLoaded).catch(() => { img.onload = markLoaded; });
        } else {
          img.onload = markLoaded;
        }
      } catch (e) {
        // ignore preload errors
      }
    });
    return () => { cancelled = true; };
  }, [images, small]);

  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIdx((i) => (i - 1 + images.length) % images.length);
  };
  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIdx((i) => (i + 1) % images.length);
  };

  const btnSize = small ? 28 : 36;
  const showControls = images.length > 1;

  // Reserve space using padding-bottom to avoid layout shifts when images have different aspect ratios
  const containerStyle: React.CSSProperties = small
    ? { position: 'relative', width: '100%', paddingBottom: '100%', overflow: 'hidden' }
    : { position: 'relative', width: '100%', paddingBottom: `${maxRatio * 100}%`, overflow: 'hidden' };

  return (
    <div style={containerStyle}>
      <img
        src={images[idx]}
        alt={alt}
        style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 'inherit' as any, opacity: loaded.has(idx) ? 1 : 0, transition: 'opacity 320ms ease-in-out', background: 'rgba(255,255,255,0.02)' }}
      />

      {!loaded.has(idx) && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: small ? 20 : 28, height: small ? 20 : 28, borderRadius: 999, border: '3px solid rgba(255,255,255,0.6)', borderTopColor: 'rgba(255,255,255,0.95)', animation: 'spin 1s linear infinite' }} />
        </div>
      )}

      {showControls && (
        <button
          aria-label="Anterior"
          onClick={prev}
          style={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            width: btnSize,
            height: btnSize,
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
          }}
        >
          ‹
        </button>
      )}

      {showControls && (
        <button
          aria-label="Siguiente"
          onClick={next}
          style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            width: btnSize,
            height: btnSize,
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
          }}
        >
          ›
        </button>
      )}

      {showControls && (
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 8, display: 'flex', gap: 6 }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIdx(i); }}
              aria-label={`Ir a imagen ${i + 1}`}
              style={{
                width: small ? 8 : 10,
                height: small ? 8 : 10,
                borderRadius: 10,
                border: 'none',
                background: i === idx ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
