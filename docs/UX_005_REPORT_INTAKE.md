# UX-005 report intake and fix routing

Date: 2026-07-07.

Purpose: accept the UX-005 audit reports from working chats, remove duplicates, and turn confirmed findings into small routed tasks.

Scope: documentation and coordination only. No site UI, CSS, JS, data, backend code, or `js/app.js` changes are included in this intake.

## Intake status

| Workstream | Report status | Intake result |
|---|---|---|
| Regression QA | received | Environment instability around `8765` / browser automation blocks full acceptance. Repeat smoke after fixes. |
| Visual System | received | No confirmed product P0/P1. Keep as design-review context after deduplication. |
| Mobile QA | received | Accepted several mobile P1/P2 findings. |
| Filters System | received | Filters mostly pass; one business mobile selected-tag layout P1 accepted. |
| Stories & Motion | received | Accepted stories state-machine and ring-layer risks as P1 candidates requiring clean reproduction. |
| Catalog Core | received | Accepted catalog a11y/action-control issues. |
| Object Pages | received | Accepted route/back and tab visibility risks; needs clean rerun before code. |
| Business | received | No confirmed business product P1 due live-audit blocker; use as code-level context. |
| Profile Social | received | Accepted profile fallback counters and dead CTA risks. |
| Company Cabinet | received | Accepted technical/staging copy issue. |
| Backend/Auth | completed | `AUTH-013` scaffold plan completed separately. |

## Confirmed or accepted P1 queue

### UXFIX-CAB-001: isolate cabinet and pricing mobile routes

Owner: Company Cabinet.

Source reports: UXMOB-001, UXCAB-001.

Problem: on mobile, `#company-cabinet=...` and `#business-pricing=...` can appear visually mixed with the underlying catalog. The user may see or interact with lower catalog content while viewing cabinet/pricing.

Allowed files:

- `css/company-cabinet.css`
- `css/business-pricing.css`
- `js/pages/company-cabinet/company-cabinet-page.js`
- `js/pages/pricing/business-pricing-page.js`

Forbidden files:

- `js/app.js` unless Architect/Main explicitly approves.

Acceptance:

- `390px` and `430px`: cabinet and pricing routes show their page layer cleanly without catalog controls/cards in the active viewport.
- light and dark theme.
- no horizontal overflow.
- cabinet -> pricing CTA still works.
- pricing back/close still works.

### UXFIX-CAT-001: normalize catalog card/action controls

Owner: Catalog Core.

Source reports: UXCAT-001, UXMOB-001.

Problems:

- catalog view controls use visual active state but lack `aria-pressed`;
- one circular card action has no `aria-label` in some states;
- mobile action/counter buttons can differ in height when viewport is squeezed;
- `20 карточки` wording needs cleanup if it can be fixed without touching legacy render.

Allowed files:

- `js/catalog/*`
- `js/behavior/test-selectors.js`
- `js/catalog/catalog-card-actions-a11y.js`
- `css/ui-ux-pro-max.css` only inside catalog/card-control sections
- `css/card-proportions.css` if present and already used

Forbidden files:

- `js/app.js` without Architect/Main approval.

Acceptance:

- desktop and mobile view controls expose correct pressed state.
- visible card action buttons have stable accessible names.
- first card action row has equal heights at `390px`, `430px`, and desktop.
- grid/list/map/sort remain available after switching views.

### UXFIX-FIL-001: fix business mobile selected-tag layout

Owner: Filters System with Business review.

Source reports: UXFIL-001, UXBUS-001.

Problem: business selected tag after choosing `Тип сделки: Аренда` can become too narrow on mobile and visually fight with result count and view controls.

Allowed files:

- `css/business-spaces.css`
- `css/ui-ux-pro-max.css` only if the shared toolbar layout is the real source
- `js/pages/business-filter-polish.js` only if CSS cannot solve it

Acceptance:

- `390px` and `430px`: selected tag appears after business count, does not wrap into a broken narrow column, reset is visible.
- grid/list/map changes do not remove selected tag.
- residential selected tags do not appear in business mode.

### UXFIX-STO-001: split stories state-machine and ring-layer cleanup

Owner: Stories & Motion.

Source reports: UXSTO-001, UXMOB-001.

Problems:

- upward-scroll rules work conceptually but are timing-sensitive;
- story rings still have risk of layered SVG/CSS fallback/inner overlay causing colored legacy ring or white ripple artifacts;
- reduced-motion and mobile touch need a clean verification pass.

Allowed files:

- `css/story-categories.css`
- `js/behavior/story-categories.js`
- `js/behavior/story-rings-polish.js`
- `js/behavior/motion-runtime.js` only if needed for runtime guards

Acceptance:

- first pass: produce clean browser reproduction notes before editing.
- if editing: state-machine changes and ring-layer cleanup must be separate commits/patches or clearly separate sections.
- no size changes unless explicitly requested.
- no new motion dependency.

### UXFIX-OBJ-001: rerun and fix object route/back/tabs only if reproduced

Owner: Object Pages.

Source reports: UXOBJ-001, UXMOB-001.

Problems:

- route/back still has legacy risk when moving catalog -> object -> back;
- object tab `Лента` was present in DOM but not visible/clickable in one audit run;
- mobile object hero/top content can sit under upper mobile layer.

Allowed files:

- `js/pages/object/*`
- `css/ui-ux-pro-max.css` only inside object-page sections
- `js/behavior/page-restore.js` only for route restore guard

Forbidden files:

- `js/app.js` without Architect/Main approval.

Acceptance:

- first rerun in stable browser.
- only confirmed defects are patched.
- back returns to the correct source catalog.
- object tabs are visible and clickable on desktop/mobile.
- modals close and release scroll.

### UXFIX-PRO-001: profile counters and visual-only CTA states

Owner: Profile Social.

Source reports: UXPRO-001.

Problems:

- profile counters use fallback numbers when localStorage is empty;
- some CTA buttons look live but have no action (`Поделиться карточкой`, `Открыть чат`, `Все чаты`, `Все друзья`);
- profile dark/mobile needs live verification.

Allowed files:

- `js/behavior/user-page-finalizer.js`
- `js/behavior/page-restore.js` if route state is directly involved
- `css/ui-ux-pro-max.css` inside profile sections
- documentation for v1/v2 boundary

Forbidden files:

- direct `js/app.js` edits unless Architect/Main approves.

Acceptance:

- empty localStorage does not produce misleading favorite/subscription/review counts.
- visual-only CTAs are either clearly disabled/prototype or get a harmless documented v1 response.
- dark/mobile checked after changes.

### UXFIX-CAB-002: remove technical staging copy from cabinet/pricing

Owner: Company Cabinet.

Source reports: UXCAB-001.

Problem: cabinet/pricing user-facing copy mentions internal terms such as `backend/auth`, `v1-прототип`, `не CRM`, and future technical implementation details.

Allowed files:

- `js/pages/company-cabinet/company-cabinet-page.js`
- `js/data/company-cabinet.js`
- `js/data/company-pricing.js`
- `js/pages/pricing/business-pricing-page.js`

Acceptance:

- user-facing text explains limitations in product language.
- no promise of real payment, CRM, auth, or backend behavior in v1.
- no new forms or real CRM actions.

## Infrastructure / validation queue

### UXFIX-QA-001: clean smoke environment before final acceptance

Owner: Regression QA.

Problem: several reports hit unstable `8765`, Edge, or Playwright automation. This is not accepted as a product bug, but it makes full visual acceptance incomplete.

Acceptance:

- verify server starts cleanly on `8765`;
- close or avoid stale headless browser sessions;
- rerun minimal smoke after routed fixes:
  - desktop `1440x900`;
  - mobile `390px` and `430px`;
  - light and dark;
  - console/page errors;
  - horizontal overflow.

## Not accepted as immediate fixes

- Full visual token refactor across all CSS files: postpone until after P1 fixes.
- Backend implementation: `AUTH-013` is a plan only; real backend scaffold starts as a separate explicit task.
- New motion library work: no new dependency for UX-005 fixes.
- Direct `js/app.js` edits: only after Architect/Main decision with a route-risk brief.

## Recommended execution order

1. `UXFIX-QA-001`: stabilize the smoke environment or define a clean manual/browser route.
2. `UXFIX-CAT-001`: catalog controls/actions because they affect core cards.
3. `UXFIX-FIL-001`: business selected-tag mobile layout.
4. `UXFIX-CAB-001` and `UXFIX-CAB-002`: cabinet/pricing route isolation and copy.
5. `UXFIX-PRO-001`: profile counters and visual-only CTA state.
6. `UXFIX-OBJ-001`: object rerun and confirmed fixes.
7. `UXFIX-STO-001`: stories state machine and ring layer as separated work.
8. Final Regression QA and Mobile QA pass.

## Acceptance batch 1

Date: 2026-07-07.

Status: routed fixes from the first UX-005 acceptance batch were completed or accepted by their owner chats. `js/app.js` was not edited.

