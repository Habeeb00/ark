/* ========================================
   ARK — Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Render components ----
  renderBuildGrid('build-grid');
  renderSortTabs('sort-tabs');
  renderPainList('pain-list');

  // ---- Scroll-based animations ----
  initScrollAnimations();

  // ---- Sort tab filtering (component-aware) ----
  initSortTabs();

  // ---- Upvote interactions ----
  initUpvotes();

  // ---- Contact form ----
  initContactForm();

  // ---- Navbar scroll effect ----
  initNavbarScroll();
});

// ==========================================
// Scroll Animations (Intersection Observer)
// ==========================================
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-fade-in-up, .animate-fade-in');

  if (!animatedElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}

// ==========================================
// Sort Tabs — uses component re-render
// ==========================================
function initSortTabs() {
  const tabContainer = document.getElementById('sort-tabs');
  if (!tabContainer) return;

  tabContainer.addEventListener('click', (e) => {
    const tab = e.target.closest('.sort-tab');
    if (!tab) return;

    // Update active state
    tabContainer.querySelectorAll('.sort-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Re-render pain list with filter
    const filter = tab.dataset.filter;
    renderPainList('pain-list', filter);

    // Re-init upvotes on new items
    initUpvotes();
  });
}

// ==========================================
// Upvotes
// ==========================================
function initUpvotes() {
  const voteButtons = document.querySelectorAll('.pain-item__vote');

  voteButtons.forEach(btn => {
    // Remove old listeners by cloning
    if (btn.dataset.bound) return;
    btn.dataset.bound = 'true';

    btn.addEventListener('click', () => {
      const countEl = btn.querySelector('.pain-item__vote-count');
      if (!countEl) return;

      let count = parseInt(countEl.textContent);

      if (btn.classList.contains('voted')) {
        count--;
        btn.classList.remove('voted');
        btn.style.color = '';
      } else {
        count++;
        btn.classList.add('voted');
        btn.style.color = 'var(--open-text)';
      }

      countEl.textContent = count;

      // Micro-animation
      countEl.style.transform = 'scale(1.2)';
      setTimeout(() => {
        countEl.style.transform = 'scale(1)';
      }, 150);
    });
  });
}

// ==========================================
// Contact Form
// ==========================================
function initContactForm() {
  const addBtn = document.getElementById('add-pain-btn');
  if (!addBtn) return;

  addBtn.addEventListener('click', () => {
    const title = document.getElementById('pain-title');
    const description = document.getElementById('pain-description');

    if (!title.value.trim()) {
      title.style.borderColor = 'var(--open-text)';
      title.focus();
      setTimeout(() => { title.style.borderColor = '#454545'; }, 2000);
      return;
    }

    // Add to data and re-render
    PAINS.unshift({
      text: title.value.trim(),
      status: 'open',
      votes: 1,
    });

    // Re-render with current active filter
    const activeTab = document.querySelector('.sort-tab.active');
    const filter = activeTab ? activeTab.dataset.filter : 'all';
    renderPainList('pain-list', filter);
    initUpvotes();

    // Clear form
    title.value = '';
    description.value = '';

    // Flash success
    addBtn.textContent = 'added ✓';
    addBtn.style.background = 'var(--solved-text)';
    addBtn.style.color = 'white';
    setTimeout(() => {
      addBtn.textContent = 'add pain →';
      addBtn.style.background = '';
      addBtn.style.color = '';
    }, 1500);
  });
}

// ==========================================
// Navbar Scroll Effect
// ==========================================
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.style.opacity = currentScroll > lastScroll ? '0.6' : '1';
    } else {
      navbar.style.opacity = '1';
    }

    lastScroll = currentScroll;
  });
}
