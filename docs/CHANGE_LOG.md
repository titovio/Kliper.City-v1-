# Kliper.City: change log

Журнал нужен, чтобы разные чаты понимали, что менялось и зачем.

## 2026-07-12

### AI Executive Center constitution

- Added `docs/AI_EXECUTIVE_CENTER_CONSTITUTION.md`.
- Added `docs/AI_EXECUTIVE_CENTER_OWNER_READER.md` as a plain-language owner-readable version.
- The document defines the corporate-level operating model for Kliper.City: mission, product principles, AI Executive Center, profile chat structure, owner interaction, task management, QA, knowledge base, decision making, analytics, business development, KPI, risks, reporting and roadmap.
- Updated `docs/PROJECT_INDEX.md`.
- No site code, CSS, JS, HTML or `js/app.js` changed.

## 2026-07-09

### Architect / Main 2 takeover and functional intake

- Architect / Main 2 accepted project coordination from the previous Architect / Main chat.
- Accepted `FILTERS-COPY-001` from Filters System:
  - added `js/filters/residential-filter-copy.js`;
  - connected it in `index.html`;
  - did not edit `js/app.js`;
  - did not reconnect disabled residential fast/mobile filter layers.
- Updated `docs/FUNC_001_WORKSTREAM_REPORT_INTAKE.md` with current FUNC report statuses.
- Updated `docs/THREAD_REGISTRY.md` with V1 functional completion handoff statuses.
- Sent `OBJ-FUNC-RETRY-001` to Object Pages after the interrupted object/developer page run.
- Accepted `OBJ-FUNC-RETRY-001`: no confirmed product P0/P1; direct object route/back remains a manual visible-browser watch.
- Sent `CAB-FUNC-RETRY-001` to Company Cabinet after the interrupted cabinet/pricing run.
- Accepted `CAB-FUNC-RETRY-001`: cabinet/pricing are `PASS with WATCH`; no P0/P1, fallback-data/copy polish remains P2.
- Sent and accepted `MOB-FUNC-CLOSURE-001`: no current mobile P0/P1; P2 tap targets and manual visible-browser final pass remain.
- Attempted one final visible browser gate; browser automation timed out before DOM result, while HTTP `/index.html` returned `200`.
- Added `docs/V1_FUNCTIONAL_CLOSURE_STATUS.md` as the current functional closure control card.
- Sent `UXVIS-TAP-001` to Visual System as a plan-only P2 task; no CSS/code patch authorized yet.
- Ran `node --check` with bundled Node for reviewed changed JS candidates:
  - `js/filters/residential-filter-copy.js`;
  - `js/data/building-readiness.js`;
  - `js/catalog/building-cards.js`;
  - `js/behavior/story-categories.js`;
  - `js/behavior/user-page-finalizer.js`;
  - `js/filters/selected-filter-inline.js`;
  - `js/pages/business-filter-polish.js`.

## 2026-07-08

### V1 functional audit baseline

- Added `docs/V1_FUNCTIONAL_DECISIONS.md`.
- Added `docs/V1_PAGE_COMPLETION_MATRIX.md`.
- Added `docs/V1_FUNCTIONAL_AUDIT_INTAKE.md`.
- Updated `docs/PROJECT_INDEX.md` with functional audit documents.
- Updated `docs/CHAT_TASK_BACKLOG.md` with `FUNC-*` tasks for profile chats.
- No site code, CSS, HTML or `js/app.js` changed.
- Data baseline captured: 32 developers, 141 buildings, 6 business spaces, 3 custom company cabinets, 5 company pricing plans.
- Key functional gap found: `Готовые ЖК` has no normalized completed/ready status in current building data (`строится`: 19, `уточнить`: 122).
- Interactive browser DOM audit timed out twice; local HTTP returned `200`, so `FUNC-QA-001` was added as P0 focused smoke.

### FUNC-DATA-001 readiness normalization

- Added `js/data/building-readiness.js` as a non-destructive readiness normalization layer for `window.KLIPER_BUILDINGS`.
- Added `projectReadinessStatus`, `isCompletedResidentialProject`, `isActiveResidentialProject`, `readinessStatus`, `readinessSource` and `originalStatus` without overwriting the original `status` field.
- Updated `js/catalog/building-cards.js` to use normalized readiness when filtering `novostroyki` and `gotovye` views.
- Updated `index.html` to load `building-readiness.js` after `buildings.js` and before `js/app.js`.
- Updated `docs/DATA_STRUCTURE.md`, `docs/V1_FUNCTIONAL_DECISIONS.md`, `docs/V1_PAGE_COMPLETION_MATRIX.md` and `docs/V1_FUNCTIONAL_AUDIT_INTAKE.md` with the v1 readiness contract.
- `js/app.js` was not edited.
- Product correction: `Готовые ЖК` means fully completed projects, not developer-level delivered counts; `developer.builtJK` is no longer used as readiness fallback.

### FUNC workstream report intake

- Added `docs/FUNC_001_WORKSTREAM_REPORT_INTAKE.md`.
- Accepted first reports from Regression QA, Catalog Core/Data and Business.
- Recorded that `FUNC-QA-001` is blocked by browser automation environment, while HTTP load remains `200`.
- Recorded that `FUNC-DATA-001` is accepted and implemented as readiness normalization.
- Recorded that `FUNC-BUS-001` has no new confirmed patch candidate until live smoke is stable.

### ROLE-PROFILES owner approval

Владелец подтвердил рекомендованные ответы Architect / Main по 7 вопросам role profiles.

Утверждено:

- role profiles не добавляются в текущий v1 UI;
- CTA: `Стать автором или специалистом`;
- тариф физлица: `Профиль автора`, гипотеза `990 ₽ / мес`;
- `Представитель компании`: публичная роль физлица + отдельный доступ к кабинету через company membership;
- privacy: личные действия private by default, публичны только агрегаты и явно опубликованные рецензии;
- favorite tags: стандартные теги на старте, custom tags позже после moderation;
- блок `Почему советуют`: 3 рецензии, материалы компании/партнеров отдельно от organic top.

Обновлены:

- `docs/PROJECT_DECISIONS.md`;
- `docs/OWNER_DECISIONS_QUEUE.md`;
- `docs/ROLE_PROFILES_OWNER_DECISION_PACK.md`;
- `docs/ROLE_PROFILES_OWNER_QUESTIONS.md`;
- `docs/ROLE_PROFILES_RECOMMENDED_OWNER_ANSWERS.md`.

Код, CSS, JS, HTML и `js/app.js` не менялись.

### Sales / Commercial starter package

Создан стартовый пакет документов для отдельного Sales / Commercial проекта:

