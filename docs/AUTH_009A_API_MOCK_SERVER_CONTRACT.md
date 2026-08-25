# AUTH-009A: API mock server contract and sample responses

Дата: 2026-07-07.

Статус: mock API contract. Реальный backend не реализован.

## Цель

Подготовить sample responses для первого read-only backend/auth среза Kliper.City v1.

Документ нужен, чтобы:

- frontend API adapter мог разрабатываться без настоящего backend;
- backend-команда знала ожидаемую форму ответов;
- QA мог проверять success/error/fallback сценарии;
- не было расхождения между кабинетом, тарифами и auth.

Связанные документы:

- `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md`;
- `AUTH_005_BACKEND_IMPLEMENTATION_BRIEF.md`;
- `AUTH_006_STORAGE_SCHEMA_PLAN.md`;
- `AUTH_007_FRONTEND_API_ADAPTER_PLAN.md`;
- `AUTH_008_BACKEND_STACK_DECISION_CHECKLIST.md`.

## 1. Base API

Recommended base path:

```text
/api/v1
```

Mock server may run at:

```text
http://127.0.0.1:4000/api/v1
```

Frontend adapter config example:

```js
window.KLIPER_API_CONFIG = {
  enabled: true,
  baseUrl: 'http://127.0.0.1:4000/api/v1',
  timeoutMs: 3500,
  fallbackMode: 'mock'
};
```

## 2. Response envelope

API success:

```json
{
  "ok": true,
  "data": {}
}
```

API error:

```json
{
  "ok": false,
  "error": {
    "code": "company_access_denied",
    "message": "Нет доступа к кабинету этой компании"
  }
}
```

Optional meta:

```json
{
  "ok": true,
  "data": {},
  "meta": {
    "request_id": "req_mock_001",
    "source": "mock-server"
  }
}
```

## 3. GET /health

Endpoint:

```text
GET /api/v1/health
```

Success:

```json
{
  "ok": true,
  "data": {
    "status": "ok",
    "service": "kliper-api",
    "version": "v1",
    "time": "2026-07-07T00:00:00Z"
  }
}
```

Use:

- adapter smoke;
- backend availability check;
- staging deployment check.

## 4. GET /me

Endpoint:

```text
GET /api/v1/me
```

Authenticated success:

```json
{
  "ok": true,
  "data": {
    "user": {
      "id": "usr_demo_maria",
      "display_name": "Мария",
      "phone": "+79000000000",
      "email": "maria@example.test",
      "avatar_url": null,
      "city_id": "tyumen",
      "status": "active"
    },
    "profile": {
      "is_public": true,
      "reviews_visibility": "public",
      "collections_visibility": "public"
    },
    "companies": [
      {
        "id": "cmp_gk_paritet_development",
        "developer_slug": "gk-paritet-development",
        "name": "ГК Паритет Девелопмент",
        "role": "company_owner",
        "permissions": [
          "company.read",
          "billing.view",
          "billing.manage",
          "posts.manage",
          "stories.manage",
          "reviews.reply",
          "dialogs.manage",
          "offers.manage"
        ]
      }
    ]
  }
}
```

Anonymous:

HTTP status:

```text
401
```

Body:

```json
{
  "ok": false,
  "error": {
    "code": "unauthorized",
    "message": "Войдите, чтобы продолжить"
  }
}
```

## 5. GET /billing/plans

Endpoint:

```text
GET /api/v1/billing/plans
```

Success:

