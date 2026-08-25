# Kliper.City: filters system patch plan

Date: 2026-07-06.

Scope: FIL-001 / FIL-002 second pass after `docs/FILTERS_SYSTEM_AUDIT.md`.

Runtime code was not changed in this pass.

## Current Status

The current filter state is stable enough to avoid an immediate emergency patch.

Checked scenarios:

- `Новостройки`: open, apply `Год сдачи -> 2026`, selected tag appears, reset clears it.
- `Готовые ЖК`: open, result count remains available.
- `Для бизнеса`: open, apply `Тип сделки -> Аренда`, count changes `6 -> 4`, selected tag appears, reset returns count `4 -> 6`.
- Desktop light, desktop dark, mobile light: no horizontal overflow in checked paths.
- Old layers did not appear:
  - no `.kliper-cards-visual-filter`;
  - no `[data-visual-cards-tab]`;
  - no `cards-visual-section-filter` script;
  - no old placeholder text `Подобрать новостройку`, `Показать ЖК`, `Выберите район`;
  - no `.kliper-cards-source-filter-overlay`;
  - no `.kliper-newbuild-fast-filter`;
  - no `.kliper-cards-filter-head`.

Important update since the first audit: `js/filters/selected-filter-inline.js` now has `isBusinessMode()` and removes the shared residential inline box in business mode. That reduces the previous double-selected-tags conflict.

## Stabilization Principles

1. Do not edit `js/app.js`.
2. Do not reconnect disabled fast/mobile filter layers.
3. Keep residential and business filter logic separate for now.
4. Patch only guardrails, CSS consistency and test coverage first.
5. Treat `index.html`, `js/catalog/business-spaces.js` and `js/behavior/phase1-cleanup.js` as coordination files requiring Architect/Main or Business agreement.

## Patch Plan

### Patch 1: Add Regression Guards For Old Filter Layers

Goal: make FIL-002 permanent.

Files:

- `tests/catalog-filter-crash.test.cjs`

Minimal changes:

- Extend existing assertions to check every catalog tab for:
  - `.kliper-cards-visual-filter`;
  - `[data-visual-cards-tab]`;
  - scripts containing `cards-visual-section-filter`;
  - `.kliper-cards-source-filter-overlay`;
  - `.kliper-newbuild-fast-filter`;
  - `.kliper-cards-filter-head`.
- Add text assertions that old placeholder copy is absent:
  - `Подобрать новостройку`;
  - `Показать ЖК`;
  - `Выберите район`.
- Add business path assertions after `nav-business`, `Тип сделки -> Аренда`, reset:
  - residential shared empty inline is absent in business mode;
  - `.kliper-biz-selected-inline` appears only when there is a business selected tag;
  - reset hides it again.

Risk:

- Low runtime risk because this is test-only.
- Medium maintenance risk because current test uses text clicks in places; prefer `data-kliper-testid` where available.

Order:

1. Add assertions.
2. Run existing test.
3. If flaky because of server/runtime path, only document flake; do not change app code.

### Patch 2: Harden Residential Selected Tags Against Wrong Source Rows

Goal: keep selected tags stable if hidden/stale rows remain after tab switches.

Files:

- `js/filters/selected-filter-inline.js`

Minimal changes:

- In `isSelectedRowCandidate(node)`, reject nodes inside business DOM:
  - `.kliper-biz-bar`;
  - `[data-business-spaces-host]`;
  - `.kliper-business-page`;
  - `[data-kliper-biz-polished]`;
  - `.kliper-biz-filter-fallback`.
- In `hideSelectedSourceRows()`, remove `.kliper-selected-filter-source-hidden` from rows that are no longer candidates, except while still in residential mode.
- In `findSelectedRow()`, prefer rows whose closest `section` contains the current active residential heading (`Новостройки` or `Готовые ЖК`) when such a row exists.

Risk:

- Low-medium. It touches selected-tags behavior for residential catalogs.
- Must verify `Новостройки`, `Готовые ЖК`, `Застройщики`, `Для бизнеса`.

Why not more:

- Do not replace the current heuristic with a full state adapter yet; that would require broader coordination and possibly `index.html`.

### Patch 3: Remove Duplicate Business Reset Handling Or Make It Idempotent

Goal: avoid double reset/event dispatch from two click listeners in `business-filter-polish.js`.

Files:

- `js/pages/business-filter-polish.js`

Current issue:

- Reset/clear is handled both on `filterSection.addEventListener('click', ...)` and on document capture listener.
- It works now, but future changes can double-dispatch `kliper:business-filter-change`.

