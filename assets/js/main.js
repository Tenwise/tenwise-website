/**
 * Tenwise Website — Motion, Storytelling & Enterprise Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initTheme();
  initLivingShowcase();
  initPublisherExperience();
  initVoicePreview();
  initMobileMenu();
  initEnterpriseModal();
  initFaqAccordion();
});

const SHOWCASE_STORIES = [
  {
    src: 'assets/images/screenshots/01-saved-reader-dark.png',
    lightSrc: 'assets/images/screenshots/01-saved-reader-dark.png',
    alt: 'Tenwise calm docked reader with your saved note, citation, and summary',
    title: 'Read in calm focus. Capture why an article matters.',
    desc: 'Save any story with a personal note in seconds. Your thoughts, formatted citations, and an instant summary sit right above the full article.'
  },
  {
    src: 'assets/images/screenshots/02-rows-reader-dark.png',
    lightSrc: 'assets/images/screenshots/02-rows-reader-dark.png',
    alt: 'Tenwise high-density rows view scanning hundreds of stories',
    title: 'Scan hundreds of sources without the noise.',
    desc: 'Move effortlessly through all your publications, newsletters, and Google News topics in a clean, distraction-free workspace.'
  },
  {
    src: 'assets/images/screenshots/03-collection-dark.png',
    lightSrc: 'assets/images/screenshots/03-collection-dark.png',
    alt: 'Tenwise curated collections ready for research and synthesis',
    title: 'Organize saves into living research collections.',
    desc: 'Turn scattered bookmarks into structured collections complete with ready-to-paste citations and one-click export to NotebookLM.'
  },
  {
    src: 'assets/images/screenshots/04-studio-dark.png',
    lightSrc: 'assets/images/screenshots/04-studio-dark.png',
    alt: 'Tenwise Studio side-by-side newsletter and print edition editor',
    title: 'Publish executive briefings and print editions in Studio.',
    desc: 'Transform any collection into a beautifully typeset Broadsheet, Evening Edition, or Quarterly briefing ready to share as a PDF.'
  }
];

let activeStoryIndex = 0;
let storyProgress = 0;
let isShowcasePaused = false;
let showcaseTimer = null;

/**
 * Scroll Reveal Observer for Smooth Entrance Motion
 */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/**
 * Dark / Light Theme Management
 */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIconDark = document.getElementById('theme-icon-dark');
  const themeIconLight = document.getElementById('theme-icon-light');

  const savedTheme = localStorage.getItem('tenwise-theme');
  const isLightInit = savedTheme === 'light';

  if (isLightInit) {
    document.documentElement.classList.add('light');
    updateThemeUI(true);
  } else {
    document.documentElement.classList.remove('light');
    updateThemeUI(false);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light');
      localStorage.setItem('tenwise-theme', isLight ? 'light' : 'dark');
      updateThemeUI(isLight);
      switchStory(activeStoryIndex, false);
    });
  }

  function updateThemeUI(isLight) {
    if (themeIconDark && themeIconLight) {
      themeIconDark.classList.toggle('hidden', isLight);
      themeIconLight.classList.toggle('hidden', !isLight);
    }
    const brandLogos = document.querySelectorAll('.dynamic-brand-logo');
    brandLogos.forEach(logo => {
      logo.src = isLight
        ? 'assets/images/brand/tenwise-wordmark-light.svg'
        : 'assets/images/brand/tenwise-wordmark-dark.svg';
    });
  }
}

/**
 * Living Auto-Advancing Product Showcase Stage
 */
function initLivingShowcase() {
  const tabs = document.querySelectorAll('.showcase-tab');
  const stageContainer = document.getElementById('showcase-stage-container');

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      activeStoryIndex = idx;
      storyProgress = 0;
      switchStory(activeStoryIndex, true);
    });
  });

  if (stageContainer) {
    stageContainer.addEventListener('mouseenter', () => {
      isShowcasePaused = true;
    });
    stageContainer.addEventListener('mouseleave', () => {
      isShowcasePaused = false;
    });
  }

  // Run smooth progress loop (updates every 50ms -> 5.5 seconds per slide)
  showcaseTimer = setInterval(() => {
    if (isShowcasePaused) return;
    storyProgress += 0.9;
    updateProgressBar(activeStoryIndex, storyProgress);

    if (storyProgress >= 100) {
      storyProgress = 0;
      activeStoryIndex = (activeStoryIndex + 1) % SHOWCASE_STORIES.length;
      switchStory(activeStoryIndex, true);
    }
  }, 50);
}

