import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext';
import { Form, Card, Col, Input, Row, Flex, Button, notification, Spin, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import logo from "../../assets/Logomark.svg";


const Login = () => {
    const { authenticated, setAuthenticated, login } = useContext(AuthContext)
    const [loginForm] = useForm()
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const [spinning, setSpinning] = React.useState(false);

    const handleLogin = async () => {
        setSpinning(true);

        const d = await login(await loginForm.validateFields())
        if (d) {
            api.success({
                message: 'Logged In',
                description:
                    'Credentials are Valid , Loading Dashboard',
                onClose: () => {
                    navigate('/')
                    setSpinning(false);

                }
            });
        }
        else {
            api.error({
                message: 'Login Failed',
                description:
                    'Invalid Credentials',
                onClose: () => {
                    navigate('/welcome')
                    setSpinning(false);

                }
            });
        }
    }

    return (
        <main
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "90vh",
            }}
        >  {contextHolder}
            <Spin spinning={spinning} percent={100} fullscreen />
            <Space direction='vertical'>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>

                    <img src={logo} alt="Logo" height="48px" />
                    <h2>&nbsp;&nbsp;&nbsp;PFVerse</h2>
                </div>
                <Card title={`Sign In`} bordered={false}
                    style={{
                        borderRadius: 8,
                        width: '480px',
                        boxShadow: '1px 1px 10px 0px #2196f38c, -1px -1px 1px 0px #fff9'

                    }}
                >
                    <div style={{ textAlign: "center" }}>
                        <Form layout="vertical" form={loginForm} autoComplete="on">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="username"
                                        label="User Name (user)"
                                        rules={[{ required: true, message: 'Please enter user name' }]}
                                    >
                                        <Input placeholder="Please enter user name" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="password"
                                        label="Password (mern-boilerplate)"
                                        rules={[{ required: true, message: 'Please enter Password' }]}
                                    >
                                        <Input placeholder="Please enter Password" type='password' />
                                    </Form.Item>
                                </Col>
                                <Flex gap="small" wrap>
                                    <Button type="primary" onClick={handleLogin} >Login</Button>
                                </Flex>
                            </Row>
                        </Form>
                    </div>

                </Card>
            </Space>
        </main>
    )
}

export default Login