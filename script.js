(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const setPageInert = (active, keepNavigation = false) => {
    document.querySelector('main')?.toggleAttribute('inert', active);
    document.querySelector('footer')?.toggleAttribute('inert', active);
    if (!keepNavigation) document.getElementById('navbar')?.toggleAttribute('inert', active);
  };

  const trapTabKey = (event, container) => {
    if (event.key !== 'Tab' || !container) return;
    const focusable = Array.from(container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter((element) => !element.hasAttribute('inert') && element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  /* ---------- Immersive canvas background ---------- */
  const canvas = document.getElementById('ambient-canvas');

  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    const hardwareThreads = navigator.hardwareConcurrency || 4;
    const deviceMemory = navigator.deviceMemory || 4;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const lowPowerDevice = coarsePointer || hardwareThreads <= 4 || deviceMemory <= 4;
    document.documentElement.classList.toggle('low-power-motion', lowPowerDevice);
    const pointer = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.42,
      targetX: window.innerWidth * 0.5,
      targetY: window.innerHeight * 0.42,
      active: false
    };
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = 1;
    let particles = [];
    let frameId = 0;
    let time = 0;
    let lastScroll = window.scrollY;
    let scrollVelocity = 0;
    let running = true;
    let maxPageScroll = 1;
    let connectionStep = lowPowerDevice ? 2 : 1;
    let slowFrameCount = 0;
    let lastFrameTimestamp = 0;

    const particleCount = () => {
      if (window.innerWidth < 600) return 24;
      if (window.innerWidth < 1000) return lowPowerDevice ? 30 : 40;
      return lowPowerDevice ? 40 : 58;
    };

    const makeParticle = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.34,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.8 + 0.65,
      depth: Math.random() * 0.75 + 0.25,
      phase: Math.random() * Math.PI * 2,
      hot: Math.random() > 0.72
    });

    const getPalette = () => {
      const progress = window.scrollY / maxPageScroll;
      if (progress < 0.22) return { primary: '201,255,56', secondary: '97,232,210', tertiary: '128,104,255' };
      if (progress < 0.48) return { primary: '97,232,210', secondary: '128,104,255', tertiary: '201,255,56' };
      if (progress < 0.76) return { primary: '128,104,255', secondary: '97,232,210', tertiary: '201,255,56' };
      return { primary: '201,255,56', secondary: '97,232,210', tertiary: '128,104,255' };
    };

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, lowPowerDevice ? 1 : 1.3);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      maxPageScroll = Math.max(1, document.documentElement.scrollHeight - height);
      const target = particleCount();
      particles = Array.from({ length: target }, (_, index) => particles[index] || makeParticle());
    };

    const drawPointerGlow = (palette) => {
      const radius = width < 700 ? 210 : 360;
      const gradient = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius);
      gradient.addColorStop(0, `rgba(${palette.primary},.13)`);
      gradient.addColorStop(.35, `rgba(${palette.secondary},.055)`);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    const drawRibbon = (lane, palette) => {
      const phase = time * (0.00028 + lane * 0.000035) + lastScroll * 0.0018;
      const baseY = height * (0.18 + lane * 0.21);
      const amplitude = (width < 700 ? 28 : 54) + lane * 8;
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(.22, `rgba(${lane % 2 ? palette.secondary : palette.primary},.08)`);
      gradient.addColorStop(.52, `rgba(${lane % 2 ? palette.primary : palette.tertiary},.24)`);
      gradient.addColorStop(.82, `rgba(${palette.secondary},.07)`);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.beginPath();
      for (let x = -40; x <= width + 40; x += 18) {
        const pointerLift = pointer.active
          ? Math.max(0, 1 - Math.abs(x - pointer.x) / Math.max(240, width * 0.3)) * (pointer.y - height / 2) * 0.08
          : 0;
        const y = baseY
          + Math.sin(x * 0.006 + phase + lane * 1.6) * amplitude
          + Math.cos(x * 0.0027 - phase * 1.25 + lane) * amplitude * 0.58
          + pointerLift;
        if (x === -40) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = gradient;
      ctx.lineWidth = lane === 1 ? 1.5 : 1;
      ctx.shadowColor = `rgba(${palette.primary},.2)`;
      ctx.shadowBlur = lane === 1 && !lowPowerDevice ? 8 : 0;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const drawOrbit = (radius, alpha, speed, offset, color) => {
      const cx = width * 0.5 + (pointer.x - width * 0.5) * 0.12 + Math.sin(time * 0.00018 + offset) * 65;
      const cy = height * 0.48 + (pointer.y - height * 0.5) * 0.1 + Math.cos(time * 0.00014 + offset) * 44;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * speed + offset);
      ctx.scale(1, 0.34 + Math.sin(time * 0.0003 + offset) * 0.035);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0.12, Math.PI * 1.72);
      ctx.strokeStyle = `rgba(${color},${alpha})`;
      ctx.lineWidth = 1;
      ctx.shadowColor = `rgba(${color},.25)`;
      ctx.shadowBlur = lowPowerDevice ? 0 : 4;
      ctx.stroke();

      const dotAngle = time * 0.00042 + offset;
      ctx.beginPath();
      ctx.arc(Math.cos(dotAngle) * radius, Math.sin(dotAngle) * radius, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},.9)`;
      ctx.fill();
      ctx.restore();
    };

    const render = (timestamp) => {
      if (!running) return;
      if (lastFrameTimestamp) {
        const frameTime = timestamp - lastFrameTimestamp;
        slowFrameCount = frameTime > 23 ? slowFrameCount + 1 : Math.max(0, slowFrameCount - 2);
        if (slowFrameCount > 40 && particles.length > 28) {
          particles.length = Math.max(28, Math.floor(particles.length * 0.78));
          connectionStep = 2;
          slowFrameCount = 0;
        }
      }
      lastFrameTimestamp = timestamp;
      time = timestamp;
      ctx.clearRect(0, 0, width, height);

      pointer.x += (pointer.targetX - pointer.x) * 0.075;
      pointer.y += (pointer.targetY - pointer.y) * 0.075;
      const currentScroll = window.scrollY;
      scrollVelocity += (currentScroll - lastScroll) * 0.08;
      scrollVelocity *= 0.88;
      lastScroll = currentScroll;

      const palette = getPalette();
      drawPointerGlow(palette);
      ctx.globalCompositeOperation = 'lighter';
      const ribbonCount = lowPowerDevice ? 2 : 3;
      for (let lane = 0; lane < ribbonCount; lane += 1) drawRibbon(lane, palette);
      ctx.globalCompositeOperation = 'source-over';

      const maxDistance = width < 700 ? 105 : 148;
      const pointerRadius = width < 700 ? 145 : 245;

      particles.forEach((particle) => {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const distance = Math.hypot(dx, dy) || 1;

        if (pointer.active && distance < pointerRadius) {
          const force = (1 - distance / pointerRadius) * 0.018 * particle.depth;
          particle.vx += (-dy / distance) * force + (dx / distance) * force * 0.22;
          particle.vy += (dx / distance) * force + (dy / distance) * force * 0.22;
        }

        particle.vx *= 0.992;
        particle.vy *= 0.992;
        particle.x += particle.vx + Math.sin(timestamp * 0.0004 + particle.phase) * 0.1 * particle.depth;
        particle.y += particle.vy + Math.cos(timestamp * 0.00034 + particle.phase) * 0.08 * particle.depth - scrollVelocity * 0.045 * particle.depth;

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;
      });

      ctx.lineWidth = 0.7;
      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j += connectionStep) {
          const b = particles[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.27 * Math.min(a.depth, b.depth);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${i % 3 === 0 ? palette.secondary : palette.primary},${opacity})`;
            ctx.stroke();
          }
        }
      }

      ctx.globalCompositeOperation = 'lighter';
      particles.forEach((particle) => {
        const pulse = 0.62 + Math.sin(timestamp * 0.0015 + particle.phase) * 0.3;
        const color = particle.hot ? palette.primary : palette.secondary;
        if (particle.hot && !lowPowerDevice) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.r * particle.depth * 3.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color},.1)`;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r * particle.depth, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${pulse})`;
        ctx.fill();
      });
      drawOrbit(Math.min(width, height) * 0.44, 0.18, 0.000035, 0.5, palette.primary);
      drawOrbit(Math.min(width, height) * 0.31, 0.13, -0.00005, 2.2, palette.secondary);
      if (!lowPowerDevice) drawOrbit(Math.min(width, height) * 0.2, 0.1, 0.000065, 4.1, palette.tertiary);
      ctx.globalCompositeOperation = 'source-over';

      frameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('pointermove', (event) => {
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      pointer.active = true;
    }, { passive: true });
    window.addEventListener('pointerleave', () => { pointer.active = false; });
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (!running) cancelAnimationFrame(frameId);
      else {
        lastFrameTimestamp = 0;
        frameId = requestAnimationFrame(render);
      }
    });

    resizeCanvas();
    window.addEventListener('load', resizeCanvas, { once: true });
    frameId = requestAnimationFrame(render);
  }

  /* ---------- Navigation and scroll state ---------- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navList = document.querySelector('.nav-links');
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a'));
  const sections = Array.from(document.querySelectorAll('main > section'));
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.setAttribute('aria-hidden', 'true');
  document.body.prepend(progressBar);

  let scrollTicking = false;

  const updatePageChrome = () => {
    scrollTicking = false;
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
    navbar?.classList.toggle('scrolled', scrollTop > 28);

    let activeSection = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.38) activeSection = section;
    });

    navAnchors.forEach((anchor) => {
      const active = anchor.getAttribute('href') === `#${activeSection?.id}`;
      anchor.classList.toggle('active', active);
      if (active) anchor.setAttribute('aria-current', 'location');
      else anchor.removeAttribute('aria-current');
    });

  };

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(updatePageChrome);
      scrollTicking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updatePageChrome, { passive: true });
  updatePageChrome();

  const setMenu = (open) => {
    navList?.classList.toggle('open', open);
    hamburger?.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    setPageInert(open, true);
    if (open) window.setTimeout(() => navAnchors[0]?.focus(), 30);
  };

  hamburger?.addEventListener('click', () => setMenu(!navList?.classList.contains('open')));
  navAnchors.forEach((anchor) => anchor.addEventListener('click', () => setMenu(false)));

  /* ---------- Type treatment ---------- */
  const typedText = document.getElementById('typed-text');
  const phrases = ['Webデザイナー', 'AIエンジニア'];

  if (typedText) {
    if (reduceMotion) {
      typedText.textContent = phrases.join(' / ');
    } else {
      let phraseIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const type = () => {
        const phrase = Array.from(phrases[phraseIndex]);
        charIndex += deleting ? -1 : 1;
        typedText.textContent = phrase.slice(0, Math.max(0, charIndex)).join('');

        let delay = deleting ? 55 : 95;
        if (!deleting && charIndex >= phrase.length) {
          deleting = true;
          delay = 1600;
        } else if (deleting && charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          delay = 380;
        }
        window.setTimeout(type, delay);
      };
      type();
    }
  }

  /* ---------- Reveal and skill animations ---------- */
  const revealElements = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('visible'));
  }

  const skillsGrid = document.querySelector('.skills-grid');
  if (skillsGrid && 'IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      skillsGrid.querySelectorAll('.skill-fill').forEach((fill) => {
        fill.style.width = `${fill.dataset.width}%`;
      });
      observer.disconnect();
    }, { threshold: 0.25 });
    skillObserver.observe(skillsGrid);
  } else {
    document.querySelectorAll('.skill-fill').forEach((fill) => { fill.style.width = `${fill.dataset.width}%`; });
  }

  if (!reduceMotion && finePointer) {
    document.querySelectorAll('.skill-card, .strength-card, .work-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 3.5;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * -3.5;
        card.style.setProperty('--tilt-x', `${x.toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${y.toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  /* ---------- Accessible image sliders ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-img');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let lightboxSources = [];
  let lightboxAlts = [];
  let lightboxIndex = 0;
  let lightboxTrigger = null;

  [lightboxClose, lightboxPrev, lightboxNext].forEach((button) => { if (button) button.type = 'button'; });

  const showLightboxImage = (index) => {
    if (!lightboxSources.length) return;
    lightboxIndex = (index + lightboxSources.length) % lightboxSources.length;
    lightboxImage.src = lightboxSources[lightboxIndex];
    lightboxImage.alt = lightboxAlts[lightboxIndex] || '';
    lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxSources.length}`;
  };

  const openLightbox = (images, index, trigger) => {
    lightboxSources = images.map((image) => image.getAttribute('src'));
    lightboxAlts = images.map((image) => image.getAttribute('alt') || '');
    lightboxTrigger = trigger;
    showLightboxImage(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    setPageInert(true);
    lightboxClose?.focus();
  };

  const closeLightbox = () => {
    if (!lightbox?.classList.contains('open')) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setPageInert(false);
    lightboxTrigger?.focus();
  };

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => showLightboxImage(lightboxIndex - 1));
  lightboxNext?.addEventListener('click', () => showLightboxImage(lightboxIndex + 1));
  lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });

  document.querySelectorAll('.work-slider-wrap').forEach((wrap, sliderNumber) => {
    const slider = wrap.querySelector('.work-slider');
    const images = Array.from(wrap.querySelectorAll('.slider-img'));
    const dots = Array.from(wrap.querySelectorAll('.dot'));
    const previousButton = wrap.querySelector('.slider-prev');
    const nextButton = wrap.querySelector('.slider-next');
    let current = 0;

    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', `制作物画像スライダー ${sliderNumber + 1}`);
    previousButton.type = 'button';
    nextButton.type = 'button';

    const status = document.createElement('span');
    status.className = 'sr-only';
    status.setAttribute('aria-live', 'polite');
    wrap.appendChild(status);

    const goTo = (index, announce = true) => {
      current = (index + images.length) % images.length;
      slider.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === current);
        dot.setAttribute('aria-current', dotIndex === current ? 'true' : 'false');
        dot.setAttribute('aria-pressed', dotIndex === current ? 'true' : 'false');
      });
      images.forEach((image, imageIndex) => {
        const active = imageIndex === current;
        image.setAttribute('tabindex', active ? '0' : '-1');
        image.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      if (announce) status.textContent = `${images.length}枚中${current + 1}枚目`;
    };

    previousButton.addEventListener('click', () => goTo(current - 1));
    nextButton.addEventListener('click', () => goTo(current + 1));

    dots.forEach((dot, index) => {
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', `${index + 1}枚目を表示`);
      dot.addEventListener('click', () => goTo(index));
      dot.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          goTo(index);
        }
      });
    });

    images.forEach((image, index) => {
      image.setAttribute('role', 'button');
      image.setAttribute('tabindex', '0');
      image.setAttribute('aria-label', `${image.alt}を拡大表示`);
      const open = () => openLightbox(images, index, image);
      image.addEventListener('click', open);
      image.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      });
    });

    goTo(0, false);
  });

  /* ---------- Video dialog ---------- */
  const videoThumb = document.querySelector('.kidsmoney-thumb');
  const videoModal = document.getElementById('video-modal');
  const modalVideo = document.getElementById('kidsmoneyModalVideo');
  const videoClose = document.getElementById('video-modal-close');

  const openVideo = () => {
    videoModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setPageInert(true);
    videoClose.focus();
  };
  const closeVideo = () => {
    if (videoModal.style.display === 'none') return;
    modalVideo.pause();
    videoModal.style.display = 'none';
    document.body.style.overflow = '';
    setPageInert(false);
    videoThumb?.focus();
  };

  if (videoThumb && videoModal && modalVideo) {
    videoThumb.addEventListener('click', openVideo);
    videoThumb.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openVideo();
      }
    });
    videoClose.addEventListener('click', closeVideo);
    videoModal.addEventListener('click', (event) => { if (event.target === videoModal) closeVideo(); });
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contact-form');
  const notice = document.getElementById('form-notice');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = '送信中...';
    notice.textContent = '';

    try {
      const formData = new FormData(form);
      formData.append('_subject', '【ポートフォリオサイト】お問い合わせが届きました');
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('送信に失敗しました');
      notice.textContent = 'メッセージを送信しました。ありがとうございます。';
      notice.style.color = '#c9ff38';
      form.reset();
    } catch (error) {
      notice.textContent = '送信できませんでした。時間をおいて再度お試しください。';
      notice.style.color = '#ff8b78';
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });

  /* ---------- Global keyboard handling ---------- */
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenu(false);
      closeLightbox();
      closeVideo();
    }
    if (videoModal?.style.display === 'flex') {
      trapTabKey(event, videoModal);
    } else if (lightbox?.classList.contains('open')) {
      if (event.key === 'ArrowLeft') showLightboxImage(lightboxIndex - 1);
      if (event.key === 'ArrowRight') showLightboxImage(lightboxIndex + 1);
      trapTabKey(event, lightbox);
    } else if (navList?.classList.contains('open')) {
      trapTabKey(event, navbar);
    }
  });
})();
