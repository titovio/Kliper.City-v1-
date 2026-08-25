# AUTH-002: backend/auth requirements for users and companies

Date: 2026-07-06.

Status: requirements only. Backend implementation is not started.

## Goal

Prepare the future backend/auth layer so Kliper.City can support:

- ordinary users;
- company/developer accounts;
- role-based company cabinet access;
- billing plans and company limits;
- migration from local UI state to backend state.

## Account Types

| Account | Purpose |
|---|---|
| `user` | ordinary Kliper user: likes, subscriptions, reviews, profile, social functions |
| `company` | legal/company workspace linked to developer or business entity |
| `admin` | Kliper moderation and support role |

One person can have both a user profile and company access, but the UI contexts must remain separated.

## Company Roles

| Role | Access |
|---|---|
| `company_owner` | full access, company settings, roles, publish controls |
| `company_manager` | dialogs, reviews, offers, statistics |
| `company_editor` | posts, stories, drafts, media |
| `company_viewer` | read-only dashboard |
| `kliper_admin` | moderation, company verification, support |

## Route Rules

| Route | Meaning |
|---|---|
| `#card=CompanyName` | public company/developer page |
| `#company-cabinet=developerSlug` | private company cabinet UI |

Do not merge company cabinet into `#card=...&mode=cabinet`.

## Data Ownership

User-owned data:

- liked cards;
- subscriptions;
- reviews;
- profile info;
- future friends and public collections.

Company-owned data:

- company profile status;
- employees and roles;
- company posts;
- company stories;
- object links;
- reviews requiring company response;
- dialogs/requests;
- draft offers;
- document verification statuses.

## LocalStorage Migration

Current local state should become temporary UI cache only.

Future namespaces:

| Namespace | Use |
|---|---|
| `kliper.user.*` | temporary user cache |
| `kliper.companyCabinet.*` | temporary company UI cache |
| `kliper.auth.*` | short-lived auth UI state only, not tokens if avoidable |

Migration rule:

1. Read old localStorage keys.
2. Map them to backend entities after login.
3. Keep localStorage only as cache.
4. Never use localStorage as source of permissions.

## Minimal Backend Entities

Required first:

- `users`;
- `companies`;
- `company_members`;
- `roles`;
- `developers`;
- `objects`;
- `likes`;
- `subscriptions`;
- `reviews`;
- `company_posts`;
- `company_stories`;
- `company_dialogs`;
- `company_offers`;
- `company_documents`;
- `billing_plans`;
- `company_subscriptions`.

## First API Surface

Candidate endpoints:

```text
GET /me
GET /me/profile
GET /companies/:companyId/cabinet
GET /companies/:companyId/members
GET /companies/:companyId/objects
GET /companies/:companyId/reviews
GET /companies/:companyId/dialogs
GET /companies/:companyId/posts
GET /companies/:companyId/stories
GET /billing/plans
GET /companies/:companyId/subscription
```

Mutating endpoints should wait until owner confirms v1 scope:

```text
POST /reviews/:reviewId/company-reply
POST /companies/:companyId/posts
POST /companies/:companyId/stories
POST /companies/:companyId/offers
POST /companies/:companyId/documents
```

Billing mutating endpoints are described separately in `AUTH_003_BILLING_REQUIREMENTS.md` and must wait until auth and payment provider decisions.

## Security Rules

- Server decides permissions.
- Client only hides or shows UI.
- Company cabinet requires membership in the company.
- `company_owner` can invite/remove employees.
- `kliper_admin` can verify companies, but admin UI should be separate.
- Public profile and private cabinet must never share private company data.

## V1 Decision

For current v1:

- keep cabinet visual/mock;
- keep pricing and plan state visual/mock;
- do not add real CRM;
- do not add real document upload;
- do not add real payment;
- do not send offers;
- do not implement backend yet;
- use this file as the contract before backend/auth starts.

Related billing document:

- `AUTH_003_BILLING_REQUIREMENTS.md`.
