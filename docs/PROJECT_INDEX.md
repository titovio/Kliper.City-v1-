# Kliper.City Project Control Center

Этот файл - главный вход для любого чата, который работает с проектом Kliper.City.

Перед началом работы чат должен прочитать:

1. `AGENTS.md` - обязательные правила работы с кодом.
2. `docs/PROJECT_INDEX.md` - текущий центр управления проектом.
3. Документ своей зоны из `docs/CHAT_OWNERSHIP.md`.
4. `docs/REGRESSION_CHECKLIST.md` - что проверять после изменений.

## Текущее состояние

Kliper.City v1 - статический SPA на `index.html` с основным legacy/generated-бандлом `js/app.js` и дополнительными JS/CSS-модулями поверх него.

Главная особенность проекта: почти весь сайт находится в одной SPA-странице, а разделы переключаются состоянием приложения, hash `#card=...`, DOM-модулями и CSS-полировками.

## Главная цель ближайшего этапа

Не добавлять хаотично новые функции, а стабилизировать v1:

- каталоги;
- карточки;
- stories;
- фильтры;
- профиль;
- бизнес-раздел;
- mobile;
- dark theme;
- плавность без подвисаний.

## Документы проекта

| Файл | Для чего нужен |
|---|---|
| `VERSION_1_AUDIT.md` | Фактический аудит текущей версии |
| `PROJECT_CORE.md` | Ядро связей проекта: загрузка, globals, маршруты, зоны и команды codebase-memory-mcp |
| `SITE_MAP.md` | Карта страниц и режимов SPA |
| `PAGE_PASSPORTS.md` | Паспорт каждой страницы/зоны |
| `DATA_STRUCTURE.md` | Сущности, массивы и localStorage |
| `UI_AND_CHANGE_RULES.md` | Общие правила UI и правок |
| `CHAT_OWNERSHIP.md` | Кто за какую зону отвечает |
| `REGRESSION_CHECKLIST.md` | Что проверять после задач |
| `TASK_BRIEF_TEMPLATE.md` | Шаблон постановки задачи чату |
| `PROJECT_DECISIONS.md` | Зафиксированные решения |
| `OWNER_DECISIONS_QUEUE.md` | Где нужен владелец проекта |
| `CHANGE_LOG.md` | Журнал изменений и проверок |
| `BASELINE_REGRESSION_REPORT.md` | Точка отсчета текущего состояния сайта |
| `TEST_INFRASTRUCTURE.md` | Стабильные селекторы для smoke/regression-проверок |
| `STAGE_1_CLOSURE.md` | Финальное закрытие организационного этапа |
| `MOTION_RULES.md` | Правила использования Motion |
| `V1_V2_ROADMAP.md` | Разделение текущего и будущего этапов |
| `V1_FUNCTIONAL_OWNER_TEST.md` | Тест-опрос владельца по функциям всех страниц v1 перед дизайном/backend/admin |
| `V1_FUNCTIONAL_RECOMMENDED_ANSWERS.md` | Рекомендованные ответы Architect / Main по функциям всех страниц v1 |
| `V1_FUNCTIONAL_DECISIONS.md` | Утверждаемая функциональная граница v1: что входит сейчас, что уходит в backend/v2 |
| `V1_PAGE_COMPLETION_MATRIX.md` | Матрица готовности страниц и функциональных разрывов v1 |
| `V1_FUNCTIONAL_AUDIT_INTAKE.md` | Приемка функционального аудита и задачи профильным чатам |
| `FUNC_001_WORKSTREAM_REPORT_INTAKE.md` | Приемка первых отчетов FUNC-задач и решение по readiness для `Готовые ЖК` |
| `V1_FUNCTIONAL_CLOSURE_STATUS.md` | Текущий статус functional closure v1, manual visible-browser gate и P2 polish queue |
| `ARCHITECT_MAIN_2_HANDOFF.md` | Передача управления от перегруженного Architect / Main к Architect / Main 2 |
| `AI_EXECUTIVE_CENTER_CONSTITUTION.md` | Корпоративная "конституция" проекта: миссия, AI-команда, регламенты, качество, KPI и развитие |
| `AI_EXECUTIVE_CENTER_OWNER_READER.md` | Читабельная версия конституции AI Executive Center для владельца проекта |
| `sales_commercial/SALES_COMMERCIAL_PROJECT_INDEX.md` | Стартовый индекс отдельного Sales / Commercial проекта |
| `sales_commercial/SALES_COMMERCIAL_SCOPE.md` | Scope коммерческой части: что продаем, кому, что не продаем как органику |
| `sales_commercial/SALES_COMMERCIAL_THREAD_SPLIT.md` | Разделение Sales / Commercial проекта по чатам |
| `sales_commercial/SALES_CRM_PIPELINE_MODEL.md` | Модель журнала продаж, сделок, активностей и commercial orders |
| `sales_commercial/SALES_AD_INVENTORY_MAP.md` | Карта рекламных и платных мест на сайте |
| `sales_commercial/SALES_ADMIN_BACKOFFICE_REQUIREMENTS.md` | Требования к будущей sales/admin backoffice |
| `sales_commercial/SALES_DATA_REQUEST.md` | Какие данные владельцу собрать для sales-чата |
| `sales_commercial/SALES_COMMERCIAL_CHAT_STARTER.md` | Готовый стартовый prompt для нового sales-чата |
| `AUTONOMY_PROTOCOL.md` | Что можно делать без владельца |
| `WORKSTREAM_PROMPTS.md` | Готовые промпты для отдельных чатов |
| `CHAT_TASK_BACKLOG.md` | Отдельные задачи по рабочим чатам |
| `THREAD_REGISTRY.md` | Реестр созданных рабочих чатов и порядок координации |
| `REPORT_INTAKE_PROTOCOL.md` | Как принимать отчеты рабочих чатов и превращать их в задачи |
| `FIX_QUEUE.md` | Очередь кандидатов на исправления после приемки отчетов |
| `pages-company-cabinet.md` | Паспорт v1 кабинета компании |
| `SOCIAL_FEATURES_SCOPE.md` | Правила полноценного социального слоя |
| `ROLE_PROFILES_SCOPE.md` | Продуктовая модель ролевых профилей, рецензий, тегов любимого и тарифа автора |
| `ROLE_PROFILES_OWNER_BRIEF.md` | Краткий бриф владельцу по ролевым профилям и решениям перед реализацией |
| `ROLE_PROFILES_OWNER_DECISION_PACK.md` | Пакет конкретных решений владельца по CTA, тарифу, ролям, privacy, тегам, рецензиям и этапам |
| `ROLE_PROFILES_OWNER_QUESTIONS.md` | Короткий лист из 7 вопросов владельцу для подтверждения role-profile решений |
| `ROLE_PROFILES_RECOMMENDED_OWNER_ANSWERS.md` | Рекомендованные ответы Architect / Main на 7 вопросов владельца по role profiles |
| `ROLE_PROFILES_APPROVED_HANDOFF.md` | Handoff после утверждения владельцем role-profile решений и третья пачка задач чатам |
| `ROLE_OWNER_001_DECISION_PACK_REVIEW.md` | Приемка Product / UX Lab по owner decision pack D1-D10 |
| `ROLE_PROFILES_TASK_BRIEFS.md` | ТЗ для профильных чатов по ролевым профилям, тегам любимого, рецензиям и тарифу автора |
| `ROLE_PROFILES_REPORT_INTAKE.md` | Приемка отчетов профильных чатов по role profiles, favorite tags, trust badges, stories и future backlog |
| `ROLE_PROFILES_SECOND_HANDOFF_INTAKE.md` | Приемка второй пачки отчетов: owner decisions, CTA/privacy, aggregates, reviews, badges, stories, QA matrix |
| `ROLE_AUTH_APPENDIX.md` | Backend/auth appendix для будущих role profiles, favorite tags и review context |
| `ROLE_AUTH_BILL_001_BACKEND_FOLLOWUP.md` | Backend/Auth follow-up по role profiles, favorite tags, review author context и тарифу физлица |
| `ROLE_AUTH_002_AUTH_STORAGE_CONTRACT_DELTA.md` | Contract delta к AUTH-004/AUTH-006 после owner decisions по role profiles |
| `CAB_ROLE_001_COMPANY_REPRESENTATIVE_BOUNDARY.md` | Граница публичной роли `Представитель компании`, company membership и кабинета компании |
| `QA_003_REGRESSION_REPORT.md` | Regression smoke после кабинета компании |
| `MOB_003_MOBILE_QA_REPORT.md` | Mobile QA после кабинета компании |
| `CAB_002_COMPANY_CABINET_QA.md` | QA кабинета компании по всем застройщикам |
| `CAB_004_COMPANY_CABINET_V1_POLISH.md` | Полировка кабинета компании v1 после тарифов |
| `CAB_005_COMPANY_CABINET_V1_ACCEPTANCE.md` | Финальная приемка кабинета компании v1-прототипа |
| `VIS_003_VISUAL_ACCEPTANCE.md` | Визуальная приемка v1 после кабинета |
| `AUTH_002_BACKEND_AUTH_REQUIREMENTS.md` | Требования к будущей авторизации и ролям |
| `BILL_001_PRICING_MODEL.md` | Модель тарифов размещения для компаний |
| `AUTH_003_BILLING_REQUIREMENTS.md` | Требования к billing, планам и лимитам |
| `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md` | Единый backend/auth контракт v1: роли, сущности, API, CRM, billing |
| `AUTH_005_BACKEND_IMPLEMENTATION_BRIEF.md` | Первый backend implementation brief: read-only auth/company/billing slice |
| `AUTH_006_STORAGE_SCHEMA_PLAN.md` | Storage/schema plan: таблицы, индексы, seed/import, связи data-файлов |
| `AUTH_007_FRONTEND_API_ADAPTER_PLAN.md` | Frontend API adapter plan: mock fallback, API states, integration order |
| `AUTH_008_BACKEND_STACK_DECISION_CHECKLIST.md` | Backend stack decision checklist: DB, hosting, auth/session, providers |
| `AUTH_009A_API_MOCK_SERVER_CONTRACT.md` | API mock contract: sample responses for health, me, billing, cabinet, migration |
| `AUTH_010_FRONTEND_API_ADAPTER_SKELETON.md` | Frontend API adapter skeleton: disabled-by-default mock fallback |
| `AUTH_011_ADAPTER_ACCEPTANCE_AND_DEV_TOGGLE.md` | Adapter acceptance, dev URL toggle and dependency-free mock server |
| `AUTH_012_BACKEND_STACK_DECISION.md` | Final backend stack decision: Node/Fastify, PostgreSQL, Prisma, cookie sessions |
| `AUTH_013_BACKEND_SCAFFOLD_PLAN.md` | Backend scaffold plan and file boundary before real backend code |
| `AUTH_014_ROLE_DECISIONS_CONTRACT_ROADMAP.md` | Approved role-profile decisions sync with auth/storage/contracts roadmap |
| `UX_005_SITE_LAYOUT_USABILITY_AUDIT_WAVE.md` | Задачи волны аудита удобства, слоев, подсветок, overlap и technical UX |
| `UX_005_REPORT_INTAKE.md` | Приемка отчетов UX-005, дедупликация дефектов и маршрутизация исправлений по чатам |
| `PRODUCT_UX_LAB_PRODUCT_001.md` | Карта продуктовых направлений, v1/v2 сценарии, onboarding, social mechanics и value-гипотезы |
| `PRODUCT_003_ROLE_PROFILE_V1_V2_SUMMARY.md` | Owner-facing summary после approval role-profile решений и обновления v1/v2 рамки |
| `QA_004_PRICING_REGRESSION_REPORT.md` | Regression smoke после внедрения тарифов |
| `MOB_004_PRICING_MOBILE_QA.md` | Mobile QA страницы тарифов |

