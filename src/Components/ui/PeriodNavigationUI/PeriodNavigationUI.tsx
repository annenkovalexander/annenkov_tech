import { memo } from 'react';
import clsx from 'clsx';
import styles from './PeriodNavigationUI.module.scss';
import type { UUID } from '../../../types/period';

interface PeriodNavigationProps {
    periodIds: UUID[];
    activePeriodIndex: number;
    containerAriaLabel: string;
    bulletAriaLabelFn?: (index: number) => string;
    onPeriodClick: (periodId: UUID) => void;
}

const PeriodNavigationUI = ({
    periodIds,
    activePeriodIndex,
    onPeriodClick,
    containerAriaLabel,
    bulletAriaLabelFn = () => '',
}: PeriodNavigationProps) => (
    <nav className={styles.container} aria-label={containerAriaLabel}>
        {periodIds.map((periodId, index) => {
            const isActive = index === activePeriodIndex;
            return (
                <button
                    key={periodId}
                    type="button"
                    className={clsx(
                        styles.bulletButton,
                        isActive && styles.activeBullet,
                    )}
                    onClick={() => onPeriodClick(periodId)}
                    aria-label={bulletAriaLabelFn(index + 1)}
                    aria-current={isActive ? 'true' : undefined}
                />
            );
        })}
    </nav>
);

export default memo(PeriodNavigationUI);