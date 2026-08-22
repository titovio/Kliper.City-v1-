(function () {
  var storageKey = 'kliper-last-open-page';
  var restoringKey = 'kliper-page-restore-active';
  var initialHash = window.location.hash || '';
  var profileIntentAt = 0;
  var previewHistoryActive = false;
  var objectCatalogOrigin = '';
  var dom = window.KLIPER_DOM || {};
  var ignoredTitles = {
    '': true,
    'Застройщики': true,
    'Новостройки': true,
    'Готовые ЖК': true,
    'Лента города': true,
    'Лучшее в Тюмени': true,
    'Мой район': true,
    'Мария': true
  };

  function textOf(node) {
    return dom.text ? dom.text(node) : (node && node.textContent ? node.textContent : '').replace(/\s+/g, ' ').trim();
  }

  function isLargePageTitle(title) {
    if (!title || ignoredTitles[title]) return false;
    return !!document.querySelector('button[aria-label="Назад"], button');
  }

  function getRestoreFlag() {
    try {
      return sessionStorage.getItem(restoringKey);
    } catch (error) {
      return '';
    }
  }

  function setRestoreFlag(value) {
    try {
      if (value) {
        sessionStorage.setItem(restoringKey, value);
      } else {
        sessionStorage.removeItem(restoringKey);
      }
    } catch (error) {}
  }

  function setProfileIntent() {
    profileIntentAt = Date.now();
  }

  function hasProfileIntent() {
    if (initialHash.indexOf('card=') !== -1) return true;
    return profileIntentAt && Date.now() - profileIntentAt < 3000;
  }

  function revealPage() {
    document.documentElement.classList.add('kliper-restore-ready');
    document.documentElement.classList.remove('kliper-page-restoring');
  }

  function hasCardHash() {
    return window.location.hash.indexOf('card=') !== -1;
  }

  function hasCompanyCabinetRoute() {
    return (window.location.hash || '').indexOf('#company-cabinet=') === 0 ||
      document.body.classList.contains('kliper-company-cabinet-active') ||
      !!document.querySelector('.kliper-company-cabinet');
  }

  function hasBusinessPricingRoute() {
    return (window.location.hash || '').indexOf('#business-pricing') === 0 ||
      document.body.classList.contains('kliper-business-pricing-active') ||
      !!document.querySelector('.kliper-business-pricing');
  }

  function hasStandaloneRouteIntent() {
    return hasCompanyCabinetRoute() ||
      hasBusinessPricingRoute() ||
      initialHash.indexOf('#company-cabinet=') === 0 ||
      initialHash.indexOf('#business-pricing') === 0;
  }

  function isVisible(node) {
    if (!node || !node.getBoundingClientRect) return false;
    var rect = node.getBoundingClientRect();
    var style = window.getComputedStyle(node);
    return rect.width > 0 && rect.height > 0 &&
      style.display !== 'none' &&
      style.visibility !== 'hidden';
  }

  function isIgnoredPageTitle(title) {
    return !!ignoredTitles[title];
  }

  function syncObjectRouteClass() {
    ensurePreviewHistoryState();
    var title = hashCardTitle();
    document.body.classList.toggle('kliper-object-route-active', !!title && !isIgnoredPageTitle(title));
    document.body.classList.toggle('kliper-card-preview-active', hasCardPreviewOverlay());
  }

  function hasCardPreviewOverlay() {
    var fixedNodes = Array.prototype.slice.call(document.querySelectorAll('div.fixed'));
    return fixedNodes.some(function (node) {
      var style = window.getComputedStyle(node);
      return style.pointerEvents !== 'none' &&
        style.zIndex === '900' &&
        textOf(node).indexOf('Карточка связывает объект') !== -1;
    });
  }

  function detectResidentialCatalogOrigin() {
    var headings = Array.prototype.slice.call(document.querySelectorAll('h1, h2'));
    var found = headings.find(function (node) {
      var text = textOf(node);
      return isVisible(node) && (text === 'Новостройки' || text === 'Готовые ЖК');
    });
    return found ? textOf(found) : '';
  }

  function closeCardPreviewOverlay() {
    var fixedNodes = Array.prototype.slice.call(document.querySelectorAll('div.fixed'));
    var preview = fixedNodes.find(function (node) {
      var style = window.getComputedStyle(node);
      return style.pointerEvents !== 'none' &&
        style.zIndex === '900' &&
        textOf(node).indexOf('Карточка связывает объект') !== -1;
    });
    if (!preview) return false;

    var closeButton = preview.querySelector('button.absolute.right-4.top-4') || preview.querySelector('button');
    if (!closeButton) return false;
    closeButton.click();
    previewHistoryActive = false;
    return true;
  }

  function ensurePreviewHistoryState() {
    if (!hasCardPreviewOverlay()) {
      previewHistoryActive = false;
      return false;
    }
    objectCatalogOrigin = objectCatalogOrigin || detectResidentialCatalogOrigin();
    if (previewHistoryActive) return true;

    try {
      window.history.pushState({ kliperPreview: true }, '', window.location.href);
      previewHistoryActive = true;
      return true;
    } catch (error) {
      return false;
    }
  }

  function hashCardTitle() {
    try {
      var params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      return params.get('card') || '';
    } catch (error) {
      return '';
    }
  }

  function clickCatalogHome() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('button'));
    var logoButton = buttons.find(function (button) {
      return textOf(button).indexOf('Клипер.Сити') !== -1;
    });
    if (logoButton) {
      logoButton.click();
      return true;
    }
    return clickButtonByExactText('Застройщики');
  }

  function hasVisibleUserProfilePage() {
    var heading = document.querySelector('main h1');
    if (!heading || textOf(heading) !== 'Мария') return false;
    var rect = heading.getBoundingClientRect();
    var style = window.getComputedStyle(heading);
    return rect.width > 1 && rect.height > 1 && style.display !== 'none' && style.visibility !== 'hidden';
  }

  function clearUnintendedUserProfileState() {
    if (hasStandaloneRouteIntent()) return false;
    var profileHash = hashCardTitle() === 'Мария';
    var profilePageWithoutHash = !hasCardHash() && hasVisibleUserProfilePage();
    if ((!profileHash && !profilePageWithoutHash) || hasProfileIntent()) return false;

    try {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    } catch (error) {}

    window.setTimeout(clickCatalogHome, 80);
    window.setTimeout(clickCatalogHome, 320);
    return true;
  }

  function clearObjectRouteForVisibleProfile() {
    if (hasStandaloneRouteIntent()) return false;
    if (!hasVisibleUserProfilePage()) return false;
    if (hasCardHash()) {
      try {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (error) {}
    }
    syncObjectRouteClass();
    return true;
  }

  function isObjectRouteTitle(title) {
    return String(title || '').toLowerCase().indexOf('жк ') === 0;
  }

  function returnToObjectCatalogOrigin() {
    var origin = objectCatalogOrigin;
    if (!origin || !isObjectRouteTitle(hashCardTitle())) return false;

    try {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    } catch (error) {}

    clickMainButtonByExactText(origin) || clickButtonByExactText(origin);
    window.setTimeout(syncObjectRouteClass, 80);
    window.setTimeout(syncObjectRouteClass, 420);
    objectCatalogOrigin = '';
    return true;
  }

  function readCurrentPage() {
    if (hasCompanyCabinetRoute()) return null;
    if (hasBusinessPricingRoute()) return null;
    if (document.querySelector('.kliper-business-page')) return null;

    var title = textOf(document.querySelector('h1'));
    if (!isLargePageTitle(title)) return null;

    return {
      title: title,
      isObject: title.toLowerCase().indexOf('жк ') === 0,
      savedAt: Date.now()
    };
  }

  function saveCurrentPage() {
    if (hasCompanyCabinetRoute()) return;
    if (hasBusinessPricingRoute()) return;
    if (getRestoreFlag() === '1') return;

    var page = readCurrentPage();
    if (!page) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(page));
    } catch (error) {}

    try {
      var encoded = encodeURIComponent(page.title);
      if (window.location.hash !== '#card=' + encoded) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search + '#card=' + encoded);
      }
    } catch (error) {}
  }

  function loadSavedPage() {
    try {
      var params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      var hashTitle = params.get('card');
      if (hashTitle) {
        if (isIgnoredPageTitle(hashTitle)) return null;
        return {
          title: hashTitle,
          isObject: hashTitle.toLowerCase().indexOf('жк ') === 0,
          savedAt: Date.now()
        };
      }
    } catch (error) {}

    return null;
  }

  function clickButtonByExactText(text) {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('button'));
    var button = buttons.find(function (node) {
      return textOf(node) === text;
    });
    if (!button) return false;
    button.click();
    return true;
  }

  function clickMainButtonByExactText(text) {
    var scope = document.querySelector('main') || document;
    var buttons = Array.prototype.slice.call(scope.querySelectorAll('button'));
    var button = buttons.find(function (node) {
      return textOf(node) === text;
    });
    if (!button) return false;
    button.click();
    return true;
  }

  function clickButtonByLabel(label) {
    var scope = document.querySelector('main') || document;
    var selector = '[aria-label="' + label.replace(/"/g, '\\"') + '"]';
    var target = scope.querySelector(selector) || document.querySelector(selector);
    if (!target) return false;
    target.click();
    return true;
  }

  function waitFor(check, timeout) {
    var start = Date.now();
    return new Promise(function (resolve) {
      function tick() {
        var result = check();
        if (result) {
          resolve(result);
          return;
        }
        if (Date.now() - start > timeout) {
          resolve(null);
          return;
        }
        window.setTimeout(tick, 120);
      }
      tick();
    });
  }

  async function openSavedPage(page) {
    if (!page || !page.title) return;

    var currentTitle = textOf(document.querySelector('h1'));
    if (currentTitle === page.title) {
      revealPage();
      return;
    }

    setRestoreFlag('1');

    try {
      var opened = false;

      if (page.isObject) {
        clickMainButtonByExactText('Новостройки') || clickButtonByExactText('Новостройки');
        await waitFor(function () {
          return (textOf(document.querySelector('h2')) === 'Новостройки') ||
            document.querySelector('[aria-label="Открыть карточку ' + page.title.replace(/"/g, '\\"') + '"]');
        }, 2200);
      }

      opened = clickButtonByLabel('Открыть карточку ' + page.title);
      if (!opened && !page.isObject) {
        clickMainButtonByExactText('Застройщики') || clickButtonByExactText('Застройщики');
        await waitFor(function () {
          return document.querySelector('[aria-label="Открыть карточку ' + page.title.replace(/"/g, '\\"') + '"]');
        }, 2200);
        opened = clickButtonByLabel('Открыть карточку ' + page.title);
      }

      if (!opened) return;

      await waitFor(function () {
        return document.querySelector('button') && Array.prototype.slice.call(document.querySelectorAll('button')).find(function (button) {
          return textOf(button) === 'Перейти на большую страницу';
        });
      }, 1800);

      clickButtonByExactText('Перейти на большую страницу');

      var done = await waitFor(function () {
        return textOf(document.querySelector('h1')) === page.title;
      }, 3200);

      if (done) {
        revealPage();
      }

      if (!done && page.isObject) {
        clickMainButtonByExactText('Новостройки') || clickButtonByExactText('Новостройки');
        await waitFor(function () {
          return document.querySelector('[aria-label="Открыть карточку ' + page.title.replace(/"/g, '\\"') + '"]');
        }, 1800);
        if (clickButtonByLabel('Открыть карточку ' + page.title)) {
          await waitFor(function () {
            return textOf(document.querySelector('h1')) === page.title;
          }, 3200);
        }
      }
    } finally {
      window.setTimeout(function () {
        setRestoreFlag('');
        saveCurrentPage();
        revealPage();
      }, 260);
    }
  }

  function scheduleRestore() {
    syncObjectRouteClass();

    if (hasStandaloneRouteIntent()) {
      revealPage();
      return;
    }

    if (clearUnintendedUserProfileState()) {
      revealPage();
      return;
    }

    if (!hasCardHash()) {
      revealPage();
      return;
    }

    var page = loadSavedPage();
    if (!page || !page.title) {
      revealPage();
      return;
    }

    openSavedPage(page);
  }

  document.addEventListener('click', function (event) {
    var profileButton = event.target && event.target.closest && event.target.closest('button[aria-label="Моя страница"]');
    var headerButton = event.target && event.target.closest && event.target.closest('#root > div > header button');
    var button = event.target && event.target.closest && event.target.closest('button');
    if (button && textOf(button) === 'Перейти на большую страницу') {
      objectCatalogOrigin = objectCatalogOrigin || detectResidentialCatalogOrigin();
    }
    if (button && textOf(button) === 'Назад' && returnToObjectCatalogOrigin()) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return;
    }
    if (headerButton) closeCardPreviewOverlay();
    if (profileButton) {
      setProfileIntent();
      window.setTimeout(clearObjectRouteForVisibleProfile, 260);
      window.setTimeout(clearObjectRouteForVisibleProfile, 780);
      window.setTimeout(clearObjectRouteForVisibleProfile, 1500);
    }
    window.setTimeout(syncObjectRouteClass, 80);
    window.setTimeout(saveCurrentPage, 450);
  }, true);

  window.addEventListener('beforeunload', saveCurrentPage);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleRestore);
  } else {
    scheduleRestore();
  }
  window.addEventListener('load', function () {
    scheduleRestore();
    window.setTimeout(clearUnintendedUserProfileState, 700);
    window.setTimeout(clearUnintendedUserProfileState, 1500);
    window.setTimeout(saveCurrentPage, 1200);
  });
  window.addEventListener('hashchange', function () {
    syncObjectRouteClass();
    window.setTimeout(clearUnintendedUserProfileState, 40);
  });
  window.addEventListener('popstate', function () {
    if (hasCardPreviewOverlay()) {
      closeCardPreviewOverlay();
      syncObjectRouteClass();
    }
  });

  var observer = new MutationObserver(function () {
    window.clearTimeout(observer.timer);
    observer.timer = window.setTimeout(function () {
      syncObjectRouteClass();
      if (clearUnintendedUserProfileState()) return;
      saveCurrentPage();
    }, 180);
  });

  window.addEventListener('load', function () {
    var root = document.getElementById('root');
    if (root) {
      observer.observe(root, { childList: true, subtree: true });
    }
  });
})();
