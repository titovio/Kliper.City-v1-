# Kliper.City: filters system audit

Date: 2026-07-06.

Scope: technical audit only. No runtime code was changed.

## Summary

Current filters are not one system. Residential catalog filters are still owned by the legacy React bundle in `js/app.js`, with external modules polishing and relocating parts of the DOM. Business filters are a separate DOM and state layer built by `js/pages/business-filter-polish.js`, while business results are rendered by `js/catalog/business-spaces.js`.

The main inconsistency is architectural:

- `Новостройки` and `Готовые ЖК` use the app-rendered filter row and shared selected-tags proxy.
- `Для бизнеса` replaces the app-rendered filter area with its own dropdown bar, selected tags, count and result host.
- old visual filter layers are removed/not mounted in the current runtime, but some orphan CSS/JS files remain in the repo and must not be reconnected without a separate decision.

## Files Map

| Area | Files | Current role | Risk |
|---|---|---|---|
| Core catalog state and DOM | `js/app.js` | Generates catalog tabs, residential filter UI, selected source row, counts, card lists. Read-only legacy/generated. | Very high. Do not edit for normal filter cleanup. |
| Stable test selectors | `js/behavior/test-selectors.js` | Assigns `data-kliper-testid` to visible nav buttons, view controls and count. | Medium. Selector logic depends on visible text and viewport. |
| Phase 1 catalog pills | `js/behavior/phase1-cleanup.js` | Creates `.kliper-pill-btn` cloned/moved catalog navigation, handles active tab events. | High. Business and tests detect active tab through these pills. |
| Shared selected tags | `js/filters/selected-filter-inline.js` | Finds legacy selected filter footer, hides it with `.kliper-selected-filter-source-hidden`, clones buttons after the count. | Medium-high. Text/class heuristic can attach to wrong footer if DOM changes. |
| Business filter dropdowns | `js/pages/business-filter-polish.js` | Builds `.kliper-biz-bar`, owns `selectedFilters`, renders `.kliper-biz-selected-inline`, emits business filter events. | High. Separate state from `js/app.js`. |
| Business results | `js/catalog/business-spaces.js` | Reads selected `.kliper-biz-option`, filters spaces, hides original children, renders `[data-business-spaces-host]`. | High. Cross-owned with Business zone. |
| Business CSS | `css/business-spaces.css` | Styles business toolbar, count, view switcher, grid/list/map/cards/pages. | Medium. Interacts with shared selected tag CSS. |
| Main UI polish | `css/ui-ux-pro-max.css` | Styles residential filter row, selected tags, business filter overrides, dark theme. Also contains CSS for currently unloaded fast filters. | High. Broad selectors affect many sections. |
| Legacy/base CSS | `css/style.css` | Contains base and generated CSS, including `.kliper-newbuild-picker-row` rules. | High. Large generated-ish CSS surface. |
| Unloaded residential proxy | `js/filters/newbuild-fast-filters.js` | Would create `.kliper-newbuild-fast-filter` proxy over `.kliper-newbuild-picker-row`. Not connected in `index.html`. | High if reconnected: can duplicate/replace current filter UI. |
| Unloaded cards mobile polish | `js/filters/cards-mobile-filter-polish.js` | Would add `.kliper-cards-filter-*` classes and collapse behavior. Not connected in `index.html`. | Medium-high if reconnected: changes filter layout behavior. |
| Feed/top mobile filters | `js/filters/feed-mobile-filters.js`, `js/filters/top-mobile-filters.js` | Separate filters for feed/top pages, outside primary catalog audit. | Low for current task unless shared CSS is changed. |
| Regression guard | `tests/catalog-filter-crash.test.cjs` | Ensures removed visual catalog filter does not reappear and tab switching does not blank the app. | Useful guard for future filter work. |

## Current DOM Structure

### Residential: `Новостройки`

Observed through `[data-kliper-testid="nav-newbuildings"]` at `http://127.0.0.1:8765/index.html`:

- heading: `Новостройки`;
- count: `142 карточки`;
- active nav: `.kliper-pill-btn active`;
- source filter row exists: `.kliper-newbuild-picker-row`;
- selected source footer is hidden by `.kliper-selected-filter-source-hidden`;
- shared inline box exists as `.kliper-selected-filter-inline is-empty`;
- old visual filter not mounted: no `.kliper-cards-visual-filter`, no `[data-visual-cards-tab]`;
- `.kliper-newbuild-fast-filter` was not mounted in the checked runtime.

### Residential: `Готовые ЖК`

Observed through `[data-kliper-testid="nav-ready"]`:

- heading: `Готовые ЖК`;
- count: `20 карточки`;
- active nav: `.kliper-pill-btn active`;
- source filter row exists: `.kliper-newbuild-picker-row`;
- first status-like filter text changes from `Год сдачи` to `Сдан`;
- selected inline remains the shared empty `.kliper-selected-filter-inline`;
- old visual filter not mounted.

### Business: `Для бизнеса`

Observed through `[data-kliper-testid="nav-business"]`:

- heading: `Для бизнеса`;
- count: `6 бизнес-помещений`;
- active nav: `.kliper-pill-btn active`;
- `.kliper-biz-bar` exists with dropdowns:
  - `Тип сделки`;
  - `Все районы`;
  - `Тип помещения`;
  - `Площадь`;
  - `Бюджет`;
