(function () {
  'use strict';

  var HEART_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  var BELL_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
  var COMMENT_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  var PIN_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
  var CHEVRON_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>';

  var FALLBACK_IMAGES = [
    './assets/images/jk/brusnika__rechnoy_port_cover_4x3.webp',
    './assets/images/jk/enko__ayvazovskiy_city_cover_4x3.webp',
    './assets/images/jk/gk_korney__korney_cover_4x3.webp',
    './assets/images/jk/dk_harizmy__akvatoriya_cover_4x3.webp',
    './assets/images/jk/strana__semya_cover_4x3.webp',
    './assets/images/jk/midgard_rus__midgard_na_uezdnoy_cover_4x3.webp',
    './assets/images/jk/psk_dom_development__da_kvartal_central_cover_4x3.webp',
    './assets/images/jk/inko__ariya_cover_4x3.webp',
    './assets/images/jk/gk_tis__dok_cover_4x3.webp',
    './assets/images/jk/gk_sever__airis_cover_4x3.webp',
    './assets/images/jk/tyumenskaya_dsk__novo_patrushevo_cover_4x3.webp',
    './assets/images/jk/pik__ozernyy_park_rerender_cover_4x3.webp',
    './assets/images/jk/etalon__finskiy_zaliv_cover_4x3.webp',
    './assets/images/jk/gk_partner__skandia_kvartal_u_ozera_cover_4x3.webp'
  ];

  function getBuildingImage(b) {
    if (window.KLIPER_GET_JK_COVER) {
      var cover = window.KLIPER_GET_JK_COVER(b);
      if (cover) return cover;
    }
    if (window.KLIPER_JK_COVERS && window.KLIPER_JK_COVERS[b.name]) return window.KLIPER_JK_COVERS[b.name];
    if (b.imageUrl && b.imageUrl.indexOf('photo-1') !== -1) return b.imageUrl;
    return FALLBACK_IMAGES[b.id % FALLBACK_IMAGES.length];
  }

  function generateCounters(id) {
    var seed = id * 7 + 31;
    return {
      likes: 600 + (seed * 13 % 200),
      notifications: 100 + (seed * 7 % 180),
      comments: 10 + (seed * 3 % 40)
    };
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function renderBuildingCard(b) {
    var counters = generateCounters(b.id);
    var zoneLabel = b.zone || 'город';
    var infoLine = '';
    if (b.year) infoLine += 'сдача ' + b.year;
    if (b.price) infoLine += (infoLine ? ' · ' : '') + b.price;

    return '<article class="kliper-card" role="button" aria-label="Открыть карточку ' + escapeHtml(b.name) + '" data-building-id="' + b.id + '">' +
      '<div class="kliper-card-image">' +
        '<img src="' + escapeHtml(getBuildingImage(b)) + '" alt="" loading="lazy">' +
      '</div>' +
      '<span class="kliper-card-badge-profile">' + escapeHtml(zoneLabel) + '</span>' +
      '<div class="kliper-card-content">' +
        '<div class="kliper-card-districts">' + PIN_SVG + ' ' + escapeHtml(b.district) + '</div>' +
        '<h3 class="kliper-card-name">' + escapeHtml(b.name) + '</h3>' +
        (infoLine ? '<div class="kliper-card-badges"><span class="kliper-card-status-badge">' + escapeHtml(infoLine) + '</span></div>' : '') +
      '</div>' +
      '<div class="kliper-card-footer">' +
        '<span class="kliper-card-counter">' + HEART_SVG + ' ' + counters.likes + '</span>' +
        '<span class="kliper-card-counter">' + BELL_SVG + ' ' + counters.notifications + '</span>' +
        '<span class="kliper-card-counter">' + COMMENT_SVG + ' ' + counters.comments + '</span>' +
      '</div>' +
    '</article>';
  }

  // ---- Filtering ----

  var activeFilters = { zone: 'all', district: 'all' };

  function getFilteredBuildings(viewType) {
    var buildings = window.KLIPER_BUILDINGS || [];
    var filtered;

    if (viewType === 'novostroyki') {
      filtered = buildings.filter(function (b) {
        return !b.isCompletedResidentialProject &&
          !b.isReadyResidential &&
          b.projectReadinessStatus !== 'completed' &&
          b.readinessStatus !== 'ready' &&
          b.status !== 'сдан' &&
          b.status !== 'готов';
      });
    } else if (viewType === 'gotovye') {
      filtered = buildings.filter(function (b) {
        return b.isCompletedResidentialProject ||
          b.isReadyResidential ||
          b.projectReadinessStatus === 'completed' ||
          b.readinessStatus === 'ready' ||
          b.status === 'сдан' ||
          b.status === 'готов';
      });
    } else if (viewType === 'business') {
      filtered = buildings.filter(function (b) { return b.tags && b.tags.indexOf('коммерция') !== -1; });
    } else {
      filtered = buildings;
    }

    if (activeFilters.zone !== 'all') {
      filtered = filtered.filter(function (b) { return b.zone === activeFilters.zone; });
    }
    if (activeFilters.district !== 'all') {
      filtered = filtered.filter(function (b) { return b.district === activeFilters.district; });
    }

    return filtered;
  }

  function renderFilterBar(containerId, viewType) {
    var filterEl = document.getElementById('kliper-filter-bar');
    if (!filterEl) return;

    if (viewType === 'developers') {
      filterEl.innerHTML = '';
      filterEl.style.display = 'none';
      return;
    }

    filterEl.style.display = '';

    var filters = window.KLIPER_FILTERS || {};
    var zones = filters.zones || ['Все районы', 'В городе', 'У воды', 'За городом', 'Центральный'];
    var districts = ['Все округа', 'Центральный', 'Ленинский', 'Калининский', 'Восточный'];

    var html = '';

    // Zone filter pills
    for (var i = 0; i < zones.length; i++) {
      var z = zones[i];
      var zoneVal = i === 0 ? 'all' : z.toLowerCase();
      var isActive = (i === 0 && activeFilters.zone === 'all') ||
                     (activeFilters.zone === zoneVal);
      html += '<button class="kliper-filter-btn' + (isActive ? ' active' : '') + '" data-filter-zone="' + escapeHtml(zoneVal) + '">' +
        escapeHtml(z) + '</button>';
    }

    // District dropdown
    html += '<button class="kliper-filter-btn" data-filter-type="district">' +
      (activeFilters.district === 'all' ? 'Все округа' : escapeHtml(activeFilters.district)) +
      ' ' + CHEVRON_SVG + '</button>';

    // Scenario pills for novostroyki
    if (viewType === 'novostroyki') {
      var scenarios = filters.novostroykiFilters || [];
      for (var s = 1; s < scenarios.length; s++) {
        html += '<button class="kliper-filter-btn">' + escapeHtml(scenarios[s]) + '</button>';
      }
    }

    filterEl.innerHTML = html;
  }

  function bindFilterClicks() {
    document.addEventListener('click', function (e) {
      var zoneBtn = e.target.closest('[data-filter-zone]');
      if (zoneBtn) {
        activeFilters.zone = zoneBtn.getAttribute('data-filter-zone');
        var view = (window.KLIPER_ROUTER && window.KLIPER_ROUTER.getView()) || 'novostroyki';
        renderGrid('kliper-cards', view);
        return;
      }

      var districtBtn = e.target.closest('[data-filter-type="district"]');
      if (districtBtn) {
        var districts = ['all', 'Центральный', 'Ленинский', 'Калининский', 'Восточный'];
        var currentIdx = districts.indexOf(activeFilters.district);
        activeFilters.district = districts[(currentIdx + 1) % districts.length];
        var view2 = (window.KLIPER_ROUTER && window.KLIPER_ROUTER.getView()) || 'novostroyki';
        renderGrid('kliper-cards', view2);
      }
    });
  }

  function renderGrid(containerId, viewType) {
    var container = document.getElementById(containerId);
    if (!container) return;

    renderFilterBar(containerId, viewType);

    var buildings = getFilteredBuildings(viewType);

    var countEl = document.getElementById('kliper-card-count');
    if (countEl) countEl.textContent = buildings.length + ' карточек';

    if (!buildings.length) {
      container.innerHTML = '<div style="text-align:center;padding:60px 20px;">' +
        '<div style="font-size:48px;margin-bottom:16px;">🏗</div>' +
        '<h3 style="font-size:18px;font-weight:900;color:#334155;margin:0 0 8px;">Ничего не найдено</h3>' +
        '<p style="font-size:14px;color:#94a3b8;">Попробуйте изменить фильтры</p>' +
      '</div>';
      return;
    }

    var html = '';
    for (var i = 0; i < buildings.length; i++) {
      html += renderBuildingCard(buildings[i]);
    }
    container.innerHTML = html;
  }

  bindFilterClicks();

  window.KLIPER_RENDER = window.KLIPER_RENDER || {};
  window.KLIPER_RENDER.buildings = renderGrid;
})();
