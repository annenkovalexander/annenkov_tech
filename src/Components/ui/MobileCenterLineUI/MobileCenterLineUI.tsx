import { forwardRef } from 'react';
import styles from './MobileCenterLineUI.module.scss';

const MobileCenterLineUI = forwardRef<HTMLDivElement, {}>((props, ref) => (
        <div ref={ref} className={styles.line} />
    ))

export default MobileCenterLineUI;