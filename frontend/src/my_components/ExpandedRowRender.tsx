import { useGetExpenseQuery } from "../redux/api/expensesApi"
import { MainTable } from "./MainTable"
import { Typography } from "antd"
import { CLASSNAMES } from "../utils/CSS_CONSTS"

export default function ExpandedRowRender({ expense }) {
    const {
        data,
    } = useGetExpenseQuery(expense)
    const { merged_expenses, split_expenses, split_from_expense, merged_to_expense } = data || {}
    const { Text } = Typography
    function getText() {
        if (merged_expenses?.length) return "Merged from:"
        if (split_expenses?.length) return "Split to:"
        if (split_from_expense) return "Split from:"
        if (merged_to_expense) return "Merged to:"
        return undefined
    }
    function getExpenses() {
        if (merged_expenses?.length) return merged_expenses
        if (split_expenses?.length) return split_expenses
        if (split_from_expense) return [split_from_expense]
        if (merged_to_expense) return [merged_to_expense]
        return []
    }

    return <div>
        <Text className={CLASSNAMES.text}>
            {getText()}

        </Text>
        {getText() && <MainTable
            editable={false}
            hideHeader={true}
            expenses={getExpenses()}
        />}
    </div>
}