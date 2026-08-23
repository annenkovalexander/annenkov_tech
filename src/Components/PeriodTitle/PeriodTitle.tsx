import { forwardRef, useImperativeHandle, useRef } from "react";
import { getPeriodTitle } from "../../../src/services/slices/periodsSlice"
import { useSelector } from "../../../src/services/store"
import PeriodTitleUI from "../ui/PeriodTitleUI/PeriodTitleUI";

const PeriodTitle = forwardRef<HTMLDivElement, {}>((props, ref) => {
    const periodTitle = useSelector(getPeriodTitle);
    return (
        <PeriodTitleUI ref={ref} periodTitle={periodTitle} />
    )
})

export default PeriodTitle;