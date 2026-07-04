import React from 'react';
import { cvData } from '../data/cvData';

export function About() {
  const { personal, education } = cvData;
  
  return (
    <section id="about" className="about interactive-section">
      <div className="section-header">
        <span className="section-num">01</span>
        <h2 className="section-title">Profile</h2>
      </div>
      
      <div className="about-grid scroll-reveal" id="about-card">
        <div className="profile-statement">
          <h3 className="editorial-h3">Professional Statement</h3>
          {personal.about.split('\n\n').map((para, idx) => (
            <p key={idx} className={idx === 0 ? "lead-text" : ""}>
              {para}
            </p>
          ))}
          
          <div className="specs-grid">
            <div className="spec-item">
              <span className="spec-label">Focus</span>
              <span className="spec-value">Software Engineering</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Origin</span>
              <span className="spec-value">Tangerang, Indonesia</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Birth Date</span>
              <span className="spec-value">28 November 2005</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Identity</span>
              <span className="spec-value">Informatics Student</span>
            </div>
          </div>
        </div>
        
        {/* Education Asymmetric Cards */}
        <div className="edu-column">
          <h3 className="editorial-h3">Academic Background</h3>
          <div className="edu-timeline-bespoke">
            {education.slice().reverse().map((edu, idx) => (
              <div className="edu-node" key={idx}>
                <div className="edu-year">{edu.period}</div>
                <div className="edu-details">
                  <h4>{edu.institution}</h4>
                  <p>{edu.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
