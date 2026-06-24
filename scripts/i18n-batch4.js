/* Batch 4: blog pages */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function setMeta(html, t, d) {
  if (!html.includes(`data-i18n="${t}"`)) html = html.replace(/<title>([^<]*)<\/title>/, `<title data-i18n="${t}">$1</title>`);
  if (!html.includes(`data-i18n="${d}"`)) html = html.replace(/<meta name="description" content="([^"]*)"(\s*\/?>)/, `<meta name="description" data-i18n="${d}" content="$1"$2`);
  return html;
}
function ins(html, start, attr) {
  const i = html.indexOf(start);
  if (i === -1) { console.warn('MISS', start.slice(0,45)); return html; }
  const chunk = html.slice(i, i + 120);
  if (chunk.includes('data-i18n')) return html;
  const m = chunk.match(/^<[\w-]+/);
  if (!m) return html;
  return html.slice(0, i) + m[0] + ' ' + attr + html.slice(i + m[0].length);
}
function many(html, items) {
  for (const [s, k, h] of items) html = ins(html, s, `data-i18n="${k}"${h ? ' data-i18n-html' : ''}`);
  return html;
}
function patch(rel, fn) {
  const fp = path.join(ROOT, rel);
  fs.writeFileSync(fp, fn(fs.readFileSync(fp, 'utf8')));
  console.log('OK', rel);
}

patch('blog/index.html', (html) => {
  html = setMeta(html, 'meta./blog/.title', 'meta./blog/.description');
  html = many(html, [
    ['<h1 id="hero-title">Blog <span>Shopify</span>', 'blog.hero.title', 1],
    ['<p>\n      Actualité Shopify', 'blog.hero.text', 0],
    ['<a href="/contact/" class="cta">Discuter de votre projet Shopify', 'blog.hero.cta', 0],
    ['<h2>Ce que vous allez trouver ici</h2>', 'blog.find.title', 0],
    ['<h3>Features e-commerce concretes</h3>', 'blog.find.card1.title', 0],
    ['<p>Analyse des besoins réels des marchands', 'blog.find.card1.text', 0],
    ['<h3>Choix techniques Shopify</h3>', 'blog.find.card2.title', 0],
    ['<p>App architecture, performance, webhooks', 'blog.find.card2.text', 0],
    ['<h3>Retour d', 'blog.find.card3.title', 0],
    ['<p>Ce qui fonctionne, ce qui coute cher', 'blog.find.card3.text', 0],
    ['<h2>Articles recents</h2>', 'blog.recent.title', 0],
    ['aria-label="Lire l\'annonce de Cadence', 'blog.card.cadence.aria', 0],
    ['<span class="blog-tag">Shopify App</span>\n            <span class="blog-tag blog-tag-warning">', 'blog.card.cadence.tag', 0],
    ['<span class="blog-tag blog-tag-warning">', 'blog.card.cadence.tag_dev', 0],
    ['<span class="blog-date">juin 2026</span>', 'blog.card.cadence.date', 0],
    ['<h3>Cadence — ma prochaine app Shopify</h3>', 'blog.card.cadence.title', 0],
    ['<p>\n          Nouvelle app Shopify dans la catégorie gestion', 'blog.card.cadence.text', 0],
    ['<span class="blog-link">Lire l\'annonce</span>', 'blog.card.cadence.link', 0],
    ['aria-label="Lire l\'article Stock Transfert Pro"', 'blog.card.stp.aria', 0],
    ['<span class="blog-tag blog-tag-live">Disponible sur l', 'blog.card.stp.tag_live', 0],
    ['<h3>Stock Transfert Pro : l\'app Shopify', 'blog.card.stp.title', 0],
    ['<p>\n          Disponible sur le Shopify App Store depuis le 3 juin', 'blog.card.stp.text', 1],
    ['<span class="blog-link">Lire l\'article</span>', 'blog.card.stp.link', 0],
    ['aria-label="Lire l\'article tarif', 'blog.card.tarif.aria', 0],
    ['<span class="blog-tag">Budget</span>', 'blog.card.tarif.tag', 0],
    ['<span class="blog-date">avril 2026</span>', 'blog.card.tarif.date', 0],
    ['<h3>Tarif d\'un site Shopify en 2026', 'blog.card.tarif.title', 0],
    ['<p>\n          Plans Basic / Grow / Advanced', 'blog.card.tarif.text', 0],
    ['aria-label="Lire l\'article comparatif', 'blog.card.comparatif.aria', 0],
    ['<span class="blog-tag">Guide</span>', 'blog.card.comparatif.tag', 0],
    ['<h3>Shopify, Wix ou Prestashop en 2026', 'blog.card.comparatif.title', 0],
    ['<p>\n          Temps, stock magasin', 'blog.card.comparatif.text', 0],
    ['aria-label="Lire l\'article magasin physique', 'blog.card.magasin.aria', 0],
    ['<span class="blog-tag">Retail</span>', 'blog.card.magasin.tag', 0],
    ['<h3>Magasin physique : ouvrir une boutique en ligne', 'blog.card.magasin.title', 0],
    ['<p>\n          Stock unifié, click &amp; collect', 'blog.card.magasin.text', 1],
  ]);
  return html;
});

console.log('batch4 blog index');
