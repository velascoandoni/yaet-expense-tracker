import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input, notification } from 'antd';
import type { InputRef } from 'antd';
import { useReducer, useRef } from 'react';
import { useCreateExpensesMutation } from '../redux/api/expensesApi';

export default function AddMultipleExpenses() {
    const [createExpenses, result2] = useCreateExpensesMutation()


    function parseFile(fileString) {
        const rows = fileString.split("\r\n")
        const { user_id } = JSON.parse(localStorage?.getItem("user"))

        return rows.slice(1).map(row => {
            const [_, date, _date, name, amount] = row.split(";")
            const expense = {
                date,
                name,
                amount: `${Number(amount.replace(",", "."))}`,
                user_id
            }
            return expense

        })

    }

    function readFile(e) {
        const file = e.target.files[0]
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                createExpensesFromFile(evt.currentTarget.result)
            }
            reader.onerror = function (evt) {
                console.log(evt)

            }
        }

    }
    async function createExpensesFromFile(file) {
        const expenses = parseFile(file)
        const result = await createExpenses(expenses)
        if (!result.data) {
            notification.error({
                message: "Unexpected error generating expenses"
            })
        }
        let totalSent = expenses.length
        const errorMap = {}
        result.data?.forEach(e => {
            if (!e.error) return;
            let currentErrorCount = errorMap[e.error]
            if (!currentErrorCount) currentErrorCount = 0
            errorMap[e.error] = currentErrorCount + 1
        })
        let totalErrors = result.data.filter(e => e.error).length
        if (totalErrors == totalSent) {
            notification.error({
                message: "No expenses were created because of the following errors: " + Object.keys(errorMap).join(", ")
            })
        }
        if (totalErrors == 0) {
            notification.success({
                message: "Expenses created succesfully"
            })
        }
        if (totalErrors > 0 && totalErrors < totalSent) {
            notification.warning({
                message: totalSent - totalErrors + " expenses created succesfully, but " + totalErrors + " expenses could not be created  because of the following errors: " + Object.keys(errorMap).join(", ")
            })
        }

    }
    let inputRef=useRef<InputRef>(null);
    return <>
        <Input ref={inputRef} type='file' accept='.csv' onChange={readFile} style={{marginRight:"10px",display:"none"}} />
        <Button type="dashed" style={{width:"50px",height:"50px",borderRadius:"20px"}}  onClick={()=>inputRef.current?.input?.click()} >
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
        </Button>

    </>
}