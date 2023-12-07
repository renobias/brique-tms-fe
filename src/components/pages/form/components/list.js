import {
  Card,
  Col,
  List,
  Pagination,
  Table,
  Input,
  Row,
  Button,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { colorTheme } from "../../../../definitions";
import { isSuccesfullRequest } from "../../../../rest-data-provider/briqueTms/utils";
import { useNavigate } from "react-router-dom";
import { useGetList } from "../../../../hooks/data/useGetList";

const { Search } = Input;

export const ListFormComponent = () => {
  const [formStructureList, setFormStructureList] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const navigate = useNavigate();

  const { state: stateFormStructureList, fire: getFormList } = useGetList({
    dataProviderName: "briqueTms",
    resource: "form/list",
    pagination: {
      current: 1,
      pageSize: 10,
    },
    searching: {
      keyword: textSearch,
    },
    handleResult: () => {
      if (isSuccesfullRequest(stateFormStructureList.statusCode)) {
        setFormStructureList([...stateFormStructureList?.data]);
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
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Display Name",
      dataIndex: "displayname",
      key: "displayname",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      dataIndex: "operation",
      key: "operation",
      render: (_, record) => {
        return (
          <>
            <Space>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => {
                  navigate(`/form/edit?id=${record.id}`);
                  // router.push({
                  //   pathname: "/master/movies/edit",
                  //   query: {
                  //     id: record.id,
                  //     studioId: record.StudioId,
                  //   },
                  // });
                }}
              />
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => {
                  navigate(`/form/show?id=${record.id}`);
                  // router.push({
                  //   pathname: "/master/movies/edit",
                  //   query: {
                  //     id: record.id,
                  //     studioId: record.StudioId,
                  //   },
                  // });
                }}
              />
            </Space>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getFormList({
      dataProviderName: "briqueTms",
      resource: "form/list",
      pagination: {
        current: 1,
        pageSize: 10,
      },
      searching: {
        keyword: textSearch,
      },
      handleResult: () => {
        if (isSuccesfullRequest(stateFormStructureList.statusCode)) {
          setFormStructureList([...stateFormStructureList?.data]);
        }
      },
    });
  }, []);

  const onSearch = (value) => {
    console.log("onsearch -> ", value);
    getFormList({
      dataProviderName: "briqueTms",
      resource: "form/list",
      pagination: {
        current: 1,
        pageSize: 10,
      },
      searching: {
        keyword: textSearch,
      },
      handleResult: () => {
        if (isSuccesfullRequest(stateFormStructureList.statusCode)) {
          setFormStructureList([...stateFormStructureList?.data]);
        }
      },
    });
  };
  return (
    <>
      <Row>
        <Col span={18}>
          <h2 style={{ marginBottom: "25px" }}>Form</h2>
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
              navigate("/form/create");
              // router.push({
              //   pathname: "/master/movies/create",
              // });
            }}
          /> */}
        </Col>
      </Row>
      <Row style={{ marginBottom: "30px" }}>
        <Col span={8}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            style={{
              width: "43px",
              height: "43px",
              backgroundColor: colorTheme.Background.buttonPositive["light"],
            }}
            size={"large"}
            shape={"circle"}
            onClick={() => {
              navigate("/form/create");
              // router.push({
              //   pathname: "/master/movies/create",
              // });
            }}
          />
        </Col>
        <Col span={8} />
        <Col span={8} style={{ alignItems: "end" }}>
          <Row gutter={10}>
            <Col span={20}>
              <Search
                placeholder="cari nama form, display form, atau category form"
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
        dataSource={formStructureList}
        columns={columns}
        loading={stateFormStructureList.isLoading}
        pagination={{
          pfullnameSize: stateFormStructureList?.perPage, // Number of items per pfullname
          total: stateFormStructureList?.totalAllData, // Total number of items
          showSizeChanger: true, // Show option to change pfullname size
          current: parseInt(stateFormStructureList?.page),
          pfullnameSizeOptions: ["10", "20", "30"], // Pfullname size options
          onChange: (page, pageSize) => {
            getFormList({
              dataProviderName: "briqueTms",
              resource: "form/list",
              pagination: {
                current: page,
                pageSize: pageSize,
              },
              searching: {
                keyword: textSearch,
              },
              handleResult: () => {
                if (isSuccesfullRequest(stateFormStructureList.statusCode)) {
                  setFormStructureList([...stateFormStructureList?.data]);
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
    </>
  );
};
