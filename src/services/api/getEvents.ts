import periods from '../mock.json';
type UUID = `${string}-${string}-${string}-${string}-${string}`;
export type Event = {
    id: string,
    year: number,
    description: string
};

export type Period = {
    category: string,
    periodId: string,
    startYear: number,
    endYear: number,
    events: Event[]
}

export const getEvents: (periods: Period[], currentPeriodId: string) => Event[] = (periods, currentPeriodId) => {
    const currentPeriodData = periods.find((period) => period.periodId === currentPeriodId)
    if (currentPeriodData && currentPeriodData.events && Array.isArray(currentPeriodData.events))
        return currentPeriodData.events
    else
        return [];
}

export const fetchData: (delay: number) => Promise<Response> = (delay) => 
    new Promise((resolve, reject) => {
        const periodsData = periods.map((period) => ({
            ...period,
            events: period.events.map((event, index) => ({
                ...event,
                id: String(index+1)
            }))
        }))
        const response = new Response(JSON.stringify(periodsData), {
            headers: { 'Content-Type': 'application/json' }
        })
        setTimeout(() => resolve(response), delay)
    });

