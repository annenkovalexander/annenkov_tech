import {clsx} from 'clsx';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

import styles from './PeriodUI.module.scss';

interface TPeriodUIProps {
    yearsListStartYear: number[];
    yearsListEndYear: number[];
}



const PeriodUI: React.FC<TPeriodUIProps> = ({ yearsListStartYear, yearsListEndYear }) => {
    const container = useRef<HTMLDivElement | null>(null);
    const year1Ref = useRef<HTMLSpanElement | null>(null);
    const year2Ref = useRef<HTMLSpanElement | null>(null);
    useGSAP(() => {
        const tl1 = gsap.timeline({
            repeat: 0,
            defaults: { 
                duration: yearsListStartYear.length > 0 ? 1 / yearsListStartYear.length : 1, 
                modifiers: {
                    textContent: (value) => Math.round(Number(value)).toString()
                }}
            }
        );
        const tl2 = gsap.timeline({
            repeat: 0,
            defaults: { 
                duration: yearsListEndYear.length > 0 ? 1 / yearsListEndYear.length : 1, 
                modifiers: {
                    textContent: (value) => Math.round(Number(value)).toString()
                }}
            }
        );
        yearsListStartYear.forEach((year) => {
            tl1.to(year1Ref.current, {
                textContent: year
            })
        })
        yearsListEndYear.forEach((year) => {
            tl2.to(year2Ref.current, {
                textContent: year.toString()
            })
            
        })
    }, {scope: container, dependencies:[yearsListStartYear, yearsListEndYear]}
    )
    return (
        <div ref={container} className={clsx([styles.container, styles.year])}>
            <span ref={year1Ref} className={styles.firstYear}>{yearsListStartYear[0]}</span><span ref={year2Ref} className={styles.secondYear}>{yearsListEndYear[0]}</span>
        </div>
    )
}

export default PeriodUI;