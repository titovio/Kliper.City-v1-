# Kliper.City: Motion rules

Motion подключен локально как цельный global-файл:

```text
js/vendor/motion.global.js
js/behavior/motion-runtime.js
```

После загрузки доступны:

```js
window.Motion
window.KLIPER_MOTION
window.KLIPER_MOTION.animate
window.KLIPER_MOTION.scroll
window.KLIPER_MOTION.inView
```

## Цель Motion

Не "анимировать все", а убрать дергания и сделать интерфейс спокойнее:

- раскрытие фильтров;
- появление selected tags;
- stories viewer;
- плавное состояние карточек;
- аккуратные hover/press;
- scroll-linked эффекты только там, где они не тормозят.

## Запрещено без отдельного решения

1. Массово анимировать все карточки каталога при каждом фильтре.
2. Анимировать `width`, `height`, `top`, `left` без необходимости.
3. Запускать несколько анимаций на один элемент без отмены предыдущей.
4. Добавлять бесконечные анимации на большом количестве элементов.
5. Делать motion-правки внутри `js/app.js`.
6. Игнорировать `prefers-reduced-motion`.

## Разрешенные свойства

Предпочтительно:

- `opacity`;
- `transform`;
- `scale`;
- `x`;
- `y`;
- `filter` осторожно и точечно.

## Базовые параметры

```js
const KLIPER_MOTION_PRESETS = {
  fast: { duration: 0.16, easing: [0.22, 1, 0.36, 1] },
  panel: { duration: 0.24, easing: [0.22, 1, 0.36, 1] },
  soft: { duration: 0.32, easing: [0.22, 1, 0.36, 1] }
};
```

## Правило отмены

Перед новой анимацией элемента нужно отменять старую.

Рекомендуемый паттерн:

```js
var activeAnimations = new WeakMap();

function animateOnce(element, keyframes, options) {
  var previous = activeAnimations.get(element);
  if (previous && previous.cancel) previous.cancel();

  var animation = window.KLIPER_MOTION.animate(element, keyframes, options);
  activeAnimations.set(element, animation);

  animation.finished.finally(function () {
    if (activeAnimations.get(element) === animation) {
      activeAnimations.delete(element);
    }
  });

  return animation;
}
```

## Где начинать

Первый безопасный участок для Motion:

1. selected tags;
2. dropdown фильтра;
3. открытие stories viewer.

Не начинать с:

- всего каталога;
- всей страницы профиля;
- всей mobile-навигации.

## Проверка после Motion-правки

- нет зависаний при быстром клике;
- нет наложения анимаций;
- нет ошибки в консоли;
- mobile не дергается;
- dark theme не теряет контраст;
- `prefers-reduced-motion` учитывается.

