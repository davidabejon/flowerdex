import React from 'react';
import { saveToken } from '../utils/api';

interface Props {
  title?: string;
  left?: React.ReactNode;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Header: React.FC<Props> = ({ title = '', left, onLogin, onLogout }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('fd_token') : null;

  const handleLogout = () => {
    if (onLogout) return onLogout();
    saveToken(null);
    window.location.reload();
  };

  return (
    <div className="fe-topbar">
      {left ? left : <span className="fe-topbar-leaf">🌿</span>}
      <span className="fe-topbar-title">{title}</span>
      <div style={{ marginLeft: 'auto' }}>
        {token ? (
          <button className="fe-topbar-back" type="button" aria-label="Cerrar sesión" onClick={handleLogout}>Salir</button>
        ) : (
          <button className="fe-topbar-back" type="button" aria-label="Abrir formulario de ingreso" onClick={() => onLogin && onLogin()}>Entrar</button>
        )}
      </div>
    </div>
  );
};

export default Header;
