import Decimal from "decimal.js"
import type { Expense } from "../../../types/expenses"
import { ExpenseType } from "../../../types/types"
import dayjs from "dayjs"
import { cosineDistance } from "drizzle-orm"





export function isExpense(e: Expense) {
    return e.expense_id >= 0
}

export function sumExpenses(expenses: Expense[]): Number {
    return expenses?.reduce((partialSum, e) => partialSum.add(new Decimal(e.amount)), new Decimal(0)).toNumber()
}




export function groupExpensesByType(expenses: Expense[], types: ExpenseType[] | undefined) {
    const sumByType = {}
    expenses?.forEach(e => {
        let { type_id, amount } = e
        let currentSumCount = sumByType[type_id]
        if (!currentSumCount) currentSumCount = new Decimal(0)
        sumByType[type_id] = currentSumCount.add(new Decimal(amount))
    })
    return [...types || [], { type_id: null, name: "NO TYPE" }]?.map(t => ({ ...t, total: sumByType[t.type_id]?.toString() })).sort((a, b) => a.total - b.total)
}

export function groupExpensesByPayDay(expenses: Expense[], excludeSavings: Boolean) {
    let payDays = getPayDays(expenses)
    let sumByMonth = {}
    expenses?.filter(e => e.type_id != 13).forEach((e: Expense) => {
        let { date, amount } = e
        let payDay = payDays?.find(payDay => dayjs(payDay.date).isAfter(dayjs(date)))
        let payDayIndex = (payDay ? dayjs(payDay?.date, "YYYY-MM-DD") : dayjs()).format("MMM YYYY")
        let currentSumCount = sumByMonth[payDayIndex]
        if (!currentSumCount) currentSumCount = new Decimal(0)
        sumByMonth[payDayIndex] = currentSumCount.add(new Decimal(amount))
    })
    return Object.entries(sumByMonth).map(([month, total]) => ({
        month,
        total: total.toString()
    }));
}

export function isSaving(e: Expense) {
    return e.type_id == 13 || e.name?.includes("AHORRO")
}

export function isPayDay(e: Expense) {
    return e.type_id == 10 || e.name?.includes("NÓMINA") || e.name?.includes("NOMINA")
}

export function getPayDays(expenses: Expense[]) {
    return expenses?.filter(isPayDay)
}

export function getPayDayIntervals(payDays: Expense[]) {
    return [...payDays?.filter(e => e.amount > 1000 && (e.date?.split("-")[2] > 25 || e.date?.split("-")[2] < 5)).map((expense, i) => {
        const nextExpense = payDays?.filter(e => e.amount > 1000 && (e.date?.split("-")[2] > 25 || e.date?.split("-")[2] < 5))?.[i + 1]
        let endDate = nextExpense?.date ? dayjs(nextExpense?.date).subtract(1, "day").format("YYYY-MM-DD") : undefined
        return {
            startDate: expense.date,
            endDate: endDate
        }
    }) || []].reverse()
}


export function getExpenseBetweenDates(startDate: String, endDate: String, expenses: Expense[]) {
    return expenses?.filter(e => {
        let expenseDate = dayjs(e.date, "YYYY-MM-DD")
        let end=endDate?dayjs(endDate, "YYYY-MM-DD"):dayjs()
        let start= dayjs(startDate, "YYYY-MM-DD")
        return expenseDate.isBefore(end) && expenseDate.isAfter(start) || expenseDate.isSame(start) || expenseDate.isSame(end) 
    })||[]
}