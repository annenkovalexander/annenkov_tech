import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState
} from "react";
import clsx from "clsx";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import PeriodControls from "../../Components/PeriodControls/PeriodControls";
import Period from "../../Components/Period/Period";
import MobileCenterLineUI from "../../Components/ui/MobileCenterLineUI/MobileCenterLineUI";
import Circle from "../../Components/Circle/Circle";
import PeriodTitle from "../../Components/PeriodTitle/PeriodTitle";

import styles from "./App.module.scss";

import { useSelector } from "../../services/store";
import { getCurrentPeriod, getEventsList, getPeriods, getIsLoading, getError } from "../../services/slices/periodsSlice";
import { useDispatch } from "../../services/store";
import Header from "../../Components/Header/Header";
import { loadPeriods } from "../../services/thunks/periodThunk";

const EventCardList = lazy(
  () =>
    import("../../Components/EventCardList/EventCardList")
);

gsap.registerPlugin(useGSAP);

const parsedMobileBreakpoint = Number(process.env.MOBILE_BREAKPOINT);
const MOBILE_BREAKPOINT =
    Number.isFinite(parsedMobileBreakpoint) && parsedMobileBreakpoint > 0
        ? parsedMobileBreakpoint
        : 720;

const parsedTimeout = Number(process.env.INITIAL_DELAY);
const INITIAL_DELAY =
    Number.isFinite(parsedTimeout) && parsedTimeout > 0
        ? parsedTimeout
        : 1500;

const App = () => {
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const container = useRef<HTMLDivElement | null>(null);
  const periodTitleRef = useRef<HTMLDivElement | null>(null);
  const mobileLineRef = useRef<HTMLDivElement | null>(null);
  const eventsCardsListRef = useRef<HTMLDivElement | null>(null);
  const eventsList = useSelector(getEventsList);
  const currentPeriod = useSelector(getCurrentPeriod);
  const periods = useSelector(getPeriods);
  const isLoading = useSelector(getIsLoading);
  const error = useSelector(getError);

  const toBeDisplayed = !error && eventsList.length > 0;

  useEffect(() => {
    dispatch(loadPeriods(INITIAL_DELAY));
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useGSAP(
    () => {
      if (periodTitleRef.current) {
        gsap.fromTo(
          periodTitleRef.current,
          { opacity: 0, y: 10 },
          {
            duration: 1,
            opacity: 1,
            y: 0
          }
        );
      }

      if (mobileLineRef.current) {
        gsap.fromTo(
          mobileLineRef.current,
          { opacity: 0, y: 10 },
          {
            duration: 1,
            opacity: 1,
            y: 0
          }
        );
      }

      if (eventsCardsListRef.current) {
        gsap.fromTo(
          eventsCardsListRef.current,
          { opacity: 0, y: 10 },
          {
            duration: 1,
            opacity: 1,
            y: 0
          }
        );
      }
    },
    {
      scope: container,
      dependencies: [currentPeriod, isMobile]
    }
  );


  return (
    <div
      ref={container}
      className={styles.container}
    >
      {error && (
          <div
              className={styles.error}
              role="alert"
          >
              Не удалось загрузить периоды. Попробуйте обновить страницу.
          </div>
      )}
      {!isMobile && <Circle />}
      <Header />
      <Period isLoading={isLoading}/>

      {isMobile && (
        <PeriodTitle ref={periodTitleRef} />
      )}

      {isMobile && (
        <MobileCenterLineUI ref={mobileLineRef} />
      )}

      
      <div
        className={clsx(
          styles.eventsContainer,
          isMobile
            ? styles.sliderLayoutMobile
            : styles.sliderLayoutDesktop
        )}
      >
        {!isMobile && toBeDisplayed && (<PeriodControls isMobile={isMobile} periods={periods}/>)}
        <Suspense
          fallback={
            <div className={styles.loader} />
          }
        >
          <EventCardList
            ref={isMobile ? eventsCardsListRef : null}
            isMobile={isMobile}
            eventsList={eventsList}
          />
        </Suspense>
        {isMobile && toBeDisplayed && (<PeriodControls isMobile={isMobile} periods={periods}/>)}
      </div>
      
    </div>
  );
};

export default App;