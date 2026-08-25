# AUTH-003: billing and plan requirements

Date: 2026-07-06.

Status: requirements only. Payment/backend is not implemented.

## Goal

Extend future backend/auth design with company billing plans.

## Billing Entities

Minimum future entities:

- `billing_plans`;
- `company_subscriptions`;
- `company_plan_features`;
- `company_card_limits`;
- `company_billing_events`;
- `company_payment_methods`;
- `company_invoices`;
- `company_addons`.

## Plan Fields

Each plan should include:

- `id`;
- `name`;
- `monthly_price`;
- `annual_price`;
- `annual_bonus_months`;
- `cards_limit`;
- `photo_limit`;
- `publication_limit`;
- `story_limit`;
- `analytics_level`;
- `special_modules_limit`;
- `is_available`;
- `is_recommended`;

## Company Subscription Fields

Each company subscription should include:

- `company_id`;
- `plan_id`;
- `status`;
- `period`;
- `started_at`;
- `expires_at`;
- `cards_used`;
- `additional_cards_count`;
- `payment_provider`;
- `last_invoice_id`;

## Permissions

| Role | Billing access |
|---|---|
| `company_owner` | can view and change plan |
| `company_manager` | can view plan, cannot change payment |
| `company_editor` | no billing access by default |
| `company_viewer` | no billing access by default |
| `kliper_admin` | can support, verify and adjust manually |

## Feature Gates

Backend must gate:

- official cards count;
- photos count;
- publications per month;
- stories and special modules;
- analytics access;
- notifications to subscribers;
- competitor ads suppression;
- branch/project subscriptions.

## V1 Rule

Current frontend pricing is visual only:

- route `#business-pricing`;
- data file `js/data/company-pricing.js`;
- cabinet block `Тариф и лимиты`;
- no real payment;
- no billing source of truth in localStorage.

## API Candidates

Read endpoints:

```text
GET /billing/plans
GET /companies/:companyId/subscription
GET /companies/:companyId/billing/usage
GET /companies/:companyId/billing/invoices
```

Future mutating endpoints:

```text
POST /companies/:companyId/subscription/change-plan
POST /companies/:companyId/billing/add-card
POST /companies/:companyId/billing/payment-method
POST /companies/:companyId/billing/cancel
```

Do not implement mutating endpoints before auth and payment provider are selected.
