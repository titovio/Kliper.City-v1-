# AUTH-013: backend scaffold plan and file boundary

Дата: 2026-07-07.

Статус: scaffold plan. Backend-код, `backend/`, зависимости, Prisma schema и миграции не созданы.

## Цель

Подготовить границы будущего backend scaffold для первого read-only/read-heavy backend/auth среза Kliper.City.

Документ нужен, чтобы следующий backend-чат мог создать `backend/` без затрагивания текущего статического сайта, visual/CSS, stories, filters, cards и legacy bundle `js/app.js`.

Продолжает:

- `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md`;
- `AUTH_005_BACKEND_IMPLEMENTATION_BRIEF.md`;
- `AUTH_006_STORAGE_SCHEMA_PLAN.md`;
- `AUTH_009A_API_MOCK_SERVER_CONTRACT.md`;
- `AUTH_010_FRONTEND_API_ADAPTER_SKELETON.md`;
- `AUTH_011_ADAPTER_ACCEPTANCE_AND_DEV_TOGGLE.md`;
- `AUTH_012_BACKEND_STACK_DECISION.md`.

## 1. Scope AUTH-013

AUTH-013 разрешает только планирование.

Не делать в этой задаче:

- не устанавливать зависимости;
- не запускать `npm install`;
- не создавать `backend/`;
- не создавать Prisma schema;
- не писать Fastify routes;
- не менять frontend adapter;
- не менять `index.html`;
- не менять `js/app.js`;
- не менять visual/CSS/stories/filters/cards.

Следующий фактический backend-start должен быть отдельной задачей после приемки этого плана Architect / Main.

## 2. Future backend root

Будущий backend должен жить отдельно от текущего static SPA:

```text
backend/
  package.json
  tsconfig.json
  .env.example
  README.md
  prisma/
    schema.prisma
    seed.ts
    migrations/
  src/
    server.ts
    app.ts
    config/
      env.ts
      cors.ts
      cookies.ts
    modules/
      health/
      auth/
      users/
      companies/
      billing/
      migration/
    shared/
      db/
      http/
      errors/
      permissions/
      sessions/
      validation/
      logging/
  tests/
    smoke/
    integration/
```

Правило границы:

```text
backend/ owns backend runtime, DB access, API contracts and tests.
root static site owns current index.html, css/, js/, assets/.
```

Frontend adapter остается в `js/api/*` и подключает backend только через явный dev toggle из `AUTH-011`.

## 3. Package scripts

Будущий `backend/package.json` должен быть автономным, чтобы не добавлять package build в корень проекта.

Рекомендуемые scripts:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "start": "node dist/server.js",
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "lint": "eslint \"src/**/*.ts\" \"tests/**/*.ts\"",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:smoke": "vitest run tests/smoke",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:seed": "prisma db seed",
    "db:reset": "prisma migrate reset",
    "check": "npm run typecheck && npm run test:smoke"
  }
}
```

Dependencies выбираются только на этапе реализации. Для будущего первого среза ожидаемые категории:

- runtime: Fastify, cookie/session helpers, Prisma client;
- dev: TypeScript, tsx, Prisma CLI, Vitest;
- optional later: ESLint, validation library, rate limit, CSRF.

Не добавлять новые зависимости в корень проекта без отдельного решения.

## 4. Prisma folders and schema ownership

Будущий Prisma слой:

```text
backend/prisma/
  schema.prisma
  seed.ts
  migrations/
```

`schema.prisma` должен следовать `AUTH-006` и первому scope:

- users;
- user_profiles;
- auth_challenges;
- sessions;
- companies;
- company_members;
- objects;
- company_objects;
- billing_plans;
- billing_plan_features;
- company_subscriptions;
- likes;
- subscriptions;
- reviews;
- migration_snapshots;
- read-only cabinet tables: company_documents, company_posts, company_stories, company_dialogs, company_offers.

Schema rules:

- новые backend IDs: string UUID/ULID-like IDs;
- legacy slug/id хранить как lookup/source fields;
- `developer_slug` остается natural key только для seed/import and adapter mapping;
- permissions не выводить из localStorage;
- private cabinet data never goes through public endpoints.

`backend/src/shared/db/` должен владеть Prisma client lifecycle:

```text
backend/src/shared/db/prisma.ts
```

Модули не должны создавать свои Prisma clients.

## 5. Module boundaries

Каждый API module должен иметь локальную структуру:

```text
modules/<name>/
  <name>.routes.ts
  <name>.service.ts
  <name>.repo.ts
  <name>.schemas.ts
  <name>.types.ts
