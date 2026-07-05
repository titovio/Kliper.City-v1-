(function () {
  'use strict';

  var STORAGE_KEY = 'kliper-scroll-portal-seen-v1';
  var VIDEO_SRC = './assets/video/tyumen-intro-web.mp4';
  var POSTER_SRC = './assets/video/tyumen-intro-poster.png';
  var FALLBACK_DURATION = 12;

  function storageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {}
  }

  function forceIntro() {
    return window.location.search.indexOf('intro=1') !== -1;
  }

  function shouldSkipIntro() {
    if (window.location.hash && window.location.hash.indexOf('card=') !== -1) return true;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    if (!forceIntro() && storageGet(STORAGE_KEY) === '1') return true;
    return false;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function scrollToSite(section) {
    storageSet(STORAGE_KEY, '1');
    window.scrollTo({
      top: section.offsetTop + section.offsetHeight + 2,
      behavior: 'smooth'
    });
  }

  function createIntro() {
    if (shouldSkipIntro()) return;

    var section = document.createElement('section');
    section.className = 'kliper-scroll-portal';
    section.setAttribute('aria-label', 'Кинематографичный вход в Клипер.Сити');

    var stage = document.createElement('div');
    stage.className = 'kliper-scroll-portal__stage';

    var video = document.createElement('video');
    video.className = 'kliper-scroll-portal__media';
    video.src = VIDEO_SRC;
    video.poster = POSTER_SRC;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';

    var cloudsBack = document.createElement('div');
    cloudsBack.className = 'kliper-scroll-portal__clouds kliper-scroll-portal__clouds--back';

    var cloudsFront = document.createElement('div');
    cloudsFront.className = 'kliper-scroll-portal__clouds kliper-scroll-portal__clouds--front';

    var veil = document.createElement('div');
    veil.className = 'kliper-scroll-portal__veil';

    var skip = document.createElement('button');
    skip.className = 'kliper-scroll-portal__skip';
    skip.type = 'button';
    skip.textContent = 'Пропустить';

    stage.appendChild(video);
    stage.appendChild(cloudsBack);
    stage.appendChild(cloudsFront);
    stage.appendChild(veil);
    stage.appendChild(skip);
    section.appendChild(stage);
    document.body.insertBefore(section, document.body.firstChild);
    document.documentElement.classList.add('kliper-scroll-portal-active');

    var duration = FALLBACK_DURATION;
    var raf = 0;
    var lastTime = -1;
    var isReady = false;

    function readProgress() {
      var rect = section.getBoundingClientRect();
      var distance = Math.max(1, section.offsetHeight - window.innerHeight);
      return clamp(-rect.top / distance, 0, 1);
    }

    function render() {
      raf = 0;

      var progress = readProgress();
      var eased = progress * progress * (3 - (2 * progress));
      var fade = clamp((progress - 0.82) / 0.16, 0, 1);
      var targetTime = duration * eased;

      stage.style.setProperty('--portal-progress', progress.toFixed(4));
      stage.style.setProperty('--portal-fade', fade.toFixed(4));
      video.style.transform = 'scale(' + (1.035 + progress * 0.07).toFixed(4) + ')';
      cloudsBack.style.transform = 'translate3d(' + (-36 * progress).toFixed(2) + 'px,' + (-18 * progress).toFixed(2) + 'px,0) scale(' + (1.04 + progress * 0.03).toFixed(4) + ')';
      cloudsFront.style.transform = 'translate3d(' + (54 * progress).toFixed(2) + 'px,' + (-28 * progress).toFixed(2) + 'px,0) scale(' + (1.08 + progress * 0.05).toFixed(4) + ')';

      if (isReady && Number.isFinite(targetTime) && Math.abs(targetTime - lastTime) > 0.035) {
        lastTime = targetTime;
        try {
          video.currentTime = clamp(targetTime, 0, Math.max(0, duration - 0.04));
        } catch (error) {}
      }

      if (progress > 0.985) {
        section.classList.add('is-complete');
        storageSet(STORAGE_KEY, '1');
      } else {
        section.classList.remove('is-complete');
      }
    }

    function scheduleRender() {
      if (raf) return;
      raf = window.requestAnimationFrame(render);
    }

    function markVideoReady() {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        duration = video.duration;
      }
      video.pause();
      isReady = true;
      scheduleRender();
    }

    video.addEventListener('loadedmetadata', markVideoReady);

    if (video.readyState > 0) {
      markVideoReady();
    }

    video.addEventListener('error', function () {
      document.documentElement.classList.remove('kliper-scroll-portal-active');
      if (section.parentNode) {
        section.parentNode.removeChild(section);
      }
    });

    skip.addEventListener('click', function () {
      scrollToSite(section);
    });

    window.addEventListener('scroll', scheduleRender, { passive: true });
    window.addEventListener('resize', scheduleRender);
    window.addEventListener('pageshow', scheduleRender);
    scheduleRender();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createIntro);
  } else {
    createIntro();
  }
})();
