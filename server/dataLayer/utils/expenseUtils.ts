import type { CreateExpense, Expense } from "../../../types/expenses"



export function groupExpensesByDay(expenses:Expense[]) {
    return Object.groupBy(expenses, expense => {
        return new Date(expense.date).toDateString();
    });
}

// Note: Object.groupBy() is a newer feature, check browser compatibility
export function orderExpenses(expenses:Expense[]){
    console.log(groupExpensesByDay(expenses))

}


export function generateExpenseKeyString(expense:CreateExpense){
    return expense.name+expense.date+expense.amount
}


export function addRepetitionNumberToExpenses(expenses:CreateExpense[]): CreateExpense[]{
    let expenseKeyStringMap: Record<string, number> = {}
    return expenses.map(e=>{
        let expenseKeyString=generateExpenseKeyString(e)
        let count=expenseKeyStringMap[expenseKeyString]
        if(!count) count=0
        count++
        expenseKeyStringMap[expenseKeyString]=count
        return {
            ...e,
            repetition:count+""
        }
    })
}

