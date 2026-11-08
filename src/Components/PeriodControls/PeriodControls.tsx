import { useCallback, useMemo } from "react";
import PeriodControlsUI from "../ui/PeriodControlsUI/PeriodControlsUI";
import { useDispatch, useSelector } from "../../../src/services/store";
import {
    decrementPeriod,
    incrementPeriod,
    getCurrentPeriod,
} from "../../../src/services/slices/periodsSlice";
import Pagination from "../PeriodNavigation/PeriodNavigation";
import styles from "./PeriodControls.module.scss";
import { findPeriodIndex, getButtonsActive, getPeriodsText } from "./utils";
import type { Period } from "../../types/period";

export interface PeriodControlsProps {
    isMobile: boolean;
    periods: Period[];
}

const PeriodControls: React.FC<PeriodControlsProps> = ({
    isMobile,
    periods,
}) => {
    const dispatch = useDispatch();
    const activePeriodId = useSelector(getCurrentPeriod);

    // Determine a safe active index; fallback to the first period if not found
    const activePeriodIndex = useMemo(() => {
        const idx = findPeriodIndex(periods, activePeriodId);
        return idx >= 0 ? idx : 0;
    }, [periods, activePeriodId]);

    const buttonsActive = useMemo(
        () => getButtonsActive(periods.length, activePeriodIndex),
        [periods.length, activePeriodIndex]
    );
    const periodsText = useMemo(
        () => getPeriodsText(periods.length, activePeriodIndex),
        [periods.length, activePeriodIndex]
    );

    const handlePrev = useCallback(() => {
        dispatch(decrementPeriod());
    }, [dispatch]);

    const handleNext = useCallback(() => {
        dispatch(incrementPeriod());
    }, [dispatch]);

    // If there are no periods at all, render nothing
    if (!periods.length) {
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
            {isMobile && (
                <Pagination
                    periods={periods}
                    activePeriodIndex={activePeriodIndex}
                />
            )}
        </div>
    );
};

export default PeriodControls;