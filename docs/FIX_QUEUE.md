# Kliper.City: очередь исправлений

Дата создания: 2026-07-06.

Очередь формируется Architect / Main после приемки отчетов рабочих чатов.

## Статусы

| Статус | Значение |
|---|---|
| `candidate` | найдено в аудите, ждет подтверждения |
| `approved` | можно отдавать в работу |
| `in_progress` | отдано рабочему чату |
| `done` | исправлено и проверено |
| `blocked` | нужен владелец или внешний ресурс |

## Assets/Data Cleanup

Источник: `ASSETS_DATA_AUDIT.md`.

| ID | Приоритет | Статус | Задача | Разрешенные файлы | Запрещено |
|---|---|---|---|---|---|
| A-001 | P1 | done | Перевести stories на локальные developer covers вместо Unsplash/CDN | `js/data/stories.js`, при необходимости малый data-helper | `js/app.js`, визуальная смена stories |
| A-002 | P1 | done | Убрать Google favicons из avatars застройщиков через локальный/text fallback | `js/data/developers.js` или отдельный малый data-модуль | `js/app.js`, удаление карточек/аватаров |
| A-003 | P2 | done | Заменить `FALLBACK_IMAGES` ЖК на локальные fallback-обложки | `js/catalog/building-cards.js` | массовая правка `js/data/buildings.js` |
| A-004 | P2 | candidate | Подготовить план локализации бизнес-галерей | `js/data/business-spaces.js`, будущие local assets | менять композицию карточек |
| A-005 | blocked | done | Убрать Clearbit-запросы без правки legacy | отдельный interceptor-модуль только после решения | `js/app.js` без отдельного решения |

## Что ждем перед запуском

Перед переводом задач из `candidate` в `approved` нужно принять:

1. `Regression QA` - чтобы убедиться, что нет P0 выше ресурсного шума.
2. `Filters System` - чтобы не трогать business/data в момент фильтровых конфликтов.
3. `Visual System` - если задача может изменить вид первого экрана/stories.

## Первое рекомендуемое исправление

Если Regression QA не найдет P0, первым безопасным исправлением выбрать `A-001`: заменить внешние stories-изображения локальными обложками застройщиков.

Причина:

- stories на первом экране;
- локальные developer covers уже есть;
- можно сделать без `js/app.js`;
- низкий риск логики, если сохранить структуру данных.

## Stories & Motion

Источник: `STORIES_MOTION_AUDIT.md`.

| ID | Приоритет | Статус | Задача | Разрешенные файлы | Запрещено |
|---|---|---|---|---|---|
| S-001 | P1 | done | Провести baseline-проверку текущего правила stories без правок | только отчет/чеклист | менять JS/CSS |
| S-002 | P1 | done | Зафиксировать state machine stories без изменения визуала | `js/behavior/story-categories.js` | Motion, кольца, `js/app.js` |
| S-003 | P1 | done | Уточнить первый/второй upward-intent на top | `js/behavior/story-categories.js` | новые global listeners |
| S-004 | P1 | done | Добавить guards для wheel, чтобы stories не перехватывали чужие overlay/modal | `js/behavior/story-categories.js` | изменение viewer-дизайна |
| S-005 | P2 | done | Добавить reduced-motion слой для stories | `css/story-categories.css`, возможно JS guard | менять размеры/кольца |
| S-006 | P2 | done | Motion только для viewer entrance после стабилизации scroll-правила | `js/behavior/story-categories.js` | анимировать width/height/кольца |

## Решение по stories

Первую реализацию задачи номер один делать **без Motion** и **без изменения CSS-колец**.

Причина:

- текущая логика уже частично реализована;
- Motion-overlap сейчас не подтвержден;
- основной риск в state machine и глобальном `wheel` listener;
- два слоя колец лучше не трогать в этой задаче.

## Regression QA

Источник: `regression-audit-2026-07-06.md`.

| ID | Приоритет | Статус | Задача | Разрешенные файлы | Запрещено |
|---|---|---|---|---|---|
| R-001 | P1 | done | Убрать смешанное состояние object/catalog/profile: object-view не должен блокировать переход в профиль | `js/behavior/page-restore.js`, `js/catalog/business-spaces.js`, `css/ui-ux-pro-max.css` | `js/app.js` без отдельного решения |
| R-002 | P1 | done | Прямой `index.html` после профиля не должен самовосстанавливать `#card=Мария` | `js/behavior/page-restore.js` | ломать явный `#card=...` deep link |
| R-003 | P1 | done | `Новостройки`: list-view не должен менять счетчик `142` на `143` | `js/filters/residential-list-guard.js`, `index.html` | менять данные ЖК без причины |

