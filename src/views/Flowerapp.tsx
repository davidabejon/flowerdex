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
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const loadFlowers = useCallback(async (p: number = 1) => {
    try {
      const res = await fetch(`${API}/photos?page=${p}&per_page=${perPage}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data && data.photos) || [];
      const mapped: Flower[] = list.map((p: any, idx: number) => ({
        id: p.id || idx,
        name: p.species || 'Sin identificar',
        latin: '',
        e: '🌸',
        images: [((import.meta.env.VITE_API_URL as string) || 'http://localhost:4000') + '/uploads/' + (p.filename || '')],
        desc: '',
        tags: [],
        // keep misc flag on the mapped object so UI can show badge
        misclassified: !!p.misclassified,
      }));
      // update pagination meta when backend returns it
      if (data && typeof data.page === 'number') {
        setPage(data.page || p);
        setTotalPages(data.total_pages || 1);
      } else {
        setPage(p);
        setTotalPages(1);
      }
      setFlowers(mapped);
    } catch (e) {
      console.error('Failed to load photos', e);
    }
  }, []);

  useEffect(() => { loadFlowers(page); }, [loadFlowers, page]);

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
              onReloadPhotos={() => loadFlowers(page)}
              onOpenUpload={() => setUploadMode(true)}
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default FlowerEncyclopedia;