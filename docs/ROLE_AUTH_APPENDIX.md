# ROLE-AUTH appendix: future role profiles and favorite tags

Дата: 2026-07-07.

Статус: backend/auth planning appendix. Backend не реализован. Это не изменение `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md`, а будущий слой к обсуждению после owner approval.

Связанные документы:

- `docs/ROLE_PROFILES_SCOPE.md`;
- `docs/ROLE_PROFILES_OWNER_BRIEF.md`;
- `docs/ROLE_PROFILES_TASK_BRIEFS.md`;
- `docs/AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md`;
- `docs/AUTH_006_STORAGE_SCHEMA_PLAN.md`.

## 1. Принцип

Ролевой профиль физлица не является компанией.

Один `user` может иметь:

- личный профиль;
- один или несколько `role_profiles`;
- доступ к `company_members`, если он также участник компании.

Эти контексты нельзя смешивать:

```text
user profile != role profile != company cabinet
```

## 2. Candidate entities

### role_profiles

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | ID ролевого профиля |
| `user_id` | string | владелец |
| `role_type` | string | realtor/reviewer/specialist/company_representative |
| `display_name` | string | публичное имя роли |
| `slug` | string | публичный slug |
| `status` | string | draft/active/basic/inactive/suspended |
| `verification_status` | string | unverified/pending/verified_by_kliper/verified_by_company/rejected |
| `subscription_status` | string | none/trial/active/grace/basic/inactive/cancelled |
| `bio` | string/null | описание |
| `avatar_url` | string/null | аватар роли |
| `external_links` | json | Telegram, YouTube, сайт, портфолио |
| `created_at` | datetime | дата создания |
| `updated_at` | datetime | дата обновления |

### role_profile_links

Связи роли с районами, объектами, компаниями или категориями.

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | ID связи |
| `role_profile_id` | string | роль |
| `target_type` | string | district/object/company/category |
| `target_id` | string | цель |
| `relation_type` | string | works_with/lives_near/reviews/specializes/represents |
| `commercial_status` | string | none/partner/paid/barter/company_confirmed |
| `status` | string | active/pending/rejected/removed |
| `confirmed_by_company_id` | string/null | подтверждение компании |

### favorite_tags

Стандартные и пользовательские теги любимого.

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | ID тега |
| `user_id` | string/null | null для системного тега |
| `title` | string | название |
| `slug` | string | slug |
| `type` | string | system/custom |
| `visibility_default` | string | private/friends/public |

### favorite_tag_assignments

Связь сохраненного объекта и тега.

| Поле | Тип | Описание |
|---|---|---|
| `user_id` | string | пользователь |
| `target_type` | string | object/company/district/place/business |
| `target_id` | string | цель |
| `favorite_tag_id` | string | тег |
| `visibility` | string | private/friends/public/aggregate_only |
| `created_at` | datetime | дата |

### review_author_context

Будущий слой поверх `reviews`, чтобы не смешивать имя автора, роль и приватность.

| Поле | Тип | Описание |
|---|---|---|
| `review_id` | string | рецензия |
| `author_user_id` | string | пользователь |
| `author_role_profile_id` | string/null | роль, если рецензия написана от роли |
| `public_author_label` | string | Пользователь/Житель района/Риэлтор/... |
| `secondary_author_label` | string/null | второй тег: Риэлтор/Специалист/... |
| `show_real_name` | boolean | показывать имя |
| `connection_disclosure` | string | none/professional/partner/company_representative |
| `freshness_status` | string | current/needs_confirmation/outdated/withdrawn |
| `confirmed_at` | datetime/null | последнее подтверждение |
| `updated_at` | datetime | дата обновления |

## 3. Candidate API later

Не реализовывать до решения владельца.

### Role profile

```text
GET /me/role-profiles
POST /me/role-profiles
PATCH /me/role-profiles/:roleProfileId
GET /role-profiles/:slug
```

### Verification

```text
POST /me/role-profiles/:roleProfileId/verification
GET /me/role-profiles/:roleProfileId/verification
```

### Favorite tags

```text
GET /me/favorite-tags
POST /me/favorite-tags
POST /me/favorites/:targetType/:targetId/tags
DELETE /me/favorites/:targetType/:targetId/tags/:tagId
GET /public/targets/:targetType/:targetId/favorite-tag-summary
```

### Review context and freshness

```text
POST /reviews
PATCH /reviews/:reviewId
POST /reviews/:reviewId/confirm-freshness
POST /reviews/:reviewId/withdraw
GET /public/targets/:targetType/:targetId/recommendation-reviews
```

### Role billing later

```text
GET /role-billing/plans
GET /me/role-profiles/:roleProfileId/subscription
POST /me/role-profiles/:roleProfileId/subscription/change-plan
```

## 4. Permission rules

- localStorage never grants role permissions.
- `role_profile` does not grant company permissions.
- `company_member` does not automatically grant personal expert status.
- `verified_by_company` applies only to the confirmed company relation.
- expired subscription does not delete role history.
- subscription can change discovery/listing state: active/basic/inactive.

## 5. Review display rules

For public cards:

- review text can be visible even if personal profile is private;
- real name is hidden unless allowed;
- public author context must be visible;
- double tag appears when professional relation is relevant;
- partner/company material is not displayed as independent recommendation;
- outdated recommendations stay visible only with freshness status or lower weight.

Example:

```json
{
  "review_id": "review_123",
  "target_type": "company",
  "target_id": "company_123",
  "text": "Нравится, как компания работает с дворами и навигацией.",
  "author": {
    "display": "Житель района / Риэлтор",
    "show_real_name": false,
    "connection_disclosure": "professional"
  },
  "freshness_status": "current",
  "updated_at": "2026-07-07T00:00:00Z"
}
```

## 6. Open owner decisions

See `docs/ROLE_PROFILES_OWNER_BRIEF.md`.

Critical before implementation:

- tariff name and price;
- standard favorite tags;
- custom tags allowed or not;
- minimum role verification;
- downgrade timing after non-payment;
- v1 final vs v2 implementation stage.
