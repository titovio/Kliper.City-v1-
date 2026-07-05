(function () {
  var storageKey = 'kliper-last-open-page';
  var restoringKey = 'kliper-page-restore-active';
  var dom = window.KLIPER_DOM || {};
  var ignoredTitles = {
    '': true,
    'Застройщики': true,
    'Новостройки': true,
    'Готовые ЖК': true,
    'Лента города': true,
    'Лучшее в Тюмени': true,
    'Мой район': true
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

  function revealPage() {
    document.documentElement.classList.add('kliper-restore-ready');
    document.documentElement.classList.remove('kliper-page-restoring');
  }

  function hasCardHash() {
    return window.location.hash.indexOf('card=') !== -1;
  }

  function readCurrentPage() {
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

  document.addEventListener('click', function () {
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
    window.setTimeout(saveCurrentPage, 1200);
  });

  var observer = new MutationObserver(function () {
    window.clearTimeout(observer.timer);
    observer.timer = window.setTimeout(saveCurrentPage, 180);
  });

  window.addEventListener('load', function () {
    var root = document.getElementById('root');
    if (root) {
      observer.observe(root, { childList: true, subtree: true });
    }
  });
})();
