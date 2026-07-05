# Kliper.City: change log

Журнал нужен, чтобы разные чаты понимали, что менялось и зачем.

## 2026-07-06

### Workstream threads

Создана первая волна рабочих Codex-чатов:

- Regression QA;
- Assets/Data Cleanup;
- Filters System;
- Visual System;
- Stories & Motion.

Добавлен `THREAD_REGISTRY.md` с thread ID, статусами и порядком чтения результатов.

Все чаты первой волны получили стартовую задачу в режиме аудита без правки кода.

Добавлен `REPORT_INTAKE_PROTOCOL.md`, чтобы отчеты рабочих чатов превращались в задачи через единую приемку Architect / Main.

Принят первый отчет `ASSETS_DATA_AUDIT.md` от Assets/Data Cleanup. На его основе добавлен `FIX_QUEUE.md` с кандидатами `A-001`...`A-005`. Исправления пока не запущены до приемки Regression QA.

Принят отчет `STORIES_MOTION_AUDIT.md`. В `FIX_QUEUE.md` добавлены кандидаты `S-001`...`S-006`. Зафиксировано решение: первую реализацию stories scroll-rule делать без Motion и без изменения CSS-колец.

### Project Control Center

Добавлены документы управления проектом:

- `PROJECT_INDEX.md`
- `CHAT_OWNERSHIP.md`
- `TASK_BRIEF_TEMPLATE.md`
- `REGRESSION_CHECKLIST.md`
- `MOTION_RULES.md`
- `V1_V2_ROADMAP.md`
- `PROJECT_DECISIONS.md`
- `OWNER_DECISIONS_QUEUE.md`

Цель: подготовить проект к разделению на несколько рабочих чатов и снизить риск случайных поломок.

### Motion

Фактическое состояние:

- используется локальный файл `js/vendor/motion.global.js`;
- runtime: `js/behavior/motion-runtime.js`;
- доступ: `window.Motion` и `window.KLIPER_MOTION`.

### Не менялось

- визуал сайта;
- логика сайта;
- `js/app.js`;
- CSS интерфейса.

### Автономная работа и чаты

Добавлены:

- `AUTONOMY_PROTOCOL.md`
- `WORKSTREAM_PROMPTS.md`

Цель: дать возможность запускать отдельные чаты по доменам проекта без повторного пересказа контекста.

### Проверка после подготовки

Проверено через локальный браузер:

- `index.html` открывается;
- `#root` есть;
- `window.KLIPER_MOTION` есть;
- `window.KLIPER_MOTION.animate` есть;
- локальных ошибок по Motion/JS/CSS не найдено.

Оставшиеся ошибки относятся к внешним ресурсам:

- `logo.clearbit.com`;
- отдельный ресурс `images.unsplash.com`, заблокированный браузером.

### Baseline regression

Добавлен `BASELINE_REGRESSION_REPORT.md`.

Зафиксировано:

- основные v1-разделы переключаются через видимые кнопки;
- профиль открывается;
- desktop/mobile horizontal overflow равен `0`;
- Motion доступен;
- автотестам нельзя выбирать первый текстовый матч навигации из-за скрытых/внеэкранных дублей.

### Company Cabinet

Зафиксирован будущий домен `Кабинет компании`.

Фактический статус:

- на странице застройщика есть визуальный блок `ДЛЯ БИЗНЕСА / Кабинет компании`;
- отдельная рабочая страница/route/модалка кабинета не найдена.

Добавлено:

- `pages-company-cabinet.md`;
- зона `Company Cabinet` в `CHAT_OWNERSHIP.md`;
- стартовый промпт `Company Cabinet` в `WORKSTREAM_PROMPTS.md`;
- вопросы владельцу в `OWNER_DECISIONS_QUEUE.md`.

### Stage 1 closure

Добавлен `STAGE_1_CLOSURE.md`.

Зафиксировано:

- что уже готово в Project Control Center;
- какие решения владельца нужны для полного закрытия Этапа 1;
- рекомендуемые v1/v2 границы;
- список рабочих чатов;
- backlog P0/P1/P2/v2;
- Definition of Done для v1;
- следующий рекомендуемый этап: Test Infrastructure.

### Owner decisions update

Владелец подтвердил:

- `Топ` - v2;
- `Мой двор` - v2;
- `Районы` - v2;
- `Кабинет компании` - v1;
- форма заявки сейчас не делается, будет отдельная доработка;
- социальные функции должны быть полноценными;
- stories scroll-правило подтверждено;
- backend/auth нужны в конце v1 для пользователей и застройщиков.

Добавлен `SOCIAL_FEATURES_SCOPE.md`.

Уточнены устаревшие формулировки в:

- `V1_V2_ROADMAP.md`;
- `STAGE_1_CLOSURE.md`;
- `UI_AND_CHANGE_RULES.md`;
- `pages-company-cabinet.md`;
- `OWNER_DECISIONS_QUEUE.md`.

### Test Infrastructure

Добавлен базовый слой стабильных тестовых селекторов:

- `js/behavior/test-selectors.js`;
- подключение в `index.html`;
- документ `TEST_INFRASTRUCTURE.md`.

Проверено:

- desktop `1440x900`;
- mobile `390x844`;
- основные nav-селекторы ведут в правильные разделы;
- `nav-business` не попадает в story-кружок `Бизнес`;
- horizontal overflow равен `0`.

Визуал сайта и `js/app.js` не менялись.
