# QA-003: regression smoke after Company Cabinet v1

Date: 2026-07-06.

Scope: full v1 smoke after adding `#company-cabinet=developerId`.

## Result

Status: **passed with one fixed defect**.

Fixed during QA:

- `Готовые ЖК` kept stale counter `142 карточки` after switching from `Новостройки`, while only 20 cards were visible.
- Fix: `js/filters/residential-list-guard.js` now syncs residential counters from visible cards even in grid mode.
- `index.html` cache-bust updated to `residential-list-guard-4`.

## Desktop Checks

| Area | Result |
|---|---|
| Initial catalog | OK, `Застройщики`, `32 карточки`, 32 visible cards |
| `Новостройки` | OK, `142 карточки`, 142 visible cards |
| `Новостройки` list/grid | OK, count stays `142`, view controls remain |
| `Готовые ЖК` | OK after fix, `20 карточки`, 20 visible cards |
| `Готовые ЖК` list/grid | OK after fix, count stays `20`, view controls remain |
| `Для бизнеса` | OK, `6 бизнес-помещений` |
| `Мария` profile | OK, profile route opens without object overlay |
| `#card=Брусника` | OK, public developer page opens |
| `#company-cabinet=brusnika` | OK, cabinet overlay opens and hash stays stable |

## Console

Browser console errors during checked scenarios: **0**.

## Notes

- The current local browser had dark theme enabled via saved local state. Regression was therefore checked in dark mode by default.
- `js/app.js` was not edited.
