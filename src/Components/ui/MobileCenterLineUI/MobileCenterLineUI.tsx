import { forwardRef } from 'react';
import styles from './MobileCenterLineUI.module.scss';

type MobileCenterLineUIProps = object

const MobileCenterLineUI = forwardRef<HTMLDivElement, MobileCenterLineUIProps>((_, ref) => (
    <div ref={ref} className={styles.line} />
))

export default MobileCenterLineUI;