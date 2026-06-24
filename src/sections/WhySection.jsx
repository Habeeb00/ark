import React, { useEffect, useRef, useState } from 'react';
import { SectionBanner } from '../components/SectionBanner';

function ScrollHighlightLine({ children, className }) {
  const ref = useRef(null);
  const [color, setColor] = useState('rgb(107, 107, 109)'); // Default grey var(--dark3)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate center of this specific line relative to viewport
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;

      if (elementCenter <= viewportCenter) {
        // Line has already been scrolled past (is above the center of the screen) - stay white
        setColor('rgb(255, 255, 255)');
      } else {
        // Line is below the center of the screen - transition from grey to white as it scrolls up
        const distance = elementCenter - viewportCenter;
        
        // Transition starts when the line is within 25% of the viewport height below the center
        const maxDistance = viewportHeight * 0.25;
        const progress = Math.max(0, Math.min(1, 1 - (distance / maxDistance)));

        // Interpolate between grey rgb(107,107,109) and white rgb(255,255,255)
        const r = Math.round(107 + (255 - 107) * progress);
        const g = Math.round(107 + (255 - 107) * progress);
        const b = Math.round(109 + (255 - 109) * progress);

        setColor(`rgb(${r}, ${g}, ${b})`);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      ref={ref} 
      style={{ 
        color, 
        transition: 'color 0.1s ease-out',
        lineHeight: '1.4',
        marginBottom: '6px'
      }} 
      className={className}
    >
      {children}
    </div>
  );
}

export function WhySection() {
  return (
    <section className="section-why" id="why">
      <SectionBanner label="[01] WHY?" />
      <div className="section-why__content-wrapper">
        <div className="section-why__text">
          <div className="section-why__line-group">
            <ScrollHighlightLine>
              Software's are intended to sympathize with the user,
            </ScrollHighlightLine>
            <ScrollHighlightLine>
              but the times have changed, everyone forget to see the user.
            </ScrollHighlightLine>
          </div>
          <br />
          <div className="section-why__line-group">
            <ScrollHighlightLine>
              That's where ark lives, we are a collective of
            </ScrollHighlightLine>
            <ScrollHighlightLine>
              people who thoughtfully build tools for <span className="italic">pains of the internet.</span>
            </ScrollHighlightLine>
          </div>
        </div>
        <div className="builders">
          <div className="builders__avatars">
            <img className="builders__avatar" src="assets/aravind.png" alt="Aravind" />
            <img className="builders__avatar" src="assets/habeeb.png" alt="Habeeb" />
          </div>
          <div className="builders__tooltip">Habeeb</div>
        </div>
      </div>
    </section>
  );
}
