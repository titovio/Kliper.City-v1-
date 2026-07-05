# Kliper.City: зоны ответственности чатов

Цель документа - разделить проект между чатами так, чтобы они не мешали друг другу.

Фактически созданные Codex-чаты первой волны зафиксированы в `docs/THREAD_REGISTRY.md`.

## Главный принцип

Чат отвечает не за "одну страницу", а за домен. Один и тот же блок может встречаться на нескольких страницах, поэтому доменная ответственность важнее визуального расположения.

## Роли

| Чат | Зона | Разрешенные файлы по умолчанию | Что нельзя без согласования |
|---|---|---|---|
| Architect / Main | решения, структура, docs, приемка | `docs/*`, точечные проверки | менять визуал/логику сайта без задачи |
| Catalog Core | карточки, каталоги, лайки, сортировка | `js/catalog/*`, `js/data/*`, профильные CSS по задаче | `js/app.js`, фильтры бизнеса, stories |
| Filters System | все фильтры, selected tags, сброс | `js/filters/*`, `js/pages/business-filter-polish.js`, CSS фильтров | карточки, stories, профиль |
| Stories & Motion | stories, кольца, viewer, scroll, Motion | `js/behavior/story-categories.js`, `css/story-categories.css`, `js/behavior/motion-runtime.js`, motion-layer файлы | фильтры, карточки, `js/app.js` |
| Business | бизнес-помещения | `js/catalog/business-spaces.js`, `js/data/business-spaces.js`, `css/business-spaces.css` | общие фильтры без согласования |
| Profile Social | профиль, избранное, подписки, рецензии | `js/behavior/user-page-finalizer.js`, профильные CSS | каталоги и business |
| Object Pages | страницы ЖК и застройщиков | `js/pages/object/*`, объектные CSS | общую карточку и фильтры |
| Company Cabinet | будущий кабинет компании/застройщика | `docs/pages-company-cabinet.md`, будущие `js/pages/company-cabinet/*`, `css/company-cabinet.css` | публичную страницу застройщика, `js/app.js`, профиль пользователя |
| Visual System | цвета, типографика, отступы, dark theme | `css/ui-ux-pro-max.css`, профильные CSS | логика JS |
| Mobile QA | мобильная проверка | документация, CSS только по задаче | логика сайта |
| Regression QA | проверка сайта | docs/checklists, отчеты | правки без отдельной задачи |

## Общие файлы повышенного риска

| Файл | Почему рискованный |
|---|---|
| `js/app.js` | legacy/generated, держит основной каркас SPA |
| `index.html` | порядок подключений влияет на весь сайт |
| `css/ui-ux-pro-max.css` | общий слой UI-переопределений |
| `css/story-categories.css` | чувствительные слои stories |
| `js/behavior/phase1-cleanup.js` | скрывает/перестраивает навигацию v1 |
| `js/behavior/page-restore.js` | влияет на hash и восстановление страниц |
| `js/catalog/business-spaces.js` | отдельная логика бизнес-раздела |

## Когда нужен Architect / Main

1. Изменение затрагивает больше одной зоны.
2. Нужно редактировать `index.html`.
3. Нужно редактировать `js/app.js`.
4. Нужно менять правила stories при скролле.
5. Нужно менять структуру карточки.
6. Нужно удалять скрытую функцию.
7. Нужно менять v1/v2 roadmap.
8. Нужно превращать визуальный блок `Кабинет компании` в рабочую страницу.

## Формат передачи задачи в чат

Каждая задача должна идти по шаблону из `TASK_BRIEF_TEMPLATE.md`.

Если брифа нет, чат обязан сначала сформулировать его сам и работать в минимальном объеме.
