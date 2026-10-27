
import { db } from "./db/db";


import type { CreateExpenseType, ExpenseType } from "../../types/types";
import { types } from "./db/schema/types";
import { eq } from "drizzle-orm";



export async function getTypes(): Promise<ExpenseType[]> {

    return await db.select().from(types)
}


export async function addType(type: CreateExpenseType): Promise<ExpenseType> {

    return (await db.insert(types).values(type).returning())[0]
}

export async function updateType(type: ExpenseType): Promise<ExpenseType> {

    return (await db.update(types).set(type).where(eq(types.type_id,type.type_id)).returning())[0]
}