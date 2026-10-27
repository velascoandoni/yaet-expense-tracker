import { Typography } from "antd"

export default function Balance( {
    amount,
    size
}){
    const {Text}=Typography
    return <Text strong style={{color:amount>0?"green":"red",fontSize:"40px"}} >
        {amount}€
    </Text>
}