```json
{
  "ok": true,
  "data": {
    "annual_promo": "При оплате за год — 2 месяца бесплатно",
    "addon": {
      "title": "Доп. карточка сверх лимита",
      "price_label": "от 790 ₽ / мес"
    },
    "plans": [
      {
        "id": "free",
        "name": "Бесплатный",
        "monthly_price": 0,
        "price_label": "0 ₽",
        "period": "мес",
        "cards_limit": 1,
        "label": "1 базовая карточка",
        "button_label": "Подключить",
        "is_recommended": false,
        "badge": null,
        "features": [
          "Логотип, описание, карта",
          "Контакты и соцсети",
          "До 5 фото",
          "Подписки и рекомендации"
        ]
      },
      {
        "id": "standard",
        "name": "Стандарт",
        "monthly_price": 990,
        "price_label": "990 ₽",
        "period": "мес",
        "cards_limit": 1,
        "label": "1 официальная карточка",
        "button_label": "Выбрать",
        "is_recommended": false,
        "badge": null,
        "features": [
          "Статус «Официальная»",
          "До 20 фото",
          "Чат и кнопки связи",
          "1 акция, 1 история",
          "2 публикации в месяц"
        ]
      },
      {
        "id": "business",
        "name": "Бизнес",
        "monthly_price": 2490,
        "price_label": "2 490 ₽",
        "period": "мес",
        "cards_limit": 3,
        "label": "До 3 официальных карточек",
        "button_label": "Выбрать",
        "is_recommended": false,
        "badge": null,
        "features": [
          "Общая страница компании",
          "Галерея по разделам",
          "1 спецмодуль в каждой карточке",
          "Статистика по объектам",
          "8 публикаций в месяц"
        ]
      },
      {
        "id": "pro",
        "name": "Про",
        "monthly_price": 4990,
        "price_label": "4 990 ₽",
        "period": "мес",
        "cards_limit": 5,
        "label": "До 5 официальных карточек",
        "button_label": "Выбрать",
        "is_recommended": true,
        "badge": "Популярный",
        "features": [
          "До 3 спецмодулей",
          "До 100 фото",
          "Подписка на филиалы / проекты",
          "2 уведомления подписчикам",
          "Подробная аналитика"
        ]
      },
      {
        "id": "maximum",
        "name": "Максимум",
        "monthly_price": 7490,
        "price_label": "7 490 ₽",
        "period": "мес",
        "cards_limit": 10,
        "label": "До 10 официальных карточек",
        "button_label": "Подключить",
        "is_recommended": false,
        "badge": "Для застройщиков",
        "features": [
          "Все спецмодули категории",
          "Гибкая структура карточек",
          "До 250 фото",
          "Отчёты по звонкам и переходам",
          "Без рекламы конкурентов"
        ]
      }
    ],
    "notes": [
      "Продвижение и реклама подключаются отдельно",
      "Подходит для ЖК, бизнеса, услуг и филиалов",
      "Оплата и смена тарифа будут подключены после backend/auth"
    ]
  }
}
```

## 6. GET /companies/:companyId/subscription

Endpoint:

```text
GET /api/v1/companies/cmp_gk_paritet_development/subscription
```

Success:

```json
{
  "ok": true,
  "data": {
    "company_id": "cmp_gk_paritet_development",
    "developer_slug": "gk-paritet-development",
    "plan_id": "business",
    "plan_name": "Бизнес",
    "status": "manual",
    "period": "monthly",
    "started_at": "2026-07-01T00:00:00Z",
    "expires_at": null,
    "cards_limit": 3,
    "cards_used": 2,
    "additional_cards_count": 0,
    "price_label": "2 490 ₽ / мес"
  }
}
```

Access denied:

HTTP status:

```text
403
```

Body:

```json
{
  "ok": false,
  "error": {
    "code": "company_access_denied",
    "message": "Нет доступа к тарифу этой компании"
  }
}
```

## 7. GET /companies/:companyId/cabinet

Endpoint:

```text
GET /api/v1/companies/cmp_gk_paritet_development/cabinet
```

Success:

