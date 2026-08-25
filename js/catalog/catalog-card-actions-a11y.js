(function () {
  'use strict';

  var timer = 0;

  function clean(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function readList(key) {
    try {
      var value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  }

  function cardTitle(card) {
    return clean((card.getAttribute('aria-label') || '').replace(/^Открыть карточку\s+/, ''));
  }

  function isPressed(key, title) {
    if (!title) return false;
    return readList(key).some(function (item) {
      return item === title || String(item).indexOf(title + '-') === 0;
    });
  }

  function markAction(button, title, kind) {
    var isLike = kind === 'like';
    var storageKey = isLike ? 'kliper-liked-cards' : 'kliper-subscribed-cards';
    var active = isPressed(storageKey, title);
    var label = (isLike ? (active ? 'Убрать из картотеки: ' : 'Добавить в картотеку: ') : (active ? 'Отписаться: ' : 'Подписаться: ')) + title;

    button.setAttribute('aria-label', label);
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('data-kliper-card-action', kind);
  }

  function markFallbackAction(button, title) {
    if (button.getAttribute('aria-label')) return;
    button.setAttribute('aria-label', 'Открыть действие карточки: ' + title);
  }

  function syncCard(card) {
    var title = cardTitle(card);
    if (!title) return;

    Array.prototype.forEach.call(card.querySelectorAll('button'), function (button) {
      var icon = button.querySelector('svg');
      if (!icon) {
        markFallbackAction(button, title);
        return;
      }
      if (icon.classList.contains('lucide-heart')) {
        markAction(button, title, 'like');
      } else if (icon.classList.contains('lucide-bell')) {
        markAction(button, title, 'subscribe');
      } else if (!button.getAttribute('aria-label') && button.querySelector('circle')) {
        button.setAttribute('aria-label', 'Открыть stories: ' + title);
      } else {
        markFallbackAction(button, title);
      }
    });
  }

  function syncViewControls() {
    var labels = {
      'Показать карточки сеткой': true,
      'Показать карточки списком': true,
      'Показать объекты на карте': true,
      'Показать рейтинг с конца списка': true
    };

    Array.prototype.forEach.call(document.querySelectorAll('button[aria-label]'), function (button) {
      var label = button.getAttribute('aria-label');
      if (!labels[label]) return;
      var className = button.className || '';
      var active = String(className).indexOf('bg-violet-600') !== -1 || String(className).indexOf('is-active') !== -1;
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function cardWord(count) {
    var lastTwo = count % 100;
    var last = count % 10;
    if (lastTwo >= 11 && lastTwo <= 14) return 'карточек';
    if (last === 1) return 'карточка';
    if (last >= 2 && last <= 4) return 'карточки';
    return 'карточек';
  }

  function syncCountWording() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-kliper-testid="result-count"], p, div, span'), function (node) {
      var text = clean(node.textContent);
      var match = /^(\d+)\s+карточки$/.exec(text);
      if (!match) return;
      var count = Number(match[1]);
      var next = count + ' ' + cardWord(count);
      if (text !== next) node.textContent = next;
    });
  }

  function sync() {
    Array.prototype.forEach.call(document.querySelectorAll('[aria-label^="Открыть карточку"]'), syncCard);
    syncViewControls();
    syncCountWording();
  }

  function scheduleSync() {
    window.clearTimeout(timer);
    timer = window.setTimeout(sync, 60);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleSync);
  } else {
    scheduleSync();
  }

  window.addEventListener('load', scheduleSync);
  document.addEventListener('click', function () {
    scheduleSync();
    window.setTimeout(sync, 360);
    window.setTimeout(sync, 900);
  }, true);

  window.setInterval(sync, 1200);

  new MutationObserver(scheduleSync).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['class', 'aria-label']
  });
})();
