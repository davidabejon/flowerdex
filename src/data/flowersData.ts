// Shared types and data for the Flower app
export interface Flower {
  id: number;
  name: string;
  latin: string;
  e: string; // legacy emoji fallback
  images: string[]; // image URLs for slider
  desc: string;
  tags: string[];
}

export interface Category {
  id: string;
  cls: string;
  tags: string[];
}

export interface TagStyle {
  bg: string;
  color: string;
  border: string;
}

export const CATS: Record<string, Category> = {
  color: { id: 't-color', cls: 'tc', tags: ['Rosa', 'Rojo', 'Blanco', 'Amarillo', 'Naranja', 'Violeta', 'Azul', 'Lila', 'Multicolor'] },
  season: { id: 't-season', cls: 'ts', tags: ['Primavera', 'Verano', 'Otoño', 'Invierno', 'Todo el año'] },
  shape: { id: 't-shape', cls: 'tf', tags: ['Trompeta', 'Estrella', 'Copa', 'Racimo', 'Pompón', 'Parasol', 'Tubo', 'Margarita'] },
  origin: { id: 't-origin', cls: 'to', tags: ['Europa', 'Asia', 'América', 'África', 'Mediterráneo', 'Japón'] },
  vibe: { id: 't-vibe', cls: 'tv', tags: ['Romántico', 'Silvestre', 'Tropical', 'Clásico', 'Delicado', 'Festivo', 'Melancólico', 'Fresco'] },
};

export const TAG_STYLE: Record<string, TagStyle> = {
  color: { bg: '#fce4ec', color: '#a3143a', border: '#f4a0bb' },
  season: { bg: '#e8f5e9', color: '#1b5e20', border: '#81c784' },
  shape: { bg: '#e3f2fd', color: '#0d47a1', border: '#64b5f6' },
  origin: { bg: '#fff8e1', color: '#e65100', border: '#ffcc02' },
  vibe: { bg: '#f3e5f5', color: '#4a148c', border: '#ba68c8' },
};

// Placeholder images provided by the user
export const PLACEHOLDER_IMAGES = [
  'https://plus.unsplash.com/premium_photo-1676475964992-6404b8db0b53?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zmxvd2VyfGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zmxvd2VyfGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zmxvd2VyfGVufDB8fDB8fHww',
];

