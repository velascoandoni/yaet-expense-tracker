import { Button, DatePicker, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { useMemo } from "react";
import { getPayDayIntervals, getPayDays } from "../utils/expenseUtils";

export default function Query({
    query,
    setQuery,
    expenses,
    allExpenses
}) {

    const [form] = useForm()

    const salaryDayStyle = {
        backgroundColor: "green",
        color: "white"
    }
    const extraDayStyle = {
        backgroundColor: "yellowgreen"
    }
    const payDays = useMemo(() => {
        return getPayDays(allExpenses)
    }, [allExpenses])

    const payDayInrtervals = useMemo(() => {
        return getPayDayIntervals(payDays).slice(0, 5)
    }, [payDays])
    function cellRender(current, info) {
        if (info.type !== 'date') {
            return info.originNode;
        }
        if (typeof current === 'number' || typeof current === 'string') {
            return <div className="ant-picker-cell-inner">{current}</div>;
        }
        let expense = payDays?.find(e => e.date == current.format("YYYY-MM-DD"))
        return (
            <div className="ant-picker-cell-inner" style={expense ? expense.amount > 1000 ? salaryDayStyle : extraDayStyle : {}}>
                {current.date()}
            </div>
        );
    };
    function onSelectDate(dates) {
        let startDate = undefined
        let endDate = undefined
        if (dates) {
            startDate = dates[0].format("YYYY-MM-DD")
            endDate = dates[1].format("YYYY-MM-DD")
        }
        setQuery(q => ({ ...q, startDate, endDate }))
    }
    const months = [
        "JANUARY",
        "FEBRUARY",
        "MARCH",
        "APRIL",
        "MAY",
        "JUNE",
        "JULY",
        "AUGUST",
        "SEPTEMBER",
        "OCTOBER",
        "NOVEMBER",
        "DECEMBER"
    ];
    return <div>

        <Row>
            {payDayInrtervals?.map(({ startDate, endDate }) => {
                return <Button onClick={() => setQuery(q => ({ ...q, startDate, endDate }))}>{months[dayjs(endDate).month()]}</Button>
            })}
        </Row>
        
        <DatePicker.RangePicker format={"DD-MM-YYYY"} value={[query.startDate?dayjs(query.startDate):undefined,query.endDate?dayjs(query.endDate):undefined]} cellRender={cellRender} onChange={onSelectDate} />


    </div>
}