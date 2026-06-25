/* ========================================
   ARK WEBSITE — Component System
   Reusable UI components matching Figma 284:118
   ======================================== */

/**
 * Tag Component (Figma: 272:48, 272:53)
 * Used in project cards for type indicators
 * @param {'tool'|'product'} type
 * @returns {string} HTML string
 */
function Tag(type) {
  return `<span class="card__tag card__tag--${type}">${type}</span>`;
}

/**
 * Pain Tag Component (Figma: 285:109, 285:111, 285:113)
 * Status badges for pain board items
 * @param {'open'|'solved'|'building'} status
 * @returns {string} HTML string
 */
function PainTag(status) {
  return `<span class="pain-item__tag pain-item__tag--${status}">${status.toUpperCase()}</span>`;
}

/**
 * View Button Component (Figma: 290:239)
 * Small white pill button used on project cards
 * @param {string} href - Link destination
 * @returns {string} HTML string
 */
function ViewButton(href = '#') {
  return `<a href="${href}" class="card__view-btn">View →</a>`;
}

/**
 * Builder Avatars Component (Figma: 290:362)
 * Overlapping circular avatar stack
 * @param {Array<{src: string, alt: string}>} builders
 * @returns {string} HTML string
 */
function BuilderAvatars(builders) {
  return `<div class="card__builders">
    ${builders.map(b => `<img class="card__builder-avatar" src="${b.src}" alt="${b.alt}">`).join('')}
  </div>`;
}

/**
 * Small Tile Card Component (Figma: 274:86)
 * Used in the "What We Build" 2-column grid
 * @param {Object} data
 * @param {string} data.type - 'tool' or 'product'
 * @param {string} data.title - Project name
 * @param {string} data.description - Short description
 * @param {Array<{src: string, alt: string}>} data.builders
 * @param {string} [data.href] - Link
 * @returns {string} HTML string
 */
function SmallTile({ type, title, description, builders, href = '#' }) {
  return `<div class="card">
    <div class="card__top">
      ${Tag(type)}
    </div>
    <div class="card__body">
      <h3 class="card__title">${title}</h3>
      <p class="card__description">${description}</p>
    </div>
    <div class="card__bottom">
      ${BuilderAvatars(builders)}
      ${ViewButton(href)}
    </div>
  </div>`;
}

/**
 * Large Tile Card Component (Figma: 275:100)
 * Full-width card with image area, used for featured projects
 * @param {Object} data
 * @param {string} data.type - 'tool' or 'product'
 * @param {string} data.title - Project name
 * @param {string} data.description - Short description
 * @param {string} [data.usage] - Usage info like "Used by many"
 * @param {Array<{src: string, alt: string}>} data.builders
 * @param {string} [data.href] - Link
 * @returns {string} HTML string
 */
function LargeTile({ type, title, description, usage = '', builders, href = '#' }) {
  return `<div class="card card--large">
    <div class="card__content-area">
      <div class="card__top">
        ${Tag(type)}
        ${usage ? `<span class="card__usage">${usage}</span>` : ''}
      </div>
      <div class="card__body">
        <h3 class="card__title">${title}</h3>
        <p class="card__description">${description}</p>
      </div>
      <div class="card__bottom">
        ${BuilderAvatars(builders)}
        ${ViewButton(href)}
      </div>
    </div>
    <div class="card__image-area"></div>
  </div>`;
}

/**
 * Pain Action Button Component (Figma: 287:122, 290:359)
 * "solve this" or "view tool →" button on pain items
 * @param {'open'|'solved'|'building'} status
 * @returns {string} HTML string
 */
function PainAction(status) {
  if (status === 'solved') {
    return `<a href="#" class="pain-item__action pain-item__action--white">view tool →</a>`;
  }
  return `<button class="pain-item__action">solve this</button>`;
}

/**
 * Pain List Item Component (Figma: 290:128)
 * Single row in the pain board
 * @param {Object} data
 * @param {string} data.text - Pain description
 * @param {'open'|'solved'|'building'} data.status
 * @param {number} data.votes - Vote count
 * @returns {string} HTML string
 */
