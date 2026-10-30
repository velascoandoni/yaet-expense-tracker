import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Card, Input, Row, Typography } from 'antd';
import Form from 'antd/es/form';
import useForm from 'antd/es/form/hooks/useForm';
import { useState } from 'react';
import { useLoginMutation } from '../redux/api/usersApi';
import { CLASSNAMES, classNameMerger } from '../utils/CSS_CONSTS';

export const Route = createFileRoute('/login')({
    component: Login,
})
function Login({
}: any
) {
    const Item = { Form }
    const [login, result] = useLoginMutation()
    const navigate = useNavigate()
    const [failed, setFailed] = useState(false)
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    async function onSubmit(values) {

        try {
            let user = await login(values).unwrap();
            localStorage.setItem("user", JSON.stringify(user))
            navigate({ to: "/" })

        }catch (e:unknown) {

            setFailed(true)
        }
    }
    const {Text}=Typography

    const [form] = useForm()
    return <Row className='full-screen-no-scroll-view'><Card>
        <Form form={form} className="w-full max-w-xs" onFinish={onSubmit}>
            <Form.Item
                label="Username"
                name="username"
            >

                <Input

                    placeholder="Username"
                />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
            >

                <Input
                    placeholder="Password"
                />
            </Form.Item>


            <div style={{ display: "flex", flexDirection: "column", alignContent: "center", textAlign: "center" }}>

                <Button type='primary' htmlType='submit' >
                    Login
                </Button>
                <br />
                <Text className={CLASSNAMES.text}>
                    Don't have an account? <br />
                    <Text className={classNameMerger(CLASSNAMES.text, CLASSNAMES.clickableText)} onClick={() => navigate({ to: "/register" })}>
                        Go to REGISTER
                    </Text>
                </Text>
            </div>

        </Form>
    </Card>
    </Row>
}