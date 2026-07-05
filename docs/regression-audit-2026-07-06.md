# Kliper.City regression audit

Дата проверки: 2026-07-06.

Роль: Regression QA.

Область: текущая версия `index.html`, desktop `1440x900`, mobile `390x844`, dark theme, разделы каталога, профиль, карточки, фильтры, stories, бизнес, console/network, horizontal overflow.

## Итог

P0 не найдено.

Сайт загружается, основные разделы каталога переключаются, бизнес-фильтр `Тип сделки -> Аренда` работает, сброс бизнес-фильтра возвращает выдачу. Горизонтальный overflow в проверенных состояниях: `0`.

Главные регрессии: состояние маршрута после профиля/объекта загрязняет следующие переходы, object-view визуально остается вместе с каталогом, list-view в новостройках меняет счетчик с `142` на `143`, Motion-глобалы не появились в текущем прогоне.

## Среда

| Параметр | Значение |
|---|---|
| URL | `http://127.0.0.1:8765/index.html` |
| Desktop | `1440x900` |
| Mobile | `390x844` |
| Browser | in-app browser / Playwright API |
| Сборка | не запускалась, в корне нет `package.json` |
| Код | UI/JS/CSS не менялись |

## Smoke

| Проверка | Результат |
|---|---|
| `index.html` открывается | OK |
| `#root` найден | OK |
| Desktop horizontal overflow | OK, `0` |
| Mobile profile horizontal overflow | OK, `0` |
| Console errors/warnings на первичной загрузке | не найдено |
| `window.Motion` | FAIL, `false` |
| `window.KLIPER_MOTION` | FAIL, `false` |

## Основные разделы

Проверено через `data-kliper-testid`.

| Раздел | Результат |
|---|---|
| `nav-developers` | OK, `32 карточки` |
| `nav-newbuildings` | OK, `142 карточки` |
| `nav-ready` | OK, `20 карточки` |
| `nav-business` | OK, `6 бизнес-помещений` |

## Дефекты

### P1 - Object-view не очищает каталог и блокирует переход в профиль

Страница: `index.html`, раздел `Новостройки`.

Шаги:

1. Открыть `http://127.0.0.1:8765/index.html`.
2. Нажать `[data-kliper-testid="nav-newbuildings"]`.
3. Открыть карточку `ЖК Речной Порт`.
4. Проверить viewport.
5. Нажать `[data-kliper-testid="nav-profile"]`.

Факт:

- объект `ЖК Речной Порт` открывается в правой части viewport;
- одновременно слева остаются видимые `Новостройки` и карточки каталога;
- после клика по профилю viewport остается на object/catalog layer, профильные разделы `Мой дом`, `Лента дома`, `Чаты`, `Друзья` не появляются.

Ожидание:

- object-view должен быть отдельным согласованным состоянием страницы или явно оформленным quick-view;
- переход в профиль должен очищать object/catalog state.

Зона ответственности: Visual System / Object Page / Profile routing.

### P1 - После открытия профиля прямой переход на `index.html` восстанавливает `#card=Мария`

Страница: `index.html`, профиль.

Шаги:

1. Открыть профиль через `[data-kliper-testid="nav-profile"]`.
2. Перейти на `http://127.0.0.1:8765/index.html` или открыть новую вкладку с этим URL.
3. Проверить URL и видимые заголовки.

Факт:

- URL возвращается к `index.html#card=Мария`;
- виден профиль `Мария`, а не стартовый каталог;
- на mobile из-за этого отсутствуют видимые `nav-developers/nav-business`, есть только `nav-profile`.

Ожидание:

- прямой URL `index.html` должен открывать стартовое состояние каталога;
- восстановление профиля не должно блокировать mobile regression навигации.

Зона ответственности: Profile / Hash Router / Page Restore.

### P1 - `Новостройки`: list-view меняет счетчик результатов

Страница: `index.html`, раздел `Новостройки`.

Шаги:

1. Нажать `[data-kliper-testid="nav-newbuildings"]`.
2. Зафиксировать счетчик: `142 карточки`.
3. Нажать `[data-kliper-testid="view-list"]`.
4. Зафиксировать счетчик.
5. Вернуться на `[data-kliper-testid="view-grid"]`.

Факт:

- grid-view: `142 карточки`;
- list-view: `143 карточки`;
- возврат в grid-view снова показывает `142 карточки`.

Ожидание:

- переключение вида не должно менять набор данных и счетчик.

Зона ответственности: Filters System / Catalog view state.

### P2 - Stories compact не возвращается в expanded после scroll-to-top

