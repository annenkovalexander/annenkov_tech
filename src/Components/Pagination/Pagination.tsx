import { periodChange } from "../../../src/services/slices/periodsSlice";
import { useDispatch } from "../../../src/services/store";
import PaginationUI from "../ui/PaginationUI/PaginationUI";
import type { periodType } from "../../../src/services/types";
import type { Period } from "../../services/api/getEvents";

interface PaginationProps {
    periods: Period[];
    periodNumber: number;
}

const Pagination: React.FC<PaginationProps> = ({periods, periodNumber}) =>{
    const dispatch = useDispatch();
    const handleDotClick = (periodId: string) => () => dispatch(periodChange({periodId: periodId}));
    const hadleDotClickList = periods.map((period) => handleDotClick(period.periodId));
    return (
        <PaginationUI periods={periods} periodNumber={periodNumber} handleDotClicks={hadleDotClickList} />
    )
}

export default Pagination;