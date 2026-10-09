import type { SyntheticEvent } from 'react';
import { clsx } from 'clsx';
import styles from './PeriodControlsUI.module.scss';
import { DIRECTIONS } from '../../PeriodControls/PeriodControls';

interface TPeriodControls {
    periodsText: string;
    buttonsActive: [boolean, boolean];
    isMobile: boolean;
    controlsHandler: (e: SyntheticEvent<HTMLButtonElement>) => void;
}



const PeriodControlsUI: React.FC<TPeriodControls> = ({periodsText, buttonsActive, isMobile, controlsHandler}) => (
        <div className={isMobile ? styles.paginationContainer : ''}>
            <div className={clsx([styles.container, isMobile ? styles.mobile : ''])}>
                <p className={styles.periodText}>{periodsText}</p>
                <div className={styles.buttonsContainer}>
                    <button
                        type="button"
                        data-direction={DIRECTIONS.PREV}
                        className={clsx(
                            styles.button,
                            styles.leftButton,
                            !buttonsActive[0] && styles.buttonDisabled,
                        )}
                        disabled={!buttonsActive[0]}
                        onClick={controlsHandler}
                        aria-label="Предыдущий период"
                    />

                    <button
                        type="button"
                        data-direction={DIRECTIONS.NEXT}
                        className={clsx(
                            styles.button,
                            styles.rightButton,
                            !buttonsActive[1] && styles.buttonDisabled,
                        )}
                        disabled={!buttonsActive[1]}
                        onClick={controlsHandler}
                        aria-label="Следующий период"
                    />
                </div>
            </div>
        </div>
    )
export default PeriodControlsUI;