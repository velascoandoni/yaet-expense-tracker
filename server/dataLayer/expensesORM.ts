
import { db, schema } from "./db/db";


import { eq, inArray, and, sql, isNull, lte, gte, like, } from "drizzle-orm";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";
import { expenses } from "./db/schema/expenses";
import type { CreateExpense, Expense } from "../../types/expenses";
import { IllegalArgumentsError } from "./models/Errors/IllegalArgumentsError";
import { types } from "./db/schema/types";
import type { ExpenseType } from "../../types/types";
import AddMultipleExpenses from "../../frontend/src/my_components/AddMultipleExpenses";
import { addRepetitionNumberToExpenses } from "./utils/expenseUtils";
import { ForbiddenOperationError } from "./models/Errors/ForbiddenOperationError";

export async function getExpense(expense_id: number): Promise<Expense | any> {
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
export async function getExpenses(user_id: number, query: any): Promise<Expense[]> {
    const { month, raw, startDate, endDate, active, name, expense, profit } = query
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
                    expense ? lte(expenses.amount, 0) : undefined,
                    profit ? gte(expenses.amount, 0) : undefined,
                )
            ).orderBy(expenses.date, expenses.expense_id)
    return userExpenses
}
export async function markExpensesAsMerged(merging_expense_ids: number[], merged_to: number) {
    let updatedExpenses = await db.update(expenses).set({ merged_to: merged_to, active: "false" }).where(inArray(expenses.expense_id, merging_expense_ids))

    return updatedExpenses
}
export async function removeMarkExpensesAsMerged(unmerging_expense_ids: number[]) {
    let updatedExpenses = await db.update(expenses).set({ merged_to: null, active: "true" }).where(inArray(expenses.expense_id, unmerging_expense_ids))
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

    // No stored balance yet: start counting from this expense itself
    const hasBalance = safeExpense.final_balance !== null;
    const baseBalance = hasBalance ? safeExpense.final_balance : 0;
    const op = hasBalance ? sql`>` : sql`>=`;

    await db.execute(sql`
      WITH ordered AS (
        SELECT
          expense_id,
          SUM(amount::numeric) OVER (
            ORDER BY date, name, amount, repetition
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
          ) + ${baseBalance}::numeric AS new_balance
        FROM ${expenses}
        WHERE date ${op} ${safeExpense.date}
          AND user_id = ${safeExpense.user_id}
          AND raw = true
      )
      UPDATE ${expenses} AS e
      SET final_balance = o.new_balance
      FROM ordered o
      WHERE e.expense_id = o.expense_id
    `);
}

export async function addExpenses(Expenses: CreateExpense[]): Promise<Expense | String[]> {

    let newExpenses = await Promise.all(addRepetitionNumberToExpenses(Expenses).map(async expense => {
        try {

            let result = (await addExpense({ ...expense, raw: true, active: true }))[0]
            return result;
        }

        catch (e) {
            return {
                ...expense,
                error: `${e.message}${e.argument ? `: ${e.argument}` : ""}`
            }

        }
    }))
    let createdExpenses = newExpenses.filter(e => !e.error)
    if (createdExpenses.length < 1) return newExpenses
    let lastExpense = createdExpenses?.[createdExpenses?.length - 1]
    console.log(createdExpenses[0], lastExpense)
    normalizeTransactionsFrom(lastExpense)
    return newExpenses

}



export async function markExpensesAsSplit(split_expense: Expense): Promise<Expense> {
    let updatedExpenses = await db.update(expenses).set({ active: false, was_split: true }).where(eq(expenses.expense_id, split_expense.expense_id)).returning()
    return updatedExpenses[0]
}

export async function addExpensesSplitFrom(Expenses: CreateExpense[], split_expense: Expense): Promise<{ newExpenses: Expense[], splitExpense: Expense }> {
    let newExpenses = await Promise.all(Expenses.map(async expense => {
        try {
            let result = (await addExpense({ ...expense, raw: false, active: true, split_from: split_expense.expense_id }))[0]
            return result;
        }

        catch (e) {
            return {
                ...expense,
                error: e.message + ": " + e.argument ? e.argument : ""
            }

        }
    }))
    let splitExpense = await markExpensesAsSplit(split_expense)
    return { newExpenses, splitExpense }
}
export async function editExpense(Expense: Expense): Promise<Expense[]> {
    if (Expense.amount == "NaN") throw new IllegalArgumentsError({ argument: "amount" })
    if (Expense.final_balance == "NaN") throw new Error("Final balance cant be NaN");


    let updatedExpense = await db.update(expenses).set(Expense).where(eq(expenses.expense_id, Expense.expense_id)).returning()
    return updatedExpense
}
export async function addExpense(expense: CreateExpense): Promise<Expense[]> {
    if (expense.amount == "NaN") throw new IllegalArgumentsError({ argument: "amount" })
    if (expense.final_balance == "NaN") throw new Error("Final balance cant be NaN");

    let newExpense = await db.insert(expenses).values(expense).returning()

    return newExpense
}

export async function addMergingExpense(expense: CreateExpense): Promise<Expense[]> {



    let newExpense = await addExpense({ ...expense, raw: false, was_merged: true })

    await markExpensesAsMerged(expense?.merging_expense_ids, newExpense?.[0].expense_id)

    return newExpense
}

export async function deleteExpense(expense_id: number): Promise<Expense[]> {
    let expense = await getExpense(expense_id)
    console.log(expense)
    if (expense.raw) throw new ForbiddenOperationError({ argument: "Expense was loaded from file" })
    if (expense?.merged_expenses.length > 0) await removeMarkExpensesAsMerged(expense?.merged_expenses?.map(e => e.expense_id))
    let deletedExpense = await db.delete(expenses).where(eq(expenses.expense_id, expense_id)).returning()
    return deletedExpense
}