- `docs/sales_commercial/SALES_COMMERCIAL_PROJECT_INDEX.md`;
- `docs/sales_commercial/SALES_COMMERCIAL_SCOPE.md`;
- `docs/sales_commercial/SALES_COMMERCIAL_THREAD_SPLIT.md`;
- `docs/sales_commercial/SALES_CRM_PIPELINE_MODEL.md`;
- `docs/sales_commercial/SALES_AD_INVENTORY_MAP.md`;
- `docs/sales_commercial/SALES_ADMIN_BACKOFFICE_REQUIREMENTS.md`;
- `docs/sales_commercial/SALES_DATA_REQUEST.md`;
- `docs/sales_commercial/SALES_COMMERCIAL_CHAT_STARTER.md`.

Обновлен `docs/PROJECT_INDEX.md`.

Код, CSS, JS, HTML и `js/app.js` не менялись.

### V1 functional recommended answers

Добавлен `docs/V1_FUNCTIONAL_RECOMMENDED_ANSWERS.md` - рекомендованные ответы Architect / Main по функциональному тесту всех страниц v1.

Обновлен `docs/PROJECT_INDEX.md`.

Код, CSS, JS, HTML и `js/app.js` не менялись.

### V1 functional owner test

Добавлен `docs/V1_FUNCTIONAL_OWNER_TEST.md` - тест-опрос владельца по функциям всех страниц v1 перед дизайн-доработкой, backend/admin и авторизацией.

Обновлены:

- `docs/PROJECT_INDEX.md`;
- `docs/CHAT_TASK_BACKLOG.md`;
- `docs/THREAD_REGISTRY.md`.

Код, CSS, JS, HTML и `js/app.js` не менялись.

### ROLE-PROFILES approved handoff

Добавлен `docs/ROLE_PROFILES_APPROVED_HANDOFF.md`.

После утверждения владельцем role-profile решений выдана третья пачка задач чатам:

- `AUTH-014`;
- `PRODUCT-003`;
- `ROLE-PRO-004`;
- `ROLE-CAT-003`;
- `ROLE-OBJ-003`;
- `ROLE-VIS-003`;
- `ROLE-STO-003`;
- `CAB-ROLE-002`;
- `ROLE-QA-003`;
- `ROLE-MOB-003`.

Обновлены:

- `docs/PROJECT_INDEX.md`;
- `docs/CHAT_TASK_BACKLOG.md`;
- `docs/THREAD_REGISTRY.md`.

Код, CSS, JS, HTML и `js/app.js` не менялись.

### PRODUCT-003: role-profile v1/v2 summary

Product / UX Lab обновил продуктовую рамку после approval:

- создан `docs/PRODUCT_003_ROLE_PROFILE_V1_V2_SUMMARY.md`;
- `docs/V1_V2_ROADMAP.md` получил отдельный блок про approved role profiles, favorite tags, `Профиль автора` и запрет кодить это в текущем v1 UI;
- `docs/PROJECT_INDEX.md` обновлен ссылкой на PRODUCT-003.

Код, CSS, JS, HTML и `js/app.js` не менялись.

### AUTH-014: role decisions contract roadmap sync

Backend/Auth синхронизировал утвержденные role-profile решения с future auth/storage/contracts roadmap.

Создан `docs/AUTH_014_ROLE_DECISIONS_CONTRACT_ROADMAP.md`.

Зафиксировано:

- какие approved decisions теперь считаются contract constraints;
- какие изменения позже войдут в `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md`;
- какие изменения позже войдут в `AUTH_006_STORAGE_SCHEMA_PLAN.md`;
- как связаны `users`, `role_profiles`, `favorite_tags`, `review_author_context`, `company_membership` и billing физлица;
- что блокирует backend implementation;
- что нельзя делать до отдельного implementation brief.

Дополнительно обновлен roadmap note в `AUTH_013_BACKEND_SCAFFOLD_PLAN.md`: `AUTH-014` теперь является documentation sync по approved role decisions, а backend scaffold/code start остается отдельной следующей задачей.

Backend-код, `backend/`, зависимости, mock server, adapter, payment, site files и `js/app.js` не менялись.

## 2026-07-07

### Product / UX Lab: role profiles and favorite tags scope

Документально оформлена будущая продуктовая модель ролевых профилей, тегов любимого и рецензий-рекомендаций.

- создан `docs/ROLE_PROFILES_SCOPE.md`;
- создан `docs/ROLE_PROFILES_OWNER_BRIEF.md` как краткий документ для владельца перед любыми задачами реализации;
- создан `docs/ROLE_PROFILES_TASK_BRIEFS.md` с ТЗ для Profile Social, Catalog Core, Object Pages, Billing/Auth и Backend/Auth;
- создан `docs/ROLE_AUTH_APPENDIX.md` с будущими backend/auth сущностями и API-кандидатами для role profiles, favorite tags и review context;
- `PRODUCT_UX_LAB_PRODUCT_001.md` связан с отдельным role profiles scope;
- `PROJECT_INDEX.md` получил ссылку на новый документ;
- `PROJECT_DECISIONS.md` зафиксировал решение не перегружать v1 ролевыми тарифами, stories и публикациями обычных пользователей;
- `CHAT_TASK_BACKLOG.md` получил блок задач `Role Profiles / Favorite Tags` для Product / UX Lab, Profile Social, Catalog Core, Object Pages, Backend/Auth, Billing, Visual System, Stories & Motion, Regression QA и Mobile QA.
- Role Profiles briefs разосланы в рабочие чаты Profile Social, Catalog Core, Object Pages, Backend/Auth, Visual System, Stories & Motion, Regression QA и Mobile QA; `THREAD_REGISTRY.md` обновлен.

Код, CSS, JS, HTML и `js/app.js` не менялись.

### ROLE-PROFILES owner questions

Добавлен `docs/ROLE_PROFILES_OWNER_QUESTIONS.md` - короткий лист из 7 решений владельца перед любыми задачами реализации role profiles.

Добавлен `docs/ROLE_PROFILES_RECOMMENDED_OWNER_ANSWERS.md` - рекомендованные ответы Architect / Main для утверждения владельцем.

Обновлен `docs/PROJECT_INDEX.md`.

Код, CSS, JS, HTML и `js/app.js` не менялись.

### ROLE-PROFILES second handoff intake

Принята вторая пачка отчетов профильных чатов после `ROLE_PROFILES_OWNER_DECISION_PACK.md`.

Добавлен `docs/ROLE_PROFILES_SECOND_HANDOFF_INTAKE.md`.

Подключен к индексу документ `docs/CAB_ROLE_001_COMPANY_REPRESENTATIVE_BOUNDARY.md`.

Приняты отчеты:

