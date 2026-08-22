(function () {
  'use strict';

  if (window.KLIPER_MOTION_READY) return;

  var config = {
    version: '12.42.2',
    source: './js/vendor/motion.global.js'
  };

  window.KLIPER_MOTION_CONFIG = config;

  function markReady(resolve) {
    window.KLIPER_MOTION = window.Motion;
    document.documentElement.classList.add('kliper-motion-ready');
    document.documentElement.classList.remove('kliper-motion-unavailable');
    window.dispatchEvent(new CustomEvent('kliper:motion-ready', {
      detail: { motion: window.Motion, version: config.version }
    }));
    resolve(window.Motion);
  }

  window.KLIPER_MOTION_READY = new Promise(function (resolve) {
    var attempts = 0;

    function waitForMotion() {
      if (window.Motion) {
        markReady(resolve);
        return;
      }

      attempts += 1;
      if (attempts < 24) {
        window.setTimeout(waitForMotion, 50);
        return;
      }

      var error = new Error('Motion global library is not loaded');
      window.KLIPER_MOTION_ERROR = error;
      document.documentElement.classList.add('kliper-motion-unavailable');
      window.dispatchEvent(new CustomEvent('kliper:motion-error', {
        detail: { error: error, version: config.version }
      }));
      resolve(null);
    }

    waitForMotion();
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
