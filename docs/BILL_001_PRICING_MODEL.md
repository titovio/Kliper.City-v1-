# BILL-001: pricing model for company placement

Date: 2026-07-06.

Status: v1 product model and visual implementation, no real payment/backend.

## Goal

Add a B2B pricing layer for companies, developers, business spaces, services and branches.

Pricing belongs to:

- company cabinet;
- company onboarding;
- future company auth/billing;
- not to the ordinary user catalog flow.

## Route

Current v1 route:

```text
#business-pricing
#business-pricing=developerSlug
```

Examples:

```text
#business-pricing
#business-pricing=brusnika
```

If opened from company cabinet, pricing receives the company slug and can return to:

```text
#company-cabinet=developerSlug
```

## Plans

| Plan | Price | Limit | Purpose |
|---|---:|---:|---|
| Бесплатный | `0 ₽ / мес` | 1 card | basic presence |
| Стандарт | `990 ₽ / мес` | 1 official card | small company or one object |
| Бизнес | `2 490 ₽ / мес` | up to 3 official cards | company with several objects |
| Про | `4 990 ₽ / мес` | up to 5 official cards | active company with audience and analytics |
| Максимум | `7 490 ₽ / мес` | up to 10 official cards | developers and multi-object companies |

Additional card over limit:

```text
от 790 ₽ / мес
```

Annual promo:

```text
При оплате за год — 2 месяца бесплатно
```

## V1 Implementation

Implemented files:

- `js/data/company-pricing.js` - pricing data;
- `js/pages/pricing/business-pricing-page.js` - route and UI behavior;
- `css/business-pricing.css` - pricing page styles;
- `js/pages/company-cabinet/company-cabinet-page.js` - `Тариф и лимиты` block in cabinet;
- `css/company-cabinet.css` - company plan block styles.

V1 behavior:

- pricing page is visual only;
- plan buttons do not change billing state;
- selecting a plan shows `После подключения оплаты`;
- company cabinet shows current mock plan and card limit;
- no payment, invoice, subscription change, CRM or backend mutation.

## Company Cabinet Block

Block name:

```text
Тариф и лимиты
```

Shows:

- current plan;
- monthly price;
- used cards;
- card limit;
- annual promo;
- CTA `Изменить тариф`.

The block is informational until backend/auth.

## Ownership

| Chat | Task |
|---|---|
| Architect / Main | pricing model and route decisions |
| Company Cabinet | `CAB-003`: cabinet tariff block |
| Visual System | `VIS-004`: pricing page visual acceptance |
| Backend/Auth | `AUTH-003`: billing and plan requirements |
| Regression QA | `QA-004`: regression after pricing |
| Mobile QA | `MOB-004`: mobile pricing checks |

## Not In V1

- real payment;
- payment provider;
- invoices;
- tariffs changing backend access;
- employee billing permissions;
- paid promotion;
- legal documents and accounting acts.

## Future Backend Rules

Billing must be company-owned, not user-owned.

The server must decide:

- active plan;
- paid status;
- card limits;
- feature gates;
- additional card count;
- annual promo status;
- who can change plan.

Client UI can only display available state.
