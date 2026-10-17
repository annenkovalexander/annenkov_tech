import PeriodUI from "../ui/PeriodUI/PeriodUI";
import { useSelector } from "../../../src/services/store";
import { getCurrentPeriodData } from "../../../src/services/slices/periodsSlice";
import styles from './Period.module.scss';
import { getYearList } from "./utils";
import { usePrevious } from "../../services/hooks/usePrevious";
import { useMemo } from "react";

interface PeriodProps {
    isLoading: boolean;
}

const parsedLoadingMessage = process.env.LOADING_MESSAGE ?? 'Загружаем периоды...';

const Period = ({
    isLoading,
}: PeriodProps) => {
    const yearsData = useSelector(getCurrentPeriodData);
    const previousYearStart = usePrevious(yearsData?.startYear);
    const previousYearEnd = usePrevious(yearsData?.endYear);
    const currentYear = new Date().getFullYear();
    const startYear = yearsData && yearsData.startYear ? yearsData.startYear : currentYear;
    const endYear = yearsData && yearsData.endYear ? yearsData.endYear : currentYear;
    const yearsListStartYear = useMemo(
        () => getYearList(startYear, previousYearStart ?? currentYear),
        [startYear, previousYearStart, currentYear],
    );
    const yearsListEndYear = useMemo(
        () => getYearList(endYear, previousYearEnd ?? currentYear),
        [endYear, previousYearEnd, currentYear],
    );
    if (isLoading) {
        return (
            <div className={styles.container} role="status">
                {parsedLoadingMessage}
            </div>
        );
    }
    return (
        <PeriodUI
            yearsListStartYear={yearsListStartYear}
            yearsListEndYear={yearsListEndYear}
        />
    );
};

export default Period;