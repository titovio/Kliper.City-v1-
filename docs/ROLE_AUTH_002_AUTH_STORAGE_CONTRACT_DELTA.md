# ROLE-AUTH-002: AUTH-004 / AUTH-006 contract delta for role profiles

Дата: 2026-07-07.

Статус: документационный contract delta. Backend-код, `backend/`, зависимости, mock server, adapter, payment, site files и `js/app.js` не менялись.

## Цель

Зафиксировать, какие пункты нужно будет добавить или изменить в:

- `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md`;
- `AUTH_006_STORAGE_SCHEMA_PLAN.md`;

после owner decisions по role profiles, favorite tags, review author context и тарифу физлица.

Этот документ не переписывает текущие `AUTH-004` / `AUTH-006`. Он является картой будущей правки контрактов после подтверждения владельца и после базового backend/auth read-only slice.

Связанные документы:

- `ROLE_PROFILES_OWNER_DECISION_PACK.md`;
- `ROLE_PROFILES_REPORT_INTAKE.md`;
- `ROLE_AUTH_BILL_001_BACKEND_FOLLOWUP.md`;
- `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md`;
- `AUTH_006_STORAGE_SCHEMA_PLAN.md`.

## 1. Owner decision baseline

Рабочие дефолты Architect / Main из owner decision pack:

| Тема | Дефолт для contract delta |
|---|---|
| CTA | `Стать автором или специалистом` |
| Тариф физлица | `Профиль автора` |
| Цена | `990 ₽ / мес` |
| Роли | `Риэлтор`, `Автор обзоров`, `Специалист`, `Представитель компании` |
| Favorite tags | сначала системные, пользовательские позже |
| Privacy | private default + public aggregate |
| Блок рецензий | `Почему советуют`, 3 рекомендации |
| Trust labels | `Подтвержден Kliper`, `Подтвержден компанией`, `Не подтвержден` |
| Commercial labels | `Материал компании`, `Партнерский материал`, `Связь с компанией раскрыта` |
| После неоплаты | 0-7 days grace, 8-60 days basic, after 60 days inactive |
| `Эксперт` | нельзя купить |
| Реализация | future-state: финал v1 после backend/auth base, основной слой v2 |

Если владелец меняет эти решения, delta ниже нужно пересмотреть до внесения в `AUTH-004` / `AUTH-006`.

## 2. Users delta

### Add to AUTH-004

В раздел account types / roles добавить правило:

```text
One user account can own personal profile, role profiles and company memberships.
user profile != role profile != company cabinet.
```

Уточнить:

- `user` остается базовым identity и владельцем личных действий;
- `verified_user` подтверждает человека, но не создает role profile автоматически;
- `company_member` дает доступ к company cabinet, но не является role profile;
- `company_member` может быть основанием для подтверждения роли `company_representative`, но только через явную связь.

### Add to AUTH-006

В `users` не добавлять role-specific flags:

- не добавлять `is_realtor`;
- не добавлять `is_author`;
- не добавлять `is_expert`;
- не добавлять `company_id`;
- не добавлять subscription fields.

В `user_profiles` добавить future preference candidates:

| Column | Type | Purpose |
|---|---|---|
| `default_review_name_visibility` | string | show_name/anonymous/context_only |
| `default_review_context_visibility` | string | user/role/context_only |
| `favorite_tags_visibility_default` | string | private/friends/public/aggregate_only |

Storage rule:

```text
Personal privacy defaults can guide review/tag creation, but do not grant role publishing permissions.
```

## 3. Role profiles delta

### Add to AUTH-004

Добавить новый account context:

| Context | Purpose |
|---|---|
| `role_profile` | публичная авторская/профессиональная роль физлица поверх `user` |

Role profile стартовые `role_type`:

- `realtor`;
- `reviewer`;
- `specialist`;
- `company_representative`.

Rule:

```text
role_profile is not company.
company_representative role must disclose company relation.
```

Add role profile permissions separately from company permissions:

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

Add role profile lifecycle:

| Status | Meaning |
|---|---|
| `draft` | created, not public |
| `active` | full public role profile |
| `basic` | exists, compact/lower presence after non-payment |
| `inactive` | direct-link only or hidden from lists |
| `suspended` | moderation/admin restriction |

Verification statuses:

```text
unverified
pending
verified_by_kliper
verified_by_company
rejected
```

