import { createFileRoute, Link } from '@tanstack/react-router'
import { Row } from 'antd'

export const Route = createFileRoute('/logout')({
  component: RouteComponent,
})

function RouteComponent() {

  localStorage.removeItem("user")

  return <Row className='full-screen-no-scroll-view'><div>Logged out, <Link to={'/'}> home</Link></div></Row>
}
