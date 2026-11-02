const root = document.documentElement;
const header = document.querySelector('.site-header');
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-nav');
const searchInput = document.querySelector('#nav-search');
const cards = [...document.querySelectorAll('.nav-card')];
const emptyState = document.querySelector('.empty-state');
const searchStatus = document.querySelector('.search-status');

const savedTheme = localStorage.getItem('macau-guide-theme');
const preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
root.dataset.theme = savedTheme || preferredTheme;

function updateThemeColor() {
  const color = root.dataset.theme === 'light' ? '#f5f1e7' : '#07110f';
  document.querySelector('meta[name="theme-color"]').setAttribute('content', color);
}

updateThemeColor();

themeToggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('macau-guide-theme', root.dataset.theme);
  updateThemeColor();
});

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', '打开菜单');
  mobileMenu.hidden = true;
}

menuToggle.addEventListener('click', () => {
  const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(willOpen));
  menuToggle.setAttribute('aria-label', willOpen ? '关闭菜单' : '打开菜单');
  mobileMenu.hidden = !willOpen;
});

mobileMenu.addEventListener('click', (event) => {
  if (event.target.matches('a')) closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 960) closeMenu();
});

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 18);
}, { passive: true });

function filterCards() {
  const query = searchInput.value.trim().toLocaleLowerCase('zh-CN');
  let visibleCount = 0;

  cards.forEach((card) => {
    const searchableText = `${card.dataset.search} ${card.textContent}`.toLocaleLowerCase('zh-CN');
    const matches = !query || searchableText.includes(query);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  emptyState.hidden = visibleCount !== 0;
  searchStatus.textContent = query ? `找到 ${visibleCount} 个相关入口` : '显示全部 5 个入口';
}

searchInput.addEventListener('input', filterCards);

document.addEventListener('keydown', (event) => {
  const isTyping = /input|textarea/i.test(document.activeElement.tagName);

  if (event.key === '/' && !isTyping) {
    event.preventDefault();
    searchInput.focus();
  }

  if (event.key === 'Escape') {
    if (document.activeElement === searchInput) {
      searchInput.value = '';
      filterCards();
      searchInput.blur();
    }
    closeMenu();
  }
});

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  root.classList.add('js');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px' });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelector('#current-year').textContent = new Date().getFullYear();
filterCards();
