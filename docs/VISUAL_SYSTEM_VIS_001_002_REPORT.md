# Kliper.City: VIS-001 / VIS-002 report

Date: 2026-07-06
Role: Visual System
Scope: `VIS-001 Dark theme audit` and `VIS-002 Unified visual grid desktop/mobile`.

Code/CSS/JS were not changed in this pass.

## Checked

- Desktop 1440x900: `Застройщики`, `Новостройки`, `Готовые ЖК`, `Для бизнеса`.
- Mobile 390x844: `Новостройки`, `Для бизнеса`.
- Dark theme: filters, empty-state, selected tags, business container, object page attempt, cards, action buttons, stories.
- Object page: opened first `Новостройки` card in dark theme.
- Console: no errors/warnings observed in this pass.

## What Looks Stable

- Residential desktop grid shows 4 cards in the first row at 1440px.
- Residential action buttons are visually consistent in size: counters around `54x28`, story action around `56x56`.
- Residential selected tags in dark theme are compact and readable: chip + `Сбросить` stay on one line near the result count.
- Empty-state in dark theme is readable and now uses neutral copy.
- Stories sizes are consistent: desktop story items around `103x133`, mobile around `64x89`.
- Mobile story viewer is fixed: card/media open at `x=0`, `y=0`, `w=390`, `h=844`; no negative offset found.
- Desktop horizontal overflow was not observed in checked states.

## P1 Defects

### VIS-P1-001: Object page still renders as a side layer over catalog

What user sees: after opening `ЖК Речной Порт` from `Новостройки`, the object content appears on the right, but the catalog remains visible underneath/alongside it. The visible viewport still contains catalog headings/cards and `result-count` remains `142 карточки`.

Why it is bad: visually this is neither a clean object page nor an intentional split-view. It breaks hierarchy: the object title competes with catalog cards and filters, and dark theme cannot be judged cleanly because two page states are visible at once.

Responsible chats: Object Pages, Architect / Main, Visual System after routing/state is clarified.

Minimal solution: first decide whether object view is a real page or quick-view. If it is a page, object render must visually clear/hide catalog layer. If it is quick-view, add an intentional drawer/split-view frame and dim/de-emphasize catalog. Avoid `js/app.js` unless Architect approves.

Safe CSS zones:

- `css/ui-ux-pro-max.css` for dark surfaces and object visual containment only after state decision.
- Object page CSS selectors already present in `css/ui-ux-pro-max.css`.
- Do not solve the route/state part with CSS alone if catalog remains interactable.

### VIS-P1-002: Business mobile first screen is still too tall

What user sees: on mobile 390px in dark theme, `Новостройки` first card starts around `y=404`, but `Для бизнеса` first card starts around `y=686`. Most of the first screen is navigation/search/filter/view controls.

Why it is bad: business catalog feels slower and heavier than the residential catalog. The user switches to business and mostly sees controls, not inventory.

Responsible chats: Business, Visual System, Mobile QA.

Minimal solution: compact business mobile filter stack visually. Keep filter logic intact. Prefer reducing vertical gaps, collapsing secondary filters, or tightening the business view switcher before changing card content.

Safe CSS zones:

- `css/business-spaces.css` for business filter/card spacing.
- `css/ui-ux-pro-max.css` only for shared mobile shell spacing if needed.
- Do not change `js/catalog/business-spaces.js` or business filter state for this visual fix.

## P2 Defects

### VIS-P2-001: Offscreen panels are still measurable outside viewport

What user sees: no direct visual break in the checked viewport, but DOM geometry reports interactive-looking navigation/filter controls at negative x positions and far-right positions, for example `x=-344`, `x=403` on mobile, and `x=1469+` on desktop.

Why it is bad: this is a layout/focus/test risk. Even if `overflowX` currently remains stable, hidden panels can accidentally become visible, catch clicks/focus, or confuse future visual tests.