Minimal changes:

- Keep the document capture listener as the single reset/clear owner, or keep the section listener and make document capture skip events inside the live business filter root.
- Add a simple guard such as `event.defaultPrevented` before handling in the second listener.

Risk:

- Medium because business count updates depend on emitted events.
- Coordinate with Business if changing event dispatch semantics.

Verification:

- Business `Тип сделки -> Аренда` changes `6 -> 4`.
- `Сбросить` returns `4 -> 6`.
- Clearing a single chip works.
- Grid/list/map still render.

### Patch 4: Consolidate Business Filter CSS Source

Goal: reduce future dark/mobile divergence.

Files:

- `js/pages/business-filter-polish.js`
- `css/ui-ux-pro-max.css`
- `css/business-spaces.css`

Current issue:

- `business-filter-polish.js` injects substantial CSS at runtime.
- `css/ui-ux-pro-max.css` also overrides `.kliper-biz-*`, especially dark theme.
- `css/business-spaces.css` handles toolbar/count/view and business layout.

Minimal changes:

- Move non-critical injected style rules from `business-filter-polish.js` into `css/business-spaces.css` or `css/ui-ux-pro-max.css`.
- Keep only essential fallback injection if the script must survive CSS load failures.
- Do not change class names or DOM structure in this patch.

Risk:

- Medium. Visual regressions possible in dark/mobile.
- Requires careful before/after screenshots; best coordinated with Visual System.

Recommendation:

- Defer until after test guards are in place.

### Patch 5: Mark Disabled Filter Layers As Intentionally Disconnected

Goal: prevent accidental reconnection of old filter layers.

Files:

- `js/filters/newbuild-fast-filters.js`
- `js/filters/cards-mobile-filter-polish.js`
- optionally `docs/PROJECT_DECISIONS.md`

Minimal changes:

- Add a short top-of-file comment only, for example: `Disconnected in v1; do not reconnect without Architect approval`.
- Do not delete these files.
- Do not add them to `index.html`.

Risk:

- Very low runtime risk if comments only.
- If editing comments is considered unnecessary churn, keep this as docs-only.

### Patch 6: Optional Mobile/Dark CSS Tightening

Goal: small visual guard only if QA finds a concrete defect.

Files:

- `css/ui-ux-pro-max.css`
- `css/business-spaces.css`

Candidate changes only if reproduced:

- Ensure `.kliper-selected-filter-inline` wraps below count on narrow widths.
- Ensure `.kliper-biz-selected-inline` uses full width on mobile after count.
- Ensure dark selected chip/reset colors are consistent between residential and business.

Risk:

- Low-medium. CSS selectors are broad in `ui-ux-pro-max.css`.
- Do not adjust card spacing or stories.

## Proposed Application Order

1. Patch 1: regression guards for old layers and selected-tags/reset.
2. Patch 2: residential selected-tags source-row hardening.
3. Patch 3: business reset listener dedupe/idempotence.
4. Patch 6 only if mobile/dark QA reports a visual defect.
5. Patch 4 only after stabilization, because it moves style ownership.
6. Patch 5 can be docs/comments only at any time, but avoid touching disconnected runtime files unless desired.

## Required Verification After Any Runtime Patch

Desktop `1440x900`:

- `nav-newbuildings`: count visible, choose `2026`, selected tag appears, reset clears.
- `nav-ready`: count visible, selected source row hidden but not visible.
- `nav-business`: count visible, choose `Аренда`, selected tag appears, reset clears.
- Check absent old layers listed in this document.

Dark theme:

- Repeat `Новостройки` selected tag and `Для бизнеса` selected tag/reset.
- Dropdown panels readable.
- No old rectangular filter backplate returns.

Mobile `390x844`:

- Repeat `Новостройки`, `Готовые ЖК`, `Для бизнеса`.
- `overflowX` stays `0`.
- Selected tags wrap instead of pushing the layout horizontally.

Commands:

- For changed JS files: `node --check`.
- Existing Playwright smoke if available: `tests/catalog-filter-crash.test.cjs`.

## Do Not Do In This Patch Set

- Do not edit `js/app.js`.
- Do not edit cards, stories or profile modules.
- Do not reconnect `newbuild-fast-filters.js`.
- Do not reconnect `cards-mobile-filter-polish.js`.
- Do not add a new dependency.
- Do not refactor business results in `js/catalog/business-spaces.js` without Business coordination.

## Files Changed In This Pass

- `docs/FILTERS_SYSTEM_PATCH_PLAN.md`
