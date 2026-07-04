import React from 'react';

export function Skills() {
  return (
    <section id="skills" className="interactive-section">
      <div className="section-header">
        <span className="section-num">04</span>
        <h2 className="section-title">Skillset</h2>
      </div>
      
      <div className="skills-grid">
        {/* Asymmetric columns */}
        <div className="skills-column scroll-reveal" id="skills-core">
          <h3 className="editorial-h3">Capabilities</h3>
          <div className="skills-editorial-list">
            <div className="skill-category">
              <h4>Administration</h4>
              <ul>
                <li>Administrasi Perkantoran</li>
                <li>Entry Data</li>
                <li>Manajemen Dokumen</li>
                <li>Penulisan Surat & Notulen</li>
                <li>Microsoft Word & Excel</li>
              </ul>
            </div>
            
            <div className="skill-category">
              <h4>Technical & Design</h4>
              <ul>
                <li>UI Design (Figma)</li>
                <li>HTML5 & CSS3</li>
                <li>JavaScript (ES6)</li>
              </ul>
            </div>

            <div className="skill-category">
              <h4>Interpersonal</h4>
              <ul>
                <li>Kerja Sama Tim & Koordinasi</li>
                <li>Manajemen Waktu</li>
                <li>Komunikasi Profesional</li>
                <li>Fokus & Ketelitian Tinggi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Certifications (Right column) */}
        <div className="certs-column scroll-reveal" id="certs-core">
          <h3 className="editorial-h3">Credentials</h3>
          <div className="certs-editorial-list">
            <div className="cert-item-bespoke">
              <span className="cert-no">01</span>
              <div className="cert-text">
                <h4>Leadership Organization Training</h4>
                <p>Lembaga Pelatihan Kepemimpinan</p>
              </div>
            </div>
            
            <div className="cert-item-bespoke">
              <span className="cert-no">02</span>
              <div className="cert-text">
                <h4>Seminar dan Workshop Teknik Informatika</h4>
                <p>Partisipasi Aktif & Pengembangan Skill</p>
              </div>
            </div>

            <div className="cert-item-bespoke">
              <span className="cert-no">03</span>
              <div className="cert-text">
                <h4>Surabaya State University Webinar</h4>
                <p>Participant - Faculty of Engineering</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
