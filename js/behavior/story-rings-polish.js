(function () {
  'use strict';

  var ACCENT = '#7c3aed';
  var COUNTS = [5, 6, 3, 2, 8];
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var timer = 0;
  var retryTimer = 0;

  function storySvgs() {
    return Array.prototype.slice.call(document.querySelectorAll('.kliper-category-story-host__ring svg[viewBox="0 0 60 60"], header [data-kliper-category-stories] svg[viewBox="0 0 60 60"]')).filter(function (svg) {
      if (svg.closest('.kliper-category-story')) return false;
      return svg.closest('button') && svg.querySelector('circle');
    });
  }

  function setGradient(svg) {
    var stops = svg.querySelectorAll('linearGradient stop');
    Array.prototype.forEach.call(stops, function (stop) {
      stop.setAttribute('stop-color', ACCENT);
      stop.style.stopColor = ACCENT;
    });
  }

  function buildCircle(stroke, dash, offset, className) {
    var circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', '30');
    circle.setAttribute('cy', '30');
    circle.setAttribute('r', '28');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', stroke);
    circle.setAttribute('stroke-width', '3');
    circle.setAttribute('stroke-linecap', 'round');
    if (dash) circle.setAttribute('stroke-dasharray', dash);
    if (offset !== null && offset !== undefined) circle.setAttribute('stroke-dashoffset', String(offset));
    if (className) circle.setAttribute('class', className);
    return circle;
  }

  function countForSvg(svg, index) {
    var host = svg.closest('[data-category-story-index], .kliper-category-story-host');
    var raw = host && host.style ? host.style.getPropertyValue('--story-count') : '';
    var count = parseInt(raw, 10);
    if (count > 0) return count;
    return COUNTS[index % COUNTS.length];
  }

  function polishSvg(svg, index) {
    var host = svg.closest('[data-category-story-index], .kliper-category-story-host');
    var count = countForSvg(svg, index);
    var currentKey = count + ':' + ACCENT;
    if (svg.getAttribute('data-kliper-story-polish') === currentKey) {
      if (host) host.classList.add('kliper-story-svg-ring-ready');
      return;
    }

    setGradient(svg);

    var gradient = svg.querySelector('linearGradient[id]');
    var stroke = gradient ? 'url(#' + gradient.getAttribute('id') + ')' : ACCENT;
    var circumference = 2 * Math.PI * 28;
    var gap = Math.min(8, circumference / count * 0.18);
    var segment = (circumference - gap * count) / count;
    var dash = segment + ' ' + (circumference - segment);
    var step = segment + gap;

    Array.prototype.forEach.call(svg.querySelectorAll('circle'), function (circle) {
      circle.remove();
    });

    svg.appendChild(buildCircle('rgba(124,58,237,0.18)', null, null, 'kliper-story-ring-base'));

    for (var i = 0; i < count; i += 1) {
      svg.appendChild(buildCircle(stroke, dash, -step * i, 'kliper-story-ring-segment'));
    }

    svg.setAttribute('data-kliper-story-polish', currentKey);
    if (host) host.classList.add('kliper-story-svg-ring-ready');
  }

  function polish() {
    storySvgs().forEach(polishSvg);
  }

  function schedule() {
    window.clearTimeout(timer);
    timer = window.setTimeout(polish, 80);
  }

  function scheduleRetries() {
    var count = 0;
    window.clearInterval(retryTimer);
    retryTimer = window.setInterval(function () {
      count += 1;
      polish();
      if (count >= 24) window.clearInterval(retryTimer);
    }, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      schedule();
      scheduleRetries();
    });
  } else {
    schedule();
    scheduleRetries();
  }

  window.addEventListener('load', function () {
    schedule();
    scheduleRetries();
  });

  try {
    new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  } catch (error) {}
})();
