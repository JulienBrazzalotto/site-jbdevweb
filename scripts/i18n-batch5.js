/* Batch 5: blog article pages */
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
  if (i === -1) return html;
  const chunk = html.slice(i, i + 150);
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
  fs.writeFileSync(path.join(ROOT, rel), fn(fs.readFileSync(path.join(ROOT, rel), 'utf8')));
  console.log('OK', rel);
}

patch('blog/cadence/index.html', (html) => {
  html = setMeta(html, 'meta./blog/cadence/.title', 'meta./blog/cadence/.description');
  html = many(html, [
    ['<h1 id="hero-title"><span>Cadence</span>', 'blog.cadence.hero.title', 1],
    ['<p>\n      Nouvelle app Shopify dans la catégorie <strong>gestion de boutique</strong>', 'blog.cadence.hero.text', 1],
    ['<span>Avancement du développement</span>', 'blog.cadence.progress.label', 0],
    ['aria-label="Avancement du développement de Cadence"', 'blog.cadence.progress.aria', 0],
    ['<p class="blog-kicker">L\'essentiel</p>', 'blog.cadence.s1.kicker', 0],
    ['<h2>Ce que je peux dire pour l\'instant</h2>', 'blog.cadence.s1.title', 0],
    ['<li><strong>Nom :</strong> Cadence.</li>', 'blog.cadence.s1.li1', 1],
    ['<li><strong>Plateforme :</strong> Shopify', 'blog.cadence.s1.li2', 1],
    ['<li><strong>Catégorie :</strong> Gestion de boutique.</li>', 'blog.cadence.s1.li3', 1],
    ['<li><strong>Pour qui :</strong> tout marchand Shopify', 'blog.cadence.s1.li4', 1],
    ['<li><strong>Avancement :</strong> 70%.</li>', 'blog.cadence.s1.li5', 1],
    ['<li><strong>Sortie estimée :</strong> d\'ici l\'été 2026.</li>', 'blog.cadence.s1.li6', 1],
    ['<p>\n    Le reste — les fonctionnalités précises', 'blog.cadence.s1.p', 0],
    ['<p class="blog-kicker">Avancement</p>', 'blog.cadence.s2.kicker', 0],
    ['<h2>Où j\'en suis</h2>', 'blog.cadence.s2.title', 0],
    ['<p>\n    Le projet est en <strong>développement actif</strong>', 'blog.cadence.s2.p', 1],
    ['<span>Avancement global</span>', 'blog.cadence.s2.progress.label', 0],
    ['aria-label="Avancement global de Cadence"', 'blog.cadence.s2.progress.aria', 0],
    ['<li class="done"><strong>Architecture &amp; cœur métier</strong>', 'blog.cadence.s2.roadmap1', 1],
    ['<li class="done"><strong>Auth embarquée &amp; conformité App Store</strong>', 'blog.cadence.s2.roadmap2', 1],
    ['<li class="done"><strong>Fonctions principales</strong>', 'blog.cadence.s2.roadmap3', 1],
    ['<li class="doing"><strong>Interface marchand</strong>', 'blog.cadence.s2.roadmap4', 1],
    ['<li class="doing"><strong>Tests réels sur boutiques pilotes</strong>', 'blog.cadence.s2.roadmap5', 1],
    ['<li class="todo"><strong>Plans tarifaires et page App Store</strong>', 'blog.cadence.s2.roadmap6', 1],
    ['<li class="todo"><strong>Soumission Shopify App Store</strong>', 'blog.cadence.s2.roadmap7', 1],
    ['<p class="blog-kicker">Pourquoi en parler maintenant</p>', 'blog.cadence.s3.kicker', 0],
    ['<h2>Annoncer sans dévoiler</h2>', 'blog.cadence.s3.title', 0],
    ['<p>\n    Je travaille en solo, sans budget marketing', 'blog.cadence.s3.p1', 1],
    ['<p>\n    Le détail des fonctionnalités', 'blog.cadence.s3.p2', 1],
    ['<p>\n    Si vous voulez être averti à la sortie', 'blog.cadence.s3.p3', 1],
    ['<h2>Pour aller plus loin</h2>', 'blog.cadence.s4.title', 0],
    ['<p>\n    En attendant Cadence, d\'autres lectures', 'blog.cadence.s4.p', 0],
    ['<li><a href="/blog/stock-transfert-pro-shopify/">Stock Transfert Pro</a>', 'blog.cadence.s4.li1', 1],
    ['<li><a href="/blog/tarif-site-shopify-2026/">Tarif Shopify France 2026</a>', 'blog.cadence.s4.li2', 1],
    ['<li><a href="/blog/comparatif-shopify-wix-prestashop-2026/">Shopify, Wix ou Prestashop', 'blog.cadence.s4.li3', 1],
    ['<li><a href="/blog/magasin-physique-boutique-en-ligne/">Magasin physique en ligne', 'blog.cadence.s4.li4', 1],
    ['<a class="cta" href="/blog/">Retour au blog</a>', 'blog.cadence.s4.cta', 0],
  ]);
  return html;
});

