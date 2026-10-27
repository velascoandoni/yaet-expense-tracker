import { faCodeFork, faTrash } from '@fortawesome/free-solid-svg-icons'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from 'antd'
import { useState } from 'react'
import AddMultipleExpenses from '../my_components/AddMultipleExpenses'
import AddNewExpense from '../my_components/AddNewExpense'
import ContentCard from '../my_components/General/ContentCard'
import CustomCard from '../my_components/General/CustomCard'
import { MainTable } from '../my_components/MainTable'
import SplitExpense from '../my_components/SplitExpense'
import { useDeleteExpenseMutation, useGetExpensesByUserQuery } from '../redux/api/expensesApi'
import { useGetExpenseTypesQuery } from '../redux/api/expenseTypesApi'
import { getUser } from '../utils/basicUtils'

export const Route = createFileRoute('/expenses')({
  component: RouteComponent,
})

function RouteComponent() {
  const [query, setQuery] = useState({ active: true })
  const user = getUser()
  const {
    data: types
  } = useGetExpenseTypesQuery(undefined, {})
  const {
    data: allExpenses,
  } = useGetExpensesByUserQuery({ user_id: user?.user_id, active: true }, { refetchOnMountOrArgChange: true })
  const {
    data: expenses,
  } = useGetExpensesByUserQuery({ ...query, user_id: user?.user_id }, { refetchOnMountOrArgChange: true })

  const [deleteExpense] = useDeleteExpenseMutation()

  const [mergingExpenses, setMerginExpenses] = useState(undefined)

  const [expesenToSplit, setExpenseToSplit] = useState(undefined)

  const gap = "10px"

  return <ContentCard title={"Gestión de gastos"}>


    < div style={{ display: "flex", flexFlow: "row nowrap", gap, height: "100%", position: "relative", boxSizing: "border-box" }}>
      <div style={{ height: "100%", flexGrow: 8 }}>
        <CustomCard bodyStyle={{ height: "100%", overflow: "hidden" }} noPadding style={{ height: "95%", flexGrow: 10, alignContent: "space-between", display: "flex", flexDirection: "column", padding: "0px" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "100%" }}>

            <Button type='secondary' shape='round'>

            </Button>
          </div>
          <MainTable
            mergingExpenses={mergingExpenses}
            expenses={[...expenses || []]?.reverse()}
            showBalance={query?.raw}
            setMerginExpenses={setMerginExpenses}
            editable={true}
            setQuery={setQuery}
            actions={(record) => [
              {
                name: "Split",
                icon: faCodeFork,
                onClick: () => setExpenseToSplit(record)
              },
              !record.raw && {
                name: "Delete",
                icon: faTrash,
                onClick: () => deleteExpense(record)
              }
            ].filter(Boolean)}
            selectable={true}
            maxHeight={"80vh"}
          />
        </CustomCard>
      </div>
      <div style={{ flexGrow: 2 }}>
        <MainTable
          mergingExpenses={[]}
          expenses={[]}
          setMerginExpenses={setMerginExpenses}

          maxHeight={"0vh"}
          style={{ height: 0 }}
        />
        <SplitExpense expenseToSplit={expesenToSplit} resetExpenseToSplit={() => setExpenseToSplit(undefined)} />
        <AddNewExpense mergingExpenses={mergingExpenses} resetExpensesToMerge={() => setMerginExpenses(undefined)} />

        <AddMultipleExpenses />
      </div>
    </div >
  </ContentCard >

}
