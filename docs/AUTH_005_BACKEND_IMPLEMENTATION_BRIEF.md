# AUTH-005: backend implementation brief v1

Дата: 2026-07-07.

Статус: implementation brief. Backend-код не реализован.

## Цель

Определить первый безопасный backend/auth срез для Kliper.City v1 после принятого контракта `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md`.

Главная задача первого среза:

- дать пользователю настоящий аккаунт;
- дать компании настоящий доступ к кабинету;
- заменить mock/read-only данные кабинета API-ответом;
- начать миграцию localStorage-состояний;
- не запускать оплату, CRM и редакторы раньше времени.

## 1. Рекомендуемый первый срез

Первый backend-срез должен быть **read-heavy**:

1. Auth/session.
2. `GET /me`.
3. User profile.
4. Company membership.
5. Read-only company cabinet API.
6. Read-only billing/plans/subscription/usage.
7. Migration preview для localStorage.

Не включать в первый срез:

- реальную оплату;
- смену тарифа;
- загрузку документов;
- отправку публикаций;
- отправку stories;
- ответы на рецензии;
- CRM-диалоги;
- предложения подписчикам;
- админ-панель.

Причина: сначала нужно стабилизировать identity, permissions и API shape. Мутации лучше подключать после того, как кабинет уверенно читает данные с сервера.

## 2. Definition of Done

Первый backend-срез готов, если:

- пользователь может войти;
- `GET /me` возвращает user profile и доступные компании;
- company cabinet открывается только при membership;
- forbidden company cabinet возвращает понятную ошибку;
- `GET /companies/:companyId/cabinet` возвращает данные для всех текущих блоков кабинета;
- `GET /billing/plans` возвращает тарифы;
- `GET /companies/:companyId/subscription` возвращает текущий тариф компании;
- frontend может отрисовать текущий кабинет из API без mock-данных;
- localStorage не используется для permissions;
- текущий статический UI продолжает работать, если backend недоступен.

## 3. Первый набор сущностей

### users

Минимум:

```text
id
display_name
phone
email
avatar_url
city_id
status
created_at
updated_at
```

### user_profiles

```text
user_id
bio
is_public
reviews_visibility
collections_visibility
updated_at
```

### companies

```text
id
developer_slug
name
legal_name
type
status
verification_status
current_plan_id
created_at
updated_at
```

### company_members

```text
id
company_id
user_id
role
status
created_at
updated_at
```

### company_objects

Первый срез может связать company с существующими объектами через seed/import.

```text
company_id
object_id
object_type
status
```

### billing_plans

```text
id
name
monthly_price
cards_limit
photo_limit
publication_limit
story_limit
analytics_level
is_available
is_recommended
sort_order
```

### company_subscriptions

```text
id
company_id
plan_id
status
period
started_at
expires_at
cards_used
additional_cards_count
updated_at
```

## 4. Seed/import данные

Для первого backend-среза не нужно вручную заводить все заново.

Источник seed:

- `js/data/developers.js`;
- `js/data/buildings.js`;
- `js/data/company-cabinet.js`;
- `js/data/company-pricing.js`.

Импорт должен создать:

- компании по developer slug;
- связь company -> developer;
- начальные company subscriptions;
- billing plans;
- демо membership для тестового пользователя;
- связи company -> current objects.

Важно: seed нужен только для dev/staging. Production-import должен быть отдельным решением.

## 5. API первого среза

### Auth

```text
POST /auth/start
POST /auth/verify
POST /auth/logout
GET /me
```

`POST /auth/start`

Request:

```json
{
  "channel": "phone",
  "login": "+79000000000"
}
```

Response:

```json
{
  "challenge_id": "auth_challenge_123",
  "expires_in": 300
}
```

`POST /auth/verify`

Request:

```json
{
  "challenge_id": "auth_challenge_123",
  "code": "123456"
}
```

Response:

```json
{
  "user": {},
  "session": {
    "expires_at": "2026-07-08T00:00:00Z"
  }
}
```

`GET /me`

Response:

```json
{
  "user": {
    "id": "user_123",
    "display_name": "Мария",
    "avatar_url": null
  },
  "profile": {
    "is_public": true,
    "reviews_visibility": "public"
  },
  "companies": [
    {
      "id": "company_123",
      "developer_slug": "gk-paritet-development",
      "name": "ГК Паритет Девелопмент",
      "role": "company_owner"
    }
  ]
}
```

### Company cabinet

```text
GET /companies/:companyId/cabinet
```

Backend должен проверять:

- session есть;
- user active;
- membership active;
- role разрешает `company.read`.

Forbidden response:

