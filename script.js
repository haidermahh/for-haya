/**
 * FOR HAYA — CELESTIAL LUXURY KEEPSAKE
 * script.js
 *
 * Architecture:
 *  - Three.js renders ONLY the decorative glass card frame + particle background
 *  - ALL text lives in HTML (zero canvas text = zero overflow bugs)
 *  - Chapter navigation switches HTML content with smooth CSS transitions
 *  - Web Audio API ambient synth + chime engine (zero external files)
 *  - Full touch & mouse inertia drag on 3D frame
 *  - Reduced-motion aware
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════════
     1. CONSTANTS
  ═══════════════════════════════════════════════════════════════════════ */
  const PALETTE = {
    void:      0x07030d,
    deep:      0x0e0719,
    surface:   0x160827,
    violet:    0x35105c,
    purple:    0x6e2aa5,
    lavender:  0xc8a7e8,
    lilac:     0xe2d0f5,
    warmWhite: 0xf8f3ff
  };

  const isMobile     = () => window.innerWidth < 768;
  const prefersLess  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══════════════════════════════════════════════════════════════════════
     2. DOM REFERENCES
  ═══════════════════════════════════════════════════════════════════════ */
  const loadingVeil    = document.getElementById('loading-veil');
  const bgCanvas       = document.getElementById('bg-canvas');
  const cardCanvas     = document.getElementById('card-canvas');
  const dragHint       = document.getElementById('drag-hint');
  const chimeToggle    = document.getElementById('chime-toggle');
  const tabs           = document.querySelectorAll('.chapter-tab');
  const chapters       = document.querySelectorAll('.chapter');
  const wishBtn        = document.getElementById('wish-btn');
  const wishModal      = document.getElementById('wish-modal');
  const wishBackdrop   = document.getElementById('wish-modal-backdrop');
  const wishClose      = document.getElementById('wish-modal-close');
  const wishDismiss    = document.getElementById('wish-modal-dismiss');
  const journeyDate    = document.getElementById('journey-date');

  /* ═══════════════════════════════════════════════════════════════════════
     3. DYNAMIC DATE
  ═══════════════════════════════════════════════════════════════════════ */
  if (journeyDate) {
    const opts = { year: 'numeric', month: 'long', day: 'numeric' };
    journeyDate.textContent =
      new Date().toLocaleDateString('en-US', opts) + ' · Timeless Tribute';
  }

  /* ═══════════════════════════════════════════════════════════════════════
     4. WEB AUDIO — SYNTHETIC AMBIENT ENGINE
  ═══════════════════════════════════════════════════════════════════════ */
  class AmbientEngine {
    constructor() {
      this.ctx         = null;
      this.masterGain  = null;
      this.droneOscs   = [];
      this.chimeTimer  = null;
      this.active      = false;
    }

    _boot() {
      if (this.ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
    }

    _resume() {
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    }

    start() {
      this._boot();
      if (!this.ctx) return;
      this._resume();
      this.active = true;

      // Master gain — fade in
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 3);
      this.masterGain.connect(this.ctx.destination);

      // Eb minor drone — soft triadic harmonic pad
      const drones = [155.56, 185.00, 233.08, 311.13, 370.00];
      drones.forEach((freq, i) => {
        const osc  = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const lp   = this.ctx.createBiquadFilter();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.value = freq;

        lp.type = 'lowpass';
        lp.frequency.value = 600 + i * 80;

        gain.gain.value = 0.03;

        osc.connect(lp); lp.connect(gain); gain.connect(this.masterGain);
        osc.start();
        this.droneOscs.push(osc);
      });

      this._scheduleChime();
    }

    stop() {
      this.active = false;
      if (this.chimeTimer) clearTimeout(this.chimeTimer);
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
      }
      setTimeout(() => {
        this.droneOscs.forEach(o => { try { o.stop(); } catch (_) {} });
        this.droneOscs = [];
      }, 1500);
    }

    _scheduleChime() {
      if (!this.active) return;
      const delay = 3000 + Math.random() * 5000;
      this.chimeTimer = setTimeout(() => {
        if (this.active) { this._chime(); this._scheduleChime(); }
      }, delay);
    }

    _chime(freq) {
      if (!this.ctx) return;
      const freqs = [622.25, 739.99, 880.00, 1046.50, 1174.66];
      const f = freq || freqs[Math.floor(Math.random() * freqs.length)];

      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.055, this.ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.2);

      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(); osc.stop(this.ctx.currentTime + 2.4);
    }

    celebrateWish() {
      this._boot(); this._resume();
      const arp = [311.13, 370.00, 466.16, 622.25, 739.99, 932.33, 1244.51];
      arp.forEach((f, i) => setTimeout(() => this._chime(f), i * 85));
    }
  }

  const synth = new AmbientEngine();

  /* ═══════════════════════════════════════════════════════════════════════
     5. AMBIENT CHIME TOGGLE
  ═══════════════════════════════════════════════════════════════════════ */
  if (chimeToggle) {
    chimeToggle.addEventListener('click', () => {
      const active = chimeToggle.getAttribute('aria-pressed') === 'true';
      if (active) {
        synth.stop();
        chimeToggle.setAttribute('aria-pressed', 'false');
        chimeToggle.classList.remove('is-active');
      } else {
        synth.start();
        chimeToggle.setAttribute('aria-pressed', 'true');
        chimeToggle.classList.add('is-active');
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     6. CHAPTER NAVIGATION
  ═══════════════════════════════════════════════════════════════════════ */
  function switchChapter(newId) {
    chapters.forEach(ch => {
      const isTarget = ch.getAttribute('data-chapter') === newId;
      if (!isTarget) {
        ch.classList.add('is-hidden');
        ch.classList.remove('is-entering');
      } else {
        ch.classList.remove('is-hidden');
        void ch.offsetWidth; // reflow to restart animation
        ch.classList.add('is-entering');
      }
    });

    tabs.forEach(tab => {
      const isTarget = tab.getAttribute('data-chapter') === newId;
      tab.classList.toggle('is-active', isTarget);
      tab.setAttribute('aria-selected', String(isTarget));
    });

    // Chime on tab switch
    synth._boot();
    const chimeMap = { genesis: 622.25, grace: 739.99, journey: 880, blessing: 1046.5 };
    if (synth.ctx) synth._chime(chimeMap[newId]);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchChapter(tab.getAttribute('data-chapter'));
    });
  });

  /* ═══════════════════════════════════════════════════════════════════════
     7. WISH MODAL
  ═══════════════════════════════════════════════════════════════════════ */
  function openWish() {
    wishModal.classList.add('is-open');
    wishModal.setAttribute('aria-hidden', 'false');
    synth.celebrateWish();
    triggerWishParticles();
  }

  function closeWish() {
    wishModal.classList.remove('is-open');
    wishModal.setAttribute('aria-hidden', 'true');
  }

  [wishBtn].forEach(el => {
    if (!el) return;
    el.addEventListener('click', openWish);
    el.addEventListener('touchend', e => { e.preventDefault(); openWish(); }, { passive: false });
  });

  [wishClose, wishDismiss, wishBackdrop].forEach(el => {
    if (!el) return;
    el.addEventListener('click', closeWish);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeWish();
  });

  /* ═══════════════════════════════════════════════════════════════════════
     8. THREE.JS — BACKGROUND PARTICLE FIELD
  ═══════════════════════════════════════════════════════════════════════ */
  let bgScene, bgCamera, bgRenderer, starsPoints, starsMat;
  let wishBursts = [];

  function initBackground() {
    bgScene  = new THREE.Scene();
    bgCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    bgCamera.position.set(0, 0, 40);

    bgRenderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    bgRenderer.setSize(window.innerWidth, window.innerHeight);
    bgRenderer.setClearColor(0x07030d, 1);
    bgCanvas.appendChild(bgRenderer.domElement);

    // Stars
    const count = isMobile() ? 600 : 1400;
    const geo   = new THREE.BufferGeometry();
    const pos   = new Float32Array(count * 3);
    const col   = new Float32Array(count * 3);

    const pal = [
      new THREE.Color(0xf8f3ff),
      new THREE.Color(0xe2d0f5),
      new THREE.Color(0xc8a7e8),
      new THREE.Color(0x9b72cc),
      new THREE.Color(0xb9a8c8)
    ];

    for (let i = 0; i < count; i++) {
      const r    = 18 + Math.random() * 55;
      const th   = Math.random() * Math.PI * 2;
      const phi  = Math.acos(2 * Math.random() - 1);

      pos[i*3]   = r * Math.sin(phi) * Math.cos(th);
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(th);
      pos[i*3+2] = r * Math.cos(phi);

      const c = pal[Math.floor(Math.random() * pal.length)];
      col[i*3]   = c.r;
      col[i*3+1] = c.g;
      col[i*3+2] = c.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

    starsMat = new THREE.PointsMaterial({
      size:         isMobile() ? 0.28 : 0.34,
      map:          makeGlowSprite(),
      transparent:  true,
      opacity:      0.88,
      vertexColors: true,
      blending:     THREE.AdditiveBlending,
      depthWrite:   false
    });

    starsPoints = new THREE.Points(geo, starsMat);
    bgScene.add(starsPoints);

    // Subtle nebula glow
    const ambL = new THREE.AmbientLight(0x35105c, 0.6);
    bgScene.add(ambL);
  }

  function makeGlowSprite() {
    const size = 64;
    const cv   = document.createElement('canvas');
    cv.width   = size; cv.height = size;
    const ctx  = cv.getContext('2d');
    const g    = ctx.createRadialGradient(32,32,0, 32,32,32);
    g.addColorStop(0,    'rgba(255,255,255,1)');
    g.addColorStop(0.22, 'rgba(226,208,245,0.85)');
    g.addColorStop(0.5,  'rgba(155,114,204,0.35)');
    g.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,size,size);
    return new THREE.CanvasTexture(cv);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     9. THREE.JS — DECORATIVE 3D GLASS CARD FRAME
     (Frame only — NO text drawn here; text lives in HTML)
  ═══════════════════════════════════════════════════════════════════════ */
  let cardScene, cardCamera, cardRenderer, cardGroup, cardClock;
  let rotTarget = { y: 0, x: 0 };
  let rotCurrent = { y: 0, x: 0 };
  let rotVel     = { y: 0, x: 0 };
  let dragging   = false;
  let prevPtr    = { x: 0, y: 0 };
  let hasInteracted = false;
  let mouseNorm  = { x: 0, y: 0 };

  function initCard() {
    const wrap  = cardCanvas;
    const W     = wrap.offsetWidth;
    const H     = wrap.offsetHeight;

    cardScene  = new THREE.Scene();
    cardClock  = new THREE.Clock();

    cardCamera = new THREE.PerspectiveCamera(38, W / H, 0.1, 60);
    cardCamera.position.set(0, 0, 8.5);

    cardRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    cardRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    cardRenderer.setSize(W, H);
    cardRenderer.setClearColor(0x000000, 0);
    wrap.appendChild(cardRenderer.domElement);

    // Card group — glass frame
    cardGroup = new THREE.Group();
    cardScene.add(cardGroup);

    buildGlassCard();
    setupCardLights();
    bindCardPointer();
  }

  function buildGlassCard() {
    // Outer glass border frame — four thin edge panels
    const W = 3.0, H = 4.2, D = 0.12, T = 0.06;

    const edgeMat = new THREE.MeshStandardMaterial({
      color:             PALETTE.violet,
      roughness:         0.12,
      metalness:         0.65,
      emissive:          new THREE.Color(PALETTE.purple),
      emissiveIntensity: 0.25,
      transparent:       true,
      opacity:           0.85
    });

    // Top edge
    addEdge(0,  H/2,  0, W,   T, D, edgeMat);
    // Bottom edge
    addEdge(0, -H/2,  0, W,   T, D, edgeMat);
    // Left edge
    addEdge(-W/2, 0,  0, T, H+T, D, edgeMat);
    // Right edge
    addEdge( W/2, 0,  0, T, H+T, D, edgeMat);

    // Inner glass fill — frosted, very transparent
    const glassMat = new THREE.MeshStandardMaterial({
      color:            PALETTE.surface,
      roughness:        0.05,
      metalness:        0.08,
      transparent:      true,
      opacity:          0.18,
      side:             THREE.FrontSide
    });

    const glassGeo = new THREE.BoxGeometry(W - T, H - T, 0.02);
    const glass    = new THREE.Mesh(glassGeo, glassMat);
    glass.position.z = -D * 0.5;
    cardGroup.add(glass);

    // Rim glow line — very thin emissive strip on each edge
    addRimLine(0,  H/2, 0, W, T * 0.15, 0.002);
    addRimLine(0, -H/2, 0, W, T * 0.15, 0.002);
  }

  function addEdge(x, y, z, w, h, d, mat) {
    const geo  = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    cardGroup.add(mesh);
  }

  function addRimLine(x, y, z, w, h, d) {
    const rimMat = new THREE.MeshBasicMaterial({
      color:        PALETTE.lavender,
      transparent:  true,
      opacity:      0.55
    });
    const geo  = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, rimMat);
    mesh.position.set(x, y, z);
    cardGroup.add(mesh);
  }

  function setupCardLights() {
    const keyL = new THREE.PointLight(PALETTE.lavender, 2.2, 20);
    keyL.position.set(4, 5, 6);
    cardScene.add(keyL);

    const fillL = new THREE.PointLight(PALETTE.purple, 1.6, 18);
    fillL.position.set(-5, -3, 5);
    cardScene.add(fillL);

    const rimL = new THREE.PointLight(PALETTE.lilac, 2.0, 15);
    rimL.position.set(0, 4, -6);
    cardScene.add(rimL);

    cardScene.add(new THREE.AmbientLight(PALETTE.violet, 0.8));
  }

  /* ═══════════════════════════════════════════════════════════════════════
     10. CARD POINTER / TOUCH DRAG CONTROLS
  ═══════════════════════════════════════════════════════════════════════ */
  function bindCardPointer() {
    const el = cardCanvas;

    el.addEventListener('mousedown',  e => onDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onUp);

    el.addEventListener('touchstart', e => {
      if (e.touches.length === 1) onDown(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchmove', e => {
      if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchend', onUp, { passive: true });

    // Mouse parallax (desktop only)
    window.addEventListener('mousemove', e => {
      mouseNorm.x = (e.clientX / window.innerWidth)  * 2 - 1;
      mouseNorm.y = (e.clientY / window.innerHeight) * 2 - 1;
    });
  }

  function onDown(x, y) {
    dragging = true;
    prevPtr  = { x, y };
    rotVel   = { y: 0, x: 0 };

    if (!hasInteracted) {
      hasInteracted = true;
      if (dragHint) dragHint.classList.add('is-faded');
    }
  }

  function onMove(x, y) {
    if (!dragging) return;
    const dx = x - prevPtr.x;
    const dy = y - prevPtr.y;
    prevPtr  = { x, y };

    const sense = isMobile() ? 0.005 : 0.007;
    rotTarget.y  += dx * sense;
    rotTarget.x  += dy * sense * 0.45;
    rotTarget.x   = Math.max(-0.35, Math.min(0.35, rotTarget.x));
    rotVel.y      = dx * sense;
    rotVel.x      = dy * sense * 0.45;
  }

  function onUp() {
    dragging = false;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     11. WISH PARTICLE BURST (background layer)
  ═══════════════════════════════════════════════════════════════════════ */
  function triggerWishParticles() {
    if (!bgScene || prefersLess) return;
    const count = isMobile() ? 80 : 160;
    const geo   = new THREE.BufferGeometry();
    const pos   = new Float32Array(count * 3);
    const col   = new Float32Array(count * 3);
    const vels  = [];
    const pal   = [
      new THREE.Color(PALETTE.warmWhite),
      new THREE.Color(PALETTE.lilac),
      new THREE.Color(PALETTE.lavender)
    ];

    for (let i = 0; i < count; i++) {
      pos[i*3] = (Math.random()-0.5)*4;
      pos[i*3+1] = (Math.random()-0.5)*6;
      pos[i*3+2] = (Math.random()-0.5)*2;

      const th  = Math.random()*Math.PI*2;
      const phi = Math.acos(Math.random()*2-1);
      const spd = 5 + Math.random()*9;
      vels.push({ x: spd*Math.sin(phi)*Math.cos(th),
                  y: spd*Math.sin(phi)*Math.sin(th),
                  z: spd*Math.cos(phi),
                  drag: 0.93+Math.random()*0.04 });

      const c = pal[Math.floor(Math.random()*pal.length)];
      col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col,3));

    const mat  = new THREE.PointsMaterial({
      size:0.5, map:makeGlowSprite(), transparent:true, opacity:1,
      vertexColors:true, blending:THREE.AdditiveBlending, depthWrite:false
    });

    const pts = new THREE.Points(geo, mat);
    bgScene.add(pts);
    wishBursts.push({ mesh:pts, vels, life:1, decay:0.014 });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     12. RESIZE HANDLER
  ═══════════════════════════════════════════════════════════════════════ */
  function onResize() {
    if (bgCamera && bgRenderer) {
      bgCamera.aspect = window.innerWidth / window.innerHeight;
      bgCamera.updateProjectionMatrix();
      bgRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    if (cardCamera && cardRenderer && cardCanvas) {
      const W = cardCanvas.offsetWidth;
      const H = cardCanvas.offsetHeight;
      if (W > 0 && H > 0) {
        cardCamera.aspect = W / H;
        cardCamera.updateProjectionMatrix();
        cardRenderer.setSize(W, H);
      }
    }
  }

  window.addEventListener('resize', onResize);

  /* ═══════════════════════════════════════════════════════════════════════
     13. ANIMATION LOOP
  ═══════════════════════════════════════════════════════════════════════ */
  function animate() {
    requestAnimationFrame(animate);

    const t   = Date.now() * 0.001;
    const dt  = cardClock ? cardClock.getDelta() : 0.016;

    // ── Background ──
    if (bgScene && bgRenderer && bgCamera) {
      if (starsPoints && !prefersLess) {
        starsPoints.rotation.y = t * 0.012;
        starsPoints.rotation.x = Math.sin(t * 0.008) * 0.04;
      }

      // Wish burst particles
      for (let i = wishBursts.length - 1; i >= 0; i--) {
        const b   = wishBursts[i];
        const arr = b.mesh.geometry.attributes.position.array;

        for (let j = 0; j < b.vels.length; j++) {
          const v = b.vels[j];
          arr[j*3]   += v.x * dt;
          arr[j*3+1] += v.y * dt;
          arr[j*3+2] += v.z * dt;
          v.x *= v.drag; v.y *= v.drag; v.z *= v.drag;
        }

        b.mesh.geometry.attributes.position.needsUpdate = true;
        b.life -= b.decay;
        b.mesh.material.opacity = Math.max(0, b.life);

        if (b.life <= 0) {
          bgScene.remove(b.mesh);
          b.mesh.geometry.dispose();
          b.mesh.material.dispose();
          wishBursts.splice(i, 1);
        }
      }

      bgRenderer.render(bgScene, bgCamera);
    }

    // ── 3D Card Frame ──
    if (cardScene && cardRenderer && cardCamera && cardGroup) {
      if (!prefersLess) {
        // Inertia
        if (!dragging) {
          rotTarget.y += rotVel.y;
          rotTarget.x += rotVel.x;
          rotVel.y    *= 0.92;
          rotVel.x    *= 0.92;
        }

        // Smooth lerp
        const lerpF = 0.065;
        rotCurrent.y += (rotTarget.y - rotCurrent.y) * lerpF;
        rotCurrent.x += (rotTarget.x - rotCurrent.x) * lerpF;

        cardGroup.rotation.y = rotCurrent.y;
        cardGroup.rotation.x = rotCurrent.x;

        // Floating bob
        cardGroup.position.y = Math.sin(t * 1.4) * 0.06;
        cardGroup.rotation.z = Math.sin(t * 0.75) * 0.012;

        // Subtle mouse parallax
        if (!dragging) {
          cardCamera.position.x += (mouseNorm.x * 0.55 - cardCamera.position.x) * 0.05;
          cardCamera.position.y += (-mouseNorm.y * 0.3 - cardCamera.position.y + 0) * 0.05;
        }
      }

      cardRenderer.render(cardScene, cardCamera);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     14. SYNC CARD CANVAS SIZE TO CSS CONTAINER
  ═══════════════════════════════════════════════════════════════════════ */
  function syncCardSize() {
    if (!cardCanvas) return;
    const panel = document.getElementById('keepsake-panel');
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    cardCanvas.style.height = rect.height + 'px';
  }

  /* ═══════════════════════════════════════════════════════════════════════
     15. BOOT SEQUENCE
  ═══════════════════════════════════════════════════════════════════════ */
  function boot() {
    initBackground();

    // Wait one frame for the HTML text panel to render its natural height,
    // THEN initialize the 3D card frame canvas to match.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        syncCardSize();
        initCard();
        animate();

        // Fade out loading veil
        setTimeout(() => {
          if (loadingVeil) loadingVeil.classList.add('is-gone');
        }, 400);
      });
    });

    // Re-sync on resize (panel height can change on mobile keyboard open, orientation change)
    window.addEventListener('resize', () => {
      requestAnimationFrame(() => { syncCardSize(); onResize(); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