## Базовые правила

1. Не редактировать `js/app.js` для обычных UI/CSS-правок.
2. Не менять соседние зоны без явного разрешения.
3. Не делать большой рефакторинг без отдельного решения.
4. Любая задача должна иметь зону, цель, список разрешенных файлов и чеклист проверки.
5. После значимой правки проверять desktop, mobile, dark theme и консоль.
6. Скрытые разделы не удалять без решения владельца.
7. Motion использовать только через единый слой и без массовых анимаций всего сайта.

## Как работать нескольким чатам

Работа идет через роли:

- Architect / Main Chat принимает решения и фиксирует правила.
- Product / UX Lab проверяет продуктовые гипотезы, улучшения страниц и v1/v2 сценарии без правки кода.
- Domain Chat делает точечную работу в своей зоне.
- Regression Chat проверяет весь сайт после изменений.
- Owner Decisions Queue собирает вопросы, где нужен владелец.

Созданные рабочие чаты и их очередность зафиксированы в `THREAD_REGISTRY.md`.

Правила приемки отчетов рабочих чатов зафиксированы в `REPORT_INTAKE_PROTOCOL.md`.

Если задача касается двух зон, сначала нужен короткий бриф в Architect / Main Chat.

## Текущая техническая база

| Область | Статус |
|---|---|
| Основной сайт | `index.html` |
| Основной app | `js/app.js`, legacy/generated |
| Основная UI-полировка | `css/ui-ux-pro-max.css` |
| Stories | `css/story-categories.css`, `js/behavior/story-categories.js` |
| Бизнес | `css/business-spaces.css`, `js/catalog/business-spaces.js`, `js/pages/business-filter-polish.js` |
| Кабинет компании | `css/company-cabinet.css`, `js/data/company-cabinet.js`, `js/pages/company-cabinet/company-cabinet-page.js` |
| Тарифы размещения | `css/business-pricing.css`, `js/data/company-pricing.js`, `js/pages/pricing/business-pricing-page.js` |
| Motion | `js/vendor/motion.global.js`, `js/behavior/motion-runtime.js` |
| Test selectors | `js/behavior/test-selectors.js` |
| Backend | не реализован, v1 contracts оформлены в `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md` |
| Package build в корне | отсутствует |

## Правильный порядок работы

1. Прочитать правила.
2. Найти точные файлы через поиск.
3. Сформулировать мини-бриф.
4. Сделать минимальное изменение.
5. Проверить по чеклисту.
6. Обновить `CHANGE_LOG.md`, если изменение значимое.
7. Если появилось продуктовое решение - записать в `PROJECT_DECISIONS.md`.

## Если владелец отсутствует

Работать по `AUTONOMY_PROTOCOL.md`. Все вопросы, где нужен выбор владельца, записывать в `OWNER_DECISIONS_QUEUE.md`.
