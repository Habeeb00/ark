import React from 'react';
import { SectionBanner } from '../components/SectionBanner';
import { SmallTile, LargeTile } from '../components/Cards';
import { PROJECTS } from '../data/constants';

export function BuildSection() {
  return (
    <section className="section-build" id="build">
      <SectionBanner label="[02] WHAT WE BUILD" />
      <div className="section-build__grid">
        {PROJECTS.map(project => 
          project.large ? <LargeTile key={project.id} project={project} /> : <SmallTile key={project.id} project={project} />
        )}
      </div>
    </section>
  );
}
