import React from 'react';
import { PainTag } from './Tags';
import { PainAction } from './Buttons';

export function PainItem({ pain, toggleVote, onSolve }) {
  return (
    <div className="pain-item" data-status={pain.status} style={{ animation: 'fadeInUp 0.3s ease-out forwards' }}>
      <div className={`pain-item__vote ${pain.voted ? 'voted' : ''}`} onClick={() => toggleVote(pain.id)}>
        <img className="pain-item__upvote-icon" src="assets/upvote.svg" alt="Upvote" />
        <span className="pain-item__vote-count" style={{ transform: pain.scaling ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.15s' }}>
          {pain.votes}
        </span>
      </div>
      <div className="pain-item__content">
        <p className="pain-item__text">{pain.text}</p>
        <PainTag status={pain.status} />
      </div>
      <PainAction 
        status={pain.status} 
        href={pain.toolUrl} 
        onClick={() => onSolve(pain.id)} 
      />
    </div>
  );
}
