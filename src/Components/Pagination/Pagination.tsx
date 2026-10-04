import { useCallback, useMemo } from "react";
import { periodChange } from "../../../src/services/slices/periodsSlice";
import { useDispatch } from "../../../src/services/store";
import PaginationUI from "../ui/PaginationUI/PaginationUI";
import type { Period } from "../../services/api/getEvents";

interface PaginationProps {
    periods: Period[];
    periodNumber: number;
}

const Pagination: React.FC<PaginationProps> = ({periods, periodNumber}) =>{
    const dispatch = useDispatch();
    const handleDotClick = useCallback((periodId: string) => () => dispatch(periodChange({periodId: periodId})), [dispatch]);
    const handleDotClickList = useMemo(() => periods.map((period) => handleDotClick(period.periodId)), [periods, handleDotClick]);
    return (
        <PaginationUI periods={periods} periodNumber={periodNumber} handleDotClicks={handleDotClickList} />
    )
}

export default Pagination;