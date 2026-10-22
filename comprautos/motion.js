/* Comprautos motion: progressive enhancement with native browser APIs. */
(() => {
  'use strict';
  const app = document.querySelector('#app');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let revealObserver;
  let activeTransition;
  let navigating = false;
  let prepared = new WeakSet();
  let scheduled = false;
  const animated = new Set();
  const easing = 'cubic-bezier(.22,1,.36,1)';

  function animate(element, frames, options) {
    if (!element || reducedMotion.matches || !element.animate) return;
    const animation = element.animate(frames, options);
    animated.add(animation);
    animation.finished.catch(() => {}).finally(() => animated.delete(animation));
    return animation;
  }

  function show(element) {
    element.classList.add('is-visible');
    revealObserver?.unobserve(element);
  }

  function preparePage() {
    scheduled = false;
    revealObserver?.disconnect();
    if (reducedMotion.matches) {
      app.querySelectorAll('.motion-reveal').forEach(show);
      return;
    }
    if ('IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) show(entry.target); });
      }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    }
    const targets = app.querySelectorAll('.section-heading, .car-card, .brand-section, .life-card, .seller-banner, .journey-item, .selling-step');
    targets.forEach(element => {
      if (!prepared.has(element)) {
        prepared.add(element);
        const siblings = [...element.parentElement.children];
        const stagger = element.matches('.car-card, .life-card, .journey-item, .selling-step') ? Math.min(siblings.indexOf(element) % 4, 3) * 65 : 0;
        element.style.setProperty('--reveal-delay', `${stagger}ms`);
        element.classList.add('motion-reveal');
      }
      // Re-check every target after DOM updates, including ones still offscreen.
      if (element.getBoundingClientRect().top < window.innerHeight - 20 || !revealObserver) show(element);
      else if (!element.classList.contains('is-visible')) revealObserver.observe(element);
    });
    const hero = app.querySelector('.hero');
    if (hero && !prepared.has(hero)) {
      prepared.add(hero);
      if (!navigating) {
        hero.querySelectorAll('.hero-copy > *').forEach((element, index) => {
          animate(element, [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 620, delay: index * 65, easing, fill: 'backwards' });
        });
        animate(hero.querySelector('.hero-photo'), [{ opacity: 0.5, transform: 'scale(1.035)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 900, easing });
        animate(hero.querySelector('.hero-stamp'), [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 550, delay: 240, easing, fill: 'backwards' });
      }
    }
  }

  function schedulePage() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(preparePage);
  }

  async function navigate(render) {
    activeTransition?.skipTransition();
    navigating = true;
    if (reducedMotion.matches || document.hidden) {
      render();
      preparePage();
      navigating = false;
      return;
    }
    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => { render(); preparePage(); });
      activeTransition = transition;
      try { await transition.finished; } catch { /* A rapid navigation may skip a transition. */ }
      if (activeTransition === transition) { activeTransition = null; navigating = false; }
    } else {
      render();
      preparePage();
      animate(app, [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 320, easing });
      navigating = false;
    }
  }

  window.comprautosMotion = { navigate };
  new MutationObserver(schedulePage).observe(app, { childList: true, subtree: true });
  app.addEventListener('focusin', event => {
    const target = event.target.closest('.motion-reveal');
    if (target) show(target);
  });
  document.addEventListener('click', event => {
    const heart = event.target.closest('[data-fav]');
    if (heart) animate(heart, [{ transform: 'scale(1)' }, { transform: 'scale(1.18)', offset: .4 }, { transform: 'scale(1)' }], { duration: 300, easing });
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      activeTransition?.skipTransition();
      animated.forEach(animation => animation.cancel());
      revealObserver?.disconnect();
      app.querySelectorAll('.motion-reveal').forEach(show);
    } else schedulePage();
  });
  preparePage();
})();
