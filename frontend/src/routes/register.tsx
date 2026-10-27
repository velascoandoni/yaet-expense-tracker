import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Card, Input, Row, Typography } from 'antd';
import Form, { useForm } from 'antd/es/form/Form';
import { useState } from 'react';
import { useRegisterMutation } from '../redux/api/usersApi';
import { classNameMerger, CLASSNAMES } from '../utils/CSS_CONSTS';

export const Route = createFileRoute('/register')({
    component: Register,
})
function Register({
}: any
) {
    const Item = { Form }
    const [register, result] = useRegisterMutation()
    const navigate = useNavigate()
    const [failed, setFailed] = useState(false)
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    async function onSubmit(values) {

        try {
            if(values.password!=values.repassword) return form.setFields([{name:"repassword",errors:["Passwords dont match"]}])
            console.log(values)
            let user = await register(values).unwrap();
            console.log(user)
            localStorage.setItem("user", JSON.stringify(user))
            navigate({ to: "/" })

        } catch (e) {

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
                        <Form.Item
                label="Repeat password"
                name="repassword"
            >

                <Input
                    placeholder="Repeat password"
                />
            </Form.Item>
            <div style={{display:"flex",flexDirection:"column",alignContent:"center",textAlign:"center"}}>

            <Button type='primary' htmlType='submit' >
                Register
            </Button>
            <br/>
            <Text  className={CLASSNAMES.text}>
                Already have an account? <br/>
                <Text className={classNameMerger(CLASSNAMES.text,CLASSNAMES.clickableText)}  onClick={()=>navigate({to:"/login"})}>
                    Go to LOG IN
                </Text>
            </Text>
            </div>

        </Form>
    </Card></Row>
}