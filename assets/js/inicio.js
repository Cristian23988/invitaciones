// Inicializar AOS y Fancybox
    AOS.init({ once: true, duration: 800, offset: 80 });

    // Cuenta regresiva (27 diciembre 2026, 00:00:00)
    (function() {
      const target = new Date(2026, 11, 27, 0, 0, 0); // Diciembre es el mes 11 (base cero).
      const el = {
        d: document.getElementById('cd-days'),
        h: document.getElementById('cd-hours'),
        m: document.getElementById('cd-minutes'),
        s: document.getElementById('cd-seconds')
      };
      const tick = () => {
        const now = new Date();
        const diff = target.getTime() - now.getTime();
        if (diff <= 0) {
          el.d.textContent = '0'; el.h.textContent = '0';
          el.m.textContent = '0'; el.s.textContent = '0';
          return;
        }
        const d = Math.floor(diff / (1000*60*60*24));
        const h = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
        const m = Math.floor((diff % (1000*60*60)) / (1000*60));
        const s = Math.floor((diff % (1000*60)) / 1000);
        el.d.textContent = d;
        el.h.textContent = h.toString().padStart(2, '0');
        el.m.textContent = m.toString().padStart(2, '0');
        el.s.textContent = s.toString().padStart(2, '0');
      };
      tick();
      setInterval(tick, 1000);
    })();

document.addEventListener("DOMContentLoaded", function () {
  const galleryImages = Array.from(document.querySelectorAll(".gallery-grid img[data-src]"));
  const loadGalleryImage = image => {
    image.src = image.dataset.src;
    image.removeAttribute("data-src");
  };

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        loadGalleryImage(entry.target);
        imageObserver.unobserve(entry.target);
      });
    }, { rootMargin: "200px 0px" });

    galleryImages.forEach(image => imageObserver.observe(image));
  } else {
    galleryImages.forEach(loadGalleryImage);
  }

});

(function initializeWheelPanelScroll() {
  const root = document.documentElement;
  const panelSelector = [
    'body > #home',
    'body > #galeria',
    'body > #cuenta',
    'body > #evento',
    'body > #ubicacion',
    'body > #regalos',
    'body > #rsvp',
    'body > footer'
  ].join(',');
  const interactiveSelector = [
    'nav',
    'button',
    'input',
    'textarea',
    'select',
    'iframe',
    'video',
    'audio',
    '[contenteditable="true"]',
    '[role="dialog"]',
    '.lg-outer',
    '.fancybox__container'
  ].join(',');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let wheelDelta = 0;
  let wheelTimer = 0;
  let animationFrame = 0;
  let isAnimating = false;
  let previousScrollBehavior = '';
  let previousScrollSnapType = '';
  let cooldownUntil = 0;

  if (reducedMotion.matches) return;

  const clearWheelGesture = () => {
    window.clearTimeout(wheelTimer);
    wheelTimer = 0;
    wheelDelta = 0;
  };

  const cancelAnimation = () => {
    if (!isAnimating) return;
    window.cancelAnimationFrame(animationFrame);
    root.style.scrollBehavior = previousScrollBehavior;
    root.style.scrollSnapType = previousScrollSnapType;
    animationFrame = 0;
    isAnimating = false;
    cooldownUntil = performance.now() + 250;
  };

  const canScrollWithin = (target, delta) => {
    for (let element = target; element && element !== document.body; element = element.parentElement) {
      const style = window.getComputedStyle(element);
      const scrollable = (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
        element.scrollHeight > element.clientHeight + 1;

      if (!scrollable) continue;
      if (delta < 0 && element.scrollTop > 1) return true;
      if (delta > 0 && element.scrollTop + element.clientHeight < element.scrollHeight - 1) return true;
    }

    return false;
  };

  const getPanelPositions = () => {
    const inset = Number.parseFloat(window.getComputedStyle(root).scrollPaddingTop) || 0;
    const maxScroll = root.scrollHeight - window.innerHeight;
    const positions = Array.from(document.querySelectorAll(panelSelector))
      .filter(panel => panel.getClientRects().length > 0)
      .map(panel => Math.max(0, Math.min(
        maxScroll,
        panel.getBoundingClientRect().top + window.scrollY - inset
      )))
      .sort((a, b) => a - b);

    return positions.filter((position, index) =>
      index === 0 || position - positions[index - 1] > 24
    );
  };

  const moveToPanel = direction => {
    const current = window.scrollY;
    const positions = getPanelPositions();
    const next = direction > 0
      ? positions.find(position => position > current + 24)
      : positions.filter(position => position < current - 24).pop();

    if (next === undefined) return;

    const start = current;
    const distance = next - start;
    const duration = 1050;
    const startTime = performance.now();
    previousScrollBehavior = root.style.scrollBehavior;
    previousScrollSnapType = root.style.scrollSnapType;
    root.style.scrollBehavior = 'auto';
    root.style.scrollSnapType = 'none';
    isAnimating = true;

    const animate = now => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, start + distance * eased);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
        return;
      }

      window.scrollTo(0, next);
      root.style.scrollBehavior = previousScrollBehavior;
      root.style.scrollSnapType = previousScrollSnapType;
      animationFrame = 0;
      isAnimating = false;
    };

    animationFrame = window.requestAnimationFrame(animate);
  };

  document.addEventListener('wheel', event => {
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
    if (event.ctrlKey || delta === 0) return;

    const target = event.target instanceof Element ? event.target : null;
    if (target && target.closest(interactiveSelector)) {
      clearWheelGesture();
      return;
    }
    if (target && canScrollWithin(target, delta)) {
      clearWheelGesture();
      return;
    }

    if (isAnimating || performance.now() < cooldownUntil) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    wheelDelta += delta;
    window.clearTimeout(wheelTimer);
    wheelTimer = window.setTimeout(() => {
      const direction = Math.sign(wheelDelta);
      clearWheelGesture();
      if (direction !== 0) moveToPanel(direction);
    }, 90);
  }, { passive: false });

  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || !target.closest('a[href^="#"]')) return;

    clearWheelGesture();
    cancelAnimation();
  });
})();
