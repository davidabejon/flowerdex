// FlowerEncyclopedia.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import FlowerList from '../components/FlowerList';
import UploadView from '../components/UploadView';
import FlowerDetail from '../components/FlowerDetail';
import { type Flower, CATS, TAG_STYLE } from '../data/flowersData';

const API = (import.meta.env.VITE_API_URL as string) || 'http://localhost:4000';

// ─── COMPONENTS ───
export const FlowerEncyclopedia: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [tagsOpen, setTagsOpen] = useState(false);
  const [currentFlower, setCurrentFlower] = useState<Flower | null>(null);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [uploadMode, setUploadMode] = useState(false);

  const loadFlowers = useCallback(async () => {
    try {
      const res = await fetch(`${API}/photos`);
      const data = await res.json();
      const mapped: Flower[] = data.map((p: any) => ({
        id: p.id,
        name: p.species || 'Sin identificar',
        latin: (p.metadata && p.metadata.enrichment && p.metadata.enrichment.trefle && p.metadata.enrichment.trefle.data && p.metadata.enrichment.trefle.data[0] && p.metadata.enrichment.trefle.data[0].scientific_name) || '',
        e: '🌸',
        images: [((import.meta.env.VITE_API_URL as string) || 'http://localhost:4000') + '/uploads/' + p.filename],
        desc: (p.metadata && p.metadata.enrichment && p.metadata.enrichment.trefle && p.metadata.enrichment.trefle.data && p.metadata.enrichment.trefle.data[0] && p.metadata.enrichment.trefle.data[0].common_name) || '',
        tags: [] as string[],
      }));
      setFlowers(mapped);
    } catch (e) {
      console.error('Failed to load photos', e);
    }
  }, []);

  useEffect(() => { loadFlowers(); }, [loadFlowers]);

  const filteredFlowers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return flowers.filter((f) => {
      const nOk = !q || f.name.toLowerCase().includes(q) || f.latin.toLowerCase().includes(q);
      const tOk = selectedTags.size === 0 || Array.from(selectedTags).every((t) => f.tags.includes(t));
      return nOk && tOk;
    });
  }, [searchQuery, selectedTags, flowers]);

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
      setSelectedTags((prev) => (prev.has(tag) ? new Set(prev) : new Set([...prev, tag])));
      setTagsOpen(true);
    },
    []
  );

  const handleShowDetail = useCallback((flower: Flower) => {
    setCurrentFlower(flower);
  }, []);

  const handleShowList = useCallback(() => {
    setCurrentFlower(null);
  }, []);

  return (
    <>
      <div className="fe-container">
        <div className="fe-screen">
          {currentFlower ? (
            <FlowerDetail flower={currentFlower} onBack={handleShowList} applyTag={applyTag} />
          ) : uploadMode ? (
            <UploadView onBack={() => { setUploadMode(false); loadFlowers(); }} onUploaded={() => { loadFlowers(); setUploadMode(false); }} />
          ) : (
            <FlowerList
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedTags={selectedTags}
              toggleTag={toggleTag}
              tagsOpen={tagsOpen}
              setTagsOpen={setTagsOpen}
              filteredFlowers={filteredFlowers}
              handleShowDetail={handleShowDetail}
              onReloadPhotos={loadFlowers}
              onOpenUpload={() => setUploadMode(true)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default FlowerEncyclopedia;