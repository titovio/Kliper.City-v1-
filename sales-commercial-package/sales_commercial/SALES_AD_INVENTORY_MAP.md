# Sales Ad Inventory / Site Placements Map

Дата: 2026-07-08.

Статус: стартовая карта мест на сайте, которые могут стать commercial inventory.

## 1. Каталоги

### Карточка в каталоге

Возможные коммерческие продукты:

- official card;
- promoted card;
- special module;
- no competitor ads;
- extended gallery;
- extra CTA;
- verified company label.

Ограничение:

```text
Paid placement не должен выглядеть как органический рейтинг.
```

### Верх выдачи

Возможные продукты:

- sponsored slot;
- category sponsor;
- promoted object;
- seasonal campaign.

Требуется маркировка:

- `Партнерский материал`;
- `Реклама`;
- `Материал компании`.

## 2. Stories

Возможные продукты:

- company story;
- sponsored story;
- category story;
- launch story;
- promo story for subscribers.

Ограничение:

Обычный пользователь не ведет stories в v1. Источник должен быть:

```text
platform | company | role_profile
```

## 3. Страница компании / застройщика

Возможные продукты:

- official profile;
- expanded company page;
- objects list;
- publications;
- stories;
- review response;
- contact CTA;
- gallery sections;
- analytics.

## 4. Страница объекта / ЖК

Возможные продукты:

- special module in object page;
- official updates;
- construction progress;
- documents block;
- gallery extension;
- contact CTA;
- subscriber notification.

Ограничение:

Блок `Почему советуют` не продается как независимая органическая рекомендация.

## 5. Бизнес-раздел

Возможные продукты:

- promoted business space;
- category sponsorship;
- highlighted lease/sale offer;
- premium gallery;
- lead CTA;
- map highlight.

## 6. Кабинет компании

Не продается как рекламное место, но является:

- каналом upsell;
- местом контроля тарифа;
- местом подключения доп. карточек;
- местом просмотра аналитики;
- местом управления публикациями/stories.

## 7. Будущие места

- newsletter/notifications to subscribers;
- district page sponsorship;
- collections sponsorship;
- search sponsorship;
- profile recommendations;
- role-profile promoted specialist.

## 8. Что нужно утвердить

1. Какие места доступны в v1 как визуальный продукт.
2. Какие места только v2.
3. Какие места требуют backend/auth.
4. Какие места требуют маркировку рекламы.
5. Какие места нельзя продавать принципиально.
