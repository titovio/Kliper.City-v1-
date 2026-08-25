(function () {
  'use strict';

  var dom = window.KLIPER_DOM || {};
  var PROFILE_CLASS = 'kliper-user-page-ready';
  var ROOT_CLASS = 'kliper-user-page-root';
  var CTA_CLASS = 'kliper-user-page-cta';
  var VISUAL_ONLY_CLASS = 'kliper-user-page-visual-only';
  var TOAST_CLASS = 'kliper-user-page-toast';
  var visualOnlyLabels = {
    'Поделиться карточкой': true,
    'Открыть чат': true,
    'Все чаты': true,
    'Все друзья': true
  };

  function text(node) {
    return dom.text ? dom.text(node) : (node && node.textContent ? node.textContent : '').replace(/\s+/g, ' ').trim();
  }

  function visible(node) {
    if (!node) return false;
    var rect = node.getBoundingClientRect();
    var style = window.getComputedStyle(node);
    return rect.width > 1 && rect.height > 1 && style.display !== 'none' && style.visibility !== 'hidden';
  }

  function readStoredList(key) {
    try {
      var value = JSON.parse(window.localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  }

  function readReviewCount() {
    try {
      var value = JSON.parse(window.localStorage.getItem('kliper-card-reviews') || '{}');
      if (!value || typeof value !== 'object' || Array.isArray(value)) return 0;
      return Object.keys(value).filter(function (key) {
        return text({ textContent: value[key] });
      }).length;
    } catch (error) {
      return 0;
    }
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
      if (visualOnlyLabels[label]) {
        button.classList.add(VISUAL_ONLY_CLASS);
        button.setAttribute('data-kliper-v1-visual-only', 'true');
        button.setAttribute('aria-label', label + ' — витрина v1');
        button.setAttribute('title', 'Витрина v1: действие появится после авторизации');
      }
      if (label === 'Моя лента' || label === 'Мои любимые места' || label === 'Друзья рекомендуют' ||
          label === 'Мой двор' || label === 'Мой дом' || label === 'Мои подписки') {
        button.classList.add('kliper-user-page-tab');
      }
    });
  }

  function syncMetric(root, label, value) {
    var labels = Array.prototype.slice.call(root.querySelectorAll('p')).filter(function (node) {
      return text(node) === label;
    });
    labels.forEach(function (labelNode) {
      var parent = labelNode.parentElement;
      if (!parent) return;
      var valueNode = Array.prototype.slice.call(parent.querySelectorAll('p')).find(function (node) {
        return node !== labelNode && /^\d+$/.test(text(node));
      });
      if (!valueNode) return;
      valueNode.textContent = String(value);
      parent.classList.add('kliper-user-page-metric-synced');
    });
  }

  function syncFallbackCounts(root) {
    var likedCount = readStoredList('kliper-liked-cards').length;
    var subscribedCount = readStoredList('kliper-subscribed-cards').length;
    var reviewCount = readReviewCount();

    syncMetric(root, 'любимые', likedCount);
    syncMetric(root, 'подписки', subscribedCount);
    syncMetric(root, 'советую', reviewCount);

    if (likedCount || subscribedCount) return;
    Array.prototype.slice.call(root.querySelectorAll('span')).forEach(function (node) {
      if (/^Найдено\s+\d+\s+мест$/.test(text(node))) {
        node.textContent = 'Найдено 0 мест';
      }
    });
  }

  function showVisualOnlyNotice(root, label) {
    var notice = root.querySelector('.' + TOAST_CLASS);
    if (!notice) {
      notice = document.createElement('div');
      notice.className = TOAST_CLASS;
      notice.setAttribute('role', 'status');
      notice.setAttribute('aria-live', 'polite');
      root.appendChild(notice);
    }
    notice.textContent = label + ': витрина v1. Реальное действие появится после авторизации.';
    notice.classList.add('is-visible');
    window.clearTimeout(showVisualOnlyNotice.timer);
    showVisualOnlyNotice.timer = window.setTimeout(function () {
      notice.classList.remove('is-visible');
    }, 2800);
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
    syncFallbackCounts(root);
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
    document.addEventListener('click', function (event) {
      var button = event.target && event.target.closest && event.target.closest('.' + VISUAL_ONLY_CLASS);
      if (!button) return;
      var root = findUserRoot();
      if (!root || !root.contains(button)) return;
      event.preventDefault();
      event.stopPropagation();
      showVisualOnlyNotice(root, text(button).replace(/\s+—\s+витрина v1$/, ''));
    }, true);
  });
})();