patch('blog/stock-transfert-pro-shopify/index.html', (html) => {
  html = setMeta(html, 'meta./blog/stock-transfert-pro-shopify/.title', 'meta./blog/stock-transfert-pro-shopify/.description');
  html = many(html, [
    ['<h1 id="hero-title">Stock Transfert Pro', 'blog.stp.hero.title', 1],
    ['<p>\n      Disponible sur le <strong>Shopify App Store depuis le 3 juin 2026</strong>', 'blog.stp.hero.text', 1],
    ['>Voir l\'app sur le Shopify App Store</a>', 'blog.stp.hero.cta_app', 0],
    ['>Parler de votre projet Shopify</a>', 'blog.stp.hero.cta_contact', 0],
    ['<p class="blog-kicker">Pourquoi cette app</p>', 'blog.stp.s1.kicker', 0],
    ['<h2>Combler le vide laissé par Stocky</h2>', 'blog.stp.s1.title', 0],
    ['<p>\n    <strong>Stocky</strong>, l\'app d\'inventaire historique', 'blog.stp.s1.p1', 1],
    ['<p>\n    <strong>Stock Transfert Pro</strong> répond à ce besoin précis', 'blog.stp.s1.p2', 1],
    ['<p class="blog-kicker">Workflow</p>', 'blog.stp.s2.kicker', 0],
    ['<h2>Transferts manuels avec un cycle d\'état clair</h2>', 'blog.stp.s2.title', 0],
    ['<p>\n    Chaque transfert relie deux <strong>emplacements Shopify</strong>', 'blog.stp.s2.p1', 1],
    ['<p>\n    Les <strong>réceptions partielles</strong> sont gérées nativement', 'blog.stp.s2.p2', 1],
    ['<h2>Brouillons intelligents : moins de calcul à la main</h2>', 'blog.stp.s3.title', 0],
    ['<p>\n    Au-delà du manuel, l\'app propose deux moteurs', 'blog.stp.s3.p1', 0],
    ['<li><strong>D\'après les ventes</strong>', 'blog.stp.s3.li1', 1],
    ['<li><strong>D\'après des objectifs de stock</strong>', 'blog.stp.s3.li2', 1],
    ['<p>\n    L\'utilisateur reste maître : un brouillon généré', 'blog.stp.s3.p2', 0],
    ['<h2>Réception en point de vente, interface multilingue</h2>', 'blog.stp.s4.title', 0],
    ['<p>\n    Une vue <strong>optimisée mobile</strong>', 'blog.stp.s4.p1', 1],
    ['<p>\n    L\'interface est traduite en <strong>5 langues</strong>', 'blog.stp.s4.p2', 1],
    ['<p class="blog-kicker">Au-delà des transferts</p>', 'blog.stp.s5.kicker', 0],
    ['<h2>Prévisions, alertes et IA (plans Pro et Pro+)</h2>', 'blog.stp.s5.title', 0],
    ['<p>\n    Le plan <strong>Pro</strong> ajoute une prévision', 'blog.stp.s5.p1', 1],
    ['<p>\n    Le plan <strong>Pro+</strong> va plus loin', 'blog.stp.s5.p2', 0],
    ['<li>Prévision <strong>multi-horizon</strong>', 'blog.stp.s5.li1', 1],
    ['<li>Moteur statistique <strong>EWMA', 'blog.stp.s5.li2', 1],
    ['<li>Indicateur de <strong>chiffre d\'affaires à risque</strong>', 'blog.stp.s5.li3', 1],
    ['<li>Alertes par <strong>e-mail</strong>', 'blog.stp.s5.li4', 1],
    ['<li>Option <strong>IA LLM BYOK</strong>', 'blog.stp.s5.li5', 1],
    ['<p class="blog-kicker">Tarifs</p>', 'blog.stp.s6.kicker', 0],
    ['<h2>Trois plans, un essai gratuit de 14 jours</h2>', 'blog.stp.s6.title', 0],
    ['<p>\n    Tous les plans sont facturés en USD', 'blog.stp.s6.p', 1],
    ['<h3>Starter</h3>', 'blog.stp.pricing.starter.title', 0],
    ['<div class="pricing-price">12 $<small>/mois</small></div>', 'blog.stp.pricing.starter.price', 0],
    ['<p class="pricing-trial">Essai 14 jours</p>', 'blog.stp.pricing.trial', 0],
    ['<li>Jusqu\'à 2 emplacements</li>', 'blog.stp.pricing.starter.f1', 0],
    ['<li>Transferts manuels (création, envoi, réception)</li>', 'blog.stp.pricing.starter.f2', 0],
    ['<li>Extension POS (numérisation, validation)</li>', 'blog.stp.pricing.starter.f3', 0],
    ['<li>Brouillons intelligents d\'après les ventes</li>', 'blog.stp.pricing.starter.f4', 0],
    ['<li>Interface en 5 langues</li>', 'blog.stp.pricing.starter.f5', 0],
    ['<li>Journal d\'audit complet</li>', 'blog.stp.pricing.starter.f6', 0],
    ['<li>Réception partielle, écarts et notes</li>', 'blog.stp.pricing.starter.f7', 0],
    ['<li>Assistance par e-mail</li>', 'blog.stp.pricing.starter.f8', 0],
    ['<span class="pricing-badge">Recommandé</span>', 'blog.stp.pricing.badge', 0],
    ['<div class="pricing-card is-featured">\n      <span class="pricing-badge">Recommandé</span>\n      <h3>Pro</h3>', 'blog.stp.pricing.pro.title', 0],
    ['<div class="pricing-price">57 $<small>/mois</small></div>', 'blog.stp.pricing.pro.price', 0],
    ['<li>Toutes les fonctionnalités Starter</li>', 'blog.stp.pricing.pro.f1', 0],
    ['<li>Emplacements illimités</li>', 'blog.stp.pricing.pro.f2', 0],
    ['<li>Objectifs de stock par emplacement</li>', 'blog.stp.pricing.pro.f3', 0],
    ['<li>Transferts intelligents basés sur les stocks</li>', 'blog.stp.pricing.pro.f4', 0],
    ['<li>Prévision des stocks à 30 jours</li>', 'blog.stp.pricing.pro.f5', 0],
    ['<li>Résumé quotidien des alertes par e-mail</li>', 'blog.stp.pricing.pro.f6', 0],
    ['<li>Historique des ventes sur 90 jours</li>', 'blog.stp.pricing.pro.f7', 0],
    ['<h3>Pro +</h3>', 'blog.stp.pricing.proplus.title', 0],
    ['<div class="pricing-price">116 $<small>/mois</small></div>', 'blog.stp.pricing.proplus.price', 0],
    ['<li>Toutes les fonctionnalités Pro</li>', 'blog.stp.pricing.proplus.f1', 0],
    ['<li>Prévision multi-horizon (14 / 30 / 60 jours)</li>', 'blog.stp.pricing.proplus.f2', 0],
    ['<li>Prévision par emplacement (POS + entrepôt)</li>', 'blog.stp.pricing.proplus.f3', 0],
    ['<li>EWMA + saisonnalité + événements multi-pays</li>', 'blog.stp.pricing.proplus.f4', 0],
    ['<li>Chiffre d\'affaires à risque + tendance</li>', 'blog.stp.pricing.proplus.f5', 0],
    ['<li>Alertes e-mail (quotidiennes / hebdo / immédiates)</li>', 'blog.stp.pricing.proplus.f6', 0],
    ['<li>Alertes Slack</li>', 'blog.stp.pricing.proplus.f7', 0],
    ['<li>IA LLM BYOK (OpenAI / Anthropic / Gemini)</li>', 'blog.stp.pricing.proplus.f8', 0],
    ['>Voir sur le Shopify App Store</a>', 'blog.stp.s6.cta_app', 0],
    ['>Une question sur le bon plan ?</a>', 'blog.stp.s6.cta_plan', 0],
    ['<p class="blog-kicker">Côté technique</p>', 'blog.stp.s7.kicker', 0],
    ['<h2>Stack et compatibilité</h2>', 'blog.stp.s7.title', 0],
    ['<p>\n    L\'app est construite avec <strong>Remix</strong>', 'blog.stp.s7.p', 1],
    ['<p>\n    Si la question du stock se pose pour vous', 'blog.stp.s8.p', 0],
    ['<li><a href="/blog/magasin-physique-boutique-en-ligne/">Magasin physique en ligne', 'blog.stp.s8.li1', 1],
    ['<li><a href="/blog/comparatif-shopify-wix-prestashop-2026/">Shopify, Wix ou Prestashop', 'blog.stp.s8.li2', 1],
    ['<li><a href="/blog/tarif-site-shopify-2026/">Tarif Shopify France 2026</a>', 'blog.stp.s8.li3', 1],
    ['>Installer Stock Transfert Pro</a>', 'blog.stp.s8.cta_install', 0],
    ['<a href="/blog/" class="cta-secondary">Retour au blog</a>', 'blog.stp.s8.cta_blog', 0],
  ]);
  html = ins(html, '<h2>Pour aller plus loin</h2>', 'data-i18n="blog.stp.s8.title"');
  return html;
});

