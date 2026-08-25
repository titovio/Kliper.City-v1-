# AUTH-014: approved role decisions contract roadmap sync

Дата: 2026-07-08.

Статус: документационная синхронизация. Backend-код, `backend/`, зависимости, Prisma schema, mock server, adapter, payment, site files и `js/app.js` не менялись.

## Цель

Синхронизировать утвержденные владельцем role-profile решения с future auth/storage/contracts roadmap.

Этот документ отвечает на пять вопросов:

1. Какие approved decisions уже можно считать contract constraints.
2. Какие изменения потом войдут в `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md` и `AUTH_006_STORAGE_SCHEMA_PLAN.md`.
3. Что блокирует backend implementation.
4. Как связать `users`, `role_profiles`, `favorite_tags`, `review_author_context`, `company_membership` и billing физлица.
5. Что нельзя делать до отдельного implementation brief.

Связанные документы:

- `ROLE_PROFILES_APPROVED_HANDOFF.md`;
- `ROLE_PROFILES_OWNER_DECISION_PACK.md`;
- `ROLE_AUTH_002_AUTH_STORAGE_CONTRACT_DELTA.md`;
- `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md`;
- `AUTH_006_STORAGE_SCHEMA_PLAN.md`;
- `AUTH_013_BACKEND_SCAFFOLD_PLAN.md`.

## 1. Approved decisions as contract constraints

Решения владельца от 2026-07-08 теперь считаются constraints для future auth/storage/billing contracts.

| Decision | Contract constraint |
|---|---|
| Role profiles не добавляются в текущий v1 UI | Backend/auth не должен запускать role-profile UI/API как часть текущего v1 без отдельного implementation brief |
| CTA: `Стать автором или специалистом` | Approved copy для future personal profile CTA, но не активная кнопка оплаты |
| Тариф физлица: `Профиль автора`, `990 ₽ / мес` | Future B2C role billing plan candidate, separate from B2B company plans |
| `Представитель компании` = public role + company membership access | Public role and company cabinet permissions must stay separate |
| Privacy: private by default | Personal actions are private; public surfaces can show aggregates and explicitly published reviews |
| Favorite tags: standard first, custom later after moderation | Seed only system tags initially; custom tags are blocked until moderation rules |
| `Почему советуют`: 3 reviews, company/partner materials outside organic top | Review APIs must separate organic recommendation reviews from company/partner materials |
| `Эксперт` нельзя купить | Trust status cannot be plan, subscription status or paid feature |

Contract baseline:

```text
user profile != role profile != company cabinet
company billing != role billing
favorite tags = signals, not publications
review author context = public display context, not raw user profile
```

## 2. Changes later for AUTH-004

`AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md` should later receive an approved role-profile section, but not in the first read-only backend slice.

### Main principle

Add:

```text
One user account can own personal profile, role profiles and company memberships.
Server remains source of permissions.
Role profiles are public contexts, not companies.
```

### Account contexts and roles

Add a new context, not a new login account type:

| Context | Meaning |
|---|---|
| `role_profile` | public author/specialist/company-representative role owned by `user` |

Approved role types:

- `realtor`;
- `reviewer`;
- `specialist`;
- `company_representative`.

Add explicit rule:

```text
company_representative must disclose company relation and still needs company_membership for cabinet access.
```

### Social entities

Add:

- `favorite_tags`;
- `favorite_tag_assignments`;
- `review_author_context`;
- review freshness/recommendation status.

Rule:

```text
favorite_tags are saved-item reasons and aggregate signals, not posts or publications.
```

### Reviews

Update review contract:

- review is a recommendation;
- public top block is `Почему советуют`;
- default public block size is 3 reviews;
- author name may be hidden while context remains visible;
- company/partner materials are not organic recommendation reviews;
- professional/company connection disclosure cannot be hidden.

### Billing

Split billing in contract:

```text
B2B company billing -> companies/company_subscriptions.
B2C role billing -> role_profiles/role_profile_subscriptions.
```

Add future role plan:

```text
plan_id: author_profile
name: Профиль автора
price: 990 ₽ / мес
subject: role_profile
buyer: user
```

Explicitly prohibit:

- buying `Эксперт`;
- buying organic ranking;
- using role tariff for company CRM/cabinet/leads.

### Permissions

