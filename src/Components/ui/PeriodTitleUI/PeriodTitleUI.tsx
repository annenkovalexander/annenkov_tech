import { forwardRef } from 'react';
import styles from './PeriodTitleUI.module.scss';

interface PeriodTitleUIProps {
    periodTitle: string;
}

const PeriodTitleUI= forwardRef<HTMLDivElement, PeriodTitleUIProps>(({periodTitle}, ref) => (
        <div ref={ref} className={styles.container}>
            <h3 className={styles.periodTitle}>{periodTitle}</h3>
        </div>
    ))

export default PeriodTitleUI;