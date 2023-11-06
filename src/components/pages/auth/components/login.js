import { colorTheme } from "../../../../definitions";
import { useLogin } from "../../../../hooks/auth/useLogin";
import { useNotification } from "../../../../hooks/utility";
import { Button, Card, Checkbox, Form, Input } from "antd";
import React from "react";

export const LoginPage = () => {
  const { openNotification } = useNotification();
  const { fire: login, state: stateLogin } = useLogin();

  const onFinish = async (values) => {
    login({ email: values.email, password: values.password });
  };

  const onFinishFailed = (errorInfo) => {
    openNotification({
      type: "error",
      title: "Salah input",
      description: "Periksa kembali input anda",
    });
  };

  return (
    <Card
      // title="Login"
      style={{
        borderRadius: "2%",
        width: "448px",
        padding: "50px 20px",
        boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)",
      }}
    >
      <div style={{ marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "26px",
            flex: 1,
            color: colorTheme.text.primary["light"],
            fontFamily: "SF Pro Display",
            fontWeight: 800,
          }}
        >
          Brique TMS
        </h1>
        Login
      </div>
      <Form
        layout="vertical"
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          // initialValue="rb@gmail.com"
          rules={[
            {
              required: true,
              message: "Please input your email!",
              type: "email",
            },
          ]}
        >
          <Input
            style={{ fontSize: "1.05rem" }}
            placeholder="input your email"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          // initialValue="user123!"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            style={{ fontSize: "1.05rem" }}
            placeholder="input your password"
          />
        </Form.Item>

        <Form.Item style={{ textAlign: "center", paddingTop: "20px" }}>
          <Button
            type="primary"
            size="large"
            shape="round"
            htmlType="submit"
            loading={stateLogin.isLoading}
            style={{
              backgroundColor: colorTheme.Background.buttonPositive["light"],
            }}
          >
            Sign in
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
