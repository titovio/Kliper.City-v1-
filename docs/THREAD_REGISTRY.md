# Kliper.City: реестр рабочих чатов

Дата запуска первой волны: 2026-07-06.

Этот документ фиксирует, какие рабочие чаты созданы в Codex и какую задачу они выполняют.

Текущий главный управляющий чат: **Architect / Main 2**.

Предыдущий **Architect / Main** считается архивным источником контекста после handoff `2026-07-09`.

## Правило координации

1. Все рабочие чаты сначала делают аудит без правки кода.
2. Исправления выдаются только после приемки отчета в Architect / Main.
3. Если задача затрагивает больше одной зоны, решение принимает Architect / Main.
4. `js/app.js` не редактировать без отдельного решения.
5. Результаты значимых проверок фиксировать в `docs/CHANGE_LOG.md` или отдельном отчете в `docs/`.
6. Приемка отчетов идет по `docs/REPORT_INTAKE_PROTOCOL.md`.

## Первая волна

| Роль | Thread ID | Статус | Первая задача |
|---|---|---|---|
| Regression QA | `019f345b-1bb7-77f1-9e03-3befa5fb2330` | второе задание выдано | `QA-001`, `QA-002`: полный smoke v1 и проверка подвисаний |
| Assets/Data Cleanup | `019f345b-94bb-72a3-860b-48c540c0dfa4` | второе задание выдано | `A-004`: план локализации бизнес-галерей и оставшихся внешних ресурсов |
| Filters System | `019f345b-f5d3-78c3-af1e-33da1b8dea52` | второе задание выдано | `FIL-001`, `FIL-002`: patch plan стабилизации фильтров и старых слоев |
| Visual System | `019f345c-4f7f-7fc1-9f23-d5bc823aa36b` | второе задание выдано | `VIS-001`, `VIS-002`: dark theme и единая визуальная сетка |
| Stories & Motion | `019f345c-c40a-7411-915f-46b39b641cac` | второе задание выдано | `STO-001`, `STO-002`, `MOT-001`: state machine, кольца, motion-layer plan |

## Порядок чтения результатов

1. Regression QA.
2. Assets/Data Cleanup.
3. Filters System.
4. Visual System.
5. Stories & Motion.

## Вторая волна

| Роль | Thread ID | Статус | Первая задача |
|---|---|---|---|
| Object Pages | `019f34e5-4692-7311-8406-a76a0e421a85` | запущен | `OBJ-001`, `OBJ-002`: большие страницы ЖК/застройщика, route, назад, modals, dark/mobile |
| Catalog Core | `019f34e5-8bc6-7b90-aad9-37a196dc13cc` | запущен | `CAT-001`, `CAT-002`: actions карточек и list-view trap |
| Business | `019f34e5-d196-7e63-81e7-297c69bce95d` | запущен | `BUS-001`: бизнес-фильтры, selected tags, reset, виды, dark/mobile |
| Profile Social | `019f34e6-2191-7541-8b80-a274fc63a417` | запущен | `PRO-001`: профиль Марии, избранное, подписки, рецензии, route-state |
| Company Cabinet | `019f34e6-78a5-7910-a7af-d1c5ee6a0241` | запущен | `CAB-001`: проектирование кабинета компании для v1 |
| Mobile QA | `019f34e6-c5f1-7682-8fbb-ff5ad174e196` | запущен | `MOB-001`: мобильная приемка 390px/430px |

## Приемка второй волны

Первые отчеты второй волны приняты в Architect / Main.

Закрыто первым safe-fix batch:

- `BUS-002`: business selected-tags/reset сохраняются после `grid/list/map`;
- `OBJ-003`: `Все рецензии` открывает правильную модалку;
- `R-006`: object -> profile очищает stale hash/class;
- `MOB-002`: mobile object page не попадает под верхний header.

Закрыто вторым safe-fix batch:

- `OBJ-004`: `Назад` с ЖК, открытого из каталога, возвращает в исходный каталог, а не на застройщика;
- `CAT-003`: после residential list-view остаются controls `grid/list/map/sort`.

Дополнительно закрыто:

- `CAB-001`: создан v1 UI-экран кабинета компании через `#company-cabinet=developerId` без backend/auth и без правки `js/app.js`.

## Пока не запускать

| Роль | Причина |
|---|---|
| Backend/Auth | Реализацию запускать после принятия `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md` и отдельного implementation brief |

## Третья волна

Актуальные задачи после внедрения `Company Cabinet v1`:

