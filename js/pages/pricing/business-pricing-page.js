(function () {
  'use strict';

  var rootId = 'kliper-business-pricing-root';
  var activeClass = 'kliper-business-pricing-active';
  var dom = window.KLIPER_DOM || {};
  var escapeHtml = dom.escapeHtml || function (value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  function getRoot() {
    var root = document.getElementById(rootId);
    if (!root) {
      root = document.createElement('div');
      root.id = rootId;
      document.body.appendChild(root);
    }
    return root;
  }

  function getRouteCompany() {
    var hash = window.location.hash || '';
    var match = hash.match(/^#business-pricing(?:=([^&]+))?/);
    if (!match) return null;
    return match[1] ? decodeURIComponent(match[1]) : '';
  }

  function getPricingSnapshot() {
    var adapter = window.KLIPER_BUSINESS_PRICING_ADAPTER;
    if (adapter && typeof adapter.getPricingSnapshot === 'function') {
      return adapter.getPricingSnapshot();
    }
    return {
      source: 'mock',
      pricing: window.KLIPER_COMPANY_PRICING || { plans: [], notes: [] }
    };
  }

  function getPricing() {
    return getPricingSnapshot().pricing || { plans: [], notes: [] };
  }

  function renderFeatures(features) {
    return (features || []).map(function (feature) {
      return '<li><span aria-hidden="true">✓</span>' + escapeHtml(feature) + '</li>';
    }).join('');
  }

  function renderPlan(plan) {
    return '<article class="kliper-business-pricing-card' + (plan.badge ? ' is-featured' : '') + '">' +
      (plan.badge ? '<span class="kliper-business-pricing-card__badge">' + escapeHtml(plan.badge) + '</span>' : '') +
      '<h2>' + escapeHtml(plan.name) + '</h2>' +
      '<div class="kliper-business-pricing-price"><strong>' + escapeHtml(plan.price) + '</strong><span>/ ' + escapeHtml(plan.period || 'мес') + '</span></div>' +
      '<p>' + escapeHtml(plan.label) + '</p>' +
      '<ul>' + renderFeatures(plan.features) + '</ul>' +
      '<button type="button" data-business-pricing-select="' + escapeHtml(plan.id) + '">' + escapeHtml(plan.button || 'Выбрать') + '</button>' +
    '</article>';
  }

  function renderNotes(notes, addOn) {
    var items = [];
    if (addOn) items.push(addOn.title + ' — ' + addOn.price);
    items = items.concat(notes || []);
    return items.map(function (note) {
      return '<span>' + escapeHtml(note) + '</span>';
    }).join('');
  }

  function refreshPricingApiSource(root) {
    var api = window.KLIPER_API;
    var adapter = window.KLIPER_BUSINESS_PRICING_ADAPTER;
    if (!api || typeof api.isEnabled !== 'function' || !api.isEnabled()) return;
    if (!adapter || typeof adapter.loadPricing !== 'function') return;

    adapter.loadPricing().then(function (snapshot) {
      var node = root.querySelector('.kliper-business-pricing');
      if (!node || !snapshot) return;
      if (snapshot.source) node.setAttribute('data-api-source', snapshot.source);
      if (snapshot.warning) node.setAttribute('data-api-warning', snapshot.warning);
      if (snapshot.error && snapshot.error.code) node.setAttribute('data-api-error', snapshot.error.code);
    });
  }

  function renderPricing(companySlug) {
    var snapshot = getPricingSnapshot();
    var pricing = snapshot.pricing || getPricing();
    var root = getRoot();
    var plans = pricing.plans || [];

    document.body.classList.add(activeClass);
    root.innerHTML = '<main class="kliper-business-pricing" aria-label="Тарифы размещения" data-api-source="' + escapeHtml(snapshot.source || 'mock') + '">' +
      '<header class="kliper-business-pricing-hero">' +
        '<div>' +
          '<p>' + escapeHtml(pricing.annualPromo || '') + '</p>' +
          '<h1>Тарифы размещения</h1>' +
          '<span>Одна подписка — одна или несколько карточек вашей компании, филиалов, проектов или объектов.</span>' +
        '</div>' +
        '<div class="kliper-business-pricing-actions">' +
          (companySlug ? '<button type="button" data-business-pricing-back="' + escapeHtml(companySlug) + '">Вернуться в кабинет</button>' : '') +
          '<button type="button" data-business-pricing-close>В каталог</button>' +
        '</div>' +
      '</header>' +
      '<section class="kliper-business-pricing-grid">' + plans.map(renderPlan).join('') + '</section>' +
      '<section class="kliper-business-pricing-notes">' + renderNotes(pricing.notes, pricing.addOn) + '</section>' +
    '</main>';
    refreshPricingApiSource(root);
  }

  function closePricing() {
    document.body.classList.remove(activeClass);
    getRoot().innerHTML = '';
  }

  function syncRoute() {
    var companySlug = getRouteCompany();
    if (companySlug === null) {
      closePricing();
      return;
    }
    renderPricing(companySlug);
  }

  function bindEvents() {
    document.addEventListener('click', function (event) {
      var open = event.target.closest('[data-company-pricing-open], [data-business-pricing-open]');
      var back = event.target.closest('[data-business-pricing-back]');
      var close = event.target.closest('[data-business-pricing-close]');
      var select = event.target.closest('[data-business-pricing-select]');

      if (open) {
        event.preventDefault();
        event.stopPropagation();
        var slug = open.getAttribute('data-company-pricing-open') || open.getAttribute('data-business-pricing-open') || '';
        window.location.hash = 'business-pricing' + (slug ? '=' + encodeURIComponent(slug) : '');
        return;
      }

      if (back) {
        event.preventDefault();
        window.location.hash = 'company-cabinet=' + encodeURIComponent(back.getAttribute('data-business-pricing-back') || '');
        return;
      }

      if (close) {
        event.preventDefault();
        window.location.hash = '';
        closePricing();
        return;
      }

      if (select) {
        event.preventDefault();
        select.textContent = 'Скоро в кабинете';
        select.setAttribute('aria-disabled', 'true');
      }
    }, true);

    window.addEventListener('hashchange', syncRoute);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      bindEvents();
      syncRoute();
    }, { once: true });
  } else {
    bindEvents();
    syncRoute();
  }
})();
