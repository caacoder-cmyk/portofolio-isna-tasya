import * as THREE from 'three';
import { IDCard } from './IDCard.js';
import { Butterflies } from './Butterflies.js';

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth;
    this.height = container.clientHeight;

    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.scrollProgress = 0;
    
    this.resizeListener = this.onWindowResize.bind(this);
    this.mouseListener = this.onMouseMove.bind(this);
    this.touchListener = this.onTouchMove.bind(this);

    this.init();
  }

  init() {
    // 1. Create Scene
    this.scene = new THREE.Scene();

    // 2. Create Camera
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.z = 8;

    // 3. Create Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lights setup (Theme responsive)
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(this.ambientLight);

    this.mainLight = new THREE.DirectionalLight(0xffd1dc, 1.5); // Warm Rose by default
    this.mainLight.position.set(5, 5, 4);
    this.scene.add(this.mainLight);

    this.accentLight = new THREE.PointLight(0xff007f, 3, 15); // Pink glow by default
    this.accentLight.position.set(-4, -2, 2);
    this.scene.add(this.accentLight);

    this.subtleBacklight = new THREE.DirectionalLight(0x7a1f32, 1.0); // Rim light
    this.subtleBacklight.position.set(-5, 5, -2);
    this.scene.add(this.subtleBacklight);

    // 5. Initialize Interactive Components
    this.idCard = new IDCard(this.scene, this.camera);
    this.butterflies = new Butterflies(this.scene);

    // 6. Event Listeners
    window.addEventListener('resize', this.resizeListener);
    window.addEventListener('mousemove', this.mouseListener);
    window.addEventListener('touchmove', this.touchListener, { passive: true });

    // 7. Start Loop
    this.clock = new THREE.Clock();
    this.isAnimRunning = true;
    this.animate();
  }

  setTheme(theme) {
    if (theme === 'light') {
      this.ambientLight.intensity = 0.85;
      this.mainLight.color.setHex(0xffffff);
      this.mainLight.intensity = 1.1;
      this.accentLight.color.setHex(0x8a2be2); // Purple glow in light theme
      this.accentLight.intensity = 2.0;
      this.subtleBacklight.color.setHex(0xbbbbbb);
      this.subtleBacklight.intensity = 0.4;
    } else {
      this.ambientLight.intensity = 0.4;
      this.mainLight.color.setHex(0xffd1dc);
      this.mainLight.intensity = 1.5;
      this.accentLight.color.setHex(0xff007f); // Pink glow in dark theme
      this.accentLight.intensity = 3.0;
      this.subtleBacklight.color.setHex(0x7a1f32);
      this.subtleBacklight.intensity = 1.0;
    }

    if (this.idCard) {
      this.idCard.setTheme(theme);
    }
  }

  onMouseMove(event) {
    this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  onTouchMove(event) {
    if (event.touches.length > 0) {
      this.targetMouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }

  onWindowResize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }

  updateScroll(progress) {
    this.scrollProgress = progress;
  }

  animate() {
    if (!this.isAnimRunning) return;
    requestAnimationFrame(this.animate.bind(this));

    const elapsedTime = this.clock.getElapsedTime();

    // Smooth Mouse Interpolation (Lerp)
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.08;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.08;

    // Update Components
    if (this.idCard) {
      this.idCard.update(elapsedTime, this.mouse, this.scrollProgress);
    }
    
    if (this.butterflies) {
      this.butterflies.update(elapsedTime, this.mouse, this.scrollProgress);
    }

    // Camera slight parallax movement
    this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.mouse.y * 0.5 - this.camera.position.y) * 0.05;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.isAnimRunning = false;
    window.removeEventListener('resize', this.resizeListener);
    window.removeEventListener('mousemove', this.mouseListener);
    window.removeEventListener('touchmove', this.touchListener);
    
    if (this.idCard && typeof this.idCard.destroy === 'function') {
      this.idCard.destroy();
    }
    
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
