import { Button, Card, DatePicker, Form, Input, message, Row, Table, Tooltip, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import Decimal from 'decimal.js';
import { useEffect, useMemo, useState } from 'react';
import { useCreateExpenseMutation, useCreateExpensesMutation, useMergeExpensesMutation } from '../redux/api/expensesApi';
import { sumExpenses } from '../utils/expenseUtils';
import { CLASSNAMES } from '../utils/CSS_CONSTS';

export default function AddNewExpense({
    mergingExpenses,
    resetExpensesToMerge,
}) {
    const { Text } = Typography
    const [form] = useForm()
    const [createExpense] = useCreateExpenseMutation()
    const [mergeExpenses] = useMergeExpensesMutation()

    function onSubmit(values) {
        const user = JSON.parse(localStorage?.getItem("user"))
        let newExpense = { ...values, amount: values.amount + "", user_id: user.user_id }
        if (mergingExpenses.length > 0) return mergeExpenses({ ...newExpense, merging_expense_ids: mergingExpenses?.map(e => e.expense_id) })
        
        createExpense(newExpense)
        if(resetExpensesToMerge) resetExpensesToMerge()
    }


    const paymentDayStyle = {
        backgroundColor: "green",
        color: "white"
    }
    const debtDayStyle = {
        backgroundColor: "red",
        color: "white"
    }
    function cellRender(current, info) {
        if (info.type !== 'date') {
            return info.originNode;
        }
        if (typeof current === 'number' || typeof current === 'string') {
            return <div className="ant-picker-cell-inner">{current}</div>;
        }
        let expense = mergingExpenses?.find(e => e.date == current.format("YYYY-MM-DD"))
        return (
            <div className="ant-picker-cell-inner" style={expense ? expense.amount > 0 ? paymentDayStyle : debtDayStyle : {}}>
                {current.date()}
            </div>
        );
    };


    const columns = [
        {
            key: "expense_id",
            dataIndex: "expense_id",
            title: "ID",
        },
        {
            key: "name",
            dataIndex: "name",
            title: "GASTO",
        },
        {
            key: "amount",
            dataIndex: "amount",
            title: "Amount",
        },
        {
            key: "date",
            dataIndex: "date",
            title: "Date",
        }
    ];
    const total = useMemo(() => sumExpenses(mergingExpenses), [mergingExpenses])

    useEffect(() => {
        if (mergingExpenses) {
            form.setFieldsValue({
                amount: total,

            });
        }
    }, [total]);
    useEffect(() => {
        if (mergingExpenses?.length == 1) {
            form.setFieldsValue({
                amount: total,
                name: mergingExpenses[0].name,
                date: dayjs(mergingExpenses[0].date, "YYYY-MM-DD"),

            });
        }
    }, [mergingExpenses]);
    function isButtonDisabled(){
        if(!mergingExpenses || mergingExpenses?.length<2) return "Selecciona al menos 2 expenses que mergear"
        return undefined
    }
    return mergingExpenses?.length>0 &&<Card style={{ flexGrow: 1, }}>

         <div style={{ maxWidth: "50vw" }}>
            <Table
                scroll={{ y: "40vh" }}
                size='small'
                className='darkTable'
                pagination={false}
                dataSource={[...mergingExpenses||[]]?.sort((a, b) => b?.amount - a?.amount)}
                columns={columns}
                summary={(_) => <div>
                    <Text className={CLASSNAMES.text} style={{color:"white",fontSize:"2rem"}}>

                    Entradas {"("}{mergingExpenses?.filter(e => e.amount > 0).length}{")"}: {sumExpenses(mergingExpenses?.filter(e => e.amount > 0))} <br />
                    Salidas: {"("}{mergingExpenses?.filter(e => e.amount < 0).length}{")"}: {sumExpenses(mergingExpenses?.filter(e => e.amount < 0))}
                    </Text>

                </div>}
            />

        </div>
        <Form  initialValues={{ date: dayjs() }} form={form} className="w-full max-w-xs whiteForm" labelCol={{span:24}} onFinish={onSubmit}  >
            <Form.Item
                rules={[{ required: true, message: 'Required field' }]}
                name={"name"}
                label={"Name"}
            >
                <Input />
            </Form.Item>
            <Form.Item
                rules={[{ required: true, message: 'Required field' }]}


                name={"amount"}
                label={"Amount"}
            >
                <Input suffix={"€"} disabled={mergingExpenses?.length > 0} value={mergingExpenses ? Number(total) : undefined} type='number' style={{color:Number(total)>0?"green":"red"}} />
            </Form.Item>
            <Form.Item
                rules={[{ required: true, message: 'Required field' }]}


                name={"date"}
                label={"Date"}
            >
                <DatePicker cellRender={cellRender} />
            </Form.Item>

            <Tooltip title={isButtonDisabled()}>
           <Button type="primary" htmlType='submit' disabled={!!isButtonDisabled()}>
                MERGE EXPENSES
            </Button>
            </Tooltip>
 
        </Form>
    </Card>
}