(function () {
  var rootId = 'kliper-company-cabinet-root';
  var activeClass = 'kliper-company-cabinet-active';
  var enhancedAttr = 'data-kliper-company-cabinet-enhanced';
  var dom = window.KLIPER_DOM || {};
  var escapeHtml = dom.escapeHtml || function (value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };
  var toArray = dom.toArray || function (list) {
    return Array.prototype.slice.call(list || []);
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

  function getRoute() {
    var hash = window.location.hash || '';
    var match = hash.match(/^#company-cabinet=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function getDevelopers() {
    return window.KLIPER_DEVELOPERS || [];
  }

  function findDeveloper(routeValue) {
    var developers = getDevelopers();
    var route = normalize(routeValue);
    return developers.find(function (developer) {
      return normalize(developer.slug) === route || normalize(developer.name) === route;
    }) || developers[0] || null;
  }

  function findDeveloperByPage() {
    var headings = toArray(document.querySelectorAll('h1, h2'));
    var names = getDevelopers().map(function (developer) { return developer.name; });
    var title = '';

    headings.some(function (heading) {
      var text = (heading.textContent || '').replace(/\s+/g, ' ').trim();
      if (names.indexOf(text) !== -1) {
        title = text;
        return true;
      }
      return false;
    });

    return getDevelopers().find(function (developer) { return developer.name === title; }) || getDevelopers()[0] || null;
  }

  function getCabinetConfig(developer) {
    var source = window.KLIPER_COMPANY_CABINET || {};
    var defaults = source.defaults || {};
    var company = (source.companies || {})[developer.slug] || {};

    return {
      companyId: company.companyId || developer.slug,
      companyName: company.companyName || developer.name,
      currentRole: company.currentRole || defaults.currentRole || 'company_owner',
      profileStatus: company.profileStatus || defaults.profileStatus || 'published',
      profileStatusLabel: company.profileStatusLabel || defaults.profileStatusLabel || 'Профиль опубликован',
      healthLabel: company.healthLabel || defaults.healthLabel || 'Проверки перед публикацией',
      currentPlan: company.currentPlan || defaults.currentPlan || '',
      lead: company.lead || 'Рабочее пространство компании в Kliper.City.',
      documents: company.documents || defaults.documents || [],
      posts: company.posts || defaults.posts || [],
      stories: company.stories || defaults.stories || [],
      subscriberSegments: company.subscriberSegments || defaults.subscriberSegments || [],
      reviews: company.reviews || defaults.reviews || [],
      dialogs: company.dialogs || defaults.dialogs || [],
      offers: company.offers || defaults.offers || []
    };
  }

  function getObjects(developer) {
    return (window.KLIPER_BUILDINGS || [])
      .filter(function (object) { return object.developer === developer.name; })
      .slice(0, 8);
  }

  function getCabinetSnapshot(developer) {
    var adapter = window.KLIPER_COMPANY_CABINET_ADAPTER;
    if (adapter && typeof adapter.getCabinetSnapshot === 'function') {
      return adapter.getCabinetSnapshot(developer.slug || developer.name);
    }
    return { source: 'mock', data: null };
  }

  function getPricingPlan(developer, config) {
    var pricing = window.KLIPER_COMPANY_PRICING || {};
    var planId = config.currentPlan ||
      (pricing.companyPlans && pricing.companyPlans[developer.slug]) ||
      pricing.defaultPlan ||
      'business';
    var plans = pricing.plans || [];
    return plans.find(function (plan) { return plan.id === planId; }) || plans[0] || null;
  }

  function getStats(developer, config, objects) {
    var active = Number(developer.activeJK || 0);
    var built = Number(developer.builtJK || 0);
    var reviews = Number(developer.comments || 0);
    var subscribers = Number(developer.notifications || 0);

    return [
      { label: 'Просмотры', value: formatNumber(Number(developer.likes || 0) * 12 || 4200), hint: 'публичная страница' },
      { label: 'Подписчики', value: formatNumber(subscribers), hint: 'агрегировано' },
      { label: 'Рецензии', value: formatNumber(reviews), hint: 'видимые и новые' },
      { label: 'Обращения', value: formatNumber(config.dialogs.length), hint: 'демо-очередь' },
      { label: 'Объекты', value: formatNumber(objects.length || active + built), hint: active + ' строится / ' + built + ' готово' },
      { label: 'Stories', value: formatNumber(config.stories.length), hint: 'активные и черновики' },
      { label: 'Рейтинг', value: '#1', hint: 'в категории' }
    ];
  }

  function getAttentionItems(config, objects) {
    var documentsNeedUpdate = config.documents.filter(function (item) {
      return normalize(item.status).indexOf('проверено') === -1;
    }).length;
    var openDialogs = config.dialogs.filter(function (item) {
      return normalize(item.status).indexOf('закрыто') === -1;
    }).length;
    var draftPosts = config.posts.filter(function (item) {
      return normalize(item.status).indexOf('черновик') !== -1 || normalize(item.status).indexOf('готовится') !== -1;
    }).length;
    var items = [];

    if (documentsNeedUpdate) items.push({ value: documentsNeedUpdate, label: 'документа к проверке' });
    if (openDialogs) items.push({ value: openDialogs, label: 'обращения в работе' });
    if (draftPosts) items.push({ value: draftPosts, label: 'публикации готовятся' });
    if (!objects.length) items.push({ value: 0, label: 'объекты не привязаны' });

    return items.slice(0, 3);
  }

  function renderAttentionItems(items) {
    if (!items.length) {
      return '<div class="kliper-company-cabinet-next">' +
        '<span>Все основные блоки заполнены</span>' +
        '<strong>Профиль готов к v1-публикации</strong>' +
      '</div>';
    }

    return '<div class="kliper-company-cabinet-next">' + items.map(function (item) {
      return '<span><b>' + escapeHtml(item.value) + '</b> ' + escapeHtml(item.label) + '</span>';
    }).join('') + '</div>';
  }

  function getReadiness(config, objects) {
    var checks = [
      { label: 'Реквизиты и подтверждение', done: config.documents.some(function (item) { return normalize(item.title).indexOf('подтверждение') !== -1 && normalize(item.status).indexOf('проверено') !== -1; }) },
      { label: 'Связанные объекты', done: objects.length > 0 },
      { label: 'Контент для ленты', done: config.posts.length > 0 },
      { label: 'Stories компании', done: config.stories.length > 0 },
      { label: 'Очередь обращений', done: config.dialogs.length > 0 }
    ];
    var done = checks.filter(function (item) { return item.done; }).length;
    return {
      checks: checks,
      done: done,
      total: checks.length,
      percent: checks.length ? Math.round((done / checks.length) * 100) : 0
    };
  }

  function renderReadiness(config, objects) {
    var readiness = getReadiness(config, objects);
    return '<div class="kliper-company-cabinet-readiness">' +
      '<div class="kliper-company-cabinet-readiness__top">' +
        '<span>Готовность профиля</span>' +
        '<strong>' + escapeHtml(readiness.done) + ' / ' + escapeHtml(readiness.total) + '</strong>' +
      '</div>' +
      '<div class="kliper-company-cabinet-readiness__bar" aria-hidden="true"><span style="width:' + escapeHtml(readiness.percent) + '%"></span></div>' +
      '<ul>' + readiness.checks.map(function (item) {
        return '<li data-ready="' + (item.done ? 'true' : 'false') + '">' + escapeHtml(item.label) + '</li>';
      }).join('') + '</ul>' +
    '</div>';
  }

  function formatNumber(value) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function statusLabel(status) {
    if (status === 'строится') return 'строится';
    if (status === 'сдан' || status === 'готово') return 'готово';
    return 'уточнить';
  }

  function renderStatCards(stats) {
    return stats.map(function (item) {
      return '<article class="kliper-company-cabinet-stat">' +
        '<span>' + escapeHtml(item.label) + '</span>' +
        '<strong>' + escapeHtml(item.value) + '</strong>' +
        '<small>' + escapeHtml(item.hint) + '</small>' +
      '</article>';
    }).join('');
  }

  function renderPlanPanel(developer, config, objects) {
    var plan = getPricingPlan(developer, config);
    var pricing = window.KLIPER_COMPANY_PRICING || {};
    if (!plan) {
      return '<article class="kliper-company-cabinet-panel">' +
        '<div class="kliper-company-cabinet-panel__head"><span>Тариф и лимиты</span><small>демо-режим</small></div>' +
        '<div class="kliper-company-cabinet-empty">Тарифы появятся в рабочем кабинете компании.</div>' +
      '</article>';
    }

    var limit = Number(plan.cardsLimit || 0);
    var used = objects.length || Math.min(limit, Number(developer.activeJK || 0) + Number(developer.builtJK || 0));
    var percent = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

    return '<article class="kliper-company-cabinet-panel kliper-company-cabinet-plan">' +
      '<div class="kliper-company-cabinet-panel__head"><span>Тариф и лимиты</span><button type="button" data-company-pricing-open="' + escapeHtml(developer.slug || '') + '">Изменить тариф</button></div>' +
      '<div class="kliper-company-cabinet-plan__body">' +
        '<div>' +
          '<small>текущий тариф</small>' +
          '<strong>' + escapeHtml(plan.name) + '</strong>' +
          '<span>' + escapeHtml(plan.price) + ' / ' + escapeHtml(plan.period || 'мес') + '</span>' +
        '</div>' +
        '<div>' +
          '<small>карточки</small>' +
          '<strong>' + escapeHtml(used) + ' / ' + escapeHtml(limit) + '</strong>' +
          '<span>' + escapeHtml(plan.label) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="kliper-company-cabinet-plan__bar" aria-hidden="true"><span style="width:' + escapeHtml(percent) + '%"></span></div>' +
      '<p>' + escapeHtml(pricing.annualPromo || 'Смена тарифа появится в рабочем кабинете компании.') + '</p>' +
    '</article>';
  }

  function renderObjects(objects) {
    if (!objects.length) {
      return '<div class="kliper-company-cabinet-empty">Связанные объекты появятся после привязки карточек компании.</div>';
    }

    return objects.map(function (object) {
      return '<button class="kliper-company-cabinet-object" type="button" data-company-cabinet-card="' + escapeHtml(object.name) + '">' +
        '<span class="kliper-company-cabinet-object__title">' + escapeHtml(object.name) + '</span>' +
        '<span class="kliper-company-cabinet-object__meta">' + escapeHtml(object.district || 'Тюмень') + ' · ' + escapeHtml(statusLabel(object.status)) + '</span>' +
        '<span class="kliper-company-cabinet-object__price">' + escapeHtml(object.price || 'цена уточняется') + '</span>' +
      '</button>';
    }).join('');
  }

  function renderList(items, className, emptyText, renderer) {
    if (!items.length) return '<div class="kliper-company-cabinet-empty">' + escapeHtml(emptyText) + '</div>';
    return items.map(function (item) {
      return renderer(item, className);
    }).join('');
  }

  function renderDocument(item) {
    return '<li class="kliper-company-cabinet-row">' +
      '<span>' + escapeHtml(item.title) + '</span>' +
      '<b>' + escapeHtml(item.status) + '</b>' +
    '</li>';
  }

  function renderPost(item) {
    return '<article class="kliper-company-cabinet-mini">' +
      '<strong>' + escapeHtml(item.title) + '</strong>' +
      '<span>' + escapeHtml(item.meta) + '</span>' +
      '<small>' + escapeHtml(item.status) + '</small>' +
    '</article>';
  }

  function renderStory(item) {
    return '<article class="kliper-company-cabinet-story">' +
      '<span aria-hidden="true"></span>' +
      '<strong>' + escapeHtml(item.title) + '</strong>' +
      '<small>' + escapeHtml(item.status) + ' · ' + escapeHtml(formatNumber(item.views || 0)) + ' просмотров</small>' +
    '</article>';
  }

  function renderSegment(item) {
    return '<li class="kliper-company-cabinet-segment">' +
      '<span>' + escapeHtml(item.title) + '</span>' +
      '<strong>' + escapeHtml(item.value) + '</strong>' +
    '</li>';
  }

  function renderReview(item) {
    return '<article class="kliper-company-cabinet-mini" data-tone="' + escapeHtml(item.tone || 'neutral') + '">' +
      '<strong>' + escapeHtml(item.title) + '</strong>' +
      '<span>' + escapeHtml(item.text) + '</span>' +
      '<small>ответ компании будет доступен в рабочем кабинете</small>' +
    '</article>';
  }

  function renderDialog(item) {
    return '<article class="kliper-company-cabinet-mini">' +
      '<strong>' + escapeHtml(item.title) + '</strong>' +
      '<span>' + escapeHtml(item.source) + '</span>' +
      '<small>' + escapeHtml(item.status) + '</small>' +
    '</article>';
  }

  function renderOffer(item) {
    return '<article class="kliper-company-cabinet-mini">' +
      '<strong>' + escapeHtml(item.title) + '</strong>' +
      '<span>' + escapeHtml(item.audience) + '</span>' +
      '<small>' + escapeHtml(item.status) + '</small>' +
    '</article>';
  }

  function showCabinetNotice(text) {
    var root = getRoot();
    var notice = root.querySelector('.kliper-company-cabinet-notice');
    if (!notice) {
      notice = document.createElement('div');
      notice.className = 'kliper-company-cabinet-notice';
      notice.setAttribute('role', 'status');
      notice.setAttribute('aria-live', 'polite');
      root.appendChild(notice);
    }
    notice.textContent = text;
    notice.classList.add('is-visible');
    window.clearTimeout(showCabinetNotice._timer);
    showCabinetNotice._timer = window.setTimeout(function () {
      notice.classList.remove('is-visible');
    }, 2800);
  }

  function refreshCabinetApiSource(root, developer) {
    var api = window.KLIPER_API;
    var adapter = window.KLIPER_COMPANY_CABINET_ADAPTER;
    if (!api || typeof api.isEnabled !== 'function' || !api.isEnabled()) return;
    if (!adapter || typeof adapter.loadCabinet !== 'function') return;

    adapter.loadCabinet(developer.slug || developer.name).then(function (snapshot) {
      var node = root.querySelector('.kliper-company-cabinet');
      if (!node || !snapshot) return;
      if (snapshot.source) node.setAttribute('data-api-source', snapshot.source);
      if (snapshot.warning) node.setAttribute('data-api-warning', snapshot.warning);
      if (snapshot.error && snapshot.error.code) node.setAttribute('data-api-error', snapshot.error.code);
    });
  }

  function renderCabinet(developer) {
    var config = getCabinetConfig(developer);
    var objects = getObjects(developer);
    var stats = getStats(developer, config, objects);
    var attentionItems = getAttentionItems(config, objects);
    var cabinetSnapshot = getCabinetSnapshot(developer);
    var root = getRoot();
    var cover = developer.bgImage || (window.KLIPER_DEVELOPER_COVERS || {})[developer.name] || '';
    var initials = (developer.name || 'К').trim().slice(0, 2).toUpperCase();

    document.body.classList.add(activeClass);
    root.innerHTML = '<main class="kliper-company-cabinet" aria-label="Кабинет компании" data-api-source="' + escapeHtml(cabinetSnapshot.source || 'mock') + '">' +
      '<header class="kliper-company-cabinet-hero">' +
        '<div class="kliper-company-cabinet-hero__media" style="background-image: linear-gradient(90deg, rgba(10,16,31,.9), rgba(10,16,31,.62)), url(&quot;' + escapeHtml(cover) + '&quot;)"></div>' +
        '<div class="kliper-company-cabinet-hero__content">' +
          '<div class="kliper-company-cabinet-brand">' +
            '<span class="kliper-company-cabinet-avatar">' + escapeHtml(initials) + '</span>' +
            '<div>' +
              '<p>Кабинет компании</p>' +
              '<h1>' + escapeHtml(config.companyName) + '</h1>' +
            '</div>' +
          '</div>' +
          '<p class="kliper-company-cabinet-lead">' + escapeHtml(config.lead) + '</p>' +
          '<div class="kliper-company-cabinet-statusbar">' +
            '<span>' + escapeHtml(config.currentRole) + '</span>' +
            '<span>' + escapeHtml(config.profileStatusLabel) + '</span>' +
            '<span>' + escapeHtml(config.healthLabel) + '</span>' +
          '</div>' +
          renderAttentionItems(attentionItems) +
          '<div class="kliper-company-cabinet-actions">' +
            '<button type="button" data-company-cabinet-public>Публичная страница</button>' +
            '<button type="button" data-company-cabinet-public>Предпросмотр</button>' +
            '<button type="button" data-company-cabinet-action="publish">Опубликовать позже</button>' +
          '</div>' +
        '</div>' +
      '</header>' +
      '<section class="kliper-company-cabinet-grid kliper-company-cabinet-grid--stats" aria-label="Статистика">' + renderStatCards(stats) + '</section>' +
      '<section class="kliper-company-cabinet-layout">' +
        '<article class="kliper-company-cabinet-panel kliper-company-cabinet-panel--wide" id="company-cabinet-objects">' +
          '<div class="kliper-company-cabinet-panel__head"><span>Объекты компании</span><button type="button" data-company-cabinet-public>Смотреть публично</button></div>' +
          '<div class="kliper-company-cabinet-objects">' + renderObjects(objects) + '</div>' +
        '</article>' +
        renderPlanPanel(developer, config, objects) +
        '<article class="kliper-company-cabinet-panel">' +
          '<div class="kliper-company-cabinet-panel__head"><span>Документы и профиль</span><small>статусы v1</small></div>' +
          renderReadiness(config, objects) +
          '<ul class="kliper-company-cabinet-list">' + renderList(config.documents, '', 'Документы пока не добавлены.', renderDocument) + '</ul>' +
        '</article>' +
        '<article class="kliper-company-cabinet-panel">' +
          '<div class="kliper-company-cabinet-panel__head"><span>Публикации</span><button type="button" data-company-cabinet-action="post">Подготовить</button></div>' +
          '<div class="kliper-company-cabinet-stack">' + renderList(config.posts, '', 'Публикации появятся после подключения редактора.', renderPost) + '</div>' +
        '</article>' +
        '<article class="kliper-company-cabinet-panel">' +
          '<div class="kliper-company-cabinet-panel__head"><span>Stories компании</span><button type="button" data-company-cabinet-action="stories">Предпросмотр</button></div>' +
          '<div class="kliper-company-cabinet-stack">' + renderList(config.stories, '', 'Stories пока не подготовлены.', renderStory) + '</div>' +
        '</article>' +
        '<article class="kliper-company-cabinet-panel">' +
          '<div class="kliper-company-cabinet-panel__head"><span>Подписчики</span><small>без персональных данных</small></div>' +
          '<ul class="kliper-company-cabinet-list">' + renderList(config.subscriberSegments, '', 'Сегменты появятся после накопления аудитории.', renderSegment) + '</ul>' +
        '</article>' +
        '<article class="kliper-company-cabinet-panel">' +
          '<div class="kliper-company-cabinet-panel__head"><span>Рецензии</span><button type="button" data-company-cabinet-action="reviews">Ответы позже</button></div>' +
          '<div class="kliper-company-cabinet-stack">' + renderList(config.reviews, '', 'Новых рецензий нет.', renderReview) + '</div>' +
        '</article>' +
        '<article class="kliper-company-cabinet-panel">' +
          '<div class="kliper-company-cabinet-panel__head"><span>Обращения</span><small>входящие сигналы</small></div>' +
          '<div class="kliper-company-cabinet-stack">' + renderList(config.dialogs, '', 'Обращений пока нет.', renderDialog) + '</div>' +
        '</article>' +
        '<article class="kliper-company-cabinet-panel kliper-company-cabinet-panel--wide">' +
          '<div class="kliper-company-cabinet-panel__head"><span>Предложения подписчикам</span><small>черновики</small></div>' +
          '<div class="kliper-company-cabinet-offers">' + renderList(config.offers, '', 'Предложения появятся после согласования сценария рассылок.', renderOffer) + '</div>' +
        '</article>' +
      '</section>' +
    '</main>';
    refreshCabinetApiSource(root, developer);
  }

  function closeCabinet() {
    document.body.classList.remove(activeClass);
    getRoot().innerHTML = '';
  }

  function openPublicPage(developer) {
    window.location.hash = 'card=' + encodeURIComponent(developer.name);
  }

  function setCabinetHash(developer) {
    var targetHash = '#company-cabinet=' + encodeURIComponent(developer.slug || developer.name);
    if (window.location.hash === targetHash) return;
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', targetHash);
      return;
    }
    window.location.hash = targetHash;
  }

  function syncRoute() {
    var route = getRoute();
    if (!route) {
      closeCabinet();
      return;
    }

    var developer = findDeveloper(route);
    if (!developer) {
      closeCabinet();
      return;
    }

    renderCabinet(developer);
  }

  function openCabinetFromPublic() {
    var developer = findDeveloperByPage();
    if (!developer) return;
    renderCabinet(developer);
    setCabinetHash(developer);
    window.setTimeout(function () {
      if (document.body.classList.contains(activeClass)) setCabinetHash(developer);
    }, 250);
    window.setTimeout(function () {
      if (document.body.classList.contains(activeClass)) setCabinetHash(developer);
    }, 700);
  }

  function isCabinetText(text) {
    var value = String(text || '').toLowerCase();
    return text.length < 260 && value.indexOf('кабинет компании') !== -1 && value.indexOf('для бизнеса') !== -1;
  }

  function enhancePublicCabinetBlock() {
    if (getRoute()) return;

    toArray(document.querySelectorAll('section, article, div')).some(function (node) {
      if (node.getAttribute(enhancedAttr) === '1') return false;
      if (!isCabinetText((node.textContent || '').replace(/\s+/g, ' ').trim())) return false;
      if (node.querySelector('[data-company-cabinet-open]')) return true;

      node.setAttribute(enhancedAttr, '1');
      node.classList.add('kliper-company-cabinet-public-card');
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'kliper-company-cabinet-public-card__button';
      button.setAttribute('data-company-cabinet-open', '1');
      button.textContent = 'Открыть кабинет';
      node.appendChild(button);
      return true;
    });
  }

  function bindEvents() {
    document.addEventListener('click', function (event) {
      var publicButton = event.target.closest('[data-company-cabinet-public]');
      var objectButton = event.target.closest('[data-company-cabinet-card]');
      var pricingButton = event.target.closest('[data-company-pricing-open]');
      var actionButton = event.target.closest('[data-company-cabinet-action]');
      var openButton = event.target.closest('[data-company-cabinet-open]');
      var publicBlock = event.target.closest('.kliper-company-cabinet-public-card');

      if (pricingButton) {
        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        window.location.hash = 'business-pricing=' + encodeURIComponent(pricingButton.getAttribute('data-company-pricing-open') || '');
        return;
      }

      if (actionButton) {
        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        showCabinetNotice('Действие будет доступно в рабочем кабинете компании. Сейчас это безопасный демо-режим.');
        return;
      }

      if (publicButton) {
        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        var developer = findDeveloper(getRoute());
        if (developer) {
          closeCabinet();
          openPublicPage(developer);
        }
        return;
      }

      if (objectButton) {
        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        var objectName = objectButton.getAttribute('data-company-cabinet-card');
        if (objectName) {
          closeCabinet();
          window.location.hash = 'card=' + encodeURIComponent(objectName);
        }
        return;
      }

      if (openButton || publicBlock) {
        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        openCabinetFromPublic();
      }
    }, true);

    window.addEventListener('hashchange', function () {
      window.setTimeout(syncRoute, 0);
      window.setTimeout(enhancePublicCabinetBlock, 80);
    });

    var observer = new MutationObserver(function () {
      window.clearTimeout(observer._kliperCompanyCabinetTimer);
      observer._kliperCompanyCabinetTimer = window.setTimeout(enhancePublicCabinetBlock, 120);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    bindEvents();
    syncRoute();
    window.setTimeout(enhancePublicCabinetBlock, 200);
    window.setTimeout(enhancePublicCabinetBlock, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
