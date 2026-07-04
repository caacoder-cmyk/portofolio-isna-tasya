import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Footer } from './components/Footer';
import { CanvasContainer } from './components/CanvasContainer';
import { ScrollHandler } from './components/ScrollHandler';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [sceneManager, setSceneManager] = useState(null);

  // Toggle theme state
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync theme with body element class
  useEffect(() => {
    const body = document.body;
    if (theme === 'light') {
      body.classList.add('light-theme');
    } else {
      body.classList.remove('light-theme');
    }
  }, [theme]);

  // Hook ScrollHandler once SceneManager is initialized
  useEffect(() => {
    if (sceneManager) {
      const scrollHandler = new ScrollHandler(sceneManager);

      // Handle smooth link navigations manually for reliability
      const links = document.querySelectorAll('header nav a, .hero-btn, .footer-logo, .logo');
      const clickHandlers = [];

      links.forEach((link) => {
        const handler = (e) => {
          const targetId = link.getAttribute('href');
          if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
              targetElement.scrollIntoView({
                behavior: 'smooth'
              });
            }
          }
        };
        link.addEventListener('click', handler);
        clickHandlers.push({ link, handler });
      });

      return () => {
        scrollHandler.destroy();
        clickHandlers.forEach(({ link, handler }) => {
          link.removeEventListener('click', handler);
        });
      };
    }
  }, [sceneManager]);

  return (
    <>
      {/* 3D WebGL Canvas Layer */}
      <CanvasContainer theme={theme} onSceneInit={setSceneManager} />

      {/* Decorative Moving Background Glow Blobs */}
      <div className="decorations">
        {/* Glow blobs that drift and scale dynamically */}
        <div className="glow-blob teal"></div>
        <div className="glow-blob purple"></div>
        
        <span className="butterfly-decor" style={{ top: '25%', right: '12%' }}>🦋</span>
        <span className="butterfly-decor" style={{ bottom: '20%', left: '12%', animationDelay: '3s' }}>🦋</span>
      </div>

      {/* Navigation Header */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* Layout Content (Z-indexed above WebGL layers) */}
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Footer />
      </main>
    </>
  );
}
