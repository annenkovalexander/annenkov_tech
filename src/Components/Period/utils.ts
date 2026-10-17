export const getYearList = (year: number, yearOld: number): number[] => {
    if (!Number.isInteger(year) || !Number.isInteger(yearOld)) {
        return [];
    }
    const step = year < yearOld ? -1 : 1;
    return Array.from(
        {
            length: Math.abs(year - yearOld) + 1
        }, 
        (_, index) => yearOld + index * step
    );
}