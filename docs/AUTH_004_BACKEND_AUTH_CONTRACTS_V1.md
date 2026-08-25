# AUTH-004: backend/auth contracts v1

Дата: 2026-07-07.

Статус: архитектурный контракт. Backend не реализован.

## Цель

Собрать единый контракт будущего backend/auth слоя для Kliper.City v1, чтобы UI-прототипы стали настоящими рабочими функциями без пересборки логики сайта.

Документ объединяет:

- пользователей;
- компании и застройщиков;
- роли;
- кабинет компании;
- тарифы и лимиты;
- социальные функции;
- обращения/CRM;
- рецензии;
- публикации;
- stories;
- API-контракты.

Связанные документы:

- `AUTH_002_BACKEND_AUTH_REQUIREMENTS.md`;
- `AUTH_003_BILLING_REQUIREMENTS.md`;
- `BILL_001_PRICING_MODEL.md`;
- `SOCIAL_FEATURES_SCOPE.md`;
- `CAB_005_COMPANY_CABINET_V1_ACCEPTANCE.md`.

## 1. Главный принцип

Frontend сейчас показывает v1 UI-прототип. После backend/auth:

- сервер становится источником прав;
- сервер становится источником данных;
- localStorage остается только временным cache/UI состоянием;
- публичная страница компании и приватный кабинет компании остаются разными контекстами;
- обычный пользователь и сотрудник компании могут быть одним аккаунтом, но с разными ролями.

## 2. Типы аккаунтов

| Тип | Назначение |
|---|---|
| `user` | обычный пользователь Kliper.City |
| `company_member` | сотрудник компании/застройщика |
| `kliper_admin` | администратор Kliper.City |

Один человек может иметь:

- пользовательский профиль;
- доступ к одной или нескольким компаниям;
- разные роли в разных компаниях.

## 3. Роли

### User roles

| Роль | Права |
|---|---|
| `user` | лайки, подписки, рецензии, избранное, друзья, подборки |
| `verified_user` | расширенные социальные действия после подтверждения телефона/email |

### Company roles

| Роль | Права |
|---|---|
| `company_owner` | полный доступ, сотрудники, тариф, документы, публикация |
| `company_manager` | обращения, рецензии, предложения, статистика |
| `company_editor` | публикации, stories, медиа, черновики |
| `company_viewer` | только чтение кабинета |

### Kliper roles

| Роль | Права |
|---|---|
| `kliper_support` | поддержка компаний и пользователей |
| `kliper_moderator` | модерация рецензий, компаний, публикаций |
| `kliper_admin` | полный административный доступ |

## 4. Auth flows

### Обычный пользователь

Минимальный v1 flow:

1. Вход по телефону или email.
2. Подтверждение кодом.
3. Создание/получение user profile.
4. Миграция локальных лайков/подписок/рецензий в backend.

### Компания

Минимальный v1 flow:

1. Пользователь входит как обычный аккаунт.
2. Backend возвращает список компаний, где он участник.
3. Пользователь выбирает компанию.
4. Frontend открывает `#company-cabinet=developerSlug`.
5. Backend проверяет membership и роль.

### Админ Kliper

Админский доступ не должен смешиваться с публичным UI.

Для v1 достаточно контрактов:

- проверка компаний;
- ручная корректировка статусов;
- поддержка тарифов;
- модерация рецензий.

## 5. Основные сущности

### users

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | ID пользователя |
| `display_name` | string | имя в интерфейсе |
| `phone` | string/null | телефон |
| `email` | string/null | email |
| `avatar_url` | string/null | аватар |
| `city_id` | string | город |
| `status` | string | active/blocked/deleted |
| `created_at` | datetime | дата создания |

### user_profiles

| Поле | Тип | Описание |
|---|---|---|
| `user_id` | string | владелец |
| `bio` | string/null | описание |
| `is_public` | boolean | видимость профиля |
| `reviews_visibility` | string | public/friends/private |
| `collections_visibility` | string | public/friends/private |

### companies

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | ID компании |
| `developer_slug` | string/null | связь с текущим developer slug |
| `name` | string | название |
| `legal_name` | string/null | юр. название |
| `type` | string | developer/business/service/branch |
| `status` | string | draft/review/published/suspended |
| `verification_status` | string | unverified/pending/verified/rejected |
| `current_plan_id` | string | тариф |

### company_members

| Поле | Тип | Описание |
|---|---|---|
| `company_id` | string | компания |
| `user_id` | string | пользователь |
| `role` | string | company_owner/company_manager/company_editor/company_viewer |
| `status` | string | invited/active/removed |
| `invited_by` | string/null | кто пригласил |

### objects

Объекты должны связывать:

- ЖК;
- готовые ЖК;
- бизнес-помещения;
- будущие услуги/филиалы.

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | ID объекта |
| `company_id` | string | владелец |
| `title` | string | название |
| `type` | string | newbuild/ready/business/service |
| `status` | string | draft/published/archived |
| `city_id` | string | город |

