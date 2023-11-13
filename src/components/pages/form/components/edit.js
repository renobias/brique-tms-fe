import { LoadingTransparentPage } from "../components/../../LoadingTransparentPage";
import { colorTheme } from "../../../../definitions";
import { useGet } from "../../../../hooks/data/useGet";
import { usePost } from "../../../../hooks/data/usePost";
import { useNotification } from "../../../../hooks/utility";
import { isSuccesfullRequest } from "../../../../rest-data-provider/briqueTms/utils";
import { Button, Card, Col, Collapse, Form, Image, Input, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authProvider } from "../../../../authProvider";
import { encryptContent } from "../../../../crypto";
import { CaretRightOutlined } from "@ant-design/icons";

const panelStyle = {
  marginBottom: 15,
  background: "#f5f5f5",
  borderRadius: 10,
  border: "none",
};

export const EditFormComponent = () => {
  const { clientKey, sharedKey } = authProvider.getIdentity();
  const location = useLocation();
  const formId = new URLSearchParams(location.search).get("id");

  const { openNotification } = useNotification();
  //   const router = useRouter();
  const navigate = useNavigate();
  //   const { id, studioId } = router.query;

  const [formStructure, setFormStructure] = useState({});
  const [formEdit] = Form.useForm();
  const [formEditImage, setFormEditImage] = useState({
    image: null,
  });

  const { fire: createForm, state: stateCreateForm } = usePost({
    dataProviderName: "briqueTms",
    resource: "form/structure",
    handleResult: () => {
      if (isSuccesfullRequest(stateCreateForm.statusCode)) {
        openNotification({
          title: "Success Edit Form",
          description: `${stateCreateForm?.data?.title} successfully edit`,
          type: "success",
        });
        setTimeout(() => {
          navigate("/form/list", {
            replace: true,
          });
        }, 2000);
      }
    },
  });

  const { state: stateFormStructure, fire: getFormStructure } = useGet({
    dataProviderName: "briqueTms",
    resource: "form/structure",
    query: { formId },
    handleResult: () => {
      if (isSuccesfullRequest(stateFormStructure.statusCode)) {
        // setFormStructure([...stateFormStructure?.data?.movies]);
        // const dataEdit = stateMovieList?.data?.movies.filter((movie) => {
        //   return id == movie.id;
        // });
        // formEdit.setFieldsValue({
        //   title: dataEdit[0]?.title,
        //   description: dataEdit[0]?.description,
        //   director: dataEdit[0]?.director,
        //   genre: dataEdit[0]?.genre,
        // });
        // setFormEditImage({
        //   ...formEditImage,
        //   image: `data:image/jpg;base64, ${dataEdit[0]?.image}`,
        // });
      }
    },
  });

  useEffect(() => {
    getFormStructure({
      dataProviderName: "briqueTms",
      resource: "form/structure",
      query: { formId },
      handleResult: () => {
        if (isSuccesfullRequest(stateFormStructure.statusCode)) {
          // setFormStructure({ ...stateFormStructure?.data });
          formEdit.setFieldsValue({ ...stateFormStructure?.data });
        }
      },
    });
  }, []);

  const onFinish = async (values) => {
    // createForm({
    //   dataProviderName: "briqueTms",
    //   resource: "form/structure",
    //   variables: {
    //     id,
    //     StudioId: studioId,
    //     title: values.title,
    //     description: values.description,
    //     director: values.director,
    //     genre: values.genre,
    //     image: formEditImage?.image?.split(",")[1],
    //   },
    // });
    // await handleOnSubmit(values.email, values.password);
  };

  const onFinishFailed = (errorInfo) => {
    openNotification({
      type: "error",
      title: "Salah input",
      description: "Periksa kembali input anda",
    });
  };

  console.log("fields -> ", formEdit.getFieldsValue());

  const getFieldItems = (data, panelStyle) => {
    return data?.map((field) => {
      formEdit.setFieldsValue({
        [`fieldName-${field?.fieldName}`]: field?.fieldName,
        [`fieldDisplayName-${field?.fieldName}`]: field?.fieldDisplayName,
        [`fieldIsMandatory-${field?.fieldName}`]: field?.fieldIsMandatory,
        [`fieldMinLength-${field?.fieldName}`]: field?.fieldMinLength,
        [`fieldMaxLength-${field?.fieldName}`]: field?.fieldMinLength,
        [`fieldConstraintAcceptAlphabet-${field?.fieldName}`]:
          field?.constraint?.acceptAlphabet,
        [`fieldConstraintAcceptNumber-${field?.fieldName}`]:
          field?.constraint?.acceptNumber,
        [`fieldConstraintAllowedSymbols-${field?.fieldName}`]:
          field?.constraint?.allowedSymbols,
        [`fieldConstraintFormatCurrency-${field?.fieldName}`]:
          field?.constraint?.formatCurrency,
        [`fieldConstraintSelectionDynamicFields-${field?.fieldName}`]:
          field?.constraint?.selectionDynamicFields,
        [`fieldConstraintSelectionFetch-${field?.fieldName}`]:
          field?.constraint?.selectionFetch,
      });
      console.log("form fields ->", formEdit.getFieldsValue());
      return {
        key: `${field?.fieldId}`,
        label: `${field?.fieldDisplayName}`,
        style: panelStyle,
        children: (
          <>
            <Row gutter={30}>
              <Col span={12}>
                <Form.Item
                  label="Field Name"
                  name={`fieldName-${field?.fieldName}`}
                  rules={[
                    {
                      required: true,
                      message: "Please input title!",
                    },
                  ]}
                >
                  <Input style={{ fontSize: "1.05rem" }} />
                </Form.Item>
                <Form.Item
                  label="Field Display Name"
                  name={`fieldDisplayName-${field?.fieldName}`}
                  rules={[
                    { required: true, message: "Please input description!" },
                  ]}
                >
                  <Input style={{ fontSize: "1.05rem" }} />
                </Form.Item>
                <Form.Item
                  label="Mandatory"
                  name={`fieldIsMandatory-${field?.fieldName}`}
                  rules={[
                    { required: true, message: "Please input description!" },
                  ]}
                >
                  <Input style={{ fontSize: "1.05rem" }} />
                </Form.Item>
                <Form.Item
                  label="Max Length"
                  name={`fieldMinLength-${field?.fieldName}`}
                  rules={[
                    { required: true, message: "Please input description!" },
                  ]}
                >
                  <Input style={{ fontSize: "1.05rem" }} />
                </Form.Item>
                <Form.Item
                  label="Min Length"
                  name={`fieldMaxLength-${field?.fieldName}`}
                  rules={[
                    { required: true, message: "Please input description!" },
                  ]}
                >
                  <Input style={{ fontSize: "1.05rem" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Card
                  style={{
                    height: "450px",
                    overflow: "auto",
                  }}
                >
                  <h4 style={{ marginBottom: "5px" }}>Constraint</h4>
                  <Form.Item
                    label="Accept Alphabet"
                    name={`fieldConstraintAcceptAlphabet-${field?.fieldName}`}
                    rules={[
                      {
                        required: true,
                        message: "Please input title!",
                      },
                    ]}
                  >
                    <Input style={{ fontSize: "1.05rem" }} />
                  </Form.Item>
                  <Form.Item
                    label="Accept Number"
                    name={`fieldConstraintAcceptNumber-${field?.fieldName}`}
                    rules={[
                      { required: true, message: "Please input descriptio!" },
                    ]}
                  >
                    <Input style={{ fontSize: "1.05rem" }} />
                  </Form.Item>
                  <Form.Item
                    label="Allowed Symbols"
                    name={`fieldConstraintAllowedSymbols-${field?.fieldName}`}
                    rules={[
                      {
                        required: true,
                        message: "Please input title!",
                      },
                    ]}
                  >
                    <Input style={{ fontSize: "1.05rem" }} />
                  </Form.Item>
                  <Form.Item
                    label="Format Currency"
                    name={`fieldConstraintFormatCurrency-${field?.fieldName}`}
                    rules={[
                      {
                        required: true,
                        message: "Please input title!",
                      },
                    ]}
                  >
                    <Input style={{ fontSize: "1.05rem" }} />
                  </Form.Item>
                  <Form.Item
                    label="Selection Dynamic Fields"
                    name={`fieldConstraintSelectionDynamicFields-${field?.fieldName}`}
                    rules={[
                      {
                        required: true,
                        message: "Please input title!",
                      },
                    ]}
                  >
                    <Input style={{ fontSize: "1.05rem" }} />
                  </Form.Item>
                  <Form.Item
                    label="Selection Fetch"
                    name={`fieldConstraintSelectionFetch-${field?.fieldName}`}
                    rules={[
                      {
                        required: true,
                        message: "Please input title!",
                      },
                    ]}
                  >
                    <Input style={{ fontSize: "1.05rem" }} />
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </>
        ),
      };
    });
  };

  console.log("form fields ->", formEdit.getFieldsValue());

  return (
    <>
      <h2 style={{ marginBottom: "20px" }}>Edit Form</h2>
      <LoadingTransparentPage
        isLoading={stateFormStructure.isLoading || stateCreateForm.isLoading}
      >
        <Form
          layout="vertical"
          name="basic"
          form={formEdit}
          //   initialValues={{ remember: true }}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
          style={formStyle}
          onValuesChange={() => {
            console.log("form fields -> ", formEdit.getFieldsValue());
          }}
        >
          <Form.Item
            label="Form Name"
            name="formName"
            rules={[
              {
                required: true,
                message: "Please input title!",
              },
            ]}
          >
            <Input
              style={{ fontSize: "1.05rem" }}
              onChange={() => {
                console.log("form fields -> ", formEdit.getFieldsValue());
              }}
            />
          </Form.Item>

          <Form.Item
            label="Form Display Name"
            name="formDisplayName"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <Input style={{ fontSize: "1.05rem" }} />
          </Form.Item>

          <Collapse
            bordered={false}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            style={{
              background: "white",
            }}
            items={getFieldItems(stateFormStructure?.data?.fields, panelStyle)}
          />

          <Form.Item style={{ textAlign: "center" }}>
            <Button
              type="primary"
              size="large"
              shape="round"
              htmlType="submit"
              loading={stateCreateForm.isLoading}
              style={{
                backgroundColor: colorTheme.Background.buttonPositive["light"],
              }}
            >
              Edit Form
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
