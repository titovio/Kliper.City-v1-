# AUTH-008: backend stack decision checklist

Дата: 2026-07-07.

Статус: decision checklist. Backend-код не реализован.

## Цель

Зафиксировать решения, которые нужны перед началом реальной backend/auth реализации Kliper.City v1.

Документ продолжает:

- `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md`;
- `AUTH_005_BACKEND_IMPLEMENTATION_BRIEF.md`;
- `AUTH_006_STORAGE_SCHEMA_PLAN.md`;
- `AUTH_007_FRONTEND_API_ADAPTER_PLAN.md`.

## 1. Что нужно решить до backend-кода

Нельзя начинать backend реализацию, пока не выбраны:

- backend stack;
- database;
- hosting/dev environment;
- auth/session strategy;
- phone/email provider;
- config/secrets strategy;
- seed/import strategy;
- API base URL strategy для frontend adapter;
- порядок dev/staging/prod.

## 2. Рекомендуемый путь для Kliper.City

Для первого v1 backend-среза рекомендован консервативный путь:

```text
Node.js backend + PostgreSQL + httpOnly cookie sessions + read-only company/billing API first
```

Почему:

- проект уже frontend/static/JS;
- будущий adapter описан через fetch;
- schema из `AUTH-006` relational-friendly;
- кабинет компании и тарифы требуют связей, ролей и индексов;
- PostgreSQL хорошо подходит для users/companies/billing/social;
- httpOnly cookie снижает риск хранения токенов в localStorage.

Это рекомендация, не финальное решение владельца.

## 3. Backend stack options

| Option | Плюсы | Минусы | Рекомендация |
|---|---|---|---|
| Node.js + Fastify/Express | близко к текущему JS, быстрый старт, просто для REST | нужна дисциплина структуры | recommended |
| Node.js + NestJS | строгая архитектура, DI, модули | тяжелее для первого среза | later/if team wants enterprise |
| Python + FastAPI | быстрый API, хорошая документация | другой стек относительно frontend | viable |
| Supabase | быстро: DB/Auth/Storage | vendor lock-in, auth/business rules нужно аккуратно | viable for MVP |
| Firebase | быстрый auth/realtime | relational billing/company модели неудобнее | not preferred |
| Headless CMS | быстро для контента | слабее для auth/company/billing/social | not for core |

Decision needed:

```text
Выбрать backend stack: Node/Fastify, Node/Nest, FastAPI, Supabase, другое.
```

## 4. Database decision

Recommended:

```text
PostgreSQL
```

Reasons:

- relational schema уже описана;
- нужны joins: users -> company_members -> companies -> subscriptions;
- нужны unique/index constraints;
- future billing and moderation лучше держать в relational DB;
- можно масштабировать от local dev до managed DB.

Alternatives:

| DB | Use case | Risk |
|---|---|---|
| SQLite | local dev/prototype | миграция в prod позже |
| MySQL | можно, если команда привыкла | чуть меньше гибкости JSON/index patterns |
| Firestore | быстрые документы | сложнее company/billing relations |
| Supabase Postgres | Postgres + managed auth/storage | нужно принять vendor |

Decision needed:

```text
PostgreSQL сразу или SQLite dev-first с переходом на Postgres?
```

## 5. ORM / query layer

Options:

| Option | Плюсы | Минусы | Recommendation |
|---|---|---|---|
| Prisma | понятная schema, migrations, JS/TS-friendly | иногда сложен для тонкого SQL | recommended if Node |
| Drizzle | легкий, SQL-like, typed | больше ручной дисциплины | viable |
| Knex | mature query builder | меньше typed DX | viable |
| Raw SQL | максимум контроля | выше риск хаоса | not first choice |
| SQLAlchemy | strong Python option | если выбран FastAPI | recommended if Python |

Recommended for Node:

```text
Prisma or Drizzle
```

Decision needed:

```text
Prisma vs Drizzle vs другой query layer.
```

## 6. Auth/session strategy

Recommended:

```text
Server session + httpOnly secure cookie
```

Rules:

- no access token in localStorage;
- frontend reads auth state via `GET /me`;
- backend enforces company membership;
- cookie `SameSite=Lax` or stricter depending deployment;
- CSRF strategy required before mutating endpoints.

Options:

| Strategy | Плюсы | Минусы | Recommendation |
|---|---|---|---|
| httpOnly cookie session | безопаснее для SPA/static frontend | нужен CORS/cookie setup | recommended |
| JWT in memory | не localStorage, гибко | refresh/session сложнее | viable |
| JWT in localStorage | просто | XSS risk | avoid |
| Supabase/Auth provider sessions | быстро | vendor-specific | viable if Supabase |

Decision needed:

```text
httpOnly cookie session или managed auth provider.
```

## 7. Login provider

Owner previously said backend/auth needed for users and developers.

Options:

| Provider | Use |
|---|---|
| Phone OTP | Russian real estate users, quick login |
| Email OTP | companies/managers, safer for workspace |
| Phone + Email | most flexible |
| Password | more familiar for company cabinet, more support burden |
| Telegram login | possible future channel |