function PainItem({ text, status, votes }) {
  return `<div class="pain-item" data-status="${status}">
    <div class="pain-item__vote">
      <img class="pain-item__upvote-icon" src="assets/upvote.svg" alt="Upvote">
      <span class="pain-item__vote-count">${votes}</span>
    </div>
    <div class="pain-item__content">
      <p class="pain-item__text">"${text}"</p>
      ${PainTag(status)}
    </div>
    ${PainAction(status)}
  </div>`;
}

/**
 * Sort Tab Component (Figma: 284:117)
 * Filter tabs for the pain board
 * @param {string} label - Tab text
 * @param {string} filter - data-filter value
 * @param {boolean} [active] - Whether this tab is active
 * @returns {string} HTML string
 */
function SortTab(label, filter, active = false) {
  return `<button class="sort-tab${active ? ' active' : ''}" data-filter="${filter}">${label}</button>`;
}

/**
 * Section Banner Component (Figma: 338:753, 338:792, 338:844)
 * Full-width divider between sections
 * @param {string} label - e.g. "[01] WHY?"
 * @returns {string} HTML string
 */
function SectionBanner(label) {
  return `<div class="section-banner">
    <span class="section-banner__label">${label}</span>
  </div>`;
}

// ============================================
// DATA
// ============================================

const BUILDERS = {
  habeeb: { src: 'assets/habeeb.png', alt: 'Habeeb' },
  aravind: { src: 'assets/aravind.png', alt: 'Aravind' },
};

const PROJECTS = [
  {
    type: 'product',
    title: 'Linkspaces',
    description: 'Organise all your links across multiple workspaces.',
    usage: 'Used by many',
    builders: [BUILDERS.aravind, BUILDERS.habeeb],
    large: true,
  },
  {
    type: 'tool',
    title: 'Chatglider',
    description: 'Makes chatbot flows actually understandable. Less friction, better conversations.',
    builders: [BUILDERS.habeeb],
  },
  {
    type: 'tool',
    title: 'MakeQR',
    description: 'Create custom beautiful qr.',
    builders: [BUILDERS.aravind, BUILDERS.habeeb],
  },
  {
    type: 'tool',
    title: 'Instagram carousel',
    description: 'Figma plugin to create carousels effortlessly in figma.',
    builders: [BUILDERS.habeeb],
  },
  {
    type: 'tool',
    title: 'Jugaad',
    description: 'A calendar integration for the Hub app of TinkerHub',
    builders: [BUILDERS.habeeb],
  },
];

const PAINS = [
  { text: 'Too many browser tabs open, I lose everything', status: 'open', votes: 74 },
  { text: 'Too many browser tabs open, I lose everything', status: 'solved', votes: 74 },
  { text: 'Too many browser tabs open, I lose everything', status: 'open', votes: 74 },
  { text: 'Too many browser tabs open, I lose everything', status: 'open', votes: 74 },
  { text: 'Too many browser tabs open, I lose everything', status: 'open', votes: 74 },
  { text: 'Too many browser tabs open, I lose everything', status: 'open', votes: 74 },
  { text: 'Too many browser tabs open, I lose everything', status: 'building', votes: 74 },
];

// ============================================
// RENDERERS — assemble components into sections
// ============================================

/**
 * Render the "What We Build" card grid
 * @param {string} containerId - DOM element ID to render into
 */
function renderBuildGrid(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const html = PROJECTS.map(project =>
    project.large ? LargeTile(project) : SmallTile(project)
  ).join('');

  container.innerHTML = html;
}

/**
 * Render the Pain Board list
 * @param {string} containerId - DOM element ID
 * @param {string} [filter='all'] - Status filter
 */
function renderPainList(containerId, filter = 'all') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const filtered = filter === 'all'
    ? PAINS
    : PAINS.filter(p => p.status === filter);

  container.innerHTML = filtered.map(p => PainItem(p)).join('');
}

/**
 * Render sort tabs
 * @param {string} containerId - DOM element ID
 */
function renderSortTabs(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const tabs = [
    { label: 'all', filter: 'all', active: true },
    { label: 'open', filter: 'open' },
    { label: 'building', filter: 'building' },
    { label: 'solved', filter: 'solved' },
  ];

  container.innerHTML = tabs.map(t => SortTab(t.label, t.filter, t.active)).join('');
}
