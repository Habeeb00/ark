import React, { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { BLOGS } from '../data/constants';

export function BlogPage({ onNavigate }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-blog page-spring-entry">
      <div className="page-container">
        <Navbar activePage="blog" onNavigate={onNavigate} />

        <div className="content-container">
          <h1 className="page-blog__title animate-fade-in-up">Blogs</h1>

          <div className="blog-list">
            {BLOGS.map((blog, index) => (
              <a 
                key={blog.id} 
                href={`/blog/${blog.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/blog/${blog.slug}`);
                }}
                className={`blog-item animate-fade-in-up delay-${(index + 1) * 100}`}
              >
                <div className="blog-item__content">
                  <h2 className="blog-item__title">{blog.title}</h2>
                  <span className="blog-item__date">{blog.date}</span>
                  <span className="blog-item__author">{blog.author}</span>
                </div>
                <span className="blog-item__read">Read →</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className="footer__quote" style={{ marginTop: '80px' }}>"no pain is small"</p>
    </div>
  );
}
