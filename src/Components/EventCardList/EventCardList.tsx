import EventCardUI from "../ui/EventCardUI/EventCardUI";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';
import styles from './EventCardList.module.scss';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { forwardRef, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { Event } from "../../services/api/getEvents";

interface EventCardListProps {
    isMobile: boolean;
    eventsList: Event[];
}

const EventCardList = forwardRef<HTMLDivElement, EventCardListProps>(({isMobile, eventsList}, ref) => {
    const [leftButtonVisible, setLeftButtonVisible] = useState(false);
    const [rightButtonVisible, setRightButtonVisible] = useState(false);
    const swiperRef = useRef<SwiperType>();

    useEffect(() => {
        if (isMobile) {
            setLeftButtonVisible(false);
            setRightButtonVisible(false);
        } else {
            setLeftButtonVisible(swiperRef.current ? !swiperRef.current?.isBeginning : false);
            setRightButtonVisible(swiperRef.current ? !swiperRef.current?.isEnd : false);
        }
    }, [isMobile, eventsList]);
    return (
        <div ref={ref} className={clsx([styles.container, isMobile ? styles.mobile : ''])}>
            {leftButtonVisible && <button 
                onClick={() => swiperRef.current?.slidePrev()}
                className={clsx([styles.button, styles.leftButton])}
                aria-label="Previous slide"
            />}
            <Swiper
                modules={[Navigation]}
                direction="horizontal"
                onBeforeInit={(swiper: SwiperType) => {
                    swiperRef.current = swiper;
                    setLeftButtonVisible(false);
                    setRightButtonVisible(swiperRef.current && !swiperRef.current?.isEnd);
                }}
                onReachBeginning={() => {
                    setLeftButtonVisible(false);
                }}
                onReachEnd={() => {
                    setRightButtonVisible(false);
                }}
                onSlideChange={(swiper) => {
                    swiperRef.current = swiper;
                    setLeftButtonVisible(!swiper.isBeginning && !isMobile);
                    setRightButtonVisible(!swiper.isEnd && !isMobile);
                }}
                breakpoints={{
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
                }}
                className={styles.swiperContainer}
            >
                {eventsList.map(event => (
                    <SwiperSlide key={event.id}>
                        <EventCardUI year={event.year} description={event.description} />
                    </SwiperSlide>)
                )}
            </Swiper>
            {rightButtonVisible && <button 
                onClick={() => swiperRef.current?.slideNext()}
                className={clsx([styles.button, styles.rightButton])}
                aria-label="Next slide"
            />}
            
        </div>
    )});
export default EventCardList;