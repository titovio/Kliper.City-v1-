# Kliper.City: test infrastructure

Дата: 2026-07-06.

Статус: базовый слой стабильных тестовых селекторов добавлен.

## Зачем это нужно

В текущей SPA есть скрытые и внеэкранные дубликаты навигации. Из-за этого тесты по тексту, например `getByText(...).first()`, могут нажимать не тот элемент.

Решение: использовать стабильные атрибуты `data-kliper-testid`, которые проставляются поверх текущей DOM-структуры без изменения визуала.

## Реализация

Файл: `js/behavior/test-selectors.js`.

Подключение: `index.html`.

Слой:

- не меняет внешний вид сайта;
- не меняет пользовательскую логику;
- не редактирует `js/app.js`;
- обновляет селекторы после кликов, скролла, resize, hashchange и DOM-изменений.

## Доступные селекторы

| Селектор | Назначение |
|---|---|
| `[data-kliper-testid="nav-developers"]` | раздел `Застройщики` |
| `[data-kliper-testid="nav-newbuildings"]` | раздел `Новостройки` |
| `[data-kliper-testid="nav-ready"]` | раздел `Готовые ЖК` |
| `[data-kliper-testid="nav-business"]` | раздел `Для бизнеса` |
| `[data-kliper-testid="nav-profile"]` | страница пользователя |
| `[data-kliper-testid="view-grid"]` | вид сеткой |
| `[data-kliper-testid="view-list"]` | вид списком |
| `[data-kliper-testid="view-map"]` | вид карты |
| `[data-kliper-testid="view-sort-reverse"]` | обратный рейтинг |
| `[data-kliper-testid="result-count"]` | текущий счетчик результатов |

## Правило для тестов

Использовать:

```js
await page.locator('[data-kliper-testid="nav-newbuildings"]').click();
```

Не использовать для основной навигации:

```js
await page.getByText('Новостройки').first().click();
```

Причина: первый текстовый матч может быть скрытым дублем или элементом другой зоны.

## Проверено

Desktop `1440x900`:

- `nav-developers` открывает `32 карточки`;
- `nav-newbuildings` открывает `142 карточки`;
- `nav-ready` открывает `20 карточки`;
- `nav-business` открывает `6 бизнес-помещений`;
- `nav-profile` открывает профиль `Мария`;
- stories viewer не открывается случайно при клике по `nav-business`;
- horizontal overflow: `0`.

Mobile `390x844`:

- селекторы навигации находятся на мобильных кнопках;
- story-кружки не получают nav-селекторы;
- horizontal overflow: `0`.

## Ограничения

Это не полноценный тестовый фреймворк, а первый стабилизирующий слой для будущих smoke/regression-тестов.

Если структура навигации изменится, нужно перепроверить `js/behavior/test-selectors.js`.

Не использовать `data-kliper-testid` для CSS-стилизации.

## Residential list-view

`C-001` закрыт внешним guard-слоем `js/filters/residential-view-controls-guard.js`.

После перехода в `view-list` тесты снова должны находить:

- `[data-kliper-testid="view-grid"]`;
- `[data-kliper-testid="view-list"]`;
- `[data-kliper-testid="view-map"]`;
- `[data-kliper-testid="view-sort-reverse"]`.

Важно: в list-view DOM по-прежнему может содержать legacy-leak карточку, скрытую `residential-list-guard`. Для счетчиков и smoke использовать видимые карточки и `[data-kliper-testid="result-count"]`.
