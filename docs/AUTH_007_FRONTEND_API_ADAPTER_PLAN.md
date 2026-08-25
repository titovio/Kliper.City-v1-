# AUTH-007: frontend API adapter with mock fallback

Дата: 2026-07-07.

Статус: integration plan. Код adapter не реализован.

## Цель

Описать, как текущий статический frontend Kliper.City будет подключаться к будущему backend/auth слою, сохраняя текущий mock/local режим, если backend недоступен.

Главный принцип:

- backend можно подключать постепенно;
- `js/app.js` не трогать;
- текущие data-файлы и UI-модули остаются fallback;
- permissions не брать из localStorage;
- пользователь не должен видеть сломанный сайт, если backend выключен.

Связанные документы:

- `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md`;
- `AUTH_005_BACKEND_IMPLEMENTATION_BRIEF.md`;
- `AUTH_006_STORAGE_SCHEMA_PLAN.md`;
- `CAB_005_COMPANY_CABINET_V1_ACCEPTANCE.md`.

## 1. Что решает adapter

Adapter должен стать тонким слоем между UI-модулями и backend:

```text
UI module -> API adapter -> backend
                  |
                  -> mock fallback
```

Первый frontend integration scope:

- `GET /me`;
- `GET /billing/plans`;
- `GET /companies/:companyId/subscription`;
- `GET /companies/:companyId/cabinet`;
- `GET /me/migration-preview`.

Не включать в первый adapter-срез:

- оплату;
- отправку документов;
- публикации;
- stories mutations;
- ответы на рецензии;
- CRM messages;
- предложения подписчикам.

## 2. Будущие файлы

Создавать только на этапе реализации, не сейчас.

Рекомендуемые файлы:

```text
js/api/kliper-api-config.js
js/api/kliper-api-client.js
js/api/kliper-api-mock-fallback.js
js/pages/company-cabinet/company-cabinet-api-adapter.js
js/pages/pricing/business-pricing-api-adapter.js
js/behavior/auth-state.js
```

Запрещено для первого adapter-среза:

```text
js/app.js
```

## 3. Config

Backend URL должен задаваться отдельно от логики.

Варианты для dev/staging:

```js
window.KLIPER_API_CONFIG = {
  enabled: false,
  baseUrl: '',
  timeoutMs: 3500,
  fallbackMode: 'mock'
};
```

Правила:

- если `enabled === false`, adapter сразу использует mock fallback;
- если `baseUrl` пустой, adapter использует mock fallback;
- если backend не отвечает за `timeoutMs`, adapter использует mock fallback;
- если backend возвращает 401/403, adapter не должен превращать это в mock success для приватного кабинета.

Важно:

- network/backend errors можно fallback-ить;
- auth/permission denied нельзя молча fallback-ить как доступ.

## 4. Result shape

Все методы adapter должны возвращать единый shape:

```js
{
  ok: true,
  source: 'api',
  data: {}
}
```

или:

```js
{
  ok: true,
  source: 'mock',
  data: {},
  warning: 'backend_unavailable'
}
```

или:

```js
{
  ok: false,
  source: 'api',
  error: {
    code: 'company_access_denied',
    message: 'Нет доступа к кабинету этой компании'
  }
}
```

Allowed `source`:

| Source | Meaning |
|---|---|
| `api` | данные пришли с backend |
| `mock` | данные пришли из текущих JS data-файлов |
| `local` | данные пришли из localStorage cache |

## 5. Error handling

| Error | Fallback? | UI |
|---|---|---|
| `backend_unavailable` | yes | работаем в демо-режиме |
| `request_timeout` | yes | работаем в демо-режиме |
| `billing_unavailable` | partial | тарифы временно недоступны или mock tariffs |
| `unauthorized` | no | войдите, чтобы продолжить |
| `company_access_denied` | no | нет доступа к этой компании |
| `company_not_found` | no | компания не найдена |
| `not_implemented` | no | действие будет подключено позже |

Критическое правило:

```text
403/permission denied не должен превращаться в mock cabinet success.
```

Иначе пользователь без прав увидит приватный кабинет через fallback.

## 6. API client contract

Будущий `kliper-api-client.js`:

```js
window.KLIPER_API = {
  isEnabled: function () {},
  request: function (path, options) {},
  getMe: function () {},
  getBillingPlans: function () {},
  getCompanySubscription: function (companyId) {},
  getCompanyCabinet: function (companyIdOrSlug) {},
  getMigrationPreview: function () {}
};
```

Rules:

- использовать `fetch`;
- timeout через `AbortController`;
- credentials strategy определить отдельно;
- не хранить secret/token в localStorage;
- не делать global retry loops;
- логировать status только в dev/debug mode.

## 7. Mock fallback contract

Будущий `kliper-api-mock-fallback.js` должен использовать текущие источники:

| Adapter method | Mock source |
|---|---|
| `getMe` | `site-config.js` default user + optional local profile |
| `getBillingPlans` | `window.KLIPER_COMPANY_PRICING.plans` |
| `getCompanySubscription` | `window.KLIPER_COMPANY_PRICING.companyPlans/defaultPlan` |
| `getCompanyCabinet` | `window.KLIPER_DEVELOPERS`, `window.KLIPER_BUILDINGS`, `window.KLIPER_COMPANY_CABINET`, `window.KLIPER_COMPANY_PRICING` |
| `getMigrationPreview` | localStorage keys count/match only |

LocalStorage keys:

```text
kliper-liked-cards
kliper-subscribed-cards
kliper-subscribed-districts
kliper-card-reviews
```

