# VIS-003: visual acceptance after Company Cabinet v1

Date: 2026-07-06.

Scope: visual/system acceptance after regression and mobile checks.

## Result

Status: **accepted for v1 QA**, with follow-up polish recommended after owner review.

## Checked Signals

| Area | Result |
|---|---|
| Catalog density | OK, desktop counts and controls stable |
| Residential list/grid | OK after counter sync fix |
| Business count row | OK, `6 бизнес-помещений` remains stable |
| Company cabinet desktop | OK, 7 stats and 8 panels fit without overflow |
| Company cabinet mobile | OK, 390/430 without overflow |
| Dark theme | OK in checked local state, no console errors |
| Public developer page | OK, `Открыть кабинет` CTA appears and route opens |

## Recommended Visual Follow-ups

These are not blockers for v1 smoke:

- Owner visual review of the cabinet hero density and panel hierarchy.
- Decide whether v1 cabinet should hide some future-only blocks, such as offers/documents, until backend/auth.
- Later normalize Russian plural text for counts if the project decides to move away from existing `карточки` wording everywhere.
- Continue stories-ring visual audit separately under `STO-002` if pixel-level ring artifacts are still visible.

## Constraint

No JS visual logic was changed for this visual acceptance pass, except the residential counter sync fix found during QA.
