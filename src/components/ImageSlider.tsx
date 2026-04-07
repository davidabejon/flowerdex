import React, { useState } from 'react';

interface Props {
  images: string[];
  alt?: string;
  small?: boolean;
}

const ImageSlider: React.FC<Props> = ({ images, alt = '', small = false }) => {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return <div style={{fontSize: small ? 28 : 64}}>{alt ? alt[0] : '🌸'}</div>;

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

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <img
        src={images[idx]}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 'inherit' as any }}
      />

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
