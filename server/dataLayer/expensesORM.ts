
import { db } from "./db/db";


import { and, eq, gte, inArray, lte, sql, desc } from "drizzle-orm";
import type { CreateExpense, Expense, UpdateExpense } from "../../types/expenses";
import { expenses } from "./db/schema/expenses";
import { ForbiddenOperationError } from "./models/Errors/ForbiddenOperationError";
import { IllegalArgumentsError } from "./models/Errors/IllegalArgumentsError";
import { addRepetitionNumberToExpenses } from "./utils/expenseUtils";
import { NotFoundError } from "./models/Errors/NotFoundError";
import { IllegalOperationError } from "./models/Errors/IllegalOperationError";



export async function getExpense(expense_id: number) {
    let expense = await db.query.expenses.findFirst({
        where: (e, { eq }) => eq(e.expense_id, expense_id),
        with: {
            merged_expenses: true,
            split_to_expenses: true,
            split_from_expense: true,
            merged_to_expense: true,
        },
    });
    return expense
}
export async function getExpenses(query: any): Promise<Expense[]> {
    const { month, raw, startDate, endDate, active, name, expense, profit, user_id } = query
    console.log(expense, profit)
    let userExpenses = await
        db.select()
            .from(expenses)
            .where(
                and(
                    eq(expenses.user_id, user_id),
                    startDate ? gte(expenses.date, startDate) : undefined,
                    endDate ? lte(expenses.date, endDate) : undefined,
                    month ? sql`EXTRACT(MONTH FROM ${expenses.date}) = ${month}` : undefined,
                    month ? sql`EXTRACT(YEAR FROM ${expenses.date}) = ${2025}` : undefined,
                    raw ? eq(expenses.raw, true) : undefined,
                    active ? eq(expenses.active, true) : undefined,
                    name ? sql`LOWER(${expenses.name}) LIKE LOWER(${'%' + name + '%'})` : undefined,
                    expense ? lte(expenses.amount, "0") : undefined,
                    profit ? gte(expenses.amount, "0") : undefined,
                )
            ).orderBy(expenses.date, expenses.expense_id)
    return userExpenses
}
export async function markExpensesAsMerged(merging_expense_ids: number[], merged_to: number) {
    let updatedExpenses = await db.update(expenses).set({ merged_to: merged_to, active: false }).where(inArray(expenses.expense_id, merging_expense_ids))

    return updatedExpenses
}
export async function removeMarkExpensesAsMerged(unmerging_expense_ids: number[]) {
    let updatedExpenses = await db.update(expenses).set({ merged_to: null, active: true }).where(inArray(expenses.expense_id, unmerging_expense_ids))
    console.log(unmerging_expense_ids, updatedExpenses)
    return updatedExpenses
}
export async function normalizeTransactionsFrom(expense: Expense) {
    const safeDateRow = (await db.select({ date: expenses.date }).from(expenses)
        .where(and(
            eq(expenses.raw, true),
            eq(expenses.user_id, expense.user_id),
            lte(expenses.date, expense.date),
        ))
        .groupBy(expenses.date)
        .having(sql`COUNT(*) = 1`)
        .orderBy(desc(expenses.date))   // latest safe date, not earliest
        .limit(1))[0];
    if (!safeDateRow) return;

    const safeExpense = (await db.select().from(expenses)
        .where(and(
            eq(expenses.user_id, expense.user_id),
            eq(expenses.date, safeDateRow.date),
            eq(expenses.raw, true),     // match the "safe" query
        ))
        .limit(1))[0];
    if (!safeExpense) return;
}

type AddExpenseResult = (Expense & { error: null }) | (CreateExpense & { expense_id: null; error: string })

export async function addExpenses(Expenses: CreateExpense[]): Promise<AddExpenseResult[]> {

    let newExpenses = await Promise.all(addRepetitionNumberToExpenses(Expenses).map(async expense => {
        try {

            let result = (await addExpense({ ...expense, raw: true, active: true }))[0]
            return {
                ...result,
                error:null
            };
        }

        catch (e: unknown) {
            if (e instanceof IllegalArgumentsError)
                return {
                    expense_id:null,
                    ...expense,
                    error: `${e.message}${e.argument ? `: ${e.argument}` : ""}`
                }
            if (e instanceof Error)
                return {
                    expense_id:null,
                    ...expense,
                    error: e?.message
                }
            return {
                expense_id:null,
                ...expense,
                error: "unknow error occurred"
            }
        }
    }))
    let createdExpenses = newExpenses.filter(
        (expense): expense is Expense & { error: null } => expense.error === null && expense.expense_id !== null
    )
    let lastExpense = createdExpenses[createdExpenses.length - 1]
    if (!lastExpense) return newExpenses
    normalizeTransactionsFrom(lastExpense)
    return newExpenses

}