- `[data-business-spaces-host]` exists and renders business cards;
- original app-rendered business children are hidden with `[data-business-hidden-original]` (observed count: `2`);
- applying `Тип сделки -> Аренда` changes count `6 бизнес-помещений` to `4 бизнес-помещений`;
- business selected tags are a second inline box: `.kliper-selected-filter-inline.kliper-biz-selected-inline`;
- reset returns count to `6 бизнес-помещений`.

## Conflicts And Mismatches

1. Two selected-tags implementations share CSS but not state.

`js/filters/selected-filter-inline.js` clones buttons from the legacy selected footer. `js/pages/business-filter-polish.js` separately renders `.kliper-biz-selected-inline` after `.kliper-business-count`. In business mode both boxes can exist: the shared empty inline box and the business inline box.

Risk: future CSS/JS that assumes a single `.kliper-selected-filter-inline` can target the wrong box.

2. Business filters are data-driven by DOM, not shared app state.

`js/catalog/business-spaces.js` reads `.kliper-biz-option.selected` from the DOM. Residential filters are controlled by `js/app.js` state. This is why business and residential filters cannot behave identically without a small adapter layer.

Risk: selected tag, reset and count behavior can visually match while logic remains separate.

3. Business result rendering hides original DOM.

Business render creates `[data-business-spaces-host]` and hides original section children using `[data-business-hidden-original]`.

Risk: tab/profile transitions can leave hidden or stale nodes in DOM if cleanup order changes. This matches the baseline report concern about business headings remaining in DOM after profile navigation.

4. Orphan fast/mobile filter layers are present but not connected.

`js/filters/newbuild-fast-filters.js` and `js/filters/cards-mobile-filter-polish.js` are not loaded by `index.html`, but CSS for `.kliper-newbuild-fast-filter` and `.kliper-cards-filter-*` remains in `css/ui-ux-pro-max.css` / `css/style.css`.

Risk: reconnecting these scripts would revive another layer over the same residential filters and may duplicate controls.

5. Residential filter detection is heuristic.

`selected-filter-inline.js` detects the selected footer by Tailwind class fragments (`border-t`, `border-slate-100`, `flex`, `gap-2`) and text (`Выбранные фильтры появятся здесь` or `Сбросить`).

Risk: a layout-only class change can break selected tags without changing filter logic.

6. `data-kliper-testid` currently works for the three target scenarios.

The checked nav selectors correctly resolved to visible `.kliper-pill-btn` nodes:

- `nav-newbuildings`;
- `nav-ready`;
- `nav-business`.

Risk: selector assignment is based on visible button text. Extra visible duplicates with the same text can still matter, though current sort picks the first visible top-left candidate.

## Minimal Unification Plan

Do not start by editing `js/app.js`.

1. Document and enforce one active owner per filter layer.

Files:

- `docs/FILTERS_SYSTEM_AUDIT.md`;
- future note in `docs/PROJECT_DECISIONS.md` if approved.

Risk: none for runtime.

2. Add a tiny filter-state adapter, if code work is approved.

Candidate file:

- `js/filters/filter-state-adapter.js`.

Purpose:

- expose normalized current selected tags for residential and business;
- expose reset hooks per mode;
- avoid making `selected-filter-inline.js` inspect business DOM directly.

Risk: medium. Requires `index.html` script order change, so Architect/Main approval is needed.

3. Make shared selected tags ignore business mode or explicitly delegate to business.

Candidate file:

- `js/filters/selected-filter-inline.js`.

Minimal option:

- when `.kliper-biz-bar` or active `Для бизнеса` is present, keep the shared box empty/hidden and let `.kliper-biz-selected-inline` own business tags.

Risk: low-medium. Must check `Новостройки`, `Готовые ЖК`, `Для бизнеса`, dark theme and mobile.

4. Keep old visual/fast layers disconnected unless there is a separate recovery task.

Files to avoid reconnecting:

- `js/filters/newbuild-fast-filters.js`;
- `js/filters/cards-mobile-filter-polish.js`;
- any removed `cards-visual-section-filter` script.

Risk if reconnected: high. Could reintroduce hidden/double filter layers.

5. If business must match residential behavior more closely, move only the selected-tag bridge first.

Candidate files:

- `js/pages/business-filter-polish.js`;
- `css/business-spaces.css`;
- `css/ui-ux-pro-max.css`.

Do not change:

- `js/catalog/business-spaces.js` filtering logic unless a Business-zone task approves it;
- cards/stories/profile layout.

Risk: medium because business count/host and selected tags are tightly coupled.

## Verification Performed

Environment:

- URL: `http://127.0.0.1:8765/index.html`;
- viewport: `1440x900`;
- browser: Microsoft Edge via Playwright;
- selectors: `data-kliper-testid`.

Checked:

- `nav-newbuildings` opens `Новостройки`, count `142 карточки`;
- `nav-ready` opens `Готовые ЖК`, count `20 карточки`;
- `nav-business` opens `Для бизнеса`, count `6 бизнес-помещений`;
- business filter `Тип сделки -> Аренда` changes count to `4 бизнес-помещений`;
- business reset returns count to `6 бизнес-помещений`;
- old visual catalog filter did not reappear.

Console:

- only external/resource errors were observed, consistent with existing baseline class of issues;
- no local filter crash was observed during this audit run.

## Files Changed

- `docs/FILTERS_SYSTEM_AUDIT.md`
