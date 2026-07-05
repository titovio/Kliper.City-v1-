(function () {
  'use strict';

  var dom = window.KLIPER_DOM || {};
  var PROFILE_CLASS = 'kliper-user-page-ready';
  var ROOT_CLASS = 'kliper-user-page-root';
  var CTA_CLASS = 'kliper-user-page-cta';

  function text(node) {
    return dom.text ? dom.text(node) : (node && node.textContent ? node.textContent : '').replace(/\s+/g, ' ').trim();
  }

  function visible(node) {
    if (!node) return false;
    var rect = node.getBoundingClientRect();
    var style = window.getComputedStyle(node);
    return rect.width > 1 && rect.height > 1 && style.display !== 'none' && style.visibility !== 'hidden';
  }

  function findUserRoot() {
    var headings = Array.prototype.slice.call(document.querySelectorAll('main h1'));
    var title = headings.find(function (heading) {
      return visible(heading) && text(heading) === 'Мария';
    });
    if (!title) return null;

    var node = title;
    while (node && node.tagName !== 'SECTION') node = node.parentElement;
    while (node && node.parentElement && node.parentElement.tagName === 'SECTION') node = node.parentElement;
    return node;
  }

  function markButtons(root) {
    Array.prototype.slice.call(root.querySelectorAll('button')).forEach(function (button) {
      var label = text(button);
      if (label === 'Поделиться карточкой' || label === 'Открыть чат') {
        button.classList.add(CTA_CLASS);
      }
      if (label === 'Моя лента' || label === 'Мои любимые места' || label === 'Друзья рекомендуют' ||
          label === 'Мой двор' || label === 'Мой дом' || label === 'Мои подписки') {
        button.classList.add('kliper-user-page-tab');
      }
    });
  }

  function sync() {
    var root = findUserRoot();
    document.body.classList.toggle(PROFILE_CLASS, !!root);
    document.querySelectorAll('.' + ROOT_CLASS).forEach(function (node) {
      if (node !== root) node.classList.remove(ROOT_CLASS);
    });
    if (!root) return;
    root.classList.add(ROOT_CLASS);
    markButtons(root);
  }

  function onReady(callback) {
    if (dom.onReady) {
      dom.onReady(callback);
      return;
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
      return;
    }
    callback();
  }

  onReady(function () {
    var scheduled = false;
    function schedule() {
      if (scheduled) return;
      scheduled = true;
      window.setTimeout(function () {
        scheduled = false;
        sync();
      }, 80);
    }

    sync();
    new MutationObserver(schedule).observe(document.getElementById('root') || document.body, {
      childList: true,
      subtree: true
    });
    window.addEventListener('hashchange', schedule);
  });
})();
