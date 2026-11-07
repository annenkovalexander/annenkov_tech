Приложение предназначено для визуализации и управления списками событий, распределенных по временным периодам. Основные сценарии включают просмотр карточек событий, навигацию между временными интервалами с помощью контроллеров и переключение активного периода отображения.

Архитектура фронтенда базируется на разделении ответственности между слоями компонентов, сервисов и управления состоянием. Интерфейс реализован через функциональные компоненты и UI-представления для отделения логики взаимодействия от визуального отображения. Взаимодействие с данными осуществляется через слой API.

Глобальное состояние организовано с помощью Redux и разделено на слайсы для управления заголовком и периодами. Доменные сущности: события и периоды. В состоянии отслеживаются список интервалов, идентификатор текущего периода, статусы загрузки и ошибки. Для обработки асинхронных операций и извлечения данных используются thunk-и и селекторы.

# Архитектура фронтенда

## Общая структура
Приложение использует многослойную архитектуру с распределением ответственности между уровнями представления, управления состоянием и сетевого взаимодействия. Бизнес-логика изолирована от визуального отображения.

## Интерфейсные слои
Корневая страница координирует расположение основных функциональных блоков. Интерфейс разделен на интеллектуальные компоненты (логика взаимодействия: управление периодами, отображение списков событий) и базовые UI-элементы (визуализация данных). Базовые элементы переиспользуются в различных частях приложения.

## Данные и состояние
Состояние организовано через Redux. В глобальном хранилище отслеживаются активный временной период, список доступных интервалов, статусы загрузки и ошибки. Селекторы используются для извлечения и трансформации данных под текущий контекст отображения.

## Сетевое взаимодействие
Запросы к серверу вынесены в слой сервисов. Асинхронные операции по получению событий и периодов обрабатываются через thunks, которые обновляют глобальное состояние. Интерфейс отображает статус выполнения запросов (загрузка, завершение или ошибка).

## Основные пользовательские сценарии

### Просмотр событий в выбранном периоде
Пользователь просматривает список карточек событий, относящихся к выбранному временному интервалу. Список выводится на главной странице. В верхней части интерфейса отображается заголовок с названием текущего периода.

### Навигация между временными интервалами
Переключение периодов осуществляется через инструменты навигации и контроллеры. Выбор нового интервала обновляет активный период в состоянии, что приводит к перезагрузке списка событий и смене заголовка.

### Отслеживание состояния загрузки данных
При первоначальном входе или переключении периодов отображается индикация получения данных. Интерфейс реагирует на статус асинхронных запросов, уведомляя о процессе загрузки или ошибках при получении списка событий.

## Данные и взаимодействие с backend

### Типы данных и контракты
Используются две доменные сущности:
* **Периоды** — временные интервалы, определяющие контекст отображения данных.
* **События** — единицы информации, привязанные к конкретным периодам.

Эти сущности определяют структуру вывода карточек в зависимости от выбранного временного отрезка.

### Состояние и асинхронные операции
Состояние разделено на области: управление заголовком (`header`) и управление периодами (`periods`). 
В области `periods` хранятся:
* список доступных интервалов;
* идентификатор текущего активного периода;
* заголовок страницы;
* статусы запросов (`isLoading`, `error`).

Селекторы используются для поиска конкретного периода по идентификатору или определения индекса элемента в списке.

### API и синхронизация
Слой сервисов содержит функции получения данных о событиях и периодах. Асинхронные операции запрашивают данные с backend и записывают результаты в области состояния Redux. 
Процесс обновления: смена активного периода или первая загрузка -> обновление состояния -> отображение актуального списка событий в компонентах.

### Поддержка пользовательских потоков
Переключение интервалов через контроллеры навигации изменяет идентификатор активного периода в состоянии, что запускает процесс получения новых данных. Это обеспечивает обновление заголовка страницы и набора карточек событий с отображением статуса загрузки.

## Страницы и основные интерфейсные блоки

### Основные страницы
В приложении используется одна основная страница для просмотра списков событий и управления временными интервалами. Она охватывает путь пользователя от входа до переключения между периодами.

### Крупные интерфейсные блоки
* **Шапка (Header)** — общая навигация и визуальное оформление верхней части.
* **Заголовок периода (Period Title)** — название активного временного интервала.
* **Инструменты навигации и контроллеры периодов (Period Navigation, Period Controls)** — выбор и переключение временных отрезков.
* **Список карточек событий (Event Card List)** — вывод событий текущего периода в виде отдельных карточек.
* **Вспомогательные UI-элементы** — графические компоненты (линии, точки, круги) для оформления и структурирования данных.

