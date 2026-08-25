(function () {
  'use strict';

  var ACCENT = '#7c3aed';
  var active = { category: null, index: 0 };
  var timer = 0;
  var storyProgressFrame = 0;
  var storyScrollSettleTimer = 0;
  var storyViewportExpanded = null;
  var storyExpanded = true;
  var storyLastScrollY = window.scrollY || document.documentElement.scrollTop || 0;
  var storyTopRevealTimer = 0;
  var storyTopRevealReady = false;
  var storyTouchStartY = 0;
  var STORY_SCROLL_DISTANCE = 180;
  var STORY_COLLAPSE_TRIGGER_Y = 8;
  var STORY_TOP_REVEAL_DELAY = 170;
  var STORY_TOP_OPEN_THRESHOLD = 90;
  var STORY_WHEEL_COOLDOWN = 360;
  var STORY_VIEWER_WHEEL_COOLDOWN = 280;
  var storyTopOpenDelta = 0;
  var storyWheelLockUntil = 0;
  var storyViewerWheelLockUntil = 0;
  var storyViewerAnimations = [];

  var categories = [
    {
      title: 'Новое',
      subtitle: 'Свежие обновления',
      count: 5,
      image: './assets/images/jk/enko__bering_novye_ocheredi_cover_4x3.webp',
      slides: [
        ['Новое', 'Свежие проекты', 'Новые карточки и очереди, которые появились в каталоге недавно.'],
        ['Обновления', 'Новые фото', 'Подборка объектов, где обновились рендеры, дворы и фасады.'],
        ['Выбор', 'Что посмотреть', 'Быстрый маршрут по самым заметным новинкам недели.'],
        ['Районы', 'Новые точки', 'Где на карте города появляются активные стройки.'],
        ['Дальше', 'Открыть подборку', 'Переход к объектам, которые стоит проверить первыми.']
      ]
    },
    {
      title: 'Сдано',
      subtitle: 'Готовые дома',
      count: 6,
      image: './assets/images/jk/brusnika__respubliki_205_cover_4x3.webp',
      slides: [
        ['Сдано', 'Готовые ЖК', 'Дома, где можно оценивать не только обещания, но и реальный результат.'],
        ['Ключи', 'Ближе к переезду', 'Подборка для тех, кому важно не ждать несколько лет.'],
        ['Дворы', 'Можно увидеть', 'Готовая среда, входные группы и благоустройство.'],
        ['Районы', 'Жизнь вокруг', 'Проверяем транспорт, магазины, школы и повседневную инфраструктуру.'],
        ['Сравнение', 'Цена и готовность', 'Удобно сравнивать готовые варианты с новыми стартами.'],
        ['Выбор', 'Смотреть сданные', 'Быстрый вход в подборку готовых проектов.']
      ]
    },
    {
      title: 'Старт',
      subtitle: 'Старт продаж',
      count: 3,
      image: './assets/images/jk/pik__ozernyy_park_rerender_cover_4x3.webp',
      slides: [
        ['Старт', 'Ранний вход', 'Проекты и очереди, где продажи только набирают темп.'],
        ['Планировки', 'Больше выбора', 'На старте обычно проще подобрать этаж, вид и метраж.'],
        ['Динамика', 'Следить за ценой', 'Такие объекты удобно добавлять в наблюдение.']
      ]
    },
    {
      title: 'Акции',
      subtitle: 'Выгодные условия',
      count: 2,
      image: './assets/images/jk/tyumenskaya_dsk__novo_patrushevo_cover_4x3.webp',
      slides: [
        ['Акции', 'Ставки и скидки', 'Спецусловия, рассрочки, трейд-ин и временные предложения.'],
        ['Сравнить', 'Не только цена', 'Смотрим выгоду вместе со сроком сдачи, районом и качеством проекта.']
      ]
    },
    {
      title: 'Семейные',
      subtitle: 'Для жизни с детьми',
      count: 8,
      image: './assets/images/jk/strana__semya_cover_4x3.webp',
      slides: [
        ['Семейные', 'Двор без суеты', 'Проекты с понятными дворами, прогулками и местами для детей.'],
        ['Школы', 'Инфраструктура рядом', 'Смотрим школы, сады, кружки и повседневные маршруты.'],
        ['Площади', 'Комнаты и хранение', 'Планировки, где хватает места семье и вещам.'],
        ['Безопасность', 'Закрытые дворы', 'Фокус на приватность, освещение и сценарии двора.'],
        ['Прогулки', 'Зелёные зоны', 'Где рядом есть парки, бульвары или набережные.'],
        ['Транспорт', 'Утренний маршрут', 'Как быстро выехать на работу и отвезти ребёнка.'],
        ['Соседи', 'Среда района', 'Семейный проект важен не только домом, но и окружением.'],
        ['Итог', 'Смотреть семейные', 'Подборка ЖК для спокойной повседневной жизни.']
      ]
    },
    {
      title: 'У воды',
      subtitle: 'Река и виды',
      count: 4,
      image: './assets/images/jk/brusnika__rechnoy_port_cover_4x3.webp',
      slides: [
        ['У воды', 'Видовые сценарии', 'ЖК рядом с рекой, озером или набережной.'],
        ['Прогулки', 'Маршруты каждый день', 'Важно не только смотреть на воду, но и удобно до неё доходить.'],
        ['Архитектура', 'Фасады и панорамы', 'Проекты, где виды становятся частью ценности квартиры.'],
        ['Выбор', 'Смотреть у воды', 'Быстрый вход в подборку с водными локациями.']
      ]
    },
    {
      title: 'Центр',
      subtitle: 'Город рядом',
      count: 7,
      image: './assets/images/jk/psk_dom_development__da_kvartal_central_cover_4x3.webp',
      slides: [
        ['Центр', 'Близко к делам', 'Проекты в центральных и близких к центру локациях.'],
        ['Ритм', 'Кафе и сервисы', 'Когда важны прогулки, работа, встречи и жизнь вокруг.'],
        ['Транспорт', 'Меньше пересадок', 'Смотрим удобство маршрутов и выездов.'],
        ['Редкость', 'Локация решает', 'В центре меньше свободной земли, поэтому адрес особенно важен.'],
        ['Формат', 'Компактно или статусно', 'Можно искать как небольшую квартиру, так и видовой вариант.'],
        ['Сравнить', 'Цена района', 'Удобно сравнить центр с новыми развивающимися районами.'],
        ['Открыть', 'Смотреть центр', 'Подборка объектов ближе к городскому ядру.']
      ]
    },
    {
      title: 'Инвест',
      subtitle: 'Ликвидность',
      count: 3,
      image: './assets/images/jk/strana__intellekt_kvartal_cover_4x3.webp',
      slides: [
        ['Инвест', 'Ликвидные форматы', 'Проекты, которые удобно оценивать под аренду или перепродажу.'],
        ['Факторы', 'Транспорт и спрос', 'Смотрим район, сроки, метражи и будущую инфраструктуру.'],
        ['Риск', 'Сравнивать спокойно', 'Инвестиционная карточка должна показывать не только плюс, но и условия.']
      ]
    },
    {
      title: 'Бизнес',
      subtitle: 'Класс выше',
      count: 5,
      image: './assets/images/jk/enko__ayvazovskiy_city_cover_4x3.webp',
      slides: [
        ['Бизнес', 'Архитектура и сервис', 'Проекты с более сильной средой, лобби и материалами.'],
        ['Приватность', 'Меньше случайности', 'Важны входные группы, дворы, паркинг и сценарии доступа.'],
        ['Виды', 'Премиальные этажи', 'Оцениваем панорамы, свет, плотность и окружение.'],
        ['Локация', 'Адрес как актив', 'Бизнес-класс держится на районе не меньше, чем на фасаде.'],
        ['Смотреть', 'Подборка бизнес', 'Отдельный вход в проекты классом выше.']
      ]
    },
    {
      title: 'Скоро',
      subtitle: 'Анонсы',
      count: 2,
      image: './assets/images/jk/enko__miriady_novye_ocheredi_cover_4x3.webp',
      slides: [
        ['Скоро', 'Будущие старты', 'Проекты и очереди, за которыми стоит следить заранее.'],
        ['Подписка', 'Не пропустить', 'Такой раздел потом можно связать с уведомлениями и избранным.']
      ]
    }
  ];

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function findRail() {
    return Array.prototype.slice.call(document.querySelectorAll('header div[class*="overflow-x-auto"]')).find(function (node) {
      if (node.querySelector('[data-category-story-index]')) return true;
      return Array.prototype.slice.call(node.children).some(function (child) {
        return child.tagName === 'BUTTON' && child.querySelector('svg[viewBox="0 0 60 60"]');
      });
    }) || null;
  }

  function setImage(button, item) {
    var image = button.querySelector('img');
    if (image) {
      image.src = item.image;
      image.alt = '';
      image.loading = 'lazy';
      return;
    }

    var avatar = button.querySelector('div > span, div > div');
    if (avatar) {
      avatar.style.backgroundImage = 'url("' + item.image + '")';
      avatar.style.backgroundSize = 'cover';
      avatar.style.backgroundPosition = 'center';
      avatar.textContent = '';
    }
  }

  function applyCategory(button, item, index) {
    var currentKey = item.title + ':' + item.count;

    button.setAttribute('data-category-story-index', String(index));
    button.setAttribute('data-category-story-key', currentKey);
    button.setAttribute('data-category-title', item.title);
    button.setAttribute('aria-label', 'Открыть истории ' + item.title);
    button.style.setProperty('--story-count', String(item.count));
    button.style.setProperty('--story-accent', ACCENT);
    button.classList.add('kliper-category-story-host');

    var ring = button.querySelector('div');
    if (ring) ring.classList.add('kliper-category-story-host__ring');
    var label = button.lastElementChild && button.lastElementChild.tagName === 'SPAN' ? button.lastElementChild : null;
    if (label) label.textContent = item.title;
    setImage(button, item);
  }

  function renderRail() {
    var rail = findRail();
    if (!rail) return;
    rail.setAttribute('data-kliper-category-stories', '1');
    Array.prototype.slice.call(rail.children).forEach(function (button, index) {
      if (button.tagName !== 'BUTTON' || !categories[index]) return;
      applyCategory(button, categories[index], index);
    });
  }

  function easeStoryProgress(value) {
    return value * value * (3 - 2 * value);
  }

  function setStoryProgressStyles(progress) {
    var eased = easeStoryProgress(progress);
    var style = document.body.style;

    style.setProperty('--kliper-story-open', eased.toFixed(3));
    style.setProperty('--kliper-story-ring-size', (44.6 + (58.4 * eased)).toFixed(1) + 'px');
    style.setProperty('--kliper-story-min-width', (48 + (61 * eased)).toFixed(1) + 'px');
    style.setProperty('--kliper-story-gap', (1.5 + (5 * eased)).toFixed(1) + 'px');
    style.setProperty('--kliper-story-label-size', (11 + (4.3 * eased)).toFixed(2) + 'px');
    style.setProperty('--kliper-story-label-max', (58 + (56 * eased)).toFixed(1) + 'px');
    style.setProperty('--kliper-story-ring-padding', (6.8 + (3.2 * eased)).toFixed(1) + 'px');
    style.setProperty('--kliper-story-rail-y', (-84 * (1 - eased)).toFixed(1) + 'px');
    style.setProperty('--kliper-story-header-pull', (-52 * (1 - eased)).toFixed(1) + 'px');
  }

  function updateStoryProgress() {
    setStoryProgressStyles(storyExpanded ? 1 : 0);
  }

  function requestStoryProgressUpdate() {
    if (storyProgressFrame) return;
    storyProgressFrame = window.requestAnimationFrame(function () {
      storyProgressFrame = 0;
      updateStoryProgress();
    });
  }

  function updateStoryViewportMode() {
    var currentY = window.scrollY || document.documentElement.scrollTop || 0;
    if (currentY >= STORY_SCROLL_DISTANCE || (storyExpanded && currentY > STORY_COLLAPSE_TRIGGER_Y)) {
      storyExpanded = false;
      storyTopRevealReady = false;
    }

    var expanded = storyExpanded;
    if (storyViewportExpanded === expanded) return;

    document.body.classList.toggle('kliper-stories-expanded', expanded);
    document.body.classList.toggle('kliper-stories-compact', !expanded);
    storyViewportExpanded = expanded;
  }

  function collapseStoriesFromDownIntent() {
    if (!storyExpanded) return false;

    storyExpanded = false;
    storyTopOpenDelta = 0;
    storyTopRevealReady = false;
    window.clearTimeout(storyTopRevealTimer);
    storyTopRevealTimer = 0;
    updateStoryProgress();
    updateStoryViewportMode();
    if (atPageTop()) armStoryTopReveal();
    return true;
  }

  function atPageTop() {
    return (window.scrollY || document.documentElement.scrollTop || 0) <= 2;
  }

  function armStoryTopReveal() {
    window.clearTimeout(storyTopRevealTimer);
    storyTopRevealReady = false;
    storyTopRevealTimer = window.setTimeout(function () {
      storyTopRevealTimer = 0;
      if (!storyExpanded && atPageTop()) storyTopRevealReady = true;
    }, STORY_TOP_REVEAL_DELAY);
  }

  function revealStoriesFromTopIntent() {
    if (storyExpanded || !atPageTop()) return false;

    storyExpanded = true;
    storyTopOpenDelta = 0;
    storyTopRevealReady = false;
    window.clearTimeout(storyTopRevealTimer);
    storyTopRevealTimer = 0;
    updateStoryProgress();
    updateStoryViewportMode();
    return true;
  }

  function handleStoryScroll() {
    var currentY = window.scrollY || document.documentElement.scrollTop || 0;

    if (storyExpanded && currentY > storyLastScrollY + 2) {
      collapseStoriesFromDownIntent();
    }
    if (!storyExpanded && currentY <= 2 && !storyTopRevealReady && !storyTopRevealTimer) {
      armStoryTopReveal();
    }
    if (currentY > 2) {
      storyTopOpenDelta = 0;
      storyTopRevealReady = false;
      window.clearTimeout(storyTopRevealTimer);
      storyTopRevealTimer = 0;
    }
    storyLastScrollY = currentY;

    requestStoryProgressUpdate();
    updateStoryViewportMode();
    window.clearTimeout(storyScrollSettleTimer);
    storyScrollSettleTimer = window.setTimeout(function () {
      updateStoryProgress();
      updateStoryViewportMode();
    }, 140);
  }

  function handleStoryWheel(event) {
    var now = Date.now();

    if (active.category == null && hasBlockingOverlay(event.target)) return;

    if (active.category != null) {
      event.preventDefault();
      if (now < storyViewerWheelLockUntil) return;
      if (event.deltaY > 18) {
        nextSlide();
        storyViewerWheelLockUntil = now + STORY_VIEWER_WHEEL_COOLDOWN;
      } else if (event.deltaY < -18) {
        prevSlide();
        storyViewerWheelLockUntil = now + STORY_VIEWER_WHEEL_COOLDOWN;
      }
      return;
    }

    if (event.deltaY > 6) {
      storyTopOpenDelta = 0;
      collapseStoriesFromDownIntent();
      return;
    }

    if (event.deltaY >= -6) return;

    if (!atPageTop()) {
      storyTopOpenDelta = 0;
      revealStoriesFromTopIntent();
      return;
    }

    event.preventDefault();
    if (now < storyWheelLockUntil) return;

    if (!storyExpanded) {
      if (revealStoriesFromTopIntent()) {
        storyWheelLockUntil = now + STORY_WHEEL_COOLDOWN;
        storyTopOpenDelta = 0;
      }
      return;
    }

    storyTopOpenDelta += Math.abs(event.deltaY);
    if (storyTopOpenDelta < STORY_TOP_OPEN_THRESHOLD) return;

    storyTopOpenDelta = 0;
    storyWheelLockUntil = now + STORY_WHEEL_COOLDOWN;
    openViewer(0);
  }

  function isVisible(node) {
    if (!node || !node.getBoundingClientRect) return false;
    var rect = node.getBoundingClientRect();
    var style = window.getComputedStyle ? window.getComputedStyle(node) : null;
    return rect.width > 0 && rect.height > 0 && (!style || (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'));
  }

  function hasBlockingOverlay(target) {
    var selector = '[aria-modal="true"], [role="dialog"], [data-modal], .modal, .drawer, .popover';
    if (target && target.closest && target.closest(selector + ', .kliper-story-viewer')) {
      return !target.closest('.kliper-story-viewer');
    }

    return Array.prototype.slice.call(document.querySelectorAll(selector)).some(function (node) {
      return !node.closest('.kliper-story-viewer') && isVisible(node);
    });
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function animateViewerEntrance(viewer) {
    if (prefersReducedMotion()) return;
    var motion = window.KLIPER_MOTION;
    if (!motion || typeof motion.animate !== 'function') return;

    var card = viewer.querySelector('.kliper-story-viewer__card');
    var sideItems = viewer.querySelectorAll('.kliper-story-viewer__side, .kliper-story-viewer__carousel');
    var isMobileViewer = window.matchMedia && window.matchMedia('(max-width: 820px)').matches;
    var cardStartTransform = isMobileViewer
      ? 'translateY(14px) scale(.985)'
      : 'translate(-50%, -50%) translateY(14px) scale(.985)';
    var cardEndTransform = isMobileViewer
      ? 'translateY(0) scale(1)'
      : 'translate(-50%, -50%) translateY(0) scale(1)';

    storyViewerAnimations.forEach(function (animation) {
      if (animation && animation.cancel) animation.cancel();
    });
    storyViewerAnimations = [];

    try {
      if (card) {
        storyViewerAnimations.push(motion.animate(card, { opacity: [0, 1], transform: [cardStartTransform, cardEndTransform] }, { duration: 0.22, ease: 'easeOut' }));
      }
      if (sideItems.length) {
        storyViewerAnimations.push(motion.animate(sideItems, { opacity: [0, 1] }, { duration: 0.18, delay: 0.04, ease: 'easeOut' }));
      }
    } catch (error) {}
  }

  function handleStoryTouchStart(event) {
    var touch = event.touches && event.touches[0];
    storyTouchStartY = touch ? touch.clientY : 0;
  }

  function handleStoryTouchMove(event) {
    var touch = event.touches && event.touches[0];
    if (!touch || !storyTouchStartY) return;
    if (storyTouchStartY - touch.clientY > 22) collapseStoriesFromDownIntent();
    if (touch.clientY - storyTouchStartY > 22) revealStoriesFromTopIntent();
  }

  function handleStoryResize() {
    updateStoryProgress();
    updateStoryViewportMode();
  }

  function progressHtml(count, index) {
    var html = '';
    for (var i = 0; i < count; i += 1) {
      html += '<span class="' + (i <= index ? 'active' : '') + '"></span>';
    }
    return html;
  }

  function wrapCategory(index) {
    var length = categories.length;
    return ((index % length) + length) % length;
  }

  function categoryPreviewHtml(index, sideClass) {
    var categoryIndex = wrapCategory(index);
    var category = categories[categoryIndex];
    var slide = category.slides[0] || ['', category.title, category.subtitle];
    return (
      '<button class="kliper-story-viewer__side ' + sideClass + '" type="button" data-story-category="' + categoryIndex + '" aria-label="Открыть истории ' + escapeHtml(category.title) + '">' +
        '<span class="kliper-story-viewer__side-media" style="background-image:url(\'' + escapeHtml(category.image) + '\')"></span>' +
        '<span class="kliper-story-viewer__side-progress" aria-hidden="true">' + progressHtml(Math.min(category.slides.length, 5), 0) + '</span>' +
        '<span class="kliper-story-viewer__side-head"><strong>' + escapeHtml(category.title) + '</strong><small>' + escapeHtml(category.subtitle) + '</small></span>' +
        '<span class="kliper-story-viewer__side-body"><b>' + escapeHtml(slide[1]) + '</b><em>' + escapeHtml(slide[2]) + '</em></span>' +
      '</button>'
    );
  }

  function sideStoriesHtml() {
    if (active.category == null) return '';
    return (
      categoryPreviewHtml(active.category - 2, 'kliper-story-viewer__side--left-far') +
      categoryPreviewHtml(active.category - 1, 'kliper-story-viewer__side--left') +
      categoryPreviewHtml(active.category + 1, 'kliper-story-viewer__side--right') +
      categoryPreviewHtml(active.category + 2, 'kliper-story-viewer__side--right-far')
    );
  }

  function renderViewer(animateEntrance) {
    var category = categories[active.category];
    if (!category) return;
    var slide = category.slides[active.index] || category.slides[0];
    var old = document.querySelector('.kliper-story-viewer');
    if (old) old.remove();

    var viewer = document.createElement('div');
    viewer.className = 'kliper-story-viewer';
    viewer.innerHTML =
      '<button class="kliper-story-viewer__backdrop" type="button" data-story-close aria-label="Закрыть истории"></button>' +
      '<section class="kliper-story-viewer__stage" role="dialog" aria-modal="true" aria-label="Истории">' +
        sideStoriesHtml() +
        '<button class="kliper-story-viewer__carousel kliper-story-viewer__carousel--prev" type="button" data-story-category-prev aria-label="Предыдущая категория">‹</button>' +
        '<article class="kliper-story-viewer__card">' +
          '<div class="kliper-story-viewer__media" style="background-image:url(\'' + escapeHtml(category.image) + '\')"></div>' +
          '<div class="kliper-story-viewer__progress" style="grid-template-columns:repeat(' + category.slides.length + ',1fr)">' + progressHtml(category.slides.length, active.index) + '</div>' +
          '<div class="kliper-story-viewer__head"><span class="kliper-story-viewer__logo">К</span><span><strong>' + escapeHtml(category.title) + '</strong><small>' + escapeHtml(category.subtitle) + '</small></span><button class="kliper-story-viewer__close" type="button" data-story-close aria-label="Закрыть">×</button></div>' +
          '<button class="kliper-story-viewer__prev" type="button" data-story-prev aria-label="Предыдущий слайд"></button>' +
          '<button class="kliper-story-viewer__next" type="button" data-story-next aria-label="Следующий слайд"></button>' +
          '<div class="kliper-story-viewer__body"><span>' + escapeHtml(slide[0]) + '</span><h3>' + escapeHtml(slide[1]) + '</h3><p>' + escapeHtml(slide[2]) + '</p><button class="kliper-story-viewer__cta" type="button" data-story-link>Открыть новость</button></div>' +
        '</article>' +
        '<button class="kliper-story-viewer__carousel kliper-story-viewer__carousel--next" type="button" data-story-category-next aria-label="Следующая категория">›</button>' +
      '</section>';
    document.body.appendChild(viewer);
    if (animateEntrance) animateViewerEntrance(viewer);
  }

  function openViewer(index) {
    active.category = index;
    active.index = 0;
    renderViewer(true);
  }

  function nextSlide() {
    var category = categories[active.category];
    if (!category) return;
    if (active.index + 1 >= category.slides.length) {
      active.category = wrapCategory(active.category + 1);
      active.index = 0;
      renderViewer();
      return;
    }
    active.index += 1;
    renderViewer();
  }

  function prevSlide() {
    var category = categories[active.category];
    if (!category) return;
    if (active.index - 1 < 0) {
      active.category = wrapCategory(active.category - 1);
      category = categories[active.category];
      active.index = category ? Math.max(category.slides.length - 1, 0) : 0;
      renderViewer();
      return;
    }
    active.index -= 1;
    renderViewer();
  }

  function openCategory(index) {
    active.category = wrapCategory(index);
    active.index = 0;
    renderViewer();
  }

  function closeViewer() {
    var viewer = document.querySelector('.kliper-story-viewer');
    if (viewer) viewer.remove();
    storyViewerAnimations.forEach(function (animation) {
      if (animation && animation.cancel) animation.cancel();
    });
    storyViewerAnimations = [];
    active.category = null;
    active.index = 0;
    storyViewerWheelLockUntil = 0;
  }

  function schedule() {
    if (timer) return;
    timer = window.setTimeout(function () {
      timer = 0;
      renderRail();
      updateStoryProgress();
      updateStoryViewportMode();
    }, 40);
  }

  document.addEventListener('click', function (event) {
    var storyButton = event.target.closest('[data-category-story-index]');
    if (storyButton) {
      event.preventDefault();
      event.stopPropagation();
      openViewer(Number(storyButton.getAttribute('data-category-story-index')) || 0);
      return;
    }
    if (event.target.closest('[data-story-close]')) {
      event.preventDefault();
      event.stopPropagation();
      closeViewer();
      return;
    }
    if (event.target.closest('[data-story-next]')) {
      event.preventDefault();
      event.stopPropagation();
      nextSlide();
      return;
    }
    if (event.target.closest('[data-story-prev]')) {
      event.preventDefault();
      event.stopPropagation();
      prevSlide();
      return;
    }
    if (event.target.closest('[data-story-link]')) {
      event.preventDefault();
      event.stopPropagation();
      closeViewer();
      return;
    }
    var categoryButton = event.target.closest('[data-story-category]');
    if (categoryButton) {
      event.preventDefault();
      event.stopPropagation();
      openCategory(Number(categoryButton.getAttribute('data-story-category')) || 0);
      return;
    }
    if (event.target.closest('[data-story-category-next]')) {
      event.preventDefault();
      event.stopPropagation();
      openCategory((active.category || 0) + 1);
      return;
    }
    if (event.target.closest('[data-story-category-prev]')) {
      event.preventDefault();
      event.stopPropagation();
      openCategory((active.category || 0) - 1);
    }
  }, true);

  document.addEventListener('keydown', function (event) {
    if (active.category == null) return;
    if (event.key === 'Escape') closeViewer();
    if (event.key === 'ArrowRight') nextSlide();
    if (event.key === 'ArrowLeft') prevSlide();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }
  window.addEventListener('load', schedule);
  window.addEventListener('scroll', handleStoryScroll, { passive: true });
  window.addEventListener('wheel', handleStoryWheel, { passive: false });
  window.addEventListener('touchstart', handleStoryTouchStart, { passive: true });
  window.addEventListener('touchmove', handleStoryTouchMove, { passive: true });
  window.addEventListener('resize', handleStoryResize);
  try {
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  } catch (error) {}
})();
