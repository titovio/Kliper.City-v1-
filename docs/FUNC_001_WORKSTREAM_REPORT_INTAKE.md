# Kliper.City: FUNC-001 workstream report intake

Date: 2026-07-09.

Purpose: intake of the first functional-audit follow-up reports and local Architect/Main actions.

## Current Status

| Task | Owner | Status | Result |
|---|---|---|---|
| `FUNC-QA-001` | Regression QA | blocked | HTTP load passes, but in-app browser and headless automation time out. No product P0 confirmed. |
| `FUNC-DATA-001` | Catalog Core/Data | done | Separate normalized readiness field is the accepted safe model. Do not map all `уточнить` objects to ready. |
| `FUNC-FIL-001` | Filters System | accepted | Residential filters are code-level accepted with automation limits; old disabled layers remain disconnected. |
| `FUNC-BUS-001` | Business | accepted with limitation | Code review shows no clear business P1; live smoke is limited by automation environment. |
| `FILTERS-COPY-001` | Filters System | accepted | Added a small connected copy guard for residential year/status labels without editing `js/app.js` or reconnecting disabled filter layers. |
| `FUNC-STO-001` | Stories & Motion | accepted with limitation | State/ring report received; no new state-machine patch accepted from this FUNC step, and browser smoke remains environment-limited. |
| `FUNC-OBJ-001` / `FUNC-DEV-001` | Object Pages | accepted with watch | `OBJ-FUNC-RETRY-001` found no confirmed product P0/P1; route/back remains a manual visible-browser WATCH, not an automation P0. |
| `FUNC-PRO-001` | Profile Social | accepted with limitation | Profile showcase report received; current post-render layer looks sufficient, clean mobile/dark smoke remains limited by browser runner. |
| `FUNC-CAB-001` / `FUNC-PRICE-001` | Company Cabinet | accepted with watch | `CAB-FUNC-RETRY-001` returned `PASS with WATCH`; no P0/P1, only P2 fallback-data/copy polish candidates. |
| Mobile follow-up | Mobile QA | accepted with manual pass watch | `MOB-FUNC-CLOSURE-001` confirms no current mobile P0/P1; remaining items are manual visible-browser watch and P2 tap targets. |
| Product framing | Product / UX Lab | accepted | Owner-facing product framing received: close v1 functional acceptance before backend/admin, keep role profiles/payment/backend out of current v1 UI. |

## Architect/Main Actions Completed

### Readiness Normalization

Implemented a non-destructive frontend readiness layer:

- `js/data/building-readiness.js`;
- `index.html` now loads it after `buildings.js`;
- `js/catalog/building-cards.js` now respects `isReadyResidential` / `readinessStatus` when filtering `novostroyki` and `gotovye`.

The original `status` field is preserved.

Important product clarification:

- `Готовые ЖК` means developer projects where the whole project is complete and all houses/buildings are delivered;
- `Новостройки` means active residential projects/districts, where a project may have delivered houses, remaining houses and an overall delivery year;
- `developer.builtJK` is a developer-card aggregate and must not decide readiness of a specific ЖК/project.

Runtime summary from local data:

| Readiness | Count |
|---|---:|
| `completed` | 0 |
| `active` | 19 |
| `unknown` | 122 |

Source:

| Source | Count |
|---|---:|
| explicit status | 19 |
| unknown | 122 |

This resolves the immediate v1 semantic gap without pretending that every `уточнить` object is ready and without deriving project readiness from developer-level counts.

### Smoke Environment

Current smoke limitation:

- HTTP `GET /index.html` returns `200`;
- `index.html` includes `#root`, `js/app.js`, `test-selectors.js`, and `building-readiness.js`;
- bundled shell Playwright is incomplete in this environment (`playwright` wrapper exists, `playwright-core` does not resolve in shell);
- in-app browser / headless automation can time out on this SPA.

Decision:

- do not treat the automation timeout as a site P0 by itself;
- use manual/in-app visual checks when needed;
- keep automated checks short and isolated;
- do not run long mixed Playwright scenarios until the automation environment is stable.

## Accepted Decisions

1. `Готовые ЖК` should use normalized project readiness, not raw text `status`.
2. `status: "уточнить"` is not a ready/completed status.
3. `developer.builtJK` is not a temporary fallback source for project readiness.
4. `js/app.js` remains untouched.
5. Business has no new confirmed patch candidate from `FUNC-BUS-001` until live smoke is possible.

## Remaining Functional Follow-Up

Next useful actions:

1. Keep object route/back as manual visible-browser WATCH unless a real product defect is reproduced.
2. Keep cabinet/pricing visual desktop/mobile/dark as manual visible-browser WATCH; no P0/P1 patch is open.
3. Keep residual tap targets below 44px as P2 for Visual System, not a functional P0/P1.
4. Run one final manual visible browser pass before release-style v1 closure over:
   - main nav;
   - `Новостройки`;
   - `Готовые ЖК`;
   - business;
   - profile;
   - stories;
   - company cabinet;
   - pricing.

## Files Changed By Architect/Main In This Step

- `js/data/building-readiness.js`
- `index.html`
- `js/catalog/building-cards.js`
- `docs/DATA_STRUCTURE.md`
- `docs/V1_FUNCTIONAL_DECISIONS.md`
- `docs/V1_PAGE_COMPLETION_MATRIX.md`
- `docs/V1_FUNCTIONAL_AUDIT_INTAKE.md`
- `docs/FUNC_001_WORKSTREAM_REPORT_INTAKE.md`
- `docs/CHANGE_LOG.md`

## Architect / Main 2 Intake Update

Date: 2026-07-09.

- Architect / Main 2 accepted coordination from the previous Architect / Main chat.
- `FILTERS-COPY-001` is accepted: `js/filters/residential-filter-copy.js` updates only visible residential filter copy.
- `node --check` passed for the touched JS candidates reviewed in this intake:
  - `js/filters/residential-filter-copy.js`;
  - `js/data/building-readiness.js`;
  - `js/catalog/building-cards.js`;
  - `js/behavior/story-categories.js`;
  - `js/behavior/user-page-finalizer.js`;
  - `js/filters/selected-filter-inline.js`;
  - `js/pages/business-filter-polish.js`.
- `OBJ-FUNC-RETRY-001` is accepted with a manual visible-browser watch for route/back.
- `CAB-FUNC-RETRY-001` is accepted with manual visible-browser watch for visual/mobile/dark confirmation.
- `MOB-FUNC-CLOSURE-001` is accepted: no current mobile P0/P1, P2 tap targets remain.
- Architect / Main 2 attempted one final visible browser gate; browser automation timed out before DOM result.
- HTTP `/index.html` still returns `200`, so the final visible pass remains a manual checkpoint, not a product P0.
- No `js/app.js` edits were made or authorized.