### Связь с пользовательскими сценариями
Сценарии реализуются на одной странице через взаимодействие указанных блоков:
* Просмотр событий: блок списка карточек + заголовок периода + шапка.
* Навигация: контроллеры и навигация -> обновление заголовка -> смена набора карточек.
* Индикация загрузки или ошибок отображается в области вывода данных.

## Особенности технической реализации

Архитектура разделяет ответственность между слоями компонентов, сервисов и управления состоянием. Логика взаимодействия отделена от визуального отображения; определены роли интеллектуальных компонентов и базовых UI-элементов.

Доменные сущности (периоды и события) используются для согласованного описания информации. Периоды служат контекстом для отображения событий.

Состояние Redux включает области управления заголовком и периодами. Thunk-операции обеспечивают асинхронную работу с данными о событиях и интервалах. Селекторы извлекают данные из состояния по идентификаторам или индексам.

API-слой содержит операции получения данных о периодах и событиях. Сетевые операции отделены от представления и состояния.

## Расширение и сопровождение

Добавление новых интерфейсных решений осуществляется через существующие уровни:
* Новые экраны -> страницы;
* Переиспользуемые блоки -> виджеты;
* Пользовательские действия и логика -> функциональные модули.

Расширение предметной области реализуется через:
1. Доменные типы (согласно существующим контрактам).
2. API-операции.
3. Области состояния.
Новые API-операции связываются с асинхронной логикой и состоянием.

Рекомендуемый порядок изучения проекта для понимания пути данных: 
Доменные типы -> API-операции -> Состояние -> Thunk-операции -> Селекторы -> Компоненты интерфейса.

# Ревью кода

В отчёте по модулю `Components` указано, что модуль состоит из трёх файлов и общих проблем, повторяющихся в нескольких файлах, не выявлено. Критических проблем по представленным отчётам не обнаружено. В разделе приоритетов для модуля `Components` указано отсутствие проблем уровня High, Medium и Low. Зафиксирована подтверждённая ошибка в файле `EventCardList.tsx`, связанная с отсутствием явного рендера состояний `loading` и `error`. Системных проблем, подтверждённых несколькими файлами или общим контрактом модуля, не выявлено.

Готовность к опытно-промышленной эксплуатации: ограниченно готов
Готовность к эксплуатации на всех пользователях: ограниченно готов

## Components — модуль приложения

## Общая оценка модуля

Модуль **Components** состоит из 3 файлов; общих проблем, повторяющихся в нескольких файлах, не выявлено. Критических проблем по представленным отчётам не обнаружено. Анализ ограничен отсутствием полной информации о версиях используемых библиотек и деталях реализации Redux‑слайсов.

## Системные проблемы модуля

Системных проблем, подтверждённых несколькими файлами или общим контрактом модуля, не выявлено.

## Локальные проблемы файлов

**../../data/shared/src/Components/Circle/Circle.tsx**  
- **Вопрос к архитектуре**, приоритет не указан, уверенность medium: задержка перестановки точек через два вложенных `requestAnimationFrame` и `setTimeout(50 ms)` может вызвать непоследовательное визуальное поведение на разных устройствах.  
- **Вопрос к архитектуре**, приоритет не указан, уверенность low: передача хука `useGSAP` в `gsap.registerPlugin` не подтверждена без документации библиотеки.  
- **Условный риск**, приоритет не указан, уверенность medium: при изменении порядка элементов в массиве `periods` ссылка `dotPositionsRef` может сохранять устаревшие индексы, что приведёт к некорректному размещению точек.

**../../data/shared/src/Components/EventCardList/EventCardList.tsx**  
- **Подтверждённая ошибка**, приоритет не указан, уверенность high: отсутствие явного рендера для состояний `loading` и `error` → пользователь видит пустой контейнер.  
- **Условный риск**, приоритет не указан, уверенность low: состояние видимости навигационных кнопок может не синхронно обновляться при переключении свойства `isMobile` (зависимость от колбэков Swiper).  
- **Условный риск**, приоритет не указан, уверенность low: неизвестно, будет ли Swiper автоматически вызывать `onUpdate` при изменении родительских пропсов; отсутствие fallback‑механизма может влиять на синхронизацию кнопок.

