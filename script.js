// ===== ナビゲーション: スクロールで背景を追加 =====
const navbar = document.getElementById('navbar');
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

const ambientGrid = document.createElement('div');
ambientGrid.className = 'ambient-grid';
document.body.prepend(ambientGrid);

const meteorLayer = document.createElement('div');
meteorLayer.className = 'meteor-layer';
document.body.prepend(meteorLayer);

for (let i = 0; i < 48; i++) {
  const meteor = document.createElement('span');
  meteor.className = 'meteor';
  meteor.style.setProperty('--meteor-top', (Math.random() * 118 - 18).toFixed(2) + 'vh');
  meteor.style.setProperty('--meteor-left', (104 + Math.random() * 58).toFixed(2) + 'vw');
  meteor.style.setProperty('--meteor-delay', (Math.random() * 5.6).toFixed(2) + 's');
  meteor.style.setProperty('--meteor-duration', (4.2 + Math.random() * 3.4).toFixed(2) + 's');
  meteor.style.setProperty('--meteor-length', (80 + Math.random() * 150).toFixed(0) + 'px');
  meteor.style.setProperty('--meteor-opacity', (0.18 + Math.random() * 0.32).toFixed(2));
  meteorLayer.appendChild(meteor);
}

function updatePageChrome() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  progressBar.style.setProperty('--scroll-progress', progress + '%');

  let currentSection = null;
  document.querySelectorAll('section').forEach(section => {
    if (section.offsetTop <= window.scrollY + 140) currentSection = section;
  });

  if (currentSection) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentSection.id);
    });
  }
}

// ===== ハンバーガーメニュー =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', updatePageChrome, { passive: true });
window.addEventListener('resize', updatePageChrome);
updatePageChrome();

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== タイプアニメーション =====
const phrases = [
  'Webデザイナー',
  'AIエンジニア',
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedText = document.getElementById('typed-text');

function type() {
  const current = phrases[phraseIndex];
  if (isDeleting) {
    typedText.textContent = current.slice(0, charIndex - 1);
    charIndex--;
  } else {
    typedText.textContent = current.slice(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === current.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    speed = 400;
  }

  setTimeout(type, speed);
}

type();

// ===== Motion accents =====
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  window.addEventListener('pointermove', (e) => {
    document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
    document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
  }, { passive: true });

  document.querySelectorAll('.skill-card, .strength-card, .work-card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
      card.style.setProperty('--tilt-x', x.toFixed(2) + 'deg');
      card.style.setProperty('--tilt-y', y.toFixed(2) + 'deg');
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}

// ===== フェードイン (IntersectionObserver) =====
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // カード類は連続してフェードイン
      const delay = entry.target.closest('.skills-grid, .works-grid')
        ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100
        : 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

fadeEls.forEach(el => observer.observe(el));

// ===== スキルバー アニメーション =====
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        fill.style.width = fill.dataset.width + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillsGrid = document.querySelector('.skills-grid');
if (skillsGrid) skillObserver.observe(skillsGrid);

// ===== 画像スライダー & ライトボックス =====
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lightbox-img');
const lbCounter = document.getElementById('lightbox-counter');
let lbSrcs = [];
let lbIdx  = 0;

function lbShow(idx) {
  lbIdx = (idx + lbSrcs.length) % lbSrcs.length;
  lbImg.src = lbSrcs[lbIdx];
  lbCounter.textContent = (lbIdx + 1) + ' / ' + lbSrcs.length;
}

function lbOpen(srcs, idx) {
  lbSrcs = srcs;
  lbShow(idx);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function lbClose() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('lightbox-close').addEventListener('click', lbClose);
document.getElementById('lightbox-prev').addEventListener('click', () => lbShow(lbIdx - 1));
document.getElementById('lightbox-next').addEventListener('click', () => lbShow(lbIdx + 1));
lightbox.addEventListener('click', function(e) { if (e.target === lightbox) lbClose(); });
document.addEventListener('keydown', function(e) {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      lbClose();
  if (e.key === 'ArrowLeft')   lbShow(lbIdx - 1);
  if (e.key === 'ArrowRight')  lbShow(lbIdx + 1);
});

document.querySelectorAll('.work-slider-wrap').forEach(function(wrap) {
  const slider  = wrap.querySelector('.work-slider');
  const imgEls  = Array.from(wrap.querySelectorAll('.slider-img'));
  const dots    = Array.from(wrap.querySelectorAll('.dot'));
  const btnPrev = wrap.querySelector('.slider-prev');
  const btnNext = wrap.querySelector('.slider-next');
  let current   = 0;
  let isPaused = false;

  function goTo(n) {
    current = (n + imgEls.length) % imgEls.length;
    slider.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function(d, i) { d.classList.toggle('active', i === current); });
  }

  btnPrev.addEventListener('click', function() { goTo(current - 1); });
  btnNext.addEventListener('click', function() { goTo(current + 1); });
  dots.forEach(function(d, i) { d.addEventListener('click', function() { goTo(i); }); });

  if (!reduceMotion && imgEls.length > 1) {
    setInterval(function() {
      if (!isPaused) goTo(current + 1);
    }, 4800);

    wrap.addEventListener('pointerenter', function() { isPaused = true; });
    wrap.addEventListener('pointerleave', function() { isPaused = false; });
    wrap.addEventListener('focusin', function() { isPaused = true; });
    wrap.addEventListener('focusout', function() { isPaused = false; });
  }

  // 各画像クリックでライトボックスを開く
  var srcs = imgEls.map(function(el) { return el.getAttribute('src'); });
  imgEls.forEach(function(img, i) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function() { lbOpen(srcs, i); });
  });
});

// ===== コンタクトフォーム =====
const form = document.getElementById('contact-form');
const notice = document.getElementById('form-notice');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = '送信中...';

  try {
    const formData = new FormData();
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');

    formData.append('_subject', '【ポートフォリオサイト】お問い合わせが届きました');
    formData.append('_replyto', emailInput.value.trim());
    formData.append('お名前', nameInput.value.trim());
    formData.append('メールアドレス', emailInput.value.trim());
    formData.append('お問い合わせ内容', messageInput.value.trim());

    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      notice.textContent = 'メッセージを送信しました！ありがとうございます。';
      notice.style.color = '#4ade80';
      form.reset();
      setTimeout(() => { notice.textContent = ''; }, 5000);
    } else {
      notice.textContent = '送信に失敗しました。時間をおいて再度お試しください。';
      notice.style.color = '#f87171';
    }
  } catch {
    notice.textContent = '送信に失敗しました。時間をおいて再度お試しください。';
    notice.style.color = '#f87171';
  }

  btn.disabled = false;
  btn.textContent = '送信する';
});
