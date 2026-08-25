# AUTH-006: storage/schema plan v1

Дата: 2026-07-07.

Статус: storage/schema plan. База данных, миграции и backend-код не реализованы.

## Цель

Описать будущую структуру хранения для первого backend/auth среза Kliper.City v1:

- таблицы;
- ключи;
- индексы;
- связи;
- seed/import из текущих frontend data-файлов;
- правила миграции localStorage;
- ограничения первого read-only backend-среза.

Этот документ продолжает:

- `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md`;
- `AUTH_005_BACKEND_IMPLEMENTATION_BRIEF.md`.

## 1. Граница AUTH-006

AUTH-006 описывает storage plan, но не выбирает окончательно:

- конкретную БД;
- ORM;
- хостинг;
- payment provider;
- file storage provider;
- SMS/email provider.

Схема должна быть совместима с типовой relational DB: PostgreSQL, MySQL или SQLite на раннем dev-этапе.

## 2. Первый storage scope

В первый backend-срез входят:

- users;
- user_profiles;
- auth_challenges;
- sessions;
- companies;
- company_members;
- objects;
- company_objects;
- billing_plans;
- company_subscriptions;
- likes;
- subscriptions;
- reviews;
- migration_snapshots.

В read-only company cabinet также нужны таблицы-заготовки:

- company_documents;
- company_posts;
- company_stories;
- company_dialogs;
- company_offers.

Они могут быть заполнены seed/mock-данными, но mutating endpoints для них не включаются в первый backend-срез.

## 3. ID strategy

Рекомендация:

- использовать string UUID/ULID для новых backend-сущностей;
- сохранить legacy `slug` как natural key только для lookup и seed/import;
- не использовать текущие numeric `id` из JS как главный backend ID.

Примеры:

```text
usr_01...
cmp_01...
obj_01...
plan_business
sub_01...
```

Правило:

- `developer.slug` становится `companies.developer_slug`;
- `building.id` становится `objects.legacy_source_id`;
- `businessSpace.id` становится `objects.legacy_source_id`.

## 4. Core tables

### users

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `display_name` | string | not null |
| `phone` | string/null | unique nullable |
| `email` | string/null | unique nullable |
| `avatar_url` | string/null | |
| `city_id` | string | default `tyumen` |
| `status` | string | active/blocked/deleted |
| `created_at` | datetime | not null |
| `updated_at` | datetime | not null |

Indexes:

```text
unique(phone) where phone is not null
unique(email) where email is not null
index(status)
index(city_id)
```

Seed:

- default user `Мария` from `js/data/site-config.js`.

### user_profiles

| Column | Type | Constraints |
|---|---|---|
| `user_id` | string | pk, fk users.id |
| `bio` | text/null | |
| `is_public` | boolean | default true |
| `reviews_visibility` | string | public/friends/private |
| `collections_visibility` | string | public/friends/private |
| `created_at` | datetime | not null |
| `updated_at` | datetime | not null |

Indexes:

```text
index(is_public)
index(reviews_visibility)
```

### auth_challenges

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `channel` | string | phone/email |
| `login` | string | not null |
| `code_hash` | string | not null |
| `status` | string | pending/verified/expired/cancelled |
| `attempts` | number | default 0 |
| `expires_at` | datetime | not null |
| `created_at` | datetime | not null |

Indexes:

```text
index(login, status)
index(expires_at)
```

### sessions

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `user_id` | string | fk users.id |
| `status` | string | active/revoked/expired |
| `created_at` | datetime | not null |
| `expires_at` | datetime | not null |
| `last_seen_at` | datetime/null | |

Indexes:

```text
index(user_id, status)
index(expires_at)
```

Security note:

- хранить session token только hash-side;
- не хранить auth token в localStorage на frontend, если можно использовать httpOnly cookie.

## 5. Company tables

### companies

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `developer_slug` | string/null | unique nullable |
| `name` | string | not null |
| `legal_name` | string/null | |
| `type` | string | developer/business/service/branch |
| `status` | string | draft/review/published/suspended |
| `verification_status` | string | unverified/pending/verified/rejected |
| `current_plan_id` | string | fk billing_plans.id |
| `source` | string | seed/manual/import |
| `created_at` | datetime | not null |
| `updated_at` | datetime | not null |

Indexes:

