import { memo } from 'react';
import clsx from 'clsx';
import styles from './PaginationUI.module.scss';

type PaginationItem = {
    id: string;
};

interface PaginationUIProps {
    paginationItems: PaginationItem[];
    activePeriodIndex: number;
    onPeriodClick: React.MouseEventHandler<HTMLButtonElement>;
}

const PaginationUI = ({
    paginationItems,
    activePeriodIndex,
    onPeriodClick,
}: PaginationUIProps) => (
    <nav className={styles.container} aria-label="Навигация по периодам">
        {paginationItems.map((item, index) => {
            const isActive = index === activePeriodIndex;

            return (
                <button
                    key={item.id}
                    type="button"
                    data-period-id={item.id}
                    className={clsx(
                        styles.bulletButton,
                        isActive && styles.activeBullet,
                    )}
                    onClick={onPeriodClick}
                    aria-label={`Перейти к периоду ${index + 1}`}
                    aria-current={isActive ? 'true' : undefined}
                />
            );
        })}
    </nav>
);

export default memo(PaginationUI);