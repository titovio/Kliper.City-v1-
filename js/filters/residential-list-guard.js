(function () {
  'use strict';

  var scheduled = 0;

  function clean(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function visible(node) {
    if (!node || !node.getBoundingClientRect) return false;
    var rect = node.getBoundingClientRect();
    var style = window.getComputedStyle(node);
    return rect.width > 0 && rect.height > 0 &&
      style.display !== 'none' &&
      style.visibility !== 'hidden';
  }

  function residentialPageActive() {
    if ((window.location.hash || '').indexOf('card=') !== -1) return false;
    var activeMobilePill = document.querySelector('.kliper-mob-pill.active');
    var activeMobileLabel = activeMobilePill && activeMobilePill.getAttribute('data-label');
    if (activeMobileLabel === 'Новостройки' || activeMobileLabel === 'Готовые ЖК') return true;
    return Array.prototype.some.call(document.querySelectorAll('h1, h2'), function (node) {
      var text = clean(node.textContent);
      return visible(node) && (text === 'Новостройки' || text === 'Готовые ЖК');
    });
  }

  function isLegacyResidentialListCard(article) {
    var className = String(article.className || '');
    return className.indexOf('grid-cols-[60px_1fr_auto]') !== -1;
  }

  function isKnownLegacyLeak(article) {
    var text = clean(article.textContent);
    return text.indexOf('Тюменский квартал') !== -1;
  }

  function restoreHiddenCards() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-kliper-residential-list-guard="hidden"]'), function (node) {
      node.hidden = false;
      node.style.removeProperty('display');
      node.removeAttribute('data-kliper-residential-list-guard');
    });
  }

  function updateCount(articles) {
    var countNode = document.querySelector('[data-kliper-testid="result-count"]');
    if (!countNode) return;
    var visibleCount = articles.filter(function (article) {
      return !article.hidden && article.getAttribute('data-kliper-residential-list-guard') !== 'hidden';
    }).length;
    if (visibleCount > 0 && clean(countNode.textContent) !== visibleCount + ' карточки') {
      countNode.textContent = visibleCount + ' карточки';
    }
  }

  function syncVisibleCardCount() {
    var countNode = document.querySelector('[data-kliper-testid="result-count"]');
    if (!countNode) return;

    var visibleCards = Array.prototype.filter.call(document.querySelectorAll('[aria-label^="Открыть карточку"]'), visible);
    if (!visibleCards.length) return;

    var nextText = visibleCards.length + ' карточки';
    if (clean(countNode.textContent) !== nextText) {
      countNode.textContent = nextText;
    }
  }

  function applyGuard() {
    if (!residentialPageActive()) {
      restoreHiddenCards();
      return;
    }

    var articles = Array.prototype.filter.call(document.querySelectorAll('main article'), isLegacyResidentialListCard);
    if (!articles.length) {
      syncVisibleCardCount();
      return;
    }

    var changed = false;
    articles.forEach(function (article) {
      if (isKnownLegacyLeak(article)) {
        if (article.getAttribute('data-kliper-residential-list-guard') === 'hidden') return;
        article.hidden = true;
        article.style.setProperty('display', 'none', 'important');
        article.setAttribute('data-kliper-residential-list-guard', 'hidden');
        changed = true;
      }
    });

    if (changed || document.querySelector('[data-kliper-residential-list-guard="hidden"]')) {
      updateCount(articles);
    }

    syncVisibleCardCount();
  }

  function schedule() {
    window.clearTimeout(scheduled);
    scheduled = window.setTimeout(applyGuard, 80);
  }

  window.KLIPER_RESIDENTIAL_LIST_GUARD = {
    refresh: applyGuard
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }

  window.addEventListener('load', schedule);
  window.addEventListener('hashchange', schedule);
  window.setInterval(applyGuard, 1000);
  document.addEventListener('click', function () {
    schedule();
    window.setTimeout(schedule, 420);
    window.setTimeout(schedule, 900);
    window.setTimeout(schedule, 1600);
  }, true);

  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