**../../data/shared/src/Components/Header/Header.tsx**  
- **Условный риск**, приоритет не указан, уверенность low: деструктурирование результата `useSelector(selectHeader)` без проверки на `null`/`undefined` может привести к runtime‑ошибке `TypeError`.

## Несоответствия с документацией и архитектурой

Не выявлено по представленным отчётам.

## Улучшения

- **Circle**: проверить возможность выполнения позиционирования после подтверждения доступности пути и элементов либо использовать механизм синхронизации из GSAP; уточнить в документации GSAP, требуется ли передавать `useGSAP` в `registerPlugin`; обеспечить очистку или полное обновление кеша при изменении массива `periods`.  
- **EventCardList**: реализовать явные UI‑ветки для состояний `loading` и `error`; добавить `useEffect`, отслеживающий изменение `isMobile`, и вручную вызывать `updateNavigation(swiperRef.current)` для синхронизации навигационных кнопок; оставить константу `SWIPER_BREAKPOINTS` неизменной либо обернуть её в `useMemo`, если значения станут динамическими.  
- **Header**: добавить проверку на `null`/`undefined` или задать значения по умолчанию перед деструктурированием результата `useSelector(selectHeader)`.

## Приоритеты по модулю

### Critical
Не выявлено по представленным отчётам.

### High
Не выявлено по представленным отчётам.

### Medium
Не выявлено по представленным отчётам.

### Low
Не выявлено по представленным отчётам.

### Приоритет не указан
- ../../data/shared/src/Components/Circle/Circle.tsx – вопрос к архитектуре (задержка перестановки точек).  
- ../../data/shared/src/Components/Circle/Circle.tsx – вопрос к архитектуре (передача `useGSAP` в `registerPlugin`).  
- ../../data/shared/src/Components/Circle/Circle.tsx – условный риск (устаревшие индексы в `dotPositionsRef`).  
- ../../data/shared/src/Components/EventCardList/EventCardList.tsx – подтверждённая ошибка (отсутствие рендера состояний loading/error).  
- ../../data.shared/src/Components/EventCardList/EventCardList.tsx – условный риск (десинхронизация навигации на мобильных устройствах).  
- ../../data/shared/src/Components/EventCardList/EventCardList.tsx – условный риск (неопределённость автоматического вызова `onUpdate` в Swiper).  
- ../../data/shared/src/Components/Header/Header.tsx – условный риск (незащищённое деструктурирование результата селектора).

### Components_Circle

1. ../../data/shared/src/Components/Circle/Circle.tsx – UI Component in the Presentation Layer that renders a circular visualization of periods with animated dots using GSAP MotionPathPlugin; overall quality is acceptable and no critical problems were found.  
2. **F-001** (architectural question, low severity, medium confidence): dot repositioning is delayed via two nested `requestAnimationFrame` calls followed by a 50 ms `setTimeout`, which may cause inconsistent visual behavior across different hardware or browser loads.  
3. Additional observations: **F-002** (info severity, low confidence) – the `useGSAP` hook is passed to `gsap.registerPlugin`, whose correctness cannot be verified without library version documentation; **F-003** (conditional risk, low severity, medium confidence) – potential stale indices in `dotPositionsRef` when periods are reordered.  
4. Conditional risk (**F-003**) – if the `'periods'` selector updates with a new order but existing IDs, the map retains old indices, possibly leading to incorrect visual placement.  
5. No improvements were identified for this file (“Улучшений не найдено”).  
6. Analysis limitation: review requires missing context such as GSAP/@gsap/react library versions and documentation, and details of `periodsSlice` state transitions.  
7. Priority actions: check whether positioning can be performed after confirmed availability of the required path and elements or use a synchronization mechanism from the animation library; verify in GSAP documentation whether the `useGSAP` hook should be passed to `registerPlugin`; ensure the cache is cleared or fully updated whenever the periods array changes.



### Файл: ../../data/shared/src/Components/Circle/Circle.tsx

# Code Review: `Circle.tsx`

**Путь:** `../../data/shared/src/Components/Circle/Circle.tsx`
**Язык:** typescript
**Роль:** UI Component
**Слой:** Presentation Layer
**Ответственность:** Renders a circular visualization of periods with animated dots using GSAP MotionPathPlugin.
**Уверенность в контексте:** Высокая

---

## 📊 Общая оценка

**Качество:** acceptable
**Критические проблемы:** 🟢 Нет
**Уверенность ревью:** Высокая
**Требует контекста:** ⚠️ Да

