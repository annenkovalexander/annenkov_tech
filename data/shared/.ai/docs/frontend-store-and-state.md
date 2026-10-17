# Frontend Store and State

Этот файл сгенерирован автоматически из `src/services`. Он описывает Redux-слайсы, асинхронные операции и селекторы, используемые во фронтенде.

## Slices

### Slice `header`

Файл: `services/slices/headerSlice.ts`

_Поля initialState не обнаружены._

### Slice `periods`

Файл: `services/slices/periodsSlice.ts`

| State field |
| :---------- |
| `pageTitle` |
| `currentPeriodId` |
| `periods` |
| `isLoading` |
| `error` |

## Thunks

_Thunks не найдены._

## Selectors

| Selector | File |
| :------- | :--- |
| `isUUID` | `services/api/getEvents.ts` |
| `fetchData` | `services/api/getEvents.ts` |
| `getPeriodById` | `services/slices/utils.ts` |
| `getPeriodIndexById` | `services/slices/utils.ts` |
| `applyPeriods` | `services/slices/utils.ts` |
