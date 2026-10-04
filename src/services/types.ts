export type PeriodType = {
    "category": string,
    "periodId": string,
    "year1": number,
    "year2": number,
    "events": {
        "year": number,
        "description": string
    }[]
}