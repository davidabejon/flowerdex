import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../utils/api';

interface Props {
  onUploaded: () => void;
  onDuplicate?: (photo: { id: number; filename?: string; species?: string }) => void;
}

const UploadPanel: React.FC<Props> = ({ onUploaded, onDuplicate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<React.ReactNode | null>(null);
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
      if (!resp.ok) {
        // Leer texto primero (más robusto si el servidor no marca JSON)
        let text = '';
        try { text = await resp.text(); } catch (err) { text = ''; }
        let body: any = null;
        if (text) {
          try { body = JSON.parse(text); } catch (err) { body = { error: text }; }
        }
        if (resp.status === 409) {
          const msgText = body && body.error ? (body.error as string) : 'La especie ya está registrada';
          const duplicateId = body && (body.id || body.id === 0) ? body.id : null;
          const duplicateFilename = body && body.filename ? body.filename : null;
          const speciesText = body && body.species ? body.species : null;
          const msg = (
            <div>
              <div>{msgText}</div>
              {speciesText && <div style={{ marginTop: 6, opacity: 0.85 }}>{speciesText}</div>}
              {duplicateId ? (
                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={() => {
                      if (typeof onDuplicate === 'function') {
                        onDuplicate({ id: duplicateId, filename: duplicateFilename, species: speciesText });
                      } else {
                        // fallback: navigate to a detail route
                        window.dispatchEvent(new CustomEvent('fd:show:photo', { detail: { id: duplicateId, filename: duplicateFilename, species: speciesText } }));
                      }
                    }}
                    style={{ padding: '8px 12px', borderRadius: 10, border: 'none', background: 'var(--sand)', cursor: 'pointer', fontWeight: 800 }}
                  >
                    Ver foto registrada
                  </button>
                </div>
              ) : null}
            </div>
          );
          setError(msg);
          return;
        }
        const errMsg = body && body.error ? <>{body.error}{body.species ? <>:<br />{body.species}</> : ''}</> : `Upload failed: ${resp.status}`;
        throw new Error(errMsg as any);
      }
      setFile(null);
      onUploaded();
    } catch (e: any) {
      setError(e.message || 'Error al subir la foto');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div role="region" aria-labelledby="upload-title" style={{ padding: 12, borderTop: '1px solid #eee' }}>
      <div id="upload-title" style={{ marginBottom: 8 }}><strong>Selecciona una foto</strong></div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <label className="visually-hidden" htmlFor="upload-input">Seleccionar foto</label>
        <input
          id="upload-input"
          aria-hidden="true"
          ref={(el) => { inputRef.current = el; }}
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{ padding: '8px 14px', background: 'var(--sand)', border: '2px solid var(--sand2)', borderRadius: 12, fontWeight: 800, color: 'var(--brown-dark)', fontFamily: 'var(--font)', cursor: 'pointer' }}
        >
          {file ? 'Cambiar foto' : 'Abrir galería'}
        </button>

        <button type="button" onClick={submit} disabled={!file || uploading} aria-busy={uploading} style={{ padding: '8px 14px', background: 'var(--green)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, cursor: file ? 'pointer' : 'not-allowed' }}>
          {uploading ? 'Subiendo...' : 'Subir'}
        </button>
      </div>
      {preview && <div style={{ marginTop: 12 }}><img src={preview} alt={file ? `Preview de ${file.name}` : 'Preview'} style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 12, border: '3px solid var(--outline)' }} /></div>}
      {error && (
        <div role="alert" className="fe-error" style={{ marginTop: 12, textAlign: 'left' }}>
          <span className="fe-error-icon">⚠️</span>
          <div>{error}</div>
        </div>
      )}
    </div>
  );
};

export default UploadPanel;
