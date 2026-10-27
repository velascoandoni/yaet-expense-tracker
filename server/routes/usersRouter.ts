import { Hono } from "hono";
import { login, register } from "../dataLayer/usersORM";
import { defaultHandler } from "./defaultHandlers";

import { OAuth2Client } from "oslo/oauth2";
const authorizeEndpoint = "http://localhost:5173";


const googleOAuth2Client = new OAuth2Client(
    Bun.env.GOOGLE_CLIENT_ID,
    "https://accounts.google.com/o/oauth2/v2/auth",
    "https://oauth2.googleapis.com/token",
    {
        redirectURI: "http://localhost:5173"
    });
export const usersRouter = new Hono()


    //////////////LEAGUE
    .post("/register", async c => {
            return await defaultHandler(c,(params:any,body:any)=>register(body.username,body.password))
        }) 
    .post("/login", async c => {
        return await defaultHandler(c,(params:any,body:any)=>login(body.username,body.password))
    })


