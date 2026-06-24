/* Verify i18n key coverage in HTML */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const enSrc = fs.readFileSync(path.join(ROOT, 'assets/i18n-en.js'), 'utf8');
const keys = [...enSrc.matchAll(/"([^"]+)":/g)].map(m => m[1]);

const skip = new Set([
  'nav.lang_switch', 'theme.light', 'theme.dark', 'theme.light_aria', 'theme.dark_aria'
]);

let html = '';
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) html += fs.readFileSync(p, 'utf8');
  }
}
walk(ROOT);

const missing = [];
for (const k of keys) {
  if (skip.has(k)) continue;
  if (!html.includes(`data-i18n="${k}"`) && !html.includes(`data-i18n='${k}'`)) {
    missing.push(k);
  }
}

console.log('Total keys:', keys.length);
console.log('Missing in HTML:', missing.length);
missing.forEach(k => console.log(' -', k));
