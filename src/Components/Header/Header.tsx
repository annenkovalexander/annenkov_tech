import { getHeader } from "../../services/slices/headerSlice";
import { useSelector } from "../../services/store";
import HeaderUI from "../ui/HeaderUI/HeaderUI";

const Header = () => {
    const headerData = useSelector(getHeader);
    return (
        <HeaderUI {...headerData} />
    )
}

export default Header;