import { createFileRoute } from '@tanstack/react-router'
import { Row } from 'antd'
import { AddExpenseTypes } from '../my_components/AddExpenseTypes'

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Row className='full-screen-no-scroll-view'><AddExpenseTypes /></Row>
}
