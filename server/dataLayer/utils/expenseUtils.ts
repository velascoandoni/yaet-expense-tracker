import type { CreateExpense, Expense } from "../../../types/expenses"

export function determineOrder(expenseA:Expense,expenseB:Expense):number|undefined{
    const {amount:amountA,final_balance:final_balanceA}=expenseA
    const {amount:amountB,final_balance:final_balanceB}=expenseB
    if(final_balanceA+amountB === final_balanceB){
        return 1
    }
    if(final_balanceB+amountA === final_balanceA){
        return -1
    }
    return undefined
}

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
    let expenseKeyStringMap={}
    return expenses.map(e=>{
        let expenseKeyString=generateExpenseKeyString(e)
        let count=expenseKeyStringMap[expenseKeyString]
        if(!count) count=0
        count++
        expenseKeyStringMap[expenseKeyString]=count
        return {
            ...e,
            repetition:count
        }
    })
}

