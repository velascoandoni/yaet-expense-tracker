import { Popover } from "antd";
import EmojiPicker, { Theme, EmojiStyle, Emoji } from "emoji-picker-react";
type EmojiChooserProps={
    selectEmoji:Function,
    emoji:string
}
export default function EmojiChooser({
    selectEmoji,
    emoji
}:EmojiChooserProps){
    return <Popover styles={{ body: { padding: 0, margin: 0, background: "transparent" } }} content={<EmojiPicker theme={Theme.DARK} width={"100%"} emojiStyle={EmojiStyle.APPLE} onEmojiClick={newEmoji =>selectEmoji(newEmoji.unified)} previewConfig={{ showPreview: false }} />} style={{ cursor: "pointer" }} title={""} trigger="click">
                        <div style={{ cursor: "pointer",minWidth:"20px",minHeight:"20px"}}>
                            {typeof emoji=="string" ? <Emoji
                                emojiStyle={EmojiStyle.APPLE}
                                unified={emoji}
                                size={30}
    
    
                            />:"X"}
                        </div>
                    </Popover>
}