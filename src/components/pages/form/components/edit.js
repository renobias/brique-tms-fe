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
  UpOutlined,
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

export const EditFormComponent = () => {
  const location = useLocation();
  const formId = new URLSearchParams(location.search).get("id");
  const [rerender, setRerender] = useState(false);
  const identity = authProvider.getIdentity();

  const { openNotification } = useNotification();
  //   const router = useRouter();
  const navigate = useNavigate();
  //   const { id, studioId } = router.query;

  const [formStructure, setFormStructure] = useState({});
  const [formEdit] = Form.useForm();
  const [formEditImage, setFormEditImage] = useState({
    image: null,
  });
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

  const { state: editFormState, fire: editForm } = usePost({
    dataProviderName: "briqueTms",
    resource: "form/structure",
    variables: "asdasdasd",
    meta: { headers: { "Content-Type": "text/plain" } },
    handleResult: () => {
      if (isSuccesfullRequest(editFormState?.statusCode)) {
        console.log("success");
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

  console.log("categories options -> ", categoriesOptions);

  useEffect(() => {
    getFormStructure({
      dataProviderName: "briqueTms",
      resource: "form/structure",
      query: { formId },
      handleResult: () => {
        if (isSuccesfullRequest(stateFormStructure.statusCode)) {
          // setFormStructure({ ...stateFormStructure?.data });
          formEdit.setFieldsValue({
            ...stateFormStructure?.data,
            category: stateFormStructure?.data?.formCategoryId,
          });
        }
      },
    });
  }, []);

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
    const fields = values?.fields?.map((formField) => {
      console.log("form field -> ", formField);
      return {
        fieldId: formField?.fieldId,
        isDelete: formField?.isDelete,
        name: formField?.fieldName,
        displayName: formField?.fieldDisplayName,
        fieldType: formField?.fieldType,
        isMandatory: formField?.fieldIsMandatory,
        minLength: formField?.fieldMinLength,
        maxLength: formField?.fieldMaxLength,
        orderNo: formField?.fieldOrderNo ?? 1,
        notes: formField?.fieldNotes ?? "",
        // createdTime: "2023-11-09 09:46:29.000000",
        // createdBy: identity?.id,
        constraint: {
          ...formField?.constraint,
          // createdTime: "2023-11-09 09:46:29.000000",
          // createdBy: identity?.id,
        },
      };
    });

    const payloadSend = {
      data: {
        formInfo: {
          id: formId,
          name: values?.formName,
          displayName: values?.formDisplayName,
          formCategoryId: values?.category,
          orderNo: "1",
          notes: values?.notes,
        },
        formFields: [...fields],
      },
    };

    console.log("payload send -> ", payloadSend);

    const data = {
      clientKey: identity?.clientKey,
      sharedKey: identity?.sharedKey,
      payload: {
        ...payloadSend,
      },
    };
    console.log("payload send -> ", payloadSend);
    Swal.fire({
      title: "Editing form...",
      html: "Please wait...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    editForm({
      dataProviderName: "briqueTms",
      resource: "form/structure",
      variables: encryptContent(data),
      meta: { headers: { "Content-Type": "text/plain" } },
      handleResult: () => {
        if (isSuccesfullRequest(editFormState?.statusCode)) {
          console.log("success");
          Swal.fire({
            title: "Success!",
            text: "successfully edit form!",
            icon: "success",
          }).then((result) => {
            Swal.hideLoading();
            navigate("/form/list", { replace: true });
          });
        } else {
          Swal.fire({
            title: "Oops something went wrong!",
            text: "failed to edit form!",
            icon: "error",
          }).then((result) => {
            Swal.hideLoading();
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

  console.log("fields -> ", formEdit.getFieldsValue());

  const getRerender = () => {
    setRerender(!rerender);
  };

  console.log("form fields ->", formEdit.getFieldsValue());

  const onCategoryChange = (value) => {
    console.log("value change -> ", value);
    // formEdit.setFieldsValue({ category: value });
    getRerender();
    // getRerender();
    // switch (value) {
    //   case "financial":
    //     formEdit.setFieldsValue({ category: value });
    //     getRerender();
    //     break;
    //   case "nonFinancial":
    //     formEdit.setFieldsValue({ category: value });
    //     getRerender();
    //     break;
    //   case "other":
    //     formEdit.setFieldsValue({ category: value });
    //     getRerender();
    //     break;
    //   default:
    // }
  };

  const onCategoryClear = () => {
    formEdit.setFieldValue({ category: null });
    getRerender();
  };

  const getIconComponent = (icon) => {
    switch (icon) {
      case "DownOutlined":
        return <DownOutlined />;
      case "RightOutlined":
        return <RightOutlined />;
      // Add more cases for other icons if needed
      default:
        return null;
    }
  };

  return (
    <>
      <h2 style={{ marginBottom: "20px" }}>Edit Form</h2>
      <LoadingTransparentPage
        isLoading={stateFormStructure.isLoading || editFormState.isLoading}
      >
        <Form
          layout="vertical"
          name="basic"
          form={formEdit}
          //   initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
          style={formStyle}
          onValuesChange={() => {
            console.log("form fields -> ", formEdit.getFieldsValue());
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
              // defaultValue={}
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

          {formEdit.getFieldValue("category") && (
            <>
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
                rules={[
                  { required: true, message: "Please input description!" },
                ]}
              >
                <Input style={{ fontSize: "1.05rem" }} />
              </Form.Item>

              <Form.List name="fields">
                {(fields, { add, remove }) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        rowGap: 16,
                        flexDirection: "column",
                      }}
                    >
                      {fields.map(
                        (field, index) => {
                          const fieldForm = formEdit.getFieldValue("fields");
                          console.log("field form -> ", fieldForm);
                          return (
                            !fieldForm?.at(index)?.isDelete && (
                              <Card
                                size="small"
                                title={
                                  fieldForm?.at(index)?.fieldDisplayName
                                    ? `${
                                        fieldForm?.at(index)?.fieldDisplayName
                                      } `
                                    : "New Field"
                                }
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
                                            formEdit.getFieldsValue();
                                          if (
                                            fieldsLatestCondition?.fields[index]
                                          ) {
                                            fieldsLatestCondition.fields[
                                              index
                                            ].isExpand =
                                              !fieldsLatestCondition.fields[
                                                index
                                              ].isExpand;
                                            formEdit.setFieldsValue({
                                              ...fieldsLatestCondition,
                                            });
                                          } else {
                                            fieldsLatestCondition.fields[
                                              index
                                            ] = { isExpand: true };
                                            formEdit.setFieldsValue({
                                              ...fieldsLatestCondition,
                                            });
                                          }
                                        }}
                                      />
                                      <Button
                                        type="text"
                                        icon={
                                          <CloseOutlined
                                            onClick={() => {
                                              const fieldsLatest =
                                                formEdit.getFieldsValue();
                                              if (fieldsLatest?.fields[index]) {
                                                fieldsLatest.fields[
                                                  index
                                                ].isDelete = true;
                                                formEdit.setFieldsValue({
                                                  ...fieldsLatest,
                                                });
                                              } else {
                                                remove(field.name);
                                              }
                                            }}
                                          />
                                        }
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
                                          // onSelect={() => {
                                          //   getRerender();
                                          // }}
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
                                        name={[field.name, "fieldIsMandatory"]}
                                        // initialValue="user123!"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "Please input Field Mandatory!",
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
                                            message:
                                              "Please input Field Min Length!",
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
                                            message:
                                              "Please input Field Max Length!",
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
                                      name={[field.name, "filterOrderNo"]}
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
                                            "constraint",
                                            `acceptAlphabet`,
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
                                            "constraint",
                                            `acceptNumber`,
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
                                            "constraint",
                                            `formatCurrency`,
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
                                        {console.log(
                                          "tess -> ",
                                          formEdit?.getFieldsValue()
                                        )}
                                        {formEdit?.getFieldsValue()?.fields
                                          ? formEdit?.getFieldsValue()?.fields[
                                              field?.name
                                            ]?.constraint?.formatCurrency && (
                                              <Form.Item
                                                label="Allowed Symbols"
                                                name={[
                                                  field.name,
                                                  "constraint",
                                                  `allowedSymbols`,
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
                                                <Input
                                                  style={{
                                                    fontSize: "1.05rem",
                                                  }}
                                                />
                                              </Form.Item>
                                            )
                                          : null}
                                        {(formEdit?.getFieldsValue()).fields
                                          ? formEdit?.getFieldsValue()?.fields[
                                              field.name
                                            ]?.fieldType == "selection" && (
                                              <Form.Item
                                                label="Selection Fetch"
                                                name={[
                                                  field.name,
                                                  ["constraint"],
                                                  "selectionFetch",
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
                                                  {selectOptions.map(
                                                    (select) => {
                                                      return (
                                                        <Option
                                                          value={select?.value}
                                                        >
                                                          {select?.displayName}
                                                        </Option>
                                                      );
                                                    }
                                                  )}
                                                </Select>
                                              </Form.Item>
                                            )
                                          : null}
                                        {(formEdit?.getFieldsValue()).fields
                                          ? formEdit?.getFieldValue()?.fields[
                                              field.name
                                            ]?.fieldType == "selection" &&
                                            formEdit?.getFieldValue()?.fields[
                                              field.name
                                            ]?.constraint?.selectionFetch ==
                                              false && (
                                              <>
                                                {/* Nest Form.List */}
                                                <Form.Item label="Selections">
                                                  <Form.List
                                                    name={[
                                                      field.name,
                                                      ["constraint"],
                                                      "selections",
                                                    ]}
                                                  >
                                                    {(subFields, subOpt) => (
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          flexDirection:
                                                            "column",
                                                          rowGap: 16,
                                                        }}
                                                      >
                                                        {subFields.map(
                                                          (
                                                            subField,
                                                            indexSelectionField
                                                          ) => (
                                                            <Space
                                                              key={subField.key}
                                                            >
                                                              {!fieldForm
                                                                ?.at(index)
                                                                ?.constraint?.selections?.at(
                                                                  indexSelectionField
                                                                )?.isDelete && (
                                                                <>
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
                                                                      console.log(
                                                                        "on click"
                                                                      );
                                                                      // subOpt.remove(
                                                                      //   subField.name
                                                                      // );
                                                                      const fieldsLatest =
                                                                        formEdit.getFieldsValue();
                                                                      if (
                                                                        fieldsLatest
                                                                          .fields[
                                                                          index
                                                                        ]
                                                                          ?.constraint
                                                                          ?.selections[
                                                                          indexSelectionField
                                                                        ]
                                                                      ) {
                                                                        console.log(
                                                                          "if one"
                                                                        );
                                                                        fieldsLatest.fields[
                                                                          index
                                                                        ].constraint.selections[
                                                                          indexSelectionField
                                                                        ].isDelete = true;
                                                                        formEdit.setFieldsValue(
                                                                          {
                                                                            ...fieldsLatest,
                                                                          }
                                                                        );
                                                                      } else {
                                                                        subOpt.remove(
                                                                          subField.name
                                                                        );
                                                                      }
                                                                    }}
                                                                  />
                                                                </>
                                                              )}
                                                            </Space>
                                                          )
                                                        )}
                                                        <Button
                                                          type="dashed"
                                                          onClick={() =>
                                                            subOpt.add()
                                                          }
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
                                                  "constraint",
                                                  `selectionDynamicFields`,
                                                ]}
                                                // initialValue="user123!"
                                              >
                                                <Select
                                                  placeholder="-- Select --"
                                                  // onChange={onCategoryChange}
                                                  // onClear={onCategoryClear}
                                                  // defaultValue={}
                                                >
                                                  {selectOptions.map(
                                                    (select) => {
                                                      return (
                                                        <Option
                                                          value={select?.value}
                                                        >
                                                          {select?.displayName}
                                                        </Option>
                                                      );
                                                    }
                                                  )}
                                                </Select>
                                              </Form.Item> */}
                                              </>
                                            )
                                          : null}
                                        <Form.Item
                                          label="Notes"
                                          name={[
                                            field.name,
                                            "constraint",
                                            "notes",
                                          ]}
                                        >
                                          <Input />
                                        </Form.Item>
                                      </Card>
                                    </Col>
                                    <Form.Item
                                      label="Form structure Id"
                                      name={[field.name, "formStructureId"]}
                                      initialValue={formId}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Please input Form Structure Id!",
                                        },
                                      ]}
                                      style={{ display: "none" }}
                                    >
                                      <Input />
                                    </Form.Item>
                                  </Row>
                                ) : (
                                  <Row>
                                    <Col
                                      span={24}
                                      style={{ textAlign: "center" }}
                                    >
                                      <Button
                                        onClick={() => {
                                          console.log("onclick btn");
                                          const fieldsLatestCondition =
                                            formEdit.getFieldsValue();
                                          console.log(
                                            "field latest -> ",
                                            fieldsLatestCondition
                                          );
                                          console.log(
                                            "current field -> ",
                                            fieldsLatestCondition?.fields[index]
                                          );
                                          if (
                                            fieldsLatestCondition?.fields[index]
                                          ) {
                                            fieldsLatestCondition.fields[
                                              index
                                            ].isExpand =
                                              !fieldsLatestCondition.fields[
                                                index
                                              ].isExpand;
                                            formEdit.setFieldsValue({
                                              ...fieldsLatestCondition,
                                            });
                                          } else {
                                            console.log(
                                              "current index -> ",
                                              index
                                            );
                                            console.log(
                                              "current field -> ",
                                              fieldsLatestCondition.fields[
                                                index
                                              ]
                                            );
                                            fieldsLatestCondition.fields[
                                              index
                                            ] = { isExpand: true };
                                            formEdit.setFieldsValue({
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
                            )
                          );
                        }
                        // !fieldForm?.fields[index]?.isDelete &&
                      )}

                      <Button type="dashed" onClick={() => add()} block>
                        + Add Field
                      </Button>
                    </div>
                  );
                }}
              </Form.List>
            </>
          )}

          <Form.Item style={{ textAlign: "center" }}>
            <Button
              type="primary"
              size="large"
              shape="round"
              htmlType="submit"
              loading={editFormState.isLoading}
              style={{
                backgroundColor: colorTheme.Background.buttonPositive["light"],
                marginTop: "20px",
              }}
            >
              Edit
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
