# CAB-002: Company Cabinet v1 QA

Date: 2026-07-06.

Scope: direct routes for all 32 developers, fallback state, desktop layout.

## Result

Status: **passed**.

## Route Checks

Checked 32 routes from `js/data/developers.js`:

```text
#company-cabinet=developerSlug
```

Result:

- 32 of 32 routes opened.
- Hash stayed stable as `#company-cabinet=...`.
- Cabinet active class was applied.
- Company title matched developer name.
- 7 statistic cards rendered.
- 8 main panels rendered at `CAB-002` time.
- Desktop horizontal overflow: `0`.
- Browser console errors: `0`.

## Fallback Data

Most companies get objects from `js/data/buildings.js`.

One company currently has no linked objects in the building dataset:

| Company | Slug | Result |
|---|---|---|
| `ДК {ХаризМЫ}` | `dk-harizmy` | correct empty-state in `Объекты компании` |

This is acceptable for v1 because the cabinet page does not crash and shows a neutral empty-state.

## Update After CAB-003

After adding pricing:

- cabinet now renders 9 panels;
- new panel: `Тариф и лимиты`;
- all 32 developer routes were rechecked in `QA_004_PRICING_REGRESSION_REPORT.md`;
- 32 of 32 routes passed after the tariff block was added.

## V1 Boundaries

Still intentionally mock/visual:

- publishing;
- document upload;
- CRM;
- outgoing offers;
- real roles;
- backend authorization.

Do not implement these before `AUTH-002`.
