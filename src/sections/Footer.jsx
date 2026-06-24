import React from 'react';
import { SectionBanner } from '../components/SectionBanner';

export function Footer() {
  return (
    <footer className="footer" id="footer">
      <SectionBanner label="[04] WANT TO CONTRIBUTE?" />
      <div className="footer__inner">
        <div className="footer__branding">ark</div>
        <div className="footer__content-col">
          <div className="footer__cta">
            <h2 className="footer__cta-heading">
              Lets solve<br />
              <span className="italic">Pains</span> <span className="bold">!</span>
            </h2>
            <a href="#painboard" className="footer__cta-btn">
              solve a pain
              <img src="assets/arrow.svg" alt="" />
            </a>
          </div>
        </div>
      </div>
      <p className="footer__quote">"no pain is small"</p>
    </footer>
  );
}