Add separate role permission namespace:

```text
role_profile.read
role_profile.update
role_profile.publish
role_profile.stories.manage
role_profile.collections.manage
role_profile.links.manage
role_profile.billing.view
role_profile.billing.manage
```

Keep:

```text
company_membership grants company permissions only.
role_profile ownership grants role-profile permissions only.
```

### Migration

Add:

- localStorage can import likes/subscriptions/reviews only after auth and confirmation;
- localStorage cannot create role profiles;
- localStorage cannot grant paid subscription, trust, expert status or company representative relation;
- favorite tag assignments require explicit user confirmation.

## 3. Changes later for AUTH-006

`AUTH_006_STORAGE_SCHEMA_PLAN.md` should later receive role-profile storage additions after base auth/schema work is stable.

### Users and profiles

Keep `users` clean:

- no `is_realtor`;
- no `is_author`;
- no `is_expert`;
- no `company_id`;
- no role billing fields.

Add future `user_profiles` preferences:

| Column | Purpose |
|---|---|
| `default_review_name_visibility` | show_name/anonymous/context_only |
| `default_review_context_visibility` | user/role/context_only |
| `favorite_tags_visibility_default` | private/friends/public/aggregate_only |

### Role profile tables

Future tables:

```text
role_profiles
role_profile_links
```

`role_profiles` key fields:

```text
id
user_id
role_type
display_name
slug
status
verification_status
subscription_status
trust_status
bio
avatar_url
external_links_json
created_at
updated_at
```

Approved constraints:

- `trust_status` separate from `subscription_status`;
- `expert` can only be trust/moderation state, not billing state;
- `company_representative` needs `role_profile_links` relation to company.

`role_profile_links` key fields:

```text
role_profile_id
target_type
target_id
relation_type
commercial_status
status
confirmed_by_company_id
```

### Favorite tag tables

Future tables:

```text
favorite_tags
favorite_tag_assignments
```

Initial seed:

- `Люблю гулять`;
- `Лучшая еда`;
- `Куда сходить с детьми`;
- `Красивые дворы`;
- `Хочу посмотреть`;
- `ЖК для жизни`;
- `Для бизнеса`;
- `Места для выходных`.

Approved storage rule:

```text
Seed system tags first.
Custom tags are blocked until moderation rules.
Public queries use aggregate visibility only.
```

### Review author context

Future table:

```text
review_author_context
```

Key fields:

```text
review_id
author_user_id
author_role_profile_id
public_author_label
secondary_author_label
show_real_name
connection_disclosure
freshness_status
confirmed_at
updated_at
```

Integrity rule:

```text
review_author_context.author_user_id = reviews.user_id
```

Review table future additions:

```text
recommendation_status
last_confirmed_at
```

### Billing физлица tables

Future tables:

```text
role_billing_plans
role_profile_subscriptions
role_profile_subscription_events
```

Approved lifecycle:

| Status | Constraint |
|---|---|
| `active` | paid |
| `grace` | 0-7 days after failed payment |
| `basic` | 8-60 days after failed payment |
| `inactive` | after 60 days |
| `cancelled` | follows paid_until lifecycle |
| `suspended` | moderation/admin override |

Do not overload `company_subscriptions` with role subscriptions unless Architect / Backend explicitly chooses a polymorphic billing model later.

## 4. Entity relationships

Approved relationship map:

```text
users
  -> user_profiles
  -> role_profiles
       -> role_profile_links
       -> role_profile_subscriptions
  -> company_members
       -> companies
  -> favorite_tag_assignments
       -> favorite_tags
  -> reviews
       -> review_author_context
```

### users

Own identity, login, sessions and personal social actions.

Do not store role or billing shortcuts here.

### role_profiles

Owned by `users`.

Public role card and role content permissions come from:

- `role_profiles.user_id`;
- `role_profiles.status`;
- `role_profiles.verification_status`;
- `role_profiles.subscription_status`;
- `role_profiles.trust_status`;
- `role_profile_links`.

### favorite_tags

Owned by system or user.

Assignments belong to user and target. They can power public aggregates only through visibility and thresholds.

### review_author_context

Belongs to review and references optional role profile.

It is the public display adapter for:

- hidden/visible name;
- user/role label;
- double tag;
- commercial/professional disclosure;
- freshness.

