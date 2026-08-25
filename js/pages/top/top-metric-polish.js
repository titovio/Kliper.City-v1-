(function () {
  window.__kliperTopMetricPolishLoaded = true;
  const dom = window.KLIPER_DOM || {};
  const metrics = [
    { label: 'Больше всего лайков', icon: '♡', kind: 'likes' },
    { label: 'Больше всего подписчиков', icon: '♢', kind: 'subs' },
    { label: 'Самый быстрый рост', icon: '⚡', kind: 'growth' }
  ];
  const activeMetrics = new Set(metrics.map((metric) => metric.kind));

  function text(node) {
    return dom.text ? dom.text(node) : (node && node.textContent ? node.textContent : '').trim();
  }

  function findTopPanel() {
    const heading = Array.from(document.querySelectorAll('h2')).find((node) => text(node) === 'Топ месяца');
    return heading ? heading.closest('[class*="rounded-"][class*="bg-white"]') : null;
  }

  function findMetric(textValue) {
    return metrics.find((metric) => metric.label === textValue);
  }

  function polishReasonLabels(panel) {
    Array.from(panel.querySelectorAll('article p')).forEach((node) => {
      if (node.dataset.metricPolished === 'true') return;
      const metric = findMetric(text(node));
      if (!metric) return;

      node.dataset.metricPolished = 'true';
      node.dataset.metricKind = metric.kind;
      node.classList.add('kliper-top-card-metric', `kliper-top-card-metric-${metric.kind}`);
      node.textContent = '';

      const icon = document.createElement('span');
      icon.className = 'kliper-top-metric-icon';
      icon.textContent = metric.icon;

      const label = document.createElement('span');
      label.textContent = metric.label;

      node.append(icon, label);
    });
  }

  function baseCardTitle(article) {
    const card = article.querySelector('[aria-label^="Открыть карточку"]');
    const label = card ? card.getAttribute('aria-label') || '' : '';
    return label
      .replace(/^Открыть карточку\s*/i, '')
      .replace(/\s·\s(подписки|рост)$/i, '')
      .trim();
  }

  function cardCategory(article) {
    const card = article.querySelector('[aria-label^="Открыть карточку"]');
    const raw = text(card || article);
    const match = raw.match(/^([А-Яа-яA-Za-z0-9№\s-]+?)\s+[A-ZА-Я]{1,3}\s/);
    return match ? match[1].trim().toLowerCase() : '';
  }

  function renderCombinedMetric(node, kinds) {
    const pickedMetrics = metrics.filter((metric) => kinds.includes(metric.kind));
    if (pickedMetrics.length <= 1) return;

    node.textContent = '';
    node.classList.add('kliper-top-card-metric-combined');
    node.dataset.metricKind = pickedMetrics.map((metric) => metric.kind).join(',');

    const icons = document.createElement('span');
    icons.className = 'kliper-top-metric-icon-stack';
    pickedMetrics.forEach((metric) => {
      const icon = document.createElement('span');
      icon.className = `kliper-top-metric-icon kliper-top-card-metric-${metric.kind}`;
      icon.textContent = metric.icon;
      icons.appendChild(icon);
    });

    const label = document.createElement('span');
    label.textContent = pickedMetrics.length >= 3 ? 'Втройне самая' : 'Вдвойне самая';

    node.append(icons, label);
  }

  function mergeDuplicateWinnerCards(panel) {
    const groups = new Map();
    panel.querySelectorAll('article').forEach((article) => {
      if (article.dataset.mergedDuplicate === 'true') return;
      const metricNode = article.querySelector('.kliper-top-card-metric');
      const title = baseCardTitle(article);
      const category = cardCategory(article);
      if (!metricNode || !title) return;

      const groupKey = `${category}::${title}`;
      if (!groups.has(groupKey)) groups.set(groupKey, []);
      groups.get(groupKey).push({ article, metricNode, kind: metricNode.dataset.metricKind });
    });

    let groupIndex = 0;
    groups.forEach((items) => {
      const validItems = items.filter((item) => item.kind && !item.kind.includes(','));
      if (validItems.length <= 1) return;

      const demoWinCount = [3, 2, 1][groupIndex % 3];
      const kinds = [...new Set(validItems.slice(0, demoWinCount).map((item) => item.kind))];
      const keeper = validItems[0];
      keeper.article.dataset.metricKinds = kinds.join(',');
      renderCombinedMetric(keeper.metricNode, kinds);

      validItems.slice(1).forEach((item) => {
        item.article.dataset.mergedDuplicate = 'true';
        item.article.hidden = true;
        item.article.classList.add('kliper-top-card-hidden');
      });
      groupIndex += 1;
    });
  }

  function addMetricTags(panel) {
    if (panel.querySelector(':scope > .kliper-top-metric-tags')) {
      syncMetricTags(panel);
      return;
    }
    const row = panel.querySelector('.kliper-top-filter-row') ||
      Array.from(panel.children).find((child) => {
        const className = child.getAttribute('class') || '';
        return child.querySelectorAll('button').length > 1 && className.includes('overflow-x-auto');
      });
    if (!row) return;

    const wrap = document.createElement('div');
    wrap.className = 'kliper-top-metric-tags';
    metrics.forEach((metric) => {
      const tag = document.createElement('button');
      tag.type = 'button';
      tag.dataset.metricKind = metric.kind;
      tag.className = `kliper-top-metric-tag kliper-top-metric-tag-${metric.kind}`;
      tag.innerHTML = `<span>${metric.icon}</span><b>${metric.label}</b>`;
      tag.addEventListener('click', () => {
        if (activeMetrics.size === 1 && activeMetrics.has(metric.kind)) {
          metrics.forEach((item) => activeMetrics.add(item.kind));
        } else if (activeMetrics.has(metric.kind)) {
          activeMetrics.delete(metric.kind);
        } else {
          activeMetrics.add(metric.kind);
        }
        syncMetricTags(panel);
        filterMetricCards(panel);
      });
      wrap.appendChild(tag);
    });
    row.before(wrap);
    syncMetricTags(panel);
  }

  function syncMetricTags(panel) {
    panel.querySelectorAll('.kliper-top-metric-tag').forEach((tag) => {
      const active = activeMetrics.has(tag.dataset.metricKind);
      tag.classList.toggle('is-active', active);
      tag.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function filterMetricCards(panel) {
    panel.querySelectorAll('article').forEach((article) => {
      const metricNode = article.querySelector('.kliper-top-card-metric');
      if (!metricNode) return;
      if (article.dataset.mergedDuplicate === 'true') {
        article.hidden = true;
        article.classList.add('kliper-top-card-hidden');
        return;
      }
      const kinds = (article.dataset.metricKinds || metricNode.dataset.metricKind || '').split(',').filter(Boolean);
      const visible = kinds.some((kind) => activeMetrics.has(kind));
      article.hidden = !visible;
      article.classList.toggle('kliper-top-card-hidden', !visible);
    });
  }

  function hideIntroText(panel) {
    const heading = Array.from(panel.querySelectorAll('h2')).find((node) => text(node) === 'Топ месяца');
    const hint = heading && heading.nextElementSibling;
    if (hint && text(hint).startsWith('Выберите раздел')) {
      hint.classList.add('kliper-top-intro-hidden');
    }
  }

  function getInnerCard(article) {
    return article.querySelector('article[aria-label^="Открыть карточку"]');
  }

  function cardTitleFromInner(innerCard) {
    return ((innerCard && innerCard.getAttribute('aria-label')) || '')
      .replace(/^Открыть карточку\s*/i, '')
      .replace(/\s·\s(подписки|рост)$/i, '')
      .trim();
  }

  function readActionState() {
    try {
      return JSON.parse(window.localStorage.getItem('kliper-top-card-actions') || '{}');
    } catch {
      return {};
    }
  }

  function writeActionState(state) {
    window.localStorage.setItem('kliper-top-card-actions', JSON.stringify(state));
  }

  function numberFromButton(button) {
    const match = text(button).match(/\d+/);
    return match ? Number(match[0]) : 0;
  }

  function setButtonNumber(button, value) {
    const nodes = Array.from(button.childNodes);
    const textNode = nodes.reverse().find((node) => node.nodeType === 3 && /\d+/.test(node.textContent || ''));
    if (textNode) {
      textNode.textContent = ` ${value}`;
    } else {
      button.append(` ${value}`);
    }
  }

  function restoreTopCardActions(panel) {
    const state = readActionState();
    panel.querySelectorAll('article').forEach((article) => {
      const innerCard = getInnerCard(article);
      const title = cardTitleFromInner(innerCard);
      if (!title) return;
      const cardState = state[title] || {};
      const buttons = Array.from(innerCard.querySelectorAll('button'));
      buttons.forEach((button) => {
        const isLike = !!button.querySelector('.lucide-heart');
        const isSubscribe = !!button.querySelector('.lucide-bell');
        if (!isLike && !isSubscribe) return;
        const key = isLike ? 'liked' : 'subscribed';
        button.classList.toggle('kliper-top-action-active', !!cardState[key]);
      });
    });
  }

  function toggleTopCardAction(button, title, key) {
    const state = readActionState();
    const cardState = state[title] || {};
    const next = !cardState[key];
    const baseKey = `${key}Base`;
    if (typeof cardState[baseKey] !== 'number') cardState[baseKey] = numberFromButton(button);
    cardState[key] = next;
    state[title] = cardState;
    writeActionState(state);

    button.classList.toggle('kliper-top-action-active', next);
    setButtonNumber(button, cardState[baseKey] + (next ? 1 : 0));
  }

  function openStoryForTopCard(title, sourceButton) {
    const fallback = document.createElement('div');
    fallback.className = 'kliper-top-story-fallback';

    const card = document.createElement('div');
    card.className = 'kliper-top-story-card';

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'kliper-top-story-close';
    close.setAttribute('aria-label', 'Закрыть');
    close.textContent = '×';

    const label = document.createElement('p');
    label.textContent = 'Stories';

    const heading = document.createElement('h3');
    heading.textContent = title;

    const hint = document.createElement('span');
    hint.textContent = 'История карточки откроется здесь, когда stories будут привязаны к этой компании.';

    card.append(close, label, heading, hint);
    fallback.appendChild(card);

    fallback.addEventListener('click', (event) => {
      if (event.target === fallback || event.target.closest('.kliper-top-story-close')) fallback.remove();
    });
    document.body.appendChild(fallback);
  }

  function enhanceTopCardActions(panel) {
    if (panel.dataset.topActionsBound !== 'true') {
      panel.dataset.topActionsBound = 'true';
      panel.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;
        const innerCard = button.closest('article[aria-label^="Открыть карточку"]');
        if (!innerCard || !panel.contains(innerCard)) return;

        const isLike = !!button.querySelector('.lucide-heart');
        const isSubscribe = !!button.querySelector('.lucide-bell');
        const isStory = !isLike && !isSubscribe && button.className.includes('right-4') && button.className.includes('top-4');
        if (!isLike && !isSubscribe && !isStory) return;

        const title = cardTitleFromInner(innerCard);
        if (!title) return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (isStory) {
          openStoryForTopCard(title, button);
        } else {
          toggleTopCardAction(button, title, isLike ? 'liked' : 'subscribed');
        }
      }, true);
    }

    restoreTopCardActions(panel);
  }

  function compactNominationGrid() {
    const nominationHeading = Array.from(document.querySelectorAll('h2')).find((node) => text(node) === 'Номинации месяца');
    if (!nominationHeading) return;
    const section = nominationHeading.closest('.space-y-4');
    if (!section) return;
    section.classList.add('kliper-top-nominations');
    Array.from(section.children).forEach((child) => {
      const className = child.getAttribute('class') || '';
      if (className.includes('grid') && child.querySelector('article')) {
        child.classList.add('kliper-top-nominations-grid');
      }
    });
  }

  function polishTopMetrics() {
    try {
      compactNominationGrid();
      const panel = findTopPanel();
      window.__kliperTopMetricPolishPanelFound = !!panel;
      if (!panel) return;
      hideIntroText(panel);
      polishReasonLabels(panel);
      mergeDuplicateWinnerCards(panel);
      addMetricTags(panel);
      enhanceTopCardActions(panel);
      filterMetricCards(panel);
    } catch (error) {
      window.__kliperTopMetricPolishError = error && (error.stack || error.message || String(error));
      console.error('Top metric polish failed', error);
    }
  }

  function schedule() {
    window.requestAnimationFrame(() => {
      polishTopMetrics();
      window.setTimeout(polishTopMetrics, 80);
    });
  }

  if (dom.onReady) {
    dom.onReady(schedule);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }

  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
