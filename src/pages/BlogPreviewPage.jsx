import React, { useEffect } from 'react';
import { Navbar } from '../components/Navbar';

export function BlogPreviewPage({ onNavigate }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-blog-preview page-spring-entry">
      <div className="page-container">
        <Navbar activePage="blog" onNavigate={onNavigate} />

        <div className="content-container">
          <a 
            href="/blog" 
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/blog');
            }}
            className="blog-preview__back animate-fade-in-up"
          >
            Back to blogs →
          </a>

          <img 
            src="assets/blog-cover.png" 
            alt="Blog cover — scenic illustration" 
            className="blog-preview__cover animate-fade-in-up delay-100" 
          />

          <h1 className="blog-preview__title animate-fade-in-up delay-200">Building for public welfare</h1>
          <p className="blog-preview__date animate-fade-in-up delay-200">January 2026</p>
          <p className="blog-preview__author animate-fade-in-up delay-200">Habeeb</p>

          <div className="blog-preview__body animate-fade-in-up delay-300">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu rhoncus enim, in scelerisque lectus. Nullam elementum, odio id pharetra aliquet, nulla arcu bibendum sem, quis vehicula ipsum dui sit amet quam. Morbi bibendum arcu interdum risus pretium sagittis. Donec vehicula efficitur pretium. Ut blandit erat at auctor interdum. Maecenas non mollis mauris. Mauris sodales vestibulum nisi ac fermentum. Praesent nec sapien non dolor efficitur fringilla. Nullam non sollicitudin nibh. Pellentesque commodo consequat fringilla. Etiam iaculis lacus felis, a condimentum quam malesuada bibendum. Phasellus malesuada, diam in venenatis finibus, tellus dolor gravida augue, vitae gravida odio quam nec enim. Maecenas gravida risus sapien, ac volutpat tortor imperdiet et. Quisque at est sit amet lacus sodales pharetra a vitae metus. Nulla euismod lorem arcu, non viverra libero maximus quis.</p>

            <p>Suspendisse luctus egestas scelerisque. Vestibulum non magna ac sem rhoncus congue non non eros. Suspendisse blandit enim leo, eleifend vestibulum nulla mattis vitae. Quisque commodo leo ut ipsum tincidunt, sit amet malesuada erat interdum. Sed porta risus at bibendum mollis. Duis sed finibus quam. Cras maximus erat eros. Vestibulum ut velit hendrerit, gravida neque et, aliquet ante. Aenean at mi eu risus lobortis eleifend.</p>

            <p>Etiam condimentum eleifend sapien, vel ornare eros vestibulum ut. Nullam facilisis eros nec ligula aliquam blandit. Praesent eget feugiat nisi. Sed consectetur rutrum interdum. Suspendisse potenti. Morbi pulvinar felis justo, ut imperdiet diam scelerisque at. Vivamus scelerisque velit sit amet leo sagittis scelerisque. Donec suscipit, velit vitae finibus accumsan, neque est facilisis erat, eu vehicula leo quam et eros. Sed tristique justo ac volutpat consectetur. Maecenas faucibus erat convallis, iaculis massa quis, feugiat tellus. Suspendisse potenti. Integer vehicula ante in blandit hendrerit. Donec eleifend sapien pharetra gravida eleifend.</p>

            <p>Sed ultrices luctus elit, vitae aliquet diam vulputate quis. Curabitur non vulputate nulla, eu porta ex. Cras varius consectetur velit, in suscipit libero aliquet id. Vivamus sollicitudin non enim cursus gravida. Nam et quam vel velit varius auctor quis eu risus. Phasellus convallis venenatis erat, eu feugiat ligula. Sed vehicula faucibus tempus. Pellentesque semper lacus eu congue vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean sit amet lacus vulputate, dapibus turpis sit amet, dignissim ligula. Aliquam tincidunt quam ac neque ultrices dignissim. Phasellus lobortis dolor at posuere facilisis. Ut facilisis tellus neque. Integer neque neque, mattis vitae dapibus sit amet, posuere quis justo. Ut eu ultrices justo. Morbi dapibus malesuada lectus.</p>
          </div>
        </div>
      </div>

      <p className="footer__quote" style={{ marginTop: '80px' }}>"no pain is small"</p>
    </div>
  );
}
