# Stories & Motion audit

Дата: 2026-07-06.

Задача: первый проход без реализации. Проверены текущие stories/motion-слои, возможные наложения анимаций, старые слои колец, лишние observers/listeners и конфликты скролла.

## Прочитанные правила

- `AGENTS.md`
- `docs/PROJECT_INDEX.md`
- `docs/MOTION_RULES.md`
- `docs/UI_AND_CHANGE_RULES.md`
- `docs/REGRESSION_CHECKLIST.md`
- `docs/TEST_INFRASTRUCTURE.md`

Ключевые ограничения для будущей правки:

- не редактировать `js/app.js`;
- не подключать новые библиотеки;
- Motion использовать только через `window.KLIPER_MOTION`;
- не менять внешний вид колец без отдельного запроса;
- править минимально и проверять stories в большом/малом режиме, viewer, mobile, dark theme и консоль.

## Карта файлов

| Файл | Роль | Статус для задачи |
|---|---|---|
| `index.html` | Порядок подключения CSS/JS | Читать осторожно. Не менять без необходимости. |
| `css/stories-polish.css` | Старый слой увеличения story-кружков по tailwind-классам | Конфликтный CSS-слой размеров. |
| `css/story-categories.css` | Основной CSS category stories, колец, big/compact, viewer | Главная CSS-зона риска. |
| `js/behavior/story-categories.js` | Основная логика category stories, scroll/wheel/touch, viewer | Главная JS-зона будущей правки. |
| `js/behavior/story-rings-polish.js` | Пересборка SVG-колец на сегменты | Риск старых/дублирующихся слоев колец. |
| `js/behavior/motion-runtime.js` | Экспорт `window.KLIPER_MOTION` из локального Motion | Работает как runtime-слой, но stories его пока не используют. |
| `js/vendor/motion.global.js` | Локальная Motion-библиотека | Не редактировать. |
| `js/behavior/test-selectors.js` | Стабильные тестовые селекторы, исключает story-кружки из nav | Смежный scroll listener, но не меняет stories. |
| `js/data/stories.js` | Legacy `window.KLIPER_STORIES` | Не используется текущим `story-categories.js`. |

## Подключение

В `index.html`:

- `css/stories-polish.css` подключен перед `css/story-categories.css`;
- `js/vendor/motion.global.js` подключен перед `js/behavior/motion-runtime.js`;
- `js/behavior/story-categories.js` подключен перед `js/behavior/story-rings-polish.js`;
- `js/app.js` подключен раньше motion/stories-слоев, но по правилам проекта его не редактируем.

## Текущее поведение в коде

`js/behavior/story-categories.js` уже содержит почти всю целевую механику:

- начальное состояние `storyExpanded = true`;
- `setStoryProgressStyles()` пишет CSS-переменные размера и позиции stories;
- `updateStoryViewportMode()` ставит `body.kliper-stories-expanded` или `body.kliper-stories-compact`;
- скролл вниз схлопывает stories;
- верх страницы в compact-режиме сначала "вооружает" раскрытие через `storyTopRevealTimer`;
- следующий upward-intent раскрывает stories;
- если stories уже большие и пользователь колесит вверх на верхней точке, `storyTopOpenDelta` открывает viewer;
- в открытом viewer колесо листает вперед/назад через `nextSlide()` и `prevSlide()`.

Важно: это реализовано без `window.KLIPER_MOTION`. Сейчас motion-эффект больших/малых stories делается через CSS transitions и CSS-переменные.

## Найденные риски

### 1. Наложение CSS transitions и будущего Motion

В `css/story-categories.css` на desktop есть transitions для:

- `header`, `header > div`;
- `[data-kliper-category-stories]`;
- `.kliper-category-story-host`;
- `.kliper-category-story-host__ring`;
- image внутри кольца.

JS при этом меняет CSS-переменные мгновенно через `requestAnimationFrame`, а CSS сам анимирует `width`, `height`, `padding`, `transform`, `gap`, `font-size`.

Риск: если добавить `window.KLIPER_MOTION.animate()` поверх этих же элементов/свойств без изоляции, появится двойная анимация и дергание. Особенно чувствительны `transform` на rail и host/ring.

### 2. Размеры сейчас анимируются через layout-свойства

Текущий слой меняет:

- `--kliper-story-ring-size` -> `width/height`;
- `--kliper-story-ring-padding` -> `padding`;
- `--kliper-story-min-width`;
- `--kliper-story-gap`;
- `--kliper-story-label-size`.

Это уже работает, но потенциально дороже, чем transform-only. По `MOTION_RULES.md` не стоит добавлять новые анимации `width/height` без необходимости. Для текущей задачи лучше сохранить текущий визуал и не переносить размер колец на Motion на первом этапе.

### 3. Старые слои колец

Есть два слоя колец:

- CSS fallback `.kliper-category-story-host__ring::before`;
- SVG-сегменты, которые создает `js/behavior/story-rings-polish.js`.

CSS fallback сейчас принудительно выключен через `content: none` и дополнительно гасится, когда SVG помечен `data-kliper-story-polish`. `story-rings-polish.js` удаляет все `circle` внутри SVG и заново добавляет base + segment circles.

Риски:

- короткая рябь возможна при первичном render/polish, пока SVG еще не помечен ready;
- `MutationObserver` в `story-rings-polish.js` реагирует на childList по всему documentElement, а сам polish мутирует SVG, поэтому есть повторный schedule;
- логика идемпотентная через `data-kliper-story-polish`, но при rerender legacy-шапки пересборка колец повторится.

Вывод: не менять внешний вид колец в задаче scroll-rule. Если понадобится трогать кольца, сначала отделить это в отдельную задачу.

### 4. Observers и timers

