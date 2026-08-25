# Kliper.City: задачи для отдельных рабочих чатов

Дата: 2026-07-06.

Назначение: держать отдельные задачи для будущих чатов так, чтобы каждый чат мог взять одну зону, не мешать другим и не трогать `js/app.js` без отдельного решения.

## Правило работы

Каждый чат перед стартом читает:

- `AGENTS.md`
- `docs/PROJECT_INDEX.md`
- `docs/CHAT_OWNERSHIP.md`
- свой раздел из `docs/WORKSTREAM_PROMPTS.md`
- эту очередь задач

Если задача требует `js/app.js`, чат не правит его сам. Он фиксирует причину и возвращает задачу в Architect / Main.

## P0 / P1: ближайшие задачи

| ID | Чат | Приоритет | Задача | Что проверить | Ограничения |
|---|---|---|---|---|---|
| QA-001 | Regression QA | P0 | Пройти полный smoke v1 после последних правок | главная, застройщики, новостройки, готовые ЖК, бизнес, профиль, stories, dark, mobile | не менять код |
| QA-002 | Regression QA | P1 | Отдельно проверить зависания/подвисания после переключений | stories scroll, фильтры, view grid/list/map, переходы карточка -> назад | фиксировать сценарий воспроизведения |
| OBJ-001 | Object Pages | P1 | Проверить большие страницы ЖК и застройщика | открытие, `#card`, кнопка назад, related cards, modals, dark/mobile | не трогать каталог и фильтры |
| OBJ-002 | Object Pages | P1 | Разделить список дефектов object pages на точечные CSS/JS и legacy-route | что можно чинить в `js/pages/object/*`, что требует `js/app.js` | `js/app.js` только через Architect |
| CAT-001 | Catalog Core | P1 | Довести карточные actions до единого поведения | лайк, подписка, рецензия, `aria-pressed`, localStorage, профиль | не менять фильтры и stories |
| CAT-002 | Catalog Core | P1 | Разобрать list-view trap | после list-view должны оставаться способы вернуться в grid/map/sort | вероятно требует legacy/app решения |
| FIL-001 | Filters System | P1 | Стабилизировать фильтры всех каталогов | новостройки, готовые ЖК, бизнес, selected tags, reset, dark/mobile | не менять карточки |
| FIL-002 | Filters System | P1 | Проверить, что старые слои фильтров не всплывают | старый placeholder, старая подложка, hidden source, selected tags | не подключать отключенные fast layers |
| BUS-001 | Business | P1 | Финальная проверка бизнес-раздела | фильтры, selected tags после счетчика, reset, grid/list/map, dark theme | не менять shared residential state |
| STO-001 | Stories & Motion | P1 | Проверить state machine stories | большие по умолчанию, маленькие при скролле вниз, первое/второе движение вверх, раскрытие третьим upward intent | без Motion до стабильности |
| STO-002 | Stories & Motion | P1 | Найти источник визуального наложения колец stories | сегментное кольцо, цветной legacy-слой, белая рябь, dark/light | не менять размеры без задачи |
| MOT-001 | Stories & Motion | P2 | Подготовить один motion-layer без наложения анимаций | только opacity/transform, reduced-motion, без width/height/layout анимаций | не добавлять новые зависимости |
| VIS-001 | Visual System | P1 | Dark theme audit | фильтры, empty-state, selected tags, бизнес-контейнер, object pages | JS не менять |
| VIS-002 | Visual System | P2 | Единая визуальная сетка desktop/mobile | отступы, размеры stories, карточки 4 в ряд, кнопки действий | не менять данные и логику |
| PRO-001 | Profile Social | P1 | Проверить профиль пользователя как v1-витрину | избранное, подписки, рецензии, лента, друзья/чаты визуально | backend не имитировать |
| CAB-001 | Company Cabinet | P1 | Спроектировать кабинет компании для v1 | route, блоки, документы, чат, заявки, предложения, связь с публичной страницей | сначала документация, потом код |
| AUTH-001 | Backend/Auth | P2 | Подготовить требования к авторизации | пользователь, застройщик, роли, localStorage -> backend migration | реализация в конце v1 |
| MOB-001 | Mobile QA | P1 | Мобильная приемка после каждого крупного блока | 390px, 430px, overflow, тапы, stories, фильтры, карточки | сначала отчет |

## Третья волна: после кабинета компании

Эта волна актуальнее старого списка выше. Ее цель - принять v1 после внедрения кабинета компании и не запускать хаотичные правки.

