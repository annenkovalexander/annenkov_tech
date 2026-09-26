import type { SyntheticEvent } from 'react';
import { clsx } from 'clsx';
import styles from './PeriodControlsUI.module.scss';

interface TPeriodControls {
    periodsNumber: number;
    periodNumber: number;
    buttonsActive: boolean[];
    isMobile: boolean;
    controlsHandler: (buttonId: number) => (e: SyntheticEvent<HTMLButtonElement>) => void;
}

const PeriodControlsUI: React.FC<TPeriodControls> = ({periodsNumber, periodNumber, buttonsActive, isMobile, controlsHandler}) => (
        <div className={isMobile ? styles.paginationContainer : ''}>
            <div className={clsx([styles.container, isMobile ? styles.mobile : ''])}>
                <p className={styles.periodText}>0{String(periodNumber)}/0{String(periodsNumber)}</p>
                <div className={styles.buttonsContainer}>
                    <button className={clsx([styles.button,  styles.leftButton, !buttonsActive[0] ? styles.buttonDisabled : ""])} disabled={!buttonsActive[0]} onClick={controlsHandler(1)} />
                    <button className={clsx([styles.button,  styles.rightButton, !buttonsActive[1] ? styles.buttonDisabled : ""])} disabled={!buttonsActive[1]} onClick={controlsHandler(2)} />
                </div>
            </div>
        </div>
    )
export default PeriodControlsUI;