## Company Cabinet

Источник: `CAB-001-company-cabinet-v1-design.md`, `pages-company-cabinet.md`.

| ID | Приоритет | Статус | Задача | Разрешенные файлы | Запрещено |
|---|---|---|---|---|---|
| CAB-001 | P1 | done | Создать v1 UI-экран кабинета компании без backend/auth | `js/data/company-cabinet.js`, `js/pages/company-cabinet/company-cabinet-page.js`, `css/company-cabinet.css`, `index.html` | `js/app.js`, CRM, реальные отправки, смешивание с профилем пользователя |

## Third Wave Acceptance

Источник: `CHAT_TASK_BACKLOG.md`, third wave after Company Cabinet v1.

| ID | Приоритет | Статус | Задача | Артефакт | Запрещено |
|---|---|---|---|---|---|
| QA-003 | P0 | done | Полный smoke после кабинета компании | `docs/QA_003_REGRESSION_REPORT.md` | хаотичные UI-правки |
| MOB-003 | P1 | done | Мобильная приемка v1 после кабинета | `docs/MOB_003_MOBILE_QA_REPORT.md` | менять desktop layout |
| CAB-002 | P1 | done | Приемка кабинета компании v1 | `docs/CAB_002_COMPANY_CABINET_QA.md` | backend/auth, CRM |
| VIS-003 | P1 | done | Визуальная приемка v1 после кабинета | `docs/VIS_003_VISUAL_ACCEPTANCE.md` | менять JS-логику |
| AUTH-002 | P1 | done | Требования к авторизации и ролям | `docs/AUTH_002_BACKEND_AUTH_REQUIREMENTS.md` | реализовывать backend сейчас |

## Pricing / Billing

Источник: задача владельца по готовым тарифам размещения.

| ID | Приоритет | Статус | Задача | Артефакт | Запрещено |
|---|---|---|---|---|---|
| BILL-001 | P1 | done | Зафиксировать модель тарифов размещения | `docs/BILL_001_PRICING_MODEL.md`, `js/data/company-pricing.js` | реальная оплата |
| CAB-003 | P1 | done | Добавить `Тариф и лимиты` в кабинет компании | `js/pages/company-cabinet/company-cabinet-page.js`, `css/company-cabinet.css` | backend/auth, CRM |
| CAB-004 | P1 | done | Довести кабинет компании v1 после тарифов: внимание, готовность, честные v1-действия | `docs/CAB_004_COMPANY_CABINET_V1_POLISH.md`, `js/pages/company-cabinet/company-cabinet-page.js`, `css/company-cabinet.css`, `js/behavior/page-restore.js` | backend/auth, CRM, `js/app.js` |
| CAB-005 | P1 | done | Финальная приемка кабинета компании v1-прототипа | `docs/CAB_005_COMPANY_CABINET_V1_ACCEPTANCE.md` | новые mock-функции вместо backend/auth |
| VIS-004 | P1 | done | Сделать визуальную страницу тарифов | `js/pages/pricing/business-pricing-page.js`, `css/business-pricing.css` | менять каталог |
| AUTH-003 | P1 | done | Описать billing/auth требования | `docs/AUTH_003_BILLING_REQUIREMENTS.md` | реализовывать backend сейчас |
| QA-004 | P1 | done | Smoke после внедрения тарифов | `docs/QA_004_PRICING_REGRESSION_REPORT.md` | хаотичные UI-правки |
| MOB-004 | P1 | done | Mobile-проверка тарифов | `docs/MOB_004_PRICING_MOBILE_QA.md` | менять desktop |
| R-004 | P2 | done | Проверить, почему `window.Motion` / `window.KLIPER_MOTION` не видны в одном regression-прогоне | `js/behavior/motion-runtime.js`, подключение в `index.html` | переустанавливать Motion |
| R-005 | P2 | done | Dark theme: профильная кнопка не должна держать светлый визуальный слой | CSS dark theme слой | менять header layout |

## Backend/Auth Contracts

Источник: переход после принятого `Company Cabinet v1`.