| ID | Чат | Приоритет | Задача | Что проверить / сделать | Ограничения |
|---|---|---|---|---|---|
| QA-003 | Regression QA | P0 | Полный smoke после `Company Cabinet v1` | главная, застройщики, новостройки, готовые ЖК, бизнес, профиль, кабинет компании, stories, dark, mobile, консоль | сначала отчет, код менять только при явном P0/P1 |
| MOB-003 | Mobile QA | P1 | Мобильная приемка v1 после кабинета | 390px и 430px: верхняя панель, stories, фильтры, карточки, бизнес, профиль, кабинет компании, отсутствие horizontal overflow | не менять desktop |
| CAB-002 | Company Cabinet | P1 | Приемка и доводка кабинета компании v1 | desktop/mobile/dark, все 32 застройщика, fallback для компаний без mock-данных, связь с публичной страницей | без backend/auth, без CRM, без `js/app.js` |
| VIS-003 | Visual System | P1 | Визуальная приемка v1 после кабинета | единая плотность, фильтры, selected tags, stories-кольца, dark theme, кабинет компании в общем стиле | JS-логику не менять |
| AUTH-002 | Backend/Auth | P1 | Требования к будущей авторизации и ролям | пользователь, компания, застройщик, `company_owner`, `manager`, `editor`, разделение профиля и кабинета, миграция localStorage | backend не реализовывать сейчас |

## Тарифы размещения

| ID | Чат | Приоритет | Задача | Что проверить / сделать | Ограничения |
|---|---|---|---|---|---|
| BILL-001 | Architect / Main | P1 | Зафиксировать модель тарифов размещения | планы, цены, лимиты карточек, годовой бонус, доп. карточка, v1/v2 границы | не реализовывать оплату |
| CAB-003 | Company Cabinet | P1 | Добавить блок `Тариф и лимиты` в кабинет компании | текущий тариф, лимит карточек, использовано, CTA на тарифы | без backend/auth и CRM |
| VIS-004 | Visual System | P1 | Сделать визуальную страницу тарифов | route `#business-pricing`, desktop/mobile/dark, карточки тарифов | не менять JS-логику каталога |
| AUTH-003 | Backend/Auth | P1 | Описать billing/auth требования | plan, subscription, limits, addons, roles, API candidates | backend не реализовывать сейчас |
| QA-004 | Regression QA | P1 | Smoke после внедрения тарифов | кабинет, pricing route, возврат в кабинет, каталог, консоль | код менять только при явном дефекте |
| MOB-004 | Mobile QA | P1 | Mobile-проверка тарифов | 390px/430px, pricing cards, CTA, cabinet block, overflow | не менять desktop |

## Backend/Auth contracts

| ID | Чат | Приоритет | Задача | Что проверить / сделать | Ограничения |
|---|---|---|---|---|---|
| AUTH-004 | Backend/Auth | P1 | Собрать единый backend/auth контракт v1 | user/company/admin роли, сущности, API, billing, CRM, social, migration localStorage | backend не реализовывать в этой задаче |
| AUTH-005 | Backend/Auth | P1 | Подготовить первый backend implementation brief | выбран read-only auth/company/billing slice, endpoints, данные, проверки доступа, migration preview | backend не реализовывать в этой задаче |
| AUTH-006 | Backend/Auth | P1 | Спроектировать backend storage/schema plan | таблицы, индексы, seed/import, связи с текущими data-файлами | backend не реализовывать в этой задаче |
| AUTH-007 | Backend/Auth + Frontend Integration | P1 | Спроектировать frontend API adapter с mock fallback | как статический frontend вызывает backend при наличии URL и сохраняет текущий mock режим без backend | не подключать backend-код без отдельной реализации |
| AUTH-008 | Backend/Auth | P1 | Подготовить backend stack decision checklist | DB, hosting, auth/session, provider choices, dev/prod strategy | перед написанием backend-кода |
| AUTH-009A | Backend/Auth | P1 | Подготовить API mock server contract and sample responses | health, me, billing plans, company cabinet, subscription, migration preview | без реального backend и без интеграции в сайт |
| AUTH-009 | Backend/Auth | P1 | Реализовать первый read-only backend slice | только после выбора стека и/или AUTH-009A | не начинать без решения владельца/стека |
| AUTH-010 | Frontend Integration | P1 | Реализовать skeleton frontend API adapter с disabled-by-default mock fallback | `js/api/*`, auth-state, pricing/cabinet adapter hooks | done, без реального backend, не трогать `js/app.js` |
| AUTH-011 | Frontend Integration + QA | P1 | Принять adapter skeleton и подготовить mock server/dev toggle | disabled mode, mock fallback, cabinet/pricing data-api-source, 401/403/404 rules | done, backend не включается по умолчанию |
| AUTH-012 | Backend/Auth | P1 | Выбрать backend stack и начать real read-only backend slice | framework, DB, cookie sessions, seed/import, health/me/billing/cabinet | done: stack decision accepted, backend code отдельно |
| AUTH-013 | Backend/Auth | P1 | Подготовить backend scaffold plan and file boundary | `backend/`, package scripts, Prisma folders, module boundaries, .env.example | не устанавливать зависимости без явного старта backend-кода |

