(function () {
  'use strict';

  var COVER_BY_NAME = window.KLIPER_DEVELOPER_COVERS || {};

  var renderTimer = 0;

  function clean(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function titleFromCard(card) {
    var heading = card.querySelector('h3');
    if (heading) return clean(heading.textContent);
    return clean(card.getAttribute('aria-label')).replace(/^Открыть карточку\s+/, '');
  }

  function coverImageIn(card) {
    var images = Array.prototype.slice.call(card.querySelectorAll('img'));
    return images.filter(function (image) {
      return !image.closest('button');
    })[0] || images[0] || null;
  }

  function applyCovers() {
    Array.prototype.forEach.call(document.querySelectorAll('[aria-label^="Открыть карточку"]'), function (card) {
      var cover = COVER_BY_NAME[titleFromCard(card)];
      if (!cover) return;

      var image = coverImageIn(card);
      if (!image || image.getAttribute('data-kliper-dev-cover') === cover) return;

      image.src = cover;
      image.setAttribute('data-kliper-dev-cover', cover);
    });
  }

  function schedule() {
    window.clearTimeout(renderTimer);
    renderTimer = window.setTimeout(applyCovers, 80);
  }

  window.addEventListener('load', schedule);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }

  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
