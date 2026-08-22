(function () {
  'use strict';

  var renderTimer = 0;
  var suppressRender = false;
  var softSwitchingCatalogTab = false;
  var activatingBusinessRoute = false;
  var businessRouteActivationTimer = 0;
  var suppressBusinessUntil = 0;
  var businessView = 'grid';
  var businessPreviewId = '';
  var SAVED_KEY = 'kliper-saved-business-spaces';
  var businessViewIcons = {
    grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1.2"></rect><rect x="14" y="4" width="6" height="6" rx="1.2"></rect><rect x="4" y="14" width="6" height="6" rx="1.2"></rect><rect x="14" y="14" width="6" height="6" rx="1.2"></rect></svg>',
    list: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h12"></path><path d="M8 12h12"></path><path d="M8 18h12"></path><path d="M4 6h.01"></path><path d="M4 12h.01"></path><path d="M4 18h.01"></path></svg>',
    map: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z"></path><path d="M9 3v15"></path><path d="M15 6v15"></path></svg>'
  };

  function spaces() {
    return window.KLIPER_BUSINESS_SPACES || [];
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function readSavedSpaces() {
    try {
      var raw = window.localStorage && window.localStorage.getItem(SAVED_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch (error) {
      return [];
    }
  }

  function writeSavedSpaces(ids) {
    try {
      if (window.localStorage) window.localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
    } catch (error) {}
  }

  function isSavedSpace(id) {
    return readSavedSpaces().indexOf(id) !== -1;
  }

  function toggleSavedSpace(id) {
    if (!id) return false;
    var ids = readSavedSpaces();
    var index = ids.indexOf(id);
    if (index === -1) ids.push(id);
    else ids.splice(index, 1);
    writeSavedSpaces(ids);
    return index === -1;
  }

  function isActiveBusinessButton(button) {
    var classes = String(button.className || '').split(/\s+/);
    return classes.some(function (name) {
      return name === 'bg-gradient-to-br' ||
        /^bg-violet-/.test(name) ||
        /^from-violet-/.test(name) ||
        /^to-violet-/.test(name);
    });
  }

  function hasActiveBusinessTab() {
    return Array.prototype.some.call(document.querySelectorAll('button'), function (button) {
      return (button.textContent || '').trim() === 'Для бизнеса' && isActiveBusinessButton(button);
    });
  }

  function hasBusinessHeading() {
    return Array.prototype.slice.call(document.querySelectorAll('h1,h2')).some(function (node) {
      return (node.textContent || '').replace(/\s+/g, ' ').trim() === 'Для бизнеса';
    });
  }

  function routeWantsBusiness() {
    return (window.location.hash || '').indexOf('view=business') !== -1;
  }

  function isBusinessView() {
    return routeWantsBusiness() ||
      hasBusinessHeading() ||
      hasActiveBusinessTab();
  }

  function currentSpaceId() {
    var match = (window.location.hash || '').match(/space=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  function routeWantsCardPage() {
    return (window.location.hash || '').indexOf('card=') !== -1;
  }

  function hasBusinessMount() {
    return Boolean(document.querySelector('[data-business-spaces-host], .kliper-business-card, .kliper-business-page'));
  }

  function leavingBusinessRoute() {
    return hasBusinessMount() && !routeWantsBusiness() &&
      (routeWantsCardPage() || (!hasBusinessHeading() && !hasActiveBusinessTab()));
  }

  function findOriginalCatalogTab(label) {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('button.flex.h-9'));
    return buttons.find(function (node) {
      var text = (node.textContent || node.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
      if (text !== label) return false;
      if (node.closest('.kliper-pills-moved')) return false;
      if (node.closest('.kliper-mobile-nav')) return false;
      if (node.closest('.kliper-biz-dropdown')) return false;
      return true;
    });
  }

  function clearBusinessRoute() {
    if ((window.location.hash || '').indexOf('view=business') !== -1) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }

  function restoreCatalogDom() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-business-spaces-host]'), function (host) {
      if (host.parentElement) host.parentElement.removeChild(host);
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-business-hidden-original]'), function (node) {
      var display = node.getAttribute('data-business-previous-display');
      if (display) node.style.display = display;
      else node.style.removeProperty('display');
      node.removeAttribute('data-business-hidden-original');
      node.removeAttribute('data-business-previous-display');
    });
  }

  function requestBusinessRouteActivation() {
    if (!routeWantsBusiness()) return false;
    if (hasBusinessMount() || hasBusinessHeading() || hasActiveBusinessTab()) return false;
    if (businessRouteActivationTimer) return true;

    var attempts = 0;
    function tryActivate() {
      attempts += 1;
      var button = Array.prototype.slice.call(document.querySelectorAll('.kliper-pill-btn')).find(function (node) {
        return (node.textContent || '').replace(/\s+/g, ' ').trim() === 'Для бизнеса';
      }) || findOriginalCatalogTab('Для бизнеса');

      if (button) {
        activatingBusinessRoute = true;
        button.click();
        window.setTimeout(function () {
          activatingBusinessRoute = false;
          businessRouteActivationTimer = 0;
          schedule(120);
        }, 180);
        return;
      }

      if (attempts < 16) {
        businessRouteActivationTimer = window.setTimeout(tryActivate, 120);
      } else {
        businessRouteActivationTimer = 0;
      }
    }

    businessRouteActivationTimer = window.setTimeout(tryActivate, 80);
    return true;
  }

  function notifyCatalogTab(label) {
    try {
      document.dispatchEvent(new CustomEvent('kliper:phase1-set-active-tab', { detail: { label: label } }));
    } catch (error) {}
  }

  function switchToCatalogTab(label) {
    closeBusinessDropdowns();
    clearBusinessRoute();
    notifyCatalogTab(label);
    restoreCatalogDom();

    window.setTimeout(function () {
      var button = findOriginalCatalogTab(label);
      if (!button) return;

      softSwitchingCatalogTab = true;
      button.click();
      window.setTimeout(function () {
        softSwitchingCatalogTab = false;
        clearBusinessRoute();
        notifyCatalogTab(label);
      }, 160);
    }, 0);

    return true;
  }

  function getSelectedFilters() {
    var filters = {};
    Array.prototype.forEach.call(document.querySelectorAll('.kliper-biz-dropdown'), function (drop) {
      var label = drop.getAttribute('data-biz-filter-label') || '';
      var selected = drop.querySelector('.kliper-biz-option.selected');
      if (!label || !selected) return;
      var value = (selected.getAttribute('data-biz-filter-value') || selected.textContent || '').replace(/\s+/g, ' ').trim();
      if (label === 'Тип сделки') filters.deal = value;
      if (label === 'Все районы') filters.district = value;
      if (label === 'Тип помещения') filters.type = value;
      if (label === 'Площадь') filters.area = value;
      if (label === 'Бюджет') filters.budget = value;
    });
    return filters;
  }

  function areaMatches(space, filter) {
    if (!filter || filter === 'Площадь') return true;
    if (filter === 'до 50 м²') return space.area <= 50;
    if (filter === '50-100 м²') return space.area > 50 && space.area <= 100;
    if (filter === '100-300 м²') return space.area > 100 && space.area <= 300;
    if (filter === '300+ м²') return space.area > 300;
    return true;
  }

  function budgetMatches(space, filter) {
    if (!filter || filter === 'Бюджет') return true;
    if (space.deal !== 'Аренда') return false;
    var number = parseInt(String(space.price).replace(/\D/g, ''), 10) || 0;
    if (filter === 'до 50 тыс ₽') return number <= 50000;
    if (filter === '50-100 тыс ₽') return number > 50000 && number <= 100000;
    if (filter === '100-200 тыс ₽') return number > 100000 && number <= 200000;
    if (filter === '200+ тыс ₽') return number > 200000;
    return true;
  }

  function filteredSpaces() {
    var filters = getSelectedFilters();
    return spaces().filter(function (space) {
      if (filters.deal && filters.deal !== 'Тип сделки' && space.deal !== filters.deal) return false;
      if (filters.district && filters.district !== 'Все районы' && space.district !== filters.district) return false;
      if (filters.type && filters.type !== 'Тип помещения' && space.type !== filters.type) return false;
      if (!areaMatches(space, filters.area)) return false;
      if (!budgetMatches(space, filters.budget)) return false;
      return true;
    });
  }

  function findBusinessSection() {
    var filter = document.querySelector('[data-kliper-biz-polished], .kliper-biz-bar');
    if (filter) return filter.closest('.xl\\:col-span-2') || filter.closest('section') || filter.parentElement;
    var empty = Array.prototype.slice.call(document.querySelectorAll('h3')).find(function (node) {
      return (node.textContent || '').indexOf('Ничего не найдено') !== -1;
    });
    return empty && empty.closest('.xl\\:col-span-2');
  }

  function findHost() {
    var section = findBusinessSection();
    if (!section) return null;
    var existing = document.querySelector('[data-business-spaces-host]');
    if (existing) return existing;

    Array.prototype.forEach.call(section.children, function (node) {
      if (node.hasAttribute('data-business-spaces-host')) return;
      if (node.querySelector('.kliper-biz-bar') || node.matches('.kliper-biz-bar')) return;
      if (node.hasAttribute('data-business-hidden-original')) return;
      node.setAttribute('data-business-hidden-original', '1');
      node.setAttribute('data-business-previous-display', node.style.display || '');
      node.style.display = 'none';
    });

    var host = document.createElement('div');
    host.setAttribute('data-business-spaces-host', '1');
    section.appendChild(host);
    return host;
  }

  function fact(label, value) {
    return '<div class="kliper-business-fact"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value) + '</strong></div>';
  }

  function check(label, value) {
    return '<div class="kliper-business-check"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value) + '</strong></div>';
  }

  function splitFit(space) {
    return String(space.payback || '').split(',').map(function (item) {
      return item.replace(/^\s+|\s+$/g, '');
    }).filter(Boolean);
  }

  function renderFitTags(space) {
    var tags = splitFit(space);
    if (!tags.length) return '';
    return '<div class="kliper-business-fit">' + tags.map(function (item) {
      return '<span>' + escapeHtml(item) + '</span>';
    }).join('') + '</div>';
  }

  function renderCard(space) {
    var saved = isSavedSpace(space.id);
    var fitTags = splitFit(space).slice(0, 1).map(function (item) { return '<span>' + escapeHtml(item) + '</span>'; }).join('');
    return '<article class="kliper-business-card" role="button" tabindex="0" data-business-space-id="' + escapeHtml(space.id) + '" aria-label="Открыть бизнес-помещение ' + escapeHtml(space.title) + '">' +
      '<span class="kliper-business-card__image"><img src="' + escapeHtml(space.image) + '" alt="" loading="lazy"></span>' +
      '<span class="kliper-business-card__shade"></span>' +
      '<span class="kliper-business-card__top"><span class="kliper-business-card__deal">' + escapeHtml(space.deal) + '</span><span class="kliper-business-card__chip">' + escapeHtml(space.type) + '</span></span>' +
      '<span class="kliper-business-card__body">' +
        '<span class="kliper-business-card__meta"><span>' + escapeHtml(space.district) + '</span><span>' + escapeHtml(space.floor) + '</span><span>' + escapeHtml(space.access) + '</span></span>' +
        '<h3>' + escapeHtml(space.title) + '</h3>' +
        '<p class="kliper-business-card__address">' + escapeHtml(space.address) + '</p>' +
        (fitTags ? '<span class="kliper-business-card__fit">' + fitTags + '</span>' : '') +
        '<span class="kliper-business-card__facts">' +
          '<span class="kliper-business-card__price"><span>Цена</span><strong>' + escapeHtml(space.price) + '</strong></span>' +
          '<span class="kliper-business-card__secondary"><span><b>Площадь</b>' + escapeHtml(space.area) + ' м²</span><span><b>Ставка</b>' + escapeHtml(space.pricePerMeter) + '</span></span>' +
        '</span>' +
      '</span>' +
      '<span class="kliper-business-card__footer"><span class="kliper-business-card__badges">' +
        space.badges.slice(0, 1).map(function (item) { return '<span>' + escapeHtml(item) + '</span>'; }).join('') +
      '</span><span class="kliper-business-card__actions">' +
        '<button class="kliper-business-card__save' + (saved ? ' is-saved' : '') + '" type="button" data-business-save="' + escapeHtml(space.id) + '" aria-pressed="' + (saved ? 'true' : 'false') + '">' + (saved ? 'Сохранено' : 'Сохранить') + '</button>' +
        '<button class="kliper-business-card__cta" type="button" data-business-open="' + escapeHtml(space.id) + '">Подробнее</button>' +
      '</span></span>' +
    '</article>';
  }

  function viewButton(view, label) {
    return '<button class="' + (businessView === view ? 'is-active' : '') + '" type="button" data-business-view="' + view + '" aria-label="' + label + '" aria-pressed="' + (businessView === view ? 'true' : 'false') + '">' + businessViewIcons[view] + '</button>';
  }

  function renderViewToggle() {
    return '<div class="kliper-business-view" aria-label="Вид выдачи">' +
      viewButton('grid', 'Показать бизнес-помещения сеткой') +
      viewButton('list', 'Показать бизнес-помещения списком') +
      viewButton('map', 'Показать бизнес-помещения на карте') +
    '</div>';
  }

  function renderMap(items) {
    var pins = items.map(function (space, index) {
      var left = 12 + ((index * 29) % 76);
      var top = 18 + ((index * 37) % 62);
      return '<button class="kliper-business-map__pin" type="button" data-business-space-id="' + escapeHtml(space.id) + '" style="left:' + left + '%;top:' + top + '%" aria-label="Открыть на карте ' + escapeHtml(space.title) + '">' +
        '<span>' + escapeHtml(index + 1) + '</span>' +
        '<strong>' + escapeHtml(space.title) + '</strong>' +
        '<em>' + escapeHtml(space.price) + '</em>' +
      '</button>';
    }).join('');

    var list = items.map(function (space, index) {
      return '<button class="kliper-business-map__item" type="button" data-business-space-id="' + escapeHtml(space.id) + '">' +
        '<span>' + escapeHtml(index + 1) + '</span>' +
        '<strong>' + escapeHtml(space.title) + '</strong>' +
        '<em>' + escapeHtml(space.address) + '</em>' +
      '</button>';
    }).join('');

    return '<div class="kliper-business-map">' +
      '<div class="kliper-business-map__scene" aria-label="Карта бизнес-помещений">' +
        '<span class="kliper-business-map__river"></span>' +
        '<span class="kliper-business-map__road kliper-business-map__road--one"></span>' +
        '<span class="kliper-business-map__road kliper-business-map__road--two"></span>' +
        pins +
      '</div>' +
      '<div class="kliper-business-map__list">' + list + '</div>' +
    '</div>';
  }

  function renderPreview(space) {
    if (!space) return '';
    var saved = isSavedSpace(space.id);
    return '<aside class="kliper-business-preview" role="dialog" aria-modal="false" aria-label="Быстрый просмотр ' + escapeHtml(space.title) + '">' +
      '<button class="kliper-business-preview__close" type="button" data-business-preview-close aria-label="Закрыть быстрый просмотр">×</button>' +
      '<img src="' + escapeHtml(space.image) + '" alt="" loading="lazy">' +
      '<div class="kliper-business-preview__body">' +
        '<p class="kliper-business-preview__kicker">' + escapeHtml(space.deal) + ' · ' + escapeHtml(space.type) + '</p>' +
        '<h3>' + escapeHtml(space.title) + '</h3>' +
        '<p>' + escapeHtml(space.address) + '</p>' +
        '<div class="kliper-business-preview__facts">' +
          '<strong>' + escapeHtml(space.price) + '</strong>' +
          '<span>' + escapeHtml(space.area) + ' м²</span>' +
          '<span>' + escapeHtml(space.pricePerMeter) + '</span>' +
        '</div>' +
        '<div class="kliper-business-preview__actions">' +
          '<button type="button" data-business-save="' + escapeHtml(space.id) + '" class="' + (saved ? 'is-saved' : '') + '" aria-pressed="' + (saved ? 'true' : 'false') + '">' + (saved ? 'Сохранено' : 'Сохранить себе') + '</button>' +
          '<button type="button" data-business-preview-open="' + escapeHtml(space.id) + '">Открыть страницу</button>' +
        '</div>' +
      '</div>' +
    '</aside>';
  }

  function renderList() {
    var host = findHost();
    if (!host) return;
    var items = filteredSpaces();
    var filters = getSelectedFilters();
    var preview = businessPreviewId && items.filter(function (item) { return item.id === businessPreviewId; })[0];
    if (businessPreviewId && !preview) businessPreviewId = '';
    var signature = 'list:' + businessView + ':' + JSON.stringify(filters) + ':' + items.map(function (item) { return item.id; }).join('|') + ':preview:' + businessPreviewId + ':saved:' + readSavedSpaces().join('|');
    if (host.getAttribute('data-business-render-key') === signature) return;
    host.setAttribute('data-business-render-key', signature);
    var content = '';
    if (items.length && businessView === 'map') {
      content = renderMap(items);
    } else if (items.length) {
      content = '<div class="kliper-business-grid' + (businessView === 'list' ? ' kliper-business-grid--list' : '') + '">' + items.map(renderCard).join('') + '</div>';
    } else {
      content = '<div class="rounded-[34px] bg-white/78 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-white/80 backdrop-blur-xl"><h3 class="text-2xl font-black text-slate-950">Ничего не найдено</h3><p class="mx-auto mt-2 max-w-xl text-sm font-semibold leading-relaxed text-slate-500">Попробуйте снять часть бизнес-фильтров или расширить бюджет.</p></div>';
    }
    host.innerHTML =
      '<div class="kliper-business-toolbar">' +
        '<p class="kliper-business-count">' + items.length + ' бизнес-помещений</p>' +
        renderViewToggle() +
      '</div>' +
      content +
      renderPreview(preview);
    document.dispatchEvent(new CustomEvent('kliper:business-results-rendered'));
  }

  function section(title, body) {
    return '<section class="kliper-business-section"><h2>' + escapeHtml(title) + '</h2>' + body + '</section>';
  }

  function renderDetail(space) {
    var host = findHost();
    if (!host || !space) return;
    var signature = 'detail:' + space.id;
    if (host.getAttribute('data-business-render-key') === signature) return;
    host.setAttribute('data-business-render-key', signature);
    var similar = spaces().filter(function (item) { return item.id !== space.id; }).slice(0, 3);
    host.innerHTML =
      '<div class="kliper-business-page">' +
        '<button class="kliper-business-back" type="button" data-business-back>← Вернуться к помещениям</button>' +
        '<section class="kliper-business-hero">' +
          '<div class="kliper-business-hero__media"><img src="' + escapeHtml(space.image) + '" alt="' + escapeHtml(space.title) + '">' +
            '<span class="kliper-business-hero__shade"></span>' +
            '<div class="kliper-business-hero__content">' +
              '<div class="kliper-business-hero__kicker"><span>' + escapeHtml(space.deal) + '</span><span>' + escapeHtml(space.type) + '</span><span>' + escapeHtml(space.area) + ' м²</span><span>' + escapeHtml(space.floor) + '</span></div>' +
              '<h1>' + escapeHtml(space.title) + '</h1>' +
              '<div class="kliper-business-hero__price"><strong>' + escapeHtml(space.price) + '</strong><span>' + escapeHtml(space.pricePerMeter) + '</span><span>' + escapeHtml(space.address) + '</span></div>' +
            '</div>' +
          '</div>' +
        '</section>' +
        '<div class="kliper-business-layout">' +
          '<main class="kliper-business-main">' +
            section('Ключевые параметры', '<div class="kliper-business-facts">' +
              fact('Площадь', space.area + ' м²') +
              fact('Ставка', space.pricePerMeter) +
              fact('Этаж / вход', space.floor + ', ' + space.access) +
              fact('Потолки', space.ceiling) +
              fact('Мощность', space.power) +
              fact('Парковка', space.parking) +
            '</div>') +
            section('Описание', '<p>' + escapeHtml(space.description) + '</p>') +
            section('Для какого бизнеса', renderFitTags(space) + '<p class="kliper-business-section-note">Подборка сценариев основана на параметрах объекта: вход, поток, мощность, состояние и окружение.</p>') +
            section('Галерея и состояние', '<div class="kliper-business-gallery">' + space.gallery.map(function (src) { return '<img src="' + escapeHtml(src) + '" alt="">'; }).join('') + '</div>') +
            section('Что важно для бизнеса', '<div class="kliper-business-checks">' +
              check('Поток', space.traffic) +
              check('Состояние', space.condition) +
              check('Условия', space.deposit) +
              check('Налоги', space.tax) +
              check('Формат', space.badges.join(', ')) +
              check('Парковка', space.parking) +
            '</div>') +
          '</main>' +
          '<aside class="kliper-business-side">' +
            '<section class="kliper-business-side-card kliper-business-contact"><p class="kliper-business-side-eyebrow">' + escapeHtml(space.deal) + ' · ' + escapeHtml(space.type) + '</p><h3>Связаться по объекту</h3><div class="kliper-business-contact__price"><strong>' + escapeHtml(space.price) + '</strong><span>' + escapeHtml(space.pricePerMeter) + ' · ' + escapeHtml(space.deposit) + '</span></div><button type="button">Показать телефон</button><p class="kliper-business-contact__owner">' + escapeHtml(space.owner) + '<br>' + escapeHtml(space.phone) + '</p><div class="kliper-business-contact__mini"><span>Проверить поток</span><strong>' + escapeHtml(space.traffic) + '</strong></div></section>' +
            '<section class="kliper-business-side-card"><h3>Коротко об объекте</h3><div class="kliper-business-side-facts">' +
              '<span><b>Вход</b>' + escapeHtml(space.access) + '</span>' +
              '<span><b>Потолки</b>' + escapeHtml(space.ceiling) + '</span>' +
              '<span><b>Мощность</b>' + escapeHtml(space.power) + '</span>' +
              '<span><b>Состояние</b>' + escapeHtml(space.condition) + '</span>' +
            '</div></section>' +
            '<section class="kliper-business-side-card"><h3>Похожие помещения</h3>' + similar.map(function (item) {
              return '<button class="kliper-business-mini" type="button" data-business-space-id="' + escapeHtml(item.id) + '"><img src="' + escapeHtml(item.image) + '" alt=""><span><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.price) + ' · ' + escapeHtml(item.area) + ' м²</span></span></button>';
            }).join('') + '</section>' +
          '</aside>' +
        '</div>' +
      '</div>';
  }

  function render() {
    if (requestBusinessRouteActivation()) return;
    if (Date.now() < suppressBusinessUntil) return;
    if (suppressRender || !isBusinessView()) return;
    var id = currentSpaceId();
    var selected = id && spaces().filter(function (space) { return space.id === id; })[0];
    if (selected) renderDetail(selected);
    else renderList();
  }

  function closeBusinessDropdowns() {
    Array.prototype.forEach.call(document.querySelectorAll('.kliper-biz-panel.open'), function (panel) {
      panel.classList.remove('open');
    });
    Array.prototype.forEach.call(document.querySelectorAll('.kliper-biz-trigger.open'), function (trigger) {
      trigger.classList.remove('open');
      var icon = trigger.querySelector('.kliper-biz-chevron');
      if (icon) {
        icon.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>';
      }
    });
  }

  function collapseFilterPanel() {
    var action = Array.prototype.slice.call(document.querySelectorAll('button')).find(function (button) {
      return (button.textContent || '').replace(/\s+/g, ' ').trim() === 'Свернуть фильтр';
    });
    if (action) action.click();
  }

  function schedule(delay) {
    window.clearTimeout(renderTimer);
    renderTimer = window.setTimeout(render, delay == null ? 80 : delay);
  }

  document.addEventListener('click', function (event) {
    var tabButton = event.target.closest('button');
    var tabText = tabButton ? (tabButton.textContent || tabButton.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim() : '';
    if (tabButton && tabButton.getAttribute('aria-label') === 'Моя страница') {
      suppressBusinessUntil = Date.now() + 2400;
      closeBusinessDropdowns();
      restoreCatalogDom();
      window.setTimeout(restoreCatalogDom, 120);
      window.setTimeout(restoreCatalogDom, 520);
      return;
    }
    if (['Застройщики', 'Новостройки', 'Готовые ЖК'].indexOf(tabText) !== -1) {
      if (softSwitchingCatalogTab) return;
      if (hasBusinessMount() || routeWantsBusiness()) {
        event.preventDefault();
        event.stopPropagation();
        switchToCatalogTab(tabText);
        return;
      }
      window.setTimeout(function () {
        if (!routeWantsBusiness()) return;
        if (isBusinessView()) return;
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }, 120);
      return;
    }
    if (tabText === 'Для бизнеса' && !event.target.closest('.kliper-biz-dropdown')) {
      if (activatingBusinessRoute) {
        schedule(220);
        window.setTimeout(render, 460);
        return;
      }
      if (hasBusinessHeading() || hasActiveBusinessTab() || hasBusinessMount()) {
        event.preventDefault();
        event.stopPropagation();
        closeBusinessDropdowns();
        collapseFilterPanel();
        schedule(120);
        return;
      }
      schedule(180);
      window.setTimeout(render, 360);
      window.setTimeout(render, 640);
      return;
    }

    var save = event.target.closest('[data-business-save]');
    if (save) {
      event.preventDefault();
      event.stopPropagation();
      toggleSavedSpace(save.getAttribute('data-business-save'));
      renderList();
      return;
    }
    var open = event.target.closest('[data-business-open]');
    if (open) {
      event.preventDefault();
      event.stopPropagation();
      suppressRender = true;
      window.location.hash = 'view=business&space=' + encodeURIComponent(open.getAttribute('data-business-open'));
      suppressRender = false;
      schedule();
      return;
    }
    var previewOpen = event.target.closest('[data-business-preview-open]');
    if (previewOpen) {
      event.preventDefault();
      event.stopPropagation();
      suppressRender = true;
      window.location.hash = 'view=business&space=' + encodeURIComponent(previewOpen.getAttribute('data-business-preview-open'));
      suppressRender = false;
      schedule();
      return;
    }
    if (event.target.closest('[data-business-preview-close]')) {
      event.preventDefault();
      event.stopPropagation();
      businessPreviewId = '';
      renderList();
      return;
    }

    var card = event.target.closest('[data-business-space-id]');
    if (card) {
      event.preventDefault();
      var id = card.getAttribute('data-business-space-id');
      if (currentSpaceId()) {
        suppressRender = true;
        window.location.hash = 'view=business&space=' + encodeURIComponent(id);
        suppressRender = false;
        schedule();
      } else {
        businessPreviewId = id;
        renderList();
      }
      return;
    }
    if (event.target.closest('[data-business-back]')) {
      event.preventDefault();
      suppressRender = true;
      window.location.hash = 'view=business';
      suppressRender = false;
      businessPreviewId = '';
      schedule();
      return;
    }
    var viewButton = event.target.closest('[data-business-view]');
    if (viewButton) {
      event.preventDefault();
      businessView = viewButton.getAttribute('data-business-view') || 'grid';
      businessPreviewId = '';
      renderList();
      return;
    }
    if (event.target.closest('.kliper-biz-option')) {
      if (currentSpaceId()) {
        suppressRender = true;
        window.location.hash = 'view=business';
        suppressRender = false;
      }
      window.setTimeout(renderList, 20);
    }
  }, true);

  window.addEventListener('hashchange', function () {
    if (leavingBusinessRoute()) {
      closeBusinessDropdowns();
      restoreCatalogDom();
      businessPreviewId = '';
      return;
    }
    schedule();
  });
  window.addEventListener('load', function () {
    schedule();
  });
  document.addEventListener('kliper:business-filter-ready', function () { schedule(20); });
  document.addEventListener('kliper:business-filter-change', function () {
    if (currentSpaceId()) {
      suppressRender = true;
      window.location.hash = 'view=business';
      suppressRender = false;
    }
    renderList();
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      schedule();
    });
  } else {
    schedule();
  }

  document.addEventListener('keydown', function (event) {
    var card = event.target.closest && event.target.closest('.kliper-business-card[data-business-space-id]');
    if (!card || event.target.closest('button')) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    card.click();
  });
})();
