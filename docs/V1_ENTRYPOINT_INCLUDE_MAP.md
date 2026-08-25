# Kliper.City V1 entrypoint include map

Дата: 2026-07-13.

Назначение: зафиксировать временную карту подключений для `index-v1.html`, чтобы отделить чистый V1 entrypoint без второй живой копии исходников. `index-v1.html` должен ссылаться на те же CSS/JS/data-файлы, что и основной сайт, и не должен создавать отдельную папку с копиями.

## Принцип

- `index.html` остается текущим live entrypoint.
- `index-v1.html` является временным V1-only entrypoint для статической проверки и следующего QA.
- `js/app.js` остается legacy/generated и не редактируется.
- JS/CSS/data-папки не копируются.
- Исключения из `index-v1.html` касаются только явных standalone-подключений hidden/future/non-V1 зон.

## Required V1

| Include | Причина |
|---|---|
| `./js/behavior/security-bootstrap.js` | Ранний bootstrap темы и page restoring guard. |
| `./css/style.css` | Базовая оболочка SPA. |
| `./css/card-proportions.css` | Пропорции карточек каталога. |
| `./css/ui-ux-pro-max.css` | Принятая общая UI-полировка v1. |
| `./js/data/site-config.js` | Базовые настройки сайта. |
| `./js/data/navigation.js` | Навигационные данные. |
| `./js/data/contacts.js` | Контактные данные. |
| `./js/data/content-labels.js` | Тексты и подписи. |
| `./js/data/developer-covers.js` | Локальные обложки застройщиков. |
| `./js/data/jk-covers.js` | Локальные обложки ЖК. |
| `./js/data/developers.js` | Данные застройщиков. |
| `./js/data/buildings.js` | Данные ЖК/новостроек. |
| `./js/data/building-readiness.js` | Нормализация готовности ЖК для v1. |
| `./js/shared/dom-utils.js` | Общие DOM helpers. |
| `./js/data/tyumen-districts.js` | Районные данные, используются текущей SPA/фильтрами. |
| `./js/data/business-spaces.js` | Принятый раздел `Для бизнеса`. |
| `./js/behavior/external-avatar-guard.js` | Guard внешних аватаров/логотипов. |
| `./js/app.js` | Основной legacy/generated SPA bundle. |
| `./js/vendor/motion.global.js` | Motion runtime dependency. |
| `./js/behavior/motion-runtime.js` | Единый Motion слой. |
| `./js/behavior/test-selectors.js` | Стабильные селекторы для regression/smoke. |
| `./js/behavior/dark-theme-toggle.js` | Переключение темы. |
| `./js/behavior/empty-state-copy.js` | Принятые empty-state подписи. |
| `./js/behavior/mobile-search-toggle.js` | Mobile search toggle текущей ленты. |
| `./js/filters/feed-mobile-filters.js` | Mobile filters текущей ленты. |
| `./js/catalog/catalog-card-actions-a11y.js` | A11y для действий карточек каталога. |
| `./js/catalog/developer-card-badges.js` | Принятые бейджи карточек застройщиков. |
| `./js/catalog/developer-cover-overrides.js` | Локальные override-обложки застройщиков. |

## Accepted V1 Overlay