Recommended first:

```text
Email OTP for company members + phone/email for users later
```

Reason:

- company owners/managers often work from email;
- phone OTP provider can be selected later;
- first read-only backend can test auth without SMS cost.

Decision needed:

```text
First auth method: email OTP, phone OTP, both, or temporary dev login.
```

## 8. Hosting and environments

Minimum environments:

| Env | Purpose |
|---|---|
| local | developer testing |
| staging | owner/QA acceptance |
| production | real users |

Recommended order:

1. Local backend with local/staging DB.
2. Staging deployment.
3. Frontend adapter points to staging only behind feature flag.
4. Production after auth/security review.

Hosting options:

| Option | Good for |
|---|---|
| Render/Fly/Railway | simple Node/FastAPI deployment |
| VPS | control, more DevOps |
| Supabase + edge/API | if using Supabase stack |
| Cloud provider | later scale |

Decision needed:

```text
Where to host staging backend?
```

## 9. Config and secrets

Backend secrets:

- DB URL;
- session secret;
- auth provider keys;
- CORS allowed origins;
- future payment provider keys;
- future storage keys.

Rules:

- no secrets in repo;
- `.env.example` allowed;
- local `.env` ignored;
- production secrets stored in hosting provider.

Frontend config:

- no secrets;
- only public API base URL and feature flags.

Future file allowed:

```text
js/api/kliper-api-config.js
```

It must not contain private keys.

## 10. API versioning

Recommended base:

```text
/api/v1
```

Examples:

```text
GET /api/v1/me
GET /api/v1/billing/plans
GET /api/v1/companies/:companyId/cabinet
```

Reason:

- allows future breaking changes;
- keeps static frontend route hash separate from backend API routes.

Decision needed:

```text
Use /api/v1 from first backend slice.
```

## 11. CORS / cookies

If frontend and backend are on different origins:

- configure CORS allowlist;
- `credentials: include` in fetch;
- `Access-Control-Allow-Credentials: true`;
- cookie SameSite/secure settings must match hosting.

Adapter rule:

```js
fetch(url, { credentials: 'include' })
```

only if cookie sessions selected.

Decision needed:

```text
Same origin deployment or cross-origin frontend/backend?
```

## 12. Seed/import decision

Dev seed sources:

- `js/data/developers.js`;
- `js/data/buildings.js`;
- `js/data/business-spaces.js`;
- `js/data/company-cabinet.js`;
- `js/data/company-pricing.js`.

Recommended:

- create seed script that imports current JS data into backend dev DB;
- mark imported rows with `source = seed`;
- preserve `developer_slug`;
- preserve `legacy_source` and `legacy_source_id`;
- do not treat seed as production truth.

Decision needed:

```text
Seed script format: Node script, backend CLI command, SQL seed, or manual import.
```

## 13. First backend code scope

Only after decisions above, first code scope should be:

```text
AUTH-009: backend read-only slice implementation
```

Allowed endpoints:

```text
GET /api/v1/health
GET /api/v1/me
GET /api/v1/billing/plans
GET /api/v1/companies/:companyId/cabinet
GET /api/v1/companies/:companyId/subscription
GET /api/v1/me/migration-preview
```

Allowed DB:

- tables from `AUTH-006`;
- seed/import only.

Not allowed:

- payment;
- document upload;
- CRM mutations;
- post/story mutations;
- review replies;
- admin panel.

## 14. Security checklist before implementation

Must decide:

- session storage;
- cookie security flags;
- CSRF approach before mutations;
- rate limits for auth;
- brute-force protection for OTP;
- CORS origins;
- audit logging for admin/company access later;
- no private data in public endpoints.

## 15. QA checklist for stack decision

Before backend coding, confirm:

- selected stack documented;
- DB selected;
- ORM/query layer selected;
- auth/session selected;
- local run command known;
- staging hosting known;
- seed strategy known;
- API base URL strategy known;
- frontend adapter remains disabled by default;
- rollback path exists.

## 16. Recommended decision template

Use this exact format when owner/dev team confirms stack:

```text
Backend stack: ...
Database: ...
ORM/query layer: ...
Auth method: ...
Session strategy: ...
Hosting local/staging: ...
API base path: /api/v1
Frontend API config source: ...
Seed strategy: ...
First implementation task: AUTH-009
```

## 17. Open questions for owner/dev team

1. Есть ли предпочтение по backend stack: Node, Python, Supabase, другое?
2. Нужен ли быстрый managed backend или свой backend?
3. Первый вход делать по email, телефону или временно dev-login?
4. Где будет staging backend?
5. Нужна ли production-ready оплата в v1 или позже?
6. Кто будет владельцем backend-кода: отдельный backend-чат или текущий Architect/Main?

## 18. AUTH-008 decision

Do not write backend code before this checklist is accepted.

Next recommended task after owner/dev decisions:

```text
AUTH-009: backend read-only slice implementation
```

If owner wants one more planning step before code:

```text
AUTH-009A: API mock server contract and sample responses
```
