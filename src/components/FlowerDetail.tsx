import React from 'react';
import { type Flower, TAG_STYLE, CATS } from '../data/flowersData';
import { catOf } from '../utils/functions';

interface Props {
  flower: Flower;
  onBack: () => void;
  applyTag: (tag: string) => void;
}

const FlowerDetail: React.FC<Props> = ({ flower, onBack, applyTag }) => {

  return (
    <>
      <div className="fe-topbar">
        <button className="fe-topbar-back" onClick={onBack}>
          ←
        </button>
        <span className="fe-topbar-title">{flower.name}</span>
      </div>
      <div className="fe-detail-scroll">
        <div className="fe-detail-hero">{flower.e}</div>
        <div className="fe-detail-bubble">
          <div className="fe-detail-name">{flower.name}</div>
          <div className="fe-detail-latin">{flower.latin}</div>
          <div className="fe-detail-desc">{flower.desc}</div>
          <div className="fe-detail-tags-title">Etiquetas</div>
          <div className="fe-detail-tags">
            {flower.tags.map((tag) => {
              const ce = catOf(tag);
              const st = ce ? TAG_STYLE[ce[0]] : { bg: '#eee', color: '#555', border: '#ccc' };
              return (
                <span
                  key={tag}
                  className="fe-dtag"
                  style={{
                    background: st.bg,
                    color: st.color,
                    borderColor: st.border,
                  }}
                  onClick={() => applyTag(tag)}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <div className="fe-ac-footer">
        <div className="fe-ac-btn-hint">
          <span className="fe-ac-btn-badge red">B</span> Volver
        </div>
      </div>
    </>
  );
};

export default FlowerDetail;
