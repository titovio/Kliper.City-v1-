(function () {
  window.KLIPER_COMPANY_CABINET = {
    defaults: {
      currentRole: 'company_owner',
      profileStatus: 'published',
      profileStatusLabel: 'Профиль опубликован',
      healthLabel: '2 проверки перед публикацией обновлений',
      documents: [
        { title: 'Реквизиты компании', status: 'проверено' },
        { title: 'Подтверждение застройщика', status: 'проверено' },
        { title: 'Брендовые материалы', status: 'нужно обновить' },
        { title: 'Документы объектов', status: 'готовятся к проверке' }
      ],
      posts: [
        { title: 'Ход строительства', meta: 'черновик для подписчиков', status: 'готовится' },
        { title: 'Новые фотографии двора', meta: 'публичная лента', status: 'на модерации' },
        { title: 'Акция на семейные планировки', meta: 'предложение подписчикам', status: 'черновик' }
      ],
      stories: [
        { title: 'Обзор района', status: 'активна', views: 1240 },
        { title: 'Двор без машин', status: 'черновик', views: 0 },
        { title: 'Ход работ', status: 'запланирована', views: 0 }
      ],
      subscriberSegments: [
        { title: 'Интерес к новостройкам', value: '68%' },
        { title: 'Семейные сценарии', value: '24%' },
        { title: 'Бизнес-помещения', value: '8%' }
      ],
      reviews: [
        { title: 'Новая рецензия', text: 'Покупатель отметил понятную навигацию по объектам.', tone: 'positive' },
        { title: 'Ждет ответа', text: 'Вопрос по срокам сдачи и очередям строительства.', tone: 'neutral' }
      ],
      dialogs: [
        { title: 'Подбор объекта', source: 'публичная страница', status: 'новое' },
        { title: 'Вопрос по ЖК', source: 'карточка объекта', status: 'в работе' },
        { title: 'Рецензия', source: 'страница компании', status: 'закрыто' }
      ],
      offers: [
        { title: 'Подборка для подписчиков', audience: 'все подписчики', status: 'черновик' },
        { title: 'Семейные планировки', audience: 'сегмент Для семьи', status: 'черновик' }
      ]
    },
    companies: {
      brusnika: {
        companyId: 'brusnika',
        companyName: 'Брусника',
        lead: 'Управление публичной страницей, объектами, stories и обращениями.'
      },
      'gk-enko': {
        companyId: 'gk-enko',
        companyName: 'ГК ЭНКО',
        lead: 'Рабочее пространство для публикаций, объектов и репутации компании.'
      },
      'gk-strana-development': {
        companyId: 'gk-strana-development',
        companyName: 'ГК Страна Девелопмент',
        lead: 'Контроль карточек, рецензий, подписчиков и будущих предложений.'
      }
    }
  };
})();
