# AUTH-011: adapter acceptance and dev toggle

Дата: 2026-07-07.

Статус: implemented.

## Цель

Принять skeleton frontend API adapter из `AUTH-010` и добавить безопасный способ проверять будущий backend/mock server без изменения обычного поведения сайта.

## Что добавлено

Файлы:

```text
js/api/kliper-api-dev-toggle.js
tools/kliper-api-mock-server.mjs
```

`index.html` подключает `kliper-api-dev-toggle.js` перед `kliper-api-config.js`.

## Default behavior

Обычный сайт:

```text
http://127.0.0.1:8765/index.html
```

или любой URL без `kliperApi=1`:

- не включает API adapter;
- не делает backend requests;
- использует текущие `window.KLIPER_*` data-файлы;
- кабинет и тарифы остаются в `data-api-source="mock"`.

## Dev toggle

API включается только вручную через URL:

```text
http://127.0.0.1:8765/index.html?kliperApi=1&kliperApiBase=http://127.0.0.1:4000/api/v1#company-cabinet=gk-paritet-development
```

Optional:

```text
&kliperApiTimeout=3500
&kliperApiDebug=1
```

Правила:

- `kliperApi=1` без `kliperApiBase` ничего не включает;
- dev-toggle не пишет в localStorage;
- после удаления query-параметров сайт возвращается в обычный mock/local режим;
- `401`, `403`, `company_not_found` не fallback-ятся в приватный success.

## Mock server

Запуск:

```bash
node tools/kliper-api-mock-server.mjs
```

По умолчанию:

```text
http://127.0.0.1:4000/api/v1
```

Можно поменять порт:

```bash
KLIPER_MOCK_API_PORT=4010 node tools/kliper-api-mock-server.mjs
```

Endpoints:

- `GET /api/v1/health`;
- `GET /api/v1/me`;
- `GET /api/v1/billing/plans`;
- `GET /api/v1/companies/:companyId/subscription`;
- `GET /api/v1/companies/:companyId/cabinet`;
- `GET /api/v1/me/migration-preview`.

Mock server читает текущие data-файлы:

- `js/data/developers.js`;
- `js/data/buildings.js`;
- `js/data/company-cabinet.js`;
- `js/data/company-pricing.js`.

## Acceptance

Проверено:

- `node --check` для adapter/dev-toggle/mock-server JS;
- default mode не включает API;
- cabinet route открывается с `data-api-source="mock"`;
- pricing route открывается с `data-api-source="mock"`;
- при включенном dev URL cabinet/pricing обновляют `data-api-source` по async adapter response;
- mock server стартует и отдает `/api/v1/health`;
- dev URL с `kliperApi=1&kliperApiBase=...` включает API client без изменения обычного default URL.

## Не сделано

- настоящий backend;
- auth/session cookies;
- login/logout UI;
- реальные billing/mutations;
- замена текущего mock-render в кабинете на полноценные async states.

## Следующий шаг

`AUTH-012`: backend stack final decision and real read-only backend slice.

До `AUTH-012` нельзя начинать реальные login/session/backend migrations без выбора:

- backend framework;
- DB;
- session/cookie strategy;
- deploy target;
- seed/import process.
