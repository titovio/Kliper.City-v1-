# Kliper.City v1: page completion matrix

Date: 2026-07-08.

Status meanings:

| Status | Meaning |
|---|---|
| `ready` | Function is acceptable for v1 after normal regression. |
| `partial` | Exists, but has functional/data/QA gaps before final v1. |
| `prototype` | Intended as visual/product prototype; real behavior waits for backend/auth. |
| `future` | Not part of current v1 implementation. |
| `risk` | Needs focused QA before more work. |

## Summary

| Area | v1 status | Main gap | Owner chat |
|---|---|---|---|
| Main shell | partial | Browser/interactive smoke must be repeated because DOM inspection hung during this audit | Regression QA |
| Developers catalog | partial | Need final action-state consistency and route/back acceptance | Catalog Core |
| New residential projects | partial | Filters and view modes need final acceptance after prior filter fixes | Filters System |
| Completed ЖК | partial | No normalized completed/ready status in data | Catalog Core + Data |
| Business catalog | partial | Must confirm selected tags/reset/view modes after recent fixes | Business + Filters System |
| Object page | partial | Route/back/tabs/modals need focused acceptance | Object Pages |
| Developer page | partial | Cabinet CTA and public/private content boundary need final acceptance | Object Pages + Company Cabinet |
| User profile | prototype | Friends/chats/privacy are visual until backend/auth | Profile Social |
| Stories | risk | State machine/ring layers/scroll rules need focused QA | Stories & Motion |
| Company cabinet | prototype | Real actions wait for backend/auth; fallback data must be accepted | Company Cabinet |
| Pricing | prototype | CTA is non-payment prototype; route return must be accepted | Company Cabinet + Billing |
| Auth/API adapter | prototype | Disabled by default; real backend not started | Backend/Auth |
| Admin | future | Must wait until function/data model is closed | Backend/Auth + Product |

## A. Main Shell

Required v1 functions:

- page loads;
- navigation switches categories;
- profile opens;
- theme toggles;
- stories open;
- catalog controls are visible;
- no horizontal overflow on mobile.

Current evidence:

- `index.html` contains the static SPA root and all current v1 overlays/modules.
- Local HTTP returns `200`.
- In-app browser DOM inspection timed out twice during this audit, so full interactive smoke is not confirmed in this pass.

Status: `partial` / `risk`.

Functional gap:

- Repeat a lightweight smoke with a stable QA browser session before final decisions.

Task:

- `FUNC-QA-001`: reload site, click main nav entries, theme, profile, stories, report hangs/console errors.

## B. Developers Catalog

Required v1 functions:

- show 32 developer cards;
- show card count and status-dot legend;
- open company/developer page;
- local like/subscribe/review actions;
- route/back should not mix with profile/object states.

Current evidence:

- `js/data/developers.js` contains 32 developers.
- `developer-cards.js`, `developer-card-badges.js`, `catalog-card-actions-a11y.js` provide extra card/action behavior.

Status: `partial`.

Functional gaps:

- action counters and local profile sync need final acceptance;
- card click vs quick preview vs full page should be documented as one rule;
- legacy external image/avatar URLs remain in source data but are guarded at runtime.

Task:

- `FUNC-CAT-001`: verify developer card actions and route/back behavior without changing filters/stories.

## C. New Residential Projects

Required v1 functions:

- show residential cards;
- filters: district/year/family/value/comfort/investment;
- selected tags after card count;
- reset;
- grid/list/map;
- card opens object page;
- local actions persist.

Current evidence:

- `js/data/buildings.js` contains 141 building items.
- `selected-filter-inline.js`, `residential-list-guard.js`, `residential-view-controls-guard.js` exist.

Status: `partial`.

Functional gaps:

- filters need final smoke after the old-layer conflicts;
- grid/list/map should be accepted as user-facing v1 modes, not just visual controls;
- empty-state text and selected-tag colors need dark/mobile acceptance.

Task:

- `FUNC-FIL-001`: verify residential filters, selected tags, reset and view modes on `Новостройки`.

## D. Completed ЖК

Required v1 functions:

- separate `Готовые` entry;
- same card actions as new residential projects;
- data represents completed/ready buildings;
- stronger future emphasis on resident reviews.

Current evidence:

- Building status distribution: `строится` = 19, `уточнить` = 122.
- No normalized `сдан` / `готов` / `отстроено` field exists in current building data.
- Added frontend normalization contract: `projectReadinessStatus`, `isCompletedResidentialProject`, `isActiveResidentialProject`.

Status: `partial`, with v1 normalization layer.

Functional gap:

- The page cannot be considered production-semantically complete until backend/admin imports real ready/completed values.
- `Готовые ЖК` requires fully completed projects, not just a developer-level count of delivered ЖК.
- `Новостройки` needs per-project progress fields: total houses, delivered houses, remaining houses and overall project delivery year.

Task:

- `FUNC-DATA-001`: accept normalized readiness contract and later replace fallback source with backend/admin data.

## E. Business Catalog

Required v1 functions:

- show business spaces;
- filters: deal, district, type, area, budget;
- selected tags after count;
- reset;
- grid/list/map;
- business cards with own structure;
- dark/mobile states.

Current evidence:

- `js/data/business-spaces.js` contains 6 spaces.
- `business-spaces.js` and `business-filter-polish.js` provide separate business logic.

Status: `partial`.

Functional gaps:

- selected-tag/reset behavior must be confirmed after mobile/dark fixes;
- repeated business nav click must hide/show correctly and not route to developers;
- map/list are still likely visual/partial.

Task:

- `FUNC-BUS-001`: verify business filters, reset, view modes and repeated nav behavior.

## F. Object Page / ЖК

Required v1 functions:

- opens from card or direct `#card`;
- back returns to source catalog;
- sections/tabs work;
- gallery/plans/map blocks work as v1 presentation;
- reviews modal/list where present.

Current evidence:

- Object page is mostly legacy `js/app.js` plus modules in `js/pages/object/*`.
- Multiple polishing modules exist for hero, plans, map, gallery and tabs.

Status: `partial`.

Functional gaps:

- route/back/tabs need focused QA because this route shares `#card` with developers and profile history restoration;
- if defects require `js/app.js`, they must return to Architect/Main before code changes.

Task:

- `FUNC-OBJ-001`: verify object page route/back/tabs/modals for at least one ЖК.

## G. Developer / Company Page

Required v1 functions:

- opens from developer card;
- shows company hero and objects;
- supports local social signals;
- separates organic content from official/company content;
- opens company cabinet prototype.

Current evidence:

- Developer page uses shared object-page route/modules.
- Company cabinet route exists separately as `#company-cabinet=developerSlug`.

Status: `partial`.

Functional gaps:

- official vs organic labeling is not fully enforced as a function;
- route boundary between public company page and private cabinet needs final acceptance.

Task:

- `FUNC-DEV-001`: verify public developer page, company objects and cabinet CTA boundary.

## H. User Profile

Required v1 functions:

- opens user page;
- shows local likes/subscriptions/reviews;
- shows social future-state blocks;
- does not promise working friends/chats before backend;
- no role-profile UI in current v1.

Current evidence:

- `user-page-finalizer.js` reads `kliper-liked-cards`, `kliper-subscribed-cards`, `kliper-card-reviews`.
- It marks some actions as v1 showcase.

Status: `prototype`.

Functional gaps:

- empty localStorage state needs acceptance;
- share/chat/friend actions should be visually honest and not imply backend exists.

Task:

- `FUNC-PRO-001`: verify profile local-state sync and visual-only CTA wording/states.

## I. Stories

Required v1 functions:

- large by default;
- compact when scrolling down;
- upward top behavior remains deterministic;
- viewer opens/closes;
- wheel navigation works only when viewer is active/appropriate;
- no old colored ring layers.

Current evidence:

- `story-categories.js` owns state machine and wheel/touch listeners.
- `story-rings-polish.js` also touches rings, so layer conflict remains a known risk.

Status: `risk`.

Functional gaps:

- visual ring layers and scroll/open state must be verified before any new motion;
- in-app browser audit timed out during DOM read, so stories should be tested in a clean QA session.

Task:

- `FUNC-STO-001`: verify stories state machine and ring layers, no new animation changes.

## J. Company Cabinet

Required v1 functions:

- route `#company-cabinet=developerSlug`;
- isolated page layer;
- stats, objects, documents, posts, stories, dialogs/offers, tariff;
- fallback data;
- real actions disabled/prototype until backend/auth.

Current evidence:

- `company-cabinet-page.js`, `company-cabinet-api-adapter.js`, `company-cabinet.css` exist.
- `company-cabinet.js` has defaults and custom data for 3 companies.

Status: `prototype`.

Functional gaps:

- fallback for all 32 developers must be accepted;
- mobile route must not visually mix with catalog;
- CTA wording must stay prototype-safe.

Task:

- `FUNC-CAB-001`: verify cabinet route for explicit and fallback companies on desktop/mobile/dark.

## K. Business Pricing

Required v1 functions:

- route `#business-pricing`;
- route `#business-pricing=developerSlug`;
- five B2B tariff cards;
- return to cabinet with context;
- no real payment action.

Current evidence:

- `company-pricing.js` contains 5 plans.
- `business-pricing-page.js` renders route and handles back/close/select.

Status: `prototype`.

Functional gaps:

- select buttons should not imply completed payment;
- mobile/dark/readability needs final acceptance.

Task:

- `FUNC-PRICE-001`: verify pricing route, return to cabinet and CTA prototype boundaries.

## L. Auth/API/Backend/Admin

Required v1 direction:

- backend/auth after functional closure;
- admin after page functions and data model;
- API adapter remains disabled unless explicitly enabled.

Current evidence:

- API adapter files exist under `js/api/*`.
- Mock server exists under `tools/kliper-api-mock-server.mjs`.
- Backend contracts and stack decision docs exist.

Status: `prototype` / `future`.

Functional gaps:

- real backend scaffold is still a separate task;
- admin requirements must be derived from this functional matrix.

Task:

- `FUNC-AUTH-001`: after page gaps are accepted, convert matrix into admin/backend requirements.

## Immediate Functional Priorities

1. Stabilize smoke environment and repeat interactive QA.
2. Normalize `Готовые ЖК` data semantics.
3. Accept residential/business filter behavior.
4. Accept route/back behavior for object/developer pages.
5. Accept stories state machine and ring layers.
6. Accept profile/cabinet/pricing prototype boundaries.

## What Not To Do Yet

- Do not start admin panel before `FUNC-DATA-001` and route/page acceptance.
- Do not add real lead forms.
- Do not add role-profile UI.
- Do not add payment flow.
- Do not edit `js/app.js` for these audit conclusions without a separate Architect/Main decision.
