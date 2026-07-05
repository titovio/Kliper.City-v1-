(function () {
  'use strict';

  var FAST_CLASS = 'kliper-newbuild-fast-filter';
  var SOURCE_HIDDEN_CLASS = 'kliper-newbuild-source-hidden';
  var ACTIVE_TABS = { 'Новостройки': true, 'Готовые ЖК': true };
  var FILTER_LABELS = ['Все районы', 'Год сдачи', 'Для семьи', 'Выгодно', 'Комфорт+', 'Инвестиции'];
  var syncQueued = false;
  var activePanel = null;
  var forwardingSourceClick = false;

  function cleanText(node) {
    return (node && node.textContent ? node.textContent : '').replace(/\s+/g, ' ').trim();
  }

  function toArray(list) {
    return Array.prototype.slice.call(list || []);
  }

  function activeCatalogTab() {
    var active = document.querySelector('.kliper-pill-btn.active');
    return cleanText(active);
  }

  function isActiveCatalog() {
    return Boolean(ACTIVE_TABS[activeCatalogTab()]);
  }

  function findSourceRow() {
    if (!isActiveCatalog()) return null;
    return document.querySelector('.kliper-newbuild-picker-row');
  }

  function findSourceSection(row) {
    return row && (row.closest('section') || row.parentElement);
  }

  function buttonLabel(button) {
    var text = cleanText(button);
    return FILTER_LABELS.find(function (label) {
      return text === label || text.indexOf(label + ':') === 0;
    }) || text;
  }

  function findSourceWrapper(label) {
    var row = findSourceRow();
    if (!row) return null;

    return toArray(row.querySelectorAll(':scope > .relative')).find(function (node) {
      var trigger = node.querySelector(':scope > button');
      return buttonLabel(trigger) === label;
    }) || null;
  }

  function sourceTrigger(label) {
    var wrapper = findSourceWrapper(label);
    return wrapper ? wrapper.querySelector(':scope > button') : null;
  }

  function optionButtons(wrapper) {
    if (!wrapper) return [];
    var trigger = wrapper.querySelector(':scope > button');
    return toArray(wrapper.querySelectorAll('button')).filter(function (button) {
      return button !== trigger && cleanText(button);
    });
  }

  function syncTriggerText(button, label) {
    var source = sourceTrigger(label);
    var text = cleanText(source) || label;
    var displayText = text.replace(label + ': ', label + ': ');
    button.querySelector('.kliper-newbuild-fast-trigger__text').textContent = displayText;
    button.classList.toggle('is-selected', displayText !== label);
  }

  function closePanels() {
    toArray(document.querySelectorAll('.kliper-newbuild-fast-panel.is-open')).forEach(function (panel) {
      panel.classList.remove('is-open');
    });
    toArray(document.querySelectorAll('.kliper-newbuild-fast-trigger.is-open')).forEach(function (trigger) {
      trigger.classList.remove('is-open');
    });
    activePanel = null;
  }

  function clickSource(button) {
    if (!button) return;
    forwardingSourceClick = true;
    button.click();
    window.setTimeout(function () {
      forwardingSourceClick = false;
    }, 120);
  }

  function renderPanelOptions(panel, label) {
    var wrapper = findSourceWrapper(label);
    var options = optionButtons(wrapper);

    panel.textContent = '';
    if (!options.length) {
      var empty = document.createElement('span');
      empty.className = 'kliper-newbuild-fast-empty';
      empty.textContent = 'Загрузка...';
      panel.appendChild(empty);
      return;
    }

    options.forEach(function (sourceOption) {
      var value = cleanText(sourceOption);
      var option = document.createElement('button');
      option.type = 'button';
      option.className = 'kliper-newbuild-fast-option';
      option.textContent = value;
      if (sourceOption.className && /\bbg-violet-(600|700|800|900)\b/.test(String(sourceOption.className))) {
        option.classList.add('is-selected');
      }
      option.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        applyOption(label, value);
      });
      panel.appendChild(option);
    });
  }

  function openPanel(trigger, panel, label) {
    var source = sourceTrigger(label);
    closePanels();
    trigger.classList.add('is-open');
    panel.classList.add('is-open');
    activePanel = panel;

    clickSource(source);
    window.setTimeout(function () {
      renderPanelOptions(panel, label);
    }, 40);
    window.setTimeout(function () {
      renderPanelOptions(panel, label);
    }, 160);
  }

  function applyOption(label, value) {
    var wrapper = findSourceWrapper(label);
    var match = optionButtons(wrapper).find(function (button) {
      return cleanText(button) === value;
    });

    if (match) {
      clickSource(match);
      closePanels();
      schedule(80);
      schedule(260);
      return;
    }

    clickSource(sourceTrigger(label));

    window.setTimeout(function () {
      var openedWrapper = findSourceWrapper(label);
      var openedMatch = optionButtons(openedWrapper).find(function (button) {
        return cleanText(button) === value;
      });
      clickSource(openedMatch);
      closePanels();
      schedule(80);
      schedule(260);
    }, 60);
  }

  function buildHost(sourceRow) {
    var old = document.querySelector('.' + FAST_CLASS);
    if (old && old._kliperSourceRow === sourceRow) return old;
    if (old && old.parentElement) old.parentElement.removeChild(old);

    var host = document.createElement('section');
    host.className = FAST_CLASS;
    host._kliperSourceRow = sourceRow;

    var bar = document.createElement('div');
    bar.className = 'kliper-newbuild-fast-bar';

    FILTER_LABELS.forEach(function (label) {
      var item = document.createElement('div');
      item.className = 'kliper-newbuild-fast-item';
      item.setAttribute('data-fast-filter-label', label);

      var trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'kliper-newbuild-fast-trigger';
      trigger.innerHTML = '<span class="kliper-newbuild-fast-trigger__text">' + label + '</span><span class="kliper-newbuild-fast-chevron">⌄</span>';

      var panel = document.createElement('div');
      panel.className = 'kliper-newbuild-fast-panel';

      trigger.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (panel.classList.contains('is-open')) {
          closePanels();
          return;
        }
        openPanel(trigger, panel, label);
      });

      item.appendChild(trigger);
      item.appendChild(panel);
      bar.appendChild(item);
    });

    host.appendChild(bar);
    var section = findSourceSection(sourceRow);
    if (section && section.parentElement) section.parentElement.insertBefore(host, section);
    return host;
  }

  function sync() {
    var sourceRow = findSourceRow();
    var host = document.querySelector('.' + FAST_CLASS);

    if (!sourceRow) {
      if (host && host.parentElement) host.parentElement.removeChild(host);
      toArray(document.querySelectorAll('.' + SOURCE_HIDDEN_CLASS)).forEach(function (node) {
        node.classList.remove(SOURCE_HIDDEN_CLASS);
      });
      return;
    }

    var section = findSourceSection(sourceRow);
    if (section) section.classList.add(SOURCE_HIDDEN_CLASS);

    host = buildHost(sourceRow);
    toArray(host.querySelectorAll('.kliper-newbuild-fast-trigger')).forEach(function (trigger) {
      var label = trigger.closest('[data-fast-filter-label]').getAttribute('data-fast-filter-label');
      syncTriggerText(trigger, label);
    });

    if (activePanel) {
      var activeItem = activePanel.closest('[data-fast-filter-label]');
      if (activeItem) renderPanelOptions(activePanel, activeItem.getAttribute('data-fast-filter-label'));
    }
  }

  function schedule(delay) {
    if (syncQueued) return;
    syncQueued = true;
    window.setTimeout(function () {
      syncQueued = false;
      sync();
    }, typeof delay === 'number' ? delay : 80);
  }

  window.KliperNewbuildFastFilters = {
    schedule: schedule,
    sync: sync,
    version: 'newbuild-fast-filters-5'
  };

  document.addEventListener('click', function (event) {
    if (forwardingSourceClick) return;
    if (!event.target.closest('.' + FAST_CLASS)) closePanels();
    schedule(120);
  }, true);

  document.addEventListener('pointerup', function () {
    schedule(120);
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { schedule(80); });
  } else {
    schedule(80);
  }

  [240, 700, 1400].forEach(function (delay) {
    window.setTimeout(function () { schedule(0); }, delay);
  });

  window.addEventListener('load', function () { schedule(120); });
  new MutationObserver(function () { schedule(80); }).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