**Недостающий контекст:**

- GSAP and @gsap/react library versions and documentation
- Implementation of periodsSlice and associated state update logic

**Заметки:** The component implements a complex animation synchronization pattern. There are observations regarding the way GSAP plugins are registered, the timing of element positioning, and potential stale data in the position cache.

---

## 🔍 Замечания (3)

### 🔵 F-001: Unconventional timing for dot repositioning

| Параметр | Значение |
| :--- | :--- |
| Тип | 🏗 Архитектурный вопрос |
| Категория | architecture |
| Severity | 🔵 low |
| Уверенность | Средняя |
| Release impact | 📋 Backlog |
| Fallback | ❓ Неизвестно |
| Предыдущее замечание | new |

**Что найдено:** The execution of the repositionDots function is deferred using a combination of two requestAnimationFrame calls and a setTimeout with a 50ms delay.

**Почему важно:** The resulting visual effect depends on implementation and styles; relying on fixed timeouts for DOM synchronization can lead to inconsistent behavior across different hardware or browser loads.

**Сценарий:** Component mount or update of periods/circlePathD.

**Условие проявления:** Triggering the useEffect that handles dot repositioning.

**Causal chain:**

1. useEffect dependency change triggers
2. first requestAnimationFrame is scheduled
3. second requestAnimationFrame is scheduled inside the first
4. setTimeout(repositionDots, 50) is called inside the second frame
5. repositionDots executes after approximately 50ms + 2 frames

**Недостающие звенья causal chain:**

- ❓ Initial styles and layout of HTMLDivElement and SVGPathElement elements

**Требуемый контекст:**

- 📥 Initial styles and layout of HTMLDivElement and SVGPathElement elements

**Рекомендация:** Check whether positioning can be performed after confirmed availability of the required path and elements or use a synchronization mechanism provided by the animation library.

**Затронутые места:**

- **useEffect (repositionDots)** (evidence: high)

  ```
  firstFrame = requestAnimationFrame(() => {
              secondFrame = requestAnimationFrame(() => {
                  timeout = setTimeout(repositionDots, 50);
              });
          });
  ```

---

### ⚪️ F-002: Verification of GSAP hook registration

| Параметр | Значение |
| :--- | :--- |
| Тип | ❓ Требует контекста |
| Категория | architecture |
| Severity | ⚪️ info |
| Уверенность | Низкая |
| Release impact | 📋 Backlog |
| Fallback | ❓ Неизвестно |
| Предыдущее замечание | new |

**Что найдено:** The useGSAP hook is passed to gsap.registerPlugin.

**Почему важно:** The appropriateness of this usage cannot be verified without the library version and documentation.

**Сценарий:** Module evaluation during import.

**Условие проявления:** Application startup/module loading.

**Causal chain:**

1. Script execution reaches gsap.registerPlugin(useGSAP)

**Недостающие звенья causal chain:**

- ❓ @gsap/react library requirements for the used library version

**Требуемый контекст:**

- 📥 @gsap/react library requirements for the used library version

**Рекомендация:** Verify in the GSAP documentation whether the useGSAP hook should be passed to registerPlugin.

**Затронутые места:**

- **gsap.registerPlugin** (evidence: high)

  ```
  gsap.registerPlugin(useGSAP);
  ```

---

### 🔵 F-003: Potential stale indices in dotPositionsRef cache

| Параметр | Значение |
| :--- | :--- |
| Тип | ⚠️ Условный риск |
| Категория | correctness |
| Severity | 🔵 low |
| Уверенность | Средняя |
| Release impact | 📋 Backlog |
| Fallback | ❓ Неизвестно |
| Предыдущее замечание | new |

**Что найдено:** The dotPositionsRef Map is updated only if the period.id does not already exist in the Map, ignoring changes to the index of existing IDs.

**Почему важно:** If periods are reordered or removed and replaced in the store, existing entries in the map will retain their old indices, which may lead to incorrect visual placement based on incomplete data.

**Сценарий:** The list of periods is reordered or items are modified in the Redux store.

**Условие проявления:** Update of the 'periods' selector resulting in a new array with changed element order but existing IDs.

**Causal chain:**

1. Store updates the periods array
2. useEffect for dotPositionsRef triggers
3. The loop iterates through periods and checks if the map already contains the ID via .has(period.id)
4. If the ID exists, the new index is not written to the Map
5. Existing animations or repositioning logic use an outdated index from the Map

