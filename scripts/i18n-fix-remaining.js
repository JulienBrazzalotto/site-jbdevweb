/* Fix remaining unmatched i18n keys */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function rep(file, from, to) {
  const fp = path.join(ROOT, file);
  let h = fs.readFileSync(fp, 'utf8');
  if (!h.includes(from)) { console.warn('MISS', file, from.slice(0,40)); return; }
  if (h.includes(to.split('data-i18n="')[1]?.split('"')[0] || '___')) return;
  h = h.split(from).join(to);
  fs.writeFileSync(fp, h);
  console.log('fixed', file, from.slice(0,30));
}

// CONTACT
rep('contact/index.html', '<h2>Comment ça se passe ?</h2>', '<h2 data-i18n="contact.process.title">Comment ça se passe ?</h2>');
rep('contact/index.html', '<h3>1. Prise de contact</h3>', '<h3 data-i18n="contact.process.step1.title">1. Prise de contact</h3>');
rep('contact/index.html', '<h3>2. Analyse & proposition</h3>', '<h3 data-i18n="contact.process.step2.title">2. Analyse & proposition</h3>');
rep('contact/index.html', '<h3>3. Production & suivi</h3>', '<h3 data-i18n="contact.process.step3.title">3. Production & suivi</h3>');
rep('contact/index.html', '<h2>Me contacter directement</h2>', '<h2 data-i18n="contact.direct.title">Me contacter directement</h2>');
rep('contact/index.html', '<h2>Décrivez-moi votre projet</h2>', '<h2 data-i18n="contact.form.title">Décrivez-moi votre projet</h2>');

// SHOPIFY region
rep('shopify/index.html', 'role="region" aria-label="Tableau comparatif des plateformes e-commerce"', 'role="region" data-i18n-attr="aria-label" data-i18n="shopify.compare.region" aria-label="Tableau comparatif des plateformes e-commerce"');
rep('shopify/index.html', 'alt="Projet boutique e-commerce"', 'data-i18n-attr="alt" data-i18n="shopify.projects.card1.alt" alt="Projet boutique e-commerce"');
rep('sites-vitrines/index.html', 'alt="Projet 2"', 'data-i18n-attr="alt" data-i18n="sites_vitrines.projects.card1.alt" alt="Projet 2"');

// BLOG INDEX cards - patch per href
function patchCard(file, href, patches) {
  const fp = path.join(ROOT, file);
  let h = fs.readFileSync(fp, 'utf8');
  const i = h.indexOf(`href="${href}"`);
  if (i === -1) return;
  const end = h.indexOf('</a>', i) + 4;
  let seg = h.slice(i, end);
  for (const [from, to] of patches) {
    if (seg.includes(from) && !seg.includes('data-i18n')) seg = seg.split(from).join(to);
  }
  h = h.slice(0, i) + seg + h.slice(end);
  fs.writeFileSync(fp, h);
  console.log('card', href);
}

