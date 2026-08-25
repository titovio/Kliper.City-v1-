# CAB-005: Company Cabinet v1 acceptance

Дата: 2026-07-07.

## Цель

Зафиксировать `Кабинет компании` как готовый v1-прототип после внедрения тарифов, блока готовности профиля и dark/mobile полировки.

## Статус

`Кабинет компании` можно считать **v1-ready как UI-прототип без backend/auth**.

Готово:

- отдельный route `#company-cabinet=developerSlug`;
- открытие кабинета из публичной страницы застройщика;
- возврат в публичную страницу;
- переход из кабинета в тарифы;
- возврат из тарифов в кабинет;
- блок `Тариф и лимиты`;
- блок внимания в hero;
- блок готовности профиля;
- документы и профиль;
- публикации;
- stories компании;
- подписчики;
- рецензии;
- обращения;
- предложения подписчикам;
- desktop light/dark;
- mobile light/dark.

## Проверенные сценарии

### Desktop light

Route:

```text
#company-cabinet=gk-paritet-development
```

Результат:

- кабинет активен;
- hash сохраняется;
- панелей: `9`;
- stat-карточек: `7`;
- блок готовности профиля: есть;
- блок тарифа: есть;
- action-кнопок будущих функций: `4`;
- кнопка перехода к тарифам: `1`;
- horizontal overflow: `0`;
- console/pageerror: не найдено.

### Desktop dark

Route:

```text
#company-cabinet=gk-paritet-development
```

Результат:

- `html.kliper-dark-theme`: есть;
- `body.kliper-dark-theme`: есть;
- кабинет активен;
- панелей: `9`;
- блок готовности профиля: есть;
- блок тарифа: есть;
- кнопки в заголовках панелей используют dark background;
- horizontal overflow: `0`;
- console/pageerror: не найдено.

### Cabinet -> Pricing -> Cabinet

Сценарий:

```text
#company-cabinet=gk-paritet-development
-> Изменить тариф
-> #business-pricing=gk-paritet-development
-> Назад в кабинет
-> #company-cabinet=gk-paritet-development
```

Результат:

- страница тарифов открывается;
- карточек тарифов: `5`;
- кнопка возврата: `1`;
- возврат снова открывает кабинет;
- hash сохраняется;
- horizontal overflow: `0`;
- console/pageerror: не найдено.

### Cabinet -> Public page -> Cabinet

Сценарий:

```text
#company-cabinet=gk-paritet-development
-> Публичная страница
-> #card=ГК Паритет Девелопмент
-> Открыть кабинет
-> #company-cabinet=gk-paritet-development
```

Результат:

- публичная страница открывается;
- блок `Кабинет компании` на публичной странице найден;
- кнопка `Открыть кабинет` найдена;
- кабинет открывается обратно;
- hash сохраняется;
- horizontal overflow: `0`;
- console/pageerror: не найдено.

### Future action notice

Проверена кнопка:

```text
Опубликовать позже
```

Результат: появляется v1-сообщение.

```text
Действие будет подключено после backend/auth. Сейчас это v1-прототип кабинета.
```

### Mobile light

Viewport: около `390px`.

Результат:

- кабинет активен;
- панелей: `9`;
- блок готовности профиля: есть;
- блок тарифа: есть;
- hero и panels укладываются в ширину;
- action-кнопки становятся в одну колонку;
- horizontal overflow: `0`;
- console/pageerror: не найдено.

### Mobile dark

Viewport: около `390px`.

Результат:

- `html.kliper-dark-theme`: есть;
- `body.kliper-dark-theme`: есть;
- кабинет активен;
- панелей: `9`;
- блок готовности профиля: есть;
- блок тарифа: есть;
- кнопки в dark theme читаемые;
- horizontal overflow: `0`;
- console/pageerror: не найдено.

### 32 company routes

Проверены все slug из `js/data/developers.js`.

Ожидание для каждого route:

- кабинет активен;
- панелей: `9`;
- stat-карточек: `7`;
- блок готовности профиля: есть;
- блок тарифа: есть;
- кнопка перехода к тарифам: `1`;
- horizontal overflow: `0`.

Результат:

- проверено: `32`;
- failed: `0`.

## Что остается mock/local

- backend;
- auth;
- роли компании;
- сохранение изменений;
- загрузка документов;
- публикация профиля;
- отправка публикаций;
- управление stories;
- ответы на рецензии;
- CRM/диалоги;
- реальные тарифы и оплата.

## Решение

`Кабинет компании` закрыт для текущего v1 UI-прототипа.

Следующий слой должен идти через backend/auth contracts, а не через дальнейшее наращивание mock-действий.
