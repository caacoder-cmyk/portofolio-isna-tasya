import React from 'react';
import { cvData } from '../data/cvData';

export function Footer() {
  const { contact } = cvData;
  
  return (
    <footer id="contact">
      <div className="footer-content">
        <a href="#home" className="footer-logo" id="footer-logo-link">Isna Tasya Sabikah</a>
        <p className="footer-tagline">
          Mari terhubung dan berkolaborasi. Hubungi saya melalui salah satu kontak di bawah ini.
        </p>
        
        <div className="social-links">
          <a href={`mailto:${contact.email}`} className="social-btn" id="social-mail" title="Email">✉</a>
          <a 
            href={`https://wa.me/62${contact.phone.replace(/^0/, '')}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-btn" 
            id="social-wa" 
            title="WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008 0c3.202.001 6.212 1.249 8.477 3.517 2.266 2.268 3.512 5.279 3.512 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.78 9.78 0 0 0-6.963-2.885C6.004 1.955 1.58 6.325 1.576 11.753c-.001 1.71.461 3.382 1.337 4.847L1.87 21.09l4.777-1.936zM17.56 15.3c-.302-.15-1.785-.88-2.062-.98-.278-.1-.48-.15-.68.15-.2.3-.775.979-.95 1.18-.175.2-.35.224-.652.074-2.512-1.258-4.14-2.616-5.808-5.483-.243-.418-.088-.644.062-.794.135-.135.302-.35.452-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.68-1.64-.932-2.245-.246-.59-.517-.51-.68-.518-.174-.007-.373-.008-.573-.008-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.224 5.112 4.521.714.308 1.272.493 1.706.63.718.228 1.37.196 1.885.12.573-.086 1.785-.73 2.038-1.437.252-.708.252-1.313.176-1.438-.076-.125-.278-.201-.58-.351z"/></svg>
          </a>
          <a 
            href={contact.instagram} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-btn" 
            id="social-instagram" 
            title="Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
          </a>
          <a href={contact.github} target="_blank" rel="noopener noreferrer" className="social-btn" id="social-github" title="GitHub">🐙</a>
        </div>
        
        <p className="copyright">
          &copy; {new Date().getFullYear()} Isna Tasya Sabikah. Designed with care & premium aesthetics.
        </p>
      </div>
    </footer>
  );
}