Trust status must be separate from payment:

```text
none
candidate
expert
revoked
```

`expert` / `Эксперт` is never a plan, subscription status or purchasable feature.

### Add to AUTH-006

Add table `role_profiles`:

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `user_id` | string | fk users.id |
| `role_type` | string | realtor/reviewer/specialist/company_representative |
| `display_name` | string | not null |
| `slug` | string | unique |
| `status` | string | draft/active/basic/inactive/suspended |
| `verification_status` | string | unverified/pending/verified_by_kliper/verified_by_company/rejected |
| `subscription_status` | string | none/trial/active/grace/basic/inactive/cancelled/past_due/manual |
| `trust_status` | string | none/candidate/expert/revoked |
| `bio` | text/null | |
| `avatar_url` | string/null | |
| `external_links_json` | json/text | |
| `created_at` | datetime | not null |
| `updated_at` | datetime | not null |

Indexes:

```text
index(user_id, status)
unique(slug)
index(role_type, status)
index(verification_status)
index(subscription_status)
index(trust_status)
```

Add table `role_profile_links`:

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `role_profile_id` | string | fk role_profiles.id |
| `target_type` | string | district/object/company/category |
| `target_id` | string | not null |
| `relation_type` | string | works_with/lives_near/reviews/specializes/represents |
| `commercial_status` | string | none/partner/paid/barter/company_confirmed |
| `status` | string | active/pending/rejected/removed |
| `confirmed_by_company_id` | string/null | fk companies.id |
| `created_at` | datetime | not null |
| `updated_at` | datetime | not null |

Indexes/constraints:

```text
index(role_profile_id, status)
index(target_type, target_id, status)
index(confirmed_by_company_id)
unique(role_profile_id, target_type, target_id, relation_type) where status != removed
```

Company representative rule:

```text
role_profile_links.relation_type = represents
requires commercial_status = company_confirmed
and confirmed_by_company_id is not null
before verified_by_company can be displayed.
```

## 4. Favorite tags delta

### Add to AUTH-004

Add favorite tags as user social signal:

```text
favorite tags are reasons for saved/favorite targets, not publications.
```

System starter tags:

- `Люблю гулять`;
- `Лучшая еда`;
- `Куда сходить с детьми`;
- `Красивые дворы`;
- `Хочу посмотреть`;
- `ЖК для жизни`;
- `Для бизнеса`;
- `Места для выходных`.

Public card rule:

```text
Public surfaces can show aggregate favorite tag summaries, not private user assignments.
```

### Add to AUTH-006

Add table `favorite_tags`:

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `user_id` | string/null | fk users.id, null for system tags |
| `title` | string | not null |
| `slug` | string | not null |
| `type` | string | system/custom |
| `visibility_default` | string | private/friends/public/aggregate_only |
| `status` | string | active/archived |
| `created_at` | datetime | not null |
| `updated_at` | datetime | not null |

Constraints:

```text
unique(slug) where user_id is null
unique(user_id, slug) where user_id is not null
index(type, status)
```

Add table `favorite_tag_assignments`:

| Column | Type | Constraints |
|---|---|---|
| `user_id` | string | fk users.id |
| `target_type` | string | object/company/district/place/business |
| `target_id` | string | not null |
| `favorite_tag_id` | string | fk favorite_tags.id |
| `visibility` | string | private/friends/public/aggregate_only |
| `created_at` | datetime | not null |

Primary key:

```text
user_id, target_type, target_id, favorite_tag_id
```

Indexes:

```text
index(target_type, target_id, visibility)
index(favorite_tag_id, visibility)
index(user_id, created_at)
```

Migration mapping addition:

| Current source | Future backend target |
|---|---|
| favorite/saved target without tag | `favorite_tag_assignments` with optional default tag after user confirmation |
| future local favorite tag choice | `favorite_tag_assignments` after user confirmation |

Do not infer sensitive tags automatically from browsing or private behavior.

## 5. Review author context delta

### Add to AUTH-004

Update review model:

- рецензия is recommendation, not complaint/review dump;
- public review card can hide real name but must show public author context;
- double tag appears when professional/company relation is relevant;
- partner/company material cannot be displayed as independent organic recommendation.

Add review status/freshness language:

```text
recommendation_status: active/needs_confirmation/outdated/withdrawn
freshness_status: current/needs_confirmation/outdated/withdrawn
```

