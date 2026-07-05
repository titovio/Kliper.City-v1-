(function businessFilterPolish() {
  'use strict';

  var DONE_ATTR = 'data-kliper-biz-polished';
  var CHEVRON_DOWN = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>';
  var CHEVRON_UP = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>';
  var selectedFilters = {};
  var activeFilterRoot = null;

  var FILTERS = [
    {
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      label: 'Тип сделки',
      type: 'list',
      options: ['Аренда', 'Продажа']
    },
    {
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
      label: 'Все районы',
      type: 'list',
      options: ['Все районы', 'В городе', 'У воды', 'За городом', 'Центральный']
    },
    {
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2"><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="8" width="7" height="13" rx="1"/></svg>',
      label: 'Тип помещения',
      type: 'list',
      options: ['Офис', 'Парковка', 'Отдельный вход', 'Склад', 'Первая линия']
    },
    {
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
      label: 'Площадь',
      type: 'grid',
      options: ['до 50 м²', '50-100 м²', '100-300 м²', '300+ м²']
    },
    {
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
      label: 'Бюджет',
      type: 'grid',
      options: ['до 50 тыс ₽', '50-100 тыс ₽', '100-200 тыс ₽', '200+ тыс ₽']
    }
  ];

  var STYLE_ID = 'kliper-biz-filter-styles';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = [
      '.kliper-biz-bar { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); align-items: start; gap: 10px; padding: 0; background: transparent; border: 0; box-shadow: none; }',
      '.kliper-biz-dropdown { position: relative; min-width: 0; }',
      '.kliper-biz-trigger { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; min-height: 44px; padding: 8px 14px; border-radius: 12px; font-size: 13px; font-weight: 900; font-family: Manrope, sans-serif; background: rgba(255,255,255,0.76); color: #334155; border: 1px solid rgba(226,232,240,0.86); box-shadow: 0 10px 24px rgba(15,23,42,0.055); cursor: pointer; transition: border-color 0.16s ease, color 0.16s ease, background-color 0.16s ease, box-shadow 0.16s ease; backdrop-filter: blur(12px) saturate(1.08); -webkit-backdrop-filter: blur(12px) saturate(1.08); }',
      '.kliper-biz-trigger:hover, .kliper-biz-trigger.open { border-color: rgba(167,139,250,0.54); color: #1f2937; background: rgba(255,255,255,0.86); box-shadow: 0 12px 30px rgba(15,23,42,0.07); }',
      '.kliper-biz-trigger-left { display: flex; align-items: center; gap: 6px; }',
      '.kliper-biz-chevron { display: inline-flex; align-items: center; justify-content: center; color: #8b5cf6; flex: none; }',
      '.kliper-biz-panel { display: none; position: absolute; top: calc(100% + 8px); left: 0; min-width: 190px; background: rgba(255,255,255,0.98); border-radius: 14px; box-shadow: 0 20px 48px rgba(15,23,42,0.13); border: 1px solid rgba(226,232,240,0.92); z-index: 160; overflow: hidden; padding: 8px; }',
      '.kliper-biz-panel.open { display: block; }',
      '.kliper-biz-panel--list { padding: 6px; }',
      '.kliper-biz-panel--grid { display: none; grid-template-columns: 1fr 1fr; gap: 6px; min-width: 190px; padding: 8px; }',
      '.kliper-biz-panel--grid.open { display: grid; }',
      '.kliper-biz-option { display: flex; align-items: center; justify-content: flex-start; min-height: 34px; padding: 8px 12px; border-radius: 10px; font-size: 12px; font-weight: 850; font-family: Manrope, sans-serif; color: #334155; background: transparent; border: 1px solid transparent; cursor: pointer; transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease; white-space: nowrap; }',
      '.kliper-biz-panel--grid .kliper-biz-option { justify-content: center; padding-left: 9px; padding-right: 9px; }',
      '.kliper-biz-option:hover { border-color: rgba(221,214,254,0.82); background: rgba(245,243,255,0.88); color: #6d28d9; }',
      '.kliper-biz-option.selected { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: #fff; border-color: transparent; box-shadow: 0 8px 18px rgba(124,58,237,0.22); }',
      '.kliper-biz-selected { display: none !important; }',
      '.kliper-biz-selected-inline { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-left: 12px; vertical-align: middle; }',
      '.kliper-biz-hint { font-size: 12px; font-weight: 800; color: #94a3b8; }',
      '.kliper-biz-chip { display: inline-flex; align-items: center; gap: 6px; min-height: 26px; padding: 5px 9px; border-radius: 999px; background: #f4efff; color: #6d28d9; font-size: 12px; font-weight: 900; }',
      '.kliper-biz-chip span { color: #64748b; font-weight: 800; }',
      '.kliper-biz-chip strong { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 999px; background: #ede9fe; color: #6d28d9; font-size: 13px; line-height: 1; }',
      '.kliper-biz-chip:hover strong { background: #7c3aed; color: #fff; }',
      'body.kliper-dark-theme [data-kliper-biz-polished], body.kliper-dark-theme .kliper-biz-filter-fallback { background: transparent !important; border: 0 !important; box-shadow: none !important; }',
      'body.kliper-dark-theme .kliper-biz-trigger { background: rgba(255,255,255,0.075) !important; color: rgba(255,255,255,0.82) !important; border-color: rgba(255,255,255,0.105) !important; box-shadow: none !important; }',
      'body.kliper-dark-theme .kliper-biz-trigger:hover, body.kliper-dark-theme .kliper-biz-trigger.open { background: rgba(255,255,255,0.105) !important; color: #fff !important; border-color: rgba(167,139,250,0.34) !important; box-shadow: 0 0 0 1px rgba(124,58,237,0.20) !important; }',
      'body.kliper-dark-theme .kliper-biz-trigger svg { stroke: #a78bfa; }',
      'body.kliper-dark-theme .kliper-biz-chevron { color: rgba(196,181,253,0.9) !important; }',
      'body.kliper-dark-theme .kliper-biz-panel { background: rgba(15,23,42,0.98) !important; border-color: rgba(167,139,250,0.22) !important; box-shadow: 0 24px 58px rgba(2,6,23,0.42) !important; }',
      'body.kliper-dark-theme .kliper-biz-option { background: rgba(255,255,255,0.045) !important; color: rgba(226,232,240,0.82) !important; border-color: rgba(255,255,255,0.08) !important; }',
      'body.kliper-dark-theme .kliper-biz-option:hover { background: rgba(124,58,237,0.18) !important; color: #fff !important; border-color: rgba(167,139,250,0.34) !important; }',
      'body.kliper-dark-theme .kliper-biz-option.selected { background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important; color: #fff !important; border-color: transparent !important; box-shadow: 0 8px 18px rgba(124,58,237,0.25) !important; }',
      'body.kliper-dark-theme .kliper-biz-hint { color: rgba(226,232,240,0.72) !important; }',
      'body.kliper-dark-theme .kliper-biz-chip { background: rgba(124,58,237,0.18) !important; color: rgba(255,255,255,0.92) !important; border: 1px solid rgba(167,139,250,0.24) !important; }',
      'body.kliper-dark-theme .kliper-biz-chip span { color: rgba(196,181,253,0.86) !important; }',
      'body.kliper-dark-theme .kliper-biz-chip strong { background: rgba(167,139,250,0.20) !important; color: #fff !important; }',
      '@media (max-width: 900px) { .kliper-biz-bar { grid-template-columns: repeat(2, minmax(0, 1fr)); } }',
      '@media (max-width: 520px) { .kliper-biz-bar { grid-template-columns: 1fr; } .kliper-biz-selected-inline { display: flex; margin: 6px 0 0; } }'
    ].join('\n');
    document.head.appendChild(s);
  }

  function closeAllPanels(except) {
    var panels = document.querySelectorAll('.kliper-biz-panel');
    var triggers = document.querySelectorAll('.kliper-biz-trigger');
    for (var i = 0; i < panels.length; i++) {
      if (panels[i] !== except) panels[i].classList.remove('open');
    }
    for (var j = 0; j < triggers.length; j++) {
      if (!except || triggers[j].nextElementSibling !== except) {
        triggers[j].classList.remove('open');
        setChevron(triggers[j], false);
      }
    }
  }

  function setChevron(trigger, open) {
    var icon = trigger.querySelector('.kliper-biz-chevron');
    if (icon) icon.innerHTML = open ? CHEVRON_UP : CHEVRON_DOWN;
  }

  function findCountEl() {
    return document.querySelector('.kliper-business-count') || document.getElementById('kliper-card-count');
  }

  function findLiveFilterRoot() {
    if (activeFilterRoot &&
        document.documentElement.contains(activeFilterRoot) &&
        activeFilterRoot.querySelector('.kliper-biz-bar')) {
      return activeFilterRoot;
    }

    activeFilterRoot = Array.prototype.slice.call(document.querySelectorAll('[data-kliper-biz-polished], .kliper-biz-filter-fallback')).find(function (node) {
      return node.querySelector('.kliper-biz-bar');
    }) || null;
    return activeFilterRoot;
  }

  function getInlineSelectedBox() {
    var countEl = findCountEl();
    if (!countEl) return null;

    var box = document.querySelector('.kliper-biz-selected-inline');
    if (!box) {
      box = document.createElement('span');
      box.className = 'kliper-selected-filter-inline kliper-biz-selected-inline';
      box.setAttribute('aria-live', 'polite');
    }

    if (box.previousElementSibling !== countEl) {
      countEl.insertAdjacentElement('afterend', box);
    }
    if (countEl.parentElement) countEl.parentElement.classList.add('kliper-card-results-row');
    return box;
  }

  function renderSelectedChips() {
    var keys = Object.keys(selectedFilters).filter(function (key) {
      return selectedFilters[key] && selectedFilters[key].show;
    });
    if (!keys.length) return '';

    var html = keys.map(function (key) {
      var item = selectedFilters[key];
      return '<button class="kliper-selected-filter-inline__chip kliper-biz-chip" type="button" data-biz-filter-clear="' + item.label + '"><span>' + item.label + ':</span> ' + item.value + '<strong aria-hidden="true">×</strong></button>';
    }).join('');
    return html + '<button class="kliper-selected-filter-inline__reset kliper-biz-reset" type="button" data-biz-filter-reset>Сбросить</button>';
  }

  function updateSelected(root) {
    var box = root.querySelector('.kliper-biz-selected');
    var inlineBox = getInlineSelectedBox();
    var html = renderSelectedChips();
    if (box) {
      box.hidden = true;
      box.innerHTML = '';
    }
    if (inlineBox) {
      inlineBox.innerHTML = html;
      inlineBox.hidden = !html;
    }
  }

  function emitFilterChange() {
    document.dispatchEvent(new CustomEvent('kliper:business-filter-change'));
    window.setTimeout(function () {
      if (activeFilterRoot) updateSelected(activeFilterRoot);
    }, 30);
  }

  function resetFilter(root, label, silent) {
    root = root && document.documentElement.contains(root) ? root : findLiveFilterRoot();
    if (!root) return;
    var wrapper = root.querySelector('[data-biz-filter-label="' + label + '"]');
    if (!wrapper) return;
    var trigger = wrapper.querySelector('.kliper-biz-trigger');
    var panel = wrapper.querySelector('.kliper-biz-panel');
    var filter = FILTERS.filter(function (item) { return item.label === label; })[0];
    if (!trigger || !panel || !filter) return;

    var options = panel.querySelectorAll('.kliper-biz-option');
    for (var i = 0; i < options.length; i++) options[i].classList.remove('selected');

    trigger.querySelector('.kliper-biz-trigger-left').innerHTML = filter.icon + ' ' + filter.label;
    if (label === 'Все районы' && options[0]) {
      options[0].classList.add('selected');
      selectedFilters[label] = { label: label, value: options[0].textContent, show: false };
    } else {
      delete selectedFilters[label];
    }

    if (!silent) {
      updateSelected(root);
      emitFilterChange();
    }
  }

  function resetAllFilters(root) {
    root = root && document.documentElement.contains(root) ? root : findLiveFilterRoot();
    if (!root) return;
    FILTERS.forEach(function (filter) {
      resetFilter(root, filter.label, true);
    });
    updateSelected(root);
    emitFilterChange();
  }

  function isBusinessFilterSection(node) {
    if (!node || node.tagName !== 'SECTION') return false;
    if (node.hasAttribute(DONE_ATTR) || node.classList.contains('kliper-biz-filter-fallback')) return true;
    if (node.querySelector('.kliper-biz-bar')) return true;
    var text = (node.textContent || '').replace(/\s+/g, ' ');
    return node.className.indexOf('z-30') !== -1 &&
      (text.indexOf('Формат бизнеса') !== -1 ||
        (text.indexOf('Тип сделки') !== -1 && text.indexOf('Тип помещения') !== -1 && text.indexOf('Бюджет') !== -1));
  }

  function dedupeBusinessFilters(keep) {
    var filters = Array.prototype.filter.call(document.querySelectorAll('section'), isBusinessFilterSection);
    filters.forEach(function (node) {
      if (node !== keep && node.parentElement) node.parentElement.removeChild(node);
    });
  }

  function polishFilter() {
    var sections = document.querySelectorAll('section');
    var filterSection = null;
    for (var i = 0; i < sections.length; i++) {
      var s = sections[i];
      if (s.className.indexOf('z-30') !== -1 &&
          s.textContent.indexOf('Формат бизнеса') !== -1 &&
          !s.getAttribute(DONE_ATTR)) {
        filterSection = s;
        break;
      }
    }
    if (!filterSection && !document.querySelector('.kliper-biz-bar')) {
      var businessHeading = Array.prototype.slice.call(document.querySelectorAll('h1,h2')).find(function (node) {
        return (node.textContent || '').replace(/\s+/g, ' ').trim() === 'Для бизнеса';
      });
      if (businessHeading) {
        var root = businessHeading.closest('.xl\\:col-span-2') || businessHeading.closest('section');
        if (root) {
          filterSection = document.createElement('section');
          filterSection.className = 'kliper-biz-filter-fallback';
          var host = root.querySelector('[data-business-spaces-host]');
          root.insertBefore(filterSection, host || businessHeading.nextSibling);
        }
      }
    }
    if (!filterSection) return;
    dedupeBusinessFilters(filterSection);
    filterSection.setAttribute(DONE_ATTR, '1');
    activeFilterRoot = filterSection;
    injectStyles();

    selectedFilters = {};
    filterSection.style.cssText = 'border: 0; border-radius: 0; background: transparent; box-shadow: none; margin-bottom: 12px; overflow: visible; padding: 0;';
    filterSection.innerHTML = '';

    var bar = document.createElement('div');
    bar.className = 'kliper-biz-bar';

    FILTERS.forEach(function (f) {
      var wrapper = document.createElement('div');
      wrapper.className = 'kliper-biz-dropdown';
      wrapper.setAttribute('data-biz-filter-label', f.label);

      var trigger = document.createElement('button');
      trigger.className = 'kliper-biz-trigger';
      trigger.type = 'button';
      trigger.innerHTML = '<span class="kliper-biz-trigger-left">' + f.icon + ' ' + f.label + '</span><span class="kliper-biz-chevron">' + CHEVRON_DOWN + '</span>';

      var panelClass = f.type === 'grid' ? 'kliper-biz-panel kliper-biz-panel--grid' : 'kliper-biz-panel kliper-biz-panel--list';
      var panel = document.createElement('div');
      panel.className = panelClass;

      f.options.forEach(function (opt, idx) {
        var optBtn = document.createElement('button');
        optBtn.className = 'kliper-biz-option';
        optBtn.type = 'button';
        optBtn.setAttribute('data-biz-filter-value', opt);
        if (f.label === 'Все районы' && idx === 0) {
          optBtn.classList.add('selected');
          selectedFilters[f.label] = { label: f.label, value: opt, show: false };
        }
        optBtn.textContent = opt;
        optBtn.addEventListener('click', function () {
          var siblings = panel.querySelectorAll('.kliper-biz-option');
          for (var s = 0; s < siblings.length; s++) siblings[s].classList.remove('selected');
          optBtn.classList.add('selected');
          trigger.querySelector('.kliper-biz-trigger-left').innerHTML = f.icon + ' ' + opt;
          selectedFilters[f.label] = {
            label: f.label,
            value: opt,
            show: !(f.label === 'Все районы' && idx === 0)
          };
          updateSelected(filterSection);
          closeAllPanels(null);
          emitFilterChange();
        });
        panel.appendChild(optBtn);
      });

      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = panel.classList.contains('open');
        closeAllPanels(null);
        if (!isOpen) {
          panel.classList.add('open');
          trigger.classList.add('open');
          setChevron(trigger, true);
        }
      });

      wrapper.appendChild(trigger);
      wrapper.appendChild(panel);
      bar.appendChild(wrapper);
    });

    var selected = document.createElement('div');
    selected.className = 'kliper-biz-selected';
    selected.hidden = true;

    filterSection.appendChild(bar);
    filterSection.appendChild(selected);
    updateSelected(filterSection);
    filterSection.addEventListener('click', function (event) {
      var reset = event.target.closest('[data-biz-filter-reset]');
      if (reset) {
        event.preventDefault();
        event.stopPropagation();
        resetAllFilters(filterSection);
        return;
      }

      var clear = event.target.closest('[data-biz-filter-clear]');
      if (!clear) return;
      event.preventDefault();
      event.stopPropagation();
      resetFilter(filterSection, clear.getAttribute('data-biz-filter-clear'));
    });
    document.dispatchEvent(new CustomEvent('kliper:business-filter-ready'));
  }

  // Close panels on outside click
  document.addEventListener('click', function () { closeAllPanels(null); });
  document.addEventListener('click', function (event) {
    var reset = event.target.closest('[data-biz-filter-reset]');
    var root = findLiveFilterRoot();
    if (reset && root) {
      event.preventDefault();
      event.stopPropagation();
      resetAllFilters(root);
      return;
    }

    var clear = event.target.closest('[data-biz-filter-clear]');
    if (!clear || !root) return;
    event.preventDefault();
    event.stopPropagation();
    resetFilter(root, clear.getAttribute('data-biz-filter-clear'));
  }, true);

  function schedule() {
    polishFilter();
    setTimeout(polishFilter, 40);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }

  new MutationObserver(function () { schedule(); }).observe(document.documentElement, { childList: true, subtree: true });
})();
