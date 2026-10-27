
type ColumnType={
    type_id:number;
    name:string;
    validator:Function;
    comparator:Function;
}

export function defaultValidator(value: any){
    return value!==undefined&&value!==null
}
export function defaultComparator({a,b}){
    return a==b
}
export const ID_TYPE={
    type_id:1,
    name:"ID",
    validator:({value})=>defaultValidator(value),
    comparator:defaultComparator
}

export const NUMBER_TYPE={
    type_id:2,
    name:"NUMBER",
    validator:({value})=>defaultValidator(value),
    comparator:({a,b})=>{
        a=Number(a)
        b=Number(b)
        if(a<b) return "lower"
        if(b<a) return "higher"
        return true
    }
}

export const LIST_TYPE={
    type_id:3,
    name:"LIST",
    validator:({value})=>defaultValidator(value),
    comparator:defaultComparator
}

export const types=[
    ID_TYPE,
    NUMBER_TYPE,
    LIST_TYPE
]

export function getType({type_id}){
    if(!type_id) return undefined
    return types.find(t=>type_id===t.type_id)
}

export function compareAndGenerateResponse({correctGuess,value,column}){
    let type_object=getType(column)
    if(!type_object) return undefined
    return {...value,response:type_object.comparator({a:correctGuess.value,b:value.value})}
    

}