import Decimal from "decimal.js";
import type { User } from "../../../types/users"


export function decimalSum(array: any[], key: string): number {
    return array?.reduce((partialSum, e) => partialSum.add(new Decimal(e[key] || 0)), new Decimal(0)).toNumber()
}


export function getUser(): User {
    return JSON.parse(localStorage.getItem("user"))
}



export function debounce(callback: Function, wait: number) {
    let timeoutId:number|undefined = undefined;
    return (...args:any[]) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
}


export function isValidString(s){
    if(typeof s!="string") return false
    if(s.length<1) return false
    return true
}