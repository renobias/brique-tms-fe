import { LoadingTransparentPage } from "../components/../../../LoadingTransparentPage";
import { colorTheme } from "../../../../../definitions";
import { useGet } from "../../../../../hooks/data/useGet";
import { usePost } from "../../../../../hooks/data/usePost";
import { useNotification } from "../../../../../hooks/utility";
import { isSuccesfullRequest } from "../../../../../rest-data-provider/briqueTms/utils";
import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Image,
  Input,
  Row,
  Select,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authProvider } from "../../../../../authProvider";
import { encryptContent } from "../../../../../crypto";
import {
  CaretRightOutlined,
  CloseOutlined,
  DownOutlined,
  RightOutlined,
} from "@ant-design/icons";

export const CreateCategoriesComponent = () => {
  const identity = authProvider.getIdentity();
  const { openNotification } = useNotification();
  const navigate = useNavigate();

  const [formCreate] = Form.useForm();

  const { state: createCategoryState, fire: createCategory } = usePost({
    dataProviderName: "briqueTms",
    resource: "form/categories",
    variables: "asdasdasd",
    meta: { headers: { "Content-Type": "text/plain" } },
    handleResult: () => {
      if (isSuccesfullRequest(createCategoryState?.statusCode)) {
        console.log("success");
      }
    },
  });

  const onFinish = async (values) => {
    console.log("onFinish Form Values -> ", values);

    const payloadSend = {
      isCreate: true,
      data: {
        categories: [
          {
            name: values?.name,
            displayName: values?.displayName,
            notes: values?.notes,
          },
        ],
      },
    };
    const data = {
      clientKey: identity?.clientKey,
      sharedKey: identity?.sharedKey,
      payload: { ...payloadSend },
    };
    createCategory({
      dataProviderName: "briqueTms",
      resource: "form/categories",
      variables: encryptContent(data),
      meta: { headers: { "Content-Type": "text/plain" } },
      handleResult: () => {
        if (isSuccesfullRequest(createCategoryState?.statusCode)) {
          console.log("success");
          navigate("/master/category", {
            replace: true,
          });
        }
      },
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
    <>
      <h2 style={{ marginBottom: "20px" }}>Add Category</h2>
      <LoadingTransparentPage isLoading={createCategoryState?.isLoading}>
        <Form
          layout="vertical"
          form={formCreate}
          //   initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          style={formStyle}
          name="dynamic_form_complex"
          initialValues={{
            fields: [],
          }}
          onValuesChange={() => {
            console.log("values -> ", formCreate.getFieldsValue());
            console.log(
              "format currencyy -> ",
              formCreate.getFieldValue([
                "formFields",
                "fieldConstraintFormatCurrency",
              ])
            );
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input Name!",
              },
            ]}
          >
            <Input style={{ fontSize: "1.05rem" }} />
          </Form.Item>
          <Form.Item
            label="Display Name"
            name="displayName"
            rules={[
              {
                required: true,
                message: "Please input Display Name!",
              },
            ]}
          >
            <Input style={{ fontSize: "1.05rem" }} />
          </Form.Item>
          {/* <Form.Item
            label="Order Number"
            name="orderNo"
            rules={[
              {
                required: true,
                message: "Please input Order Number!",
              },
            ]}
          >
            <Input style={{ fontSize: "1.05rem" }} type="number" />
          </Form.Item> */}
          <Form.Item label="Notes" name="notes">
            <Input style={{ fontSize: "1.05rem" }} />
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <Button
              type="primary"
              size="large"
              shape="round"
              htmlType="submit"
              style={{
                backgroundColor: colorTheme.Background.buttonPositive["light"],
                marginTop: "30px",
              }}
            >
              Add Category
            </Button>
          </Form.Item>
        </Form>
      </LoadingTransparentPage>
    </>
  );
};

const formStyle = {
  backgroundColor: colorTheme.Background.form["light"],
  padding: "35px",
  // paddingBottom: 0,
  // paddingRight: 0,
  margin: 0,
  borderRadius: 15,
  height: "80vh",
  overflow: "auto",
};
