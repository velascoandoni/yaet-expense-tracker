import { createFileRoute } from '@tanstack/react-router'
import { Row, Typography } from 'antd'
import { ExpenseTypeSettings } from '../my_components/ExpenseTypeSettings'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Title from 'antd/es/skeleton/Title'
import ContentCard from '../my_components/General/ContentCard'

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
})

function RouteComponent() {
const { Title } = Typography

  return <ContentCard title={"Types"}>
    <ExpenseTypeSettings /> 
  </ContentCard>
}
