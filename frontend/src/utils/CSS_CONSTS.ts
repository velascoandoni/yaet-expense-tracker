export const CLASSNAMES={
    text:"text",
    clickableText:"clickable-text",
    title:"title"
}

export function classNameMerger(...classNames:String[]){
    if(!classNames?.length) return ""
    return classNames.join(" ")
}