```text
unique(developer_slug) where developer_slug is not null
index(status)
index(verification_status)
index(type)
index(current_plan_id)
```

Seed source:

- `js/data/developers.js`;
- `name` -> `companies.name`;
- `slug` -> `companies.developer_slug`;
- `site` can go into future company_contacts.

### company_members

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `company_id` | string | fk companies.id |
| `user_id` | string | fk users.id |
| `role` | string | company_owner/company_manager/company_editor/company_viewer |
| `status` | string | invited/active/removed |
| `created_at` | datetime | not null |
| `updated_at` | datetime | not null |

Indexes:

```text
unique(company_id, user_id) where status != removed
index(user_id, status)
index(company_id, role)
```

Seed:

- dev/staging test user gets `company_owner` for `gk-paritet-development`;
- optional owner membership for all seeded companies only in dev/demo.

### objects

Unified object table for ЖК, готовые ЖК, business spaces and future service cards.

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `legacy_source` | string | developers/buildings/business_spaces/manual |
| `legacy_source_id` | string | nullable |
| `slug` | string/null | unique nullable |
| `title` | string | not null |
| `type` | string | newbuild/ready_jk/business_space/service |
| `status` | string | draft/published/archived |
| `city_id` | string | default `tyumen` |
| `district` | string/null | |
| `address` | string/null | |
| `price_label` | string/null | |
| `cover_url` | string/null | |
| `created_at` | datetime | not null |
| `updated_at` | datetime | not null |

Indexes:

```text
unique(legacy_source, legacy_source_id)
index(type, status)
index(city_id, district)
index(slug)
```

Seed source:

- `js/data/buildings.js` -> newbuild/ready_jk;
- `js/data/business-spaces.js` -> business_space.

### company_objects

Many-to-many relation between companies and objects.

| Column | Type | Constraints |
|---|---|---|
| `company_id` | string | fk companies.id |
| `object_id` | string | fk objects.id |
| `relation_type` | string | owner/developer/seller/manager |
| `status` | string | active/inactive |
| `created_at` | datetime | not null |

Primary key:

```text
company_id, object_id, relation_type
```

Indexes:

```text
index(object_id)
index(company_id, status)
```

Seed rule:

- `buildings.developer` matches `developers.name`;
- matched developer becomes company relation `developer`;
- business spaces without company mapping can be linked to a future placeholder company only if explicitly approved.

## 6. Billing tables

### billing_plans

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `name` | string | not null |
| `monthly_price` | number | integer kopecks/rubles decision later |
| `period` | string | month/year |
| `cards_limit` | number | not null |
| `photo_limit` | number/null | |
| `publication_limit` | number/null | |
| `story_limit` | number/null | |
| `analytics_level` | string | none/basic/advanced/full |
| `special_modules_limit` | number/null | |
| `is_available` | boolean | default true |
| `is_recommended` | boolean | default false |
| `sort_order` | number | not null |
| `created_at` | datetime | not null |
| `updated_at` | datetime | not null |

Indexes:

```text
index(is_available, sort_order)
```

Seed source:

- `js/data/company-pricing.js`.

Mapping:

| Frontend field | Backend column |
|---|---|
| `id` | `id` |
| `name` | `name` |
| `price` | `monthly_price` after numeric parse |
| `period` | `period` |
| `cardsLimit` | `cards_limit` |
| `badge === Популярный` | `is_recommended` |
| `features` | future `billing_plan_features` |

### billing_plan_features

Optional normalized table for plan features.

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `plan_id` | string | fk billing_plans.id |
| `title` | string | not null |
| `sort_order` | number | not null |

Indexes:

```text
index(plan_id, sort_order)
```

### company_subscriptions

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `company_id` | string | fk companies.id |
| `plan_id` | string | fk billing_plans.id |
| `status` | string | trial/active/past_due/cancelled/manual |
| `period` | string | monthly/yearly |
| `started_at` | datetime | not null |
| `expires_at` | datetime/null | |
| `cards_used` | number | default 0 |
| `additional_cards_count` | number | default 0 |
| `created_at` | datetime | not null |
| `updated_at` | datetime | not null |

Indexes:

```text
unique(company_id) where status in (trial, active, manual, past_due)
index(plan_id)
index(status)
index(expires_at)
```

Seed source:

- `companyPricing.defaultPlan`;
- `companyPricing.companyPlans[developerSlug]`;
- fallback plan `business`.

