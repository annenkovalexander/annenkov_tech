import { useCallback, useMemo } from 'react';
import { periodChange } from '../../services/slices/periodsSlice';
import { useDispatch } from '../../services/store';
import PeriodNavigationUI from '../ui/PeriodNavigationUI/PeriodNavigationUI';
import type { Period, UUID } from '../../types/period';

export interface PeriodNavigationProps {
    periods: Period[];
    activePeriodIndex: number;
}

const ARIA_LABEL_MOBILE_PERIOD_NAVIGATION =
    process.env.ARIA_LABEL_MOBILE_PERIOD_NAVIGATION ?? 'Выберите период';

const PeriodNavigation = ({
    periods,
    activePeriodIndex,
}: PeriodNavigationProps) => {
    const dispatch = useDispatch();
    const onPeriodClick = useCallback((periodId: UUID) => {
        dispatch(periodChange({ id: periodId }));
    }, [dispatch]);
    const periodIds = useMemo(
        () => periods.map((period) => period.id),
        [periods],
    );
    return (
        <PeriodNavigationUI
            periodIds={periodIds}
            activePeriodIndex={activePeriodIndex}
            onPeriodClick={onPeriodClick}
            ariaLabelLocalized={ARIA_LABEL_MOBILE_PERIOD_NAVIGATION}
        />
    );
};

export default PeriodNavigation;