console.log('batch5 partial');

patch('blog/tarif-site-shopify-2026/index.html', (html) => {
  html = setMeta(html, 'meta./blog/tarif-site-shopify-2026/.title', 'meta./blog/tarif-site-shopify-2026/.description');
  html = many(html, [
    ['<h1 id="hero-title">Tarif <span>Shopify</span>', 'blog.tarif.hero.title', 1],
    ['<p>\n      Abonnement, commissions Shopify Payments', 'blog.tarif.hero.text', 0],
    ['<a href="/contact/" class="cta">Demander un devis</a>', 'blog.tarif.hero.cta', 0],
    ['<p class="blog-kicker">Aperçu rapide</p>', 'blog.tarif.s1.kicker', 0],
    ['<h2>Tarif Shopify France 2026 — résumé des plans</h2>', 'blog.tarif.s1.title', 0],
    ['<p>\n    Les <strong>tarifs Shopify France 2026</strong>', 'blog.tarif.s1.p1', 1],
    ['<li><strong>Starter</strong> — 5 €/mois</li>', 'blog.tarif.s1.li1', 1],
    ['<li><strong>Basic</strong> — 33 €/mois</li>', 'blog.tarif.s1.li2', 1],
    ['<li><strong>Grow</strong> — 88 €/mois</li>', 'blog.tarif.s1.li3', 1],
    ['<li><strong>Advanced</strong> — 384 €/mois</li>', 'blog.tarif.s1.li4', 1],
    ['<li><strong>Plus</strong> — à partir de 2 100 €/mois</li>', 'blog.tarif.s1.li5', 1],
    ['<p>\n    <strong>Shopify Payments</strong> en France', 'blog.tarif.s1.p2', 1],
    ['<p class="blog-kicker">Avant les chiffres</p>', 'blog.tarif.s2.kicker', 0],
    ['<h2>Comment lire un prix Shopify honnêtement</h2>', 'blog.tarif.s2.title', 0],
    ['<p>\n    Un projet Shopify ne se résume pas', 'blog.tarif.s2.p1', 0],
    ['<li><strong>Plateforme</strong> : abonnement Shopify', 'blog.tarif.s2.li1', 1],
    ['<li><strong>Habillage</strong> : nom de domaine', 'blog.tarif.s2.li2', 1],
    ['<li><strong>Outils</strong> : applications de l', 'blog.tarif.s2.li3', 1],
    ['<li><strong>Prestation</strong> : votre temps', 'blog.tarif.s2.li4', 1],
    ['<p>\n    Tout devis qui n\'aborde que la première ligne', 'blog.tarif.s2.p2', 0],
    ['<h2>Les abonnements Shopify en 2026 (France, mensuel)</h2>', 'blog.tarif.s3.title', 0],
    ['<p>\n    Tarifs publics observés en France', 'blog.tarif.s3.p1', 1],
    ['<li><strong>Starter</strong> — 5 €/mois : pour vendre via réseaux', 'blog.tarif.s3.li1', 1],
    ['<li><strong>Basic</strong> — 33 €/mois : pour démarrer une boutique', 'blog.tarif.s3.li2', 1],
    ['<li><strong>Grow</strong> (ex « Shopify ») — 88 €/mois', 'blog.tarif.s3.li3', 1],
    ['<li><strong>Advanced</strong> — 384 €/mois : pour des volumes importants', 'blog.tarif.s3.li4', 1],
    ['<li><strong>Plus</strong> — à partir de 2 100 €/mois : marques', 'blog.tarif.s3.li5', 1],
    ['<p>\n    Pour 90 % des commerçants qui démarrent', 'blog.tarif.s3.p2', 1],
    ['<h2>Commissions de paiement en France</h2>', 'blog.tarif.s4.title', 0],
    ['<p>\n    Si vous utilisez <strong>Shopify Payments</strong>', 'blog.tarif.s4.p1', 0],
    ['<li>Cartes <strong>nationales</strong> et <strong>EEE</strong>', 'blog.tarif.s4.li1', 1],
    ['<li><strong>American Express</strong> et cartes <strong>internationales</strong>', 'blog.tarif.s4.li2', 1],
    ['<p>\n    Si vous passez par un <strong>prestataire tiers</strong>', 'blog.tarif.s4.p2', 1],
    ['<h2>Domaine, thème, apps : les coûts annexes</h2>', 'blog.tarif.s5.title', 0],
    ['<p>\n    Tous les projets ne facturent pas ces lignes', 'blog.tarif.s5.p1', 0],
    ['<li><strong>Nom de domaine</strong> : 10 à 30 €/an', 'blog.tarif.s5.li1', 1],
    ['<li><strong>Thème</strong> : gratuit (Dawn, Sense…)', 'blog.tarif.s5.li2', 1],
    ['<li><strong>Apps</strong> : compter <strong>20 à 200 €/mois</strong>', 'blog.tarif.s5.li3', 1],
    ['<li><strong>Photos &amp; contenus</strong> : souvent sous-estimé', 'blog.tarif.s5.li4', 1],
    ['<p class="blog-kicker">Prestation</p>', 'blog.tarif.s6.kicker', 0],
    ['<h2>Tarifs freelance : fourchettes réalistes en 2026</h2>', 'blog.tarif.s6.title', 0],
    ['<p>\n    Les chiffres ci-dessous correspondent', 'blog.tarif.s6.p1', 0],
    ['<li><strong>Site Shopify simple, à périmètre défini</strong>', 'blog.tarif.s6.li1', 1],
    ['<li><strong>Boutique sur mesure ou refonte</strong>', 'blog.tarif.s6.li2', 1],
    ['<li><strong>Projets complexes</strong>', 'blog.tarif.s6.li3', 1],
    ['<li><strong>Interventions ponctuelles</strong>', 'blog.tarif.s6.li4', 1],
    ['<p>\n    Les profils <strong>très bas de gamme</strong> existent', 'blog.tarif.s6.p2', 1],
    ['<h2>Trois scénarios de coût total sur la première année</h2>', 'blog.tarif.s7.title', 0],
    ['<p>\n    Hors photos / vidéos professionnelles', 'blog.tarif.s7.p1', 0],
    ['<p>\n    <strong>Démarrage discount</strong>', 'blog.tarif.s7.p2', 1],
    ['<p>\n    <strong>Démarrage propre avec freelance</strong>', 'blog.tarif.s7.p3', 1],
    ['<p>\n    <strong>Boutique sur mesure / refonte</strong>', 'blog.tarif.s7.p4', 1],
    ['<h2>Cinq pièges fréquents qui gonflent la facture</h2>', 'blog.tarif.s8.title', 0],
    ['<li><strong>Empiler les apps</strong> sans audit', 'blog.tarif.s8.li1', 1],
    ['<li>Ne pas activer <strong>Shopify Payments</strong> en France', 'blog.tarif.s8.li2', 1],
    ['<li>Choisir un <strong>thème surchargé</strong>', 'blog.tarif.s8.li3', 1],
    ['<li>Ne pas prévoir de <strong>budget post-lancement</strong>', 'blog.tarif.s8.li4', 1],
    ['<li>Confondre <strong>« pas cher au lancement »</strong>', 'blog.tarif.s8.li5', 1],
    ['<h2>Comment se déroule l\'établissement d\'un devis Shopify</h2>', 'blog.tarif.s9.title', 0],
    ['<p>\n    En pratique, le processus se déroule en deux étapes', 'blog.tarif.s9.p1', 0],
    ['<li><strong>Premier échange (30-45 min)</strong>', 'blog.tarif.s9.li1', 1],
    ['<li><strong>Devis détaillé écrit</strong>', 'blog.tarif.s9.li2', 1],
    ['<p>\n    Le but n\'est pas d\'aller au plus haut', 'blog.tarif.s9.p2', 0],
    ['<h2>Questions fréquentes</h2>', 'blog.tarif.s10.title', 0],
    ['<strong>Combien coûte un site Shopify minimum par mois en 2026 ?</strong>', 'blog.tarif.s10.q1', 0],
    ['Le plan <strong>Basic</strong> est à <strong>33 €/mois</strong> en facturation mensuelle', 'blog.tarif.s10.a1', 1],
    ['<strong>Quel budget freelance prévoir pour la création', 'blog.tarif.s10.q2', 0],
    ['Pour un projet sérieux, on observe en France', 'blog.tarif.s10.a2', 1],
    ['<strong>Quelles sont les commissions Shopify Payments en France ?</strong>', 'blog.tarif.s10.q3', 0],
    ['Environ <strong>1,0 % + 0,25 €</strong> sur les cartes nationales', 'blog.tarif.s10.a3', 1],
    ['<strong>Y a-t-il des frais en plus si je n\'utilise pas Shopify Payments ?</strong>', 'blog.tarif.s10.q4', 0],
    ['Oui : Shopify ajoute des frais de transaction', 'blog.tarif.s10.a4', 1],
    ['<h2>Pour aller plus loin</h2>', 'blog.tarif.s11.title', 0],
    ['<p>\n    Avant de comparer des devis, l\'enjeu est souvent', 'blog.tarif.s11.p', 0],
    ['<li><a href="/blog/comparatif-shopify-wix-prestashop-2026/">Shopify, Wix ou Prestashop', 'blog.tarif.s11.li1', 1],
    ['<li><a href="/blog/magasin-physique-boutique-en-ligne/">Magasin physique', 'blog.tarif.s11.li2', 1],
    ['<li><a href="/blog/stock-transfert-pro-shopify/">Stock Transfert Pro</a>', 'blog.tarif.s11.li3', 1],
    ['<p>\n    Pour discuter de votre projet, <a href="/contact/">contactez-moi</a>.', 'blog.tarif.s11.p2', 1],
    ['<a class="cta" href="/blog/">Retour au blog</a>', 'blog.tarif.s11.cta', 0],
  ]);
  return html;
});

