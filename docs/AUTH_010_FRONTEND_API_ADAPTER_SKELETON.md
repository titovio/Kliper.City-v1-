# AUTH-010: frontend API adapter skeleton

Дата: 2026-07-07.

Статус: implemented skeleton. Adapter подключен, но выключен по умолчанию.

## Цель

Добавить первый frontend API слой для Kliper.City без реального backend и без изменения текущего поведения сайта.

Скелет нужен, чтобы:

- будущий backend/auth подключался через единый слой;
- кабинет компании и страница тарифов уже имели adapter hooks;
- текущие `window.KLIPER_*` data-файлы оставались fallback;
- `js/app.js` не редактировался;
- сайт не делал сетевые запросы, пока API явно не включен.

## Реализованные файлы

```text
js/api/kliper-api-config.js
js/api/kliper-api-client.js
js/api/kliper-api-mock-fallback.js
js/behavior/auth-state.js
js/pages/company-cabinet/company-cabinet-api-adapter.js
js/pages/pricing/business-pricing-api-adapter.js
```

Подключение добавлено в `index.html` перед page-модулями кабинета и тарифов.

## Config

По умолчанию:

```js
window.KLIPER_API_CONFIG = {
  enabled: false,
  baseUrl: '',
  timeoutMs: 3500,
  fallbackMode: 'mock',
  debug: false
};
```

Feature flags:

```js
window.KLIPER_FEATURES = {
  apiAdapter: false,
  companyCabinetApi: false,
  pricingApi: false,
  migrationPreview: false
};
```

Пока `enabled !== true`, `apiAdapter !== true` или `baseUrl` пустой, frontend работает от mock/local data и не обращается в сеть.

## Adapter methods

`window.KLIPER_API`:

- `getMe()`;
- `getBillingPlans()`;
- `getCompanySubscription(companyId)`;
- `getCompanyCabinet(companyId)`;
- `getMigrationPreview()`;
- `request(path, options)`;
- `isEnabled()`.

`window.KLIPER_API_MOCK`:

- собирает billing plans из `window.KLIPER_COMPANY_PRICING`;
- собирает company cabinet из `window.KLIPER_DEVELOPERS`, `window.KLIPER_BUILDINGS`, `window.KLIPER_COMPANY_CABINET`;
- собирает migration preview из localStorage;
- не хранит permissions как источник правды.

## Интеграция с текущим UI

Кабинет компании:

- `js/pages/company-cabinet/company-cabinet-page.js` читает `KLIPER_COMPANY_CABINET_ADAPTER.getCabinetSnapshot()`;
- текущий HTML и данные остаются прежними;
- в корневой `main` добавлен `data-api-source="mock"`.

Тарифы:

- `js/pages/pricing/business-pricing-page.js` читает `KLIPER_BUSINESS_PRICING_ADAPTER.getPricingSnapshot()`;
- текущая сетка тарифов остается прежней;
- в корневой `main` добавлен `data-api-source="mock"`.

## Правила fallback

Можно fallback-ить в mock:

- backend unavailable;
- timeout;
- invalid JSON;
- выключенный adapter.

Нельзя silently fallback-ить в приватный mock cabinet:

- `401 unauthorized`;
- `403 company_access_denied`;
- `404 company_not_found`.

Эти правила уже заложены в `kliper-api-client.js`.

## Что не сделано в AUTH-010

- реальный backend;
- login/logout UI;
- оплата;
- mutations для документов, stories, публикаций, reviews, dialogs, offers;
- полноценные loading/error states в UI;
- миграция localStorage в backend.

## Следующий шаг

`AUTH-011`: acceptance QA для adapter skeleton и подготовка mock server/dev toggle.

Статус после продолжения: выполнено в `AUTH_011_ADAPTER_ACCEPTANCE_AND_DEV_TOGGLE.md`.

Проверить:

- adapter disabled mode не делает network requests;
- кабинет и тарифы отображаются как до adapter;
- `data-api-source="mock"` есть на cabinet/pricing route;
- mock fallback возвращает shape из `AUTH_009A_API_MOCK_SERVER_CONTRACT.md`;
- `401/403/404` не превращаются в успешный приватный кабинет.
