// FlowerEncyclopedia.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useMatch, useLocation } from 'react-router-dom';
import FlowerList from '../components/FlowerList';
import Login from '../components/Login';
import { API_BASE, apiFetch } from '../utils/api';
import UploadView from '../components/UploadView';
import FlowerDetail from '../components/FlowerDetail';
import Layout from '../components/Layout';
import { type Flower } from '../data/flowersData';

// ─── COMPONENTS ───
export const FlowerEncyclopedia: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inputQuery, setInputQuery] = useState('');
  const [loggedIn, setLoggedIn] = useState<boolean>(() => !!localStorage.getItem('fd_token'));
  const [bgImage, _] = useState<string>(() => {
    try {
      const day = new URL('../assets/bg_day.jpg', import.meta.url).href;
      const night = new URL('../assets/bg_night.jpg', import.meta.url).href;
      return Math.random() < 0.5 ? day : night;
    } catch (e) {
      return '';
    }
  });
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [tagsOpen, setTagsOpen] = useState(false);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const matchDetails = useMatch('/photos/:id');
  const matchUpload = useMatch('/upload');
  const [page, setPage] = useState(1);
  const [perPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  const loadFlowers = useCallback(async (p: number = 1, q: string = '') => {
    try {
      const res = await apiFetch(`/photos?page=${p}&per_page=${perPage}&q=${encodeURIComponent(q || '')}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data && data.photos) || [];
      const mapped: Flower[] = list.map((p: any, idx: number) => ({
        id: p.id || idx,
        name: p.species || 'Sin identificar',
        latin: '',
        e: '🌸',
        images: [(API_BASE) + '/uploads/' + (p.filename || '')],
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
  }, [perPage]);

  const login = useCallback(() => {
    setLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('fd_token');
    setLoggedIn(false);
    navigate('/');
  }, [navigate]);

  // reload when page or searchQuery change
  useEffect(() => { loadFlowers(page, searchQuery); }, [page, searchQuery, loadFlowers]);

  // listen for auth expiration events to show login
  useEffect(() => {
    const onExpired = () => {
      setLoggedIn(false);
    };
    window.addEventListener('fd:auth:expired', onExpired as EventListener);
    return () => { window.removeEventListener('fd:auth:expired', onExpired as EventListener); };
  }, []);

  // debounce inputQuery -> searchQuery (server-side) and reset to page 1
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearchQuery(inputQuery.trim());
    }, 300);
    return () => clearTimeout(t);
  }, [inputQuery]);

  // Ensure we reload the list when returning to the root list route
  useEffect(() => {
    if (location.pathname === '/') {
      loadFlowers(page, searchQuery);
    }
  }, [location.pathname, loadFlowers, page, searchQuery]);

  const filteredFlowers = useMemo(() => {
    // If a server-side search is active, `flowers` already contains filtered results.
    // Only apply tag filtering client-side.
    const tOk = (f: Flower) => selectedTags.size === 0 || Array.from(selectedTags).every((t) => f.tags.includes(t));
    return flowers.filter(f => tOk(f));
  }, [selectedTags, flowers]);

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
      // ensure any detail view is closed
      if (location.pathname.startsWith('/photos/')) navigate('/');
      setSelectedTags((prev) => (prev.has(tag) ? new Set(prev) : new Set([...prev, tag])));
      setTagsOpen(true);
    },
    [location.pathname, navigate]
  );

  const handleShowDetail = useCallback((flower: Flower) => {
    navigate(`/photos/${flower.id}`);
  }, [navigate]);

  const handleShowList = useCallback(() => {
    navigate('/');
    // Ensure list is re-fetched with current page/search params when returning
    loadFlowers(page, searchQuery);
  }, [navigate, loadFlowers, page, searchQuery]);

  // compute layout title: home -> FlowerDex, detail -> flower name
  const layoutTitle = (() => {
    if (matchDetails?.params?.id) {
      const id = matchDetails.params.id;
      const found = id ? flowers.find(f => String(f.id) === String(id)) : null;
      return found?.name || 'Sin identificar';
    }
    if (matchUpload) return 'Subir nueva flor';
    return 'FlowerDex';
  })();

  // decide footer content (only the red "B" button on detail pages)
  const footerRight = matchDetails ? (
    <div className="fe-ac-btn-hint" onClick={() => navigate('/')}>
      <span className="fe-ac-btn-badge red">B</span> Volver
    </div>
  ) : matchUpload ? (
    <div className="fe-ac-btn-hint" onClick={() => navigate('/')}>
      <span className="fe-ac-btn-badge red">B</span> Volver
    </div>
  ) : undefined;

  const footerLeft = matchDetails || matchUpload ? <></> : undefined;

  return (
    <>
      <Layout title={layoutTitle} footerLeft={footerLeft} footerRight={footerRight} onLogin={login} onLogout={logout}>
        {matchDetails ? (
          // if URL is /photos/:id render detail; try to find the flower in current list
          (() => {
            const id = matchDetails.params.id;
            const found = id ? flowers.find(f => String(f.id) === String(id)) : null;
            const f: Flower = found || { id: id ? Number(id) : 0, name: 'Sin identificar', latin: '', e: '🌸', images: [], desc: '', tags: [], };
            return <FlowerDetail flower={f} onBack={handleShowList} applyTag={applyTag} />;
          })()
        ) : matchUpload ? (
          <UploadView
            onBack={() => { navigate('/'); loadFlowers(); }}
            onUploaded={() => { loadFlowers(); navigate('/'); }}
            onDuplicate={(p) => {
              navigate(`/photos/${p.id}`);
            }}
          />
        ) : (
          <FlowerList
            searchQuery={inputQuery}
            setSearchQuery={setInputQuery}
            bgImage={bgImage}
            selectedTags={selectedTags}
            toggleTag={toggleTag}
            tagsOpen={tagsOpen}
            setTagsOpen={setTagsOpen}
            filteredFlowers={filteredFlowers}
            handleShowDetail={handleShowDetail}
            onOpenUpload={() => navigate('/upload')}
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        )}
        {!loggedIn && (
          <Login bgImage={bgImage} onSuccess={() => { setLoggedIn(true); loadFlowers(1, searchQuery); }} onClose={() => { }} />
        )}
      </Layout>
    </>
  );
};

export default FlowerEncyclopedia;