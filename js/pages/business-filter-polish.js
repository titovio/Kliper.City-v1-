(function businessFilterPolish() {
  'use strict';

  var DONE_ATTR = 'data-kliper-biz-polished';
  var CHEVRON_DOWN = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>';
  var CHEVRON_UP = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>';
  var selectedFilters = {};

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
      '.kliper-biz-bar { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); align-items: start; gap: 8px; padding: 10px 16px 12px; }',
      '.kliper-biz-dropdown { position: relative; min-width: 0; }',
      '.kliper-biz-trigger { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; padding: 7px 12px; border-radius: 9px; font-size: 12px; font-weight: 900; font-family: Manrope, sans-serif; background: #fff; color: #273244; border: 1px solid #e3ebf5; cursor: pointer; transition: border-color 0.16s ease, color 0.16s ease, box-shadow 0.16s ease; height: 34px; }',
      '.kliper-biz-trigger:hover, .kliper-biz-trigger.open { border-color: #8b5cf6; color: #1f2937; box-shadow: 0 0 0 1px rgba(139,92,246,0.28); }',
      '.kliper-biz-trigger-left { display: flex; align-items: center; gap: 6px; }',
      '.kliper-biz-chevron { display: inline-flex; align-items: center; justify-content: center; color: #8b5cf6; flex: none; }',
      '.kliper-biz-panel { display: none; position: absolute; top: calc(100% + 5px); left: 0; min-width: 96px; background: #fff; border-radius: 12px; box-shadow: 0 18px 42px rgba(59,31,92,0.16); border: 1px solid #d9c6ff; z-index: 160; overflow: hidden; padding: 6px; }',
      '.kliper-biz-panel.open { display: block; }',
      '.kliper-biz-panel--list { padding: 6px; }',
      '.kliper-biz-panel--grid { display: none; grid-template-columns: 1fr 1fr; gap: 6px; min-width: 190px; padding: 8px; }',
      '.kliper-biz-panel--grid.open { display: grid; }',
      '.kliper-biz-option { display: flex; align-items: center; justify-content: flex-start; min-height: 30px; padding: 8px 12px; border-radius: 8px; font-size: 12px; font-weight: 800; font-family: Manrope, sans-serif; color: #334155; background: #fff; border: 1px solid #e5edf7; cursor: pointer; transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease; white-space: nowrap; }',
      '.kliper-biz-panel--grid .kliper-biz-option { justify-content: center; padding-left: 9px; padding-right: 9px; }',
      '.kliper-biz-option:hover { border-color: #d8c7ff; background: #fbf9ff; }',
      '.kliper-biz-option.selected { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: #fff; border-color: transparent; box-shadow: 0 8px 18px rgba(124,58,237,0.22); }',
      '.kliper-biz-selected { min-height: 34px; display: flex; align-items: center; flex-wrap: wrap; gap: 6px; padding: 8px 16px 16px; }',
      '.kliper-biz-hint { font-size: 12px; font-weight: 800; color: #94a3b8; }',
      '.kliper-biz-chip { display: inline-flex; align-items: center; gap: 6px; min-height: 26px; padding: 5px 9px; border-radius: 999px; background: #f4efff; color: #6d28d9; font-size: 12px; font-weight: 900; }',
      '.kliper-biz-chip span { color: #64748b; font-weight: 800; }',
      '@media (max-width: 900px) { .kliper-biz-bar { grid-template-columns: repeat(2, minmax(0, 1fr)); } }',
      '@media (max-width: 520px) { .kliper-biz-bar { grid-template-columns: 1fr; padding-left: 12px; padding-right: 12px; } .kliper-biz-selected { padding-left: 12px; padding-right: 12px; } }'
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

  function updateSelected(root) {
    var box = root.querySelector('.kliper-biz-selected');
    if (!box) return;
    var keys = Object.keys(selectedFilters).filter(function (key) {
      return selectedFilters[key] && selectedFilters[key].show;
    });
    if (!keys.length) {
      box.innerHTML = '<span class="kliper-biz-hint">Выбранные фильтры появятся здесь</span>';
      return;
    }
    box.innerHTML = keys.map(function (key) {
      var item = selectedFilters[key];
      return '<span class="kliper-biz-chip"><span>' + item.label + ':</span> ' + item.value + '</span>';
    }).join('');
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
    if (!filterSection) return;
    filterSection.setAttribute(DONE_ATTR, '1');
    injectStyles();

    selectedFilters = {};
    filterSection.style.cssText = 'border-radius: 18px; background: #fff; box-shadow: 0 16px 34px rgba(15,23,42,0.06); margin-bottom: 12px; overflow: visible;';
    filterSection.innerHTML = '';

    var bar = document.createElement('div');
    bar.className = 'kliper-biz-bar';

    FILTERS.forEach(function (f) {
      var wrapper = document.createElement('div');
      wrapper.className = 'kliper-biz-dropdown';

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
    selected.innerHTML = '<span class="kliper-biz-hint">Выбранные фильтры появятся здесь</span>';

    filterSection.appendChild(bar);
    filterSection.appendChild(selected);
    updateSelected(filterSection);
  }

  // Close panels on outside click
  document.addEventListener('click', function () { closeAllPanels(null); });

  function schedule() {
    setTimeout(polishFilter, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }

  new MutationObserver(function () { schedule(); }).observe(document.documentElement, { childList: true, subtree: true });
})();
