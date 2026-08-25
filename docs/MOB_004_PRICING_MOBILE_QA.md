# MOB-004: pricing mobile QA

Date: 2026-07-06.

Scope: mobile check for pricing page and cabinet tariff block.

## Result

Status: **passed**.

## Checked Scenario

Viewport:

```text
390px x 844px
```

Checked:

- `#business-pricing=gk-paritet-development`;
- pricing page opens;
- 5 pricing cards render;
- 5 visual tariff buttons render;
- horizontal overflow is `0`;
- browser console errors: `0`.

## Notes

- Mobile layout stacks pricing cards in one column.
- Company cabinet tariff block uses one-column layout on mobile through `css/company-cabinet.css`.
- No real payment or form submission exists in v1.
