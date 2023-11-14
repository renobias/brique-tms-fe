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

export const EditFormComponent = () => {
  const { clientKey, sharedKey } = authProvider.getIdentity();
  const location = useLocation();
  const formId = new URLSearchParams(location.search).get("id");
  const [rerender, setRerender] = useState(false);

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
            category:
              stateFormStructure?.data?.formCategoryId == 1
                ? "financial"
                : "nonFinancial",
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
    console.log("values -> ", values);
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
        // children: (
        //   <>
        //     <Form.List name="formFields">
        //       {(fields, { add, remove }) => (
        //         <div
        //           style={{
        //             display: "flex",
        //             rowGap: 16,
        //             flexDirection: "column",
        //           }}
        //         >
        //           {fields.map((field) => (
        //             <Card
        //               size="small"
        //               title={`Field ${field.name + 1}`}
        //               key={field.key}
        //               extra={
        //                 <CloseOutlined
        //                   onClick={() => {
        //                     remove(field.name);
        //                   }}
        //                 />
        //               }
        //               bodyStyle={{ backgroundColor: "#f5f5f5" }}
        //             >
        //               <Row gutter={20}>
        //                 <Col span={12}>
        //                   <Form.Item
        //                     label="Field Name"
        //                     name={[field.name, "fieldName"]}
        //                     rules={[
        //                       {
        //                         required: true,
        //                         message: "Please input Field Name!",
        //                       },
        //                     ]}
        //                   >
        //                     <Input />
        //                   </Form.Item>

        //                   <Form.Item
        //                     label="Field Display Name"
        //                     name={[field.name, "fieldDisplayName"]}
        //                     rules={[
        //                       {
        //                         required: true,
        //                         message: "Please input Field Display Name!",
        //                       },
        //                     ]}
        //                   >
        //                     <Input />
        //                   </Form.Item>

        //                   <Form.Item
        //                     label="Mandatory"
        //                     name={[field.name, "fieldMandatory"]}
        //                     rules={[
        //                       {
        //                         required: true,
        //                         message: "Please input Field Mandatory!",
        //                       },
        //                     ]}
        //                   >
        //                     <Input />
        //                   </Form.Item>

        //                   <Form.Item
        //                     label="Max Length"
        //                     name={[field.name, "fieldMaxLength"]}
        //                     rules={[
        //                       {
        //                         required: true,
        //                         message: "Please input Field Max Length!",
        //                       },
        //                     ]}
        //                   >
        //                     <Input />
        //                   </Form.Item>

        //                   <Form.Item
        //                     label="Min Length"
        //                     name={[field.name, "fieldMinLength"]}
        //                     rules={[
        //                       {
        //                         required: true,
        //                         message: "Please input Field Min Length!",
        //                       },
        //                     ]}
        //                   >
        //                     <Input />
        //                   </Form.Item>
        //                 </Col>
        //                 <Col span={12}>
        //                   <Card>
        //                     <h4>Constraint</h4>
        //                     <Form.Item
        //                       label="Accept Alphabet"
        //                       // name={`fieldConstraintAcceptAlphabet-${field?.fieldName}`}
        //                       name={[
        //                         field.name,
        //                         `fieldConstraintAcceptAlphabet`,
        //                       ]}
        //                       rules={[
        //                         {
        //                           required: true,
        //                           message:
        //                             "Please input Field Accept Alphabet Constraint!",
        //                         },
        //                       ]}
        //                     >
        //                       <Input style={{ fontSize: "1.05rem" }} />
        //                     </Form.Item>
        //                     <Form.Item
        //                       label="Accept Number"
        //                       name={[field.name, `fieldConstraintAcceptNumber`]}
        //                       rules={[
        //                         {
        //                           required: true,
        //                           message:
        //                             "Please input Field Accept Number Constraint!",
        //                         },
        //                       ]}
        //                     >
        //                       <Input style={{ fontSize: "1.05rem" }} />
        //                     </Form.Item>
        //                     <Form.Item
        //                       label="Allowed Symbols"
        //                       name={[
        //                         field.name,
        //                         `fieldConstraintAllowedSymbols`,
        //                       ]}
        //                       // name={`fieldConstraintAllowedSymbols-${field?.fieldName}`}
        //                       // rules={[
        //                       //   {
        //                       //     required: true,
        //                       //     message: "Please input title!",
        //                       //   },
        //                       // ]}
        //                     >
        //                       <Input style={{ fontSize: "1.05rem" }} />
        //                     </Form.Item>
        //                     <Form.Item
        //                       label="Format Currency"
        //                       name={[
        //                         field.name,
        //                         `fieldConstraintFormatCurrency`,
        //                       ]}
        //                       // name={`fieldConstraintFormatCurrency-${field?.fieldName}`}
        //                       // rules={[
        //                       //   {
        //                       //     required: true,
        //                       //     message: "Please input title!",
        //                       //   },
        //                       // ]}
        //                     >
        //                       <Input style={{ fontSize: "1.05rem" }} />
        //                     </Form.Item>
        //                     <Form.Item
        //                       label="Selection Dynamic Fields"
        //                       name={[
        //                         field.name,
        //                         `fieldConstraintSelectionDynamicFields`,
        //                       ]}
        //                       // name={`fieldConstraintAllowedSymbols-${field?.fieldName}`}
        //                       // rules={[
        //                       //   {
        //                       //     required: true,
        //                       //     message: "Please input title!",
        //                       //   },
        //                       // ]}
        //                     >
        //                       <Input style={{ fontSize: "1.05rem" }} />
        //                     </Form.Item>
        //                     <Form.Item
        //                       label="Selection Fetch"
        //                       name={[
        //                         field.name,
        //                         `fieldConstraintSelectionFetch`,
        //                       ]}
        //                       // name={`fieldConstraintSelectionFetch-${field?.fieldName}`}
        //                       // rules={[
        //                       //   {
        //                       //     required: true,
        //                       //     message: "Please input title!",
        //                       //   },
        //                       // ]}
        //                     >
        //                       <Input style={{ fontSize: "1.05rem" }} />
        //                     </Form.Item>
        //                   </Card>
        //                 </Col>
        //               </Row>
        //             </Card>
        //           ))}

        //           <Button type="dashed" onClick={() => add()} block>
        //             + Add Field
        //           </Button>
        //         </div>
        //       )}
        //     </Form.List>
        //   </>
        // ),
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

  const onCategoryChange = (value) => {
    console.log("value -> ", value);
    switch (value) {
      case "financial":
        formEdit.setFieldsValue({ category: value });
        getRerender();
        break;
      case "nonFinancial":
        formEdit.setFieldsValue({ category: value });
        getRerender();
        break;
      case "other":
        formEdit.setFieldsValue({ category: value });
        getRerender();
        break;
      default:
    }
  };

  const onCategoryClear = () => {
    formEdit.setFieldValue({ category: null });
    getRerender();
  };

  return (
    <>
      <h2 style={{ marginBottom: "20px" }}>Edit Form</h2>
      <LoadingTransparentPage
        isLoading={stateFormStructure.isLoading || stateEditForm.isLoading}
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
                  <Option value={category?.name}>
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

              {/* <Collapse
                bordered={false}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                style={{
                  background: "white",
                }}
                items={getFieldItems(
                  stateFormStructure?.data?.fields,
                  panelStyle
                )}
              /> */}

              <Form.List name="fields">
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
                              name={[field.name, "fieldIsMandatory"]}
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
                                  "constraint",
                                  `acceptAlphabet`,
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
                                  "constraint",
                                  `acceptNumber`,
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
                                  "constraint",
                                  `allowedSymbols`,
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
                                  "constraint",
                                  `formatCurrency`,
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
                                  "constraint",
                                  `selectionDynamicFields`,
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
                                  "constraint",
                                  `selectionFetch`,
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
              loading={stateEditForm.isLoading}
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
