import React from 'react';

interface Props {
  children?: React.ReactNode;
}

const Footer: React.FC<Props> = ({ children }) => {
  return (
    <div className="fe-ac-footer">
      {children ? (
        children
      ) : (
        <>
          <div className="fe-ac-btn-hint">
            <span className="fe-ac-btn-badge teal">A</span> Ver
          </div>
          <div className="fe-ac-btn-hint">
            <span className="fe-ac-btn-badge red">B</span> Cerrar
          </div>
        </>
      )}
    </div>
  );
};

export default Footer;
