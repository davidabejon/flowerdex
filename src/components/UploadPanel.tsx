import React, { useState, useEffect } from 'react';

const API = (import.meta.env.VITE_API_URL as string) || 'http://localhost:4000';

interface Props {
  onUploaded: () => void;
}

const UploadPanel: React.FC<Props> = ({ onUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const resp = await fetch(`${API}/upload`, { method: 'POST', body: fd });
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
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button onClick={submit} disabled={!file || uploading} style={{ padding: '6px 10px' }}>
          {uploading ? 'Subiendo...' : 'Subir'}
        </button>
      </div>
      {preview && <div style={{ marginTop: 8 }}><img src={preview} alt="preview" style={{ maxWidth: 200, maxHeight: 160 }} /></div>}
      {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default UploadPanel;
