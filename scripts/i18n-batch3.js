/* Batch 3: sites-vitrines, mentions-legales, blog pages */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function setMeta(html, titleKey, descKey) {
  if (!html.includes(`data-i18n="${titleKey}"`)) {
    html = html.replace(/<title>([^<]*)<\/title>/, `<title data-i18n="${titleKey}">$1</title>`);
  }
  if (!html.includes(`data-i18n="${descKey}"`)) {
    html = html.replace(/<meta name="description" content="([^"]*)"(\s*\/?>)/, `<meta name="description" data-i18n="${descKey}" content="$1"$2`);
  }
  return html;
}

function ins(html, start, attr) {
  const i = html.indexOf(start);
  if (i === -1) return html;
  const chunk = html.slice(i, i + 120);
  if (chunk.includes('data-i18n')) return html;
  const m = chunk.match(/^<[\w-]+/);
  if (!m) return html;
  return html.slice(0, i) + m[0] + ' ' + attr + html.slice(i + m[0].length);
}

function rep(html, from, to) {
  if (!html.includes(from)) return html;
  return html.split(from).join(to);
}

function patch(rel, fn) {
  const fp = path.join(ROOT, rel);
  let html = fn(fs.readFileSync(fp, 'utf8'));
  fs.writeFileSync(fp, html);
  console.log('OK', rel);
}

function addCell(html, from, key, htmlAttr) {
  if (!html.includes(from) || html.includes(`data-i18n="${key}"`)) return html;
  const m = from.match(/^<(\w+)/);
  if (!m) return html;
  const to = from.replace(`<${m[1]}`, `<${m[1]} data-i18n="${key}"${htmlAttr ? ' data-i18n-html' : ''}`);
  return rep(html, from, to);
}

function many(html, items) {
  for (const [start, key, h] of items) {
    html = ins(html, start, `data-i18n="${key}"${h ? ' data-i18n-html' : ''}`);
  }
  return html;
}

