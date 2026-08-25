# Sales / Commercial Thread Split

Дата: 2026-07-08.

Статус: предлагаемое разделение коммерческого проекта по чатам.

## 1. Architect / Sales Main

Назначение:

- принимает решения;
- собирает отчеты;
- фиксирует commercial rules;
- не дает чатам смешивать продажи, backend и дизайн.

Задачи:

- коммерческая стратегия;
- приоритизация тарифов и мест;
- owner questions;
- intake отчетов.

## 2. Pricing & Packaging

Зона:

- тарифы компаний;
- доп. карточки;
- годовые скидки;
- promo packages;
- paid modules;
- ограничения тарифов.

Первый вопрос:

```text
Достаточно ли текущих 5 тарифов или нужен отдельный пакет для рекламы/продвижения?
```

## 3. Ad Inventory / Site Placements

Зона:

- все места на сайте, которые можно продать;
- stories placements;
- карточные спецмодули;
- места в каталоге;
- promotion slots;
- category sponsorship;
- no competitor ads zones.

Результат:

- карта всех коммерческих мест;
- правила маркировки;
- v1/v2 boundary.

## 4. Sales CRM / Pipeline

Зона:

- журнал продаж;
- стадии сделки;
- контакты;
- задачи менеджеров;
- предложения;
- счета;
- статусы оплаты;
- причины отказа.

Пример pipeline:

```text
lead -> qualified -> contact_made -> presentation -> proposal_sent -> negotiation -> invoice_sent -> paid -> onboarding -> active -> renewal
```

## 5. Company Onboarding / Customer Success

Зона:

- как подключать компанию;
- какие данные собрать;
- как заполнить карточку;
- как активировать кабинет;
- как объяснить тариф;
- как вести клиента после оплаты.

## 6. Billing / Legal Ops

Зона:

- договор;
- счет;
- акт;
- реквизиты;
- скидки;
- ручной тариф;
- отмена;
- возврат;
- маркировка рекламы/партнерских материалов.

## 7. Admin / Backoffice

Зона:

- что должен уметь кабинет администратора;
- управление компаниями;
- управление тарифами;
- управление рекламными местами;
- moderation;
- audit log;
- permissions.

Важно: этот чат не пишет backend-код, пока не утвержден data contract.

## 8. Analytics / Reports

Зона:

- выручка;
- MRR/ARR;
- активные тарифы;
- conversion funnel;
- менеджеры;
- occupancy рекламных мест;
- эффективность размещений;
- продления и churn.

## 9. QA / Operations Acceptance

Зона:

- проверяет, что коммерческий процесс не конфликтует с продуктом;
- paid placement не маскируется под органику;
- менеджеры не получают лишних прав;
- все действия оставляют audit trail.

## 10. Рекомендуемый порядок запуска чатов

1. Pricing & Packaging.
2. Ad Inventory / Site Placements.
3. Sales CRM / Pipeline.
4. Company Onboarding.
5. Admin / Backoffice.
6. Billing / Legal Ops.
7. Analytics.
8. QA / Operations Acceptance.