- `ROLE-OWNER-001`;
- `ROLE-PRO-003`;
- `ROLE-CAT-002`;
- `ROLE-OBJ-002`;
- `ROLE-AUTH-002`;
- `ROLE-VIS-002`;
- `ROLE-STO-002`;
- `ROLE-QA-002`;
- `CAB-ROLE-001`.

Главный итог: role profiles остаются future-state; следующая работа - получить решения владельца по 7 вопросам, а не запускать UI/backend реализацию.

Обновлены:

- `docs/PROJECT_INDEX.md`;
- `docs/THREAD_REGISTRY.md`.

Код, CSS, JS, HTML и `js/app.js` не менялись.

### ROLE-PROFILES owner decision pack and second handoff

Создан `docs/ROLE_PROFILES_OWNER_DECISION_PACK.md`.

Пакет фиксирует решения владельца перед future-реализацией:

- CTA профессионального профиля;
- тариф физлица;
- цену;
- стартовые роли;
- standard favorite tags;
- privacy default;
- блок `Почему советуют`;
- trust/commercial labels;
- правила после неоплаты;
- этап реализации.

Обновлены:

- `docs/PROJECT_INDEX.md`;
- `docs/OWNER_DECISIONS_QUEUE.md`;
- `docs/CHAT_TASK_BACKLOG.md`;
- `docs/THREAD_REGISTRY.md`.

Профильным чатам выдана вторая пачка задач:

- `ROLE-OWNER-001`;
- `ROLE-PRO-003`;
- `ROLE-CAT-002`;
- `ROLE-OBJ-002`;
- `ROLE-AUTH-002`;
- `ROLE-VIS-002`;
- `ROLE-STO-002`;
- `ROLE-QA-002`;
- `CAB-ROLE-001`.

Создан `docs/ROLE_OWNER_001_DECISION_PACK_REVIEW.md`.

- Product / UX Lab принял owner decision pack как основной пакет вопросов владельцу;
- выделены безопасные дефолты Architect/Main;
- отмечены двусмысленности D1, D3, D4, D5, D8 и D9;
- сформирован список из 7 первых вопросов владельцу.

Код, CSS, JS, HTML и `js/app.js` не менялись.

### ROLE-AUTH-002 contract delta

Закрыт документационный follow-up `ROLE-AUTH-002` для Backend/Auth.

Создан `docs/ROLE_AUTH_002_AUTH_STORAGE_CONTRACT_DELTA.md`.

Документ фиксирует будущую delta-карту для `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md` и `AUTH_006_STORAGE_SCHEMA_PLAN.md` после owner decisions:

- users: не добавлять role flags в `users`, держать личный профиль отдельно;
- role_profiles: добавить публичные роли физлица, `role_profile_links`, trust status отдельно от оплаты;
- favorite_tags: системные теги и assignments как signals, не publications;
- review_author_context: privacy, double tags, disclosure и freshness;
- billing физлица: отдельный B2C тариф `Профиль автора`, отдельные subscription tables, `grace/basic/inactive`;
- privacy: private default + public aggregate;
- permissions: отдельный namespace role permissions без смешения с company cabinet;
- migration: localStorage только import candidate, без role permissions и без trust.

Зафиксированы риски и блокеры перед merge в активные auth/storage contracts.

Backend-код, `backend/`, зависимости, mock server, adapter, payment, site files и `js/app.js` не менялись.

## 2026-07-06

### Company Cabinet v1

Создан v1 UI-экран `Кабинет компании` без backend/auth и без правки `js/app.js`.

- добавлен route `#company-cabinet=developerId`, пример `#company-cabinet=brusnika`;
- блок `Для бизнеса / Кабинет компании` на публичной странице застройщика получает CTA `Открыть кабинет`;
- кабинет показывает header компании, статусы, статистику, объекты, документы, публикации, stories, подписчиков, рецензии, обращения и предложения подписчикам;
- возврат `Публичная страница` ведет на `#card=Название` той же компании;
- `page-restore.js` получил guard, чтобы кабинет не переписывался обратно в `#card=...`;
- реальные CRM-действия, формы, отправки и роли оставлены на backend/auth этап.

### Third Wave Acceptance

Выполнены 5 пунктов после внедрения кабинета компании:

- `QA-003`: полный regression smoke v1, отчет `QA_003_REGRESSION_REPORT.md`;
- `MOB-003`: mobile QA 390px/430px, отчет `MOB_003_MOBILE_QA_REPORT.md`;
- `CAB-002`: кабинет компании проверен по всем 32 застройщикам, отчет `CAB_002_COMPANY_CABINET_QA.md`;
- `VIS-003`: визуальная приемка v1 после кабинета, отчет `VIS_003_VISUAL_ACCEPTANCE.md`;
- `AUTH-002`: требования к будущей авторизации и ролям, документ `AUTH_002_BACKEND_AUTH_REQUIREMENTS.md`.

Во время `QA-003` найден и исправлен stale-счетчик в `Готовые ЖК`:

- после перехода из `Новостройки` счетчик мог оставаться `142 карточки` при 20 видимых карточках;
- `js/filters/residential-list-guard.js` теперь синхронизирует residential-счетчик по видимым карточкам;
- `index.html` обновлен до `residential-list-guard-4`.

### Workstream threads

Создана первая волна рабочих Codex-чатов:

- Regression QA;
- Assets/Data Cleanup;
- Filters System;
- Visual System;
- Stories & Motion.

Добавлен `THREAD_REGISTRY.md` с thread ID, статусами и порядком чтения результатов.

Все чаты первой волны получили стартовую задачу в режиме аудита без правки кода.

Добавлен `REPORT_INTAKE_PROTOCOL.md`, чтобы отчеты рабочих чатов превращались в задачи через единую приемку Architect / Main.

Запущено параллельное распределение задач по профилям:

- первой волне выданы вторые задачи из `CHAT_TASK_BACKLOG.md`: `QA-001`, `QA-002`, `A-004`, `FIL-001`, `FIL-002`, `VIS-001`, `VIS-002`, `STO-001`, `STO-002`, `MOT-001`;
- создана вторая волна рабочих чатов: `Object Pages`, `Catalog Core`, `Business`, `Profile Social`, `Company Cabinet`, `Mobile QA`;
- `THREAD_REGISTRY.md` обновлен thread ID и текущими задачами второй волны;
- `Backend/Auth` оставлен на поздний запуск после отчетов Profile Social и Company Cabinet.

Принят первый отчет `ASSETS_DATA_AUDIT.md` от Assets/Data Cleanup. На его основе добавлен `FIX_QUEUE.md` с кандидатами `A-001`...`A-005`. Исправления пока не запущены до приемки Regression QA.