// SITES VITRINES
patch('sites-vitrines/index.html', (html) => {
  html = setMeta(html, 'meta./sites-vitrines/.title', 'meta./sites-vitrines/.description');
  html = many(html, [
    ['<h1 id="hero-title">', 'sites_vitrines.hero.title', 1],
    ['<p>Freelance web à <strong>Auch</strong>', 'sites_vitrines.hero.text', 1],
    ['<a href="/contact/" class="cta">Parler de votre projet', 'sites_vitrines.hero.cta', 0],
    ['<h2>Des sites vitrines pensés pour convaincre</h2>', 'sites_vitrines.services.title', 0],
    ['<h3>Design immersif</h3>', 'sites_vitrines.services.design.title', 0],
    ['<p>Un design sur mesure, aligné avec votre image', 'sites_vitrines.services.design.text', 1],
    ['<h3>SEO local</h3>', 'sites_vitrines.services.seo.title', 0],
    ['<p>Une structure propre et optimisée', 'sites_vitrines.services.seo.text', 1],
    ['<h3>Animations avancées</h3>', 'sites_vitrines.services.animations.title', 0],
    ['<p>Des animations légères et élégantes', 'sites_vitrines.services.animations.text', 1],
    ['<h3>Responsive & Mobile</h3>', 'sites_vitrines.services.responsive.title', 1],
    ['<p>Un site parfaitement adapté à tous les écrans', 'sites_vitrines.services.responsive.text', 1],
    ['<h2>Pourquoi un site vitrine sur mesure plutôt qu', 'sites_vitrines.compare.title', 1],
    ['<p class="compare-intro">', 'sites_vitrines.compare.intro', 1],
  ]);
  html = rep(html, 'role="region" aria-label="Tableau comparatif des approches pour un site vitrine"', 'role="region" data-i18n-attr="aria-label" data-i18n="sites_vitrines.compare.region" aria-label="Tableau comparatif des approches pour un site vitrine"');
  html = many(html, [
    ['<caption>\n        Synthèse indicative pour indépendants', 'sites_vitrines.compare.caption', 0],
    ['<h3>Une vitrine qui vous appartient', 'sites_vitrines.compare.outro.title', 1],
    ['<p>\n      Avec un site statique sur mesure, l', 'sites_vitrines.compare.outro.p1', 1],
    ['<p>\n      Pour les textes, visuels ou sections nouvelles', 'sites_vitrines.compare.outro.p2', 1],
    ['<p>\n      En résumé&nbsp;: vous n', 'sites_vitrines.compare.outro.p3', 1],
    ['<h2>Quelques projets récents</h2>', 'sites_vitrines.projects.title', 0],
    ['alt="Projet 2"', 'sites_vitrines.projects.card1.alt', 0],
    ['<h3>Les mains nomades</h3>', 'sites_vitrines.projects.card1.title', 0],
    ['<p>Développement d', 'sites_vitrines.projects.card1.text', 1],
    ['<h2>Ils m', 'sites_vitrines.testimonials.title', 0],
    ['<p>"Un site clair, moderne et professionnel', 'sites_vitrines.testimonials.t1', 0],
    ['<p>"Très bonne compréhension de mes besoins', 'sites_vitrines.testimonials.t2', 0],
    ['<h2>Envie d', 'sites_vitrines.cta.title', 0],
    ['<a href="/contact/" class="cta">Discutons de votre projet', 'sites_vitrines.cta.button', 0],
  ]);
  const sv = [
    ['<th scope="col">Critère</th>', 'sites_vitrines.compare.th.criterion'],
    ['<th scope="col" class="col-recommended">Site statique sur mesure</th>', 'sites_vitrines.compare.th.custom'],
    ['<th scope="col">Webflow / Framer <span class="compare-sub">no-code avancé</span></th>', 'sites_vitrines.compare.th.webflow'],
    ['<span class="compare-sub">no-code avancé</span>', 'sites_vitrines.compare.th.webflow_sub'],
    ['<th scope="col">WordPress <span class="compare-sub">+ thème / page builder</span></th>', 'sites_vitrines.compare.th.wordpress'],
    ['<span class="compare-sub">+ thème / page builder</span>', 'sites_vitrines.compare.th.wordpress_sub'],
    ['<th scope="col">Wix / Squarespace <span class="compare-sub">constructeurs</span></th>', 'sites_vitrines.compare.th.wix'],
    ['<span class="compare-sub">constructeurs</span>', 'sites_vitrines.compare.th.wix_sub'],
    ['<th scope="row">Philosophie</th>', 'sites_vitrines.compare.row.philosophy'],
    ['<td class="col-recommended">HTML, CSS et JavaScript ciblés', 'sites_vitrines.compare.row.philosophy.custom', 1],
    ['<td>Design poussé dans un éditeur visuel', 'sites_vitrines.compare.row.philosophy.webflow', 1],
    ['<td>Site dynamique avec base de données', 'sites_vitrines.compare.row.philosophy.wordpress', 1],
    ['<td>Tout-en-un hébergé, gabarits et modules', 'sites_vitrines.compare.row.philosophy.wix', 1],
    ['<th scope="row">Performance</th>', 'sites_vitrines.compare.row.performance'],
    ['<td class="col-recommended">Très rapide&nbsp;: peu de requêtes', 'sites_vitrines.compare.row.performance.custom', 1],
    ['<th scope="row">Sécurité &amp; maintenance</th>', 'sites_vitrines.compare.row.security'],
    ['<th scope="row">Coût dans le temps</th>', 'sites_vitrines.compare.row.cost'],
    ['<th scope="row">SEO &amp; structure</th>', 'sites_vitrines.compare.row.seo'],
    ['<th scope="row">Liberté de design</th>', 'sites_vitrines.compare.row.design'],
    ['<th scope="row">Propriété &amp; portabilité</th>', 'sites_vitrines.compare.row.ownership'],
    ['<th scope="row">Mise à jour des contenus</th>', 'sites_vitrines.compare.row.updates'],
    ['<th scope="row">Cas d', 'sites_vitrines.compare.row.usecase', 1],
  ];
  for (const row of sv) html = addCell(html, row[0], row[1], row[2]);
  // remaining td cells by unique content
  const svTd = [
    ['<td>Bonne si bien optimisée, mais charge JS/CSS souvent élevée</td>', 'sites_vitrines.compare.row.performance.webflow'],
    ['<td>Variable&nbsp;: dépend du thème, du nombre de plugins et du cache</td>', 'sites_vitrines.compare.row.performance.wordpress'],
    ['<td>Souvent correcte, parfois limitée par le gabarit', 'sites_vitrines.compare.row.performance.wix', 1],
    ['<td class="col-recommended">Surface d', 'sites_vitrines.compare.row.security.custom', 1],
    ['<td>Dépend de la plateforme ; veille sur les projets', 'sites_vitrines.compare.row.security.webflow', 1],
    ['<td>Mises à jour WP, thème et plugins à suivre', 'sites_vitrines.compare.row.security.wordpress', 1],
    ['<td>Gérée par l', 'sites_vitrines.compare.row.security.wix', 1],
    ['<td class="col-recommended">Hébergement léger (souvent très abordable)', 'sites_vitrines.compare.row.cost.custom', 1],
    ['<td>Abonnements éditeur souvent élevés', 'sites_vitrines.compare.row.cost.webflow', 1],
    ['<td>Hébergement + extensions payantes + temps passé', 'sites_vitrines.compare.row.cost.wordpress', 1],
    ['<td>Forfaits mensuels ou annuels, options souvent facturées', 'sites_vitrines.compare.row.cost.wix', 1],
    ['<td class="col-recommended">Balises et contenu maîtrisés de bout en bout', 'sites_vitrines.compare.row.seo.custom', 1],
    ['<td>Contrôle fin possible, mais discipline nécessaire', 'sites_vitrines.compare.row.seo.webflow', 1],
    ['<td>Très bon si bien configuré ; risque de lenteur', 'sites_vitrines.compare.row.seo.wordpress', 1],
    ['<td>Correct pour l', 'sites_vitrines.compare.row.seo.wix', 1],
    ['<td class="col-recommended">Design unique, sans être enfermé', 'sites_vitrines.compare.row.design.custom', 1],
    ['<td>Très créatif dans l', 'sites_vitrines.compare.row.design.webflow', 1],
    ['<td>Large choix de thèmes ; personnalisation poussée', 'sites_vitrines.compare.row.design.wordpress', 1],
    ['<td>Limitée aux blocs et styles proposés par le constructeur</td>', 'sites_vitrines.compare.row.design.wix'],
    ['<td class="col-recommended">Vous possédez les fichiers', 'sites_vitrines.compare.row.ownership.custom', 1],
    ['<td>Souvent lié à l', 'sites_vitrines.compare.row.ownership.webflow', 1],
    ['<td>Export possible mais migration souvent délicate</td>', 'sites_vitrines.compare.row.ownership.wordpress'],
    ['<td>Lock-in fort&nbsp;: quitter la plateforme', 'sites_vitrines.compare.row.ownership.wix', 1],
    ['<td class="col-recommended">Pas de tableau de bord intégré', 'sites_vitrines.compare.row.updates.custom', 1],
    ['<td>Édition dans l', 'sites_vitrines.compare.row.updates.webflow', 1],
    ['<td>Interface d', 'sites_vitrines.compare.row.updates.wordpress', 1],
    ['<td>Édition visuelle simple pour les textes et images courants</td>', 'sites_vitrines.compare.row.updates.wix'],
    ['<td class="col-recommended">Image de marque, offre claire', 'sites_vitrines.compare.row.usecase.custom', 1],
    ['<td>Équipes design qui itèrent souvent', 'sites_vitrines.compare.row.usecase.webflow', 1],
    ['<td>Blog actif, nombreuses pages', 'sites_vitrines.compare.row.usecase.wordpress', 1],
    ['<td>Mise en ligne très rapide avec peu d', 'sites_vitrines.compare.row.usecase.wix', 1],
  ];
  for (const row of svTd) html = addCell(html, row[0], row[1], row[2]);
  return html;
});

