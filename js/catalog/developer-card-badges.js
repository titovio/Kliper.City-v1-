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

  function badge(status, count) {
    var span = document.createElement('span');
    span.className = 'kliper-developer-card-status-badge';
    span.setAttribute('data-status', status);
    span.setAttribute('aria-label', (status === 'active' ? 'строится ' : 'отстроено ') + count + ' ЖК');
    span.textContent = count + ' ЖК';
    return span;
  }

  function findCountEl() {
    return document.getElementById('kliper-card-count') ||
      Array.prototype.slice.call(document.querySelectorAll('main p, main span')).find(function (node) {
        return /^\d+\s+карточ/.test(cleanText(node));
      });
  }

  function syncLegend(isVisible) {
    var countEl = findCountEl();
    var legend = document.querySelector('.kliper-developer-card-status-legend');
    var isDevelopersPage = Array.prototype.slice.call(document.querySelectorAll('h1,h2')).some(function (node) {
      return cleanText(node) === 'Застройщики';
    });
    if (!countEl) return;
    isVisible = isVisible || isDevelopersPage;
    if (countEl.parentElement) countEl.parentElement.classList.toggle('kliper-developer-results-row', isVisible);

    if (!isVisible) {
      if (legend) legend.remove();
      return;
    }

    if (!legend) {
      legend = document.createElement('span');
      legend.className = 'kliper-developer-card-status-legend';
      legend.innerHTML =
        '<span><i data-status="active"></i>строится</span>' +
        '<span><i data-status="built"></i>отстроено</span>';
      countEl.insertAdjacentElement('afterend', legend);
    }
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
    if (counts.active > 0) node.appendChild(badge('active', counts.active));
    if (counts.built > 0) node.appendChild(badge('built', counts.built));
  }

  function enhanceCards() {
    var before = document.querySelector('.kliper-developer-card-status-badges');
    Array.prototype.forEach.call(document.querySelectorAll('[aria-label^="Открыть карточку"] p'), function (node) {
      enhanceBadge(node);
    });
    syncLegend(Boolean(before || document.querySelector('.kliper-developer-card-status-badges')));
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