patch('blog/comparatif-shopify-wix-prestashop-2026/index.html', (html) => {
  html = setMeta(html, 'meta./blog/comparatif-shopify-wix-prestashop-2026/.title', 'meta./blog/comparatif-shopify-wix-prestashop-2026/.description');
  html = many(html, [
    ['<h1 id="hero-title">Shopify, Wix ou Prestashop', 'blog.comparatif.hero.title', 1],
    ['<p>\n      Que vous soyez en centre-ville', 'blog.comparatif.hero.text', 0],
    ['<a href="/contact/" class="cta">Discuter de votre contexte</a>', 'blog.comparatif.hero.cta', 0],
    ['<p class="blog-kicker">Avant les logos</p>', 'blog.comparatif.s1.kicker', 0],
    ['<h2>Les quatre critères qui comptent vraiment</h2>', 'blog.comparatif.s1.title', 0],
    ['<p>\n    Avant de comparer les fonctionnalités', 'blog.comparatif.s1.p1', 0],
    ['<li><strong>Temps disponible</strong>', 'blog.comparatif.s1.li1', 1],
    ['<li><strong>Volume visé</strong>', 'blog.comparatif.s1.li2', 1],
    ['<li><strong>Magasin physique</strong>', 'blog.comparatif.s1.li3', 1],
    ['<li><strong>Qui vous aide quand ça bloque</strong>', 'blog.comparatif.s1.li4', 1],
    ['<h2>Wix : pour qui ça marche, pour qui ça coince</h2>', 'blog.comparatif.s2.title', 0],
    ['<p>\n    <strong>Wix</strong> excelle pour aller vite', 'blog.comparatif.s2.p1', 1],
    ['<p>\n    Les limites apparaissent quand le chiffre d\'affaires web grimpe', 'blog.comparatif.s2.p2', 1],
    ['<h2>Prestashop : la fausse bonne idée pour beaucoup de PME</h2>', 'blog.comparatif.s3.title', 0],
    ['<p>\n    <strong>Prestashop</strong> est open source', 'blog.comparatif.s3.p1', 1],
    ['<p>\n    En 2026, Prestashop reste pertinent', 'blog.comparatif.s3.p2', 1],
    ['<h2>Shopify : pourquoi je le recommande dans la majorité des cas</h2>', 'blog.comparatif.s4.title', 0],
    ['<p>\n    <strong>Shopify</strong> regroupe hébergement', 'blog.comparatif.s4.p', 1],
    ['<p class="blog-kicker">Budget</p>', 'blog.comparatif.s5.kicker', 0],
    ['<h2>Le vrai prix sur trois ans (ordre de grandeur)</h2>', 'blog.comparatif.s5.title', 0],
    ['<p>\n    Le prix affiché n\'est jamais le prix total', 'blog.comparatif.s5.p1', 0],
    ['<li><strong>Wix</strong> : abonnement « business »', 'blog.comparatif.s5.li1', 1],
    ['<li><strong>Prestashop</strong> : hébergement, thème, modules', 'blog.comparatif.s5.li2', 1],
    ['<li><strong>Shopify</strong> : abonnement (Basic ou supérieur)', 'blog.comparatif.s5.li3', 1],
    ['<p>\n    Pour une vision chiffrée détaillée', 'blog.comparatif.s5.p2', 1],
    ['<h2>Trois profils types</h2>', 'blog.comparatif.s6.title', 0],
    ['<p>\n    <strong>Créateur ou artisan, petit catalogue', 'blog.comparatif.s6.p1', 1],
    ['<p>\n    <strong>Marque en croissance, beaucoup de références', 'blog.comparatif.s6.p2', 1],
    ['<p>\n    <strong>Site Prestashop « hérité »', 'blog.comparatif.s6.p3', 1],
    ['<h2>Quand Shopify n\'est pas la bonne réponse</h2>', 'blog.comparatif.s7.title', 0],
    ['<p>\n    Être honnête renforce la confiance', 'blog.comparatif.s7.p', 1],
    ['<strong>Shopify est canadien : est-ce un problème pour la TVA en France ?</strong>', 'blog.comparatif.s8.q1', 0],
    ['Non : <strong>Shopify Inc.</strong> est une entreprise <strong>canadienne</strong>', 'blog.comparatif.s8.a1', 1],
    ['<strong>Puis-je migrer depuis Wix sans perdre mon référencement ?</strong>', 'blog.comparatif.s8.q2', 0],
    ['Oui, avec des <strong>redirections 301</strong>', 'blog.comparatif.s8.a2', 1],
    ['<strong>Ai-je besoin d\'un développeur pour Shopify ?</strong>', 'blog.comparatif.s8.q3', 0],
    ['Pas pour démarrer. Utile pour migration', 'blog.comparatif.s8.a3', 0],
    ['<h2>Pour aller plus loin</h2>', 'blog.comparatif.s9.title', 0],
    ['<p>\n    Le passage au web se joue autant sur le <strong>stock</strong>', 'blog.comparatif.s9.p', 1],
    ['<li><a href="/blog/tarif-site-shopify-2026/">Tarif d\'un site Shopify en 2026</a>', 'blog.comparatif.s9.li1', 1],
    ['<li><a href="/blog/magasin-physique-boutique-en-ligne/">Magasin physique', 'blog.comparatif.s9.li2', 1],
    ['<li><a href="/blog/stock-transfert-pro-shopify/">Stock Transfert Pro</a>', 'blog.comparatif.s9.li3', 1],
    ['<p>\n    Côté terrain, j\'accompagne des commerçants', 'blog.comparatif.s9.p2', 1],
    ['<a class="cta" href="/blog/">Retour au blog</a>', 'blog.comparatif.s9.cta', 0],
  ]);
  html = ins(html, '<h2>Questions fréquentes</h2>', 'data-i18n="blog.comparatif.s8.title"');
  return html;
});

