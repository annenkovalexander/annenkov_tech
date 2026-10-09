import { useEffect, useRef } from "react";
import PeriodUI from "../ui/PeriodUI/PeriodUI";
import { useSelector } from "../../../src/services/store";
import { getCurrentPeriodData } from "../../../src/services/slices/periodsSlice";
import styles from './Period.module.scss';
import { getYearList } from "./utils";

interface PeriodProps {
    loadingStatus: string;
}

const Period = ({ loadingStatus }: PeriodProps) => {
    const yearsData = useSelector(getCurrentPeriodData);
    const yearStartOld = useRef<number>(new Date().getFullYear());
    const yearEndOld = useRef<number>(new Date().getFullYear());
    useEffect(() => {
        yearStartOld.current = yearsData?.startYear ?? new Date().getFullYear();
        yearEndOld.current = yearsData?.endYear ?? new Date().getFullYear();
    }, [yearsData]);
    if (loadingStatus) {
        return (
            <div className={styles.container} role="status">
                {loadingStatus}
            </div>
        )
    }
    if (yearsData?.startYear && yearsData?.endYear) {
        const yearsListStartYear = getYearList(yearsData.startYear, yearStartOld.current)
        const yearsListEndYear = getYearList(yearsData.endYear, yearEndOld.current)
        return (
            <>
                <PeriodUI yearsListStartYear={yearsListStartYear} yearsListEndYear={yearsListEndYear} />
            </>
        )
    }
    return null;
       
}

export default Period;