### company_membership

Belongs to user and company.

It grants only company cabinet permissions.

For `company_representative`, company membership can confirm the public role relation but does not replace `role_profile`.

### billing физлица

Belongs to role profile and user.

It controls active role-profile tools and presence, not trust, company cabinet or organic ranking.

## 5. Backend implementation blockers

Role-profile backend implementation is blocked by:

1. Base auth/session/read-only backend slice not implemented yet.
2. No `backend/` scaffold, Prisma schema or migrations created yet.
3. No implementation brief for role profiles.
4. No moderation rules for custom tags.
5. No final trust/commercial label text set beyond current working labels.
6. No review freshness/reconfirmation process implementation brief.
7. No B2C payment provider/invoicing policy.
8. No privacy confirmation UI/copy for importing local reviews and favorite tags.
9. No role stories/content moderation brief.
10. No QA acceptance gate for role APIs against real backend.

Important:

```text
Owner decisions approve constraints, not implementation start.
```

## 6. What must not happen before implementation brief

Do not do before a separate implementation brief:

- create `backend/`;
- install dependencies;
- create Prisma schema/migrations for role profiles;
- add Fastify routes for role profiles;
- add role-profile endpoints to mock server;
- change frontend adapter;
- add role CTA to current profile UI;
- add role badges to current cards;
- add favorite-tag UI;
- add `Почему советуют` block to object pages;
- add payment or billing UI for `Профиль автора`;
- change `js/data/company-pricing.js`;
- change company B2B tariff page;
- infer role permissions from localStorage;
- treat `company_member` as role profile;
- treat role tariff as `Эксперт`.

Do not edit:

```text
js/app.js
index.html
css/**
js/**
tools/kliper-api-mock-server.mjs
backend/**
```

for this sync task.

## 7. Roadmap sync

Old planning note:

- `AUTH_013_BACKEND_SCAFFOLD_PLAN.md` used `AUTH-014` as a placeholder for backend scaffold.

Current approved handoff:

- `AUTH-014` is this documentation sync task.

Roadmap after AUTH-014 should be:

1. Accept this `AUTH-014` roadmap sync.
2. Decide whether the next backend task is base scaffold or Prisma schema draft.
3. Keep role-profile schema out of the first base backend slice unless a new implementation brief explicitly includes it.
4. Update `AUTH_004` / `AUTH_006` only after Architect / Main requests a contract merge.
5. Start backend code only after a separate backend implementation brief confirms allowed files, scope and checks.

Suggested next labels to avoid ambiguity:

```text
AUTH-015: backend scaffold implementation brief or scaffold start
AUTH-016: Prisma schema draft for base auth/company/billing
AUTH-017: seed/import script plan
AUTH-018: read-only endpoints
ROLE-AUTH-003: role-profile contract merge into AUTH-004/AUTH-006
```

## 8. Risks

### Scope creep

Risk: approved role decisions get pulled into the first backend implementation.

Mitigation: first backend slice remains auth/session, `GET /me`, company membership, company cabinet read API, billing read API and migration preview.

### Permission mixing

Risk: `company_member` starts granting role publishing or role profile grants company cabinet access.

Mitigation: separate `company.*` and `role_profile.*` permissions.

### Privacy leakage

Risk: private tags or personal profile data appear on public cards.

Mitigation: public APIs return aggregate tag summaries and `review_author_context`, not raw user private state.

### Trust monetization

Risk: `Профиль автора` looks like paid expert status.

Mitigation: `subscription_status` and `trust_status` stay separate; `Эксперт` is never purchasable.

### Billing model confusion

Risk: B2C role billing is mixed into B2B company billing tables.

Mitigation: prefer separate role billing tables.

### Contract drift

Risk: `AUTH_004` / `AUTH_006` remain unsynchronized with approved role constraints.

Mitigation: keep this document as the merge checklist for future `ROLE-AUTH-003`.

## 9. Acceptance criteria

`AUTH-014` is accepted when:

- approved decisions are listed as contract constraints;
- future `AUTH_004` changes are summarized;
- future `AUTH_006` changes are summarized;
- entity relationships are documented;
- backend implementation blockers are documented;
- forbidden actions before implementation brief are documented;
- no backend code, dependencies, mock server, adapter, payment, site files or `js/app.js` changed.
