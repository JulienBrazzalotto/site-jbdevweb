/* Full page-specific i18n patches — run: node scripts/i18n-all-patches.js */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function setMeta(html, titleKey, descKey) {
  if (!html.includes(`data-i18n="${titleKey}"`)) {
    html = html.replace(/<title>([^<]*)<\/title>/, `<title data-i18n="${titleKey}">$1</title>`);
  }
  if (!html.includes(`data-i18n="${descKey}"`)) {
    html = html.replace(
      /<meta name="description" content="([^"]*)"(\s*\/?>)/,
      `<meta name="description" data-i18n="${descKey}" content="$1"$2`
    );
  }
  return html;
}

/** Insert attr on opening tag at position of unique `start` substring */
function ins(html, start, attr) {
  const i = html.indexOf(start);
  if (i === -1) {
    console.warn('MISS:', start.slice(0, 55));
    return html;
  }
  const chunk = html.slice(i, i + 120);
  const m = chunk.match(/^<[\w-]+/);
  if (!m) return html;
  const tag = m[0];
  if (chunk.includes('data-i18n')) return html;
  return html.slice(0, i) + tag + ' ' + attr + html.slice(i + tag.length);
}

function rep(html, from, to) {
  if (!html.includes(from)) {
    console.warn('REP MISS:', from.slice(0, 55));
    return html;
  }
  return html.split(from).join(to);
}

function patchFile(rel, fn) {
  const fp = path.join(ROOT, rel);
  let html = fs.readFileSync(fp, 'utf8');
  html = fn(html);
  fs.writeFileSync(fp, html);
  console.log('OK', rel);
}

// --- CONTACT (finish hero p) ---
patchFile('contact/index.html', (html) => {
  html = ins(html, '<p>Boutique <strong>Shopify</strong>', 'data-i18n="contact.hero.text" data-i18n-html');
  return html;
});

// --- FAQ ---
patchFile('faq/index.html', (html) => {
  html = setMeta(html, 'meta./faq/.title', 'meta./faq/.description');
  const faq = [
    ['faq.hero.title', '<h1 id="hero-title">', 'data-i18n-html'],
    ['faq.hero.text', '<p>Vous vous posez', 'data-i18n-html'],
    ['faq.list.title', '<h2 class="visually-hidden">', ''],
    ['faq.q1.title', '<h3>Combien coûte', ''],
    ['faq.q1.answer', '<article class="faq-item" id="combien-coute">\n      <h3', ''], // skip
  ];
  html = ins(html, '<h1 id="hero-title">', 'data-i18n="faq.hero.title" data-i18n-html');
  html = ins(html, '<p>Vous vous posez', 'data-i18n="faq.hero.text" data-i18n-html');
  html = ins(html, '<h2 class="visually-hidden">', 'data-i18n="faq.list.title"');
  const qs = [
    ['q1', 'combien-coute', 'Combien coûte'],
    ['q2', 'vitrine-vs-ecommerce', 'Quelle est la différence'],
    ['q3', 'agence-vs-freelance', 'Agence web ou'],
    ['q4', 'refonte', 'Quand faire une refonte'],
    ['q5', 'responsive', 'Un site internet doit-il'],
    ['q6', 'concepteur-developpeur', 'Concepteur de site'],
    ['q7', 'hebergement-domaine', 'Qui gère l'],
    ['q8', 'delais', 'Quels sont les délais'],
    ['q9', 'zone', 'Intervenez-vous seulement'],
    ['q10', 'seo', 'Le référencement Google'],
    ['q11', 'contenus', 'Qui fournit les textes'],
    ['q12', 'paiement', 'Comment fonctionne le paiement'],
    ['q13', 'maintenance', 'Proposez-vous une maintenance'],
    ['q14', 'pourquoi-shopify', 'Pourquoi recommander Shopify'],
    ['q15', 'autonomie', 'Puis-je modifier mon site'],
    ['q16', 'demarrer', 'Comment démarrer un projet'],
  ];
  for (const [q, id, h3start] of qs) {
    const art = `<article class="faq-item" id="${id}">`;
    const ai = html.indexOf(art);
    if (ai === -1) { console.warn('faq art', id); continue; }
    const seg = html.slice(ai, ai + 2500);
    const hi = seg.indexOf('<h3>' + h3start);
    if (hi === -1) { console.warn('faq h3', q); continue; }
    const abs = ai + hi;
    html = html.slice(0, abs) + `<h3 data-i18n="faq.${q}.title">` + html.slice(abs + 4);
    const pi = html.indexOf('<p>', abs);
    if (pi !== -1 && pi < abs + 500) {
      html = html.slice(0, pi) + `<p data-i18n="faq.${q}.answer" data-i18n-html>` + html.slice(pi + 3);
    }
  }
  html = ins(html, '<h2>Une autre question', 'data-i18n="faq.outro.title"');
  html = ins(html, '<p>Écrivez-moi', 'data-i18n="faq.outro.text"');
  html = ins(html, '<a href="/contact/" class="cta">Aller au contact', 'data-i18n="faq.outro.cta"');
  return html;
});