Принят отчет `STORIES_MOTION_AUDIT.md`. В `FIX_QUEUE.md` добавлены кандидаты `S-001`...`S-006`. Зафиксировано решение: первую реализацию stories scroll-rule делать без Motion и без изменения CSS-колец.

Приняты отчеты:

- `regression-audit-2026-07-06.md`;
- `FILTERS_SYSTEM_AUDIT.md`;
- `VISUAL_SYSTEM_AUDIT.md`.

В `FIX_QUEUE.md` добавлены задачи `R-*`, `F-*`, `V-*`. P0 не найдено. Первым блоком исправлений утверждены `R-001` и `R-002`: очистка смешанного route-state между object/catalog/profile и прямым `index.html`.

`R-001` и `R-002` выполнены без правки `js/app.js`:

- `page-restore.js` больше не восстанавливает профиль `Мария` при чистом `index.html`;
- business route очищает свой host при переходе в профиль;
- preview объекта распознается как отдельное состояние и не блокирует верхнюю навигацию;
- при переходе из preview в профиль preview закрывается штатной кнопкой.

`R-003` выполнен без правки `js/app.js`:

- добавлен `js/filters/residential-list-guard.js`;
- в `Новостройки` list-view скрывается legacy-leak `Тюменский квартал`;
- счетчик list-view снова совпадает с grid-view: `142 карточки`;
- `Готовые ЖК` и `Для бизнеса` проверены без изменения результата.

### Project Control Center

Добавлены документы управления проектом:

- `PROJECT_INDEX.md`
- `CHAT_OWNERSHIP.md`
- `TASK_BRIEF_TEMPLATE.md`
- `REGRESSION_CHECKLIST.md`
- `MOTION_RULES.md`
- `V1_V2_ROADMAP.md`
- `PROJECT_DECISIONS.md`
- `OWNER_DECISIONS_QUEUE.md`

Цель: подготовить проект к разделению на несколько рабочих чатов и снизить риск случайных поломок.

### Motion

Фактическое состояние:

- используется локальный файл `js/vendor/motion.global.js`;
- runtime: `js/behavior/motion-runtime.js`;
- доступ: `window.Motion` и `window.KLIPER_MOTION`.

### Не менялось

- визуал сайта;
- логика сайта;
- `js/app.js`;
- CSS интерфейса.

### Автономная работа и чаты

Добавлены:

- `AUTONOMY_PROTOCOL.md`
- `WORKSTREAM_PROMPTS.md`

Цель: дать возможность запускать отдельные чаты по доменам проекта без повторного пересказа контекста.

### Проверка после подготовки

Проверено через локальный браузер:

- `index.html` открывается;
- `#root` есть;
- `window.KLIPER_MOTION` есть;
- `window.KLIPER_MOTION.animate` есть;
- локальных ошибок по Motion/JS/CSS не найдено.

Оставшиеся ошибки относятся к внешним ресурсам:

- `logo.clearbit.com`;
- отдельный ресурс `images.unsplash.com`, заблокированный браузером.

### Baseline regression

Добавлен `BASELINE_REGRESSION_REPORT.md`.

Зафиксировано:

- основные v1-разделы переключаются через видимые кнопки;
- профиль открывается;
- desktop/mobile horizontal overflow равен `0`;
- Motion доступен;
- автотестам нельзя выбирать первый текстовый матч навигации из-за скрытых/внеэкранных дублей.

### Company Cabinet

Зафиксирован будущий домен `Кабинет компании`.

Фактический статус:

- на странице застройщика есть визуальный блок `ДЛЯ БИЗНЕСА / Кабинет компании`;
- отдельная рабочая страница/route/модалка кабинета не найдена.

Добавлено:

- `pages-company-cabinet.md`;
- зона `Company Cabinet` в `CHAT_OWNERSHIP.md`;
- стартовый промпт `Company Cabinet` в `WORKSTREAM_PROMPTS.md`;
- вопросы владельцу в `OWNER_DECISIONS_QUEUE.md`.

### Stage 1 closure

Добавлен `STAGE_1_CLOSURE.md`.

Зафиксировано:

- что уже готово в Project Control Center;
- какие решения владельца нужны для полного закрытия Этапа 1;
- рекомендуемые v1/v2 границы;
- список рабочих чатов;
- backlog P0/P1/P2/v2;
- Definition of Done для v1;
- следующий рекомендуемый этап: Test Infrastructure.

### Owner decisions update

Владелец подтвердил:

- `Топ` - v2;
- `Мой двор` - v2;
- `Районы` - v2;
- `Кабинет компании` - v1;
- форма заявки сейчас не делается, будет отдельная доработка;
- социальные функции должны быть полноценными;
- stories scroll-правило подтверждено;
- backend/auth нужны в конце v1 для пользователей и застройщиков.

Добавлен `SOCIAL_FEATURES_SCOPE.md`.

Уточнены устаревшие формулировки в:

- `V1_V2_ROADMAP.md`;
- `STAGE_1_CLOSURE.md`;
- `UI_AND_CHANGE_RULES.md`;
- `pages-company-cabinet.md`;
- `OWNER_DECISIONS_QUEUE.md`.

### Test Infrastructure

Добавлен базовый слой стабильных тестовых селекторов:

- `js/behavior/test-selectors.js`;
- подключение в `index.html`;
- документ `TEST_INFRASTRUCTURE.md`.

Проверено:

- desktop `1440x900`;
- mobile `390x844`;
- основные nav-селекторы ведут в правильные разделы;
- `nav-business` не попадает в story-кружок `Бизнес`;
- horizontal overflow равен `0`.

Визуал сайта и `js/app.js` не менялись.

### Fix Queue Final Pass

Закрыта оставшаяся безопасная очередь исправлений без правки `js/app.js`.

Изменения:

- добавлен `js/filters/residential-list-guard.js` для защиты residential list-view от legacy leak `Тюменский квартал`;
- business selected-tags отделены от residential selected-tags в `js/filters/selected-filter-inline.js`;
- добавлен `js/behavior/external-avatar-guard.js`, который до legacy-рендера подменяет Clearbit/GStatic/Google favicon/Unsplash `img` на локальные/data fallback;
- `js/data/stories.js` и `js/catalog/building-cards.js` переведены на локальные fallback-изображения;
- `js/catalog/developer-cards.js` не выводит Google favicon как avatar image;
- `js/behavior/motion-runtime.js` теперь ждет загрузку `window.Motion` перед unavailable-состоянием;
- `js/behavior/story-categories.js` получил wheel guard для чужих overlay/modal и мягкий Motion entrance только для viewer opacity/transform;
- `css/story-categories.css` получил mobile viewer offset fix и reduced-motion слой;
- `css/business-spaces.css` и `css/ui-ux-pro-max.css` получили точечную визуальную полировку business cards, selected tags, dark profile button и mobile spacing;
- `js/behavior/empty-state-copy.js` нейтрализует старые empty-state подсказки после React rerender.

