import React, { useEffect, useState } from "react";
import { useGet } from "../../../../hooks/data/useGet";
import { formStructureDum } from "../../../../data-dummy/formStructure";
import { notAllowedAlphabetRegex } from "../../../../regex";
import { wordingRupiah } from "../../../../helper/converter";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Tag,
  Typography,
} from "antd";
import { SaveOutlined, SendOutlined } from "@ant-design/icons";
import { LoadingTransparentPage } from "../../LoadingTransparentPage";
import dayjs from "dayjs";
import { isSuccesfullRequest } from "../../../../rest-data-provider/briqueTms/utils";
import { useLocation } from "react-router-dom";

const { Option } = Select;
const { Title } = Typography;

export const ShowFormComponent = () => {
  const location = useLocation();
  const formId = new URLSearchParams(location.search).get("id");
  const [formStructure, setFormStructure] = useState([]);
  const [form] = Form.useForm();
  const { fire: getFormStructure, state: stateFormStructure } = useGet({
    dataProviderName: "briqueTms",
    resource: "client/formStructure",
    query: { formId },
    handleResult: () => {},
  });

  useEffect(() => {
    getFormStructure({
      dataProviderName: "briqueTms",
      resource: "client/formStructure",
      query: { formId },
      handleResult: () => {
        if (isSuccesfullRequest(stateFormStructure?.statusCode)) {
          setFormStructure([...stateFormStructure?.data?.fields]);
        }
      },
    });

    //dummy
    // const indexCurrentForm =
    //   briqueModuleRedux?.formSubmissionList?.listForm?.findIndex((form) => {
    //     return form?.id == id;
    //   });
    // form.setFieldsValue({
    //   ...briqueModuleRedux?.formSubmissionList?.listForm[indexCurrentForm]
    //     ?.form,
    // });
    // setFormStructure([...formStructureDum?.fields]);
  }, []);

  const isHaveMinLength = (length) => {
    if (length > 0) {
      return true;
    }
    return false;
  };

  const isHaveMaxLength = (length) => {
    if (length > 0) {
      return true;
    }
    return false;
  };

  const generateFieldForm = (fieldStructure) => {
    const fieldType = fieldStructure?.fieldType;
    if (fieldType == "text") {
      return (
        <Form.Item
          label={fieldStructure?.fieldDisplayName}
          name={fieldStructure?.fieldName}
          validateTrigger="onChange"
          validateStatus="tes"
          {...(!fieldStructure?.constraint?.formatCurrency && {
            rules: [
              {
                type: "string",
                ...(isHaveMaxLength(fieldStructure?.maxLength) && {
                  max: fieldStructure?.maxLength,
                }),
                message: () => {
                  return `Maximal input harus ${fieldStructure?.maxLength} karakter`;
                },
              },
              {
                ...(isHaveMinLength(fieldStructure?.minLength) && {
                  min: fieldStructure?.minLength,
                }),
                message: `Minimal input harus ${fieldStructure?.minLength} karakter`,
              },
              {
                required: fieldStructure?.isMandatory ? true : false,
                message: `Masukkan ${fieldStructure?.fieldDisplayName}!`,
              },
              {
                ...(!fieldStructure?.constraint?.acceptNumber && {
                  pattern: new RegExp(notAllowedAlphabetRegex()),
                }),
                message: "input harus alphabet",
              },
              // {
              //   ...(!fieldStructure?.constraint?.acceptAlphabet && {
              //     pattern: new RegExp(notAllowedAlphabetRegex()),
              //   }),
              //   message: "input harus angka",
              // },
              {
                validator: async (rule, value, callback) => {
                  try {
                    if (!fieldStructure?.constraint?.acceptAlphabet) {
                      if (/\D/g.test(value)) {
                        return Promise.reject(`input harus angka`);
                      }
                    }
                  } catch (err) {
                    console.log(err);
                    callback(err);
                  }
                },
              },
            ],
          })}
          {...(fieldStructure?.constraint?.formatCurrency && {
            rules: [
              {
                validator: async (rule, value, callback) => {
                  try {
                    if (isHaveMinLength(fieldStructure?.minLength)) {
                      return Promise.reject(
                        `Minimal input harus ${fieldStructure?.minLength} karakter`
                      );
                    }
                    if (isHaveMaxLength(fieldStructure?.maxLength)) {
                      if (value) {
                        if (
                          value.toString().length > fieldStructure?.maxLength
                        ) {
                          return Promise.reject(
                            `Maximal input harus ${fieldStructure?.maxLength} karakter`
                          );
                        }
                      }
                      // return Promise.reject(
                      //   `Maximal input harus ${fieldStructure?.maxLength} karakter`
                      // );
                    }
                    if (fieldStructure?.isMandatory) {
                      console.log("value mandatory -> ", value);
                      if (!value) {
                        return Promise.reject(
                          `Masukkan ${fieldStructure?.fieldDisplayName}!`
                        );
                      }
                    }
                    if (!fieldStructure?.constraint?.acceptNumber) {
                    }
                  } catch (err) {
                    console.log("error -> ", err);
                    callback(err);
                  }
                },
              },
            ],
          })}
        >
          {fieldStructure?.constraint?.formatCurrency && (
            <InputNumber
              placeholder={`Masukkan ${fieldStructure?.fieldDisplayName}`}
              {...(isHaveMinLength(fieldStructure?.minLength) && {
                minLength: fieldStructure?.minLength,
              })}
              // {...(isHaveMaxLength(fieldStructure?.maxLength) && {
              //   maxLength: fieldStructure?.maxLength + 1,
              // })}
              formatter={(value) =>
                `${value}`
                  // .replace(new RegExp(alphabetRegex()), "")
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onKeyPress={(event) => {
                if (!fieldStructure?.constraint?.acceptAlphabet) {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }
                if (!fieldStructure?.constraint?.acceptNumber) {
                  if (/([0-9])/.test(event.key)) {
                    event.preventDefault();
                  }
                }
              }}
              style={{ width: "100%", height: "50px" }}
              // onInput={(value) => {
              //   console.log("value input number -> ", value);

              //   if (isHaveMaxLength(fieldStructure?.maxLength)) {
              //     if (value.length > fieldStructure?.maxLength) {
              //       setTimeout(() => {
              //         form.setFieldsValue({
              //           [fieldStructure?.fieldName]: value.slice(
              //             0,
              //             value.length - 1
              //           ),
              //         });
              //       }, 500);
              //     }
              //   }
              // }}
              onChange={(value) => {
                const formNameChanged =
                  fieldStructure?.constraint?.allowedSymbols?.split(" ")?.at(0);
                if (value) {
                  form.setFieldsValue({
                    [formNameChanged]: wordingRupiah(value),
                  });
                } else {
                  form.setFieldsValue({
                    [formNameChanged]: wordingRupiah(0),
                  });
                }

                console.log("value input number -> ", value);

                if (isHaveMaxLength(fieldStructure?.maxLength)) {
                  if (value) {
                    if (value.toString().length > fieldStructure?.maxLength) {
                      setTimeout(() => {
                        form.setFieldsValue({
                          [fieldStructure?.fieldName]: value
                            .toString()
                            .slice(
                              0,
                              value.toString().length -
                                (value.toString().length -
                                  fieldStructure?.maxLength)
                            ),
                        });
                      }, 500);
                    }
                  }
                }
              }}
            />
          )}
          {!fieldStructure?.constraint?.formatCurrency && (
            <Input
              // style={authInputStyles}
              placeholder={`Masukkan ${fieldStructure?.fieldDisplayName}`}
              {...(isHaveMinLength(fieldStructure?.minLength) && {
                minLength: fieldStructure?.minLength,
              })}
              {...(isHaveMaxLength(fieldStructure?.maxLength) && {
                maxLength: fieldStructure?.maxLength + 1,
              })}
              style={{ height: "50px", backgroundColor: "white" }}
              onChange={(e) => {
                if (isHaveMaxLength(fieldStructure?.maxLength)) {
                  if (e.target.value.length > 0) {
                    if (e.target.value.length > fieldStructure?.maxLength) {
                      setTimeout(() => {
                        form.setFieldsValue({
                          [fieldStructure?.fieldName]: e.target.value.slice(
                            0,
                            e.target.value.toString().length -
                              (e.target.value.toString().length -
                                fieldStructure?.maxLength)
                          ),
                        });
                      }, 500);
                    }
                  }
                }

                if (!fieldStructure?.constraint?.acceptAlphabet) {
                  if (/\D/g.test(e.target.value)) {
                    setTimeout(() => {
                      form.setFieldsValue({
                        [fieldStructure?.fieldName]: e.target.value.replace(
                          /\D/g,
                          ""
                        ),
                      });
                    }, 500);
                  }
                }

                if (!fieldStructure?.constraint?.acceptNumber) {
                  if (/\d/g.test(e.target.value)) {
                    setTimeout(() => {
                      form.setFieldsValue({
                        [fieldStructure?.fieldName]: e.target.value.replace(
                          /\d/g,
                          ""
                        ),
                      });
                    }, 500);
                  }
                }
              }}
              onKeyPress={(event) => {
                // if (!fieldStructure?.constraint?.acceptAlphabet) {
                //   if (!/[0-9]/.test(event.key)) {
                //     event.preventDefault();
                //   }
                // }
                // if (!fieldStructure?.constraint?.acceptNumber) {
                //   if (/([0-9])/.test(event.key)) {
                //     event.preventDefault();
                //   }
                // }
                if (isHaveMaxLength(fieldStructure?.maxLength)) {
                }
              }}
            />
          )}
          {/* <Input
            // style={authInputStyles}
            placeholder={`Masukkan ${fieldStructure?.fieldDisplayName}`}
            {...(isHaveMinLength(fieldStructure?.minLength) && {
              minLength: fieldStructure?.minLength,
            })}
            {...(isHaveMaxLength(fieldStructure?.maxLength) && {
              maxLength: fieldStructure?.maxLength,
            })}
          /> */}
        </Form.Item>
      );
    }

    if (fieldType == "selection") {
      return (
        <Form.Item
          label={fieldStructure?.fieldDisplayName}
          name={fieldStructure?.fieldName}
          // initialValue="rb@gmail.com"
          rules={[
            {
              required: fieldStructure?.isMandatory ? true : false,
              message: `Masukkan ${fieldStructure?.fieldDisplayName}!`,
              type: "string",
            },
          ]}
        >
          <Select
            placeholder={`-- Pilih ${fieldStructure?.fieldDisplayName} --`}
            // showSearch
            onChange={(value) => {
              if (fieldStructure?.constraint?.selectionDynamicFields) {
                const currentSelection = fieldStructure?.selections?.filter(
                  (selection) => {
                    return selection.selection == value;
                  }
                );
                if (currentSelection?.length > 0) {
                  formStructure?.map((field) => {
                    field.isHide = false;
                  });
                  currentSelection
                    ?.at(0)
                    ?.dynamicFields?.map((dynamicField) => {
                      const indexDynamincField = formStructure?.findIndex(
                        (formStructure) => {
                          return formStructure.fieldName == dynamicField?.name;
                        }
                      );
                      formStructure.at(indexDynamincField).isHide =
                        dynamicField.value == "hide" ? true : false;
                    });
                  setFormStructure([...formStructure]);
                }
              }
            }}
            allowClear
          >
            {fieldStructure?.selections?.map((selection) => {
              return (
                <Option value={selection?.selection}>
                  {selection?.displayName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      );
    }

    if (fieldType == "terbilang") {
      return (
        <Form.Item
          label={fieldStructure?.fieldDisplayName}
          name={fieldStructure?.fieldName}
          // initialValue="rb@gmail.com"
          rules={[
            {
              required: fieldStructure?.isMandatory ? true : false,
              message: `Masukkan ${fieldStructure?.fieldDisplayName}!`,
              type: "string",
            },
          ]}
        >
          <Input
            // style={authInputStyles}
            placeholder={`Masukkan ${fieldStructure?.fieldDisplayName}`}
            readOnly
          />
        </Form.Item>
      );
    }

    if (fieldType == "datePicker") {
      //allowedsymbols {min: value, max: value}
      const allowedSymbols = fieldStructure?.constraint?.allowedSymbols
        ?.split(",")
        ?.map((symbol) => {
          const keyValSymbol = symbol.split("=");
          return {
            [keyValSymbol?.at(0)]: keyValSymbol?.at(1),
          };
        });

      const dateRangeDisabled = (rangeType, currentDate) => {
        let customDate = dayjs().format("YYYY-MM-DD");
        switch (rangeType) {
          case "beforeToday":
            if (currentDate) {
              return currentDate > dayjs(customDate, "YYYY-MM-DD");
            }
          default:
            return currentDate && currentDate > dayjs(customDate, "YYYY-MM-DD");
        }
      };

      const dateRangeSelection = (allowedSymbols) => {
        if (allowedSymbols?.min == "no" && allowedSymbols?.max == "today") {
          return "beforeToday";
        }
      };

      return (
        <Form.Item
          label={fieldStructure?.fieldDisplayName}
          name={fieldStructure?.fieldName}
          rules={[
            {
              required: fieldStructure?.isMandatory ? true : false,
              message: `Masukkan ${fieldStructure?.fieldDisplayName}!`,
            },
          ]}
          getValueFromEvent={(e) => e?.format("YYYY-MM-DD")}
          getValueProps={(e) => ({
            value: e ? dayjs(e) : "",
          })}
        >
          <DatePicker
            style={{ width: "100%" }}
            format={"YYYY-MM-DD"}
            disabledDate={(current) =>
              dateRangeDisabled(dateRangeSelection(allowedSymbols), current)
            }
          />
        </Form.Item>
      );
    }

    return `field type ${fieldStructure?.fieldName} (${fieldStructure?.fieldType}) is not found`;
  };
  return (
    <div style={{ padding: "30px 50px" }}>
      <Tag
        color="white"
        style={{
          borderRadius: "5px",
          fontSize: "20px",
          color: "#1781D6",
          padding: "8px 15px",
          paddingRight: "28px",
          float: "right",
          marginRight: "-88px",
        }}
      >
        <text>Preview</text>
      </Tag>
      <h2 style={{ color: "#1781D6", fontSize: "24px", marginBottom: "30px" }}>
        {stateFormStructure?.data?.formDisplayName ?? " - "}
      </h2>
      {/* <Title level={3}>{formStructureDum?.formDisplayName}</Title> */}
      {/* <p>{`id : ${id}`}</p>
  <p>{`formName : ${formName}`}</p> */}
      <Card
        style={{
          backgroundColor: "white",
          padding: "15px",
          height: "80vh",
          overflow: "auto",
          borderRadius: 8,
        }}
      >
        <LoadingTransparentPage isLoading={false}>
          <Row>
            <Col span={22}>
              <Form
                form={form}
                layout="vertical"
                name="basic"
                initialValues={{ remember: true }}
                // onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                onFieldsChange={(value) => {}}
                onValuesChange={(value) => {}}
                autoComplete="off"
              >
                {formStructure?.map((fieldStructure) => {
                  // fieldStructure.isHide = false;
                  return !fieldStructure?.isHide
                    ? generateFieldForm(fieldStructure)
                    : null;
                  // return generateFieldForm(fieldStructure);
                })}
                {/* <Form.Item style={{ textAlign: "center" }}>
            <Button
              type="primary"
              size="large"
              shape="round"
              htmlType="submit"
            // loading={stateLogin.isLoading}
            // style={btnCinorxPrimaryStyles}
            >
              submit
            </Button>
          </Form.Item> */}
              </Form>
            </Col>
          </Row>
        </LoadingTransparentPage>
      </Card>
    </div>
  );
};
