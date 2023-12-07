import {
  Card,
  Col,
  List,
  Pagination,
  Table,
  Input,
  Row,
  Button,
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined, EditOutlined, FilterOutlined } from "@ant-design/icons";
import { colorTheme } from "../../../../definitions";
import { isSuccesfullRequest } from "../../../../rest-data-provider/briqueTms/utils";
import { useNavigate } from "react-router-dom";
import { useGetList } from "../../../../hooks/data/useGetList";
import { EditFieldDynamicComponent } from "./edit";

const { Search } = Input;

export const ListFieldDynamicComponent = () => {
  const [fieldDynamicList, setFieldDynamicList] = useState([]);
  const navigate = useNavigate();
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  // const [selectedFieldID, setFieldID] = useState(null);
  const [selectedListField, setSelectedListField] = useState(null);
  const [textSearch, setTextSearch] = useState("");

  const { state: stateFieldDynamicList, fire: getFieldDynamicList } =
    useGetList({
      dataProviderName: "briqueTms",
      resource: "field-dynamic/list",
      pagination: {
        current: 1,
        pageSize: 10,
      },
      searching: {
        keyword: textSearch,
      },
      handleResult: () => {
        if (isSuccesfullRequest(stateFieldDynamicList.statusCode)) {
          setFieldDynamicList([...stateFieldDynamicList?.data]);
        }
      },
    });

  const columns = [
    {
      title: "No",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Field",
      dataIndex: "fieldDisplayName",
      key: "fieldDisplayName",
    },
    {
      title: "Form",
      dataIndex: "formDisplayName",
      key: "formDisplayName",
    },
    {
      title: "Category",
      dataIndex: "categoryDisplayName",
      key: "categoryDisplayName",
    },
    {
      title: "Total Selection",
      dataIndex: "selectionTotal",
      key: "selectionTotal",
    },
    {
      dataIndex: "operation",
      key: "operation",
      render: (_, record) => {
        console.log("record -> ", record);
        return (
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              showModalEdit(record);
              // navigate(`/form/edit?id=${record.id}`);
              // router.push({
              //   pathname: "/master/movies/edit",
              //   query: {
              //     id: record.id,
              //     studioId: record.StudioId,
              //   },
              // });
            }}
          />
        );
      },
    },
  ];

  useEffect(() => {
    getFieldDynamicList({
      dataProviderName: "briqueTms",
      resource: "field-dynamic/list",
      pagination: {
        current: 1,
        pageSize: 10,
      },
      searching: {
        keyword: textSearch,
      },
      handleResult: () => {
        if (isSuccesfullRequest(stateFieldDynamicList.statusCode)) {
          setFieldDynamicList([...stateFieldDynamicList?.data]);
        }
      },
    });
  }, []);

  const showModalEdit = (record) => {
    setSelectedListField(record);
    setIsOpenModalEdit(true);
  };
  const handleOkEdit = () => {
    setIsOpenModalEdit(false);
    // handleSubmit();
  };
  const handleCancelEdit = () => {
    setIsOpenModalEdit(false);
  };
  const onSearch = (value) => {
    console.log("onsearch -> ", value);
    getFieldDynamicList({
      dataProviderName: "briqueTms",
      resource: "field-dynamic/list",
      pagination: {
        current: 1,
        pageSize: 10,
      },
      searching: {
        keyword: textSearch,
      },
      handleResult: () => {
        if (isSuccesfullRequest(stateFieldDynamicList.statusCode)) {
          setFieldDynamicList([...stateFieldDynamicList?.data]);
        }
      },
    });
  };

  return (
    <>
      <Row>
        <Col span={18}>
          <h2 style={{ marginBottom: "25px" }}>Field Dynamic</h2>
        </Col>
        <Col span={6} style={{ textAlign: "end" }}>
          {/* <Button
            icon={<PlusOutlined />}
            type="primary"
            style={{
              width: "100px",
              height: "35px",
              backgroundColor: colorTheme.Background.buttonPositive["light"],
            }}
            onClick={() => {
              // navigate("/form/create");
              // router.push({
              //   pathname: "/master/movies/create",
              // });
            }}
          >
            Add
          </Button> */}
        </Col>
      </Row>
      <Row style={{ marginBottom: "30px" }}>
        <Col span={8}>
          {/* <Button
            icon={<PlusOutlined />}
            type="primary"
            style={{
              width: "43px",
              height: "43px",
              backgroundColor: colorTheme.Background.buttonPositive["light"],
            }}
            shape={"circle"}
            onClick={() => {
              // navigate("/form/create");
              // router.push({
              //   pathname: "/master/movies/create",
              // });
            }}
          /> */}
        </Col>
        <Col span={8} />
        <Col span={8} style={{ alignItems: "end" }}>
          <Row gutter={10}>
            <Col span={20}>
              <Search
                placeholder="cari display name field, display name form, atau display name category form"
                // allowClear
                onChange={(e) => {
                  console.log("value on change -> ", e.target.value);
                  setTextSearch(e.target.value);
                }}
                onSearch={onSearch}
              />
            </Col>
            <Col span={2}>
              <Button
                icon={<FilterOutlined />}
                type="primary"
                // shape="circle"
                style={{
                  backgroundColor:
                    colorTheme.Background.buttonPositive["light"],
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Table
        dataSource={fieldDynamicList}
        columns={columns}
        loading={stateFieldDynamicList.isLoading}
        pagination={{
          pfullnameSize: stateFieldDynamicList?.perPage, // Number of items per pfullname
          total: stateFieldDynamicList?.totalAllData, // Total number of items
          showSizeChanger: true, // Show option to change pfullname size
          pfullnameSizeOptions: ["10", "20", "30"], // Pfullname size options
          current: parseInt(stateFieldDynamicList?.page),
          onChange: (page, pageSize) => {
            getFieldDynamicList({
              dataProviderName: "briqueTms",
              resource: "field-dynamic/list",
              pagination: {
                current: page,
                pageSize: pageSize,
              },
              searching: {
                keyword: textSearch,
              },
              handleResult: () => {
                if (isSuccesfullRequest(stateFieldDynamicList.statusCode)) {
                  setFieldDynamicList([...stateFieldDynamicList?.data]);
                }
              },
            });
          },
          // onShowSizeChange: (current, size) => {
          //   console.log("current -> ", current);
          //   console.log("size -> ", size);
          // }
        }}
        scroll={{ y: `calc(100vh - 400px)` }}
      />
      <Modal
        open={isOpenModalEdit}
        title="Edit Field Dynamic"
        width={800}
        // className="text-danger"
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        // onOk={handleOkEdit}
        onCancel={handleCancelEdit}
        // okText={translations.yesContinue}
        // cancelText={translations.cancel}
        centered
        bodyStyle={{
          padding: "20px",
          paddingBottom: "0px",
          marginBottom: "20px",
        }}
      >
        <EditFieldDynamicComponent selectedListField={selectedListField} />
      </Modal>
    </>
  );
};
