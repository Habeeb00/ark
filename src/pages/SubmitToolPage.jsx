import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { submitTool } from '../lib/supabaseService';

export function SubmitToolPage({ onNavigate }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('tool');
  const [contributorName, setContributorName] = useState('');
  const [contributorEmail, setContributorEmail] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !url.trim()) {
      setFormError(true);
      return;
    }

    setIsSubmitting(true);
    setFormError(false);

    const result = await submitTool({
      name,
      url,
      description,
      category,
      contributorName,
      contributorEmail,
      photoFile,
    });

    setIsSubmitting(false);

    if (result) {
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setName('');
    setUrl('');
    setDescription('');
    setCategory('tool');
    setContributorName('');
    setContributorEmail('');
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsSubmitted(false);
    setFormError(false);
  };

  if (isSubmitted) {
    return (
      <div className="page-submit-tool page-spring-entry">
        <div className="page-container">
          <Navbar activePage="submit-tool" onNavigate={onNavigate} />
          <div className="content-container">
            <div className="submit-tool__success page-spring-entry">
              <div className="submit-tool__success-icon">✓</div>
              <h2 className="submit-tool__success-title">Tool Submitted!</h2>
              <p className="submit-tool__success-text">
                Your tool has been submitted for review. Our team will verify the details and approve it shortly.
              </p>
              <div className="submit-tool__success-actions">
                <button className="modal-btn modal-btn--cancel" onClick={handleReset}>Submit Another</button>
                <button className="modal-btn modal-btn--submit" onClick={() => onNavigate('/')}>Back to Home</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-submit-tool page-spring-entry">
      <div className="page-container">
        <Navbar activePage="submit-tool" onNavigate={onNavigate} />
        <div className="content-container">
          <h1 className="submit-tool__title animate-fade-in-up">Submit a Tool</h1>
          <p className="submit-tool__subtitle animate-fade-in-up delay-200">
            Know a tool that solves a real pain? Share it with the community.
          </p>

          <div className="submit-tool__form animate-fade-in-up delay-300">
            <div className="submit-tool__row">
              <div className="submit-tool__field">
                <label className="modal-label">Tool Name *</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="e.g. Linkspaces"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ borderColor: formError && !name.trim() ? 'var(--open-text)' : '' }}
                />
              </div>
              <div className="submit-tool__field">
                <label className="modal-label">Tool URL *</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="e.g. linkspaces.me"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={{ borderColor: formError && !url.trim() ? 'var(--open-text)' : '' }}
                />
              </div>
            </div>

            <label className="modal-label">Description</label>
            <textarea
              className="modal-textarea"
              placeholder="What does this tool do? What pain does it solve?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label className="modal-label">Category</label>
            <select
              className="modal-input submit-tool__select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="tool">Tool</option>
              <option value="product">Product</option>
              <option value="plugin">Plugin</option>
              <option value="extension">Extension</option>
              <option value="other">Other</option>
            </select>

            <label className="modal-label">Photo / Screenshot (optional)</label>
            <div
              className={`photo-upload-zone ${photoPreview ? 'has-photo' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
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
                  <span>Click or drag & drop an image</span>
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

            <div className="submit-tool__divider"></div>

            <p className="submit-tool__section-label">About You (optional)</p>
            <div className="submit-tool__row">
              <div className="submit-tool__field">
                <label className="modal-label">Your Name</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="e.g. John"
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                />
              </div>
              <div className="submit-tool__field">
                <label className="modal-label">Your Email</label>
                <input
                  type="email"
                  className="modal-input"
                  placeholder="e.g. john@example.com"
                  value={contributorEmail}
                  onChange={(e) => setContributorEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: '16px' }}>
              <button className="modal-btn modal-btn--cancel" onClick={() => onNavigate('/')}>Cancel</button>
              <button
                className="modal-btn modal-btn--submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Tool →'}
              </button>
            </div>
          </div>
        </div>
        <p className="footer__quote" style={{ marginTop: '80px' }}>"no pain is small"</p>
      </div>
    </div>
  );
}