function updateProgressBar(index, percent) {
  const bars = document.querySelectorAll('.showcase-tab-progress');
  bars.forEach((bar, idx) => {
    bar.style.width = idx === index ? `${Math.min(percent, 100)}%` : '0%';
  });
}

function switchStory(index, animate = true) {
  const story = SHOWCASE_STORIES[index];
  if (!story) return;

  const tabs = document.querySelectorAll('.showcase-tab');
  const img = document.getElementById('showcase-active-img');
  const titleEl = document.getElementById('showcase-caption-title');
  const descEl = document.getElementById('showcase-caption-desc');

  tabs.forEach((t, idx) => {
    t.classList.toggle('active', idx === index);
  });
  updateProgressBar(index, storyProgress);

  const isLight = document.documentElement.classList.contains('light');
  const targetSrc = isLight && story.lightSrc ? story.lightSrc : story.src;

  if (!img) return;

  const apply = () => {
    img.src = targetSrc;
    img.alt = story.alt;
    if (titleEl) titleEl.textContent = story.title;
    if (descEl) descEl.textContent = story.desc;
  };

  if (animate) {
    img.classList.add('stage-image-switching');
    setTimeout(() => {
      apply();
      img.classList.remove('stage-image-switching');
    }, 200);
  } else {
    apply();
  }
}

/**
 * Interactive Enterprise Publisher Showcase (Benchmark, B2B, Media)
 */
function initPublisherExperience() {
  const buttons = document.querySelectorAll('.publisher-tab-btn');
  const titleEl = document.getElementById('pub-story-title');
  const descEl = document.getElementById('pub-story-desc');
  const outcome1El = document.getElementById('pub-outcome-1');
  const outcome2El = document.getElementById('pub-outcome-2');
  const mastheadEl = document.getElementById('broadsheet-masthead');
  const editionEl = document.getElementById('broadsheet-edition');
  const headlineEl = document.getElementById('broadsheet-headline');
  const noteEl = document.getElementById('broadsheet-note');
  const previewCard = document.getElementById('broadsheet-card');

  const data = {
    education: {
      title: 'Education, Literacy & Research Publishers',
      desc: 'Give districts, educators, and researchers an interactive workspace on top of your catalog. Readers explore curated topic collections, highlight key evidence, capture structured notes, and generate accurate citations automatically.',
      outcome1: 'Turn static digital libraries into active research and curriculum workspaces',
      outcome2: 'Editorial AI operates strictly within your approved rubrics and trusted content',
      masthead: 'Benchmark Literacy & Research Review',
      edition: 'CURRICULUM & EVIDENCE DOSSIER · 4 SOURCES CITED',
      headline: 'Evidence-Based Reading Comprehension Across Secondary Classrooms',
      note: 'Instructional Lead Note: Share this curated dossier and reference list at Tuesday’s district workshop.'
    },
    b2b: {
      title: 'B2B Intelligence, Market Benchmarks & Trade Media',
      desc: 'Stop losing corporate seat renewals to unread inbox clutter. Empower enterprise subscribers to compare reports across your archive, synthesize multi-source briefings, and share co-branded PDF digests with leadership.',
      outcome1: 'Prove seat utilization and drive organic expansion across client teams',
      outcome2: 'Every exported executive briefing carries your masthead across the client organization',
      masthead: 'The Benchmark Executive Brief',
      edition: 'Q4 MARKET INTELLIGENCE · SYNTHESIZED FROM 6 REPORTS',
      headline: 'North American Supply Chain & Capital Allocation Outlook: 2026–2027',
      note: 'VP Strategy Note: Key margin benchmarks highlighted—attach to Friday’s board briefing.'
    },
    media: {
      title: 'Specialist Journalism, Policy Desks & Newsletters',
      desc: 'Give your most loyal subscribers a dedicated reading sanctuary where your reporting lives permanently—complete with topic timelines, synthesis in your newsroom’s house voice, and printable weekend editions.',
      outcome1: 'Deepen subscriber retention by becoming their daily research habit',
      outcome2: 'Protect your journalism from uncredited third-party AI scraping',
      masthead: 'The Capitol & Markets Evening Edition',
      edition: 'SUBSCRIBER BRIEFING · 5 ARCHIVE DISPATCHES',
      headline: 'Global Semiconductor Policy & Foundry Capacity: Six-Month Synthesis',
      note: 'Policy Desk Note: Contrasts recent export filings with European manufacturing commitments.'
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.pub;
      const item = data[key];
      if (!item) return;

      buttons.forEach(b => {
        b.classList.remove('bg-amber-500', 'text-[#0b0c0e]', 'border-amber-500');
        b.classList.add('bg-[var(--bg-primary)]', 'text-[var(--text-secondary)]', 'border-[var(--border-subtle)]');
      });
      btn.classList.add('bg-amber-500', 'text-[#0b0c0e]', 'border-amber-500');
      btn.classList.remove('bg-[var(--bg-primary)]', 'text-[var(--text-secondary)]', 'border-[var(--border-subtle)]');

      if (previewCard) {
        previewCard.style.opacity = '0.4';
        previewCard.style.transform = 'translateY(6px)';
      }

      setTimeout(() => {
        if (titleEl) titleEl.textContent = item.title;
        if (descEl) descEl.textContent = item.desc;
        if (outcome1El) outcome1El.textContent = item.outcome1;
        if (outcome2El) outcome2El.textContent = item.outcome2;
        if (mastheadEl) mastheadEl.textContent = item.masthead;
        if (editionEl) editionEl.textContent = item.edition;
        if (headlineEl) headlineEl.textContent = item.headline;
        if (noteEl) noteEl.textContent = item.note;

        if (previewCard) {
          previewCard.style.opacity = '1';
          previewCard.style.transform = '';
        }
      }, 160);
    });
  });
}