**Недостающие звенья causal chain:**

- ❓ Implementation of periodsSlice state transitions (whether IDs are stable and order is static)

**Требуемый контекст:**

- 📥 Implementation of periodsSlice state transitions (whether IDs are stable and order is static)

**Рекомендация:** Ensure the cache is either cleared or fully updated whenever the periods array changes to maintain synchronization between index and ID.

**Затронутые места:**

- **useEffect (dotPositionsRef update)** (evidence: high)

  ```
  periods.forEach((period, index) => {
              if (!dotPositionsRef.current.has(period.id)) {
                  dotPositionsRef.current.set(period.id, index);
              }
          });
  ```

---

## 💡 Улучшения (0)

_Улучшений не найдено._

### Файл: ../../data/shared/src/Components/Circle/utils.ts

# Code Review: `utils.ts`

**Путь:** `../../data/shared/src/Components/Circle/utils.ts`
**Язык:** typescript
**Роль:** Utility Library
**Слой:** Shared / UI Logic
**Ответственность:** Calculating coordinates and positions for elements arranged in a circular layout.
**Уверенность в контексте:** Высокая

---

## 📊 Общая оценка

**Качество:** acceptable
**Критические проблемы:** 🟢 Нет
**Уверенность ревью:** Высокая
**Требует контекста:** 🟢 Нет

**Заметки:** The file implements mathematical logic for circular distribution. The primary concern is the lack of protection against division by zero in coordinate calculation functions.

---

## 🔍 Замечания (1)

### 🟡 F-001: Potential division by zero in coordinate calculations

| Параметр | Значение |
| :--- | :--- |
| Тип | ✅ Подтверждённая проблема |
| Категория | correctness |
| Severity | 🟡 medium |
| Уверенность | Высокая |
| Release impact | ⚠️ Fix before release |
| Fallback | ❌ Нет |
| Предыдущее замечание | new |

**Что найдено:** The functions getPercentageByDotIndex and getDotCoordinates perform division by the total count of elements (dotsLength / dotsNumber) without verifying that these values are non-zero.

**Почему важно:** Division by zero in JavaScript results in NaN or Infinity, which leads to invalid numerical results for subsequent calculations and coordinate placement.

**Сценарий:** The utility functions are called with a dataset containing zero elements.

**Условие проявления:** dotsLength === 0 or dotsNumber === 0

**Causal chain:**

1. divisor (dotsLength/dotsNumber) is passed as 0
2. division operation is performed
3. result becomes NaN or Infinity
4. invalid numerical value is returned to the caller

**Рекомендация:** Add a guard clause to return a default value (e.g., 0) or handle the zero-case explicitly before performing division.

**Затронутые места:**

- **getPercentageByDotIndex** (evidence: high)

  ```
  dotIndex / dotsLength
  ```
- **getDotCoordinates** (evidence: high)

  ```
  const position = dotIndex / dotsNumber;
  ```

---

## 💡 Улучшения (0)

_Улучшений не найдено._





### Components_EventCardList

1. ../../data/shared/src/Components/EventCardList/EventCardList.tsx – UI Component в Presentation Layer, отвечает за рендер карусели карточек событий с навигационными контролами и обработку пустых/loading/error состояний через Redux‑селекторы; качество acceptable, критических проблем нет, уверенность ревью высокая.  
2. 🟡 F-001: Missing explicit rendering for loading and error states – ✅ подтверждённая проблема, severity medium, Release impact Fix before release, fallback нет; при `isLoading` или `isError` пользователь не получает визуальной обратной связи и видит пустой контейнер.  
3. 🔵 F-002: Navigation visibility state desynchronization on mobile toggle – ⚠️ условный риск, severity low, Release impact Backlog; кнопки навигации обновляются только в колбэках Swiper и могут не отразить изменение пропса `isMobile` до наступления события Swiper.  
4. Условный риск: неизвестно, будет ли Swiper автоматически вызывать `onUpdate` при изменении родительских пропсов, fallback неизвестен, что может влиять на синхронизацию видимости навигационных кнопок.  
5. I-001: Memoization of Swiper breakpoints – рекомендация по производительности; объект `SWIPER_BREAKPOINTS` объявлен как const и рекомендуется оставить так или использовать `useMemo`, если значения станут динамическими, чтобы избежать переинициализации Swiper при каждом рендере.  
6. Дополнительное замечание: анализ требует понимания требований версии библиотеки Swiper к событию `onUpdate` при изменении пропсов, что ограничивает полную оценку поведения компонента.  
7. Приоритетные действия: реализовать явные UI‑ветки для состояний loading и error до основного возврата карусели; добавить `useEffect`, отслеживающий изменения `isMobile`, и вручную вызывать `updateNavigation(swiperRef.current)` для синхронизации видимости кнопок навигации.



