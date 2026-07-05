# Kliper.City v1: visual system audit

Date: 2026-07-06
Role: Visual System
Scope: desktop, mobile 390px, dark theme. Code was not changed.

## Checked

- Desktop 1440x900: `Застройщики`, `Новостройки`, `Готовые ЖК`, `Для бизнеса`, profile entry.
- Mobile 390x844: same catalog sections in light and dark theme.
- Dark theme: catalog cards, business cards, filters, selected tags, empty state, stories.
- Stories viewer: mobile open state.
- Console: no errors or warnings observed during this pass.

## Summary

The main catalog UI is generally stable: counts render, cards are visible, desktop horizontal overflow was not observed, and dark theme is readable in the core catalog. The biggest visible issues are mobile first-screen density, profile state after business catalog, inconsistent business-card visual language, and slight stories viewer cropping on mobile.

## P0

None found as pure visual P0.

## P1

### 1. Profile can open into a mixed business/profile state

What user sees: after opening `Для бизнеса` and clicking `Мария`, URL changes to `#card=Мария`, but the visible content can remain business cards. In this state the page has profile hash/state, while the screen still shows `6 бизнес-помещений` and business cards.

Why it is bad: user believes they opened the profile, but the visual state contradicts the URL and header action. It also temporarily removes main catalog test/navigation selectors until the logo is clicked.

Minimal solution: inspect profile restore/route finalization around business mode and ensure profile render clears business catalog DOM before applying the profile page. This is probably not a CSS-only fix; keep it out of `js/app.js` unless owner/architect approves.

### 2. Mobile first screen is overloaded before catalog content

What user sees: on 390px, stories, nav, search, section pills, filters and view controls occupy almost the whole first viewport. In `Новостройки` and `Готовые ЖК`, the first card starts around `y=768`, so the user sees mostly controls rather than content.

Why it is bad: the catalog feels like a settings screen before it feels like a catalog. It increases scroll cost and makes the active section harder to confirm.

Minimal solution: reduce mobile vertical stack only visually: compact story row, collapse secondary filters by default, or keep only the most important filter row visible. Do not change filter logic.

### 3. Business cards use a different visual system than main catalog cards

What user sees: main catalog cards are image cards with compact bottom metadata and small action counters. Business cards are larger, more dashboard-like, with big metric boxes and a separate button treatment. In dark theme they read more like a separate product.

Why it is bad: `Для бизнеса` feels disconnected from the rest of Kliper.City, especially when switching tabs. This weakens the single-catalog mental model.

Minimal solution: align card radius, overlay density, action button scale, and metadata rhythm with the main cards while keeping business-specific facts.

### 4. Stories viewer is slightly cropped on mobile

What user sees: on 390px, the opened story card measured about `x=-7`, `w=390`, with media around `x=-11`, `w=398`. Visually it is very close to full screen but shifted left.

Why it is bad: close/progress/media edges can look clipped on narrow devices and may create fragile touch areas.

Minimal solution: constrain story viewer card/media to `inset: 0` or `width: 100vw` without negative offsets on mobile. Recheck both small and large story rings.

## P2

### 5. Selected tag treatment is readable but not fully integrated

What user sees: selected filter appears as a small chip next to the count, while `Сбросить` is plain text. In dark theme the chip reads as a separate floating capsule.

Why it is bad: selected state is functional but visually weaker than filter buttons and business selected chips.

Minimal solution: unify selected tag surface, reset button spacing, and dark colors in `css/ui-ux-pro-max.css` / relevant filter polish styles.

### 6. Empty-state text is too filter-specific

What user sees: after an impossible search query, empty state says `Попробуйте снять часть фильтров или выбрать другой год сдачи.`

Why it is bad: for search-driven empty states, "другой год сдачи" is misleading. It sounds like the system misunderstood the user's action.

Minimal solution: use a neutral empty-state copy for combined search/filter empty results, for example "Попробуйте изменить запрос или снять часть фильтров." Text-only change.

### 7. Offscreen navigation/menu duplicates are visually measurable

What user sees: not directly visible, but DOM contains interactive-looking panels positioned offscreen at negative or far-positive x coordinates. They did not create horizontal overflow in this pass.

Why it is bad: this is a visual-system risk for future responsive bugs, test targeting, and accidental focus/selector conflicts.

Minimal solution: keep hidden panels inert/aria-hidden and ensure offscreen positioning never contributes to layout or focus order. No broad refactor.

### 8. Dark theme is readable but heavily one-note

What user sees: dark theme relies strongly on violet accents, dark navy surfaces, and teal glow. It is polished, but the whole page can feel visually saturated, especially with stories rings and active pills.

Why it is bad: high accent density reduces hierarchy; selected controls, stories rings, and card badges compete.

Minimal solution: lower glow intensity in secondary zones and reserve brightest violet for active navigation/primary controls.

## Safe Fix Order

1. Fix profile mixed state after business/profile transition, with owner/architect awareness because it is state/routing-adjacent.
2. Compact mobile first-screen vertical stack without changing filter logic.
3. Correct stories viewer mobile offsets and recheck story rings.
4. Normalize selected tags and empty-state copy.
5. Align business card visual rhythm with main cards.
6. Tune dark theme accent intensity.

## Verification Notes

- Local server: `http://127.0.0.1:4173/index.html`.
- Desktop checked at 1440x900.
- Mobile checked at 390x844.
- Dark theme toggled through the UI button.
- Console logs checked through browser dev logs: no errors/warnings observed.
- No JS/CSS/HTML code was edited.