```json
{
  "ok": true,
  "data": {
    "company": {
      "id": "cmp_gk_paritet_development",
      "developer_slug": "gk-paritet-development",
      "name": "ГК Паритет Девелопмент",
      "type": "developer",
      "status": "published",
      "verification_status": "verified",
      "cover_url": "/assets/developers/gk-paritet-development.webp"
    },
    "viewer": {
      "user_id": "usr_demo_maria",
      "role": "company_owner",
      "permissions": [
        "company.read",
        "billing.view",
        "billing.manage",
        "posts.manage",
        "stories.manage",
        "reviews.reply",
        "dialogs.manage",
        "offers.manage"
      ]
    },
    "summary": {
      "profile_status_label": "Профиль опубликован",
      "health_label": "2 проверки перед публикацией обновлений",
      "lead": "Рабочее пространство компании в Kliper.City."
    },
    "stats": [
      {
        "label": "Просмотры",
        "value": "4 620",
        "hint": "публичная страница"
      },
      {
        "label": "Подписчики",
        "value": "88",
        "hint": "агрегировано"
      },
      {
        "label": "Рецензии",
        "value": "11",
        "hint": "видимые и новые"
      },
      {
        "label": "Обращения",
        "value": "3",
        "hint": "демо-очередь"
      },
      {
        "label": "Объекты",
        "value": "2",
        "hint": "1 строится / 1 готово"
      },
      {
        "label": "Stories",
        "value": "3",
        "hint": "активные и черновики"
      },
      {
        "label": "Рейтинг",
        "value": "#1",
        "hint": "в категории"
      }
    ],
    "attention": [
      {
        "value": 2,
        "label": "документа к проверке"
      },
      {
        "value": 2,
        "label": "обращения в работе"
      },
      {
        "value": 2,
        "label": "публикации готовятся"
      }
    ],
    "readiness": {
      "done": 5,
      "total": 5,
      "items": [
        {
          "label": "Реквизиты и подтверждение",
          "done": true
        },
        {
          "label": "Связанные объекты",
          "done": true
        },
        {
          "label": "Контент для ленты",
          "done": true
        },
        {
          "label": "Stories компании",
          "done": true
        },
        {
          "label": "Очередь обращений",
          "done": true
        }
      ]
    },
    "objects": [
      {
        "id": "obj_jk_schaste",
        "title": "ЖК Счастье",
        "district": "Центральный",
        "status": "уточнить",
        "price_label": "от 4,2 млн ₽"
      },
      {
        "id": "obj_jk_paritet",
        "title": "ЖК Паритет",
        "district": "Ленинский",
        "status": "строится",
        "price_label": "от 5,1 млн ₽"
      }
    ],
    "billing": {
      "plan_id": "business",
      "plan_name": "Бизнес",
      "price_label": "2 490 ₽ / мес",
      "cards_used": 2,
      "cards_limit": 3,
      "annual_promo": "При оплате за год — 2 месяца бесплатно"
    },
    "documents": [
      {
        "title": "Реквизиты компании",
        "status": "проверено"
      },
      {
        "title": "Подтверждение застройщика",
        "status": "проверено"
      },
      {
        "title": "Брендовые материалы",
        "status": "нужно обновить"
      },
      {
        "title": "Документы объектов",
        "status": "ожидают backend"
      }
    ],
    "posts": [
      {
        "title": "Ход строительства",
        "meta": "черновик для подписчиков",
        "status": "готовится"
      },
      {
        "title": "Новые фотографии двора",
        "meta": "публичная лента",
        "status": "на модерации"
      }
    ],
    "stories": [
      {
        "title": "Обзор района",
        "status": "активна",
        "views": 1240
      },
      {
        "title": "Двор без машин",
        "status": "черновик",
        "views": 0
      }
    ],
    "subscriber_segments": [
      {
        "title": "Интерес к новостройкам",
        "value": "68%"
      },
      {
        "title": "Семейные сценарии",
        "value": "24%"
      }
    ],
    "reviews": [
      {
        "title": "Новая рецензия",
        "text": "Покупатель отметил понятную навигацию по объектам.",
        "tone": "positive"
      },
      {
        "title": "Ждет ответа",
        "text": "Вопрос по срокам сдачи и очередям строительства.",
        "tone": "neutral"
      }
    ],
    "dialogs": [
      {
        "title": "Подбор объекта",
        "source": "публичная страница",
        "status": "новое"
      },
      {
        "title": "Вопрос по ЖК",
        "source": "карточка объекта",
        "status": "в работе"
      }
    ],
    "offers": [
      {
        "title": "Подборка для подписчиков",
        "audience": "все подписчики",
        "status": "ожидает backend"
      }
    ]
  }
}
```

