# Sales CRM / Pipeline Model

Дата: 2026-07-08.

Статус: черновая модель журнала продаж Kliper.City.

## 1. Назначение журнала продаж

Журнал продаж нужен, чтобы видеть:

- кого продаем;
- что продаем;
- на какой стадии сделка;
- кто менеджер;
- какие документы и счета нужны;
- что уже оплачено;
- что нужно подключить на сайте;
- какие обещания были даны клиенту.

## 2. Основные сущности

### sales_accounts

Компания или потенциальный клиент.

Поля:

- `id`;
- `name`;
- `segment`;
- `city`;
- `website`;
- `status`;
- `source`;
- `owner_manager_id`;
- `linked_company_id`;
- `notes`.

### sales_contacts

Контакт внутри компании.

Поля:

- `id`;
- `sales_account_id`;
- `name`;
- `role`;
- `phone`;
- `email`;
- `telegram`;
- `decision_maker`;
- `status`.

### sales_deals

Сделка.

Поля:

- `id`;
- `sales_account_id`;
- `title`;
- `product_type`;
- `plan_id`;
- `amount`;
- `period`;
- `stage`;
- `probability`;
- `expected_close_date`;
- `manager_id`;
- `lost_reason`;
- `created_at`;
- `updated_at`.

### sales_activities

Звонки, встречи, сообщения.

Поля:

- `id`;
- `deal_id`;
- `type`;
- `date`;
- `result`;
- `next_step`;
- `manager_id`.

### commercial_orders

То, что должно быть подключено на сайте после продажи.

Поля:

- `id`;
- `deal_id`;
- `company_id`;
- `product`;
- `placement`;
- `start_date`;
- `end_date`;
- `status`;
- `requirements`;
- `approved_by`.

## 3. Стадии сделки

```text
new_lead
qualified
contact_made
presentation
proposal_sent
negotiation
invoice_sent
paid
onboarding
active
renewal
lost
paused
```

## 4. Типы продуктов в сделке

- company_plan;
- additional_card;
- promoted_card;
- story_placement;
- sponsored_collection;
- category_sponsorship;
- special_module;
- analytics_package;
- no_competitor_ads;
- manual_package.

## 5. Статусы подключения

```text
not_started
waiting_content
waiting_payment
in_review
scheduled
active
expired
paused
cancelled
```

## 6. Что нужно для админки

Админка продаж должна позволять:

- создать компанию/lead;
- добавить контакты;
- создать сделку;
- выбрать тариф/продукт;
- создать задачу менеджеру;
- зафиксировать счет/оплату;
- передать задачу на подключение;
- видеть активные размещения;
- видеть срок окончания;
- видеть историю изменений.

## 7. Чего нельзя делать

- включать размещение без статуса оплаты/manual approval;
- обещать органический рейтинг;
- размещать partner material без маркировки;
- давать менеджеру права backend admin без audit log;
- удалять историю сделки.
