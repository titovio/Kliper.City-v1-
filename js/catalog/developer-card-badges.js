(function () {
  'use strict';

  var timer = 0;
  var retryTimer = 0;
  var overrides = {
    'Брусника': { active: 10, built: 2 }
  };

  function cleanText(node) {
    return (node && node.textContent ? node.textContent : '').replace(/\s+/g, ' ').trim();
  }

  function getDeveloperName(card) {
    var label = card.getAttribute('aria-label') || '';
    return label.replace(/^Открыть карточку\s+/, '').trim();
  }

  function splitCounts(name, total) {
    if (overrides[name]) return overrides[name];
    var built = total >= 4 ? 1 : 0;
    if (total >= 8) built = 2;
    return {
      active: Math.max(total - built, 0),
      built: built
    };
  }

  function badge(text) {
    var span = document.createElement('span');
    span.className = 'kliper-developer-card-status-badge';
    span.textContent = text;
    return span;
  }

  function enhanceBadge(node) {
    if (!node || node.getAttribute('data-developer-status-badges') === 'ready') return;

    var match = cleanText(node).match(/^(\d+)\s*ЖК\s*в базе$/);
    if (!match) return;

    var card = node.closest('[aria-label^="Открыть карточку"]');
    if (!card) return;

    var name = getDeveloperName(card);
    var total = Number(match[1]);
    var counts = splitCounts(name, total);

    node.textContent = '';
    node.classList.remove('truncate');
    node.classList.add('kliper-developer-card-status-badges');
    node.setAttribute('data-developer-status-badges', 'ready');
    node.appendChild(badge('строится ' + counts.active + ' ЖК'));
    node.appendChild(badge('отстроено ' + counts.built + ' ЖК'));
  }

  function enhanceCards() {
    Array.prototype.forEach.call(document.querySelectorAll('[aria-label^="Открыть карточку"] p'), function (node) {
      enhanceBadge(node);
    });
  }

  function schedule() {
    window.clearTimeout(timer);
    timer = window.setTimeout(enhanceCards, 60);
  }

  function scheduleRetries() {
    var count = 0;
    window.clearInterval(retryTimer);
    retryTimer = window.setInterval(function () {
      count += 1;
      enhanceCards();
      if (count >= 20) window.clearInterval(retryTimer);
    }, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }

  window.addEventListener('load', schedule);
  window.addEventListener('load', scheduleRetries);
  document.addEventListener('click', function () {
    schedule();
    scheduleRetries();
  }, true);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  scheduleRetries();
})();