## UX-005: site layout and usability audit wave

| ID | Чат | Приоритет | Задача | Что проверить | Ограничения |
|---|---|---|---|---|---|
| UXQA-001 | Regression QA | P1 | Общий smoke удобства и технических ошибок | desktop routes, console/page errors, overflow, navigation, dark/light | отчет без правок |
| UXVIS-001 | Visual System | P1 | Визуальная иерархия и подсветки | активные состояния, плотность, сетка, spacing, контраст | JS не менять |
| UXMOB-001 | Mobile QA | P1 | Мобильная проверка удобства | 390/430px, тапы, sticky/overlay, overflow, карточки, фильтры | desktop не менять |
| UXFIL-001 | Filters System | P1 | Проверка фильтров и старых слоев | dropdowns, selected tags, reset, old placeholders, dark/mobile | карточки не менять |
| UXSTO-001 | Stories & Motion | P1 | Stories layout/state audit | кольца, большие/малые состояния, viewer, scroll/open, layers | без новых анимаций |
| UXCAT-001 | Catalog Core | P1 | Каталожные карточки и controls | карточки, action buttons, grid/list/map, статусы, подсветки | фильтры не менять |
| UXOBJ-001 | Object Pages | P1 | Большие страницы ЖК/застройщика | tabs, modals, back, CTA, related blocks, dark/mobile | каталог не менять |
| UXBUS-001 | Business | P1 | Бизнес-раздел | фильтры, карточки, виды, selected tags, empty states | не смешивать residential state |
| UXPRO-001 | Profile Social | P1 | Профиль пользователя | избранное, подписки, рецензии, лента, social blocks | backend не имитировать |
| UXCAB-001 | Company Cabinet | P1 | Кабинет компании и тарифы | dashboard, panels, CTA, tariffs route, dark/mobile | без backend/auth |

## UX-005: accepted report intake and routed fixes

Источник приемки: `docs/UX_005_REPORT_INTAKE.md`.

