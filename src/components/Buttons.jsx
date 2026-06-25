import React from 'react';

export function ViewButton({ href = '#' }) {
  const isExternal = href && href !== '#';
  return (
    <a
      href={href}
      className="card__view-btn"
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      View <span className="arrow">→</span>
    </a>
  );
}

export function PainAction({ status, onClick, href = '#', hasPendingSolution }) {
  if (status === 'solved') {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="pain-item__action pain-item__action--white"
        onClick={(e) => {
          if (href === '#' || !href) {
            e.preventDefault();
          }
        }}
      >
        view tool <span className="arrow">→</span>
      </a>
    );
  }
  if (hasPendingSolution) {
    return <span className="pain-item__action pain-item__action--pending">under review</span>;
  }
  return <button className="pain-item__action" onClick={onClick}>solve this</button>;
}

export function SortTab({ label, value, currentFilter, onClick }) {
  return (
    <button 
      className={`sort-tab ${currentFilter === value ? 'active' : ''}`}
      onClick={() => onClick(value)}
    >
      {label}
    </button>
  );
}
