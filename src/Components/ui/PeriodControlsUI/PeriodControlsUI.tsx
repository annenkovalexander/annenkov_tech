import { clsx } from 'clsx';
import styles from './PeriodControlsUI.module.scss';
import type { PeriodButtonsEnabled } from '../../PeriodControls/utils';

interface PeriodControlsProps {
    periodsText: string;
    buttonsActive: PeriodButtonsEnabled;
    isMobile: boolean;
    onPrev: () => void;
    onNext: () => void;
}

const PeriodControlsUI = ({
    periodsText,
    buttonsActive,
    isMobile,
    onPrev,
    onNext,
}: PeriodControlsProps) => (
    <div className={isMobile ? styles.paginationContainer : ''}>
        <div className={clsx(
            styles.container, 
            isMobile && styles.mobile
        )}>
            <p className={styles.periodText}>{periodsText}</p>
            <div className={styles.buttonsContainer}>
                <button
                    type="button"
                    className={clsx(
                        styles.button,
                        styles.leftButton,
                        !buttonsActive.prevEnabled && styles.buttonDisabled,
                    )}
                    disabled={!buttonsActive.prevEnabled}
                    onClick={onPrev}
                    aria-label="Предыдущий период"
                />
                <button
                    type="button"
                    className={clsx(
                        styles.button,
                        styles.rightButton,
                        !buttonsActive.nextEnabled && styles.buttonDisabled,
                    )}
                    disabled={!buttonsActive.nextEnabled}
                    onClick={onNext}
                    aria-label="Следующий период"
                />
            </div>
        </div>
    </div>
);

export default PeriodControlsUI;