| ID | Чат | Приоритет | Задача | Что проверить | Ограничения |
|---|---|---|---|---|---|
| UXFIX-QA-001 | Regression QA | P1 | Стабилизировать smoke-среду и повторить минимальную приемку после фиксов | `8765`, console/page errors, overflow, desktop/mobile, light/dark | не менять UI-код |
| UXFIX-CAT-001 | Catalog Core | P1 | Нормализовать catalog controls/actions | `aria-pressed`, `aria-label`, mobile action heights, grid/list/map/sort | `js/app.js` только через Architect |
| UXFIX-FIL-001 | Filters System + Business | P1 | Исправить business selected tag на mobile | выбранный тег после счетчика, reset, view changes, 390/430px | не менять residential state |
| UXFIX-BUS-REVIEW-001 | Business | P1 | Принять исправление business selected tag после Filters patch | 390/430px, light/dark, reset, grid/list/map, no residential leak | review без правок до patch |
| UXFIX-CAB-001 | Company Cabinet | P1 | Изолировать cabinet/pricing mobile route от нижнего каталога | `#company-cabinet`, `#business-pricing`, mobile, dark, back/close | без backend/auth |
| UXFIX-CAB-002 | Company Cabinet | P1 | Убрать технический staging-copy из кабинета/тарифов | `backend/auth`, `v1-прототип`, `не CRM`, обещания оплаты/CRM | не добавлять реальные формы |
| UXFIX-PRO-001 | Profile Social | P1 | Исправить profile fallback counters и visual-only CTA states | empty localStorage, `Поделиться`, `Открыть чат`, dark/mobile | не имитировать backend |
| UXFIX-OBJ-001 | Object Pages | P1 | Повторить и чинить только подтвержденные object route/back/tabs дефекты | back, `Лента`, mobile hero, modals scroll | `js/app.js` только через Architect |
| UXFIX-STO-001 | Stories & Motion | P1 | Разделить stories state-machine и ring-layer cleanup | upward-scroll rules, legacy rings, reduced-motion, mobile | без новых зависимостей и без size changes |
| UXFIX-FINAL-QA-001 | Regression QA | P1 | Финальный smoke после принятой UX-005 patch-пачки | desktop/mobile, light/dark, catalog/business/profile/object/stories/cabinet/pricing, console/overflow | отчет без правок |
| UXFIX-FINAL-MOB-001 | Mobile QA | P1 | Финальная mobile-приемка после принятой UX-005 patch-пачки | 390/430px, taps, overlaps, selected tags, stories, cards, routes | отчет без правок |
| SMOKE-ENV-001 | Regression QA / Architect | P0 | Стабилизировать browser smoke environment | один сервер 8765, очистка только headless automation, запрет длинных mixed-runs, короткие независимые browser sessions | не закрывать пользовательские окна |
| UXFIX-FINAL-QA-RETRY-001 | Regression QA | P1 | Повторить только заблокированные проверки после SMOKE-ENV | object route/back/tabs, business selected tag/reset, stories open/close, console/overflow | отчет без правок |
| UXFIX-FINAL-MOB-RETRY-001 | Mobile QA | P1 | Повторить mobile checks после SMOKE-ENV | 390/430 object/business/stories/tap targets | отчет без правок |
| UXVIS-TAP-001 | Visual System | P2 | Подготовить точечный план tap targets ниже 44px | theme/search/nav pills/view toolbar/cabinet actions на mobile | не править до закрытия retry |

## Product / UX Lab

| ID | Чат | Приоритет | Задача | Что проверить / сделать | Ограничения |
|---|---|---|---|---|---|
| PRODUCT-001 | Product / UX Lab | P1 | Карта направлений улучшения Kliper.City | v1/v2 пользовательские, социальные, onboarding, company/cabinet, trust/value гипотезы | только документы, код не менять |
| PRODUCT-002 | Product / UX Lab | P2 | Подготовить backlog экспериментов для владельца | первые 5-10 экспериментов, критерии пользы, кому отдать на реализацию | не превращать гипотезы в патчи без Architect |
| PRODUCT-004 | Product / UX Lab + Architect / Main | P1 | Пройти функциональный owner-test v1 | `V1_FUNCTIONAL_OWNER_TEST.md`, страницы, функции, v1/v2/backend/admin границы | только документы, не менять сайт |

## Functional Audit v1

Источник: `docs/V1_FUNCTIONAL_DECISIONS.md`, `docs/V1_PAGE_COMPLETION_MATRIX.md`, `docs/V1_FUNCTIONAL_AUDIT_INTAKE.md`.

| ID | Чат | Приоритет | Задача | Что проверить / сделать | Ограничения |
|---|---|---|---|---|---|
| FUNC-QA-001 | Regression QA | P0 | Повторить легкий интерактивный smoke после browser-timeout аудита | load/nav/theme/profile/stories/console/errors | отчет без правок |
| FUNC-CAT-001 | Catalog Core | P1 | Проверить actions карточек застройщиков и route/back | лайк, подписка, рецензия, открытие страницы, возврат | не менять фильтры/stories |
| FUNC-FIL-001 | Filters System | P1 | Проверить residential filters как v1-функцию | selected tags после счетчика, reset, grid/list/map, empty-state | не менять карточки |
| FUNC-DATA-001 | Catalog Core + Data | P1 | Зафиксировать data-семантику `Готовые ЖК` | какие статусы считаются готовыми/сданными, нужен ли новый field | не править данные до решения |
| FUNC-BUS-001 | Business + Filters System | P1 | Проверить business filters/reset/view modes/repeated nav | выбранные теги, reset, dark/mobile, повторное нажатие `Бизнес` | не смешивать residential state |
| FUNC-OBJ-001 | Object Pages | P1 | Проверить object page route/back/tabs/modals | ЖК через `#card`, назад, вкладки, модалки, mobile | `js/app.js` только через Architect |
| FUNC-DEV-001 | Object Pages + Company Cabinet | P1 | Проверить developer page и CTA в кабинет | публичная страница, объекты, органика/официальное, `#company-cabinet` | не смешивать public/cabinet слои |
| FUNC-PRO-001 | Profile Social | P1 | Проверить профиль как social showcase | local likes/subscriptions/reviews, empty state, visual-only friends/chats | backend не имитировать |
| FUNC-STO-001 | Stories & Motion | P1 | Проверить stories state machine и ring layers | большие/малые, upward rules, viewer, старые кольца, wheel guards | не добавлять Motion/зависимости |
| FUNC-CAB-001 | Company Cabinet | P1 | Проверить кабинет explicit/fallback компаний | 3 custom + fallback, desktop/mobile/dark, prototype CTA | без backend/auth |
| FUNC-PRICE-001 | Company Cabinet + Billing | P1 | Проверить pricing route и prototype CTA | `#business-pricing`, return to cabinet, no payment promise | без оплаты/backend |
| FUNC-AUTH-001 | Backend/Auth | P2 | Превратить принятую матрицу в admin/backend requirements | auth/admin/data ownership, migration, roles | после приемки P1 |