| ID | Приоритет | Статус | Задача | Артефакт | Запрещено |
|---|---|---|---|---|---|
| AUTH-004 | P1 | done | Собрать единый backend/auth контракт v1 | `docs/AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md` | реализовывать backend сейчас |
| AUTH-005 | P1 | done | Подготовить первый backend implementation brief | `docs/AUTH_005_BACKEND_IMPLEMENTATION_BRIEF.md` | писать backend в этой задаче |
| AUTH-006 | P1 | done | Спроектировать backend storage/schema plan | `docs/AUTH_006_STORAGE_SCHEMA_PLAN.md` | выбирать БД/писать миграции без отдельного решения |
| AUTH-007 | P1 | done | Спроектировать frontend API adapter с mock fallback | `docs/AUTH_007_FRONTEND_API_ADAPTER_PLAN.md` | подключать backend без отдельной реализации |
| AUTH-008 | P1 | done | Подготовить backend stack decision checklist | `docs/AUTH_008_BACKEND_STACK_DECISION_CHECKLIST.md` | писать backend-код до выбора стека |
| AUTH-009A | P1 | done | Подготовить API mock server contract and sample responses | `docs/AUTH_009A_API_MOCK_SERVER_CONTRACT.md` | интегрировать backend в сайт |
| AUTH-009 | P1 | blocked | Реализовать первый read-only backend slice | будущий backend code | нужен выбор стека/решение владельца |
| AUTH-010 | P1 | done | Реализовать skeleton frontend API adapter с disabled-by-default mock fallback | `js/api/*`, `auth-state.js`, pricing/cabinet adapter hooks | реальный backend, `js/app.js` |
| AUTH-011 | P1 | done | Adapter skeleton acceptance QA и mock server/dev toggle | `AUTH_011_ADAPTER_ACCEPTANCE_AND_DEV_TOGGLE.md`, `kliper-api-dev-toggle.js`, mock server | включать backend по умолчанию |
| AUTH-012 | P1 | done | Backend stack final decision and real read-only backend slice | `AUTH_012_BACKEND_STACK_DECISION.md` | backend-код в отдельной задаче |
| AUTH-013 | P1 | candidate | Backend scaffold plan and file boundary | будущий `backend/`, Prisma, Fastify modules | устанавливать зависимости без явного старта backend-кода |

## Filters System

Источник: `FILTERS_SYSTEM_AUDIT.md`.

| ID | Приоритет | Статус | Задача | Разрешенные файлы | Запрещено |
|---|---|---|---|---|---|
| F-001 | P1 | done | Разобрать и исправить расхождение счетчика grid/list `142`/`143` | catalog/filter behavior after targeted search | `js/app.js`, массовая правка данных |
| F-002 | P1 | done | Убедиться, что shared selected-tags не конфликтует с business selected-tags | `js/filters/selected-filter-inline.js`, `js/pages/business-filter-polish.js` | объединять state-системы через рефакторинг |
| F-003 | P2 | done | Зафиксировать старые fast/mobile filter layers как disconnected и не подключать их обратно | docs only or comments if needed | подключать `newbuild-fast-filters.js` без решения |

## Visual System

Источник: `VISUAL_SYSTEM_AUDIT.md`.

| ID | Приоритет | Статус | Задача | Разрешенные файлы | Запрещено |
|---|---|---|---|---|---|
| V-001 | P1 | done | Снизить mobile first-screen перегрузку без изменения filter logic | CSS visual layer only after route P1 | менять JS фильтров |
| V-002 | P1 | done | Выровнять business card visual language с основными карточками | `css/business-spaces.css`, visual CSS | менять бизнес-данные/фильтрацию |
| V-003 | P1 | done | Исправить mobile stories viewer offset/cropping | `css/story-categories.css` | менять кольца/progress без запроса |
| V-004 | P2 | done | Унифицировать selected tags и reset spacing/dark colors | `css/ui-ux-pro-max.css`, related CSS | менять filter state |
| V-005 | P2 | done | Empty-state copy сделать нейтральной для search/filter | data/text layer после поиска источника | добавлять CTA/формы |

## Первый блок исправлений

`R-001` и `R-002` закрыты.

Причина:

- P0 нет;
- route-state дефект влияет на профиль, бизнес, object pages и mobile QA;
- пока он не исправлен, Visual/Mobile/Regression будут получать загрязненные состояния;
- исправление должно быть точечным и не требует `js/app.js`, если причина находится в behavior-слоях.

Итог:

- прямой `index.html` после профиля возвращает каталог `Застройщики`;
- `Для бизнеса -> Моя страница` очищает business host и не оставляет бизнес-слой поверх профиля;
- preview объекта с legacy z-index `900` больше не блокирует верхнюю навигацию;
- при переходе из preview в профиль preview закрывается штатной кнопкой закрытия;
- `js/app.js` не редактировался.

## Второй блок исправлений