## 7. Social tables

### likes

| Column | Type | Constraints |
|---|---|---|
| `user_id` | string | fk users.id |
| `target_type` | string | company/object/business_space |
| `target_id` | string | not null |
| `created_at` | datetime | not null |

Primary key:

```text
user_id, target_type, target_id
```

Indexes:

```text
index(target_type, target_id)
index(user_id, created_at)
```

Local source:

- `kliper-liked-cards`.

### subscriptions

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `user_id` | string | fk users.id |
| `target_type` | string | company/object/district/category/search |
| `target_id` | string | not null |
| `status` | string | active/muted/cancelled |
| `created_at` | datetime | not null |
| `updated_at` | datetime | not null |

Indexes:

```text
unique(user_id, target_type, target_id) where status != cancelled
index(target_type, target_id, status)
index(user_id, status)
```

Local sources:

- `kliper-subscribed-cards`;
- `kliper-subscribed-districts`.

### reviews

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `user_id` | string | fk users.id |
| `target_type` | string | company/object/business_space |
| `target_id` | string | not null |
| `rating` | number/null | 1-5 if present |
| `text` | text | not null |
| `visibility` | string | public/friends/private |
| `status` | string | draft/published/moderation/hidden |
| `created_at` | datetime | not null |
| `updated_at` | datetime | not null |

Indexes:

```text
index(target_type, target_id, status)
index(user_id, status)
index(created_at)
```

Local source:

- `kliper-card-reviews`.

## 8. Company cabinet read tables

These tables support the accepted cabinet UI but remain read-only in the first backend slice.

### company_documents

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `company_id` | string | fk companies.id |
| `type` | string | legal/brand/object/ownership/other |
| `title` | string | not null |
| `status` | string | missing/uploaded/review/verified/rejected |
| `review_comment` | string/null | |
| `created_at` | datetime | not null |
| `updated_at` | datetime | not null |

Indexes:

```text
index(company_id, status)
index(type)
```

Seed source:

- `js/data/company-cabinet.js` defaults/documents.

### company_posts

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `company_id` | string | fk companies.id |
| `title` | string | not null |
| `meta` | string/null | |
| `status` | string | draft/review/published/archived |
| `audience` | string | public/subscribers/segment |
| `created_at` | datetime | not null |
| `updated_at` | datetime | not null |

Indexes:

```text
index(company_id, status)
index(audience)
```

### company_stories

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `company_id` | string | fk companies.id |
| `title` | string | not null |
| `status` | string | draft/published/scheduled/archived |
| `views_count` | number | default 0 |
| `created_at` | datetime | not null |
| `updated_at` | datetime | not null |

Indexes:

```text
index(company_id, status)
```

### company_dialogs

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `company_id` | string | fk companies.id |
| `user_id` | string/null | fk users.id |
| `source_type` | string | public_page/object/review/story |
| `source_id` | string/null | |
| `title` | string | not null |
| `status` | string | new/in_progress/waiting_user/closed/spam |
| `created_at` | datetime | not null |
| `last_message_at` | datetime/null | |

Indexes:

```text
index(company_id, status)
index(user_id)
index(last_message_at)
```

### company_offers

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `company_id` | string | fk companies.id |
| `title` | string | not null |
| `audience_type` | string | all_subscribers/segment/custom |
| `status` | string | draft/review/scheduled/sent/cancelled |
| `created_at` | datetime | not null |
| `scheduled_at` | datetime/null | |

Indexes:

```text
index(company_id, status)
index(scheduled_at)
```

## 9. Migration tables

### migration_snapshots

Stores localStorage migration previews and imported batches.

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `user_id` | string | fk users.id |
| `source` | string | localStorage/import/manual |
| `status` | string | preview/imported/failed/cancelled |
| `summary_json` | json/text | not null |
| `created_at` | datetime | not null |

Indexes:

```text
index(user_id, status)
index(created_at)
```

Do not store raw sensitive tokens or private browser dumps.

## 10. Seed/import mapping

