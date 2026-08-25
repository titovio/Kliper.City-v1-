(function () {
  'use strict';

  function syncThemeClass() {
    try {
      if (window.localStorage && window.localStorage.getItem('kliper-theme') === 'dark') {
        document.documentElement.classList.add('kliper-dark-theme');
        if (document.body) document.body.classList.add('kliper-dark-theme');
      }
    } catch (error) {}
  }

  function syncRestoreClass() {
    try {
      if (window.location.hash.indexOf('card=') !== -1) {
        document.documentElement.classList.add('kliper-page-restoring');
      }
    } catch (error) {}
  }

  syncThemeClass();
  syncRestoreClass();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncThemeClass, { once: true });
  } else {
    syncThemeClass();
  }
})();
