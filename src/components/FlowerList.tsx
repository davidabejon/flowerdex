import React from 'react';
import { type Flower, CATS, TAG_STYLE } from '../data/flowersData';

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedTags: Set<string>;
  toggleTag: (tag: string) => void;
  tagsOpen: boolean;
  setTagsOpen: (v: boolean) => void;
  filteredFlowers: Flower[];
  handleShowDetail: (f: Flower) => void;
}

const FlowerList: React.FC<Props> = ({
  searchQuery,
  setSearchQuery,
  selectedTags,
  toggleTag,
  tagsOpen,
  setTagsOpen,
  filteredFlowers,
  handleShowDetail,
}) => {
  return (
    <>
      <div className="fe-topbar">
        <span className="fe-topbar-leaf">🌿</span>
        <span className="fe-topbar-title">Enciclopedia de flores</span>
      </div>

      <div className="fe-ac-panel">
        <div className="fe-search-row">
          <span className="fe-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar flor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          className="fe-filter-btn"
          onClick={() => setTagsOpen(!tagsOpen)}
        >
          <span>🏷️</span>
          <span>{tagsOpen ? 'Ocultar etiquetas' : 'Filtrar por etiquetas'}</span>
        </button>
        {tagsOpen && (
          <div className="fe-tags-area open">
            {Object.entries(CATS).map(([catKey, cat]) => (
              <div key={catKey}>
                <div className="fe-cat-label">
                  {catKey === 'color' && '🎨'} {catKey === 'season' && '🍂'} {catKey === 'shape' && '🌸'} {catKey === 'origin' && '🌍'} {catKey === 'vibe' && '✨'} {cat.tags[0].split('')[0]}
                </div>
                <div className="fe-tag-row">
                  {cat.tags.map((tag) => (
                    <button
                      key={tag}
                      className={`fe-tag ${cat.cls} ${selectedTags.has(tag) ? 'selected' : ''}`}
                      onClick={() => toggleTag(tag)}
                      style={TAG_STYLE[catKey] as any}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fe-results-label">
        {filteredFlowers.length === 0 ? '' : `${filteredFlowers.length} resultado${filteredFlowers.length !== 1 ? 's' : ''}`}
      </div>
      <div className="fe-flower-grid">
        {filteredFlowers.length === 0 ? (
          <div className="fe-empty">
            <span>🌱</span>
            <div>No se encontraron flores</div>
          </div>
        ) : (
          filteredFlowers.map((flower) => (
            <div
              key={flower.id}
              className="fe-fcard"
              onClick={() => handleShowDetail(flower)}
            >
              <div className="fe-fcard-img">{flower.e}</div>
              <div className="fe-fcard-tab">{flower.name}</div>
            </div>
          ))
        )}
      </div>

      <div className="fe-ac-footer">
        <div className="fe-ac-btn-hint">
          <span className="fe-ac-btn-badge teal">A</span> Ver
        </div>
        <div className="fe-ac-btn-hint">
          <span className="fe-ac-btn-badge red">B</span> Cerrar
        </div>
      </div>
    </>
  );
};

export default FlowerList;
