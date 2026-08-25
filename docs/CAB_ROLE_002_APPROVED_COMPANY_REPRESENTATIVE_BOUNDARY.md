# CAB-ROLE-002: approved boundary for `Представитель компании`

Дата: 2026-07-08.

Статус: approved documentation handoff. Код, CSS, JS, HTML, backend и `js/app.js` не менялись.

Основано на:

- `docs/ROLE_PROFILES_APPROVED_HANDOFF.md`;
- `docs/CAB_ROLE_001_COMPANY_REPRESENTATIVE_BOUNDARY.md`;
- `docs/pages-company-cabinet.md`;
- `docs/AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md`;
- `docs/PROJECT_DECISIONS.md`.

## 1. Approved boundary

Владелец утвердил:

```text
Представитель компании = публичная роль физлица.
Доступ к кабинету компании = отдельное право через company membership.
```

Это два разных слоя:

| Слой | Сущность | Где виден | Что дает |
|---|---|---|---|
| Публичная роль | `role_profile` / `Представитель компании` | рецензии, публикации, stories, публичные материалы | контекст автора и раскрытие связи с компанией |
| Приватный доступ | `company_members` + `company_role` | `#company-cabinet=developerSlug`, backend cabinet API | права читать/управлять кабинетом компании |

Главное правило: публичная роль не выдает кабинетные permissions.

## 2. Что считается публичной ролью физлица

`Представитель компании` показывает, что конкретный человек связан с компанией.

Эта роль может использоваться:

- рядом с именем автора;
- в рецензиях и комментариях;
- в публикациях;
- в company stories;
- в ответах компании;
- в карточках публичных материалов.

Она обязана раскрывать связь с компанией, если человек пишет о своей компании, объекте компании или коммерческом материале.

Публичная роль не дает:

- вход в кабинет;
- право менять B2B тариф;
- доступ к обращениям;
- доступ к подписчикам;
- право отвечать на рецензии от имени компании;
- право публиковать официальный материал компании;
- право управлять документами или объектами.

## 3. Что считается доступом к кабинету компании

Доступ к кабинету компании появляется только через `company_members`.

Минимальная модель:

```text
company_id
user_id
role
status
permissions[]
```

Разрешенные роли по `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md`:

| Role | Approved meaning |
|---|---|
| `company_owner` | полный доступ, сотрудники, тариф, документы, публикация |
| `company_manager` | обращения, рецензии, предложения, статистика |
| `company_editor` | публикации, stories, медиа, черновики |
| `company_viewer` | только чтение кабинета |

Backend/auth должен быть источником:

- membership;
- роли;
- permissions;
- company cabinet data;
- billing/subscription state.

localStorage не может выдавать доступ или роль.

## 4. B2B/B2C separation

Approved separation:

| Направление | Тариф | Кто владелец | Что покупает | Чего не покупает |
|---|---|---|---|---|
| B2C role profile | `Профиль автора`, гипотеза `990 ₽ / мес` | физлицо | инструменты публичного профессионального профиля | доступ к кабинету, B2B-лимиты, право говорить от имени компании |
| B2B company cabinet | тариф размещения компании | компания | карточки, лимиты, кабинет, публикации, статистику, company tools | экспертность, независимость мнения, органический рейтинг |

Правила:

1. `Профиль автора` не открывает `#company-cabinet=...`.
2. B2B тариф компании не превращает сотрудника в `Эксперта`.
3. B2B тариф не снимает обязанность маркировать коммерческий контекст.
4. Один человек может иметь B2C role profile и company membership, но эти права считаются отдельно.
5. Billing должен хранить owner type: user/role-profile vs company.

Запрещенная модель:

```text
plan_id без owner_type
```

Рекомендуемая модель:

```text
role_profile_subscriptions
company_subscriptions
```

## 5. Future permissions

Публичный `Представитель компании` может получить только display/context capabilities:

| Capability | Meaning |
|---|---|
| `representative.badge.show` | показать публичный badge |
| `representative.company_link.show` | показать связь с компанией |
| `representative.material.label` | маркировать материал как связанный с компанией |

Cabinet permissions остаются в company layer:

| Permission | Где применяется |
|---|---|
| `company.read` | чтение кабинета |
| `company.publish` | публикация профиля/официальных материалов |
| `company.members.manage` | управление сотрудниками |
| `billing.view` | просмотр тарифа и счетов |
| `billing.manage` | смена тарифа и платежные действия |
| `posts.manage` | публикации компании |
| `stories.manage` | stories компании |
| `reviews.reply` | официальный ответ компании |
| `dialogs.manage` | обращения/диалоги |
| `offers.manage` | предложения подписчикам |

Rule: `representative.*` capabilities не должны мапиться на `company.*`, `billing.*`, `posts.manage`, `stories.manage`, `reviews.reply`, `dialogs.manage` или `offers.manage`.

## 6. Approved labels

Labels должны быть разделены по смыслу:

| Label type | Examples | Purpose |
|---|---|---|
| Role | `Представитель компании` | кто автор |
| Relationship | `Связь с компанией раскрыта` | почему автор не независим |
| Material source | `Материал компании`, `Ответ компании` | от чьего имени материал |
| Commercial context | `Партнерский материал` | коммерческая природа |
| Verification | `Подтвержден компанией`, `Подтвержден Kliper`, `Не подтвержден` | кто подтвердил |

Approved rule from role-profile decisions: материалы компании и партнеров должны быть отдельно от organic top и блока `Почему советуют`.

## 7. Public materials rules

1. Официальный пост компании маркируется как `Материал компании`.
2. Ответ на рецензию маркируется как `Ответ компании`.
3. Физлицо с ролью `Представитель компании` получает role label и relationship label.
4. Партнерский/оплаченный материал получает commercial marker.
5. Органическая рецензия пользователя не должна выглядеть как официальный материал.
6. Материалы компании и партнеров не попадают в organic top как независимые рекомендации.
7. Если имя автора скрыто privacy-настройками, company relationship context должен сохраняться там, где он влияет на доверие.

## 8. Future data boundary

Публичная роль:

```text
role_profiles
role_profile_links
review_author_context
```

Приватный кабинет:

```text
companies
company_members
company_subscriptions
company_documents
company_posts
company_stories
company_dialogs
company_offers
```

Связь возможна через `user_id`, но permissions не наследуются автоматически.

## 9. Current frontend boundary

До отдельного implementation brief:

- текущий `#company-cabinet=developerSlug` остается v1 UI-прототипом;
- текущий `#business-pricing=developerSlug` остается B2B pricing UI-прототипом;
- role profiles не добавляются в текущий v1 UI;
- B2C `Профиль автора` не показывается в кабинете компании;
- компания не получает новые role-profile controls;
- `js/app.js` не трогать.

## 10. Blockers before implementation

Перед любыми UI/backend задачами остаются блокеры:

1. Точные финальные trust/commercial label texts для desktop и mobile.
2. Backend/auth implementation brief для `role_profiles`, `company_members` и permissions.
3. Storage contract: owner type для B2C и B2B billing.
4. Moderation rules для custom tags, role stories и company-linked reviews.
5. Rules для личных рецензий сотрудника о своей компании.
6. Acceptance gates для mobile label density.
7. Отдельный implementation brief для любого UI изменения.

## 11. Handoff rule

Если будущая задача касается `Представитель компании`, она должна сначала ответить:

```text
Это публичный контекст автора или приватное право кабинета?
```

Если это публичный контекст, работать через role-profile specs.

Если это приватное право, работать через company membership, backend/auth и permissions.

Если задача пытается сделать оба слоя одним флагом, ее нужно вернуть в Architect/Main.
