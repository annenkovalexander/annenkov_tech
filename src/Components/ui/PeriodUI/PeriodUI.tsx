import {clsx} from 'clsx';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

import styles from './PeriodUI.module.scss';

interface TPeriodUIProps {
    yearsListStartYear: readonly number[];
    yearsListEndYear: readonly number[];
}


const gsapPeriodAnimation = (gsap: GSAP, yearsList: readonly number[]): GSAPTimeline => gsap.timeline({
        repeat: 0,
        defaults: {
            duration: yearsList.length > 0 ? 1 / yearsList.length : 1,
            modifiers: {
                textContent: (value) => Math.round(Number(value)).toString()
            }
        }
    })


const PeriodUI: React.FC<TPeriodUIProps> = ({ yearsListStartYear, yearsListEndYear }) => {
    const container = useRef<HTMLDivElement | null>(null);
    const year1Ref = useRef<HTMLSpanElement | null>(null);
    const year2Ref = useRef<HTMLSpanElement | null>(null);
    useGSAP(() => {
        const tl1 = gsapPeriodAnimation(gsap, yearsListStartYear);
        const tl2 = gsapPeriodAnimation(gsap, yearsListEndYear);
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
            <span 
                ref={year1Ref} 
                className={styles.firstYear}>{yearsListStartYear[0] ?? new Date().getFullYear()}
            </span>
            <span 
                ref={year2Ref} 
                className={styles.secondYear}>{yearsListEndYear[0] ?? new Date().getFullYear()}
            </span>
        </div>
    )
}

export default PeriodUI;