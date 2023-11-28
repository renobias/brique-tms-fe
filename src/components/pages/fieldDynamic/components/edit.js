import React, { useEffect, useState } from "react";
import {
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

const { Title } = Typography;
const { Option } = Select;

export const EditFieldDynamicComponent = ({ selectedListField }) => {
  const [formEdit] = Form.useForm();
  const [selectionOptions, setSelectionOptions] = useState([]);
  const [dataTableEdit, setDataTableEdit] = useState([]);

  const { openNotification } = useNotification();

  const { state: stateSelection, fire: getSelection } = useGet({
    dataProviderName: "briqueTms",
    resource: "field-dynamic/selection-dynamic-field",
    query: {
      dynamicFieldID: selectedListField?.formFieldID,
    },
    handleResult: () => {
      if (isSuccesfullRequest(stateSelection?.statusCode)) {
        setSelectionOptions([...stateSelection?.data?.selections]);
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

  useEffect(() => {
    formEdit.resetFields();
    setDataTableEdit([]);
    getSelection({
      dataProviderName: "briqueTms",
      resource: "field-dynamic/selection-dynamic-field",
      query: {
        dynamicFieldID: selectedListField?.formFieldID,
      },
      handleResult: () => {
        if (isSuccesfullRequest(stateSelection?.statusCode)) {
          console.log("data selection -> ", stateSelection?.data);
          setSelectionOptions([...stateSelection?.data?.selections]);
        }
      },
    });
  }, [selectedListField]);

  const onSelectionChange = (value) => {
    console.log("value -> ", value);
    const selectedSelection = JSON.parse(value);
    getFieldsHiddenStatus({
      dataProviderName: "briqueTms",
      resource: "field-dynamic/field-hidden-status",
      query: {
        structureID: selectedSelection?.formID,
        fieldID: selectedSelection?.formFieldID,
        selectionID: selectedSelection?.selectionID,
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
  };
  const onFinish = () => {};
  const onFinishFailed = () => {
    openNotification({
      type: "error",
      title: "Salah input",
      description: "Periksa kembali input anda",
    });
  };

  const columnsTableEdit = [
    {
      title: "Hide",
      dataIndex: "hidden",
      key: "hidden",
      width: "10%",
      align: "center",
      render: (text, record) => {
        return (
          <Checkbox
            checked={record?.hidden}
            // value={}
            onChange={(e) => {
              setDataTableEdit([...dataTableEdit]);
            }}
            onClick={(e) => {
              record.hiddenField
                ? (record.hiddenField = false)
                : (record.hiddenField = true);
            }}
          />
        );
      },
    },
    {
      title: "Field",
      dataIndex: "fieldName",
      key: "fieldName",
      align: "center",
    },
  ];

  // console.log("data table edit -> ", dataTableEdit);

  return (
    <Form
      form={formEdit}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      // style={formStyle}
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
        </Col>
      </Row>
      <Row style={{ marginTop: "5px" }}>
        <Col span={24}>
          <Card>
            <Row>
              <Col span={24}>
                <Title level={5}>Form Fields</Title>
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
    </Form>
  );
};
