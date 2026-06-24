(function () {
  'use strict';

  const I18N_BASE = (() => {
    const s = document.currentScript;
    return s && s.src ? s.src.replace(/[^/]+$/, '') : '/assets/';
  })();

  const STORAGE_KEY = 'jbdevweb-lang';
  const DEFAULT_LANG = 'fr';

  const FLAG_FR =
    '<svg class="lang-flag" viewBox="0 0 24 16" width="22" height="15" aria-hidden="true">' +
    '<rect width="8" height="16" fill="#002395"/>' +
    '<rect x="8" width="8" height="16" fill="#fff"/>' +
    '<rect x="16" width="8" height="16" fill="#ED2939"/>' +
    '</svg>';

  const FLAG_GB =
    '<svg class="lang-flag" viewBox="0 0 24 16" width="22" height="15" aria-hidden="true">' +
    '<rect width="24" height="16" fill="#012169"/>' +
    '<path d="M0 0l24 16M24 0L0 16" stroke="#fff" stroke-width="3"/>' +
    '<path d="M0 0l24 16M24 0L0 16" stroke="#C8102E" stroke-width="1.5"/>' +
    '<path d="M12 0v16M0 8h24" stroke="#fff" stroke-width="5"/>' +
    '<path d="M12 0v16M0 8h24" stroke="#C8102E" stroke-width="3"/>' +
    '</svg>';

  function getLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'en' ? 'en' : DEFAULT_LANG;
  }

  function getTranslation(key, lang) {
    if (lang === 'fr') return null;
    const dict = window.I18N_EN;
    if (!dict) return null;
    return dict[key] ?? null;
  }

  function saveDefaults() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      if (el.dataset.i18nDefault !== undefined) return;
      if (el.hasAttribute('data-i18n-html')) {
        el.dataset.i18nDefault = el.innerHTML;
      } else if (el.tagName === 'META') {
        el.dataset.i18nDefault = el.getAttribute('content') || '';
      } else if (el.hasAttribute('data-i18n-placeholder')) {
        el.dataset.i18nDefault = el.getAttribute('placeholder') || '';
      } else if (el.hasAttribute('data-i18n-attr')) {
        const attr = el.getAttribute('data-i18n-attr');
        el.dataset.i18nDefault = el.getAttribute(attr) || '';
      } else {
        el.dataset.i18nDefault = el.textContent;
      }
    });
  }

  function applyToElement(el, lang) {
    const key = el.getAttribute('data-i18n');
    if (!key) return;

    let value;
    if (lang === 'fr') {
      value = el.dataset.i18nDefault;
    } else {
      value = getTranslation(key, lang);
      if (value === null) value = el.dataset.i18nDefault;
    }
    if (value === undefined) return;

    if (el.tagName === 'META') {
      el.setAttribute('content', value);
    } else if (el.hasAttribute('data-i18n-placeholder')) {
      el.setAttribute('placeholder', value);
    } else if (el.hasAttribute('data-i18n-attr')) {
      el.setAttribute(el.getAttribute('data-i18n-attr'), value);
    } else if (el.hasAttribute('data-i18n-html')) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  }

  function updateLangToggle(currentLang) {
    const btn = document.querySelector('.lang-toggle');
    if (!btn) return;

    const nextLang = currentLang === 'fr' ? 'en' : 'fr';
    btn.dataset.nextLang = nextLang;
    btn.innerHTML = nextLang === 'en' ? FLAG_GB : FLAG_FR;
    btn.setAttribute('aria-label', nextLang === 'en' ? 'Switch to English' : 'Passer en français');
    btn.setAttribute('title', nextLang === 'en' ? 'English' : 'Français');

    const switcher = btn.closest('.lang-switcher');
    if (switcher) {
      switcher.setAttribute(
        'aria-label',
        currentLang === 'en'
          ? (getTranslation('nav.lang_switch', 'en') || 'Language')
          : 'Langue'
      );
    }
  }

  function applyLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'en' ? 'en' : 'fr';

    document.querySelectorAll('[data-i18n]').forEach((el) => applyToElement(el, lang));

    updateLangToggle(lang);

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      const tipKey = theme === 'dark' ? 'theme.light' : 'theme.dark';
      const tip = lang === 'en'
        ? (getTranslation(tipKey, 'en') || '')
        : (theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
      toggleBtn.setAttribute('title', tip);
      const ariaKey = tipKey + '_aria';
      const aria = lang === 'en'
        ? (getTranslation(ariaKey, 'en') || tip)
        : 'Changer le thème';
      toggleBtn.setAttribute('aria-label', aria);
    }

    const anneeEl = document.getElementById('annee');
    if (anneeEl) anneeEl.textContent = new Date().getFullYear();

    document.dispatchEvent(new CustomEvent('langChanged', { detail: { lang } }));
  }

  function injectLangSwitcher() {
    if (document.querySelector('.lang-switcher')) return;

    const switcher = document.createElement('div');
    switcher.className = 'lang-switcher';
    switcher.setAttribute('role', 'group');
    switcher.setAttribute('aria-label', 'Langue');
    switcher.innerHTML =
      '<button type="button" class="lang-btn lang-toggle" aria-label="Switch to English" title="English"></button>';

    const nav = document.querySelector('nav');
    const burger = nav?.querySelector('.nav-burger');
    if (nav && burger) {
      nav.insertBefore(switcher, burger);
    }

    switcher.querySelector('.lang-toggle').addEventListener('click', () => {
      const btn = switcher.querySelector('.lang-toggle');
      applyLang(btn.dataset.nextLang || (getLang() === 'fr' ? 'en' : 'fr'));
    });
  }

  function t(key) {
    return getTranslation(key, getLang());
  }

  function boot() {
    injectLangSwitcher();
    saveDefaults();
    applyLang(getLang());
  }

  function loadEnDict(callback) {
    if (window.I18N_EN) {
      callback();
      return;
    }
    const script = document.createElement('script');
    script.src = I18N_BASE + 'i18n-en.js';
    script.onload = callback;
    script.onerror = () => {
      console.warn('[i18n] Impossible de charger i18n-en.js depuis', script.src);
      callback();
    };
    document.head.appendChild(script);
  }

  function init() {
    loadEnDict(boot);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.JBDevWebI18n = { applyLang, getLang, t };
})();
