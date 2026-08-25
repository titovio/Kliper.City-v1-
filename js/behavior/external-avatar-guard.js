(function () {
  'use strict';

  var originalSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  var originalSetAttribute = HTMLImageElement.prototype.setAttribute;
  var localCovers = [
    './assets/images/jk/brusnika__rechnoy_port_cover_4x3.webp',
    './assets/images/jk/enko__ayvazovskiy_city_cover_4x3.webp',
    './assets/images/jk/strana__semya_cover_4x3.webp',
    './assets/images/jk/gk_tis__dok_cover_4x3.webp',
    './assets/images/jk/gk_sever__airis_cover_4x3.webp',
    './assets/images/jk/pik__ozernyy_park_rerender_cover_4x3.webp'
  ];

  function isBlockedAvatarUrl(value) {
    return /logo\.clearbit\.com|t\d\.gstatic\.com\/faviconV2|google\.com\/s2\/favicons/i.test(String(value || ''));
  }

  function isBlockedRemoteImage(value) {
    return /images\.unsplash\.com/i.test(String(value || ''));
  }

  function domainFromUrl(value) {
    var text = String(value || '');
    var urlMatch = text.match(/[?&]url=https?:\/\/([^&/]+)/i);
    if (urlMatch) return urlMatch[1];
    var clearbitMatch = text.match(/logo\.clearbit\.com\/([^?#/]+)/i);
    if (clearbitMatch) return clearbitMatch[1];
    var googleMatch = text.match(/[?&]domain=([^&]+)/i);
    return googleMatch ? decodeURIComponent(googleMatch[1]) : '';
  }

  function fallbackSvg(value) {
    var domain = domainFromUrl(value);
    var letter = (domain || 'К').replace(/^www\./, '').charAt(0).toUpperCase() || 'К';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">' +
      '<rect width="128" height="128" rx="32" fill="#7c3aed"/>' +
      '<text x="64" y="78" text-anchor="middle" font-family="Arial, sans-serif" font-size="54" font-weight="800" fill="#fff">' + letter + '</text>' +
      '</svg>';
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  function fallbackCover(value) {
    var text = String(value || '');
    var hash = 0;
    for (var i = 0; i < text.length; i += 1) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    }
    return localCovers[Math.abs(hash) % localCovers.length];
  }

  function safeSrc(value) {
    if (isBlockedAvatarUrl(value)) return fallbackSvg(value);
    if (isBlockedRemoteImage(value)) return fallbackCover(value);
    return value;
  }

  if (originalSrc && originalSrc.set) {
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
      configurable: true,
      enumerable: originalSrc.enumerable,
      get: originalSrc.get,
      set: function (value) {
        if (isBlockedAvatarUrl(value)) this.setAttribute('data-kliper-external-avatar-src', value);
        if (isBlockedRemoteImage(value)) this.setAttribute('data-kliper-external-image-src', value);
        originalSrc.set.call(this, safeSrc(value));
      }
    });
  }

  HTMLImageElement.prototype.setAttribute = function (name, value) {
    if (String(name).toLowerCase() === 'src' && isBlockedAvatarUrl(value)) {
      originalSetAttribute.call(this, 'data-kliper-external-avatar-src', value);
      return originalSetAttribute.call(this, name, fallbackSvg(value));
    }
    if (String(name).toLowerCase() === 'src' && isBlockedRemoteImage(value)) {
      originalSetAttribute.call(this, 'data-kliper-external-image-src', value);
      return originalSetAttribute.call(this, name, fallbackCover(value));
    }
    return originalSetAttribute.call(this, name, value);
  };

  function cleanExisting() {
    Array.prototype.slice.call(document.images || []).forEach(function (image) {
      var attr = image.getAttribute('src') || image.src;
      if (isBlockedAvatarUrl(attr)) image.src = attr;
      if (isBlockedRemoteImage(attr)) image.src = attr;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanExisting);
  } else {
    cleanExisting();
  }
  window.addEventListener('load', cleanExisting);
})();
