# QA-004: pricing regression

Date: 2026-07-06.

Scope: smoke after adding company pricing route and tariff block.

## Result

Status: **passed**.

## Checked Scenarios

| Scenario | Result |
|---|---|
| Direct `#business-pricing` | OK, pricing page opens |
| Pricing cards | OK, 5 tariff cards render |
| Pricing buttons | OK, 5 visual buttons render |
| Cabinet `#company-cabinet=gk-paritet-development` | OK, cabinet opens |
| Cabinet tariff block | OK, `Тариф и лимиты` block renders |
| Cabinet panels | OK, 9 panels after `CAB-003` |
| `Изменить тариф` from cabinet | OK, opens `#business-pricing=gk-paritet-development` |
| Back from pricing | OK, returns to `#company-cabinet=gk-paritet-development` |
| Route stability | OK, pricing hash is not rewritten to `#card=...` |
| Desktop overflow | OK, `0` |
| Console | OK, no errors |

## All Developers

Checked all 32 developer slugs after adding the tariff block:

- 32 of 32 routes opened;
- each cabinet rendered 9 panels;
- each cabinet rendered `Тариф и лимиты`;
- each cabinet had exactly one pricing CTA;
- desktop overflow stayed `0`;
- console errors: `0`.

## Files In Scope

- `js/data/company-pricing.js`
- `js/pages/pricing/business-pricing-page.js`
- `css/business-pricing.css`
- `js/pages/company-cabinet/company-cabinet-page.js`
- `css/company-cabinet.css`
- `js/behavior/page-restore.js`
- `index.html`

`js/app.js` was not edited.
