import { useCallback, useMemo } from "react"
import PeriodControlsUI from "../ui/PeriodControlsUI/PeriodControlsUI";
import { useDispatch, useSelector } from "../../../src/services/store";
import { decrementPeriod, incrementPeriod, getCurrentPeriod } from "../../../src/services/slices/periodsSlice";
import Pagination from "../PeriodNavigation/PeriodNavigation";
import styles from './PeriodControls.module.scss';
import { findPeriodIndex, getButtonsActive, getPeriodsText } from "./utils";
import type { Period } from "../../services/api/getEvents";

export interface PeriodControlsProps {
    isMobile: boolean;
    periods: Period[];
}

const PeriodControls: React.FC<PeriodControlsProps> = ({isMobile, periods}) => {
    const dispatch = useDispatch();
    const activePeriodId = useSelector(getCurrentPeriod);
    const activePeriodIndex = useMemo(() => findPeriodIndex(periods, activePeriodId), [periods, activePeriodId]);
    const buttonsActive = useMemo(() => getButtonsActive(periods.length, activePeriodIndex), [periods.length, activePeriodIndex]);
    const periodsText = useMemo(() => getPeriodsText(periods.length, activePeriodIndex), [periods.length, activePeriodIndex]);
    const handlePrev = useCallback(() => {
        dispatch(decrementPeriod());
    }, [dispatch]);
    const handleNext = useCallback(() => {
        dispatch(incrementPeriod());
    }, [dispatch]);
    
    if (!periods.length || activePeriodIndex < 0) {
        return null;
    }
    
    return (
        <div className={styles.container}>
            <PeriodControlsUI 
                periodsText={periodsText} 
                buttonsActive={buttonsActive} 
                onPrev={handlePrev} 
                onNext={handleNext} 
                isMobile={isMobile}
            />
            {isMobile && <Pagination periods={periods} activePeriodIndex={activePeriodIndex}/>}
        </div>
    )
}

export default PeriodControls;