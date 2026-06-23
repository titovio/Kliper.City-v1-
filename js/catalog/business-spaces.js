(function () {
  'use strict';

  var renderTimer = 0;
  var suppressRender = false;

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

  function isBusinessView() {
    var heading = Array.prototype.slice.call(document.querySelectorAll('h1,h2')).some(function (node) {
      return (node.textContent || '').replace(/\s+/g, ' ').trim() === 'Для бизнеса';
    });
    return (window.location.hash || '').indexOf('view=business') !== -1 ||
      heading ||
      Array.prototype.some.call(document.querySelectorAll('button'), function (button) {
        return (button.textContent || '').trim() === 'Для бизнеса' &&
          /(bg-violet-|from-violet-|to-violet-|bg-gradient-to-br)/.test(button.className || '');
      });
  }

  function currentSpaceId() {
    var match = (window.location.hash || '').match(/space=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  function hasBusinessMount() {
    return Boolean(document.querySelector('[data-business-spaces-host], .kliper-business-card, .kliper-business-page'));
  }

  function activatePendingCatalogTab() {
    var pending = window.sessionStorage.getItem('kliper-pending-catalog-tab');
    if (!pending) return;
    window.sessionStorage.removeItem('kliper-pending-catalog-tab');
    window.setTimeout(function () {
      var button = Array.prototype.slice.call(document.querySelectorAll('.kliper-pill-btn')).find(function (node) {
        return (node.textContent || '').replace(/\s+/g, ' ').trim() === pending;
      });
      if (button) button.click();
    }, 700);
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
    var existing = section.querySelector('[data-business-spaces-host]');
    if (existing) return existing;
    var empty = Array.prototype.slice.call(section.querySelectorAll('h3')).find(function (node) {
      return (node.textContent || '').indexOf('Ничего не найдено') !== -1;
    });
    if (empty && empty.parentElement && empty.parentElement.parentElement) {
      empty.parentElement.parentElement.setAttribute('data-business-spaces-host', '1');
      return empty.parentElement.parentElement;
    }
    var candidate = Array.prototype.slice.call(section.children).find(function (node) {
      return !node.querySelector('.kliper-biz-bar') && !node.hasAttribute('data-kliper-collapsed');
    });
    if (candidate) {
      candidate.setAttribute('data-business-spaces-host', '1');
      return candidate;
    }
    var host = document.createElement('div');
    host.setAttribute('data-business-spaces-host', '1');
    section.appendChild(host);
    return host;
  }

  function fact(label, value) {
    return '<div class="kliper-business-fact"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value) + '</strong></div>';
  }

  function renderCard(space) {
    return '<button class="kliper-business-card" type="button" data-business-space-id="' + escapeHtml(space.id) + '" aria-label="Открыть бизнес-помещение ' + escapeHtml(space.title) + '">' +
      '<span class="kliper-business-card__image"><img src="' + escapeHtml(space.image) + '" alt="" loading="lazy"></span>' +
      '<span class="kliper-business-card__shade"></span>' +
      '<span class="kliper-business-card__top"><span class="kliper-business-card__deal">' + escapeHtml(space.deal) + '</span><span class="kliper-business-card__chip">' + escapeHtml(space.type) + '</span></span>' +
      '<span class="kliper-business-card__body">' +
        '<span class="kliper-business-card__meta"><span>' + escapeHtml(space.district) + '</span><span>' + escapeHtml(space.floor) + '</span><span>' + escapeHtml(space.access) + '</span></span>' +
        '<h3>' + escapeHtml(space.title) + '</h3>' +
        '<p class="kliper-business-card__address">' + escapeHtml(space.address) + '</p>' +
        '<span class="kliper-business-card__facts">' +
          '<span class="kliper-business-card__fact"><span>Цена</span><strong>' + escapeHtml(space.price) + '</strong></span>' +
          '<span class="kliper-business-card__fact"><span>Площадь</span><strong>' + escapeHtml(space.area) + ' м²</strong></span>' +
          '<span class="kliper-business-card__fact"><span>Ставка</span><strong>' + escapeHtml(space.pricePerMeter) + '</strong></span>' +
        '</span>' +
      '</span>' +
      '<span class="kliper-business-card__footer"><span class="kliper-business-card__badges">' +
        space.badges.slice(0, 3).map(function (item) { return '<span>' + escapeHtml(item) + '</span>'; }).join('') +
      '</span><span class="kliper-business-card__cta">Подробнее</span></span>' +
    '</button>';
  }

  function renderList() {
    var host = findHost();
    if (!host) return;
    var items = filteredSpaces();
    var filters = getSelectedFilters();
    var signature = 'list:' + JSON.stringify(filters) + ':' + items.map(function (item) { return item.id; }).join('|');
    if (host.getAttribute('data-business-render-key') === signature) return;
    host.setAttribute('data-business-render-key', signature);
    host.innerHTML =
      '<div class="kliper-business-toolbar">' +
        '<p class="kliper-business-count">' + items.length + ' бизнес-помещений</p>' +
        '<div class="kliper-business-view" aria-label="Вид выдачи"><button class="is-active" type="button">▦</button><button type="button">≡</button></div>' +
      '</div>' +
      (items.length ? '<div class="kliper-business-grid">' + items.map(renderCard).join('') + '</div>' :
        '<div class="rounded-[34px] bg-white/78 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-white/80 backdrop-blur-xl"><h3 class="text-2xl font-black text-slate-950">Ничего не найдено</h3><p class="mx-auto mt-2 max-w-xl text-sm font-semibold leading-relaxed text-slate-500">Попробуйте снять часть бизнес-фильтров или расширить бюджет.</p></div>');
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
            section('Галерея и состояние', '<div class="kliper-business-gallery">' + space.gallery.map(function (src) { return '<img src="' + escapeHtml(src) + '" alt="">'; }).join('') + '</div>') +
            section('Что важно для бизнеса', '<div class="kliper-business-checks">' +
              '<div class="kliper-business-check">' + escapeHtml(space.traffic) + '</div>' +
              '<div class="kliper-business-check">' + escapeHtml(space.condition) + '</div>' +
              '<div class="kliper-business-check">' + escapeHtml(space.deposit) + '</div>' +
              '<div class="kliper-business-check">' + escapeHtml(space.payback) + '</div>' +
              '<div class="kliper-business-check">' + escapeHtml(space.tax) + '</div>' +
              '<div class="kliper-business-check">' + escapeHtml(space.badges.join(', ')) + '</div>' +
            '</div>') +
          '</main>' +
          '<aside class="kliper-business-side">' +
            '<section class="kliper-business-side-card kliper-business-contact"><h3>Связаться по объекту</h3><div class="kliper-business-contact__price"><strong>' + escapeHtml(space.price) + '</strong><span>' + escapeHtml(space.pricePerMeter) + ' · ' + escapeHtml(space.deposit) + '</span></div><button type="button">Показать телефон</button><p style="margin:10px 0 0;color:#64748b;font-size:13px;font-weight:750;">' + escapeHtml(space.owner) + '<br>' + escapeHtml(space.phone) + '</p></section>' +
            '<section class="kliper-business-side-card"><h3>Похожие помещения</h3>' + similar.map(function (item) {
              return '<button class="kliper-business-mini" type="button" data-business-space-id="' + escapeHtml(item.id) + '"><img src="' + escapeHtml(item.image) + '" alt=""><span><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.price) + ' · ' + escapeHtml(item.area) + ' м²</span></span></button>';
            }).join('') + '</section>' +
          '</aside>' +
        '</div>' +
      '</div>';
  }

  function render() {
    if (suppressRender || !isBusinessView()) return;
    var id = currentSpaceId();
    var selected = id && spaces().filter(function (space) { return space.id === id; })[0];
    if (selected) renderDetail(selected);
    else renderList();
  }

  function schedule(delay) {
    window.clearTimeout(renderTimer);
    renderTimer = window.setTimeout(render, delay == null ? 80 : delay);
  }

  document.addEventListener('click', function (event) {
    var tabButton = event.target.closest('button');
    var tabText = tabButton ? (tabButton.textContent || tabButton.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim() : '';
    if (['Застройщики', 'Новостройки', 'Готовые ЖК'].indexOf(tabText) !== -1) {
      if (hasBusinessMount() || (window.location.hash || '').indexOf('view=business') !== -1) {
        event.preventDefault();
        event.stopPropagation();
        window.sessionStorage.setItem('kliper-pending-catalog-tab', tabText);
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        window.location.reload();
        return;
      }
      window.setTimeout(function () {
        if ((window.location.hash || '').indexOf('view=business') === -1) return;
        if (isBusinessView()) return;
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }, 120);
      return;
    }
    if (tabText === 'Для бизнеса' && !event.target.closest('.kliper-biz-dropdown')) {
      schedule(180);
      window.setTimeout(render, 360);
      window.setTimeout(render, 640);
      return;
    }

    var card = event.target.closest('[data-business-space-id]');
    if (card) {
      event.preventDefault();
      var id = card.getAttribute('data-business-space-id');
      suppressRender = true;
      window.location.hash = 'view=business&space=' + encodeURIComponent(id);
      suppressRender = false;
      schedule();
      return;
    }
    if (event.target.closest('[data-business-back]')) {
      event.preventDefault();
      suppressRender = true;
      window.location.hash = 'view=business';
      suppressRender = false;
      schedule();
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

  window.addEventListener('hashchange', function () { schedule(); });
  window.addEventListener('load', function () { schedule(); });
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
      activatePendingCatalogTab();
      schedule();
    });
  } else {
    activatePendingCatalogTab();
    schedule();
  }
})();