/**
 * Interactive "Your Voice" Synthesis Switcher
 */
function initVoicePreview() {
  const buttons = document.querySelectorAll('.voice-pill-btn');
  const quoteEl = document.getElementById('voice-preview-text');
  const tagEl = document.getElementById('voice-preview-tag');

  const voices = {
    executive: {
      tag: 'Executive Brief · Concise & Strategic',
      text: '“Across the five selected articles, the consensus is clear: organizations shifting from passive content feeds to structured research workflows see markedly higher retention of key insights and faster decision cycles.”'
    },
    skeptic: {
      tag: 'Critical Analyst · Probing & Nuanced',
      text: '“While three sources emphasize rapid adoption metrics, only two examine long-term retention. Comparing their underlying data reveals that lasting value depends on active curation rather than volume.”'
    },
    editorial: {
      tag: 'Publisher House Style · Objective & Cited',
      text: '“A synthesis of recent industry benchmarks indicates a decisive shift toward reader-curated briefings, with cited source collections replacing static bookmarking across enterprise teams.”'
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.voice;
      const item = voices[key];
      if (!item) return;

      buttons.forEach(b => {
        b.classList.remove('border-amber-500', 'bg-amber-500/15', 'text-[var(--text-primary)]');
        b.classList.add('border-[var(--border-subtle)]', 'text-[var(--text-secondary)]');
      });
      btn.classList.add('border-amber-500', 'bg-amber-500/15', 'text-[var(--text-primary)]');
      btn.classList.remove('border-[var(--border-subtle)]', 'text-[var(--text-secondary)]');

      if (quoteEl) {
        quoteEl.style.opacity = '0.3';
        setTimeout(() => {
          quoteEl.textContent = item.text;
          if (tagEl) tagEl.textContent = item.tag;
          quoteEl.style.opacity = '1';
        }, 150);
      }
    });
  });
}

/**
 * Mobile Menu
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => mobileMenu.classList.remove('hidden'));
  }
  const closeMenu = () => {
    if (mobileMenu) mobileMenu.classList.add('hidden');
  };
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
}

/**
 * Enterprise Modal
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
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) closeModal();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.elements['name'].value;
      const email = form.elements['email'].value;
      const organization = form.elements['organization'].value;
      const role = form.elements['role'].value;
      const message = form.elements['message'].value;

      const mailtoSubject = encodeURIComponent(`Tenwise Enterprise Partnership — ${organization}`);
      const mailtoBody = encodeURIComponent(
        `Hello Tenwise Team,\n\n` +
        `We are interested in exploring Tenwise for Publishers & Enterprise.\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Organization: ${organization}\n` +
        `Role: ${role}\n\n` +
        `Goals:\n${message}\n`
      );

      if (form && successState) {
        form.classList.add('hidden');
        successState.classList.remove('hidden');
      }
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
