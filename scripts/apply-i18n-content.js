/* Apply page-specific i18n via tag/regex patterns (avoids apostrophe mismatches) */
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

function addAttrOnce(html, search, attr) {
  const idx = html.indexOf(search);
  if (idx === -1) {
    console.warn('NOT FOUND:', search.slice(0, 50));
    return html;
  }
  const before = html.slice(0, idx);
  const after = html.slice(idx);
  if (after.startsWith(search) && !after.slice(0, search.length + 80).includes('data-i18n')) {
    return before + search.replace(/^<(\w+)/, `<$1 ${attr}`) + after.slice(search.length);
  }
  return html;
}

function addAttrs(html, rules) {
  for (const [search, attr] of rules) {
    if (html.includes(search) && !html.includes(search.replace(/^</, `<`).split('>')[0] + ' data-i18n')) {
      const tagEnd = search.indexOf('>');
      const open = search.slice(0, tagEnd);
      if (!open.includes('data-i18n')) {
        html = html.replace(search, open + ' ' + attr + search.slice(tagEnd));
      }
    } else if (!html.includes(search)) {
      console.warn('MISSING tag:', search.slice(0, 55));
    }
  }
  return html;
}

function replaceOnce(html, from, to) {
  if (!html.includes(from)) {
    console.warn('MISSING replace:', from.slice(0, 55));
    return html;
  }
  return html.replace(from, to);
}

const pages = {
  'contact/index.html': {
    meta: ['meta./contact/.title', 'meta./contact/.description'],
    rules: [
      ['<h1 id="hero-title">', 'data-i18n="contact.hero.title" data-i18n-html'],
      ['<p>Boutique <strong>Shopify</strong>', 'data-i18n="contact.hero.text" data-i18n-html'],
      ['<h2>Comment ça se passe ?</h2>', 'data-i18n="contact.process.title"'],
      ['<h3>1. Prise de contact</h3>', 'data-i18n="contact.process.step1.title"'],
      ['<h3>2. Analyse & proposition</h3>', 'data-i18n="contact.process.step2.title"'],
      ['<h3>3. Production & suivi</h3>', 'data-i18n="contact.process.step3.title"'],
      ['<h2>Me contacter directement</h2>', 'data-i18n="contact.direct.title"'],
      ['<p class="desktop">', 'data-i18n="contact.direct.hint_desktop" data-i18n-html'],
      ['<p class="mobile">', 'data-i18n="contact.direct.hint_mobile" data-i18n-html'],
      ['<h2>Décrivez-moi votre projet</h2>', 'data-i18n="contact.form.title"'],
      ['<input type="text" name="name"', 'data-i18n="contact.form.placeholder.name" data-i18n-placeholder'],
      ['<input type="email" name="email"', 'data-i18n="contact.form.placeholder.email" data-i18n-placeholder'],
      ['<div class="select-trigger">', 'data-i18n="contact.form.placeholder.project"'],
      ['<li data-value="Projet Shopify">', 'data-i18n="contact.form.option.shopify"'],
      ['<li data-value="Site vitrine">', 'data-i18n="contact.form.option.vitrine"'],
      ['<li data-value="Autre">', 'data-i18n="contact.form.option.other"'],
      ['<textarea name="message"', 'data-i18n="contact.form.placeholder.message" data-i18n-placeholder'],
      ['<button type="submit" class="cta" disabled>', 'data-i18n="contact.form.submit"'],
    ],
    replaces: [
      ['<p>\n        Vous m', '<p data-i18n="contact.process.step1.text">\n        Vous m'],
      ['<p>\n        J', '<p data-i18n="contact.process.step2.p1">\n        J'],
      ['<p>\n        Chaque projet est conçu', '<p data-i18n="contact.process.step2.p2">\n        Chaque projet est conçu'],
      ['<p>\n        Une fois validé', '<p data-i18n="contact.process.step3.text">\n        Une fois validé'],
      ['<p>\n      Plus vous me donnez', '<p data-i18n="contact.form.intro">\n      Plus vous me donnez'],
    ],
  },
};

for (const [rel, cfg] of Object.entries(pages)) {
  const fp = path.join(ROOT, rel);
  let html = fs.readFileSync(fp, 'utf8');
  if (cfg.meta) html = setMeta(html, cfg.meta[0], cfg.meta[1]);
  if (cfg.rules) html = addAttrs(html, cfg.rules);
  if (cfg.replaces) {
    for (const [f, t] of cfg.replaces) html = replaceOnce(html, f, t);
  }
  fs.writeFileSync(fp, html);
  console.log('OK', rel);
}
