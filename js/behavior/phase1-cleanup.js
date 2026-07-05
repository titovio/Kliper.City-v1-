/*
  Фаза 1 — только Недвижимость.
  Скрывает: вкладки Топ / Лента / Мой двор, кнопку «Карточки»,
  гамбургер-меню, фильтры «Районы» и «Риелторы»,
  лишние категории в сайдбаре, блок «Быстрый старт».
  Перемещает фильтры в верхнюю панель.
*/
(function phase1Cleanup() {
  'use strict';

  var KEEP_GROUPS = ['Недвижимость'];
  var HIDE_TABS = ['Топ', 'Лента', 'Мой двор'];
  var HIDE_FILTERS = ['Районы', 'Риелторы'];
  var MOVED_MARKER = 'kliper-pills-moved';
  var STYLE_ID = 'kliper-phase1-styles';

  var PILLS = [
    { label: 'Застройщики', short: 'Застр.', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="8" width="7" height="13" rx="1"/></svg>' },
    { label: 'Новостройки', short: 'Новые', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="12 2 22 8.5 22 22 2 22 2 8.5"/><polyline points="9 22 9 14 15 14 15 22"/></svg>' },
    { label: 'Готовые ЖК', short: 'Готовые', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>' },
    { label: 'Для бизнеса', short: 'Бизнес', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>' }
  ];

  var SEARCH_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

  function hide(el) {
    if (el && el.style.display !== 'none') el.style.display = 'none';
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = [
      '.kliper-control-shell { position: relative !important; z-index: 160 !important; overflow: visible !important; border-radius: 22px !important; background: linear-gradient(180deg, rgba(3,10,29,0.96), rgba(3,10,29,0.91)) !important; border: 1px solid rgba(255,255,255,0.08) !important; box-shadow: 0 18px 46px rgba(15,23,42,0.16), inset 0 1px 0 rgba(255,255,255,0.055) !important; }',
      '.kliper-phase1-topbar { display: grid !important; grid-template-columns: auto minmax(0, auto) 1fr auto; align-items: center; gap: 14px; overflow: visible !important; }',
      '.kliper-phase1-city-wrap { position: relative !important; z-index: 220 !important; overflow: visible !important; }',
      '.kliper-phase1-city-wrap > div[class*="absolute"] { z-index: 240 !important; }',
      '.kliper-phase1-city { min-width: 166px !important; height: 46px !important; border-radius: 12px !important; background: rgba(255,255,255,0.075) !important; border: 1px solid rgba(255,255,255,0.105) !important; color: rgba(255,255,255,0.94) !important; box-shadow: none !important; transform: none !important; }',
      '.kliper-phase1-city:hover { background: rgba(255,255,255,0.105) !important; border-color: rgba(255,255,255,0.16) !important; }',
      '.kliper-phase1-city svg { opacity: 0.78; }',
      '.kliper-pills-moved { display: flex; align-items: center; gap: 8px; padding: 0; border-radius: 0; background: transparent; border: 0; overflow-x: auto; scrollbar-width: none; flex-shrink: 0; box-shadow: none; }',
      '.kliper-pills-moved::-webkit-scrollbar { display: none; }',
      '.kliper-pill-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-width: 150px; height: 36px; white-space: nowrap; padding: 7px 13px; border-radius: 9px; font-size: 13px; font-weight: 850; font-family: Manrope, sans-serif; color: rgba(255,255,255,0.68); background: rgba(255,255,255,0.075); border: 1px solid rgba(255,255,255,0.08); box-shadow: inset 0 1px 0 rgba(255,255,255,0.035); cursor: pointer; transition: color 0.18s ease, background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease; -webkit-tap-highlight-color: transparent; }',
      '.kliper-pill-btn svg { width: 15px; height: 15px; opacity: 0.55; }',
      '.kliper-pill-btn:hover { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.105); border-color: rgba(255,255,255,0.14); }',
      '.kliper-pill-btn:hover svg { opacity: 0.86; }',
      '.kliper-pill-btn.active { background: linear-gradient(135deg, #7c3aed, #6d28d9); border-color: rgba(167,139,250,0.34); color: #fff; box-shadow: 0 7px 18px rgba(109,40,217,0.22), inset 0 1px 0 rgba(255,255,255,0.16); }',
      '.kliper-pill-btn.active svg { opacity: 1; }',
      '.kliper-pill-label { overflow: hidden; text-overflow: ellipsis; }',
      /* Search button — collapsed */
      '.kliper-search-btn { display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; border-radius: 12px; background: rgba(255,255,255,0.075); border: 1px solid rgba(255,255,255,0.105); color: rgba(255,255,255,0.92); cursor: pointer; transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease; flex-shrink: 0; margin-left: auto; box-shadow: none; }',
      '.kliper-search-btn svg { width: 19px; height: 19px; }',
      '.kliper-search-btn:hover { background: rgba(124,58,237,0.22); border-color: rgba(167,139,250,0.28); color: #fff; }',
      '.kliper-search-btn.open { background: rgba(124,58,237,0.34); border-color: rgba(167,139,250,0.38); color: #fff; }',
      /* Search expanded field */
      '.kliper-search-expanded { overflow: hidden; transition: max-width 0.3s ease, opacity 0.3s ease, padding 0.3s ease; max-width: 0; opacity: 0; padding: 0; }',
      '.kliper-search-expanded.open { max-width: 400px; opacity: 1; padding: 0; flex: 1; min-width: 200px; }',
      '.kliper-search-field { width: 100%; height: 42px; border-radius: 12px; background: rgba(255,255,255,0.075); border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 0 14px; font-size: 14px; font-weight: 650; font-family: Manrope, sans-serif; outline: none; }',
      '.kliper-search-field::placeholder { color: rgba(255,255,255,0.35); }',
      '.kliper-search-field:focus { border-color: rgba(124,58,237,0.5); background: rgba(255,255,255,0.12); }',
      '@media (max-width: 767px) { .kliper-phase1-topbar { display: none !important; } .kliper-mobile-nav { display: flex !important; } }',
      '@media (min-width: 768px) { .kliper-mobile-nav { display: none !important; } }',
      '.kliper-mobile-nav { flex-direction: column; gap: 0; padding: 0; }',
      '.kliper-mob-row1 { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; }',
      '.kliper-mob-search-toggle { display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; border-radius: 10px; background: rgba(255,255,255,0.1); border: none; color: #fff; cursor: pointer; transition: all 0.2s; }',
      '.kliper-mob-search-toggle.open { background: rgba(124,58,237,0.5); }',
      '.kliper-mob-search-row { overflow: hidden; transition: max-height 0.25s ease, opacity 0.25s ease, padding 0.25s ease; max-height: 0; opacity: 0; padding: 0 14px; }',
      '.kliper-mob-search-row.open { max-height: 60px; opacity: 1; padding: 0 14px 8px; }',
      '.kliper-mob-search-input { width: 100%; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 0 14px; font-size: 14px; font-weight: 600; font-family: Manrope, sans-serif; outline: none; }',
      '.kliper-mob-search-input::placeholder { color: rgba(255,255,255,0.4); }',
      '.kliper-mob-search-input:focus { border-color: rgba(124,58,237,0.6); }',
      '.kliper-mob-pills { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; padding: 6px 14px 12px; }',
      '.kliper-mob-pill { display: flex; align-items: center; justify-content: center; gap: 5px; padding: 8px 4px; border-radius: 10px; border: none; font-size: 11px; font-weight: 800; font-family: Manrope, sans-serif; color: rgba(255,255,255,0.55); background: rgba(255,255,255,0.06); cursor: pointer; transition: all 0.2s; white-space: nowrap; overflow: hidden; -webkit-tap-highlight-color: transparent; }',
      '.kliper-mob-pill.active { background: linear-gradient(135deg, #7c3aed, #6d28d9); color: #fff; box-shadow: 0 4px 12px rgba(109,40,217,0.3); }',
      '.kliper-mob-pill svg { flex-shrink: 0; }',
      '@media (max-width: 359px) { .kliper-mob-pill span { display: none; } .kliper-mob-pill { padding: 10px; } }'
    ].join('\n');
    document.head.appendChild(s);
  }

  function fixSubtitle() {
    var els = document.querySelectorAll('p, span');
    for (var i = 0; i < els.length; i++) {
      if (els[i].textContent.trim() === 'Городская соцсеть' && els[i].children.length === 0) {
        els[i].textContent = 'Новостройки города';
      }
    }
  }

  function cleanTabs() {
    var buttons = document.querySelectorAll('button');
    var tabParent = null;
    buttons.forEach(function (btn) {
      var text = btn.textContent.trim();
      if (HIDE_TABS.indexOf(text) !== -1) {
        var parent = btn.parentElement;
        if (parent && parent.children.length >= 3) tabParent = parent;
        hide(btn);
      }
    });
    if (tabParent) hide(tabParent);
  }

  function cleanHamburger() {
    document.querySelectorAll('button').forEach(function (btn) {
      var cls = btn.className || '';
      if (cls.indexOf('shrink-0') !== -1 && cls.indexOf('bg-white') !== -1) {
        var rect = btn.getBoundingClientRect();
        if (rect.width > 30 && rect.width < 60) hide(btn);
      }
    });
  }

  function cleanFilters() {
    document.querySelectorAll('button').forEach(function (btn) {
      if (HIDE_FILTERS.indexOf(btn.textContent.trim()) !== -1) hide(btn);
    });
  }

  function collapseVisually(el) {
    if (el && !el.dataset.kliperCollapsed) {
      el.style.cssText = 'position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important;padding:0!important;margin:-1px!important;';
      el.dataset.kliperCollapsed = '1';
    }
  }

  function hideOriginalFilterBar() {
    document.querySelectorAll('section').forEach(function (sec) {
      var cls = sec.className || '';
      if (cls.indexOf('z-[80]') !== -1 && sec.textContent.indexOf('Застройщики') !== -1) {
        collapseVisually(sec);
      }
    });
  }

  function findOriginalPillByText(text) {
    var allBtns = document.querySelectorAll('button.flex.h-9');
    for (var i = 0; i < allBtns.length; i++) {
      if (allBtns[i].textContent.trim() === text &&
          !allBtns[i].closest('.' + MOVED_MARKER) &&
          !allBtns[i].closest('.kliper-mobile-nav')) return allBtns[i];
    }
    return null;
  }

  var activeLabel = 'Застройщики';

  function syncActiveState() {
    // Desktop pills
    var clone = document.querySelector('.' + MOVED_MARKER);
    if (clone) {
      clone.querySelectorAll('.kliper-pill-btn').forEach(function (cb) {
        var label = cb.getAttribute('data-label');
        if (label === activeLabel) cb.classList.add('active'); else cb.classList.remove('active');
      });
    }
    // Mobile pills
    var mobNav = document.querySelector('.kliper-mobile-nav');
    if (mobNav) {
      mobNav.querySelectorAll('.kliper-mob-pill').forEach(function (mb) {
        var label = mb.getAttribute('data-label');
        if (label === activeLabel) mb.classList.add('active'); else mb.classList.remove('active');
      });
    }
  }

  function handlePillClick(label) {
    activeLabel = label;
    var orig = findOriginalPillByText(label);
    if (orig) orig.click();
    syncActiveState();
  }

  document.addEventListener('kliper:phase1-set-active-tab', function (event) {
    var label = event.detail && event.detail.label;
    if (!label) return;
    activeLabel = label;
    syncActiveState();
  });

  function movePillsToTopBar() {
    if (document.querySelector('.' + MOVED_MARKER)) { syncActiveState(); return; }

    var pillBtns = document.querySelectorAll('button.flex.h-9');
    if (!pillBtns.length) return;
    var pillBar = pillBtns[0].parentElement;
    if (!pillBar || pillBar.className.indexOf('overflow-x-auto') === -1) return;

    var searchInput = document.querySelector('input[placeholder*="Поиск"]');
    if (!searchInput) return;
    var topBarGrid = searchInput.closest('.grid.gap-4');
    if (!topBarGrid) return;

    var searchWrap = searchInput.parentElement;
    if (topBarGrid.parentElement) topBarGrid.parentElement.classList.add('kliper-control-shell');

    // Pills with icons
    var clone = document.createElement('div');
    clone.classList.add(MOVED_MARKER);

    PILLS.forEach(function (p) {
      var btn = document.createElement('button');
      btn.className = 'kliper-pill-btn';
      btn.setAttribute('data-label', p.label);
      btn.innerHTML = p.icon + '<span class="kliper-pill-label">' + p.label + '</span>';
      btn.addEventListener('click', function () { handlePillClick(p.label); });
      clone.appendChild(btn);
    });

    // Collapsible search
    hide(searchWrap);
    var searchBtn = document.createElement('button');
    searchBtn.className = 'kliper-search-btn';
    searchBtn.innerHTML = SEARCH_ICON;
    var searchExpanded = document.createElement('div');
    searchExpanded.className = 'kliper-search-expanded';
    var searchField = document.createElement('input');
    searchField.type = 'text';
    searchField.className = 'kliper-search-field';
    searchField.placeholder = 'Поиск: новостройки...';
    searchExpanded.appendChild(searchField);

    searchBtn.addEventListener('click', function () {
      var isOpen = searchExpanded.classList.toggle('open');
      searchBtn.classList.toggle('open', isOpen);
      if (isOpen) searchField.focus();
    });

    searchField.addEventListener('input', function () {
      if (searchInput) {
        var nativeSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSet.call(searchInput, searchField.value);
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    topBarGrid.classList.add('kliper-phase1-topbar');
    topBarGrid.style.cssText = '';
    var cityButton = Array.prototype.slice.call(topBarGrid.querySelectorAll('button')).find(function (button) {
      return (button.textContent || '').replace(/\s+/g, ' ').trim().indexOf('Тюмень') !== -1;
    });
    if (cityButton) {
      cityButton.classList.add('kliper-phase1-city');
      if (cityButton.parentElement) cityButton.parentElement.classList.add('kliper-phase1-city-wrap');
    }
    topBarGrid.insertBefore(clone, searchWrap);
    topBarGrid.appendChild(searchBtn);
    topBarGrid.appendChild(searchExpanded);
    setTimeout(syncActiveState, 50);
  }

  function buildMobileNav() {
    if (document.querySelector('.kliper-mobile-nav')) { syncActiveState(); return; }

    var searchInput = document.querySelector('input[placeholder*="Поиск"]');
    if (!searchInput) return;
    var topBarGrid = searchInput.closest('.grid.gap-4');
    if (!topBarGrid) return;
    var darkBar = topBarGrid.parentElement;
    if (!darkBar) return;

    var cityName = (window.KLIPER_SITE_CONFIG && window.KLIPER_SITE_CONFIG.cities && window.KLIPER_SITE_CONFIG.cities[0]) || 'Тюмень';
    var origCityBtn = document.querySelector('button[class*="min-w-[164px]"]') ||
      Array.prototype.find.call(document.querySelectorAll('button'), function(b) {
        return b.textContent.trim().indexOf('Тюмень') !== -1 && b.className.indexOf('inline-flex') !== -1;
      });

    var nav = document.createElement('div');
    nav.className = 'kliper-mobile-nav';

    var row1 = document.createElement('div');
    row1.className = 'kliper-mob-row1';

    var cityClone = document.createElement('button');
    cityClone.style.cssText = 'display:flex;align-items:center;gap:6px;color:#fff;font-weight:800;font-size:15px;font-family:Manrope,sans-serif;background:none;border:none;cursor:pointer;padding:0;';
    cityClone.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ' + cityName + ' <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>';
    cityClone.addEventListener('click', function () { if (origCityBtn) origCityBtn.click(); });

    var searchToggle = document.createElement('button');
    searchToggle.className = 'kliper-mob-search-toggle';
    searchToggle.innerHTML = SEARCH_ICON;

    row1.appendChild(cityClone);
    row1.appendChild(searchToggle);

    var searchRow = document.createElement('div');
    searchRow.className = 'kliper-mob-search-row';
    var searchField = document.createElement('input');
    searchField.className = 'kliper-mob-search-input';
    searchField.placeholder = 'Поиск: новостройки...';
    searchField.type = 'text';
    searchRow.appendChild(searchField);

    searchToggle.addEventListener('click', function () {
      var isOpen = searchRow.classList.toggle('open');
      searchToggle.classList.toggle('open', isOpen);
      if (isOpen) searchField.focus();
    });

    searchField.addEventListener('input', function () {
      if (searchInput) {
        var nativeSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSet.call(searchInput, searchField.value);
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    var pillRow = document.createElement('div');
    pillRow.className = 'kliper-mob-pills';

    PILLS.forEach(function (p) {
      var btn = document.createElement('button');
      btn.className = 'kliper-mob-pill';
      btn.setAttribute('data-label', p.label);
      btn.innerHTML = p.icon + '<span>' + p.short + '</span>';
      btn.addEventListener('click', function () { handlePillClick(p.label); });
      pillRow.appendChild(btn);
    });

    nav.appendChild(row1);
    nav.appendChild(searchRow);
    nav.appendChild(pillRow);
    darkBar.appendChild(nav);
    setTimeout(syncActiveState, 50);
  }

  function cleanSidebar() {
    document.querySelectorAll('.fixed.inset-0').forEach(function (sidebar) {
      var scrollPane = sidebar.querySelector('[class*="overflow-y-auto"]');
      if (!scrollPane) return;
      var groupsContainer = scrollPane.querySelector('.space-y-3');
      if (groupsContainer) {
        for (var i = 0; i < groupsContainer.children.length; i++) {
          var label = groupsContainer.children[i].querySelector('p');
          if (label && KEEP_GROUPS.indexOf(label.textContent.trim()) === -1) hide(groupsContainer.children[i]);
        }
      }
      scrollPane.querySelectorAll('p').forEach(function (p) {
        if (p.textContent.trim().toLowerCase() === 'быстрый старт') {
          var block = p.closest('[class*="rounded"]');
          if (block && scrollPane.contains(block)) hide(block);
        }
      });
      scrollPane.querySelectorAll('button').forEach(function (btn) {
        var span = btn.querySelector('span');
        if (span && HIDE_FILTERS.indexOf(span.textContent.trim()) !== -1) hide(btn);
      });
    });
  }

  function runAll() {
    injectStyles();
    fixSubtitle();
    cleanTabs();
    cleanHamburger();
    cleanFilters();
    movePillsToTopBar();
    buildMobileNav();
    hideOriginalFilterBar();
    cleanSidebar();
  }

  var observer = new MutationObserver(function () { runAll(); });

  function init() {
    runAll();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 200); });
  } else {
    setTimeout(init, 200);
  }
})();
