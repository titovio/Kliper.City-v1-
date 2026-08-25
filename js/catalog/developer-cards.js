(function () {
  'use strict';

  var HEART_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  var BELL_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
  var COMMENT_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  var PIN_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function shouldUseAvatarImage(src) {
    return src && src.indexOf('google.com/s2/favicons') === -1;
  }

  function renderCard(dev) {
    var badges = '';
    if (dev.activeJK > 0) {
      badges += '<span class="kliper-card-status-badge">строится ' + dev.activeJK + ' ЖК</span>';
    }
    if (dev.builtJK > 0) {
      badges += '<span class="kliper-card-status-badge">отстроено ' + dev.builtJK + ' ЖК</span>';
    }

    var avatarInner = '';
    if (shouldUseAvatarImage(dev.avatar)) {
      avatarInner = '<div class="kliper-card-avatar-inner"><img src="' + escapeHtml(dev.avatar) + '" alt="' + escapeHtml(dev.name) + '" loading="lazy"></div>';
    } else {
      var letter = dev.name.charAt(0).toUpperCase();
      avatarInner = '<div class="kliper-card-avatar-letter">' + escapeHtml(letter) + '</div>';
    }

    return '<article class="kliper-card" role="button" aria-label="Открыть карточку ' + escapeHtml(dev.name) + '" data-dev-id="' + dev.id + '">' +
      '<div class="kliper-card-image">' +
        '<img src="' + escapeHtml(dev.bgImage) + '" alt="" loading="lazy">' +
      '</div>' +
      '<span class="kliper-card-badge-profile">профиль компании</span>' +
      '<div class="kliper-card-avatar">' + avatarInner + '</div>' +
      '<div class="kliper-card-content">' +
        '<div class="kliper-card-districts">' + PIN_SVG + ' ' + escapeHtml(dev.districts) + '</div>' +
        '<h3 class="kliper-card-name">' + escapeHtml(dev.name) + '</h3>' +
        '<div class="kliper-card-badges">' + badges + '</div>' +
      '</div>' +
      '<div class="kliper-card-footer">' +
        '<span class="kliper-card-counter">' + HEART_SVG + ' ' + dev.likes + '</span>' +
        '<span class="kliper-card-counter">' + BELL_SVG + ' ' + dev.notifications + '</span>' +
        '<span class="kliper-card-counter">' + COMMENT_SVG + ' ' + dev.comments + '</span>' +
      '</div>' +
    '</article>';
  }

  function renderGrid(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var devs = window.KLIPER_DEVELOPERS || [];
    var sorted = devs.slice().sort(function (a, b) { return b.likes - a.likes; });

    var countEl = document.getElementById('kliper-card-count');
    if (countEl) countEl.textContent = sorted.length + ' карточек';

    var html = '';
    for (var i = 0; i < sorted.length; i++) {
      html += renderCard(sorted[i]);
    }
    container.innerHTML = html;
  }

  window.KLIPER_RENDER = window.KLIPER_RENDER || {};
  window.KLIPER_RENDER.developers = renderGrid;
})();
