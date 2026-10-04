export const getYearList = (year: number, yearOld: number): number[] => {
    let resultList: number[] = [];
    let step = 1;
    if (year < yearOld) {
        step = -1;
    }
    resultList = Array.from(
        {length: (year - yearOld) / step + 1}, 
        (_, i) => yearOld + i * step
    );
    return resultList;
}