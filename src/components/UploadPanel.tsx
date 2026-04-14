import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../utils/api';

const API = (import.meta.env.VITE_API_URL as string) || 'http://localhost:4000';

interface Props {
  onUploaded: () => void;
}

const UploadPanel: React.FC<Props> = ({ onUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const submit = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      const resp = await apiFetch(`/upload`, { method: 'POST', body: fd });
      if (!resp.ok) throw new Error(`Upload failed: ${resp.status}`);
      setFile(null);
      onUploaded();
    } catch (e: any) {
      setError(e.message || 'Upload error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: 12, borderTop: '1px solid #eee' }}>
      <div style={{ marginBottom: 8 }}><strong>Sube una foto</strong></div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <input
          id="upload-input"
          ref={(el) => { inputRef.current = el; }}
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          style={{ padding: '8px 14px', background: 'var(--sand)', border: '2px solid var(--sand2)', borderRadius: 12, fontWeight: 800, color: 'var(--brown-dark)', fontFamily: 'var(--font)', cursor: 'pointer' }}
        >
          {file ? 'Cambiar foto' : 'Seleccionar foto'}
        </button>

        <button onClick={submit} disabled={!file || uploading} style={{ padding: '8px 14px', background: 'var(--green)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, cursor: file ? 'pointer' : 'not-allowed' }}>
          {uploading ? 'Subiendo...' : 'Subir'}
        </button>
      </div>
      {preview && <div style={{ marginTop: 12 }}><img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 12, border: '3px solid var(--outline)' }} /></div>}
      {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default UploadPanel;