## 8. GET /me/migration-preview

Endpoint:

```text
GET /api/v1/me/migration-preview
```

Success:

```json
{
  "ok": true,
  "data": {
    "likes": {
      "local_count": 12,
      "matched_count": 11,
      "unmatched_count": 1
    },
    "subscriptions": {
      "local_count": 5,
      "matched_count": 5,
      "unmatched_count": 0
    },
    "district_subscriptions": {
      "local_count": 2,
      "matched_count": 2,
      "unmatched_count": 0
    },
    "reviews": {
      "local_count": 0,
      "matched_count": 0,
      "unmatched_count": 0
    }
  }
}
```

Rule:

- preview does not import data;
- import must be a separate explicit action later.

## 9. Common errors

### Unauthorized

HTTP status:

```text
401
```

Body:

```json
{
  "ok": false,
  "error": {
    "code": "unauthorized",
    "message": "Войдите, чтобы продолжить"
  }
}
```

### Access denied

HTTP status:

```text
403
```

Body:

```json
{
  "ok": false,
  "error": {
    "code": "company_access_denied",
    "message": "У вас нет доступа к этой компании"
  }
}
```

### Company not found

HTTP status:

```text
404
```

Body:

```json
{
  "ok": false,
  "error": {
    "code": "company_not_found",
    "message": "Компания не найдена"
  }
}
```

### Not implemented

HTTP status:

```text
501
```

Body:

```json
{
  "ok": false,
  "error": {
    "code": "not_implemented",
    "message": "Действие будет подключено на следующем backend-этапе"
  }
}
```

## 10. Mock scenario matrix

| Scenario | Endpoint behavior | Expected frontend behavior |
|---|---|---|
| API disabled | no request | render mock fallback |
| API down | request timeout/network error | render mock fallback + optional demo notice |
| `GET /me` 401 | unauthorized | show login state |
| cabinet 403 | access denied | do not fallback to private mock cabinet |
| billing plans success | API plans | render API pricing |
| billing plans down | network error | render `KLIPER_COMPANY_PRICING` fallback |
| cabinet success | API cabinet | render API data |
| migration preview success | API preview | show counts only |

## 11. Minimal mock server routes

For a future mock server:

```text
GET /api/v1/health
GET /api/v1/me
GET /api/v1/billing/plans
GET /api/v1/companies/:companyId/subscription
GET /api/v1/companies/:companyId/cabinet
GET /api/v1/me/migration-preview
```

Optional scenario query:

```text
?scenario=success
?scenario=unauthorized
?scenario=access-denied
?scenario=not-found
?scenario=slow
?scenario=error
```

Examples:

```text
GET /api/v1/companies/cmp_gk_paritet_development/cabinet?scenario=access-denied
GET /api/v1/billing/plans?scenario=slow
```

## 12. Frontend adapter acceptance

When adapter is implemented later, it must pass:

- API disabled -> mock fallback;
- API down -> mock fallback for public/non-private read;
- billing plans API success -> API data;
- cabinet API success -> API data;
- cabinet 401 -> login state;
- cabinet 403 -> access denied, no mock private fallback;
- mobile 390px no overflow;
- dark theme readable;
- no console errors;
- no changes to `js/app.js`.

## 13. AUTH-009A decision

This document is enough to build:

- a small mock API server;
- frontend adapter tests;
- backend read-only slice tests.

Next recommended task:

```text
AUTH-010: frontend adapter implementation skeleton
```

Only do `AUTH-009` real backend implementation after owner/dev team confirms stack decisions from `AUTH-008`.
