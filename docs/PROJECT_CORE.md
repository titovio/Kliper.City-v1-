# Kliper.City Project Core

Короткое ядро проекта для быстрого поиска связей в коде и документации.

Дата сборки: 2026-07-12. Основано на `docs/PROJECT_INDEX.md`, `index.html`,
локальном анализе файлов и индексе `codebase-memory-mcp` проекта `KliperCity`.

## 1. Главная модель проекта

Kliper.City v1 - статическая SPA:

- вход: `index.html`;
- основной legacy/generated-бандл: `js/app.js` (обычно не редактировать);
- расширения поверх бандла: `js/data`, `js/shared`, `js/api`, `js/behavior`,
  `js/filters`, `js/catalog`, `js/pages`;
- стили: базовые и зональные CSS в `css`;
- проектные решения и контракты: `docs`;
- отдельные motion/demo-проекты: `kliper-motion`, `kliper-scrollytelling-demo`.

Главный технический принцип: связи между модулями идут не через ES imports, а через
порядок подключения в `index.html`, глобальные `window.KLIPER_*`, `location.hash`,
DOM-селекторы, custom events и localStorage.

## 2. Быстрый маршрут поиска связи

1. Найти точку входа в `index.html`: stylesheet/script и порядок подключения.
2. Найти глобальный контракт: `rg "KLIPER_ИМЯ" js css docs`.
3. Если это UI-раздел, смотреть hash route и root id.
4. Если это данные, смотреть `js/data/*` и кто читает соответствующий
   `window.KLIPER_*`.
5. Если это полировка/поведение, смотреть DOM-селекторы, document listeners,
   MutationObserver и events.
6. Если связь неочевидна, использовать `codebase-memory-mcp` команды из раздела 9.

## 3. Загрузочный порядок

Критический порядок в `index.html`:

1. CSS:
   `style.css`, `stories-polish.css`, `story-categories.css`,
   `card-proportions.css`, `business-spaces.css`, `my-yard.css`,
   `company-cabinet.css`, `business-pricing.css`, `ui-ux-pro-max.css`.
2. Синхронные data/shared до app:
   `site-config`, `navigation`, `contacts`, `content-labels`, covers,
   `developers`, `buildings`, `building-readiness`, `company-cabinet`,
   `company-pricing`, `dom-utils`, `tyumen-districts`, `business-spaces`,
   `external-avatar-guard`.
3. Deferred runtime:
   `js/app.js`, `motion.global.js`, `motion-runtime`, cleanup/test/guards,
   stories, restore, API/auth, pricing/cabinet pages, mobile/filter patches,
   catalog patches, object-page patches, business pages.
4. Late dynamic script:
   `js/pages/top/top-metric-polish.js` is appended on window load.

## 4. Global contracts

Main data globals:

| Global | Defines | Main consumers |
|---|---|---|
| `KLIPER_SITE_CONFIG` | `js/data/site-config.js` | app/header/content |
| `KLIPER_NAVIGATION` | `js/data/navigation.js` | app/navigation |
| `KLIPER_CONTACTS` | `js/data/contacts.js` | content/contact UI |
| `KLIPER_CONTENT_LABELS` | `js/data/content-labels.js` | text labels |
| `KLIPER_DEVELOPERS` | `js/data/developers.js` | developer cards, company cabinet, object pages |
| `KLIPER_BUILDINGS` | `js/data/buildings.js` | building cards, object pages, cabinet objects |
| `KLIPER_BUILDING_READINESS` | `js/data/building-readiness.js` | ready/active residential split |
| `KLIPER_STORIES` | `js/data/stories.js` | story categories/viewer |
| `KLIPER_BUSINESS_SPACES` | `js/data/business-spaces.js` | business catalog |
| `KLIPER_COMPANY_CABINET` | `js/data/company-cabinet.js` | company cabinet page/mock |
| `KLIPER_COMPANY_PRICING` | `js/data/company-pricing.js` | pricing page/cabinet plan panel |
| `KLIPER_TYUMEN_DISTRICTS` | `js/data/tyumen-districts.js` | district cards/filters |
| `KLIPER_JK_COVERS`, `KLIPER_GET_JK_COVER` | `js/data/jk-covers.js` | building cards/object imagery |
| `KLIPER_DEVELOPER_COVERS` | `js/data/developer-covers.js` | developer cards |

Runtime/service globals:

