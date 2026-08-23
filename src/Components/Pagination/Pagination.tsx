import { periodChange } from "../../../src/services/slices/periodsSlice";
import { useDispatch } from "../../../src/services/store";
import PaginationUI from "../ui/PaginationUI/PaginationUI";
import type { periodType } from "../../../src/services/types";

interface PaginationProps {
    periods: periodType[];
    currentPeriod: number;
}

const Pagination: React.FC<PaginationProps> = ({periods, currentPeriod}) =>{
    const dispatch = useDispatch();
    const handleDotClick = (periodId: string) => () => dispatch(periodChange({periodIndex: periodId}));
    const hadleDotClickList = periods.map((period) => handleDotClick(period.periodId));
    return (
        <PaginationUI periods={periods} currentPeriod={currentPeriod} handleDotClicks={hadleDotClickList} />
    )
}

export default Pagination;