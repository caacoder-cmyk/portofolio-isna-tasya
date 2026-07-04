import React from 'react';
import { cvData } from '../data/cvData';

export function Projects() {
  const { projects } = cvData;
  
  return (
    <section id="projects" className="interactive-section">
      <div className="section-header">
        <span className="section-num">03</span>
        <h2 className="section-title">Showcase</h2>
      </div>
      
      <div className="projects-grid">
        {projects.map((proj, idx) => (
          <div className="project-card scroll-reveal" id={`project-${idx}`} key={idx}>
            <div className="project-card-glow"></div>
            
            {/* Project Image Frame (High quality layout) */}
            {proj.image && (
              <div className="project-image-container">
                <img src={proj.image} alt={proj.title} className="project-image" />
                <div className="project-image-overlay"></div>
              </div>
            )}

            <div className="project-details">
              <div className="project-card-header">
                <h3 className="project-title">{proj.title}</h3>
              </div>
              <p className="project-desc">{proj.description}</p>
              
              <div className="tech-tags">
                {proj.technologies.map((tech, tIdx) => (
                  <span className="tech-tag" key={tIdx}>{tech}</span>
                ))}
              </div>
            </div>
            
            <div className="project-actions">
              {proj.demoUrl && (
                <a 
                  href={proj.demoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="project-link primary"
                >
                  Live Demo ↗
                </a>
              )}
              {proj.githubUrl && (
                <a 
                  href={proj.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="project-link secondary"
                >
                  GitHub 🐙
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