| Роль | Статус | Задача |
|---|---|---|
| Regression QA | выполнено в Architect / Main | `QA-003`: полный smoke после кабинета компании, отчет `QA_003_REGRESSION_REPORT.md` |
| Mobile QA | выполнено в Architect / Main | `MOB-003`: мобильная приемка v1 после кабинета, отчет `MOB_003_MOBILE_QA_REPORT.md` |
| Company Cabinet | выполнено в Architect / Main | `CAB-002`: приемка кабинета компании v1, отчет `CAB_002_COMPANY_CABINET_QA.md` |
| Visual System | выполнено в Architect / Main | `VIS-003`: визуальная приемка v1 после кабинета, отчет `VIS_003_VISUAL_ACCEPTANCE.md` |
| Backend/Auth | требования оформлены | `AUTH-002`: требования к авторизации, ролям и миграции localStorage, документ `AUTH_002_BACKEND_AUTH_REQUIREMENTS.md` |

## Тарифы размещения

| Роль | Статус | Задача |
|---|---|---|
| Architect / Main | выполнено | `BILL-001`: модель тарифов размещения, документ `BILL_001_PRICING_MODEL.md` |
| Company Cabinet | выполнено | `CAB-003`: блок `Тариф и лимиты` в кабинете компании |
| Visual System | выполнено | `VIS-004`: route `#business-pricing` и визуальная страница тарифов |
| Backend/Auth | требования оформлены | `AUTH-003`: billing/auth требования, документ `AUTH_003_BILLING_REQUIREMENTS.md` |
| Regression QA | выполнено в Architect / Main | `QA-004`: smoke после внедрения тарифов, отчет `QA_004_PRICING_REGRESSION_REPORT.md` |
| Mobile QA | выполнено в Architect / Main | `MOB-004`: mobile-проверка тарифов, отчет `MOB_004_PRICING_MOBILE_QA.md` |

## Backend/Auth contracts

Отдельный рабочий чат Backend/Auth:

```text
019f3961-80cd-72e3-b9d9-ed298036cbf9
```

| Роль | Статус | Задача |
|---|---|---|
| Backend/Auth | контракт оформлен | `AUTH-004`: единый backend/auth контракт v1, документ `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md` |
| Backend/Auth | brief оформлен | `AUTH-005`: первый backend implementation brief, документ `AUTH_005_BACKEND_IMPLEMENTATION_BRIEF.md` |
| Backend/Auth | storage plan оформлен | `AUTH-006`: storage/schema plan, документ `AUTH_006_STORAGE_SCHEMA_PLAN.md` |
| Backend/Auth + Frontend Integration | adapter plan оформлен | `AUTH-007`: frontend API adapter с mock fallback, документ `AUTH_007_FRONTEND_API_ADAPTER_PLAN.md` |
| Backend/Auth | stack checklist оформлен | `AUTH-008`: backend stack decision checklist, документ `AUTH_008_BACKEND_STACK_DECISION_CHECKLIST.md` |
| Backend/Auth | mock API contract оформлен | `AUTH-009A`: API mock server contract and sample responses, документ `AUTH_009A_API_MOCK_SERVER_CONTRACT.md` |
| Backend/Auth | заблокировано до решения | `AUTH-009`: первый read-only backend slice |
| Frontend Integration | skeleton реализован | `AUTH-010`: frontend API adapter подключен, disabled by default, документ `AUTH_010_FRONTEND_API_ADAPTER_SKELETON.md` |
| Frontend Integration + QA | выполнено | `AUTH-011`: adapter acceptance, dev-toggle и mock server, документ `AUTH_011_ADAPTER_ACCEPTANCE_AND_DEV_TOGGLE.md` |
| Backend/Auth | stack decision принято | `AUTH-012`: Node/Fastify + PostgreSQL + Prisma + httpOnly sessions, документ `AUTH_012_BACKEND_STACK_DECISION.md` |
| Backend/Auth | отдельный чат создан, задача выдана | `AUTH-013`: backend scaffold plan and file boundary |

## UX-005: layout/usability audit wave

