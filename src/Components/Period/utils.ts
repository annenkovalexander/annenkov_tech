const MAX_YEARS_RANGE = 10000;

export const getYearList = (year: number, yearOld: number): number[] => {
    if (!Number.isInteger(year) || !Number.isInteger(yearOld)) {
        return [];
    }

    const diff = Math.abs(year - yearOld);

    if (diff > MAX_YEARS_RANGE) {
        return [];
    }

    const step = year < yearOld ? -1 : 1;
    return Array.from(
        { length: diff + 1 }, 
        (_, index) => yearOld + index * step
    );
};