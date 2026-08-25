# Kliper.City: V1 functional closure status

Date: 2026-07-09.

Purpose: summarize the current v1 functional closure after Architect / Main 2 accepted the first FUNC workstream reports.

## Closure State

Status: `accepted with manual visible-browser gate`.

There are no currently confirmed product P0/P1 defects from the accepted FUNC reports.

The remaining release-style gate is one manual visible-browser pass, because in-app/headless automation repeatedly times out while HTTP `/index.html` still returns `200`.

## Accepted Workstreams

| Area | Status | Notes |
|---|---|---|
| Readiness data | accepted | `Готовые ЖК` uses normalized project readiness; `status: "уточнить"` remains unknown. |
| Residential filters | accepted | Old disabled fast/mobile filter layers remain disconnected. |
| Residential filter copy | accepted | `Новостройки`: `Срок проекта`; `Готовые ЖК`: `Год сдачи ЖК`. |
| Business filters | accepted with limitation | No confirmed new P1; live smoke remains automation-limited. |
| Stories | accepted with limitation | Ring/state report accepted; no new state-machine patch authorized from FUNC step. |
| Object/developer pages | accepted with watch | No confirmed P0/P1; route/back remains manual visible-browser watch. |
| Profile | accepted with limitation | Profile showcase layer is acceptable for v1; backend/social remains future. |
| Company cabinet/pricing | accepted with watch | `PASS with WATCH`; no P0/P1, only P2 fallback-data/copy polish. |
| Mobile | accepted with watch | No current mobile P0/P1; P2 tap targets remain. |
| Product framing | accepted | Backend/admin/role profiles/payment stay out of current static v1 UI. |

## Manual Visible-Browser Gate

Run once before release-style v1 closure:

1. Load `/index.html`.
2. Switch main nav:
   - `Застройщики`;
   - `Новостройки`;
   - `Готовые ЖК`;
   - `Для бизнеса`.
3. Check residential filters:
   - selected tag;
   - reset;
   - grid/list/map controls;
   - filter copy labels.
4. Open one object route:
   - `#card=ЖК Речной Порт`;
   - tabs;
   - modals;
   - back.
5. Open one developer/public page and cabinet boundary:
   - public developer page;
   - `#company-cabinet=brusnika`;
   - return/public boundary.
6. Check profile:
   - `Мария`;
   - local showcase counters;
   - visual-only CTA honesty.
7. Check stories:
   - default big;
   - compact on scroll;
   - viewer open/close;
   - no legacy ring overlay.
8. Check pricing:
   - `#business-pricing=brusnika`;
   - back to cabinet;
   - no real payment promise.
9. Repeat key screens at mobile width `390/430px` and dark theme.
10. Confirm no obvious horizontal overflow or blocking console/page error.

## P2 / Polish Queue

These are not blockers for functional closure unless owner chooses a polish pass before backend/admin:

| Candidate | Owner | Scope |
|---|---|---|
| `UXVIS-TAP-001` | Visual System | Plan tap targets below `44px`: theme/search/nav pills/view toolbar/cabinet actions on mobile. |
| Cabinet fallback data | Company Cabinet / Data | Optional explicit data for `gk-paritet-development` instead of generic fallback. |
| Pricing CTA copy | Company Cabinet / Billing | Optional softer demo wording for plan select buttons. |
| Object route/back manual watch | Object Pages / Regression QA | Manual visible check only unless a real product defect is reproduced. |

## Do Not Start Yet

- Do not start backend/admin implementation.
- Do not implement role profiles in current v1 UI.
- Do not implement payment flow.
- Do not edit `js/app.js` for these closure items.
- Do not reconnect disabled filter layers.

## Next Coordination Steps

1. Send `UXVIS-TAP-001` to Visual System as a plan-only P2 task.
2. Keep the final visible-browser pass as a single manual gate.
3. After owner accepts this closure state, prepare the next phase brief: backend/admin start order and allowed first slice.
