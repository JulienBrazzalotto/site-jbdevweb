const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const en = fs.readFileSync(path.join(root, 'assets/i18n-en.js'), 'utf8');
const keys = [...en.matchAll(/"([^"]+)":/g)].map((m) => m[1]);

const skip = new Set([
  'nav.lang_switch',
  'theme.light',
  'theme.dark',
  'theme.light_aria',
  'theme.dark_aria',
  'contact.form.success',
  'contact.form.error',
]);

const htmlFiles = [
  'index.html',
  'contact/index.html',
  'faq/index.html',
  'shopify/index.html',
  'sites-vitrines/index.html',
  'mentions-legales/index.html',
  'blog/index.html',
  'blog/cadence/index.html',
  'blog/stock-transfert-pro-shopify/index.html',
  'blog/tarif-site-shopify-2026/index.html',
  'blog/comparatif-shopify-wix-prestashop-2026/index.html',
  'blog/magasin-physique-boutique-en-ligne/index.html',
];

let allHtml = '';
for (const f of htmlFiles) {
  allHtml += fs.readFileSync(path.join(root, f), 'utf8');
}

const missing = keys.filter((k) => !skip.has(k) && !allHtml.includes(`data-i18n="${k}"`));
console.log('Total keys:', keys.length);
console.log('Missing in HTML:', missing.length);
missing.forEach((k) => console.log(' -', k));
