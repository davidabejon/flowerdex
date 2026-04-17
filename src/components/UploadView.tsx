import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadPanel from './UploadPanel';
import { API_BASE, apiFetch } from '../utils/api';

interface Props {
  onUploaded?: () => void;
  onDuplicate?: (photo: { id: number; filename?: string; species?: string }) => void;
}

const UploadView: React.FC<Props> = ({ onUploaded, onDuplicate }) => {
  // recent photos fetched from backend (fallback to emoji placeholders)
  const [recent, setRecent] = useState<Array<{ id?: number; filename?: string; species?: string; emoji?: string }>>(
    [ { emoji: '🌸' }, { emoji: '🌼' }, { emoji: '🌿' }, { emoji: '🍃' }, { emoji: '🌺' }, { emoji: '🌻' } ]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await apiFetch(`/photos?per_page=6`);
        if (!mounted) return;
        if (!resp.ok) return; // keep placeholders on error
        const body = await resp.json();
        if (!body || !Array.isArray(body.photos)) return;
        const photos = body.photos.map((p: any) => ({ id: p.id, filename: p.filename, species: p.species }));
        if (photos.length) setRecent(photos);
      } catch (e) {
        // ignore, keep placeholders
      }
    })();
    return () => { mounted = false; };
  }, []);

  const navigate = useNavigate();

  return (
    <div className="fe-detail-scroll" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

      <div className="fe-upload-hero">
        <div className="fe-upload-hero-inner">
          <div className="fe-topbar-leaf">🍃</div>
          <div className="fe-upload-sub">Sube una foto de la flor para identificarla.</div>
        </div>
      </div>

      <div className="fe-upload-layout">
        <main className="fe-upload-main">
          <div className="fe-ac-panel">
            <UploadPanel onUploaded={() => { if (onUploaded) onUploaded(); }} onDuplicate={(p) => { if (onDuplicate) onDuplicate(p); }} />
          </div>
        </main>

        <aside className="fe-upload-side">
          <div className="fe-ac-panel fe-upload-recent">
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Fotos recientes</div>
            <div className="fe-upload-thumb-grid">
              {recent.map((r, i) => (
                <div key={r.id || i} className="fe-upload-thumb" role="img" aria-label={r.species || 'foto reciente'} onClick={() => r.id ? navigate(`/photos/${r.id}`) : undefined} style={{ cursor: r.id ? 'pointer' : 'default' }}>
                  {r.filename ? (
                    <img src={`${API_BASE}/uploads/${r.filename}`} alt={r.species || 'Foto reciente'} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                  ) : (
                    <div className="fe-upload-thumb-inner">{r.emoji}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

    </div>
  );
};

export default UploadView;
