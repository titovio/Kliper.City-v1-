# Kliper.City current smoke regression

Дата: 2026-07-06.

Задачи: `QA-001`, `QA-002` из `docs/CHAT_TASK_BACKLOG.md`.

Роль: Regression QA.

Код сайта не менялся. `js/app.js` не редактировался.

## Среда

| Параметр | Значение |
|---|---|
| Проект | `D:\Kliper.City (Clode)` |
| Runtime | headless Microsoft Edge через `playwright-core` из codex runtime |
| URL | `http://127.0.0.1:8788/index.html` |
| Сервер | временный read-only static server в QA-сессии |
| Desktop | `1440x900` |
| Mobile | `390x844` |

Примечание: in-app browser блокировал локальный URL на временном сервере как `ERR_BLOCKED_BY_CLIENT`, поэтому smoke выполнен через уже доступный `playwright-core` и системный Edge, без установки зависимостей.

## Итог

P0 не найдено.

Основной v1 smoke проходит: главная, застройщики, новостройки, готовые ЖК, бизнес, профиль, stories, dark toggle и mobile открываются без JS page errors. `window.Motion`, `window.KLIPER_MOTION`, `window.KLIPER_MOTION.animate` доступны.

Найдены P1/P2 по переключениям и навигации:

- P1: после `view-list` в новостройках исчезают `view-grid/view-map`, пользователь застревает в list-view.
- P1: открытие карточки как preview не добавляет корректную историю; browser Back уводит на `about:blank`.
- P2: переключение `Застройщики -> Новостройки`, `view-list`, mobile `Новостройки` и открытие карточки занимают 2.5-3.5 сек.
- P2: stories после scroll down остаются `kliper-stories-compact` даже после возврата к `scrollY=0`.

## Smoke Matrix

| Зона | Статус | Факт |
|---|---|---|
| Главная / default | OK | `32 карточки`, overflow `0` |
| Застройщики | OK | `32 карточки`, overflow `0` |
| Новостройки | OK с performance risk | `142 карточки`, переключение заняло ~3.5 сек |
| Готовые ЖК | OK | `20 карточки`, overflow `0` |
| Бизнес | OK | `6 бизнес-помещений`, overflow `0` |
| Бизнес фильтр | OK | `Тип сделки -> Аренда` дает `4 бизнес-помещений`, reset возвращает `6` |
| Бизнес grid/list/map | OK | aria-label кнопки работают, счетчик остается `6 бизнес-помещений` |
| Профиль desktop | OK | `Мария`, `Мой дом`, `Лента дома`, `Чаты`, `Друзья`, overflow `0` |
| Stories viewer | OK | открывается и закрывается, overflow `0` |
| Dark toggle | OK | body получает `kliper-dark-theme`, ошибок нет |
| Mobile | OK с performance risk | developers/newbuildings/ready/business/profile открываются, overflow `0` |
| Console/page errors | OK | page errors и console errors не найдены |
| Motion globals | OK | `Motion`, `KLIPER_MOTION`, `animate` доступны |

## P1 Defects

### P1 - Новостройки: list-view trap, нельзя вернуться в grid/map

Ответственный чат: `Catalog Core` + `Filters System`.

Связанная задача из backlog: `CAT-002`.

Страница: `index.html`, раздел `Новостройки`.

Шаги:

1. Открыть `index.html`.
2. Нажать `[data-kliper-testid="nav-newbuildings"]`.
3. Нажать `[data-kliper-testid="view-list"]`.
4. Проверить `[data-kliper-testid="view-grid"]` и `[data-kliper-testid="view-map"]`.

Факт:

- До list-view: `view-grid=1`, `view-list=1`, `view-map=1`.
- После list-view: `view-grid=0`, `view-list=0`, `view-map=0`.
- Счетчик остается `142 карточки`, но controls исчезают.

Ожидание:

- После перехода в list-view должны оставаться способы вернуться в grid/map/sort.

Риск:

- Пользователь застревает в одном режиме отображения.

### P1 - Карточка -> browser Back уводит на `about:blank`

Ответственный чат: `Object Pages` + `Catalog Core`; возможно нужен `Architect / Main`, если причина в `js/app.js` или общем `#card` route.

