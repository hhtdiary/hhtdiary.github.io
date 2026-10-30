// HHT Diary — shared header and footer for the organization pages. Pages sit at different depths
// (/, /vision/, /products/), so every link is resolved against the site root, which is the folder above this
// script. TripLibre has its own site at triplibre.hhtdiary.org (in the zyang91/TripLibre repo); its links are absolute.

const ROOT = new URL('..', document.currentScript.src).href;
const ORG_GITHUB = 'https://github.com/hhtdiary';
const TRIPLIBRE = 'https://triplibre.hhtdiary.org/';

const BRAND = {
  name: 'HHT Diary',
  logo: 'assets/hhtdiary-mark.png',
  home: '',
  blurb: 'Open, local-first tools for understanding everyday travel. Free and Apache 2.0 licensed.',
  base: '© HHT Diary · Apache 2.0',
  nav: [
    { href: 'products/', title: 'Products', prefix: true },
    { href: 'vision/', title: 'Vision', prefix: true },
    { href: 'roadmap/', title: 'Roadmap', prefix: true },
    { href: 'about/', title: 'About', prefix: true },
    { href: ORG_GITHUB, title: 'GitHub' },
  ],
  footer: [
    { group: 'Organization', items: [
      { href: '', title: 'Home' },
      { href: 'vision/', title: 'Vision' },
      { href: 'roadmap/', title: 'Roadmap' },
      { href: 'about/', title: 'About' },
    ] },
    { group: 'Products', items: [
      { href: 'products/', title: 'All products' },
      { href: TRIPLIBRE, title: 'TripLibre' },
    ] },
    { group: 'Community', items: [
      { href: ORG_GITHUB, title: 'GitHub' },
      { href: TRIPLIBRE + 'docs/contributing.html', title: 'Contributing' },
      { href: 'mailto:zhanchao@upenn.edu', title: 'Contact' },
    ] },
  ],
};

const ICONS = {
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  moon: '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
  sun: '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
};

// Absolute URLs (https:, mailto: …) pass through; everything else is relative to the site root.
const url = href => (/^[a-z][a-z0-9+.-]*:/i.test(href) ? href : ROOT + href);

// "vision/" for /vision/ and /vision/index.html alike.
function currentPath() {
  const here = location.href.split(/[?#]/)[0];
  return here.startsWith(ROOT) ? here.slice(ROOT.length).replace(/index\.html$/, '') : '';
}

function brandLink() {
  return `<a class="brand" href="${url(BRAND.home)}"><img src="${url(BRAND.logo)}" alt="" width="34" height="34">${BRAND.name}</a>`;
}

function buildHeader() {
  const here = currentPath();
  // First exact match, else the first section whose pages start with its path.
  const local = BRAND.nav.filter(n => !/^https?:/.test(n.href));
  const current = local.find(n => n.href === here) || local.find(n => n.prefix && here.startsWith(n.href));
  const h = document.createElement('header');
  h.className = 'top';
  h.innerHTML = `
    <a class="skip" href="#main">Skip to content</a>
    ${brandLink()}
    <nav id="site-nav" aria-label="Main">
      <ul class="dg">
        ${BRAND.nav.map(n => `<li><a href="${url(n.href)}"${n === current ? ' aria-current="page"' : ''}>${n.title}</a></li>`).join('')}
      </ul>
    </nav>
    <div class="tools">
      <button class="icon-btn theme-btn" type="button" aria-label="Toggle dark mode">${ICONS.moon}${ICONS.sun}</button>
    </div>`;
  document.body.prepend(h);

  // The navigation is a line diagram that stays visible at every width, so it needs no menu button.
  h.querySelector('.theme-btn').addEventListener('click', () => {
    const root = document.documentElement;
    const dark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('hht-docs-theme', root.dataset.theme); } catch (e) {}
  });
}

function buildFooter() {
  const f = document.createElement('footer');
  f.className = 's-footer';
  f.innerHTML = `
    <div>
      <div class="fc">
        <div class="about">
          ${brandLink()}
          <p>${BRAND.blurb}</p>
        </div>
        ${BRAND.footer.map(g => `
          <div><h2>${g.group}</h2><ul>
            ${g.items.map(i => `<li><a href="${url(i.href)}">${i.title}</a></li>`).join('')}
          </ul></div>`).join('')}
      </div>
      <div class="fb"><span>${BRAND.base}</span><span>Every trip tells a story.</span></div>
    </div>`;
  document.body.append(f);
}

document.addEventListener('DOMContentLoaded', () => {
  buildHeader();
  buildFooter();
});
