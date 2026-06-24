import React, { useState, useEffect } from 'react';
import { Hero } from './sections/Hero';
import { WhySection } from './sections/WhySection';
import { BuildSection } from './sections/BuildSection';
import { PainBoardSection } from './sections/PainBoardSection';
import { Footer } from './sections/Footer';
import { ManifestoPage } from './pages/ManifestoPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPreviewPage } from './pages/BlogPreviewPage';
import { INITIAL_PAINS } from './data/constants';

function App() {
  const [route, setRoute] = useState(window.location.pathname);
  const [pains, setPains] = useState(() => {
    const saved = localStorage.getItem('ark_pains');
    return saved ? JSON.parse(saved) : INITIAL_PAINS;
  });

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

  // Render correct page
  if (route === '/manifesto') {
    return <ManifestoPage onNavigate={navigate} />;
  }
  
  // Floating social dock — shown on all pages
  const SocialDock = () => (
    <div className="social-dock">
      <a href="https://www.instagram.com/arklab.co/" target="_blank" rel="noopener noreferrer" className="social-dock__btn" aria-label="Instagram">
        <img src="assets/instagram.svg" alt="Instagram" />
      </a>
      <a href="#" className="social-dock__btn" aria-label="LinkedIn">
        <img src="assets/linkedin.svg" alt="LinkedIn" />
      </a>
    </div>
  );

  if (route === '/manifesto') {
    return <><ManifestoPage onNavigate={navigate} /><SocialDock /></>;
  }
  
  if (route === '/blog') {
    return <><BlogPage onNavigate={navigate} /><SocialDock /></>;
  }
  
  if (route.startsWith('/blog/')) {
    return <><BlogPreviewPage onNavigate={navigate} /><SocialDock /></>;
  }

  // Home layout
  return (
    <React.Fragment>
      <Hero onNavigate={navigate} pains={pains} />
      <WhySection />
      <BuildSection />
      <PainBoardSection pains={pains} setPains={setPains} />
      <Footer />
      <SocialDock />
    </React.Fragment>
  );
}

export default App;
