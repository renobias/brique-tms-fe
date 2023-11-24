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
import {
  CaretRightOutlined,
  CloseOutlined,
  DownOutlined,
  RightOutlined,
} from "@ant-design/icons";
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

  const { openNotification } = useNotification();
  const navigate = useNavigate();

  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [selectOptions, setSelectOptions] = useState([
    {
      id: 1,
      name: "yes",
      displayName: "Yes",
      value: true,
    },
    {
      id: 2,
      name: "no",
      displayName: "No",
      value: false,
    },
  ]);
  const [fieldTypeOptions, setFieldTypeOptions] = useState([
    {
      id: 1,
      name: "text",
      displayName: "Text",
      value: "text",
    },
    {
      id: 2,
      name: "selection",
      displayName: "Selection",
      value: "selection",
    },
  ]);
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
  const [formCreate] = Form.useForm();

  const getRerender = () => {
    setRerender(!rerender);
  };

  const onCategoryChange = (value) => {
    console.log("value -> ", value);
    getRerender();
    // switch (value) {
    //   case "financial":
    //     formCreate.setFieldsValue({ category: value });
    //     getRerender();
    //     break;
    //   case "nonFinancial":
    //     formCreate.setFieldsValue({ category: value });
    //     getRerender();
    //     break;
    //   case "other":
    //     formCreate.setFieldsValue({ category: value });
    //     getRerender();
    //     break;
    //   default:
    // }
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
    console.log("onFinish Form Values -> ", values);
    const fields = values?.formFields?.map((formField) => {
      console.log(
        "fieldConstraintSelections -> ",
        formField?.fieldConstraintSelections
      );
      return {
        name: formField?.fieldName,
        displayName: formField?.fieldDisplayName,
        fieldType: formField?.fieldType,
        isMandatory: formField?.fieldMandatory,
        minLength: formField?.fieldMinLength,
        maxLength: formField?.fieldMaxLength,
        orderNo: formField?.orderNo ?? 1,
        notes: formField?.fieldNotes ?? "",
        constraint: {
          acceptAlphabet: formField?.fieldConstraintAcceptAlphabet,
          acceptNumber: formField?.fieldConstraintAcceptNumber,
          formatCurrency: formField?.fieldConstraintFormatCurrency,
          allowedSymbols: formField?.fieldConstraintAllowedSymbols ?? null,
          selectionDynamicFields:
            formField?.fieldConstraintSelectionDynamicFields,
          selectionFetch: formField?.fieldConstraintSelectionFetch,
          selections:
            formField?.fieldType === "selection" &&
            formField?.fieldConstraintSelections
              ? [...formField?.fieldConstraintSelections]
              : [],
          notes: formField?.fieldConstraintNotes,
        },
      };
    });

    const payloadSend = {
      isCreate: true,
      data: {
        formInfo: {
          name: values?.formName,
          displayName: values?.formDisplayName,
          // formCategoryId: values?.category == "financial" ? 1 : 2,
          formCategoryId: values?.category,
          orderNo: 1,
          createdTime: "2023-11-09 09:46:29.000000",
          createdBy: 1,
          notes: values?.notes,
        },
        formFields: fields ? [...fields] : [],
      },
    };

    console.log("payload send -> ", payloadSend);

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

  const getIconComponent = (icon) => {
    switch (icon) {
      case "CloseOutlined":
        return <CloseOutlined />;
      case "DownOutlined":
        return <DownOutlined />;
      case "RightOutlined":
        return <RightOutlined />;
      // Add more cases for other icons if needed
      default:
        return null;
    }
  };

  console.log("category select -> ", formCreate.getFieldValue("category"));

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
                  <Option
                    // value={category?.name}
                    value={category?.id}
                  >
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
                    {fields.map((field, index) => {
                      const fieldForm = formCreate.getFieldValue("formFields");
                      console.log("fieldFoem -> ", fieldForm);
                      return (
                        <Card
                          size="small"
                          title={`Field ${field.name + 1}`}
                          key={field.key}
                          extra={
                            <>
                              <Space>
                                <Button
                                  type="text"
                                  icon={getIconComponent(
                                    fieldForm[index]?.isExpand
                                      ? "DownOutlined"
                                      : "RightOutlined"
                                  )}
                                  onClick={() => {
                                    const fieldsLatestCondition =
                                      formCreate.getFieldsValue();
                                    if (
                                      fieldsLatestCondition?.formFields[index]
                                    ) {
                                      fieldsLatestCondition.formFields[
                                        index
                                      ].isExpand =
                                        !fieldsLatestCondition.formFields[index]
                                          .isExpand;
                                      formCreate.setFieldsValue({
                                        ...fieldsLatestCondition,
                                      });
                                    } else {
                                      fieldsLatestCondition.formFields[index] =
                                        { isExpand: true };
                                      formCreate.setFieldsValue({
                                        ...fieldsLatestCondition,
                                      });
                                    }
                                  }}
                                />
                                <Button
                                  type={"text"}
                                  icon={getIconComponent("CloseOutlined")}
                                  onClick={() => {
                                    remove(field.name);
                                  }}
                                />
                              </Space>
                            </>
                          }
                          bodyStyle={{ backgroundColor: "#f5f5f5" }}
                        >
                          {fieldForm && fieldForm[index]?.isExpand ? (
                            <Row gutter={20}>
                              <Col span={12}>
                                <Form.Item
                                  label="Field Type"
                                  name={[field.name, "fieldType"]}
                                  // initialValue="user123!"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please input Field Type!",
                                    },
                                  ]}
                                >
                                  <Select
                                    placeholder="-- Select Field Type --"
                                    onChange={() => {
                                      getRerender();
                                    }}
                                    // onClear={onCategoryClear}
                                    // defaultValue={}
                                  >
                                    {fieldTypeOptions.map((select) => {
                                      return (
                                        <Option value={select?.value}>
                                          {select?.displayName}
                                        </Option>
                                      );
                                    })}
                                  </Select>
                                </Form.Item>

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
                                      message:
                                        "Please input Field Display Name!",
                                    },
                                  ]}
                                >
                                  <Input />
                                </Form.Item>

                                <Form.Item
                                  label="Mandatory"
                                  name={[field.name, "fieldMandatory"]}
                                  // initialValue="user123!"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please input Field Mandatory!",
                                    },
                                  ]}
                                >
                                  <Select
                                    placeholder="-- Select --"
                                    // onChange={onCategoryChange}
                                    // onClear={onCategoryClear}
                                    // defaultValue={}
                                  >
                                    {selectOptions.map((select) => {
                                      return (
                                        <Option value={select?.value}>
                                          {select?.displayName}
                                        </Option>
                                      );
                                    })}
                                  </Select>
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
                                  label="Notes"
                                  name={[field.name, "fieldNotes"]}
                                >
                                  <Input />
                                </Form.Item>

                                {/* <Form.Item
                            label="Field Order Number"
                            name={[field.name, "fieldOrderNo"]}
                            rules={[
                              {
                                required: true,
                                message: "Please input Field Notes!",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item> */}
                              </Col>
                              <Col span={12}>
                                <Card>
                                  <h4>Constraint</h4>
                                  <Form.Item
                                    label="Accept Alphabet"
                                    name={[
                                      field.name,
                                      "fieldConstraintAcceptAlphabet",
                                    ]}
                                    // initialValue="user123!"
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          "Please input Field Accept Alphabet Constraint!",
                                      },
                                    ]}
                                  >
                                    <Select
                                      placeholder="-- Select --"
                                      // onChange={onCategoryChange}
                                      // onClear={onCategoryClear}
                                      // defaultValue={}
                                    >
                                      {selectOptions.map((select) => {
                                        return (
                                          <Option value={select?.value}>
                                            {select?.displayName}
                                          </Option>
                                        );
                                      })}
                                    </Select>
                                  </Form.Item>
                                  <Form.Item
                                    label="Accept Number"
                                    name={[
                                      field.name,
                                      "fieldConstraintAcceptNumber",
                                    ]}
                                    // initialValue="user123!"
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          "Please input Field Accept Number Constraint!",
                                      },
                                    ]}
                                  >
                                    <Select
                                      placeholder="-- Select --"
                                      // onChange={onCategoryChange}
                                      // onClear={onCategoryClear}
                                      // defaultValue={}
                                    >
                                      {selectOptions.map((select) => {
                                        return (
                                          <Option value={select?.value}>
                                            {select?.displayName}
                                          </Option>
                                        );
                                      })}
                                    </Select>
                                  </Form.Item>
                                  <Form.Item
                                    label="Format Currency"
                                    name={[
                                      field.name,
                                      "fieldConstraintFormatCurrency",
                                    ]}
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          "Please input Field Format Currency Constraint!",
                                      },
                                    ]}
                                    // initialValue="user123!"
                                  >
                                    <Select
                                      placeholder="-- Select --"
                                      onChange={() => {
                                        getRerender();
                                      }}
                                      // onClear={onCategoryClear}
                                      // defaultValue={}
                                    >
                                      {selectOptions.map((select) => {
                                        return (
                                          <Option value={select?.value}>
                                            {select?.displayName}
                                          </Option>
                                        );
                                      })}
                                    </Select>
                                  </Form.Item>
                                  {formCreate?.getFieldsValue()?.formFields[
                                    field.name
                                  ]?.fieldConstraintFormatCurrency && (
                                    <Form.Item
                                      label="Allowed Symbols"
                                      name={[
                                        field.name,
                                        `fieldConstraintAllowedSymbols`,
                                      ]}
                                      // name={`fieldConstraintAllowedSymbols-${field?.fieldName}`}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Please input Field Allowed Symbols Constraint!",
                                        },
                                      ]}
                                    >
                                      <Input style={{ fontSize: "1.05rem" }} />
                                    </Form.Item>
                                  )}
                                  {formCreate?.getFieldsValue()?.formFields[
                                    field.name
                                  ]?.fieldType == "selection" && (
                                    <Form.Item
                                      label="Selection Fetch"
                                      name={[
                                        field.name,
                                        "fieldConstraintSelectionFetch",
                                      ]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Please input selection fetch!",
                                        },
                                      ]}
                                      // initialValue="user123!"
                                    >
                                      <Select
                                        placeholder="-- Select --"
                                        onChange={() => {
                                          getRerender();
                                        }}
                                        // onClear={onCategoryClear}
                                        // defaultValue={}
                                      >
                                        {selectOptions.map((select) => {
                                          return (
                                            <Option value={select?.value}>
                                              {select?.displayName}
                                            </Option>
                                          );
                                        })}
                                      </Select>
                                    </Form.Item>
                                  )}
                                  {formCreate?.getFieldsValue()?.formFields[
                                    field.name
                                  ]?.fieldType == "selection" &&
                                    formCreate?.getFieldsValue()?.formFields[
                                      field.name
                                    ]?.fieldConstraintSelectionFetch ==
                                      false && (
                                      <>
                                        {/* Nest Form.List */}
                                        <Form.Item label="Selections">
                                          <Form.List
                                            name={[
                                              field.name,
                                              "fieldConstraintSelections",
                                            ]}
                                          >
                                            {(subFields, subOpt) => (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  rowGap: 16,
                                                }}
                                              >
                                                {subFields.map((subField) => (
                                                  <Space key={subField.key}>
                                                    <Form.Item
                                                      noStyle
                                                      name={[
                                                        subField.name,
                                                        "selection",
                                                      ]}
                                                    >
                                                      <Input placeholder="selection" />
                                                    </Form.Item>
                                                    <Form.Item
                                                      noStyle
                                                      name={[
                                                        subField.name,
                                                        "displayName",
                                                      ]}
                                                    >
                                                      <Input placeholder="display name" />
                                                    </Form.Item>
                                                    <CloseOutlined
                                                      onClick={() => {
                                                        subOpt.remove(
                                                          subField.name
                                                        );
                                                      }}
                                                    />
                                                  </Space>
                                                ))}
                                                <Button
                                                  type="dashed"
                                                  onClick={() => subOpt.add()}
                                                  block
                                                >
                                                  + Add Selection
                                                </Button>
                                              </div>
                                            )}
                                          </Form.List>
                                        </Form.Item>
                                        {/* <Form.Item
                                  label="Selection Dynamic Fields"
                                  name={[
                                    field.name,
                                    "fieldConstraintSelectionDynamicFields",
                                  ]}
                                  // initialValue="user123!"
                                >
                                  <Select
                                    placeholder="-- Select --"
                                    // onChange={onCategoryChange}
                                    // onClear={onCategoryClear}
                                    // defaultValue={}
                                  >
                                    {selectOptions.map((select) => {
                                      return (
                                        <Option value={select?.value}>
                                          {select?.displayName}
                                        </Option>
                                      );
                                    })}
                                  </Select>
                                </Form.Item> */}
                                      </>
                                    )}
                                  <Form.Item
                                    label="Notes"
                                    name={[field.name, "fieldConstraintNotes"]}
                                  >
                                    <Input />
                                  </Form.Item>
                                </Card>
                              </Col>
                            </Row>
                          ) : (
                            <Row>
                              <Col span={24} style={{ textAlign: "center" }}>
                                <Button
                                  onClick={() => {
                                    console.log("onclick btn");
                                    const fieldsLatestCondition =
                                      formCreate.getFieldsValue();
                                    if (
                                      fieldsLatestCondition?.formFields[index]
                                    ) {
                                      fieldsLatestCondition.formFields[
                                        index
                                      ].isExpand =
                                        !fieldsLatestCondition.formFields[index]
                                          .isExpand;
                                      formCreate.setFieldsValue({
                                        ...fieldsLatestCondition,
                                      });
                                    } else {
                                      fieldsLatestCondition.formFields[index] =
                                        { isExpand: true };
                                      formCreate.setFieldsValue({
                                        ...fieldsLatestCondition,
                                      });
                                    }
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  content
                                </Button>
                              </Col>
                            </Row>
                          )}
                        </Card>
                      );
                    })}

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
