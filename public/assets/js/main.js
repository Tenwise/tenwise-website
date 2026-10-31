// The website's small behaviours: the theme switch (kept under the same key
// as the guide's), the phone menu, the home page's screenshot tabs, the
// pricing page's monthly/annual switch and the scroll reveal. Every page
// reads fine without it.

document.documentElement.classList.add('js');

const THEME_KEY = 'tenwise-theme';
const PERIOD_KEY = 'tenwise-billing-period';

const stored = (key) => { try { return localStorage.getItem(key); } catch (e) { return null; } };
const store = (key, value) => { try { localStorage.setItem(key, value); } catch (e) { /* storage blocked */ } };

// Theme: dark unless the visitor chose light (the inline script in <head>
// applies a stored choice before the first paint).
for (const button of document.querySelectorAll('[data-theme-toggle]')) {
  button.addEventListener('click', () => {
    const light = document.documentElement.classList.toggle('light');
    store(THEME_KEY, light ? 'light' : 'dark');
  });
}

// Phone menu.
const menuButton = document.querySelector('[data-menu-toggle]');
const mobileNav = document.getElementById('mobile-nav');
if (menuButton && mobileNav) {
  // ☰ opens the menu and becomes ✕ to close it.
  const setOpen = (open) => {
    mobileNav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? '✕' : '☰';
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
  };
  menuButton.addEventListener('click', () => setOpen(!mobileNav.classList.contains('open')));
  for (const link of mobileNav.querySelectorAll('a')) link.addEventListener('click', () => setOpen(false));
}

// Screenshot tabs: each tab names its image and caption in data attributes.
// They advance on their own, with a progress bar on the current tab, and
// pause while the pointer is over the showcase, while the page is hidden, or
// for good when the visitor prefers reduced motion. A click shows that tab
// and starts its time again.
const showcase = document.getElementById('showcase');
const showcaseImage = document.getElementById('showcase-image');
const showcaseTitle = document.getElementById('showcase-title');
const showcaseDesc = document.getElementById('showcase-desc');
const tabs = [...document.querySelectorAll('.showcase-tab')];
const STEP_MS = 6500;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let current = 0;
let elapsed = 0;
let paused = false;

const showTab = (index) => {
  current = index;
  elapsed = 0;
  tabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index));
    tab.querySelector('.tab-progress').style.width = '0%';
  });
  const tab = tabs[index];
  const swap = () => {
    showcaseImage.src = tab.dataset.src;
    showcaseImage.alt = tab.dataset.alt;
    showcaseTitle.textContent = tab.dataset.title;
    showcaseDesc.textContent = tab.dataset.desc;
    showcaseImage.classList.remove('switching');
  };
  if (reducedMotion) { swap(); return; }
  showcaseImage.classList.add('switching');
  setTimeout(swap, 220);
};

if (showcase && tabs.length) {
  // Fetch the other screenshots now, so a switch never waits on the network.
  for (const tab of tabs.slice(1)) { const img = new Image(); img.src = tab.dataset.src; }
  tabs.forEach((tab, i) => tab.addEventListener('click', () => showTab(i)));
  showcase.addEventListener('mouseenter', () => { paused = true; });
  showcase.addEventListener('mouseleave', () => { paused = false; });
  showcase.addEventListener('focusin', () => { paused = true; });
  showcase.addEventListener('focusout', () => { paused = false; });
  if (!reducedMotion) {
    const TICK_MS = 50;
    setInterval(() => {
      if (paused || document.hidden) return;
      elapsed += TICK_MS;
      tabs[current].querySelector('.tab-progress').style.width = `${Math.min(100, (elapsed / STEP_MS) * 100)}%`;
      if (elapsed >= STEP_MS) showTab((current + 1) % tabs.length);
    }, TICK_MS);
  }
}

// AI in your voice: each persona button swaps in its example draft, kept in
// a <template> beside the preview.
const voiceButtons = [...document.querySelectorAll('[data-voice]')];
const voiceTag = document.getElementById('voice-tag-slot');
const voiceText = document.getElementById('voice-text');
for (const button of voiceButtons) {
  button.addEventListener('click', () => {
    for (const other of voiceButtons) other.setAttribute('aria-pressed', String(other === button));
    const example = document.getElementById(`voice-${button.dataset.voice}`).content;
    const swap = () => {
      voiceTag.textContent = example.querySelector('.voice-tag').textContent;
      voiceText.replaceChildren(...example.querySelector('.voice-text').cloneNode(true).childNodes);
      voiceText.classList.remove('switching');
    };
    if (reducedMotion) { swap(); return; }
    voiceText.classList.add('switching');
    setTimeout(swap, 180);
  });
}

// Monthly or annual prices: both are in the page; a class on <html> shows one.
const periodButtons = [...document.querySelectorAll('[data-period]')];
const showPeriod = (period) => {
  document.documentElement.classList.toggle('annual', period === 'annual');
  for (const button of periodButtons) button.setAttribute('aria-pressed', String(button.dataset.period === period));
};
if (periodButtons.length) {
  showPeriod(stored(PERIOD_KEY) === 'monthly' ? 'monthly' : 'annual');
  for (const button of periodButtons) {
    button.addEventListener('click', () => {
      showPeriod(button.dataset.period);
      store(PERIOD_KEY, button.dataset.period);
    });
  }
}

// Reveal sections as they scroll into view.
const revealed = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -8% 0px' });
  for (const element of revealed) observer.observe(element);
} else {
  for (const element of revealed) element.classList.add('is-visible');
}
