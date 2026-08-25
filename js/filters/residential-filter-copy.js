(function () {
  'use strict';

  var timer = 0;

  function clean(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function visible(node) {
    if (!node || !node.getBoundingClientRect) return false;
    var rect = node.getBoundingClientRect();
    var style = window.getComputedStyle(node);
    return rect.width > 0 && rect.height > 0 &&
      style.display !== 'none' &&
      style.visibility !== 'hidden';
  }

  function activeResidentialPage() {
    var headings = Array.prototype.filter.call(document.querySelectorAll('h1, h2'), visible);
    var heading = headings.map(function (node) {
      return clean(node.textContent);
    }).find(function (text) {
      return text === 'Новостройки' || text === 'Готовые ЖК';
    });

    return heading || '';
  }

  function replaceTextNode(root, fromText, toText) {
    var nodes = Array.prototype.slice.call(root.childNodes || []);
    nodes.forEach(function (node) {
      if (node.nodeType === 3 && clean(node.nodeValue) === fromText) {
        node.nodeValue = node.nodeValue.replace(fromText, toText);
        return;
      }
      if (node.nodeType === 1) replaceTextNode(node, fromText, toText);
    });
  }

  function sync() {
    var page = activeResidentialPage();
    if (!page) return;

    var target = page === 'Новостройки'
      ? { from: 'Год сдачи', to: 'Срок проекта' }
      : { from: 'Сдан', to: 'Год сдачи ЖК' };

    Array.prototype.forEach.call(document.querySelectorAll('.kliper-newbuild-picker-row > .relative > button'), function (button) {
      if (!visible(button) || clean(button.textContent) !== target.from) return;
      replaceTextNode(button, target.from, target.to);
      button.setAttribute('data-kliper-filter-copy', page);
    });
  }

  function schedule() {
    window.clearTimeout(timer);
    timer = window.setTimeout(sync, 80);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }

  window.addEventListener('load', schedule);
  window.addEventListener('hashchange', schedule);
  document.addEventListener('click', function () {
    schedule();
    window.setTimeout(schedule, 300);
  }, true);

  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });
})();
