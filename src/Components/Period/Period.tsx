import React, { useEffect, useRef, useState } from "react";
import PeriodUI from "../ui/PeriodUI/PeriodUI";
import { useSelector } from "../../../src/services/store";
import { getCurrentPeriodData } from "../../../src/services/slices/periodsSlice";
import styles from './Period.module.scss';
import { getYearList } from "./utils";


const Period: React.FC = () => {
    const yearsData = useSelector(getCurrentPeriodData);
    const yearStartOld = useRef<number>(new Date().getFullYear());
    const yearEndOld = useRef<number>(new Date().getFullYear());
    useEffect(() => {
        yearStartOld.current = yearsData?.startYear ?? new Date().getFullYear();
        yearEndOld.current = yearsData?.endYear ?? new Date().getFullYear();
    }, [yearsData]);
    if (yearsData?.startYear && yearsData?.endYear) {
        const yearsListStartYear = getYearList(yearsData.startYear, yearStartOld.current)
        const yearsListEndYear = getYearList(yearsData.endYear, yearEndOld.current)
        return (
            <>
                <PeriodUI yearsListStartYear={yearsListStartYear} yearsListEndYear={yearsListEndYear} />
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