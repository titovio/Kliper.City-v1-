(function () {
  'use strict';

  var scheduled = 0;
  var currentView = 'grid';
  var controls = {};
  var labels = [
    { key: 'grid', aria: 'Показать карточки сеткой', testId: 'view-grid' },
    { key: 'list', aria: 'Показать карточки списком', testId: 'view-list' },
    { key: 'map', aria: 'Показать объекты на карте', testId: 'view-map' },
    { key: 'sort', aria: 'Показать рейтинг с конца списка', testId: 'view-sort-reverse' }
  ];

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
    return Array.prototype.some.call(document.querySelectorAll('h1, h2'), function (node) {
      var text = clean(node.textContent);
      return visible(node) && (text === 'Новостройки' || text === 'Готовые ЖК');
    });
  }

  function reactOnClick(button) {
    var prop = Object.keys(button).find(function (key) {
      return key.indexOf('__reactProps$') === 0;
    });
    var props = prop && button[prop];
    return props && typeof props.onClick === 'function' ? props.onClick : null;
  }

  function rememberControls() {
    labels.forEach(function (item) {
      var button = document.querySelector('button[aria-label="' + item.aria + '"]');
      if (!button || !visible(button) || button.closest('[data-kliper-residential-view-controls-guard]')) return;

      var handler = reactOnClick(button);
      if (!handler) return;

      controls[item.key] = {
        aria: item.aria,
        testId: item.testId,
        html: button.innerHTML,
        className: button.className,
        handler: handler
      };
    });
  }

  function controlsReady() {
    return labels.every(function (item) {
      return controls[item.key] && typeof controls[item.key].handler === 'function';
    });
  }

  function findResultRow() {
    var count = document.querySelector('[data-kliper-testid="result-count"]');
    if (!count) return null;
    return count.closest('.kliper-card-results-row') || count.parentElement;
  }

  function hasNativeControls(row) {
    if (!row) return false;
    return Array.prototype.some.call(row.querySelectorAll('button[aria-label="Показать карточки сеткой"], button[aria-label="Показать карточки списком"], button[aria-label="Показать объекты на карте"]'), function (button) {
      return !button.closest('[data-kliper-residential-view-controls-guard]');
    });
  }

  function invokeControl(key) {
    var control = controls[key];
    if (!control || typeof control.handler !== 'function') return;
    if (key === 'grid' || key === 'list' || key === 'map') currentView = key;
    control.handler({
      preventDefault: function () {},
      stopPropagation: function () {}
    });
    schedule();
    window.setTimeout(applyGuard, 120);
    window.setTimeout(applyGuard, 520);
    window.setTimeout(applyGuard, 1100);
  }

  function renderButton(item) {
    var control = controls[item.key];
    var button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', item.aria);
    button.setAttribute('data-kliper-testid', item.testId);
    button.setAttribute('data-kliper-view-control-key', item.key);
    button.className = control.className;
    button.innerHTML = control.html;

    var isActive = item.key === currentView || (item.key === 'sort' && control.lastActive);
    button.className = button.className
      .replace(/\bbg-violet-600\b/g, '')
      .replace(/\btext-white\b/g, '')
      .replace(/\bshadow-md\b/g, '')
      .replace(/\bshadow-violet-100\b/g, '')
      .replace(/\btext-slate-500\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    button.className += isActive
      ? ' bg-violet-600 text-white shadow-md shadow-violet-100'
      : ' text-slate-500 hover:bg-violet-50 hover:text-violet-700';
    return button;
  }

  function injectControls(row) {
    if (!row || !controlsReady()) return;
    if (row.querySelector('[data-kliper-residential-view-controls-guard]')) return;

    var group = document.createElement('div');
    group.className = 'inline-flex items-center gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-100';
    group.setAttribute('data-kliper-residential-view-controls-guard', 'true');

    labels.forEach(function (item) {
      group.appendChild(renderButton(item));
    });

    row.appendChild(group);
  }

  function cleanup() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-kliper-residential-view-controls-guard]'), function (node) {
      node.remove();
    });
  }

  function applyGuard() {
    rememberControls();

    if (!residentialPageActive()) {
      cleanup();
      return;
    }

    var row = findResultRow();
    if (!row) return;
    if (hasNativeControls(row)) {
      cleanup();
      rememberControls();
      return;
    }

    injectControls(row);
  }

  function schedule() {
    window.clearTimeout(scheduled);
    scheduled = window.setTimeout(applyGuard, 80);
  }

  document.addEventListener('click', function (event) {
    var injectedButton = event.target.closest('[data-kliper-view-control-key]');
    if (injectedButton) {
      event.preventDefault();
      event.stopPropagation();
      invokeControl(injectedButton.getAttribute('data-kliper-view-control-key'));
      return;
    }

    var nativeButton = event.target.closest('button[aria-label]');
    if (nativeButton) {
      var aria = nativeButton.getAttribute('aria-label');
      rememberControls();
      labels.forEach(function (item) {
        if (item.aria === aria && item.key !== 'sort') currentView = item.key;
      });
    }

    schedule();
    window.setTimeout(applyGuard, 420);
    window.setTimeout(applyGuard, 900);
    window.setTimeout(applyGuard, 1500);
  }, true);

  window.KLIPER_RESIDENTIAL_VIEW_CONTROLS_GUARD = {
    refresh: applyGuard,
    debug: function () {
      return {
        currentView: currentView,
        controls: Object.keys(controls).reduce(function (acc, key) {
          acc[key] = {
            hasHandler: !!(controls[key] && controls[key].handler),
            hasHtml: !!(controls[key] && controls[key].html)
          };
          return acc;
        }, {}),
        ready: controlsReady(),
        active: residentialPageActive(),
        row: !!findResultRow()
      };
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }

  window.addEventListener('load', schedule);
  window.addEventListener('hashchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