| ID | Status | Result |
|---|---|---|
| `UXFIX-QA-001` | accepted | Clean smoke protocol documented by Regression QA. `8765` is healthy when checked through one clean server and isolated headless Edge; instability came from stale server/browser processes and long mixed runs. |
| `UXFIX-CAT-001` | accepted with residual legacy risk | Catalog controls/actions normalized: `aria-pressed`, fallback action labels, mobile action heights, and count wording guard. Residual risk: legacy map/sort state should stay under Regression watch. |
| `UXFIX-FIL-001` | accepted | Business selected tag now occupies a full mobile row after the count, reset remains visible, and selected state survives `grid/list/map`. |
| `UXFIX-BUS-REVIEW-001` | accepted | Business confirmed `390px`/`430px`, light/dark, selected tag, reset, view switching, no residential selected-tag leak, and no horizontal overflow. |
| `UXFIX-CAB-001` | accepted | Cabinet/pricing routes are isolated from the underlying catalog on mobile and dark theme; route back/close behavior remains available. |
| `UXFIX-CAB-002` | accepted | Technical staging copy was replaced with product-language limitations; no real backend/auth/payment/CRM promise was added. |
| `UXFIX-PRO-001` | accepted | Profile counters no longer show misleading fallback values on empty localStorage; visual-only CTA actions now have a harmless v1 response. |
| `UXFIX-OBJ-001` | accepted | Object tabs are visible/clickable on desktop/mobile, `Лента` opens, back returns to the source catalog, and modals release scroll. |
| `UXFIX-STO-001` | accepted | Stories state machine was rechecked; ring-layer cleanup removed the visible legacy/white ripple artifacts without size changes or new dependency. |

Remaining follow-up:

- Run one final Regression QA pass after this batch using the clean smoke protocol.
- Keep legacy `map/sort` behavior and stories scroll timing on the watch list.
- Do not start broad visual token refactor from this batch.

## Final QA status after batch 1

Date: 2026-07-07.

Status: `BLOCKED` for full final PASS by browser automation environment, not by a confirmed product P0/P1.

Regression QA result:

- server `127.0.0.1:8765` answers quickly with `200`;
- `kliperApi=1` was not used;
- `js/app.js` and UI code were not changed by QA;
- headless Edge / Playwright / in-app browser started hanging on local `8765` even when `curl` stayed healthy;
- leftover temporary headless Edge processes from automation had to be cleaned by profile marker;
- no confirmed product P0/P1 was produced from the partial run.

Mobile QA result:

- `390px` and `430px` initial/mobile checks passed where completed;
- global horizontal overflow was `0` on completed checks;
- cabinet/pricing isolation passed: catalog nav/cards did not leak into `#company-cabinet=...` or `#business-pricing=...`;
- no confirmed product P0/P1 was produced from completed mobile checks;
- full object/business rerun was blocked by automation actionability/context instability.

Accepted residual items:

- `P0 QA Infrastructure`: stabilize browser smoke environment before declaring final PASS.
- `P2 Visual`: several mobile tap targets remain below `44px` (`theme`, some nav pills, view toolbar, cabinet actions). Route to Visual System after the infrastructure rerun unless the owner asks to polish immediately.
- `P2 Watch`: recheck object page route/back/tabs and business selected tag/reset manually or in clean browser after smoke environment is stable.

Next execution order:

1. `SMOKE-ENV-001`: fix/standardize browser smoke environment.
2. `UXFIX-FINAL-QA-RETRY-001`: rerun only the blocked object/business/stories checks.
3. `UXFIX-FINAL-MOB-RETRY-001`: rerun only mobile object/business/tap target checks.
4. If retry is clean, close UX-005 batch 1 as accepted with P2 polish backlog.

## SMOKE-ENV-001 execution notes

Date: 2026-07-07.

Status: performed in Architect/Main.

Working browser protocol:

- keep one local server on `127.0.0.1:8765`;
- avoid long mixed Playwright runs;
- run one short scenario per Node process;
- print results before browser shutdown if the scenario touches object routes;
- clean only headless automation processes with `playwright_chromiumdev_profile` in the command line;
- do not close user Edge/WebView windows.

Confirmed retry results:

- stories on mobile: 9 story buttons, viewer opens/closes, overflow `0`;
- business filters: `Аренда` selected tag and `Сбросить` remain visible on `390px` and `430px` after `grid/list/map`, overflow `0`, no residential selected-tag leak;
- mobile `Новостройки`: stale `32 карточки` counter fixed; active `Новые` now reports `142 карточки` with 142 cards and overflow `0`;
- direct object route `#card=ЖК Речной Порт`: page opens with tabs/back visible and overflow `0`.

Fixes applied:

- `js/pages/business-filter-polish.js`: restore business selected-inline after view rerenders and DOM mutations.
- `js/filters/residential-list-guard.js`: detect mobile active `Новостройки` / `Готовые ЖК` pills before syncing residential counters.
- `js/behavior/test-selectors.js`: improve count selection near view controls for smoke stability.
- `index.html`: cache-bust updated for the touched JS modules.

Remaining watch:

- object route opened by clicking a catalog card still blocks headless automation in this environment; direct hash route passes. Recheck manually or after a fresh browser environment restart.
- mobile tap targets below `44px` remain P2 visual polish, not part of this fix.
