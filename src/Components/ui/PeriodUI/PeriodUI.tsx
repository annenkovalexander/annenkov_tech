import {clsx} from 'clsx';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

import styles from './PeriodUI.module.scss';

interface TPeriodUIProps {
    year1List: number[];
    year2List: number[];
}



const PeriodUI: React.FC<TPeriodUIProps> = ({year1List, year2List}) => {
    const container = useRef<HTMLDivElement | null>(null);
    const year1Ref = useRef<HTMLSpanElement | null>(null);
    const year2Ref = useRef<HTMLSpanElement | null>(null);
    useGSAP(() => {
        const tl1 = gsap.timeline({
            repeat: 0,
            defaults: { 
                duration: 1 / year1List.length, 
                modifiers: {
                    textContent: (value) => Math.round(Number(value)).toString()
                }}
            }
        );
        const tl2 = gsap.timeline({
            repeat: 0,
            defaults: { 
                duration: 1 / year2List.length, 
                modifiers: {
                    textContent: (value) => Math.round(Number(value)).toString()
                }}
            }
        );
        year1List.forEach((year) => {
            tl1.to(year1Ref.current, {
                textContent: year
            })
        })
        year2List.forEach((year) => {
            tl2.to(year2Ref.current, {
                textContent: year.toString()
            })
            
        })
    }, {scope: container, dependencies:[year1List, year2List]}
    )
    return (
        <div ref={container} className={clsx([styles.container, styles.year])}>
            <span ref={year1Ref} className={styles.firstYear}>{year1List[0]}</span><span ref={year2Ref} className={styles.secondYear}>{year2List[0]}</span>
        </div>
    )
}

export default PeriodUI;