| Роль | Статус | Задача |
|---|---|---|
| Regression QA | `SMOKE-ENV-001` выполнен в Architect/Main, retry частично принят | `UXQA-001` -> `UXFIX-QA-001` -> `UXFIX-FINAL-QA-001`; remaining watch: object card click automation |
| Visual System | отчет принят как контекст | `UXVIS-001`: нет отдельного immediate P1 после дедупликации |
| Mobile QA | retry частично принят | `UXMOB-001` -> `UXFIX-FINAL-MOB-001`; business reset/count fixed, tap targets remain P2 |
| Filters System | fix accepted | `UXFIL-001` -> `UXFIX-FIL-001` |
| Stories & Motion | fix accepted | `UXSTO-001` -> `UXFIX-STO-001` |
| Catalog Core | fix accepted | `UXCAT-001` -> `UXFIX-CAT-001` |
| Object Pages | fix accepted | `UXOBJ-001` -> `UXFIX-OBJ-001` |
| Business | review accepted | `UXBUS-001` -> `UXFIX-BUS-REVIEW-001` |
| Profile Social | fix accepted | `UXPRO-001` -> `UXFIX-PRO-001` |
| Company Cabinet | fixes accepted | `UXCAB-001` -> `UXFIX-CAB-001`, `UXFIX-CAB-002` |

## Product / UX Lab

Отдельный продуктовый чат для гипотез, улучшения страниц и v1/v2 сценариев:

```text
019f397a-2161-76a1-af2f-3e366a6c81f1
```

| Роль | Статус | Задача |
|---|---|---|
| Product / UX Lab | `PRODUCT-001` создан, идет продуктовая проработка | `PRODUCT-001`: карта направлений улучшения Kliper.City; текущий блок: доверие и маркировка контента |

## Role Profiles / Favorite Tags handoff

Документы:

- `docs/ROLE_PROFILES_SCOPE.md`;
- `docs/ROLE_PROFILES_OWNER_BRIEF.md`;
- `docs/ROLE_PROFILES_TASK_BRIEFS.md`;
- `docs/ROLE_PROFILES_REPORT_INTAKE.md`;
- `docs/ROLE_AUTH_APPENDIX.md`.

Статус: задачи разосланы в профильные чаты как документационные briefs без разрешения на код; отчеты приняты в `docs/ROLE_PROFILES_REPORT_INTAKE.md`.

| Роль | Thread ID | Статус | Задача |
|---|---|---|---|
| Profile Social | `019f34e6-2191-7541-8b80-a274fc63a417` | выдано | `ROLE-PRO-001`, `ROLE-PRO-002`: CTA профессионального профиля и теги любимого |
| Catalog Core | `019f34e5-8bc6-7b90-aad9-37a196dc13cc` | выдано | `ROLE-CAT-001`: карточный сигнал `лайк + тег любимого` |
| Object Pages | `019f34e5-4692-7311-8406-a76a0e421a85` | выдано | `ROLE-OBJ-001`: верх рецензий-рекомендаций |
| Backend/Auth | `019f3961-80cd-72e3-b9d9-ed298036cbf9` | выдано | `ROLE-AUTH-001`, `ROLE-BILL-001`: future auth/data/billing planning |
| Visual System | `019f345c-4f7f-7fc1-9f23-d5bc823aa36b` | выдано | `ROLE-VIS-001`: бейджи ролей, двойные теги, подтверждение |
| Stories & Motion | `019f345c-c40a-7411-915f-46b39b641cac` | выдано | `ROLE-STO-001`: граница stories для обычных и ролевых пользователей |
| Regression QA | `019f345b-1bb7-77f1-9e03-3befa5fb2330` | выдано | `ROLE-QA-001`: future checklist разделения личного/ролевого/компании |
| Mobile QA | `019f34e6-c5f1-7682-8fbb-ff5ad174e196` | выдано | `ROLE-QA-001`: mobile future checklist для ролевых профилей |

Следующая пачка выдана после приемки отчетов:

| Роль | Thread ID | Статус | Задача |
|---|---|---|---|
| Product / UX Lab | `019f397a-2161-76a1-af2f-3e366a6c81f1` | отчет принят | `ROLE-OWNER-001`: принять owner decision pack |
| Profile Social | `019f34e6-2191-7541-8b80-a274fc63a417` | отчет принят | `ROLE-PRO-003`: CTA и privacy flow |
| Catalog Core | `019f34e5-8bc6-7b90-aad9-37a196dc13cc` | отчет принят | `ROLE-CAT-002`: favorite-tag aggregates |
| Object Pages | `019f34e5-4692-7311-8406-a76a0e421a85` | отчет принят | `ROLE-OBJ-002`: блок `Почему советуют` |
| Backend/Auth | `019f3961-80cd-72e3-b9d9-ed298036cbf9` | отчет принят | `ROLE-AUTH-002`: delta к auth/storage contracts после owner decisions |
| Visual System | `019f345c-4f7f-7fc1-9f23-d5bc823aa36b` | отчет принят | `ROLE-VIS-002`: token/spec role/trust labels |
| Stories & Motion | `019f345c-c40a-7411-915f-46b39b641cac` | отчет принят | `ROLE-STO-002`: labels и источники role stories |
| Regression QA | `019f345b-1bb7-77f1-9e03-3befa5fb2330` | отчет принят | `ROLE-QA-002`: acceptance matrix |
| Mobile QA | `019f34e6-c5f1-7682-8fbb-ff5ad174e196` | отчет принят | `ROLE-QA-002`: mobile acceptance matrix |
| Company Cabinet | `019f34e6-78a5-7910-a7af-d1c5ee6a0241` | отчет принят | `CAB-ROLE-001`: company representative vs cabinet boundary |