### Файл: ../../data/shared/src/Components/EventCardList/EventCardList.tsx

# Code Review: `EventCardList.tsx`

**Путь:** `../../data/shared/src/Components/EventCardList/EventCardList.tsx`
**Язык:** typescript
**Роль:** UI Component
**Слой:** Presentation Layer
**Ответственность:** Rendering a carousel of event cards with navigation controls and handling empty/loading/error states via Redux selectors.
**Уверенность в контексте:** Высокая

---

## 📊 Общая оценка

**Качество:** acceptable
**Критические проблемы:** 🟢 Нет
**Уверенность ревью:** Высокая
**Требует контекста:** 🟢 Нет

**Заметки:** The component is well-structured but lacks explicit rendering branches for loading and error states, which can lead to a degraded user experience.

---

## 🔍 Замечания (2)

### 🟡 F-001: Missing explicit rendering for loading and error states

| Параметр | Значение |
| :--- | :--- |
| Тип | ✅ Подтверждённая проблема |
| Категория | error_handling |
| Severity | 🟡 medium |
| Уверенность | Высокая |
| Release impact | ⚠️ Fix before release |
| Fallback | ❌ Нет |
| Предыдущее замечание | new |

**Что найдено:** The component retrieves `isLoading` and `isError` via selectors, but does not define specific UI branches to render when these states are active.

**Почему важно:** Users receive no visual feedback during data fetching or in the event of a request failure. The current logic only handles the 'empty and successful' state explicitly.

**Сценарий:** An API request fails or is still pending while the component is mounted.

**Условие проявления:** `isLoading` is true OR `isError` is true

**Causal chain:**

1. The conditional check `if (eventsList.length === 0 && !isLoading && !isError)` evaluates to false when `isLoading` or `isError` is true.
2. Execution moves to the main return statement.
3. If `eventsList` is empty during loading or error, `eventsList.map` results in an empty list of slides.
4. The user sees an empty container or a carousel with no content without any indication of why.

**Рекомендация:** Implement explicit rendering paths (e.g., skeletons for loading and an error message/retry button for error state) before the main carousel return.

**Затронутые места:**

- **EventCardList** (evidence: high)

  ```
  if (eventsList.length === 0 && !isLoading && !isError)
  ```

---

### 🔵 F-002: Navigation visibility state desynchronization on mobile toggle

| Параметр | Значение |
| :--- | :--- |
| Тип | ⚠️ Условный риск |
| Категория | correctness |
| Severity | 🔵 low |
| Уверенность | Средняя |
| Release impact | 📋 Backlog |
| Fallback | ❓ Неизвестно |
| Предыдущее замечание | new |

**Что найдено:** The visibility of navigation buttons (`leftButtonVisible`, `rightButtonVisible`) is updated only within Swiper event callbacks, but depends on the `isMobile` prop.

**Почему важно:** If the `isMobile` prop changes (e.g., due to window resize or layout shift), the UI will not immediately reflect this change until a Swiper event occurs, potentially leaving desktop navigation buttons visible on mobile devices.

**Сценарий:** The application switches from desktop to mobile view while the carousel is already rendered.

**Условие проявления:** Change of `isMobile` prop value without an immediate Swiper event trigger (like slide change or update).

**Causal chain:**

1. `isMobile` prop changes -> Component re-renders.
2. The render logic checks `{leftButtonVisible && ...}`, which relies on state updated by `updateNavigation`.
3. `updateNavigation` is only called during Swiper events (`onInit`, `onUpdate`, `onSlideChange`, etc.).
4. The local state `leftButtonVisible` remains in its previous value until a swiper event triggers the callback with the new `isMobile` value.

**Недостающие звенья causal chain:**

- ❓ Whether the Swiper component automatically triggers `onUpdate` when parent props change

**Требуемый контекст:**

- 📥 Swiper library requirements for the used library version regarding event triggering on prop updates