Responsible chats: Visual System, Filters System, Mobile QA. Architect / Main if the fix touches `phase1-cleanup` or hidden navigation behavior.

Minimal solution: ensure hidden panels use inert/hidden states that do not participate in layout or focus. If CSS-only, prefer `visibility`, `pointer-events`, `contain`, transform-based off-canvas rules, and explicit max-width constraints.

Safe CSS zones:

- `css/ui-ux-pro-max.css` for global hidden/offscreen visual containment.
- Related mobile filter CSS only if the affected layer is confirmed.
- Avoid changing JS visibility/state without a Filters/System or Architect task.

### VIS-P2-002: Business desktop grid intentionally breaks 4-card rhythm

What user sees: residential catalogs show 4 cards per row at 1440px. Business shows 3 wider cards per row.

Why it is bad: not necessarily wrong, but it weakens the unified visual grid requested by VIS-002. The business section reads as a separate dashboard/card system.

Responsible chats: Business, Visual System.

Minimal solution: decide whether business cards are allowed to stay 3-column because they carry more metrics. If the target is one catalog rhythm, reduce business card density/metrics enough to fit 4 columns safely. Do not do this as a blind redesign.

Safe CSS zones:

- `css/business-spaces.css`.
- `css/card-proportions.css` only if shared card sizing needs a documented token.

### VIS-P2-003: Dark action buttons still depend on light utility source classes

What user sees: dark theme appears readable, but action controls inside cards still carry source classes like `bg-white` and are corrected by overrides.

Why it is bad: the visible result is acceptable now, but the theme depends on broad dark overrides. Future button/card changes can regress contrast easily.

Responsible chats: Visual System, Catalog Core for action semantics if behavior is involved.

Minimal solution: keep the current visual result, but document action-button dark tokens and narrow the dark override selectors when touching this area next.

Safe CSS zones:

- `css/ui-ux-pro-max.css` for dark action button tokens.
- `css/card-proportions.css` for shared card/action dimensions if needed.
- Do not change action JS/localStorage behavior.

### VIS-P2-004: Object page dark audit is blocked by mixed page state

What user sees: object content itself has readable dark surfaces, but it cannot be audited as a standalone page because catalog cards and headings remain visible.

Why it is bad: any object-page spacing/color conclusion is contaminated by catalog overlap.

Responsible chats: Object Pages first, then Visual System.

Minimal solution: resolve VIS-P1-001 before final dark-token polishing for object pages.

Safe CSS zones:

- `css/ui-ux-pro-max.css` for object page dark surfaces after state cleanup.
- `js/pages/object/*` only for Object Pages chat if structure/state needs non-visual work.

## Safe Fix Order

1. Object Pages / Architect: decide and fix object page vs quick-view state.
2. Business + Visual System: compact business mobile first screen.
3. Visual System + Filters System: contain offscreen panels so they do not affect layout/focus/tests.
4. Business + Visual System: decide whether business remains 3-column or adopts shared 4-card rhythm.
5. Visual System: document/narrow dark action button tokens.

## Safe CSS Zones

| Zone | Safe For | Avoid |
|---|---|---|
| `css/ui-ux-pro-max.css` | dark tokens, selected tags, empty-state, shared spacing, object visual containment | route/state fixes, broad redesign |
| `css/business-spaces.css` | business filters, business card spacing, mobile business density, business grid | shared residential filters, business data/logic |
| `css/story-categories.css` | only story sizing/viewer visual fixes after Stories approval | changing scroll state machine or ring logic |
| `css/card-proportions.css` | shared card/action dimensions if a tokenized size is needed | changing card DOM or behavior |

## Verification Notes

- Browser path: local static page on `http://127.0.0.1:4174/index.html`.
- Desktop: `1440x900`.
- Mobile: `390x844`.
- Dark theme was active through the site theme state.
- Console logs: no errors/warnings observed.
- No build was run because this was a no-code audit pass.
