/**
 * Tenwise Website — Interactive Instrument & Publisher Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initWorkspaceStage();
  initPersonaDemo();
  initCitationCopyDemo();
  initPublisherVerticals();
  initMobileMenu();
  initEnterpriseModal();
  initFaqAccordion();
});

const WORKSPACE_VIEWS = [
  {
    key: 'saved-reader',
    num: '1',
    src: 'assets/images/screenshots/01-saved-reader-dark.png',
    lightSrc: 'assets/images/screenshots/07-saved-reader-light.png',
    alt: 'Tenwise Saved Articles with Notes, APA 7 Citation, and On-Device AI Summary',
    title: 'Saved with Your Note, APA 7 Citation & In-Brief AI',
    desc: 'Every saved article keeps your personal note at the top of the reader, generates a ready-to-paste APA 7 citation, and pairs with an on-device Gemini Nano summary.',
    keys: ['b save', 'n note', 'c collect', 'a AI rail']
  },
  {
    key: 'rows-scanner',
    num: '2',
    src: 'assets/images/screenshots/02-rows-reader-dark.png',
    lightSrc: 'assets/images/screenshots/02-rows-reader-dark.png',
    alt: 'Tenwise Dense Rows View with Docked Reader',
    title: 'High-Density Rows + Calm Docked Reader',
    desc: 'Scan hundreds of stories in dense two-line rows grouped by day. Open any row to read the extracted full text in Newsreader serif without leaving your place.',
    keys: ['j / k navigate', '[ sidebar', '] list', 'f focus']
  },
  {
    key: 'collections-notebook',
    num: '3',
    src: 'assets/images/screenshots/03-collection-dark.png',
    lightSrc: 'assets/images/screenshots/03-collection-dark.png',
    alt: 'Tenwise Collections with Send to NotebookLM, Copy Citations, and Studio Draft',
    title: 'Collections Ready for NotebookLM, Citations & Studio',
    desc: 'File saves into thematic collections from your Unsorted queue. Export the entire collection as one cited Markdown source for Google NotebookLM or copy an A–Z reference list.',
    keys: ['c collection', 'Copy citations', 'Send to NotebookLM']
  },
  {
    key: 'studio-print',
    num: '4',
    src: 'assets/images/screenshots/04-studio-dark.png',
    lightSrc: 'assets/images/screenshots/04-studio-dark.png',
    alt: 'Tenwise Studio Editing a Newsletter Beside its Broadsheet Page',
    title: 'Studio: Edit Markdown Beside a Typeset Print Edition',
    desc: 'Turn any collection or multi-article briefing into an editable newsletter. Preview live in Broadsheet, Evening Edition, or Quarterly layouts and export as A4 PDF, PNG, or Word.',
    keys: ['Broadsheet', 'Evening Edition', 'Quarterly', 'PDF / PNG']
  },
  {
    key: 'command-palette',
    num: '5',
    src: 'assets/images/screenshots/05-palette-dark.png',
    lightSrc: 'assets/images/screenshots/05-palette-dark.png',
    alt: 'Tenwise Command Palette Searching Across Articles and Views',
    title: '⌘K Command Palette & Prefix Full-Text Search',
    desc: 'Jump to any folder, collection, or setting, trigger commands, or search across every fetched article with SQLite FTS5 ranking (title › source › AI topics › body).',
    keys: ['⌘K palette', '/ search', '↑ / ↓ move', 'Enter open']
  },
  {
    key: 'grid-view',
    num: '6',
    src: 'assets/images/screenshots/06-grid-dark.png',
    lightSrc: 'assets/images/screenshots/06-grid-dark.png',
    alt: 'Tenwise Visual Grid View of a Folder',
    title: 'Four Distinct Layouts: Rows, Grid, List & Compact',
    desc: 'Switch effortlessly between dense two-line Rows for morning triage, visual Grid cards for feature essays, classic List, or ultra-dense Compact view.',
    keys: ['Rows', 'Grid', 'List', 'Compact']
  }
];

let currentViewIndex = 0;

/**
 * Dark / Light Theme Management
 */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIconDark = document.getElementById('theme-icon-dark');
  const themeIconLight = document.getElementById('theme-icon-light');
  const themeLabel = document.getElementById('theme-toggle-label');

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
      renderWorkspaceView(currentViewIndex, false);
    });
  }

  function updateThemeUI(isLight) {
    if (themeIconDark && themeIconLight) {
      themeIconDark.classList.toggle('hidden', isLight);
      themeIconLight.classList.toggle('hidden', !isLight);
    }
    if (themeLabel) {
      themeLabel.textContent = isLight ? 'Light' : 'Dark';
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
 * 6-View Interactive Workspace Stage + Keyboard Navigation (1-6, j/k)
 */
function initWorkspaceStage() {
  const tabs = document.querySelectorAll('.preview-tab-btn');
  const prevBtn = document.getElementById('stage-prev-btn');
  const nextBtn = document.getElementById('stage-next-btn');

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      currentViewIndex = idx;
      renderWorkspaceView(currentViewIndex, true);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentViewIndex = (currentViewIndex - 1 + WORKSPACE_VIEWS.length) % WORKSPACE_VIEWS.length;
      renderWorkspaceView(currentViewIndex, true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentViewIndex = (currentViewIndex + 1) % WORKSPACE_VIEWS.length;
      renderWorkspaceView(currentViewIndex, true);
    });
  }

  // Support real keyboard shortcuts (1-6 and j/k) when not typing in an input
  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.metaKey || e.ctrlKey || e.altKey) {
      return;
    }
    const modal = document.getElementById('enterprise-modal');
    if (modal && !modal.classList.contains('hidden')) return;

    if (e.key >= '1' && e.key <= '6') {
      currentViewIndex = parseInt(e.key, 10) - 1;
      renderWorkspaceView(currentViewIndex, true);
    } else if (e.key === 'j') {
      currentViewIndex = (currentViewIndex + 1) % WORKSPACE_VIEWS.length;
      renderWorkspaceView(currentViewIndex, true);
    } else if (e.key === 'k') {
      currentViewIndex = (currentViewIndex - 1 + WORKSPACE_VIEWS.length) % WORKSPACE_VIEWS.length;
      renderWorkspaceView(currentViewIndex, true);
    }
  });
}

