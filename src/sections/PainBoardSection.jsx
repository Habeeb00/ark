import React, { useState, useEffect, useRef } from 'react';
import { SectionBanner } from '../components/SectionBanner';
import { SortTab } from '../components/Buttons';
import { PainItem } from '../components/PainItem';

export function PainBoardSection({ pains, setPains, onAddPain, onToggleVote, onSubmitSolution }) {
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
  const [contributorName, setContributorName] = useState('');
  const [contributorEmail, setContributorEmail] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formError, setFormError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fileInputRef = useRef(null);

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

  const toggleVote = async (id) => {
    // Optimistic update
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
    
    setTimeout(() => {
      setPains(current => current.map(p => p.id === id ? { ...p, scaling: false } : p));
    }, 150);

    // Persist to Supabase
    if (onToggleVote) {
      await onToggleVote(id);
    }
  };

  const handleAddPain = async () => {
    if (!painTitle.trim()) {
      setTitleError(true);
      setTimeout(() => setTitleError(false), 2000);
      return;
    }

    if (onAddPain) {
      const newPain = await onAddPain(painTitle, painDescription);
      if (newPain) {
        setPainTitle('');
        setPainDescription('');
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
      }
    }
  };

  // Solution modal handlers
  const handleOpenSolveModal = (id) => {
    setSolvingPainId(id);
    setToolName('');
    setToolUrl('');
    setToolDescription('');
    setContributorName('');
    setContributorEmail('');
    setPhotoFile(null);
    setPhotoPreview(null);
    setFormError(false);
    setIsSubmitted(false);
  };

  const handleCloseSolveModal = () => {
    setSolvingPainId(null);
    setIsSubmitted(false);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSolveSubmit = async () => {
    if (!toolName.trim() || !toolUrl.trim()) {
      setFormError(true);
      return;
    }

    setIsSubmitting(true);
    setFormError(false);

    if (onSubmitSolution) {
      const result = await onSubmitSolution(solvingPainId, {
        toolName,
        toolUrl,
        toolDescription,
        contributorName,
        contributorEmail,
        photoFile,
      });

      if (result) {
        setIsSubmitted(true);
        // Mark the pain as having a pending solution locally
        setPains(current =>
          current.map(p => p.id === solvingPainId ? { ...p, hasPendingSolution: true } : p)
        );
      }
    }

    setIsSubmitting(false);
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
            {isSubmitted ? (
              <div className="modal-success">
                <div className="modal-success__icon">✓</div>
                <h3 className="modal-title">Submitted for Review!</h3>
                <p className="modal-subtitle">
                  Your solution has been submitted. Our team will verify the link and approve it shortly.
                </p>
                <button className="modal-btn modal-btn--submit" onClick={handleCloseSolveModal}>
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="modal-title">Solve this Pain</h3>
                <p className="modal-subtitle">
                  Link a tool or solution to: <span className="italic">{pains.find(p => p.id === solvingPainId)?.text}</span>
                </p>
                
                <div className="modal-form">
                  <label className="modal-label">Tool Name *</label>
                  <input 
                    type="text" 
                    className="modal-input" 
                    placeholder="e.g. Chatglider"
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    style={{ borderColor: formError && !toolName.trim() ? 'var(--open-text)' : '' }}
                  />
                  
                  <label className="modal-label">Tool URL *</label>
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

                  <label className="modal-label">Photo / Screenshot (optional)</label>
                  <div
                    className={`photo-upload-zone photo-upload-zone--compact ${photoPreview ? 'has-photo' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file && file.type.startsWith('image/')) {
                        setPhotoFile(file);
                        const reader = new FileReader();
                        reader.onload = (ev) => setPhotoPreview(ev.target.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  >
                    {photoPreview ? (
                      <div className="photo-upload-zone__preview">
                        <img src={photoPreview} alt="Preview" />
                        <button
                          className="photo-upload-zone__remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPhotoFile(null);
                            setPhotoPreview(null);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="photo-upload-zone__placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="photo-upload-zone__icon">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="m21 15-5-5L5 21" />
                        </svg>
                        <span>Click or drop image</span>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handlePhotoChange}
                    />
                  </div>

                  <div className="modal-divider"></div>

                  <p className="modal-section-label">About You (optional)</p>
                  <div className="modal-row">
                    <div className="modal-row__field">
                      <label className="modal-label">Your Name</label>
                      <input 
                        type="text" 
                        className="modal-input" 
                        placeholder="e.g. John"
                        value={contributorName}
                        onChange={(e) => setContributorName(e.target.value)}
                      />
                    </div>
                    <div className="modal-row__field">
                      <label className="modal-label">Email</label>
                      <input 
                        type="email" 
                        className="modal-input" 
                        placeholder="e.g. john@email.com"
                        value={contributorEmail}
                        onChange={(e) => setContributorEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button className="modal-btn modal-btn--cancel" onClick={handleCloseSolveModal}>
                      Cancel
                    </button>
                    <button 
                      className="modal-btn modal-btn--submit" 
                      onClick={handleSolveSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Solution'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