Проверено:

- `node --check` для измененных JS;
- desktop browser load без pageerror/console error;
- network load без failed requests и 4xx responses;
- mobile `390x844`: horizontal overflow `0`, story viewer top/left `0`;
- dark theme: профильная кнопка темная, empty-state нейтральный;
- business filter: inline-tags и reset работают отдельно от residential.

### Catalog Core QA Pass

Добавлен `VISUAL_QA_REPORT.md`.

Исправлено:

- добавлен `js/catalog/catalog-card-actions-a11y.js`;
- карточные кнопки `heart` / `bell` получили `aria-label`;
- `aria-pressed` синхронизируется с `kliper-liked-cards` и `kliper-subscribed-cards`;
- story-кнопка внутри карточки получила понятный `aria-label`;
- `js/behavior/test-selectors.js` больше не требует, чтобы view-controls находились строго внутри текущего viewport.

Проверено:

- `Новостройки`: `142 карточки`;
- лайк `ЖК Речной Порт` сохраняется в `kliper-liked-cards`;
- подписка `ЖК Речной Порт` сохраняется в `kliper-subscribed-cards`;
- после кликов action aria-state становится активным;
- console/pageerror по измененным файлам не найдено.

Открытый дефект:

- `C-001`: после перехода в list-view пропадают штатные view-controls. Полноценное исправление требует app-level правки legacy render state, поэтому вынесено отдельной задачей.

### Second Wave Intake: Safe Fix Batch 1

Приняты первые отчеты второй волны рабочих чатов: `Object Pages`, `Catalog Core`, `Business`, `Profile Social`, `Company Cabinet`, `Mobile QA`.

Исправлено без правки `js/app.js`:

- business selected-tags и `Сбросить` сохраняются после переключения `grid/list/map`;
- кнопка `Все рецензии` на странице застройщика открывает модалку с заголовком `Все рецензии`, а не старую `Все рекомендации`;
- переход со страницы объекта в профиль очищает stale `#card=...` и класс `kliper-object-route-active`;
- mobile object page получил дополнительный верхний отступ, чтобы заголовок объекта не попадал под мобильный header.

Проверено:

- `node --check` для измененных JS;
- business filter: `Аренда` сохраняет inline-chip и reset в `grid/list/map`;
- `#card=Брусника`: `Все рецензии` открывает модалку с правильным заголовком;
- object -> profile: hash пустой, `kliper-object-route-active` снят, профиль видим;
- mobile `390x844` для `#card=ЖК Речной Порт`: horizontal overflow `0`, заголовок ниже header.

Оставлено отдельными задачами:

- object back-stack из ЖК, открытого из каталога, может вести к застройщику; причина в legacy route/back-stack;
- residential list-view trap и исчезающие view-controls остаются app-level задачей;
- полноценные рецензии сейчас переиспользуют демо-список рекомендаций до появления data/backend.

### Second Wave Intake: Safe Fix Batch 2

Закрыты два P1 без правки `js/app.js`:

- `CAT-003`: добавлен `js/filters/residential-view-controls-guard.js`, который запоминает штатные React handlers кнопок вида и восстанавливает controls, если legacy list-view убрал их из строки счетчика;
- `OBJ-004`: `page-restore.js` теперь запоминает источник `Новостройки` / `Готовые ЖК` при открытии preview ЖК и возвращает внутреннюю кнопку `Назад` именно в исходный каталог;
- browser Back из preview больше не уводит приложение на `about:blank`: preview получает внутреннее history-состояние и закрывается на `popstate`.

Проверено:

- `Новостройки -> list`: `view-grid`, `view-list`, `view-map`, `view-sort-reverse` остаются доступны;
- `list -> grid -> list -> map`: переключения работают, overflow `0`;
- `Новостройки -> preview -> browser Back`: preview закрывается, остается `Новостройки`, hash пустой;
- `Новостройки -> preview -> большая страница ЖК -> Назад`: возврат в `Новостройки`, `142 карточки`, hash пустой;
- console/pageerror по этим сценариям не найдено.

### Pricing / Billing v1

Добавлен v1-слой тарифов размещения для компаний без backend, оплаты и правки `js/app.js`.

Изменения:

- добавлена единая модель тарифов `js/data/company-pricing.js`;
- добавлена отдельная страница тарифов `#business-pricing` и deep link `#business-pricing=developerSlug`;
- в кабинет компании добавлен блок `Тариф и лимиты` с текущим тарифом, лимитами, прогрессом использования и переходом к тарифам;
- `page-restore.js` получил guard для pricing route, чтобы `#business-pricing` не переписывался в старые `#card=...` маршруты;
- добавлены документы `BILL_001_PRICING_MODEL.md`, `AUTH_003_BILLING_REQUIREMENTS.md`, `QA_004_PRICING_REGRESSION_REPORT.md`, `MOB_004_PRICING_MOBILE_QA.md`;
- `AUTH_002_BACKEND_AUTH_REQUIREMENTS.md`, `PROJECT_INDEX.md`, `THREAD_REGISTRY.md`, `CHAT_TASK_BACKLOG.md`, `FIX_QUEUE.md` и `pages-company-cabinet.md` обновлены с учетом тарифов.

Проверено:

- `node --check` для `company-pricing.js`, `business-pricing-page.js`, `company-cabinet-page.js`, `page-restore.js`;
- `#business-pricing`: 5 тарифов, 5 CTA, horizontal overflow `0`, console/pageerror не найдено;
- `#business-pricing=gk-paritet-development`: контекстный возврат в кабинет работает;
- `#company-cabinet=gk-paritet-development`: 9 панелей, блок тарифа видим, CTA открывает страницу тарифов;
- все 32 route кабинета застройщиков открываются с блоком тарифа и без console/pageerror;
- mobile `390px`: страница тарифов без horizontal overflow.

Не реализовано намеренно:

- реальная оплата;
- backend-подписки;
- auth/roles enforcement;
- CRM-действия;
- автоматическое изменение тарифа после клика.

### Company Cabinet v1 polish

После внедрения тарифов кабинет компании доведен до более цельного v1-состояния без backend/auth и без правки `js/app.js`.

Изменения:

- в hero добавлены сигналы внимания по документам, обращениям и публикациям;
- в блок `Документы и профиль` добавлен прогресс готовности профиля;
- будущие действия кабинета получили честное v1-сообщение вместо молчащих disabled-кнопок;
- mobile/dark стили новых состояний выровнены с кабинетом;
- `page-restore.js` защищает standalone route `#company-cabinet=...` и `#business-pricing...` от поздней очистки hash.

