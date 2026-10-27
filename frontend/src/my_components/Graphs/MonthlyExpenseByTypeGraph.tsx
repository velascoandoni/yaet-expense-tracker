import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { groupExpensesByType } from "../../utils/expenseUtils";

export default function MonthlyExpenseByTypeGraph({
  allExpenses,
  setQuery,
  query,
  types,
  expenses,
}) {
  const typesWithCount = useMemo(() => {
    return groupExpensesByType(expenses, types)
    .map(t => ({ ...t, total: Number(t.total || 0) }))
    .filter(t => t.total !== undefined)
    .filter(t => t.total != 0 && t.type_id!==undefined)
    .filter(t=>t.type_id!=13)

    .filter(t=>t.type_id!=10)
    .sort((a,b)=>a.total-b.total)
  }, [types, expenses])

  let graphData = [...typesWithCount]
  return <div style={{ width: "100%", flex: 1, minHeight: 0, minWidth: 0, display: "flex" }}>
    <ResponsiveContainer width="100%" height="100%" style={{ position: "relative" }}>
    <BarChart data={graphData} 
>
      <CartesianGrid vertical={false} strokeDasharray="5 3" />

      <Bar dataKey="total">
        <LabelList
          dataKey="total"
          position="top"
          formatter={(value) => value === null ? 'N/A' : `${value.toFixed(2)}€`}
          fill="#ffffff"
          fontSize={12} />
        <LabelList
          dataKey="emoji"
          content={<Emoji unified={"1f504"} emojiStyle={EmojiStyle.APPLE} size={20}/>}
          position="top"
          offset={30}
          fill="#ff0000"
          fontSize={24} />
        {graphData.map((item, index) => (
          <Cell
            key={item.type_id || `null-${index}`}
            fill={item.color || '#cccccc'} />
        ))}
      </Bar>

<YAxis
  domain={[
    (dataMin) => dataMin * 1.2,
    (dataMax) => dataMax,
  ]}
/>
      <XAxis
        dataKey="name"
        tick={{ fill: '#bbbbbb', fontSize: 12 }}
        axisLine={false}
        tickLine={false} 
        />
  
      
    </BarChart>
    </ResponsiveContainer>
  </div>
}