function renderWorkspaceView(index, animate = true) {
  const view = WORKSPACE_VIEWS[index];
  if (!view) return;

  const tabs = document.querySelectorAll('.preview-tab-btn');
  const previewImg = document.getElementById('preview-active-img');
  const previewTitle = document.getElementById('preview-caption-title');
  const previewDesc = document.getElementById('preview-caption-desc');
  const previewKeys = document.getElementById('preview-caption-keys');
  const counterEl = document.getElementById('stage-counter');

  tabs.forEach((t, idx) => {
    if (idx === index) {
      t.classList.add('border-amber-500/60', 'bg-amber-500/15', 'text-[var(--text-primary)]');
      t.classList.remove('border-[var(--border)]', 'bg-[var(--bg-secondary)]', 'text-[var(--text-secondary)]');
    } else {
      t.classList.remove('border-amber-500/60', 'bg-amber-500/15', 'text-[var(--text-primary)]');
      t.classList.add('border-[var(--border)]', 'bg-[var(--bg-secondary)]', 'text-[var(--text-secondary)]');
    }
  });

  if (counterEl) {
    counterEl.textContent = `${index + 1} of ${WORKSPACE_VIEWS.length}`;
  }

  const isLight = document.documentElement.classList.contains('light');
  const targetSrc = isLight && view.lightSrc ? view.lightSrc : view.src;

  if (!previewImg) return;

  const applyChanges = () => {
    previewImg.src = targetSrc;
    previewImg.alt = view.alt;
    if (previewTitle) previewTitle.textContent = view.title;
    if (previewDesc) previewDesc.textContent = view.desc;
    if (previewKeys) {
      previewKeys.innerHTML = view.keys
        .map(k => `<span class="kbd">${k}</span>`)
        .join('');
    }
  };

  if (animate) {
    previewImg.style.opacity = '0.35';
    setTimeout(() => {
      applyChanges();
      previewImg.style.opacity = '1';
    }, 120);
  } else {
    applyChanges();
  }
}

/**
 * Interactive "Your Voice" Persona Switcher in Reader Anatomy Section
 */