| Global | Defines | Role |
|---|---|---|
| `KLIPER_DOM` | `js/shared/dom-utils.js` | shared helpers: escape/text/onReady/toArray |
| `KLIPER_RENDER` | `js/catalog/building-cards.js`, `js/catalog/developer-cards.js` | catalog render registry |
| `KLIPER_ROUTER` | `js/behavior/hash-router.js` | `view=` hash router for catalog tabs |
| `KLIPER_MOTION*` | `js/behavior/motion-runtime.js` | Motion wrapper and readiness |
| `KLIPER_API_CONFIG`, `KLIPER_FEATURES` | `js/api/kliper-api-dev-toggle.js`, `js/api/kliper-api-config.js` | API adapter flags |
| `KLIPER_API_MOCK` | `js/api/kliper-api-mock-fallback.js` | local mock backend |
| `KLIPER_API` | `js/api/kliper-api-client.js` | API client with mock fallback |
| `KLIPER_AUTH`, `KLIPER_AUTH_STATE` | `js/behavior/auth-state.js` | current auth/user state |
| `KLIPER_BUSINESS_PRICING_ADAPTER` | `js/pages/pricing/business-pricing-api-adapter.js` | pricing API/mock bridge |
| `KLIPER_COMPANY_CABINET_ADAPTER` | `js/pages/company-cabinet/company-cabinet-api-adapter.js` | cabinet API/mock bridge |
| `KLIPER_TEST_SELECTORS` | `js/behavior/test-selectors.js` | stable smoke/regression hooks |

## 5. Main page/route map

| Surface | Route/signature | Primary files | Data/API |
|---|---|---|---|
| Main catalog tabs | `#view=developers`, `#view=novostroyki`, `#view=gotovye`, `#view=business` | `js/behavior/hash-router.js`, `js/catalog/building-cards.js`, `js/catalog/developer-cards.js` | `KLIPER_RENDER`, `KLIPER_DEVELOPERS`, `KLIPER_BUILDINGS` |
| Company cabinet | `#company-cabinet=<slug>` | `js/pages/company-cabinet/company-cabinet-page.js`, `css/company-cabinet.css` | `KLIPER_DEVELOPERS`, `KLIPER_BUILDINGS`, `KLIPER_COMPANY_CABINET`, cabinet adapter |
| Business pricing | `#business-pricing` or `#business-pricing=<slug>` | `js/pages/pricing/business-pricing-page.js`, `css/business-pricing.css` | `KLIPER_COMPANY_PRICING`, pricing adapter |
| Object/developer detail patches | `#card=...` and rendered legacy DOM | `js/pages/object/*` | rendered DOM, developers/buildings data |
| Stories | story rail/viewer DOM | `js/behavior/story-categories.js`, `js/behavior/story-rings-polish.js`, `css/story-categories.css`, `css/stories-polish.css` | `KLIPER_STORIES`, `KLIPER_MOTION` |
| My yard/profile polish | rendered profile DOM | `js/pages/my-yard/my-yard-page.js`, `js/behavior/user-page-finalizer.js`, `css/my-yard.css` | localStorage, rendered app DOM |
| Filters/mobile polish | catalog/filter DOM | `js/filters/*`, `js/pages/business-filter-polish.js` | rendered buttons/labels/counts |

## 6. Backend/API seam

The real backend is not implemented in the static site. Current frontend seam:

1. `js/api/kliper-api-dev-toggle.js` can enable/override API settings.
2. `js/api/kliper-api-config.js` sets default flags.
3. `js/api/kliper-api-mock-fallback.js` exposes `KLIPER_API_MOCK`.
4. `js/api/kliper-api-client.js` exposes `KLIPER_API`:
   `getMe`, `getBillingPlans`, `getCompanySubscription`,
   `getCompanyCabinet`, `getMigrationPreview`.
5. Pricing and cabinet pages call their adapters first, adapters call API or mock.

Docs to check before backend work:

- `docs/AUTH_004_BACKEND_AUTH_CONTRACTS_V1.md`
- `docs/AUTH_006_STORAGE_SCHEMA_PLAN.md`
- `docs/AUTH_009A_API_MOCK_SERVER_CONTRACT.md`
- `docs/AUTH_010_FRONTEND_API_ADAPTER_SKELETON.md`
- `docs/AUTH_011_ADAPTER_ACCEPTANCE_AND_DEV_TOGGLE.md`
- `docs/AUTH_012_BACKEND_STACK_DECISION.md`
- `docs/AUTH_013_BACKEND_SCAFFOLD_PLAN.md`

## 7. Ownership by folder

