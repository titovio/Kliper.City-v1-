# Kliper.City: очередь исправлений

Дата создания: 2026-07-06.

Очередь формируется Architect / Main после приемки отчетов рабочих чатов.

## Статусы

| Статус | Значение |
|---|---|
| `candidate` | найдено в аудите, ждет подтверждения |
| `approved` | можно отдавать в работу |
| `in_progress` | отдано рабочему чату |
| `done` | исправлено и проверено |
| `blocked` | нужен владелец или внешний ресурс |

## Assets/Data Cleanup

Источник: `ASSETS_DATA_AUDIT.md`.

| ID | Приоритет | Статус | Задача | Разрешенные файлы | Запрещено |
|---|---|---|---|---|---|
| A-001 | P1 | candidate | Перевести stories на локальные developer covers вместо Unsplash/CDN | `js/data/stories.js`, при необходимости малый data-helper | `js/app.js`, визуальная смена stories |
| A-002 | P1 | candidate | Убрать Google favicons из avatars застройщиков через локальный/text fallback | `js/data/developers.js` или отдельный малый data-модуль | `js/app.js`, удаление карточек/аватаров |
| A-003 | P2 | candidate | Заменить `FALLBACK_IMAGES` ЖК на локальные fallback-обложки | `js/catalog/building-cards.js` | массовая правка `js/data/buildings.js` |
| A-004 | P2 | candidate | Подготовить план локализации бизнес-галерей | `js/data/business-spaces.js`, будущие local assets | менять композицию карточек |
| A-005 | blocked | blocked | Убрать Clearbit-запросы без правки legacy | отдельный interceptor-модуль только после решения | `js/app.js` без отдельного решения |

## Что ждем перед запуском

Перед переводом задач из `candidate` в `approved` нужно принять:

1. `Regression QA` - чтобы убедиться, что нет P0 выше ресурсного шума.
2. `Filters System` - чтобы не трогать business/data в момент фильтровых конфликтов.
3. `Visual System` - если задача может изменить вид первого экрана/stories.

## Первое рекомендуемое исправление

Если Regression QA не найдет P0, первым безопасным исправлением выбрать `A-001`: заменить внешние stories-изображения локальными обложками застройщиков.

Причина:

- stories на первом экране;
- локальные developer covers уже есть;
- можно сделать без `js/app.js`;
- низкий риск логики, если сохранить структуру данных.

## Stories & Motion

Источник: `STORIES_MOTION_AUDIT.md`.

| ID | Приоритет | Статус | Задача | Разрешенные файлы | Запрещено |
|---|---|---|---|---|---|
| S-001 | P1 | candidate | Провести baseline-проверку текущего правила stories без правок | только отчет/чеклист | менять JS/CSS |
| S-002 | P1 | candidate | Зафиксировать state machine stories без изменения визуала | `js/behavior/story-categories.js` | Motion, кольца, `js/app.js` |
| S-003 | P1 | candidate | Уточнить первый/второй upward-intent на top | `js/behavior/story-categories.js` | новые global listeners |
| S-004 | P1 | candidate | Добавить guards для wheel, чтобы stories не перехватывали чужие overlay/modal | `js/behavior/story-categories.js` | изменение viewer-дизайна |
| S-005 | P2 | candidate | Добавить reduced-motion слой для stories | `css/story-categories.css`, возможно JS guard | менять размеры/кольца |
| S-006 | P2 | candidate | Motion только для viewer entrance после стабилизации scroll-правила | `js/behavior/story-categories.js` | анимировать width/height/кольца |

## Решение по stories

Первую реализацию задачи номер один делать **без Motion** и **без изменения CSS-колец**.

Причина:

- текущая логика уже частично реализована;
- Motion-overlap сейчас не подтвержден;
- основной риск в state machine и глобальном `wheel` listener;
- два слоя колец лучше не трогать в этой задаче.
