import React, { useEffect, useState } from 'react';

type Photo = {
  id: number;
  filename: string;
  species: string | null;
  confidence: number | null;
  metadata: any;
};

const API = (import.meta.env.VITE_API_URL as string) || 'http://localhost:4000';

interface Props { refreshSignal?: number; onChange?: () => void }

const UploadedPhotos: React.FC<Props> = ({ refreshSignal, onChange }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${API}/photos`);
      const data = await resp.json();
      setPhotos(data);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [refreshSignal]);

  const deletePhoto = async (id: number) => {
    if (!confirm('¿Borrar esta foto? Esta acción no se puede deshacer.')) return;
    try {
      const resp = await fetch(`${API}/photos/${id}`, { method: 'DELETE' });
      if (!resp.ok) throw new Error('Delete failed');
      // refresh list
      await load();
      if (onChange) onChange();
    } catch (e) {
      console.error('Failed to delete photo', e);
      alert('No se pudo borrar la foto');
    }
  };

  if (loading) return <div style={{ padding: 12 }}>Cargando fotos…</div>;
  if (!photos || photos.length === 0) return <div style={{ padding: 12 }}>No hay fotos subidas aún.</div>;

  return (
    <div style={{ padding: 12 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Tus fotos</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
        {photos.map((p) => (
          <div key={p.id} style={{ border: '1px solid #eee', padding: 6, borderRadius: 6, position: 'relative' }}>
            <img src={`${API}/uploads/${p.filename}`} alt={p.species || 'foto'} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
            <div style={{ fontSize: 12, marginTop: 6 }}>{p.species || 'Sin identificar'}</div>
            <button onClick={() => deletePhoto(p.id)} style={{ position: 'absolute', right: 6, top: 6, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer' }}>Borrar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadedPhotos;
