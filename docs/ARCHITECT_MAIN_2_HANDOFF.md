# Kliper.City: Architect / Main 2 Handoff

Date: 2026-07-09.

Purpose: transfer coordination from the overloaded original Architect / Main chat to a clean Architect / Main 2 chat.

## Project Path

Use the existing project path:

```text
D:\Kliper.City (Clode)
```

Do not migrate the project folder unless the owner explicitly restarts that decision.

## Mandatory Rules

1. Read `AGENTS.md` before changing files.
2. Do not edit `js/app.js` for ordinary UI, CSS, data or targeted interface work. Treat it as legacy/generated.
3. Use minimal changes and do not refactor neighboring zones.
4. Do not reconnect disabled legacy layers unless Architect / Main 2 explicitly decides it.
5. No root `npm build`: the project has no root `package.json`. Use `node --check` for changed JS files.
6. Browser/live checks must run one at a time. Parallel docs/code analysis is allowed, but multiple live browser QA threads caused conflicts.
7. Significant decisions must be written to `docs/CHANGE_LOG.md`, `docs/PROJECT_DECISIONS.md`, or a focused report in `docs/`.

## Current Main Role

Architect / Main 2 is now the coordinating chat.

Responsibilities:

- accept owner requests;
- decide which profile chat should own each task;
- create clear task briefs;
- receive reports from profile chats;
- approve or reject patches;
- keep documentation and project decisions synchronized;
- avoid doing every profile task inside the main chat.

The original Architect / Main chat should be treated as an archive/context source, not the default executor.

## Working Documents

Start with:

- `docs/PROJECT_INDEX.md`;
- `docs/THREAD_REGISTRY.md`;
- `docs/CHAT_TASK_BACKLOG.md`;
- `docs/REPORT_INTAKE_PROTOCOL.md`;
- `docs/V1_FUNCTIONAL_DECISIONS.md`;
- `docs/V1_PAGE_COMPLETION_MATRIX.md`;
- `docs/FUNC_001_WORKSTREAM_REPORT_INTAKE.md`;
- `docs/DATA_STRUCTURE.md`;
- `docs/CHANGE_LOG.md`.

## Active Product Decisions

### Residential Catalog Semantics

- `Готовые ЖК` means fully completed developer projects: all houses/buildings in the project are delivered.
- `Новостройки` means active/under-construction projects or districts. Such projects can have already delivered houses, remaining houses and one overall project delivery year.
- `developer.builtJK` is a developer-card aggregate and must not decide readiness of a specific ЖК/project.
- `status: "уточнить"` remains `unknown`, not ready.
- Current frontend readiness summary from local data: `completed: 0`, `active: 19`, `unknown: 122`.

Relevant files:

- `js/data/building-readiness.js`;
- `js/catalog/building-cards.js`;
- `docs/DATA_STRUCTURE.md`;
- `docs/FUNC_001_WORKSTREAM_REPORT_INTAKE.md`.

### Current Filter Copy Task

`FILTERS-COPY-001` has been sent to Filters System thread:

```text
019f345b-f5d3-78c3-af1e-33da1b8dea52
```

Task: find the active layer that renders the residential year/status filter label and make copy context-aware without editing `js/app.js` and without reconnecting disabled filter layers.

Recommended semantics:

- for `Новостройки`: `Срок проекта` or `Срок сдачи проекта`;
- for `Готовые ЖК`: `Год сдачи` or `Год сдачи ЖК`.

Important: `js/filters/newbuild-fast-filters.js` is disconnected. Do not reconnect it. It was touched and then restored by the original Architect / Main chat.

### V1 Before Backend/Admin

Owner direction:

- first audit and finish v1 functions and visual logic;
- then do auth/backend/admin cabinet;
- backend/auth contracts are documented, but full backend/admin implementation comes later.

## Profile Threads

Core threads:

- Regression QA: `019f345b-1bb7-77f1-9e03-3befa5fb2330`;
- Assets/Data Cleanup: `019f345b-94bb-72a3-860b-48c540c0dfa4`;
- Filters System: `019f345b-f5d3-78c3-af1e-33da1b8dea52`;
- Visual System: `019f345c-4f7f-7fc1-9f23-d5bc823aa36b`;
- Stories & Motion: `019f345c-c40a-7411-915f-46b39b641cac`;
- Object Pages: `019f34e5-4692-7311-8406-a76a0e421a85`;
- Catalog Core: `019f34e5-8bc6-7b90-aad9-37a196dc13cc`;
- Business: `019f34e5-d196-7e63-81e7-297c69bce95d`;
- Profile Social: `019f34e6-2191-7541-8b80-a274fc63a417`;
- Company Cabinet: `019f34e6-78a5-7910-a7af-d1c5ee6a0241`;
- Mobile QA: `019f34e6-c5f1-7682-8fbb-ff5ad174e196`;
- Backend/Auth: `019f3961-80cd-72e3-b9d9-ed298036cbf9`;
- Product / UX Lab: `019f397a-2161-76a1-af2f-3e366a6c81f1`.

## Coordination Rule

For every new owner request:

1. Decide whether Architect / Main 2 should answer directly, document, or route to a profile chat.
2. If routed, send one narrow task to one profile chat first.
3. Do not run several live browser checks at once.
4. Accept the profile report before merging broad changes.
5. If the task is a tiny text/code fix inside an already identified file, Architect / Main 2 may do it directly, but must still avoid scope creep.

## Current Risk Areas

- Filter layers: old hidden layers can reappear if the wrong module is reconnected.
- Stories: rings/state machine and scroll rules are sensitive.
- Motion: avoid stacked animations and layout-affecting transitions.
- Object/profile routes: `#card=...` is shared and can create stale state.
- Mobile: tap targets and selected tags remain watch items.
- Browser automation: long mixed Playwright/browser scenarios can hang; use small isolated checks.

## Immediate Next Steps

1. Wait for or request report from Filters System for `FILTERS-COPY-001`.
2. Continue v1 functional audit in profile order, one live QA owner at a time.
3. Keep backend/admin as planned future work until v1 function/visual audit is accepted.
4. Use Product / UX Lab for hypotheses and page-improvement strategy, not technical patches.
