import { SyntheticEvent } from "react"
import PeriodControlsUI from "../ui/PeriodControlsUI/PeriodControlsUI";
import { useDispatch, useSelector } from "../../../src/services/store";
import { decrementPeriod, getCurrentPeriod, getPeriods, incrementPeriod } from "../../../src/services/slices/periodsSlice";
import PaginationUI from "../ui/PaginationUI/PaginationUI";
import Pagination from "../Pagination/Pagination";
import styles from './PeriodControls.module.scss';

interface PeriodControlsProps {
    isMobile: boolean;
}

const getButtonsActive: (periodsNumber: number, currentPeriod: number) => boolean[] = (periodsNumber, currentPeriod) => {
    const buttonsActive: boolean[] = [true, true];
    if (currentPeriod === 1)
        buttonsActive[0] = false
    if (currentPeriod === periodsNumber)
        buttonsActive[1] = false;
    return buttonsActive;
}


const PeriodControls: React.FC<PeriodControlsProps> = ({isMobile}) => {
    const dispatch = useDispatch();
    const currentPeriod = useSelector(getCurrentPeriod);
    const periods = useSelector(getPeriods);
    const controlsHandler = (buttonId: number) => (e: SyntheticEvent<HTMLButtonElement>) => {
        if (buttonId && !e) {
            return controlsHandler(buttonId);
        }else if (e.target) {
            if (buttonId === 1)
                dispatch(decrementPeriod());
            else if (buttonId === 2)
                dispatch(incrementPeriod());
        }
    }
    return (
        <div className={styles.container}>
            <PeriodControlsUI periodsNumber={periods.length} currentPeriod={currentPeriod} buttonsActive={getButtonsActive(periods.length, currentPeriod)} controlsHandler={controlsHandler} isMobile={isMobile}/>
            {isMobile && <Pagination periods={periods} currentPeriod={currentPeriod}/>}
        </div>
    )
}

export default PeriodControls;