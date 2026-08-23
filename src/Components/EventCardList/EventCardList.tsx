import { useSelector } from "../../../src/services/store";
import EventCardUI from "../ui/EventCardUI/EventCardUI";
import { getEventsList } from "../../../src/services/slices/periodsSlice";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import styles from './EventCardList.module.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import './swiper-pagination.css';
import { forwardRef, useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface EventCardListProps {
    isMobile: boolean;
}

const EventCardList = forwardRef<HTMLDivElement, EventCardListProps>(({isMobile}, ref) => {
    const eventsList = useSelector(getEventsList);
    const [leftButtonVisible, setLeftButtonVisible] = useState(false);
    const [rightButtonVisible, setRightButtonVisible] = useState(true);
    const swiperRef = useRef<SwiperType>();

    useEffect(() => {
        if (isMobile) {
            setLeftButtonVisible(false);
            setRightButtonVisible(false);
        } else {
            setLeftButtonVisible(!swiperRef.current?.isBeginning);
            setRightButtonVisible(!swiperRef.current?.isEnd);
        }
    }, [isMobile]);
    return (
        <div ref={ref} className={clsx([styles.container, isMobile ? styles.mobile : ''])}>
            {leftButtonVisible && <button 
                onClick={() => swiperRef.current?.slidePrev()}
                className={clsx([styles.button, styles.leftButton])}
                aria-label="Previous slide"
            />}
            <Swiper
                modules={[Navigation]}
                onBeforeInit={(swiper: SwiperType) => {
                    swiperRef.current = swiper;
                    setLeftButtonVisible(!swiperRef.current?.isBeginning);
                    setRightButtonVisible(!swiperRef.current?.isEnd);
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
                {eventsList.map((event, index) => (
                    <SwiperSlide key={index}>
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