import periodsData from '../mock.json';
export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export type Event = {
    id: UUID,
    year: number,
    description: string
};

export type Period = {
    id: UUID,
    category: string,
    periodText: string,
    startYear: number,
    endYear: number,
    events: Event[]
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isUUID = (value: unknown): value is UUID =>
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
        throw new Error("Структура пришедших данных отличается от Period");
    }
}

export const fetchData = (delay: number): Promise<Period[]> => 
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

