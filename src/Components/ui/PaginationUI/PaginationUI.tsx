// import '../../EventCardList/swiper-pagination';
import clsx from 'clsx';
import styles from './PaginationUI.module.scss';
import type { periodType } from '../../../../src/services/types';


interface PaginationUIProps {
    periods: periodType[];
    currentPeriod: number;
    handleDotClicks: React.MouseEventHandler<HTMLDivElement>[];
}

const PaginationUI: React.FC<PaginationUIProps> = ({periods, currentPeriod, handleDotClicks}) => 
    // const currentPeriodString = String(currentPeriod);
     (
        <div>
            {periods.map((period, index) => (
                <div key={index} className={clsx([styles.r, currentPeriod - 1 === index ? styles.activeBullet : ''])} onClick={handleDotClicks[index]}/>
            ))}
        </div>
    )

export default PaginationUI;