```

Граница ответственности:

| Module | Owns | Does not own |
|---|---|---|
| `health` | `/health`, version, readiness | DB schema changes |
| `auth` | dev login/session, logout, session cookie | production OTP provider |
| `users` | `GET /me`, profile assembly | company permission policy internals |
| `companies` | company cabinet read API, objects, read tables | billing plan pricing rules |
| `billing` | plans, subscription, usage read API | payments, invoices, plan changes |
| `migration` | migration preview counts | actual localStorage import |
| `shared/permissions` | permission map and checks | route-specific response assembly |
| `shared/sessions` | session lookup and cookie helpers | user profile business rules |

Route handlers stay thin:

```text
route -> validate -> require session/permission -> service -> repo -> response envelope
```

Response envelope must match `AUTH-009A`:

```json
{
  "ok": true,
  "data": {}
}
```

Errors must match:

```json
{
  "ok": false,
  "error": {
    "code": "company_access_denied",
    "message": "У вас нет доступа к этой компании"
  }
}
```

## 6. API modules for first real slice

First allowed endpoints:

```text
GET /api/v1/health
GET /api/v1/me
GET /api/v1/billing/plans
GET /api/v1/companies/:companyId/subscription
GET /api/v1/companies/:companyId/cabinet
GET /api/v1/me/migration-preview
```

Optional dev-only endpoints for temporary session setup may be added only if clearly isolated:

```text
POST /api/v1/auth/dev-login
POST /api/v1/auth/logout
```

Dev-login rules:

- only local/staging-like env, never production by accident;
- no real OTP claims;
- creates server-side session;
- sets httpOnly cookie;
- returns same shape as future `GET /me` enough for adapter QA.

Do not add first-slice mutations for:

- plan change;
- payment method;
- document upload;
- posts/stories create or update;
- review replies;
- CRM messages;
- offers;
- production user import.

## 7. Env strategy

Future `backend/.env.example` should document only backend env:

```text
NODE_ENV=development
PORT=4000
HOST=127.0.0.1
DATABASE_URL=postgresql://kliper:kliper@127.0.0.1:5432/kliper_city_dev
SESSION_SECRET=change-me-in-local-dev
SESSION_COOKIE_NAME=kliper_session
SESSION_TTL_DAYS=7
CORS_ORIGIN=http://127.0.0.1:8765
API_BASE_PATH=/api/v1
SEED_MODE=dev
DEV_AUTH_ENABLED=true
```

Environment rules:

- `.env` must stay untracked;
- `.env.example` contains no secrets;
- production must set `DEV_AUTH_ENABLED=false`;
- secure cookie flags depend on env;
- CORS allowlist must include only known frontend origins;
- frontend API toggle remains outside backend and still uses URL params from `AUTH-011`.

Cookie strategy:

- server-side session row in DB;
- browser stores only httpOnly cookie;
- no JWT/access token in localStorage;
- session token stored hashed server-side.

## 8. Seed/import plan

Future seed must live in `backend/prisma/seed.ts`.

Dev seed sources:

```text
js/data/site-config.js
js/data/developers.js
js/data/buildings.js
js/data/business-spaces.js
js/data/company-cabinet.js
js/data/company-pricing.js
```

Seed phases:

1. Create billing plans and plan features from `company-pricing.js`.
2. Create demo user `Мария`.
3. Create companies from `developers.js`.
4. Create objects from `buildings.js` and `business-spaces.js`.
5. Link buildings to companies through developer name/slug mapping.
6. Create company subscriptions from pricing defaults/company overrides.
7. Create demo memberships for target companies.
8. Seed read-only cabinet tables from `company-cabinet.js`.
9. Create at least one denied-access company for QA.

Seed safety:

- seed rows marked with `source = seed` where applicable;
- seed should be idempotent for local dev;
- staging seed must include roles owner/manager/editor/viewer;
- production import is not part of first slice.

Import scripts must not mutate frontend data files.

## 9. Smoke and tests

Minimum future test layout:

```text
backend/tests/smoke/
  health.test.ts
  me.test.ts
  billing-plans.test.ts
  company-cabinet-access.test.ts
  migration-preview.test.ts
backend/tests/integration/
  sessions.test.ts
  permissions.test.ts
  seed-shape.test.ts