**Рекомендация:** Use a `useEffect` hook to monitor changes to `isMobile` and manually invoke `updateNavigation(swiperRef.current)` to synchronize button visibility.

**Затронутые места:**

- **updateNavigation** (evidence: high)

  ```
  setLeftButtonVisible(!isMobile && !swiper.isBeginning);
  ```

---

## 💡 Улучшения (1)

### I-001: Memoization of Swiper breakpoints

| Параметр | Значение |
| :--- | :--- |
| Категория | performance |
| Уверенность | Высокая |
| Release impact | 📋 Backlog |

**Описание:** The `SWIPER_BREAKPOINTS` object is defined outside the component as a constant, which is correct. However, ensure that if these values ever become dynamic, they are memoized to prevent Swiper from re-initializing on every render.

**Рекомендация:** Keep it as a constant (as currently implemented) or use `useMemo` if breakpoints depend on props/state in the future.

**Evidence:**

```
const SWIPER_BREAKPOINTS = { ... } as const;
```

---





### Components_Header

1. ../../data/shared/src/Components/Header/Header.tsx — Container Component в UI‑слое, отвечает за подключение состояния заголовка из Redux‑store к презентационному HeaderUI; общая оценка качества acceptable, критических проблем нет, уверенность в контексте высокая.  
2. Условный риск (low severity) F-001: небезопасное деструктурирование результата `useSelector(selectHeader)` без проверки на null/undefined.  
3. Отсутствует реализация и тип возвращаемого значения селектора `selectHeader`, из‑за чего нельзя полностью оценить корректность работы компонента.  
4. При условии, что `selectHeader` вернёт null или undefined (например, во время гидратации состояния или после неудачного API‑запроса), попытка деструктурировать приведёт к runtime TypeError и падению приложения.  
5. Рекомендация: добавить проверку на null/undefined либо задать значения по умолчанию перед деструктурированием селектора; это относится к улучшениям типизации и надёжности компонента.  
6. Анализ ограничен отсутствием контекста реализации `selectHeader`, поэтому полная оценка поведения невозможна.  
7. Приоритетное действие: внедрить null‑check или значения по умолчанию перед деструктурированием результата `useSelector(selectHeader)`.



### Файл: ../../data/shared/src/Components/Header/Header.tsx

# Code Review: `Header.tsx`

**Путь:** `../../data/shared/src/Components/Header/Header.tsx`
**Язык:** typescript
**Роль:** Container Component
**Слой:** UI Layer
**Ответственность:** Connecting the header state from the store to the presentational HeaderUI component.
**Уверенность в контексте:** Высокая

---

## 📊 Общая оценка

**Качество:** acceptable
**Критические проблемы:** 🟢 Нет
**Уверенность ревью:** Средняя
**Требует контекста:** ⚠️ Да

**Недостающий контекст:**

- Implementation and return type of selectHeader

**Заметки:** The component is a simple wrapper. The main risk involves the assumption that the selector always returns an object.

---

## 🔍 Замечания (1)

### 🔵 F-001: Unsafe destructuring of selector result

| Параметр | Значение |
| :--- | :--- |
| Тип | ⚠️ Условный риск |
| Категория | correctness |
| Severity | 🔵 low |
| Уверенность | Средняя |
| Release impact | 📋 Backlog |
| Fallback | ❌ Нет |
| Предыдущее замечание | new |

**Что найдено:** The component performs immediate destructuring of the result returned by `useSelector(selectHeader)` without verifying if the result is null or undefined.

**Почему важно:** If the selector returns a nullish value (e.g., during initial state hydration, loading states, or after a failed API call that clears the slice), the application will throw a TypeError and crash.

**Сценарий:** The component mounts while the Redux store state for the header is not yet initialized or has been set to null/undefined.

**Условие проявления:** selectHeader returns null or undefined

**Causal chain:**

1. useSelector(selectHeader) is called
2. The selector returns a value that is null or undefined
3. The code attempts to destructure properties from this nullish value
4. A runtime TypeError is thrown, causing the component to crash

**Требуемый контекст:**

- 📥 Implementation of selectHeader and its return type

**Рекомендация:** Introduce a null check or provide default values before destructuring the selector result.

**Затронутые места:**

- **Header** (evidence: high)

  ```
  const { 
          fullName, 
          role, 
          description, 
          tg_link, 
          tg_link_aria_label 
      }: HeaderData = useSelector(selectHeader);
  ```

---

## 💡 Улучшения (0)

_Улучшений не найдено._





