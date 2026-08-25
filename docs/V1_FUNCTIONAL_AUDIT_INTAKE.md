# Kliper.City v1: functional audit intake

Date: 2026-07-08.

Purpose: convert the functional audit into workstream tasks. No code changes were made by this audit.

## Inputs Used

- `docs/V1_FUNCTIONAL_OWNER_TEST.md`
- `docs/V1_FUNCTIONAL_RECOMMENDED_ANSWERS.md`
- `docs/SITE_MAP.md`
- `docs/PAGE_PASSPORTS.md`
- `docs/V1_V2_ROADMAP.md`
- current `index.html` script/style wiring
- current data files:
  - `js/data/developers.js`
  - `js/data/buildings.js`
  - `js/data/business-spaces.js`
  - `js/data/company-cabinet.js`
  - `js/data/company-pricing.js`

## Data Baseline

| Data source | Count / state |
|---|---|
| Developers | 32 |
| Buildings | 141 |
| Building statuses | `строится`: 19, `уточнить`: 122 |
| Business spaces | 6 |
| Company cabinet custom companies | 3 plus defaults |
| Company pricing plans | 5 |

## Audit Limitation

The in-app browser connected, but read-only DOM inspection timed out twice during this pass. Local HTTP still returned `200`.

Interpretation:

- this audit should not claim full interactive acceptance;
- a focused QA smoke is required before final v1 closure;
- the timeout itself is a risk signal for current SPA complexity or browser-session state.

## Accepted Functional Boundary

Use `docs/V1_FUNCTIONAL_DECISIONS.md` as the current v1 boundary.

Use `docs/V1_PAGE_COMPLETION_MATRIX.md` as the page-by-page completion matrix.

## Routed Tasks

| ID | Owner chat | Priority | Task | Output |
|---|---|---|---|---|
| FUNC-QA-001 | Regression QA | P0 | Repeat lightweight interactive smoke after browser timeout | report: load/nav/theme/profile/stories/errors |
| FUNC-CAT-001 | Catalog Core | P1 | Verify developer card actions and route/back behavior | report or patch brief |
| FUNC-FIL-001 | Filters System | P1 | Verify residential filters, selected tags, reset, view modes | report or patch brief |
| FUNC-DATA-001 | Catalog Core + Data | P1 | Define completed/ready ЖК data semantics | data decision brief |
| FUNC-BUS-001 | Business + Filters System | P1 | Verify business filters/reset/view modes/repeated nav | report or patch brief |
| FUNC-OBJ-001 | Object Pages | P1 | Verify object page route/back/tabs/modals | report or patch brief |
| FUNC-DEV-001 | Object Pages + Company Cabinet | P1 | Verify public developer page and cabinet CTA boundary | report or patch brief |
| FUNC-PRO-001 | Profile Social | P1 | Verify profile local-state sync and visual-only CTA states | report or patch brief |
| FUNC-STO-001 | Stories & Motion | P1 | Verify stories state machine/rings/layers | report or patch brief |
| FUNC-CAB-001 | Company Cabinet | P1 | Verify cabinet route for explicit and fallback companies | report or patch brief |
| FUNC-PRICE-001 | Company Cabinet + Billing | P1 | Verify pricing route, return and prototype CTA boundaries | report or patch brief |
| FUNC-AUTH-001 | Backend/Auth | P2 | Convert accepted matrix into admin/backend requirements | docs update |

## Suggested Execution Order

1. `FUNC-QA-001`
2. `FUNC-DATA-001`
3. `FUNC-FIL-001` + `FUNC-BUS-001`
4. `FUNC-CAT-001` + `FUNC-OBJ-001` + `FUNC-DEV-001`
5. `FUNC-STO-001`
6. `FUNC-PRO-001` + `FUNC-CAB-001` + `FUNC-PRICE-001`
7. `FUNC-AUTH-001`

## Intake Update 2026-07-09

See `docs/FUNC_001_WORKSTREAM_REPORT_INTAKE.md`.

Current accepted status:

- `FUNC-QA-001`: blocked by browser automation environment; HTTP load is still `200`, no product P0 confirmed.
- `FUNC-DATA-001`: accepted and implemented as frontend project readiness normalization. Clarification: `Готовые ЖК` means fully completed projects; `developer.builtJK` is not a project readiness source.
- `FUNC-BUS-001`: no new code patch candidate without a stable live smoke.
- Remaining reports are still being collected from profile chats.

## Architect Notes

- Keep this as a functional gate before visual redesign and admin/backend work.
- Profile, company cabinet and pricing are currently v1 prototypes, not backend-ready products.
- `Готовые ЖК` was the main data-model gap discovered by this audit; v1 now has a frontend readiness normalization contract, while production data still needs backend/admin values.
- Stories remain the main state-machine/interaction risk.
- `js/app.js` remains legacy/generated and must not be edited during this audit follow-up unless Architect/Main explicitly approves a narrow route fix.
