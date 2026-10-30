import type { BlankEnv, BlankInput } from "hono/types";
import type { Context } from "hono";
import { IllegalArgumentsError } from "../dataLayer/models/Errors/IllegalArgumentsError";
import { NotFoundError } from "../dataLayer/models/Errors/NotFoundError";
import { badRequest, conflict, forbidden, internalServerError } from "./defaultResponses";
import { ForbiddenOperationError } from "../dataLayer/models/Errors/ForbiddenOperationError";
import { IllegalOperationError } from "../dataLayer/models/Errors/IllegalOperationError";


export function handleError(e:any, c: Context<BlankEnv, "/", BlankInput>) {

    if (e instanceof IllegalArgumentsError) {
        return badRequest(c,e)
    }
    
    if (e instanceof IllegalOperationError) {
        return conflict(c,e)
    }

    if (e instanceof NotFoundError) {
        return c.notFound();
    }


    if (e instanceof ForbiddenOperationError) {
        return forbidden(c,e)
    }
    console.error("Unexpected error:", e);
    return internalServerError(c)
};

export async function defaultHandler(c:any,service:Function) {
    let body
    let params
    try {
        body = await c.req.json();
      } catch(e){

    }
    try {
        params = await c.req.param()
      } catch(e){

    }

    try{

        const result = await service(params,body);

        return c.json(result)
    }
   catch (e:unknown){
        return handleError(e,c)
    }
}