const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:4000';

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem('fd_token');
  const headers: Record<string, string> = (opts.headers as any) || {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!headers['Content-Type'] && opts.body && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (res.status === 401) {
    // Token invalid or expired — clear local token and notify app
    saveToken(null);
    try {
      window.dispatchEvent(new CustomEvent('fd:auth:expired'));
    } catch (e) {
      // ignore
    }
  }
  return res;
}

export function saveToken(token: string | null) {
  if (token) localStorage.setItem('fd_token', token);
  else localStorage.removeItem('fd_token');
}
