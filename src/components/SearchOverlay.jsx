import React, { useState, useEffect, useRef } from 'react';
import { searchAll } from '../lib/supabaseService';

export function SearchOverlay({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ pains: [], tools: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setQuery('');
      setResults({ pains: [], tools: [] });
      setHasSearched(false);
    }
  }, [isOpen]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearch = (value) => {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults({ pains: [], tools: [] });
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      const data = await searchAll(value);
      setResults(data);
      setHasSearched(true);
      setIsSearching(false);
    }, 300);
  };

  const handlePainClick = (pain) => {
    onClose();
    if (onNavigate) onNavigate('/#painboard');
  };

  const handleToolClick = (tool) => {
    if (tool.url) {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
    onClose();
  };

  const handleSubmitPain = () => {
    onClose();
    if (onNavigate) onNavigate('/#painboard');
  };

  const totalResults = results.pains.length + results.tools.length;

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-overlay__container page-spring-entry" onClick={(e) => e.stopPropagation()}>
        <div className="search-overlay__header">
          <div className="search-overlay__input-wrap">
            <svg className="search-overlay__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              className="search-overlay__input"
              placeholder="Search pains, tools, and solutions..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <kbd className="search-overlay__kbd">ESC</kbd>
          </div>
        </div>

        <div className="search-overlay__body">
          {isSearching && (
            <div className="search-overlay__loading">
              <div className="search-overlay__spinner"></div>
              <span>Searching...</span>
            </div>
          )}

          {!isSearching && hasSearched && totalResults === 0 && (
            <div className="search-overlay__empty">
              <p className="search-overlay__empty-title">No results found</p>
              <p className="search-overlay__empty-subtitle">Can't find what you're looking for?</p>
              <button className="search-overlay__cta" onClick={handleSubmitPain}>
                Submit your pain →
              </button>
            </div>
          )}

          {!isSearching && results.pains.length > 0 && (
            <div className="search-overlay__section">
              <h4 className="search-overlay__section-title">Pains</h4>
              {results.pains.map(pain => (
                <div
                  key={pain.id}
                  className="search-result-item"
                  onClick={() => handlePainClick(pain)}
                >
                  <div className="search-result-item__left">
                    <span className={`search-result-item__status search-result-item__status--${pain.status}`}>
                      {pain.status.toUpperCase()}
                    </span>
                    <span className="search-result-item__text">{pain.text}</span>
                  </div>
                  <div className="search-result-item__right">
                    <svg className="search-result-item__vote-icon" viewBox="0 0 13 8">
                      <polygon points="6.5,0 13,8 0,8" />
                    </svg>
                    <span className="search-result-item__votes">{pain.votes}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isSearching && results.tools.length > 0 && (
            <div className="search-overlay__section">
              <h4 className="search-overlay__section-title">Tools</h4>
              {results.tools.map(tool => (
                <div
                  key={tool.id}
                  className="search-result-item"
                  onClick={() => handleToolClick(tool)}
                >
                  <div className="search-result-item__left">
                    <span className="search-result-item__status search-result-item__status--tool">
                      {(tool.category || 'TOOL').toUpperCase()}
                    </span>
                    <span className="search-result-item__text">{tool.name}</span>
                  </div>
                  <span className="search-result-item__desc">{tool.description}</span>
                </div>
              ))}
            </div>
          )}

          {!hasSearched && !isSearching && (
            <div className="search-overlay__hints">
              <p className="search-overlay__hint-title">Quick Search</p>
              <p className="search-overlay__hint-text">Search across all pains, tools, and solutions to find what you need.</p>
              <div className="search-overlay__hint-tags">
                <span className="search-overlay__hint-tag" onClick={() => handleSearch('figma')}>figma</span>
                <span className="search-overlay__hint-tag" onClick={() => handleSearch('browser')}>browser</span>
                <span className="search-overlay__hint-tag" onClick={() => handleSearch('QR')}>QR</span>
                <span className="search-overlay__hint-tag" onClick={() => handleSearch('tabs')}>tabs</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
