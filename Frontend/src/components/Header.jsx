import React from 'react';

export function Header({ theme, toggleTheme }) {
  return (
    <header>
      <a href="#home" class="logo" id="nav-logo">Isna Tasya Sabikah</a>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <nav>
          <a href="#about" id="nav-link-about">Profile</a>
          <a href="#experience" id="nav-link-exp">Chronology</a>
          <a href="#projects" id="nav-link-projects">Showcase</a>
          <a href="#skills" id="nav-link-skills">Skillset</a>
          <a href="#contact" id="nav-link-contact">Contact</a>
        </nav>
        
        {/* Toggle Theme Button */}
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn"
          aria-label="Toggle light/dark theme"
          id="theme-toggle"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
