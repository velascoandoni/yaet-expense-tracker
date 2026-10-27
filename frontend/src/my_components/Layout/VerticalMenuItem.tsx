import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "@tanstack/react-router"
import { classNameMerger, CLASSNAMES } from "../../utils/CSS_CONSTS"
import { Typography } from "antd"

type VerticalMenuItemProps={
    tabKey:string,
    title:string,
    icon:IconProp,
    open:boolean,
    isSelected:boolean
}

export default function VerticalMenuItem({
    tabKey,
    title,
    icon,
    open,
    isSelected
}:VerticalMenuItemProps) {
const { Text } = Typography
    const navigate = useNavigate()
    function ontabSelected(e) {
        navigate({ to: tabKey })

    }
    return <div className="item-hitbox" style={{ zIndex: "99" }} onClick={(e) => ontabSelected(e)}>
        <div className={classNameMerger("item", isSelected ? "selected" : "")} style={{ display: "flex", width: "100%", justifyContent: "left", alignItems: "center", borderRadius: "10px", padding: "0px 10px" }}
        >
            <div style={{ height: "5rem", justifyContent: "left", alignItems: "center", display: "inline-flex", alignContent: "center", fontSize: "2rem", padding: "0 10px", }}>
                <FontAwesomeIcon icon={icon} style={{ width: "auto", height: "2.5rem" }} />

                <Text className={classNameMerger(CLASSNAMES.title)}>

                    {open ? <>&nbsp;{title}</> : ""}
                </Text>

            </div>
        </div>
    </div>
}