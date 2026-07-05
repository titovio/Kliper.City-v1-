# Kliper.City: assets/data audit

Дата: 2026-07-06.

Цель: зафиксировать внешние изображения и логотипы, которые могут создавать сетевой шум, без изменения визуала, ассетов и `js/app.js`.

## Итог

Критичные внешние риски разделяются на четыре группы:

1. `logo.clearbit.com` - в актуальных редактируемых data/feature-модулях не найден. В baseline запросы есть, источник с высокой вероятностью остается в legacy/generated `js/app.js`.
2. Google favicons - 15 аватаров застройщиков в `js/data/developers.js`.
3. Unsplash - массовые placeholder-изображения в data-файлах, бизнес-разделе и object pages.
4. Прямые CDN/сайты компаний - `ttis.ru` и `cdn.idalite.ru` в данных застройщиков и stories.

Локальные обложки уже перекрывают основную выдачу:

- 32 из 32 застройщиков имеют локальную обложку в `js/data/developer-covers.js`;
- 156 локальных ключей ЖК есть в `js/data/jk-covers.js`;
- `js/data/buildings.js` перезаписывает `building.imageUrl`, если найден локальный cover;
- `js/catalog/building-cards.js` дополнительно сначала спрашивает `window.KLIPER_GET_JK_COVER`.

## Поиск

Использованные точечные запросы:

- `rg "Clearbit|clearbit|logo.clearbit|Google favicons|google.com/s2|favicon|Unsplash|unsplash|images.unsplash|cdn|https?://"`
- `rg "logo.clearbit.com|clearbit|google.com/s2|s2/favicons|images.unsplash.com|unsplash|cdn."`
- `rg "developer-covers|jk-covers|KLIPER_DEVELOPER_COVERS|KLIPER_JK_COVERS|bgImage|avatar|imageUrl|gallery"`

Исключались тяжелые/служебные зоны: `.git`, `node_modules`, `dist`, `build`, `.vite`, `.cache`, `coverage`, `js/vendor`, `kliper-motion`.

## Developers

Файлы:

- `js/data/developers.js`
- `js/data/developer-covers.js`
- `js/catalog/developer-cover-overrides.js`
- `assets/images/developers/`

Найдено:

- 32 записи застройщиков в `js/data/developers.js`;
- 32 локальные обложки в `js/data/developer-covers.js`;
- 32 внешних `bgImage` в исходных данных застройщиков, но они перекрываются локальными путями при загрузке `developer-covers.js` до `developers.js`;
- 15 внешних `avatar` через `https://www.google.com/s2/favicons?...`;
- прямые внешние обложки: `https://ttis.ru/storage/settings/March2026/AncUzRoTErzoVC8ao2SL.jpg`, `https://cdn.idalite.ru/s/media/images/b8d8abb5e40c4e919c1d1ed3c9a1b452.png`.

Оценка риска:

- `bgImage` застройщиков: низкий риск в текущем порядке `index.html`, так как локальные обложки загружаются раньше данных и есть DOM-overrides.
- Google favicons: средний риск. Это внешние запросы логотипов/аватаров, зависят от Google и домена компании.
- `ttis.ru` / `cdn.idalite.ru`: средний риск, если используются там, где локальное перекрытие не сработало или в stories.

Безопасная стратегия:

- не трогать визуал и `js/app.js`;
- следующим шагом заменить `avatar` на локальный fallback или на текстовый/инициальный fallback в отдельном модуле;
- для stories переиспользовать `KLIPER_DEVELOPER_COVERS` по `developerId`, чтобы убрать Unsplash/CDN без изменения композиции.

## Buildings

Файлы:

- `js/data/buildings.js`
- `js/data/jk-covers.js`
- `js/catalog/building-cards.js`
- `assets/images/jk/`

Найдено:

- `js/data/buildings.js` содержит внешние `imageUrl` на Unsplash как исходные placeholder-данные;
- `js/data/jk-covers.js` содержит 156 локальных путей для ЖК;
- в конце `js/data/buildings.js` есть перезапись `building.imageUrl = cover`;
- `js/catalog/building-cards.js` имеет массив `FALLBACK_IMAGES` из 14 Unsplash URL, но `getBuildingImage()` сначала использует локальный cover.

Оценка риска:

- текущая основная выдача ЖК: низкий риск, если `jk-covers.js` загружен до `buildings.js`;
- `FALLBACK_IMAGES` в `building-cards.js`: средний риск как резервный путь для новых/непокрытых карточек;
- исходные `imageUrl` в `buildings.js`: низкий текущий риск, но источник сетевого шума при нарушении порядка загрузки или появлении непокрытого имени.

Безопасная стратегия:

- оставить `js/app.js` без изменений;
- следующим шагом заменить `FALLBACK_IMAGES` в `js/catalog/building-cards.js` на локальные нейтральные ЖК-обложки или существующие локальные covers;
- при необходимости добавить проверку отчета/теста, что после загрузки `KLIPER_BUILDINGS` не осталось `imageUrl` с `http`.

## Business

Файл:

- `js/data/business-spaces.js`

Найдено:

- 6 бизнес-помещений;
- у каждой записи внешнее `image`;
- в каждой `gallery` по 3 внешних Unsplash URL;
- итого 18 gallery URL плюс 6 main image URL, часть main image дублирует первый gallery item.

Оценка риска:

- средний/высокий риск для бизнес-раздела: это реальные изображения карточек и галерей, локального слоя замены не найдено.

Безопасная стратегия:

- создать отдельную локальную карту `js/data/business-space-covers.js` или добавить локальные поля в `business-spaces.js` только после подготовки ассетов;
- на первом cleanup-шаге можно заменить только данные `image/gallery`, если будут локальные изображения с тем же соотношением сторон.

## Object Pages

Файлы:

- `js/pages/object/object-gallery-block.js`
- `js/pages/object/object-section-tabs.js`
- `js/pages/object/developer-section-tabs.js`
- `js/pages/object/ecosystem-card-polish.js`
- `js/pages/object/object-plans-block.js`
- `js/pages/object/object-map-location-block.js`
- `js/pages/object/object-aerial-view-block.js`

Найдено:

- `object-gallery-block.js` - 16 Unsplash URL для галереи объекта;
- `object-section-tabs.js` - 4 Unsplash URL для ленты/постов;
- `developer-section-tabs.js` - 4 Unsplash URL для ленты застройщика;
- `ecosystem-card-polish.js` - 10 Unsplash URL для ecosystem stories/drawer;
- `object-plans-block.js` - 7 Unsplash URL для chips/stories домов;
- `object-map-location-block.js` и `object-aerial-view-block.js` - по 1 Unsplash URL для preview/aerial.

Оценка риска:

- средний риск: эти URL грузятся при открытии object/developer pages и модальных/галерейных блоков;
- локальной карты замены для object pages не найдено.

Безопасная стратегия:

- не менять модули пачкой;
- начать с общей data-карты для object placeholders или с точечной замены в одном модуле, где больше сетевого шума (`object-gallery-block.js`);
- после каждой замены проверять object page desktop/mobile и модалки.

## Stories

Файл:

- `js/data/stories.js`

Найдено:

- 8 Unsplash URL;
- 1 прямой URL `ttis.ru`;
- 1 прямой URL `cdn.idalite.ru`.

Локальная замена:

- для всех story-застройщиков есть локальные developer covers в `js/data/developer-covers.js`, но `stories.js` сейчас их не использует.

Оценка риска:

- средний риск: stories грузятся на первом экране/в верхней зоне и могут давать сетевые ошибки независимо от карточек застройщиков.

Безопасная стратегия:

- в следующем шаге обновить `js/data/stories.js`, чтобы `image` брался из `window.KLIPER_DEVELOPER_COVERS` по `developerId`/имени, либо заменить URL на локальные пути напрямую;
- это безопаснее, чем перехватывать DOM после загрузки, потому что не будет стартового внешнего запроса.

## Clearbit

Найдено:

- в редактируемых data/feature-модулях `logo.clearbit.com` не найден;
- в документах зафиксированы baseline failures:
  - `https://logo.clearbit.com/pik.ru`
  - `https://logo.clearbit.com/samolet.ru`
  - `https://logo.clearbit.com/brusnika.ru`
  - `https://logo.clearbit.com/strana.com`
  - `https://logo.clearbit.com/etalongroup.ru`

Оценка риска:

- высокий шум в консоли/network, но источник находится в legacy/generated `js/app.js` или старом DOM-пути;
- без отдельного решения `js/app.js` не редактировать.

Безопасная стратегия без правки `js/app.js`:

- добавить отдельный ранний/поздний interceptor-модуль только после решения владельца: искать `img[src^="https://logo.clearbit.com/"]` и заменять на локальный fallback/пустой avatar до загрузки;
- лучше сначала убрать Google favicons и stories/object/business Unsplash в редактируемых файлах, затем повторить network smoke и понять, остался ли Clearbit.

## План cleanup

1. Минимальный data cleanup: заменить `js/data/stories.js` на локальные developer covers и заменить/перехватить Google favicons в `js/data/developers.js` или отдельном avatar fallback-модуле. Файлы-кандидаты: `js/data/stories.js`, `js/data/developers.js`, возможно новый малый модуль рядом с data.
2. Убрать резервный сетевой шум ЖК: заменить `FALLBACK_IMAGES` в `js/catalog/building-cards.js` на локальные изображения из `assets/images/jk` или общий локальный fallback. `js/data/buildings.js` можно не трогать, пока локальное перекрытие работает.
3. Отдельным проходом локализовать реальные галереи: `js/data/business-spaces.js` и object modules. Начать с `business-spaces.js` или `js/pages/object/object-gallery-block.js`, потому что там больше всего реальных загружаемых URL.

После каждого шага:

- не менять визуальную композицию;
- не удалять ассеты;
- не редактировать `js/app.js`;
- проверить desktop/mobile соответствующей зоны и network на `images.unsplash.com`, `google.com/s2`, `logo.clearbit.com`.
