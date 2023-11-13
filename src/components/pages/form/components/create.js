import { LoadingTransparentPage } from "../components/../../LoadingTransparentPage";
import { colorTheme } from "../../../../definitions";
import { useGet } from "../../../../hooks/data/useGet";
import { usePost } from "../../../../hooks/data/usePost";
import { useNotification } from "../../../../hooks/utility";
import { isSuccesfullRequest } from "../../../../rest-data-provider/briqueTms/utils";
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
import { authProvider } from "../../../../authProvider";
import { encryptContent } from "../../../../crypto";
import { CaretRightOutlined, CloseOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { Option } = Select;

const panelStyle = {
  marginBottom: 15,
  background: "#f5f5f5",
  borderRadius: 10,
  border: "none",
};

export const CreateFormComponent = () => {
  const identity = authProvider.getIdentity();
  const { clientKey, sharedKey } = authProvider.getIdentity();
  const location = useLocation();

  const { openNotification } = useNotification();
  const navigate = useNavigate();

  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [rerender, setRerender] = useState(false);

  const { state: stateCategories, fire: getCategories } = useGet({
    dataProviderName: "briqueTms",
    resource: "form/categories",
    handleResult: () => {
      if (isSuccesfullRequest(stateCategories?.statusCode)) {
        console.log("success");
        setCategoriesOptions([...stateCategories?.data?.categories]);
      }
    },
  });
  const { state: createFormState, fire: createForm } = usePost({
    dataProviderName: "briqueTms",
    resource: "form/structure",
    variables: "asdasdasd",
    meta: { headers: { "Content-Type": "text/plain" } },
    handleResult: () => {
      if (isSuccesfullRequest(createFormState?.statusCode)) {
        console.log("success");
      }
    },
  });

  const [formStructure, setFormStructure] = useState({});
  const [formCreate] = Form.useForm();

  const getRerender = () => {
    setRerender(!rerender);
  };

  const onCategoryChange = (value) => {
    console.log("value -> ", value);
    switch (value) {
      case "financial":
        formCreate.setFieldsValue({ category: value });
        getRerender();
        break;
      case "nonFinancial":
        formCreate.setFieldsValue({ category: value });
        getRerender();
        break;
      case "other":
        formCreate.setFieldsValue({ category: value });
        getRerender();
        break;
      default:
    }
  };

  const onCategoryClear = () => {
    formCreate.setFieldValue({ category: null });
    getRerender();
  };

  useEffect(() => {
    getCategories({
      dataProviderName: "briqueTms",
      resource: "form/categories",
      handleResult: () => {
        if (isSuccesfullRequest(stateCategories?.statusCode)) {
          console.log("success");
          setCategoriesOptions([...stateCategories?.data?.categories]);
        }
      },
    });
  }, []);

  const onFinish = async (values) => {
    /**
   * {
   "isCreate":true,
   "data":{
      "formInfo":{
         "name":"tes",
         "displayname":"tes",
         "formcategoryid":"tes",
         "orderno":"tes",
         "createdtime":"tes",
         "createdby":"tes",
         "notes":"tes"
      },
      "formFields":[
         {
            "name":"tes",
            "displayName":"tes",
            "fieldType":"tes",
            "isMandatory":"tes",
            "minLength":"tes",
            "maxLength":"tes",
            "orderno":"tes",
            "createdtime":"tes",
            "createdby":"tes",
            "notes":"tes",
            "constraint":{
               "acceptAlphabet":"tes",
               "acceptNumber":"tes",
               "formatCurrency":"tes",
               "allowedSymbols":"tes",
               "selectionDynamicFields":"tes",
               "selectionFetch":"tes",
               "createdtime":"tes",
               "createdby":"tes",
               "notes":"tes"
            }
         }
      ]
   }
}
   */
    console.log("onFinish Form Values -> ", values);
    const fields = values?.formFields?.map((formField) => {
      return {
        name: formField?.fieldName,
        displayName: formField?.fieldDisplayName,
        fieldType: "text",
        isMandatory: formField?.fieldMandatory,
        minLength: formField?.fieldMinLength,
        maxLength: formField?.fieldMaxLength,
        orderNo: formField?.orderNo ?? 1,
        createdTime: "2023-11-09 09:46:29.000000",
        createdBy: "1",
        notes: formField?.notes ?? null,
        constraint: {
          acceptAlphabet: formField?.fieldConstraintAcceptAlphabet,
          acceptNumber: formField?.fieldConstraintAcceptNumber,
          formatCurrency: formField?.fieldConstraintFormatCurrency,
          allowedSymbols: formField?.fieldConstraintAllowedSymbols,
          selectionDynamicFields:
            formField?.fieldConstraintSelectionDynamicFields,
          selectionFetch: formField?.fieldConstraintSelectionFetch,
          createdTime: "2023-11-09 09:46:29.000000",
          createdBy: "1",
          notes: formField?.notes,
        },
      };
    });

    console.log("fields -> ", fields);

    const payloadSend = {
      isCreate: true,
      data: {
        formInfo: {
          name: values?.formName,
          displayName: values?.formDisplayName,
          formCategoryId: values?.category == "financial" ? 1 : 2,
          orderNo: 1,
          createdTime: "2023-11-09 09:46:29.000000",
          createdBy: 1,
          notes: values?.notes,
        },
        formFields: fields ? [...fields] : [],
      },
    };

    const data = {
      clientKey: identity?.clientKey,
      sharedKey: identity?.sharedKey,
      payload: { ...payloadSend },
    };
    console.log("payload send -> ", payloadSend);
    Swal.fire({
      title: "Creating form...",
      html: "Please wait...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    createForm({
      dataProviderName: "briqueTms",
      resource: "form/structure",
      variables: encryptContent(data),
      meta: { headers: { "Content-Type": "text/plain" } },
      handleResult: () => {
        if (isSuccesfullRequest(createFormState?.statusCode)) {
          console.log("success");
          Swal.fire({
            title: "Success!",
            text: "successfully create form!",
            icon: "success",
          }).then((result) => {
            Swal.hideLoading();
            navigate("/form/list", { replace: true });
          });
        } else {
          Swal.fire({
            title: "Oops something went wrong!",
            text: "failed to create form!",
            icon: "error",
          }).then((result) => {
            Swal.hideLoading();
          });
        }
      },
    });
    // await handleOnSubmit(values.email, values.password);
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
      <h2 style={{ marginBottom: "20px" }}>Add Form</h2>
      <LoadingTransparentPage isLoading={false}>
        <Form
          layout="vertical"
          form={formCreate}
          //   initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          style={formStyle}
          // labelCol={{
          //   span: 6,
          // }}
          // wrapperCol={{
          //   span: 18,
          // }}
          name="dynamic_form_complex"
          initialValues={{
            fields: [],
          }}
        >
          <Form.Item
            label="Category"
            name="category"
            // initialValue="user123!"
            rules={[{ required: true, message: "Please input category!" }]}
          >
            <Select
              placeholder="-- Select Categories --"
              onChange={onCategoryChange}
              onClear={onCategoryClear}
              allowClear
            >
              {categoriesOptions.map((category) => {
                return (
                  <Option value={category?.name}>
                    {category?.displayName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          {formCreate.getFieldValue("category") && (
            <>
              <Form.Item
                label="Form Name"
                name="formName"
                rules={[
                  {
                    required: true,
                    message: "Please input Form Name!",
                  },
                ]}
              >
                <Input style={{ fontSize: "1.05rem" }} />
              </Form.Item>

              <Form.Item
                label="Form Display Name"
                name="formDisplayName"
                rules={[
                  {
                    required: true,
                    message: "Please input Form Display Name!",
                  },
                ]}
              >
                <Input style={{ fontSize: "1.05rem" }} />
              </Form.Item>

              <Form.List name="formFields">
                {(fields, { add, remove }) => (
                  <div
                    style={{
                      display: "flex",
                      rowGap: 16,
                      flexDirection: "column",
                    }}
                  >
                    {fields.map((field) => (
                      <Card
                        size="small"
                        title={`Field ${field.name + 1}`}
                        key={field.key}
                        extra={
                          <CloseOutlined
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        }
                        bodyStyle={{ backgroundColor: "#f5f5f5" }}
                      >
                        <Row gutter={20}>
                          <Col span={12}>
                            <Form.Item
                              label="Field Name"
                              name={[field.name, "fieldName"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please input Field Name!",
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>

                            <Form.Item
                              label="Field Display Name"
                              name={[field.name, "fieldDisplayName"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please input Field Display Name!",
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>

                            <Form.Item
                              label="Mandatory"
                              name={[field.name, "fieldMandatory"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please input Field Mandatory!",
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>

                            <Form.Item
                              label="Max Length"
                              name={[field.name, "fieldMaxLength"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please input Field Max Length!",
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>

                            <Form.Item
                              label="Min Length"
                              name={[field.name, "fieldMinLength"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please input Field Min Length!",
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Card>
                              <h4>Constraint</h4>
                              <Form.Item
                                label="Accept Alphabet"
                                // name={`fieldConstraintAcceptAlphabet-${field?.fieldName}`}
                                name={[
                                  field.name,
                                  `fieldConstraintAcceptAlphabet`,
                                ]}
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      "Please input Field Accept Alphabet Constraint!",
                                  },
                                ]}
                              >
                                <Input style={{ fontSize: "1.05rem" }} />
                              </Form.Item>
                              <Form.Item
                                label="Accept Number"
                                name={[
                                  field.name,
                                  `fieldConstraintAcceptNumber`,
                                ]}
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      "Please input Field Accept Number Constraint!",
                                  },
                                ]}
                              >
                                <Input style={{ fontSize: "1.05rem" }} />
                              </Form.Item>
                              <Form.Item
                                label="Allowed Symbols"
                                name={[
                                  field.name,
                                  `fieldConstraintAllowedSymbols`,
                                ]}
                                // name={`fieldConstraintAllowedSymbols-${field?.fieldName}`}
                                // rules={[
                                //   {
                                //     required: true,
                                //     message: "Please input title!",
                                //   },
                                // ]}
                              >
                                <Input style={{ fontSize: "1.05rem" }} />
                              </Form.Item>
                              <Form.Item
                                label="Format Currency"
                                name={[
                                  field.name,
                                  `fieldConstraintFormatCurrency`,
                                ]}
                                // name={`fieldConstraintFormatCurrency-${field?.fieldName}`}
                                // rules={[
                                //   {
                                //     required: true,
                                //     message: "Please input title!",
                                //   },
                                // ]}
                              >
                                <Input style={{ fontSize: "1.05rem" }} />
                              </Form.Item>
                              <Form.Item
                                label="Selection Dynamic Fields"
                                name={[
                                  field.name,
                                  `fieldConstraintSelectionDynamicFields`,
                                ]}
                                // name={`fieldConstraintAllowedSymbols-${field?.fieldName}`}
                                // rules={[
                                //   {
                                //     required: true,
                                //     message: "Please input title!",
                                //   },
                                // ]}
                              >
                                <Input style={{ fontSize: "1.05rem" }} />
                              </Form.Item>
                              <Form.Item
                                label="Selection Fetch"
                                name={[
                                  field.name,
                                  `fieldConstraintSelectionFetch`,
                                ]}
                                // name={`fieldConstraintSelectionFetch-${field?.fieldName}`}
                                // rules={[
                                //   {
                                //     required: true,
                                //     message: "Please input title!",
                                //   },
                                // ]}
                              >
                                <Input style={{ fontSize: "1.05rem" }} />
                              </Form.Item>
                            </Card>
                          </Col>
                        </Row>
                      </Card>
                    ))}

                    <Button type="dashed" onClick={() => add()} block>
                      + Add Field
                    </Button>
                  </div>
                )}
              </Form.List>
            </>
          )}

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
              Add Form
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