import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { type Flower, CATS, TAG_STYLE } from '../data/flowersData';
import ImageSlider from './ImageSlider';
import Login from './Login';
import { useLocation } from 'react-router-dom';

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
  paginationVisible?: boolean;
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
  paginationVisible = true,
  bgImage
}) => {
  const [showLogin, setShowLogin] = useState(false);
  const reducedMotion = useReducedMotion();

  const location = useLocation();

  const scrollToTop = () => {
    if (typeof window !== 'undefined' && window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handlePageChangeInternal = (p: number) => {
    if (onPageChange) onPageChange(p);
    scrollToTop();
  };

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
          <button className="fe-filter-btn" onClick={() => onOpenUpload && onOpenUpload()}>
            <span>📸</span>
            <span aria-hidden>Subir flor</span>
          </button>
        </div>
      </div>

      <div className="fe-results-label">
        {filteredFlowers.length === 0 ? '' : `${filteredFlowers.length} resultado${filteredFlowers.length !== 1 ? 's' : ''}`}
      </div>

      <motion.div className="fe-flower-grid" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: reducedMotion ? 0 : 0.03 } } }}>
        {filteredFlowers.length === 0 ? (
          <div className="fe-empty" role="status" aria-live="polite">
            <span aria-hidden>🌱</span>
            <div>No se encontraron flores</div>
          </div>
        ) : (
          filteredFlowers.map((flower) => (
            <motion.div
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
              variants={reducedMotion
                ? { hidden: {}, show: {}, exit: {} }
                : { hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0 }, exit: { opacity: 0 } }}
              initial="hidden"
              animate="show"
              exit="exit"
              style={{ willChange: 'opacity, transform' }}
            >
              <div className="fe-fcard-img">
                <ImageSlider images={flower.images} alt={flower.name} small />
                {(flower as any).misclassified && (
                  <div className="fe-mis-badge">Mal catalogada</div>
                )}
              </div>
              <div className="fe-fcard-tab">{flower.name}</div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Render pagination into a portal so fixed positioning isn't affected by parent transforms */}
      {(() => {
        const paginationInner = (
          <div className="fe-pagination floating">
            <button
              type="button"
              aria-label="Página anterior"
              className="fe-pag-btn"
              onClick={() => handlePageChangeInternal(Math.max(1, (page || 1) - 1))}
              disabled={!(onPageChange && page && page > 1)}
            >
              Anterior
            </button>
            <div className="fe-pagination-info">Página {page || 1} / {totalPages || 1}</div>
            <button
              type="button"
              aria-label="Página siguiente"
              className="fe-pag-btn"
              onClick={() => handlePageChangeInternal(Math.min(totalPages || 1, (page || 1) + 1))}
              disabled={!(onPageChange && page && totalPages && page < totalPages)}
            >
              Siguiente
            </button>
          </div>
        );
        const portalNode = (typeof document !== 'undefined' && document.body) ? document.body : null;
        // consider we're on the list view when not on a detail or upload route
        const isListView = typeof location !== 'undefined' && !location.pathname.startsWith('/photos/') && !location.pathname.startsWith('/upload') && paginationVisible;

        const animated = (
          <AnimatePresence>
            {isListView && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
                {paginationInner}
              </motion.div>
            )}
          </AnimatePresence>
        );

        if (portalNode) {
          return createPortal(animated, portalNode as any);
        }
        return animated;
      })()}
    </>
  );
};

export default FlowerList;
