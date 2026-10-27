import { Card, Collapse, Table } from "antd";
import Decimal from "decimal.js";
import { useMemo, useState } from "react";
import { useGetExpenseTypesQuery } from "../redux/api/expenseTypesApi";
import { Pie, PieChart } from "recharts";
import { getUser } from "../utils/basicUtils";
import { Link, useSearch } from "@tanstack/react-router";
import TypeTag from "./TypeTag";
import { groupExpensesByType } from "../utils/expenseUtils";

export function Stats({
    expenses
}) {
    const {
        data: types
    } = useGetExpenseTypesQuery(undefined, {})

    const user = getUser()


    const typesWithCount = useMemo(() => {
        return groupExpensesByType(expenses, types)
    }, [types, expenses])

    const columns = [
        {
            key: "name",
            dataIndex: "name",
            title: "TYPE",
            render: (v, type) => {
                return <TypeTag type={type} />
            }
        },
        {
            key: "total",
            dataIndex: "total",
            title: "TOTAL",
        },
    ]

    const [selectedRowKeys, setSelectedRowKeys] = useState(typesWithCount?.map(t => t.type_id))
    function isSelected(type) {
        return selectedRowKeys?.includes(type?.type_id)
    }
    {/*  */ }
    return <div>
        <Link to="/stats">
            See full stats view
        </Link>
        <Table
            rowKey={"type_id"}
            columns={columns}
            pagination={false}
            dataSource={typesWithCount?.filter(t => t.total)}
            rowSelection={{
                selectedRowKeys,
                onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys)
            }}
            summary={(data) => {
                return <div>TOTAL: {data?.filter(t => t.total && isSelected(t)).reduce((accumulator, currentValue) => {
                    let sum = accumulator.add(new Decimal(currentValue.total))
                    return sum
                }, new Decimal(0)).toNumber()}</div>
            }}
        />
        <PieChart width={300} height={250}>
            <Pie data={typesWithCount?.filter(t => t.total < 0 && isSelected(t)).map(t => ({ ...t, fill: t.color, total: new Decimal(t.total).abs().toNumber() }))} label dataKey="total" nameKey="name" fill="#8884d8" />
        </PieChart>
    </div>

}