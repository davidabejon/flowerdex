import React from 'react';
import UploadPanel from './UploadPanel';

interface Props {
  onBack: () => void;
  onUploaded?: () => void;
}

const UploadView: React.FC<Props> = ({ onBack, onUploaded }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div className="fe-topbar">
        <button className="fe-topbar-back" onClick={onBack}>←</button>
        <span className="fe-topbar-title">Subir nueva flor</span>
      </div>

      <div className="fe-detail-scroll">
        <div style={{ padding: 12 }}>
          <div className="fe-ac-panel">
            <UploadPanel onUploaded={() => { if (onUploaded) onUploaded(); }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadView;
