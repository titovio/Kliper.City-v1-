# ROLE-PROFILES second handoff intake

Дата: 2026-07-07.

Статус: приемка второй пачки отчетов профильных чатов после `ROLE_PROFILES_OWNER_DECISION_PACK.md`. Код, CSS, JS, HTML и `js/app.js` не менялись.

## 1. Что принято

Вторая пачка закрыла не реализацию, а спецификации вокруг будущих ролевых профилей:

- owner decision pack принят Product / UX Lab;
- Profile Social уточнил CTA и privacy flow;
- Catalog Core уточнил favorite-tag aggregates;
- Object Pages уточнил блок `Почему советуют`;
- Backend/Auth подготовил delta к auth/storage contracts;
- Visual System подготовил token/spec для role/trust labels;
- Stories & Motion описал источники и labels stories;
- Regression QA и Mobile QA подготовили acceptance matrices;
- Company Cabinet описал границу `Представитель компании` vs `Кабинет компании`.

Общий вывод: модель остается future-state. Немедленных кодовых задач для текущего v1 UI нет.

## 2. Документы второй пачки

| Документ | Источник | Смысл |
|---|---|---|
| `ROLE_OWNER_001_DECISION_PACK_REVIEW.md` | Product / UX Lab | Проверка owner decision pack D1-D10 и первые вопросы владельцу |
| `ROLE_AUTH_002_AUTH_STORAGE_CONTRACT_DELTA.md` | Backend/Auth | Что позже добавить в `AUTH_004` и `AUTH_006` |
| `CAB_ROLE_001_COMPANY_REPRESENTATIVE_BOUNDARY.md` | Company Cabinet | Граница публичной роли физлица и приватного доступа к кабинету |

Часть чатов вернула компактные отчеты в тредах без отдельного файла. Их решения приняты ниже как intake.

## 3. Принятые дефолты

До ответа владельца можно использовать как рабочие гипотезы:

| Тема | Дефолт |
|---|---|
| CTA | `Стать автором или специалистом` |
| Заголовок блока | `Профессиональный профиль` |
| Тариф физлица | `Профиль автора` |
| Цена-гипотеза | `990 ₽ / мес` |
| Обычные пользователи | Без stories/news/pro publishing |
| Privacy | private default + public aggregate |
| Favorite aggregates | `<10 hidden`, `10-29 soft`, `30+ exact`, `100+ strong` |
| Карточка | 1 aggregate tag в grid, 1 на mobile, до 2 в list |
| Object review block | `Почему советуют`, рекомендовано 3 рецензии |
| Freshness | `Актуально`, `Нужно подтвердить`, `Устарело` |
| Badges | role, trust, commercial и state разделены |
| Stories source | `platform`, `company`, `role_profile`; ordinary user excluded |
| Expert | статус нельзя купить |
| Реализация | после backend/auth; основной role-profile UI в v2 |

## 4. Что блокирует реализацию

Перед любым UI/backend стартом нужны решения владельца:

1. Подтвердить, что role profiles не идут в текущий v1 UI.
2. Подтвердить CTA и заголовок блока в профиле.
3. Подтвердить цену и название тарифа физлица.
4. Решить, где живет `Представитель компании`: как role profile, как company membership label или обе модели с жесткой связью.
5. Подтвердить privacy default.
6. Подтвердить набор стартовых тегов и можно ли custom tags.
7. Подтвердить labels: `Подтвержден Kliper`, `Подтвержден компанией`, `Материал компании`, `Партнерский материал`.
8. Подтвердить сроки grace/basic/inactive после неоплаты.

## 5. Принятые правила по зонам

### Profile Social

CTA должен быть вторичным и мягким:

```text
Стать автором или специалистом
```

Обычный профиль остается бесплатным и полноценным для likes/favorites/reviews/subscriptions. Ролевой профиль создается отдельным flow после выбора роли, показа тарифа и verification.

Privacy:

- likes: private default;
- favorite tags: private default, public aggregate only;
- reviews: draft/private до явной публикации, имя можно скрыть, публичный контекст остается.

### Catalog Core

Favorite-tag aggregate - это обезличенный сигнал, а не публичное действие конкретного пользователя.

Рекомендуемый threshold:

- `<10`: не показывать;
- `10-29`: мягкий текст без точного веса;
- `30+`: точное число;
- `100+`: усиленная формулировка.

### Object Pages

Блок `Почему советуют` рекомендован на 3 рецензии:

- лучшая;
- свежая;
- подтвержденная/рольная.

Company/partner material не попадает в organic top как независимая рекомендация.

### Backend/Auth

`AUTH_004` и `AUTH_006` не переписывать прямо сейчас. После owner decisions добавить delta по:

- `role_profiles`;
- `role_profile_links`;
- `favorite_tags`;
- `favorite_tag_assignments`;
- `review_author_context`;
- billing физлица;
- privacy;
- permissions;
- migration.

### Visual System

Разделить визуальные сущности:

- role badge;
- verification badge;
- commercial marker;
- profile state badge.

На compact card максимум 2 бейджа на desktop и 1 основной + trust indicator на mobile.

### Stories & Motion

Stories имеют источник:

```text
platform | company | role_profile
```

Обычный пользователь не является author_type stories в v1. Для future stories нужны `commercial_flag`, `moderation_status`, `expires_at` и явный source label.

### QA / Mobile QA

P0-инвариант:

```text
user profile != role profile != company cabinet
```

Acceptance gates должны проверять permissions, privacy, billing states, partner labels, role labels, mobile overflow, tap targets и dark theme.

### Company Cabinet

`Представитель компании` - публичный контекст физлица.

`Кабинет компании` - приватный доступ по membership/permissions.

B2B тариф компании нельзя смешивать с тарифом физлица `Профиль автора`.

## 6. Следующий шаг Architect / Main

Не создавать новые кодовые задачи по role profiles.

Сначала подготовить короткий owner prompt на 7 вопросов:

1. Подтверждаем ли: role profiles не идут в текущий v1 UI?
2. CTA: `Стать автором или специалистом` оставляем?
3. Тариф: `Профиль автора`, `990 ₽ / мес` оставляем как гипотезу?
4. `Представитель компании`: role profile, cabinet membership label или оба слоя?
5. Privacy: private default + public aggregate подтверждаем?
6. Favorite tags: только стандартные или разрешаем custom позже?
7. Блок `Почему советуют`: 3 рецензии и company/partner exclusion подтверждаем?

После ответа владельца обновить:

- `ROLE_PROFILES_OWNER_DECISION_PACK.md`;
- `OWNER_DECISIONS_QUEUE.md`;
- `PROJECT_DECISIONS.md`;
- при необходимости `AUTH_004` / `AUTH_006` как future delta, но не текущую реализацию сайта.