export async function isExpenseMarkedAsSplit(expense: UpdateExpense) {
    let splitingExpense = await getExpense(expense.expense_id)
    if (!splitingExpense) throw new NotFoundError()
    if (splitingExpense.was_split) return true
    return false
}

export async function markExpensesAsSplit(split_expense: UpdateExpense): Promise<Expense> {
    let updatedExpenses = await db.update(expenses).set({ active: false, was_split: true }).where(eq(expenses.expense_id, split_expense.expense_id)).returning()
    return updatedExpenses[0]
}

export async function addExpensesSplitFrom(Expenses: CreateExpense[], split_expense: UpdateExpense): Promise<{ newExpenses: Expense[], splitExpense: Expense }> {
    return db.transaction(async tx => {
        const [sourceExpense] = await tx
            .select({ expense_id: expenses.expense_id, was_split: expenses.was_split })
            .from(expenses)
            .where(eq(expenses.expense_id, split_expense.expense_id))
            .for("update")

        if (!sourceExpense) throw new NotFoundError()
        if (sourceExpense.was_split) throw new IllegalOperationError()

        const newExpenses: Expense[] = []
        for (const expense of Expenses) {
            if (expense.amount == "NaN") throw new IllegalArgumentsError({ argument: "amount" })

            const [newExpense] = await tx
                .insert(expenses)
                .values({ ...expense, raw: false, active: true, split_from: split_expense.expense_id })
                .returning()
            newExpenses.push(newExpense)
        }

        const [splitExpense] = await tx
            .update(expenses)
            .set({ active: false, was_split: true })
            .where(eq(expenses.expense_id, split_expense.expense_id))
            .returning()

        return { newExpenses, splitExpense }
    })
}
export async function editExpense(Expense: UpdateExpense): Promise<Expense[]> {
    if (Expense.amount == "NaN") throw new IllegalArgumentsError({ argument: "amount" })


    let updatedExpense = await db.update(expenses).set(Expense).where(eq(expenses.expense_id, Expense.expense_id)).returning()
    return updatedExpense
}
export async function addExpense(expense: CreateExpense): Promise<Expense[]> {
    if (expense.amount == "NaN") throw new IllegalArgumentsError({ argument: "amount" })

    let newExpense = await db.insert(expenses).values(expense).returning()

    return newExpense
}

export async function addMergingExpense(expense: CreateExpense): Promise<Expense[]> {
    const { merging_expense_ids: mergingExpenseIds, ...mergedExpenseData } = expense
    if (!mergingExpenseIds?.length) {
        throw new IllegalArgumentsError({ argument: "merging_expense_ids" })
    }
    if (expense.amount == "NaN") throw new IllegalArgumentsError({ argument: "amount" })

    return db.transaction(async tx => {
        const sourceExpenses = await tx
            .select({ expense_id: expenses.expense_id, active: expenses.active, merged_to: expenses.merged_to })
            .from(expenses)
            .where(inArray(expenses.expense_id, mergingExpenseIds))
            .for("update")

        if (sourceExpenses.length !== mergingExpenseIds.length) throw new NotFoundError()
        if (sourceExpenses.some(source => !source.active || source.merged_to !== null)) {
            throw new IllegalOperationError({ message: "One or more expenses can no longer be merged" })
        }
        const [amountCheck] = await tx
            .select({ matches: sql<boolean>`COALESCE(SUM(${expenses.amount}), 0) = ${expense.amount}::numeric` })
            .from(expenses)
            .where(inArray(expenses.expense_id, mergingExpenseIds))

        if (!amountCheck.matches) {
            throw new IllegalArgumentsError({ argument: "amount", message: "Merged expense amount must equal the sum of its source expenses" })
        }

        const [newExpense] = await tx
            .insert(expenses)
            .values({ ...mergedExpenseData, raw: false, was_merged: true })
            .returning()

        const markedExpenses = await tx
            .update(expenses)
            .set({ merged_to: newExpense.expense_id, active: false })
            .where(inArray(expenses.expense_id, mergingExpenseIds))
            .returning({ expense_id: expenses.expense_id })

        if (markedExpenses.length !== mergingExpenseIds.length) {
            throw new IllegalOperationError({ message: "Could not mark all source expenses as merged" })
        }

        return [newExpense]
    })
}

export async function deleteExpense(expense_id: number): Promise<Expense[]> {
    let expense = await getExpense(expense_id)
    if (!expense) throw new NotFoundError()
    if (expense.raw) throw new ForbiddenOperationError({ argument: "Expense was loaded from file" })
    if (expense?.merged_expenses.length > 0) await removeMarkExpensesAsMerged(expense?.merged_expenses?.map((e: Expense) => e.expense_id))
    let deletedExpense = await db.delete(expenses).where(eq(expenses.expense_id, expense_id)).returning()
    return deletedExpense
}


