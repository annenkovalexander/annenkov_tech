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
import Title from "../../Components/Title/Title";
import MobileCenterLineUI from "../../Components/ui/MobileCenterLineUI/MobileCenterLineUI";
import Circle from "../../Components/Circle/Circle";
import PeriodTitle from "../../Components/PeriodTitle/PeriodTitle";

import styles from "./App.module.scss";

import { useSelector } from "../../services/store";
import { getCurrentPeriod } from "../../services/slices/periodsSlice";

const EventCardList = lazy(
  () =>
    import("../../Components/EventCardList/EventCardList")
);

gsap.registerPlugin(useGSAP);

const MOBILE_BREAKPOINT =
  Number(process.env.MOBILE_BREAKPOINT) || 720;

const App = () => {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= MOBILE_BREAKPOINT
  );

  const container = useRef<HTMLDivElement | null>(null);
  const periodTitleRef = useRef<HTMLDivElement | null>(null);
  const mobileLineRef = useRef<HTMLDivElement | null>(null);
  const eventsCardsList = useRef<HTMLDivElement | null>(null);

  const currentPeriod = useSelector(getCurrentPeriod);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

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

      if (eventsCardsList.current) {
        gsap.fromTo(
          eventsCardsList.current,
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
      {!isMobile && <Circle />}

      <Title isMobile={isMobile} />
      <Period />

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
        <PeriodControls isMobile={isMobile} />

        <Suspense
          fallback={
            <div className={styles.loader}>
              Загрузка событий...
            </div>
          }
        >
          <EventCardList
            ref={isMobile ? eventsCardsList : null}
            isMobile={isMobile}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default App;