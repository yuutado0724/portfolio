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

// ===== 画像スライダー =====
document.querySelectorAll('.work-slider-wrap').forEach(wrap => {
  const slider = wrap.querySelector('.work-slider');
  const imgs = slider.querySelectorAll('.slider-img');
  const dots = wrap.querySelectorAll('.dot');
  const prev = wrap.querySelector('.slider-prev');
  const next = wrap.querySelector('.slider-next');
  let current = 0;

  function goTo(n) {
    current = (n + imgs.length) % imgs.length;
    slider.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
});

// ===== ライトボックス =====
const lightbox     = document.getElementById('lightbox');
const lbImg        = document.getElementById('lightbox-img');
const lbCounter    = document.getElementById('lightbox-counter');
const lbClose      = document.getElementById('lightbox-close');
const lbPrev       = document.getElementById('lightbox-prev');
const lbNext       = document.getElementById('lightbox-next');

let lbImages = [];
let lbIndex  = 0;

function lbOpen(imgs, idx) {
  lbImages = imgs;
  lbShow(idx);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function lbClose_() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function lbShow(idx) {
  lbIndex = (idx + lbImages.length) % lbImages.length;
  lbImg.src = lbImages[lbIndex].src;
  lbImg.alt = lbImages[lbIndex].alt;
  lbCounter.textContent = `${lbIndex + 1} / ${lbImages.length}`;
}

lbClose.addEventListener('click', lbClose_);
lbPrev.addEventListener('click', () => lbShow(lbIndex - 1));
lbNext.addEventListener('click', () => lbShow(lbIndex + 1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lbClose_(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') lbClose_();
  if (e.key === 'ArrowLeft')  lbShow(lbIndex - 1);
  if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
});

// スライダー画像にライトボックスを連携
document.querySelectorAll('.work-slider-wrap').forEach(wrap => {
  const imgs = Array.from(wrap.querySelectorAll('.slider-img'));
  imgs.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => lbOpen(imgs, i));
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
