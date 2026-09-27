/**
 * FOR HAYA — 3D LUXURY KEEPSAKE EXPERIENCE
 * WebGL / Three.js Single-Viewport Engine
 * Features:
 *  - Fullscreen Living Particle Galaxy with Parallax
 *  - Floating 3D Glass Keepsake Card with High-Res Canvas Textures
 *  - Touch & Mouse 3D Inertia Drag Rotation
 *  - Unfolding Multi-Facet Message Engine
 *  - "Make a Wish" WebGL Particle Burst & Celestial Harmonic Sound
 *  - Web Audio API Synthetic Ambient Soundscape
 *  - Fully Responsive, Strict Amethyst/Orchid Palette
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. COLOR PALETTE CONSTANTS (Strict Purple & Violet Spectrum)
     ========================================================================== */
  const COLORS = {
    bgVoid: 0x08040d,
    bgDeep: 0x0d0814,
    purpleRoyal: 0x6c3483,
    purpleAmethyst: 0x7d3c98,
    purpleOrchid: 0x9b59b6,
    purpleSoft: 0xb497d6,
    purpleLilac: 0xe8d5f5,
    purpleCrystal: 0xf5efff,
    purpleDark: 0x371848,
    glowGems: ['#E8D5F5', '#B497D6', '#9B59B6', '#7D3C98', '#6C3483']
  };

  /* ==========================================================================
     2. GLOBAL VARIABLES & STATE
     ========================================================================== */
  const container = document.getElementById('canvas-container');
  const loadingScreen = document.getElementById('loading-screen');
  const dragHint = document.getElementById('drag-hint');
  const faceNavBtns = document.querySelectorAll('.face-nav-btn');
  const makeWishBtn = document.getElementById('make-wish-btn');
  const wishModal = document.getElementById('wish-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalDateDisplay = document.getElementById('modal-date-display');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundBtnText = document.getElementById('sound-btn-text');

  let scene, camera, renderer;
  let cardMesh, cardGroup;
  let galaxyPoints, galaxyGeometry, galaxyMaterial;
  let burstPointsGroup = [];
  let ambientLight, keyPointLight, fillPointLight, rimPointLight;

  // Interaction State
  let isDragging = false;
  let prevPointerX = 0;
  let prevPointerY = 0;
  let targetRotationY = 0;
  let targetRotationX = 0;
  let currentRotationY = 0;
  let currentRotationX = 0;
  let velocityY = 0;
  let velocityX = 0;
  let isNavSnapping = false;
  let currentFaceIndex = 0;
  let hasInteracted = false;
  let clock = new THREE.Clock();

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetCameraX = 0;
  let targetCameraY = 0;

  // Facet Messages unfolded on rotation
  const FACET_MESSAGES = [
    {
      index: 0,
      angle: 0,
      kicker: '✦ Face I • Genesis ✦',
      title: 'Haya Madam G 🎀👀',
      text: 'A radiant presence born May 5th, 2009 — carrying quiet grace and timeless warmth.'
    },
    {
      index: 1,
      angle: Math.PI / 2,
      kicker: '✦ Face II • Grace ✦',
      title: 'Quiet Brilliance',
      text: 'You carry an effortless kindness that disarms the rush of the world and puts everyone at ease.'
    },
    {
      index: 2,
      angle: Math.PI,
      kicker: '✦ Face III • The Journey ✦',
      title: 'Unfolding Horizons',
      text: 'Never rush who you are becoming. May every quiet hope you cherish find wings to soar.'
    },
    {
      index: 3,
      angle: (3 * Math.PI) / 2,
      kicker: '✦ Face IV • The Blessing ✦',
      title: 'Always Celebrated',
      text: 'Happy Belated Birthday, Haya — some celebrations are too special for just one day.'
    }
  ];

  /* ==========================================================================
     3. WEB AUDIO API SYNTHETIC AMBIENT SOUND ENGINE
     ========================================================================== */
  class CelestialAudioEngine {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.ambientGain = null;
      this.timer = null;
    }

    init() {
      if (this.ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
    }

    startAmbient() {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.isPlaying = true;

      // Master ambient gain
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.25, this.ctx.currentTime + 3);
      this.ambientGain.connect(this.ctx.destination);

      // Warm purple drone pad (Amethyst Eb Minor / Gb major harmony)
      const freqs = [155.56, 185.0, 233.08, 277.18, 311.13]; // Eb3, Gb3, Bb3, Db4, Eb4
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450 + idx * 80, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.035, this.ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ambientGain);

        osc.start();
      });

      // Scheduled random celestial bell tones
      this.scheduleNextChime();
    }

    scheduleNextChime() {
      if (!this.isPlaying) return;
      const delay = 3500 + Math.random() * 4000;
      this.timer = setTimeout(() => {
        if (this.isPlaying) {
          this.playBellTone();
          this.scheduleNextChime();
        }
      }, delay);
    }

    playBellTone(freq) {
      if (!this.ctx) return;
      const chimeFreqs = [622.25, 739.99, 830.61, 932.33, 1108.73, 1244.51];
      const selected = freq || chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(selected, this.ctx.currentTime);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(selected, this.ctx.currentTime);
      filter.Q.setValueAtTime(4.0, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 2.6);
    }

    playWishCelebration() {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      // Sweeping celestial harp arpeggio
      const notes = [311.13, 370.0, 466.16, 622.25, 739.99, 932.33, 1244.51];
      notes.forEach((pitch, i) => {
        setTimeout(() => {
          this.playBellTone(pitch);
        }, i * 90);
      });
    }

    stopAmbient() {
      this.isPlaying = false;
      if (this.timer) clearTimeout(this.timer);
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1);
      }
    }
  }

  const audio = new CelestialAudioEngine();

  /* ==========================================================================
     4. HIGH-RESOLUTION DYNAMIC 2D CANVAS TEXTURE GENERATOR
     ========================================================================== */
  function createFrontTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');

    // 1. Deep Midnight Purple Velvet Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1440);
    bgGrad.addColorStop(0, '#0c0614');
    bgGrad.addColorStop(0.35, '#190a2a');
    bgGrad.addColorStop(0.7, '#130722');
    bgGrad.addColorStop(1, '#09040e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 1440);

    // 2. Ambient Internal Glow
    const glowGrad = ctx.createRadialGradient(512, 540, 50, 512, 540, 500);
    glowGrad.addColorStop(0, 'rgba(155, 89, 182, 0.28)');
    glowGrad.addColorStop(0.5, 'rgba(108, 52, 131, 0.12)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, 1024, 1440);

    // 3. Ornate Double Hairline Border with Art-Deco Corners
    ctx.strokeStyle = 'rgba(180, 151, 214, 0.45)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(40, 40, 944, 1360);

    ctx.strokeStyle = 'rgba(180, 151, 214, 0.22)';
    ctx.lineWidth = 1;
    ctx.strokeRect(54, 54, 916, 1332);

    // Corner Diamond Accents
    const corners = [
      [40, 40],
      [984, 40],
      [40, 1400],
      [984, 1400]
    ];
    ctx.fillStyle = '#E8D5F5';
    corners.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Celestial Star & Monogram Emblem
    ctx.textAlign = 'center';

    // Top Kicker
    ctx.font = '300 24px "Jost", sans-serif';
    ctx.fillStyle = '#B497D6';
    ctx.letterSpacing = '0.35em';
    ctx.fillText('✦  A  T I M E L E S S  K E E P S A K E  ✦', 512, 150);

    // Celestial Medallion Ring
    ctx.strokeStyle = 'rgba(232, 213, 245, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(512, 290, 80, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(155, 89, 182, 0.4)';
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(512, 290, 95, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Core Monogram "H"
    ctx.font = 'italic 500 86px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#F5EFFF';
    ctx.shadowColor = 'rgba(232, 213, 245, 0.7)';
    ctx.shadowBlur = 25;
    ctx.fillText('H', 512, 320);
    ctx.shadowBlur = 0;

    // 5. Engraved Main Title: "Haya Madam G 🎀👀"
    ctx.font = '400 32px "Jost", sans-serif';
    ctx.fillStyle = '#B497D6';
    ctx.fillText('D E D I C A T E D   T O', 512, 540);

    ctx.font = 'italic 500 78px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(180, 151, 214, 0.85)';
    ctx.shadowBlur = 35;
    ctx.fillText('Haya Madam G 🎀👀', 512, 650);
    ctx.shadowBlur = 0;

    // Elegant Sub-Heading
    ctx.font = '300 30px "Jost", sans-serif';
    ctx.fillStyle = '#B497D6';
    ctx.fillText('May 5th, 2009 • A Radiant Soul', 512, 730);

    // Decorative Divider Line
    ctx.strokeStyle = 'rgba(180, 151, 214, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(320, 820);
    ctx.lineTo(460, 820);
    ctx.moveTo(564, 820);
    ctx.lineTo(704, 820);
    ctx.stroke();

    ctx.font = '28px serif';
    ctx.fillStyle = '#E8D5F5';
    ctx.fillText('✧ ✦ ✧', 512, 828);

    // Poetic Front Inscription
    ctx.font = 'italic 400 34px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#E8D5F5';
    ctx.fillText('“A soul that quietly disarms the world with warmth,', 512, 940);
    ctx.fillText('bringing light wherever you choose to step.”', 512, 995);

    // Bottom Exploration Hint
    ctx.font = '300 24px "Jost", sans-serif';
    ctx.fillStyle = 'rgba(180, 151, 214, 0.65)';
    ctx.fillText('✦   DRAG TO ROTATE & UNVEIL HER BLESSINGS   ✦', 512, 1310);

    return new THREE.CanvasTexture(canvas);
  }

  function createBackTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');

    // 1. Deep Obsidian Purple Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1440);
    bgGrad.addColorStop(0, '#09040e');
    bgGrad.addColorStop(0.4, '#150824');
    bgGrad.addColorStop(0.8, '#1e0d33');
    bgGrad.addColorStop(1, '#09040e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 1440);

    // 2. Ambient Glow
    const glowGrad = ctx.createRadialGradient(512, 600, 50, 512, 600, 500);
    glowGrad.addColorStop(0, 'rgba(125, 60, 152, 0.32)');
    glowGrad.addColorStop(0.6, 'rgba(108, 52, 131, 0.1)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, 1024, 1440);

    // 3. Dual Borders
    ctx.strokeStyle = 'rgba(180, 151, 214, 0.45)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(40, 40, 944, 1360);

    ctx.strokeStyle = 'rgba(180, 151, 214, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(54, 54, 916, 1332);

    ctx.textAlign = 'center';

    // 4. Header Inscription
    ctx.font = '300 24px "Jost", sans-serif';
    ctx.fillStyle = '#B497D6';
    ctx.fillText('✦   T H E   C E L E S T I A L   W I S H   ✦', 512, 150);

    // Radiant Moon & Star Icon
    ctx.font = '54px serif';
    ctx.fillStyle = '#E8D5F5';
    ctx.shadowColor = 'rgba(180, 151, 214, 0.7)';
    ctx.shadowBlur = 20;
    ctx.fillText('🌙 ✨', 512, 260);
    ctx.shadowBlur = 0;

    // Headline
    ctx.font = 'italic 500 68px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Timeless Radiance', 512, 380);

    // Body Text Lines
    ctx.font = '300 32px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#E8D5F5';
    ctx.fillText('Some wishes refuse to be contained by a single day on the calendar.', 512, 520);
    ctx.fillText('Though May 5th has quietly passed, the desire to celebrate your presence', 512, 575);
    ctx.fillText('remains as radiant, steadfast, and bright as ever.', 512, 630);

    // Highlight Quote
    ctx.font = 'italic 500 38px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(232, 213, 245, 0.6)';
    ctx.shadowBlur = 18;
    ctx.fillText('“May this year be gentle with your heart, generous with your dreams,', 512, 770);
    ctx.fillText('and filled with magic you never saw coming.”', 512, 830);
    ctx.shadowBlur = 0;

    // Second Verse
    ctx.font = '300 32px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#E8D5F5';
    ctx.fillText('Never hurry who you are becoming. May each chapter grant you', 512, 970);
    ctx.fillText('unshakeable peace, effortless joy, and pride in everything you are.', 512, 1025);

    // Closing Signature
    ctx.font = 'italic 500 46px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('With warmth & highest admiration,', 512, 1160);

    const today = new Date();
    const dateFormatted = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    ctx.font = '300 24px "Jost", sans-serif';
    ctx.fillStyle = '#B497D6';
    ctx.fillText(`Recorded on ${dateFormatted} • Timeless Tribute`, 512, 1230);

    ctx.font = '24px serif';
    ctx.fillStyle = '#E8D5F5';
    ctx.fillText('✦   💜   ✦', 512, 1310);

    return new THREE.CanvasTexture(canvas);
  }

  function createEdgeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 128, 128);
    grad.addColorStop(0, '#2b1040');
    grad.addColorStop(0.5, '#7d3c98');
    grad.addColorStop(1, '#1b082a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    ctx.strokeStyle = 'rgba(232, 213, 245, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 128, 128);

    return new THREE.CanvasTexture(canvas);
  }

  function createGlowPointTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(232, 213, 245, 0.9)');
    grad.addColorStop(0.55, 'rgba(155, 89, 182, 0.45)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
  }

  /* ==========================================================================
     5. THREE.JS SCENE SETUP
     ========================================================================== */
  function initThreeScene() {
    // 1. Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(COLORS.bgVoid, 0.024);

    // 2. Camera
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    updateCameraDistance();

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. Lights (Strict Purple Spectrum)
    ambientLight = new THREE.AmbientLight(0x4a256d, 1.4);
    scene.add(ambientLight);

    keyPointLight = new THREE.PointLight(COLORS.purpleSoft, 2.8, 35);
    keyPointLight.position.set(5, 7, 8);
    scene.add(keyPointLight);

    fillPointLight = new THREE.PointLight(COLORS.purpleRoyal, 2.2, 35);
    fillPointLight.position.set(-6, -4, 6);
    scene.add(fillPointLight);

    rimPointLight = new THREE.PointLight(COLORS.purpleLilac, 3.2, 25);
    rimPointLight.position.set(0, 5, -8);
    scene.add(rimPointLight);

    // 5. Living Particle Galaxy
    createLivingGalaxy();

    // 6. Floating Keepsake Card Centerpiece
    createFloatingKeepsakeCard();

    // Fade out loading screen smoothly once scene is ready
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.add('is-loaded');
      }
    }, 600);
  }

  function updateCameraDistance() {
    const isMobile = window.innerWidth < 768;
    const isNarrow = window.innerWidth < 480;

    if (isNarrow) {
      camera.position.set(0, 0.2, 10.5);
    } else if (isMobile) {
      camera.position.set(0, 0.2, 9.2);
    } else {
      camera.position.set(0, 0.2, 7.8);
    }
  }

  /* ==========================================================================
     6. LIVING PARTICLE GALAXY
     ========================================================================== */
  function createLivingGalaxy() {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 1000 : 2500; // Performance optimization for mid-range phones

    galaxyGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    const palette = [
      new THREE.Color(COLORS.purpleLilac),
      new THREE.Color(COLORS.purpleSoft),
      new THREE.Color(COLORS.purpleOrchid),
      new THREE.Color(COLORS.purpleAmethyst),
      new THREE.Color(0xd2b4de)
    ];

    for (let i = 0; i < count; i++) {
      // Cylindrical/spherical soft galaxy dispersion
      const radius = 6 + Math.pow(Math.random(), 1.5) * 35;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 28;

      positions[i * 3] = radius * Math.cos(theta);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = radius * Math.sin(theta);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      scales[i] = 0.5 + Math.random() * 1.5;
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const glowTex = createGlowPointTexture();
    galaxyMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.35 : 0.42,
      map: glowTex,
      transparent: true,
      opacity: 0.82,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
    scene.add(galaxyPoints);
  }

  /* ==========================================================================
     7. FLOATING 3D GLASS KEEPSAKE CARD
     ========================================================================== */
  function createFloatingKeepsakeCard() {
    cardGroup = new THREE.Group();
    scene.add(cardGroup);

    // Dimensions: luxury card proportions
    const width = 3.3;
    const height = 4.65;
    const depth = 0.28;

    const geometry = new THREE.BoxGeometry(width, height, depth, 4, 4, 2);

    const frontTexture = createFrontTexture();
    const backTexture = createBackTexture();
    const edgeTexture = createEdgeTexture();

    // Three.js Box Materials: [right, left, top, bottom, front, back]
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: COLORS.purpleOrchid,
      roughness: 0.22,
      metalness: 0.45,
      emissive: COLORS.purpleDark,
      emissiveIntensity: 0.6,
      map: edgeTexture
    });

    const frontMaterial = new THREE.MeshStandardMaterial({
      map: frontTexture,
      roughness: 0.2,
      metalness: 0.25,
      emissive: COLORS.purpleDark,
      emissiveIntensity: 0.25
    });

    const backMaterial = new THREE.MeshStandardMaterial({
      map: backTexture,
      roughness: 0.2,
      metalness: 0.25,
      emissive: COLORS.purpleDark,
      emissiveIntensity: 0.25
    });

    const materials = [
      edgeMaterial, // +X right
      edgeMaterial, // -X left
      edgeMaterial, // +Y top
      edgeMaterial, // -Y bottom
      frontMaterial, // +Z front (Haya Madam G)
      backMaterial // -Z back (The Celestial Wish)
    ];

    cardMesh = new THREE.Mesh(geometry, materials);
    cardGroup.add(cardMesh);

    // Add a delicate outer frosted glass halo rim
    const haloGeo = new THREE.BoxGeometry(width + 0.12, height + 0.12, depth + 0.04);
    const haloMat = new THREE.MeshBasicMaterial({
      color: COLORS.purpleLilac,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    cardGroup.add(haloMesh);
  }

  /* ==========================================================================
     8. PARTICLE BURST FOR "MAKE A WISH"
     ========================================================================== */
  function triggerParticleBurst() {
    const burstCount = window.innerWidth < 768 ? 200 : 400;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(burstCount * 3);
    const velocities = [];
    const colors = new Float32Array(burstCount * 3);

    const palette = [
      new THREE.Color(COLORS.purpleLilac),
      new THREE.Color(COLORS.purpleSoft),
      new THREE.Color(COLORS.purpleOrchid),
      new THREE.Color(0xffffff)
    ];

    for (let i = 0; i < burstCount; i++) {
      // Start at card center
      positions[i * 3] = (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      // Spherical explosion velocities
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 4 + Math.random() * 8;

      velocities.push({
        x: speed * Math.sin(phi) * Math.cos(theta),
        y: speed * Math.sin(phi) * Math.sin(theta),
        z: speed * Math.cos(phi),
        drag: 0.94 + Math.random() * 0.04
      });

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.55,
      map: createGlowPointTexture(),
      transparent: true,
      opacity: 1.0,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const burstPoints = new THREE.Points(geo, mat);
    scene.add(burstPoints);

    burstPointsGroup.push({
      mesh: burstPoints,
      velocities: velocities,
      life: 1.0,
      decay: 0.016
    });

    // Surge light intensity
    if (keyPointLight) {
      keyPointLight.intensity = 6.0;
    }
  }

  /* ==========================================================================
     9. INTERACTIVE TOUCH & DRAG ROTATION CONTROLS
     ========================================================================= */
  function onPointerDown(clientX, clientY) {
    isDragging = true;
    isNavSnapping = false;
    prevPointerX = clientX;
    prevPointerY = clientY;
    velocityY = 0;
    velocityX = 0;

    if (!hasInteracted) {
      hasInteracted = true;
      if (dragHint) dragHint.classList.add('is-hidden');
    }
  }

  function onPointerMove(clientX, clientY) {
    if (!isDragging) {
      // Track mouse for subtle parallax
      mouseX = (clientX / window.innerWidth) * 2 - 1;
      mouseY = -(clientY / window.innerHeight) * 2 + 1;
      targetCameraX = mouseX * 0.6;
      targetCameraY = mouseY * 0.4;
      return;
    }

    const deltaX = clientX - prevPointerX;
    const deltaY = clientY - prevPointerY;

    prevPointerX = clientX;
    prevPointerY = clientY;

    // Rotation sensitivity
    const sensitivity = 0.0075;
    targetRotationY += deltaX * sensitivity;
    targetRotationX += deltaY * sensitivity * 0.5;

    // Clamp X tilt to keep card elegantly upright
    targetRotationX = Math.max(-0.4, Math.min(0.4, targetRotationX));

    velocityY = deltaX * sensitivity;
    velocityX = deltaY * sensitivity * 0.5;
  }

  function onPointerUp() {
    isDragging = false;
  }

  // Desktop Mouse Events
  container.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
  window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
  window.addEventListener('mouseup', onPointerUp);

  // Mobile Touch Events (Single-finger drag)
  container.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length === 1) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    { passive: true }
  );

  window.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    { passive: true }
  );

  window.addEventListener('touchend', onPointerUp, { passive: true });

  /* ==========================================================================
     10. FACE NAVIGATION DOCK & ROTATION SNAPPING
     ========================================================================== */
  function snapToFace(index) {
    isNavSnapping = true;
    currentFaceIndex = index;

    // Calculate nearest equivalent angle to avoid spinning around unnecessarily
    const targetAngle = FACET_MESSAGES[index].angle;
    const currentAngle = targetRotationY;
    const twoPi = Math.PI * 2;

    // Normalize to closest rotation
    const turns = Math.round((currentAngle - targetAngle) / twoPi);
    targetRotationY = turns * twoPi + targetAngle;
    targetRotationX = 0; // Level out tilt

    // Update active state in nav dock
    faceNavBtns.forEach((btn, idx) => {
      btn.classList.toggle('is-active', idx === index);
    });

    // Sound chime on face select
    audio.playBellTone(500 + index * 120);

    if (!hasInteracted) {
      hasInteracted = true;
      if (dragHint) dragHint.classList.add('is-hidden');
    }
  }

  faceNavBtns.forEach((btn) => {
    const handleFaceSelect = (e) => {
      e.stopPropagation();
      const faceIdx = parseInt(btn.getAttribute('data-face') || '0', 10);
      snapToFace(faceIdx);
    };

    btn.addEventListener('click', handleFaceSelect);
    btn.addEventListener('touchend', handleFaceSelect, { passive: true });
  });

  // Calculate current active face based on rotation angle for HUD dock
  function updateActiveFaceFromRotation() {
    if (isNavSnapping) return;
    const twoPi = Math.PI * 2;
    let norm = (currentRotationY % twoPi + twoPi) % twoPi; // [0, 2pi)

    let closestIndex = 0;
    let minDiff = Infinity;

    FACET_MESSAGES.forEach((facet) => {
      let diff = Math.abs(norm - facet.angle);
      if (diff > Math.PI) diff = twoPi - diff;
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = facet.index;
      }
    });

    if (closestIndex !== currentFaceIndex) {
      currentFaceIndex = closestIndex;
      faceNavBtns.forEach((btn, idx) => {
        btn.classList.toggle('is-active', idx === closestIndex);
      });
    }
  }

  /* ==========================================================================
     11. "MAKE A WISH" & MODAL CELEBRATION
     ========================================================================== */
  function openWishModal() {
    // 1. Particle burst from card
    triggerParticleBurst();

    // 2. Play celestial sound chord
    audio.playWishCelebration();

    // 3. Open modal
    if (wishModal) {
      wishModal.classList.add('is-open');
      wishModal.setAttribute('aria-hidden', 'false');
    }

    // Set dynamic date in modal
    if (modalDateDisplay) {
      const today = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      modalDateDisplay.textContent = `Sent with love on ${today.toLocaleDateString('en-US', options)} • Timeless`;
    }
  }

  function closeWishModal() {
    if (wishModal) {
      wishModal.classList.remove('is-open');
      wishModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (makeWishBtn) {
    makeWishBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openWishModal();
    });
    makeWishBtn.addEventListener(
      'touchend',
      (e) => {
        e.preventDefault();
        openWishModal();
      },
      { passive: false }
    );
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeWishModal);
  }

  if (modalDismissBtn) {
    modalDismissBtn.addEventListener('click', closeWishModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeWishModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeWishModal();
  });

  /* ==========================================================================
     12. AUDIO TOGGLE CONTROLS
     ========================================================================== */
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      if (!audio.isPlaying) {
        audio.startAmbient();
        soundToggleBtn.classList.add('is-active');
        if (soundBtnText) soundBtnText.textContent = 'Mute Chimes';
      } else {
        audio.stopAmbient();
        soundToggleBtn.classList.remove('is-active');
        if (soundBtnText) soundBtnText.textContent = 'Ambient Chimes';
      }
    });
  }

  /* ==========================================================================
     13. RENDER & ANIMATION LOOP
     ========================================================================== */
  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // 1. Card Inertia and Smooth Rotation
    if (!isDragging) {
      // Apply momentum friction
      targetRotationY += velocityY;
      targetRotationX += velocityX;
      velocityY *= 0.92;
      velocityX *= 0.92;

      // Gentle idle breathing floating motion when untouched
      if (!isNavSnapping && Math.abs(velocityY) < 0.001) {
        targetRotationY += 0.002; // Slow auto-orbit
      }
    }

    // Smooth lerp to target rotation
    currentRotationY += (targetRotationY - currentRotationY) * (isNavSnapping ? 0.08 : 0.06);
    currentRotationX += (targetRotationX - currentRotationX) * 0.08;

    if (cardGroup) {
      cardGroup.rotation.y = currentRotationY;
      cardGroup.rotation.x = currentRotationX;

      // Gentle vertical hover/floating bob
      cardGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;
      cardGroup.rotation.z = Math.sin(elapsedTime * 0.8) * 0.02;
    }

    // Update active face state in HUD
    updateActiveFaceFromRotation();

    // 2. Galaxy Particles Slow Orbit & Wave
    if (galaxyPoints) {
      galaxyPoints.rotation.y = elapsedTime * 0.035;
      galaxyPoints.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;
    }

    // 3. Parallax Camera Shift
    camera.position.x += (targetCameraX - camera.position.x) * 0.05;
    camera.position.y += (targetCameraY + 0.2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    // 4. Smooth Light Recovery from Wish Surge
    if (keyPointLight && keyPointLight.intensity > 2.8) {
      keyPointLight.intensity += (2.8 - keyPointLight.intensity) * 0.04;
    }

    // 5. Update Particle Bursts
    for (let i = burstPointsGroup.length - 1; i >= 0; i--) {
      const burst = burstPointsGroup[i];
      const posAttr = burst.mesh.geometry.attributes.position;
      const positions = posAttr.array;

      for (let j = 0; j < burst.velocities.length; j++) {
        const vel = burst.velocities[j];
        positions[j * 3] += vel.x * delta;
        positions[j * 3 + 1] += vel.y * delta;
        positions[j * 3 + 2] += vel.z * delta;

        vel.x *= vel.drag;
        vel.y *= vel.drag;
        vel.z *= vel.drag;
      }

      posAttr.needsUpdate = true;

      burst.life -= burst.decay;
      burst.mesh.material.opacity = Math.max(0, burst.life);

      if (burst.life <= 0) {
        scene.remove(burst.mesh);
        burst.mesh.geometry.dispose();
        burst.mesh.material.dispose();
        burstPointsGroup.splice(i, 1);
      }
    }

    renderer.render(scene, camera);
  }

  /* ==========================================================================
     14. WINDOW RESIZE HANDLING
     ========================================================================== */
  window.addEventListener('resize', () => {
    if (!renderer || !camera) return;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    updateCameraDistance();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  /* ==========================================================================
     15. INITIALIZATION
     ========================================================================== */
  window.addEventListener('DOMContentLoaded', () => {
    initThreeScene();
    animate();
  });
})();
