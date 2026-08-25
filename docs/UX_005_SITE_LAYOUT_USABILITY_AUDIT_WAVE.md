# UX-005: site layout and usability audit wave

Дата: 2026-07-07.

Статус: задачи раздаются рабочим чатам. На этом этапе только аудит, без правок кода.

## Цель

Проверить текущий Kliper.City как пользовательский продукт:

- все ли части сайта находятся на своих местах;
- правильно ли подсвечены активные состояния;
- не налезают ли блоки друг на друга;
- нет ли скрытых старых слоев;
- нет ли horizontal overflow;
- читаются ли dark/light темы;
- не ломаются ли сценарии переходов;
- нет ли console/page errors;
- где нужны точечные правки перед следующим этапом.

## Общие правила для всех чатов

1. Не менять код.
2. Не редактировать `js/app.js`.
3. Проверять desktop, mobile и dark theme, если это относится к зоне.
4. Фиксировать только воспроизводимые дефекты.
5. Для каждого дефекта указывать:
   - priority: P0/P1/P2/V2;
   - route / страница;
   - viewport;
   - light/dark;
   - шаги воспроизведения;
   - что пользователь видит;
   - вероятные файлы;
   - риск исправления;
   - кому передать.
6. Возвращать отчет в Architect / Main, а не чинить самостоятельно.

## Базовый URL

```text
http://127.0.0.1:8765/index.html?v=ux005-audit
```

Не использовать `kliperApi=1`, если задача не связана с API adapter.

## Раздача по чатам

| ID | Чат | Фокус |
|---|---|---|
| UXQA-001 | Regression QA | общий smoke и технические ошибки |
| UXVIS-001 | Visual System | визуальная иерархия, подсветки, сетка, плотность |
| UXMOB-001 | Mobile QA | mobile 390/430, overflow, тапы, sticky/overlay |
| UXFIL-001 | Filters System | фильтры, selected tags, reset, dropdowns, старые слои |
| UXSTO-001 | Stories & Motion | stories placement, rings, viewer, scroll/open states |
| UXCAT-001 | Catalog Core | карточки, action buttons, grid/list/map, статусы |
| UXOBJ-001 | Object Pages | страницы ЖК/застройщика, modals, tabs, back |
| UXBUS-001 | Business | коммерция, бизнес-фильтры, карточки, views |
| UXPRO-001 | Profile Social | профиль пользователя, лента, избранное, рецензии |
| UXCAB-001 | Company Cabinet | кабинет компании, тарифы, CTA, dark/mobile |

## Общие технические проверки

- console errors;
- page errors;
- failed local script/css requests;
- horizontal overflow;
- visible duplicate layers;
- hidden old placeholders becoming visible;
- active button state mismatch;
- dropdown clipped by parent;
- text cropped in buttons/cards;
- cards or panels resizing layout unexpectedly;
- scroll lock stuck after modal/story;
- back/close behavior returns to expected page.

## Отчет

Каждый чат должен вернуть:

```text
Роль:
Задача:
Проверенные страницы/routes:
Viewport:
Dark/light:
P0:
P1:
P2:
V2:
Файлы-кандидаты:
Что не проверено:
Рекомендация:
```

## Приемка

Architect / Main после отчетов:

1. объединяет дубли;
2. выделяет P0/P1;
3. определяет владельца исправления;
4. запрещает одновременные правки в одних файлах;
5. заносит итог в `FIX_QUEUE.md` или отдельный patch-plan.
