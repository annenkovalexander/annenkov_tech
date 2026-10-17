import {clsx} from 'clsx';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './PeriodUI.module.scss';

gsap.registerPlugin(useGSAP);

type YearsList = readonly number[];

interface PeriodUIProps {
    yearsListStartYear: YearsList;
    yearsListEndYear: YearsList;
}

const gsapPeriodAnimation = (
    yearsList: YearsList
): gsap.core.Timeline =>
        gsap.timeline({
            repeat: 0,
            defaults: {
                duration: yearsList.length > 0 ? 1 / yearsList.length : 1,
                modifiers: {
                    textContent: (value) => Math.round(Number(value)).toString()
                }
            }
        })

const PeriodUI = ({ yearsListStartYear, yearsListEndYear }: PeriodUIProps) => {
    const container = useRef<HTMLDivElement | null>(null);
    const year1Ref = useRef<HTMLSpanElement | null>(null);
    const year2Ref = useRef<HTMLSpanElement | null>(null);
    useGSAP(() => {
        const tl1 = gsapPeriodAnimation(yearsListStartYear);
        const tl2 = gsapPeriodAnimation(yearsListEndYear);
        if (!year1Ref.current || !year2Ref.current) {
            return;
        }
        yearsListStartYear.forEach((year) => {
            tl1.to(year1Ref.current, {
                textContent: year
            })
        })
        yearsListEndYear.forEach((year) => {
            tl2.to(year2Ref.current, {
                textContent: year
            })
            
        })
    }, {
            scope: container,
            dependencies:[yearsListStartYear, yearsListEndYear],
            revertOnUpdate: true,
    });
    return (
        <div ref={container} className={clsx(styles.container, styles.year)}>
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