В `story-categories.js`:

- `MutationObserver(schedule)` на `document.body` с `subtree: true`;
- `schedule()` с debounce 40ms;
- `storyScrollSettleTimer` 140ms после scroll;
- `storyTopRevealTimer` 170ms для первого/второго upward-intent.

В `story-rings-polish.js`:

- `MutationObserver(schedule)` на `document.documentElement`;
- retry interval 24 раза по 150ms после старта/load.

Риск умеренный: viewer render/remove тоже меняет DOM и будит observers. Сейчас это не выглядит как бесконечный цикл, но при добавлении Motion/extra DOM-слоев лучше не добавлять третий observer.

### 5. Глобальный wheel listener

`story-categories.js` ставит `window.addEventListener('wheel', handleStoryWheel, { passive: false })`.

Поведение:

- при открытом viewer всегда `preventDefault()` и листание slides;
- на верхней точке страницы при wheel up тоже `preventDefault()`;
- при больших stories на верхней точке накопление delta открывает viewer.

Риски:

- wheel listener глобальный, не привязан к header/story area;
- на верхней точке может перехватывать upward wheel над любым элементом страницы;
- если позже появятся другие overlay/modal со своим wheel, нужен guard, чтобы stories не перехватывали их.

Это главный участок для аккуратной правки правила "первый/второй скролл вверх".

### 6. Touch-логика не симметрична wheel

`touchstart/touchmove` passive, без `preventDefault()`. Touch only:

- свайп вверх схлопывает;
- свайп вниз пытается раскрыть на top.

Открытие viewer свайпом вверх на больших stories не реализовано. Владелец зафиксировал wheel-сценарий, поэтому это не blocker, но mobile regression нужно проверять отдельно.

### 7. Viewer пересоздается целиком

`renderViewer()` удаляет `.kliper-story-viewer` и создает новый DOM при каждом слайде/категории.

Риск для Motion: если анимировать viewer/card через Motion, exit-анимации будут обрываться remove/append. Для первого этапа лучше не добавлять enter/exit Motion. Если Motion понадобится позже, сначала сделать tiny wrapper `animateOnce()` с отменой и анимировать только появление текущего DOM после append.

### 8. `prefers-reduced-motion`

В проверенных stories-файлах не найдено явного `prefers-reduced-motion`/`matchMedia` для stories. Для текущих CSS transitions это уже технический долг. При любой новой Motion-анимации нужно добавить guard.

## Конфликты, которые не подтвердились

- В JS-модулях вне `js/app.js` только `story-categories.js` слушает `wheel/touchmove` для stories.
- `test-selectors.js` слушает scroll, но только для маркировки тестовых селекторов.
- Прямых вызовов `window.KLIPER_MOTION.animate()` в stories сейчас нет, поэтому текущих Motion-overlap анимаций нет.
- `js/data/stories.js` не связан с текущими category stories.

## План реализации правила номер один

### Шаг 0. Baseline без правок

Проверить в браузере:

- desktop: default big stories;
- scroll down -> compact;
- scroll up to top first time -> compact;
- second upward intent at top -> big;
- big + upward wheel at top -> viewer;
- viewer wheel down/up -> next/prev slide;
- close viewer;
- console без ошибок.

Rollback: не нужен, правок нет.

### Шаг 1. Зафиксировать state machine в `story-categories.js`

Минимально привести текущие переменные к явным состояниям:

- `expanded`;
- `compactAtTopArmed`/`topRevealReady`;
- `viewerOpen`;
- wheel locks.

Не менять CSS и внешний вид. Не подключать Motion.

Rollback-точка: откатить только `js/behavior/story-categories.js`.

### Шаг 2. Уточнить правило первого/второго upward-intent

Сделать поведение не зависящим от случайной серии scroll/timer-событий:

- первый приход к top в compact-режиме только ставит "готов к раскрытию";
- следующий отдельный wheel-up/touch-down intent на top раскрывает big;
- при уходе ниже top флаг сбрасывается.

Сохранить текущие thresholds, если визуально они нормальные.

Rollback-точка: откатить только `js/behavior/story-categories.js`.

### Шаг 3. Укрепить wheel guards

Добавить guards без изменения дизайна:

- если открыт `.kliper-story-viewer`, wheel работает только на viewer-сценарий;
- если открыт другой явный overlay/modal, stories не должны открываться колесом;
- не добавлять новых глобальных listeners.

Rollback-точка: откатить только `js/behavior/story-categories.js`.

### Шаг 4. Reduced motion

Добавить минимальный `prefers-reduced-motion` слой:

- отключить/сократить transitions для stories;
- если в будущем появится Motion, не запускать его при reduced motion.

Rollback-точка: откатить CSS-правку в `css/story-categories.css` и JS guard, если он появится.

### Шаг 5. Motion только при отдельной необходимости

Если после стабилизации нужно оживить viewer:

- использовать только `window.KLIPER_MOTION`;
- добавить локальный `WeakMap` и `animateOnce()`;
- анимировать только `opacity/transform`;
- перед новой анимацией отменять предыдущую;
- не анимировать кольца и размеры stories.

Rollback-точка: удалить только новый Motion-helper/вызовы в `js/behavior/story-categories.js`.

### Шаг 6. Regression

После значимой правки:

- `node --check js/behavior/story-categories.js`;
- desktop и mobile 390px;
- light/dark theme;
- stories big/compact/viewer;
- viewer wheel next/prev;
- horizontal overflow;
- консоль.

## Рекомендация

Первую реализацию делать без Motion и без изменения CSS-колец: задача владельца прежде всего про state machine и wheel routing. Motion можно добавить позже только на viewer entrance, когда scroll-правило будет стабильно.
