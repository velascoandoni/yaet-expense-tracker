import { faCog, faRightFromBracket, faUserCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "@tanstack/react-router"
import { Divider, Typography } from "antd"
import { use } from "react"
import { classNameMerger, CLASSNAMES } from "../utils/CSS_CONSTS"

export default function Navbar({

}) {
    const navigate = useNavigate()
    const { Text } = Typography
    const user = JSON.parse(localStorage.getItem("user"))

    return <div className='nav-bar'>
        <div style={{ marginLeft: "10px", marginRight: "auto", height: "100%", width: "fit-content", alignContent: "center" }}>


            <Text className={classNameMerger(CLASSNAMES.title)} style={{ color: "white" }}>


                EXPENSE TRACKER
            </Text>


        </div>
        <div style={{ marginLeft: "auto", marginRight: "40px", height: "100%", width: "fit-content", alignContent: "center" }}>
            {user ? <>

                <Text className={classNameMerger(CLASSNAMES.title)} style={{ color: "white" }}>


                    {user.name}
                </Text>
                &nbsp;
                <FontAwesomeIcon onClick={() => navigate({ to: "/" })} icon={faUserCircle} style={{ height: "2rem", width: "2rem" }} />
                &nbsp;
                <Text className={classNameMerger(CLASSNAMES.clickableText, CLASSNAMES.title)} onClick={() => navigate({ to: "/settings" })}>
                    <FontAwesomeIcon icon={faCog} />
                </Text>
                <Divider type="vertical" plain style={{ borderColor: "white", marginTop: "-15px" }} />
                <Text className={classNameMerger(CLASSNAMES.clickableText, CLASSNAMES.title)} onClick={() => navigate({ to: "/logout" })}>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                </Text>
            </> : <>
                <Text className={classNameMerger(CLASSNAMES.clickableText, CLASSNAMES.title)} style={{color:"white"}} onClick={() => navigate({ to: "/login" })}>
                    LOGIN
                </Text>
                <Divider type="vertical" plain style={{ borderColor: "white", marginTop: "-15px",height:"2rem"}} />

                <Text className={classNameMerger(CLASSNAMES.clickableText, CLASSNAMES.title)} style={{color:"white"}} onClick={() => navigate({ to: "/register" })}>
                    REGISTER
                </Text>
            </>}
        </div>
    </div>
}