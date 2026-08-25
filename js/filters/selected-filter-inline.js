(function () {
  'use strict';

  var HINT_TEXT = 'Выбранные фильтры появятся здесь';
  var timer = 0;
  var retryTimer = 0;
  var pulseTimers = [];
  var pulseUntil = 0;
  var sourceRow = null;
  var inlineBox = null;

  function cleanText(node) {
    return (node && node.textContent ? node.textContent : '').replace(/\s+/g, ' ').trim();
  }

  function toArray(list) {
    return Array.prototype.slice.call(list || []);
  }

  function isBusinessMode() {
    if (document.querySelector('.kliper-biz-bar, [data-business-spaces-host], .kliper-business-page')) return true;
    return toArray(document.querySelectorAll('h1, h2')).some(function (node) {
      return cleanText(node) === 'Для бизнеса';
    });
  }

  function detachSharedInlineBox() {
    sourceRow = null;
    if (inlineBox && inlineBox.parentElement && !inlineBox.classList.contains('kliper-biz-selected-inline')) {
      inlineBox.parentElement.removeChild(inlineBox);
    }
    inlineBox = null;
  }

  function findCountEl() {
    var byId = document.getElementById('kliper-card-count');
    if (byId) return byId;

    return toArray(document.querySelectorAll('main p, main span')).find(function (node) {
      return /^\d+\s+карточ/.test(cleanText(node));
    }) || null;
  }

  function isSelectedRowCandidate(node) {
    if (!node || node.nodeType !== 1 || node.closest('.kliper-selected-filter-inline')) return false;

    var text = cleanText(node);
    var className = String(node.className || '');
    var looksLikeFilterFooter = className.indexOf('border-t') !== -1 &&
      className.indexOf('border-slate-100') !== -1 &&
      className.indexOf('flex') !== -1 &&
      className.indexOf('gap-2') !== -1;

    return looksLikeFilterFooter && (text.indexOf(HINT_TEXT) !== -1 || text.indexOf('Сбросить') !== -1);
  }

  function findSelectedRow() {
    var rows = hideSelectedSourceRows();
    if (sourceRow && rows.indexOf(sourceRow) !== -1) return sourceRow;

    rows.sort(function (a, b) {
      return cleanText(a).length - cleanText(b).length;
    });

    sourceRow = rows[0] || null;
    return sourceRow;
  }

  function hideSelectedSourceRows() {
    if (isBusinessMode()) {
      detachSharedInlineBox();
      return [];
    }

    var rows = toArray(document.querySelectorAll('main div')).filter(isSelectedRowCandidate);
    rows.forEach(function (row) {
      row.classList.add('kliper-selected-filter-source-hidden');
    });
    return rows;
  }

  function getInlineBox(countEl) {
    var anchor = countEl;
    var legend = countEl.nextElementSibling;
    if (legend && legend.classList && legend.classList.contains('kliper-developer-card-status-legend')) {
      anchor = legend;
    }

    if (!inlineBox || !document.documentElement.contains(inlineBox)) {
      inlineBox = document.createElement('span');
      inlineBox.className = 'kliper-selected-filter-inline';
      inlineBox.setAttribute('aria-live', 'polite');
      anchor.insertAdjacentElement('afterend', inlineBox);
    } else if (inlineBox.previousElementSibling !== anchor) {
      anchor.insertAdjacentElement('afterend', inlineBox);
    }

    if (countEl.parentElement) countEl.parentElement.classList.add('kliper-card-results-row');
    return inlineBox;
  }

  function makeInlineChip(original) {
    var clone = original.cloneNode(true);
    clone.removeAttribute('id');
    clone.removeAttribute('class');
    clone.className = original.textContent.indexOf('Сбросить') !== -1 ?
      'kliper-selected-filter-inline__reset' :
      'kliper-selected-filter-inline__chip';
    clone.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      original.click();
      schedule(80);
    });
    return clone;
  }

  function sync() {
    if (isBusinessMode()) {
      detachSharedInlineBox();
      return;
    }

    var countEl = findCountEl();
    var row = findSelectedRow();
    if (!countEl || !row) return;

    var box = getInlineBox(countEl);
    var buttons = toArray(row.querySelectorAll('button'));
    var hasSelected = buttons.length > 0 && cleanText(row).indexOf(HINT_TEXT) === -1;
    var signature = hasSelected ? buttons.map(cleanText).join('|') : '';
    var sourceChanged = box._kliperSelectedFilterSource !== row;

    row.classList.add('kliper-selected-filter-source-hidden');
    box.classList.toggle('is-empty', !hasSelected);
    if (!sourceChanged && box.getAttribute('data-kliper-filter-signature') === signature) return;

    box._kliperSelectedFilterSource = row;
    box.setAttribute('data-kliper-filter-signature', signature);
    box.textContent = '';

    if (!hasSelected) return;

    buttons.forEach(function (button) {
      box.appendChild(makeInlineChip(button));
    });
  }

  function schedule(delay) {
    if (timer) return;
    timer = window.setTimeout(function () {
      timer = 0;
      sync();
    }, delay || 80);
  }

  function schedulePulse() {
    var now = Date.now();
    schedule(60);
    if (now < pulseUntil) return;
    pulseUntil = now + 960;
    pulseTimers.forEach(function (id) { window.clearTimeout(id); });
    pulseTimers = [220, 520, 900].map(function (delay, index, list) {
      return window.setTimeout(function () {
        sync();
        if (index === list.length - 1) pulseUntil = 0;
      }, delay);
    });
  }

  function scheduleRetries() {
    var count = 0;
    window.clearInterval(retryTimer);
    retryTimer = window.setInterval(function () {
      count += 1;
      sync();
      if (count >= 24) window.clearInterval(retryTimer);
    }, 180);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      hideSelectedSourceRows();
      schedule(30);
      scheduleRetries();
    });
  } else {
    hideSelectedSourceRows();
    schedule(30);
    scheduleRetries();
  }

  window.addEventListener('load', function () {
    hideSelectedSourceRows();
    schedule(120);
    scheduleRetries();
  });
  document.addEventListener('click', function () {
    window.setTimeout(function () {
      hideSelectedSourceRows();
      schedulePulse();
    }, 0);
  }, true);
  new MutationObserver(function () {
    hideSelectedSourceRows();
    schedulePulse();
  }).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