patchCard('blog/index.html', '/blog/cadence/', [
  ['aria-label="Lire l\'annonce de Cadence, prochaine app Shopify"', 'data-i18n-attr="aria-label" data-i18n="blog.card.cadence.aria" aria-label="Lire l\'annonce de Cadence, prochaine app Shopify"'],
]);
patchCard('blog/index.html', '/blog/stock-transfert-pro-shopify/', [
  ['aria-label="Lire l\'article Stock Transfert Pro"', 'data-i18n-attr="aria-label" data-i18n="blog.card.stp.aria" aria-label="Lire l\'article Stock Transfert Pro"'],
  ['<span class="blog-tag">Shopify App</span>', '<span class="blog-tag" data-i18n="blog.card.stp.tag">Shopify App</span>'],
  ['<span class="blog-date">juin 2026</span>', '<span class="blog-date" data-i18n="blog.card.stp.date">juin 2026</span>'],
]);
patchCard('blog/index.html', '/blog/tarif-site-shopify-2026/', [
  ['aria-label="Lire l\'article tarif d\'un site Shopify en 2026"', 'data-i18n-attr="aria-label" data-i18n="blog.card.tarif.aria" aria-label="Lire l\'article tarif d\'un site Shopify en 2026"'],
  ['<span class="blog-link">Lire l\'article</span>', '<span class="blog-link" data-i18n="blog.card.tarif.link">Lire l\'article</span>'],
]);
patchCard('blog/index.html', '/blog/comparatif-shopify-wix-prestashop-2026/', [
  ['aria-label="Lire l\'article comparatif Shopify Wix Prestashop"', 'data-i18n-attr="aria-label" data-i18n="blog.card.comparatif.aria" aria-label="Lire l\'article comparatif Shopify Wix Prestashop"'],
  ['<span class="blog-date">avril 2026</span>', '<span class="blog-date" data-i18n="blog.card.comparatif.date">avril 2026</span>'],
  ['<span class="blog-link">Lire l\'article</span>', '<span class="blog-link" data-i18n="blog.card.comparatif.link">Lire l\'article</span>'],
]);
patchCard('blog/index.html', '/blog/magasin-physique-boutique-en-ligne/', [
  ['aria-label="Lire l\'article magasin physique et boutique en ligne"', 'data-i18n-attr="aria-label" data-i18n="blog.card.magasin.aria" aria-label="Lire l\'article magasin physique et boutique en ligne"'],
  ['<span class="blog-date">avril 2026</span>', '<span class="blog-date" data-i18n="blog.card.magasin.date">avril 2026</span>'],
  ['<span class="blog-link">Lire l\'article</span>', '<span class="blog-link" data-i18n="blog.card.magasin.link">Lire l\'article</span>'],
]);

// CADENCE progress aria
rep('blog/cadence/index.html', 'aria-label="Avancement du développement de Cadence"', 'data-i18n-attr="aria-label" data-i18n="blog.cadence.progress.aria" aria-label="Avancement du développement de Cadence"');
rep('blog/cadence/index.html', 'aria-label="Avancement global de Cadence"', 'data-i18n-attr="aria-label" data-i18n="blog.cadence.s2.progress.aria" aria-label="Avancement global de Cadence"');

// STP
rep('blog/stock-transfert-pro-shopify/index.html', 'class="cta" target="_blank" rel="noopener">Voir l', 'class="cta" data-i18n="blog.stp.hero.cta_app" target="_blank" rel="noopener">Voir l');
rep('blog/stock-transfert-pro-shopify/index.html', 'class="cta-secondary">Parler de votre projet Shopify</a>', 'class="cta-secondary" data-i18n="blog.stp.hero.cta_contact">Parler de votre projet Shopify</a>');
rep('blog/stock-transfert-pro-shopify/index.html', '<small>/mois</small>', '<small data-i18n="blog.stp.pricing.starter.period">/mois</small>');
rep('blog/stock-transfert-pro-shopify/index.html', '<span class="pricing-badge">Recommandé</span>\n      <h3>Pro</h3>', '<span class="pricing-badge" data-i18n="blog.stp.pricing.badge">Recommandé</span>\n      <h3 data-i18n="blog.stp.pricing.pro.title">Pro</h3>');
rep('blog/stock-transfert-pro-shopify/index.html', 'class="cta" target="_blank" rel="noopener">Voir sur le Shopify App Store</a>', 'class="cta" data-i18n="blog.stp.s6.cta_app" target="_blank" rel="noopener">Voir sur le Shopify App Store</a>');
rep('blog/stock-transfert-pro-shopify/index.html', 'class="cta-secondary">Une question sur le bon plan ?</a>', 'class="cta-secondary" data-i18n="blog.stp.s6.cta_plan">Une question sur le bon plan ?</a>');
rep('blog/stock-transfert-pro-shopify/index.html', '<h2>Pour aller plus loin</h2>', '<h2 data-i18n="blog.stp.s8.title">Pour aller plus loin</h2>');
rep('blog/stock-transfert-pro-shopify/index.html', 'class="cta" target="_blank" rel="noopener">Installer Stock Transfert Pro</a>', 'class="cta" data-i18n="blog.stp.s8.cta_install" target="_blank" rel="noopener">Installer Stock Transfert Pro</a>');