function initPersonaDemo() {
  const personaButtons = document.querySelectorAll('.persona-btn');
  const summaryText = document.getElementById('demo-in-brief-text');
  const personaLabel = document.getElementById('demo-persona-active-label');
  const analysisFrame = document.getElementById('demo-analysis-frame');
  const analysisTone = document.getElementById('demo-analysis-tone');

  const personas = {
    executive: {
      label: 'Executive Strategist · Direct · High-Signal',
      summary: 'A visual mapping of S&P 500 market capitalization against headcount reveals extreme revenue-per-employee divergence: frontier technology and semiconductor firms command massive valuation footprints with lean headcounts, whereas legacy retail and logistics sectors remain labor-dense.',
      frame: 'Capital Efficiency',
      tone: 'Analytical · Concise'
    },
    skeptic: {
      label: 'Critical Skeptic · Methodological · Probing',
      summary: 'While plotting stick-figure employee counts inside market-cap bubbles offers a striking visual heuristic, market capitalization reflects forward growth expectations rather than current operational output—and omits contractor ecosystems and offshore supply-chain labor.',
      frame: 'Methodological Critique',
      tone: 'Questioning · Rigorous'
    },
    product: {
      label: 'Product & Engineering · Systems Focus',
      summary: 'Built as an interactive canvas visualization packing employee stick figures proportionally inside S&P 500 sector bubbles. Demonstrates how high-leverage software platforms decouple headcount growth from enterprise value creation.',
      frame: 'Systems & Leverage',
      tone: 'Technical · Pragmatic'
    },
    publisher: {
      label: 'Benchmark House Style · Evidence-Grounded',
      summary: 'Cross-sector workforce analysis of the S&P 500 illustrates a structural shift in labor intensity across U.S. equities. Data visualization highlights the widening productivity premium in knowledge-intensive industries (Cited: vfxGer, 2026).',
      frame: 'Institutional Research',
      tone: 'Objective · Citable'
    }
  };

  personaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.persona;
      const data = personas[key];
      if (!data) return;

      personaButtons.forEach(b => {
        b.classList.remove('border-amber-500', 'bg-amber-500/15', 'text-[var(--text-primary)]');
        b.classList.add('border-[var(--border)]', 'text-[var(--text-secondary)]');
      });
      btn.classList.add('border-amber-500', 'bg-amber-500/15', 'text-[var(--text-primary)]');
      btn.classList.remove('border-[var(--border)]', 'text-[var(--text-secondary)]');

      if (summaryText) summaryText.textContent = data.summary;
      if (personaLabel) personaLabel.textContent = data.label;
      if (analysisFrame) analysisFrame.textContent = data.frame;
      if (analysisTone) analysisTone.textContent = data.tone;
    });
  });
}

/**
 * Interactive APA 7 Citation Copy Demo
 */
function initCitationCopyDemo() {
  const copyBtn = document.getElementById('demo-copy-citation-btn');
  const copyStatus = document.getElementById('demo-copy-citation-status');
  const citationString = 'vfxGer. (2026, October 25). Show HN: I put employees inside S&P 500 market-cap bubbles. Hacker News: Front Page. https://bigwhalehunting.com/workforce/';

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(citationString).catch(() => {});
      }
      if (copyStatus) {
        copyStatus.textContent = 'Copied APA 7!';
        copyStatus.classList.add('text-amber-500');
        setTimeout(() => {
          copyStatus.textContent = 'Copy APA 7';
          copyStatus.classList.remove('text-amber-500');
        }, 2000);
      }
    });
  }
}

/**
 * Interactive Enterprise Publisher Vertical Switcher (Benchmark, B2B, Media)
 */
