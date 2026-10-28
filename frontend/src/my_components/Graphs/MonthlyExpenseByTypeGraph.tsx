import { useMemo } from "react";
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis } from "recharts";
import { groupExpensesByType } from "../../utils/expenseUtils";
import { Emoji, EmojiStyle } from "emoji-picker-react";

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
    .filter(t => t.total < 0 && t.type_id!==undefined)
    .filter(t=>t.type_id!=13)

    .filter(t=>t.type_id!=10)
    .sort((a,b)=>a.total-b.total)
  }, [types, expenses])

  let graphData = typesWithCount.map(type => ({ ...type, total: Math.abs(type.total) }))
  return <div style={{ width: "100%", flex: 1, minHeight: 0, minWidth: 0, display: "flex" }}>
    <ResponsiveContainer width="100%" height="100%" style={{ position: "relative" }}>
    <BarChart data={graphData} 
>
      <Bar dataKey="total">
        <LabelList
          dataKey="total"
          position="top"
          formatter={(value) => value === null ? 'N/A' : `${value?.toFixed(2)}€`}
          fill="#ffffff"
          fontSize={12} />
        <LabelList
          dataKey="emoji"
          content={({ value }) => typeof value === "string" && value
            ? <div><Emoji unified={value} emojiStyle={EmojiStyle.APPLE} size={20} /></div>
            : null}
          position="top"
          
          fill="#ffffff"
          fontSize={12} />
        {graphData.map((item, index) => (
          <Cell
            key={item.type_id || `null-${index}`}
            fill={item.color || '#cccccc'} />
        ))}
      </Bar>

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