| Source | Backend target |
|---|---|
| `js/data/developers.js` | `companies`, optional `objects` for company profile cards |
| `js/data/buildings.js` | `objects`, `company_objects` |
| `js/data/business-spaces.js` | `objects` type `business_space` |
| `js/data/company-cabinet.js` | company read tables: documents/posts/stories/dialogs/offers |
| `js/data/company-pricing.js` | `billing_plans`, `billing_plan_features`, `company_subscriptions` |
| `localStorage: kliper-liked-cards` | `likes` after user confirmation |
| `localStorage: kliper-subscribed-cards` | `subscriptions` after user confirmation |
| `localStorage: kliper-subscribed-districts` | `subscriptions` target `district` |
| `localStorage: kliper-card-reviews` | `reviews` after user confirmation/moderation |

## 11. Import phases

### Phase 1: dev seed

Purpose:

- make backend read API return same structure as frontend mock;
- support local development;
- no real production claims.

Steps:

1. Parse developers.
2. Create companies.
3. Parse buildings.
4. Create objects.
5. Match buildings by developer name to company.
6. Parse pricing plans.
7. Create default subscriptions.
8. Create demo user.
9. Create demo memberships.
10. Seed company cabinet read tables from defaults.

### Phase 2: staging import

Purpose:

- test realistic access rules;
- test forbidden company cabinet;
- test multiple roles.

Add:

- multiple users;
- owner/manager/editor/viewer roles;
- at least one company with no access;
- at least one company with no objects;
- at least one expired/past_due subscription.

### Phase 3: production migration

Not decided.

Requires:

- owner decision;
- legal data source;
- payment provider;
- moderation process.

## 12. Data integrity rules

Required:

- company membership must reference existing user and company;
- company subscription must reference existing company and billing plan;
- object relation must reference existing object and company;
- one active/manual subscription per company;
- one active membership per user/company;
- one like per user/target;
- no private cabinet data in public API.

Recommended:

- soft-delete via status fields for users, companies, objects and memberships;
- immutable audit log later for billing and moderation;
- normalized plan features for future plan comparison.

## 13. Query patterns and indexes

Important first queries:

```text
GET /me
```

Needs:

```text
users.id
user_profiles.user_id
company_members.user_id,status
companies.id,status
```

```text
GET /companies/:companyId/cabinet
```

Needs:

```text
company_members.company_id,user_id,status
companies.id
company_objects.company_id,status
objects.id,status
company_subscriptions.company_id,status
billing_plans.id
company_documents.company_id,status
company_posts.company_id,status
company_stories.company_id,status
company_dialogs.company_id,status
company_offers.company_id,status
```

```text
GET /billing/plans
```

Needs:

```text
billing_plans.is_available,sort_order
billing_plan_features.plan_id,sort_order
```

## 14. API response assembly

`GET /companies/:companyId/cabinet` should assemble:

- company from `companies`;
- viewer from `company_members`;
- stats from denormalized counters or computed placeholders;
- objects from `company_objects + objects`;
- documents/posts/stories/dialogs/offers from company read tables;
- billing from `company_subscriptions + billing_plans`;
- readiness from company status + documents + objects + content tables;
- attention from documents/dialogs/posts statuses.

First backend slice may compute readiness and attention server-side to avoid frontend permission drift.

## 15. What not to denormalize yet

Do not create premature counters for:

- live analytics;
- notifications;
- billing invoices;
- full CRM message counts;
- social graph recommendations;
- search ranking.

These need real events and should come later.

Allowed temporary counters:

- `cards_used` in `company_subscriptions`;
- story `views_count` from seed/mock;
- simple company stats from imported developer fields.

## 16. Security and privacy

Rules:

- session tokens are not stored as plaintext;
- private cabinet endpoints require auth;
- public company page never receives documents/dialogs/offers/private billing details;
- billing manage permission belongs to `company_owner`;
- localStorage migration requires authenticated user and explicit user action;
- admin/support access must be auditable in a later phase.

## 17. Open decisions before migrations

Need decision:

- PostgreSQL vs SQLite dev-first vs managed backend;
- UUID vs ULID final format;
- phone auth provider;
- email auth provider;
- whether to use httpOnly cookie sessions;
- file storage provider for documents later;
- payment provider;
- production source of company legal data.

## 18. AUTH-006 decision

For the first backend/auth implementation, use this storage plan as schema reference, but create actual migrations only after:

1. backend stack is selected;
2. auth provider/session strategy is selected;
3. implementation owner confirms first read-only slice;
4. seed/import script format is chosen.

Next recommended task:

```text
AUTH-007: API adapter integration plan for frontend fallback
```

Purpose: define how static frontend will call backend when available and keep mock fallback when backend is absent.
