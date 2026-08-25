# ROLE-AUTH-001 / ROLE-BILL-001: backend auth and billing follow-up

Дата: 2026-07-07.

Статус: документационный follow-up. Backend-код, mock server, frontend adapter, payment и текущий сайт не менялись.

## Цель

Зафиксировать, как будущие ролевые профили физлиц, теги любимого, контекст автора рецензии и тариф `Профиль автора` должны лечь рядом с текущими backend/auth сущностями Kliper.City.

Документ не заменяет `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md` и `AUTH_006_STORAGE_SCHEMA_PLAN.md`, а описывает, что добавить в будущую версию auth/storage/billing contracts после решения владельца.

Связанные документы:

- `ROLE_PROFILES_SCOPE.md`;
- `ROLE_PROFILES_OWNER_BRIEF.md`;
- `ROLE_PROFILES_TASK_BRIEFS.md`;
- `ROLE_AUTH_APPENDIX.md`;
- `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md`;
- `AUTH_006_STORAGE_SCHEMA_PLAN.md`.

## 1. Главный принцип

В будущей модели остается один базовый аккаунт:

```text
users.id = identity owner
```

Поверх него могут существовать разные контексты:

```text
user profile != role profile != company cabinet
```

Это значит:

- `user_profiles` хранит личный профиль и приватность человека;
- `role_profiles` хранит публичную профессиональную или авторскую роль физлица;
- `company_members` хранит доступ человека к кабинету компании;
- `companies` остаются юридическими/организационными субъектами;
- `reviews` остаются текстами рекомендаций;
- `review_author_context` объясняет, от какого публичного контекста и с какой disclosure рецензия видна.

Ролевой профиль физлица не должен становиться компанией, а участие в компании не должно автоматически давать статус эксперта.

## 2. ROLE-AUTH-001: entity placement

### users

`users` остается корневой identity entity.

Добавлять в `users` role-specific поля не нужно:

- не добавлять `is_realtor`;
- не добавлять `is_expert`;
- не добавлять `company_id`;
- не добавлять billing state тарифа автора.

Причина: один пользователь может иметь несколько ролей и несколько company memberships.

### user_profiles

`user_profiles` остается личным слоем:

- bio обычного пользователя;
- приватность профиля;
- visibility личных рецензий/подборок;
- настройки показа имени.

Будущий storage contract может добавить личные preference fields:

```text
default_review_name_visibility
default_review_context_visibility
favorite_tags_visibility_default
```

Но эти поля не дают permissions для role publishing.

### company_members

`company_members` остается только связью:

```text
user -> company -> company role
```

Связь `company_member` может подтверждать role profile типа `company_representative`, но не заменяет его.

Правило:

```text
company_members.role grants company cabinet permissions.
role_profiles.role_type grants public role presentation permissions.
```

Если пользователь представитель компании, нужна отдельная явная связь:

```text
role_profile_links.target_type = company
role_profile_links.relation_type = represents
role_profile_links.commercial_status = company_confirmed
role_profile_links.confirmed_by_company_id = companies.id
```

### reviews

`reviews` остается основной сущностью текста:

```text
reviews.user_id = author identity
reviews.target_type / target_id = recommendation target
reviews.visibility = text visibility
reviews.status = moderation lifecycle
```

В будущий contract стоит добавить:

```text
reviews.recommendation_status = active/needs_confirmation/outdated/withdrawn
reviews.last_confirmed_at
```

Контекст автора не хранить только в `reviews`, чтобы не смешивать:

- личное имя;
- публичную роль;
- двойной тег;
- коммерческую связь;
- приватность профиля.

Для этого нужен `review_author_context`.

## 3. Future tables to add to storage contract

### role_profiles

Назначение: публичная роль физлица поверх `users`.

Минимальные поля:

| Column | Type | Notes |
|---|---|---|
| `id` | string | pk |
| `user_id` | string | fk users.id |
| `role_type` | string | realtor/reviewer/specialist/company_representative |
| `display_name` | string | public role name |
| `slug` | string | unique public slug |
| `status` | string | draft/active/basic/inactive/suspended |
| `verification_status` | string | unverified/pending/verified_by_kliper/verified_by_company/rejected |
| `subscription_status` | string | none/trial/active/grace/basic/inactive/cancelled |
| `bio` | text/null | role bio |
| `avatar_url` | string/null | role avatar |
| `external_links_json` | json/text | links after validation |
| `created_at` | datetime | |
| `updated_at` | datetime | |