Add public response shape candidate:

```json
{
  "id": "review_123",
  "text": "Нравится двор и навигация.",
  "author_context": {
    "label": "Житель района / Риэлтор",
    "show_real_name": false,
    "connection_disclosure": "professional",
    "freshness_status": "current"
  }
}
```

### Add to AUTH-006

Add columns to `reviews` or decide to keep them in context table:

| Column | Type | Notes |
|---|---|---|
| `recommendation_status` | string | active/needs_confirmation/outdated/withdrawn |
| `last_confirmed_at` | datetime/null | annual freshness confirmation |

Add table `review_author_context`:

| Column | Type | Constraints |
|---|---|---|
| `review_id` | string | pk, fk reviews.id |
| `author_user_id` | string | fk users.id |
| `author_role_profile_id` | string/null | fk role_profiles.id |
| `public_author_label` | string | not null |
| `secondary_author_label` | string/null | double tag |
| `show_real_name` | boolean | not null |
| `connection_disclosure` | string | none/professional/partner/company_representative |
| `freshness_status` | string | current/needs_confirmation/outdated/withdrawn |
| `confirmed_at` | datetime/null | |
| `updated_at` | datetime | not null |

Indexes:

```text
index(author_user_id)
index(author_role_profile_id)
index(public_author_label)
index(connection_disclosure)
index(freshness_status)
```

Integrity rule:

```text
review_author_context.author_user_id must equal reviews.user_id.
```

Context recalculation triggers later:

- role profile verification changes;
- role profile link commercial status changes;
- user privacy defaults change;
- review freshness expires;
- moderation flags a hidden conflict.

## 6. Billing физлица delta

### Add to AUTH-004

Split billing domains:

```text
Company billing = B2B company placement.
Role billing = B2C author/specialist profile tools.
```

Add B2C tariff candidate:

| Field | Value |
|---|---|
| Plan id | `author_profile` |
| Public name | `Профиль автора` |
| Price hypothesis | `990 ₽ / мес` |
| Subject | `role_profile` |
| Buyer | `user` |

Gives:

- 1 active public role card;
- role publications;
- role stories;
- role collections;
- external links;
- basic stats;
- links to districts/objects/companies/categories.

Does not give:

- company cabinet;
- official company status;
- CRM/leads;
- organic ranking;
- hidden commercial relation;
- `Эксперт`.

Add non-payment lifecycle:

| Status | Rule |
|---|---|
| `active` | paid |
| `grace` | 0-7 days after failed payment |
| `basic` | 8-60 days after failed payment |
| `inactive` | after 60 days, direct-link/limited presence |
| `cancelled` | follows paid_until lifecycle |
| `suspended` | moderation/admin override |

### Add to AUTH-006

Do not overload `billing_plans` and `company_subscriptions` without a domain discriminator decision.

Preferred future storage:

```text
role_billing_plans
role_profile_subscriptions
role_profile_subscription_events
```

Add table `role_billing_plans`:

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk, e.g. author_profile |
| `name` | string | not null |
| `monthly_price` | number | rubles/kopecks decision later |
| `role_profiles_limit` | number | default 1 |
| `publication_limit` | number/null | |
| `story_limit` | number/null | |
| `collection_limit` | number/null | |
| `external_links_limit` | number/null | |
| `analytics_level` | string | none/basic |
| `is_available` | boolean | default true |
| `created_at` | datetime | not null |
| `updated_at` | datetime | not null |

Add table `role_profile_subscriptions`:

| Column | Type | Constraints |
|---|---|---|
| `id` | string | pk |
| `role_profile_id` | string | fk role_profiles.id |
| `user_id` | string | fk users.id |
| `plan_id` | string | fk role_billing_plans.id |
| `status` | string | trial/active/grace/basic/inactive/cancelled/past_due/manual |
| `started_at` | datetime | not null |
| `paid_until` | datetime/null | |
| `grace_until` | datetime/null | |
| `basic_until` | datetime/null | |
| `cancelled_at` | datetime/null | |
| `created_at` | datetime | not null |
| `updated_at` | datetime | not null |

Constraints:

```text
unique(role_profile_id) where status in (trial, active, grace, basic, past_due, manual)
index(user_id, status)
index(plan_id)
index(paid_until)
index(grace_until)
index(basic_until)
```

