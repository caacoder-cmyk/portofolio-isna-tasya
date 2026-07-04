import * as THREE from 'three';

export class Butterflies {
  constructor(scene) {
    this.scene = scene;
    this.butterflies = [];
    this.particleCount = 400;
    
    this.init();
  }

  init() {
    // 1. Create Particle Dust Field (Stars/Glowing Embers)
    this.createParticleField();
    
    // 2. Create 3D Butterflies (Flapping Wings)
    const butterflyCount = 6;
    for (let i = 0; i < butterflyCount; i++) {
      this.createButterfly();
    }
  }

  createParticleField() {
    // Custom round dot particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 107, 139, 0.8)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    
    const texture = new THREE.CanvasTexture(canvas);
    
    // Geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const scales = new Float32Array(this.particleCount);
    const speeds = [];

    for (let i = 0; i < this.particleCount; i++) {
      // Random coordinates in space
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2; // depth
      
      scales[i] = Math.random() * 0.15 + 0.05;
      speeds.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() + 0.1) * 0.015, // float upwards mostly
        z: (Math.random() - 0.5) * 0.01
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    
    // Material
    const material = new THREE.PointsMaterial({
      size: 0.15,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.7
    });

    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);
    this.particleSpeeds = speeds;
  }

  createButterfly() {
    const butterfly = new THREE.Group();
    
    // Create glowing wing material
    // Draw beautiful wing texture on canvas
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Draw wing gradient shape
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0,0,128,128);
    
    const wingGrad = ctx.createRadialGradient(20, 64, 5, 64, 64, 80);
    wingGrad.addColorStop(0, '#ffd1dc'); // bright inner
    wingGrad.addColorStop(0.4, '#ff6b8b'); // warm rose
    wingGrad.addColorStop(0.8, '#7a1f32'); // deep crimson outline
    wingGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = wingGrad;
    ctx.beginPath();
    ctx.ellipse(64, 64, 55, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw fine veins on wings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let angle = -Math.PI/3; angle < Math.PI/3; angle += 0.25) {
      ctx.moveTo(10, 64);
      ctx.lineTo(64 + Math.cos(angle) * 50, 64 + Math.sin(angle) * 30);
    }
    ctx.stroke();
    
    const texture = new THREE.CanvasTexture(canvas);

    // Left Wing (rotates on Y axis edge)
    const wingGeo = new THREE.PlaneGeometry(0.8, 0.6);
    wingGeo.translate(0.4, 0, 0); // translate pivot to left edge
    const wingMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const wingLeft = new THREE.Mesh(wingGeo, wingMat);
    wingLeft.name = "wingLeft";
    butterfly.add(wingLeft);
    
    // Right Wing
    const wingGeoRight = new THREE.PlaneGeometry(0.8, 0.6);
    wingGeoRight.translate(-0.4, 0, 0); // translate pivot to right edge
    const wingRight = new THREE.Mesh(wingGeoRight, wingMat);
    wingRight.name = "wingRight";
    butterfly.add(wingRight);
    
    // Small body
    const bodyGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6);
    const bodyMat = new THREE.MeshBasicMaterial({ color: 0xff6b8b });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.x = Math.PI / 2;
    butterfly.add(body);
    
    // Scaling and initial positioning
    const scale = Math.random() * 0.3 + 0.2;
    butterfly.scale.set(scale, scale, scale);
    
    butterfly.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 4 - 1
    );
    
    // Flight dynamics metadata
    this.butterflies.push({
      mesh: butterfly,
      wingLeft: wingLeft,
      wingRight: wingRight,
      speed: Math.random() * 0.015 + 0.01,
      flapSpeed: Math.random() * 12 + 10,
      amplitudeY: Math.random() * 0.8 + 0.4,
      amplitudeX: Math.random() * 1.5 + 0.5,
      noiseOffset: Math.random() * 100,
      yDirection: Math.random() > 0.5 ? 1 : -1
    });
    
    this.scene.add(butterfly);
  }

  update(time, mouse, scrollProgress) {
    // 1. Update Dust Particles
    const positions = this.points.geometry.attributes.position.array;
    for (let i = 0; i < this.particleCount; i++) {
      // Apply speeds
      positions[i * 3] += this.particleSpeeds[i].x;
      positions[i * 3 + 1] += this.particleSpeeds[i].y;
      positions[i * 3 + 2] += this.particleSpeeds[i].z;
      
      // Horizontal drift pulls slightly towards mouse
      positions[i * 3] += mouse.x * 0.005;
      positions[i * 3 + 1] += mouse.y * 0.005;

      // Wrap particles around borders
      if (positions[i * 3 + 1] > 8) {
        positions[i * 3 + 1] = -8;
        positions[i * 3] = (Math.random() - 0.5) * 20;
      }
      if (positions[i * 3] > 10) positions[i * 3] = -10;
      if (positions[i * 3] < -10) positions[i * 3] = 10;
    }
    this.points.geometry.attributes.position.needsUpdate = true;
    
    // Subtle rotation of particle field
    this.points.rotation.y = time * 0.02;

    // 2. Update Butterflies (Flapping & Flight paths)
    this.butterflies.forEach((b) => {
      const { mesh, wingLeft, wingRight, speed, flapSpeed, amplitudeY, amplitudeX, noiseOffset } = b;
      
      // Flapping wings
      const wingAngle = Math.sin(time * flapSpeed) * 0.75;
      wingLeft.rotation.y = wingAngle;
      wingRight.rotation.y = -wingAngle;
      
      // Smooth floating flight path
      const movementTime = time * speed * 2 + noiseOffset;
      
      // Flying pattern (figure 8 or smooth sine drift)
      mesh.position.x += Math.sin(movementTime) * 0.015 * amplitudeX;
      mesh.position.y += Math.cos(movementTime * 1.5) * 0.01 * amplitudeY;
      
      // Drift upwards slightly, then wrap around
      mesh.position.y += 0.005;
      if (mesh.position.y > 6) {
        mesh.position.y = -6;
        mesh.position.x = (Math.random() - 0.5) * 10;
      }
      
      // Orient butterfly towards its flight direction
      mesh.rotation.z = Math.sin(movementTime) * 0.2;
      mesh.rotation.y = Math.cos(movementTime) * 0.3;
      
      // Adjust Z position (depth parallax) slightly based on scroll
      mesh.position.z += (mouse.y * 0.05) - (scrollProgress * 0.05);
    });
  }
}
