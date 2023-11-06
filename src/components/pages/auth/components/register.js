import { colorTheme } from "../../../../definitions";
import { useRegister } from "../../../../hooks/auth/useRegister";
import { useNotification } from "../../../../hooks/utility";
import { Button, Card, Form, Input } from "antd";
import React from "react";

export const RegisterPage = () => {
  const { openNotification } = useNotification();
  const { fire: register, state: stateRegister } = useRegister();

  const onFinish = async (values) => {
    register({
      email: values.email,
      username: values.username,
      password: values.password,
    });
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
          Cinorx
        </h1>
        Register
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
          rules={[
            {
              required: true,
              message: "Please input your email!",
              type: "email",
            },
          ]}
        >
          <Input style={{ fontSize: "1.05rem" }} />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
              type: "string",
            },
          ]}
        >
          <Input style={{ fontSize: "1.05rem" }} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password style={{ fontSize: "1.05rem" }} />
        </Form.Item>

        <Form.Item style={{ textAlign: "center" }}>
          <Button
            type="primary"
            size="large"
            shape="round"
            htmlType="submit"
            loading={stateRegister.isLoading}
            style={{ backgroundColor: "#0080AE" }}
          >
            Register
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
