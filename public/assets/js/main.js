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
  menuButton.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  for (const link of mobileNav.querySelectorAll('a')) {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  }
}

// Screenshot tabs: each tab names its image and caption in data attributes.
const showcaseImage = document.getElementById('showcase-image');
const showcaseCaption = document.getElementById('showcase-caption');
const tabs = [...document.querySelectorAll('.showcase-tab')];
for (const tab of tabs) {
  tab.addEventListener('click', () => {
    for (const other of tabs) other.setAttribute('aria-selected', String(other === tab));
    showcaseImage.src = tab.dataset.src;
    showcaseImage.alt = tab.dataset.alt;
    const title = document.createElement('strong');
    title.textContent = tab.dataset.title;
    showcaseCaption.replaceChildren(title, ` ${tab.dataset.desc}`);
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
