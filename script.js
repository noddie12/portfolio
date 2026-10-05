/* ═══════════════════════════════════════════════════════
   DO HAI ANH - BEYOND THE REEF
   Editorial Underwater Portfolio  ·  v3.1 script.js
   ═══════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ──────────────────────────────────────────
     1. NAVIGATION & SCROLL TRACKING
  ─────────────────────────────────────────── */
  const navbar     = document.getElementById('navbar');
  const navToggle  = document.getElementById('navToggle');
  const navLinks   = document.getElementById('navLinks');
  const navAnchors = navLinks ? navLinks.querySelectorAll('a') : [];
  const sections   = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // Active link highlighting
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) {
        currentId = sec.id;
      }
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
    });
  }, { passive: true });

  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(navToggle.classList.contains('open')));
    navLinks?.classList.toggle('open');
  });

  navAnchors.forEach(a => {
    a.addEventListener('click', () => {
      navToggle?.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
      navLinks?.classList.remove('open');
    });
  });

  /* ──────────────────────────────────────────
     2. SMOOTH SCROLL FOR INTERNAL LINKS
  ─────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const offset = (navbar?.offsetHeight || 70) + 10;
      const topPos = targetEl.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: topPos, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    });
  });

  /* ──────────────────────────────────────────
     3. SCROLL REVEAL (FADE-UP)
  ─────────────────────────────────────────── */
  const fadeElements = document.querySelectorAll('.fade-up');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  fadeElements.forEach(el => revealObserver.observe(el));

  /* ──────────────────────────────────────────
     3b. DYNAMIC SECTION SCROLL DIVE & DEPTH HUD
  ─────────────────────────────────────────── */
  const sectionDepths = {
    hero:       { depth: '0m',    zone: 'Sunlight Surface' },
    about:      { depth: '35m',   zone: 'Coral Reef' },
    education:  { depth: '90m',   zone: 'Twilight Current' },
    experience: { depth: '180m',  zone: 'Mesopelagic Waters' },
    awards:     { depth: '280m',  zone: 'Golden Crest' },
    research:   { depth: '450m',  zone: 'Deep Ocean Trench' },
    activities: { depth: '620m',  zone: 'Tidal Confluence' },
    gallery:    { depth: '780m',  zone: 'Luminescent Depths' },
    skills:     { depth: '900m',  zone: 'Treasury of Skills' },
    contact:    { depth: '1,000m', zone: 'Abyssal Horizon' },
  };

  const depthNumEl   = document.getElementById('depthNum');
  const depthLabelEl = document.getElementById('depthLabel');
  const depthHudEl   = document.getElementById('oceanDepthHud');

  let currentActiveSectionId = '';

  const sectionDiveObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
        const secId = entry.target.id;
        if (secId && secId !== currentActiveSectionId) {
          currentActiveSectionId = secId;

          // Add active class to animate section headers / elements
          document.querySelectorAll('.section, .hero').forEach(s => s.classList.remove('section--active'));
          entry.target.classList.add('section--active');

          // Trigger dynamic underwater bubble surge on canvas
          spawnSectionBubbles(14);

          // Update floating ocean depth meter
          if (sectionDepths[secId] && depthNumEl && depthLabelEl) {
            depthNumEl.textContent = sectionDepths[secId].depth;
            depthLabelEl.textContent = sectionDepths[secId].zone;
            if (depthHudEl) {
              depthHudEl.classList.add('ping');
              setTimeout(() => depthHudEl.classList.remove('ping'), 650);
            }
          }
        }
      }
    });
  }, { threshold: [0.2, 0.45] });

  document.querySelectorAll('section[id]').forEach(sec => sectionDiveObserver.observe(sec));

  /* ──────────────────────────────────────────
     4. BALANCED METRICS COUNTER ANIMATION
  ─────────────────────────────────────────── */
  const counterElements = document.querySelectorAll('.metric-card__num[data-target]');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        if (!reducedMotion.matches) animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const hasDecimal = el.dataset.decimal !== undefined;
    const duration = 1600;
    const startTime = performance.now();

    function updateNum(now) {
      const elapsed = Math.min((now - startTime) / duration, 1);
      // Cubic ease out
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const current = eased * target;

      el.textContent = hasDecimal
        ? current.toFixed(2)
        : Math.round(current);

      if (elapsed < 1) {
        requestAnimationFrame(updateNum);
      } else {
        el.textContent = hasDecimal ? target.toFixed(2) : target;
      }
    }
    requestAnimationFrame(updateNum);
  }

  /* ──────────────────────────────────────────
     5. IMAGE FALLBACK SYSTEM
     Gracefully handles missing image files
  ─────────────────────────────────────────── */
  // Keep original photo URLs so adding the files restores the photographs.
  const oceanIllustration = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800"><defs><linearGradient id="water" x2=".2" y2="1"><stop stop-color="#c5e8ed"/><stop offset=".45" stop-color="#47859f"/><stop offset="1" stop-color="#102f47"/></linearGradient><linearGradient id="light" x2=".2" y2="1"><stop stop-color="#fff" stop-opacity=".65"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><path fill="url(#water)" d="M0 0h600v800H0z"/><path fill="url(#light)" d="M80 0h60l300 800H190zM280 0h30l250 800H400z"/><g fill="none" stroke="#e6ffff" opacity=".3"><ellipse cx="180" cy="120" rx="280" ry="65"/><ellipse cx="300" cy="130" rx="270" ry="55"/><circle cx="80" cy="480" r="11"/><circle cx="480" cy="320" r="7"/><circle cx="470" cy="600" r="16"/></g><path d="M0 680Q160 570 290 710T600 670V800H0" fill="#102f47" opacity=".5"/></svg>'
  );
  document.querySelectorAll('.fallback-image').forEach(img => {
    const fallback = () => {
      img.closest('.image-frame')?.classList.add('is-fallback');
      img.alt = 'Ocean illustration - photograph unavailable';
      img.src = oceanIllustration;
      const button = img.closest('.gallery__item')?.querySelector('.gallery__btn');
      if (button) button.disabled = true;
    };
    img.addEventListener('error', fallback, { once: true });
    if (img.complete && !img.naturalWidth) fallback();
  });

  /* ──────────────────────────────────────────
     6. REAL BUBBLES SYSTEM (35 BUBBLES)
  ─────────────────────────────────────────── */
  const bubbleCanvas = document.getElementById('bubbleCanvas');
  const bCtx = bubbleCanvas?.getContext('2d');

  function resizeBubbleCanvas() {
    if (!bubbleCanvas) return;
    bubbleCanvas.width  = window.innerWidth;
    bubbleCanvas.height = window.innerHeight;
  }
  resizeBubbleCanvas();
  window.addEventListener('resize', resizeBubbleCanvas, { passive: true });

  const BUBBLE_COUNT = 68;
  const bubbles = [];

  function createBubble(scatterY = false) {
    // 3 distinct atmospheric oceanic layers:
    // Layer 1: Small deep ambient bubbles (40%) - soft, serene, full-width drift
    // Layer 2: Medium luminous bubbles (40%) - buoyant, translucent
    // Layer 3: Large pearlescent accent bubbles (20%) - elegant, gentle specular glow
    const rand = Math.random();
    let r, layer, opacity, speedY, x;

    if (rand < 0.40) {
      // Layer 1: Small (2.5 - 5.5px)
      layer = 1;
      r = Math.random() * 3 + 2.5;
      opacity = Math.random() * 0.14 + 0.18;
      speedY = Math.random() * 0.18 + 0.14;
      x = Math.random() * window.innerWidth;
    } else if (rand < 0.80) {
      // Layer 2: Medium (6 - 11px)
      layer = 2;
      r = Math.random() * 5 + 6;
      opacity = Math.random() * 0.16 + 0.24;
      speedY = Math.random() * 0.22 + 0.22;
      x = Math.random() * window.innerWidth;
    } else {
      // Layer 3: Large (12 - 18px)
      layer = 3;
      r = Math.random() * 6 + 12;
      opacity = Math.random() * 0.16 + 0.28;
      speedY = Math.random() * 0.24 + 0.28;
      // Gentle side preference for large bubbles to keep center reading zones clear
      x = Math.random() < 0.60
        ? (Math.random() < 0.5 ? Math.random() * (window.innerWidth * 0.26) : window.innerWidth - Math.random() * (window.innerWidth * 0.26))
        : Math.random() * window.innerWidth;
    }

    return {
      x,
      y:           scatterY ? Math.random() * window.innerHeight : window.innerHeight + r + 15,
      r,
      layer,
      opacity,
      speedY,
      wobbleAmp:   (Math.random() - 0.5) * 0.38,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.014 + 0.005,
    };
  }

  for (let i = 0; i < BUBBLE_COUNT; i++) {
    bubbles.push(createBubble(true));
  }

  function renderBubble(b) {
    bCtx.save();
    bCtx.globalAlpha = b.opacity;

    // Luminous oceanic rim glow
    bCtx.shadowBlur = b.r > 10 ? 8 : 4;
    bCtx.shadowColor = 'rgba(210, 245, 255, 0.45)';

    // Outer luminous ring
    bCtx.beginPath();
    bCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    bCtx.strokeStyle = 'rgba(235, 250, 255, 0.85)';
    bCtx.lineWidth = b.r > 10 ? 1.4 : 0.9;
    bCtx.stroke();

    // Subtle transparent center with radial gradient reflection
    const grad = bCtx.createRadialGradient(
      b.x - b.r * 0.32, b.y - b.r * 0.32, b.r * 0.08,
      b.x, b.y, b.r
    );
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.72)');
    grad.addColorStop(0.35, 'rgba(215, 245, 255, 0.18)');
    grad.addColorStop(0.85, 'rgba(175, 225, 242, 0.08)');
    grad.addColorStop(1, 'rgba(140, 207, 232, 0.02)');
    bCtx.fillStyle = grad;
    bCtx.beginPath();
    bCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    bCtx.fill();

    // Reset shadow for crisp specular highlights
    bCtx.shadowBlur = 0;

    // Primary specular highlight dot
    bCtx.beginPath();
    bCtx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, Math.max(1, b.r * 0.22), 0, Math.PI * 2);
    bCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    bCtx.fill();

    // Secondary subtle bottom reflection for 3D depth
    if (b.r > 7) {
      bCtx.beginPath();
      bCtx.arc(b.x + b.r * 0.28, b.y + b.r * 0.28, Math.max(0.6, b.r * 0.12), 0, Math.PI * 2);
      bCtx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      bCtx.fill();
    }

    bCtx.restore();
  }

  let scrollBoost = 0;
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    const diff = Math.abs(currentY - lastScrollY);
    scrollBoost = Math.min(diff * 0.035, 1.4);
    lastScrollY = currentY;
  }, { passive: true });

  function spawnSectionBubbles(count = 14) {
    if (reducedMotion.matches) return;
    for (let i = 0; i < count; i++) {
      const b = createBubble(false);
      b.speedY = Math.random() * 0.45 + 0.32;
      b.y = window.innerHeight + Math.random() * 50;
      b.opacity = Math.min(b.opacity * 1.35, 0.65);
      bubbles.push(b);
    }
    if (bubbles.length > 95) {
      bubbles.splice(0, bubbles.length - 80);
    }
  }

  let lastTs = 0;
  function animateBubbles(ts) {
    if (!bCtx) return;
    const delta = Math.min(ts - lastTs, 32);
    lastTs = ts;

    scrollBoost *= 0.94; // Smooth fluid decay

    bCtx.clearRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);

    for (let i = 0; i < bubbles.length; i++) {
      const b = bubbles[i];
      b.wobblePhase += b.wobbleSpeed;
      b.x += Math.sin(b.wobblePhase) * b.wobbleAmp * (delta / 16);
      b.y -= (b.speedY + scrollBoost) * (delta / 16);

      // Recycle at top
      if (b.y < -b.r * 2) {
        bubbles[i] = createBubble(false);
      } else {
        renderBubble(b);
      }
    }
    if (!reducedMotion.matches) requestAnimationFrame(animateBubbles);
  }
  if (!reducedMotion.matches) requestAnimationFrame(animateBubbles);

  /* ──────────────────────────────────────────
     7. FLOATING SUSPENDED PARTICLES
  ─────────────────────────────────────────── */
  const particleCanvas = document.getElementById('particleCanvas');
  const pCtx = particleCanvas?.getContext('2d');

  function resizeParticleCanvas() {
    if (!particleCanvas) return;
    particleCanvas.width  = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }
  resizeParticleCanvas();
  window.addEventListener('resize', resizeParticleCanvas, { passive: true });

  const PARTICLE_COUNT = 50;
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x:       Math.random() * window.innerWidth,
      y:       Math.random() * window.innerHeight,
      r:       Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.20 + 0.10,
      vx:      (Math.random() - 0.5) * 0.15,
      vy:      (Math.random() - 0.5) * 0.12,
    });
  }

  function animateParticles() {
    if (!pCtx) return;
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -5) p.x = particleCanvas.width + 5;
      if (p.x > particleCanvas.width + 5) p.x = -5;
      if (p.y < -5) p.y = particleCanvas.height + 5;
      if (p.y > particleCanvas.height + 5) p.y = -5;

      pCtx.save();
      pCtx.globalAlpha = p.opacity;
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pCtx.fillStyle = 'rgba(215, 238, 245, 0.85)';
      pCtx.fill();
      pCtx.restore();
    }
    if (!reducedMotion.matches) requestAnimationFrame(animateParticles);
  }
  if (!reducedMotion.matches) requestAnimationFrame(animateParticles);

  /* ──────────────────────────────────────────
     8. GALLERY LIGHTBOX
  ─────────────────────────────────────────── */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src || '';
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (lightboxImg) lightboxImg.src = '';
    }, 300);
  }

  document.querySelectorAll('.gallery__btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const item = btn.closest('.gallery__item');
      openLightbox(btn.dataset.src, item?.dataset.caption);
    });
  });

  document.querySelectorAll('.gallery__item').forEach(item => {
    item.addEventListener('click', () => {
      item.querySelector('.gallery__btn')?.click();
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox?.classList.contains('open')) {
      closeLightbox();
    }
  });

  /* ──────────────────────────────────────────
     9. AMBIENT SOUND SYSTEM - REAL PLAYBACK & FADE
  ─────────────────────────────────────────── */
  const ambientAudio = document.getElementById('ambientAudio');
  const audioToggle  = document.getElementById('audioToggle');
  const audioLabel   = document.getElementById('audioToggleLabel');

  let isAudioPlaying = false;
  let fadeFrameId    = null;
  const TARGET_VOL   = 0.38;   // 38% rich, clearly audible ambient ocean sound
  const FADE_DUR_MS  = 2000;   // 2 second smooth fade

  function cancelFade() {
    if (fadeFrameId) {
      cancelAnimationFrame(fadeFrameId);
      fadeFrameId = null;
    }
  }

  function fadeVolume(startVol, endVol, duration, onComplete) {
    cancelFade();
    const startTime = performance.now();
    ambientAudio.volume = startVol;

    function step(now) {
      const elapsed = Math.min((now - startTime) / duration, 1);
      const current = startVol + (endVol - startVol) * elapsed;
      ambientAudio.volume = Math.max(0, Math.min(TARGET_VOL, current));

      if (elapsed < 1) {
        fadeFrameId = requestAnimationFrame(step);
      } else {
        ambientAudio.volume = endVol;
        fadeFrameId = null;
        if (onComplete) onComplete();
      }
    }
    fadeFrameId = requestAnimationFrame(step);
  }

  if (ambientAudio && audioToggle) {
    // Ensure default state: OFF, looping, muted volume before start
    ambientAudio.loop = true;
    ambientAudio.volume = 0;

    // Handle source error if file cannot be loaded
    const handleSourceError = () => {
      console.warn('Could not load ambient audio from audio/ocean-ambient.mp3.');
      isAudioPlaying = false;
      audioToggle.setAttribute('aria-pressed', 'false');
      audioToggle.classList.add('audio-toggle--unavailable');
      if (audioLabel) audioLabel.textContent = 'Audio unavailable';
      audioToggle.setAttribute('title', 'Audio asset could not be loaded');
    };

    ambientAudio.addEventListener('error', handleSourceError);
    ambientAudio.querySelector('source')?.addEventListener('error', handleSourceError);

    audioToggle.addEventListener('click', () => {
      if (!isAudioPlaying) {
        // Start playback at volume 0, then smoothly fade in to 0.12
        ambientAudio.volume = 0;
        const playPromise = ambientAudio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // ONLY switch to playing UI after playback actually succeeds
              isAudioPlaying = true;
              audioToggle.setAttribute('aria-pressed', 'true');
              audioToggle.setAttribute('aria-label', 'Turn ocean sound off');
              if (audioLabel) audioLabel.textContent = 'Sound';

              fadeVolume(ambientAudio.volume, TARGET_VOL, FADE_DUR_MS);
            })
            .catch(error => {
              // Do NOT fake a playing state if playback fails
              console.error('Audio playback failed or was blocked by browser policy:', error);
              isAudioPlaying = false;
              audioToggle.setAttribute('aria-pressed', 'false');
              audioToggle.setAttribute('aria-label', 'Turn ocean sound on');
            });
        }
      } else {
        // Smoothly fade volume to 0 over 2 seconds, then pause
        isAudioPlaying = false;
        audioToggle.setAttribute('aria-pressed', 'false');
        audioToggle.setAttribute('aria-label', 'Turn ocean sound on');

        fadeVolume(ambientAudio.volume, 0, FADE_DUR_MS, () => {
          ambientAudio.pause();
        });
      }
    });

    // Reset UI if external factors pause playback
    ambientAudio.addEventListener('pause', () => {
      if (isAudioPlaying && ambientAudio.volume === 0) {
        isAudioPlaying = false;
        audioToggle.setAttribute('aria-pressed', 'false');
      }
    });
  }
});