Проверено:

- `#company-cabinet=gk-paritet-development`: 9 панелей, 7 stat-карточек, блок внимания и готовность профиля видны;
- action-кнопка показывает v1-сообщение;
- `Изменить тариф` открывает `#business-pricing=gk-paritet-development`;
- возврат из тарифов возвращает в `#company-cabinet=gk-paritet-development`;
- desktop/mobile horizontal overflow `0`;
- console/pageerror не найдено;
- `node --check` для `company-cabinet-page.js` и `page-restore.js`.

### Company Cabinet v1 acceptance

Кабинет компании принят как v1-ready UI-прототип без backend/auth.

Проверено:

- desktop light: кабинет активен, 9 панелей, 7 stat-карточек, readiness и тариф есть, overflow `0`;
- desktop dark: dark-классы активны, кнопки кабинета читаемые, overflow `0`;
- `Кабинет -> Тарифы -> Кабинет`: route и возврат работают;
- `Кабинет -> Публичная страница -> Кабинет`: публичный блок и CTA работают;
- future-action notice показывает честное v1-сообщение про backend/auth;
- mobile light/dark около `390px`: action-кнопки в колонку, hero/panels в ширине, overflow `0`;
- все 32 route кабинета из `js/data/developers.js`: failed `0`;
- console/pageerror по acceptance-сценариям не найдено.

Документ приемки: `CAB_005_COMPANY_CABINET_V1_ACCEPTANCE.md`.

Решение: следующий слой кабинета должен идти через backend/auth contracts, а не через дальнейшее наращивание mock-действий.

### Backend/Auth contracts v1

Создан единый контракт будущего backend/auth слоя:

- документ `AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md`;
- типы аккаунтов: user, company_member, kliper_admin;
- роли: user, verified_user, company_owner, company_manager, company_editor, company_viewer, support/moderator/admin;
- auth flows для пользователя, компании и админа;
- сущности: users, profiles, companies, members, objects;
- социальные сущности: likes, subscriptions, reviews, friends, collections;
- кабинет компании: response contract для `GET /companies/:companyId/cabinet`;
- billing: тарифы, usage, subscription statuses, feature gates;
- CRM: leads/dialogs/offers;
- company posts/stories/documents;
- API candidates по auth, social, company cabinet, billing;
- permission map;
- localStorage migration;
- порядок backend implementation;
- критерии приемки backend/auth v1.

Решение: backend/auth можно планировать по `AUTH-004`, но реализацию начинать только после отдельного `AUTH-005` implementation brief.

### Backend/Auth implementation brief

Создан первый backend implementation brief:

- документ `AUTH_005_BACKEND_IMPLEMENTATION_BRIEF.md`;
- выбран первый backend-срез: read-only auth/company/billing slice;
- в первый срез входят auth/session, `GET /me`, user profile, company membership, read-only company cabinet API, read-only billing/plans/subscription/usage, migration preview;
- из первого среза исключены реальная оплата, смена тарифа, загрузка документов, публикации, stories, CRM, предложения подписчикам и админ-панель;
- описаны минимальные сущности: users, user_profiles, companies, company_members, company_objects, billing_plans, company_subscriptions;
- описан seed/import из текущих frontend data-файлов;
- описаны endpoints первого среза и формы ответов;
- зафиксированы permission checks и error states;
- задан frontend integration plan через будущий API adapter с mock fallback;
- добавлен QA-чеклист первого backend-среза.

Следующий кандидат: `AUTH-006` storage/schema plan.

### Backend/Auth storage/schema plan

Создан storage/schema plan для первого backend/auth среза:

- документ `AUTH_006_STORAGE_SCHEMA_PLAN.md`;
- описана совместимая relational DB схема без выбора конкретной БД;
- описаны core tables: users, user_profiles, auth_challenges, sessions;
- описаны company tables: companies, company_members, objects, company_objects;
- описаны billing tables: billing_plans, billing_plan_features, company_subscriptions;
- описаны social tables: likes, subscriptions, reviews;
- описаны read-only company cabinet tables: documents, posts, stories, dialogs, offers;
- описана таблица migration_snapshots;
- задан seed/import mapping из `js/data/developers.js`, `js/data/buildings.js`, `js/data/business-spaces.js`, `js/data/company-cabinet.js`, `js/data/company-pricing.js`;
- зафиксированы import phases: dev seed, staging import, production migration;
- описаны индексы под `GET /me`, `GET /companies/:companyId/cabinet`, `GET /billing/plans`;
- зафиксированы integrity/security rules и open decisions перед миграциями.

Следующий кандидат: `AUTH-007` frontend API adapter с mock fallback.

### Frontend API adapter plan

Создан план будущего frontend API adapter с mock fallback:

- документ `AUTH_007_FRONTEND_API_ADAPTER_PLAN.md`;
- описан слой `UI module -> API adapter -> backend/mock fallback`;
- первый adapter scope: `GET /me`, `GET /billing/plans`, `GET /companies/:companyId/subscription`, `GET /companies/:companyId/cabinet`, `GET /me/migration-preview`;
- зафиксированы будущие файлы `js/api/*`, `auth-state.js`, `company-cabinet-api-adapter.js`, `business-pricing-api-adapter.js`;
- `js/app.js` запрещен для первого adapter-среза;
- описан config `window.KLIPER_API_CONFIG`;
- задан единый result shape: `api`, `mock`, `local`;
- зафиксировано важное правило: `401/403` нельзя silently fallback-ить в mock private cabinet;
- описаны mock sources из текущих `window.KLIPER_*` и localStorage;
- описаны states для кабинета: loading, api-ready, mock-ready, unauthorized, access-denied, backend-unavailable;
- описан integration order и regression checklist.

Следующий кандидат: `AUTH-008` backend stack decision checklist.

### Backend stack decision checklist

Создан checklist выбора backend stack перед написанием backend-кода:

- документ `AUTH_008_BACKEND_STACK_DECISION_CHECKLIST.md`;
- рекомендованный путь для Kliper.City: Node.js backend + PostgreSQL + httpOnly cookie sessions + read-only company/billing API first;
- рассмотрены варианты backend stack: Node/Fastify/Express, Node/Nest, FastAPI, Supabase, Firebase, Headless CMS;
- зафиксирована рекомендация PostgreSQL для relational схемы из `AUTH-006`;
- описаны варианты ORM/query layer: Prisma, Drizzle, Knex, Raw SQL, SQLAlchemy;
- описана auth/session стратегия и запрет JWT/token в localStorage;
- зафиксированы решения по login provider, hosting/environments, config/secrets, API versioning, CORS/cookies;
- описана seed/import strategy и первый разрешенный backend code scope;
- добавлен security checklist и QA checklist перед implementation;
- добавлен шаблон решения для владельца/команды.

