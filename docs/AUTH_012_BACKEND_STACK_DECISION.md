# AUTH-012: backend stack final decision

Дата: 2026-07-07.

Статус: decision accepted. Backend-код не реализован в этом шаге.

## Цель

Закрыть развилку по backend stack для Kliper.City, чтобы следующие задачи могли проектировать и писать реальный read-only backend slice без повторного выбора технологий.

Решение продолжает:

- `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md`;
- `AUTH_005_BACKEND_IMPLEMENTATION_BRIEF.md`;
- `AUTH_006_STORAGE_SCHEMA_PLAN.md`;
- `AUTH_007_FRONTEND_API_ADAPTER_PLAN.md`;
- `AUTH_008_BACKEND_STACK_DECISION_CHECKLIST.md`;
- `AUTH_009A_API_MOCK_SERVER_CONTRACT.md`;
- `AUTH_010_FRONTEND_API_ADAPTER_SKELETON.md`;
- `AUTH_011_ADAPTER_ACCEPTANCE_AND_DEV_TOGGLE.md`.

## 1. Final decision

Backend stack:

```text
Node.js + Fastify
```

Database:

```text
PostgreSQL
```

ORM/query layer:

```text
Prisma
```

Session strategy:

```text
Server-side sessions + httpOnly secure cookie
```

API base path:

```text
/api/v1
```

Frontend integration:

```text
Current static frontend -> js/api adapter -> backend
```

Default frontend behavior:

```text
API disabled by default; enabled only through explicit config/dev toggle.
```

## 2. Why this stack

Node.js + Fastify:

- близко к текущему frontend JS-проекту;
- быстрее стартовать, чем тяжелый framework;
- достаточно строгий для REST API, если держать модульную структуру;
- хорошо подходит под текущий `fetch` adapter.

PostgreSQL:

- схема из `AUTH-006` relational-friendly;
- нужны связи users -> company_members -> companies -> subscriptions;
- нужны индексы, уникальные ограничения, future billing/social/moderation;
- проще масштабировать от local/staging к production.

Prisma:

- понятная schema и migrations;
- удобно seed/import из текущих JS data-файлов;
- достаточно хороший DX для backend-чата и будущих менеджеров проекта;
- снижает риск хаотичного raw SQL на первом этапе.

httpOnly cookie sessions:

- permissions не живут в localStorage;
- frontend читает состояние через `GET /me`;
- backend enforcement для company cabinet;
- безопаснее для SPA/static frontend, чем JWT в localStorage.

## 3. Auth method decision

Первый backend/auth этап:

```text
Temporary dev login + email-based company member identity.
```

Что это значит:

- для dev/staging можно создать демо-пользователя `Мария`;
- company membership seeded для тестовых компаний;
- `GET /me` возвращает пользователя и доступные компании;
- реальный phone OTP/SMS не подключается в первом read-only slice.

Следующий auth layer:

```text
Email OTP for company members.
Phone/email login for users after v1 backend read-only slice.
```

Причина:

- компании и застройщики чаще работают через email;
- SMS-провайдер и расходы лучше выбирать позже;
- первый backend-срез должен проверить identity/permissions/API, а не провайдера OTP.

## 4. Environment decision

Local:

```text
Node.js Fastify backend + local PostgreSQL
```

Staging:

```text
Managed PostgreSQL + simple Node hosting
```

Recommended staging hosting candidates:

- Render;
- Railway;
- Fly.io;
- VPS later, если понадобится полный контроль.

Production:

```text
После security/auth acceptance и staging QA.
```

## 5. Repo structure decision

Не смешивать backend с legacy `js/app.js`.

Рекомендуемая структура будущего backend:

```text
backend/
  package.json
  prisma/
    schema.prisma
    seed.ts
  src/
    server.ts
    config/
    modules/
      health/
      auth/
      users/
      companies/
      billing/
      migration/
    shared/
  .env.example
```

Для текущего статического сайта:

```text
index.html
js/api/*
```

остается отдельным frontend adapter layer.

## 6. First backend slice scope

Первый реальный backend slice должен быть read-only/read-heavy.

Allowed endpoints:

```text
GET /api/v1/health
GET /api/v1/me
GET /api/v1/billing/plans
GET /api/v1/companies/:companyId/subscription
GET /api/v1/companies/:companyId/cabinet
GET /api/v1/me/migration-preview
```

Allowed data:

- users;
- user_profiles;
- sessions;
- companies;
- company_members;
- objects;
- company_objects;
- billing_plans;
- company_subscriptions;
- migration_snapshots;
- read-only seeded documents/posts/stories/dialogs/offers.

Not allowed in first slice:

- payment provider;
- plan changes;
- document upload;
- company posts/stories mutations;
- CRM messages;
- review replies;
- admin panel;
- production user import.

## 7. Seed/import strategy

Seed source:

- `js/data/site-config.js`;
- `js/data/developers.js`;
- `js/data/buildings.js`;
- `js/data/business-spaces.js`;
- `js/data/company-cabinet.js`;
- `js/data/company-pricing.js`.

Rules:

- preserve `developer.slug` as `companies.developer_slug`;
- preserve legacy numeric ids as `legacy_source_id`;
- mark rows with `source = seed`;
- seed default user `Мария`;
- seed company membership for demo company owner/manager;
- seed billing plans from `company-pricing.js`;
- seed object links from `buildings.js` and `business-spaces.js`.

Production import:

```text
Separate later task, not part of first backend slice.
```

## 8. Security rules

Required before mutating endpoints:

- CSRF protection;
- rate limits for auth challenges;
- session revocation;
- audit logs for company/admin access;
- CORS allowlist;
- secure cookie flags for staging/prod;
- no tokens in localStorage.

First read-only slice still must enforce:

- `GET /me` from server session;
- company cabinet membership check;
- `403 company_access_denied` for wrong company;
- no silent private mock fallback for `401/403`.

## 9. Frontend adapter rules

Keep:

- `KLIPER_API_CONFIG.enabled === false` by default;
- `KLIPER_FEATURES.apiAdapter === false` by default;
- dev toggle only through explicit URL params;
- mock fallback for backend unavailable;
- no fallback for unauthorized/access denied/not found private cabinet.

When backend exists:

```text
?kliperApi=1&kliperApiBase=http://127.0.0.1:<backend-port>/api/v1
```

or staging config can enable adapter only for QA links.

## 10. Implementation order after AUTH-012

Recommended next tasks:

1. `AUTH-013`: backend scaffold plan and file boundary.
2. `AUTH-014`: Prisma schema draft from `AUTH-006`.
3. `AUTH-015`: seed/import script plan.
4. `AUTH-016`: read-only Fastify endpoints.
5. `AUTH-017`: frontend adapter QA against real backend.
6. `AUTH-018`: auth/session hardening before any mutation.

## 11. Acceptance criteria

`AUTH-012` считается принятым, если:

- stack decision documented;
- database decision documented;
- ORM decision documented;
- session strategy documented;
- first endpoints documented;
- seed/import rules documented;
- frontend adapter default remains disabled;
- next implementation tasks have clear order.

## 12. Decision summary

```text
Backend stack: Node.js + Fastify
Database: PostgreSQL
ORM/query layer: Prisma
Auth method: temporary dev login first, email OTP later for company members
Session strategy: server-side sessions + httpOnly secure cookie
Hosting local/staging: local PostgreSQL + simple Node hosting candidate
API base path: /api/v1
Frontend API config source: js/api adapter, disabled by default
Seed strategy: Prisma seed from current js/data files
First implementation task: AUTH-013 backend scaffold plan and boundary
```
