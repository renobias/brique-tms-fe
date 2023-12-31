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

export const EditCategoriesComponent = () => {
  const identity = authProvider.getIdentity();
  const location = useLocation();
  const categoryId = new URLSearchParams(location.search).get("id");
  const { openNotification } = useNotification();
  const navigate = useNavigate();

  const [formEdit] = Form.useForm();

  const { state: categoryState, fire: getCategory } = useGet({
    dataProviderName: "briqueTms",
    resource: "form/category",
    query: { categoryId },
    handleResult: () => {
      if (isSuccesfullRequest(categoryState?.statusCode)) {
        console.log("success");
      }
    },
  });
  const { state: editCategoriesState, fire: editCategories } = usePost({
    dataProviderName: "briqueTms",
    resource: "form/categories",
    variables: "asdasdasd",
    meta: { headers: { "Content-Type": "text/plain" } },
    handleResult: () => {
      if (isSuccesfullRequest(editCategoriesState?.statusCode)) {
        console.log("success");
      }
    },
  });

  useEffect(() => {
    getCategory({
      dataProviderName: "briqueTms",
      resource: "form/category",
      query: { categoryId },
      handleResult: () => {
        if (isSuccesfullRequest(categoryState?.statusCode)) {
          console.log("category state ->  ", categoryState);
          formEdit.setFieldsValue({ ...categoryState?.data?.category });
          // getCategoryState();
        }
      },
    });
  }, []);

  const onFinish = async (values) => {
    console.log("onFinish Form Values -> ", values);

    const payloadSend = {
      data: {
        categories: [
          {
            id: categoryId,
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
    editCategories({
      dataProviderName: "briqueTms",
      resource: "form/categories",
      variables: encryptContent(data),
      meta: { headers: { "Content-Type": "text/plain" } },
      handleResult: () => {
        if (isSuccesfullRequest(editCategoriesState?.statusCode)) {
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
      <h2 style={{ marginBottom: "20px" }}>Edit Category</h2>
      <LoadingTransparentPage
        isLoading={editCategoriesState?.isLoading || categoryState?.isLoading}
      >
        <Form
          layout="vertical"
          form={formEdit}
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
            console.log("values -> ", formEdit.getFieldsValue());
            console.log(
              "format currencyy -> ",
              formEdit.getFieldValue([
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
              Edit Category
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