| Folder/file | Meaning | Editing rule |
|---|---|---|
| `index.html` | dependency order and script/style registry | change only for wiring |
| `js/app.js` | legacy/generated SPA bundle | do not edit for normal targeted work |
| `js/data/*` | static source data and content contracts | edit for data/content changes |
| `js/shared/*` | small shared helpers | keep stable and tiny |
| `js/api/*` | future backend adapter shell | follow AUTH docs |
| `js/behavior/*` | global DOM behavior and app-level patches | check overlap/listeners carefully |
| `js/filters/*` | filter guards and mobile filter UX | test catalog views |
| `js/catalog/*` | card renderers and catalog-specific patches | test developers/newbuild/ready/business |
| `js/pages/object/*` | object/developer detail-page patches | test `#card=` flows |
| `js/pages/company-cabinet/*` | company cabinet route | test with developer slugs |
| `js/pages/pricing/*` | business pricing route | test standalone and from cabinet |
| `css/ui-ux-pro-max.css` | broad visual polish | high blast radius |
| zone CSS files | localized styling | prefer zone CSS over global CSS |
| `docs/*` | project contracts, decisions, QA | update when changing project rules |

## 8. Known architecture facts from codebase-memory-mcp

Index command used:

```powershell
codebase-memory-mcp cli index_repository --repo-path . --mode fast --name KliperCity
```

Index result:

- project: `KliperCity`;
- nodes: 3151;
- edges: 12020;
- languages: JavaScript 71 files, CSS 13 files, TypeScript 5 files, HTML 2 files;
- node labels: Function 1827, Section 408, Variable 407, Method 221, File/Module 115 each;
- main edge types: `USAGE`, `CALLS`, `DEFINES`, `WRITES`;
- indexed code excludes: `.git`, `assets`, `docs`, `js/vendor`, heavy motion outputs,
  archive assets and other non-code/heavy folders.

Important caveat: the graph includes `js/app.js`, so minified/generated hotspots like
`r`, `set`, `get`, `s`, `n` are usually not good editing targets. Prefer the smaller
overlay modules unless the task explicitly requires the legacy bundle.

## 9. Fast graph/search commands

Refresh index:

```powershell
codebase-memory-mcp cli index_repository --repo-path . --mode fast --name KliperCity
```

Architecture summary:

```powershell
codebase-memory-mcp cli get_architecture --project KliperCity
```

Find symbols by graph:

```powershell
codebase-memory-mcp cli search_graph --project KliperCity --query "company cabinet" --limit 50
codebase-memory-mcp cli search_graph --project KliperCity --name-pattern "renderPricing" --include-connected true
codebase-memory-mcp cli search_graph --project KliperCity --file-pattern "js/pages/object/*" --limit 100
```

Find exact code usage:

```powershell
codebase-memory-mcp cli search_code --project KliperCity --pattern "KLIPER_COMPANY_CABINET" --mode compact --context 2 --limit 20
codebase-memory-mcp cli search_code --project KliperCity --pattern "data-company-pricing-open" --mode compact --context 2
codebase-memory-mcp cli search_code --project KliperCity --pattern "#business-pricing" --mode files
```

Cypher-like examples:

```powershell
codebase-memory-mcp cli query_graph --project KliperCity --query "MATCH (f:Function)-[:CALLS]->(g) WHERE f.name = 'renderPricing' RETURN f.name, g.name, g.file_path" --max-rows 50
codebase-memory-mcp cli query_graph --project KliperCity --query "MATCH (m:Module)-[:DEFINES]->(n) WHERE m.file_path =~ 'js/pages/.*' RETURN m.file_path, n.name" --max-rows 100
```

List projects:

```powershell
codebase-memory-mcp cli list_projects
```

## 10. Regular `rg` shortcuts

Find all definitions of globals:

```powershell
rg "window\.KLIPER_[A-Z0-9_]+\s*=" js -g "!app.js" -g "!vendor/**"
```

Find every consumer of a global:

```powershell
rg "KLIPER_COMPANY_PRICING|KLIPER_BUSINESS_PRICING_ADAPTER" js docs -g "!app.js"
```

Find route handlers:

```powershell
rg "location\.hash|hashchange|#company-cabinet|#business-pricing|view=" js index.html
```

Find DOM event contracts:

```powershell
rg "data-company|data-business|data-object|data-kliper|CustomEvent|dispatchEvent|addEventListener" js css
```

Find localStorage contracts:

```powershell
rg "localStorage|getItem|setItem|kliper-" js docs
```

## 11. Change safety checklist

Before changing code:

1. Identify zone and owner doc in `docs/CHAT_OWNERSHIP.md`.
2. Search exact text/class/global first.
3. Check whether the source is data, adapter, DOM patch, CSS, or legacy app.
4. Avoid `js/app.js` unless no other path exists.
5. Keep the change local to the affected zone.

After meaningful changes:

1. Refresh the graph if the change added/renamed modules.
2. Run targeted smoke/regression from `docs/REGRESSION_CHECKLIST.md`.
3. Check desktop/mobile/dark theme where the zone is visual.
4. Update `docs/CHANGE_LOG.md` only for meaningful project changes.
5. If a rule/decision changed, update `docs/PROJECT_DECISIONS.md` or relevant AUTH/CAB/BILL doc.