export const FLOWERS: Flower[] = [
  {
    id: 1,
    name: 'Rosa',
    latin: 'Rosa spp.',
    e: '🌹',
    images: PLACEHOLDER_IMAGES,
    desc: 'La reina indiscutible de las flores. Con su perfume embriagador y sus pétalos aterciopelados, la rosa ha simbolizado el amor y la belleza a lo largo de toda la historia. Existen miles de variedades.',
    tags: ['Rosa', 'Rojo', 'Blanco', 'Amarillo', 'Primavera', 'Verano', 'Copa', 'Europa', 'Romántico', 'Clásico'],
  },
  {
    id: 2,
    name: 'Girasol',
    latin: 'Helianthus annuus',
    e: '🌻',
    images: PLACEHOLDER_IMAGES,
    desc: 'El girasol sigue la trayectoria del sol durante el día, fenómeno llamado heliotropismo. Sus grandes cabezas amarillas son símbolo de alegría y pueden alcanzar más de tres metros de altura.',
    tags: ['Amarillo', 'Verano', 'Margarita', 'América', 'Festivo', 'Silvestre'],
  },
  {
    id: 3,
    name: 'Lavanda',
    latin: 'Lavandula angustifolia',
    e: '💜',
    images: PLACEHOLDER_IMAGES,
    desc: 'Originaria del Mediterráneo, la lavanda es famosa por su aroma relajante y sus delicadas flores violetas en espiga. Se usa en perfumería, aromaterapia y cocina, y atrae a las abejas.',
    tags: ['Violeta', 'Lila', 'Verano', 'Racimo', 'Mediterráneo', 'Romántico', 'Fresco', 'Delicado'],
  },
  {
    id: 4,
    name: 'Cerezo',
    latin: 'Prunus serrulata',
    e: '🌸',
    images: PLACEHOLDER_IMAGES,
    desc: 'El hanami o contemplación del cerezo en flor es una de las tradiciones más queridas de Japón. Sus delicados pétalos rosas duran solo unos días, recordándonos la fugacidad de la belleza.',
    tags: ['Rosa', 'Primavera', 'Copa', 'Japón', 'Asia', 'Romántico', 'Melancólico', 'Delicado'],
  },
  {
    id: 5,
    name: 'Tulipán',
    latin: 'Tulipa spp.',
    e: '🌷',
    images: PLACEHOLDER_IMAGES,
    desc: 'Llegado de Asia Central a Europa en el siglo XVI, el tulipán provocó la mayor burbuja especulativa de la historia: la "tulipomanía" holandesa. Sus formas elegantes lo hacen eterno favorito.',
    tags: ['Rosa', 'Rojo', 'Amarillo', 'Blanco', 'Primavera', 'Copa', 'Europa', 'Asia', 'Clásico', 'Romántico'],
  },
  {
    id: 6,
    name: 'Orquídea',
    latin: 'Orchidaceae',
    e: '🪷',
    images: PLACEHOLDER_IMAGES,
    desc: 'Con más de 28.000 especies, las orquídeas son una de las familias más grandes del reino vegetal. Sus flores son altamente especializadas para atraer a polinizadores específicos.',
    tags: ['Violeta', 'Rosa', 'Blanco', 'Multicolor', 'Todo el año', 'Tubo', 'Asia', 'América', 'Tropical', 'Delicado'],
  },
  {
    id: 7,
    name: 'Margarita',
    latin: 'Bellis perennis',
    e: '🌼',
    images: PLACEHOLDER_IMAGES,
    desc: 'La margarita silvestre crece en prados y cunetas con alegre simplicidad. En la tradición popular se deshojaba para saber si alguien te quería o no.',
    tags: ['Blanco', 'Amarillo', 'Primavera', 'Todo el año', 'Margarita', 'Europa', 'Silvestre', 'Fresco'],
  },
  {
    id: 8,
    name: 'Hibisco',
    latin: 'Hibiscus rosa-sinensis',
    e: '🌺',
    images: PLACEHOLDER_IMAGES,
    desc: 'Flor tropical por excelencia, el hibisco luce grandes flores en forma de trompeta en tonos vibrantes. Es la flor nacional de Malasia y se usa para hacer infusiones y tintes naturales.',
    tags: ['Rojo', 'Naranja', 'Rosa', 'Verano', 'Trompeta', 'Asia', 'África', 'Tropical', 'Festivo'],
  },
  {
    id: 9,
    name: 'Hortensia',
    latin: 'Hydrangea spp.',
    e: '💐',
    images: PLACEHOLDER_IMAGES,
    desc: 'Las hortensias cambian de color según el pH del suelo: ácido para azul, alcalino para rosa. Originarias de Japón, son protagonistas de jardines y arreglos florales por todo el mundo.',
    tags: ['Azul', 'Rosa', 'Lila', 'Blanco', 'Verano', 'Otoño', 'Pompón', 'Japón', 'Asia', 'Romántico', 'Clásico'],
  },
  {
    id: 10,
    name: 'Amapola',
    latin: 'Papaver rhoeas',
    e: '🌸',
    images: PLACEHOLDER_IMAGES,
    desc: 'La amapola roja de los campos de cereal es símbolo de recuerdo y esperanza. Sus pétalos sedosos y efímeros caen al menor toque. Fue asociada al sueño y al descanso en el mundo antiguo.',
    tags: ['Rojo', 'Naranja', 'Primavera', 'Verano', 'Copa', 'Europa', 'Melancólico', 'Silvestre'],
  },
  {
    id: 11,
    name: 'Crisantemo',
    latin: 'Chrysanthemum spp.',
    e: '🌸',
    images: PLACEHOLDER_IMAGES,
    desc: 'En Asia oriental, el crisantemo es símbolo de longevidad y nobleza. En Japón aparece en el sello imperial. Sus pétalos se disponen en pompones perfectos y florece en otoño.',
    tags: ['Amarillo', 'Blanco', 'Violeta', 'Otoño', 'Pompón', 'Japón', 'Asia', 'Clásico', 'Melancólico'],
  },
  {
    id: 12,
    name: 'Dalia',
    latin: 'Dahlia spp.',
    e: '🌸',
    images: PLACEHOLDER_IMAGES,
    desc: 'Originaria de México, la dalia fue llevada a Europa en el siglo XVIII. Con más de 20.000 variedades registradas, ofrece una variedad de formas y colores inigualable.',
    tags: ['Rojo', 'Naranja', 'Violeta', 'Rosa', 'Multicolor', 'Verano', 'Otoño', 'Pompón', 'América', 'Festivo', 'Clásico'],
  },
];
