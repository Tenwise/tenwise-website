/**
 * Tenwise Website Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScreenshotTabs();
  initMobileMenu();
  initEnterpriseModal();
  initFaqAccordion();
});

/**
 * Dark / Light Theme Management
 */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIconDark = document.getElementById('theme-icon-dark');
  const themeIconLight = document.getElementById('theme-icon-light');

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('tenwise-theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  
  if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
    document.documentElement.classList.add('light');
    updateThemeIcons(true);
  } else {
    document.documentElement.classList.remove('light');
    updateThemeIcons(false);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light');
      localStorage.setItem('tenwise-theme', isLight ? 'light' : 'dark');
      updateThemeIcons(isLight);
    });
  }

  function updateThemeIcons(isLight) {
    if (!themeIconDark || !themeIconLight) return;
    if (isLight) {
      themeIconDark.classList.add('hidden');
      themeIconLight.classList.remove('hidden');
    } else {
      themeIconDark.classList.remove('hidden');
      themeIconLight.classList.add('hidden');
    }

    // Also update logo image sources if needed
    const brandLogos = document.querySelectorAll('.dynamic-brand-logo');
    brandLogos.forEach(logo => {
      if (isLight) {
        logo.src = 'assets/images/brand/tenwise-wordmark-light.svg';
      } else {
        logo.src = 'assets/images/brand/tenwise-wordmark-dark.svg';
      }
    });
  }
}

/**
 * Interactive App Preview Tab Switcher
 */
function initScreenshotTabs() {
  const tabs = document.querySelectorAll('.preview-tab-btn');
  const previewImg = document.getElementById('preview-active-img');
  const previewTitle = document.getElementById('preview-caption-title');
  const previewDesc = document.getElementById('preview-caption-desc');

  const previews = {
    'saved-reader': {
      src: 'assets/images/screenshots/01-saved-reader-dark.png',
      lightSrc: 'assets/images/screenshots/07-saved-reader-light.png',
      alt: 'Tenwise Saved Articles with Notes and Docked Reader with AI Summary',
      title: 'Active Curation with In-Context Notes & On-Device Summaries',
      desc: 'Save any article with a note explaining why it matters. Read with distraction-free typography alongside on-device Gemini Nano summaries.'
    },
    'rows-scanner': {
      src: 'assets/images/screenshots/02-rows-reader-dark.png',
      lightSrc: 'assets/images/screenshots/02-rows-reader-dark.png',
      alt: 'Tenwise Rows View Scanning Hundreds of Headlines',
      title: 'High-Density Scanning with Instant Full-Text Extraction',
      desc: 'Dense two-line rows with day headings allow power readers to review hundreds of articles in minutes. Full text is extracted automatically.'
    },
    'collections-notebook': {
      src: 'assets/images/screenshots/03-collection-dark.png',
      lightSrc: 'assets/images/screenshots/03-collection-dark.png',
      alt: 'Tenwise Collections with Send to NotebookLM and APA Citations',
      title: 'Thematic Collections, Citations & Send to NotebookLM',
      desc: 'File articles into research collections, copy APA 7 reference lists in one click, and export unified research packs directly to Google NotebookLM.'
    },
    'studio-print': {
      src: 'assets/images/screenshots/04-studio-dark.png',
      lightSrc: 'assets/images/screenshots/04-studio-dark.png',
      alt: 'Tenwise Studio Editing a Print-Ready Newsletter Page',
      title: 'Studio: Side-by-Side Newsletter & Editorial Publishing',
      desc: 'Compose newsletters and briefings in Markdown beside real-time previews of newspaper print editions. Export to print-ready A4 PDF or high-res PNG.'
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      if (!previews[target] || !previewImg) return;

      // Update active tab styles
      tabs.forEach(t => {
        t.classList.remove('bg-amber-500/20', 'text-amber-500', 'border-amber-500/50');
        t.classList.add('text-secondary', 'border-transparent');
      });
      tab.classList.add('bg-amber-500/20', 'text-amber-500', 'border-amber-500/50');
      tab.classList.remove('text-secondary', 'border-transparent');

      // Fade switch image
      previewImg.style.opacity = '0.3';
      setTimeout(() => {
        const isLight = document.documentElement.classList.contains('light');
        previewImg.src = isLight && previews[target].lightSrc ? previews[target].lightSrc : previews[target].src;
        previewImg.alt = previews[target].alt;
        if (previewTitle) previewTitle.textContent = previews[target].title;
        if (previewDesc) previewDesc.textContent = previews[target].desc;
        previewImg.style.opacity = '1';
      }, 150);
    });
  });
}

/**
 * Mobile Navigation Menu
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
    });
  }

  const closeMenu = () => {
    if (mobileMenu) mobileMenu.classList.add('hidden');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
}

/**
 * Enterprise Modal & Inquiry Form
 */
function initEnterpriseModal() {
  const modal = document.getElementById('enterprise-modal');
  const openButtons = document.querySelectorAll('.open-enterprise-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const form = document.getElementById('enterprise-form');
  const successState = document.getElementById('form-success-state');

  const openModal = () => {
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };

  openButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.elements['name'].value;
      const email = form.elements['email'].value;
      const organization = form.elements['organization'].value;
      const role = form.elements['role'].value;
      const message = form.elements['message'].value;

      // Construct a clean fallback mailto link
      const mailtoSubject = encodeURIComponent(`Tenwise Enterprise Inquiry: ${organization}`);
      const mailtoBody = encodeURIComponent(
        `Hi Tenwise Team,\n\nI am inquiring about Tenwise for Publishers & Enterprise.\n\n` +
        `Name: ${name}\nEmail: ${email}\nOrganization: ${organization}\nRole: ${role}\n\n` +
        `Message:\n${message}\n`
      );

      // Trigger user's mail client or display success
      if (form && successState) {
        form.classList.add('hidden');
        successState.classList.remove('hidden');
      }

      // Open email link
      window.location.href = `mailto:satish@tenwise.app?subject=${mailtoSubject}&body=${mailtoBody}`;
    });
  }
}

/**
 * FAQ Accordion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');
        // Close others
        document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
        document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));

        if (!isOpen) {
          content.classList.remove('hidden');
          if (icon) icon.classList.add('rotate-180');
        }
      });
    }
  });
}
