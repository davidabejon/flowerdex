// FlowerEncyclopedia.tsx
import React, { useState, useMemo, useCallback } from 'react';
import FlowerList from '../components/FlowerList';
import FlowerDetail from '../components/FlowerDetail';
import { type Flower, CATS, TAG_STYLE, FLOWERS } from '../data/flowersData';
import { catOf } from '../utils/functions';

// ─── COMPONENTS ───
export const FlowerEncyclopedia: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [tagsOpen, setTagsOpen] = useState(false);
  const [currentFlower, setCurrentFlower] = useState<Flower | null>(null);

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
            />
          )}
        </div>
      </div>
    </>
  );
};

export default FlowerEncyclopedia;