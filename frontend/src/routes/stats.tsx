import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import MonthlyBanceGraph from '../my_components/Graphs/MonthlyBanceGraph'

export const Route = createFileRoute('/stats')({
  component: RouteComponent,
})

import { useGetExpensesByUserQuery } from '../redux/api/expensesApi'
import { useGetExpenseTypesQuery } from '../redux/api/expenseTypesApi'
import { getUser } from '../utils/basicUtils'
function RouteComponent() {
  const [query, setQuery] = useState({ active: true })
  const {
    data: types
  } = useGetExpenseTypesQuery(undefined, {})

  const user = getUser()

  const {
    data: allExpenses,
  } = useGetExpensesByUserQuery({ active: true, user_id: user?.user_id }, { refetchOnMountOrArgChange: true })
  const {
    data: expenses,
  } = useGetExpensesByUserQuery({ ...query, user_id: user?.user_id }, { refetchOnMountOrArgChange: true })





  return <div style={{ background: "white", color: "black" }}>
    <MonthlyBanceGraph 
      allExpenses={allExpenses}
      expenses={expenses}
      types={types}
      query={query}
      setQuery={setQuery}
    />
  </div>

}
