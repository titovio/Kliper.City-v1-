# MOB-003: mobile QA after Company Cabinet v1

Date: 2026-07-06.

Scope: 390px and 430px mobile acceptance after adding company cabinet.

## Result

Status: **passed**.

## Checks

| Viewport | Area | Result |
|---|---|---|
| 390px | Catalog | OK, `Застройщики`, `32 карточки`, overflow `0` |
| 390px | Developer page | OK, `Брусника`, overflow `0` |
| 390px | Company cabinet | OK, `#company-cabinet=brusnika`, overflow `0` |
| 430px | Catalog | OK, `Застройщики`, `32 карточки`, overflow `0` |
| 430px | Developer page | OK, `Брусника`, overflow `0` |
| 430px | Company cabinet | OK, `#company-cabinet=brusnika`, overflow `0` |

## Console

Browser console errors during checked scenarios: **0**.

## Notes

- Mobile test selectors remain visible for catalog controls.
- On object/developer pages only profile nav selector is expected because the public large page owns the screen.
- No horizontal scroll was detected in checked mobile states.