`R-003` закрыт.

Итог:

- источник скачка `142 -> 143` - legacy list-view добавлял карточку `Тюменский квартал`, которой нет в residential grid;
- добавлен внешний guard для residential list-view;
- guard скрывает только known legacy leak `Тюменский квартал` на страницах `Новостройки` / `Готовые ЖК`;
- счетчик пересчитывается по видимым residential list articles;
- `Готовые ЖК` и `Для бизнеса` проверены без изменений результата;
- `js/app.js` не редактировался.

## Финальный блок очереди

Закрыты `F-001` - `F-003`, `V-001` - `V-005`, `S-001` - `S-006`, `R-004` - `R-005`, `A-001` - `A-003`, `A-005`.

Итог:

- business selected-tags отделены от shared residential selected-tags;
- старые fast/mobile filter layers не подключались обратно;
- mobile viewer stories открывается без отрицательного offset и без horizontal overflow;
- stories wheel получил guard против чужих modal/dialog/overlay;
- reduced-motion слой отключает лишние transitions/animations у stories;
- Motion runtime ждет появление `window.Motion` перед статусом unavailable;
- вход story-viewer анимируется только через `window.KLIPER_MOTION` и только для opacity/transform;
- dark profile button и selected filter chips получили темный визуальный слой;
- empty-state текст стал нейтральным;
- Clearbit/GStatic/Google favicon и Unsplash `img`-запросы перехватываются ранним guard без правки `js/app.js`;
- stories-data и fallback-обложки ЖК переведены на локальные assets;
- `js/app.js` не редактировался.

Проверено:

- `node --check` для измененных JS;
- desktop load: `window.Motion`, `window.KLIPER_MOTION`, `kliper-motion-ready`;
- network load: нет failed requests и 4xx responses после guard;
- mobile `390x844`: horizontal overflow `0`, story viewer top/left `0`, width `390`;
- dark theme: profile button dark background, neutral empty-state text;
- business фильтр: выбранный тег уходит в business inline, shared inline не появляется.

## Вторая волна: принятые дефекты и первый safe-fix batch

Источник: отчеты `Object Pages`, `Catalog Core`, `Business`, `Profile Social`, `Company Cabinet`, `Mobile QA`.

| ID | Приоритет | Статус | Задача | Разрешенные файлы | Запрещено |
|---|---|---|---|---|---|
| BUS-002 | P1 | done | Сохранять выбранные business-tags и `Сбросить` после смены вида `grid/list/map` | `js/catalog/business-spaces.js`, `js/pages/business-filter-polish.js` | объединять business/residential state, править `js/app.js` |
| OBJ-003 | P2 | done | Кнопка `Все рецензии` должна открывать модалку с заголовком `Все рецензии` | `js/pages/object/sidebar-list-modals.js` | менять структуру object page или данные рецензий |
| R-006 | P1 | done | После перехода object page -> profile очищать stale `#card=...` и object route class | `js/behavior/page-restore.js` | ломать явный deep link `#card=...` |
| MOB-002 | P1 | done | Mobile object page: заголовок/hero не должны залезать под верхний мобильный слой | `css/ui-ux-pro-max.css` | менять desktop layout |
| OBJ-004 | P1 | done | Back из ЖК, открытого из каталога, не должен вести к застройщику | `js/behavior/page-restore.js` | `js/app.js` без отдельного решения |
| CAT-003 | P1 | done | Residential list-view trap / исчезающие view-controls | `js/filters/residential-view-controls-guard.js`, `index.html` | точечные CSS-hack без приемки |

Проверка safe-fix batch:

- `node --check`: `business-spaces.js`, `business-filter-polish.js`, `sidebar-list-modals.js`, `page-restore.js`;
- desktop browser: console/pageerror по проверяемым сценариям не найдено;
- business `Аренда`: inline-chip и reset сохраняются в `grid/list/map`;
- `#card=Брусника`: `Все рецензии` открывает правильную модалку;
- object -> profile: hash пустой, object route class снят;
- mobile `390x844`: object heading ниже header, horizontal overflow `0`.

Проверка safe-fix batch 2:

- `node --check`: `page-restore.js`, `residential-view-controls-guard.js`;
- `Новостройки -> list`: view-controls остаются в строке счетчика;
- `list -> grid -> list -> map`: пользователь не застревает в list-view;
- `preview -> browser Back`: preview закрывается без ухода на `about:blank`;
- `большая страница ЖК -> Назад`: возврат в исходный каталог `Новостройки`, не в `Брусника`.
