import React, { useEffect, useRef, useState } from "react";
import PeriodUI from "../ui/PeriodUI/PeriodUI";
import { useSelector } from "../../../src/services/store";
import { getCurrentPeriodData } from "../../../src/services/slices/periodsSlice";
import styles from './Period.module.scss';


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
        year1Old.current = yearsData?.startYear! ?? 2026;
        year2Old.current = yearsData?.endYear! ?? 2026;
    }, [yearsData]);
    if (yearsData) {
        return (
            <>
                <PeriodUI year1List={yearsData && year1Old.current ? getYearList(yearsData!.startYear!, year1Old.current) : getYearList(yearsData!.startYear!, yearsData!.startYear!)} year2List={year2Old.current ? getYearList(yearsData!.endYear!, year2Old.current) : getYearList(yearsData!.endYear!, yearsData!.endYear!)} />
            </>
        )
    }
    else {
        return (
            <div className={styles.container}>
                Загружаем события...
            </div>
        )
    }
       
}

export default Period;