## 6. Социальные сущности

### likes

| Поле | Тип | Описание |
|---|---|---|
| `user_id` | string | пользователь |
| `target_type` | string | developer/object/business/company |
| `target_id` | string | объект лайка |
| `created_at` | datetime | дата |

### subscriptions

| Поле | Тип | Описание |
|---|---|---|
| `user_id` | string | пользователь |
| `target_type` | string | company/object/category/search |
| `target_id` | string | цель подписки |
| `status` | string | active/muted/cancelled |
| `created_at` | datetime | дата |

### reviews

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | ID рецензии |
| `user_id` | string | автор |
| `target_type` | string | company/object/business |
| `target_id` | string | цель |
| `rating` | number/null | оценка |
| `text` | string | текст |
| `visibility` | string | public/friends/private |
| `status` | string | draft/published/moderation/hidden |
| `company_reply_id` | string/null | ответ компании |

### friends

| Поле | Тип | Описание |
|---|---|---|
| `user_id` | string | инициатор |
| `friend_id` | string | второй пользователь |
| `status` | string | pending/accepted/blocked |

### collections

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | ID подборки |
| `user_id` | string | владелец |
| `title` | string | название |
| `visibility` | string | public/friends/private/link |

## 7. Кабинет компании

Текущий v1 route:

```text
#company-cabinet=developerSlug
```

Backend route contract:

```text
GET /companies/:companyId/cabinet
```

Ответ должен включать:

- company summary;
- current user role;
- profile status;
- readiness checklist;
- attention items;
- stats;
- objects;
- documents;
- posts;
- stories;
- subscriber segments;
- reviews;
- dialogs/leads;
- offers;
- billing summary.

Пример верхнего ответа:

```json
{
  "company": {
    "id": "company_123",
    "developer_slug": "gk-paritet-development",
    "name": "ГК Паритет Девелопмент",
    "status": "published",
    "verification_status": "verified"
  },
  "viewer": {
    "user_id": "user_123",
    "role": "company_owner",
    "permissions": ["company.read", "company.publish", "billing.manage"]
  },
  "readiness": {
    "done": 5,
    "total": 5,
    "items": []
  },
  "attention": [],
  "billing": {}
}
```

## 8. Тарифы и billing

Тарифы берутся из `BILL_001_PRICING_MODEL.md`.

Backend должен решать:

- текущий тариф;
- оплачен ли тариф;
- лимит карточек;
- лимит фото;
- лимит публикаций;
- доступ к аналитике;
- доступ к stories/спецмодулям;
- возможность скрывать рекламу конкурентов;
- дополнительные карточки.

Минимальные статусы подписки:

| Статус | Значение |
|---|---|
| `trial` | пробный доступ |
| `active` | оплачен |
| `past_due` | платеж не прошел |
| `cancelled` | отменен |
| `manual` | ручной тариф от Kliper |

Правило v1: frontend не должен сам решать, можно ли создать карточку или публикацию. Он показывает состояние, backend принимает решение.

## 9. CRM, обращения и предложения

### leads/dialogs

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | ID обращения |
| `company_id` | string | компания |
| `user_id` | string/null | пользователь |
| `source_type` | string | object/company/story/review/search |
| `source_id` | string/null | источник |
| `status` | string | new/in_progress/waiting_user/closed/spam |
| `title` | string | тема |
| `last_message_at` | datetime | последняя активность |

### offers

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | ID предложения |
| `company_id` | string | компания |
| `title` | string | название |
| `audience_type` | string | all_subscribers/segment/custom |
| `status` | string | draft/review/scheduled/sent/cancelled |
| `scheduled_at` | datetime/null | дата отправки |

Правило: предложения подписчикам нельзя отправлять без backend, consent и rate limits.

## 10. Публикации и stories компании

### company_posts

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | ID публикации |
| `company_id` | string | компания |
| `author_id` | string | сотрудник |
| `title` | string | заголовок |
| `body` | string | текст |
| `status` | string | draft/review/published/archived |
| `audience` | string | public/subscribers/segment |

### company_stories

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | ID story |
| `company_id` | string | компания |
| `title` | string | название |
| `media_url` | string | медиа |
| `status` | string | draft/published/scheduled/archived |
| `views_count` | number | просмотры |

Публикация stories и posts должна проходить через permissions и moderation rules.

## 11. Documents

Минимальная модель:

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | ID документа |
| `company_id` | string | компания |
| `type` | string | legal/brand/object/ownership/other |
| `title` | string | название |
| `status` | string | missing/uploaded/review/verified/rejected |
| `file_url` | string/null | файл |
| `review_comment` | string/null | комментарий модератора |

Загрузка документов требует auth, file storage, virus scan и admin moderation.

