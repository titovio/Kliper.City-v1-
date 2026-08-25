# Sales Admin / Backoffice Requirements

Дата: 2026-07-08.

Статус: требования к будущей админке продаж и коммерческого управления.

## 1. Назначение

Админка продаж должна позволить Kliper.City управлять коммерческой частью:

- компаниями;
- сделками;
- тарифами;
- размещениями;
- оплатами;
- задачами менеджеров;
- публикациями;
- рекламными местами;
- маркировкой коммерческого контента.

## 2. Роли

| Роль | Права |
|---|---|
| `sales_manager` | lead/deal/contact, tasks, notes |
| `sales_lead` | pipeline, manager reports, discounts approval |
| `commercial_admin` | products, placements, pricing, manual packages |
| `billing_admin` | invoices, payment status, acts, payment method |
| `content_moderator` | commercial labels, stories/posts review |
| `kliper_admin` | full access and audit |

## 3. Разделы админки

### Dashboard

- MRR/ARR;
- paid companies;
- active deals;
- expiring placements;
- overdue tasks;
- unpaid invoices;
- occupancy of placements.

### Companies

- company profile;
- linked public page;
- contacts;
- current plan;
- card limits;
- active placements;
- documents;
- notes.

### Deals

- pipeline board;
- deal card;
- stage history;
- offer/proposal;
- invoice status;
- onboarding status.

### Placements

- inventory map;
- placement calendar;
- active/reserved/expired slots;
- creative/materials;
- labels;
- performance.

### Billing

- subscriptions;
- invoices;
- payment events;
- manual discounts;
- annual promo;
- additional card charges.

### Content / Moderation

- company posts;
- company stories;
- partner materials;
- review replies;
- labels.

### Audit Log

Каждое важное действие должно иметь:

- who;
- what;
- before;
- after;
- when;
- reason.

## 4. MVP админки

Минимум для первого backend/admin этапа:

1. Companies list.
2. Company detail.
3. Deals list/pipeline.
4. Deal detail.
5. Plans/subscription read.
6. Manual status change with audit.
7. Placement/order list.
8. User/manager roles.

## 5. Что не делать в первом admin MVP

- автоматические платежи;
- сложный рекламный календарь;
- массовые рассылки;
- автоматические скидки;
- AI recommendations for sales;
- self-service company checkout.