Связанная задача из backlog: `OBJ-001`, `ROUTE-001`.

Страница: `index.html`, раздел `Новостройки`.

Шаги:

1. Открыть `index.html`.
2. Нажать `[data-kliper-testid="nav-newbuildings"]`.
3. Открыть `ЖК Речной Порт`.
4. Нажать browser Back.

Факт:

- Открытие preview: `bodyClass` получает `kliper-card-preview-active`.
- В viewport одновременно видны preview `ЖК Речной Порт` и каталог `Новостройки`.
- Browser Back после preview уводит страницу на `about:blank`.

Ожидание:

- Back должен закрыть preview или вернуть в каталог, не покидая приложение.

Риск:

- Базовый сценарий `карточка -> назад` ломает пользовательскую навигацию.

## P2 Defects / Risks

### P2 - Медленные переключения разделов и режимов

Ответственный чат: `Catalog Core`; для stories/motion влияния - `Stories & Motion`.

Связанная задача из backlog: `QA-002`, частично `CAT-002`.

Факты:

- Desktop `nav-newbuildings`: ~3.5 сек.
- Desktop `view-list`: ~3.0 сек.
- Desktop open `ЖК Речной Порт`: ~3.2 сек.
- Mobile `nav-newbuildings`: ~2.5 сек.

Ожидание:

- Переключения должны ощущаться без подвисаний, желательно <1.5-1.8 сек на smoke-сценариях.

Риск:

- Пользователь воспринимает смену раздела/вида как лаг или зависание.

### P2 - Stories не возвращаются в expanded после scroll-to-top

Ответственный чат: `Stories & Motion`.

Связанная задача из backlog: `STO-001`.

Шаги:

1. Открыть clean `index.html`.
2. Проверить старт: `kliper-stories-expanded`.
3. `window.scrollTo(0, 700)`.
4. Вернуться `window.scrollTo(0, 0)`.

Факт:

- После scroll down: `kliper-stories-compact`.
- После возврата к `scrollY=0`: класс остается `kliper-stories-compact`.

Ожидание:

- Stories state machine должна соответствовать текущему правилу: большой режим по умолчанию и предсказуемый возврат из compact.

### P2 - Локальный logo request получает `ERR_ABORTED`

Ответственный чат: `Assets/Data Cleanup`.

Факт:

- В `requestfailed` один локальный запрос: `assets/logos/kliper-logo-site.svg`, `net::ERR_ABORTED`.
- Page errors и console errors отсутствуют.

Ожидание:

- Логотип не должен давать шум в request failures при smoke, если это не следствие reload во время теста.

Статус:

- Низкий риск; перепроверить в отдельном assets smoke, так как ошибка могла быть вызвана быстрым clean reload.

## Что отдельно проверено по QA-002

| Сценарий | Результат |
|---|---|
| Stories scroll | не зависает, но остается compact после возврата наверх |
| Stories open/close | OK, viewer открывается и закрывается |
| Бизнес фильтр | OK, open/select/reset без подвисания |
| Residential view grid/list/map | FAIL: после list-view пропадают controls grid/map/list |
| Business grid/list/map | OK через `aria-label`, счетчик стабилен |
| Карточка -> Back | FAIL: Back уводит на `about:blank` |
| Mobile переключения | OK функционально, `Новостройки` медленно |

## Остаточные риски

- Smoke выполнялся на clean browser storage. Сценарии восстановления старого `#card` state из предыдущего QA-прогона здесь не оценивались как текущий дефект.
- Полная визуальная dark theme приемка требует ручной проверки скриншотов; технически toggle и классы работают.
- Business view controls не имеют `data-kliper-testid`; для теста использовались `aria-label`.

## Рекомендованные следующие задачи

1. `Catalog Core / CAT-002`: починить list-view trap и добавить smoke на возврат из list в grid/map.
2. `Object Pages / OBJ-001`: определить корректный сценарий preview/back и закрытия object layer.
3. `Stories & Motion / STO-001`: стабилизировать state machine `expanded/compact`.
4. `Catalog Core`: профилировать тяжелое переключение `Новостройки` и открытие карточки.
5. `Assets/Data Cleanup`: перепроверить `kliper-logo-site.svg` request abort на обычной загрузке без quick reload.
