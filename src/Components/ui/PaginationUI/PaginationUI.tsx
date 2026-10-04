import clsx from 'clsx';
import { memo } from 'react';
import styles from './PaginationUI.module.scss';
import type { Period } from '../../../services/api/getEvents';


interface PaginationUIProps {
    periods: Period[];
    periodNumber: number;
    handleDotClicks: React.MouseEventHandler<HTMLDivElement>[];
}

const PaginationUI: React.FC<PaginationUIProps> = ({periods, periodNumber, handleDotClicks}) => 
     (
        <div className={styles.container}>
            {periods.map((_, index) => (
                <div key={index} className={clsx([styles.r, periodNumber - 1 === index ? styles.activeBullet : ''])} onClick={handleDotClicks[index]}/>
            ))}
        </div>
    )

export default memo(PaginationUI);