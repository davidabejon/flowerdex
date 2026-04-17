import React from 'react';
import UploadPanel from './UploadPanel';

interface Props {
  onUploaded?: () => void;
  onDuplicate?: (photo: { id: number; filename?: string; species?: string }) => void;
}

const UploadView: React.FC<Props> = ({ onUploaded, onDuplicate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

      <div className="fe-detail-scroll">
        <div style={{ padding: 12 }}>
          <div className="fe-ac-panel">
            <UploadPanel onUploaded={() => { if (onUploaded) onUploaded(); }} onDuplicate={(p) => { if (onDuplicate) onDuplicate(p); }} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default UploadView;
