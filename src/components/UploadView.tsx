import React from 'react';
import UploadPanel from './UploadPanel';
import UploadedPhotos from './UploadedPhotos';

import { useState } from 'react';

interface Props {
  onBack: () => void;
  onUploaded?: () => void;
}

const UploadView: React.FC<Props> = ({ onBack, onUploaded }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}> 
        <button onClick={onBack} style={{ padding: '6px 10px' }}>← Volver</button>
        <h3 style={{ margin: 0 }}>Subir nueva flor</h3>
      </div>
      <div style={{ marginTop: 12 }}>
        <UploadPanel onUploaded={() => { setRefreshKey((k) => k + 1); if (onUploaded) onUploaded(); }} />
      </div>
      <div style={{ marginTop: 18 }}>
        <UploadedPhotos refreshSignal={refreshKey} onChange={() => { setRefreshKey(k => k + 1); if (onUploaded) onUploaded(); }} />
      </div>
    </div>
  );
};

export default UploadView;