// TARIF FAQ answers - wrap content after <br>
function wrapAfterBr(file, qKey, aKey, qText) {
  const fp = path.join(ROOT, file);
  let h = fs.readFileSync(fp, 'utf8');
  const marker = `<strong>${qText}</strong><br>`;
  const i = h.indexOf(marker);
  if (i === -1) { console.warn('q miss', qText); return; }
  if (h.includes(`data-i18n="${aKey}"`)) return;
  const start = i + marker.length;
  const end = h.indexOf('</p>', start);
  const ans = h.slice(start, end);
  h = h.slice(0, start) + `<span data-i18n="${aKey}" data-i18n-html>` + ans + '</span>' + h.slice(end);
  fs.writeFileSync(fp, h);
  console.log('faq ans', aKey);
}

wrapAfterBr('blog/tarif-site-shopify-2026/index.html', 'blog.tarif.s10.q1', 'blog.tarif.s10.a1', 'Combien coûte un site Shopify minimum par mois en 2026 ?');
wrapAfterBr('blog/tarif-site-shopify-2026/index.html', 'blog.tarif.s10.q2', 'blog.tarif.s10.a2', 'Quel budget freelance prévoir pour la création d\'une boutique Shopify en 2026 ?');
wrapAfterBr('blog/tarif-site-shopify-2026/index.html', 'blog.tarif.s10.q3', 'blog.tarif.s10.a3', 'Quelles sont les commissions Shopify Payments en France ?');
wrapAfterBr('blog/tarif-site-shopify-2026/index.html', 'blog.tarif.s10.q4', 'blog.tarif.s10.a4', 'Y a-t-il des frais en plus si je n\'utilise pas Shopify Payments ?');

rep('blog/comparatif-shopify-wix-prestashop-2026/index.html', '<h2>Questions fréquentes</h2>', '<h2 data-i18n="blog.comparatif.s8.title">Questions fréquentes</h2>');
wrapAfterBr('blog/comparatif-shopify-wix-prestashop-2026/index.html', '', 'blog.comparatif.s8.a1', 'Shopify est canadien : est-ce un problème pour la TVA en France ?');
wrapAfterBr('blog/comparatif-shopify-wix-prestashop-2026/index.html', '', 'blog.comparatif.s8.a2', 'Puis-je migrer depuis Wix sans perdre mon référencement ?');
wrapAfterBr('blog/comparatif-shopify-wix-prestashop-2026/index.html', '', 'blog.comparatif.s8.a3', 'Ai-je besoin d\'un développeur pour Shopify ?');

rep('blog/magasin-physique-boutique-en-ligne/index.html', '<h2>Questions fréquentes</h2>', '<h2 data-i18n="blog.magasin.s9.title">Questions fréquentes</h2>');
wrapAfterBr('blog/magasin-physique-boutique-en-ligne/index.html', '', 'blog.magasin.s9.a1', 'Combien de temps pour ouvrir une boutique en ligne quand on a déjà un magasin ?');
wrapAfterBr('blog/magasin-physique-boutique-en-ligne/index.html', '', 'blog.magasin.s9.a2', 'Faut-il un salarié à temps plein pour le site ?');
wrapAfterBr('blog/magasin-physique-boutique-en-ligne/index.html', '', 'blog.magasin.s9.a3', 'Le click &amp; collect a-t-il du sens hors des grandes villes ?');
wrapAfterBr('blog/magasin-physique-boutique-en-ligne/index.html', '', 'blog.magasin.s9.a4', 'Dois-je fermer mon ancien site tout de suite ?');

console.log('fixes done');