Страница: профиль / stories layer.

Шаги:

1. Открыть профиль `Мария`.
2. Проскроллить вниз.
3. Вернуться наверх.
4. Проверить `body.className`.

Факт:

- после скролла вниз появляется `kliper-stories-compact`;
- после возврата к `scrollY=0` класс остается `kliper-stories-compact`.

Ожидание:

- по текущему regression checklist stories должны возвращаться в большой режим согласно правилу текущей версии.

Зона ответственности: Stories & Motion.

### P2 - Motion runtime не выставляет ожидаемые глобалы

Страница: `index.html`.

Шаги:

1. Открыть `http://127.0.0.1:8765/index.html`.
2. Проверить `window.Motion`.
3. Проверить `window.KLIPER_MOTION`.

Факт:

- `motion.global.js` и `motion-runtime.js` есть в списке подключенных scripts;
- console errors не найдено;
- `window.Motion === false`;
- `window.KLIPER_MOTION === false`.

Ожидание:

- `window.Motion` и `window.KLIPER_MOTION` доступны, как указано в regression checklist и baseline.

Зона ответственности: Stories & Motion.

### P2 - Dark theme: профильная кнопка сохраняет светлые utility-классы

Страница: header во всех проверенных разделах.

Шаги:

1. Открыть сайт в dark theme.
2. Проверить `[data-kliper-testid="nav-profile"]`.

Факт:

- видимый профильный button имеет классы `bg-white`, `text...`, `ring-slate-100`;
- явного console/runtime дефекта нет, но это риск контраста и визуальной консистентности dark theme.

Ожидание:

- dark theme header controls должны использовать согласованные dark tokens.

Зона ответственности: Visual System.

## Что работает

- Desktop-разделы `Застройщики`, `Новостройки`, `Готовые ЖК`, `Для бизнеса` переключаются.
- Бизнес-фильтр `Тип сделки -> Аренда` уменьшает выдачу с `6 бизнес-помещений` до `4 бизнес-помещений`.
- Selected tag для бизнес-фильтра появляется.
- `Сбросить` в бизнес-фильтре возвращает `6 бизнес-помещений`.
- Stories viewer открывается по story `Новое`.
- Stories viewer закрывается кнопкой `×`.
- Профиль открывается из чистого catalog state.
- Горизонтальный overflow в проверенных состояниях: `0`.

## Технические проверки

Команда: `node --check` по отдельным файлам, без `npm install`, без `npm build`.

OK:

- `js/behavior/test-selectors.js`
- `js/behavior/story-categories.js`
- `js/behavior/story-rings-polish.js`
- `js/behavior/motion-runtime.js`
- `js/behavior/dark-theme-toggle.js`
- `js/behavior/user-page-finalizer.js`
- `js/catalog/business-spaces.js`
- `js/pages/business-filter-polish.js`
- `js/filters/selected-filter-inline.js`
- `js/filters/feed-mobile-filters.js`
- `tests/catalog-filter-crash.test.cjs`
- `tests/my-yard-page.test.cjs`

## Ограничения проверки

- Из-за P1 route-state дефекта полноценная чистая mobile-навигация по каталогу не была завершена: mobile открывался в `#card=Мария`.
- Browser DOM snapshot API в текущей среде падал, поэтому аудит опирался на targeted DOM metrics, locators, console logs и видимые координаты элементов.
- Network failures внешних изображений не углублялись в этом прогоне, так как при первичной загрузке console errors/warnings не появились.

## Задачи для следующих чатов

### Assets/Data Cleanup

- Проверить внешние image/logo dependencies из baseline: Clearbit/Unsplash.
- Подготовить локальные fallback assets или стратегию отключения нестабильных внешних запросов.
- Проверить, не влияет ли отсутствие внешних ассетов на высоту/карточки/list-view.

### Filters System

- Разобрать расхождение `Новостройки`: `142` в grid-view против `143` в list-view.
- Проверить, не добавляется ли дубликат/скрытый элемент при смене view mode.
- Добавить smoke для `view-grid/view-list/view-map`, где счетчик не меняется от режима отображения.

### Visual System

- Разобрать object-view: каталог и объект одновременно видимы в viewport.
- Проверить header/profile button dark theme tokens.
- Проверить профиль после object-view и business-view на очистку слоев.

### Stories & Motion

- Восстановить/проверить `window.Motion` и `window.KLIPER_MOTION`.
- Проверить правило возврата stories из compact в expanded при `scrollY=0`.
- Добавить smoke на open/close stories viewer без сохранения чужого route state.
