(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navList = document.querySelector('.nav-links');
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const sections = [...document.querySelectorAll('main > section')];

  const setMenu = (open) => {
    navList?.classList.toggle('open', open);
    hamburger?.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  };
  hamburger?.addEventListener('click', () => setMenu(!navList?.classList.contains('open')));
  navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

  const updateNavigation = () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 28);
    let current = sections[0];
    sections.forEach((section) => { if (section.getBoundingClientRect().top < window.innerHeight * .4) current = section; });
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${current?.id}`;
      link.classList.toggle('active', active);
      link.toggleAttribute('aria-current', active);
    });
  };
  window.addEventListener('scroll', updateNavigation, { passive: true });
  window.addEventListener('resize', updateNavigation, { passive: true });
  updateNavigation();

  const revealItems = document.querySelectorAll('.fade-in');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observerRef) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observerRef.unobserve(entry.target); }
    }), { threshold: .1, rootMargin: '0px 0px -5% 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else revealItems.forEach((item) => item.classList.add('visible'));

  const form = document.getElementById('sns-contact-form');
  const notice = document.getElementById('sns-form-notice');
  const supportChoices = [...document.querySelectorAll('input[name="support[]"]')];
  const validateSupportChoices = () => {
    const valid = supportChoices.some((choice) => choice.checked);
    supportChoices[0]?.setCustomValidity(valid ? '' : '希望する支援内容を1つ以上選択してください。');
  };
  supportChoices.forEach((choice) => choice.addEventListener('change', validateSupportChoices));
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    validateSupportChoices();
    if (!form.reportValidity()) return;
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = '送信中...';
    notice.textContent = '';
    try {
      const data = new FormData(form);
      data.append('_subject', '【SNS運用代行】お問い合わせが届きました');
      const response = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Form submission failed');
      form.reset();
      notice.textContent = '送信しました。内容を確認のうえ、ご連絡します。';
      notice.style.color = '#c9ff38';
    } catch {
      notice.textContent = '送信できませんでした。時間をおいて再度お試しください。';
      notice.style.color = '#ff8b78';
    } finally {
      button.disabled = false;
      button.textContent = originalText;
      notice.focus();
    }
  });

  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
})();
