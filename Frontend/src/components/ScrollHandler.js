import { gsap } from 'gsap';

export class ScrollHandler {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;
    
    this.scrollListener = this.onScroll.bind(this);
    this.tickListener = this.tick.bind(this);
    this.isDestroyed = false;
    this.tickFrame = null;
    
    this.init();
  }

  init() {
    // 1. Listen to scroll events
    window.addEventListener('scroll', this.scrollListener, { passive: true });
    
    // 2. Perform GSAP text reveal animations on page load
    this.revealHero();
    
    // 3. Initialize scroll observer for section entries
    this.initScrollReveal();
    
    // 4. Smooth scrolling ticker loop
    this.tickFrame = requestAnimationFrame(this.tickListener);
  }

  onScroll() {
    if (this.isDestroyed) return;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
      this.targetScrollProgress = window.scrollY / scrollHeight;
    }
  }

  revealHero() {
    // Elegant fade-in and slide-up animations for hero content
    gsap.from('.hero-text h1', {
      duration: 1.2,
      y: 40,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.2
    });
    
    gsap.from('.hero-text p', {
      duration: 1.2,
      y: 20,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.4
    });
    
    gsap.from('.hero-btn-container', {
      duration: 1.2,
      y: 20,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.6
    });

    gsap.from('#canvas-container', {
      duration: 1.5,
      scale: 0.9,
      opacity: 0,
      ease: 'power2.out',
      delay: 0.1
    });
  }

  initScrollReveal() {
    // Reveal card containers and items on scroll
    const items = document.querySelectorAll('.scroll-reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Reveal using GSAP
          gsap.to(entry.target, {
            duration: 0.8,
            y: 0,
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
            overwrite: 'auto'
          });
          observer.unobserve(entry.target); // only reveal once
        }
      });
    }, {
      threshold: 0.15
    });

    items.forEach((item) => {
      // Set initial state
      gsap.set(item, { y: 50, opacity: 0, scale: 0.98 });
      observer.observe(item);
    });
  }

  tick() {
    if (this.isDestroyed) return;
    this.tickFrame = requestAnimationFrame(this.tickListener);

    // Smooth lerp scroll progress for Three.js scene transition
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.08;
    this.sceneManager.updateScroll(this.scrollProgress);
    
    // Parallax scrolling on content sections
    const scrolled = window.scrollY;
    const bgDecorations = document.querySelector('.decorations');
    if (bgDecorations) {
      bgDecorations.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
  }

  destroy() {
    this.isDestroyed = true;
    window.removeEventListener('scroll', this.scrollListener);
    if (this.tickFrame) {
      cancelAnimationFrame(this.tickFrame);
    }
  }
}
