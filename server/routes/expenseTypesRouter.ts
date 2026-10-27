import { Hono } from "hono";
import { defaultHandler } from "./defaultHandlers";
import { notImplemented } from "./defaultResponses";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { insertExpenseTypeSchema, updateExpenseTypeSchema } from "../../types/types";
import { addType, getTypes, updateType } from "../dataLayer/expenseTypesORM";
import { updateExpenseSchema } from "../../types/expenses";





export const expenseTypesRouter = new Hono()
    //////////////EXPENSES
    .get("/", async c => {
        return await defaultHandler(c, async (param: any, body: any) => getTypes())
    })
    .post("/", zValidator("json", insertExpenseTypeSchema), async c => {
        const validatedExpenseType = await c.req.valid("json")
        return await defaultHandler(c, (params: any, body: any) => addType(validatedExpenseType))
    })
    .put("/", zValidator("json", updateExpenseTypeSchema), async c => {
        const validatedExpenseType = await c.req.valid("json")
        return await defaultHandler(c, (params: any, body: any) => updateType(validatedExpenseType))
    })
    