Mock fallback must not claim real permissions.

## 8. Company cabinet adapter

Current route:

```text
#company-cabinet=developerSlug
```

Future data flow:

```text
route slug
-> company-cabinet-api-adapter
-> KLIPER_API.getCompanyCabinet(slug)
-> api success: render API data
-> backend unavailable: render current mock data + optional demo notice
-> unauthorized/access denied: render access state
```

Recommended UI states:

| State | Meaning |
|---|---|
| `loading` | backend request in progress |
| `api-ready` | cabinet data from backend |
| `mock-ready` | cabinet data from fallback |
| `unauthorized` | user must login |
| `access-denied` | user has no company rights |
| `backend-unavailable` | fallback active |

Do not block rendering forever. If request times out, fallback.

## 9. Pricing adapter

Current route:

```text
#business-pricing
#business-pricing=developerSlug
```

Future data flow:

```text
route
-> business-pricing-api-adapter
-> KLIPER_API.getBillingPlans()
-> api success: render API plans
-> backend unavailable: render KLIPER_COMPANY_PRICING plans
```

Plan buttons:

- before payment provider: still show `После подключения оплаты`;
- after payment provider: route/action must be separate task.

## 10. Auth state layer

Будущий `auth-state.js` должен хранить только UI-safe state:

```js
window.KLIPER_AUTH_STATE = {
  status: 'unknown',
  user: null,
  companies: [],
  activeCompanyId: null
};
```

Allowed statuses:

```text
unknown
loading
anonymous
authenticated
error
```

Forbidden:

- storing auth token in localStorage;
- using localStorage as permission source;
- letting frontend invent company role.

## 11. Feature flags

Temporary flags:

```js
window.KLIPER_FEATURES = {
  apiAdapter: false,
  companyCabinetApi: false,
  pricingApi: false,
  migrationPreview: false
};
```

Rules:

- flags default to false;
- enabling API must be reversible;
- one feature can be tested without enabling all backend integration.

## 12. Loading and fallback UX

Recommended copy:

| State | Copy |
|---|---|
| `loading` | Загружаем данные компании |
| `backend-unavailable` | Сейчас открыт демо-режим кабинета |
| `unauthorized` | Войдите, чтобы открыть кабинет компании |
| `access-denied` | У вас нет доступа к этой компании |
| `billing_unavailable` | Тарифы временно недоступны |

Avoid:

- scary technical errors;
- exposing stack traces;
- saying “оплачено” from mock data;
- making mock fallback look like verified backend.

## 13. Integration order

Recommended implementation order:

1. Add `kliper-api-config.js` with API disabled.
2. Add `kliper-api-client.js` with no active routes.
3. Add `kliper-api-mock-fallback.js`.
4. Add `auth-state.js` with anonymous/default state.
5. Connect pricing page read-only to adapter.
6. Connect company cabinet read-only to adapter.
7. Add migration preview read-only.
8. Add access denied/unauthorized visual states.
9. Run regression desktop/mobile/dark.

Why pricing first:

- pricing is simpler than cabinet;
- no private data if backend fails;
- easier to test plans API vs mock fallback.

## 14. Tests

Minimum tests for adapter implementation:

### API disabled

- `enabled: false`;
- pricing renders mock plans;
- cabinet renders mock data;
- no console errors;
- no fetch attempt required.

### API unavailable

- `enabled: true`, wrong `baseUrl`;
- pricing fallback works;
- cabinet fallback works only for backend unavailable;
- UI can show demo/fallback notice;
- no infinite loading.

### API success

- `GET /billing/plans` returns plans;
- pricing renders API plans;
- `GET /companies/:id/cabinet` returns cabinet;
- cabinet renders API data.

### Unauthorized

- backend returns 401;
- cabinet shows login state;
- does not fallback to mock private cabinet.

### Access denied

- backend returns 403;
- cabinet shows access denied;
- does not fallback to mock private cabinet.

### Mobile/dark

- same scenarios on mobile 390px;
- no horizontal overflow;
- dark theme readable.

## 15. Files allowed in future implementation

Allowed:

```text
js/api/*
js/behavior/auth-state.js
js/pages/company-cabinet/company-cabinet-api-adapter.js
js/pages/pricing/business-pricing-api-adapter.js
css/company-cabinet.css
css/business-pricing.css
index.html
```

Allowed only if needed:

```text
docs/*
```

Forbidden for adapter implementation:

```text
js/app.js
```

## 16. Regression checklist

After adapter implementation:

- main catalog loads;
- developer catalog loads;
- newbuild catalog loads;
- ready ЖК loads;
- business catalog loads;
- stories still work;
- company cabinet route works;
- pricing route works;
- profile route still works;
- dark theme works;
- mobile 390px overflow is 0;
- console has no new errors;
- API disabled mode still works.

## 17. Open decisions

Before implementation:

- backend URL source: inline config, JSON config, server-injected config;
- credentials: httpOnly cookie vs bearer token;
- exact CORS policy;
- timeout value;
- whether fallback notice should be visible or only debug;
- whether API adapter belongs to global `window.KLIPER_API` or module-style namespace.

## 18. AUTH-007 decision

First adapter implementation should be read-only and reversible.

Do not connect mutating actions until:

- auth/session is stable;
- company membership is enforced by backend;
- access denied state is tested;
- mock fallback is verified;
- owner approves the first real backend connection.

Next recommended task:

```text
AUTH-008: backend stack decision checklist
```

Purpose: choose backend stack, DB, auth/session strategy and hosting path before writing backend code.
