(function () {
  'use strict';

  var timer = 0;
  var sweepTimer = 0;
  var replacements = {
    'Попробуйте снять часть фильтров или выбрать другой год сдачи.': 'Попробуйте изменить запрос или снять часть фильтров.',
    'Попробуйте снять часть бизнес-фильтров или расширить бюджет.': 'Попробуйте изменить запрос или снять часть фильтров.',
    'Попробуйте изменить фильтры': 'Попробуйте изменить запрос или снять часть фильтров.'
  };

  function clean(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function applyCopy() {
    var root = document.querySelector('main');
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var node = walker.nextNode();
    while (node) {
      var replacement = replacements[clean(node.nodeValue)];
      if (replacement) node.nodeValue = replacement;
      node = walker.nextNode();
    }
  }

  function schedule() {
    window.clearTimeout(timer);
    timer = window.setTimeout(applyCopy, 80);
  }

  function scheduleBurst() {
    schedule();
    window.setTimeout(schedule, 400);
    window.setTimeout(schedule, 1200);
    window.setTimeout(schedule, 2400);
  }

  function startSweep() {
    var runs = 0;
    window.clearInterval(sweepTimer);
    sweepTimer = window.setInterval(function () {
      runs += 1;
      applyCopy();
      if (runs >= 60) {
        window.clearInterval(sweepTimer);
        sweepTimer = 0;
      }
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      scheduleBurst();
      startSweep();
    });
  } else {
    scheduleBurst();
    startSweep();
  }

  window.addEventListener('load', function () {
    scheduleBurst();
    startSweep();
  });
  document.addEventListener('click', function () {
    scheduleBurst();
    startSweep();
  }, true);

  new MutationObserver(schedule).observe(document.documentElement, {
    characterData: true,
    childList: true,
    subtree: true
  });
})();
