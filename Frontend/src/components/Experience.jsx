import React from 'react';
import { cvData } from '../data/cvData';

export function Experience() {
  const { experience } = cvData;
  
  // Custom mapping to match the editorial textual details exactly
  const customCompanyNames = [
    "Haza Sarana Kreasi",
    "Super Daging",
    "Organisasi Kegiatan",
    "Himpunan Mahasiswa Teknik Informatika"
  ];
  
  const customRoles = [
    "Admin Operasional & Cashier",
    "Admin Operasional, Cashier & Staff Packing",
    "Staf Administrasi (Kepanitiaan Event)",
    "Sekretaris"
  ];

  return (
    <section id="experience" className="interactive-section">
      <div className="section-header">
        <span className="section-num">02</span>
        <h2 className="section-title">Chronology</h2>
      </div>
      
      <div className="chronology-list">
        {experience.map((exp, idx) => (
          <div 
            className="chrono-row scroll-reveal" 
            id={`chrono-${idx === 0 ? 'haza' : idx === 1 ? 'superdaging' : idx === 2 ? 'event' : 'himpunan'}`}
            key={idx}
          >
            <div className="chrono-meta">
              <div className="chrono-company">{customCompanyNames[idx] || exp.company}</div>
              <div className="chrono-role">{customRoles[idx] || exp.role}</div>
            </div>
            <div className="chrono-desc">
              {exp.tasks.slice(0, 4).map((task, tidx) => (
                <p key={tidx}>{task}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
