// FlowerEncyclopedia.tsx
import React, { useState, useMemo, useCallback } from 'react';

// ─── TYPES ───
interface Flower {
  id: number;
  name: string;
  latin: string;
  e: string;
  desc: string;
  tags: string[];
}

interface Category {
  id: string;
  cls: string;
  tags: string[];
}

interface TagStyle {
  bg: string;
  color: string;
  border: string;
}

// ─── CONSTANTS ───
const CATS: Record<string, Category> = {
  color: { id: 't-color', cls: 'tc', tags: ['Rosa', 'Rojo', 'Blanco', 'Amarillo', 'Naranja', 'Violeta', 'Azul', 'Lila', 'Multicolor'] },
  season: { id: 't-season', cls: 'ts', tags: ['Primavera', 'Verano', 'Otoño', 'Invierno', 'Todo el año'] },
  shape: { id: 't-shape', cls: 'tf', tags: ['Trompeta', 'Estrella', 'Copa', 'Racimo', 'Pompón', 'Parasol', 'Tubo', 'Margarita'] },
  origin: { id: 't-origin', cls: 'to', tags: ['Europa', 'Asia', 'América', 'África', 'Mediterráneo', 'Japón'] },
  vibe: { id: 't-vibe', cls: 'tv', tags: ['Romántico', 'Silvestre', 'Tropical', 'Clásico', 'Delicado', 'Festivo', 'Melancólico', 'Fresco'] },
};

const TAG_STYLE: Record<string, TagStyle> = {
  color: { bg: '#fce4ec', color: '#a3143a', border: '#f4a0bb' },
  season: { bg: '#e8f5e9', color: '#1b5e20', border: '#81c784' },
  shape: { bg: '#e3f2fd', color: '#0d47a1', border: '#64b5f6' },
  origin: { bg: '#fff8e1', color: '#e65100', border: '#ffcc02' },
  vibe: { bg: '#f3e5f5', color: '#4a148c', border: '#ba68c8' },
};

const FLOWERS: Flower[] = [
  {
    id: 1,
    name: 'Rosa',
    latin: 'Rosa spp.',
    e: '🌹',
    desc: 'La reina indiscutible de las flores. Con su perfume embriagador y sus pétalos aterciopelados, la rosa ha simbolizado el amor y la belleza a lo largo de toda la historia. Existen miles de variedades.',
    tags: ['Rosa', 'Rojo', 'Blanco', 'Amarillo', 'Primavera', 'Verano', 'Copa', 'Europa', 'Romántico', 'Clásico'],
  },
  {
    id: 2,
    name: 'Girasol',
    latin: 'Helianthus annuus',
    e: '🌻',
    desc: 'El girasol sigue la trayectoria del sol durante el día, fenómeno llamado heliotropismo. Sus grandes cabezas amarillas son símbolo de alegría y pueden alcanzar más de tres metros de altura.',
    tags: ['Amarillo', 'Verano', 'Margarita', 'América', 'Festivo', 'Silvestre'],
  },
  {
    id: 3,
    name: 'Lavanda',
    latin: 'Lavandula angustifolia',
    e: '💜',
    desc: 'Originaria del Mediterráneo, la lavanda es famosa por su aroma relajante y sus delicadas flores violetas en espiga. Se usa en perfumería, aromaterapia y cocina, y atrae a las abejas.',
    tags: ['Violeta', 'Lila', 'Verano', 'Racimo', 'Mediterráneo', 'Romántico', 'Fresco', 'Delicado'],
  },
  {
    id: 4,
    name: 'Cerezo',
    latin: 'Prunus serrulata',
    e: '🌸',
    desc: 'El hanami o contemplación del cerezo en flor es una de las tradiciones más queridas de Japón. Sus delicados pétalos rosas duran solo unos días, recordándonos la fugacidad de la belleza.',
    tags: ['Rosa', 'Primavera', 'Copa', 'Japón', 'Asia', 'Romántico', 'Melancólico', 'Delicado'],
  },
  {
    id: 5,
    name: 'Tulipán',
    latin: 'Tulipa spp.',
    e: '🌷',
    desc: 'Llegado de Asia Central a Europa en el siglo XVI, el tulipán provocó la mayor burbuja especulativa de la historia: la "tulipomanía" holandesa. Sus formas elegantes lo hacen eterno favorito.',
    tags: ['Rosa', 'Rojo', 'Amarillo', 'Blanco', 'Primavera', 'Copa', 'Europa', 'Asia', 'Clásico', 'Romántico'],
  },
  {
    id: 6,
    name: 'Orquídea',
    latin: 'Orchidaceae',
    e: '🪷',
    desc: 'Con más de 28.000 especies, las orquídeas son una de las familias más grandes del reino vegetal. Sus flores son altamente especializadas para atraer a polinizadores específicos.',
    tags: ['Violeta', 'Rosa', 'Blanco', 'Multicolor', 'Todo el año', 'Tubo', 'Asia', 'América', 'Tropical', 'Delicado'],
  },
  {
    id: 7,
    name: 'Margarita',
    latin: 'Bellis perennis',
    e: '🌼',
    desc: 'La margarita silvestre crece en prados y cunetas con alegre simplicidad. En la tradición popular se deshojaba para saber si alguien te quería o no.',
    tags: ['Blanco', 'Amarillo', 'Primavera', 'Todo el año', 'Margarita', 'Europa', 'Silvestre', 'Fresco'],
  },
  {
    id: 8,
    name: 'Hibisco',
    latin: 'Hibiscus rosa-sinensis',
    e: '🌺',
    desc: 'Flor tropical por excelencia, el hibisco luce grandes flores en forma de trompeta en tonos vibrantes. Es la flor nacional de Malasia y se usa para hacer infusiones y tintes naturales.',
    tags: ['Rojo', 'Naranja', 'Rosa', 'Verano', 'Trompeta', 'Asia', 'África', 'Tropical', 'Festivo'],
  },
  {
    id: 9,
    name: 'Hortensia',
    latin: 'Hydrangea spp.',
    e: '💐',
    desc: 'Las hortensias cambian de color según el pH del suelo: ácido para azul, alcalino para rosa. Originarias de Japón, son protagonistas de jardines y arreglos florales por todo el mundo.',
    tags: ['Azul', 'Rosa', 'Lila', 'Blanco', 'Verano', 'Otoño', 'Pompón', 'Japón', 'Asia', 'Romántico', 'Clásico'],
  },
  {
    id: 10,
    name: 'Amapola',
    latin: 'Papaver rhoeas',
    e: '🌸',
    desc: 'La amapola roja de los campos de cereal es símbolo de recuerdo y esperanza. Sus pétalos sedosos y efímeros caen al menor toque. Fue asociada al sueño y al descanso en el mundo antiguo.',
    tags: ['Rojo', 'Naranja', 'Primavera', 'Verano', 'Copa', 'Europa', 'Melancólico', 'Silvestre'],
  },
  {
    id: 11,
    name: 'Crisantemo',
    latin: 'Chrysanthemum spp.',
    e: '🌸',
    desc: 'En Asia oriental, el crisantemo es símbolo de longevidad y nobleza. En Japón aparece en el sello imperial. Sus pétalos se disponen en pompones perfectos y florece en otoño.',
    tags: ['Amarillo', 'Blanco', 'Violeta', 'Otoño', 'Pompón', 'Japón', 'Asia', 'Clásico', 'Melancólico'],
  },
  {
    id: 12,
    name: 'Dalia',
    latin: 'Dahlia spp.',
    e: '🌸',
    desc: 'Originaria de México, la dalia fue llevada a Europa en el siglo XVIII. Con más de 20.000 variedades registradas, ofrece una variedad de formas y colores inigualable.',
    tags: ['Rojo', 'Naranja', 'Violeta', 'Rosa', 'Multicolor', 'Verano', 'Otoño', 'Pompón', 'América', 'Festivo', 'Clásico'],
  },
];