function initPublisherVerticals() {
  const buttons = document.querySelectorAll('.pub-vertical-btn');
  const titleEl = document.getElementById('pub-vertical-title');
  const problemEl = document.getElementById('pub-vertical-problem');
  const solutionEl = document.getElementById('pub-vertical-solution');
  const metric1El = document.getElementById('pub-metric-1');
  const metric2El = document.getElementById('pub-metric-2');
  const mastheadEl = document.getElementById('broadsheet-masthead');
  const subheadEl = document.getElementById('broadsheet-subhead');
  const leadTitleEl = document.getElementById('broadsheet-lead-title');
  const leadNoteEl = document.getElementById('broadsheet-lead-note');

  const verticals = {
    b2b: {
      title: 'B2B Intelligence, Market Benchmarks & Trade Publishers',
      problem: 'Corporate seat subscribers receive daily emails, skim two headlines, and rarely touch your historical archive. At renewal time, procurement questions seat utilization.',
      solution: 'Give every corporate seat a dedicated Tenwise workspace pre-loaded with your feeds and topic dossiers. Analysts compare multiple reports, annotate findings, and circulate co-branded Studio PDF briefings internally—making your brand indispensable across the enterprise.',
      metric1: 'Turns passive email opens into active multi-article synthesis & team collections',
      metric2: 'Every exported Studio PDF carries your masthead and verified APA citations to executive leadership',
      masthead: 'The Benchmark Intelligence Brief',
      subhead: 'Q4 INSTITUTIONAL EDITION · CURATED FROM 6 BENCHMARK REPORTS',
      leadTitle: 'North American Supply Chain & Capital Allocation Benchmarks: 2026–2027 Outlook',
      leadNote: 'Analyst Note: Key margin comparison in Section 3—include in Friday’s Investment Committee packet.'
    },
    education: {
      title: 'Education, Curriculum & Academic Research Publishers',
      problem: 'Educators, district leaders, and researchers struggle to organize articles across standards, extract accurate citations, and use AI without risking off-rubric hallucinations.',
      solution: 'Deliver leveled collections, literacy dossiers, and research packs inside a calm, WCAG 2.2 AA accessible workspace. Built-in APA 7 citations, 4-color highlights, NotebookLM export, and editor-governed AI prompts ensure safe, rigorous inquiry.',
      metric1: 'Automatic APA 7 citations & one-click reference lists for every saved article or preprint',
      metric2: '100% On-device or rubric-locked Editorial AI that never trains on student or institutional data',
      masthead: 'Benchmark Literacy & Research Digest',
      subhead: 'DISTRICT CURRICULUM BRIEFING · CURATED FROM 4 EVIDENCE SOURCES',
      leadTitle: 'Structured Literacy & Evidence-Based Reading Interventions Across K–12 Districts',
      leadNote: 'Curriculum Director Note: Aligns with state ELA framework; share citation list with instructional coaches.'
    },
    media: {
      title: 'Specialist Journalism, Policy Desks & Premium Newsletters',
      problem: 'Your best long-form journalism gets buried under algorithmic social feeds or lost in subscribers’ browser tab graveyards—eroding long-term subscriber LTV.',
      solution: 'Offer a "Read & Research in Tenwise" tier. Subscribers read in a calm Newsreader-serif docked reader, follow topic timelines, compare coverage across your archive, and build personal research libraries anchored to your reporting.',
      metric1: 'Replaces ephemeral inbox skimming with a permanent, searchable subscriber library',
      metric2: ' Editorial AI personas reflect your newsroom’s exact voice, standards, and analytical framing',
      masthead: 'The Capitol & Markets Evening Edition',
      subhead: 'SUBSCRIBER DOSSIER · CURATED FROM 5 ARCHIVE DISPATCHES',
      leadTitle: 'Semiconductor Export Controls & Industrial Policy: A Six-Month Synthesis',
      leadNote: 'Policy Desk Note: Contrasts Commerce Dept. filings with European foundry capacity disclosures.'
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.vertical;
      const v = verticals[key];
      if (!v) return;

      buttons.forEach(b => {
        b.classList.remove('border-amber-500', 'bg-amber-500/15', 'text-[var(--text-primary)]');
        b.classList.add('border-[var(--border)]', 'bg-[var(--bg-secondary)]', 'text-[var(--text-secondary)]');
      });
      btn.classList.add('border-amber-500', 'bg-amber-500/15', 'text-[var(--text-primary)]');
      btn.classList.remove('border-[var(--border)]', 'bg-[var(--bg-secondary)]', 'text-[var(--text-secondary)]');

      if (titleEl) titleEl.textContent = v.title;
      if (problemEl) problemEl.textContent = v.problem;
      if (solutionEl) solutionEl.textContent = v.solution;
      if (metric1El) metric1El.textContent = v.metric1;
      if (metric2El) metric2El.textContent = v.metric2;
      if (mastheadEl) mastheadEl.textContent = v.masthead;
      if (subheadEl) subheadEl.textContent = v.subhead;
      if (leadTitleEl) leadTitleEl.textContent = v.leadTitle;
      if (leadNoteEl) leadNoteEl.textContent = v.leadNote;
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
      const vertical = form.elements['vertical'] ? form.elements['vertical'].value : '';
      const message = form.elements['message'].value;

      const mailtoSubject = encodeURIComponent(`Tenwise Publisher & Enterprise Inquiry — ${organization}`);
      const mailtoBody = encodeURIComponent(
        `Hello Tenwise Team,\n\n` +
        `We would like to explore Tenwise's Publisher Engagement Layer & Enterprise Workspace.\n\n` +
        `Name: ${name}\n` +
        `Work Email: ${email}\n` +
        `Publication / Organization: ${organization}\n` +
        `Role: ${role}\n` +
        `Primary Focus: ${vertical}\n\n` +
        `Objectives & Context:\n${message}\n`
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
