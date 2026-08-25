# PRODUCT-003: role profiles после approval владельца

Дата: 2026-07-08.

Статус: owner-facing summary Product / UX Lab. Код, CSS, JS, HTML и `js/app.js` не менялись.

Основано на:

- `docs/PROJECT_DECISIONS.md`;
- `docs/ROLE_PROFILES_APPROVED_HANDOFF.md`;
- `docs/ROLE_PROFILES_SECOND_HANDOFF_INTAKE.md`;
- `docs/ROLE_PROFILES_SCOPE.md`;
- `docs/V1_V2_ROADMAP.md`.

## 1. Что теперь утверждено

Владелец подтвердил role-profile рамку:

1. Role profiles не добавляются в текущий v1 UI.
2. Approved CTA для future-state: `Стать автором или специалистом`.
3. Тариф физлица: `Профиль автора`, рабочая гипотеза `990 ₽ / мес`.
4. `Представитель компании` делится на два слоя:
   - публичная роль физлица;
   - доступ к кабинету компании через company membership.
5. Privacy default: личные действия приватны, публичны только агрегаты и явно опубликованные рецензии.
6. Favorite tags: стартуют только стандартные теги, custom tags позже после moderation.
7. Блок `Почему советуют`: 3 рецензии; материалы компании и партнеров отдельно от organic top.

## 2. Что остается в текущем v1

Текущий v1 остается стабильной витриной:

- каталоги;
- карточки;
- object pages;
- stories как platform/company showcase;
- профиль пользователя;
- лайки;
- подписки;
- локальные рецензии;
- фильтры;
- кабинет компании как v1 UI-прототип;
- тарифы компаний как визуальная B2B-модель;
- mobile/dark/stability.

Для обычного пользователя в v1 допустима только текущая социальная база:

- сохранить;
- лайкнуть;
- подписаться;
- оставить/увидеть рецензию как локальный или будущий backend-сценарий;
- видеть профиль как личную витрину.

Обычный пользователь в v1 не становится автором новостей, stories или профессиональных публикаций.

## 3. Что переносится после backend/auth или в v2

Финал v1 после backend/auth:

- серверные лайки;
- серверные подписки;
- серверные рецензии;
- privacy/visibility;
- review author context;
- moderation status;
- created_at / updated_at;
- verification status;
- база для favorite tags;
- разграничение user profile / role profile / company cabinet на уровне auth/data model.

v2:

- полноценные role profiles;
- тариф физлица `Профиль автора`;
- role stories;
- профессиональные публикации;
- ролевые подборки;
- favorite-tag aggregates в карточках;
- блок `Почему советуют` как полноценный backend-driven слой;
- двойные теги роли;
- trust/commercial labels;
- custom tags после moderation;
- списки специалистов и downgrade states после неоплаты.

## 4. Что нельзя кодить сейчас

Без отдельного implementation brief нельзя:

- добавлять CTA `Стать автором или специалистом` в текущий профиль;
- добавлять role-profile UI;
- добавлять тариф физлица на текущую страницу B2B-тарифов;
- добавлять оплату или billing для физлиц;
- добавлять stories/news обычным пользователям;
- добавлять role stories;
- показывать реальные favorite-tag aggregates;
- добавлять блок `Почему советуют` в текущие карточки;
- добавлять role/trust badges в текущий UI;
- смешивать `Представитель компании` с кабинетом компании;
- использовать localStorage как источник role permissions, trust или billing state;
- менять `js/app.js`.

## 5. Безопасные дефолты для будущих specs

| Тема | Approved default |
|---|---|
| CTA | `Стать автором или специалистом` |
| Тариф | `Профиль автора` |
| Цена | `990 ₽ / мес` как гипотеза, не публичное обещание до billing |
| Обычные пользователи | без stories/news/pro publishing |
| Privacy | private default + public aggregate |
| Favorite tags | стандартные теги, custom позже после moderation |
| Object review block | `Почему советуют`, 3 рецензии |
| Partner/company content | отдельно от organic top |
| Representative company | role context + company membership boundary |
| Реализация | future-state: финал v1 после backend/auth или v2 |

## 6. Следующие 3 продуктовые решения после backend/auth

### Решение 1: первый backend-срез social + role readiness

Нужно выбрать, входит ли в первый backend-срез только базовый social:

- аккаунт;
- лайки;
- подписки;
- рецензии;
- privacy;
- profile;

или сразу добавляется foundation для role readiness:

- favorite tags;
- review author context;
- verification status;
- basic role profile draft.

Рекомендация Product / UX Lab: сначала social foundation + role-ready fields, но без публичного role-profile UI.

### Решение 2: monetization launch order

Нужно выбрать порядок коммерческого запуска:

1. сначала B2B company billing;
2. затем B2C `Профиль автора`;
3. или параллельное планирование, но разные страницы/flow.

Рекомендация Product / UX Lab: B2B billing первым, `Профиль автора` вторым, чтобы не смешивать компанию и физлицо.

### Решение 3: trust/moderation policy

Нужно утвердить правила модерации:

- рецензий;
- favorite tags;
- custom tags;
- role verification;
- partner/company materials;
- role stories.

Рекомендация Product / UX Lab: до публичного role-profile UI утвердить minimum trust policy, иначе доверие быстро станет слабым местом продукта.

## 7. Owner-facing takeaway

Role profiles утверждены как направление, но не как текущая v1-функция.

Сейчас задача v1 - стабилизировать и объяснить продукт. Role-profile модель должна быть заложена в backend/auth и будущие specs, но не должна появляться в UI, оплате или stories без отдельного implementation brief.
