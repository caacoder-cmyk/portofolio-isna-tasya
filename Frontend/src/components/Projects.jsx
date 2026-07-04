import React, { useState } from 'react';
import { cvData } from '../data/cvData';

export function Projects() {
  const { projects } = cvData;
  const [activeProject, setActiveProject] = useState(null);

  const handleCardClick = (e, proj) => {
    // Prevent modal opening when clicking a direct link button
    if (e.target.closest('.project-link')) return;
    setActiveProject(proj);
  };

  return (
    <section id="projects" className="interactive-section">
      <div className="section-header">
        <span className="section-num">03</span>
        <h2 className="section-title">Showcase</h2>
      </div>
      
      <div className="projects-grid">
        {projects.map((proj, idx) => (
          <div 
            className="project-card scroll-reveal" 
            id={`project-${idx}`} 
            key={idx}
            onClick={(e) => handleCardClick(e, proj)}
            style={{ cursor: 'pointer' }}
          >
            <div className="project-card-glow"></div>
            
            {/* Project Image Frame */}
            {proj.image && (
              <div className="project-image-container">
                <img src={proj.image} alt={proj.title} className="project-image" />
                <div className="project-image-overlay"></div>
                <div className="project-card-click-hint">Lihat Detail 🔍</div>
              </div>
            )}

            <div className="project-details">
              <div className="project-card-header">
                <h3 className="project-title">{proj.title}</h3>
              </div>
              <p className="project-desc">{proj.description}</p>
              
              <div className="tech-tags">
                {proj.technologies.slice(0, 3).map((tech, tIdx) => (
                  <span className="tech-tag" key={tIdx}>{tech}</span>
                ))}
                {proj.technologies.length > 3 && (
                  <span className="tech-tag spec">+{proj.technologies.length - 3}</span>
                )}
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

      {/* Project Detail Modal Overlay */}
      {activeProject && (
        <div className="project-modal-overlay" onClick={() => setActiveProject(null)}>
          <div className="project-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="project-modal-close" aria-label="Close detail modal" onClick={() => setActiveProject(null)}>&times;</button>
            
            <div className="project-modal-image-container">
              <img src={activeProject.image} alt={activeProject.title} className="project-modal-image" />
              <div className="project-modal-image-overlay"></div>
            </div>
            
            <div className="project-modal-body">
              <h3 className="project-modal-title">{activeProject.title}</h3>
              
              <div className="tech-tags modal-tags">
                {activeProject.technologies.map((tech, tIdx) => (
                  <span className="tech-tag" key={tIdx}>{tech}</span>
                ))}
              </div>
              
              <div className="project-modal-content-section">
                <h4 className="project-modal-section-title">Tentang Proyek</h4>
                <p className="project-modal-long-desc">{activeProject.longDescription || activeProject.description}</p>
              </div>
              
              {activeProject.features && (
                <div className="project-modal-content-section">
                  <h4 className="project-modal-section-title">Fitur Utama</h4>
                  <ul className="project-modal-features-list">
                    {activeProject.features.map((feat, fIdx) => (
                      <li key={fIdx}>{feat}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="project-modal-actions">
                {activeProject.demoUrl && (
                  <a 
                    href={activeProject.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-link primary"
                  >
                    Kunjungi Demo Live ↗
                  </a>
                )}
                {activeProject.githubUrl && (
                  <a 
                    href={activeProject.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-link secondary"
                  >
                    GitHub Repository 🐙
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
