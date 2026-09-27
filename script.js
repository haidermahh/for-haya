/**
 * ==========================================================================
 * FOR HAYA — ULTRA-PREMIUM ROSE GOLD NOIR & SATIN BLUSH EXPERIENCE
 * Interactive JavaScript Engine:
 *  - Floating Rose Gold Stardust & Velvet Petal Particles
 *  - Slow Graceful Rose Gold Light Burst (Haute Luxury)
 *  - Minimalist Web Audio Harmonic Chime Synthesizer
 *  - Candle "Make a Wish, Even Now" Interactive Revelation
 *  - Floating Rose Quartz Wish Orbs Constellation
 *  - Cinematic Intersection Observer Scroll Reveals
 *  - Subtle 3D Perspective Tilt for Gallery Cards
 *  - Dynamic Timeless Date Formulation
 * ==========================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. HARMONIC AMBIENT CHIMES (WEB AUDIO API SYNTHESIZER)
     ========================================================================== */
  class LuxuryAudioEngine {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.ambientTimer = null;

      // Meditative pentatonic scale in rose-gold / crystal harmonic frequencies (Hz)
      this.frequencies = [
        329.63, // E4 (Warm foundation)
        392.00, // G4
        440.00, // A4
        493.88, // B4
        587.33, // D5 (Rose shimmer)
        659.25, // E5
        783.99, // G5
        880.00, // A5
        987.77  // B5 (Crystalline top)
      ];
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    // Play a crystal/rose-gold bell chime with long warm sustain
    playBell(freq, duration = 2.5, gainLevel = 0.075) {
      this.init();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Soft, organic envelope (instant gentle swell, long exponential decay)
        gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(gainLevel, this.ctx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Fallback gracefully
      }
    }

    // Play a dual-tone celestial chord for wish revelation
    playCelestialChord() {
      this.init();
      const chord = [440.00, 587.33, 659.25, 880.00];
      chord.forEach((freq, idx) => {
        setTimeout(() => {
          this.playBell(freq, 3.4, 0.065);
        }, idx * 160);
      });
    }

    // Gentle ambient wind-chime progression
    toggleAmbient(btn) {
      this.init();
      if (this.isPlaying) {
        this.stopAmbient(btn);
      } else {
        this.startAmbient(btn);
      }
    }

    startAmbient(btn) {
      this.isPlaying = true;
      if (btn) btn.classList.add('is-active');
      const label = document.getElementById('audio-label-text');
      if (label) label.textContent = 'Pause Chimes';
      this.scheduleNextAmbientTone();
    }

    stopAmbient(btn) {
      this.isPlaying = false;
      if (this.ambientTimer) clearTimeout(this.ambientTimer);
      if (btn) btn.classList.remove('is-active');
      const label = document.getElementById('audio-label-text');
      if (label) label.textContent = 'Ambient Chimes';
    }

    scheduleNextAmbientTone() {
      if (!this.isPlaying) return;

      const randomFreq = this.frequencies[Math.floor(Math.random() * this.frequencies.length)];
      this.playBell(randomFreq, 2.8, 0.06);

      // Organic interval between 2.5s and 5.5s
      const delay = Math.random() * 3000 + 2500;
      this.ambientTimer = setTimeout(() => {
        this.scheduleNextAmbientTone();
      }, delay);
    }
  }

  const audioEngine = new LuxuryAudioEngine();

  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      audioEngine.toggleAmbient(audioToggleBtn);
    });
  }

  /* ==========================================================================
     THEME TOGGLE ENGINE (24K GOLD FOIL <-> ROSE GOLD NOIR)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeLabel = document.getElementById('theme-label-text');
  const themeIcon = document.getElementById('theme-icon');

  let currentTheme = localStorage.getItem('haya_theme') || 'gold';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeButtonUI();

  function updateThemeButtonUI() {
    if (currentTheme === 'rose') {
      if (themeLabel) themeLabel.textContent = 'Rose Gold';
      if (themeIcon) themeIcon.textContent = '🌸';
    } else if (currentTheme === 'purple') {
      if (themeLabel) themeLabel.textContent = 'Amethyst';
      if (themeIcon) themeIcon.textContent = '💜';
    } else {
      if (themeLabel) themeLabel.textContent = 'Gold Foil';
      if (themeIcon) themeIcon.textContent = '✦';
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      if (currentTheme === 'gold') currentTheme = 'rose';
      else if (currentTheme === 'rose') currentTheme = 'purple';
      else currentTheme = 'gold';
      document.documentElement.setAttribute('data-theme', currentTheme);
      try {
        localStorage.setItem('haya_theme', currentTheme);
      } catch (e) {}
      updateThemeButtonUI();
      // Soft chime upon theme switch
      const chimeFreq = currentTheme === 'rose' ? 659.25 : currentTheme === 'purple' ? 783.99 : 523.25;
      audioEngine.playBell(chimeFreq, 1.2, 0.05);
    });
  }

  /* ==========================================================================
     2. GOLD DUST CANVAS & CELESTIAL STARDUST BURST
     ========================================================================== */
  const canvas = document.getElementById('gold-dust-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Drifting gold motes
    const dustCount = Math.floor(Math.min(width, 1400) / 16);
    const dustParticles = [];
    const burstParticles = [];

    function getActivePalette() {
      if (currentTheme === 'rose') {
        return [
          'rgba(255, 234, 230, ',
          'rgba(232, 165, 152, ',
          'rgba(247, 214, 208, ',
          'rgba(255, 204, 213, ',
          'rgba(212, 139, 126, '
        ];
      }
      if (currentTheme === 'purple') {
        return [
          'rgba(221, 214, 254, ', // Lavender quartz
          'rgba(192, 132, 252, ', // Amethyst
          'rgba(168, 85, 247, ',  // Deep violet
          'rgba(245, 240, 255, ', // Pale orchid
          'rgba(196, 181, 253, '  // Lilac silk
        ];
      }
      return [
        'rgba(243, 229, 171, ', // Champagne
        'rgba(212, 175, 55, ',  // Pure 24K Gold
        'rgba(201, 169, 106, ', // Muted Antique Gold
        'rgba(255, 244, 208, ', // Ivory Glow
        'rgba(230, 202, 133, '  // Gold Silk
      ];
    }

    class RoseDustMote {
      constructor() {
        this.reset();
      }

      reset() {
        const palette = getActivePalette();
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 1.6 + 0.4;
        this.alpha = Math.random() * 0.5 + 0.15;
        this.speedY = -(Math.random() * 0.22 + 0.08); // Slow gentle upward rise
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.pulseSpeed = Math.random() * 0.015 + 0.005;
        this.pulseDir = Math.random() > 0.5 ? 1 : -1;
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        this.alpha += this.pulseSpeed * this.pulseDir;
        if (this.alpha >= 0.72) {
          this.pulseDir = -1;
        } else if (this.alpha <= 0.12) {
          this.pulseDir = 1;
        }

        // Boundary wrap
        if (this.y < -10) this.y = height + 10;
        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        if (this.radius > 1.1) {
          ctx.shadowBlur = 9;
          ctx.shadowColor = this.color + '0.75)';
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Graceful gold stardust particle for the wish burst
    class RoseStardustBurst {
      constructor(originX, originY) {
        const palette = getActivePalette();
        this.x = originX;
        this.y = originY;
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 3.5 + 1.2;
        this.vx = Math.cos(angle) * velocity;
        this.vy = Math.sin(angle) * velocity - 1.2;
        this.gravity = 0.035;
        this.friction = 0.985;
        this.radius = Math.random() * 2.2 + 0.8;
        this.alpha = 1;
        this.decay = Math.random() * 0.012 + 0.006;
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw() {
        if (this.alpha <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + Math.max(0, this.alpha) + ')';
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color + '0.85)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Populate ambient dust
    for (let i = 0; i < dustCount; i++) {
      dustParticles.push(new RoseDustMote());
    }

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Render ambient dust
      for (let i = 0; i < dustParticles.length; i++) {
        dustParticles[i].update();
        dustParticles[i].draw();
      }

      // Render active burst particles
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const p = burstParticles[i];
        p.update();
        p.draw();
        if (p.alpha <= 0) {
          burstParticles.splice(i, 1);
        }
      }

      requestAnimationFrame(renderCanvas);
    }

    renderCanvas();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Function to trigger the luxurious rose gold light burst
    window.emitLuxuryRoseBurst = function (x, y, count = 80) {
      for (let i = 0; i < count; i++) {
        burstParticles.push(new RoseStardustBurst(x, y));
      }
    };
  }

  /* ==========================================================================
     3. CANDLE "MAKE A WISH, EVEN NOW" INTERACTION
     ========================================================================== */
  const candleArtwork = document.getElementById('candle-artwork');
  const makeWishBtn = document.getElementById('make-wish-btn');
  const wishRevelationBox = document.getElementById('wish-revelation');

  let wishActivated = false;

  function triggerWishCelebration() {
    if (wishActivated) return;
    wishActivated = true;

    // Trigger celestial harmonic sound
    audioEngine.playCelestialChord();

    // Calculate candle flame coordinates for rose gold particle release
    let originX = window.innerWidth / 2;
    let originY = window.innerHeight / 2;

    if (candleArtwork) {
      const rect = candleArtwork.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height * 0.28;
    }

    if (window.emitLuxuryRoseBurst) {
      window.emitLuxuryRoseBurst(originX, originY, 95);
    }

    // Reveal soft quote message with transition
    if (wishRevelationBox) {
      wishRevelationBox.classList.add('is-revealed');
    }

    if (makeWishBtn) {
      makeWishBtn.style.opacity = '0.55';
      makeWishBtn.style.pointerEvents = 'none';
      const text = makeWishBtn.querySelector('.btn-text');
      if (text) text.textContent = 'Wish Received ✨';
    }
  }

  if (makeWishBtn) {
    makeWishBtn.addEventListener('click', triggerWishCelebration);
  }

  if (candleArtwork) {
    candleArtwork.addEventListener('click', triggerWishCelebration);
  }

  /* ==========================================================================
     4. QUIET WISH ORBS CONSTELLATION INTERACTION
     ========================================================================== */
  const orbWrappers = document.querySelectorAll('.wish-orb-wrapper');
  const orbBackdrop = document.getElementById('orb-backdrop');

  function closeAllOrbs() {
    orbWrappers.forEach((w) => w.classList.remove('is-open'));
    if (orbBackdrop) orbBackdrop.classList.remove('is-active');
  }

  orbWrappers.forEach((wrapper) => {
    const orb = wrapper.querySelector('.wish-orb');
    const closeBtn = wrapper.querySelector('.orb-close-btn');

    if (orb) {
      orb.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = wrapper.classList.contains('is-open');

        // Close all other open orbs first
        closeAllOrbs();

        if (!isOpen) {
          wrapper.classList.add('is-open');
          if (orbBackdrop) orbBackdrop.classList.add('is-active');

          // Play gentle bell tone corresponding to orb id
          const id = parseInt(wrapper.getAttribute('data-id') || '1', 10);
          const pitch = audioEngine.frequencies[(id * 2) % audioEngine.frequencies.length];
          audioEngine.playBell(pitch, 2.0, 0.08);

          // Small rose gold stardust shimmer at the orb
          const rect = orb.getBoundingClientRect();
          if (window.emitLuxuryRoseBurst) {
            window.emitLuxuryRoseBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 22);
          }
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllOrbs();
      });
    }

    const messageCard = wrapper.querySelector('.orb-message-card');
    if (messageCard) {
      messageCard.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  });

  // Close opened orb card when clicking outside or on backdrop
  if (orbBackdrop) {
    orbBackdrop.addEventListener('click', closeAllOrbs);
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.wish-orb-wrapper')) {
      closeAllOrbs();
    }
  });

  // Close on Escape key for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllOrbs();
    }
  });

  /* ==========================================================================
     5. CINEMATIC INTERSECTION OBSERVER SCROLL REVEALS
     ========================================================================== */
  const revealItems = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  /* ==========================================================================
     6. SUBTLE 3D PERSPECTIVE TILT (DESKTOP GALLERY CARDS)
     ========================================================================== */
  const galleryCards = document.querySelectorAll('.gallery-card');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    galleryCards.forEach((card) => {
      const frame = card.querySelector('.gallery-frame');
      if (!frame) return;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        frame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        frame.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     7. DYNAMIC BELATED / TIMELESS DATE DISPLAY
     ========================================================================== */
  const dateStringElem = document.getElementById('timeless-date-string');
  if (dateStringElem) {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formatted = today.toLocaleDateString('en-US', options);
    dateStringElem.textContent = `Sent on ${formatted} — though the wish is timeless.`;
  }

  /* ==========================================================================
     8. SMOOTH RETURN TO TOP
     ========================================================================== */
  const returnTopBtn = document.querySelector('.return-top-btn');
  if (returnTopBtn) {
    returnTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     9. GENTLE INITIAL WELCOME STARDUST (SUBTLE)
     ========================================================================== */
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (window.emitLuxuryRoseBurst) {
        window.emitLuxuryRoseBurst(window.innerWidth / 2, window.innerHeight * 0.45, 25);
      }
    }, 900);
  });
})();