Итог второй пачки зафиксирован в `docs/ROLE_PROFILES_SECOND_HANDOFF_INTAKE.md`.

Третья пачка после утверждения владельцем:

| Роль | Thread ID | Статус | Задача |
|---|---|---|---|
| Backend/Auth | `019f3961-80cd-72e3-b9d9-ed298036cbf9` | выдано | `AUTH-014`: sync approved role decisions with auth/storage roadmap |
| Product / UX Lab | `019f397a-2161-76a1-af2f-3e366a6c81f1` | выдано | `PRODUCT-003`: v1/v2 roadmap and owner summary |
| Profile Social | `019f34e6-2191-7541-8b80-a274fc63a417` | выдано | `ROLE-PRO-004`: approved CTA/privacy spec |
| Catalog Core | `019f34e5-8bc6-7b90-aad9-37a196dc13cc` | выдано | `ROLE-CAT-003`: approved favorite-tag aggregate spec |
| Object Pages | `019f34e5-4692-7311-8406-a76a0e421a85` | выдано | `ROLE-OBJ-003`: approved `Почему советуют` spec |
| Visual System | `019f345c-4f7f-7fc1-9f23-d5bc823aa36b` | выдано | `ROLE-VIS-003`: approved role/trust token plan |
| Stories & Motion | `019f345c-c40a-7411-915f-46b39b641cac` | выдано | `ROLE-STO-003`: approved story source/label rules |
| Company Cabinet | `019f34e6-78a5-7910-a7af-d1c5ee6a0241` | выдано | `CAB-ROLE-002`: approved representative boundary |
| Regression QA | `019f345b-1bb7-77f1-9e03-3befa5fb2330` | выдано | `ROLE-QA-003`: approved future acceptance gates |
| Mobile QA | `019f34e6-c5f1-7682-8fbb-ff5ad174e196` | выдано | `ROLE-MOB-003`: approved mobile future gates |

## V1 functional completion

| Роль | Thread ID | Статус | Задача |
|---|---|---|---|
| Product / UX Lab + Architect / Main | `019f397a-2161-76a1-af2f-3e366a6c81f1` | подготовлено | `PRODUCT-004`: функциональный owner-test v1 перед дизайном/backend/admin |
| Filters System | `019f345b-f5d3-78c3-af1e-33da1b8dea52` | принято Architect / Main 2 | `FUNC-FIL-001`, `FILTERS-COPY-001`: residential filters/copy accepted with automation limitations |
| Stories & Motion | `019f345c-c40a-7411-915f-46b39b641cac` | отчет принят с ограничением | `FUNC-STO-001`: state/ring report accepted, no new state-machine patch authorized |
| Object Pages | `019f34e5-4692-7311-8406-a76a0e421a85` | retry принят с watch | `OBJ-FUNC-RETRY-001`: no confirmed product P0/P1; route/back remains manual visible-browser WATCH |
| Profile Social | `019f34e6-2191-7541-8b80-a274fc63a417` | отчет принят с ограничением | `FUNC-PRO-001`: profile showcase accepted by code-level review; clean mobile/dark smoke remains environment-limited |
| Company Cabinet | `019f34e6-78a5-7910-a7af-d1c5ee6a0241` | retry принят с watch | `CAB-FUNC-RETRY-001`: PASS with WATCH; no P0/P1, fallback-data/copy polish is P2 |
| Mobile QA | `019f34e6-c5f1-7682-8fbb-ff5ad174e196` | closure принят с watch | `MOB-FUNC-CLOSURE-001`: no current mobile P0/P1; P2 tap targets and manual visible-browser pass remain |
| Visual System | `019f345c-4f7f-7fc1-9f23-d5bc823aa36b` | P2 plan выдан | `UXVIS-TAP-001`: plan-only tap target polish, no code until Architect/Main approval |
