import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Flower, TAG_STYLE } from '../data/flowersData';
import ImageSlider from './ImageSlider';
// Header/Footer are provided by Layout; keep this component focused on detail content
import { catOf } from '../utils/functions';
import { apiFetch } from '../utils/api';
import PART_TRANSLATIONS from '../utils/partTranslations';

interface Props {
  flower: Flower;
  onBack: () => void;
  applyTag: (tag: string) => void;
}

const FlowerDetail: React.FC<Props> = ({ flower, onBack, applyTag }) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [mainImgLoaded, setMainImgLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [misloading, setMisloading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteErr, setDeleteErr] = useState<string | null>(null);

  const [formSpecies, setFormSpecies] = useState('');
  const [formCommonEs, setFormCommonEs] = useState('');
  const [formCommonEn, setFormCommonEn] = useState('');
  const [formFamily, setFormFamily] = useState('');
  const [formGenus, setFormGenus] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function fetchDetails() {
      if (!flower?.id) return;
      setLoading(true);
      try {
        const res = await apiFetch(`/photos/${flower.id}/details`);
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

  // populate form when details load
  useEffect(() => {
    if (!details) return;
    setFormSpecies(details.photo?.species || '');
    const trefle = details.enrichment?.trefle || {};
    const commons = trefle.common_names || {};
    setFormCommonEs(commons.es || '');
    setFormCommonEn(commons.en || '');
    setFormFamily(trefle.family || details.enrichment?.family || '');
    setFormGenus(trefle.genus || details.enrichment?.genus || '');
  }, [details]);

  const toggleMisclassified = async (value?: boolean) => {
    if (!details?.photo?.id) return;
    setMisloading(true);
    try {
      const res = await apiFetch(`/photos/${details.photo.id}/misclassified`, {
        method: 'POST',
        body: JSON.stringify({ misclassified: typeof value === 'boolean' ? value : !details.photo.misclassified })
      });
      if (!res.ok) throw new Error('Status ' + res.status);
      await refreshDetails();
    } catch (e: any) {
      console.error(e);
      setErr(e?.message || String(e));
    } finally {
      setMisloading(false);
    }
  };

  async function refreshDetails() {
    if (!flower?.id) return;
    setLoading(true);
    try {
      const res = await apiFetch(`/photos/${flower.id}/details`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const j = await res.json();
      setDetails(j);
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  const saveOverrides = async () => {
    if (!details?.photo?.id) return;
    setSaving(true);
    const overrides: any = {};
    if (formSpecies) overrides.species = formSpecies;
    const trefle: any = {};
    const common: any = {};
    if (formCommonEs) common.es = formCommonEs;
    if (formCommonEn) common.en = formCommonEn;
    if (Object.keys(common).length) trefle.common_names = common;
    if (formFamily) trefle.family = formFamily;
    if (formGenus) trefle.genus = formGenus;
    if (Object.keys(trefle).length) overrides.enrichment = { trefle };

    try {
      const res = await apiFetch(`/photos/${details.photo.id}/overrides`, {
        method: 'PUT',
        body: JSON.stringify(overrides)
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error('Status ' + res.status + ' ' + t);
      }
      await refreshDetails();
      setEditing(false);
    } catch (e: any) {
      console.error(e);
      setErr(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  };

  const deletePhoto = async () => {
    if (!details?.photo?.id) return;
    setDeleting(true);
    setDeleteErr(null);
    try {
      const res = await apiFetch(`/photos/${details.photo.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const t = await res.text();
        throw new Error('Status ' + res.status + ' ' + t);
      }
      // go back to list after successful deletion
      onBack();
    } catch (e: any) {
      console.error(e);
      setDeleteErr(e?.message || String(e));
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="fe-detail-scroll">
        <div className="fe-detail-hero">
          <ImageSlider images={flower.images} alt={flower.name} />
        </div>
        <div className="fe-detail-bubble" style={{ zIndex: 1, marginTop: -36, boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
          <div className="fe-detail-name">{flower.name}</div>
          {details?.photo?.misclassified && (
            <div style={{ color: '#b00020', fontWeight: 800, marginTop: 6 }}>Mal catalogada — revisar</div>
          )}
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

              <div className="fe-detail-actions">
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button className="fe-pag-btn" onClick={() => setEditing(!editing)} disabled={!details}>{editing ? 'Cancelar' : 'Editar'}</button>
                  <button className="fe-pag-btn" onClick={() => toggleMisclassified()} disabled={misloading || !details}>{details?.photo?.misclassified ? 'Desmarcar mal catalogada' : 'Marcar mal catalogada'}</button>
                  <button className="fe-pag-btn" onClick={() => setShowDeleteModal(true)} disabled={!details} style={{ background: '#ff6666', color: '#fff' }}>Eliminar</button>
                </div>

                {editing && (
                  <div className="fe-edit-inline">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: 12, fontWeight: 700 }}>Especie (binomial)</label>
                      <input value={formSpecies} onChange={e => setFormSpecies(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #ddd' }} />

                      <label style={{ fontSize: 12, fontWeight: 700 }}>Nombres comunes (ES)</label>
                      <input value={formCommonEs} onChange={e => setFormCommonEs(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #ddd' }} />

                      <label style={{ fontSize: 12, fontWeight: 700 }}>Nombres comunes (EN)</label>
                      <input value={formCommonEn} onChange={e => setFormCommonEn(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #ddd' }} />

                      <label style={{ fontSize: 12, fontWeight: 700 }}>Familia</label>
                      <input value={formFamily} onChange={e => setFormFamily(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #ddd' }} />

                      <label style={{ fontSize: 12, fontWeight: 700 }}>Género</label>
                      <input value={formGenus} onChange={e => setFormGenus(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #ddd' }} />

                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
                        <button className="fe-pag-btn" onClick={() => setEditing(false)} disabled={saving}>Cancelar</button>
                        <button className="fe-pag-btn" onClick={() => saveOverrides()} disabled={saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</button>
                      </div>
                    </div>
                  </div>
                )}
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
            {(() => {
              const imgs = details.enrichment.trefle.images as Record<string, any[]>;
              const order = ['flower','leaf','fruit','seed','fruit_or_seed','habit','bark','foliage','other',''];
              const partsToRender: Array<{ part: string; arr: any[] }>=[];
              for (const p of order) {
                const arr = imgs[p];
                if (arr && Array.isArray(arr) && arr.length > 0) partsToRender.push({ part: p, arr });
              }
              // also include any other keys not in the order, appended afterwards
              for (const [p, arr] of Object.entries(imgs)) {
                if (!order.includes(p) && arr && Array.isArray(arr) && arr.length > 0) partsToRender.push({ part: p, arr });
              }

              return partsToRender.map(({ part, arr }, idx) => {
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
              });
            })()}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', padding: 20, borderRadius: 8, width: 400, maxWidth: '90%' }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Confirmar eliminación</div>
            <div style={{ marginBottom: 12 }}>¿Estás seguro de que quieres eliminar esta entrada? Esta acción no se puede deshacer.</div>
            {deleteErr && <div style={{ color: 'red', marginBottom: 8 }}>Error: {deleteErr}</div>}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="fe-pag-btn" onClick={() => { setShowDeleteModal(false); setDeleteErr(null); }} disabled={deleting}>Cancelar</button>
              <button className="fe-pag-btn" onClick={() => deletePhoto()} disabled={deleting} style={{ background: '#b00020', color: '#fff' }}>{deleting ? 'Eliminando…' : 'Eliminar definitivamente'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FlowerDetail;
