import React from 'react';

export function SectionBanner({ label }) {
  return (
    <div className="section-banner">
      <span className="section-banner__label">{label}</span>
    </div>
  );
}
