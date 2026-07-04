import * as THREE from 'three';

export class IDCard {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    
    this.group = new THREE.Group();
    this.scene.add(this.group);
    
    this.rotationX = 0;
    this.rotationY = 0;
    this.targetRotationX = 0;
    this.targetRotationY = 0;
    
    this.isDragging = false;
    this.previousPointerPosition = { x: 0, y: 0 };
    
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    
    this.theme = 'dark'; // default theme
    
    // Card Dimensions (Portrait: 2.8 x 4.4)
    this.cardWidth = 2.8;
    this.cardHeight = 4.4;
    this.cardDepth = 0.06;
    
    // Cache bounds for drag listener cleanup
    this.pointerDownListener = this.onPointerDown.bind(this);
    this.pointerMoveListener = this.onPointerMove.bind(this);
    this.pointerUpListener = this.onPointerUp.bind(this);
    this.resizeListener = this.onResize.bind(this);
    
    // Responsive placement vars
    this.defaultX = 0;
    this.updateResponsivePosition();
    
    this.init();
  }
  
  updateResponsivePosition() {
    const width = window.innerWidth;
    if (width > 1024) {
      this.defaultX = 2.4; // Desktop side position (shifted right closer to corner)
    } else {
      this.defaultX = 0; // Centered mobile
    }
    
    if (!this.isDragging) {
      this.group.position.x = this.defaultX;
    }
  }
  
  init() {
    // Canvas dimensions (Portrait 1024 x 1600 - High resolution for sharp image)
    this.frontCanvas = document.createElement('canvas');
    this.frontCanvas.width = 1024;
    this.frontCanvas.height = 1600;
    this.frontCtx = this.frontCanvas.getContext('2d');
    this.frontCtx.imageSmoothingEnabled = true;
    this.frontCtx.imageSmoothingQuality = 'high';
    
    this.backCanvas = document.createElement('canvas');
    this.backCanvas.width = 1024;
    this.backCanvas.height = 1600;
    this.backCtx = this.backCanvas.getContext('2d');
    this.backCtx.imageSmoothingEnabled = true;
    this.backCtx.imageSmoothingQuality = 'high';
    
    this.frontTexture = new THREE.CanvasTexture(this.frontCanvas);
    this.backTexture = new THREE.CanvasTexture(this.backCanvas);
    
    // Set high-quality properties
    this.frontTexture.colorSpace = THREE.SRGBColorSpace;
    this.backTexture.colorSpace = THREE.SRGBColorSpace;
    this.frontTexture.anisotropy = 8;
    this.backTexture.anisotropy = 8;
    
    // Render static parts
    this.renderFrontCard();
    this.renderBackCard();
    
    // Load profile photo (3D Memoji avatar)
    this.profileImg = new Image();
    this.profileImg.crossOrigin = "anonymous";
    this.profileImg.onload = () => {
      this.renderFrontCard(this.profileImg);
      this.frontTexture.needsUpdate = true;
    };
    this.profileImg.onerror = () => {
      console.warn("Could not load profile photo, rendering placeholder.");
      this.renderFrontCard(null);
      this.frontTexture.needsUpdate = true;
    };
    this.profileImg.src = "/img/poto.jpeg";
    
    // 3D Card Meshes
    // Front Face (Glassmorphic)
    const frontGeometry = new THREE.PlaneGeometry(this.cardWidth, this.cardHeight);
    this.frontMaterial = new THREE.MeshPhysicalMaterial({
      map: this.frontTexture,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transmission: 0.4, 
      thickness: 0.5,
      transparent: true,
      opacity: 0.98,
      side: THREE.FrontSide
    });
    this.frontMesh = new THREE.Mesh(frontGeometry, this.frontMaterial);
    this.frontMesh.position.z = this.cardDepth / 2 + 0.003;
    this.group.add(this.frontMesh);
    
    // Back Face
    const backGeometry = new THREE.PlaneGeometry(this.cardWidth, this.cardHeight);
    const backMaterial = new THREE.MeshPhysicalMaterial({
      map: this.backTexture,
      roughness: 0.15,
      metalness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 1.0,
      side: THREE.BackSide
    });
    this.backMesh = new THREE.Mesh(backGeometry, backMaterial);
    this.backMesh.rotation.y = Math.PI;
    this.backMesh.position.z = -(this.cardDepth / 2 + 0.003);
    this.group.add(this.backMesh);
    
    // Sleek Card Body Frame (Glowing metal frame border - colors anim dynamically!)
    const frameGeometry = new THREE.BoxGeometry(this.cardWidth + 0.03, this.cardHeight + 0.03, this.cardDepth);
    this.frameMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff, // initial cyan neon
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.45, // neon glowing emissive border!
      transparent: true,
      opacity: 1.0
    });
    this.frameMesh = new THREE.Mesh(frameGeometry, this.frameMaterial);
    this.group.add(this.frameMesh);
    
    // Apply default position
    this.group.position.set(this.defaultX, -0.4, 0);
    
    // Drag Listeners
    window.addEventListener('pointerdown', this.pointerDownListener);
    window.addEventListener('pointermove', this.pointerMoveListener);
    window.addEventListener('pointerup', this.pointerUpListener);
    window.addEventListener('resize', this.resizeListener);
  }
  
  onResize() {
    this.updateResponsivePosition();
  }
  
  setTheme(theme) {
    if (this.theme === theme) return;
    this.theme = theme;
    this.renderFrontCard(this.profileImg);
    this.renderBackCard();
    this.frontTexture.needsUpdate = true;
    this.backTexture.needsUpdate = true;
    
    if (this.frontMaterial) {
      if (theme === 'light') {
        this.frontMaterial.transmission = 0.55;
        this.frontMaterial.opacity = 0.95;
      } else {
        this.frontMaterial.transmission = 0.4;
        this.frontMaterial.opacity = 0.98;
      }
    }
  }
  
  renderFrontCard(img = null) {
    const ctx = this.frontCtx;
    const w = this.frontCanvas.width;
    const h = this.frontCanvas.height;
    
    // Background glass card
    ctx.clearRect(0, 0, w, h);
    
    // Background gradient inside glass border
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    if (this.theme === 'light') {
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(1, '#e2e8f0');
    } else {
      bgGrad.addColorStop(0, '#1c040b');
      bgGrad.addColorStop(1, '#050102');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);
    
    // Grid overlay (Subtle background details)
    ctx.strokeStyle = this.theme === 'light' ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 107, 139, 0.05)';
    ctx.lineWidth = 2;
    for (let i = 0; i < w; i += 80) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.stroke();
    }
    for (let j = 0; j < h; j += 80) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(w, j);
      ctx.stroke();
    }
    
    // Draw photo as background filling the card (Full-bleed Polaroid/Faris EDP style)
    if (img) {
      ctx.save();
      // Draw rounded rectangle clip for photo (offset by 30px for glass borders)
      ctx.beginPath();
      ctx.roundRect(30, 30, w - 60, h - 60, 48);
      ctx.clip();
      
      const aspect = img.width / img.height;
      if (aspect >= w / h) {
        const drawH = h - 60;
        const drawW = drawH * aspect;
        ctx.drawImage(img, w/2 - drawW/2, 30, drawW, drawH);
      } else {
        const drawW = w - 60;
        const drawH = drawW / aspect;
        ctx.drawImage(img, 30, h/2 - drawH/2, drawW, drawH);
      }
      ctx.restore();
    } else {
      ctx.fillStyle = this.theme === 'light' ? '#cbd5e1' : '#2b1016';
      ctx.fillRect(30, 30, w - 60, h - 60);
    }
    
    // Outer border frame (Glowing neon outline)
    ctx.strokeStyle = this.theme === 'light' ? 'rgba(138, 43, 226, 0.5)' : 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.roundRect(30, 30, w - 60, h - 60, 48);
    ctx.stroke();
    
    // Subtle Name Label overlay at bottom of photo card (Faris EDP style)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 20;
    ctx.font = 'bold 48px "Poppins", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ISNA TASYA SABIKAH', w / 2, h - 90);
    ctx.shadowBlur = 0; // reset shadow
  }
  
  renderBackCard() {
    const ctx = this.backCtx;
    const w = this.backCanvas.width;
    const h = this.backCanvas.height;
    
    ctx.fillStyle = this.theme === 'light' ? '#ffffff' : '#0c080a';
    ctx.fillRect(0, 0, w, h);
    
    ctx.strokeStyle = this.theme === 'light' ? 'rgba(138, 43, 226, 0.2)' : 'rgba(0, 240, 255, 0.15)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.roundRect(30, 30, w - 60, h - 60, 48);
    ctx.stroke();
    
    // Centered branding details
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillStyle = this.theme === 'light' ? 'rgba(138, 43, 226, 0.15)' : 'rgba(0, 240, 255, 0.1)';
    ctx.font = '280px "Poppins", sans-serif';
    ctx.fillText('🦋', w / 2, h / 2 - 80);
    
    ctx.fillStyle = this.theme === 'light' ? '#8a2be2' : '#00f0ff';
    ctx.font = 'bold 40px "Poppins", sans-serif';
    ctx.fillText('TASYA PORTFOLIO', w / 2, h / 2 + 160);
    
    ctx.fillStyle = this.theme === 'light' ? 'rgba(18, 18, 18, 0.6)' : 'rgba(255, 255, 255, 0.6)';
    ctx.font = '28px monospace';
    ctx.fillText('TECHNICAL INFORMATICS STUDENT', w / 2, h / 2 + 240);
    ctx.fillText('TANGERANG, INDONESIA', w / 2, h / 2 + 290);
  }
  
  onPointerDown(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects([this.frameMesh, this.frontMesh]);
    
    if (intersects.length > 0) {
      this.isDragging = true;
      this.previousPointerPosition = {
        x: event.clientX,
        y: event.clientY
      };
    }
  }
  
  onPointerMove(event) {
    if (this.isDragging) {
      const deltaMove = {
        x: event.clientX - this.previousPointerPosition.x,
        y: event.clientY - this.previousPointerPosition.y
      };
      
      this.targetRotationY += deltaMove.x * 0.015;
      this.targetRotationX += deltaMove.y * 0.015;
      
      this.previousPointerPosition = {
        x: event.clientX,
        y: event.clientY
      };
    }
  }
  
  onPointerUp() {
    this.isDragging = false;
  }
  
  update(time, mouse, scrollProgress) {
    // Calculate scroll progress relative to the first viewport height (Hero section)
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentScrollY = scrollProgress * (scrollHeight > 0 ? scrollHeight : window.innerHeight);
    const heroScroll = Math.min(1.0, Math.max(0.0, currentScrollY / window.innerHeight));

    // 1. Hanging Sway & Float simulation
    const floatOffset = Math.sin(time * 1.5) * 0.08;
    const swayAngleY = Math.sin(time * 0.8) * 0.05;
    const swayAngleX = Math.cos(time * 1.2) * 0.03;
    
    // Make the card scroll up out of the viewport based on Hero section scroll
    this.group.position.y = -1.2 + floatOffset + heroScroll * 8.0;
    
    // Scroll transition (slide left and scale down)
    const scale = Math.max(0.01, 1 - heroScroll * 1.0);
    this.group.scale.set(scale, scale, scale);
    
    const currentDefaultX = this.defaultX * (1 - heroScroll);
    this.group.position.x = currentDefaultX - (heroScroll * 2.2);
    this.group.position.z = -heroScroll * 2.5;
    
    // Fade out opacity quickly as we scroll past the Hero section
    const opacity = Math.max(0, 1 - heroScroll * 2.0);
    this.group.visible = opacity > 0;
    
    if (opacity > 0) {
      if (this.frontMaterial) {
        this.frontMaterial.opacity = opacity * (this.theme === 'light' ? 0.95 : 0.98);
        this.frontMaterial.transmission = opacity * (this.theme === 'light' ? 0.55 : 0.4);
      }
      if (this.backMaterial) {
        this.backMaterial.opacity = opacity;
      }
      if (this.frameMaterial) {
        this.frameMaterial.opacity = opacity;
      }
    }
    
    // 2. Rotations (blend drag, sway, and hover tilt)
    if (!this.isDragging) {
      const maxTiltX = 0.35;
      const maxTiltY = 0.35;
      
      this.targetRotationX = mouse.y * maxTiltX + swayAngleX;
      this.targetRotationY = mouse.x * maxTiltY + swayAngleY;
      
      this.rotationX += (this.targetRotationX - this.rotationX) * 0.08;
      this.rotationY += (this.targetRotationY - this.rotationY) * 0.08;
    } else {
      this.rotationX += (this.targetRotationX - this.rotationX) * 0.15;
      this.rotationY += (this.targetRotationY - this.rotationY) * 0.15;
    }
    
    this.group.rotation.x = this.rotationX;
    this.group.rotation.y = this.rotationY;
    this.group.rotation.z = swayAngleY * 0.5;
    
    // 3. Dynamic Frame Neon Color Shifting ("Ubah-ubah warna" - Faris EDP style)
    if (this.frameMaterial && opacity > 0) {
      // Create HSL color cycle slowly over time combined with mouse X offset
      const mouseOffset = (mouse.x + 1.0) * 0.15; // shifts hue based on mouse move
      const hue = (time * 0.08 + mouseOffset) % 1.0; 
      
      // Update color and emissive properties for double glow!
      const frameColor = new THREE.Color().setHSL(hue, 0.9, 0.55);
      this.frameMaterial.color.copy(frameColor);
      this.frameMaterial.emissive.copy(frameColor);
      
      // Brighten emissive intensity slightly on mouse drag/interaction
      this.frameMaterial.emissiveIntensity = opacity * (this.isDragging ? 0.7 : 0.45);
    }
    
    // Clearcoat holographic shine pulse
    if (this.frontMesh && this.frontMesh.material && opacity > 0) {
      const pulse = Math.abs(Math.sin(time + this.rotationY)) * 0.3 + 0.7;
      this.frontMesh.material.clearcoat = pulse;
    }
  }

  destroy() {
    window.removeEventListener('pointerdown', this.pointerDownListener);
    window.removeEventListener('pointermove', this.pointerMoveListener);
    window.removeEventListener('pointerup', this.pointerUpListener);
    window.removeEventListener('resize', this.resizeListener);
    
    if (this.frontMesh) {
      this.frontMesh.geometry.dispose();
      this.frontMesh.material.dispose();
    }
    if (this.backMesh) {
      this.backMesh.geometry.dispose();
      if (this.backMesh.material.dispose) this.backMesh.material.dispose();
    }
    if (this.frameMesh) {
      this.frameMesh.geometry.dispose();
      if (this.frameMaterial) this.frameMaterial.dispose();
    }
    if (this.frontTexture) this.frontTexture.dispose();
    if (this.backTexture) this.backTexture.dispose();
  }
}
