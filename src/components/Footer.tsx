import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

const Footer: React.FC<Props> = ({ left, right }) => {

  const navigate = useNavigate();

  return (
    <div className="fe-ac-footer">
      <div className="fe-ac-footer-left" aria-hidden>
        {
          left ? (
            left
          ) : (
            <div className="fe-ac-btn-hint">
              <span className="fe-ac-btn-badge teal">A</span> Ver
            </div>
          )
        }
      </div>
      <div className="fe-ac-footer-right">
        {right ? (
          right
        ) : (
          <>
            <div className="fe-ac-btn-hint" onClick={() => navigate('upload')}>
              <span className="fe-ac-btn-badge yellow">Y</span> Subir flor
            </div>
            <div className="fe-ac-btn-hint" onClick={() => navigate('/')}>
              <span className="fe-ac-btn-badge red">B</span> Cerrar
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Footer;
