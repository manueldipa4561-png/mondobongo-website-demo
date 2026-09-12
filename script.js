const mobileStylesheet = document.createElement('link');
mobileStylesheet.rel = 'stylesheet';
mobileStylesheet.href = 'mobile.css';
mobileStylesheet.media = '(max-width: 920px)';
document.head.appendChild(mobileStylesheet);

const mobileMenuStylesheet = document.createElement('link');
mobileMenuStylesheet.rel = 'stylesheet';
mobileMenuStylesheet.href = 'mobile-menu.css';
mobileMenuStylesheet.media = '(max-width: 820px)';
document.head.appendChild(mobileMenuStylesheet);

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

const closeMobileNav = () => {
  nav?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
};

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMobileNav);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    closeMobileNav();
    menuToggle?.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 820 && nav?.classList.contains('open')) {
    closeMobileNav();
  }
}, { passive: true });

const tabs = [...document.querySelectorAll('.menu-tab')];
const panels = [...document.querySelectorAll('.menu-panel')];

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.menu;

    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
      item.setAttribute('tabindex', active ? '0' : '-1');
    });

    panels.forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.panel === target);
    });

    if (window.innerWidth <= 820) {
      requestAnimationFrame(() => {
        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
    }
  });
});

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}
