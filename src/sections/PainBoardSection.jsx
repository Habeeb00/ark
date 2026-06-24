import React, { useState, useEffect } from 'react';
import { SectionBanner } from '../components/SectionBanner';
import { SortTab } from '../components/Buttons';
import { PainItem } from '../components/PainItem';

export function PainBoardSection({ pains, setPains }) {
  const [filter, setFilter] = useState('all');

  const [painTitle, setPainTitle] = useState('');
  const [painDescription, setPainDescription] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [titleError, setTitleError] = useState(false);

  // Submit Solution modal states
  const [solvingPainId, setSolvingPainId] = useState(null);
  const [toolName, setToolName] = useState('');
  const [toolUrl, setToolUrl] = useState('');
  const [toolDescription, setToolDescription] = useState('');
  const [formError, setFormError] = useState(false);

  // Sorting States
  const [sortBy, setSortBy] = useState('most-felt');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!dropdownOpen) return;
    const closeDropdown = () => setDropdownOpen(false);
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, [dropdownOpen]);

  const handleSortChange = (value) => {
    setSortBy(value);
    setDropdownOpen(false);
  };

  const sortOptions = {
    'most-felt': 'Most felt',
    'least-felt': 'Least felt',
    'newest': 'Newest',
  };

  const tabs = [
    { label: 'all', value: 'all' },
    { label: 'open', value: 'open' },
    { label: 'building', value: 'building' },
    { label: 'solved', value: 'solved' },
  ];

  const filteredPains = filter === 'all' ? pains : pains.filter(p => p.status === filter);

  const sortedPains = [...filteredPains].sort((a, b) => {
    if (sortBy === 'most-felt') {
      return b.votes - a.votes;
    }
    if (sortBy === 'least-felt') {
      return a.votes - b.votes;
    }
    if (sortBy === 'newest') {
      return b.id - a.id;
    }
    return 0;
  });

  const stats = {
    total: pains.length,
    open: pains.filter(p => p.status === 'open').length,
    solved: pains.filter(p => p.status === 'solved').length,
  };

  const toggleVote = (id) => {
    const updated = pains.map(p => {
      if (p.id === id) {
        const voted = !p.voted;
        return { 
          ...p, 
          voted, 
          votes: p.votes + (voted ? 1 : -1),
          scaling: true
        };
      }
      return p;
    });

    setPains(updated);
    localStorage.setItem('ark_pains', JSON.stringify(updated));
    
    setTimeout(() => {
      setPains(current => current.map(p => p.id === id ? { ...p, scaling: false } : p));
    }, 150);
  };

  const handleAddPain = () => {
    if (!painTitle.trim()) {
      setTitleError(true);
      setTimeout(() => setTitleError(false), 2000);
      return;
    }

    const newPain = {
      id: Date.now(),
      text: `“${painTitle.trim()}”`,
      status: 'open',
      votes: 1,
      voted: true,
    };

    const updated = [newPain, ...pains];
    setPains(updated);
    localStorage.setItem('ark_pains', JSON.stringify(updated));

    setPainTitle('');
    setPainDescription('');
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  // Solution modal handlers
  const handleOpenSolveModal = (id) => {
    setSolvingPainId(id);
    setToolName('');
    setToolUrl('');
    setToolDescription('');
    setFormError(false);
  };

  const handleCloseSolveModal = () => {
    setSolvingPainId(null);
  };

  const handleSolveSubmit = () => {
    if (!toolName.trim() || !toolUrl.trim()) {
      setFormError(true);
      return;
    }

    // Ensure URL has protocol
    let formattedUrl = toolUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const updated = pains.map(p => {
      if (p.id === solvingPainId) {
        return {
          ...p,
          status: 'solved',
          toolName: toolName.trim(),
          toolUrl: formattedUrl,
          toolDescription: toolDescription.trim(),
        };
      }
      return p;
    });

    setPains(updated);
    localStorage.setItem('ark_pains', JSON.stringify(updated));
    setSolvingPainId(null);
  };

  return (
    <section className="section-painboard" id="painboard">
      <SectionBanner label="[03] PAIN BOARD" />
      <div className="section-painboard__content">
        <div className="painboard-inner">
          <h2 className="section-painboard__title">What's bothering people?</h2>

          <div className="sort-tabs">
            <div className="sort-tabs__options">
              {tabs.map(tab => (
                <SortTab 
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                  currentFilter={filter}
                  onClick={setFilter}
                />
              ))}
            </div>
            <div className="sort-filter-wrapper" style={{ position: 'relative' }}>
              <button 
                className="sort-filter" 
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
              >
                {sortOptions[sortBy]} <span className="sort-filter__icon" style={{ fontSize: '8px', marginLeft: '6px' }}>▼</span>
              </button>
              {dropdownOpen && (
                <div className="sort-dropdown">
                  <div className="sort-dropdown__item" onClick={() => handleSortChange('most-felt')}>Most felt</div>
                  <div className="sort-dropdown__item" onClick={() => handleSortChange('least-felt')}>Least felt</div>
                  <div className="sort-dropdown__item" onClick={() => handleSortChange('newest')}>Newest</div>
                </div>
              )}
            </div>
          </div>

          <div className="pain-list">
            {sortedPains.map(pain => (
              <PainItem 
                key={pain.id} 
                pain={pain} 
                toggleVote={toggleVote} 
                onSolve={handleOpenSolveModal}
              />
            ))}
          </div>

          <div className="pain-stats">
            <div className="pain-stats__counts">
              <div className="pain-stats__group">
                <span className="pain-stats__number">{stats.total}</span>
                <span className="pain-stats__label">pains</span>
              </div>
              <div className="pain-stats__separator"></div>
              <div className="pain-stats__group">
                <span className="pain-stats__number">{stats.open}</span>
                <span className="pain-stats__label">open</span>
              </div>
              <div className="pain-stats__separator"></div>
              <div className="pain-stats__group">
                <span className="pain-stats__number">{stats.solved}</span>
                <span className="pain-stats__label">solved</span>
              </div>
            </div>
            <span className="pain-stats__hint">click ↑ to say you feel it too</span>
          </div>

          <div className="contact-box">
            <div className="contact-box__inner">
              <div className="contact-box__header">
                <h3 className="contact-box__title">What's bothering you?</h3>
                <p className="contact-box__subtitle">add your pains to the pain board</p>
              </div>
              <input 
                type="text" 
                className="contact-box__input" 
                placeholder="I keep losing ..."
                value={painTitle}
                onChange={(e) => setPainTitle(e.target.value)}
                style={{ borderColor: titleError ? 'var(--open-text)' : '' }}
              />
              <textarea 
                className="contact-box__textarea" 
                placeholder="Why does it bother much?"
                value={painDescription}
                onChange={(e) => setPainDescription(e.target.value)}
              ></textarea>
              <button 
                className="contact-box__submit" 
                onClick={handleAddPain}
                style={isAdded ? { background: 'var(--solved-text)', color: 'white' } : {}}
              >
                {isAdded ? 'added ✓' : 'add pain →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Solution Modal */}
      {solvingPainId !== null && (
        <div className="modal-overlay">
          <div className="modal-card page-spring-entry">
            <h3 className="modal-title">Solve this Pain</h3>
            <p className="modal-subtitle">
              Link a tool or solution to: <span className="italic">{pains.find(p => p.id === solvingPainId)?.text}</span>
            </p>
            
            <div className="modal-form">
              <label className="modal-label">Tool Name</label>
              <input 
                type="text" 
                className="modal-input" 
                placeholder="e.g. Chatglider"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                style={{ borderColor: formError && !toolName.trim() ? 'var(--open-text)' : '' }}
              />
              
              <label className="modal-label">Tool URL</label>
              <input 
                type="text" 
                className="modal-input" 
                placeholder="e.g. chatglider.ark.build"
                value={toolUrl}
                onChange={(e) => setToolUrl(e.target.value)}
                style={{ borderColor: formError && !toolUrl.trim() ? 'var(--open-text)' : '' }}
              />

              <label className="modal-label">How it solves the pain (optional)</label>
              <textarea 
                className="modal-textarea" 
                placeholder="Brief explanation..."
                value={toolDescription}
                onChange={(e) => setToolDescription(e.target.value)}
              />

              <div className="modal-actions">
                <button className="modal-btn modal-btn--cancel" onClick={handleCloseSolveModal}>
                  Cancel
                </button>
                <button className="modal-btn modal-btn--submit" onClick={handleSolveSubmit}>
                  Submit Solution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
