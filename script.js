// ===== ナビゲーション: スクロールで背景を追加 =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== ハンバーガーメニュー =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== タイプアニメーション =====
const phrases = [
  'Webデザイナー志望',
  'Webライター',
  'AIアプリ開発　学習中',
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

  function goTo(n) {
    current = (n + imgEls.length) % imgEls.length;
    slider.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function(d, i) { d.classList.toggle('active', i === current); });
  }

  btnPrev.addEventListener('click', function() { goTo(current - 1); });
  btnNext.addEventListener('click', function() { goTo(current + 1); });
  dots.forEach(function(d, i) { d.addEventListener('click', function() { goTo(i); }); });

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

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = '送信中...';

  setTimeout(() => {
    notice.textContent = 'メッセージを送信しました！ありがとうございます。';
    form.reset();
    btn.disabled = false;
    btn.textContent = '送信する';
    setTimeout(() => { notice.textContent = ''; }, 5000);
  }, 1200);
});
