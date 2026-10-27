import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { expenses } from "../server/dataLayer/db/schema/expenses"
import { z } from "zod"

// Get the base schema
export const insertExpenseSchema = createInsertSchema(expenses)
    .extend({
        merging_expense_ids:z.array(z.number()).optional()
    })
  .omit({ expense_id: true })
  .superRefine((data, ctx) => {
    if (Number.isNaN(data.amount)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Amount cannot be NaN",
        path: ["amount"]
      });
    }
    if (Number.isNaN(data.final_balance)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Final balance cannot be NaN",
        path: ["final_balance"]
      });
    }
  });

export const selectExpenseSchema = createSelectSchema(expenses)
export const updateExpenseSchema = createUpdateSchema(expenses)

export const insertMultipleExpenseSchema = z.array(insertExpenseSchema)

export const queryExpensesSchema=z.object({ 
  user_id:z.string().transform(s => s?Number(s):undefined),
  raw:z.string().optional().transform(s => s=="true"),
  active:z.string().optional().transform(s => s=="true"),
  month: z.string().optional().transform(s => s?Number(s):undefined) ,
  startDate:z.string().optional(),
  endDate:z.string().optional(),
  name:z.string().optional(),
  expense:z.string().optional().transform(s => s=="true"),
  profit:z.string().optional().transform(s => s=="true"),
})

export type Expense= z.infer<typeof selectExpenseSchema>
export type CreateExpense= z.infer<typeof insertExpenseSchema>