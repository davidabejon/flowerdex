import React from 'react';
import UploadPanel from './UploadPanel';
// Header/Footer are provided by Layout; keep this view focused on upload content

interface Props {
  onBack: () => void;
  onUploaded?: () => void;
  onDuplicate?: (photo: { id: number; filename?: string; species?: string }) => void;
}

const UploadView: React.FC<Props> = ({ onBack, onUploaded, onDuplicate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Header left={<button className="fe-topbar-back" onClick={onBack}>←</button>} title="Subir nueva flor" />

      <div className="fe-detail-scroll">
        <div style={{ padding: 12 }}>
          <div className="fe-ac-panel">
            <UploadPanel onUploaded={() => { if (onUploaded) onUploaded(); }} onDuplicate={(p) => { if (onDuplicate) onDuplicate(p); }} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UploadView;