patch('blog/magasin-physique-boutique-en-ligne/index.html', (html) => {
  html = setMeta(html, 'meta./blog/magasin-physique-boutique-en-ligne/.title', 'meta./blog/magasin-physique-boutique-en-ligne/.description');
  html = many(html, [
    ['<h1 id="hero-title">Magasin physique en ligne sur <span>Shopify</span>', 'blog.magasin.hero.title', 1],
    ['<p>\n      Vous avez déjà des clients qui franchissent la porte', 'blog.magasin.hero.text', 1],
    ['<a href="/contact/" class="cta">En parler ensemble</a>', 'blog.magasin.hero.cta', 0],
    ['<p class="blog-kicker">Pourquoi maintenant</p>', 'blog.magasin.s1.kicker', 0],
    ['<h2>Le web nourrit aussi le magasin</h2>', 'blog.magasin.s1.title', 0],
    ['<p>\n    Beaucoup de commerçants pensent que le e-commerce', 'blog.magasin.s1.p1', 1],
    ['<p>\n    L\'enjeu n\'est pas de tout industrialiser', 'blog.magasin.s1.p2', 1],
    ['<h2>Trois modèles : lequel vous ressemble ?</h2>', 'blog.magasin.s2.title', 0],
    ['<p>\n    <strong>1. Vitrine + catalogue + prise de contact</strong>', 'blog.magasin.s2.p1', 1],
    ['<p>\n    <strong>2. Vitrine + click &amp; collect</strong>', 'blog.magasin.s2.p2', 1],
    ['<p>\n    <strong>3. E-commerce complet + livraison</strong>', 'blog.magasin.s2.p3', 1],
    ['<p>\n    Le bon choix dépend du nombre de références', 'blog.magasin.s2.p4', 0],
    ['<h2>Stock : l\'erreur qui coûte le plus cher</h2>', 'blog.magasin.s3.title', 0],
    ['<p>\n    Le scénario classique : une vente en ligne', 'blog.magasin.s3.p1', 1],
    ['<p>\n    Si vous utilisiez des outils type <strong>Stocky</strong>', 'blog.magasin.s3.p2', 1],
    ['<h2>Click &amp; collect : un levier sous-estimé</h2>', 'blog.magasin.s4.title', 0],
    ['<p>\n    Le client réserve ou règle en ligne', 'blog.magasin.s4.p', 1],
    ['<h2>SEO local : votre avantage face aux pure players</h2>', 'blog.magasin.s5.title', 0],
    ['<p>\n    Les grandes places de marché ne sont pas optimisées', 'blog.magasin.s5.p', 1],
    ['<p class="blog-kicker">Budget</p>', 'blog.magasin.s6.kicker', 0],
    ['<h2>Combien prévoir (sans promesse irréaliste)</h2>', 'blog.magasin.s6.title', 0],
    ['<p>\n    Tout dépend du périmètre : thème', 'blog.magasin.s6.p', 1],
    ['<h2>Cinq erreurs fréquentes</h2>', 'blog.magasin.s7.title', 0],
    ['<li>Changer de nom ou de logo en ligne', 'blog.magasin.s7.li1', 0],
    ['<li>Publier 500 fiches d\'un coup', 'blog.magasin.s7.li2', 1],
    ['<li>Photos prises au téléphone sans lumière', 'blog.magasin.s7.li3', 0],
    ['<li>Paramétrage TVA ou livraison approximatif', 'blog.magasin.s7.li4', 0],
    ['<li>Pas de règle de stock unique', 'blog.magasin.s7.li5', 1],
    ['<h2>Par quoi commencer cette semaine ?</h2>', 'blog.magasin.s8.title', 0],
    ['<li>Lister les 20 produits les plus vendus en magasin.</li>', 'blog.magasin.s8.li1', 0],
    ['<li>Ouvrir un compte d\'essai sur la plateforme retenue', 'blog.magasin.s8.li2', 0],
    ['<li>Produire une dizaine de photos nettes', 'blog.magasin.s8.li3', 0],
    ['<li>Bloquer un créneau pour préparer le projet', 'blog.magasin.s8.li4', 0],
    ['<strong>Combien de temps pour ouvrir une boutique en ligne quand on a déjà un magasin ?</strong>', 'blog.magasin.s9.q1', 0],
    ['Souvent <strong>trois à six semaines</strong>', 'blog.magasin.s9.a1', 1],
    ['<strong>Faut-il un salarié à temps plein pour le site ?</strong>', 'blog.magasin.s9.q2', 0],
    ['Non : quelques heures par semaine au début', 'blog.magasin.s9.a2', 0],
    ['<strong>Le click &amp; collect a-t-il du sens hors des grandes villes ?</strong>', 'blog.magasin.s9.q3', 0],
    ['Oui, tant que le retrait est clair', 'blog.magasin.s9.a3', 0],
    ['<strong>Dois-je fermer mon ancien site tout de suite ?</strong>', 'blog.magasin.s9.q4', 0],
    ['Pas nécessairement : on peut planifier une bascule', 'blog.magasin.s9.a4', 1],
    ['<h2>Pour aller plus loin</h2>', 'blog.magasin.s10.title', 0],
    ['<p>\n    Le bon plan n\'est pas de « copier Amazon »', 'blog.magasin.s10.p', 0],
    ['<li><a href="/blog/comparatif-shopify-wix-prestashop-2026/">Shopify, Wix ou Prestashop', 'blog.magasin.s10.li1', 1],
    ['<li><a href="/blog/tarif-site-shopify-2026/">Tarif d\'un site Shopify en 2026</a>', 'blog.magasin.s10.li2', 1],
    ['<li><a href="/blog/stock-transfert-pro-shopify/">Stock Transfert Pro</a>', 'blog.magasin.s10.li3', 1],
    ['<p>\n    Je travaille avec des commerçants partout en France', 'blog.magasin.s10.p2', 1],
    ['<a class="cta" href="/blog/">Retour au blog</a>', 'blog.magasin.s10.cta', 0],
  ]);
  html = ins(html, '<h2>Questions fréquentes</h2>', 'data-i18n="blog.magasin.s9.title"');
  return html;
});

console.log('batch5 complete');

