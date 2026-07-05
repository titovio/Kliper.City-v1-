(function () {
  'use strict';

  var dom = window.KLIPER_DOM || {};
  var schedule = dom.schedule || function (fn) { setTimeout(fn, 0); };

  var NAV_IDS = {
    'Застройщики': 'nav-developers',
    'Новостройки': 'nav-newbuildings',
    'Новые': 'nav-newbuildings',
    'Застр.': 'nav-developers',
    'Готовые ЖК': 'nav-ready',
    'Готовые': 'nav-ready',
    'Для бизнеса': 'nav-business',
    'Бизнес': 'nav-business'
  };

  function clean(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function isVisibleInViewport(node) {
    if (!node || !node.getBoundingClientRect) return false;
    var rect = node.getBoundingClientRect();
    var style = window.getComputedStyle(node);
    return rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom >= 0 &&
      rect.right >= 0 &&
      rect.top <= window.innerHeight &&
      rect.left <= window.innerWidth &&
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0';
  }

  function clearManagedAttributes() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-kliper-testid]'), function (node) {
      if (node.getAttribute('data-kliper-testid-managed') === 'true') {
        node.removeAttribute('data-kliper-testid');
        node.removeAttribute('data-kliper-testid-managed');
      }
    });
  }

  function markBestButton(id, buttons) {
    if (!buttons.length) return;
    buttons.sort(function (a, b) {
      var ar = a.getBoundingClientRect();
      var br = b.getBoundingClientRect();
      return ar.top - br.top || ar.left - br.left;
    });
    buttons[0].setAttribute('data-kliper-testid', id);
    buttons[0].setAttribute('data-kliper-testid-managed', 'true');
  }

  function markNavigation() {
    var groups = {};
    Object.keys(NAV_IDS).forEach(function (label) {
      groups[NAV_IDS[label]] = groups[NAV_IDS[label]] || [];
    });

    Array.prototype.forEach.call(document.querySelectorAll('button'), function (button) {
      var label = clean(button.textContent || button.getAttribute('aria-label'));
      var id = NAV_IDS[label];
      if (!id || !isVisibleInViewport(button)) return;
      if (button.closest('[data-kliper-category-stories], .kliper-category-story-host, .kliper-story-viewer')) return;
      groups[id].push(button);
    });

    Object.keys(groups).forEach(function (id) {
      markBestButton(id, groups[id]);
    });
  }

  function markProfile() {
    var profileButton = document.querySelector('button[aria-label="Моя страница"]');
    if (!profileButton) return;
    profileButton.setAttribute('data-kliper-testid', 'nav-profile');
    profileButton.setAttribute('data-kliper-testid-managed', 'true');
  }

  function markViewControls() {
    var map = {
      'Показать карточки сеткой': 'view-grid',
      'Показать карточки списком': 'view-list',
      'Показать объекты на карте': 'view-map',
      'Показать рейтинг с конца списка': 'view-sort-reverse'
    };
    Array.prototype.forEach.call(document.querySelectorAll('button[aria-label]'), function (button) {
      var id = map[button.getAttribute('aria-label')];
      if (!id || !isVisibleInViewport(button)) return;
      button.setAttribute('data-kliper-testid', id);
      button.setAttribute('data-kliper-testid-managed', 'true');
    });
  }

  function markCounts() {
    var countNodes = Array.prototype.filter.call(document.querySelectorAll('p, div, span'), function (node) {
      var text = clean(node.textContent);
      return /^\d+\s+(карточки|бизнес-помещений)(\s|$)/.test(text) &&
        text.length <= 80 &&
        isVisibleInViewport(node);
    });
    countNodes.sort(function (a, b) {
      return clean(a.textContent).length - clean(b.textContent).length;
    });
    var countNode = countNodes[0];
    if (!countNode) return;
    countNode.setAttribute('data-kliper-testid', 'result-count');
    countNode.setAttribute('data-kliper-testid-managed', 'true');
  }

  function markAll() {
    clearManagedAttributes();
    markNavigation();
    markProfile();
    markViewControls();
    markCounts();
    document.documentElement.setAttribute('data-kliper-test-selectors', 'ready');
  }

  function scheduleMark() {
    schedule(markAll);
  }

  window.KLIPER_TEST_SELECTORS = {
    refresh: markAll
  };

  scheduleMark();
  window.addEventListener('resize', scheduleMark);
  window.addEventListener('scroll', scheduleMark, { passive: true });
  window.addEventListener('hashchange', scheduleMark);
  document.addEventListener('click', function () {
    setTimeout(scheduleMark, 80);
    setTimeout(scheduleMark, 450);
  }, true);

  new MutationObserver(scheduleMark).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'aria-label']
  });
})();
