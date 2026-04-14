import React, { useEffect, useState } from 'react';
import { type Flower, TAG_STYLE, CATS } from '../data/flowersData';
import ImageSlider from './ImageSlider';
import { catOf } from '../utils/functions';
import PART_TRANSLATIONS from '../utils/partTranslations';

interface Props {
  flower: Flower;
  onBack: () => void;
  applyTag: (tag: string) => void;
}

const API = (import.meta.env.VITE_API_URL as string) || 'http://localhost:4000';

const FlowerDetail: React.FC<Props> = ({ flower, onBack, applyTag }) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [mainImgLoaded, setMainImgLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchDetails() {
      if (!flower?.id) return;
      setLoading(true);
      try {
        const res = await fetch(`${API}/photos/${flower.id}/details`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const j = await res.json();
        if (!cancelled) setDetails(j);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchDetails();
    return () => { cancelled = true; };
  }, [flower?.id]);

  return (
    <>
      <div className="fe-topbar">
        <button className="fe-topbar-back" onClick={onBack}>
          ←
        </button>
        <span className="fe-topbar-title">{flower.name}</span>
      </div>
      <div className="fe-detail-scroll">
        <div className="fe-detail-hero">
          <ImageSlider images={flower.images} alt={flower.name} />
        </div>
        <div className="fe-detail-bubble">
          <div className="fe-detail-name">{flower.name}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 800 }}>ES</span>
            <div className="fe-detail-name" style={{ margin: 0, fontSize: 16 }}>{details?.enrichment?.trefle?.common_names?.es || '—'}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 800 }}>EN</span>
            <div className="fe-detail-name" style={{ margin: 0, fontSize: 16 }}>{details?.enrichment?.trefle?.common_names?.en || '—'}</div>
          </div>
          <div className="fe-detail-tags-title">Etiquetas</div>
          <div className="fe-detail-tags">
            {flower.tags.map((tag) => {
              const ce = catOf(tag);
              const st = ce ? TAG_STYLE[ce[0]] : { bg: '#eee', color: '#555', border: '#ccc' };
              return (
                <span
                  key={tag}
                  className="fe-dtag"
                  style={{
                    background: st.bg,
                    color: st.color,
                    borderColor: st.border,
                  }}
                  onClick={() => applyTag(tag)}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Detalles</div>
          {loading ? (
            <div>Cargando detalles…</div>
          ) : err ? (
            <div style={{ color: 'red' }}>Error: {err}</div>
          ) : details ? (
            <div>
              <div className='fe-detail-tags-title'>{details.photo?.species || ''}</div>
              <div style={{ fontSize: 13, color: '#444', marginBottom: 8 }}>
                Familia: {details.enrichment?.trefle?.family || details.enrichment?.trefle?.family_common_name || '—'}
                <br />
                Género: {details.enrichment?.trefle?.genus || '—'}
              </div>
              {details.enrichment?.trefle?.image_url ? (
                <div style={{ marginTop: 8, paddingLeft: 12, paddingRight: 12 }}>
                  <div className="fe-trefle-hero">
                    <img
                      src={details.enrichment.trefle.image_url}
                      alt="trefle"
                      onLoad={() => setMainImgLoaded(true)}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 10, background: 'var(--sand)', opacity: mainImgLoaded ? 1 : 0, transition: 'opacity 320ms ease-in-out' }}
                    />
                    <div className="fe-trefle-caption">imagen de muestra</div>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 13, color: '#444', marginBottom: 8 }}>Imagen: —</div>
              )}
            </div>
          ) : (
            <div>Sin detalles disponibles.</div>
          )}
        </div>
        
        {details?.enrichment?.trefle?.images && Object.keys(details.enrichment.trefle.images).length > 0 && (
          <div style={{ padding: 12 }}>
            {Object.entries(details.enrichment.trefle.images).map(([part, arr], idx) => {
              if (!arr || !Array.isArray(arr) || arr.length === 0) return null;
              const images = arr.map((it: any) => it.image_url).filter(Boolean);
              const title = (PART_TRANSLATIONS[part] || (part ? part.charAt(0).toUpperCase() + part.slice(1) : 'Otro')) as string;
              const cls = idx % 2 === 0 ? 'fe-detail-bubble' : 'fe-detail-bubble-alt';
              return (
                <details key={`${part}-${idx}`} className={cls} style={{ marginBottom: 10 }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 800, padding: '8px 12px' }}>{title} ({images.length})</summary>
                  <div style={{ padding: 8 }}>
                    <ImageSlider images={images} alt={title} small />
                    <div style={{ fontSize: 12, marginTop: 8, color: '#666' }}>
                      {arr.map((it: any) => (<div key={it.id}>{it.copyright}</div>))}
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </div>
      <div className="fe-ac-footer">
        <div className="fe-ac-btn-hint">
          <span className="fe-ac-btn-badge red">B</span> Volver
        </div>
      </div>
    </>
  );
};

export default FlowerDetail;
