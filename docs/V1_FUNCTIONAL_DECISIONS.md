# Kliper.City v1: functional decisions

Date: 2026-07-08.

Status: working functional baseline for v1. This document turns the owner-test and current project state into implementation boundaries. It does not change code.

## Principle

v1 is a stable product showcase, not a full backend product yet.

The site must clearly show:

- developers and companies;
- new residential projects;
- completed/ready residential projects as a separate user entry;
- business spaces;
- object/developer pages;
- stories as quick content preview;
- user profile as social-layer showcase;
- company cabinet as v1 prototype route;
- B2B pricing as v1 visual/product page.

Real auth, server-side social graph, admin panel, payments, CRM, forms, offers and moderation are backend/final-v1 or v2 work.

## A. Main Shell

Decision:

- The first screen remains a working catalog, not a landing page.
- Main v1 entries are `Застр.`, `Новые`, `Готовые`, `Бизнес`.
- Stories remain a quick preview layer.
- Light and dark themes are required in v1.
- Search can stay visual/limited until data/backend are finalized.
- Lead form / request form is not part of the current v1 closure.

Functional requirements:

- load without blocking;
- switch categories;
- preserve readable light/dark states;
- open profile;
- open stories;
- expose catalog filters and view controls.

## B. Developers

Decision:

- A developer is a company card with organic signals: likes, subscriptions, reviews and object count.
- `строится` / `отстроено` dots stay as a list legend.
- Company/developer profile opens as a large page.
- Rating must be organic and not affected by paid placement.
- Data management belongs to future company cabinet/admin.

Functional requirements:

- 32 developer cards are current data baseline;
- card actions must have stable visual size and local state;
- clicking card/profile opens detail state;
- legend must be positioned near the card count;
- company page route must not break catalog return.

## C. New Residential Projects

Decision:

- The new-build catalog is a core v1 function.
- Filters: district, completion year, family, value, comfort, investment.
- Selected filters appear near the count, not as a separate large block.
- Cards open object pages.
- Likes/subscriptions/reviews are local v1 until backend.
- Grid/list/map remain v1 modes.

Functional requirements:

- count must match visible cards;
- filter apply/reset must not reintroduce old filter layers;
- empty state must be clear in light/dark;
- local actions must sync with profile where possible.

## D. Completed Residential Projects

Decision:

- `Готовые ЖК` remains a separate v1 entry.
- It should share card logic with new residential projects.
- It needs a distinct data rule for fully completed residential projects.

Current audit finding:

- `js/data/buildings.js` currently has 141 items: 19 with `status: "строится"` and 122 with `status: "уточнить"`.
- There is no clean `status: "сдан"` / `готов` / `отстроено` data layer for completed projects.
- Follow-up implemented a non-destructive readiness normalization layer in `js/data/building-readiness.js`.

Functional gap:

- The page can exist visually, but source data still needs real admin/backend readiness values before production import.

Current v1 rule:

- `Готовые ЖК` means fully completed developer projects: every house/building in the project is delivered;
- `Новостройки` means active projects/districts that can include delivered houses, remaining houses and one overall project delivery year;
- use `projectReadinessStatus` / `isCompletedResidentialProject` as the normalized frontend contract;
- explicit completed-project statuses win;
- `developer.builtJK` must not be used to decide whether a specific ЖК is completed;
- unknown objects stay `unknown` and should not be presented as definitely ready.

Owner-facing recommendation:

- keep `Готовые ЖК` in v1 navigation, but replace the fallback with real admin/backend readiness data before final production import.

## E. Business Spaces

Decision:

- Business is a separate v1 catalog.
- Filters: deal type, district, room type, area, budget.
- Business cards have their own structure.
- Grid/list/map are required.
- Empty states and reset are required.
- Future admin must edit business data.

Current data baseline:

- 6 business spaces.

Functional requirements:

- selected tag appears after business count;
- reset clears business filters without touching residential state;
- dark theme must not paint hidden/parent containers incorrectly;
- business route must not jump to developers on repeated clicks.

## F. Object Page / Residential Complex

Decision:

