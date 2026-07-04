import React from 'react';
import { Typewriter } from './Typewriter';

export function Hero() {
  return (
    <section id="home" class="hero">
      {/* Tilted Scrolling Marquee Banner (CodeCuy style) */}
      <div className="horizontal-marquee-container tilted-marquee">
        <div className="marquee-track">
          <span>HELLO I'M TASYA ✦ WELCOME TO EXPLORE MY PORTFOLIO ✦ HELLO I'M TASYA ✦ WELCOME TO EXPLORE MY PORTFOLIO ✦</span>
          <span>HELLO I'M TASYA ✦ WELCOME TO EXPLORE MY PORTFOLIO ✦ HELLO I'M TASYA ✦ WELCOME TO EXPLORE MY PORTFOLIO ✦</span>
        </div>
      </div>
      
      <div className="hero-text">
        <div className="status-badges">
          <span className="status-badge">React & Web Dev</span>
          <span class="status-badge">UI/UX Design</span>
          <span class="status-badge">Based in Indonesia</span>
          <span class="status-badge">Let's Talk</span>
        </div>
        <h1>Isna Tasya<br /><span>Sabikah</span></h1>
        
        <div className="hero-subtitle">
          I am a <Typewriter words={[
            "Software Engineering Student",
            "Frontend Web Developer",
            "UI/UX Design Enthusiast",
            "Detail-oriented Organizer"
          ]} />
        </div>
        
        <p>
          An informatics software engineering student exploring the intersection of web development, administration, and digital layouts.
        </p>
        <div className="hero-btn-container">
          <a href="/CV_Isna_Tasya_Sabikah.txt" download className="hero-btn primary" id="btn-download-cv">
            Download CV 📥
          </a>
          <a href="#contact" className="hero-btn secondary" id="btn-contact-hero">Let's Talk</a>
        </div>
      </div>
      
      {/* Space placeholder for floating 3D Lanyard Card */}
      <div className="hero-canvas-space"></div>
      
      <div className="scroll-hint">
        <span className="hint-text">SCROLL TO DISCOVER</span>
        <span className="hint-line"></span>
      </div>
    </section>
  );
}
