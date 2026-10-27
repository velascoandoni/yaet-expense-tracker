import { Tag } from "antd";
import { Emoji, EmojiStyle } from "emoji-picker-react";

export default function TypeTag({
    type
}){
    if(!type?.name && !type?.emoji) return <></>
    return <Tag color={type?.color} style={{color:type?.text_color,display:"inline-flex",alignItems:"center"}}><Emoji 
                            emojiStyle={EmojiStyle.APPLE}
                            unified={type.emoji}
                            size={20}
    
    
                            />&nbsp;<b>{type?.name}</b></Tag>
}