```json
{
  "error": {
    "code": "company_access_denied",
    "message": "Нет доступа к кабинету этой компании"
  }
}
```

Success response должен закрывать все текущие UI-блоки кабинета:

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
    "permissions": [
      "company.read",
      "billing.view",
      "billing.manage"
    ]
  },
  "summary": {
    "profile_status_label": "Профиль опубликован",
    "health_label": "2 проверки перед публикацией обновлений"
  },
  "stats": [],
  "attention": [],
  "readiness": {
    "done": 5,
    "total": 5,
    "items": []
  },
  "objects": [],
  "documents": [],
  "posts": [],
  "stories": [],
  "subscriber_segments": [],
  "reviews": [],
  "dialogs": [],
  "offers": [],
  "billing": {}
}
```

### Billing read-only

```text
GET /billing/plans
GET /companies/:companyId/subscription
GET /companies/:companyId/billing/usage
```

`GET /billing/plans` должен возвращать тарифы из `BILL_001_PRICING_MODEL.md`.

`GET /companies/:companyId/subscription`

Response:

```json
{
  "company_id": "company_123",
  "plan_id": "business",
  "status": "manual",
  "period": "monthly",
  "cards_limit": 3,
  "cards_used": 2,
  "additional_cards_count": 0
}
```

## 6. Permission checks

Первый срез должен реализовать минимальные permissions:

| Permission | Проверка |
|---|---|
| `company.read` | active membership in company |
| `billing.view` | owner or manager |
| `billing.manage` | owner only |
| `company.members.view` | owner or manager |

Все остальные actions пока возвращают:

```json
{
  "error": {
    "code": "not_implemented",
    "message": "Действие будет подключено на следующем backend-этапе"
  }
}
```

## 7. Frontend integration plan

Frontend не должен резко потерять текущий mock-режим.

Рекомендуемый порядок интеграции:

1. Добавить отдельный API adapter, не трогая `js/app.js`.
2. При наличии backend URL пробовать API.
3. Если API недоступен, оставлять текущий mock/local render.
4. Не хранить access permissions в localStorage.
5. Добавить UI-state:
   - loading;
   - access denied;
   - backend unavailable;
   - mock fallback active.

Будущий возможный файл:

```text
js/api/kliper-api-client.js
js/pages/company-cabinet/company-cabinet-api-adapter.js
```

Создавать эти файлы только на этапе реализации, не сейчас.

## 8. LocalStorage migration preview

Первый backend-срез должен уметь показать, что будет мигрировано.

Endpoint-кандидат:

```text
GET /me/migration-preview
```

Response:

```json
{
  "likes": {
    "local_count": 12,
    "matched_count": 11
  },
  "subscriptions": {
    "local_count": 5,
    "matched_count": 5
  },
  "reviews": {
    "local_count": 0,
    "matched_count": 0
  }
}
```

Фактическую миграцию делать отдельным шагом после подтверждения владельца.

## 9. Error states

Frontend должен получить понятные коды:

| Code | UI |
|---|---|
| `unauthorized` | войдите, чтобы открыть кабинет |
| `company_access_denied` | нет доступа к этой компании |
| `company_not_found` | компания не найдена |
| `billing_unavailable` | тарифы временно недоступны |
| `backend_unavailable` | работаем в демо-режиме |
| `not_implemented` | действие будет подключено позже |

## 10. QA для первого backend-среза

Проверить:

- `GET /me` без сессии;
- `GET /me` с сессией;
- company cabinet owner access;
- company cabinet manager access;
- company cabinet viewer access;
- access denied для чужой компании;
- billing plans read;
- subscription read;
- fallback frontend mode при недоступном backend;
- mobile cabinet не ломается;
- dark theme не ломается;
- public page не показывает приватные данные.

## 11. Что отдавать backend-чату

Минимальный пакет:

1. `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md`;
2. `AUTH_005_BACKEND_IMPLEMENTATION_BRIEF.md`;
3. `BILL_001_PRICING_MODEL.md`;
4. `AUTH_003_BILLING_REQUIREMENTS.md`;
5. `CAB_005_COMPANY_CABINET_V1_ACCEPTANCE.md`;
6. `DATA_STRUCTURE.md`;
7. `PROJECT_INDEX.md`;
8. `AGENTS.md`.

## 12. Решение

Первый backend/auth implementation должен начинаться с read-only identity/company/billing slice.

Мутации, CRM, документы, публикации, stories, ответы на рецензии и реальная оплата идут следующими этапами после того, как:

- есть стабильный login;
- есть company membership;
- кабинет читает данные с backend;
- frontend fallback не сломан.
