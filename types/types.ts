import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"
import { types } from "../server/dataLayer/db/schema/types"

// Get the base schema
export const insertExpenseTypeSchema = createInsertSchema(types)

export const selectExpenseTypeSchema = createSelectSchema(types)
export const updateExpenseTypeSchema = createUpdateSchema(types).extend({
	type_id: z.number(),
})

export const insertMultipleExpenseTypeSchema = z.array(insertExpenseTypeSchema)

export type ExpenseType= z.infer<typeof selectExpenseTypeSchema>
export type CreateExpenseType= z.infer<typeof insertExpenseTypeSchema>
export type UpdateExpenseType= z.infer<typeof updateExpenseTypeSchema>