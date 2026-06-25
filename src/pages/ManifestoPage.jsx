import React, { useEffect } from 'react';
import { Navbar } from '../components/Navbar';

export function ManifestoPage({ onNavigate, onSearchOpen }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-manifesto page-spring-entry">
      <div className="page-container">
        <Navbar activePage="manifesto" onNavigate={onNavigate} onSearchOpen={onSearchOpen} />

        <div className="content-container">
          <h1 className="manifesto__title animate-fade-in-up">Manifesto</h1>

          <div className="manifesto__body animate-fade-in-up delay-200">
            <p>ark is a collective of people who want to solve the pains of the internet. software was meant to understand people, to empathise and make things easier, but over time it became more about business, scale and services than actual user pain.</p>

            <p>ark exists to shift that back. a pain point should not be ignored just because it won't generate revenue or because only a few people face it. even the smallest pain matters.</p>

            <p>if you felt something was annoying, confusing or unnecessary, it's worth fixing. build for it, share it, so someone else doesn't have to feel it again.<br />

              we're just people building for pains, not for scale.<br />
            </p>
          </div>

          <div className="manifesto__builders animate-fade-in-up delay-400">
            <div className="builders__avatars">
              {[
                { src: 'https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2,f_auto,g_center,q_auto:good/v1/gcs/platform-data-goog/avatars/aravind_p_K3OzNMC.jpg', name: 'Aravind' },
                { src: 'https://media.licdn.com/dms/image/v2/D5603AQG4hoYU-ehL-Q/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718268749172?e=2147483647&v=beta&t=gE2RhsvETU0RvRMLNJDCNgFx0bPc8KBCrOwSy3ZML_Q', name: 'Habeeb' },
              ].map((b) => (
                <div key={b.name} className="builders__avatar-wrap">
                  <span className="builders__name">{b.name}</span>
                  <img className="builders__avatar" src={b.src} alt={b.name} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="footer__quote" style={{ marginTop: '80px' }}>"no pain is small"</p>
    </div>
  );
}
