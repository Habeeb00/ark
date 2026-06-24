import React from 'react';

export function Tag({ type }) {
  return <span className={`card__tag card__tag--${type}`}>{type}</span>;
}

export function PainTag({ status }) {
  return <span className={`pain-item__tag pain-item__tag--${status}`}>{status.toUpperCase()}</span>;
}
