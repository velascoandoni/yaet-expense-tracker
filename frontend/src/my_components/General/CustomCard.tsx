import { Card, Typography } from "antd";
import Title from "antd/es/typography/Title";
import { classNameMerger } from "../../utils/CSS_CONSTS";
import { CSSProperties, PropsWithChildren } from "react";
import '../../css/CustomCard.css'
type CustomCardProps={
    title: string,
    style : CSSProperties,
    bodyStyle : CSSProperties,
    noPadding: Boolean,
    className: string,
    fontSize: string
} & PropsWithChildren
export default function CustomCard({
    title,
    children,
    style,
    bodyStyle,
    noPadding,
    className,
    fontSize="40px"
}:CustomCardProps){
    
    return <Card className={classNameMerger("customCard",className,noPadding?"noPadding":"")} style={style} styles={{body:{...bodyStyle},}} >
        {title?<Title  style={{fontSize:fontSize,padding:noPadding?"20px":undefined,margin:0,color:"white"}}>{title}</Title>:""}
        {children}
    </Card>
}