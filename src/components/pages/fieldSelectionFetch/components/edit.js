import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Row,
  Select,
  Table,
  Typography,
} from "antd";
import { TextInformation } from "../../../utils/text-information";
import { useNotification } from "../../../../hooks/utility";
import { useGet } from "../../../../hooks/data/useGet";
import { isSuccesfullRequest } from "../../../../rest-data-provider/briqueTms/utils";
import { usePost } from "../../../../hooks/data/usePost";
import { authProvider } from "../../../../authProvider";
import { encryptContent } from "../../../../crypto";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { colorTheme } from "../../../../definitions";

const { Title } = Typography;
const { Option } = Select;

export const EditFieldSelectinFetchComponent = ({ selectedListField }) => {
  const identity = authProvider.getIdentity();
  const navigate = useNavigate();
  const defaultTargetForm = JSON.stringify({
    formID: selectedListField?.formID,
    name: selectedListField?.formName,
    displayName: selectedListField?.formDisplayName,
  });
  const [formEdit] = Form.useForm();
  const [targetFormOptions, setTargetFormOptions] = useState([]);
  const [targetFieldOptions, setTargetFieldOptions] = useState([]);
  const [selectionOptions, setSelectionOptions] = useState([]);
  const [selectedSelection, setSelectedSelection] = useState(null);
  const [targetFetch, setTargetFetch] = useState({
    formID: null,
    fieldID: null,
  });
  const [dataTableEdit, setDataTableEdit] = useState([]);

  const { openNotification } = useNotification();

  //   selectedListField?.fieldID;

  const { state: stateSelection, fire: getSelection } = useGet({
    dataProviderName: "briqueTms",
    resource: "field-selection-fetch/selections-selection-fetch-field",
    query: {
      selectionFetchFieldID: selectedListField?.fieldID,
    },
    handleResult: () => {
      if (isSuccesfullRequest(stateSelection?.statusCode)) {
        setSelectionOptions([...stateSelection?.data?.selections]);
      }
    },
  });

  const { state: stateTargetFormOptions, fire: getTargetFormOptions } = useGet({
    dataProviderName: "briqueTms",
    resource: "field-selection-fetch/forms-exclude",
    query: {
      excludeFormID: selectedListField?.formID,
    },
    handleResult: () => {
      if (isSuccesfullRequest(stateTargetFormOptions?.statusCode)) {
        setTargetFormOptions([...stateTargetFormOptions?.data?.forms]);
      }
    },
  });

  const { state: stateTargetFieldOptions, fire: getTargetFieldOptions } =
    useGet({
      dataProviderName: "briqueTms",
      resource: "field-selection-fetch/fields-selection-by-form",
      query: {
        formID: targetFetch?.formID,
        sourceFieldID: selectedListField?.fieldID,
      },
      handleResult: () => {
        if (isSuccesfullRequest(stateTargetFieldOptions?.statusCode)) {
          setTargetFieldOptions([...stateTargetFieldOptions?.data?.fields]);
        }
      },
    });

  const { state: stateSelectionLink, fire: getSelectionLink } = useGet({
    dataProviderName: "briqueTms",
    resource: "field-selection-fetch/linked-status",
    query: {
      originFieldSelectionID: 110,
      targetFieldID: 105,
    },
    handleResult: () => {
      if (isSuccesfullRequest(stateSelectionLink?.statusCode)) {
        console.log("data selection link -> ", stateSelectionLink?.data);
        setDataTableEdit([...stateSelectionLink?.data?.selections]);
      }
    },
  });

  const { state: stateFieldsHiddenStatus, fire: getFieldsHiddenStatus } =
    useGet({
      dataProviderName: "briqueTms",
      resource: "field-dynamic/field-hidden-status",
      query: {
        structureID: 150,
        fieldID: 106,
        selectionID: 24,
      },
      handleResult: () => {
        if (isSuccesfullRequest(stateFieldsHiddenStatus?.statusCode)) {
          console.log(
            "data field hidden status -> ",
            stateFieldsHiddenStatus?.data
          );
          setDataTableEdit([...stateFieldsHiddenStatus?.data?.fields]);
        }
      },
    });

  const { state: updateSelectionFetchState, fire: updateSelectionFetch } =
    usePost({
      dataProviderName: "briqueTms",
      resource: "field-selection-fetch/update-selection-fetch-field",
      variables: "asdasdasd",
      meta: { headers: { "Content-Type": "text/plain" } },
      handleResult: () => {
        if (isSuccesfullRequest(updateSelectionFetchState?.statusCode)) {
          console.log("success");
        }
      },
    });

  useEffect(() => {
    formEdit.resetFields();
    setDataTableEdit([]);
    getSelection({
      dataProviderName: "briqueTms",
      resource: "field-selection-fetch/selections-selection-fetch-field",
      query: {
        selectionFetchFieldID: selectedListField?.fieldID,
      },
      handleResult: () => {
        if (isSuccesfullRequest(stateSelection?.statusCode)) {
          console.log("data selection -> ", stateSelection?.data);
          setSelectionOptions([...stateSelection?.data?.selections]);
        }
      },
    });
    getTargetFormOptions({
      dataProviderName: "briqueTms",
      resource: "field-selection-fetch/forms-exclude",
      query: {
        excludeFormID: selectedListField?.formID,
      },
      handleResult: () => {
        if (isSuccesfullRequest(stateTargetFormOptions?.statusCode)) {
          setTargetFormOptions([...stateTargetFormOptions?.data?.forms]);
          console.log("selected list field -> ", selectedListField);
          formEdit.setFieldValue("targetForm", defaultTargetForm);
          onTargetFormChange(defaultTargetForm);
        }
      },
    });
  }, [selectedListField]);

  useEffect(() => {
    if (targetFetch?.formID) {
      console.log("source field id -> ", selectedListField?.fieldID);
      getTargetFieldOptions({
        dataProviderName: "briqueTms",
        resource: "field-selection-fetch/fields-selection-by-form",
        query: {
          formID: targetFetch?.formID,
          sourceFieldID: selectedListField?.fieldID,
        },
        handleResult: () => {
          if (isSuccesfullRequest(stateTargetFieldOptions?.statusCode)) {
            setTargetFieldOptions([...stateTargetFieldOptions?.data?.fields]);
          }
        },
      });
    }
  }, [targetFetch.formID]);

  useEffect(() => {
    if (targetFetch?.fieldID && formEdit?.getFieldValue("selection")) {
      const currentSelection = JSON.parse(formEdit?.getFieldValue("selection"));
      console.log("current selection -> ", currentSelection);
      getSelectionLink({
        dataProviderName: "briqueTms",
        resource: "field-selection-fetch/linked-status",
        query: {
          originFieldSelectionID: currentSelection?.selectionID,
          targetFieldID: targetFetch?.fieldID,
        },
        handleResult: () => {
          if (isSuccesfullRequest(stateSelectionLink?.statusCode)) {
            console.log("data selection link -> ", stateSelectionLink?.data);
            setDataTableEdit([...stateSelectionLink?.data?.selections]);
          }
        },
      });
    }
  }, [targetFetch.fieldID]);

  console.log("selection list field -> ", selectedListField);

  const onSelectionChange = (value) => {
    console.log("value -> ", value);
    const selectedSelection = JSON.parse(value);
    if (targetFetch?.fieldID) {
      getSelectionLink({
        dataProviderName: "briqueTms",
        resource: "field-selection-fetch/linked-status",
        query: {
          originFieldSelectionID: selectedSelection?.selectionID,
          targetFieldID: targetFetch?.fieldID,
        },
        handleResult: () => {
          if (isSuccesfullRequest(stateSelectionLink?.statusCode)) {
            console.log("data selection link -> ", stateSelectionLink?.data);
            setDataTableEdit([...stateSelectionLink?.data?.selections]);
          }
        },
      });
    }
  };
  const onTargetFormChange = (value) => {
    console.log("value -> ", value);
    const selectedTargetForm = JSON.parse(value);
    setTargetFetch({ ...targetFetch, formID: selectedTargetForm?.formID });
    console.log("selected target form -> ", selectedTargetForm);
  };
  const onTargetFieldChange = (value) => {
    console.log("value -> ", value);
    const selectedTargetField = JSON.parse(value);
    setTargetFetch({ ...targetFetch, fieldID: selectedTargetField?.fieldID });
    console.log("selected target field -> ", selectedTargetField);
  };
  const handleSave = (value) => {
    const selectedSelection = JSON.parse(value?.selection);
    console.log("selected Selection -> ", selectedSelection);
    const selectionFetchUpdate = dataTableEdit?.map((data) => {
      console.log("data table -> ", data);
      return {
        originFormFieldSelectionID: selectedSelection?.selectionID,
        targetFieldID: data?.formFieldID,
        targetFormFieldSelectionID: data?.formFieldSelectionId,
        linked: data?.linked,
      };
    });

    const payloadSend = {
      selectionFields: [...selectionFetchUpdate],
    };

    const data = {
      clientKey: identity?.clientKey,
      sharedKey: identity?.sharedKey,
      payload: { ...payloadSend },
    };
    console.log("data save -> ", data);

    Swal.fire({
      title: "Saving...",
      html: "Please wait...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    updateSelectionFetch({
      dataProviderName: "briqueTms",
      resource: "field-selection-fetch/update-selection-fetch-field",
      variables: encryptContent(data),
      meta: { headers: { "Content-Type": "text/plain" } },
      handleResult: () => {
        if (isSuccesfullRequest(updateSelectionFetchState?.statusCode)) {
          console.log("success");
          Swal.fire({
            title: "Success!",
            text: "successfully update selection fetch field!",
            icon: "success",
          }).then((result) => {
            Swal.hideLoading();
            // navigate("/field-dynamic/list", { replace: true });
          });
        } else {
          Swal.fire({
            title: "Oops something went wrong!",
            text: "failed to update selection fetch field",
            icon: "error",
          }).then((result) => {
            Swal.hideLoading();
          });
        }
      },
    });
  };
  const onFinishFailed = () => {
    openNotification({
      type: "error",
      title: "Salah input",
      description: "Periksa kembali input anda",
    });
  };

  const columnsTableEdit = [
    {
      title: "Link",
      dataIndex: "linked",
      key: "linked",
      width: "10%",
      align: "center",
      render: (text, record) => {
        return (
          <Checkbox
            checked={record?.linked}
            // value={}
            onChange={(e) => {
              setDataTableEdit([...dataTableEdit]);
            }}
            onClick={(e) => {
              record.linked ? (record.linked = false) : (record.linked = true);
            }}
          />
        );
      },
    },
    {
      title: "Selection",
      dataIndex: "selection",
      key: "selection",
      align: "center",
    },
    {
      title: "Display Name",
      dataIndex: "displayname",
      key: "displayname",
      align: "center",
    },
  ];

  console.log("targer fetch -> ", targetFetch);
  // console.log("data table edit -> ", dataTableEdit);

  return (
    <Form
      form={formEdit}
      layout="vertical"
      onFinish={handleSave}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      //   style={formStyle}
      name="form_edit"
      onValuesChange={() => {
        console.log("values -> ", formEdit.getFieldsValue());
      }}
    >
      <Row>
        <Col span={24}>
          <TextInformation
            keyy={"Form Name"}
            value={selectedListField?.formDisplayName}
          />
          <TextInformation
            keyy={"Field Name"}
            value={selectedListField?.fieldDisplayName}
          />
          <Form.Item label="Selection" name="selection">
            <Select
              disabled={stateSelection?.isLoading}
              // style={{ width: "100%" }}
              placeholder="-- Selection --"
              onChange={(value) => {
                onSelectionChange(value);
              }}
              // onClear={onCategoryClear}
              // defaultValue={}
            >
              {selectionOptions.map((select) => {
                console.log("select -> ", select);
                return (
                  <Option value={JSON.stringify(select)}>
                    {select?.selectionDisplayName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="Target Form" name="targetForm">
            <Select
              // disabled={stateTargetFormOptions?.isLoading}
              disabled={true}
              // style={{ width: "100%" }}
              // onSelect={(value) => {
              //   onTargetFormChange(value);
              // }}
              placeholder="-- Form Target --"
              onChange={(value) => {
                onTargetFormChange(value);
              }}
              showSearch
            >
              {targetFormOptions.map((select) => {
                console.log("selecttt -> ", select);
                return (
                  <Option value={JSON.stringify(select)}>
                    {select?.displayName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="Target Field" name="targetField">
            <Select
              // style={{ width: "100%" }}
              disabled={stateTargetFieldOptions?.isLoading}
              placeholder="-- Fields Target --"
              onChange={(value) => {
                onTargetFieldChange(value);
              }}
              showSearch
            >
              {targetFieldOptions.map((select) => {
                console.log("select -> ", select);
                return (
                  <Option value={JSON.stringify(select)}>
                    {select?.fieldDisplayName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ marginTop: "5px" }}>
        <Col span={24}>
          <Card>
            <Row>
              <Col span={24}>
                <Title level={5}>Selections</Title>
              </Col>
            </Row>
            <Row style={{ marginTop: "5px" }}>
              <Col span={24}>
                <Table
                  columns={columnsTableEdit}
                  dataSource={dataTableEdit}
                  bordered
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row justify={"end"} style={{ marginTop: "15px" }}>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Row>
    </Form>
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
