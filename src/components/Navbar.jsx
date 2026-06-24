import React, { useState, useEffect, useRef } from 'react';

export function Navbar({ activePage, onNavigate }) {
  const [opacity, setOpacity] = useState(1);
  const lastScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 100) {
        setOpacity(currentScroll > lastScroll.current ? 0.6 : 1);
      } else {
        setOpacity(1);
      }
      lastScroll.current = currentScroll;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, path) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <nav className="navbar" style={{ opacity, transition: 'opacity 0.2s' }}>
      <div className="navbar__logo">
        <a href="/" onClick={(e) => handleLinkClick(e, '/')} aria-label="ark home">
          <img src="assets/ark-logo.svg" alt="ark logo" style={{ height: '100%', width: 'auto' }} />
        </a>
      </div>
      <div className="navbar__links">
        <a 
          href="/manifesto" 
          className={activePage === 'manifesto' ? 'active' : ''} 
          onClick={(e) => handleLinkClick(e, '/manifesto')}
        >
          manifesto
        </a>
        <a 
          href="/blog" 
          className={activePage === 'blog' ? 'active' : ''} 
          onClick={(e) => handleLinkClick(e, '/blog')}
        >
          blog
        </a>
        <a 
          href="/#painboard" 
          onClick={(e) => handleLinkClick(e, '/#painboard')}
        >
          painboard
        </a>
      </div>
    </nav>
  );
}
