import React from 'react';
import { Tag } from './Tags';
import { ViewButton } from './Buttons';

export function BuilderAvatars({ builders }) {
  return (
    <div className="card__builders">
      {builders.map((b, i) => (
        <img key={i} className="card__builder-avatar" src={b.src} alt={b.alt} />
      ))}
    </div>
  );
}

export function SmallTile({ project }) {
  return (
    <div className="card">
      <div className="card__top">
        <Tag type={project.type} />
      </div>
      <div className="card__body">
        <h3 className="card__title">{project.title}</h3>
        <p className="card__description">{project.description}</p>
      </div>
      <div className="card__bottom">
        <BuilderAvatars builders={project.builders} />
        <ViewButton href={project.href} />
      </div>
    </div>
  );
}

export function LargeTile({ project }) {
  return (
    <div className="card card--large">
      <div className="card__content-area">
        <div className="card__top">
          <Tag type={project.type} />
          {project.usage && <span className="card__usage">{project.usage}</span>}
        </div>
        <div className="card__body">
          <h3 className="card__title">{project.title}</h3>
          <p className="card__description">{project.description}</p>
        </div>
        <div className="card__bottom">
          <BuilderAvatars builders={project.builders} />
          <ViewButton href={project.href} />
        </div>
      </div>
      <div className="card__image-area"></div>
    </div>
  );
}
