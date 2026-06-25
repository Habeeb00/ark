import React, { useEffect } from 'react';
import { Navbar } from '../components/Navbar';

export function Hero({ onNavigate, pains, onSearchOpen }) {
  useEffect(() => {
    const animatedElements = document.querySelectorAll('.animate-fade-in-up, .animate-fade-in');
    
    if (!animatedElements.length) return;
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
    animatedElements.forEach(el => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const solvedPains = pains ? pains.filter(p => p.status === 'solved' && (p.toolName || p.tool_name)) : [];
  const trendingTool = solvedPains.length > 0
    ? [...solvedPains].sort((a, b) => b.votes - a.votes)[0]
    : {
        toolName: 'Linkspaces',
        toolUrl: 'https://linkspaces.ark.build',
        toolDescription: 'Organise all your links across multiple workspaces.',
        votes: 74,
      };

  return (
    <section className="hero" id="hero">
      <div className="page-container">
        <Navbar onNavigate={onNavigate} onSearchOpen={onSearchOpen} />
        <div className="hero__content">
          <h1 className="hero__heading animate-fade-in-up">We build tools for your pains.</h1>
          <p className="hero__subtitle animate-fade-in-up delay-200">No pain is too small. No problem needs to be profitable to be worth solving.</p>
        </div>
      </div>
      <div className="hero__image animate-fade-in delay-300">
        <img src="assets/hero-hands.png" alt="Two hands reaching towards each other — representing connection and building together" />
      </div>

      {trendingTool && (
        <div className="hero__trending animate-fade-in delay-500">
          <div className="hero__trending-glow"></div>
          <div className="hero__trending-badge">
            <span className="pulse-dot"></span>
            TRENDING TOOL
          </div>
          <div className="hero__trending-body">
            <div className="hero__trending-left">
              <div className="hero__trending-meta">
                <span className="hero__trending-title">{trendingTool.toolName || trendingTool.tool_name}</span>
                <div className="hero__trending-votes">
                  <svg className="hero__trending-votes-icon" viewBox="0 0 13 8">
                    <polygon points="6.5,0 13,8 0,8" />
                  </svg>
                  <span>{trendingTool.votes}</span>
                </div>
              </div>
              <p className="hero__trending-desc">{trendingTool.toolDescription || trendingTool.tool_description || 'A helpful solution built for user pains.'}</p>
            </div>
            <a 
              href={trendingTool.toolUrl || trendingTool.tool_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hero__trending-action"
            >
              view tool <span className="arrow">→</span>
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
