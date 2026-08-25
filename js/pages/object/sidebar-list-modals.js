(function () {
  var dom = window.KLIPER_DOM || {};
  var modalRootId = 'kliper-sidebar-list-modal-root';

  var subscribers = [
    { name: 'Анна М.', role: 'ищет квартиру', district: 'Центр', initials: 'АМ' },
    { name: 'Илья С.', role: 'смотрит район', district: 'Зарека', initials: 'ИС' },
    { name: 'Марина К.', role: 'подписана на новости', district: 'КПД', initials: 'МК' },
    { name: 'Дмитрий К.', role: 'выбирает планировку', district: 'Центральный', initials: 'ДК' },
    { name: 'Екатерина П.', role: 'следит за сдачей дома', district: 'Мыс', initials: 'ЕП' },
    { name: 'Ольга С.', role: 'интересуется инфраструктурой', district: 'Ленинский', initials: 'ОС' },
    { name: 'Алексей П.', role: 'сравнивает ЖК', district: 'Восточный', initials: 'АП' },
    { name: 'Наталья Р.', role: 'ждет новости объекта', district: 'Дом Обороны', initials: 'НР' },
    { name: 'Роман В.', role: 'подписан на обновления', district: 'Патрушево', initials: 'РВ' },
    { name: 'Юлия Н.', role: 'смотрит предложения', district: 'Центр', initials: 'ЮН' }
  ];

  var recommendations = [
    {
      author: 'Анна М.',
      initials: 'АМ',
      tone: 'советует',
      text: 'Понятно, что строят и где смотреть новости по объекту.'
    },
    {
      author: 'Илья С.',
      initials: 'ИС',
      tone: 'полезно',
      text: 'Удобно сравнивать ЖК и сразу видеть связанные готовые ЖК.'
    },
    {
      author: 'Марина К.',
      initials: 'МК',
      tone: 'актуально',
      text: 'Все обновления по объекту собраны в одном месте, не нужно искать по разным сайтам.'
    },
    {
      author: 'Дмитрий К.',
      initials: 'ДК',
      tone: 'удобно',
      text: 'Можно подписаться и получать новости по всем важным этапам строительства.'
    },
    {
      author: 'Екатерина П.',
      initials: 'ЕП',
      tone: 'понятно',
      text: 'Нравится, что рядом видны сервисы, предложения и связанные компании.'
    },
    {
      author: 'Ольга С.',
      initials: 'ОС',
      tone: 'советует',
      text: 'Карточка помогает быстро понять, подходит ли объект по району и инфраструктуре.'
    }
  ];

  function escapeHtml(value) {
    if (dom.escapeHtml) return dom.escapeHtml(value);
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function normalize(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function getRoot() {
    var root = document.getElementById(modalRootId);
    if (!root) {
      root = document.createElement('div');
      root.id = modalRootId;
      document.body.appendChild(root);
    }
    return root;
  }

  function getPageTitle() {
    var h1 = Array.prototype.slice.call(document.querySelectorAll('h1'))
      .map(function (node) { return normalize(node.textContent); })
      .find(Boolean);
    return h1 || 'карточки';
  }

  function renderSubscribers() {
    return subscribers.map(function (item) {
      return '<article class="kliper-sidebar-list-modal__subscriber">' +
        '<span class="kliper-sidebar-list-modal__avatar">' + escapeHtml(item.initials) + '</span>' +
        '<div>' +
          '<strong>' + escapeHtml(item.name) + '</strong>' +
          '<p>' + escapeHtml(item.role) + ' · ' + escapeHtml(item.district) + '</p>' +
        '</div>' +
        '<span class="kliper-sidebar-list-modal__status">подписчик</span>' +
      '</article>';
    }).join('');
  }

  function renderRecommendations() {
    return recommendations.map(function (item) {
      return '<article class="kliper-sidebar-list-modal__recommendation">' +
        '<span class="kliper-sidebar-list-modal__avatar kliper-sidebar-list-modal__avatar--recommendation">' + escapeHtml(item.initials) + '</span>' +
        '<div class="kliper-sidebar-list-modal__recommendation-content">' +
          '<strong>' + escapeHtml(item.author) + '</strong>' +
          '<p>' + escapeHtml(item.text) + '</p>' +
        '</div>' +
        '<span class="kliper-sidebar-list-modal__recommendation-tone">' + escapeHtml(item.tone) + '</span>' +
      '</article>';
    }).join('');
  }

  function openModal(kind) {
    var isSubscribers = kind === 'subscribers';
    var isReviews = kind === 'reviews';
    var title = isSubscribers ? 'Все подписчики' : (isReviews ? 'Все рецензии' : 'Все рекомендации');
    var subtitle = isSubscribers
      ? 'Люди, которые следят за обновлениями ' + getPageTitle() + '.'
      : (isReviews
        ? 'Рецензии жителей и пользователей по ' + getPageTitle() + '.'
        : 'Отзывы и причины, почему жители советуют ' + getPageTitle() + '.');
    var content = isSubscribers ? renderSubscribers() : renderRecommendations();

    var root = getRoot();
    root.innerHTML =
      '<div class="kliper-sidebar-list-modal" role="dialog" aria-modal="true" aria-label="' + escapeHtml(title) + '">' +
        '<button class="kliper-sidebar-list-modal__backdrop" type="button" data-sidebar-list-close aria-label="Закрыть"></button>' +
        '<section class="kliper-sidebar-list-modal__panel">' +
          '<header class="kliper-sidebar-list-modal__head">' +
            '<div>' +
              '<p>' + escapeHtml(getPageTitle()) + '</p>' +
              '<h2>' + escapeHtml(title) + '</h2>' +
              '<span>' + escapeHtml(subtitle) + '</span>' +
            '</div>' +
            '<button class="kliper-sidebar-list-modal__close" type="button" data-sidebar-list-close aria-label="Закрыть">×</button>' +
          '</header>' +
          '<div class="kliper-sidebar-list-modal__body">' + content + '</div>' +
        '</section>' +
      '</div>';
    document.body.classList.add('kliper-sidebar-list-modal-open');
  }

  function closeModal() {
    var root = document.getElementById(modalRootId);
    if (root) root.innerHTML = '';
    document.body.classList.remove('kliper-sidebar-list-modal-open');
  }

  document.addEventListener('click', function (event) {
    var close = event.target.closest('[data-sidebar-list-close]');
    if (close) {
      event.preventDefault();
      event.stopPropagation();
      closeModal();
      return;
    }

    var button = event.target.closest('button');
    if (!button) return;
    var label = normalize(button.textContent);
    if (label !== 'Все подписчики' && label !== 'Все рекомендации' && label !== 'Все рецензии') return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openModal(label === 'Все подписчики' ? 'subscribers' : (label === 'Все рецензии' ? 'reviews' : 'recommendations'));
  }, true);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeModal();
  });
})();
