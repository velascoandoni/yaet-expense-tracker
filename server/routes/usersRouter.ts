import { Hono } from "hono";
import { login, register } from "../dataLayer/usersORM";
import { defaultHandler } from "./defaultHandlers";

export const usersRouter = new Hono()


    //////////////LEAGUE
    .post("/register", async c => {
            return await defaultHandler(c,(params:any,body:any)=>register(body.username,body.password))
        }) 
    .post("/login", async c => {
        return await defaultHandler(c,(params:any,body:any)=>login(body.username,body.password))
    })


