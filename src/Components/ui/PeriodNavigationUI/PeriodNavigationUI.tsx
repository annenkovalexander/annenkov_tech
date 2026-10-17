import { memo } from 'react';
import clsx from 'clsx';
import styles from './PeriodNavigationUI.module.scss';
import type { UUID } from '../../../types/period';

interface PeriodNavigationProps {
    periodIds: UUID[];
    activePeriodIndex: number;
    ariaLabelLocalized: string;
    onPeriodClick: (periodId: UUID) => void;
}

const PeriodNavigationUI = ({
    periodIds,
    activePeriodIndex,
    onPeriodClick,
    ariaLabelLocalized,
}: PeriodNavigationProps) => (
    <nav className={styles.container} aria-label="Навигация по периодам">
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
                    aria-label={`${ariaLabelLocalized} ${index + 1}`}
                    aria-current={isActive ? 'true' : undefined}
                />
            );
        })}
    </nav>
);

export default memo(PeriodNavigationUI);