Следующий кандидат: `AUTH-009A` API mock server contract and sample responses.

`AUTH-009` read-only backend slice заблокирован до выбора backend stack/DB/auth/session.

### API mock server contract

Создан mock API contract с sample responses для будущего backend/frontend adapter:

- документ `AUTH_009A_API_MOCK_SERVER_CONTRACT.md`;
- base path: `/api/v1`;
- описан response envelope success/error;
- добавлены sample responses:
  - `GET /api/v1/health`;
  - `GET /api/v1/me`;
  - `GET /api/v1/billing/plans`;
  - `GET /api/v1/companies/:companyId/subscription`;
  - `GET /api/v1/companies/:companyId/cabinet`;
  - `GET /api/v1/me/migration-preview`;
- добавлены common errors: 401 unauthorized, 403 access denied, 404 company not found, 501 not implemented;
- добавлена scenario matrix для adapter tests;
- зафиксировано, что 401/403 не должны fallback-иться в приватный mock cabinet.

Следующий кандидат: `AUTH-010` skeleton frontend API adapter с disabled-by-default mock fallback.

`AUTH-009` real backend остается blocked до выбора backend stack/DB/auth/session.

### Frontend API adapter skeleton

Реализован первый skeleton frontend API adapter, выключенный по умолчанию:

- документ `AUTH_010_FRONTEND_API_ADAPTER_SKELETON.md`;
- добавлены `js/api/kliper-api-config.js`, `js/api/kliper-api-client.js`, `js/api/kliper-api-mock-fallback.js`;
- добавлен `js/behavior/auth-state.js`;
- добавлены page adapters для тарифов и кабинета компании;
- `index.html` подключает adapter слой перед `company-cabinet-page.js` и `business-pricing-page.js`;
- кабинет компании и тарифы получили `data-api-source="mock"` без изменения текущего UI;
- `KLIPER_API_CONFIG.enabled` и `KLIPER_FEATURES.apiAdapter` по умолчанию выключены;
- `401/403/404` не должны превращаться в успешный private mock cabinet.

Следующий кандидат: `AUTH-011` adapter skeleton acceptance QA и mock server/dev toggle.

`AUTH-009` real backend остается blocked до выбора backend stack/DB/auth/session.

### Adapter acceptance and dev toggle

Закрыт `AUTH-011`: принят frontend API adapter skeleton и добавлен безопасный dev-toggle.

Изменения:

- документ `AUTH_011_ADAPTER_ACCEPTANCE_AND_DEV_TOGGLE.md`;
- добавлен `js/api/kliper-api-dev-toggle.js`;
- `index.html` подключает dev-toggle перед `kliper-api-config.js`;
- добавлен dependency-free mock server `tools/kliper-api-mock-server.mjs`;
- API включается только вручную через `?kliperApi=1&kliperApiBase=http://127.0.0.1:4000/api/v1`;
- default URL остается без backend requests и работает через текущие mock/local data;
- mock server отдает `health`, `me`, `billing/plans`, `company subscription`, `company cabinet`, `migration preview`.

Следующий кандидат: `AUTH-012` backend stack final decision and real read-only backend slice.

`AUTH-009` real backend остается blocked до выбора backend stack/DB/auth/session.

### Backend stack final decision

Закрыт `AUTH-012`: принято финальное backend stack решение перед реальным backend-кодом.

Решение:

- backend stack: Node.js + Fastify;
- database: PostgreSQL;
- ORM/query layer: Prisma;
- session strategy: server-side sessions + httpOnly secure cookie;
- auth first step: temporary dev login and email-based company member identity;
- API base path: `/api/v1`;
- frontend adapter остается disabled by default;
- seed/import должен идти из текущих `js/data/*` через Prisma seed.

Документ: `AUTH_012_BACKEND_STACK_DECISION.md`.

Следующий кандидат: `AUTH-013` backend scaffold plan and file boundary.

Реальный backend-код не добавлялся в этом шаге: зависимости и `backend/` нужно заводить отдельным контролируемым срезом.

### UX-005 layout/usability audit wave

Подготовлена и выдана волна аудита удобства отображения сайта:

- документ `UX_005_SITE_LAYOUT_USABILITY_AUDIT_WAVE.md`;
- задачи добавлены в `CHAT_TASK_BACKLOG.md`;
- статусы добавлены в `THREAD_REGISTRY.md`;
- фокус проверки: расположение блоков, подсветки, overlap, старые слои, dark/mobile, overflow, console/page errors, navigation/back/close;
- правки кода запрещены до приемки отчетов в Architect / Main.

### Backend/Auth workstream thread

Создан отдельный рабочий чат Backend/Auth:

- thread id: `019f3961-80cd-72e3-b9d9-ed298036cbf9`;
- зона: future `backend/`, Fastify, PostgreSQL, Prisma, sessions, seed/import, API contracts;
- первая задача: `AUTH-013` backend scaffold plan and file boundary;
- ограничения: не устанавливать зависимости, не создавать `backend/`, не писать backend-код и не менять текущий сайт до отдельного разрешения Architect / Main.

### Backend scaffold plan

Закрыт `AUTH-013`: подготовлен план будущего backend scaffold и границ файлов.

Документ: `AUTH_013_BACKEND_SCAFFOLD_PLAN.md`.

Зафиксировано:

- будущая структура `backend/`;
- package scripts;
- Prisma folders and schema ownership;
- module boundaries;
- env strategy;
- seed/import phases;
- first read-only API modules;
- smoke/tests;
- frontend adapter integration risks;
- запрет на правки visual/CSS/stories/filters/cards/`js/app.js` в Backend/Auth задачах.

Backend-код, зависимости, `backend/` и текущий сайт не менялись.

### Role profiles backend/billing follow-up

Закрыт документационный follow-up `ROLE-AUTH-001` / `ROLE-BILL-001` для Backend/Auth.

Документ: `ROLE_AUTH_BILL_001_BACKEND_FOLLOWUP.md`.

Зафиксировано:

- как будущие `role_profiles`, `role_profile_links`, `favorite_tags`, `favorite_tag_assignments`, `review_author_context` ложатся рядом с `users`, `user_profiles`, `reviews`, `company_members`;
- что ролевой профиль физлица не является компанией;
- что `company_member` может подтверждать контекст представителя, но не заменяет `role_profile`;
- что теги любимого являются сигналами сохранения, а не публикациями;
- что тариф физлица `Профиль автора` отделен от B2B-тарифов компаний;
- lifecycle после неоплаты: `grace`, `basic`, `inactive`;
- статус `Эксперт` нельзя купить, он должен быть trust/moderation signal отдельно от оплаты;
- решения владельца и риски смешения user profile / role profile / company cabinet.

