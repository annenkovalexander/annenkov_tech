import clsx from 'clsx';
import { memo, type MouseEventHandler } from 'react';
import styles from './PaginationUI.module.scss';

type PaginationItem = {
    id: string;
};

interface PaginationUIProps {
    paginationItems: PaginationItem[];
    activePeriodIndex: number;
    onPeriodClick: MouseEventHandler<HTMLButtonElement>;
}

const PaginationUI: React.FC<PaginationUIProps> = ({
    paginationItems,
    activePeriodIndex,
    onPeriodClick,
}) => (
    <div className={styles.container}>
        {paginationItems.map((paginationItem, index) => (
            <button
                key={paginationItem.id}
                type="button"
                data-period-id={paginationItem.id}
                className={clsx(
                    styles.r,
                    activePeriodIndex === index && styles.activeBullet,
                )}
                onClick={onPeriodClick}
                aria-label={`Выбрать период ${index + 1}`}
                aria-current={activePeriodIndex === index ? 'true' : undefined}
            />
        ))}
    </div>
);

export default memo(PaginationUI);