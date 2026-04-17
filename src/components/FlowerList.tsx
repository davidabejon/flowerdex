import React, { useState } from 'react';
import { type Flower, CATS, TAG_STYLE } from '../data/flowersData';
import ImageSlider from './ImageSlider';
import Login from './Login';
// Header/Footer are provided by Layout; keep this component focused on list content
import { saveToken } from '../utils/api';

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  bgImage?: string;
  selectedTags: Set<string>;
  toggleTag: (tag: string) => void;
  tagsOpen: boolean;
  setTagsOpen: (v: boolean) => void;
  filteredFlowers: Flower[];
  handleShowDetail: (f: Flower) => void;
  onOpenUpload?: () => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (p: number) => void;
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
  onOpenUpload,
  page,
  totalPages,
  onPageChange,
  bgImage
}) => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin && (
        <Login bgImage={bgImage} onSuccess={() => { setShowLogin(false); window.location.reload(); }} onClose={() => setShowLogin(false)} />
      )}

      <div className="fe-ac-panel">
        <div className="fe-search-row">
          <span className="fe-search-icon" aria-hidden>🔍</span>
          <input
            type="text"
            aria-label="Buscar flores"
            placeholder="Buscar flor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="fe-filter-btn"
            type="button"
            aria-controls="tags-area"
            aria-expanded={tagsOpen}
            onClick={() => setTagsOpen(!tagsOpen)}
          >
            <span>🏷️</span>
            <span>{tagsOpen ? 'Ocultar etiquetas' : 'Filtrar por etiquetas'}</span>
          </button>
          <button className="fe-filter-btn" onClick={() => onOpenUpload && onOpenUpload()}>
            <span>📸</span>
            <span aria-hidden>Subir flor</span>
          </button>
        </div>
        <div id="tags-area" className={`fe-tags-area ${tagsOpen ? 'open' : ''}`}>
          {tagsOpen && (
            <>
              {Object.entries(CATS).map(([catKey, cat]) => (
                <div key={catKey}>
                  <div className="fe-cat-label">
                    {catKey === 'color' && '🎨'} {catKey === 'season' && '🍂'} {catKey === 'shape' && '🌸'} {catKey === 'origin' && '🌍'} {catKey === 'vibe' && '✨'} {cat.tags[0].split('')[0]}
                  </div>
                  <div className="fe-tag-row">
                    {cat.tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={`fe-tag ${cat.cls} ${selectedTags.has(tag) ? 'selected' : ''}`}
                        onClick={() => toggleTag(tag)}
                        aria-pressed={selectedTags.has(tag)}
                        style={TAG_STYLE[catKey] as any}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="fe-results-label">
        {filteredFlowers.length === 0 ? '' : `${filteredFlowers.length} resultado${filteredFlowers.length !== 1 ? 's' : ''}`}
      </div>

      <div className="fe-flower-grid">
        {filteredFlowers.length === 0 ? (
          <div className="fe-empty" role="status" aria-live="polite">
            <span aria-hidden>🌱</span>
            <div>No se encontraron flores</div>
          </div>
        ) : (
          filteredFlowers.map((flower) => (
            <div
              key={flower.id}
              className="fe-fcard"
              role="button"
              tabIndex={0}
              aria-label={`Ver detalles de ${flower.name}`}
              onClick={() => handleShowDetail(flower)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleShowDetail(flower);
                }
              }}
            >
              <div className="fe-fcard-img">
                <ImageSlider images={flower.images} alt={flower.name} small />
                {(flower as any).misclassified && (
                  <div className="fe-mis-badge">Mal catalogada</div>
                )}
              </div>
              <div className="fe-fcard-tab">{flower.name}</div>
            </div>
          ))
        )}
      </div>

      <div className="fe-pagination">
        <button type="button" aria-label="Página anterior" className="fe-pag-btn" onClick={() => onPageChange && onPageChange(Math.max(1, (page||1) - 1))} disabled={!(onPageChange && page && page > 1)}>Anterior</button>
        <div className="fe-pagination-info">Página {page || 1} / {totalPages || 1}</div>
        <button type="button" aria-label="Página siguiente" className="fe-pag-btn" onClick={() => onPageChange && onPageChange(Math.min(totalPages || 1, (page||1) + 1))} disabled={!(onPageChange && page && totalPages && page < totalPages)}>Siguiente</button>
      </div>
    </>
  );
};

export default FlowerList;