## 12. API v1 candidates

### Auth

```text
POST /auth/start
POST /auth/verify
POST /auth/logout
GET /me
GET /me/profile
PATCH /me/profile
```

### User social

```text
GET /me/likes
POST /me/likes
DELETE /me/likes/:targetType/:targetId

GET /me/subscriptions
POST /me/subscriptions
PATCH /me/subscriptions/:id

GET /me/reviews
POST /reviews
PATCH /reviews/:reviewId

GET /me/friends
POST /me/friends
PATCH /me/friends/:friendshipId

GET /me/collections
POST /me/collections
PATCH /me/collections/:collectionId
```

### Company cabinet

```text
GET /companies/:companyId/cabinet
GET /companies/:companyId/members
POST /companies/:companyId/members/invite
PATCH /companies/:companyId/members/:memberId

GET /companies/:companyId/objects
GET /companies/:companyId/documents
POST /companies/:companyId/documents

GET /companies/:companyId/posts
POST /companies/:companyId/posts
PATCH /companies/:companyId/posts/:postId

GET /companies/:companyId/stories
POST /companies/:companyId/stories
PATCH /companies/:companyId/stories/:storyId

GET /companies/:companyId/reviews
POST /companies/:companyId/reviews/:reviewId/reply

GET /companies/:companyId/dialogs
PATCH /companies/:companyId/dialogs/:dialogId

GET /companies/:companyId/offers
POST /companies/:companyId/offers
PATCH /companies/:companyId/offers/:offerId
```

### Billing

```text
GET /billing/plans
GET /companies/:companyId/subscription
GET /companies/:companyId/billing/usage
GET /companies/:companyId/billing/invoices

POST /companies/:companyId/subscription/change-plan
POST /companies/:companyId/billing/add-card
POST /companies/:companyId/billing/payment-method
POST /companies/:companyId/billing/cancel
```

## 13. Permission map

| Permission | user | owner | manager | editor | viewer | admin |
|---|---:|---:|---:|---:|---:|---:|
| `company.read` | no | yes | yes | yes | yes | yes |
| `company.publish` | no | yes | no | no | no | yes |
| `company.members.manage` | no | yes | no | no | no | yes |
| `billing.view` | no | yes | yes | no | no | yes |
| `billing.manage` | no | yes | no | no | no | yes |
| `posts.manage` | no | yes | yes | yes | no | yes |
| `stories.manage` | no | yes | yes | yes | no | yes |
| `reviews.reply` | no | yes | yes | no | no | yes |
| `dialogs.manage` | no | yes | yes | no | no | yes |
| `offers.manage` | no | yes | yes | no | no | yes |

## 14. LocalStorage migration

Current local/browser state must be treated as import candidate only.

Migration examples:

| Current behavior | Future backend entity |
|---|---|
| liked card in localStorage | `likes` |
| subscribed card/company | `subscriptions` |
| local user profile | `users`, `user_profiles` |
| local review demo | `reviews` |
| company cabinet mock plan | `company_subscriptions` |
| company cabinet mock dialogs | `company_dialogs` / `leads` |

Rule: localStorage must never grant permissions.

## 15. Implementation order

Recommended backend order:

1. Auth: login, sessions, `GET /me`.
2. User profile: profile, likes, subscriptions.
3. Reviews: create/read/moderate basics.
4. Company membership: companies, members, roles.
5. Company cabinet read API.
6. Billing read API: plans, current subscription, usage.
7. Company documents and verification.
8. Company dialogs/leads.
9. Company posts and stories.
10. Offers to subscribers.
11. Billing mutations and payment provider.
12. Friends and public collections if not shipped earlier.

## 16. V1 acceptance criteria for backend/auth

Backend/auth v1 can be considered ready when:

- user can login and see profile;
- likes/subscriptions persist across devices;
- reviews persist and have moderation status;
- company owner can enter company cabinet;
- company role is enforced by backend;
- cabinet data comes from API;
- pricing plans come from API;
- company subscription/usage comes from API;
- forbidden company route returns denied state;
- localStorage is not used for permissions;
- public pages never expose private company data.

## 17. Explicitly not decided yet

Needs owner/backend decision before implementation:

- phone-only vs email+phone auth;
- payment provider;
- legal invoice workflow;
- document storage provider;
- moderation process;
- whether friends/collections enter the first backend cut or the second;
- admin panel scope;
- notification channels: email, SMS, Telegram, in-app.

## 18. Current frontend boundary

Current frontend must remain valid while backend is absent:

- `#company-cabinet=developerSlug` remains UI route;
- `#business-pricing=developerSlug` remains UI route;
- future actions show v1 notice;
- no fake real payment;
- no fake real CRM;
- no fake document upload;
- no fake permission checks from localStorage.

This contract is the handoff point from UI stabilization to backend/auth planning.
