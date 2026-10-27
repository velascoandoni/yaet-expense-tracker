import CustomCard from "./CustomCard";

export default function ContentCard({
    title,
    children
}){


    return <CustomCard bodyStyle={{height:"100%"}} style={{height:"100%"}} children={children} className={"content-card"} title={title} noPadding={false} />
}