```

Smoke matrix:

| Scenario | Expected |
|---|---|
| `GET /health` | 200 ok |
| `GET /me` without session | 401 `unauthorized` |
| `GET /me` with session | user/profile/companies |
| owner cabinet access | 200 cabinet data |
| manager/viewer cabinet access | 200 with role-specific permissions |
| wrong company access | 403 `company_access_denied` |
| unknown company | 404 `company_not_found` |
| billing plans | shape compatible with adapter |
| subscription access denied | 403 |
| migration preview | counts only, no import |

Before frontend QA against real backend:

1. Run backend `npm run check`.
2. Start backend on `127.0.0.1:4000`.
3. Open current static site with explicit dev toggle:

```text
?kliperApi=1&kliperApiBase=http://127.0.0.1:4000/api/v1
```

4. Verify cabinet/pricing `data-api-source` changes only when API succeeds.
5. Verify 401/403/404 do not silently render private mock cabinet.

## 10. Frontend adapter integration risks

Main risks at the boundary:

| Risk | Why it matters | Mitigation |
|---|---|---|
| `companyId` vs `developerSlug` mismatch | Current route is `#company-cabinet=developerSlug`, backend endpoints use company ID | Support lookup by seeded `developer_slug` in adapter/service mapping or return companies from `GET /me` before cabinet fetch |
| Private fallback on 403 | Would expose demo private cabinet after backend denies access | Keep AUTH-010/011 rule: no private fallback for 401/403/404 |
| Response shape drift | Current adapter expects `AUTH-009A` envelope | Add smoke tests for exact fields used by adapter |
| Cookie/CORS issues | Static frontend and backend run on different localhost ports | Configure credentials, CORS origin, SameSite strategy during backend implementation |
| Dev-login leaking into prod | Temporary auth is acceptable only for local/staging | Require `DEV_AUTH_ENABLED` guard and production startup fail-fast if enabled |
| Seed data divergence | Frontend mock and backend seed can show different tariffs/cabinet blocks | Seed from existing `js/data/*` files until production source is decided |
| Permissions duplicated in frontend | Frontend must display, backend must enforce | Backend returns permissions for UI hints; backend remains authority |
| API enabled accidentally | Default site must remain unchanged | Keep adapter disabled by default and enabled only by explicit query/config |

## 11. File boundary for next tasks

Allowed future files for first backend scaffold task:

```text
backend/package.json
backend/tsconfig.json
backend/.env.example
backend/README.md
backend/prisma/schema.prisma
backend/prisma/seed.ts
backend/src/**
backend/tests/**
```

Allowed existing docs to update during backend implementation:

```text
docs/CHANGE_LOG.md
docs/THREAD_REGISTRY.md
docs/CHAT_TASK_BACKLOG.md
```

Only if Architect / Main asks:

```text
docs/PROJECT_INDEX.md
docs/FIX_QUEUE.md
```

Do not edit during backend scaffold:

```text
index.html
css/**
js/app.js
js/pages/**
js/catalog/**
js/behavior/**
js/data/**
assets/**
```

Frontend adapter files `js/api/*` are out of scope unless the explicit task is frontend-backend integration QA.

## 12. Recommended next tasks

Status update 2026-07-08:

`AUTH-014` was reassigned by Architect / Main to role-profile contract roadmap sync after owner-approved role decisions. Backend scaffold/code start remains a later task and still requires a separate implementation brief.

Suggested continuation after Architect / Main accepts this document and the approved role-decision sync:

1. `AUTH-015`: backend scaffold implementation brief or scaffold start, with package metadata, env example, empty Fastify app boundary and no DB migrations beyond agreed Prisma draft.
2. `AUTH-016`: Prisma schema draft from `AUTH-006`, reviewed before migration execution.
3. `AUTH-017`: seed/import script implementation for dev database.
4. `AUTH-018`: read-only Fastify endpoints matching `AUTH-009A`.
5. `AUTH-019`: frontend adapter QA against real backend with dev toggle.
6. `AUTH-020`: session/auth hardening before any mutating endpoints.

## 13. Acceptance criteria

AUTH-013 is accepted when:

- future `backend/` structure is documented;
- package scripts are documented;
- Prisma ownership and folders are documented;
- module boundaries are documented;
- env strategy is documented;
- seed/import phases are documented;
- first API modules are documented;
- smoke/tests are documented;
- frontend adapter integration risks are documented;
- no backend code, dependencies or site files were changed.

## 14. Decision summary

```text
Backend scaffold will be isolated under backend/.
Stack remains Node.js + Fastify + PostgreSQL + Prisma.
API base remains /api/v1.
Frontend adapter remains disabled by default.
First backend slice remains read-only/read-heavy.
Server sessions with httpOnly cookies are the auth boundary.
Seed/import reads current js/data files but does not modify them.
No visual/CSS/stories/filters/cards/js/app.js work belongs to Backend/Auth.
```