- Object page is required in v1.
- Tabs/sections are required, but fake functions should be restrained.
- Back button must return to the source catalog.
- `Все рецензии` should open a full list/modal when present.
- `Почему советуют` is future after backend/auth, not current v1 UI.
- Documents, plans and gallery are future admin-managed data.

Functional requirements:

- direct `#card=...` works;
- back behavior is predictable;
- gallery/plans/map blocks do not overlap on mobile;
- local like/subscribe states remain consistent.

## G. Developer / Company Page

Decision:

- Large developer/company page is required in v1.
- Objects, reviews, subscribers and publications/stories are v1/future sections.
- CTA to company cabinet remains a v1 prototype.
- Official company materials must be separable from organic user content.
- Editing belongs to company cabinet/admin later.

Functional requirements:

- company route opens from card;
- company objects are visible;
- cabinet CTA opens `#company-cabinet=developerSlug`;
- public page and cabinet must stay separate layers.

## H. User Profile

Decision:

- User profile is part of v1 as social-layer showcase.
- It may show likes, favorites, subscriptions, reviews and feed.
- Friends and chats are visual/future-state until backend/auth.
- Role profiles are not added to current v1 UI.
- CTA `Стать автором или специалистом` remains future-state.
- Privacy is backend/auth work.

Functional requirements:

- profile opens from user button;
- local likes/subscriptions/reviews are reflected where possible;
- visual-only actions should be clearly non-destructive;
- empty localStorage state must not look broken.

## I. Company Cabinet

Decision:

- Company cabinet is included in v1 as prototype route.
- Required blocks: stats, objects, documents, publications, stories, dialogs/requests, tariff.
- Real actions are blocked until backend/auth.
- Company tariffs are B2B and separate from future individual author tariff.
- Company representative is a public person role plus separate cabinet membership.
- Admin will manage companies and access later.

Current data baseline:

- 3 companies have explicit cabinet mock data; others use defaults/fallbacks.

Functional requirements:

- route `#company-cabinet=developerSlug` opens isolated cabinet;
- fallback works for companies without custom data;
- pricing CTA opens `#business-pricing=developerSlug`;
- mobile cabinet must not show underlying catalog as active content.

## J. Business Pricing

Decision:

- B2B pricing page is part of v1.
- Individual author tariff is not a real payment product in current v1.
- `Профиль автора 990 ₽/мес` stays a future hypothesis.
- Payment, subscriptions and limits are backend/auth work.
- Admin must manage tariffs later.

Current data baseline:

- 5 company plans: free, standard, business, pro, maximum.

Functional requirements:

- route `#business-pricing` opens page;
- route `#business-pricing=developerSlug` keeps context for return to cabinet;
- buttons are CTA/prototype, not real payment actions;
- mobile/dark states stay readable.

## K. Stories

Decision:

- Stories in v1 are platform/company showcase.
- Ordinary user does not publish stories/news.
- Role stories are future after backend/auth/v2.
- Current scroll behavior remains a planned feature, but must be stable.
- Future stories need source labels.
- Stories management belongs to admin/company cabinet later.

Functional requirements:

- large by default;
- compact on downward scroll;
- top upward rules remain deterministic;
- viewer opens/closes;
- old ring layers must not appear;
- wheel/touch must not block other overlays.

## L. Backend / Auth / Admin

Decision:

- Backend/auth comes after functional v1 closure.
- Admin comes after page functions and data model are approved.
- Admin must manage page data, companies, access, tariffs, stories and moderation.
- Roles: admin, moderator, company manager, editor.
- localStorage/mock data needs migration plan.
- Backend connection only after API/data contract approval.

Current status:

- API adapter skeleton exists and is disabled by default.
- Mock server contract exists.
- Backend stack decision exists.
- Real backend implementation should start only after functional gaps are accepted.

## Final v1 Functional Boundary

In v1 we finish:

- stable catalog navigation;
- developers/new/ready/business catalogs;
- filters and selected tags;
- card actions as local prototype;
- object and developer pages;
- user profile showcase;
- stories behavior;
- company cabinet prototype;
- B2B pricing page;
- light/dark/mobile acceptance.

We do not finish inside current static-only layer:

- real auth;
- real friends/chats;
- payments;
- CRM;
- lead form;
- admin panel;
- moderation;
- role profiles UI;
- true server privacy.
