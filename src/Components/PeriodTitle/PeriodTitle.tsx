import { forwardRef } from "react";
import { getPeriodTitle } from "../../../src/services/slices/periodsSlice"
import { useSelector } from "../../../src/services/store"
import PeriodTitleUI from "../ui/PeriodTitleUI/PeriodTitleUI";

type PeriodTitleProps = object;

const PeriodTitle = forwardRef<HTMLDivElement, PeriodTitleProps>((_, ref) => {
    const periodTitle = useSelector(getPeriodTitle);
    return (
        <PeriodTitleUI ref={ref} periodTitle={periodTitle} />
    )
})

export default PeriodTitle;