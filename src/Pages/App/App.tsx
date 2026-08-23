import PeriodControls from "../../../src/Components/PeriodControls/PeriodControls";
import Period from "../../../src/Components/Period/Period";
import Title from "../../Components/Title/Title";
import EventCardList from "../../../src/Components/EventCardList/EventCardList";
import styles from './App.module.scss';
import { useEffect, useState, useRef } from "react";
import clsx from "clsx";
import MobileCenterLineUI from "../../../src/Components/ui/MobileCenterLineUI/MobileCenterLineUI";
import Circle from "../../../src/Components/Circle/Circle";
import PeriodTitle from "../../../src/Components/PeriodTitle/PeriodTitle";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useSelector } from "../../../src/services/store";
import { getCurrentPeriod } from "../../../src/services/slices/periodsSlice";

gsap.registerPlugin(useGSAP);

const MOBILE_BREAKPOINT = Number(process.env.MOBILE_BREAKPOINT) || 720;

const App = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
    const container = useRef<HTMLDivElement | null>(null);
    const periodTitleRef = useRef<HTMLDivElement | null>(null);
    const mobileLineRef = useRef<HTMLDivElement | null>(null);
    const eventsCardsList = useRef<HTMLDivElement | null>(null);
    const currentPeriod = useSelector(getCurrentPeriod);
    const handleResize = () => {
        setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    }
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    useGSAP(() => {
        gsap.fromTo(periodTitleRef.current, {opacity: 0, y: 10},
            {duration: 1, opacity: 1, y: 0}
        );
        gsap.fromTo(mobileLineRef.current, {opacity: 0, y: 10},
            {duration: 1, opacity: 1, y: 0}
        );
        gsap.fromTo(eventsCardsList.current, {opacity: 0, y: 10},
            {duration: 1, opacity: 1, y: 0}
        )
    }, {scope: container, dependencies: [currentPeriod]})

    return (
        <div ref={container} className={styles.container}>
            {!isMobile && <Circle />}
            <Title isMobile={isMobile}/>
            <Period />
            {isMobile && <PeriodTitle ref={periodTitleRef} />}
            {isMobile && <MobileCenterLineUI ref={mobileLineRef} />}
            <div className={clsx([styles.eventsContainer, isMobile ? styles.sliderLayoutMobile : styles.sliderLayoutDesktop])}>
                <PeriodControls isMobile={isMobile} />
                <EventCardList ref={isMobile ? eventsCardsList : null} isMobile={isMobile} />
            </div>
        </div>
    )
}
export default App;