## Role Profiles / Favorite Tags

Источник: `docs/ROLE_PROFILES_SCOPE.md`, `docs/ROLE_PROFILES_TASK_BRIEFS.md`.

Статус: продуктовая модель подтверждена для документации и будущего планирования. Не реализовывать в интерфейсе без отдельного брифа Architect / Main.

| ID | Чат | Приоритет | Задача | Что проверить / сделать | Ограничения |
|---|---|---|---|---|---|
| ROLE-PROD-001 | Product / UX Lab | P1 | Поддерживать scope ролевых профилей | уточнять роли, теги любимого, рецензии, тариф автора, v1/v2/v3 границы | только документы |
| ROLE-PROD-002 | Product / UX Lab + Architect / Main | P1 | Принять owner brief по ролевым профилям | пройти `ROLE_PROFILES_OWNER_BRIEF.md`, подтвердить решения владельца, выбрать дату/этап реализации | не отдавать в код до подтверждения владельца |
| ROLE-PRO-001 | Profile Social | P2 | Спроектировать профильный future-state CTA `Создать профессиональный профиль` | сценарий выбора роли, показ тарифа до создания, личный vs ролевой профиль, приватность | не реализовывать код без брифа; обычный пользователь не публикует новости/stories |
| ROLE-PRO-002 | Profile Social | P2 | Спроектировать теги любимого для обычного пользователя | `Люблю гулять`, `Лучшая еда`, `Куда сходить с детьми`, приватность, друзья/незнакомые | не превращать в публичные новости или авторские публикации |
| ROLE-CAT-001 | Catalog Core | P2 | Описать карточные сигналы `лайк + тег любимого` | как карточка предлагает тег после сохранения, какие агрегированные сигналы могут отображаться | не менять карточки без отдельной задачи |
| ROLE-OBJ-001 | Object Pages | P2 | Спроектировать верх рецензий-рекомендаций в карточке | лучшие/свежие/подтвержденные, роль автора, двойной тег, статус актуальности | не смешивать с отзывами/жалобами; рецензия = почему понравилось |
| ROLE-AUTH-001 | Backend/Auth | P2 | Добавить в будущий auth/data plan модели ролевых профилей | использовать `ROLE_AUTH_APPENDIX.md`: `role_profile`, verification, review visibility, double tag, favorite tags, review lifecycle | backend не реализовывать сейчас |
| ROLE-BILL-001 | Billing/Auth | P2 | Спроектировать отдельный тариф физлица `Профиль автора` | отличие от B2B-тарифов, лимиты, grace/basic/inactive после неоплаты | не смешивать с `BILL-001` company placement; статус эксперта нельзя купить |
| ROLE-VIS-001 | Visual System | P2 | Подготовить визуальные правила бейджей ролей | одинарные/двойные теги, подтверждение, партнерский материал, compact/full карточка специалиста | JS не менять |
| ROLE-STO-001 | Stories & Motion | P3 | Зафиксировать границу stories для ролей | обычный пользователь не ведет stories; stories доступны компаниям и ролевым профилям | не реализовывать до решения v2/backend |
| ROLE-QA-001 | Regression QA + Mobile QA | P3 | Будущий чеклист разделения личного/ролевого/компании | профиль пользователя, ролевой профиль, кабинет компании, приватность, mobile | отчет без правок |
| ROLE-OWNER-001 | Product / UX Lab | P1 | Принять owner decision pack | проверить `ROLE_PROFILES_OWNER_DECISION_PACK.md`, убрать двусмысленности, подготовить короткий список вопросов владельцу | только документы, код не менять |
| ROLE-PRO-003 | Profile Social | P2 | Уточнить CTA и privacy flow | на основе owner decision pack описать personal profile -> role profile future-state и privacy defaults | без UI-патча |
| ROLE-CAT-002 | Catalog Core | P2 | Уточнить favorite-tag aggregates | threshold, формулировки агрегатов, где показывать сигнал в карточке | без правки карточек |
| ROLE-OBJ-002 | Object Pages | P2 | Уточнить блок `Почему советуют` | структура 2/3/4 рецензий, freshness, скрытое имя, double role context | без object-page патча |
| ROLE-VIS-002 | Visual System | P2 | Подготовить token/spec для role/trust labels | role badge, verification, partner marker, mobile compact, dark variants | CSS не менять |
| ROLE-STO-002 | Stories & Motion | P3 | Описать labels и источники future role stories | platform/company/role author labels, commercial flag, expiration, moderation | stories код не менять |
| ROLE-QA-002 | Regression QA + Mobile QA | P3 | Acceptance matrix для role profiles | сценарии, права, privacy, mobile, dark, billing states | сайт не проверять сейчас |
| CAB-ROLE-001 | Company Cabinet | P2 | Граница company representative vs company cabinet | представитель компании, права, B2B тариф, связь с ролевым профилем физлица | без cabinet UI-патча |
| AUTH-014 | Backend/Auth | P1 | Синхронизировать approved role decisions с auth/storage/contracts roadmap | approved owner decisions, `AUTH_004`, `AUTH_006`, `ROLE_AUTH_002_AUTH_STORAGE_CONTRACT_DELTA.md`, future migration | только документы, backend-код не писать |
| PRODUCT-003 | Product / UX Lab | P1 | Обновить v1/v2 roadmap и owner summary после approval | role profiles future-state, v1 границы, что не кодим сейчас | только документы |
| ROLE-PRO-004 | Profile Social | P2 | Финализировать approved profile CTA/privacy spec | CTA `Стать автором или специалистом`, privacy default, approved tariff copy | без UI-патча |
| ROLE-CAT-003 | Catalog Core | P2 | Финализировать approved favorite-tag aggregate spec | стандартные теги, threshold, public aggregates, no custom tags in v1 | без карточного патча |
| ROLE-OBJ-003 | Object Pages | P2 | Финализировать approved `Почему советуют` spec | 3 рецензии, company/partner exclusion, freshness, hidden author | без object-page патча |
| ROLE-VIS-003 | Visual System | P2 | Финализировать approved role/trust token plan | role/trust/commercial/state tokens, mobile compact, approved copy | CSS не менять |
| ROLE-STO-003 | Stories & Motion | P3 | Финализировать approved story source/label rules | ordinary user excluded, platform/company/role_profile source, commercial labels | stories код не менять |
| CAB-ROLE-002 | Company Cabinet | P2 | Финализировать approved representative boundary | public company representative role + separate cabinet membership | без cabinet UI-патча |
| ROLE-QA-003 | Regression QA | P3 | Обновить future acceptance gates по approved decisions | approved decisions, P0/P1 gates, privacy, permissions, billing | сайт не проверять сейчас |
| ROLE-MOB-003 | Mobile QA | P3 | Обновить mobile future gates по approved decisions | 390/430, CTA, badges, `Почему советуют`, no overflow | сайт не проверять сейчас |

## Задачи, которые нельзя делать вслепую

| ID | Почему осторожно | Что нужно перед работой |
|---|---|---|
| APP-001 | `js/app.js` legacy/generated держит основной SPA-каркас | отдельное решение Architect / Main и regression до/после |
| ROUTE-001 | `#card=...` общий для профиля, ЖК и застройщика | карта сценариев и тесты возврата |
| MOTION-LEGACY-001 | Motion и scroll могут создавать наложение listeners/animations | audit listeners/transitions и reduced-motion |
| FILTER-LEGACY-001 | старые filter layers уже всплывали после скрытия | точный поиск источника и проверка DOM после кликов |

## Что отдавать новому чату

1. Архив `kliper-city-docs-package.zip`.
2. Роль из `docs/WORKSTREAM_PROMPTS.md`.
3. Один ID задачи из этой очереди.
4. Запрет на соседние зоны.
5. Требование вернуть отчет: измененные файлы, проверки, остаточные риски.
