import type { SyntheticEvent } from "react";
import { periodChange } from "../../../src/services/slices/periodsSlice";
import { useDispatch } from "../../../src/services/store";
import PaginationUI from "../ui/PaginationUI/PaginationUI";
import type { Period } from "../../services/api/getEvents";
import type { UUID } from "crypto";

export interface PaginationProps {
    periods: Period[];
    activePeriodIndex: number;
}

const Pagination: React.FC<PaginationProps> = ({periods, activePeriodIndex}) =>{
    const dispatch = useDispatch();
    const onPeriodClick = (e: SyntheticEvent<HTMLButtonElement>) => {
        const id     = e.currentTarget.dataset.id as UUID;
        if (!id)
            return;
        dispatch(periodChange({id: id}))
    }
    return (
        <PaginationUI paginationItems={periods.map((period) => ({id: period.id}))} activePeriodIndex={activePeriodIndex} onPeriodClick={onPeriodClick} />
    )
}

export default Pagination;