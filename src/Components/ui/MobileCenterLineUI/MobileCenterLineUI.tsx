import { forwardRef } from 'react';
import styles from './MobileCenterLineUI.module.scss';

const MobileCenterLineUI = forwardRef<HTMLDivElement, {}>((_, ref) => (
        <div ref={ref} className={styles.line} />
    ))

export default MobileCenterLineUI;