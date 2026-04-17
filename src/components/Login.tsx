import React, { useState, useRef, useEffect } from 'react';
import { API_BASE, saveToken } from '../utils/api';

interface Props { onSuccess?: () => void; onClose?: () => void; bgImage?: string }

const Login: React.FC<Props> = ({ onSuccess, onClose, bgImage }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const userRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try { userRef.current?.focus(); } catch (e) { /* ignore */ }
  }, []);

  const submit = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || 'Login failed');
      if (j.token) {
        saveToken(j.token);
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally { setLoading(false); }
  };

  return (
    <div aria-hidden={false} style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, backgroundImage: bgImage ? `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${bgImage})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div role="dialog" aria-modal="true" aria-labelledby="login-title" className="fe-ac-panel" style={{ width: 360, maxWidth: '94%', padding: 16, background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(245,246,237,0.96))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div id="login-title" style={{ fontWeight: 800 }}>Iniciar sesión</div>
        </div>
        {err && (
          <div role="alert" className="fe-floating-alert">
            <div className="fe-error">
              <span>{err}</span>
            </div>
          </div>
        )}
        <label className="visually-hidden" htmlFor="login-user">Usuario</label>
        <input id="login-user" className="fe-login-input" ref={userRef} aria-label="Usuario" placeholder="Usuario" value={user} onChange={e => setUser(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submit(); }} style={{ width: '100%', padding: 10, marginBottom: 8, borderRadius: 10, border: '1px solid var(--sand2)' }} />
        <label className="visually-hidden" htmlFor="login-pass">Contraseña</label>
        <input id="login-pass" className="fe-login-input" type="password" aria-label="Contraseña" placeholder="Contraseña" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submit(); }} style={{ width: '100%', padding: 10, marginBottom: 8, borderRadius: 10, border: '1px solid var(--sand2)' }} />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" className="fe-pag-btn" aria-busy={loading} onClick={() => submit()} disabled={loading}>{loading ? 'Entrando…' : 'Entrar'}</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
