import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function applyCommon(html, metaTitle, metaDesc) {
  if (!html.includes('i18n-en.js')) {
    html = html.replace('</head>', '  <script src="/assets/i18n-en.js" defer></script>\n  <script src="/assets/i18n.js" defer></script>\n</head>');
  }
  if (!html.includes(`data-i18n="${metaTitle}"`)) {
    html = html.replace(/<title>([^<]*)<\/title>/, `<title data-i18n="${metaTitle}">$1</title>`);
    html = html.replace(
      /<meta name="description" content="([^"]*)"(\s*\/?>)/,
      `<meta name="description" data-i18n="${metaDesc}" content="$1"$2`
    );
  }
  html = html.replace(
    /(<div id="cookie-banner"[^>]*>)\s*Ce site utilise des cookies pour améliorer l'expérience\.\s*/,
    `$1\n  <span data-i18n="cookie.message">Ce site utilise des cookies pour améliorer l'expérience.</span> `
  );
  html = html.replace(
    /(<button id="accept-cookies"[^>]*>)Accepter(<\/button>)/,
    `$1<span data-i18n="cookie.accept">Accepter</span>$2`
  );
  html = html.replace(
    /<button id="theme-toggle" aria-label="Changer le thème">/g,
    '<button id="theme-toggle" data-i18n-attr="aria-label" data-i18n="nav.theme_toggle" aria-label="Changer le thème">'
  );
  html = html.replace(
    /<button class="nav-burger" aria-label="Ouvrir le menu"/g,
    '<button class="nav-burger" data-i18n-attr="aria-label" data-i18n="nav.burger" aria-label="Ouvrir le menu"'
  );
  html = html.replace(
    /<div class="nav-panel" role="dialog" aria-label="Menu navigation">/g,
    '<div class="nav-panel" role="dialog" data-i18n-attr="aria-label" data-i18n="nav.panel" aria-label="Menu navigation">'
  );
  const navMap = [
    ['href="/"', 'nav.home', 'Accueil'],
    ['href="/shopify/"', 'nav.shopify', 'Shopify'],
    ['href="/sites-vitrines/"', 'nav.sites_vitrines', 'Sites vitrines'],
    ['href="/faq/"', 'nav.faq', 'FAQ'],
    ['href="/blog/"', 'nav.blog', 'Blog'],
    ['href="/contact/"', 'nav.contact', 'Contact'],
  ];
  for (const [href, key, text] of navMap) {
    const esc = href.replace(/\//g, '\\/');
    const re = new RegExp(`(<a ${esc}[^>]*>)${text}(</a>)`, 'g');
    html = html.replace(re, (m, a, b) => (a.includes('data-i18n') ? m : `${a}<span data-i18n="${key}">${text}</span>${b}`));
  }
  html = html.replace(
    /<a href="\/" aria-label="Retour à l['\u2019]accueil – JB Dev Web">/g,
    '<a href="/" data-i18n-attr="aria-label" data-i18n="footer.logo" aria-label="Retour à l\u2019accueil – JB Dev Web">'
  );
  html = html.replace(
    /© <span id="annee"><\/span> – Julien Brazzalotto, développeur web &amp; freelance Shopify à Auch \(Gers\)<br><a href="\/mentions-legales\/">Mentions légales<\/a>/g,
    '<span data-i18n="footer.copyright" data-i18n-html>© <span id="annee"></span> – Julien Brazzalotto, développeur web &amp; freelance Shopify à Auch (Gers)</span><br><a href="/mentions-legales/" data-i18n="footer.legal">Mentions légales</a>'
  );
  if (!html.includes('/assets/i18n-en.js" defer></script>\n<script src="/assets/i18n.js"')) {
    html = html.replace(
      /<script src="(?:\/|)assets\/theme\.js" defer><\/script>/,
      '<script src="/assets/i18n-en.js" defer></script>\n<script src="/assets/i18n.js" defer></script>\n<script src="/assets/theme.js" defer></script>'
    );
  }
  return html;
}

function patch(html, pairs, label) {
  for (const [from, to] of pairs) {
    if (!html.includes(from)) console.warn(`[${label}] MISSING:`, from.slice(0, 70));
    else html = html.replace(from, to);
  }
  return html;
}

const PAGE_PATCHES = JSON.parse(fs.readFileSync(path.join(__dirname, 'i18n-patches.json'), 'utf8'));

for (const [rel, cfg] of Object.entries(PAGE_PATCHES)) {
  const fp = path.join(ROOT, rel);
  let html = fs.readFileSync(fp, 'utf8');
  html = applyCommon(html, cfg.meta[0], cfg.meta[1]);
  if (cfg.pairs) html = patch(html, cfg.pairs, rel);
  fs.writeFileSync(fp, html);
  console.log('OK', rel);
}
