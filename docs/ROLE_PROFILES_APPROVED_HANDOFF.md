# ROLE-PROFILES approved handoff

Дата: 2026-07-08.

Статус: handoff после утверждения владельцем 7 решений по role profiles. Это не разрешение на реализацию UI/backend. Код, CSS, JS, HTML и `js/app.js` не менялись.

## 1. Утверждено владельцем

1. Role profiles не добавляются в текущий v1 UI.
2. CTA: `Стать автором или специалистом`.
3. Тариф физлица: `Профиль автора`, гипотеза `990 ₽ / мес`.
4. `Представитель компании`: публичная роль физлица + отдельный доступ к кабинету компании через company membership.
5. Privacy: личные действия private by default, публичны только агрегаты и явно опубликованные рецензии.
6. Favorite tags: на старте стандартные теги, custom tags позже после moderation.
7. Блок `Почему советуют`: 3 рецензии, материалы компании и партнеров отдельно от organic top.

## 2. Главный порядок после утверждения

1. Backend/Auth обновляет future contracts/specs, но не пишет backend-код.
2. Профильные чаты синхронизируют свои specs под approved decisions.
3. QA/Mobile QA обновляют future acceptance gates.
4. Никакой UI-патч по role profiles не запускается без отдельного implementation brief.

## 3. Раздача задач

| ID | Чат | Цель |
|---|---|---|
| `AUTH-014` | Backend/Auth | Синхронизировать approved role decisions с auth/storage/contracts roadmap |
| `ROLE-PRO-004` | Profile Social | Финализировать approved profile CTA/privacy spec |
| `ROLE-CAT-003` | Catalog Core | Финализировать approved favorite-tag aggregate spec |
| `ROLE-OBJ-003` | Object Pages | Финализировать approved `Почему советуют` spec |
| `ROLE-VIS-003` | Visual System | Финализировать approved role/trust token plan |
| `ROLE-STO-003` | Stories & Motion | Финализировать approved story source/label rules |
| `CAB-ROLE-002` | Company Cabinet | Финализировать approved company representative boundary |
| `ROLE-QA-003` | Regression QA | Обновить future acceptance gates по approved decisions |
| `ROLE-MOB-003` | Mobile QA | Обновить mobile future gates по approved decisions |
| `PRODUCT-003` | Product / UX Lab | Обновить v1/v2 roadmap и owner-facing summary |

## 4. Ограничения для всех чатов

- Не менять сайт.
- Не менять CSS/JS/HTML.
- Не редактировать `js/app.js`.
- Не создавать backend-код.
- Не включать оплату, auth или role-profile UI.
- Вернуть отчет: что синхронизировано, какие документы изменены, какие блокеры остались.

## 5. Блокеры перед реализацией

До реализации остаются открытыми:

- точные trust/commercial label тексты;
- grace/basic/inactive сроки после неоплаты;
- backend/auth implementation start;
- moderation rules для custom tags и role stories;
- отдельный implementation brief для любого UI/backend изменения.
