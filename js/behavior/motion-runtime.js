(function () {
  'use strict';

  if (window.KLIPER_MOTION_READY) return;

  var config = {
    version: '12.42.2',
    source: './js/vendor/motion.global.js'
  };

  window.KLIPER_MOTION_CONFIG = config;

  window.KLIPER_MOTION_READY = new Promise(function (resolve) {
    if (!window.Motion) {
      var error = new Error('Motion global library is not loaded');
      window.KLIPER_MOTION_ERROR = error;
      document.documentElement.classList.add('kliper-motion-unavailable');
      window.dispatchEvent(new CustomEvent('kliper:motion-error', {
        detail: { error: error, version: config.version }
      }));
      resolve(null);
      return;
    }

    window.KLIPER_MOTION = window.Motion;
    document.documentElement.classList.add('kliper-motion-ready');
    window.dispatchEvent(new CustomEvent('kliper:motion-ready', {
      detail: { motion: window.Motion, version: config.version }
    }));
    resolve(window.Motion);
  })
    .catch(function (error) {
      window.KLIPER_MOTION_ERROR = error;
      document.documentElement.classList.add('kliper-motion-unavailable');
      window.dispatchEvent(new CustomEvent('kliper:motion-error', {
        detail: { error: error, version: config.version }
      }));
      return null;
    });
})();
