import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { insertExpenseSchema, insertMultipleExpenseSchema, queryExpensesSchema, updateExpenseSchema } from "../../types/expenses";
import { addExpense, addExpenses, addExpensesSplitFrom, addMergingExpense, deleteExpense, editExpense, getExpense, getExpenses } from "../dataLayer/expensesORM";
import { defaultHandler } from "./defaultHandlers";





export const expensesRouter = new Hono()
.get("/:expense_id",
        zValidator("param", z.object({ expense_id: z.string().transform(s => Number(s)) })),
        async c => {
            const params = c.req.valid("param")
            return await defaultHandler(c, async (param: any, body: any) => getExpense(params?.expense_id))
        })
    .get("/",
        zValidator("query", queryExpensesSchema),
        async c => {
            const query = c.req.valid("query");
            return await defaultHandler(c, async (param: any, body: any) => getExpenses(query))
        })
    .post("/collection", zValidator("json", insertMultipleExpenseSchema), async c => {
        const validatedExpenses = await c.req.valid("json");

        // Handle multiple expenses
        return await defaultHandler(c, (params: any, body: any) => addExpenses(validatedExpenses))

    })
    .post("/split", zValidator("json", z.object({newExpenses:insertMultipleExpenseSchema,expenseToSplit:updateExpenseSchema.refine((val) => !val.was_split)})), async c => {
        const validatedExpenses = await c.req.valid("json");

        // Handle multiple newExpenses
        console.log("SPLIT",validatedExpenses.expenseToSplit,validatedExpenses.newExpenses)
        return await defaultHandler(c, (params: any, body: any) => addExpensesSplitFrom(validatedExpenses.newExpenses,validatedExpenses.expenseToSplit))

    })

    //////////////EXPENSE
    .post("/", zValidator("json", insertExpenseSchema), async c => {
        const validatedExpense = await c.req.valid("json")
        return await defaultHandler(c, (params: any, body: any) => addExpense(validatedExpense))
    })
    .post("/merge", zValidator("json", insertExpenseSchema), async c => {
        const validatedExpense = await c.req.valid("json")
        return await defaultHandler(c, (params: any, body: any) => addMergingExpense(validatedExpense))
    })
    .put("/", zValidator("json", updateExpenseSchema), async c => {
        const validatedExpense = await c.req.valid("json")
        return await defaultHandler(c, (params: any, body: any) => editExpense(validatedExpense))
    })

    .delete('/:expense_id', zValidator("param", z.object({ expense_id: z.string().transform(s => Number(s)) })), async c => {
        const params = c.req.valid("param")

        return await defaultHandler(c, (params: any, body: any) => deleteExpense(params?.expense_id))
    })
    .all('*', async c => {
        return c.json({
            message: "Route not found",
            path: c.req.path,
            method: c.req.method
        }, 404)
    })


