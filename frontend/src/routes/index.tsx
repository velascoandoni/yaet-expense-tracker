import { faChevronLeft, faChevronRight, faCodeFork, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Row, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import dayjs from 'dayjs';
import Decimal from 'decimal.js';
import { useMemo, useState } from 'react';
import AddMultipleExpenses from '../my_components/AddMultipleExpenses';
import AddNewExpense from '../my_components/AddNewExpense';
import Balance from '../my_components/General/Balance';
import ContentCard from '../my_components/General/ContentCard';
import CustomCard from '../my_components/General/CustomCard';
import MonthlyExpenseByTypeGraph from '../my_components/Graphs/MonthlyExpenseByTypeGraph';
import { MainTable } from '../my_components/MainTable';
import Query from '../my_components/Query';
import SplitExpense from '../my_components/SplitExpense';
import { Stats } from '../my_components/Stats';
import { useGetExpensesByUserQuery } from '../redux/api/expensesApi';
import { useGetExpenseTypesQuery } from '../redux/api/expenseTypesApi';
import { getUser } from '../utils/basicUtils';
import { getExpenseBetweenDates, getPayDayIntervals, getPayDays, isPayDay, isSaving, sumExpenses } from '../utils/expenseUtils';

const { Text } = Typography
export const Route = createFileRoute('/')({
  beforeLoad: async ({ location }) => {
    if (!localStorage.getItem("user")) throw redirect({ to: "/login" })

  },
  component: Main,
})

function Main({
}: any) {
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


  const payDayintervals = useMemo(() => getPayDayIntervals(getPayDays(allExpenses)), [allExpenses])
  let startDates = payDayintervals.map(p => p.startDate)
  const [selectedStartDateIndex, setSelectedStartDateIndex] = useState(0)
  const selectedStartDate = startDates?.[selectedStartDateIndex]
  const isFirst = selectedStartDateIndex == 0
  const isLast = selectedStartDateIndex == (startDates?.length - 1)



  function prev() {
    if (isLast) return
    setSelectedStartDateIndex(prev => prev + 1)
  }
  function next() {
    if (isFirst) return
    setSelectedStartDateIndex(prev => prev - 1)
  }

  
  function getMainMonth(selectedMonth){
    let startDate=dayjs(selectedMonth?.startDate)
    let endDate=dayjs(selectedMonth?.endDate)
    if(startDate.month()==endDate.month() || startDate.month()+1!=endDate.month()) return startDate
    let daysOfFirstMonth=startDate.daysInMonth()-Number().valueOf(startDate.format("DD"))
    let daysOfLastMonth=Number().valueOf(endDate.format("DD"))
    if(daysOfFirstMonth>daysOfLastMonth)
      return startDate
    else
      return endDate
  }

  const selectedMonthData = useMemo(() => {

    let selectedMonth = payDayintervals.find(d => d.startDate == selectedStartDate)
    let expensesFromLast = getExpenseBetweenDates(selectedMonth?.startDate, selectedMonth?.endDate, allExpenses)
    let net = sumExpenses(expensesFromLast)
    let savings = sumExpenses(expensesFromLast.filter(isSaving)) * (-1)
    let profit = sumExpenses(expensesFromLast.filter(isPayDay))
    let expense = sumExpenses(expensesFromLast.filter(e => !isPayDay(e) && !isSaving(e)))
    return {
      net,
      savings,
      profit,
      expense,
      expenses: expensesFromLast,
      title: getMainMonth(selectedMonth).format("MMM. YYYY")
    }
  }, [allExpenses, selectedStartDate])


  const gap = "10px"

  return <ContentCard title={<Row style={{ width: "100%" }}><Title style={{ fontSize: "40px",color:"white",margin:0 }}>
    Vista general
    <FontAwesomeIcon style={{ color: isLast ? "gray" : undefined }} icon={faChevronLeft} onClick={() => prev()} />
    <div style={{ minWidth: "300px", display: "inline-block", textAlign: "center" }}>{selectedMonthData.title}</div>
    <FontAwesomeIcon onClick={() => next()} style={{ color: isFirst ? "gray" : undefined }} icon={faChevronRight} />
  </Title></Row>}>

    <div style={{ display: "flex", flexFlow: "row nowrap", gap, position: "relative", boxSizing: "border-box",height:"94%"}}>
      <div style={{ display: "flex", flexFlow: "column nowrap", gap,flexGrow:1 }}>
        <div style={{ flexGrow: 2, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(2, 1fr)", rowGap: gap, columnGap: gap }}>
          <CustomCard title={"Neto"} bodyStyle={{padding:"16px"}} fontSize='30px' style={{ alignContent: "space-between", display: "flex", flexDirection: "column", gridArea: "1 / 1 / 2 / 2" }}>
            <Balance amount={selectedMonthData.net} />
          </CustomCard>
          <CustomCard  title={"Surplus"} fontSize='30px' bodyStyle={{padding:"16px"}} style={{alignContent: "space-between", display: "flex", flexDirection: "column", gridArea: "1 / 2 / 2 / 3" }}>
            <Balance amount={(new Decimal(selectedMonthData.net)).add(new Decimal(selectedMonthData.savings)).toString()} />
          </CustomCard>


          <CustomCard title={"Ganancias"} bodyStyle={{padding:"16px"}} fontSize='30px' style={{ flexGrow: 10, alignContent: "space-between", display: "flex", flexDirection: "column", gridArea: "2 / 1 / 3 / 2" }}>
            <Balance amount={selectedMonthData.profit} />
          </CustomCard>
          <CustomCard title={"Gasto"} bodyStyle={{padding:"16px"}} fontSize='30px' style={{ flexGrow: 10, alignContent: "space-between", display: "flex", flexDirection: "column", gridArea: "2 / 2 / 3 / 3" }}>
            <Balance amount={selectedMonthData.expense} />
          </CustomCard>
          <CustomCard title={"Ahorro"} bodyStyle={{padding:"16px"}} fontSize='30px' style={{ flexGrow: 10, alignContent: "space-between", display: "flex", flexDirection: "column", gridArea: "2 / 3 / 3 / 4" }}>
            <Balance amount={selectedMonthData.savings} />
          </CustomCard>
        </div>
        <div style={{ flexGrow: 90, minHeight: 0, display: "flex" }}>
          <CustomCard title={"Stats"} style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", minHeight: 0 }} bodyStyle={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            <br/>
            <MonthlyExpenseByTypeGraph  allExpenses={allExpenses} expenses={selectedMonthData?.expenses} types={types} />
          </CustomCard>
        </div>


      </div>

      <div style={{ height: "100%",flexGrow:1 }}>
        <CustomCard title={"GASTOS"} bodyStyle={{ height: "100%", overflow: "hidden" }} noPadding style={{ height: "100%", flexGrow: 10, alignContent: "space-between", display: "flex", flexDirection: "column", padding: "0px" }}>
          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <AddMultipleExpenses />

          </div>
          <MainTable
            expenses={[...selectedMonthData?.expenses || []]?.reverse()}
            showBalance={query?.raw}
            editable={false}
            setQuery={setQuery}
            selectable={true}
            maxHeight={"90%"}

          />
        </CustomCard>
      </div>
    </div>
  </ContentCard>
}