// ─── COMPONENTS ───
export const FlowerEncyclopedia: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [tagsOpen, setTagsOpen] = useState(false);
  const [currentFlower, setCurrentFlower] = useState<Flower | null>(null);
  const [detailScrollPos, setDetailScrollPos] = useState(0);

  const catOf = useCallback(
    (tag: string): [string, Category] | undefined => {
      return Object.entries(CATS).find(([, c]) => c.tags.includes(tag));
    },
    []
  );

  const filteredFlowers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return FLOWERS.filter((f) => {
      const nOk = !q || f.name.toLowerCase().includes(q) || f.latin.toLowerCase().includes(q);
      const tOk = selectedTags.size === 0 || Array.from(selectedTags).every((t) => f.tags.includes(t));
      return nOk && tOk;
    });
  }, [searchQuery, selectedTags]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  }, []);

  const applyTag = useCallback(
    (tag: string) => {
      setCurrentFlower(null);
      if (!selectedTags.has(tag)) {
        setSelectedTags((prev) => new Set([...prev, tag]));
        setTagsOpen(true);
      }
    },
    [selectedTags]
  );

  const handleShowDetail = useCallback((flower: Flower) => {
    setCurrentFlower(flower);
  }, []);

  const handleShowList = useCallback(() => {
    setCurrentFlower(null);
  }, []);

  if (currentFlower) {
    return (
      <>
        <div className="fe-container">
          <div className="fe-screen fe-detail">
            <div className="fe-topbar">
              <button className="fe-topbar-back" onClick={handleShowList}>
                ←
              </button>
              <span className="fe-topbar-title">{currentFlower.name}</span>
            </div>
            <div
              className="fe-detail-scroll"
              ref={(el) => {
                if (el) el.scrollTop = detailScrollPos;
              }}
            >
              <div className="fe-detail-hero">{currentFlower.e}</div>
              <div className="fe-detail-bubble">
                <div className="fe-detail-name">{currentFlower.name}</div>
                <div className="fe-detail-latin">{currentFlower.latin}</div>
                <div className="fe-detail-desc">{currentFlower.desc}</div>
                <div className="fe-detail-tags-title">Etiquetas</div>
                <div className="fe-detail-tags">
                  {currentFlower.tags.map((tag) => {
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
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fe-container">
        <div className="fe-screen">
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
            {filteredFlowers.length === FLOWERS.length
              ? ''
              : `${filteredFlowers.length} resultado${filteredFlowers.length !== 1 ? 's' : ''}`}
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
        </div>
      </div>
    </>
  );
};

export default FlowerEncyclopedia;