import { getHeader, type HeaderData } from "../../services/slices/headerSlice";
import { useSelector } from "../../services/store";
import HeaderUI from "../ui/HeaderUI/HeaderUI";

const Header = () => {
    const { fullName, role, description, tg_link, tg_link_aria_label }: HeaderData = useSelector(getHeader);
    return (
        <HeaderUI 
            fullName={fullName} 
            role={role} 
            description={description} 
            tg_link={tg_link} 
            tg_link_aria_label={tg_link_aria_label}
        />
    )
}

export default Header;