| Include | Причина |
|---|---|
| `./css/stories-polish.css` | Принятая полировка stories. |
| `./css/story-categories.css` | Принятые категории stories. |
| `./css/business-spaces.css` | Принятая полировка business-раздела. |
| `./js/behavior/phase1-cleanup.js` | Текущий слой скрытия/перестройки legacy-навигации. Может быть причиной staged render, но нужен текущей v1-оболочке. |
| `./js/filters/residential-list-guard.js` | Принятый guard счетчиков residential. |
| `./js/filters/residential-view-controls-guard.js` | Принятый guard view controls residential. |
| `./js/filters/residential-filter-copy.js` | Принятый copy-слой residential filters. |
| `./js/behavior/story-categories.js` | Принятая логика categories для stories. |
| `./js/behavior/story-rings-polish.js` | Принятая полировка story rings. |
| `./js/behavior/page-restore.js` | Текущий restore layer. Может менять вид после initial paint, но принят в live v1. |
| `./js/behavior/user-page-finalizer.js` | Принятая полировка профиля. |
| `./js/filters/selected-filter-inline.js` | Принятый selected filter inline слой. |
| `./js/pages/object/object-plans-block.js` | Принятый object page block. |
| `./js/pages/object/object-aerial-view-block.js` | Принятый object page block. |
| `./js/pages/object/object-map-location-block.js` | Принятый object page block. |
| `./js/pages/object/object-gallery-block.js` | Принятый object page block. |
| `./js/pages/object/object-hero-compact.js` | Принятая компактная object/developer hero-полировка. |
| `./js/pages/object/developer-passport-hide.js` | Принятый developer page guard. |
| `./js/pages/object/developer-section-tabs.js` | Принятые вкладки developer page. |
| `./js/pages/object/sidebar-list-modals.js` | Принятые sidebar modals. |
| `./js/pages/object/developer-reviews-polish.js` | Принятая reviews-полировка. |
| `./js/pages/object/developer-object-tabs-polish.js` | Принятая object tabs-полировка. |
| `./js/pages/object/ecosystem-card-polish.js` | Принятая ecosystem/stories-полировка. |
| `./js/pages/object/object-section-tabs.js` | Принятые вкладки object page. |
| `./js/pages/business-filter-polish.js` | Принятая business filter-полировка. |
| `./js/catalog/business-spaces.js` | Принятый business catalog renderer. |

## Excluded From V1 Candidate

Эти подключения исключены из `index-v1.html`, потому что являются явными standalone-зонами hidden/future/non-V1 или skeleton future API, и их удаление из временного entrypoint не требует копирования исходников.

| Include | Причина |
|---|---|
| `./css/my-yard.css` | `Мой двор` скрыт/не входит в текущий чистый V1 scope. |
| `./js/pages/my-yard/my-yard-page.js` | Standalone page для скрытой/future зоны. |
| `./css/company-cabinet.css` | Кабинет компании является отдельным v1-прототипом/future commercial zone, не базовый V1 entrypoint. |
| `./js/data/company-cabinet.js` | Данные кабинета компании нужны только excluded cabinet route. |
| `./js/pages/company-cabinet/company-cabinet-page.js` | Standalone cabinet route. |
| `./js/pages/company-cabinet/company-cabinet-api-adapter.js` | Adapter для excluded cabinet route. |
| `./css/business-pricing.css` | Тарифы размещения являются отдельной commercial/future zone. |
| `./js/data/company-pricing.js` | Данные тарифов нужны только excluded pricing route. |
| `./js/pages/pricing/business-pricing-page.js` | Standalone pricing route. |
| `./js/pages/pricing/business-pricing-api-adapter.js` | Adapter для excluded pricing route. |
| `./js/api/kliper-api-dev-toggle.js` | Future backend/auth API skeleton, выключенный по умолчанию. |
| `./js/api/kliper-api-config.js` | Future backend/auth API skeleton. |
| `./js/api/kliper-api-mock-fallback.js` | Future backend/auth API skeleton. |
| `./js/api/kliper-api-client.js` | Future backend/auth API skeleton. |
| `./js/behavior/auth-state.js` | Future auth state layer. |
| `./js/filters/top-mobile-filters.js` | Top page mobile filters are not part of the clean V1 entrypoint. |
| `./js/pages/top/top-metric-polish.js` | Top metric polish is not part of the clean V1 entrypoint. |

## Uncertain Keep

| Include | Причина |
|---|---|
| `./js/behavior/phase1-cleanup.js` | Вероятный участник old-version flash из-за delayed cleanup, но отключение меняет навигацию и требует visual regression. |
| `./js/behavior/page-restore.js` | Может менять страницу после initial paint через hash/localStorage restore, но является текущей принятой логикой восстановления. |
| `./js/data/tyumen-districts.js` | Районы частично скрыты, но данные могут использоваться текущими фильтрами и карточками. |
| `./js/filters/feed-mobile-filters.js` | Может задевать скрытые feed/top состояния, но сейчас является частью принятого mobile слоя. |

## Next QA Gate

Следующий шаг после этого документа и `index-v1.html`: отдельный static + visible-browser regression pass по `index-v1.html` только после команды Main. До этого `index.html` остается live entrypoint.