Add table `role_profile_subscription_events` later for audit/payment provider integration:

```text
id
role_profile_subscription_id
event_type
payload_json
created_at
```

Payment provider can be shared later, but domain subscription tables and permissions should stay separate.

## 7. Privacy delta

### Add to AUTH-004

Privacy defaults:

```text
Personal actions are private by default.
Public cards may show aggregate favorite tag signals.
Published recommendation reviews may show text with context while hiding real identity.
```

Rules:

- company never receives private favorite tag assignments;
- company sees only public/aggregate signals;
- role profile public visibility does not make personal profile public;
- review text visibility and author identity visibility are separate;
- commercial/professional disclosure cannot be hidden by privacy settings.

### Add to AUTH-006

Storage privacy additions:

- `user_profiles.default_review_name_visibility`;
- `user_profiles.default_review_context_visibility`;
- `user_profiles.favorite_tags_visibility_default`;
- `favorite_tag_assignments.visibility`;
- `review_author_context.show_real_name`;
- `review_author_context.connection_disclosure`.

Potential privacy audit table for later:

```text
privacy_change_events
```

Not required for first schema delta, but recommended before production role profile launch.

## 8. Permissions delta

### Add to AUTH-004

Keep company permissions unchanged. Add role permissions:

| Permission | Owner | Kliper moderator/admin | Company member |
|---|---:|---:|---:|
| `role_profile.read` | yes | yes | no by default |
| `role_profile.update` | yes | yes | no by default |
| `role_profile.publish` | active/basic rules | yes | no by default |
| `role_profile.stories.manage` | active subscription only | yes | no |
| `role_profile.collections.manage` | active/basic rules | yes | no |
| `role_profile.links.manage` | active/basic rules | yes | no |
| `role_profile.billing.view` | yes | support/admin | no |
| `role_profile.billing.manage` | yes | admin/support by policy | no |
| `role_profile.verify` | no | moderator/admin | company can confirm only company relation |

Rules:

- `company_member` does not grant role permissions;
- `role_profile` does not grant company cabinet permissions;
- `verified_by_company` is scoped to the linked company relation;
- localStorage never grants role or company permissions.

### Add to AUTH-006

No separate permissions table is required for first delta if permissions are derived from:

- `role_profiles.user_id`;
- `role_profiles.status`;
- `role_profiles.verification_status`;
- `role_profiles.subscription_status`;
- `role_profile_links`;
- `company_members`;
- Kliper admin roles.

If permissions become configurable, add `role_profile_permission_overrides` later, not in first schema delta.

## 9. Migration delta

### Add to AUTH-004

Local/browser state is import candidate only.

New migration rules:

- local saved/favorite targets can become favorite tag assignments only after explicit user confirmation;
- local reviews can become `reviews` plus `review_author_context` only after auth and privacy confirmation;
- localStorage cannot create role profiles;
- localStorage cannot grant `Эксперт`, `verified_by_kliper`, `verified_by_company` or paid subscription;
- localStorage cannot create company representative relation.

### Add to AUTH-006

Extend `migration_snapshots.summary_json` to include:

```json
{
  "favorite_tags": {
    "local_count": 0,
    "matched_count": 0,
    "needs_confirmation": 0
  },
  "review_author_context": {
    "reviews_needing_privacy_choice": 0,
    "reviews_needing_context_choice": 0
  }
}
```

Potential future import targets:

| Source | Future target |
|---|---|
| `kliper-liked-cards` | `likes` and optional default favorite tag flow |
| `kliper-subscribed-cards` | `subscriptions` |
| `kliper-subscribed-districts` | `subscriptions` |
| `kliper-card-reviews` | `reviews` + `review_author_context` after confirmation |
| future local favorite tags | `favorite_tag_assignments` after confirmation |

Do not add production migration until:

- auth/session is live;
- privacy copy is approved;
- owner confirms custom tags policy;
- moderation process for reviews exists.

## 10. Suggested edits to AUTH-004 sections

When owner decisions are accepted, update `AUTH-004`:

| AUTH-004 section | Delta |
|---|---|
| `1. Главный принцип` | add `user profile != role profile != company cabinet` |
| `2. Типы аккаунтов` | add account contexts without adding new login account type |
| `3. Роли` | add role profile roles and trust status caveat |
| `5. Основные сущности` | add `role_profiles`, `role_profile_links` |
| `6. Социальные сущности` | add `favorite_tags`, `favorite_tag_assignments`, `review_author_context`; update reviews |
| `8. Тарифы и billing` | split company billing and role billing |
| `12. API v1 candidates` | add future role profile/favorite tag/recommendation APIs as post-v1 candidates |
| `13. Permission map` | add separate role profile permission map |
| `14. LocalStorage migration` | add favorite tags and review context migration rules |
| `15. Implementation order` | place role profiles after base auth/reviews/favorite tags, before role stories/payment mutations |
| `17. Explicitly not decided yet` | add remaining owner decisions and provider/payment/privacy blockers |

## 11. Suggested edits to AUTH-006 sections

When owner decisions are accepted, update `AUTH-006`:

| AUTH-006 section | Delta |
|---|---|
| `2. Первый storage scope` | keep role profiles out of first backend slice unless explicitly moved into final v1 |
| `4. Core tables` | add user profile privacy defaults |
| `6. Billing tables` | add separate role billing tables or explicit domain discriminator decision |
| `7. Social tables` | add favorite tag tables and review context table |
| `9. Migration tables` | extend migration snapshots for favorite tags and review context |
| `10. Seed/import mapping` | add system favorite tags seed, no role profile seed except controlled staging examples |
| `11. Import phases` | add staging examples for role profiles only after owner approval |
| `12. Data integrity rules` | add no role/company permission mixing, no purchasable expert |
| `13. Query patterns and indexes` | add public role lookup, target tag summary, recommendation review queries |
| `16. Security and privacy` | add privacy separation and commercial disclosure rules |
| `17. Open decisions before migrations` | add role tariff, privacy, verification and downgrade blockers |

## 12. Risks

### Scope creep into first backend slice

Risk: role profiles get pulled into the read-only backend scaffold before base auth/company/billing is stable.

Mitigation: keep `ROLE-AUTH-002` as future delta; first backend slice remains `GET /me`, company cabinet, billing plans/subscription, migration preview.

### Identity leakage

Risk: public role profile accidentally exposes private user profile data.

Mitigation: separate `user_profiles` from `role_profiles`; public review responses use `review_author_context`.

### Permission mixing

Risk: `company_member` starts granting role publishing, or role profile starts granting company cabinet access.

Mitigation: separate permission namespaces and test `company_member != role_profile`.

### Trust monetization

Risk: `Профиль автора` is interpreted as paid expert/ranking.

Mitigation: separate `subscription_status` from `trust_status`; `Эксперт` cannot be plan feature.

### Favorite tag privacy

Risk: private saved-item reasons leak to public company/object pages.

Mitigation: public pages use aggregate summaries only; assignments have explicit visibility.

### Review context drift

Risk: a review keeps an old author label after role verification/payment/company relation changes.

Mitigation: define recalculation triggers before implementation.

### Billing model ambiguity

Risk: B2C role billing overloads B2B `billing_plans` and `company_subscriptions`.

Mitigation: prefer separate `role_billing_plans` and `role_profile_subscriptions` unless owner/engineering explicitly choose a polymorphic billing model.

## 13. Blockers before contract merge

Do not merge this delta into active implementation contracts until:

1. Owner confirms CTA/tariff/price/roles/privacy/tag policy.
2. Owner confirms whether custom tags are v2 or later.
3. Owner confirms exact grace/basic/inactive timing.
4. Owner confirms whether inactive role profiles remain searchable or direct-link only.
5. Owner confirms role content limits: publications, stories, collections, external links.
6. Architect / Main confirms whether role profiles are final-v1-after-auth or v2.
7. Backend/Auth confirms base auth/session/read-only slice is stable.
8. Payment provider and invoicing policy for B2C are decided, or explicitly postponed.
9. Moderation process for reviews/trust/commercial disclosures is defined.
10. Privacy copy and user confirmation flow are approved.

## 14. Acceptance criteria

`ROLE-AUTH-002` is accepted when:

- delta is split by users, role_profiles, favorite_tags, review_author_context, billing физлица, privacy, permissions and migration;
- future edits to `AUTH-004` are mapped by section;
- future edits to `AUTH-006` are mapped by section;
- risks and blockers are listed;
- no backend, `backend/`, dependencies, mock server, adapter, payment, site files or `js/app.js` changed.