// MENTIONS LEGALES
patch('mentions-legales/index.html', (html) => {
  html = setMeta(html, 'meta./mentions-legales/.title', 'meta./mentions-legales/.description');
  html = many(html, [
    ['<h1 id="hero-title">Mentions légales</h1>', 'mentions_legales.hero.title', 0],
    ['<p>Merci de lire attentivement', 'mentions_legales.hero.text', 0],
    ['<h2>Éditeur du site</h2>', 'mentions_legales.editor.title', 0],
    ['<p><strong>Julien BRAZZALOTTO</strong><br>\n       Numéro de SIRET', 'mentions_legales.editor.text', 1],
    ['<h2>Hébergement</h2>', 'mentions_legales.hosting.title', 0],
    ['<p><strong>GitHub, Inc.</strong><br>', 'mentions_legales.hosting.text', 1],
    ['<h2>Développement</h2>', 'mentions_legales.development.title', 0],
    ['<p><strong>Brazzalotto Julien</strong><br>', 'mentions_legales.development.text', 1],
    ['<h2>Conditions d', 'mentions_legales.terms.title', 0],
    ['<p>Le site www.jbdevweb.fr est proposé', 'mentions_legales.terms.p1', 0],
    ['<p><strong>Cookies :</strong> Le site peut vous demander', 'mentions_legales.terms.cookies', 1],
    ['<p><strong>Liens hypertextes :</strong> Le site de Julien Brazzalotto', 'mentions_legales.terms.links', 1],
    ['<h2>Services fournis</h2>', 'mentions_legales.services.title', 0],
    ['<p>Les informations sur le site sont données sous réserve', 'mentions_legales.services.text', 0],
    ['<h2>Limitation contractuelles sur les données</h2>', 'mentions_legales.data_limit.title', 0],
    ['<p>Les informations sont fournies aussi précisément', 'mentions_legales.data_limit.text', 0],
    ['<h2>Propriété intellectuelle</h2>', 'mentions_legales.ip.title', 0],
    ['<p>Tout contenu (textes, images, logos', 'mentions_legales.ip.text', 0],
    ['<h2>Déclaration à la CNIL</h2>', 'mentions_legales.cnil.title', 0],
    ['<p>Conformément à la loi informatique et libertés', 'mentions_legales.cnil.text', 0],
    ['<h2>Litiges</h2>', 'mentions_legales.disputes.title', 0],
    ['<p>Le site est soumis aux lois françaises', 'mentions_legales.disputes.text', 0],
    ['<h2>Données personnelles</h2>', 'mentions_legales.privacy.title', 0],
    ['<p>Des données peuvent être collectées automatiquement', 'mentions_legales.privacy.text', 0],
  ]);
  return html;
});

console.log('Batch 3a done');