console.log('Batch 1 done');

function tagAttr(tag, key, html = false) {
  const a = html ? ` data-i18n="${key}" data-i18n-html` : ` data-i18n="${key}"`;
  if (tag.endsWith('>')) return tag.slice(0, -1) + a + '>';
  return tag + a;
}

function patchTableCells(html, pairs) {
  for (const [from, key, isHtml] of pairs) {
    const to = from.replace(/^(<\w+[^>]*)(>)/, `$1 data-i18n="${key}"${isHtml ? ' data-i18n-html' : ''}$2`);
    html = rep(html, from, to);
  }
  return html;
}

// --- SHOPIFY ---
patchFile('shopify/index.html', (html) => {
  html = setMeta(html, 'meta./shopify/.title', 'meta./shopify/.description');
  html = ins(html, '<h1 id="hero-title">', 'data-i18n="shopify.hero.title" data-i18n-html');
  html = ins(html, '<p>\n      Création et optimisation', 'data-i18n="shopify.hero.text" data-i18n-html');
  html = ins(html, '<a href="/contact/" class="cta">Parlons de votre projet Shopify', 'data-i18n="shopify.hero.cta"');
  html = ins(html, '<h2>Mes compétences Shopify</h2>', 'data-i18n="shopify.skills.title"');
  html = ins(html, '<h3>Liquid & Templates</h3>', 'data-i18n="shopify.skills.liquid.title" data-i18n-html');
  html = ins(html, '<p>Développement et personnalisation de thèmes Shopify avec Liquid', 'data-i18n="shopify.skills.liquid.text" data-i18n-html');
  html = ins(html, '<h3>Performance & SEO</h3>', 'data-i18n="shopify.skills.seo.title" data-i18n-html');
  html = ins(html, '<p>Optimisation du temps de chargement', 'data-i18n="shopify.skills.seo.text" data-i18n-html');
  html = ins(html, '<h3>Conversion & UX</h3>', 'data-i18n="shopify.skills.conversion.title" data-i18n-html');
  html = ins(html, '<p>Structuration et design orientés conversion', 'data-i18n="shopify.skills.conversion.text" data-i18n-html');
  html = ins(html, '<h3>Intégration Apps & Automatisations</h3>', 'data-i18n="shopify.skills.apps.title" data-i18n-html');
  html = ins(html, '<p>Mise en place d', 'data-i18n="shopify.skills.apps.text" data-i18n-html');
  html = ins(html, '<h2>Pourquoi Shopify plutôt qu', 'data-i18n="shopify.compare.title" data-i18n-html');
  html = ins(html, '<p class="compare-intro">', 'data-i18n="shopify.compare.intro" data-i18n-html');
  html = ins(html, 'aria-label="Tableau comparatif des plateformes e-commerce"', 'data-i18n-attr="aria-label" data-i18n="shopify.compare.region"');
  html = ins(html, '<caption>\n        Synthèse indicative', 'data-i18n="shopify.compare.caption"');
  const sc = [
    ['<th scope="col">Critère</th>', 'shopify.compare.th.criterion'],
    ['<th scope="col" class="col-shopify">Shopify</th>', 'shopify.compare.th.shopify'],
    ['<th scope="col">WooCommerce <span class="compare-sub">(WordPress)</span></th>', 'shopify.compare.th.woocommerce'],
    ['<span class="compare-sub">(WordPress)</span>', 'shopify.compare.th.woocommerce_sub'],
    ['<th scope="col">PrestaShop</th>', 'shopify.compare.th.prestashop'],
    ['<th scope="col">Wix</th>', 'shopify.compare.th.wix'],
    ['<th scope="row">Modèle</th>', 'shopify.compare.row.model'],
    ['<td class="col-shopify">SaaS e-commerce clé en main</td>', 'shopify.compare.row.model.shopify'],
    ['<td>Extension sur WordPress à auto-héberger</td>', 'shopify.compare.row.model.woocommerce'],
    ['<td>Logiciel open source à héberger</td>', 'shopify.compare.row.model.prestashop'],
    ['<td>Constructeur de site tout-en-un</td>', 'shopify.compare.row.model.wix'],
    ['<th scope="row">Hébergement &amp; sécurité</th>', 'shopify.compare.row.hosting'],
    ['<td class="col-shopify">Inclus, mises à jour et SSL gérés par la plateforme</td>', 'shopify.compare.row.hosting.shopify'],
    ['<td>À votre charge&nbsp;: hébergeur, mises à jour WP, thème, conflits d', 'shopify.compare.row.hosting.woocommerce', true],
    ['<td>À votre charge&nbsp;: serveur, modules, veille sécurité</td>', 'shopify.compare.row.hosting.prestashop'],
    ['<td>Inclus dans l', 'shopify.compare.row.hosting.wix', true],
    ['<th scope="row">Mise en ligne</th>', 'shopify.compare.row.launch'],
    ['<td class="col-shopify">Rapide, parcours e-commerce structuré dès le départ</td>', 'shopify.compare.row.launch.shopify'],
    ['<td>Variable&nbsp;: dépend du thème, des plugins et des réglages</td>', 'shopify.compare.row.launch.woocommerce'],
    ['<td>Souvent plus long sans équipe technique dédiée</td>', 'shopify.compare.row.launch.prestashop'],
    ['<td>Très rapide pour un périmètre standard</td>', 'shopify.compare.row.launch.wix'],
    ['<th scope="row">Coûts récurrents</th>', 'shopify.compare.row.cost'],
    ['<td class="col-shopify">Abonnement prévisible + apps / thème au besoin</td>', 'shopify.compare.row.cost.shopify'],
    ['<td>Hébergement + extensions payantes + maintenance régulière</td>', 'shopify.compare.row.cost.woocommerce'],
    ['<td>Hébergement + modules + évolutions techniques</td>', 'shopify.compare.row.cost.prestashop'],
    ['<td>Forfaits + options souvent nécessaires à mesure que le catalogue grossit</td>', 'shopify.compare.row.cost.wix'],
    ['<th scope="row">Paiements &amp; conformité</th>', 'shopify.compare.row.payment'],
    ['<td class="col-shopify">Checkout et PSP intégrés, parcours optimisé pour la vente</td>', 'shopify.compare.row.payment.shopify'],
    ['<td>À assembler (passerelles, conformité, mises à jour des extensions)</td>', 'shopify.compare.row.payment.woocommerce'],
    ['<td>Modules à choisir et maintenir</td>', 'shopify.compare.row.payment.prestashop'],
    ['<td>Intégré, parfois moins flexible sur les scénarios avancés</td>', 'shopify.compare.row.payment.wix'],
    ['<th scope="row">Performance &amp; maintenance</th>', 'shopify.compare.row.perf'],
    ['<td class="col-shopify">Infra mondiale, peu d', 'shopify.compare.row.perf.shopify', true],
    ['<td>Très dépendante du thème, du cache et de la qualité des plugins</td>', 'shopify.compare.row.perf.woocommerce'],
    ['<td>Dépend fortement de l', 'shopify.compare.row.perf.prestashop', true],
    ['<td>Souvent correcte, moins de contrôle fin sur la stack</td>', 'shopify.compare.row.perf.wix'],
    ['<th scope="row">Évolution &amp; pics de charge</th>', 'shopify.compare.row.scale'],
    ['<td class="col-shopify">Montée en charge gérée par le cloud Shopify</td>', 'shopify.compare.row.scale.shopify'],
    ['<td>Limitée par votre hébergement et l', 'shopify.compare.row.scale.woocommerce', true],
    ['<td>Limitée par le serveur et la configuration</td>', 'shopify.compare.row.scale.prestashop'],
    ['<td>Variable selon l', 'shopify.compare.row.scale.wix', true],
    ['<th scope="row">Personnalisation poussée</th>', 'shopify.compare.row.custom'],
    ['<td class="col-shopify">Thèmes Liquid, apps, intégrations — bon équilibre flexibilité / stabilité</td>', 'shopify.compare.row.custom.shopify'],
    ['<td>Très large, au prix d', 'shopify.compare.row.custom.woocommerce', true],
    ['<td>Très personnalisable, expertise dev souvent nécessaire</td>', 'shopify.compare.row.custom.prestashop'],
    ['<td>Limitée aux possibilités du constructeur</td>', 'shopify.compare.row.custom.wix'],
    ['<th scope="row">Cas d', 'shopify.compare.row.usecase', true],
    ['<td class="col-shopify">Vendre en ligne sans équipe IT, focus produit et marketing</td>', 'shopify.compare.row.usecase.shopify'],
    ['<td>Sites déjà sur WordPress avec compétences techniques en interne</td>', 'shopify.compare.row.usecase.woocommerce'],
    ['<td>Gros catalogues avec équipe ou prestataire dédié</td>', 'shopify.compare.row.usecase.prestashop'],
    ['<td>Très petits catalogues, besoin de simplicité extrême</td>', 'shopify.compare.row.usecase.wix'],
  ];
  for (const [from, key, isHtml] of sc) {
    if (html.includes(from) && !html.includes(`data-i18n="${key}"`)) {
      const td = from.match(/^<(\w+)/)[1];
      const to = from.replace(`<${td}`, `<${td} data-i18n="${key}"${isHtml ? ' data-i18n-html' : ''}`);
      html = rep(html, from, to);
    }
  }
  html = ins(html, '<h3>Votre boutique reste la vôtre', 'data-i18n="shopify.compare.outro.title" data-i18n-html');
  html = ins(html, '<p>\n      Au-delà du tableau, un point compte', 'data-i18n="shopify.compare.outro.p1" data-i18n-html');
  html = ins(html, '<p>\n      Concrètement, <strong>vous n', 'data-i18n="shopify.compare.outro.p2" data-i18n-html');
  html = ins(html, '<p>\n      Le rôle d', 'data-i18n="shopify.compare.outro.p3" data-i18n-html');
  html = ins(html, '<h2>À lire sur le blog</h2>', 'data-i18n="shopify.blog.title"');
  html = ins(html, '<p>\n    <a href="/blog/cadence/">Cadence</a> (ma prochaine app', 'data-i18n="shopify.blog.text" data-i18n-html');
  html = ins(html, '<h2>Projets Shopify réalisés</h2>', 'data-i18n="shopify.projects.title"');
  html = ins(html, 'alt="Projet boutique e-commerce"', 'data-i18n-attr="alt" data-i18n="shopify.projects.card1.alt"');
  html = ins(html, '<h3>Boutique e-commerce</h3>', 'data-i18n="shopify.projects.card1.title"');
  html = ins(html, '<p>Accompagnement Shopify sur la durée', 'data-i18n="shopify.projects.card1.text" data-i18n-html');
  html = ins(html, '<h2>Témoignages clients</h2>', 'data-i18n="shopify.testimonials.title"');
  html = ins(html, '<p>"Julien a transformé ma boutique Shopify', 'data-i18n="shopify.testimonials.t1"');
  html = ins(html, '<p>"Travail sur-mesure et support constant', 'data-i18n="shopify.testimonials.t2"');
  html = ins(html, '<h2>Concepteur Shopify freelance : prêt à lancer', 'data-i18n="shopify.cta.title" data-i18n-html');
  html = ins(html, '<p>Que vous soyez artisan, commerçant ou marque premium', 'data-i18n="shopify.cta.text" data-i18n-html');
  html = ins(html, '<a href="/contact/" class="cta">Contactez Julien maintenant', 'data-i18n="shopify.cta.button"');
  return html;
});

console.log('Batch 2 shopify done');