Backend-код, mock server, adapter, payment и текущий сайт не менялись.

### UX-005 report intake

Приняты и сведены отчеты рабочей волны `UX-005`.

Добавлен документ `UX_005_REPORT_INTAKE.md`:

- собран статус отчетов Regression, Visual, Mobile, Filters, Stories, Catalog, Object, Business, Profile, Company Cabinet;
- дедуплицированы P1/P2 findings;
- заведены routed follow-up задачи:
  - `UXFIX-QA-001`;
  - `UXFIX-CAT-001`;
  - `UXFIX-FIL-001`;
  - `UXFIX-CAB-001`;
  - `UXFIX-CAB-002`;
  - `UXFIX-BUS-REVIEW-001`;
  - `UXFIX-PRO-001`;
  - `UXFIX-OBJ-001`;
  - `UXFIX-STO-001`;
- зафиксировано, что `js/app.js` остается запретной зоной без отдельного решения Architect/Main;
- site UI/CSS/JS/backend код в этом шаге не менялся.

### Product / UX Lab thread

Создан отдельный продуктовый чат для гипотез и улучшения страниц:

- thread id: `019f397a-2161-76a1-af2f-3e366a6c81f1`;
- роль: Product / UX Lab;
- первая задача: `PRODUCT-001` - карта направлений улучшения Kliper.City;
- зона: продуктовые сценарии, v1/v2 разделение, onboarding, social mechanics, value для пользователей и застройщиков;
- ограничения: по умолчанию только документы/отчеты/ТЗ, без CSS/JS/HTML, без `js/app.js`, без backend/auth/payment/CRM обещаний в v1.

Architect / Main остается техническим координационным чатом для приемки отчетов, распределения задач и контроля риска.

### UX-005 acceptance batch 1

Принята первая пачка routed fixes после `UX-005`.

Зафиксировано в `UX_005_REPORT_INTAKE.md`:

- `UXFIX-QA-001`: clean smoke protocol для `8765` и isolated headless Edge;
- `UXFIX-CAT-001`: catalog controls/actions, `aria-pressed`, fallback labels, mobile action heights;
- `UXFIX-FIL-001` + `UXFIX-BUS-REVIEW-001`: business selected tag на mobile, reset, `grid/list/map`, no residential leak;
- `UXFIX-CAB-001` и `UXFIX-CAB-002`: изоляция cabinet/pricing routes и продуктовый copy без backend/auth/payment promises;
- `UXFIX-PRO-001`: профильные счетчики и visual-only CTA states;
- `UXFIX-OBJ-001`: object tabs/back/modals;
- `UXFIX-STO-001`: stories state-machine verification и ring-layer cleanup.

Остаточные риски:

- legacy `map/sort` state остается под наблюдением Regression QA;
- stories scroll timing остается watch item;
- broad visual token refactor не запускать из этой пачки.

`js/app.js` не редактировался в рамках этой приемки.

После приемки выданы финальные проверки:

- `UXFIX-FINAL-QA-001` в Regression QA;
- `UXFIX-FINAL-MOB-001` в Mobile QA.

Обе задачи работают в режиме отчета без правок кода и без `kliperApi=1`.

Результат финальных проверок:

- `UXFIX-FINAL-QA-001`: `BLOCKED` по browser automation environment; сервер `8765` отвечает стабильно, подтвержденных продуктовых P0/P1 нет;
- `UXFIX-FINAL-MOB-001`: `BLOCKED` для полного final PASS по той же причине; completed mobile checks не нашли продуктовых P0/P1;
- cabinet/pricing isolation на mobile подтверждена;
- remaining P2: mobile tap targets ниже `44px` и watch-перепроверка object/business после стабилизации smoke-среды.

Добавлены следующие задачи:

- `SMOKE-ENV-001`;
- `UXFIX-FINAL-QA-RETRY-001`;
- `UXFIX-FINAL-MOB-RETRY-001`;
- `UXVIS-TAP-001`.

### SMOKE-ENV retry and targeted fixes

Выполнен `SMOKE-ENV-001` в Architect/Main.

Решение по среде:

- длинные mixed Playwright-прогоны на Windows/Edge больше не использовать для приемки;
- проверять один сценарий за один короткий Node/Playwright process;
- при зависаниях чистить только headless Edge с `playwright_chromiumdev_profile`;
- пользовательские Edge/WebView окна не трогать.

Исправлено без правки `js/app.js`:

- `js/pages/business-filter-polish.js`: business selected tag и `Сбросить` восстанавливаются после `list/map` rerender;
- `js/filters/residential-list-guard.js`: mobile active pill `Новостройки` / `Готовые ЖК` теперь считается residential page для синхронизации счетчика;
- `js/behavior/test-selectors.js`: `result-count` выбирается стабильнее рядом с view controls;
- `index.html`: обновлены cache-bust версии `test-selectors-5`, `residential-list-guard-5`, `biz-filter-dropdown-12`.

Проверено:

- `node --check` для измененных JS;
- stories mobile: viewer opens/closes, overflow `0`;
- business `Аренда`: selected tag/reset сохраняются после `grid/list/map` на `390px` и `430px`, overflow `0`, residential tags не протекают;
- mobile `Новостройки`: активный pill `Новые`, `142 карточки`, cards `142`, overflow `0`;
- direct object route `#card=ЖК Речной Порт`: route opens, tabs/back visible, overflow `0`.

Остается watch:

- object open by catalog-card click still blocks headless automation; direct hash route passes.
- mobile tap targets below `44px` остаются P2 для Visual System.

### ROLE-PROFILES report intake

Приняты отчеты профильных чатов по role profiles, favorite tags, trust badges, stories и future-рецензиям.

Добавлен `docs/ROLE_PROFILES_REPORT_INTAKE.md`.

Итог:

- ordinary user в v1 остается в сценариях likes, favorites, subscriptions, recommendation reviews и favorite tags;
- role profile отделен от личного профиля и кабинета компании;
- paid profile покупает инструменты публичного присутствия, но не trust, рейтинг, статус `Эксперт` или независимость мнения;
- company/partner materials должны маркироваться отдельно от органических рецензий;
- user stories/news не запускать для обычного пользователя в v1;
- role-profile UI, тариф физлица, stories от авторов и реальные favorite-tag aggregates не запускать без owner decisions и backend/auth.

Обновлены:

- `docs/PROJECT_INDEX.md`;
- `docs/THREAD_REGISTRY.md`.

Код, CSS, JS, HTML и `js/app.js` не менялись.
