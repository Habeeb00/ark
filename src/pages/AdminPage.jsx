import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import {
  fetchPendingSolutions,
  fetchPendingTools,
  approveSolution,
  rejectSolution,
  approveTool,
  rejectTool,
} from '../lib/supabaseService';

const ADMIN_PASSWORD = 'ark2026';

export function AdminPage({ onNavigate }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [activeTab, setActiveTab] = useState('solutions');
  const [pendingSolutions, setPendingSolutions] = useState([]);
  const [pendingTools, setPendingTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Check if already authed in this session
    if (sessionStorage.getItem('ark_admin_authed') === 'true') {
      setIsAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthed) {
      loadData();
    }
  }, [isAuthed]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthed(true);
      sessionStorage.setItem('ark_admin_authed', 'true');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  const loadData = async () => {
    setLoading(true);
    const [solutions, tools] = await Promise.all([
      fetchPendingSolutions(),
      fetchPendingTools(),
    ]);
    setPendingSolutions(solutions);
    setPendingTools(tools);
    setLoading(false);
  };

  const handleApproveSolution = async (id) => {
    setActionLoading(id);
    await approveSolution(id);
    setPendingSolutions(prev => prev.filter(s => s.id !== id));
    setActionLoading(null);
  };

  const handleRejectSolution = async (id) => {
    setActionLoading(id);
    await rejectSolution(id);
    setPendingSolutions(prev => prev.filter(s => s.id !== id));
    setActionLoading(null);
  };

  const handleApproveTool = async (id) => {
    setActionLoading(id);
    await approveTool(id);
    setPendingTools(prev => prev.filter(t => t.id !== id));
    setActionLoading(null);
  };

  const handleRejectTool = async (id) => {
    setActionLoading(id);
    await rejectTool(id);
    setPendingTools(prev => prev.filter(t => t.id !== id));
    setActionLoading(null);
  };

  // Login Gate
  if (!isAuthed) {
    return (
      <div className="page-admin page-spring-entry">
        <div className="page-container">
          <Navbar onNavigate={onNavigate} />
          <div className="content-container">
            <div className="admin-login page-spring-entry">
              <h2 className="admin-login__title">Admin Access</h2>
              <p className="admin-login__subtitle">Enter the admin password to continue.</p>
              <input
                type="password"
                className="modal-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ borderColor: passwordError ? 'var(--open-text)' : '', maxWidth: '360px' }}
              />
              {passwordError && (
                <p className="admin-login__error">Incorrect password</p>
              )}
              <button className="modal-btn modal-btn--submit" onClick={handleLogin} style={{ marginTop: '8px' }}>
                Enter →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-admin page-spring-entry">
      <div className="page-container">
        <Navbar onNavigate={onNavigate} />
        <div className="content-container">
          <h1 className="admin__title animate-fade-in-up">Admin Review</h1>
          <p className="admin__subtitle animate-fade-in-up delay-200">
            Review and approve submitted solutions and tools.
          </p>

          <div className="admin__tabs animate-fade-in-up delay-300">
            <button
              className={`admin__tab ${activeTab === 'solutions' ? 'active' : ''}`}
              onClick={() => setActiveTab('solutions')}
            >
              Solutions
              {pendingSolutions.length > 0 && (
                <span className="admin__tab-badge">{pendingSolutions.length}</span>
              )}
            </button>
            <button
              className={`admin__tab ${activeTab === 'tools' ? 'active' : ''}`}
              onClick={() => setActiveTab('tools')}
            >
              Tools
              {pendingTools.length > 0 && (
                <span className="admin__tab-badge">{pendingTools.length}</span>
              )}
            </button>
          </div>

          {loading && (
            <div className="admin__loading">
              <div className="search-overlay__spinner"></div>
              <span>Loading...</span>
            </div>
          )}

          {!loading && activeTab === 'solutions' && (
            <div className="admin__list">
              {pendingSolutions.length === 0 ? (
                <div className="admin__empty">
                  <p>No pending solutions to review.</p>
                </div>
              ) : (
                pendingSolutions.map(solution => (
                  <div key={solution.id} className="admin-card">
                    <div className="admin-card__header">
                      <span className="admin-card__type">SOLUTION</span>
                      <span className="admin-card__date">
                        {new Date(solution.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="admin-card__pain">
                      For pain: <span className="italic">{solution.pains?.text || 'Unknown'}</span>
                    </div>

                    <div className="admin-card__details">
                      <div className="admin-card__field">
                        <span className="admin-card__field-label">Tool Name</span>
                        <span className="admin-card__field-value">{solution.tool_name}</span>
                      </div>
                      <div className="admin-card__field">
                        <span className="admin-card__field-label">URL</span>
                        <a
                          href={solution.tool_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-card__field-link"
                        >
                          {solution.tool_url}
                        </a>
                      </div>
                      {solution.tool_description && (
                        <div className="admin-card__field">
                          <span className="admin-card__field-label">Description</span>
                          <span className="admin-card__field-value">{solution.tool_description}</span>
                        </div>
                      )}
                      {solution.contributor_name && (
                        <div className="admin-card__field">
                          <span className="admin-card__field-label">Contributor</span>
                          <span className="admin-card__field-value">
                            {solution.contributor_name}
                            {solution.contributor_email && ` (${solution.contributor_email})`}
                          </span>
                        </div>
                      )}
                    </div>

                    {solution.photo_url && (
                      <div className="admin-card__photo">
                        <img src={solution.photo_url} alt={solution.tool_name} />
                      </div>
                    )}

                    <div className="admin-card__actions">
                      <button
                        className="admin-card__btn admin-card__btn--reject"
                        onClick={() => handleRejectSolution(solution.id)}
                        disabled={actionLoading === solution.id}
                      >
                        {actionLoading === solution.id ? '...' : 'Reject'}
                      </button>
                      <button
                        className="admin-card__btn admin-card__btn--approve"
                        onClick={() => handleApproveSolution(solution.id)}
                        disabled={actionLoading === solution.id}
                      >
                        {actionLoading === solution.id ? '...' : 'Approve ✓'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {!loading && activeTab === 'tools' && (
            <div className="admin__list">
              {pendingTools.length === 0 ? (
                <div className="admin__empty">
                  <p>No pending tools to review.</p>
                </div>
              ) : (
                pendingTools.map(tool => (
                  <div key={tool.id} className="admin-card">
                    <div className="admin-card__header">
                      <span className="admin-card__type">{(tool.category || 'TOOL').toUpperCase()}</span>
                      <span className="admin-card__date">
                        {new Date(tool.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="admin-card__details">
                      <div className="admin-card__field">
                        <span className="admin-card__field-label">Name</span>
                        <span className="admin-card__field-value">{tool.name}</span>
                      </div>
                      <div className="admin-card__field">
                        <span className="admin-card__field-label">URL</span>
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-card__field-link"
                        >
                          {tool.url}
                        </a>
                      </div>
                      {tool.description && (
                        <div className="admin-card__field">
                          <span className="admin-card__field-label">Description</span>
                          <span className="admin-card__field-value">{tool.description}</span>
                        </div>
                      )}
                      {tool.contributor_name && (
                        <div className="admin-card__field">
                          <span className="admin-card__field-label">Contributor</span>
                          <span className="admin-card__field-value">
                            {tool.contributor_name}
                            {tool.contributor_email && ` (${tool.contributor_email})`}
                          </span>
                        </div>
                      )}
                    </div>

                    {tool.photo_url && (
                      <div className="admin-card__photo">
                        <img src={tool.photo_url} alt={tool.name} />
                      </div>
                    )}

                    <div className="admin-card__actions">
                      <button
                        className="admin-card__btn admin-card__btn--reject"
                        onClick={() => handleRejectTool(tool.id)}
                        disabled={actionLoading === tool.id}
                      >
                        {actionLoading === tool.id ? '...' : 'Reject'}
                      </button>
                      <button
                        className="admin-card__btn admin-card__btn--approve"
                        onClick={() => handleApproveTool(tool.id)}
                        disabled={actionLoading === tool.id}
                      >
                        {actionLoading === tool.id ? '...' : 'Approve ✓'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <p className="footer__quote" style={{ marginTop: '80px' }}>"no pain is small"</p>
      </div>
    </div>
  );
}
