import React, { useEffect, useRef, useState } from "react";
import PeriodUI from "../ui/PeriodUI/PeriodUI";
import { useSelector } from "../../../src/services/store";
import { getCurrentPeriodData } from "../../../src/services/slices/periodsSlice";


type TYearOld = {
    year1Old: number;
    year2Old: number;
}

const getYearList: (year: number, yearOld: number) => number[] = (year, yearOld) => {
    let resultList = [];
    let step = 1;
    if (year < yearOld) {
        step = -1;
    }
    resultList = Array.from({length: (year - yearOld) / step + 1}, (_, i) => yearOld + i * step);
    return resultList;
}

const Period: React.FC = () => {
    const yearsData = useSelector(getCurrentPeriodData);
    const year1Old = useRef<number>();
    const year2Old = useRef<number>();
    useEffect(() => {
        year1Old.current = yearsData.year1;
        year2Old.current = yearsData.year2;
    }, [yearsData]);
    return (
        <>
            <PeriodUI year1List={year1Old.current ? getYearList(yearsData.year1, year1Old.current) : getYearList(yearsData.year1, yearsData.year1)} year2List={year2Old.current ? getYearList(yearsData.year2, year2Old.current) : getYearList(yearsData.year2, yearsData.year2)} />
        </>
    )   
}

export default Period;