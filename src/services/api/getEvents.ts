/*
    TODO: после реализации API получать периоды GET-запросом из внешнего API
    TODO: уйти от использования mock.json
    TODO: рассмотреть создание отдельного класса DataValidationError для ошибок валидации входных данных
*/

import periodsData from '../mock.json';
import type { Period, UUID, Event } from '../../types/period';

export class DataValidationError extends Error {
    constructor(message = 'Структура данных не соответствует контракту Period') {
        super(message);
        this.name = 'DataValidationError';
    }
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

export const isUUID = (value: unknown): value is UUID =>
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)

const isEvent = (value: unknown): value is Event => 
    isRecord(value) && 
    isUUID(value.id) && 
    typeof value.year === 'number' &&
    Number.isFinite(value.year) &&
    typeof value.description === 'string'

const isPeriod = (value: unknown): value is Period =>
    isRecord(value) &&
    isUUID(value.id) &&
    typeof value.category === "string" &&
    typeof value.periodText === "string" &&
    typeof value.startYear === "number" &&
    Number.isFinite(value.startYear) &&
    typeof value.endYear === "number" &&
    Number.isFinite(value.endYear) &&
    Array.isArray(value.events) &&
    value.events.every((event) => isEvent(event));



export const getEvents: (periods: Period[], currentPeriodId: string) => Event[] = (periods, currentPeriodId) => 
    periods.find((period) => period.id === currentPeriodId)?.events ?? [];

const getPeriods = (): Period[] => {
    if (periodsData && Array.isArray(periodsData) && periodsData.every((period) => isPeriod(period))) {
        return periodsData as Period[];
    } else {
        throw new DataValidationError("Структура пришедших данных отличается от Period");
    }
}

export const fetchData = (delay: number): Promise<ReadonlyArray<Period>> => 
    new Promise((resolve, reject) => {
        if (!Number.isFinite(delay) || delay < 0) {
            reject(new Error("Значение задержки имеет недопустимое значение"));
        } else {
            setTimeout(() => {
                try {
                    resolve(getPeriods());
                } catch (error) {
                    const rejectionError = error instanceof Error ? error : new Error("Возникла непредвиденная ошибка");
                    reject(rejectionError);
                }
            }, delay)
        }
    });

