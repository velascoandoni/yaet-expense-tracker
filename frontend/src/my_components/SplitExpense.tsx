import { Button, Card, Input, InputNumber, Row, Table, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useSplitExpenseMutation } from '../redux/api/expensesApi';

import { faCalculator } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Decimal from 'decimal.js';
import { CreateExpense } from '../../../types/expenses';
import { decimalSum } from '../utils/basicUtils';

export default function SplitExpense({
    expenseToSplit,
    resetExpenseToSplit,
}) {
    const [splitExpense, result] = useSplitExpenseMutation()
    const [newExpenses, setNewExpenses]: [CreateExpense[], Function] = useState([])



    const handleSave = (key, dataIndex, value) => {
        const newData = [...newExpenses];
        const target = newData.find(item => item.key === key);

        if (target) {
            target[dataIndex] = value;
            setNewExpenses(newData);
        }
    };
    function calculateValue(expense) {
        const sumOfRest = decimalSum(newExpenses.filter(e => e.key != expense.key), "amount")
        return new Decimal(expenseToSplit.amount).minus(sumOfRest).toNumber()

    }
    const columns = [
        {
            key: "name",
            dataIndex: "name",
            title: "GASTO",
            editable: true,
            render: (text, record) => {
                if (record.original) return text;
                return <Input
                    value={text}
                    onChange={(e) => handleSave(record.key, 'name', e.target.value)}
                    placeholder="Enter expense name"
                />
            },
        },
        {
            key: "amount",
            dataIndex: "amount",
            title: "Amount",
            editable: true,
            render: (text, record) => {
                if (record.original) return text;

                return <InputNumber
                    value={text}
                    onChange={(value) => handleSave(record.key, 'amount', value)}
                    placeholder="Enter amount"
                    addonAfter={<FontAwesomeIcon style={{ zIndex: "99", cursor: "pointer" }} onClick={() => handleSave(record.key, 'amount', calculateValue(record))} icon={faCalculator} />}
                    style={{ width: '100%' }}
                />
            },
        },
        {
            key: "date",
            dataIndex: "date",
            title: "Date",
            editable: true,
            render: (text, record) => {
                if (record.original) return text;
                return <Input
                    type="date"
                    value={text}
                    onChange={(e) => handleSave(record.key, 'date', e.target.value)}
                />
            },
        },
    ];

    useEffect(()=>{
        setNewExpenses([{...expenseToSplit,key:0}])
    },[expenseToSplit])
    function splitExpenseDiabled() {
        if (total != expenseToSplit.amount) return `${total} != ${expenseToSplit.amount}`
        return undefined
    }
    async function split(){
        let data =await splitExpense({ newExpenses: newExpenses.map(e => ({ ...e, amount: e.amount + "" })), expenseToSplit })
        resetExpenseToSplit()
    }
    const total = useMemo(() => decimalSum(newExpenses, "amount"), [newExpenses])
    return expenseToSplit && <Card>

        {newExpenses?.length > 0 && <div style={{ maxWidth: "50vw" }}>
            <Table
                scroll={{ y: "40vh" }}
                size='small'
                pagination={false}
                dataSource={[...newExpenses, { ...expenseToSplit, key: -1, original: true }]}
                columns={columns}
            />

        </div>}
        <Row>
            <Button type='dashed' onClick={() => setNewExpenses(expenses => [...expenses, { ...expenseToSplit, key: expenses.length }])}>ADD NEW EXPENSE </Button>

                <Button type='default'  onClick={() => resetExpenseToSplit()}>CANCEL SPLIT</Button>

            {newExpenses?.length > 1 && <Tooltip title={splitExpenseDiabled()}>
                <Button type='primary' disabled={!!splitExpenseDiabled()} onClick={() => split()}>SPLIT EXPENSE </Button>

            </Tooltip>}

        </Row>
    </Card>
}