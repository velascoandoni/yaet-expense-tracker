
import { faChevronRight, faCogs, faList, faMoneyBills, faPieChart, faShekelSign, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { Button, Divider, Tooltip, Typography } from "antd";
import { useState } from "react";
import CustomCard from "../General/CustomCard";
import '../../css/verticalMenu.css'
import { classNameMerger, CLASSNAMES } from "../../utils/CSS_CONSTS";
import VerticalMenuItem from "./VerticalMenuItem";
type VerticalMenuProps = {
    user: any
}
export default function VerticalMenu({
    user
}: VerticalMenuProps) {
    const navigate = useNavigate()

    const { Text } = Typography

    const [open, setOpen] = useState(false);
    const tabs = [
        {
            key: "/",
            title: "Overview",
            icon: faMoneyBills
        },
        {
            key: "/expenses",
            title: "Expenses",
            icon: faList
        },
        {
            key: "/settings",
            title: "Expense types",
            icon: faCogs
        },
        /*         {
                    key: "/stats",
                    title: "Stats",
                    icon: faPieChart
                }, */


    ]


    function toggleOpen() {
        setOpen(open => !open)
    }
    const location = useLocation()
    return <div className={`vertical-menu ${open ? "open" : ""}`}
    //onClick={() => toggleOpen()}
    >

        <CustomCard noPadding={true} className={"menu-card"} bodyStyle={{ height: "100%", overflow: "hidden" }} style={{ height: "100%", overflow: "hidden" }} children={<div style={{
            display: "inline-flex",
            flexDirection: "row",
            height: "100%",

        }}
            onClick={toggleOpen}
        >


            <div style={{
                display: "inline-flex",
                flexDirection: "column",
                height: "100%",
                alignContent: "center",
            }}

            >
                <div className="header" style={{
                    display: "flex", width: "100%", whiteSpace: "nowrap", justifyContent: "center",
                    padding: "20px 30px"

                }}>

                    <div
                        onClick={e => e.stopPropagation()}
                    >

                        <FontAwesomeIcon icon={faShekelSign} style={{ width: "2rem", height: "auto" }} />
                        &nbsp;
                        <Text className={classNameMerger(CLASSNAMES.clickableText, CLASSNAMES.title)}>
                            {open ? <>Expense&nbsp;tracker</> : ""}
                        </Text>
                    </div>

                </div>
                <div style={{ padding: "10px 0px", height: "100%", gap: "5px", display: "flex", flexDirection: "column" }}>
                    {tabs.map(t => {

                        return <VerticalMenuItem stopPropagation icon={t.icon} title={t.title} open={open} isSelected={location.pathname == t.key} tabKey={t.key} />
                    })}
                </div>


                <div className="footer" style={{
                    display: "flex", width: "100%", whiteSpace: "nowrap", justifyContent: "center",
                    padding: "10px 0px"

                }}
                    onClick={e => e.stopPropagation()}
                >
                    <Tooltip title={<>
                        <Button onClick={() => navigate({ to: "/logout" })}>Log out</Button>
                    </>}>

                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>

                            <FontAwesomeIcon icon={faUserCircle} style={{ height: "4rem", width: "auto" }} />
                            &nbsp;
                            <Text className={classNameMerger(CLASSNAMES.clickableText, CLASSNAMES.title)}>
                                {open ? <>{user.name}</> : ""}
                            </Text>
                        </div>
                    </Tooltip>
                </div>
            </div>


            <div style={{ height: "100%", position: "absolute", right: "20px" }}>
                <FontAwesomeIcon className="sideArrow" icon={faChevronRight} style={{ height: "100%", marginRight: "-10px", rotate: open ? "180deg" : "0deg" }} />
            </div>

        </div>


        } />
    </div>
}