Recommended indexes:

```text
index(user_id, status)
unique(slug)
index(role_type, status)
index(verification_status)
index(subscription_status)
```

### role_profile_links

Назначение: связь роли с районом, объектом, компанией или категорией.

| Column | Type | Notes |
|---|---|---|
| `id` | string | pk |
| `role_profile_id` | string | fk role_profiles.id |
| `target_type` | string | district/object/company/category |
| `target_id` | string | target id |
| `relation_type` | string | works_with/lives_near/reviews/specializes/represents |
| `commercial_status` | string | none/partner/paid/barter/company_confirmed |
| `status` | string | active/pending/rejected/removed |
| `confirmed_by_company_id` | string/null | fk companies.id |
| `created_at` | datetime | |
| `updated_at` | datetime | |

Recommended constraints:

```text
index(role_profile_id, status)
index(target_type, target_id, status)
unique(role_profile_id, target_type, target_id, relation_type) where status != removed
```

### favorite_tags

Назначение: системные и пользовательские причины сохранения.

| Column | Type | Notes |
|---|---|---|
| `id` | string | pk |
| `user_id` | string/null | null for system tags |
| `title` | string | tag label |
| `slug` | string | stable slug |
| `type` | string | system/custom |
| `visibility_default` | string | private/friends/public/aggregate_only |
| `status` | string | active/archived |
| `created_at` | datetime | |
| `updated_at` | datetime | |

Recommended constraints:

```text
unique(user_id, slug) where user_id is not null
unique(slug) where user_id is null
index(type, status)
```

### favorite_tag_assignments

Назначение: связь сохраненной цели и тега.

| Column | Type | Notes |
|---|---|---|
| `user_id` | string | fk users.id |
| `target_type` | string | object/company/district/place/business |
| `target_id` | string | target id |
| `favorite_tag_id` | string | fk favorite_tags.id |
| `visibility` | string | private/friends/public/aggregate_only |
| `created_at` | datetime | |

Recommended primary key:

```text
user_id, target_type, target_id, favorite_tag_id
```

Important rule:

```text
favorite_tag_assignments are signals, not publications.
```

They can power aggregate labels on cards, but they do not grant author/story/news permissions.

### review_author_context

Назначение: public display context for a review.

| Column | Type | Notes |
|---|---|---|
| `review_id` | string | pk, fk reviews.id |
| `author_user_id` | string | fk users.id |
| `author_role_profile_id` | string/null | fk role_profiles.id |
| `public_author_label` | string | Пользователь/Житель района/Риэлтор/... |
| `secondary_author_label` | string/null | double tag |
| `show_real_name` | boolean | depends on privacy |
| `connection_disclosure` | string | none/professional/partner/company_representative |
| `freshness_status` | string | current/needs_confirmation/outdated/withdrawn |
| `confirmed_at` | datetime/null | last freshness confirmation |
| `updated_at` | datetime | |

Recommended indexes:

```text
index(author_user_id)
index(author_role_profile_id)
index(public_author_label)
index(connection_disclosure)
index(freshness_status)
```

Rule:

```text
review_author_context is presentation context, not a substitute for moderation.
```

## 4. API candidates to add later

Do not implement now.

Future auth/social APIs:

```text
GET /me/role-profiles
POST /me/role-profiles
PATCH /me/role-profiles/:roleProfileId
GET /role-profiles/:slug

POST /me/role-profiles/:roleProfileId/verification
GET /me/role-profiles/:roleProfileId/verification

GET /me/favorite-tags
POST /me/favorite-tags
POST /me/favorites/:targetType/:targetId/tags
DELETE /me/favorites/:targetType/:targetId/tags/:tagId
GET /public/targets/:targetType/:targetId/favorite-tag-summary

POST /reviews
PATCH /reviews/:reviewId
POST /reviews/:reviewId/confirm-freshness
POST /reviews/:reviewId/withdraw
GET /public/targets/:targetType/:targetId/recommendation-reviews
```

API response for public review card should include context:

