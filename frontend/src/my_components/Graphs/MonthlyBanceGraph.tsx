import { Tooltip } from "antd";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";
import { getPayDayIntervals, getPayDays, groupExpensesByPayDay, groupExpensesByType, sumExpenses } from "../../utils/expenseUtils";
import SimpleCarouselDateSelector from "../Controls/SimpleCarouselDateSelector ";

export default function MonthlyBanceGraph({
    allExpenses,
    setQuery,
    query,
    types,
    expenses,
}) {




    let graphData=groupExpensesByPayDay(expenses,false)
    return <><BarChart data={graphData} width={1200} height={1000}>
    <CartesianGrid vertical={false} strokeDasharray="3 3" />
    <XAxis
        dataKey="month"
        tick={{ fill: '#666', fontSize: 12 }}
        axisLine={false}
        tickLine={false} />
    <YAxis
        tick={{ fill: '#666', fontSize: 12 }}
        axisLine={false}
        tickLine={false}
        domain={[-1000, 3000]}  // Fixed domain to show reasonable range
        // Optional: Format Y-axis labels with dollar sign
        tickFormatter={(value) => `${value.toFixed(0)}€`} />
    <Bar dataKey="total">
        <LabelList
            dataKey="total"
            position="top"
            formatter={(value) => value === null ? 'N/A' : `${value}€`}
            fill="#333"
            fontSize={12} />
        {/* Removed emoji LabelList since data doesn't have emoji field */}
        {graphData.map((item, index) => (
            <Cell
                key={`${item.name}-${index}`}
                fill={item.total>0?"green":"red"} />
        ))}
    </Bar>
</BarChart></>
}
