import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { users } from "../server/dataLayer/db/schema/users"
import z from "zod"

export const insertUserSchema = createInsertSchema(users).omit({user_id:true})
export const selectUserSchema = createSelectSchema(users)
export const publicUserSchema = createSelectSchema(users).omit({salt:true,password:true})

export const updateUserSchema = createUpdateSchema(users)

export type User= z.infer<typeof selectUserSchema>
export type CreateUser= z.infer<typeof insertUserSchema>
export type PublicUser= z.infer<typeof publicUserSchema>
