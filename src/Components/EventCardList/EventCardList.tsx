import EventCardUI from "../ui/EventCardUI/EventCardUI";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';
import styles from './EventCardList.module.scss';
import "swiper/css";
import "swiper/css/pagination";
import { forwardRef, useCallback, useRef, useState } from "react";
import clsx from "clsx";
import type { Event } from "../../types/period";
import { useSelector } from "../../services/store";
import { getError, getIsLoading } from "../../services/slices/periodsSlice";

interface EventCardListProps {
    isMobile: boolean;
    eventsList: Event[];
}

const SWIPER_BREAKPOINTS = {
    320: {
        slidesPerView: 1.5,
        spaceBetween: 25,
    },
    720: {
        slidesPerView: 2,
        spaceBetween: 40,
    },
    1440: {
        slidesPerView: 3,
        spaceBetween: 80
    }
} as const;

const EventCardList = forwardRef<HTMLDivElement, EventCardListProps>(
    ({
        isMobile,
        eventsList,
    }, ref) => {
        const [leftButtonVisible, setLeftButtonVisible] = useState(false);
        const [rightButtonVisible, setRightButtonVisible] = useState(false);
        const isLoading = useSelector(getIsLoading);
        const isError = useSelector(getError);
        const swiperRef = useRef<SwiperType>();

        const updateNavigation = useCallback(
            (swiper: SwiperType) => {
                setLeftButtonVisible(!isMobile && !swiper.isBeginning);
                setRightButtonVisible(!isMobile && !swiper.isEnd);
            },
            [isMobile],
        );

        if (eventsList.length === 0 && !isLoading && !isError) {
            return (
                <div ref={ref} className={styles.container}>
                    <p className={styles.emptyMessage}>Событий не найдено</p>
                </div>
            );
        }
        return (
            <div ref={ref} className={clsx(styles.container, isMobile && styles.mobile)}>
                {leftButtonVisible && <button
                    type="button"
                    onClick={() => swiperRef.current?.slidePrev()}
                    className={clsx(styles.button, styles.leftButton)}
                    aria-label="Предыдущий слайд"
                />}
                <Swiper
                    direction="horizontal"
                    observer
                    onBeforeInit={(swiper: SwiperType) => {
                        swiperRef.current = swiper;
                    }}
                    onInit={updateNavigation}
                    onUpdate={updateNavigation}
                    onSlideChange={updateNavigation}
                    onReachBeginning={updateNavigation}
                    onReachEnd={updateNavigation}
                    breakpoints={SWIPER_BREAKPOINTS}
                    className={styles.swiperContainer}
                >
                    {eventsList.map(event => (
                        <SwiperSlide key={event.id}>
                            <EventCardUI year={event.year} description={event.description} />
                        </SwiperSlide>)
                    )}
                </Swiper>
                {rightButtonVisible && (
                    <button
                        type="button"
                        onClick={() => swiperRef.current?.slideNext()}
                        className={clsx(styles.button, styles.rightButton)}
                        aria-label="Следующий слайд"
                    />
                )}
            </div>
        )}
);

EventCardList.displayName = 'EventCardList';

export default EventCardList;