```json
{
  "id": "review_123",
  "target_type": "company",
  "target_id": "cmp_123",
  "text": "Нравится, как компания работает с дворами.",
  "author_context": {
    "label": "Житель района / Риэлтор",
    "show_real_name": false,
    "connection_disclosure": "professional",
    "freshness_status": "current"
  }
}
```

## 5. ROLE-BILL-001: author profile tariff

`Профиль автора` is a B2C role tariff for an individual user. It must not reuse B2B company placement logic as-is.

Working hypothesis:

```text
Plan name: Профиль автора
Price: 990 ₽ / мес
Subject: role_profile, not company
Buyer: user
```

What it gives:

- 1 active public role card;
- role publications;
- role stories;
- role collections;
- external links;
- basic statistics;
- links to districts, objects, companies or categories;
- listing as active specialist/author while subscription is active.

What it does not give:

- official company status;
- company cabinet;
- CRM;
- company leads;
- payment tools for companies;
- hiding commercial relation;
- organic ranking boost;
- status `Эксперт`.

Important product rule:

```text
Payment buys publishing tools and active presence, not trust.
```

## 6. Difference from B2B company tariffs

| Area | B2B company plans | B2C author profile |
|---|---|---|
| Subject | `companies` | `role_profiles` |
| Subscription table | `company_subscriptions` | future `role_profile_subscriptions` |
| Buyer identity | company owner/member | user |
| Primary value | official company placement | public author/specialist presence |
| Cards limit | company/object cards | role profile card, role collections |
| CRM/leads | yes, later | no in first author tariff |
| Company verification | company legal/brand | personal/role verification |
| Stories/posts | company content | role author content |
| Expert status | not relevant | cannot be bought |
| Ranking | placement/features, not organic trust | no bought organic ranking |

Future billing storage should add separate tables instead of overloading company billing:

```text
role_billing_plans
role_profile_subscriptions
role_profile_subscription_events
```

Minimal future `role_billing_plans`:

| Column | Type | Notes |
|---|---|---|
| `id` | string | e.g. author_profile |
| `name` | string | Профиль автора |
| `monthly_price` | number | decision: rubles/kopecks |
| `role_profiles_limit` | number | default 1 |
| `publication_limit` | number/null | owner decision |
| `story_limit` | number/null | owner decision |
| `collection_limit` | number/null | owner decision |
| `external_links_limit` | number/null | owner decision |
| `analytics_level` | string | none/basic |
| `is_available` | boolean | |
| `created_at` | datetime | |
| `updated_at` | datetime | |

Minimal future `role_profile_subscriptions`:

| Column | Type | Notes |
|---|---|---|
| `id` | string | pk |
| `role_profile_id` | string | fk role_profiles.id |
| `user_id` | string | fk users.id |
| `plan_id` | string | fk role_billing_plans.id |
| `status` | string | trial/active/grace/basic/inactive/cancelled/past_due/manual |
| `started_at` | datetime | |
| `paid_until` | datetime/null | |
| `grace_until` | datetime/null | |
| `basic_until` | datetime/null | |
| `cancelled_at` | datetime/null | |
| `created_at` | datetime | |
| `updated_at` | datetime | |

Recommended constraints:

```text
unique(role_profile_id) where status in (trial, active, grace, basic, past_due, manual)
index(user_id, status)
index(plan_id)
index(paid_until)
```

## 7. Non-payment lifecycle

Recommended states:

| State | Timing hypothesis | Role profile behavior |
|---|---|---|
| `active` | paid | full role card, publications, stories, collections, listing |
| `grace` | 0-7 days after failed payment | still active, show payment reminder to owner |
| `basic` | 8-60 days after failed payment | compact profile, no new paid content, lower/no listing priority |
| `inactive` | after 60 days | direct link only, no listing, no new paid content |
| `cancelled` | user cancelled | follows paid_until -> grace/basic/inactive rules |
| `suspended` | moderation/admin | overrides billing and hides/limits profile as needed |

Keep after non-payment:

- role profile record;
- role history;
- reviews;
- verification if not revoked by rules;
- direct link, unless moderation says otherwise.

Disable after non-payment:

- new stories;
- new role publications;
- promotion/listing priority;
- expanded profile card;
- advanced statistics;
- paid collection formats.

## 8. Expert status rule

`Эксперт` must not be a purchasable plan, plan feature or billing status.

If added later, it should be a separate trust/moderation signal based on:

- verification;
- freshness and quality of recommendations;
- role relevance;
- user reactions;
- moderation;
- absence of hidden conflict of interest.

Recommended future field:

```text
role_profiles.trust_status = none/candidate/expert/revoked
```

But `trust_status` must be computed/moderated separately from `subscription_status`.

## 9. What to add to future contracts

### Add to future auth contract

- Account can own multiple `role_profiles`.
- `role_profile` is not `company`.
- `company_member` can confirm a representative role but cannot replace it.
- Add role permissions separate from company permissions:

```text
role_profile.read
role_profile.publish
role_profile.stories.manage
role_profile.collections.manage
role_profile.links.manage
```

- Add review author context and double-tag display rules.
- Add explicit rule: localStorage never grants role permissions.

### Add to future storage contract

- Tables: `role_profiles`, `role_profile_links`, `favorite_tags`, `favorite_tag_assignments`, `review_author_context`.
- Later billing tables: `role_billing_plans`, `role_profile_subscriptions`, `role_profile_subscription_events`.
- Indexes for public role lookup, target summaries, freshness status and billing lifecycle.
- Add `reviews.recommendation_status` and `reviews.last_confirmed_at` or keep freshness entirely in `review_author_context` after schema review.

### Add to future billing contract

- Separate B2C plan namespace from B2B company plans.
- First B2C plan candidate: `author_profile`.
- Subscription subject is `role_profile_id`, not `company_id`.
- Downgrade states: `grace`, `basic`, `inactive`.
- Payment does not buy trust, expert status or organic ranking.
- Company billing and author billing can share payment provider later, but not domain tables or permissions.

## 10. Owner decisions needed

Before implementation, owner must confirm:

1. Tariff name: `Профиль автора`, `Профиль эксперта`, `Профессиональный профиль` or another.
2. Price: keep `990 ₽ / мес` or change.
3. Role list for first release: realtor, reviewer, specialist, company representative.
4. Whether custom favorite tags are allowed in addition to system tags.
5. Standard favorite tag list.
6. Minimum verification for paid role profile.
7. Whether company representative requires active `company_member` or company-side invite.
8. Exact downgrade timing: 7-day grace, 60-day basic, then inactive.
9. Whether inactive role profile remains indexed by search or direct-link only.
10. Which role content limits are included: publications, stories, collections, external links.
11. Whether `Эксперт` exists in v2 or is postponed.
12. Whether implementation belongs to final v1 after backend/auth or v2.

## 11. Risks

### Mixing user profile and role profile

Risk:

- private personal profile accidentally becomes public because role profile is public.

Mitigation:

- personal visibility and role visibility must be separate fields;
- public review card uses `review_author_context`, not raw user profile.

### Mixing role profile and company cabinet

Risk:

- `company_representative` role accidentally receives company cabinet permissions.

Mitigation:

- only `company_members` grants cabinet access;
- `role_profile_links` can display representative context but cannot grant cabinet actions.

### Buying trust

Risk:

- paid author plan looks like purchased `Эксперт` or organic ranking.

Mitigation:

- keep `subscription_status` separate from `trust_status`;
- mark paid/partner/company relations through disclosure.

### Favorite tags become publications

Risk:

- ordinary user tag assignment turns into public author content.

Mitigation:

- tags are private/friends/public/aggregate signals;
- only aggregate summaries appear on public cards unless user explicitly shares.

### Review context drift

Risk:

- review text stays but role/payment/verification state changes.

Mitigation:

- store `freshness_status`, `confirmed_at`, `connection_disclosure`;
- recalculate display context when role link or verification changes.

### Billing table overload

Risk:

- company subscriptions reused for individual role profiles, creating confusing permissions and invoices.

Mitigation:

- introduce `role_profile_subscriptions`;
- payment provider can be shared later, domain subscription tables stay separate.

## 12. Acceptance criteria

ROLE-AUTH-001 / ROLE-BILL-001 follow-up is accepted if:

- role profile entities are placed next to users/reviews/company_members without merging them;
- favorite tags are defined as saved-item signals, not publications;
- review author context handles privacy, role labels, double tags and freshness;
- author profile tariff is separated from B2B company tariffs;
- grace/basic/inactive lifecycle is documented;
- `Эксперт` is explicitly not purchasable;
- owner decisions and integration risks are listed;
- no backend, mock server, adapter, payment or site code changed.
