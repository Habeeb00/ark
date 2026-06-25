import React, { useState, useEffect } from 'react';
import { Hero } from './sections/Hero';
import { WhySection } from './sections/WhySection';
import { BuildSection } from './sections/BuildSection';
import { PainBoardSection } from './sections/PainBoardSection';
import { Footer } from './sections/Footer';
import { ManifestoPage } from './pages/ManifestoPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPreviewPage } from './pages/BlogPreviewPage';
import { SubmitToolPage } from './pages/SubmitToolPage';
import { AdminPage } from './pages/AdminPage';
import { SearchOverlay } from './components/SearchOverlay';
import { INITIAL_PAINS } from './data/constants';
import {
  fetchPains,
  addPain,
  toggleVote as toggleVoteApi,
  submitSolution,
} from './lib/supabaseService';

function App() {
  const [route, setRoute] = useState(window.location.pathname);
  const [searchOpen, setSearchOpen] = useState(false);
  const [pains, setPains] = useState(() => {
    // Start with initial pains for instant render, then load from Supabase
    const saved = localStorage.getItem('ark_pains');
    let loaded = saved ? JSON.parse(saved) : INITIAL_PAINS;
    if (Array.isArray(loaded)) {
      loaded = loaded.filter(p => {
        if (!p || !p.text) return false;
        const norm = p.text.toLowerCase();
        return !norm.includes("i want no pain") && !norm.includes("no pain");
      });
      const seen = new Set();
      loaded = loaded.filter(p => {
        const textKey = p.text.trim().toLowerCase();
        if (seen.has(textKey)) return false;
        seen.add(textKey);
        return true;
      });
    } else {
      loaded = INITIAL_PAINS;
    }
    return loaded;
  });

  // Load pains from Supabase on mount
  useEffect(() => {
    async function loadFromSupabase() {
      try {
        const supabasePains = await fetchPains();
        if (supabasePains && supabasePains.length > 0) {
          setPains(supabasePains);
          // Also sync to localStorage as cache
          localStorage.setItem('ark_pains', JSON.stringify(supabasePains));
        }
      } catch (err) {
        console.warn('Could not load from Supabase, using local data:', err);
      }
    }
    loadFromSupabase();
  }, []);

  // Global Ctrl+K handler for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);

    // Initial check for anchor link on first load
    if (window.location.hash) {
      setTimeout(() => {
        const hash = window.location.hash.substring(1);
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    // If navigating to a section link on the home page (e.g. /#painboard)
    if (path.includes('#')) {
      const parts = path.split('#');
      const pathname = parts[0] || '/';
      const hash = parts[1];
      
      window.history.pushState({}, '', path);
      setRoute(pathname);
      
      // Wait for React rendering, then scroll
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo(0, 0);
        }
      }, 100);
      return;
    }

    window.history.pushState({}, '', path);
    setRoute(path);
    window.scrollTo(0, 0);
  };

  // Supabase-backed handlers
  const handleAddPain = async (title, description) => {
    const newPain = await addPain(title, description);
    if (newPain) {
      setPains(current => [newPain, ...current]);
      return newPain;
    }
    return null;
  };

  const handleToggleVote = async (painId) => {
    await toggleVoteApi(painId);
  };

  const handleSubmitSolution = async (painId, data) => {
    return await submitSolution(painId, data);
  };

  const handleSearchOpen = () => setSearchOpen(true);

  // Render correct page
  if (route === '/manifesto') {
    return (
      <>
        <ManifestoPage onNavigate={navigate} onSearchOpen={handleSearchOpen} />
        <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={navigate} />
      </>
    );
  }
  
  if (route === '/blog') {
    return (
      <>
        <BlogPage onNavigate={navigate} onSearchOpen={handleSearchOpen} />
        <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={navigate} />
      </>
    );
  }
  
  if (route.startsWith('/blog/')) {
    return (
      <>
        <BlogPreviewPage onNavigate={navigate} onSearchOpen={handleSearchOpen} />
        <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={navigate} />
      </>
    );
  }

  if (route === '/submit-tool') {
    return (
      <>
        <SubmitToolPage onNavigate={navigate} onSearchOpen={handleSearchOpen} />
        <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={navigate} />
      </>
    );
  }

  if (route === '/admin') {
    return (
      <>
        <AdminPage onNavigate={navigate} onSearchOpen={handleSearchOpen} />
        <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={navigate} />
      </>
    );
  }

  // Home layout
  return (
    <React.Fragment>
      <Hero onNavigate={navigate} pains={pains} onSearchOpen={handleSearchOpen} />
      <WhySection />
      <BuildSection />
      <PainBoardSection 
        pains={pains} 
        setPains={setPains} 
        onAddPain={handleAddPain}
        onToggleVote={handleToggleVote}
        onSubmitSolution={handleSubmitSolution}
      />
      <Footer />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={navigate} />
    </React.Fragment>
  );
}

export default App;
